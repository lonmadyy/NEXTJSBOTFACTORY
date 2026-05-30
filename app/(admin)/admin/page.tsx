'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type TgWebApp = {
  initData?: string
  ready?: () => void
  expand?: () => void
}

function waitForTelegram(): Promise<TgWebApp | null> {
  return new Promise((resolve) => {
    const w = window as unknown as { Telegram?: { WebApp?: TgWebApp } }
    if (w.Telegram?.WebApp) return resolve(w.Telegram.WebApp)
    let tries = 0
    const timer = setInterval(() => {
      tries += 1
      if (w.Telegram?.WebApp || tries > 30) {
        clearInterval(timer)
        resolve(w.Telegram?.WebApp ?? null)
      }
    }, 100)
  })
}

export default function AdminBootstrap() {
  const router = useRouter()
  const [state, setState] = useState<'loading' | 'forbidden' | 'error'>('loading')
  const [msg, setMsg] = useState('Проверяю доступ…')

  useEffect(() => {
    let cancelled = false
    async function run() {
      const tg = await waitForTelegram()
      try {
        tg?.ready?.()
        tg?.expand?.()
      } catch {
        // вне Telegram — ок, попадём в dev-bypass / ошибку
      }
      const initData = tg?.initData ?? ''
      try {
        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ initData }),
        })
        if (cancelled) return
        if (res.ok) {
          router.replace('/admin/dashboard')
          return
        }
        if (res.status === 403) {
          setState('forbidden')
          setMsg('Доступ только для администратора BOT FACTORY.')
          return
        }
        setState('error')
        setMsg('Не удалось авторизоваться. Откройте админку через бота командой /admin.')
      } catch {
        if (cancelled) return
        setState('error')
        setMsg('Сетевая ошибка. Попробуйте переоткрыть админку.')
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-2xl font-semibold tracking-tight">BOT FACTORY</div>
      {state === 'loading' && (
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      )}
      <p className={`max-w-xs text-sm ${state === 'loading' ? 'text-white/60' : 'text-white/80'}`}>
        {msg}
      </p>
      {state !== 'loading' && (
        <button
          onClick={() => location.reload()}
          className="mt-2 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
        >
          Повторить
        </button>
      )}
    </div>
  )
}
