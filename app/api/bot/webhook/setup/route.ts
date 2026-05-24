import { getBot, BOT_COMMANDS } from '@/bot'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/bot/webhook/setup?token=<WEBHOOK_SECRET>
//
// Регистрирует webhook у Telegram. Запускается вручную один раз после деплоя
// (или при смене публичного URL / секрета).
//
// Также устанавливает команды бота для UI Telegram-клиента.

export async function GET(req: Request): Promise<Response> {
  const expectedSecret = process.env.WEBHOOK_SECRET
  if (!expectedSecret) {
    return Response.json({ ok: false, error: 'WEBHOOK_SECRET not set' }, { status: 500 })
  }

  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  if (token !== expectedSecret) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const publicUrl = process.env.BOT_PUBLIC_URL
  if (!publicUrl) {
    return Response.json({ ok: false, error: 'BOT_PUBLIC_URL not set' }, { status: 500 })
  }

  const bot = getBot()
  const webhookUrl = `${publicUrl.replace(/\/$/, '')}/api/bot/webhook`

  try {
    await bot.api.setWebhook(webhookUrl, {
      secret_token: expectedSecret,
      drop_pending_updates: true,
      allowed_updates: ['message', 'callback_query'],
    })
    await bot.api.setMyCommands([...BOT_COMMANDS])
    const info = await bot.api.getWebhookInfo()
    return Response.json({
      ok: true,
      webhook: webhookUrl,
      info,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return Response.json({ ok: false, error: msg }, { status: 500 })
  }
}
