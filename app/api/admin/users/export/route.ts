import { getAdminSession } from '@/lib/admin/guard'
import { allUsersForExport } from '@/lib/admin/queries'
import { fmtMinsk } from '@/lib/admin/labels'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function esc(v: unknown): string {
  const s = v == null ? '' : String(v)
  return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

// GET /api/admin/users/export → CSV всех пользователей (UTF-8 BOM).
export async function GET(): Promise<Response> {
  // proxy уже гардит /api/admin/*, но проверим сессию ещё раз (defense-in-depth).
  const session = await getAdminSession()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const users = await allUsersForExport()
  const header = [
    'tg_user_id',
    'tg_username',
    'first_name',
    'lang_code',
    'is_blocked',
    'created_at',
    'last_seen_at',
    'quiz_count',
    'lead_count',
  ]
  const lines = [
    header.join(','),
    ...users.map((u) =>
      [
        u.tgUserId,
        u.tgUsername ?? '',
        u.firstName ?? '',
        u.langCode ?? '',
        u.isBlocked ? '1' : '0',
        fmtMinsk(u.createdAt),
        fmtMinsk(u.lastSeenAt),
        u.quizCount,
        u.leadCount,
      ]
        .map(esc)
        .join(',')
    ),
  ]
  const csv = '﻿' + lines.join('\n')

  return new Response(csv, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="bot-users-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
