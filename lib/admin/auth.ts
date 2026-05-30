import 'server-only'
import { createHmac } from 'node:crypto'

// ID администратора (единственный, кому открыт доступ в TMA-админку).
export const ADMIN_USER_ID = Number(process.env.TG_ADMIN_USER_ID ?? '0')

// Dev-обход: только на не-проде и при явном флаге — чтобы открывать UI локально
// без реального Telegram initData.
export const ADMIN_DEV_BYPASS =
  process.env.NODE_ENV !== 'production' && process.env.ADMIN_DEV_BYPASS === '1'

export type TgUser = {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

export type InitDataResult =
  | { ok: true; userId: number; user: TgUser }
  | { ok: false; reason: string }

// Валидация Telegram WebApp initData по официальному алгоритму:
// secret = HMAC_SHA256(bot_token, "WebAppData"); затем HMAC_SHA256(data_check_string, secret).
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
export function validateInitData(initData: string, maxAgeSec = 86400): InitDataResult {
  const token = process.env.TG_BOT_TOKEN
  if (!token) return { ok: false, reason: 'no_bot_token' }
  if (!initData) return { ok: false, reason: 'empty' }

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return { ok: false, reason: 'no_hash' }
  params.delete('hash')

  // data_check_string: пары key=value (значения уже URL-декодированы),
  // отсортированные по ключу и склеенные через \n.
  const dataCheckString = [...params.entries()]
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('\n')

  const secret = createHmac('sha256', 'WebAppData').update(token).digest()
  const computed = createHmac('sha256', secret).update(dataCheckString).digest('hex')
  if (computed !== hash) return { ok: false, reason: 'bad_hash' }

  const authDate = Number(params.get('auth_date') ?? '0')
  if (!authDate || Date.now() / 1000 - authDate > maxAgeSec) {
    return { ok: false, reason: 'expired' }
  }

  const userRaw = params.get('user')
  if (!userRaw) return { ok: false, reason: 'no_user' }
  let user: TgUser
  try {
    user = JSON.parse(userRaw)
  } catch {
    return { ok: false, reason: 'bad_user' }
  }
  if (!user?.id) return { ok: false, reason: 'no_user_id' }

  return { ok: true, userId: user.id, user }
}

export function isAdmin(userId: number): boolean {
  return ADMIN_USER_ID !== 0 && userId === ADMIN_USER_ID
}
