import 'server-only'
import { GrammyError, HttpError, type Bot } from 'grammy'
import { ERROR_GENERIC } from '../copy/ru'
import type { MyContext } from '../types'

export function attachErrorHandler(bot: Bot<MyContext>): void {
  bot.catch(async (err) => {
    const ctx = err.ctx
    const e = err.error

    if (e instanceof GrammyError) {
      console.error(`[bot] Telegram API error for update ${ctx.update.update_id}:`, e.description)
    } else if (e instanceof HttpError) {
      console.error(`[bot] HTTP error for update ${ctx.update.update_id}:`, e.message)
    } else {
      console.error(`[bot] Unknown error for update ${ctx.update.update_id}:`, e)
    }

    // Тихо отвечаем пользователю — без stack trace, без техн. деталей
    try {
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery({ text: 'Что-то пошло не так', show_alert: false })
      } else if (ctx.chat) {
        await ctx.reply(ERROR_GENERIC)
      }
    } catch {
      // Уже всё совсем плохо — молча
    }
  })
}
