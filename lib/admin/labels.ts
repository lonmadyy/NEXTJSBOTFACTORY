// Плейн-лейблы (без server-only) — годятся и для server, и для client компонентов.
export const LEAD_STATUS_LABEL: Record<string, string> = {
  new: 'Новый',
  contacted: 'В работе',
  won: 'Сделка',
  lost: 'Потерян',
  archived: 'Архив',
}

export const LEAD_STATUS_ORDER = ['new', 'contacted', 'won', 'lost', 'archived'] as const

export const LEAD_STATUS_BADGE: Record<string, string> = {
  new: 'bg-sky-500/15 text-sky-300',
  contacted: 'bg-amber-500/15 text-amber-300',
  won: 'bg-emerald-500/15 text-emerald-300',
  lost: 'bg-rose-500/15 text-rose-300',
  archived: 'bg-white/10 text-white/50',
}

export const CLUSTER_LABEL_SHORT: Record<string, string> = {
  web: 'Сайт',
  bot: 'Бот',
  miniapp: 'Mini App',
  ai: 'AI',
}

export function fmtMinsk(d: Date | string | null | undefined): string {
  if (!d) return '—'
  const date = typeof d === 'string' ? new Date(d) : d
  const ms = date.getTime() + 3 * 60 * 60 * 1000 // Europe/Minsk = UTC+3
  const m = new Date(ms)
  const dd = String(m.getUTCDate()).padStart(2, '0')
  const mm = String(m.getUTCMonth() + 1).padStart(2, '0')
  const hh = String(m.getUTCHours()).padStart(2, '0')
  const min = String(m.getUTCMinutes()).padStart(2, '0')
  return `${dd}.${mm} ${hh}:${min}`
}
