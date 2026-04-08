'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    id: '01',
    title: 'Consultation',
    description: 'Анализируем цели бизнеса, целевую аудиторию и технические требования проекта.',
  },
  {
    id: '02',
    title: 'Design & UX',
    description: 'Создаём детализированные прототипы и сильную визуальную концепцию продукта.',
  },
  {
    id: '03',
    title: 'Development',
    description: 'Разрабатываем на Next.js, GSAP и Python, затем тщательно тестируем результат.',
  },
  {
    id: '04',
    title: 'Launch',
    description: 'Запускаем проект, настраиваем SEO и проводим финальные проверки производительности.',
  },
  {
    id: '05',
    title: 'Support',
    description: 'Обеспечиваем мониторинг, обновления и помощь с дальнейшим масштабированием.',
  },
]

export default function ProcessSection() {
  const containerRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const lineCapRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches
      const shouldUseScrub = isDesktop
      const shouldPlayOnceOnMobile = !isDesktop
      const lineStart = isDesktop ? 'top center' : 'top 78%'
      const lineEnd = isDesktop ? 'bottom center' : 'bottom 32%'
      const lineScrub = isDesktop ? 0.5 : 0.22

      // Animate vertical line
      gsap.fromTo(
        lineRef.current,
        { height: '0%' },
        {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: lineStart,
            end: lineEnd,
            scrub: lineScrub,
            once: false,
            invalidateOnRefresh: true,
          },
        }
      )

      // Subtle glow on the moving end of the line
      gsap.to(lineCapRef.current, {
        scale: 1.18,
        opacity: 0.92,
        duration: 1.15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play pause resume pause',
        },
      })

      // Animate steps
      const stepElements = gsap.utils.toArray<HTMLElement>('.process-step')
      stepElements.forEach((step) => {
        gsap.from(step, {
          opacity: 0.2,
          x: -20,
          duration: 0.5,
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            end: 'top 40%',
            scrub: shouldUseScrub ? 0.6 : false,
            once: shouldPlayOnceOnMobile,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        })
      })
    },
    { scope: containerRef }
  )

  return (
    <section ref={containerRef} className="relative py-32 bg-[#050505] overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 md:px-10">
        <div className="mb-20 text-center">
          <h2 className="font-syne text-4xl font-bold uppercase text-white md:text-6xl">
            Workflow
          </h2>
        </div>

        <div className="relative flex flex-col gap-16 md:gap-24">
          {/* Central Line */}
          <div className="absolute left-[19px] top-0 h-full w-[2px] bg-white/10 md:left-1/2 md:-translate-x-1/2">
            <div
              ref={lineRef}
              className="relative h-full w-full bg-gradient-to-b from-[#4F46E5] to-[#06B6D4]"
            >
              <div
                ref={lineCapRef}
                className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 will-change-transform"
              >
                <span className="block h-3 w-3 rounded-full bg-[#67E8F9] shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
                <span className="absolute left-1/2 top-1/2 block h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22D3EE]/30 blur-lg" />
              </div>
            </div>
          </div>

          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`process-step relative flex flex-col gap-8 md:flex-row md:items-center ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className="ml-12 md:ml-0 md:w-1/2 md:px-12 md:text-right">
                <div className={`${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <span className="font-syne text-6xl font-bold text-white/10 md:text-8xl">
                    {step.id}
                  </span>
                  <h3 className="mt-2 font-syne text-2xl font-bold uppercase text-white md:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 font-manrope text-neutral-400">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Dot */}
              <div className="absolute left-0 top-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#050505] md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2">
                <div className="h-3 w-3 rounded-full bg-[#4F46E5]"></div>
              </div>

              {/* Empty Spacer for alternating layout */}
              <div className="hidden md:block md:w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
