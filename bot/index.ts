import 'server-only'
import { Bot, session } from 'grammy'
import { adminComposer } from './composers/admin'
import { faqComposer } from './composers/faq'
import { promocodeComposer } from './composers/promocode'
import { quizComposer } from './composers/quiz'
import { startComposer } from './composers/start'
import { UNKNOWN_COMMAND } from './copy/ru'
import { attachErrorHandler } from './middleware/error-handler'
import { PostgresStorageAdapter, getInitialSession } from './middleware/session'
import type { MyContext } from './types'

let cachedBot: Bot<MyContext> | null = null

export function getBot(): Bot<MyContext> {
  if (cachedBot) return cachedBot

  const token = process.env.TG_BOT_TOKEN
  if (!token) {
    throw new Error('TG_BOT_TOKEN is not set. See SETUP.md.')
  }

  const bot = new Bot<MyContext>(token)

  bot.use(
    session({
      initial: getInitialSession,
      storage: new PostgresStorageAdapter(),
      getSessionKey: (ctx) => {
        // Используем chatId как ключ — поддерживает приватные чаты и группы
        const chatId = ctx.chat?.id ?? ctx.from?.id
        return chatId ? String(chatId) : undefined
      },
    })
  )

  // Порядок важен: admin сначала (его /redeem может ловить force-reply text),
  // затем все остальные composers, затем fallback.
  bot.use(adminComposer)
  bot.use(startComposer)
  bot.use(quizComposer)
  bot.use(faqComposer)
  bot.use(promocodeComposer)

  // Fallback — на любое неизвестное сообщение
  bot.on('message:text', async (ctx) => {
    // Если админ ответил force-reply'ем — admin composer уже отработал и пройдёт next()
    // Сюда падают только обычные неизвестные сообщения от не-админа
    if (ctx.message.text.startsWith('/')) {
      await ctx.reply(UNKNOWN_COMMAND)
    }
  })

  attachErrorHandler(bot)
  cachedBot = bot
  return bot
}

// Список команд для отображения в меню Telegram-клиента
export const BOT_COMMANDS = [
  { command: 'start', description: 'Начало — квиз или FAQ' },
  { command: 'promo', description: 'Получить промокод -5%' },
] as const

export const BOT_ADMIN_COMMANDS = [
  { command: 'start', description: 'Начало — квиз или FAQ' },
  { command: 'promo', description: 'Получить промокод -5%' },
  { command: 'admin', description: 'Открыть панель управления (admin)' },
  { command: 'check', description: 'Проверить промокод (admin)' },
  { command: 'redeem', description: 'Погасить промокод (admin)' },
] as const
