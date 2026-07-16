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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
        if (Math.abs(delta) > 6) {
          setIsMenuOpen(false)
        }
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
      setIsMenuOpen(false)
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

  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

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

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090909]/80 backdrop-blur-xl md:hidden">
            <div className="flex items-center justify-between px-3 py-2">
              <a
                href="#hero"
                onClick={() => setIsMenuOpen(false)}
                className="font-syne text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 [text-shadow:0_0_8px_rgba(6,182,212,0.4)]"
              >
                Bot Factory
              </a>

              <button
                type="button"
                aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-nav-panel"
                onClick={() => setIsMenuOpen((open) => !open)}
                className="-mr-1 flex h-9 w-9 items-center justify-center rounded-lg text-white/85 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
              >
                <span aria-hidden="true" className="relative block h-4 w-5">
                  <span
                    className={`absolute left-0 block h-[2px] w-5 rounded-full bg-current motion-safe:transition-transform motion-safe:duration-300 ${
                      isMenuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-1'
                    }`}
                  />
                  <span
                    className={`absolute left-0 block h-[2px] w-5 rounded-full bg-current motion-safe:transition-transform motion-safe:duration-300 ${
                      isMenuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-1'
                    }`}
                  />
                </span>
              </button>
            </div>

            <div
              id="mobile-nav-panel"
              aria-hidden={!isMenuOpen}
              className={`grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-300 motion-safe:ease-out ${
                isMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <nav className="overflow-hidden">
                <ul className="flex flex-col gap-1 px-2 pb-2">
                  {navItems.map((item) => {
                    const id = item.href.replace('#', '')
                    const isActive = activeId === id

                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          aria-current={isActive ? 'true' : undefined}
                          tabIndex={isMenuOpen ? undefined : -1}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex min-h-[44px] items-center rounded-lg px-3 font-manrope text-[13px] font-medium uppercase tracking-[0.08em] transition-colors ${
                            isActive ? 'bg-white/12 text-white' : 'text-white/65 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}
    </>
  )
}
