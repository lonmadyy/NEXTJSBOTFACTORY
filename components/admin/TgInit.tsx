'use client'
import { useEffect } from 'react'

// Инициализация Telegram WebApp на любой странице панели (ready + expand),
// чтобы Mini App корректно раскрывался независимо от точки входа.
export default function TgInit() {
  useEffect(() => {
    const w = window as unknown as {
      Telegram?: { WebApp?: { ready?: () => void; expand?: () => void } }
    }
    let tries = 0
    const t = setInterval(() => {
      tries += 1
      const tg = w.Telegram?.WebApp
      if (tg) {
        try {
          tg.ready?.()
          tg.expand?.()
        } catch {
          /* вне Telegram — игнорируем */
        }
        clearInterval(t)
      } else if (tries > 30) {
        clearInterval(t)
      }
    }, 100)
    return () => clearInterval(t)
  }, [])
  return null
}
