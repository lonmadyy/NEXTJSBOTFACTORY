import 'server-only'
import type { ScoreVector, ServiceCluster } from '../db/schema'
import { getOption, type QuizQuestion } from './quiz-questions'

const CLUSTER_ORDER: readonly ServiceCluster[] = ['web', 'bot', 'miniapp', 'ai']

// Tie-breaker priority — matches founder's ICP
const TIE_BREAKER: readonly ServiceCluster[] = ['web', 'bot', 'ai', 'miniapp']

export type ClassificationResult = {
  cluster: ServiceCluster
  scoreVector: ScoreVector
  scorePct: Record<ServiceCluster, number> // 0..100, sums to 100
}

export function classify(
  answers: Array<{ questionId: string; answerId: string }>
): ClassificationResult {
  const totals: ScoreVector = { web: 0, bot: 0, miniapp: 0, ai: 0 }

  for (const { questionId, answerId } of answers) {
    const option = getOption(questionId, answerId)
    if (!option) continue
    const [w, b, m, a] = option.w
    totals.web += w
    totals.bot += b
    totals.miniapp += m
    totals.ai += a
  }

  const sum = totals.web + totals.bot + totals.miniapp + totals.ai || 1
  const scorePct: Record<ServiceCluster, number> = {
    web: Math.round((totals.web / sum) * 100),
    bot: Math.round((totals.bot / sum) * 100),
    miniapp: Math.round((totals.miniapp / sum) * 100),
    ai: Math.round((totals.ai / sum) * 100),
  }

  // Fix rounding drift so total = 100
  const drift = 100 - (scorePct.web + scorePct.bot + scorePct.miniapp + scorePct.ai)
  if (drift !== 0) {
    // add drift to the current winner
    const winner = pickWinner(totals)
    scorePct[winner] += drift
  }

  return {
    cluster: pickWinner(totals),
    scoreVector: totals,
    scorePct,
  }
}

function pickWinner(totals: ScoreVector): ServiceCluster {
  let best = CLUSTER_ORDER[0]
  let bestScore = -Infinity
  for (const c of CLUSTER_ORDER) {
    const s = totals[c]
    if (s > bestScore) {
      bestScore = s
      best = c
    } else if (s === bestScore) {
      // tie-break by priority
      if (TIE_BREAKER.indexOf(c) < TIE_BREAKER.indexOf(best)) {
        best = c
      }
    }
  }
  return best
}

// Render visual score bar (10 cells per cluster), used in reveal
const FILLED = '▰'
const EMPTY = '▱'

export function renderScoreBar(pct: number, cells = 10): string {
  const filled = Math.max(0, Math.min(cells, Math.round((pct / 100) * cells)))
  return FILLED.repeat(filled) + EMPTY.repeat(cells - filled)
}

export function renderScoreBlock(scorePct: Record<ServiceCluster, number>): string {
  // Sort by descending pct for visual focus, winner on top
  const rows: Array<[ServiceCluster, number]> = (CLUSTER_ORDER as ServiceCluster[])
    .map((c) => [c, scorePct[c]] as [ServiceCluster, number])
    .sort((a, b) => b[1] - a[1])

  return rows
    .map(([c, p]) => `${renderScoreBar(p)}  ${String(p).padStart(2, ' ')}%  ${LABEL_SHORT[c]}`)
    .join('\n')
}

const LABEL_SHORT: Record<ServiceCluster, string> = {
  web: 'сайт',
  bot: 'бот',
  miniapp: 'mini app',
  ai: 'AI',
}

// Progress bar for in-quiz UX (Q3 of 6)
export function renderProgressBar(currentIdx: number, total: number): string {
  const done = '🟢'
  const todo = '⚪️'
  return done.repeat(currentIdx + 1) + todo.repeat(Math.max(0, total - currentIdx - 1))
}

export function progressLine(currentIdx: number, total: number): string {
  return `${renderProgressBar(currentIdx, total)}  ${currentIdx + 1} из ${total}`
}

// Used by composer to feed quiz question dict to classifier reporting
export function buildAnswerLog(
  questions: readonly QuizQuestion[],
  answers: Array<{ questionId: string; answerId: string }>
): Array<{ questionText: string; answerLabel: string }> {
  return answers.map(({ questionId, answerId }) => {
    const q = questions.find((qq) => qq.id === questionId)
    const opt = q?.options.find((o) => o.id === answerId)
    return {
      questionText: q?.text ?? questionId,
      answerLabel: opt?.label ?? answerId,
    }
  })
}
