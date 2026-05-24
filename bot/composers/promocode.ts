import 'server-only'
import { Composer } from 'grammy'
import { PROMOCODE_LINE, PROMOCODE_REGEN_SUCCESS } from '../copy/ru'
import { findUserByTgId } from '../services/lead-service'
import {
  findActiveByUserId,
  formatExpiresAt,
  issuePromocode,
} from '../services/promocode-service'
import type { MyContext } from '../types'

export const promocodeComposer = new Composer<MyContext>()

// /promo — пользователь запрашивает (пере)выпуск кода.
// Если активный есть — показываем его; если нет — выпускаем новый.
promocodeComposer.command('promo', async (ctx) => {
  if (!ctx.from) return
  const user = await findUserByTgId(ctx.from.id)
  if (!user) {
    await ctx.reply('Сначала нажмите /start.')
    return
  }

  const active = await findActiveByUserId(user.id)
  if (active) {
    await ctx.reply(PROMOCODE_LINE(active.code, formatExpiresAt(active.expiresAt)), {
      parse_mode: 'Markdown',
    })
    return
  }

  const issued = await issuePromocode({ userId: user.id })
  await ctx.reply(PROMOCODE_REGEN_SUCCESS(issued.code, formatExpiresAt(issued.expiresAt)), {
    parse_mode: 'Markdown',
  })
})
