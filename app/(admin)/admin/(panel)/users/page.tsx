import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin/guard'
import { listUsers } from '@/lib/admin/queries'
import { fmtMinsk } from '@/lib/admin/labels'

export const dynamic = 'force-dynamic'

type SP = { q?: string; page?: string }

export default async function UsersPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireAdminPage()
  const sp = await searchParams
  const page = Number(sp.page ?? '1') || 1
  const { items, total, pageSize } = await listUsers({ q: sp.q, page })
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
        <h1 className="text-xl font-semibold tracking-tight">Пользователи</h1>
        <span className="text-xs text-white/40">{total} всего</span>
      </div>

      <div className="flex gap-2">
        <form className="flex flex-1 gap-2" method="get">
          <input
            name="q"
            defaultValue={sp.q ?? ''}
            placeholder="Поиск по имени / @username"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-indigo-500/80 px-3 py-2 text-sm font-medium hover:bg-indigo-500">
            Найти
          </button>
        </form>
        <a
          href="/api/admin/users/export"
          className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white/80 hover:bg-white/5"
        >
          CSV
        </a>
      </div>

      <div className="space-y-2">
        {items.length === 0 && <p className="text-sm text-white/40">Ничего не найдено.</p>}
        {items.map((u) => (
          <div key={u.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium">
                {u.firstName || (u.tgUsername ? '@' + u.tgUsername : 'id ' + u.tgUserId)}
                {u.isBlocked && <span className="ml-2 text-[10px] text-rose-400">заблокировал</span>}
              </span>
              {u.tgUsername ? (
                <a href={`tg://user?id=${u.tgUserId}`} className="shrink-0 text-xs text-indigo-300">
                  @{u.tgUsername}
                </a>
              ) : (
                <span className="shrink-0 text-xs text-white/30">id {u.tgUserId}</span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-white/45">
              <span>квизов: {u.quizCount}</span>
              <span>· лидов: {u.leadCount}</span>
              <span className="ml-auto">был {fmtMinsk(u.lastSeenAt)}</span>
            </div>
          </div>
        ))}
      </div>

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
