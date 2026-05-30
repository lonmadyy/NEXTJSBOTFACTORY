import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin/guard'
import { listLeads } from '@/lib/admin/queries'
import {
  CLUSTER_LABEL_SHORT,
  LEAD_STATUS_BADGE,
  LEAD_STATUS_LABEL,
  LEAD_STATUS_ORDER,
  fmtMinsk,
} from '@/lib/admin/labels'
import type { LeadStatus, ServiceCluster } from '@/bot/db/schema'

export const dynamic = 'force-dynamic'

type SP = { status?: string; cluster?: string; q?: string; page?: string }

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireAdminPage()
  const sp = await searchParams
  const page = Number(sp.page ?? '1') || 1
  const { items, total, pageSize } = await listLeads({
    status: (sp.status as LeadStatus) || undefined,
    cluster: (sp.cluster as ServiceCluster) || undefined,
    q: sp.q,
    page,
  })
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const qp = (next: Partial<SP>) => {
    const merged = { ...sp, ...next }
    const usp = new URLSearchParams()
    for (const [k, v] of Object.entries(merged)) if (v) usp.set(k, String(v))
    const s = usp.toString()
    return s ? `?${s}` : ''
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Лиды</h1>
        <span className="text-xs text-white/40">{total} всего</span>
      </div>

      {/* Фильтры (GET-форма, работает без JS) */}
      <form className="grid grid-cols-2 gap-2 sm:grid-cols-4" method="get">
        <select
          name="status"
          defaultValue={sp.status ?? ''}
          className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-sm"
        >
          <option value="">Все статусы</option>
          {LEAD_STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <select
          name="cluster"
          defaultValue={sp.cluster ?? ''}
          className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-sm"
        >
          <option value="">Все услуги</option>
          {Object.entries(CLUSTER_LABEL_SHORT).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <input
          name="q"
          defaultValue={sp.q ?? ''}
          placeholder="Поиск по имени/@"
          className="col-span-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm sm:col-span-1"
        />
        <button className="rounded-lg bg-indigo-500/80 px-3 py-2 text-sm font-medium hover:bg-indigo-500">
          Применить
        </button>
      </form>

      {/* Список */}
      <div className="space-y-2">
        {items.length === 0 && <p className="text-sm text-white/40">Ничего не найдено.</p>}
        {items.map((l) => (
          <Link
            key={l.id}
            href={`/admin/leads/${l.id}`}
            className="block rounded-xl border border-white/10 bg-white/[0.04] p-3 active:bg-white/[0.07]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium">
                {l.firstName || (l.tgUsername ? '@' + l.tgUsername : 'id ' + l.tgUserId)}
              </span>
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] ${LEAD_STATUS_BADGE[l.status] ?? ''}`}
              >
                {LEAD_STATUS_LABEL[l.status] ?? l.status}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-white/45">
              <span>#{l.id}</span>
              {l.cluster && <span>· {CLUSTER_LABEL_SHORT[l.cluster] ?? l.cluster}</span>}
              <span>· {l.utmCluster ?? '—'}</span>
              <span className="ml-auto">{fmtMinsk(l.createdAt)}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1 text-sm">
          {page > 1 ? (
            <Link href={qp({ page: String(page - 1) })} className="text-indigo-300">
              ← Назад
            </Link>
          ) : (
            <span className="text-white/20">← Назад</span>
          )}
          <span className="text-white/40">
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={qp({ page: String(page + 1) })} className="text-indigo-300">
              Вперёд →
            </Link>
          ) : (
            <span className="text-white/20">Вперёд →</span>
          )}
        </div>
      )}
    </div>
  )
}
