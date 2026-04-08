import type { Metadata } from 'next'
import Link from 'next/link'
import AmbientOverlay from '@/components/layout/AmbientOverlay'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: '404',
  description: 'Брендированная страница 404 BOT FACTORY с быстрыми переходами на главную, услуги и в Telegram.',
}

const serviceLinks = [
  {
    href: '/services/web-development-minsk',
    title: 'Сайты',
    caption: 'Лендинги, SEO, e-commerce',
  },
  {
    href: '/services/telegram-bots-minsk',
    title: 'Telegram-боты',
    caption: 'Заявки, CRM, оплаты',
  },
  {
    href: '/services/mini-apps-minsk',
    title: 'Мини-приложения',
    caption: 'Сценарии прямо в Telegram',
  },
  {
    href: '/services/ai-integration-minsk',
    title: 'AI-интеграция',
    caption: 'Автоматизация, агенты, AI',
  },
] as const

function PrimaryLink({
  href,
  children,
  inverse = false,
  external = false,
}: {
  href: string
  children: React.ReactNode
  inverse?: boolean
  external?: boolean
}) {
  const className = `inline-flex min-h-12 items-center justify-center rounded-full border px-6 py-3 font-manrope text-[11px] font-extrabold uppercase tracking-[0.18em] transition-all duration-300 ${
    inverse
      ? 'border-white/15 bg-white text-black hover:bg-neutral-200'
      : 'border-white/12 bg-white/5 text-white backdrop-blur-md hover:border-white/30 hover:bg-white/[0.08]'
  }`

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

export default function NotFound() {
  return (
    <section className="relative min-h-screen-safe overflow-hidden bg-[#050505] text-white">
      <AmbientOverlay />

      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <div className="absolute left-1/2 top-[-12%] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[#4F46E5]/18 blur-[130px] md:left-[22%] md:top-[8%] md:h-[34rem] md:w-[34rem]" />
        <div className="absolute bottom-[-12%] right-[-4%] h-[24rem] w-[24rem] rounded-full bg-[#06B6D4]/16 blur-[120px] md:h-[32rem] md:w-[32rem]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen-safe w-full max-w-7xl items-center px-4 py-20 md:px-10">
        <div className="grid w-full gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:items-center lg:gap-10">
          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/35 px-4 py-2 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-[#06B6D4] shadow-[0_0_16px_rgba(6,182,212,0.85)]" />
              <span className="font-manrope text-[10px] uppercase tracking-[0.22em] text-white/65">
                BOT FACTORY / Маршрут не совпал
              </span>
            </div>

            <div className="relative">
              <p className="pointer-events-none absolute -top-7 left-0 font-syne text-[5.5rem] font-extrabold uppercase leading-none tracking-[-0.08em] text-white/[0.04] sm:text-[7rem] md:-top-10 md:text-[10rem]">
                404
              </p>
              <div className="relative max-w-3xl pt-10 md:pt-16">
                <p className="font-manrope text-[11px] uppercase tracking-[0.22em] text-white/45">
                  Похоже, адрес не сработал
                </p>
                <h1 className="mt-3 max-w-4xl font-syne text-[2.9rem] font-extrabold uppercase leading-[0.9] tracking-[-0.05em] text-white sm:text-[4rem] md:text-[5.8rem]">
                  Такой страницы
                  <br />
                  <span className="bg-gradient-to-r from-white via-white to-[#06B6D4] bg-clip-text text-transparent">
                    у нас нет.
                  </span>
                </h1>
                <p className="mt-5 max-w-xl font-manrope text-base leading-relaxed text-neutral-400 md:text-lg">
                  Но ничего страшного. Главная, услуги и Telegram на месте. Выберите нужный маршрут
                  ниже, и пойдём уже по делу.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <PrimaryLink href="/" inverse>
                На главную
              </PrimaryLink>
              <PrimaryLink href="/services">Посмотреть услуги</PrimaryLink>
              <PrimaryLink href={siteConfig.telegramUrl} external>
                Открыть Telegram
              </PrimaryLink>
            </div>

            <div className="mt-10 border-t border-white/10 pt-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="font-manrope text-[10px] uppercase tracking-[0.2em] text-white/45">
                  Куда дальше
                </p>
                <Link
                  href="/services"
                  className="font-manrope text-[10px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white"
                >
                  Все услуги
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {serviceLinks.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="group relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <p className="font-syne text-lg font-bold uppercase tracking-[0.06em] text-white">
                      {service.title}
                    </p>
                    <p className="mt-1 font-manrope text-sm text-white/45">{service.caption}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[30rem]">
            <div className="relative aspect-[0.95] overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 backdrop-blur-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(79,70,229,0.26),transparent_26%),radial-gradient(circle_at_50%_68%,rgba(6,182,212,0.18),transparent_34%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_28%,transparent_72%,rgba(255,255,255,0.04))]" />
              <div className="not-found-scan absolute left-1/2 top-1/2 h-[78%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-[#06B6D4] to-transparent opacity-70" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="not-found-orb relative h-[15rem] w-[15rem] sm:h-[17rem] sm:w-[17rem]">
                  <div className="absolute inset-0 rounded-full border border-white/10" />
                  <div className="not-found-pulse absolute inset-[12%] rounded-full border border-[#4F46E5]/45" />
                  <div className="absolute inset-[24%] rounded-full border border-white/10" />
                  <div className="not-found-pulse absolute inset-[34%] rounded-full border border-[#06B6D4]/55 [animation-delay:1.4s]" />
                  <div className="absolute inset-[43%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.92),rgba(79,70,229,0.7)_34%,rgba(6,182,212,0.3)_58%,transparent_74%)] shadow-[0_0_90px_rgba(79,70,229,0.22)]" />
                </div>
              </div>

              <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-lg">
                <p className="font-manrope text-[9px] uppercase tracking-[0.18em] text-white/40">
                  Статус
                </p>
                <p className="mt-1 font-syne text-sm uppercase tracking-[0.1em] text-white">
                  Маршрут не найден
                </p>
              </div>

              <div className="absolute bottom-5 left-5 right-5 grid grid-cols-[auto_1fr] gap-3 rounded-[1.5rem] border border-white/10 bg-black/45 px-4 py-4 backdrop-blur-xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                  <span className="font-syne text-lg font-bold uppercase text-white">BF</span>
                </div>
                <div>
                  <p className="font-manrope text-[10px] uppercase tracking-[0.18em] text-white/45">
                    Короткий путь
                  </p>
                  <p className="mt-1 font-manrope text-sm leading-relaxed text-white/85">
                    Главная, услуги и Telegram работают как надо. Осталось только выбрать верный
                    путь.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
              <p className="font-manrope text-[10px] uppercase tracking-[0.18em] text-white/35">
                Минск, Беларусь
              </p>
              <p className="font-manrope text-[10px] uppercase tracking-[0.18em] text-white/35">
                Сеть BOT FACTORY онлайн
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
