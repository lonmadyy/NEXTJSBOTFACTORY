import 'server-only'
import { Composer, InlineKeyboard } from 'grammy'
import { BTN, FAQ_FOOTER_CTA, FAQ_MENU_HEADER } from '../copy/ru'
import { FAQ, getFaqEntry } from '../flows/faq-entries'
import type { MyContext } from '../types'

export const faqComposer = new Composer<MyContext>()

const CB_FAQ_MENU = 'flow:faq:menu'
const CB_FAQ_ENTRY_PREFIX = 'faq:'

function faqMenuKeyboard(): InlineKeyboard {
  const kb = new InlineKeyboard()
  for (const entry of FAQ) {
    kb.text(entry.q, `${CB_FAQ_ENTRY_PREFIX}${entry.id}`).row()
  }
  kb.text(BTN.backToMenu, 'flow:menu')
  return kb
}

function faqEntryKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text(BTN.goToQuiz, 'flow:quiz:start')
    .row()
    .text(BTN.faq, CB_FAQ_MENU)
    .row()
    .text(BTN.backToMenu, 'flow:menu')
}

faqComposer.callbackQuery(CB_FAQ_MENU, async (ctx) => {
  await ctx.answerCallbackQuery()
  try {
    await ctx.editMessageText(FAQ_MENU_HEADER, { reply_markup: faqMenuKeyboard() })
  } catch {
    await ctx.reply(FAQ_MENU_HEADER, { reply_markup: faqMenuKeyboard() })
  }
})

faqComposer.callbackQuery(new RegExp(`^${CB_FAQ_ENTRY_PREFIX}(.+)$`), async (ctx) => {
  await ctx.answerCallbackQuery()
  const id = ctx.match?.[1]
  if (!id) return
  const entry = getFaqEntry(id)
  if (!entry) return

  const text = `*${entry.q}*\n\n${entry.a}\n\n${FAQ_FOOTER_CTA}`
  try {
    await ctx.editMessageText(text, {
      reply_markup: faqEntryKeyboard(),
      parse_mode: 'Markdown',
    })
  } catch {
    await ctx.reply(text, { reply_markup: faqEntryKeyboard(), parse_mode: 'Markdown' })
  }
})
