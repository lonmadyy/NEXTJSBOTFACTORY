import { InputFile } from 'grammy'
import { getBot } from '@/bot'
import { getAdminSession } from '@/lib/admin/guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

// POST /api/admin/upload  (multipart: file)
// Загружает медиа в чат админа один раз и возвращает Telegram file_id для
// переиспользования в рассылке (без внешнего хранилища).
export async function POST(req: Request): Promise<Response> {
  const session = await getAdminSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const chatId = process.env.TG_ADMIN_CHAT_ID
  if (!chatId) return Response.json({ ok: false, error: 'no_admin_chat' }, { status: 500 })

  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return Response.json({ ok: false, error: 'no_file' }, { status: 400 })

  const buf = Buffer.from(await file.arrayBuffer())
  const input = new InputFile(buf, file.name)
  const api = getBot().api
  const type = file.type.startsWith('image/')
    ? 'photo'
    : file.type.startsWith('video/')
      ? 'video'
      : 'document'

  try {
    let fileId: string
    if (type === 'photo') {
      const m = await api.sendPhoto(chatId, input, { caption: '📎 медиа для рассылки' })
      fileId = m.photo![m.photo!.length - 1].file_id
    } else if (type === 'video') {
      const m = await api.sendVideo(chatId, input, { caption: '📎 медиа для рассылки' })
      fileId = m.video!.file_id
    } else {
      const m = await api.sendDocument(chatId, input, { caption: '📎 медиа для рассылки' })
      fileId = m.document!.file_id
    }
    return Response.json({ ok: true, media: { type, fileId }, name: file.name })
  } catch (err) {
    return Response.json(
      { ok: false, error: (err as Error)?.message?.slice(0, 160) ?? 'upload_failed' },
      { status: 500 }
    )
  }
}
