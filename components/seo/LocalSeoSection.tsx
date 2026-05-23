'use client'

import Link from 'next/link'

const offerings = [
  {
    title: 'Сайты под ключ',
    description:
      'Разработка сайтов в Минске: лендинги, корпоративные сайты и интернет-магазины с SEO-структурой, аналитикой и интеграцией с CRM.',
    href: '/services/web-development-minsk',
  },
  {
    title: 'Telegram-боты',
    description:
      'Создаём Telegram-ботов для бизнеса в Минске и Беларуси: приём заявок, автоворонки, поддержка 24/7, оплата и связка с CRM через API.',
    href: '/services/telegram-bots-minsk',
  },
  {
    title: 'Telegram Mini Apps',
    description:
      'Разработка Mini App в Минске: каталоги, личные кабинеты, оплата и сервис прямо внутри Telegram. Альтернатива мобильному приложению без App Store.',
    href: '/services/mini-apps-minsk',
  },
  {
    title: 'AI-интеграция',
    description:
      'Внедрение AI и GPT в процессы бизнеса в Минске: AI-ассистенты, классификация заявок, генерация контента, автоматизация поддержки и CRM.',
    href: '/services/ai-integration-minsk',
  },
]

export default function LocalSeoSection() {
  return (
    <section className="relative z-10 w-full bg-[#050505] py-24 px-4 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <h2 className="font-syne text-4xl font-bold uppercase leading-[0.95] text-white md:text-6xl">
              Разработка сайтов <br />
              <span className="text-neutral-500">и Telegram-ботов в Минске</span>
            </h2>
            <p className="mt-6 font-manrope text-sm leading-relaxed text-neutral-400 md:text-base">
              Создаём цифровые продукты под ключ для бизнеса в Минске и по Беларуси: от простых лендингов до Mini Apps
              и AI-ассистентов. Запуск за 1–3 недели, гарантия 2 месяца, фиксированный договор. От 680 BYN.
            </p>
          </div>
          <p className="font-manrope text-xs uppercase tracking-[0.2em] text-neutral-600 md:text-right">
            Минск · Беларусь <br /> УНП HE7170411
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {offerings.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              data-cursor="interactive"
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.08]"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#4F46E5]/15 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <h3 className="relative z-10 font-syne text-xl font-bold uppercase leading-tight text-white md:text-2xl">
                {item.title}
              </h3>
              <p className="relative z-10 mt-4 flex-1 font-manrope text-sm leading-relaxed text-neutral-400">
                {item.description}
              </p>
              <span className="relative z-10 mt-6 inline-flex items-center font-manrope text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 transition-colors duration-300 group-hover:text-white">
                Подробнее →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
