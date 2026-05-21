import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности и cookies',
  description:
    'Политика обработки персональных данных и использования cookies на сайте BOT FACTORY (botfactory.by).',
  alternates: {
    canonical: '/privacy',
    languages: {
      'ru-BY': `${siteConfig.url}/privacy`,
      'x-default': `${siteConfig.url}/privacy`,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-32 sm:pt-40">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-white/55 transition hover:text-white"
      >
        <span aria-hidden="true">←</span> На главную
      </Link>

      <h1 className="mt-6 font-syne text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
        Политика конфиденциальности и cookies
      </h1>

      <p className="mt-3 text-[13px] uppercase tracking-[0.18em] text-white/45">
        Действует с 21 мая 2026 г.
      </p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-white/75">
        <section>
          <h2 className="font-syne text-xl font-semibold text-white">1. Кто мы</h2>
          <p className="mt-3">
            Сайт <strong className="text-white">{siteConfig.url.replace('https://', '')}</strong>{' '}
            принадлежит <strong className="text-white">{siteConfig.legalName}</strong> (УНП{' '}
            {siteConfig.unp}, г.&nbsp;{siteConfig.city}, {siteConfig.country}). Контакт по
            вопросам обработки данных:{' '}
            <a className="text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>.
          </p>
        </section>

        <section>
          <h2 className="font-syne text-xl font-semibold text-white">2. Какие данные мы собираем</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-white/40">
            <li>
              <strong className="text-white">Контактные формы.</strong> Имя, телефон, email,
              мессенджер, текст обращения. Используем только для ответа на ваш запрос и
              подготовки коммерческого предложения.
            </li>
            <li>
              <strong className="text-white">Cookies и аналитика.</strong> Если вы согласились в
              cookie-баннере, мы подгружаем Google Analytics 4. GA собирает обезличенный
              IP-адрес, тип устройства, источник перехода и поведение на страницах.
            </li>
            <li>
              <strong className="text-white">Технические логи.</strong> Vercel (наш хостинг)
              ведёт стандартные access-логи запросов для безопасности и стабильности.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-syne text-xl font-semibold text-white">3. На каком основании</h2>
          <p className="mt-3">
            Закон Республики Беларусь от 7 мая 2021 г. № 99-З «О защите персональных данных».
            Контактные данные обрабатываем на основании вашего обращения (ст.&nbsp;6 §1).
            Cookies-аналитику — только после явного согласия в баннере (ст.&nbsp;5).
          </p>
        </section>

        <section>
          <h2 className="font-syne text-xl font-semibold text-white">4. Кому передаём</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-white/40">
            <li>Google LLC — обезличенные данные аналитики (GA4)</li>
            <li>Vercel Inc. — хостинг-инфраструктура</li>
            <li>Telegram Messenger Inc. — при обращении через Telegram-бот</li>
          </ul>
          <p className="mt-3">
            Третьим лицам в рекламных целях ваши данные не передаём.
          </p>
        </section>

        <section>
          <h2 className="font-syne text-xl font-semibold text-white">5. Срок хранения</h2>
          <p className="mt-3">
            Контактные данные — до 3 лет с момента обращения. Cookies-консент — до 12 месяцев
            или до отзыва. Технические логи — 30 дней.
          </p>
        </section>

        <section>
          <h2 className="font-syne text-xl font-semibold text-white">6. Ваши права</h2>
          <p className="mt-3">
            Вы можете получить копию своих данных, потребовать их удаления или отозвать
            согласие. Достаточно письма на{' '}
            <a className="text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>. Чтобы отозвать cookies-согласие, очистите данные сайта в браузере или
            свяжитесь с нами.
          </p>
        </section>

        <section>
          <h2 className="font-syne text-xl font-semibold text-white">7. Изменения</h2>
          <p className="mt-3">
            Мы можем обновлять эту политику. Актуальная редакция всегда доступна по адресу{' '}
            {siteConfig.url}/privacy.
          </p>
        </section>
      </div>
    </article>
  )
}
