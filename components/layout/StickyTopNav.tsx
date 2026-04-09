'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useScrollUiState } from '@/components/layout/ScrollUiStateProvider'

const navItems = [
  { href: '#hero', label: 'Главная' },
  { href: '#services', label: 'Услуги' },
  { href: '#proof', label: 'Доверие' },
  { href: '#integrations', label: 'Интеграции' },
  { href: '#workflow', label: 'Процесс' },
  { href: '#contact', label: 'Контакты' },
]

export default function StickyTopNav() {
  const { progress, storyActiveId: activeId } = useScrollUiState()
  const [isMobileNavHidden, setIsMobileNavHidden] = useState(false)
  const desktopNavRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [pillStyle, setPillStyle] = useState({ x: 0, width: 0, opacity: 0 })

  const updateDesktopPill = useCallback(() => {
    if (window.innerWidth < 768) {
      setPillStyle((prev) => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }))
      return
    }

    const nav = desktopNavRef.current
    const activeLink = itemRefs.current[activeId]

    if (!nav || !activeLink) return

    const navRect = nav.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()

    setPillStyle({
      x: linkRect.left - navRect.left,
      width: linkRect.width,
      opacity: 1,
    })
  }, [activeId])

  useEffect(() => {
    let lastScrollY = window.scrollY
    const mobileQuery = window.matchMedia('(max-width: 767px)')

    const handleScroll = () => {
      const scrollTop = window.scrollY

      if (mobileQuery.matches) {
        const delta = scrollTop - lastScrollY
        if (scrollTop < 48) {
          setIsMobileNavHidden(false)
        } else if (delta > 6) {
          setIsMobileNavHidden(true)
        } else if (delta < -6) {
          setIsMobileNavHidden(false)
        }
      } else {
        setIsMobileNavHidden(false)
      }

      lastScrollY = scrollTop
    }

    const handleQueryChange = () => {
      lastScrollY = window.scrollY
      if (!mobileQuery.matches) {
        setIsMobileNavHidden(false)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleQueryChange)
    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', handleQueryChange)
    } else {
      mobileQuery.addListener(handleQueryChange)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleQueryChange)
      if (typeof mobileQuery.removeEventListener === 'function') {
        mobileQuery.removeEventListener('change', handleQueryChange)
      } else {
        mobileQuery.removeListener(handleQueryChange)
      }
    }
  }, [])

  useEffect(() => {
    const update = () => {
      window.requestAnimationFrame(updateDesktopPill)
    }

    update()
    document.fonts?.ready.then(update).catch(() => undefined)
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('resize', update)
    }
  }, [updateDesktopPill])

  return (
    <>
      <div className="fixed left-0 top-0 z-[60] h-[2px] w-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-[#4F46E5] via-[#06B6D4] to-[#4F46E5] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header
        className={`pointer-events-none fixed left-0 top-4 z-50 w-full px-4 transition-transform duration-300 md:px-8 md:translate-y-0 ${
          isMobileNavHidden ? '-translate-y-[calc(100%+1rem)]' : 'translate-y-0'
        }`}
      >
        <div className="pointer-events-auto mx-auto max-w-7xl">
          <div className="relative hidden items-center justify-between rounded-full border border-white/10 bg-[#090909]/70 px-4 py-2 backdrop-blur-xl md:flex md:px-6">
            <a
              href="#hero"
              className="font-syne text-xs font-bold uppercase tracking-[0.22em] text-white/90 md:text-sm"
            >
              Bot Factory
            </a>

            <nav
              ref={desktopNavRef}
              className="relative hidden items-center gap-2 md:absolute md:left-1/2 md:flex md:-translate-x-1/2"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 h-full rounded-full bg-white/12 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-[transform,width,opacity] duration-300 ease-out"
                style={{
                  width: `${pillStyle.width}px`,
                  opacity: pillStyle.opacity,
                  transform: `translateX(${pillStyle.x}px)`,
                }}
              />
              {navItems.map((item) => {
                const id = item.href.replace('#', '')
                const isActive = activeId === id

                return (
                  <a
                    ref={(node) => {
                      itemRefs.current[id] = node
                    }}
                    key={item.href}
                    href={item.href}
                    className={`relative z-[1] rounded-full px-3 py-1.5 font-manrope text-[11px] uppercase tracking-[0.16em] transition-colors ${
                      isActive ? 'text-white' : 'text-white/55 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                )
              })}
            </nav>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#090909]/72 px-2 py-1 backdrop-blur-xl md:hidden">
            <a
              href="#hero"
              className="mb-0.5 inline-flex h-5 w-full items-center justify-center rounded-md border border-white/10 bg-white/[0.03] px-2 py-0 text-center font-syne text-[8px] font-bold uppercase tracking-[0.14em] text-white/85 [text-shadow:0_0_8px_rgba(6,182,212,0.4)]"
            >
              Bot Factory
            </a>

            <nav className="grid grid-cols-6 items-center gap-x-0.5 gap-y-0">
              {navItems.map((item) => {
                const id = item.href.replace('#', '')
                const isActive = activeId === id

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex h-6 w-full items-center justify-center rounded-md px-0.5 py-0 text-center font-manrope text-[7px] uppercase tracking-[0.03em] transition-colors ${
                      isActive ? 'bg-white/12 text-white' : 'text-white/60'
                    }`}
                  >
                    {item.label}
                  </a>
                )
              })}
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}
