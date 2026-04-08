'use client'

import React from 'react'
import Link from 'next/link'
import MagneticButton from '@/components/ui/MagneticButton'
import { siteConfig } from '@/lib/site'

export default function Footer() {
  const legalDisplayName = siteConfig.legalName.replace(/^ИП\s+/i, '')

  return (
    <footer className="relative bg-[#050505] pt-20 text-white overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute bottom-0 left-0 h-[500px] w-full bg-gradient-to-t from-[#4F46E5]/20 to-transparent opacity-50 blur-[100px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 pb-10 md:px-10">
        {/* Main CTA */}
        <div className="mb-20 flex flex-col items-center text-center">
            <h2 className="mb-8 font-syne text-5xl font-bold uppercase leading-none md:text-[8rem]">
              Let&apos;s Build <br /> The Future
            </h2>
          <MagneticButton
            href="/contact"
            className="group relative px-12 py-6 bg-white text-black font-bold uppercase tracking-widest text-lg hover:bg-neutral-200"
          >
             <span className="relative z-10">Обсудить Проект</span>
          </MagneticButton>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 gap-10 border-t border-white/10 pt-10 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-syne text-xl font-bold uppercase">Bot Factory</h3>
            <p className="font-manrope text-sm text-neutral-400">
              Premium Digital Solutions <br /> Minsk, Belarus.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-manrope text-sm font-bold uppercase text-white/50">Services</h4>
            <ul className="flex flex-col gap-1.5 font-manrope text-sm text-neutral-300 md:gap-2">
              <li><Link href="/services/web-development-minsk" className="inline-flex min-h-10 items-center rounded-lg py-1 pr-2 hover:text-white md:min-h-0 md:rounded-none md:py-0 md:pr-0">Websites</Link></li>
              <li><Link href="/services/telegram-bots-minsk" className="inline-flex min-h-10 items-center rounded-lg py-1 pr-2 hover:text-white md:min-h-0 md:rounded-none md:py-0 md:pr-0">Telegram Bots</Link></li>
              <li><Link href="/services/mini-apps-minsk" className="inline-flex min-h-10 items-center rounded-lg py-1 pr-2 hover:text-white md:min-h-0 md:rounded-none md:py-0 md:pr-0">Mini Apps</Link></li>
              <li><Link href="/services/ai-integration-minsk" className="inline-flex min-h-10 items-center rounded-lg py-1 pr-2 hover:text-white md:min-h-0 md:rounded-none md:py-0 md:pr-0">AI Integration</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-manrope text-sm font-bold uppercase text-white/50">Socials</h4>
            <ul className="flex flex-col gap-2 font-manrope text-sm text-neutral-300">
              <li>
                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center rounded-lg py-1 pr-2 hover:text-white md:min-h-0 md:rounded-none md:py-0 md:pr-0"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center rounded-lg py-1 pr-2 hover:text-white md:min-h-0 md:rounded-none md:py-0 md:pr-0"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center rounded-lg py-1 pr-2 hover:text-white md:min-h-0 md:rounded-none md:py-0 md:pr-0"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div>
             <h4 className="mb-4 font-manrope text-sm font-bold uppercase text-white/50">Legal</h4>
             <p className="font-manrope text-xs text-neutral-500">
               {legalDisplayName} <br />
               УНП {siteConfig.unp} <br />
               {siteConfig.phoneDisplay} / {siteConfig.email} <br />
               (c) 2026 Bot Factory. All rights reserved.
             </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
