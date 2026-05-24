import 'server-only'
import { Composer, InlineKeyboard } from 'grammy'
import { eq } from 'drizzle-orm'
import { db } from '../db/client'
import { leads } from '../db/schema'
import { PROMOCODE_NOT_FOUND, PROMOCODE_REDEEMED_BY } from '../copy/ru'
import { CLUSTER_LABEL } from '../flows/quiz-questions'
import {
  findPromocodeByCode,
  formatExpiresAt,
  getStatus,
  redeemPromocode,
} from '../services/promocode-service'
import {
  findLatestLeadForUser,
  findLeadById,
  findUserById,
  updateLeadStatus,
} from '../services/lead-service'
import { updateNotificationStatus } from '../services/admin-notifier'
import type { MyContext } from '../types'

export const adminComposer = new Composer<MyContext>()

const ADMIN_USER_ID = Number(process.env.TG_ADMIN_USER_ID ?? '0')

function isAdmin(ctx: MyContext): boolean {
  return !!ctx.from && ctx.from.id === ADMIN_USER_ID
}

// =====================================================================
// /check BF-5OFF-XXXXXX — показывает профиль лида и статус промокода
// =====================================================================
adminComposer.command('check', async (ctx) => {
  if (!isAdmin(ctx)) return
  const code = (typeof ctx.match === 'string' ? ctx.match.trim() : '').toUpperCase()
  if (!code) {
    await ctx.reply('Использование: /check BF-5OFF-XXXXXX')
    return
  }

  const row = await findPromocodeByCode(code)
  const status = getStatus(row)

  if (status.kind === 'not_found') {
    await ctx.reply(PROMOCODE_NOT_FOUND)
    return
  }

  const user = await findUserById(status.row.userId)
  const lead = user ? await findLatestLeadForUser(user.id) : null

  const statusLabel =
    status.kind === 'active'
      ? `🟢 Активен до ${formatExpiresAt(status.row.expiresAt)}`
      : status.kind === 'expired'
        ? `🟡 Истёк ${formatExpiresAt(status.row.expiresAt)}`
        : `✅ Погашен ${status.row.redeemedAt ? formatExpiresAt(status.row.redeemedAt) : ''}`

  const lines = [
    `<b>Промокод:</b> <code>${status.row.code}</code>`,
    `<b>Скидка:</b> ${status.row.discountPct}%`,
    `<b>Статус:</b> ${statusLabel}`,
  ]
  if (user) {
    lines.push(
      '',
      `<b>Пользователь:</b> ${user.tgUsername ? '@' + user.tgUsername : '—'} (id ${user.tgUserId})`,
      `Имя: ${user.firstName ?? '—'}`
    )
  }
  if (lead) {
    lines.push(
      '',
      `<b>Лид #${lead.id}:</b> ${lead.cluster ? CLUSTER_LABEL[lead.cluster] : '—'}`,
      `Статус лида: ${lead.status}`,
      `Источник: ${lead.utmCluster ?? '—'} / ${lead.utmSection ?? '—'}`
    )
  }
  if (status.kind === 'redeemed' && status.row.redeemedNote) {
    lines.push('', `<b>Заметка:</b> ${status.row.redeemedNote}`)
  }

  await ctx.reply(lines.join('\n'), { parse_mode: 'HTML' })
})

// =====================================================================
// /redeem BF-5OFF-XXXXXX <заметка>
// =====================================================================
adminComposer.command('redeem', async (ctx) => {
  if (!isAdmin(ctx)) return
  const raw = typeof ctx.match === 'string' ? ctx.match.trim() : ''
  if (!raw) {
    await ctx.reply('Использование: /redeem BF-5OFF-XXXXXX заметка о сделке')
    return
  }

  const [codeRaw, ...noteParts] = raw.split(/\s+/)
  const code = codeRaw.toUpperCase()
  const note = noteParts.join(' ') || 'без заметки'

  const row = await findPromocodeByCode(code)
  const status = getStatus(row)
  if (status.kind === 'not_found') {
    await ctx.reply(PROMOCODE_NOT_FOUND)
    return
  }
  if (status.kind === 'redeemed') {
    await ctx.reply(`Промокод уже погашен ${formatExpiresAt(status.row.redeemedAt!)}.`)
    return
  }

  const updated = await redeemPromocode({ code, note })
  if (!updated) {
    await ctx.reply('Не удалось погасить промокод.')
    return
  }

  await ctx.reply(`✅ ${PROMOCODE_REDEEMED_BY(note)}\n<code>${updated.code}</code>`, {
    parse_mode: 'HTML',
  })

  // Обновляем статус лида на won + редактируем admin-уведомление
  const user = await findUserById(updated.userId)
  if (user) {
    const lead = await findLatestLeadForUser(user.id)
    if (lead) {
      await updateLeadStatus(lead.id, 'won')
      await updateNotificationStatus(ctx.api, {
        leadId: lead.id,
        tgUserId: user.tgUserId,
        newStatusLabel: 'погашен ✅',
        promocodeId: updated.id,
      })
    }
  }
})

// =====================================================================
// Inline-кнопки админ-уведомления: archive, redeem (force-reply)
// =====================================================================
adminComposer.callbackQuery(/^admin:archive:(\d+)$/, async (ctx) => {
  if (!isAdmin(ctx)) {
    await ctx.answerCallbackQuery({ text: 'Только для админа', show_alert: true })
    return
  }
  const leadId = Number(ctx.match?.[1])
  await updateLeadStatus(leadId, 'archived')
  await ctx.answerCallbackQuery({ text: 'Архивировано' })
  try {
    await ctx.editMessageReplyMarkup({
      reply_markup: new InlineKeyboard().text('📦 Статус: архив', 'admin:noop'),
    })
  } catch {}
})

adminComposer.callbackQuery(/^admin:redeem:(\d+)$/, async (ctx) => {
  if (!isAdmin(ctx)) {
    await ctx.answerCallbackQuery({ text: 'Только для админа', show_alert: true })
    return
  }
  const promocodeId = Number(ctx.match?.[1])
  ctx.session.pendingRedeemPromocodeId = promocodeId
  await ctx.answerCallbackQuery()
  await ctx.reply('Пришлите заметку о сделке (одним сообщением) — погашу промокод.', {
    reply_markup: { force_reply: true, selective: true },
  })
})

// Обработка force-reply ответа админа на запрос заметки
adminComposer.on('message:text', async (ctx, next) => {
  if (!isAdmin(ctx)) return next()
  const pendingId = ctx.session.pendingRedeemPromocodeId
  if (!pendingId) return next()
  const note = ctx.message.text.trim()
  if (!note) return next()

  // Найти промокод по id и погасить
  // (используем direct db чтобы не плодить helper)
  const [{ promocodes }] = [{ promocodes: (await import('../db/schema')).promocodes }]
  const [row] = await db.select().from(promocodes).where(eq(promocodes.id, pendingId)).limit(1)
  if (!row) {
    await ctx.reply('Промокод не найден.')
    ctx.session.pendingRedeemPromocodeId = undefined
    return
  }
  if (row.redeemedAt) {
    await ctx.reply('Уже погашен.')
    ctx.session.pendingRedeemPromocodeId = undefined
    return
  }
  await db
    .update(promocodes)
    .set({ redeemedAt: new Date(), redeemedNote: note })
    .where(eq(promocodes.id, pendingId))

  // Обновить лида
  const user = await findUserById(row.userId)
  if (user) {
    const lead = await findLatestLeadForUser(user.id)
    if (lead) {
      await updateLeadStatus(lead.id, 'won')
      await updateNotificationStatus(ctx.api, {
        leadId: lead.id,
        tgUserId: user.tgUserId,
        newStatusLabel: 'погашен ✅',
        promocodeId: pendingId,
      })
    }
  }

  ctx.session.pendingRedeemPromocodeId = undefined
  await ctx.reply(`✅ Промокод <code>${row.code}</code> погашен. Заметка: ${note}`, {
    parse_mode: 'HTML',
  })
})

adminComposer.callbackQuery('admin:noop', async (ctx) => {
  await ctx.answerCallbackQuery()
})
