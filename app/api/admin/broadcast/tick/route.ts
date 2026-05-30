import { processTick } from '@/lib/admin/broadcast-service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// GET /api/admin/broadcast/tick
// Дренер очереди рассылок. Вызывается Vercel Cron (Authorization: Bearer CRON_SECRET)
// либо вручную с ?token=CRON_SECRET. Не требует admin-сессии (свой секрет).
export async function GET(req: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET
  if (!secret) return new Response('CRON_SECRET not set', { status: 500 })

  const auth = req.headers.get('authorization')
  const token = new URL(req.url).searchParams.get('token')
  if (auth !== `Bearer ${secret}` && token !== secret) {
    return new Response('Unauthorized', { status: 401 })
  }

  const result = await processTick()
  return Response.json({ ok: true, ...result })
}
