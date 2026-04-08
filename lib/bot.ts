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

export function buildBotDeepLink(sectionId: string, cluster: BotCluster): string {
  void sectionId
  void cluster
  return siteConfig.telegramUrl
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
