import 'server-only'
import OpenAI from 'openai'
import { CLUSTER_TITLE_FOR_GROK, FALLBACK_REPORT } from '../copy/ru'
import type { ReportInput, ReportOutput } from '../types'

const GROK_MODEL = 'grok-4-fast' // grok-4.1 non-reasoning equivalent on x.ai
const GROK_TIMEOUT_MS = 8_000
const GROK_MAX_TOKENS = 450
const GROK_TEMPERATURE = 0.6

let cachedClient: OpenAI | null = null

function getClient(): OpenAI | null {
  if (cachedClient) return cachedClient
  const apiKey = process.env.XAI_API_KEY
  if (!apiKey) return null
  cachedClient = new OpenAI({
    apiKey,
    baseURL: 'https://api.x.ai/v1',
  })
  return cachedClient
}

const SYSTEM_PROMPT = `Ты — консультант агентства BOT FACTORY (Минск, botfactory.by). Пишешь по-русски, локаль ru-BY.

Тон: уверенный, конкретный, без позы. Без SaaS-шаблонов.

Запрещены слова и фразы: «инновации», «синергия», «диджитал-трансформация», «эксперты с многолетним опытом», «архитекторы», «команда профессионалов», «лучшие практики», «уникальное предложение». Без эмодзи в начале строк. Без двух восклицаний подряд.

Цены — в BYN. Простой проект от 680 BYN, сложный — от 1960 BYN. Гарантия 2 месяца. Запуск: простой — до 1 недели, сложный — до 3 недель.

Никогда не упоминай GPT, Claude, Grok, OpenAI, Anthropic, xAI.`

function buildUserPrompt(input: ReportInput): string {
  const cluster = CLUSTER_TITLE_FOR_GROK[input.cluster]
  const answersBlock = input.answers
    .map((a) => `— ${a.questionText}: ${a.answerLabel}`)
    .join('\n')

  return `Клиент прошёл квиз. Ответы:
${answersBlock}

Рекомендованный формат по весам: ${cluster}.
Распределение баллов: web ${input.scoreVector.web} · bot ${input.scoreVector.bot} · miniapp ${input.scoreVector.miniapp} · ai ${input.scoreVector.ai}.

Сгенерируй персональную рекомендацию строго в таком формате:

1) Первый абзац (3–4 предложения): что именно подходит клиенту и почему — опираясь на его ответы. Без воды.
2) Блок "Что делаем по шагам:" — ровно 3 пункта списком (каждый максимум 15 слов).
3) Финальная строка: одно предложение про следующий шаг (созвон 15 минут или промокод).

Не упоминай конкурентов и не сравнивай. Не давай гарантий по срокам сверх "до 1 недели" / "до 3 недель".`
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return await Promise.race<T>([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`grok timeout after ${ms}ms`)), ms)
    ),
  ])
}

export async function generateReport(input: ReportInput): Promise<ReportOutput> {
  const client = getClient()

  if (!client) {
    return { text: FALLBACK_REPORT[input.cluster], source: 'fallback' }
  }

  try {
    const completion = await withTimeout(
      client.chat.completions.create({
        model: GROK_MODEL,
        temperature: GROK_TEMPERATURE,
        max_tokens: GROK_MAX_TOKENS,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(input) },
        ],
      }),
      GROK_TIMEOUT_MS
    )

    const text = completion.choices?.[0]?.message?.content?.trim()
    if (!text) {
      return { text: FALLBACK_REPORT[input.cluster], source: 'fallback' }
    }
    return { text, source: 'grok' }
  } catch (err) {
    console.error('[grok] error, using fallback:', err)
    return { text: FALLBACK_REPORT[input.cluster], source: 'fallback' }
  }
}
