import 'server-only'
import { and, count, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '@/bot/db/client'
import {
  adminAudit,
  leads,
  promocodes,
  quizSessions,
  users,
  type LeadStatus,
  type PromocodeRow,
  type QuizAnswerEntry,
  type ServiceCluster,
  type UserRow,
} from '@/bot/db/schema'
import { getOption, getQuestionById } from '@/bot/flows/quiz-questions'

export type LeadListItem = {
  id: number
  cluster: ServiceCluster | null
  status: LeadStatus
  createdAt: Date
  utmCluster: string | null
  utmSection: string | null
  tgUserId: number
  tgUsername: string | null
  firstName: string | null
}

export type LeadListFilters = {
  status?: LeadStatus
  cluster?: ServiceCluster
  q?: string
  page?: number
  pageSize?: number
}

export async function listLeads(
  filters: LeadListFilters
): Promise<{ items: LeadListItem[]; total: number; page: number; pageSize: number }> {
  const page = Math.max(1, filters.page ?? 1)
  const pageSize = Math.min(100, Math.max(5, filters.pageSize ?? 25))
  const offset = (page - 1) * pageSize

  const conds = []
  if (filters.status) conds.push(eq(leads.status, filters.status))
  if (filters.cluster) conds.push(eq(leads.cluster, filters.cluster))
  if (filters.q && filters.q.trim()) {
    const like = `%${filters.q.trim()}%`
    conds.push(or(ilike(users.tgUsername, like), ilike(users.firstName, like)))
  }
  const where = conds.length ? and(...conds) : undefined

  const [items, totalRows] = await Promise.all([
    db
      .select({
        id: leads.id,
        cluster: leads.cluster,
        status: leads.status,
        createdAt: leads.createdAt,
        utmCluster: leads.utmCluster,
        utmSection: leads.utmSection,
        tgUserId: users.tgUserId,
        tgUsername: users.tgUsername,
        firstName: users.firstName,
      })
      .from(leads)
      .innerJoin(users, eq(users.id, leads.userId))
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ c: count() }).from(leads).innerJoin(users, eq(users.id, leads.userId)).where(where),
  ])

  return { items: items as LeadListItem[], total: totalRows[0]?.c ?? 0, page, pageSize }
}

export type LeadDetail = {
  lead: typeof leads.$inferSelect
  user: UserRow | null
  promocode: PromocodeRow | null
  answers: Array<{ questionText: string; answerLabel: string }>
}

export async function getLeadDetail(leadId: number): Promise<LeadDetail | null> {
  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1)
  if (!lead) return null

  const [user] = await db.select().from(users).where(eq(users.id, lead.userId)).limit(1)

  let promocode: PromocodeRow | null = null
  if (lead.promocodeId) {
    const [pc] = await db.select().from(promocodes).where(eq(promocodes.id, lead.promocodeId)).limit(1)
    promocode = pc ?? null
  }

  // Последняя завершённая сессия квиза этого пользователя.
  const [qs] = await db
    .select()
    .from(quizSessions)
    .where(and(eq(quizSessions.userId, lead.userId), eq(quizSessions.completed, true)))
    .orderBy(desc(quizSessions.startedAt))
    .limit(1)

  const answers: LeadDetail['answers'] = []
  const entries: QuizAnswerEntry[] = qs?.answers ?? []
  for (const a of entries) {
    const q = getQuestionById(a.questionId)
    const opt = getOption(a.questionId, a.answerId)
    answers.push({
      questionText: q?.text ?? a.questionId,
      answerLabel: opt?.label ?? a.answerId,
    })
  }

  return { lead, user: user ?? null, promocode, answers }
}

export type UserListItem = UserRow & { quizCount: number; leadCount: number }

export async function listUsers(filters: {
  q?: string
  page?: number
  pageSize?: number
}): Promise<{ items: UserListItem[]; total: number; page: number; pageSize: number }> {
  const page = Math.max(1, filters.page ?? 1)
  const pageSize = Math.min(100, Math.max(5, filters.pageSize ?? 25))
  const offset = (page - 1) * pageSize

  // Сырой SQL с коррелированными подзапросами — drizzle-интерполяция колонки
  // в подзапросе ненадёжна, а db.execute даёт предсказуемый результат.
  const term = filters.q?.trim()
  const like = term ? `%${term}%` : null
  const whereSql = like
    ? sql`where (u.tg_username ilike ${like} or u.first_name ilike ${like})`
    : sql``

  const [rows, totalRows] = await Promise.all([
    db.execute(sql`
      select u.id, u.tg_user_id, u.tg_username, u.first_name, u.lang_code,
             u.is_blocked, u.unsubscribed_at, u.created_at, u.last_seen_at,
             (select count(*)::int from quiz_sessions q where q.user_id = u.id) quiz_count,
             (select count(*)::int from leads l where l.user_id = u.id) lead_count
      from users u
      ${whereSql}
      order by u.last_seen_at desc
      limit ${pageSize} offset ${offset}`),
    db.execute(sql`select count(*)::int c from users u ${whereSql}`),
  ])

  const items: UserListItem[] = (rows as unknown as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    tgUserId: Number(r.tg_user_id),
    tgUsername: (r.tg_username as string | null) ?? null,
    firstName: (r.first_name as string | null) ?? null,
    langCode: (r.lang_code as string | null) ?? null,
    isBlocked: Boolean(r.is_blocked),
    unsubscribedAt: r.unsubscribed_at ? new Date(r.unsubscribed_at as string) : null,
    createdAt: new Date(r.created_at as string),
    lastSeenAt: new Date(r.last_seen_at as string),
    quizCount: Number(r.quiz_count),
    leadCount: Number(r.lead_count),
  }))

  const total = (totalRows as unknown as Array<{ c: number }>)[0]?.c ?? 0
  return { items, total, page, pageSize }
}

export type AuditItem = {
  id: number
  action: string
  entity: string | null
  entityId: string | null
  createdAt: Date
}

export async function getRecentAudit(limit = 12): Promise<AuditItem[]> {
  return db
    .select({
      id: adminAudit.id,
      action: adminAudit.action,
      entity: adminAudit.entity,
      entityId: adminAudit.entityId,
      createdAt: adminAudit.createdAt,
    })
    .from(adminAudit)
    .orderBy(desc(adminAudit.createdAt))
    .limit(limit)
}

// Для CSV-экспорта: все пользователи без пагинации.
export async function allUsersForExport(): Promise<UserListItem[]> {
  const { items } = await listUsers({ page: 1, pageSize: 100 })
  // если юзеров больше 100 — добираем
  if (items.length < 100) return items
  const all: UserListItem[] = [...items]
  let page = 2
  for (;;) {
    const next = await listUsers({ page, pageSize: 100 })
    all.push(...next.items)
    if (all.length >= next.total || next.items.length === 0) break
    page += 1
  }
  return all
}
