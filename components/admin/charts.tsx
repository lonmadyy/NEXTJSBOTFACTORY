// Лёгкие presentational-компоненты для дашборда (без зависимостей, SSR-friendly).
import type { ReactNode } from 'react'

export function Kpi({
  label,
  value,
  sub,
  accent = 'text-white',
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  accent?: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <div className="text-[11px] uppercase tracking-wide text-white/40">{label}</div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums ${accent}`}>{value}</div>
      {sub != null && <div className="mt-0.5 text-[11px] text-white/45">{sub}</div>}
    </div>
  )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <h2 className="mb-3 text-sm font-semibold text-white/80">{title}</h2>
      {children}
    </section>
  )
}

export function BarList({
  items,
  emptyText = 'Нет данных',
}: {
  items: Array<{ label: string; value: number }>
  emptyText?: string
}) {
  if (!items.length) return <p className="text-sm text-white/40">{emptyText}</p>
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <div className="space-y-2">
      {items.map((it, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div className="w-28 shrink-0 truncate text-xs text-white/70" title={it.label}>
            {it.label}
          </div>
          <div className="relative h-5 flex-1 overflow-hidden rounded bg-white/[0.06]">
            <div
              className="h-full rounded bg-indigo-500/70"
              style={{ width: `${Math.max((it.value / max) * 100, it.value > 0 ? 6 : 0)}%` }}
            />
          </div>
          <div className="w-8 shrink-0 text-right text-xs tabular-nums text-white/80">{it.value}</div>
        </div>
      ))}
    </div>
  )
}

export function Funnel({ steps }: { steps: Array<{ label: string; value: number }> }) {
  const top = steps[0]?.value || 1
  return (
    <div className="space-y-2">
      {steps.map((s, idx) => {
        const pctOfTop = Math.round((s.value / top) * 100)
        const prev = idx > 0 ? steps[idx - 1].value : null
        const conv = prev && prev > 0 ? Math.round((s.value / prev) * 100) : null
        return (
          <div key={idx}>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="text-white/70">{s.label}</span>
              <span className="tabular-nums text-white/80">
                {s.value}
                {conv != null && <span className="ml-2 text-white/40">→ {conv}%</span>}
              </span>
            </div>
            <div className="h-6 overflow-hidden rounded bg-white/[0.06]">
              <div
                className="flex h-full items-center justify-end rounded bg-gradient-to-r from-indigo-600/60 to-indigo-400/70 pr-2 text-[10px] tabular-nums text-white/90"
                style={{ width: `${Math.max(pctOfTop, s.value > 0 ? 8 : 0)}%` }}
              >
                {pctOfTop}%
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Двухлинейный мини-график по дням (users + leads).
export function TimeSeries({
  data,
}: {
  data: Array<{ date: string; users: number; leads: number }>
}) {
  const W = 320
  const H = 90
  const pad = 4
  const n = data.length
  const max = Math.max(1, ...data.map((d) => Math.max(d.users, d.leads)))
  const x = (i: number) => pad + (i * (W - 2 * pad)) / Math.max(1, n - 1)
  const y = (v: number) => H - pad - (v / max) * (H - 2 * pad)
  const line = (key: 'users' | 'leads') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(' ')

  const totalUsers = data.reduce((a, d) => a + d.users, 0)
  const totalLeads = data.reduce((a, d) => a + d.leads, 0)

  return (
    <div>
      <div className="mb-2 flex gap-4 text-[11px]">
        <span className="flex items-center gap-1 text-white/60">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-400" /> Юзеры ({totalUsers})
        </span>
        <span className="flex items-center gap-1 text-white/60">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" /> Лиды ({totalLeads})
        </span>
        <span className="ml-auto text-white/30">30 дней</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-24 w-full" preserveAspectRatio="none">
        <path d={line('users')} fill="none" stroke="#818cf8" strokeWidth="1.5" />
        <path d={line('leads')} fill="none" stroke="#34d399" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

export function pct(part: number, whole: number): string {
  if (!whole) return '0%'
  return `${Math.round((part / whole) * 100)}%`
}
