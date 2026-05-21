'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type ConsentStatus = 'unknown' | 'granted' | 'denied'

const STORAGE_KEY = 'botfactory_consent'
const STORAGE_TS_KEY = 'botfactory_consent_ts'

type ConsentContextValue = {
  status: ConsentStatus
  grant: () => void
  deny: () => void
  reset: () => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>('unknown')

  useEffect(() => {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY)
      if (value === 'granted' || value === 'denied') {
        setStatus(value)
      }
    } catch {
      // localStorage недоступен (privacy mode, iframe) — оставляем unknown, баннер всё равно покажется в памяти
    }
  }, [])

  const persist = useCallback((next: ConsentStatus) => {
    setStatus(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
      window.localStorage.setItem(STORAGE_TS_KEY, new Date().toISOString())
    } catch {
      // см. выше — игнорируем
    }
  }, [])

  const value = useMemo<ConsentContextValue>(
    () => ({
      status,
      grant: () => persist('granted'),
      deny: () => persist('denied'),
      reset: () => persist('unknown'),
    }),
    [status, persist]
  )

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext)
  if (!ctx) {
    throw new Error('useConsent must be used within ConsentProvider')
  }
  return ctx
}
