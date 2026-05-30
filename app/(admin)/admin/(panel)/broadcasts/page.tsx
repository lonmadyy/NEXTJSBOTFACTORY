import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin/guard'
import { listBroadcasts } from '@/lib/admin/broadcast-service'
import {
  BROADCAST_STATUS_BADGE,
  BROADCAST_STATUS_LABEL,
  SEGMENT_LABEL,
  fmtMinsk,
} from '@/lib/admin/labels'

export const dynamic = 'force-dynamic'

export default async function BroadcastsPage() {
  await requireAdminPage()
  const items = await listBroadcasts()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Рассылки</h1>
        <Link
          href="/admin/broadcasts/new"
          className="rounded-lg bg-indigo-500/85 px-3 py-1.5 text-sm font-medium hover:bg-indigo-500"
        >
          + Новая
        </Link>
      </div>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-white/40">Рассылок пока нет. Создайте первую.</p>
        )}
        {items.map((b) => (
          <Link
            key={b.id}
            href={`/admin/broadcasts/${b.id}`}
            className="block rounded-xl border border-white/10 bg-white/[0.04] p-3 active:bg-white/[0.07]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium">{b.title}</span>
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] ${BROADCAST_STATUS_BADGE[b.status] ?? ''}`}
              >
                {BROADCAST_STATUS_LABEL[b.status] ?? b.status}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-white/45">
              <span>{SEGMENT_LABEL[b.segmentType] ?? b.segmentType}</span>
              {b.total > 0 && (
                <span>
                  · {b.sentCount}/{b.total} отпр.
                  {b.blockedCount > 0 && ` · ${b.blockedCount} блок`}
                  {b.failedCount > 0 && ` · ${b.failedCount} ошиб`}
                </span>
              )}
              <span className="ml-auto">
                {b.status === 'scheduled' && b.scheduledAt
                  ? `на ${fmtMinsk(b.scheduledAt)}`
                  : fmtMinsk(b.createdAt)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
