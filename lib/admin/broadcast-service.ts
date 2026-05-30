import 'server-only'
import { InlineKeyboard, type Api } from 'grammy'
import { eq, sql } from 'drizzle-orm'
import { getBot } from '@/bot'
import { db } from '@/bot/db/client'
import {
  broadcasts,
  type BroadcastButton,
  type BroadcastMedia,
  type BroadcastRow,
  type BroadcastSegmentType,
  type NewBroadcastRow,
} from '@/bot/db/schema'
import { segmentFragment, type SegmentParams } from './segments'

const BATCH = 25
const THROTTLE_MS = 40 // ~25 msg/s — под лимит Telegram (~30/s)
const BUDGET_MS = 45_000 // бюджет одного тика (< maxDuration 60с)

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------
export async function createBroadcast(input: {
  title: string
  messageText: string
  parseMode?: 'HTML' | 'MarkdownV2' | 'none'
  media?: BroadcastMedia | null
  buttons?: BroadcastButton[]
  segmentType: BroadcastSegmentType
  segmentParams?: SegmentParams
  createdBy: number
}): Promise<BroadcastRow> {
  const values: NewBroadcastRow = {
    title: input.title,
    messageText: input.messageText,
    parseMode: input.parseMode ?? 'HTML',
    media: input.media ?? null,
    buttons: input.buttons ?? [],
    segmentType: input.segmentType,
    segmentParams: (input.segmentParams ?? {}) as Record<string, unknown>,
    status: 'draft',
    createdBy: input.createdBy,
  }
  const [row] = await db.insert(broadcasts).values(values).returning()
  return row
}

export async function getBroadcast(id: number): Promise<BroadcastRow | null> {
  const [row] = await db.select().from(broadcasts).where(eq(broadcasts.id, id)).limit(1)
  return row ?? null
}

export async function listBroadcasts(): Promise<BroadcastRow[]> {
  return db.select().from(broadcasts).orderBy(sql`${broadcasts.createdAt} desc`).limit(100)
}

export async function cancelBroadcast(id: number): Promise<void> {
  await db
    .update(broadcasts)
    .set({ status: 'canceled', finishedAt: new Date(), updatedAt: new Date() })
    .where(eq(broadcasts.id, id))
}

// ---------------------------------------------------------------------------
// Запуск / планирование
// ---------------------------------------------------------------------------
export async function materializeRecipients(id: number): Promise<number> {
  const bc = await getBroadcast(id)
  if (!bc) return 0

  // уже материализовано?
  const existing = await db.execute(
    sql`select count(*)::int c from broadcast_recipients where broadcast_id = ${id}`
  )
  if ((existing as unknown as Array<{ c: number }>)[0]?.c > 0) {
    return (existing as unknown as Array<{ c: number }>)[0].c
  }

  const frag = segmentFragment(bc.segmentType, (bc.segmentParams ?? {}) as SegmentParams)
  await db.execute(sql`
    insert into broadcast_recipients (broadcast_id, user_id, tg_user_id, status)
    select ${id}, u.id, u.tg_user_id, 'pending' from users u where ${frag}`)

  const totalRows = await db.execute(
    sql`select count(*)::int c from broadcast_recipients where broadcast_id = ${id}`
  )
  const total = (totalRows as unknown as Array<{ c: number }>)[0]?.c ?? 0
  await db.update(broadcasts).set({ total, updatedAt: new Date() }).where(eq(broadcasts.id, id))
  return total
}

export async function startBroadcast(id: number): Promise<void> {
  await db
    .update(broadcasts)
    .set({ status: 'sending', startedAt: new Date(), updatedAt: new Date() })
    .where(eq(broadcasts.id, id))
  await materializeRecipients(id)
  await finalizeIfDone(id)
}

export async function scheduleBroadcast(id: number, when: Date): Promise<void> {
  await db
    .update(broadcasts)
    .set({ status: 'scheduled', scheduledAt: when, updatedAt: new Date() })
    .where(eq(broadcasts.id, id))
}

// ---------------------------------------------------------------------------
// Дренер очереди
// ---------------------------------------------------------------------------
type ClaimedRow = { id: number; user_id: number; tg_user_id: number }

async function claimBatch(broadcastId: number, limit: number): Promise<ClaimedRow[]> {
  // Берём свежие pending + «зависшие» processing (claimed > 3 мин назад).
  // FOR UPDATE SKIP LOCKED делает claim безопасным при параллельных тиках.
  const rows = await db.execute(sql`
    update broadcast_recipients r set status = 'processing', sent_at = now()
    where r.id in (
      select id from broadcast_recipients
      where broadcast_id = ${broadcastId}
        and (status = 'pending' or (status = 'processing' and sent_at < now() - interval '3 minutes'))
      order by id
      limit ${limit}
      for update skip locked
    )
    returning r.id, r.user_id, r.tg_user_id`)
  return (rows as unknown as ClaimedRow[]).map((r) => ({
    id: Number(r.id),
    user_id: Number(r.user_id),
    tg_user_id: Number(r.tg_user_id),
  }))
}

function buildKeyboard(buttons: BroadcastButton[] | null | undefined): InlineKeyboard | undefined {
  if (!buttons || buttons.length === 0) return undefined
  const kb = new InlineKeyboard()
  buttons.forEach((b, i) => {
    kb.url(b.text, b.url)
    if (i < buttons.length - 1) kb.row()
  })
  return kb
}

async function sendOne(
  api: Api,
  tgUserId: number,
  bc: BroadcastRow,
  kb: InlineKeyboard | undefined
): Promise<void> {
  const parse_mode = bc.parseMode === 'none' ? undefined : bc.parseMode
  const base = { reply_markup: kb, parse_mode } as const
  const media = bc.media as BroadcastMedia | null
  if (media?.type === 'photo') {
    await api.sendPhoto(tgUserId, media.fileId, { caption: bc.messageText, ...base })
  } else if (media?.type === 'video') {
    await api.sendVideo(tgUserId, media.fileId, { caption: bc.messageText, ...base })
  } else if (media?.type === 'document') {
    await api.sendDocument(tgUserId, media.fileId, { caption: bc.messageText, ...base })
  } else {
    await api.sendMessage(tgUserId, bc.messageText, {
      ...base,
      link_preview_options: { is_disabled: false },
    })
  }
}

async function markRecipient(id: number, status: string, error?: string): Promise<void> {
  await db.execute(sql`
    update broadcast_recipients set status = ${status}, sent_at = now(), error = ${error ?? null}
    where id = ${id}`)
}

async function markUserBlocked(userId: number): Promise<void> {
  await db.execute(sql`
    update users set is_blocked = true, unsubscribed_at = coalesce(unsubscribed_at, now())
    where id = ${userId}`)
}

async function finalizeIfDone(id: number): Promise<void> {
  await db.execute(sql`
    update broadcasts set
      sent_count = (select count(*)::int from broadcast_recipients where broadcast_id = ${id} and status = 'sent'),
      failed_count = (select count(*)::int from broadcast_recipients where broadcast_id = ${id} and status = 'failed'),
      blocked_count = (select count(*)::int from broadcast_recipients where broadcast_id = ${id} and status = 'blocked'),
      status = case
        when (select count(*)::int from broadcast_recipients where broadcast_id = ${id} and status in ('pending','processing')) = 0
        then 'sent' else status end,
      finished_at = case
        when (select count(*)::int from broadcast_recipients where broadcast_id = ${id} and status in ('pending','processing')) = 0
        then now() else finished_at end,
      updated_at = now()
    where id = ${id} and status = 'sending'`)
}

export type TickResult = { processedBroadcasts: number; sent: number; failed: number; blocked: number }

export async function processTick(): Promise<TickResult> {
  const t0 = Date.now()
  let sent = 0
  let failed = 0
  let blocked = 0

  // 1. Запланированные, чьё время пришло → sending.
  await db.execute(sql`
    update broadcasts set status = 'sending', started_at = now(), updated_at = now()
    where status = 'scheduled' and scheduled_at <= now()`)

  // 2. Все активные рассылки.
  const sendingRows = await db.execute(
    sql`select id from broadcasts where status = 'sending' order by id`
  )
  const ids = (sendingRows as unknown as Array<{ id: number }>).map((r) => Number(r.id))

  const bot = getBot()
  for (const bid of ids) {
    await materializeRecipients(bid)
    const bc = await getBroadcast(bid)
    if (!bc) continue
    const kb = buildKeyboard(bc.buttons)

    while (Date.now() - t0 < BUDGET_MS) {
      const claimed = await claimBatch(bid, BATCH)
      if (claimed.length === 0) break
      for (const r of claimed) {
        try {
          await sendOne(bot.api, r.tg_user_id, bc, kb)
          await markRecipient(r.id, 'sent')
          sent += 1
        } catch (err) {
          const e = err as { error_code?: number; parameters?: { retry_after?: number }; message?: string }
          if (e.error_code === 403) {
            await markRecipient(r.id, 'blocked')
            await markUserBlocked(r.user_id)
            blocked += 1
          } else if (e.error_code === 429) {
            await sleep((e.parameters?.retry_after ?? 1) * 1000)
            try {
              await sendOne(bot.api, r.tg_user_id, bc, kb)
              await markRecipient(r.id, 'sent')
              sent += 1
            } catch (err2) {
              await markRecipient(r.id, 'failed', (err2 as Error)?.message?.slice(0, 200))
              failed += 1
            }
          } else {
            await markRecipient(r.id, 'failed', (e.message ?? 'error').slice(0, 200))
            failed += 1
          }
        }
        await sleep(THROTTLE_MS)
        if (Date.now() - t0 >= BUDGET_MS) break
      }
    }
    await finalizeIfDone(bid)
  }

  return { processedBroadcasts: ids.length, sent, failed, blocked }
}
