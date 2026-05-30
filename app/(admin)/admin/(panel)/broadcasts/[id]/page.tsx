import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/admin/guard'
import { getBroadcast } from '@/lib/admin/broadcast-service'
import {
  BROADCAST_STATUS_BADGE,
  BROADCAST_STATUS_LABEL,
  SEGMENT_LABEL,
  fmtMinsk,
} from '@/lib/admin/labels'
import { Kpi, Section } from '@/components/admin/charts'
import BroadcastDetailActions from '@/components/admin/BroadcastDetailActions'

export const dynamic = 'force-dynamic'

export default async function BroadcastDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage()
  const { id } = await params
  const b = await getBroadcast(Number(id))
  if (!b) notFound()

  const processed = b.sentCount + b.failedCount + b.blockedCount
  const progress = b.total > 0 ? Math.round((processed / b.total) * 100) : 0

  return (
    <div className="space-y-4">
      <Link href="/admin/broadcasts" className="text-sm text-indigo-300">
        ← К рассылкам
      </Link>

      <div className="flex items-center justify-between gap-2">
        <h1 className="truncate text-xl font-semibold tracking-tight">{b.title}</h1>
        <span className={`shrink-0 rounded px-2 py-0.5 text-xs ${BROADCAST_STATUS_BADGE[b.status] ?? ''}`}>
          {BROADCAST_STATUS_LABEL[b.status] ?? b.status}
        </span>
      </div>

      {/* Прогресс */}
      {b.total > 0 && (
        <div>
          <div className="mb-1 flex justify-between text-xs text-white/50">
            <span>
              {processed} / {b.total}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded bg-white/[0.06]">
            <div className="h-full rounded bg-emerald-500/70" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <Kpi label="Доставлено" value={b.sentCount} accent="text-emerald-400" />
        <Kpi label="Заблокир." value={b.blockedCount} accent="text-amber-400" />
        <Kpi label="Ошибки" value={b.failedCount} accent="text-rose-400" />
      </div>

      <Section title="Сообщение">
        {b.media && (
          <div className="mb-2 inline-block rounded bg-white/10 px-2 py-1 text-xs text-white/70">
            📎 {b.media.type}
          </div>
        )}
        <p className="whitespace-pre-wrap text-sm text-white/85">{b.messageText}</p>
        {b.buttons.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {b.buttons.map((btn, i) => (
              <div key={i} className="rounded-lg border border-white/15 px-3 py-1.5 text-center text-xs text-indigo-300">
                {btn.text}
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Параметры">
        <dl className="space-y-1 text-sm">
          <Row k="Аудитория" v={SEGMENT_LABEL[b.segmentType] ?? b.segmentType} />
          <Row k="Разметка" v={b.parseMode} />
          <Row k="Всего получателей" v={String(b.total)} />
          <Row k="Создана" v={fmtMinsk(b.createdAt)} />
          {b.scheduledAt && <Row k="Запланирована на" v={fmtMinsk(b.scheduledAt)} />}
          {b.startedAt && <Row k="Старт" v={fmtMinsk(b.startedAt)} />}
          {b.finishedAt && <Row k="Завершена" v={fmtMinsk(b.finishedAt)} />}
        </dl>
      </Section>

      <BroadcastDetailActions id={b.id} status={b.status} />
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-white/45">{k}</dt>
      <dd className="text-right text-white/85">{v}</dd>
    </div>
  )
}
