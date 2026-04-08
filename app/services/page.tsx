import type { Metadata } from 'next'
import Link from 'next/link'
import { serviceLandings, siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Услуги: сайты, Telegram-боты и AI в Минске',
  description:
    'Посадочные страницы BOT FACTORY под запросы: заказать сайт в Минске, разработка телеграм бота, ИИ-автоматизация и внедрение ИИ в CRM.',
  keywords: [
    'заказать сайт в Минске',
    'разработка сайтов минск',
    'стоимость сайта минск',
    'заказать телеграм бота',
    'разработка телеграм бота',
    'создать чат бота',
    'генеративный ИИ',
    'ИИ в CRM',
    'внедрение ИИ в бизнес',
  ],
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Услуги BOT FACTORY в Минске',
    description:
      'Разработка сайтов в Минске, Telegram-боты для бизнеса и AI-решения: от SEO-подготовки до автоматизации и CRM-интеграций.',
    url: `${siteConfig.url}/services`,
    type: 'website',
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Услуги BOT FACTORY в Минске',
    description:
      'Подберите формат: сайт, Telegram-бот, Mini App или AI-интеграция для задач бизнеса в Минске и по Беларуси.',
  },
}

const advisoryPoints = [
  {
    title: 'Выберите канал контакта',
    description:
      'Если нужен независимый digital-актив и SEO-база, логичнее начинать с сайта. Если клиент уже живет в Telegram, быстрее сработает бот или Mini App.',
  },
  {
    title: 'Смотрите на процесс, а не только на интерфейс',
    description:
      'Правильный формат определяется тем, что должно улучшиться в бизнесе: лидогенерация, обслуживание, повторные продажи, внутренняя координация или работа с данными.',
  },
  {
    title: 'Планируйте интеграции заранее',
    description:
      'Сайт, бот, Mini App и AI дают максимальную пользу, когда заранее понятно, как они будут связаны с CRM, оплатой, аналитикой и внутренними системами.',
  },
]

export default function ServicesLandingIndexPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-24 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-syne text-4xl font-bold uppercase leading-none md:text-6xl">
          Услуги BOT FACTORY
        </h1>
        <p className="mt-5 max-w-3xl font-manrope text-lg text-neutral-400">
          Подберите формат разработки под задачу бизнеса в Минске: запуск сайта,
          Telegram-бота или AI-интеграции с прозрачным договором, сроками и
          гарантией качества.
        </p>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
          <div className="max-w-3xl">
            <h2 className="font-syne text-xl font-bold uppercase md:text-2xl">
              Как выбрать формат решения
            </h2>
            <p className="mt-3 font-manrope text-neutral-400">
              Эта страница работает как сервисный хаб: здесь удобно понять,
              какой формат лучше закрывает вашу задачу, а затем перейти в
              подробную посадочную по конкретной услуге.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {advisoryPoints.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <h3 className="font-syne text-xl font-bold uppercase text-white">
                  {item.title}
                </h3>
                <p className="mt-3 font-manrope text-neutral-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {serviceLandings.map((service) => (
            <article
              key={service.slug}
              className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            >
              <h2 className="font-syne text-2xl font-bold uppercase">
                {service.title}
              </h2>
              <p className="mt-3 font-manrope text-neutral-400">
                {service.description}
              </p>
              <p className="mt-4 font-manrope text-sm text-neutral-500">
                {service.fitSummary}
              </p>
              <div className="mt-5 space-y-2">
                {service.useCases.slice(0, 2).map((item) => (
                  <p
                    key={item.title}
                    className="font-manrope text-sm text-neutral-300"
                  >
                    <span className="text-white">{item.title}:</span>{' '}
                    {item.description}
                  </p>
                ))}
              </div>
              <Link
                href={`/services/${service.slug}`}
                className="mt-6 inline-flex w-fit rounded-full border border-white/15 bg-white px-6 py-3 font-manrope text-xs font-bold uppercase tracking-[0.16em] text-black transition-colors hover:bg-neutral-200"
              >
                Открыть страницу
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

