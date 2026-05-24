import 'server-only'
import type { ServiceCluster } from '../db/schema'

// Веса в порядке [web, bot, miniapp, ai]
type WeightTuple = readonly [number, number, number, number]

export type QuizOption = {
  id: string
  label: string
  w: WeightTuple
}

export type QuizQuestion = {
  id: string
  text: string
  options: readonly QuizOption[]
}

export const QUIZ: readonly QuizQuestion[] = [
  {
    id: 'goal',
    text: 'С чем поможем в первую очередь?',
    options: [
      { id: 'leads', label: 'Поток заявок не растёт', w: [3, 1, 0, 1] },
      { id: 'ops', label: 'Хочу убрать ручную рутину', w: [0, 3, 1, 3] },
      { id: 'tg', label: 'Аудитория сидит в Telegram', w: [0, 2, 3, 1] },
      { id: 'ai', label: 'Хочу внедрить AI в процесс', w: [0, 1, 1, 3] },
    ],
  },
  {
    id: 'stage',
    text: 'На каком этапе сейчас бизнес?',
    options: [
      { id: 'idea', label: 'Только запускаюсь', w: [3, 1, 1, 0] },
      { id: 'sales', label: 'Есть продажи, нужно масштаб', w: [2, 2, 1, 2] },
      { id: 'team', label: 'Команда 10+, нужны процессы', w: [1, 2, 2, 3] },
    ],
  },
  {
    id: 'channel',
    text: 'Где сейчас живут клиенты?',
    options: [
      { id: 'search', label: 'Приходят из поиска / рекламы', w: [3, 0, 0, 1] },
      { id: 'tg', label: 'Telegram + Instagram', w: [1, 3, 3, 1] },
      { id: 'b2b', label: 'B2B, прямые контакты', w: [2, 1, 0, 2] },
    ],
  },
  {
    id: 'integrations',
    text: 'Нужна связка с CRM или внутренней системой?',
    options: [
      { id: 'yes_crm', label: 'Да, amoCRM / Bitrix / 1С', w: [1, 3, 2, 2] },
      { id: 'maybe', label: 'Возможно — позже', w: [2, 1, 1, 1] },
      { id: 'no', label: 'Нет, отдельный продукт', w: [2, 1, 1, 0] },
    ],
  },
  {
    id: 'budget',
    text: 'Какой бюджет рассматриваете?',
    options: [
      { id: 'lt1k', label: 'До 1 000 BYN', w: [2, 2, 1, 1] },
      { id: '1to3k', label: '1 000 – 3 000 BYN', w: [3, 3, 2, 2] },
      { id: 'gt3k', label: 'Свыше 3 000 BYN', w: [2, 2, 3, 3] },
      { id: 'tbd', label: 'Скажите вы — я сравню', w: [1, 1, 1, 1] },
    ],
  },
  {
    id: 'deadline',
    text: 'Когда хотите запуститься?',
    options: [
      { id: 'asap', label: 'Чем раньше, тем лучше', w: [3, 3, 1, 1] },
      { id: '1mo', label: 'В течение месяца', w: [2, 2, 2, 2] },
      { id: '3mo', label: 'В горизонте 2–3 месяцев', w: [1, 1, 3, 3] },
    ],
  },
] as const

export function getQuestionById(id: string): QuizQuestion | undefined {
  return QUIZ.find((q) => q.id === id)
}

export function getOption(questionId: string, optionId: string): QuizOption | undefined {
  return getQuestionById(questionId)?.options.find((o) => o.id === optionId)
}

export const CLUSTER_LABEL: Record<ServiceCluster, string> = {
  web: 'Сайт под ключ',
  bot: 'Telegram-бот',
  miniapp: 'Telegram Mini App',
  ai: 'AI-интеграция',
}

export const CLUSTER_HREF: Record<ServiceCluster, string> = {
  web: '/services/web-development-minsk',
  bot: '/services/telegram-bots-minsk',
  miniapp: '/services/mini-apps-minsk',
  ai: '/services/ai-integration-minsk',
}
