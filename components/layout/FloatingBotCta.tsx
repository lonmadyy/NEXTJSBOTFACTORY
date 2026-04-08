'use client'

import { useEffect, useMemo } from 'react'
import { buildBotDeepLink, trackBotClick } from '@/lib/bot'
import { trackEvent } from '@/lib/analytics'
import { useScrollUiState } from '@/components/layout/ScrollUiStateProvider'

type CtaMeta = {
  sectionId: string
  label: string
  benefit: string
  cluster: 'web' | 'bots' | 'miniapps' | 'ai' | 'trust' | 'contact' | 'leadmagnet'
}

const CTA_MAP: CtaMeta[] = [
  {
    sectionId: 'hero',
    label: 'Открыть бота',
    benefit: 'PDF-гайд + квиз за 2 минуты',
    cluster: 'leadmagnet',
  },
  {
    sectionId: 'services',
    label: 'Подобрать решение',
    benefit: 'Сразу покажем подходящий формат',
    cluster: 'web',
  },
  {
    sectionId: 'proof',
    label: 'Запросить кейсы',
    benefit: 'Дадим кейсы с цифрами',
    cluster: 'trust',
  },
  {
    sectionId: 'integrations',
    label: 'Проверить интеграции',
    benefit: 'Поймем связки с вашей CRM',
    cluster: 'bots',
  },
  {
    sectionId: 'workflow',
    label: 'Получить план запуска',
    benefit: 'Поэтапный roadmap в боте',
    cluster: 'ai',
  },
  {
    sectionId: 'contact',
    label: 'Получить промокод',
    benefit: 'В боте: скидка после квиза',
    cluster: 'contact',
  },
]

export default function FloatingBotCta() {
  const { ctaActiveSection: activeSection, isFloatingCtaVisible } = useScrollUiState()

  useEffect(() => {
    trackEvent('sticky_cta_view', { section_id: 'hero', cta_id: 'floating_pill' })
  }, [])

  const meta = useMemo(() => CTA_MAP.find((item) => item.sectionId === activeSection) ?? CTA_MAP[0], [activeSection])
  const href = useMemo(() => buildBotDeepLink(meta.sectionId, meta.cluster), [meta])

  if (!isFloatingCtaVisible) return null

  return (
    <div
      data-ui="floating-bot-cta"
      className="pointer-events-none fixed left-1/2 z-[62] w-[calc(100%-1.25rem)] max-w-xl -translate-x-1/2 sm:w-auto"
      style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto inline-flex w-full items-center justify-between gap-3 rounded-full border border-white/20 bg-black/65 px-4 py-3 backdrop-blur-xl transition-colors hover:border-white/35 sm:w-auto sm:px-5"
        onClick={() => {
          trackEvent('sticky_cta_click', { section_id: meta.sectionId, cta_id: 'floating_pill' })
          trackBotClick(meta.sectionId, 'floating_pill', meta.cluster)
        }}
      >
        <span className="min-w-0">
          <span className="block truncate font-manrope text-[10px] uppercase tracking-[0.15em] text-white/55">
            {meta.benefit}
          </span>
          <span className="block truncate font-manrope text-xs font-semibold uppercase tracking-[0.14em] text-white sm:text-[11px]">
            {meta.label}
          </span>
        </span>
        <span className="shrink-0 rounded-full border border-white/20 bg-white px-3 py-1 font-manrope text-[10px] font-bold uppercase tracking-[0.14em] text-black">
          В Telegram
        </span>
      </a>
    </div>
  )
}
