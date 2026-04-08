type AnalyticsValue = string | number | boolean | null | undefined

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      params?: Record<string, AnalyticsValue>
    ) => void
  }
}

export function trackEvent(
  name: string,
  params?: Record<string, AnalyticsValue>
): void {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return

  window.gtag('event', name, params)
}

