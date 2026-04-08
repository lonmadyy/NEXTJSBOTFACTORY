'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import HeroScene from '@/components/3d/HeroScene'
import MagneticButton from '@/components/ui/MagneticButton'
import { buildBotDeepLink, trackBotClick } from '@/lib/bot'
import { siteConfig } from '@/lib/site'

export default function Hero() {
  const quizLeadLink = buildBotDeepLink('hero', 'leadmagnet')
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const copyResetTimeoutRef = useRef<number | null>(null)
  const emailPopoverTimeoutRef = useRef<number | null>(null)
  const [isEmailCopied, setIsEmailCopied] = useState(false)
  const [isEmailPopoverVisible, setIsEmailPopoverVisible] = useState(false)

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) {
        window.clearTimeout(copyResetTimeoutRef.current)
      }
      if (emailPopoverTimeoutRef.current) {
        window.clearTimeout(emailPopoverTimeoutRef.current)
      }
    }
  }, [])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email)
      setIsEmailCopied(true)

      if (copyResetTimeoutRef.current) {
        window.clearTimeout(copyResetTimeoutRef.current)
      }

      copyResetTimeoutRef.current = window.setTimeout(() => {
        setIsEmailCopied(false)
      }, 1800)
    } catch {
      setIsEmailCopied(false)
    }
  }

  const showEmailPopover = () => {
    if (emailPopoverTimeoutRef.current) {
      window.clearTimeout(emailPopoverTimeoutRef.current)
      emailPopoverTimeoutRef.current = null
    }
    setIsEmailPopoverVisible(true)
  }

  const hideEmailPopover = () => {
    if (emailPopoverTimeoutRef.current) {
      window.clearTimeout(emailPopoverTimeoutRef.current)
    }

    emailPopoverTimeoutRef.current = window.setTimeout(() => {
      setIsEmailPopoverVisible(false)
    }, 220)
  }

  useGSAP(
    () => {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      gsap.set(titleRef.current, { clearProps: 'opacity,transform' })
      tl.from(subtitleRef.current, {
        y: 20,
        opacity: 0,
        duration: isDesktop ? 1 : 0.8,
      }).from(
        buttonsRef.current,
        {
          y: 20,
          opacity: 0,
          duration: isDesktop ? 1 : 0.8,
        },
        isDesktop ? '-=0.8' : '-=0.55'
      )
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="relative flex h-screen-safe w-full items-center justify-center overflow-hidden bg-[#050505] md:h-screen"
    >
      <HeroScene />

      <div className="hero-content-shell relative z-10 flex w-full max-w-screen flex-col items-center px-2 text-center md:px-0">
        <h1
          ref={titleRef}
          className="hero-title font-syne text-5xl font-extrabold uppercase leading-[0.9] tracking-tighter text-white mix-blend-difference"
        >
          Architects of <br />
          <span className="bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent">
            Digital Intelligence
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="hero-subtitle mt-6 max-w-xl font-manrope text-lg font-medium uppercase tracking-widest text-neutral-400 md:mt-7"
        >
          Премиальная разработка сайтов, Telegram-ботов и AI-решений для бизнеса в Минске
        </p>

        <div className="hero-offer mt-6 w-full max-w-[740px] rounded-[20px] border border-white/35 bg-black/35 p-2 backdrop-blur-xl md:mt-8">
          <div className="hero-offer-inner flex flex-col gap-3 rounded-[16px] border border-white/10 bg-black/35 px-4 py-3 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
            <p className="hero-offer-copy font-manrope text-sm leading-snug text-white/92 md:text-[1.02rem]">
              Откройте бота: получите PDF-гайд, пройдите квиз и заберите персональный промокод на запуск.
            </p>
            <a
              href={quizLeadLink}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="interactive"
              onClick={() => trackBotClick('hero', 'quiz_pdf_promocode', 'leadmagnet')}
              className="inline-flex w-full shrink-0 items-center justify-center rounded-full border border-white/20 bg-white px-6 py-2.5 font-manrope text-xs font-extrabold uppercase tracking-[0.22em] text-black transition-colors duration-300 hover:bg-neutral-200 sm:w-auto"
            >
              В Telegram
            </a>
          </div>
        </div>

        <div
          ref={buttonsRef}
          className="hero-actions mt-6 grid w-full max-w-[760px] grid-cols-1 gap-3 md:mt-8 md:grid-cols-3 md:items-center md:gap-2"
        >
          <MagneticButton
            href="/#contact"
            className="hero-main-cta group relative justify-center bg-white px-8 py-4 font-bold uppercase tracking-[0.14em] text-black hover:bg-neutral-200 md:justify-self-end"
          >
            <span className="relative z-10">Обсудить Проект</span>
          </MagneticButton>

          <MagneticButton
            href="/services"
            className="hero-main-cta group relative justify-center border border-white/10 px-8 py-4 font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md hover:bg-white/5 md:justify-self-center"
          >
            <span className="relative z-10">Наши Услуги</span>
          </MagneticButton>

          <div
            className="relative md:justify-self-start"
            onMouseEnter={showEmailPopover}
            onMouseLeave={hideEmailPopover}
            onFocus={showEmailPopover}
            onBlur={hideEmailPopover}
          >
            <div
              className={`absolute bottom-[calc(100%+0.55rem)] left-1/2 z-20 hidden -translate-x-1/2 transition-all duration-300 md:block ${
                isEmailPopoverVisible
                  ? 'pointer-events-auto translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-2 opacity-0'
              }`}
            >
              <div className="flex items-center gap-2 rounded-full border border-white/12 bg-black/75 px-3 py-2 backdrop-blur-xl shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/10 font-manrope text-[11px] font-bold text-white">
                  @
                </span>
                <span className="font-manrope text-[11px] font-semibold text-white/90">
                  {siteConfig.email}
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  data-cursor="interactive"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/8 px-3 py-1.5 font-manrope text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-white/15"
                >
                  {isEmailCopied ? 'Скопировано' : 'Скопировать'}
                </button>
              </div>
            </div>

            <a
              href={`mailto:${siteConfig.email}`}
              data-cursor="interactive"
              className="hero-main-cta inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-bold uppercase tracking-[0.14em] text-black transition-colors duration-300 hover:bg-neutral-200"
            >
              Наш Email
            </a>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator absolute bottom-10 left-1/2 flex -translate-x-1/2 animate-bounce flex-col items-center gap-2 opacity-50">
        <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">Scroll</span>
        <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
      </div>
    </section>
  )
}
