import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/admin/session'

// Гард для админ-зоны (Next 16 proxy-конвенция, бывший middleware). Публичны:
//  - /admin            (bootstrap-страница: читает initData и делает auth-обмен)
//  - /api/admin/auth   (выставляет сессию)
//  - /api/admin/broadcast/tick (защищён отдельно через CRON_SECRET)
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Bootstrap-страница и auth-эндпоинт — без гарда.
  if (pathname === '/admin' || pathname === '/api/admin/auth') {
    return NextResponse.next()
  }
  // Cron-дренер — своя авторизация по CRON_SECRET внутри роута.
  if (pathname.startsWith('/api/admin/broadcast/tick')) {
    return NextResponse.next()
  }

  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value)
  if (session) return NextResponse.next()

  // Нет валидной сессии.
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  // Страницы → на bootstrap.
  const url = req.nextUrl.clone()
  url.pathname = '/admin'
  return NextResponse.redirect(url)
}
