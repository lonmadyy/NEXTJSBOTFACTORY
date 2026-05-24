import { trackEvent } from '@/lib/analytics'
import { siteConfig } from '@/lib/site'

export type BotCluster =
  | 'web'
  | 'bots'
  | 'miniapps'
  | 'ai'
  | 'trust'
  | 'contact'
  | 'leadmagnet'

// Короткие коды кластеров для start payload (Telegram лимит — 64 base64url char).
const CLUSTER_CODE: Record<BotCluster, string> = {
  web: 'wb',
  bots: 'bt',
  miniapps: 'ma',
  ai: 'ai',
  trust: 'tr',
  contact: 'ct',
  leadmagnet: 'lm',
}

// Изоморфный base64url encoder. Используется и на сервере, и в клиенте
// (FloatingBotCta — 'use client'), поэтому не можем полагаться на Buffer.
function base64urlEncode(input: string): string {
  // btoa работает только с latin1, поэтому сначала кодируем UTF-8.
  // unescape(encodeURIComponent(...)) — классический трюк для UTF-8 → latin1.
  const utf8 = unescape(encodeURIComponent(input))
  const b64 = typeof btoa !== 'undefined'
    ? btoa(utf8)
    // На сервере (Node) btoa есть в global начиная с Node 16, но fallback не помешает
    : globalThis.Buffer
      ? globalThis.Buffer.from(input, 'utf8').toString('base64')
      : utf8
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function buildBotDeepLink(sectionId: string, cluster: BotCluster): string {
  const payload = {
    c: CLUSTER_CODE[cluster],
    s: sectionId.slice(0, 24),
    t: Math.floor(Date.now() / 1000),
  }
  const encoded = base64urlEncode(JSON.stringify(payload))
  return `${siteConfig.telegramUrl}?start=${encoded}`
}

export function trackBotClick(
  sectionId: string,
  ctaId: string,
  cluster: BotCluster
): void {
  trackEvent('bot_click', {
    section_id: sectionId,
    cta_id: ctaId,
    cluster,
  })
}
