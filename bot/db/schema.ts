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
  isBlocked: boolean('is_blocked').default(false).notNull(),
  unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
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

// ============================================================
// Broadcasts — массовые рассылки (конструктор + очередь доставки)
// ============================================================
export type BroadcastStatus =
  | 'draft'
  | 'scheduled'
  | 'sending'
  | 'sent'
  | 'canceled'
  | 'failed'

export type BroadcastSegmentType = 'all' | 'lead_status' | 'cluster' | 'activity' | 'ids'

export type BroadcastMedia = { type: 'photo' | 'document' | 'video'; fileId: string }

export type BroadcastButton = { text: string; url: string }

export const broadcasts = pgTable(
  'broadcasts',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    messageText: text('message_text').notNull(),
    parseMode: varchar('parse_mode', { length: 12 })
      .$type<'HTML' | 'MarkdownV2' | 'none'>()
      .default('HTML')
      .notNull(),
    media: jsonb('media').$type<BroadcastMedia | null>(),
    buttons: jsonb('buttons').$type<BroadcastButton[]>().default([]).notNull(),
    segmentType: varchar('segment_type', { length: 16 }).$type<BroadcastSegmentType>().notNull(),
    segmentParams: jsonb('segment_params').$type<Record<string, unknown>>().default({}).notNull(),
    status: varchar('status', { length: 16 }).$type<BroadcastStatus>().default('draft').notNull(),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
    startedAt: timestamp('started_at', { withTimezone: true }),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    total: integer('total').default(0).notNull(),
    sentCount: integer('sent_count').default(0).notNull(),
    failedCount: integer('failed_count').default(0).notNull(),
    blockedCount: integer('blocked_count').default(0).notNull(),
    createdBy: bigint('created_by', { mode: 'number' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    byStatus: index('broadcasts_status_idx').on(t.status),
    byScheduled: index('broadcasts_scheduled_idx').on(t.scheduledAt),
  })
)

export type RecipientStatus = 'pending' | 'sent' | 'failed' | 'blocked' | 'skipped'

export const broadcastRecipients = pgTable(
  'broadcast_recipients',
  {
    id: serial('id').primaryKey(),
    broadcastId: integer('broadcast_id')
      .notNull()
      .references(() => broadcasts.id),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    tgUserId: bigint('tg_user_id', { mode: 'number' }).notNull(),
    status: varchar('status', { length: 12 }).$type<RecipientStatus>().default('pending').notNull(),
    error: text('error'),
    sentAt: timestamp('sent_at', { withTimezone: true }),
  },
  (t) => ({
    byBroadcastStatus: index('broadcast_recipients_bc_status_idx').on(t.broadcastId, t.status),
  })
)

// ============================================================
// Admin audit — лёгкий журнал действий в админке
// ============================================================
export const adminAudit = pgTable(
  'admin_audit',
  {
    id: serial('id').primaryKey(),
    adminId: bigint('admin_id', { mode: 'number' }),
    action: varchar('action', { length: 48 }).notNull(),
    entity: varchar('entity', { length: 32 }),
    entityId: varchar('entity_id', { length: 64 }),
    meta: jsonb('meta').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    byCreated: index('admin_audit_created_idx').on(t.createdAt),
  })
)

export type UserRow = typeof users.$inferSelect
export type NewUserRow = typeof users.$inferInsert
export type LeadRow = typeof leads.$inferSelect
export type NewLeadRow = typeof leads.$inferInsert
export type QuizSessionRow = typeof quizSessions.$inferSelect
export type PromocodeRow = typeof promocodes.$inferSelect
export type AdminNotificationRow = typeof adminNotifications.$inferSelect
export type BroadcastRow = typeof broadcasts.$inferSelect
export type NewBroadcastRow = typeof broadcasts.$inferInsert
export type BroadcastRecipientRow = typeof broadcastRecipients.$inferSelect
export type AdminAuditRow = typeof adminAudit.$inferSelect
