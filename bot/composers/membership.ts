import 'server-only'
import { Composer } from 'grammy'
import { eq, sql } from 'drizzle-orm'
import { db } from '../db/client'
import { users } from '../db/schema'
import type { MyContext } from '../types'

// Отслеживаем блокировку/разблокировку бота пользователем (my_chat_member).
// Поддерживает базу «живой» для сегментов рассылок.
export const membershipComposer = new Composer<MyContext>()

membershipComposer.on('my_chat_member', async (ctx) => {
  const upd = ctx.myChatMember
  if (!upd || upd.chat.type !== 'private') return

  const status = upd.new_chat_member.status
  const tgId = upd.from.id

  if (status === 'kicked') {
    // Пользователь заблокировал бота.
    await db
      .update(users)
      .set({ isBlocked: true, unsubscribedAt: sql`coalesce(${users.unsubscribedAt}, now())` })
      .where(eq(users.tgUserId, tgId))
  } else if (status === 'member') {
    // Пользователь разблокировал / перезапустил бота.
    await db
      .update(users)
      .set({ isBlocked: false, unsubscribedAt: null })
      .where(eq(users.tgUserId, tgId))
  }
})
