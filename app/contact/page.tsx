import type { Metadata } from 'next'
import Link from 'next/link'
import MagneticButton from '@/components/ui/MagneticButton'
import AmbientOverlay from '@/components/layout/AmbientOverlay'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Обсудить проект',
  description:
    'Свяжитесь с BOT FACTORY: обсудите разработку сайта, Telegram-бота, Mini App или AI-интеграции. Телефон, email, Telegram-бот и личный Telegram в одном месте.',
  alternates: {
    canonical: '/contact',
  },
}

const contactCards = [
  {
    eyebrow: 'Телефон',
    value: siteConfig.phoneDisplay,
    displayValue: siteConfig.phoneDisplay,
    href: `tel:${siteConfig.phoneLink}`,
    tone: 'from-[#4F46E5]/26 via-[#4F46E5]/8 to-transparent',
    valueClassName:
      'font-syne text-[1.95rem] font-semibold tracking-[-0.035em] text-white sm:text-[2.35rem] md:text-[2.55rem]',
  },
  {
    eyebrow: 'Email',
    value: siteConfig.email,
    displayValue: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    tone: 'from-[#06B6D4]/24 via-[#06B6D4]/8 to-transparent',
    valueClassName:
      'font-syne text-[1.25rem] font-medium lowercase tracking-[-0.025em] text-white sm:text-[1.46rem] md:text-[1.68rem]',
  },
]

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <AmbientOverlay />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[10%] h-[28rem] w-[28rem] rounded-full bg-[#4F46E5]/16 blur-[120px]" />
        <div className="absolute right-[-10%] top-[16%] h-[24rem] w-[24rem] rounded-full bg-[#06B6D4]/16 blur-[120px]" />
        <div className="absolute bottom-[-12%] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[110px]" />
      </div>

      <section className="relative z-10 px-4 pb-16 pt-24 md:px-10 md:pb-24 md:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-manrope text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-white/20 hover:text-white"
            >
              BOT FACTORY
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-manrope text-[10px] font-bold uppercase tracking-[0.18em] text-white/55 transition-colors hover:border-white/20 hover:text-white"
            >
              Услуги
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:items-center">
            <div className="max-w-3xl">
              <p className="font-manrope text-[11px] uppercase tracking-[0.24em] text-white/48">
                Обсудим задачу без лишних кругов
              </p>
              <h1 className="mt-4 font-syne text-[3rem] font-semibold uppercase leading-[0.94] tracking-[-0.035em] text-white sm:text-[3.95rem] md:text-[5.1rem]">
                Запуск.
                <br />
                <span className="bg-gradient-to-r from-white via-[#dff6ff] to-[#06B6D4] bg-clip-text text-transparent">
                  Связь.
                </span>
                <br />
                Действие.
              </h1>
              <p className="mt-6 max-w-2xl font-manrope text-base leading-relaxed text-neutral-400 md:text-lg">
                Если нужен сайт, Telegram-бот, Mini App или AI-интеграция, здесь собрана короткая
                точка входа: позвонить, написать на email, пройти опрос в боте или сразу выйти в
                личный Telegram.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <MagneticButton
                  href={siteConfig.telegramUrl}
                  className="border border-white/14 bg-white px-7 py-4 font-manrope text-xs font-extrabold uppercase tracking-[0.18em] text-black hover:bg-neutral-200"
                >
                  <span className="relative z-10">Открыть бота</span>
                </MagneticButton>
                <MagneticButton
                  href={siteConfig.telegramProfileUrl}
                  className="border border-white/12 bg-white/[0.04] px-7 py-4 font-manrope text-xs font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur-md hover:bg-white/[0.08]"
                >
                  <span className="relative z-10">Личный Telegram</span>
                </MagneticButton>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-2xl md:p-7">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(79,70,229,0.24),transparent_24%),radial-gradient(circle_at_70%_62%,rgba(6,182,212,0.18),transparent_28%)]" />

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 contact-ring contact-ring-slow" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 contact-ring contact-ring-fast" />
                <div className="pointer-events-none absolute left-[22%] top-[27%] h-3 w-3 rounded-full bg-[#4F46E5] shadow-[0_0_18px_rgba(79,70,229,0.8)] contact-node contact-node-a" />
                <div className="pointer-events-none absolute right-[20%] top-[32%] h-3 w-3 rounded-full bg-[#06B6D4] shadow-[0_0_18px_rgba(6,182,212,0.8)] contact-node contact-node-b" />
                <div className="pointer-events-none absolute bottom-[24%] left-[28%] h-3 w-3 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.55)] contact-node contact-node-c" />

                <div className="relative z-10">
                  <p className="font-manrope text-[11px] uppercase tracking-[0.22em] text-white/42">
                    Контактные данные
                  </p>
                  <div className="mt-5 grid gap-4">
                    {contactCards.map((item) => (
                      <a
                        key={item.eyebrow}
                        href={item.href}
                        className="group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/30 px-5 py-5 transition-colors duration-300 hover:border-white/18 hover:bg-white/[0.05]"
                      >
                        <div
                          className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${item.tone} opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
                        />
                        <div className="relative z-10">
                          <p className="font-manrope text-[10px] uppercase tracking-[0.22em] text-white/46">
                            {item.eyebrow}
                          </p>
                          <p className={`mt-2 leading-[0.94] ${item.valueClassName}`}>
                            {item.displayValue}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <a
                      href={siteConfig.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-[1.6rem] border border-white/10 bg-black/30 px-5 py-5 transition-colors duration-300 hover:border-white/18 hover:bg-white/[0.05]"
                    >
                      <p className="font-manrope text-[10px] uppercase tracking-[0.22em] text-white/46">
                        Telegram-бот
                      </p>
                      <p className="mt-2 font-syne text-[1.26rem] font-medium uppercase leading-[0.98] tracking-[-0.025em] text-white">
                        Бриф за пару минут
                      </p>
                    </a>

                    <a
                      href={siteConfig.telegramProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-[1.6rem] border border-white/10 bg-black/30 px-5 py-5 transition-colors duration-300 hover:border-white/18 hover:bg-white/[0.05]"
                    >
                      <p className="font-manrope text-[10px] uppercase tracking-[0.22em] text-white/46">
                        Личный Telegram
                      </p>
                      <p className="mt-2 font-syne text-[1.26rem] font-medium uppercase leading-[0.98] tracking-[-0.025em] text-white">
                        Прямой контакт
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
