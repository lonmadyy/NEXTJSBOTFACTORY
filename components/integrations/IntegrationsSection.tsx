'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const integrations = [
  'amoCRM',
  'Bitrix24',
  '1С-БИТРИКС',
  'Planfix',
  'Yclients',
  'Мой Склад',
  '1С:Enterprise',
  'OpenCart',
  'WordPress',
  'WooCommerce',
  'Webhooks',
  'REST API',
  'Google Sheets',
  'Telegram API',
  'OpenAI',
  'Stripe',
]

function createDebounced(fn: () => void, waitMs: number) {
  let timeoutId: number | undefined
  return () => {
    if (timeoutId) window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(fn, waitMs)
  }
}

const MarqueeRow = ({
  items,
  direction = 'left',
  speed = 10,
  repeatCount = 4,
  paused = false,
}: {
  items: string[]
  direction?: 'left' | 'right'
  speed?: number
  repeatCount?: number
  paused?: boolean
}) => {
  const rowRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const row = rowRef.current
      if (!row) return

      const content = row.querySelector('.marquee-content') as HTMLElement
      if (!content) return

      let tween: gsap.core.Tween | null = null
      const isLeft = direction === 'left'
      const safeRepeatCount = Math.max(2, repeatCount)

      const rebuild = () => {
        tween?.kill()
        const distance = content.scrollWidth / safeRepeatCount

        if (distance <= 0) return

        const shouldPause =
          paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (shouldPause) {
          gsap.set(content, { x: 0 })
          return
        }

        gsap.set(content, { x: isLeft ? 0 : -distance })
        const duration = distance / (speed * 20)
        tween = gsap.to(content, {
          x: isLeft ? -distance : 0,
          duration,
          ease: 'none',
          repeat: -1,
        })
      }

      const debouncedRebuild = createDebounced(rebuild, 140)
      const resizeObserver = new ResizeObserver(debouncedRebuild)
      resizeObserver.observe(row)
      resizeObserver.observe(content)

      rebuild()
      window.addEventListener('orientationchange', debouncedRebuild)
      window.addEventListener('resize', debouncedRebuild)

      return () => {
        tween?.kill()
        resizeObserver.disconnect()
        window.removeEventListener('orientationchange', debouncedRebuild)
        window.removeEventListener('resize', debouncedRebuild)
      }
    },
    { scope: rowRef, dependencies: [direction, speed, items, paused, repeatCount] }
  )

  return (
    <div
      ref={rowRef}
      className="relative flex w-full overflow-hidden whitespace-nowrap py-4"
    >
      <div className="marquee-content flex gap-5 md:gap-8">
        {Array.from({ length: Math.max(2, repeatCount) }).map((_, repeatIndex) =>
          items.map((item, index) => (
            <span
              key={`${item}-${repeatIndex}-${index}`}
              className="font-syne text-2xl font-bold uppercase text-white/20 transition-colors duration-300 hover:text-[#4F46E5] sm:text-3xl md:text-7xl"
            >
              {item}
            </span>
          ))
        )}
      </div>
    </div>
  )
}

export default function IntegrationsSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncPreferences = () => {
      setIsMobile(mobileQuery.matches)
      setPrefersReducedMotion(reducedMotionQuery.matches)
    }

    const subscribe = (query: MediaQueryList, listener: () => void) => {
      if (typeof query.addEventListener === 'function') {
        query.addEventListener('change', listener)
        return () => query.removeEventListener('change', listener)
      }

      query.addListener(listener)
      return () => query.removeListener(listener)
    }

    syncPreferences()
    const unsubscribeMobile = subscribe(mobileQuery, syncPreferences)
    const unsubscribeMotion = subscribe(reducedMotionQuery, syncPreferences)

    return () => {
      unsubscribeMobile()
      unsubscribeMotion()
    }
  }, [])

  const mobileRepeatCount = isMobile ? 2 : 4
  const firstRowSpeed = isMobile ? 3.5 : 5
  const secondRowSpeed = isMobile ? 3.2 : 5

  return (
    <section className="relative z-10 flex min-h-[50vh] flex-col justify-center overflow-hidden bg-[#050505] py-24">
      {/* Background Decor */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4F46E5]/10 blur-[120px]"></div>

      <div className="mb-16 text-center">
        <h2 className="font-syne text-xl font-bold uppercase tracking-widest text-neutral-500">
          Seamless Integrations
        </h2>
        <p className="mt-2 font-manrope text-sm text-neutral-600">
          Connecting your business with any system
        </p>
      </div>

      <div className="origin-center scale-[1.02] -rotate-1 flex flex-col gap-3 md:scale-110 md:-rotate-2 md:gap-4">
        <MarqueeRow
          items={integrations.slice(0, 8)}
          direction="left"
          speed={firstRowSpeed}
          repeatCount={mobileRepeatCount}
          paused={prefersReducedMotion}
        />
        <MarqueeRow
          items={integrations.slice(8)}
          direction="right"
          speed={secondRowSpeed}
          repeatCount={mobileRepeatCount}
          paused={prefersReducedMotion}
        />
        {!isMobile && (
          <MarqueeRow
            items={integrations.slice(0, 8)}
            direction="left"
            speed={7}
            repeatCount={4}
            paused={prefersReducedMotion}
          />
        )}
      </div>
    </section>
  )
}
