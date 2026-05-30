// Edge-safe session helpers (jose only — без node:crypto), чтобы middleware
// мог импортировать verifySession в edge-runtime.
import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'bf_admin_session'
export const SESSION_TTL_SECONDS = 6 * 60 * 60 // 6 часов

function secretKey(): Uint8Array {
  const s = process.env.ADMIN_SESSION_SECRET
  if (!s) throw new Error('ADMIN_SESSION_SECRET is not set')
  return new TextEncoder().encode(s)
}

export type AdminSession = { adminId: number }

export async function signSession(adminId: number): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  return await new SignJWT({ adminId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_TTL_SECONDS)
    .sign(secretKey())
}

export async function verifySession(
  token: string | undefined | null
): Promise<AdminSession | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] })
    const adminId = typeof payload.adminId === 'number' ? payload.adminId : Number(payload.adminId)
    if (!adminId || Number.isNaN(adminId)) return null
    return { adminId }
  } catch {
    return null
  }
}

// Опции cookie. В dev (http://localhost) Secure+SameSite=None не выставится,
// поэтому для не-прода используем Lax без Secure.
export function sessionCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  }
}
