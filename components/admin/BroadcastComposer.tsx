'use client'
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createBroadcastAction, countSegmentAction } from '@/lib/admin/broadcast-actions'
import { CLUSTER_LABEL_SHORT, LEAD_STATUS_LABEL, LEAD_STATUS_ORDER } from '@/lib/admin/labels'
import type { BroadcastButton, BroadcastMedia, BroadcastSegmentType } from '@/bot/db/schema'

const SEGMENTS: Array<{ v: BroadcastSegmentType; label: string }> = [
  { v: 'all', label: 'Все активные' },
  { v: 'lead_status', label: 'По статусу лида' },
  { v: 'cluster', label: 'По кластеру' },
  { v: 'activity', label: 'По активности' },
  { v: 'ids', label: 'Список ID' },
]

const field = 'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm'

export default function BroadcastComposer() {
  const router = useRouter()
  const [pending, start] = useTransition()

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [parseMode, setParseMode] = useState<'HTML' | 'MarkdownV2' | 'none'>('HTML')
  const [segmentType, setSegmentType] = useState<BroadcastSegmentType>('all')
  const [statusParam, setStatusParam] = useState('new')
  const [clusterParam, setClusterParam] = useState('web')
  const [daysParam, setDaysParam] = useState('30')
  const [idsParam, setIdsParam] = useState('')
  const [buttons, setButtons] = useState<BroadcastButton[]>([])
  const [media, setMedia] = useState<(BroadcastMedia & { name?: string }) | null>(null)
  const [uploading, setUploading] = useState(false)
  const [count, setCount] = useState<number | null>(null)
  const [scheduledAt, setScheduledAt] = useState('')
  const [err, setErr] = useState<string | null>(null)

  const parsedIds = idsParam
    .split(/[\s,;]+/)
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0)

  function segmentParams() {
    switch (segmentType) {
      case 'lead_status':
        return { status: statusParam }
      case 'cluster':
        return { cluster: clusterParam }
      case 'activity':
        return { days: Number(daysParam) || 30 }
      case 'ids':
        return { ids: parsedIds }
      default:
        return {}
    }
  }

  // Live-счётчик получателей
  useEffect(() => {
    let cancelled = false
    setCount(null)
    const t = setTimeout(() => {
      countSegmentAction(segmentType, segmentParams()).then((r) => {
        if (!cancelled) setCount(r.count)
      })
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentType, statusParam, clusterParam, daysParam, idsParam])

  async function onUpload(file: File) {
    setUploading(true)
    setErr(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const j = await res.json()
      if (j.ok) setMedia({ ...j.media, name: j.name })
      else setErr('Загрузка не удалась: ' + (j.error ?? ''))
    } catch {
      setErr('Ошибка загрузки файла')
    } finally {
      setUploading(false)
    }
  }

  function submit(mode: 'draft' | 'now' | 'schedule') {
    setErr(null)
    start(async () => {
      const r = await createBroadcastAction({
        title,
        messageText: text,
        parseMode,
        media: media ? { type: media.type, fileId: media.fileId } : null,
        buttons,
        segmentType,
        segmentParams: segmentParams(),
        mode,
        scheduledAt: mode === 'schedule' ? new Date(scheduledAt).toISOString() : undefined,
      })
      if (r.ok) router.push(`/admin/broadcasts/${r.id}`)
      else setErr(errLabel(r.error))
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs text-white/40">Название (для себя)</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
      </div>

      <div>
        <label className="mb-1 block text-xs text-white/40">Текст сообщения</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className={field} />
        <div className="mt-1 flex items-center justify-between text-[11px] text-white/40">
          <span>{media ? 'для медиа лимит подписи ~1024 симв.' : `${text.length} симв.`}</span>
          <select
            value={parseMode}
            onChange={(e) => setParseMode(e.target.value as typeof parseMode)}
            className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px]"
          >
            <option value="HTML">HTML</option>
            <option value="MarkdownV2">MarkdownV2</option>
            <option value="none">без разметки</option>
          </select>
        </div>
      </div>

      {/* Медиа */}
      <div>
        <label className="mb-1 block text-xs text-white/40">Медиа (необязательно)</label>
        {media ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded bg-white/10 px-2 py-1">
              {media.type}: {media.name ?? media.fileId.slice(0, 12)}
            </span>
            <button onClick={() => setMedia(null)} className="text-rose-300">
              убрать
            </button>
          </div>
        ) : (
          <input
            type="file"
            disabled={uploading}
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
            className="text-xs text-white/60 file:mr-2 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white"
          />
        )}
        {uploading && <p className="mt-1 text-xs text-white/40">Загрузка…</p>}
      </div>

      {/* Кнопки */}
      <div>
        <label className="mb-1 block text-xs text-white/40">Кнопки-ссылки</label>
        <div className="space-y-2">
          {buttons.map((b, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={b.text}
                onChange={(e) =>
                  setButtons(buttons.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))
                }
                placeholder="Текст"
                className={field + ' flex-1'}
              />
              <input
                value={b.url}
                onChange={(e) =>
                  setButtons(buttons.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))
                }
                placeholder="https://…"
                className={field + ' flex-1'}
              />
              <button
                onClick={() => setButtons(buttons.filter((_, j) => j !== i))}
                className="px-2 text-rose-300"
              >
                ✕
              </button>
            </div>
          ))}
          {buttons.length < 5 && (
            <button
              onClick={() => setButtons([...buttons, { text: '', url: '' }])}
              className="text-sm text-indigo-300"
            >
              + кнопка
            </button>
          )}
        </div>
      </div>

      {/* Сегмент */}
      <div>
        <label className="mb-1 block text-xs text-white/40">Аудитория</label>
        <select
          value={segmentType}
          onChange={(e) => setSegmentType(e.target.value as BroadcastSegmentType)}
          className={field}
        >
          {SEGMENTS.map((s) => (
            <option key={s.v} value={s.v}>
              {s.label}
            </option>
          ))}
        </select>

        {segmentType === 'lead_status' && (
          <select
            value={statusParam}
            onChange={(e) => setStatusParam(e.target.value)}
            className={field + ' mt-2'}
          >
            {LEAD_STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        )}
        {segmentType === 'cluster' && (
          <select
            value={clusterParam}
            onChange={(e) => setClusterParam(e.target.value)}
            className={field + ' mt-2'}
          >
            {Object.entries(CLUSTER_LABEL_SHORT).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        )}
        {segmentType === 'activity' && (
          <input
            value={daysParam}
            onChange={(e) => setDaysParam(e.target.value)}
            type="number"
            placeholder="дней"
            className={field + ' mt-2'}
          />
        )}
        {segmentType === 'ids' && (
          <textarea
            value={idsParam}
            onChange={(e) => setIdsParam(e.target.value)}
            rows={2}
            placeholder="Telegram ID через пробел/запятую"
            className={field + ' mt-2'}
          />
        )}

        <p className="mt-2 text-sm text-white/60">
          Получателей: <span className="font-semibold text-white">{count ?? '…'}</span>
        </p>
      </div>

      {/* Планирование */}
      <div>
        <label className="mb-1 block text-xs text-white/40">Запланировать на (необязательно)</label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className={field}
        />
      </div>

      {err && <div className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-300">{err}</div>}

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          disabled={pending}
          onClick={() => submit('now')}
          className="rounded-lg bg-emerald-500/85 px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50"
        >
          Отправить сейчас
        </button>
        <button
          disabled={pending || !scheduledAt}
          onClick={() => submit('schedule')}
          className="rounded-lg bg-indigo-500/85 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
        >
          Запланировать
        </button>
        <button
          disabled={pending}
          onClick={() => submit('draft')}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-50"
        >
          В черновик
        </button>
      </div>
    </div>
  )
}

function errLabel(code: string): string {
  const map: Record<string, string> = {
    empty: 'Заполните название и текст',
    bad_button: 'Проверьте кнопки (текст + ссылка https://)',
    bad_date: 'Некорректная дата планирования',
  }
  return map[code] ?? 'Ошибка: ' + code
}
