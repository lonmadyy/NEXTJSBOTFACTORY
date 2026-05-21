# DESIGN.md — BOT FACTORY

Спецификация визуальной системы. Привязана к фактическому коду (Tailwind 3.4, CSS-переменные в `app/globals.css`, шрифты через `next/font`).

---

## Color

Цветовая стратегия: **Committed dark + dual accent** — насыщенный тёмный фон + двухтоновый акцент Indigo→Cyan, заработанный как идентичность бренда (используется в hero-градиенте, светящихся точках контактов, фокусных кольцах).

| Роль | Token | Hex / OKLCH | Применение |
|---|---|---|---|
| `--background` | фон | `#050505` (OKLCH 0.06 0.003 280) | Основной фон сайта |
| `--foreground` | текст | `#ffffff` | Основной текст |
| `accent-indigo` | акцент-1 | `#4F46E5` | Старт градиента, focus-ring, точки в hero |
| `accent-cyan` | акцент-2 | `#06B6D4` | Конец градиента, hover-вспышки |
| `neutral-400` | вторичный текст | Tailwind | Подзаголовки, мета |
| `neutral-500/600` | приглушённый | Tailwind | Tertiary copy |
| `white/10..40` | стекло | rgba alpha | Границы, бэкграунды карточек на тёмном |

**Правила:** `mix-blend-difference` для текста поверх 3D-сцены, `bg-clip-text` с градиентом — **только** на одном-двух акцентных словах в H1 (идентичность бренда). Не растягивать на body.

## Theme

Темная сцена. Один сценарий: founder/руководитель смотрит сайт в рабочее время на десктопе или с телефона в перерыве. Тёмный фон выбран не по моде — он подчёркивает 3D-сферу (центральный визуальный якорь) и удерживает внимание на тексте, а не на хроме.

## Typography

### Шрифты (через `next/font/google`)

| Family | Роль | Subsets | Display |
|---|---|---|---|
| **Syne** | headings / display | `latin` | `swap` |
| **Manrope** | body / UI / russian display | `cyrillic + latin` | `swap` |

**Решение по кириллице:** Syne — латиноцентричный шрифт (reflex-reject в impeccable, но identity-preserving — уже в проекте). Для русских H1/H2, где Syne+uppercase+tight-tracking выглядит сжато, используем **Manrope в display-весе (700–800)** с открытым tracking.

### Scale (fluid headings, fixed body)

| Step | Класс / clamp | Применение |
|---|---|---|
| Display | `clamp(4.35rem, 10.7vw, 9.6rem)` (`.hero-title` в globals.css) | Hero H1 |
| H2 | `text-4xl md:text-6xl` (`font-syne uppercase`) | Section headings |
| H3 | `text-2xl md:text-3xl` | Subsection |
| Body lg | `text-lg` (Manrope) | Lead-параграфы |
| Body | `text-base` | Основной текст |
| Meta | `text-[10px]–text-xs uppercase tracking-[0.18–0.24em]` | Eyebrows, breadcrumbs |

Соотношение ступеней ≥1.25.

### Правила по кириллице

- **Uppercase в кириллице — только если открыть tracking** (~0.01–0.04em). Иначе кирпич.
- **Sentence case > Title case > Uppercase** для длинных русских строк.
- **`mix-blend-difference`** на жирной кириллице на 3D-фоне поддержать `text-shadow: 0 1px 0 rgba(0,0,0,0.35)` для сепарации.
- Для русских H1 предпочитать **Manrope 800** вместо Syne — кириллический набор Manrope первого класса.

## Layout

- Контейнер: `max-w-7xl mx-auto px-4 md:px-10`
- Asymmetric hero (3D-сфера + центрированный текст с mix-blend) + сетки 2/3/4 для секций
- Cards разрешены, но не nested; rounded `2xl`/`[2rem]`; border `white/10` + bg `white/[0.03–0.05]` + `backdrop-blur-xl`
- Spacing — fluid, разный (`py-24..py-32` между секциями)

## Motion

- Все анимации через **GSAP + useGSAP** (правильный cleanup), scroll-linked — через **ScrollTrigger**
- **prefers-reduced-motion** — везде уважается
- Easing: `power3.out` (default), `expo`-кривые для входных
- **Кнопки:** magnetic effect (gsap.quickTo) + `scale(0.97)` на :active
- Hero — `mix-blend-difference` + GSAP timeline на subtitle/buttons stagger
- Three.js: pause when not in viewport, lower segments на мобильных (36 vs 64), `frameloop="demand"` при невидимости

## Components (живут в `components/`)

- `3d/HeroScene` — Three.js сфера с WebGL fallback
- `hero/Hero` — H1 + subtitle + offer-card + 3 CTA
- `ui/MagneticButton` — magnetic hover, Link или div
- `ui/CustomCursor` — кастомный курсор для desktop
- `layout/Navigation`, `Footer`, `FloatingBotCta`, `ScrollStoryline`, `AmbientOverlay`
- `seo/OrganizationJsonLd`, `ServiceLandingTemplate`, `FaqSection`, `EeatSection`
- `analytics/ConsentContext`, `CookieConsent`, `GoogleAnalytics`

## Anti-patterns (наши + impeccable bans)

- ❌ Gradient text — **разрешено только в hero H1** как identity (1 место, не более 1–2 слов)
- ❌ Side-stripe borders, glassmorphism by default, hero-metric template, identical card grids, modal-first
- ❌ Em-dashes в копи (используем `—` только в код-блоках/документации, не в UI)
- ❌ English как заголовки секций на русском сайте (исключение: `BOT FACTORY` бренд)
- ❌ Stock иллюстрации рукопожатий, иконок-фич, persona-карточек
