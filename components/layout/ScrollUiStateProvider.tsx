'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const SECTION_IDS = ['hero', 'services', 'proof', 'integrations', 'workflow', 'contact'] as const

type SectionId = (typeof SECTION_IDS)[number]

const CTA_VISIBLE_SECTION_IDS = new Set<SectionId>(['services', 'proof', 'integrations', 'workflow'])
const MOBILE_STORYLINE_SECTION_IDS = new Set<SectionId>(['hero', 'contact'])

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
  const [activeSection, setActiveSection] = useState<SectionId>('hero')
  const [progress, setProgress] = useState(0)
  const sectionEntriesRef = useRef(new Map<SectionId, IntersectionObserverEntry>())
  const sectionElementsRef = useRef<Array<{ id: SectionId; element: HTMLElement }>>([])

  useEffect(() => {
    let rafId = 0

    const updateProgress = () => {
      rafId = 0

      const scrollTop = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0
      const nextProgress = clamp(currentProgress, 0, 100)
      setProgress((previous) => (previous === nextProgress ? previous : nextProgress))
    }

    const requestProgressUpdate = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', requestProgressUpdate, { passive: true })
    window.addEventListener('resize', requestProgressUpdate)
    window.addEventListener('orientationchange', requestProgressUpdate)
    document.addEventListener('visibilitychange', requestProgressUpdate)

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', requestProgressUpdate)
      window.removeEventListener('resize', requestProgressUpdate)
      window.removeEventListener('orientationchange', requestProgressUpdate)
      document.removeEventListener('visibilitychange', requestProgressUpdate)
    }
  }, [])

  useEffect(() => {
    let rafId = 0
    const sectionEntries = sectionEntriesRef.current

    const resolveActiveSection = () => {
      rafId = 0
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const targetLine = viewportHeight * 0.42
      let bestMatch: { id: SectionId; score: number } | null = null

      SECTION_IDS.forEach((id) => {
        const entry = sectionEntries.get(id)
        if (!entry) return

        const rect = entry.boundingClientRect
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)

        if (!entry.isIntersecting || visibleHeight <= 0) return

        const visibleRatio =
          rect.height > 0 ? clamp(visibleHeight / Math.min(rect.height, viewportHeight), 0, 1) : 0
        const center = rect.top + rect.height / 2
        const proximity = 1 - clamp(Math.abs(center - targetLine) / viewportHeight, 0, 1)
        const score = visibleRatio * 0.72 + proximity * 0.28

        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { id, score }
        }
      })

      if (!bestMatch) {
        const fallbackMatch = sectionElementsRef.current.reduce<{ id: SectionId; score: number } | null>(
          (currentBest, section) => {
            const rect = section.element.getBoundingClientRect()
            const center = rect.top + rect.height / 2
            const score = -Math.abs(center - targetLine)

            if (!currentBest || score > currentBest.score) {
              return { id: section.id, score }
            }

            return currentBest
          },
          null
        )

        if (fallbackMatch) {
          bestMatch = fallbackMatch
        }
      }

      const nextActiveSection = bestMatch?.id ?? 'hero'
      setActiveSection((previous) => (previous === nextActiveSection ? previous : nextActiveSection))
    }

    const requestActiveSectionUpdate = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(resolveActiveSection)
    }

    const sectionElements = SECTION_IDS.map((id) => ({ id, element: document.getElementById(id) })).filter(
      (entry): entry is { id: SectionId; element: HTMLElement } => Boolean(entry.element)
    )

    sectionElementsRef.current = sectionElements

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id as SectionId
          sectionEntries.set(id, entry)
        })
        requestActiveSectionUpdate()
      },
      {
        threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.7, 1],
        rootMargin: '-18% 0px -30% 0px',
      }
    )

    sectionElements.forEach(({ element }) => observer.observe(element))
    requestActiveSectionUpdate()

    window.addEventListener('resize', requestActiveSectionUpdate)
    window.addEventListener('orientationchange', requestActiveSectionUpdate)
    document.addEventListener('visibilitychange', requestActiveSectionUpdate)

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      observer.disconnect()
      sectionEntries.clear()
      sectionElementsRef.current = []
      window.removeEventListener('resize', requestActiveSectionUpdate)
      window.removeEventListener('orientationchange', requestActiveSectionUpdate)
      document.removeEventListener('visibilitychange', requestActiveSectionUpdate)
    }
  }, [])

  const value = useMemo(
    () => ({
      storyActiveId: activeSection,
      ctaActiveSection: activeSection,
      progress,
      isFloatingCtaVisible: CTA_VISIBLE_SECTION_IDS.has(activeSection),
      isMobileStorylineVisible: MOBILE_STORYLINE_SECTION_IDS.has(activeSection),
    }),
    [activeSection, progress]
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
