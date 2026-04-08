import Link from 'next/link'
import { serviceLandings, type ServiceLanding, siteConfig } from '@/lib/site'
import ServiceStructuredData from '@/components/seo/ServiceStructuredData'
import { buildBotDeepLink } from '@/lib/bot'

export default function ServiceLandingTemplate({
  service,
}: {
  service: ServiceLanding
}) {
  const relatedServices = serviceLandings.filter((item) => item.slug !== service.slug).slice(0, 3)
  const contactBotLink = buildBotDeepLink(service.slug, 'contact')

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <ServiceStructuredData service={service} />

      <section className="relative overflow-hidden px-4 pb-20 pt-28 md:px-10">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 bg-gradient-to-b from-[#4F46E5]/15 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <nav className="mb-8 flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-neutral-500">
            <Link href="/" className="hover:text-white">
              Главная
            </Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white">
              Услуги
            </Link>
            <span>/</span>
            <span className="text-white">{service.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-end">
            <div>
              <p className="font-manrope text-xs uppercase tracking-[0.2em] text-neutral-500">
                {siteConfig.city}, {siteConfig.country}
              </p>
              <h1 className="mt-4 font-syne text-4xl font-bold uppercase leading-tight md:text-6xl">
                {service.h1}
              </h1>
              <p className="mt-6 max-w-2xl font-manrope text-lg text-neutral-400">
                {service.intro}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
              <p className="font-manrope text-xs uppercase tracking-[0.18em] text-neutral-500">
                Коммерческие условия
              </p>
              <ul className="mt-4 space-y-3">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="font-manrope text-neutral-200">
                    {bullet}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-neutral-400">
                Консультация бесплатная. Все условия, сроки и гарантия
                закрепляются в договоре до старта работ.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h2 className="font-syne text-3xl font-bold uppercase md:text-5xl">
              {service.useCasesTitle}
            </h2>
            <p className="mt-4 font-manrope text-lg text-neutral-400">
              {service.fitSummary}
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {service.useCases.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="font-syne text-2xl font-bold uppercase text-white">
                  {item.title}
                </h3>
                <p className="mt-3 font-manrope text-neutral-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-syne text-3xl font-bold uppercase md:text-5xl">
            {service.deliverablesTitle}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {service.deliverables.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="font-syne text-2xl font-bold uppercase text-white">
                  {item.title}
                </h3>
                <p className="mt-3 font-manrope text-neutral-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-10">
        <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="max-w-3xl">
            <h2 className="font-syne text-2xl font-bold uppercase md:text-3xl">
              {service.workflowTitle}
            </h2>
            <p className="mt-3 font-manrope text-neutral-400">
              Ниже показано, как эта услуга разворачивается в реальный проект:
              от диагностики задачи и архитектуры решения до запуска и контроля
              качества после релиза.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {service.workflow.map((item, index) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <p className="font-manrope text-xs uppercase tracking-[0.18em] text-neutral-500">
                  Этап {index + 1}
                </p>
                <h3 className="mt-3 font-syne text-2xl font-bold uppercase text-white">
                  {item.title}
                </h3>
                <p className="mt-3 font-manrope text-neutral-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-syne text-3xl font-bold uppercase md:text-5xl">
            FAQ по услуге
          </h2>
          <div className="mt-8 space-y-4">
            {service.faq.map((item, index) => (
              <details
                key={item.question}
                open={index === 0}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <summary className="cursor-pointer list-none font-syne text-2xl font-bold text-white">
                  {item.question}
                </summary>
                <p className="mt-4 font-manrope text-neutral-300">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-6 pt-2 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <h2 className="font-syne text-3xl font-bold uppercase md:text-5xl">
              Смежные решения
            </h2>
            <p className="mt-3 font-manrope text-neutral-400">
              Если задача выходит за рамки одной услуги, удобно перейти к
              смежным направлениям и собрать решение без разрозненных
              подрядчиков.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {relatedServices.map((item) => (
              <article
                key={item.slug}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="font-syne text-2xl font-bold uppercase text-white">
                  {item.title}
                </h3>
                <p className="mt-3 font-manrope text-neutral-400">
                  {item.fitSummary}
                </p>
                <Link
                  href={`/services/${item.slug}`}
                  className="mt-5 inline-flex rounded-full border border-white/15 bg-white px-6 py-3 font-manrope text-xs font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-neutral-200"
                >
                  Смотреть услугу
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 pt-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center md:flex-row md:text-left">
          <div>
            <h2 className="font-syne text-3xl font-bold uppercase">
              Обсудим задачу бизнеса
            </h2>
            <p className="mt-2 font-manrope text-neutral-400">
              Работаем с проектами в Минске, по Беларуси и с удаленными
              командами.
            </p>
          </div>
          <a
            href={contactBotLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 bg-white px-8 py-4 font-manrope text-sm font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-neutral-200"
          >
            Оставить заявку
          </a>
        </div>
      </section>
    </main>
  )
}

