import 'server-only'
import { Composer, InlineKeyboard } from 'grammy'
import {
  BTN,
  PDF_CAPTION,
  PROMOCODE_LINE,
  QUIZ_INTRO,
  QUIZ_PRE_REVEAL,
  QUIZ_REVEAL_HEADER,
} from '../copy/ru'
import {
  buildAnswerLog,
  classify,
  progressLine,
  renderScoreBlock,
} from '../flows/classifier'
import { CLUSTER_HREF, CLUSTER_LABEL, QUIZ, getOption } from '../flows/quiz-questions'
import { generateReport } from '../services/grok'
import { sendLeadNotification } from '../services/admin-notifier'
import { sendChecklistPdf } from '../services/pdf-delivery'
import {
  completeQuizSession,
  createLead,
  saveQuizAnswers,
  startQuizSession,
  upsertUser,
} from '../services/lead-service'
import {
  formatExpiresAt,
  issuePromocode,
} from '../services/promocode-service'
import { siteConfig } from '@/lib/site'
import type { MyContext } from '../types'

export const quizComposer = new Composer<MyContext>()

// Сокращённые коды кластеров для callback_data (Telegram limit: 64 bytes).
const CB_QUIZ_START = 'flow:quiz:start'
const CB_QUIZ_ANSWER_PREFIX = 'q:' // q:{questionIdx}:{answerId}
const CB_REVEAL_PDF = 'reveal:pdf'

function buildQuizQuestionMarkup(questionIdx: number): InlineKeyboard {
  const q = QUIZ[questionIdx]
  const kb = new InlineKeyboard()
  for (const opt of q.options) {
    kb.text(opt.label, `${CB_QUIZ_ANSWER_PREFIX}${questionIdx}:${opt.id}`).row()
  }
  return kb
}

function renderQuestionText(questionIdx: number): string {
  const q = QUIZ[questionIdx]
  return `${progressLine(questionIdx, QUIZ.length)}\n\n*${q.text}*`
}

async function showQuestion(ctx: MyContext, questionIdx: number, edit: boolean): Promise<void> {
  const text = renderQuestionText(questionIdx)
  const keyboard = buildQuizQuestionMarkup(questionIdx)
  if (edit) {
    try {
      await ctx.editMessageText(text, { reply_markup: keyboard, parse_mode: 'Markdown' })
      return
    } catch {
      // Fall through to send if edit failed
    }
  }
  const sent = await ctx.reply(text, { reply_markup: keyboard, parse_mode: 'Markdown' })
  if (ctx.session.quiz) {
    ctx.session.quiz.promptMessageId = sent.message_id
  }
}

quizComposer.callbackQuery(CB_QUIZ_START, async (ctx) => {
  await ctx.answerCallbackQuery()
  if (!ctx.from) return

  const user = await upsertUser({
    tgUserId: ctx.from.id,
    tgUsername: ctx.from.username ?? null,
    firstName: ctx.from.first_name ?? null,
    langCode: ctx.from.language_code ?? null,
  })

  const sessionId = await startQuizSession(user.id)
  ctx.session.userId = user.id
  ctx.session.quiz = {
    sessionId,
    startedAt: Date.now(),
    questionIdx: 0,
    answers: [],
  }

  try {
    await ctx.editMessageText(QUIZ_INTRO)
  } catch {
    await ctx.reply(QUIZ_INTRO)
  }
  await showQuestion(ctx, 0, false)
})

quizComposer.callbackQuery(new RegExp(`^${CB_QUIZ_ANSWER_PREFIX}(\\d+):(.+)$`), async (ctx) => {
  await ctx.answerCallbackQuery()
  if (!ctx.session.quiz) {
    // session expired or never started — silently restart
    await ctx.answerCallbackQuery({ text: 'Сессия истекла — начнём заново' })
    return
  }

  const match = ctx.match
  if (!match) return
  const questionIdx = Number(match[1])
  const answerId = String(match[2])

  const question = QUIZ[questionIdx]
  if (!question) return
  const option = getOption(question.id, answerId)
  if (!option) return

  // Сохраняем ответ
  const entry = { questionId: question.id, answerId: option.id }
  // Замещаем если для этого вопроса уже был ответ
  const existing = ctx.session.quiz.answers.findIndex((a) => a.questionId === question.id)
  if (existing >= 0) {
    ctx.session.quiz.answers[existing] = entry
  } else {
    ctx.session.quiz.answers.push(entry)
  }

  const nextIdx = questionIdx + 1

  if (nextIdx < QUIZ.length) {
    ctx.session.quiz.questionIdx = nextIdx
    await showQuestion(ctx, nextIdx, true)
    return
  }

  // Все вопросы пройдены — reveal
  await finalizeQuiz(ctx)
})

async function finalizeQuiz(ctx: MyContext): Promise<void> {
  if (!ctx.session.quiz || !ctx.session.userId) return

  const userId = ctx.session.userId
  const sessionId = ctx.session.quiz.sessionId
  const answers = ctx.session.quiz.answers

  // Показать заглушку "считаю..."
  try {
    await ctx.editMessageText(QUIZ_PRE_REVEAL)
  } catch {
    await ctx.reply(QUIZ_PRE_REVEAL)
  }

  // Фиксируем ответы в аудит-таблице quiz_sessions
  await saveQuizAnswers(sessionId, answers).catch((err) => {
    console.error('[quiz] saveQuizAnswers failed:', err)
  })

  // Классификация
  const classification = classify(answers)
  const answerLog = buildAnswerLog(QUIZ, answers)

  // Промокод
  const promocode = await issuePromocode({ userId })

  // Лид с UTM атрибуцией
  const utm = ctx.session.entryUtm
  const lead = await createLead({
    userId,
    cluster: classification.cluster,
    scoreVector: classification.scoreVector,
    utmCluster: utm?.cluster ?? 'organic',
    utmSection: utm?.section ?? 'direct',
    promocodeId: promocode.id,
    reportText: null,
    reportSource: null,
    status: 'new',
  })

  // Закрываем quiz session (для audit)
  await completeQuizSession(sessionId, answers).catch((err) => {
    console.error('[quiz] completeQuizSession failed:', err)
  })

  // Генерация отчёта (Grok или fallback)
  const report = await generateReport({
    cluster: classification.cluster,
    scoreVector: classification.scoreVector,
    answers: answerLog,
  })

  // Обновляем лида с reportText (in-line, без отдельного метода ради простоты)
  // Минимальная запись через update лидов
  // (импорт сложно гнуть; используем direct service)
  try {
    const { db } = await import('../db/client')
    const { leads } = await import('../db/schema')
    const { eq } = await import('drizzle-orm')
    await db
      .update(leads)
      .set({ reportText: report.text, reportSource: report.source, updatedAt: new Date() })
      .where(eq(leads.id, lead.id))
  } catch (err) {
    console.error('[quiz] failed to persist report text:', err)
  }

  // Reveal в чат
  const header = QUIZ_REVEAL_HEADER(CLUSTER_LABEL[classification.cluster])
  const scoreBlock = renderScoreBlock(classification.scorePct)
  const promocodeLine = PROMOCODE_LINE(promocode.code, formatExpiresAt(promocode.expiresAt))

  const revealText = `${header}\n\n\`\`\`\n${scoreBlock}\n\`\`\`\n\n${report.text}\n\n${promocodeLine}`

  const serviceLink = `${siteConfig.url}${CLUSTER_HREF[classification.cluster]}`

  const revealKb = new InlineKeyboard()
    .text(BTN.downloadPdf, CB_REVEAL_PDF)
    .row()
    .url('🌐 Подробнее об услуге', serviceLink)
    .row()
    .url(BTN.contactFounder, `tg://user?id=${await getFounderUserId()}`)

  try {
    await ctx.editMessageText(revealText, {
      reply_markup: revealKb,
      parse_mode: 'Markdown',
    })
  } catch {
    await ctx.reply(revealText, { reply_markup: revealKb, parse_mode: 'Markdown' })
  }

  // PDF отдельным сообщением (send_document)
  if (ctx.chat) {
    await sendChecklistPdf(ctx.api, ctx.chat.id, PDF_CAPTION)
  }

  // Уведомление админа
  try {
    const { findUserById } = await import('../services/lead-service')
    const user = await findUserById(userId)
    if (user) {
      await sendLeadNotification(ctx.api, {
        lead: { ...lead, reportText: report.text, reportSource: report.source },
        user,
        promocode: {
          id: promocode.id,
          code: promocode.code,
          userId,
          discountPct: 5,
          issuedAt: new Date(),
          expiresAt: promocode.expiresAt,
          redeemedAt: null,
          redeemedNote: null,
          supersededByCodeId: null,
        },
        answersLog: answerLog,
        reportText: report.text,
      })
    }
  } catch (err) {
    console.error('[quiz] admin notification failed:', err)
  }

  // Очищаем quiz state в сессии
  ctx.session.quiz = undefined
}

quizComposer.callbackQuery(CB_REVEAL_PDF, async (ctx) => {
  await ctx.answerCallbackQuery()
  if (!ctx.chat) return
  const ok = await sendChecklistPdf(ctx.api, ctx.chat.id, PDF_CAPTION)
  if (!ok) {
    await ctx.reply('PDF временно недоступен — напишите founder, пришлём вручную.')
  }
})

async function getFounderUserId(): Promise<string> {
  // ID founder'а для tg://user?id=...
  // На MVP — берём env, на будущее можно лук-ап.
  return process.env.TG_ADMIN_USER_ID ?? '0'
}
