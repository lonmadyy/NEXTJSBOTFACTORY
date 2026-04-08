'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  {
    id: 1,
    value: 100,
    suffix: '+',
    label: 'Завершённых проектов',
    description: 'Сайты и Telegram-боты',
  },
  {
    id: 2,
    value: 24,
    suffix: '/7',
    label: 'Поддержка и сопровождение',
    description: 'Всегда на связи',
  },
  {
    id: 3,
    label: 'География работы',
    value: 0, // Placeholder for text based value or custom logic
    customValue: 'BY / RU',
    description: 'Минск, Беларусь и удалённые проекты',
  },
]

export default function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useGSAP(
    () => {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches
      const shouldPlayOnceOnMobile = !isDesktop

      // Animate Cards Stagger
      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: isDesktop ? 'play none none reverse' : 'play none none none',
          once: shouldPlayOnceOnMobile,
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      })

      // Animate Numbers
      stats.forEach((stat, index) => {
        if (typeof stat.value === 'number' && stat.value > 0) {
          const obj = { val: 0 }
          const element = document.getElementById(`counter-${index}`)
          
          if (element) {
            gsap.to(obj, {
              val: stat.value,
              duration: 2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 75%',
              },
              onUpdate: () => {
                element.innerText = Math.floor(obj.val).toString()
              },
            })
          }
        }
      })
    },
    { scope: sectionRef }
  )

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full bg-[#050505] py-32 px-4 md:px-10"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-20 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-syne text-4xl font-bold uppercase leading-none text-white md:text-6xl">
              Trusted By <br />
              <span className="text-neutral-500">Industry Leaders</span>
            </h2>
          </div>
          <div className="max-w-xs text-right">
             <p className="font-manrope text-sm uppercase tracking-widest text-neutral-400">
              Est. 2026 / УНП HE7170411
            </p>
             <p className="font-manrope text-xs text-neutral-600 mt-2">
              Legal Entity: Shevelev Egor
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              ref={addToRefs}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors duration-500 hover:border-white/20 hover:bg-white/10"
            >
              {/* Noise Texture Overlay (Optional) */}
              <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[200px]">
                <div className="flex items-baseline gap-1">
                  {stat.customValue ? (
                     <span className="font-syne text-5xl font-bold text-white md:text-6xl">
                      {stat.customValue}
                    </span>
                  ) : (
                    <>
                      <span
                        id={`counter-${index}`}
                        className="font-syne text-6xl font-bold text-white md:text-7xl"
                      >
                        0
                      </span>
                      <span className="font-syne text-4xl font-bold text-[#4F46E5]">
                        {stat.suffix}
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="font-manrope text-lg font-bold uppercase tracking-wide text-white">
                    {stat.label}
                  </h3>
                  <p className="mt-2 font-manrope text-sm text-neutral-400">
                    {stat.description}
                  </p>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#4F46E5]/20 blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
