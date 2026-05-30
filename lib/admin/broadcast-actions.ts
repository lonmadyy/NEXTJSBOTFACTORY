'use server'
import { after } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAdminApi } from './guard'
import { logAudit } from './audit'
import {
  cancelBroadcast,
  createBroadcast,
  processTick,
  scheduleBroadcast,
  startBroadcast,
} from './broadcast-service'
import { countSegment, type SegmentParams } from './segments'
import type { BroadcastButton, BroadcastMedia, BroadcastSegmentType } from '@/bot/db/schema'

export type CreateBroadcastInput = {
  title: string
  messageText: string
  parseMode: 'HTML' | 'MarkdownV2' | 'none'
  media: BroadcastMedia | null
  buttons: BroadcastButton[]
  segmentType: BroadcastSegmentType
  segmentParams: SegmentParams
  mode: 'draft' | 'now' | 'schedule'
  scheduledAt?: string
}

export type CreateResult = { ok: true; id: number } | { ok: false; error: string }

export async function createBroadcastAction(input: CreateBroadcastInput): Promise<CreateResult> {
  const { adminId } = await requireAdminApi()
  if (!input.title?.trim() || !input.messageText?.trim()) return { ok: false, error: 'empty' }
  if ((input.buttons ?? []).some((b) => !b.text?.trim() || !/^https?:\/\//.test(b.url))) {
    return { ok: false, error: 'bad_button' }
  }

  const bc = await createBroadcast({
    title: input.title.trim(),
    messageText: input.messageText,
    parseMode: input.parseMode,
    media: input.media,
    buttons: input.buttons ?? [],
    segmentType: input.segmentType,
    segmentParams: input.segmentParams ?? {},
    createdBy: adminId,
  })

  if (input.mode === 'now') {
    await startBroadcast(bc.id)
    // Немедленный старт без ожидания минутного крона.
    after(async () => {
      try {
        await processTick()
      } catch (err) {
        console.error('[broadcast tick after]', err)
      }
    })
  } else if (input.mode === 'schedule') {
    const when = input.scheduledAt ? new Date(input.scheduledAt) : null
    if (!when || Number.isNaN(when.getTime())) return { ok: false, error: 'bad_date' }
    await scheduleBroadcast(bc.id, when)
  }

  await logAudit(adminId, 'broadcast_create', 'broadcast', String(bc.id), {
    mode: input.mode,
    segment: input.segmentType,
  })
  revalidatePath('/admin/broadcasts')
  return { ok: true, id: bc.id }
}

export async function cancelBroadcastAction(id: number): Promise<{ ok: boolean }> {
  const { adminId } = await requireAdminApi()
  await cancelBroadcast(id)
  await logAudit(adminId, 'broadcast_cancel', 'broadcast', String(id))
  revalidatePath('/admin/broadcasts')
  revalidatePath(`/admin/broadcasts/${id}`)
  return { ok: true }
}

export async function countSegmentAction(
  type: BroadcastSegmentType,
  params: SegmentParams
): Promise<{ ok: boolean; count: number }> {
  await requireAdminApi()
  const count = await countSegment(type, params)
  return { ok: true, count }
}
