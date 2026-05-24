// Pure schema definitions — no server-side runtime, safe to import from drizzle-kit CLI.
import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

// ============================================================
// Users — minimal identity slice we get from Telegram update
// ============================================================
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  tgUserId: bigint('tg_user_id', { mode: 'number' }).notNull().unique(),
  tgUsername: varchar('tg_username', { length: 64 }),
  firstName: text('first_name'),
  langCode: varchar('lang_code', { length: 8 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).defaultNow().notNull(),
})

export type ServiceCluster = 'web' | 'bot' | 'miniapp' | 'ai'

export type ScoreVector = {
  web: number
  bot: number
  miniapp: number
  ai: number
}

export type LeadStatus = 'new' | 'contacted' | 'archived' | 'won' | 'lost'

// ============================================================
// Leads — final entity created after quiz completion
// ============================================================
export const leads = pgTable(
  'leads',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    cluster: varchar('cluster', { length: 16 }).$type<ServiceCluster>(),
    scoreVector: jsonb('score_vector').$type<ScoreVector>(),
    utmCluster: varchar('utm_cluster', { length: 24 }),
    utmSection: varchar('utm_section', { length: 32 }),
    promocodeId: integer('promocode_id'),
    reportText: text('report_text'),
    reportSource: varchar('report_source', { length: 16 }), // 'grok' | 'fallback'
    status: varchar('status', { length: 16 }).$type<LeadStatus>().default('new').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    byUser: index('leads_user_idx').on(t.userId),
    byStatus: index('leads_status_idx').on(t.status),
  })
)

// ============================================================
// Quiz sessions — full audit trail of quiz answers
// ============================================================
export type QuizAnswerEntry = {
  questionId: string
  answerId: string
}

export const quizSessions = pgTable('quiz_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  answers: jsonb('answers').$type<QuizAnswerEntry[]>().notNull().default([]),
  completed: boolean('completed').default(false).notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
})

// ============================================================
// Promocodes — single-use codes issued on quiz completion
// ============================================================
export const promocodes = pgTable(
  'promocodes',
  {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 32 }).notNull(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    discountPct: integer('discount_pct').default(5).notNull(),
    issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    redeemedAt: timestamp('redeemed_at', { withTimezone: true }),
    redeemedNote: text('redeemed_note'),
    supersededByCodeId: integer('superseded_by_code_id'),
  },
  (t) => ({
    byCode: uniqueIndex('promocodes_code_uniq').on(t.code),
    byUser: index('promocodes_user_idx').on(t.userId),
  })
)

// ============================================================
// Admin notifications — track Telegram message IDs for edits
// ============================================================
export const adminNotifications = pgTable('admin_notifications', {
  id: serial('id').primaryKey(),
  leadId: integer('lead_id')
    .notNull()
    .references(() => leads.id),
  tgMessageId: bigint('tg_message_id', { mode: 'number' }),
  sentAt: timestamp('sent_at', { withTimezone: true }).defaultNow().notNull(),
  deliveryError: text('delivery_error'),
})

// ============================================================
// Sessions — grammY session storage (key/value)
// ============================================================
export const sessions = pgTable('sessions', {
  key: varchar('key', { length: 64 }).primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type UserRow = typeof users.$inferSelect
export type NewUserRow = typeof users.$inferInsert
export type LeadRow = typeof leads.$inferSelect
export type NewLeadRow = typeof leads.$inferInsert
export type QuizSessionRow = typeof quizSessions.$inferSelect
export type PromocodeRow = typeof promocodes.$inferSelect
export type AdminNotificationRow = typeof adminNotifications.$inferSelect
