import { webhookCallback } from 'grammy'
import { getBot } from '@/bot'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 25 // секунд — нужно для Grok-вызова (~8с) + БД-записей

// Telegram передаёт секрет в заголовке X-Telegram-Bot-Api-Secret-Token,
// который мы устанавливаем при регистрации webhook.
const SECRET_HEADER = 'x-telegram-bot-api-secret-token'

export async function POST(req: Request): Promise<Response> {
  const expectedSecret = process.env.WEBHOOK_SECRET
  if (!expectedSecret) {
    return new Response('Webhook secret not configured', { status: 500 })
  }

  const providedSecret = req.headers.get(SECRET_HEADER)
  if (providedSecret !== expectedSecret) {
    return new Response('Unauthorized', { status: 401 })
  }

  const bot = getBot()
  const handler = webhookCallback(bot, 'std/http', {
    timeoutMilliseconds: 23_000,
    secretToken: expectedSecret,
  })

  return await handler(req)
}
