import 'server-only'
import { db } from '@/bot/db/client'
import { adminAudit } from '@/bot/db/schema'

// Лёгкий журнал действий администратора. Ошибки логирования не должны
// ронять основное действие.
export async function logAudit(
  adminId: number,
  action: string,
  entity?: string,
  entityId?: string,
  meta?: Record<string, unknown>
): Promise<void> {
  try {
    await db.insert(adminAudit).values({ adminId, action, entity, entityId, meta })
  } catch (err) {
    console.error('[admin-audit] failed:', err)
  }
}
