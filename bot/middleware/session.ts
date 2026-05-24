import 'server-only'
import type { StorageAdapter } from 'grammy'
import { eq, sql } from 'drizzle-orm'
import { db } from '../db/client'
import { sessions } from '../db/schema'
import type { SessionData } from '../types'

// Постгрес-адаптер для grammY session.
// Сериализация через jsonb — храним SessionData напрямую.
export class PostgresStorageAdapter implements StorageAdapter<SessionData> {
  async read(key: string): Promise<SessionData | undefined> {
    const [row] = await db
      .select({ value: sessions.value })
      .from(sessions)
      .where(eq(sessions.key, key))
      .limit(1)
    if (!row) return undefined
    return row.value as SessionData
  }

  async write(key: string, value: SessionData): Promise<void> {
    await db
      .insert(sessions)
      .values({ key, value })
      .onConflictDoUpdate({
        target: sessions.key,
        set: { value, updatedAt: sql`now()` },
      })
  }

  async delete(key: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.key, key))
  }
}

export function getInitialSession(): SessionData {
  return {}
}
