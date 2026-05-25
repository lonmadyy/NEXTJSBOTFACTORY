type AnalyticsValue = string | number | boolean | null | undefined

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'consent' | 'js',
      eventName: string | Date,
      params?: Record<string, AnalyticsValue>
    ) => void
    dataLayer?: unknown[]
    // Yandex Metrika global. Подключается компонентом YandexMetrika только
    // после согласия пользователя в CookieConsent.
    ym?: (
      counterId: number,
      method: 'init' | 'hit' | 'reachGoal' | 'extLink' | 'params' | 'userParams',
      ...args: unknown[]
    ) => void
  }
}

// Один вызов trackEvent отправляет событие сразу в GA4 (gtag) и в Yandex
// Metrika (ym reachGoal). Имя события используется как имя JS-цели в Метрике
// — заводи цель с тем же названием в кабинете metrika.yandex.by.
export function trackEvent(
  name: string,
  params?: Record<string, AnalyticsValue>
): void {
  if (typeof window === 'undefined') return

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }

  if (typeof window.ym === 'function') {
    const ymId = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID)
    if (Number.isFinite(ymId) && ymId > 0) {
      // reachGoal принимает имя цели + опциональные params (для интернет-магазинов).
      // Для нас name — это и есть имя цели (bot_click, sticky_cta_click и т.д.).
      window.ym(ymId, 'reachGoal', name, params)
    }
  }
}
