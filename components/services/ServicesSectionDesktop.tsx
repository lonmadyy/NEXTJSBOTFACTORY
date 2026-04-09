'use client'

import Link from 'next/link'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ServiceMockupDesktop from '@/components/services/ServiceMockupDesktop'
import { SectionHeader, ServiceTechList } from '@/components/services/ServicesSectionShared'
import { services } from '@/components/services/servicesData'

gsap.registerPlugin(ScrollTrigger)

export default function ServicesSectionDesktop() {
  const containerRef = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const triggerElem = containerRef.current
      const wrapper = wrapperRef.current

      if (!triggerElem || !wrapper) return
      const cards = gsap.utils.toArray<HTMLElement>('.service-card')
      if (cards.length === 0) return

      const computeScrollAmount = () => {
        const firstCardWidth = cards[0]?.getBoundingClientRect().width ?? triggerElem.clientWidth
        return Math.max(0, Math.round((cards.length - 1) * firstCardWidth))
      }

      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        const tween = gsap.to(wrapper, {
          x: () => -computeScrollAmount(),
          ease: 'none',
          scrollTrigger: {
            trigger: triggerElem,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 1,
            snap: cards.length > 1 ? 1 / (cards.length - 1) : 1,
            end: () => `+=${computeScrollAmount()}`,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              gsap.set(wrapper, { x: 0 })
            },
          },
        })

        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
          gsap.set(wrapper, { clearProps: 'transform' })
        }
      })

      return () => {
        mm.revert()
      }
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      data-services-variant="desktop"
      className="relative z-20 hidden h-screen overflow-hidden bg-[#050505] text-white md:block"
    >
      <SectionHeader className="absolute left-4 top-5 z-20 md:left-20 md:top-20" />

      <div ref={wrapperRef} className="flex h-full">
        {services.map((service) => (
          <div
            key={service.id}
            data-service-card={service.id}
            className="service-card relative flex h-full w-screen shrink-0 items-center justify-center border-r border-white/5 px-20"
          >
            <div
              className={`absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br ${service.color} opacity-10 blur-[120px]`}
            />

            <div className="relative z-10 grid w-full max-w-7xl grid-cols-2 items-center gap-10 xl:gap-12">
              <div className="flex max-w-[34rem] flex-col gap-5 self-center">
                <span className="font-syne text-[10rem] font-bold leading-none text-white/5 xl:text-[12rem]">
                  {service.id}
                </span>
                <h3 className="min-h-[4.5rem] font-syne text-[5.2rem] font-bold uppercase leading-[0.9] xl:text-7xl">
                  {service.title}
                </h3>
                <p className="max-w-[30rem] font-manrope text-[1.02rem] text-neutral-400 xl:text-lg">
                  {service.description}
                </p>
                <ServiceTechList items={service.tech} />
                <Link
                  href={service.href}
                  className="mt-1 inline-flex w-fit rounded-full border border-white/15 bg-white px-6 py-3 font-manrope text-xs font-bold uppercase tracking-[0.16em] text-black transition-colors hover:bg-neutral-200"
                >
                  РџРѕРґСЂРѕР±РЅРµРµ
                </Link>
              </div>

              <div className="relative mx-auto aspect-square w-full max-w-none overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-20`} />
                <ServiceMockupDesktop kind={service.mockup} title={service.title} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
