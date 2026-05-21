# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run start:cpanel # cPanel/Passenger deployment via app.js
```

Node >= 24.x (см. `engines` в package.json).

## Architecture

**BOT FACTORY** — premium agency website (botfactory.by). Production хостинг — **Vercel** (team `yegors-projects-e385447e`, project `nextjsbotfactory`, домен `botfactory.by`). Russian-language (locale `ru_BY`), Minsk-based, фокус на белорусский рынок.

### Stack (актуально на момент правки)

| Слой | Версия |
|---|---|
| Next.js | **16.2.3** (App Router) |
| React | **19.2.5** |
| TypeScript | 5.x (strict mode) |
| Tailwind CSS | 3.4.x |
| GSAP | 3.12.x + ScrollTrigger |
| Three.js | 0.163 + @react-three/fiber 9.x + @react-three/drei 10.x |
| Lenis | 1.3.x (smooth scroll) |
| Node | 24.x |

> Обновление версий — только через явный bump в этом файле + проверка работоспособности.

### Routing

```
/                          Homepage (все секции в page.tsx)
/services                  Services hub
/services/[slug]           4 динамические лендинги (data-driven из lib/site.ts)
/contact                   Contact page
/llms.txt                  Plain-text summary для LLMs (API route)
/llms-full.txt             Extended LLM info (API route)
/sitemap.ts                Dynamic XML sitemap
/robots.ts                 Robots rules
/manifest.webmanifest      PWA manifest
```

Service slugs: `web-development-minsk`, `telegram-bots-minsk`, `mini-apps-minsk`, `ai-integration-minsk`.

### Key Data Flow

Весь контент сайта, определения услуг (FAQ, use cases, deliverables, workflow) и SEO-метаданные живут в **`lib/site.ts`** — single source of truth. Страницы услуг генерируются из `ServiceLanding` через `components/seo/ServiceLandingTemplate.tsx`.

Реквизиты компании (УНП, юр. адрес, founder, телефон, email, соцсети) — в `siteConfig`.

### Component Organization

```
components/
  3d/             Three.js hero scene (WebGL error boundary + mobile LOD)
  hero/           Hero с GSAP timeline animations
  layout/         Navigation, footer, scroll storyline, floating CTA, ambient overlay
  providers/      SmoothScroll (Lenis + GSAP ScrollTrigger)
  seo/            JSON-LD, FAQ schema, E-E-A-T, ServiceLandingTemplate
  services/       Services grid с GSAP scroll animations
  trust/          Trust/credibility section
  proof/          Social proof marquee
  process/        Workflow methodology
  integrations/   Partners showcase
  analytics/      GA4 loader + CookieConsent banner (deferred load после согласия)
  ui/             CustomCursor, MagneticButton (elastic gsap.quickTo)
```

### Global State

Минимально — **Context API only**:
- `ScrollUiStateProvider` — активная секция, scroll progress, видимость floating CTA
- `ConsentProvider` (analytics/) — статус cookie consent, gtag загружается только после согласия
- Section IDs: `hero`, `services`, `proof`, `integrations`, `workflow`, `contact`

### Animation Patterns

- GSAP — через `useGSAP()` хук (`@gsap/react`) для корректной очистки
- ScrollTrigger scrub для scroll-linked эффектов
- Three.js рендерит в пониженном качестве на мобильных (36 vs 64 сегмента)
- Smooth scroll только на десктопе с hover (`@media (hover: hover)`)
- Все анимации уважают `prefers-reduced-motion`

### SEO Strategy

Тяжёлый SEO-фокус под Беларусь:
- Каждая страница: OpenGraph (через `ImageResponse`), Twitter cards
- JSON-LD: `Organization+LocalBusiness` (с УНП, координатами Минска, openingHours, priceRange), `Service`, `BreadcrumbList`, `FAQPage`, `WebSite`, `ItemList`
- Динамический sitemap + robots
- **hreflang ru-BY** + `<html lang="ru-BY">` для геотаргета
- Yandex.Webmaster verification через env (`NEXT_PUBLIC_YANDEX_VERIFICATION`)
- Google Search Console verification через env (`NEXT_PUBLIC_GOOGLE_VERIFICATION`)
- llms.txt + llms-full.txt для AI-агентов
- Все ключи привязаны к Минску/Беларуси (см. `primaryKeywords` в `lib/site.ts`)

### Analytics

- **Google Analytics 4** — подключён через `components/analytics/GoogleAnalytics.tsx`, ID из `NEXT_PUBLIC_GA_ID`
- GA-скрипт **не загружается** до согласия пользователя в `CookieConsent` баннере (`localStorage: botfactory_consent`)
- События — через `trackEvent()` из `lib/analytics.ts`

### Deployment

**Production: Vercel** (project `nextjsbotfactory`, домен `botfactory.by`).
- `app.js` остался как точка входа для cPanel/Passenger fallback (host `0.0.0.0`, port `PORT||3000`), но не используется в продакшене.

### Path Aliases

`@/*` маппится в корень. Используй `@/components/...`, `@/lib/...`.

### Important Conventions

- Все client-компоненты — с `'use client'`
- ESLint в Next.js 16 не запускается во время `next build` (вынесен в отдельный `next lint`/`eslint`)
- `three` — в `transpilePackages` в next.config.js
- Шрифты через CSS-переменные (`--font-syne`, `--font-manrope`) определены в `app/layout.tsx`, потребляются в `tailwind.config.ts`
- Все секретные env-переменные имеют `NEXT_PUBLIC_*` префикс **только если они публичные** (analytics ID, verification tokens)

---

# Правила работы с кодом

### Думай перед кодом
- Перед правками — прочитать соответствующий файл, сверить с фактическим кодом, и **только потом** действовать по плану.
- Явно формулируй допущения и план действий перед написанием кода.
- Если сомневаешься — задай вопрос. Не выбирай молча между интерпретациями.
- Если есть более простой подход — сообщи об этом, возражай если оправдано.

### Хирургическая точность
- Не трогай ту часть кода, которой проблема не касается.
- Не «улучшай» соседний код, комментарии или форматирование.
- Не переписывай то, что работает.
- Заметил несвязанный мёртвый код — упомяни, но **не удаляй сам**.

### Краткость без потерь
- Если решение помещается в небольшое количество строк без потери качества — не растягивай.

### Реальная проверка
- Изменения покрывать реальной проверкой работоспособности: dev-сервер, build, поведение в браузере при необходимости.

### Коммиты
- После каждого логически завершённого изменения — коммит.

---

# MEMORY.md — ключевые тех.решения

Все ключевые тех.решения фиксируются в [`MEMORY.md`](MEMORY.md) — living-документ.

- **Что считать решением:** выбор библиотеки, изменение версии стека, новый паттерн (env-имя, формат данных), выбор провайдера (analytics, hosting), фиксация порта, отказ от опции с обоснованием.
- **Когда обновлять:** в том же коммите, где решение принимается.
- **Формат записи:**
  ```
  ### YYYY-MM-DD — Заголовок
  **Решение:** одно предложение.
  **Альтернативы:** что было ещё на столе.
  **Почему:** ключевая причина.
  ```

---

# Подводные камни

_(дополняется по мере обнаружения)_

- **Vercel preview URL отдаёт 401 + `X-Robots-Tag: noindex`.** Это нормально — preview-deployment'ы Vercel защищены SSO. Производственный домен (`botfactory.by`) индексируется. Не пытайся снимать preview protection — это намеренная защита.
