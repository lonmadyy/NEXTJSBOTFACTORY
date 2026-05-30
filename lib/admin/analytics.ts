import 'server-only'
import { sql } from 'drizzle-orm'
import { db } from '@/bot/db/client'

// Типы дашборда
export type DashboardData = {
  users: { total: number; new7: number; new30: number; blocked: number; unsub: number }
  quiz: { started: number; completed: number; usersStarted: number; usersCompleted: number }
  leads: { total: number; users: number; won: number; byStatus: Record<string, number> }
  promo: { issued: number; redeemed: number }
  funnel: Array<{ label: string; value: number }>
  clusters: Array<{ key: string; label: string; value: number }>
  utm: Array<{ key: string; value: number }>
  series: Array<{ date: string; users: number; leads: number }>
}

const CLUSTER_LABEL: Record<string, string> = {
  web: 'Сайты',
  bot: 'Боты',
  miniapp: 'Mini Apps',
  ai: 'AI',
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export async function getDashboardData(): Promise<DashboardData> {
  const now = Date.now()
  const d7 = new Date(now - 7 * 86400000).toISOString()
  const d30 = new Date(now - 30 * 86400000).toISOString()

  const [userRows, quizRows, leadTotalRows, leadStatusRows, promoRows, clusterRows, utmRows, uSeries, lSeries] =
    await Promise.all([
      db.execute(sql`
        select
          count(*)::int total,
          count(*) filter (where created_at >= ${d7})::int new7,
          count(*) filter (where created_at >= ${d30})::int new30,
          count(*) filter (where is_blocked)::int blocked,
          count(*) filter (where unsubscribed_at is not null)::int unsub
        from users`),
      db.execute(sql`
        select
          count(*)::int started,
          count(*) filter (where completed)::int completed,
          count(distinct user_id)::int users_started,
          count(distinct user_id) filter (where completed)::int users_completed
        from quiz_sessions`),
      db.execute(sql`
        select
          count(*)::int total,
          count(distinct user_id)::int users,
          count(*) filter (where status = 'won')::int won
        from leads`),
      db.execute(sql`select status, count(*)::int n from leads group by status`),
      db.execute(sql`
        select count(*)::int issued, count(*) filter (where redeemed_at is not null)::int redeemed
        from promocodes`),
      db.execute(sql`select cluster, count(*)::int n from leads where cluster is not null group by cluster order by n desc`),
      db.execute(sql`select coalesce(utm_cluster, '—') k, count(*)::int n from leads group by 1 order by n desc limit 12`),
      db.execute(sql`
        select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') d, count(*)::int n
        from users where created_at >= ${d30} group by 1`),
      db.execute(sql`
        select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') d, count(*)::int n
        from leads where created_at >= ${d30} group by 1`),
    ])

  const u = (userRows as unknown as Array<Record<string, number>>)[0]
  const q = (quizRows as unknown as Array<Record<string, number>>)[0]
  const lt = (leadTotalRows as unknown as Array<Record<string, number>>)[0]
  const p = (promoRows as unknown as Array<Record<string, number>>)[0]

  const byStatus: Record<string, number> = {}
  for (const r of leadStatusRows as unknown as Array<{ status: string; n: number }>) {
    byStatus[r.status] = r.n
  }

  const clusters = (clusterRows as unknown as Array<{ cluster: string; n: number }>).map((r) => ({
    key: r.cluster,
    label: CLUSTER_LABEL[r.cluster] ?? r.cluster,
    value: r.n,
  }))

  const utm = (utmRows as unknown as Array<{ k: string; n: number }>).map((r) => ({
    key: r.k,
    value: r.n,
  }))

  // Тайм-серии: заполняем пропуски нулями за 30 дней
  const uMap = new Map<string, number>()
  for (const r of uSeries as unknown as Array<{ d: string; n: number }>) uMap.set(r.d, r.n)
  const lMap = new Map<string, number>()
  for (const r of lSeries as unknown as Array<{ d: string; n: number }>) lMap.set(r.d, r.n)

  const series: DashboardData['series'] = []
  for (let i = 29; i >= 0; i--) {
    const key = ymd(new Date(now - i * 86400000))
    series.push({ date: key, users: uMap.get(key) ?? 0, leads: lMap.get(key) ?? 0 })
  }

  const funnel: DashboardData['funnel'] = [
    { label: 'Пользователи', value: u.total },
    { label: 'Начали квиз', value: q.users_started },
    { label: 'Завершили квиз', value: q.users_completed },
    { label: 'Лиды', value: lt.users },
    { label: 'Сделки (won)', value: lt.won },
  ]

  return {
    users: { total: u.total, new7: u.new7, new30: u.new30, blocked: u.blocked, unsub: u.unsub },
    quiz: {
      started: q.started,
      completed: q.completed,
      usersStarted: q.users_started,
      usersCompleted: q.users_completed,
    },
    leads: { total: lt.total, users: lt.users, won: lt.won, byStatus },
    promo: { issued: p.issued, redeemed: p.redeemed },
    funnel,
    clusters,
    utm,
    series,
  }
}
