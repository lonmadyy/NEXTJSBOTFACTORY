'use client'

import { useEffect, useMemo } from 'react'
import { useScrollUiState } from '@/components/layout/ScrollUiStateProvider'

type StoryStep = {
  id: string
  code: string
  label: string
  rgb: string
}

const storySteps: StoryStep[] = [
  { id: 'hero', code: '01', label: 'Главная', rgb: '79 70 229' },
  { id: 'services', code: '02', label: 'Услуги', rgb: '14 165 233' },
  { id: 'proof', code: '03', label: 'Доверие', rgb: '16 185 129' },
  { id: 'integrations', code: '04', label: 'Интеграции', rgb: '6 182 212' },
  { id: 'workflow', code: '05', label: 'Процесс', rgb: '245 158 11' },
  { id: 'contact', code: '06', label: 'Контакты', rgb: '236 72 153' },
]

export default function ScrollStoryline() {
  const { storyActiveId: activeId, progress, isMobileStorylineVisible } = useScrollUiState()
  const globalProgress = progress / 100

  useEffect(() => {
    const step = storySteps.find((item) => item.id === activeId)
    const root = document.documentElement
    if (!step) return

    root.dataset.story = activeId
    root.style.setProperty('--story-accent-rgb', step.rgb)

    return () => {
      delete root.dataset.story
    }
  }, [activeId])

  const activeIndex = useMemo(
    () => storySteps.findIndex((step) => step.id === activeId),
    [activeId]
  )

  return (
    <>
      <div className="pointer-events-none fixed right-5 top-1/2 z-[58] hidden -translate-y-1/2 xl:flex xl:flex-col xl:items-end xl:gap-4">
        <div className="relative rounded-2xl border border-white/10 bg-black/35 px-4 py-4 backdrop-blur-xl">
          <div className="relative flex flex-col gap-3">
            <div className="absolute bottom-0 left-[10px] top-0 w-px -translate-x-1/2 bg-white/15" />
            <div
              className="absolute left-[10px] top-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white to-transparent transition-[height] duration-300"
              style={{ height: `${Math.max(10, globalProgress * 100)}%` }}
            />

            {storySteps.map((step, index) => {
              const isActive = step.id === activeId
              const isDone = index < activeIndex
              return (
                <div key={step.id} className="grid grid-cols-[20px_auto] items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 justify-self-center rounded-full border transition-all duration-300 ${
                      isActive
                        ? 'scale-125 border-transparent bg-white shadow-[0_0_22px_rgba(255,255,255,0.7)]'
                        : isDone
                          ? 'border-white/20 bg-white/80'
                          : 'border-white/25 bg-transparent'
                    }`}
                  />
                  <div className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                    <p className="font-manrope text-[10px] uppercase tracking-[0.18em] text-white/45">
                      {step.code}
                    </p>
                    <p className="font-syne text-xs uppercase tracking-[0.12em] text-white">
                      {step.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div
        data-ui="mobile-storyline"
        className={`pointer-events-none fixed left-1/2 z-[58] -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/35 px-4 py-2 backdrop-blur-xl xl:hidden ${
          isMobileStorylineVisible ? 'flex' : 'hidden'
        }`}
        style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <span className="font-manrope text-[10px] uppercase tracking-[0.16em] text-white/50">Раздел</span>
        <span className="font-syne text-xs uppercase tracking-[0.12em] text-white">
          {storySteps[activeIndex]?.label ?? 'Главная'}
        </span>
      </div>
    </>
  )
}
