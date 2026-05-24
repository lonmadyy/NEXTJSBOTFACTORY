import 'server-only'
import { Composer, InlineKeyboard } from 'grammy'
import { BTN, WELCOME } from '../copy/ru'
import type { EntryUtm, MyContext } from '../types'

export const startComposer = new Composer<MyContext>()

function decodeStartPayload(raw: string | undefined): EntryUtm {
  const fallback: EntryUtm = { cluster: 'organic', section: 'direct', ts: Date.now() / 1000 }
  if (!raw) return fallback
  try {
    // base64url → base64
    const b64 = raw.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
    const json =
      typeof globalThis.Buffer !== 'undefined'
        ? globalThis.Buffer.from(padded, 'base64').toString('utf8')
        : globalThis.atob(padded)
    const parsed = JSON.parse(json) as { c?: string; s?: string; t?: number }
    return {
      cluster: typeof parsed.c === 'string' ? parsed.c.slice(0, 24) : 'organic',
      section: typeof parsed.s === 'string' ? parsed.s.slice(0, 32) : 'direct',
      ts: typeof parsed.t === 'number' ? parsed.t : Date.now() / 1000,
    }
  } catch {
    return fallback
  }
}

function welcomeKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text(BTN.startQuiz, 'flow:quiz:start')
    .row()
    .text(BTN.faq, 'flow:faq:menu')
}

startComposer.command('start', async (ctx) => {
  const payloadRaw = ctx.match || undefined
  const entry = decodeStartPayload(typeof payloadRaw === 'string' ? payloadRaw : undefined)

  ctx.session.entryUtm = entry

  const firstName = ctx.from?.first_name
  await ctx.reply(WELCOME(firstName), {
    reply_markup: welcomeKeyboard(),
    parse_mode: 'Markdown',
  })
})

// Когда пользователь жмёт "В меню" из любого ветка
startComposer.callbackQuery('flow:menu', async (ctx) => {
  await ctx.answerCallbackQuery()
  const firstName = ctx.from?.first_name
  try {
    await ctx.editMessageText(WELCOME(firstName), {
      reply_markup: welcomeKeyboard(),
      parse_mode: 'Markdown',
    })
  } catch {
    await ctx.reply(WELCOME(firstName), {
      reply_markup: welcomeKeyboard(),
      parse_mode: 'Markdown',
    })
  }
})
