'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type ServiceKind = 'web' | 'bot' | 'mini' | 'ai'

type ServiceItem = {
  id: string
  title: string
  description: string
  color: string
  tech: string[]
  href: string
  mockup: ServiceKind
}

const services: ServiceItem[] = [
  {
    id: '01',
    title: 'Websites',
    description:
      'Высокопроизводительные корпоративные сайты, лендинги и платформы для бизнеса в Минске и по всей Беларуси.',
    color: 'from-blue-600 to-cyan-400',
    tech: ['Next.js', 'React', 'Fullstack', 'SEO'],
    href: '/services/web-development-minsk',
    mockup: 'web',
  },
  {
    id: '02',
    title: 'Telegram Bots',
    description:
      'Умные боты для продаж, поддержки и автоматизации бизнеса с мультиязычностью, глубокой аналитикой и платежными интеграциями.',
    color: 'from-emerald-500 to-green-300',
    tech: ['Python', 'Node.js', 'PostgreSQL', 'Payment API'],
    href: '/services/telegram-bots-minsk',
    mockup: 'bot',
  },
  {
    id: '03',
    title: 'Mini Apps',
    description:
      'Полноценные веб-приложения внутри Telegram: e-commerce, crypto/Web3 и интерактивные игры с нативным UX/UI.',
    color: 'from-purple-600 to-pink-400',
    tech: ['Frontend', 'Backend', 'Telegram', 'WebGL'],
    href: '/services/mini-apps-minsk',
    mockup: 'mini',
  },
  {
    id: '04',
    title: 'AI Integration',
    description:
      'Внедрение GPT, Machine Learning и генерации изображений. Кастомные AI-персонажи для поддержки клиентов и автоматического создания контента.',
    color: 'from-orange-500 to-red-400',
    tech: ['OpenAI', 'PyTorch', 'Stable Diffusion', 'LLM'],
    href: '/services/ai-integration-minsk',
    mockup: 'ai',
  },
]

function ServiceMockup({
  kind,
  title,
  mobile = false,
}: {
  kind: ServiceKind
  title: string
  mobile?: boolean
}) {
  if (mobile && kind === 'web') {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#07090d] p-2.5">
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-br from-blue-500/24 via-cyan-400/16 to-transparent" />
        <div className="relative rounded-[0.95rem] border border-white/10 bg-black/35 p-2.5">
          <div className="flex items-center gap-1.5 border-b border-white/10 pb-2">
            <span className="h-2 w-2 rounded-full bg-[#fb7185]" />
            <span className="h-2 w-2 rounded-full bg-[#fbbf24]" />
            <span className="h-2 w-2 rounded-full bg-[#34d399]" />
            <div className="ml-2 h-5 flex-1 rounded-full bg-white/[0.06]" />
          </div>

          <div className="mt-2.5 grid grid-cols-[0.82fr_1.18fr] gap-2">
            <div className="space-y-2">
              <div className="h-7 rounded-lg bg-white/[0.08]" />
              <div className="h-12 rounded-lg bg-white/[0.05]" />
              <div className="h-10 rounded-lg bg-white/[0.05]" />
            </div>

            <div className="space-y-2">
              <div className="overflow-hidden rounded-[0.95rem] border border-white/10 bg-gradient-to-br from-blue-500/28 to-cyan-400/20 p-2.5">
                <p className="font-manrope text-[9px] uppercase tracking-[0.14em] text-white/55">
                  landing page
                </p>
                <h4 className="mt-1 font-syne text-sm uppercase leading-none text-white">{title}</h4>
                <div className="mt-2.5 h-2 w-14 rounded-full bg-white/30" />
                <div className="mt-1.5 h-2 w-10 rounded-full bg-white/15" />
                <div className="mt-2.5 inline-flex rounded-full border border-white/15 bg-black/20 px-2.5 py-1 font-manrope text-[8px] uppercase tracking-[0.16em] text-white/80">
                  launch
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="h-9 rounded-lg bg-white/[0.07]" />
                <div className="h-9 rounded-lg bg-white/[0.07]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (mobile && kind === 'bot') {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#07110b] p-2.5">
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-br from-emerald-500/18 via-green-400/14 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[12.2rem] flex-col rounded-[1.35rem] border border-white/10 bg-[#0a0d0f] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/18 font-syne text-sm font-bold text-emerald-200">
              B
            </div>
            <div>
              <p className="font-manrope text-[9px] uppercase tracking-[0.16em] text-white/45">bot flow</p>
              <p className="font-syne text-xs uppercase text-white">{title}</p>
            </div>
          </div>

          <div className="flex-1 space-y-2 pt-3">
            <div className="w-fit max-w-[78%] self-start break-words rounded-2xl rounded-bl-sm border border-white/5 bg-white/[0.09] px-2.5 py-2 font-manrope text-[8.5px] leading-relaxed text-white/78">
              Launching the lead quiz and qualifying the request.
            </div>
            <div className="ml-auto w-fit max-w-[72%] self-end break-words rounded-2xl rounded-br-sm bg-emerald-400/18 px-2.5 py-2 text-right font-manrope text-[8.5px] leading-relaxed text-emerald-100">
              Need a bot for leads, CRM and payment logic.
            </div>
            <div className="w-fit max-w-[82%] self-start break-words rounded-2xl rounded-bl-sm border border-white/5 bg-white/[0.09] px-2.5 py-2 font-manrope text-[8.5px] leading-relaxed text-white/78">
              Scenario approved. Integrations, analytics and launch plan are ready.
            </div>
          </div>

        </div>
      </div>
    )
  }

  if (mobile && kind === 'mini') {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#0a0710] p-2.5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(99,102,241,0.14),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(217,70,239,0.2),transparent_34%)]" />
        <div className="relative mx-auto flex h-full max-w-[10.9rem] flex-col rounded-[1.45rem] border border-white/10 bg-[#09090c] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between">
            <div className="mx-auto h-1.5 w-11 rounded-full bg-white/12" />
            <div className="absolute right-3 top-3 h-4.5 w-4.5 rounded-full border border-fuchsia-300/30 bg-fuchsia-400/20" />
          </div>

          <div className="mt-2.5 rounded-[1rem] border border-white/10 bg-white/[0.04] p-2.5">
            <p className="font-manrope text-[8px] uppercase tracking-[0.16em] text-white/42">mini app</p>
            <h4 className="mt-1 font-syne text-sm uppercase text-white">Flash Drop</h4>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-gradient-to-br from-indigo-500/30 to-blue-400/25 p-2">
                <div className="h-7 rounded-lg bg-white/10" />
                <div className="mt-2 h-1.5 w-7 rounded-full bg-white/20" />
              </div>
              <div className="rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-purple-400/24 p-2">
                <div className="h-7 rounded-lg bg-white/10" />
                <div className="mt-2 h-1.5 w-7 rounded-full bg-white/20" />
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between rounded-full border border-white/10 bg-black/35 px-3 py-1.5">
              <span className="font-manrope text-[8px] uppercase tracking-[0.14em] text-white/46">storefront</span>
              <span className="font-manrope text-[8px] uppercase tracking-[0.14em] text-fuchsia-200">live</span>
            </div>
          </div>

          <div className="mt-auto px-1 pt-2">
            <div className="grid grid-cols-4 gap-1.5 rounded-[0.85rem] border border-white/10 bg-black/40 p-1.5">
              <div className="h-3.5 rounded-md bg-white/10" />
              <div className="h-3.5 rounded-md bg-white/10" />
              <div className="h-3.5 rounded-md bg-fuchsia-400/25" />
              <div className="h-3.5 rounded-md bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (mobile && kind === 'ai') {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#120907] p-2.5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(249,115,22,0.2),transparent_26%),radial-gradient(circle_at_72%_18%,rgba(239,68,68,0.12),transparent_28%)]" />
        <div className="relative h-full rounded-[1rem] border border-white/10 bg-black/35">
          <div className="absolute left-1/2 top-[28%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-200/15 bg-orange-300/8 shadow-[0_0_32px_rgba(251,146,60,0.12)]" />
          <div className="absolute left-1/2 top-[28%] h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300/25 shadow-[0_0_18px_rgba(251,146,60,0.35)]" />

          <div className="absolute left-[18%] top-[49%] rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-manrope text-[8px] uppercase tracking-[0.14em] text-white/70">
            GPT
          </div>
          <div className="absolute right-[18%] top-[49%] rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-manrope text-[8px] uppercase tracking-[0.14em] text-white/70">
            Vision
          </div>
          <div className="absolute left-1/2 top-[58%] -translate-x-1/2 rounded-full border border-orange-300/20 bg-orange-400/16 px-2.5 py-1 font-manrope text-[8px] uppercase tracking-[0.14em] text-orange-100">
            Agent
          </div>

          <div className="absolute left-1/2 top-[34%] h-[14%] w-px -translate-x-1/2 bg-gradient-to-b from-orange-300/70 to-white/0" />
          <div className="absolute left-[28%] top-[53%] h-px w-[18%] bg-gradient-to-r from-white/0 via-white/28 to-white/0" />
          <div className="absolute right-[28%] top-[53%] h-px w-[18%] bg-gradient-to-r from-white/0 via-white/28 to-white/0" />
          <div className="absolute left-1/2 top-[57%] h-[3%] w-px -translate-x-1/2 bg-gradient-to-b from-white/18 to-orange-300/65" />

          <div className="absolute inset-x-3 bottom-3 rounded-[0.95rem] border border-white/10 bg-black/45 p-2.5 backdrop-blur-sm">
            <p className="font-manrope text-[8px] uppercase tracking-[0.16em] text-white/40">ai stack</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="h-1.5 w-[46%] rounded-full bg-white/10" />
              <div className="h-1.5 w-[24%] rounded-full bg-orange-400/30" />
            </div>
            <div className="mt-2.5 h-1.5 rounded-full bg-white/10">
              <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-orange-300 to-red-300" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'web') {
    return (
      <div className="relative h-full w-full rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.04]">
          <div className="flex items-center gap-1.5 border-b border-white/10 p-3">
            <span className="h-2 w-2 rounded-full bg-[#f97316]" />
            <span className="h-2 w-2 rounded-full bg-[#facc15]" />
            <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
            <div className="ml-2 h-6 flex-1 rounded-full border border-white/10 bg-black/40 px-3">
              <span className="font-manrope text-[10px] leading-6 text-white/45">
                /{title.toLowerCase().replace(' ', '-')}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-2 p-3">
            <div className="col-span-3 space-y-2">
              <div className="h-6 rounded-md bg-white/10" />
              <div className="h-16 rounded-md bg-white/5" />
              <div className="h-16 rounded-md bg-white/5" />
            </div>
            <div className="col-span-9 space-y-2">
              <div className="h-8 rounded-md bg-white/15" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-16 rounded-md bg-white/10" />
                <div className="h-16 rounded-md bg-white/10" />
              </div>
              <div className="h-20 rounded-md bg-gradient-to-r from-blue-500/40 to-cyan-400/30" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'bot') {
    return (
      <div className="relative h-full w-full rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22c55e]/25 text-sm font-bold text-[#86efac]">
              B
            </div>
            <div>
              <p className="font-manrope text-xs uppercase tracking-[0.14em] text-white/55">
                Telegram bot
              </p>
              <p className="font-syne text-sm uppercase text-white">{title}</p>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="w-[78%] rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2 font-manrope text-xs text-white/80">
              Запускаю квиз и подбираю тариф
            </div>
            <div className="ml-auto w-[72%] rounded-2xl rounded-br-sm bg-[#22c55e]/25 px-3 py-2 text-right font-manrope text-xs text-[#dcfce7]">
              Нужен бот для заявок и CRM
            </div>
            <div className="w-[82%] rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2 font-manrope text-xs text-white/80">
              Готово. Сценарий + интеграции + аналитика
            </div>
          </div>
          <div className="mt-4 rounded-full border border-white/10 bg-black/40 px-4 py-2">
            <p className="font-manrope text-[11px] uppercase tracking-[0.15em] text-white/45">
              message...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'mini') {
    return (
      <div className="relative h-full w-full rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.26),transparent_42%),radial-gradient(circle_at_18%_78%,rgba(59,130,246,0.2),transparent_44%)]" />
        <div className="relative mx-auto h-full w-[71%] rounded-[2rem] border border-white/15 bg-[#080808] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-6 w-20 rounded-full bg-white/10" />
            <div className="h-5 w-5 rounded-full border border-fuchsia-300/35 bg-fuchsia-400/20" />
          </div>

          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-fuchsia-500/25 blur-xl" />
            <p className="font-manrope text-[9px] uppercase tracking-[0.15em] text-white/50">
              Mini app event
            </p>
            <h4 className="mt-1 font-syne text-sm uppercase text-white">Flash Drop</h4>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-manrope text-xs text-white/80">TWA Storefront</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 font-manrope text-[9px] uppercase text-fuchsia-200">
                Live
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2">
              <div className="h-10 rounded-md bg-gradient-to-br from-purple-500/35 to-fuchsia-400/30" />
              <div className="mt-1 h-2.5 w-10 rounded bg-white/20" />
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2">
              <div className="h-10 rounded-md bg-gradient-to-br from-indigo-500/30 to-blue-400/30" />
              <div className="mt-1 h-2.5 w-12 rounded bg-white/20" />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="h-8 rounded-md border border-white/10 bg-white/10" />
            <div className="h-8 rounded-md border border-white/10 bg-white/10" />
            <div className="h-8 rounded-md border border-white/10 bg-white/10" />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-1.5 rounded-xl border border-white/10 bg-black/50 p-2">
            <div className="h-5 rounded bg-white/10" />
            <div className="h-5 rounded bg-white/10" />
            <div className="h-5 rounded bg-fuchsia-400/25" />
            <div className="h-5 rounded bg-white/10" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="relative h-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(251,146,60,0.22),transparent_40%),radial-gradient(circle_at_62%_62%,rgba(239,68,68,0.18),transparent_48%)]" />

        <div className="absolute left-1/2 top-1/2 h-[66%] w-[66%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-200/15 animate-[spin_14s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 animate-[spin_10s_linear_infinite_reverse]" />

        <div className="absolute left-[18%] top-[28%] h-3 w-3 rounded-full bg-orange-300/90 shadow-[0_0_14px_rgba(253,186,116,0.7)]" />
        <div className="absolute right-[20%] top-[30%] h-3 w-3 rounded-full bg-red-300/90 shadow-[0_0_14px_rgba(252,165,165,0.7)]" />
        <div className="absolute left-[24%] bottom-[26%] h-3 w-3 rounded-full bg-white/85 shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
        <div className="absolute right-[22%] bottom-[23%] h-3 w-3 rounded-full bg-orange-200/90 shadow-[0_0_12px_rgba(254,215,170,0.7)]" />

        <div className="absolute left-[21%] top-[30%] h-px w-[58%] bg-gradient-to-r from-orange-400/0 via-orange-300/70 to-orange-400/0" />
        <div className="absolute left-[25%] bottom-[26%] h-px w-[53%] bg-gradient-to-r from-white/0 via-white/55 to-white/0" />
        <div className="absolute left-[25%] top-[30%] h-[44%] w-px bg-gradient-to-b from-white/0 via-white/45 to-white/0" />
        <div className="absolute right-[22%] top-[30%] h-[50%] w-px bg-gradient-to-b from-red-300/0 via-red-300/70 to-red-300/0" />

        <div className="absolute left-1/2 top-1/2 w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-black/45 p-3 backdrop-blur-sm">
          <p className="font-manrope text-[10px] uppercase tracking-[0.16em] text-white/45">
            AI pipeline
          </p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <div className="rounded border border-white/10 bg-white/10 px-1.5 py-1 text-center font-manrope text-[9px] uppercase text-white/80">
              GPT
            </div>
            <div className="rounded border border-white/10 bg-white/10 px-1.5 py-1 text-center font-manrope text-[9px] uppercase text-white/80">
              Vision
            </div>
            <div className="rounded border border-orange-300/35 bg-orange-400/20 px-1.5 py-1 text-center font-manrope text-[9px] uppercase text-orange-100">
              Agent
            </div>
          </div>
          <div className="mt-2 space-y-1.5">
            <div className="h-2 rounded bg-white/15" />
            <div className="h-2 w-[88%] rounded bg-white/10" />
            <div className="h-2 w-[70%] rounded bg-gradient-to-r from-orange-400/45 to-red-400/45" />
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-orange-300 to-red-300" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <h2 className="font-syne text-base font-bold uppercase tracking-[0.2em] text-neutral-500 md:text-xl md:tracking-widest">
        Our Services
      </h2>
      <p className="mt-1.5 max-w-[13rem] font-manrope text-[10px] uppercase tracking-[0.12em] text-neutral-600 md:mt-2 md:max-w-sm md:text-xs md:tracking-[0.14em]">
        For businesses in Minsk and Belarus
      </p>
    </div>
  )
}

function ServiceTechList({
  items,
  compact = false,
}: {
  items: string[]
  compact?: boolean
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? '' : 'md:gap-3'}`}>
      {items.map((tech) => (
        <span
          key={tech}
          className={`rounded-full border border-white/10 bg-white/5 font-manrope uppercase text-white backdrop-blur-sm ${
            compact ? 'px-3 py-1.5 text-[10px] tracking-[0.12em]' : 'px-4 py-2 text-xs tracking-wider'
          }`}
        >
          {tech}
        </span>
      ))}
    </div>
  )
}

function DesktopServicesSection() {
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
                  Подробнее
                </Link>
              </div>

              <div className="relative mx-auto aspect-square w-full max-w-none overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-20`} />
                <ServiceMockup kind={service.mockup} title={service.title} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function MobileServicesSection() {
  return (
    <section className="relative z-20 bg-[#050505] px-4 py-20 text-white md:hidden">
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
                    Подробнее
                  </Link>
                </div>

                <div className="relative mx-auto aspect-[0.94] w-full max-w-[16.5rem] overflow-hidden rounded-[1.65rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-[1px] shadow-[0_18px_48px_rgba(0,0,0,0.24)]">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-16`} />
                  <div className="relative h-full w-full overflow-hidden rounded-[1.58rem] bg-[#060606]/92 p-2 backdrop-blur-xl">
                    <ServiceMockup kind={service.mockup} title={service.title} mobile />
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

export default function ServicesSection() {
  return (
    <>
      <DesktopServicesSection />
      <MobileServicesSection />
    </>
  )
}
