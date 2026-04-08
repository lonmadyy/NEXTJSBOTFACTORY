'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const SECTION_IDS = ['hero', 'services', 'proof', 'integrations', 'workflow', 'contact'] as const

type SectionId = (typeof SECTION_IDS)[number]

type ScrollUiState = {
  storyActiveId: SectionId
  ctaActiveSection: SectionId
  progress: number
  isFloatingCtaVisible: boolean
  isMobileStorylineVisible: boolean
}

const ScrollUiStateContext = createContext<ScrollUiState | null>(null)

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function ScrollUiStateProvider({ children }: { children: React.ReactNode }) {
  const [storyActiveId, setStoryActiveId] = useState<SectionId>('hero')
  const [ctaActiveSection, setCtaActiveSection] = useState<SectionId>('hero')
  const [progress, setProgress] = useState(0)
  const [isFloatingCtaVisible, setIsFloatingCtaVisible] = useState(true)
  const [isMobileStorylineVisible, setIsMobileStorylineVisible] = useState(false)

  useEffect(() => {
    let rafId = 0

    const run = () => {
      rafId = 0

      const scrollTop = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0
      setProgress(clamp(currentProgress, 0, 100))

      const sectionElements = SECTION_IDS
        .map((id) => ({ id, element: document.getElementById(id) }))
        .filter((entry): entry is { id: SectionId; element: HTMLElement } => Boolean(entry.element))
        .sort((a, b) => a.element.offsetTop - b.element.offsetTop)

      let active: SectionId = 'hero'
      const offset = window.innerHeight * 0.38

      sectionElements.forEach(({ id, element }) => {
        if (scrollTop >= element.offsetTop - offset) {
          active = id
        }
      })

      const ctaSections: SectionId[] = ['services', 'proof', 'integrations', 'workflow']
      const storylineSections: SectionId[] = ['hero', 'contact']

      setStoryActiveId(active)
      setCtaActiveSection(active)
      setIsFloatingCtaVisible(ctaSections.includes(active))
      setIsMobileStorylineVisible(storylineSections.includes(active))
    }

    const requestRun = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(run)
    }

    run()
    window.addEventListener('scroll', requestRun, { passive: true })
    window.addEventListener('resize', requestRun)
    window.addEventListener('orientationchange', requestRun)
    document.addEventListener('visibilitychange', requestRun)

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', requestRun)
      window.removeEventListener('resize', requestRun)
      window.removeEventListener('orientationchange', requestRun)
      document.removeEventListener('visibilitychange', requestRun)
    }
  }, [])

  const value = useMemo(
    () => ({
      storyActiveId,
      ctaActiveSection,
      progress,
      isFloatingCtaVisible,
      isMobileStorylineVisible,
    }),
    [storyActiveId, ctaActiveSection, progress, isFloatingCtaVisible, isMobileStorylineVisible]
  )

  return <ScrollUiStateContext.Provider value={value}>{children}</ScrollUiStateContext.Provider>
}

export function useScrollUiState() {
  const context = useContext(ScrollUiStateContext)
  if (!context) {
    throw new Error('useScrollUiState must be used within ScrollUiStateProvider')
  }

  return context
}
