'use client'

import Link from 'next/link'
import ServiceMockupMobile from '@/components/services/ServiceMockupMobile'
import { SectionHeader, ServiceTechList } from '@/components/services/ServicesSectionShared'
import { services } from '@/components/services/servicesData'

export default function ServicesSectionMobile() {
  return (
    <section data-services-variant="mobile" className="relative z-20 bg-[#050505] px-4 py-20 text-white md:hidden">
      <div className="mx-auto max-w-7xl">
        <SectionHeader />

        <div className="mt-8 space-y-5">
          {services.map((service) => (
            <article
              key={service.id}
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
            >
              <div
                className={`pointer-events-none absolute right-0 top-0 h-56 w-56 -translate-y-1/3 translate-x-1/3 rounded-full bg-gradient-to-br ${service.color} opacity-20 blur-[72px]`}
              />

              <div className="relative z-10 grid grid-cols-1 gap-5">
                <div className="flex flex-col gap-4">
                  <span className="h-10 font-syne text-6xl font-bold leading-none text-white/5">
                    {service.id}
                  </span>
                  <h3 className="font-syne text-[2rem] font-bold uppercase leading-[0.96] text-white">
                    {service.title}
                  </h3>
                  <p className="font-manrope text-sm leading-relaxed text-neutral-400">
                    {service.description}
                  </p>
                  <ServiceTechList items={service.tech} compact />
                  <Link
                    href={service.href}
                    className="inline-flex w-fit rounded-full border border-white/15 bg-white px-5 py-2.5 font-manrope text-[10px] font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-neutral-200"
                  >
                    РџРѕРґСЂРѕР±РЅРµРµ
                  </Link>
                </div>

                <div className="relative mx-auto aspect-[0.94] w-full max-w-[16.5rem] overflow-hidden rounded-[1.65rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-[1px] shadow-[0_18px_48px_rgba(0,0,0,0.24)]">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-16`} />
                  <div className="relative h-full w-full overflow-hidden rounded-[1.58rem] bg-[#060606]/92 p-2 backdrop-blur-xl">
                    <ServiceMockupMobile kind={service.mockup} title={service.title} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
