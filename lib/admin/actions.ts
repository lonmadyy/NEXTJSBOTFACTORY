'use server'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { getBot } from '@/bot'
import { db } from '@/bot/db/client'
import { promocodes, type LeadStatus } from '@/bot/db/schema'
import { findLeadById, findUserById, updateLeadStatus } from '@/bot/services/lead-service'
import { redeemPromocode } from '@/bot/services/promocode-service'
import { updateNotificationStatus } from '@/bot/services/admin-notifier'
import { requireAdminApi } from './guard'
import { logAudit } from './audit'

export type ActionResult = { ok: true } | { ok: false; error: string }

const VALID_STATUSES: LeadStatus[] = ['new', 'contacted', 'archived', 'won', 'lost']

export async function setLeadStatusAction(leadId: number, status: LeadStatus): Promise<ActionResult> {
  const { adminId } = await requireAdminApi()
  if (!VALID_STATUSES.includes(status)) return { ok: false, error: 'bad_status' }
  await updateLeadStatus(leadId, status)
  await logAudit(adminId, 'lead_status', 'lead', String(leadId), { status })
  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${leadId}`)
  return { ok: true }
}

export async function redeemLeadAction(leadId: number, note: string): Promise<ActionResult> {
  const { adminId } = await requireAdminApi()
  const lead = await findLeadById(leadId)
  if (!lead || !lead.promocodeId) return { ok: false, error: 'no_promocode' }

  const [pc] = await db.select().from(promocodes).where(eq(promocodes.id, lead.promocodeId)).limit(1)
  if (!pc) return { ok: false, error: 'no_promocode' }
  if (pc.redeemedAt) return { ok: false, error: 'already_redeemed' }

  const updated = await redeemPromocode({ code: pc.code, note: note?.trim() || 'через админку' })
  if (!updated) return { ok: false, error: 'redeem_failed' }

  await updateLeadStatus(leadId, 'won')
  const user = await findUserById(lead.userId)
  if (user) {
    await updateNotificationStatus(getBot().api, {
      leadId,
      tgUserId: user.tgUserId,
      newStatusLabel: 'погашен ✅',
      promocodeId: updated.id,
    })
  }
  await logAudit(adminId, 'redeem', 'promocode', String(updated.id), { code: updated.code, leadId })
  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${leadId}`)
  return { ok: true }
}

export async function sendMessageAction(tgUserId: number, text: string): Promise<ActionResult> {
  const { adminId } = await requireAdminApi()
  const t = (text ?? '').trim()
  if (!t) return { ok: false, error: 'empty' }
  try {
    await getBot().api.sendMessage(tgUserId, t)
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message.slice(0, 120) : 'send_failed' }
  }
  await logAudit(adminId, 'send_message', 'user', String(tgUserId), { len: t.length })
  return { ok: true }
}
