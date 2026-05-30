import 'server-only'
import { sql, type SQL } from 'drizzle-orm'
import { db } from '@/bot/db/client'
import type { BroadcastSegmentType } from '@/bot/db/schema'

export type SegmentParams = {
  status?: string // для lead_status
  cluster?: string // для cluster
  days?: number // для activity (lastSeen за N дней)
  ids?: number[] // для ids (tg_user_id список)
}

// Базовый фильтр: только живые подписчики (не заблокировали бота, не отписались).
const ACTIVE = sql`u.is_blocked = false and u.unsubscribed_at is null`

// WHERE-фрагмент по сегменту для таблицы users с алиасом u.
export function segmentFragment(type: BroadcastSegmentType, params: SegmentParams = {}): SQL {
  switch (type) {
    case 'all':
      return sql`${ACTIVE}`
    case 'lead_status':
      return sql`${ACTIVE} and u.id in (select user_id from leads where status = ${params.status ?? 'new'})`
    case 'cluster':
      return sql`${ACTIVE} and u.id in (select user_id from leads where cluster = ${params.cluster ?? 'web'})`
    case 'activity': {
      const days = Math.max(1, Number(params.days ?? 30))
      const since = new Date(Date.now() - days * 86400000).toISOString()
      return sql`${ACTIVE} and u.last_seen_at >= ${since}`
    }
    case 'ids': {
      const ids = (params.ids ?? []).filter((n) => Number.isFinite(n))
      if (ids.length === 0) return sql`false`
      return sql`${ACTIVE} and u.tg_user_id = any(${ids})`
    }
    default:
      return sql`false`
  }
}

export async function countSegment(
  type: BroadcastSegmentType,
  params: SegmentParams = {}
): Promise<number> {
  const frag = segmentFragment(type, params)
  const rows = await db.execute(sql`select count(*)::int c from users u where ${frag}`)
  return (rows as unknown as Array<{ c: number }>)[0]?.c ?? 0
}

export const SEGMENT_LABEL: Record<BroadcastSegmentType, string> = {
  all: 'Все активные',
  lead_status: 'По статусу лида',
  cluster: 'По кластеру услуг',
  activity: 'По активности',
  ids: 'Список ID',
}
