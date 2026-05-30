'use client'
import { useState, useTransition } from 'react'
import { redeemLeadAction, sendMessageAction, setLeadStatusAction } from '@/lib/admin/actions'
import { LEAD_STATUS_LABEL, LEAD_STATUS_ORDER } from '@/lib/admin/labels'
import type { LeadStatus } from '@/bot/db/schema'

export default function LeadActions({
  leadId,
  currentStatus,
  tgUserId,
  canRedeem,
}: {
  leadId: number
  currentStatus: LeadStatus
  tgUserId: number
  canRedeem: boolean
}) {
  const [pending, start] = useTransition()
  const [toast, setToast] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState('')

  const flash = (t: string) => {
    setToast(t)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div className="space-y-4">
      {/* Статус */}
      <div>
        <div className="mb-2 text-xs uppercase tracking-wide text-white/40">Статус лида</div>
        <div className="flex flex-wrap gap-1.5">
          {LEAD_STATUS_ORDER.map((s) => (
            <button
              key={s}
              disabled={pending || s === currentStatus}
              onClick={() =>
                start(async () => {
                  const r = await setLeadStatusAction(leadId, s as LeadStatus)
                  flash(r.ok ? `Статус: ${LEAD_STATUS_LABEL[s]}` : `Ошибка: ${r.error}`)
                })
              }
              className={`rounded-lg px-2.5 py-1.5 text-xs ${
                s === currentStatus
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/15'
              } disabled:opacity-50`}
            >
              {LEAD_STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Погашение промокода */}
      {canRedeem && (
        <div>
          <div className="mb-2 text-xs uppercase tracking-wide text-white/40">Погасить промокод</div>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Заметка о сделке (необязательно)"
            className="mb-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
          />
          <button
            disabled={pending}
            onClick={() =>
              start(async () => {
                const r = await redeemLeadAction(leadId, note)
                flash(r.ok ? 'Промокод погашен, лид → сделка' : `Ошибка: ${r.error}`)
                if (r.ok) setNote('')
              })
            }
            className="rounded-lg bg-emerald-500/80 px-3 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50"
          >
            Погасить и закрыть сделку
          </button>
        </div>
      )}

      {/* Личное сообщение */}
      <div>
        <div className="mb-2 text-xs uppercase tracking-wide text-white/40">Написать пользователю</div>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={3}
          placeholder="Текст сообщения от имени бота…"
          className="mb-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
        />
        <button
          disabled={pending || !msg.trim()}
          onClick={() =>
            start(async () => {
              const r = await sendMessageAction(tgUserId, msg)
              flash(r.ok ? 'Сообщение отправлено' : `Ошибка: ${r.error}`)
              if (r.ok) setMsg('')
            })
          }
          className="rounded-lg bg-indigo-500/80 px-3 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
        >
          Отправить
        </button>
      </div>

      {toast && (
        <div className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white/90">{toast}</div>
      )}
    </div>
  )
}
