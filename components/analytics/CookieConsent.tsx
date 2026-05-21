'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useConsent } from './ConsentContext'

export default function CookieConsent() {
  const { status, grant, deny } = useConsent()
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (status !== 'unknown') return
    const t = window.setTimeout(() => setVisible(true), 900)
    return () => window.clearTimeout(t)
  }, [status])

  useEffect(() => {
    if (status !== 'unknown' && visible) {
      setExiting(true)
      const t = window.setTimeout(() => setVisible(false), 280)
      return () => window.clearTimeout(t)
    }
  }, [status, visible])

  if (!visible) return null

  const handleAccept = () => grant()
  const handleDeny = () => deny()

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className={[
        'fixed inset-x-3 bottom-3 z-[100] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-md',
        'rounded-2xl border border-white/10 bg-[#0a0a0a]/85 backdrop-blur-xl',
        'shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]',
        'p-5 sm:p-6',
        'transition-all duration-300 ease-out will-change-transform',
        exiting ? 'translate-y-3 opacity-0' : 'translate-y-0 opacity-100',
        'motion-safe:animate-[cookie-rise_0.45s_cubic-bezier(0.22,1,0.36,1)_both]',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4F46E5]/30 to-transparent ring-1 ring-white/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/85"
          >
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z" />
            <circle cx="8.5" cy="10.5" r=".7" fill="currentColor" />
            <circle cx="13" cy="14" r=".7" fill="currentColor" />
            <circle cx="16" cy="9" r=".7" fill="currentColor" />
            <circle cx="10" cy="15.5" r=".7" fill="currentColor" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h2
            id="cookie-consent-title"
            className="font-syne text-[15px] font-semibold tracking-tight text-white"
          >
            Cookie & аналитика
          </h2>
          <p
            id="cookie-consent-desc"
            className="mt-1.5 text-[13px] leading-relaxed text-white/65"
          >
            Используем cookies и Google&nbsp;Analytics, чтобы понимать, какие
            страницы полезны, и улучшать сайт. Без вашего согласия аналитика не
            загружается.{' '}
            <Link
              href="/privacy"
              className="text-white/85 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white/60"
            >
              Подробнее
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
        <button
          type="button"
          onClick={handleDeny}
          className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 px-4 text-[13px] font-medium text-white/80 transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          Только необходимые
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-white px-4 text-[13px] font-semibold tracking-tight text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:flex-none"
        >
          Принять
        </button>
      </div>

      <style jsx>{`
        @keyframes cookie-rise {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}
