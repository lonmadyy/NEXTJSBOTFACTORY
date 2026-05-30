import { NextResponse } from 'next/server'
import { ADMIN_DEV_BYPASS, ADMIN_USER_ID, isAdmin, validateInitData } from '@/lib/admin/auth'
import { sessionCookieOptions, signSession, SESSION_COOKIE } from '@/lib/admin/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/admin/auth  { initData: string }
// Валидирует Telegram initData, проверяет admin-allowlist и выставляет session-cookie.
export async function POST(req: Request): Promise<Response> {
  let initData = ''
  try {
    const body = (await req.json()) as { initData?: string }
    initData = body?.initData ?? ''
  } catch {
    // тело может быть пустым в dev-bypass
  }

  // Dev-обход (только не-прод + ADMIN_DEV_BYPASS=1).
  if (ADMIN_DEV_BYPASS && !initData) {
    const token = await signSession(ADMIN_USER_ID || 1)
    const res = NextResponse.json({ ok: true, dev: true })
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
    return res
  }

  const result = validateInitData(initData)
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 401 })
  }
  if (!isAdmin(result.userId)) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })
  }

  const token = await signSession(result.userId)
  const res = NextResponse.json({ ok: true, user: result.user })
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
  return res
}
