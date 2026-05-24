import 'server-only'
import type { Context, SessionFlavor } from 'grammy'
import type { ConversationFlavor } from '@grammyjs/conversations'
import type { ScoreVector, ServiceCluster } from './db/schema'

export type EntryUtm = {
  cluster: string // 'lm' | 'wb' | 'bt' | 'ma' | 'ai' | 'tr' | 'ct' | 'organic'
  section: string
  ts: number
}

export type QuizState = {
  sessionId: number
  startedAt: number
  questionIdx: number
  answers: Array<{ questionId: string; answerId: string }>
  promptMessageId?: number
}

export type SessionData = {
  entryUtm?: EntryUtm
  quiz?: QuizState
  userId?: number // internal DB user id (cached)
  // for /redeem flow when admin uses force-reply
  pendingRedeemPromocodeId?: number
}

export type ReportInput = {
  cluster: ServiceCluster
  scoreVector: ScoreVector
  answers: Array<{ questionText: string; answerLabel: string }>
}

export type ReportOutput = {
  text: string
  source: 'grok' | 'fallback'
}

export type MyContext = Context & SessionFlavor<SessionData> & ConversationFlavor<Context>
