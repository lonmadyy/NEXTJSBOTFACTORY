import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifySession, type AdminSession } from './session'

// Чтение admin-сессии из cookie (для server components / route handlers / actions).
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies()
  return verifySession(store.get(SESSION_COOKIE)?.value)
}

// Для защищённых страниц: нет сессии → редирект на bootstrap /admin.
export async function requireAdminPage(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) redirect('/admin')
  return session
}

// Для route handlers / server actions: бросает, если нет сессии.
export async function requireAdminApi(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) throw new Error('UNAUTHORIZED')
  return session
}
