# MEMORY.md — ключевые тех.решения BOT FACTORY

> Living-документ. См. правила формирования в [CLAUDE.md](CLAUDE.md).

---

### 2026-05-21 — GA4 + cookie consent

**Решение:** GA4 подключается через `components/analytics/GoogleAnalytics.tsx` с использованием `next/script` (`strategy="afterInteractive"`), но скрипт не инжектится в DOM до тех пор, пока пользователь не подтвердит согласие в `CookieConsent` баннере. Согласие хранится в `localStorage` под ключом `botfactory_consent` (значения: `granted` / `denied`). Production Measurement ID: **`G-1DDPDVW1J7`** (property «BOT FACTORY», страна Беларусь, валюта BYN, часовой пояс GMT+03:00).

**Альтернативы:** Google Tag Manager (отвергли — лишний overhead для одного счётчика), Yandex.Metrika (отвергли — пользователь выбрал только GA4), Vercel Analytics (отвергли — у пользователя нет Vercel Pro).

**Почему:** GA4 — стандарт, бесплатный, поддерживает консент-режим. Загрузка только после consent выполняет требования GDPR + закона РБ № 99-З «Об информации, информатизации и защите информации».

---

### 2026-05-21 — Env-имена для верификаций и аналитики

**Решение:** Публичные ID и токены верификации поисковиков хранятся как `NEXT_PUBLIC_*` env-переменные:
- `NEXT_PUBLIC_GA_ID=G-1DDPDVW1J7` — Google Analytics 4 measurement ID
- `NEXT_PUBLIC_YANDEX_VERIFICATION=b882c0eb1d658410` — токен Яндекс.Вебмастера (meta-тег)
- `NEXT_PUBLIC_GOOGLE_VERIFICATION` — пустой; Google Search Console верифицирован через `public/google44f1106d148410da.html`

Все три заданы в Vercel Project Settings (Production + Preview).

**Альтернативы:** хардкод значений (отвергли — нужно гибкое управление через Vercel ENV), сторонние секрет-менеджеры (избыточно для public-токенов).

**Почему:** все три значения публичные (отдаются клиенту в HTML), их можно безопасно хранить в `NEXT_PUBLIC_*`. Управление — через Vercel Project Settings → Environment Variables.

---

### 2026-05-21 — Подключение к Google Search Console и Яндекс.Вебмастеру

**Решение:**
- **Google Search Console:** верифицирован через HTML-файл `public/google44f1106d148410da.html` (ресурс `https://botfactory.by/`, тип «Префикс URL»). Sitemap `sitemap.xml` отправлен.
- **Яндекс.Вебмастер:** верифицирован через мета-тег (env `NEXT_PUBLIC_YANDEX_VERIFICATION`). Sitemap `https://botfactory.by/sitemap.xml` добавлен в очередь обработки. Регион Беларусь/Минск определится автоматически по `.by`-домену + geo-тегам + LocalBusiness JSON-LD (новый UI Яндекса убрал ручную настройку региона).

**Альтернативы:** DNS-TXT для GSC (отвергли — у пользователя cPanel-DNS, сложнее, чем подложить файл).

**Почему:** оба способа выживают при будущих ротациях DNS и не требуют доступа к регистратору домена. HTML-файл для GSC проще meta-тега через env, потому что не зависит от build-pipeline.

---

### 2026-05-21 — hreflang и `<html lang="ru-BY">`

**Решение:** В корневом layout установлен `<html lang="ru-BY">` (вместо `ru`). В метадатах добавлены `alternates.languages: { 'ru-BY': '<url>', 'x-default': '<url>' }`. Применяется ко всем страницам.

**Альтернативы:** только `lang="ru"` (отвергли — недостаточный геосигнал), несколько локалей (отвергли — сайт только под BY).

**Почему:** усиливает геосигнал для Google → лучшая видимость в `google.by`. Яндекс также использует hreflang при формировании региональной выдачи.

---

### 2026-05-21 — LocalBusiness обогащение

**Решение:** В `OrganizationJsonLd` добавлены `priceRange: "680-9000 BYN"`, `openingHoursSpecification` (Mo-Fr 09:00-19:00), `image`, `currenciesAccepted: "BYN, USD, EUR"`, `paymentAccepted`.

**Альтернативы:** AggregateRating (отказались — нет верифицированных отзывов, fake rating нарушает Google Structured Data Policies).

**Почему:** обогащение LocalBusiness повышает шансы на Knowledge Panel в Google и расширенную карточку в Яндексе.

---

### 2026-05-21 — Production-хостинг

**Решение:** Production обслуживается Vercel (project `nextjsbotfactory`, домен `botfactory.by`, Node 24.x, framework Next.js).

**Альтернативы:** cPanel/Passenger (через `app.js`) — оставлен как fallback, не используется.

**Почему:** Vercel даёт edge-CDN, оптимизированный image pipeline, automatic Brotli, ISR. Преимущество критично для SEO (Core Web Vitals).
