type AnalyticsValue = string | number | boolean | null | undefined

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'consent' | 'js',
      eventName: string | Date,
      params?: Record<string, AnalyticsValue>
    ) => void
    dataLayer?: unknown[]
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

