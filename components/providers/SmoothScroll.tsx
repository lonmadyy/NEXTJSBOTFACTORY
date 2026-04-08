'use client'

import { useEffect, useMemo, useState } from 'react'
import { ReactLenis, useLenis } from '@studio-freight/react-lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function createDebounced(fn: () => void, waitMs: number) {
  let timeoutId: number | undefined
  return () => {
    if (timeoutId) window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(fn, waitMs)
  }
}

function subscribe(query: MediaQueryList, listener: () => void) {
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }

  query.addListener(listener)
  return () => query.removeListener(listener)
}

function shouldUseSmoothScroll() {
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    window.matchMedia('(min-width: 768px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function LenisScrollBridge() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }

    const unsubscribeLenis = lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    const refreshRuntime = createDebounced(() => {
      lenis.resize()
      ScrollTrigger.refresh()
    }, 180)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshRuntime()
      }
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    refreshRuntime()

    window.addEventListener('resize', refreshRuntime)
    window.addEventListener('orientationchange', refreshRuntime)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      unsubscribeLenis?.()
      gsap.ticker.remove(onTick)
      window.removeEventListener('resize', refreshRuntime)
      window.removeEventListener('orientationchange', refreshRuntime)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [lenis])

  return null
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSmoothScrollEnabled, setIsSmoothScrollEnabled] = useState(false)

  useEffect(() => {
    const queries = [
      window.matchMedia('(hover: hover) and (pointer: fine)'),
      window.matchMedia('(min-width: 768px)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
    ]

    const syncCapability = () => {
      setIsSmoothScrollEnabled(shouldUseSmoothScroll())
    }

    syncCapability()
    const unsubscribers = queries.map((query) => subscribe(query, syncCapability))

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [])

  const content = useMemo(() => children, [children])

  if (!isSmoothScrollEnabled) {
    return <>{content}</>
  }

  return (
    <ReactLenis
      root
      autoRaf={false}
      options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}
    >
      <LenisScrollBridge />
      {content}
    </ReactLenis>
  )
}
