import 'server-only'
import { InlineKeyboard, type Api } from 'grammy'
import { eq } from 'drizzle-orm'
import { db } from '../db/client'
import { adminNotifications, type LeadRow, type PromocodeRow, type UserRow } from '../db/schema'
import { BTN } from '../copy/ru'
import { CLUSTER_LABEL } from '../flows/quiz-questions'
import { formatExpiresAt } from './promocode-service'

const ADMIN_CHAT_ID = process.env.TG_ADMIN_CHAT_ID

if (!ADMIN_CHAT_ID && process.env.NODE_ENV === 'production') {
  console.warn('[admin-notifier] TG_ADMIN_CHAT_ID is not set — admin notifications disabled')
}

const CLUSTER_TO_FULL: Record<string, string> = {
  lm: 'leadmagnet',
  wb: 'web',
  bt: 'bots',
  ma: 'miniapps',
  ai: 'ai',
  tr: 'trust',
  ct: 'contact',
  organic: 'organic',
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function formatMinskTime(d: Date): string {
  // Europe/Minsk = UTC+3 (no DST since 2011)
  const minskMs = d.getTime() + 3 * 60 * 60 * 1000
  const m = new Date(minskMs)
  const dd = String(m.getUTCDate()).padStart(2, '0')
  const mm = String(m.getUTCMonth() + 1).padStart(2, '0')
  const yyyy = m.getUTCFullYear()
  const hh = String(m.getUTCHours()).padStart(2, '0')
  const min = String(m.getUTCMinutes()).padStart(2, '0')
  return `${dd}.${mm}.${yyyy} ${hh}:${min} MSK`
}

export type AdminNotificationInput = {
  lead: LeadRow
  user: UserRow
  promocode: PromocodeRow
  answersLog: Array<{ questionText: string; answerLabel: string }>
  reportText: string
}

export function buildAdminMessage(input: AdminNotificationInput): string {
  const { lead, user, promocode, answersLog, reportText } = input

  const username = user.tgUsername ? `@${user.tgUsername}` : '—'
  const userLink = `<a href="tg://user?id=${user.tgUserId}">открыть чат</a>`
  const firstName = escapeHtml(user.firstName ?? '—')

  const clusterLabel = lead.cluster ? CLUSTER_LABEL[lead.cluster] : '—'
  const sv = lead.scoreVector ?? { web: 0, bot: 0, miniapp: 0, ai: 0 }
  const total = sv.web + sv.bot + sv.miniapp + sv.ai || 1
  const pct = (n: number) => Math.round((n / total) * 100)

  const answersBlock = answersLog
    .map((a) => `• <b>${escapeHtml(a.questionText)}</b> — ${escapeHtml(a.answerLabel)}`)
    .join('\n')

  const utmCluster = lead.utmCluster ? (CLUSTER_TO_FULL[lead.utmCluster] ?? lead.utmCluster) : '—'
  const utmSection = lead.utmSection ?? '—'

  const reportPreview = escapeHtml(reportText.slice(0, 600))

  return `🔥 <b>Новый лид #${lead.id}</b>

👤 <b>Контакт:</b> ${username} · ${userLink}
   Имя: ${firstName}

🎯 <b>Классификация:</b> ${clusterLabel} (${pct(getClusterScore(sv, lead.cluster))}%)
   web ${pct(sv.web)}% · bot ${pct(sv.bot)}% · miniapp ${pct(sv.miniapp)}% · ai ${pct(sv.ai)}%

📊 <b>Ответы квиза:</b>
${answersBlock}

🎟 <b>Промокод:</b> <code>${promocode.code}</code> · до ${formatExpiresAt(promocode.expiresAt)}

📍 <b>Источник:</b> ${escapeHtml(utmCluster)} / ${escapeHtml(utmSection)}
   ${formatMinskTime(lead.createdAt)}

💬 <b>AI-резюме (${lead.reportSource ?? 'fallback'}):</b>
${reportPreview}${reportText.length > 600 ? '...' : ''}`
}

function getClusterScore(
  sv: { web: number; bot: number; miniapp: number; ai: number },
  cluster: LeadRow['cluster']
): number {
  if (!cluster) return 0
  return sv[cluster]
}

export function buildAdminKeyboard(input: {
  leadId: number
  promocodeId: number
  tgUserId: number
}): InlineKeyboard {
  return new InlineKeyboard()
    .url(BTN.adminConnect, `tg://user?id=${input.tgUserId}`)
    .text(BTN.adminArchive, `admin:archive:${input.leadId}`)
    .row()
    .text(BTN.adminRedeem, `admin:redeem:${input.promocodeId}`)
}

export async function sendLeadNotification(
  api: Api,
  input: AdminNotificationInput
): Promise<void> {
  if (!ADMIN_CHAT_ID) {
    console.warn('[admin-notifier] skipping — TG_ADMIN_CHAT_ID not set')
    return
  }

  const text = buildAdminMessage(input)
  const keyboard = buildAdminKeyboard({
    leadId: input.lead.id,
    promocodeId: input.promocode.id,
    tgUserId: input.user.tgUserId,
  })

  try {
    const sent = await api.sendMessage(ADMIN_CHAT_ID, text, {
      parse_mode: 'HTML',
      reply_markup: keyboard,
      link_preview_options: { is_disabled: true },
    })
    await db.insert(adminNotifications).values({
      leadId: input.lead.id,
      tgMessageId: sent.message_id,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin-notifier] send failed:', msg)
    await db.insert(adminNotifications).values({
      leadId: input.lead.id,
      deliveryError: msg.slice(0, 500),
    })
  }
}

export async function updateNotificationStatus(
  api: Api,
  params: { leadId: number; tgUserId: number; newStatusLabel: string; promocodeId?: number }
): Promise<void> {
  if (!ADMIN_CHAT_ID) return
  const [note] = await db
    .select()
    .from(adminNotifications)
    .where(eq(adminNotifications.leadId, params.leadId))
    .limit(1)
  if (!note?.tgMessageId) return
  try {
    await api.editMessageReplyMarkup(ADMIN_CHAT_ID, note.tgMessageId, {
      reply_markup: new InlineKeyboard().text(
        `Статус: ${params.newStatusLabel}`,
        'admin:noop'
      ),
    })
  } catch (err) {
    console.error('[admin-notifier] edit failed:', err)
  }
}
