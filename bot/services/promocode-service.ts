import 'server-only'
import { and, eq, isNull } from 'drizzle-orm'
import { customAlphabet } from 'nanoid'
import { db } from '../db/client'
import { promocodes, type PromocodeRow } from '../db/schema'

// Алфавит без 0/O/1/I/L — чтобы избежать путаницы при ручном вводе founder'ом.
const NANO_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
const NANO_LENGTH = 6
const PROMO_PREFIX = 'BF-5OFF-'

const generateSuffix = customAlphabet(NANO_ALPHABET, NANO_LENGTH)

const DEFAULT_DISCOUNT_PCT = 5
const DEFAULT_VALID_DAYS = 7

export type IssuedPromocode = {
  id: number
  code: string
  expiresAt: Date
}

export async function issuePromocode(params: {
  userId: number
  discountPct?: number
  validDays?: number
}): Promise<IssuedPromocode> {
  const discountPct = params.discountPct ?? DEFAULT_DISCOUNT_PCT
  const validDays = params.validDays ?? DEFAULT_VALID_DAYS
  const expiresAt = new Date(Date.now() + validDays * 24 * 60 * 60 * 1000)

  // Retry on collision (extremely unlikely with 30 bits entropy)
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = PROMO_PREFIX + generateSuffix()
    try {
      const [row] = await db
        .insert(promocodes)
        .values({
          code,
          userId: params.userId,
          discountPct,
          expiresAt,
        })
        .returning({ id: promocodes.id, code: promocodes.code, expiresAt: promocodes.expiresAt })
      return { id: row.id, code: row.code, expiresAt: row.expiresAt }
    } catch (err) {
      // unique constraint violation — retry
      const msg = err instanceof Error ? err.message : String(err)
      if (!msg.includes('promocodes_code_uniq')) throw err
    }
  }
  throw new Error('Failed to generate unique promocode after 5 attempts')
}

export async function findPromocodeByCode(code: string): Promise<PromocodeRow | null> {
  const [row] = await db
    .select()
    .from(promocodes)
    .where(eq(promocodes.code, code.trim().toUpperCase()))
    .limit(1)
  return row ?? null
}

export type PromocodeStatus =
  | { kind: 'active'; row: PromocodeRow }
  | { kind: 'expired'; row: PromocodeRow }
  | { kind: 'redeemed'; row: PromocodeRow }
  | { kind: 'not_found' }

export function getStatus(row: PromocodeRow | null): PromocodeStatus {
  if (!row) return { kind: 'not_found' }
  if (row.redeemedAt) return { kind: 'redeemed', row }
  if (row.expiresAt.getTime() < Date.now()) return { kind: 'expired', row }
  return { kind: 'active', row }
}

export async function redeemPromocode(params: {
  code: string
  note: string
}): Promise<PromocodeRow | null> {
  const [row] = await db
    .update(promocodes)
    .set({
      redeemedAt: new Date(),
      redeemedNote: params.note,
    })
    .where(and(eq(promocodes.code, params.code.trim().toUpperCase()), isNull(promocodes.redeemedAt)))
    .returning()
  return row ?? null
}

export async function findActiveByUserId(userId: number): Promise<PromocodeRow | null> {
  const rows = await db
    .select()
    .from(promocodes)
    .where(and(eq(promocodes.userId, userId), isNull(promocodes.redeemedAt)))
  // выбираем самый поздний по expiresAt, который ещё активен
  const now = Date.now()
  const active = rows.filter((r) => r.expiresAt.getTime() > now)
  if (active.length === 0) return null
  active.sort((a, b) => b.expiresAt.getTime() - a.expiresAt.getTime())
  return active[0]
}

export function formatExpiresAt(date: Date): string {
  // 30.05.2026 формат — лаконично, без таймзоны (Minsk = UTC+3, добавлять не нужно)
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}.${m}.${y}`
}
