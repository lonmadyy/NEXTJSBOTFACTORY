import 'server-only'
import { eq, sql } from 'drizzle-orm'
import { db } from '../db/client'
import {
  leads,
  quizSessions,
  users,
  type LeadRow,
  type LeadStatus,
  type NewLeadRow,
  type QuizAnswerEntry,
  type UserRow,
} from '../db/schema'

// =====================================================================
// Users (upsert on Telegram user identity)
// =====================================================================

export async function upsertUser(input: {
  tgUserId: number
  tgUsername?: string | null
  firstName?: string | null
  langCode?: string | null
}): Promise<UserRow> {
  const [row] = await db
    .insert(users)
    .values({
      tgUserId: input.tgUserId,
      tgUsername: input.tgUsername ?? null,
      firstName: input.firstName ?? null,
      langCode: input.langCode ?? null,
    })
    .onConflictDoUpdate({
      target: users.tgUserId,
      set: {
        tgUsername: input.tgUsername ?? null,
        firstName: input.firstName ?? null,
        langCode: input.langCode ?? null,
        lastSeenAt: new Date(),
      },
    })
    .returning()
  return row
}

export async function findUserById(id: number): Promise<UserRow | null> {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return row ?? null
}

export async function findUserByTgId(tgUserId: number): Promise<UserRow | null> {
  const [row] = await db.select().from(users).where(eq(users.tgUserId, tgUserId)).limit(1)
  return row ?? null
}

// =====================================================================
// Quiz sessions
// =====================================================================

export async function startQuizSession(userId: number): Promise<number> {
  const [row] = await db
    .insert(quizSessions)
    .values({ userId, answers: [], completed: false })
    .returning({ id: quizSessions.id })
  return row.id
}

export async function saveQuizAnswers(
  sessionId: number,
  answers: QuizAnswerEntry[]
): Promise<void> {
  await db.update(quizSessions).set({ answers }).where(eq(quizSessions.id, sessionId))
}

export async function completeQuizSession(
  sessionId: number,
  answers: QuizAnswerEntry[]
): Promise<void> {
  await db
    .update(quizSessions)
    .set({ answers, completed: true, completedAt: new Date() })
    .where(eq(quizSessions.id, sessionId))
}

// =====================================================================
// Leads
// =====================================================================

export async function createLead(input: NewLeadRow): Promise<LeadRow> {
  const [row] = await db.insert(leads).values(input).returning()
  return row
}

export async function updateLeadStatus(
  leadId: number,
  status: LeadStatus
): Promise<LeadRow | null> {
  const [row] = await db
    .update(leads)
    .set({ status, updatedAt: new Date() })
    .where(eq(leads.id, leadId))
    .returning()
  return row ?? null
}

export async function findLeadById(leadId: number): Promise<LeadRow | null> {
  const [row] = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1)
  return row ?? null
}

export async function findLatestLeadForUser(userId: number): Promise<LeadRow | null> {
  const rows = await db
    .select()
    .from(leads)
    .where(eq(leads.userId, userId))
    .orderBy(sql`${leads.createdAt} DESC`)
    .limit(1)
  return rows[0] ?? null
}
