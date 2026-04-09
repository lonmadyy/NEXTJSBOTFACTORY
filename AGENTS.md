# AGENTS.md

This file provides guidance to Codex when working in this repository.

Keep this document in sync with the real codebase. If a task changes architecture, routing, deployment, dependencies, performance strategy, or conventions, update `AGENTS.md` in the same task.

## Commands

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build via Next.js 16 / Turbopack
npm run start        # Start production server
npm run lint         # ESLint
npm run start:cpanel # Legacy cPanel/Passenger entry via app.js
```

Node `24.x` is currently required by `package.json`.

## Project Snapshot

**BOT FACTORY** is a premium agency website for `botfactory.by`.

- Primary language: Russian
- HTML locale: `ru`
- Business locale in metadata/content: `ru_BY`
- Geography: Minsk / Belarus
- Primary deployment: Vercel
- Vercel project: `nextjsbotfactory`
- Connected production domain: `https://botfactory.by`
- Git default branch: `master`

## Stack

- **Next.js 16.2.3** using the App Router
- **React 19.2.5**
- **TypeScript**
- **Tailwind CSS 3**
- **GSAP 3** with `ScrollTrigger` and `@gsap/react`
- **Three.js** via `@react-three/fiber` and `@react-three/drei`
- **Lenis** via `lenis/react`
- **next/font/google** for `Syne` and `Manrope`
- Minimal analytics event wrapper in `lib/analytics.ts`

## Routing

```text
/                              Homepage
/services                      Services hub
/services/[slug]               4 service landing pages
/contact                       Contact page
/opengraph-image               Home social image
/twitter-image                 Home social image
/services/opengraph-image      Services hub social image
/services/twitter-image        Services hub social image
/services/[slug]/opengraph-image
/services/[slug]/twitter-image
/llms.txt                      Plain-text AI summary
/llms-full.txt                 Extended AI summary
/robots.txt                    Robots rules
/sitemap.xml                   Dynamic sitemap
```

Service slugs:

- `web-development-minsk`
- `telegram-bots-minsk`
- `mini-apps-minsk`
- `ai-integration-minsk`

Notes:

- `app/services/[slug]/page.tsx` uses `generateStaticParams()` and `dynamicParams = false`.
- The homepage, services hub, contact page, and service landing pages currently build as static/SSG routes.
- Open Graph and Twitter image routes use `ImageResponse` and `runtime = 'edge'`.

## Data Model

`lib/site.ts` is the main structured content source for:

- global site config
- primary SEO keywords
- all service landing definitions
- home FAQ content

This file is the source of truth for service SEO, copy, and landing-page structure.

Important nuance: not all homepage copy lives in `lib/site.ts`. Several homepage sections still contain hardcoded presentation/content inside their component files.

## Page Composition

### Homepage

`app/page.tsx` composes the homepage in this order:

1. `HomeStructuredData`
2. `AmbientOverlay`
3. `StickyTopNav`
4. `ScrollStoryline`
5. `FloatingBotCta`
6. `CustomCursor`
7. `Hero`
8. `TrustSection`
9. `ServicesSection`
10. `ProofSection`
11. `IntegrationsSection`
12. `ProcessSection`
13. `EeatSection`
14. `FaqSection`
15. `Footer`

Scroll section IDs used across the UI:

- `hero`
- `services`
- `proof`
- `integrations`
- `workflow`
- `contact`

### Service Pages

Service pages are generated from `ServiceLanding` objects in `lib/site.ts` and rendered through `components/seo/ServiceLandingTemplate.tsx`.

## Component Map

```text
components/
  3d/            Hero WebGL scene
  hero/          Homepage hero section and CTAs
  integrations/  Integration marquee section
  layout/        Ambient overlay, nav, footer, floating CTA, scroll storyline, scroll UI state
  process/       Workflow section
  proof/         Social proof section
  providers/     SmoothScroll wrapper (Lenis + GSAP bridge)
  seo/           JSON-LD, FAQ, service templates, E-E-A-T section
  services/      Homepage services section
  trust/         Credibility / stats section
  ui/            CustomCursor, MagneticButton
```

Key ownership:

- Hero / first screen: `components/hero/Hero.tsx`
- 3D hero canvas: `components/3d/HeroScene.tsx`
- Services homepage section: `components/services/ServicesSection.tsx`
- Trust section: `components/trust/TrustSection.tsx`
- Proof section: `components/proof/ProofSection.tsx`
- Integrations marquee: `components/integrations/IntegrationsSection.tsx`
- Process section: `components/process/ProcessSection.tsx`
- Scroll UI state: `components/layout/ScrollUiStateProvider.tsx`
- Sticky nav: `components/layout/StickyTopNav.tsx`
- Floating CTA: `components/layout/FloatingBotCta.tsx`
- Storyline indicator: `components/layout/ScrollStoryline.tsx`

## Client / Server Boundaries

- `app/layout.tsx` is a server component, but it wraps the entire app with the client component `SmoothScroll`.
- The homepage is heavily client-driven.
- Service landing pages are mostly static/server-rendered, but they still use shared layout-level client shell code.
- Contact page is route-level static, but still inherits global client wrappers from layout.

## Animation and Scroll Infrastructure

### GSAP

- GSAP is used directly inside multiple client components.
- `useGSAP()` from `@gsap/react` is used for scoped cleanup.
- `ScrollTrigger` drives:
  - hero entrance timing
  - services horizontal desktop scroll
  - trust card/count animation
  - process timeline animation

### Lenis

- `SmoothScroll` lives in `components/providers/SmoothScroll.tsx`.
- Smooth scroll is enabled only when all of the following are true:
  - `(hover: hover) and (pointer: fine)`
  - `min-width: 768px`
  - no `prefers-reduced-motion: reduce`
- Lenis is bridged to GSAP `ScrollTrigger` through `LenisScrollBridge`.

### Scroll UI State

- `ScrollUiStateProvider` computes:
  - active storyline section
  - active CTA section
  - page scroll progress
  - floating CTA visibility
  - mobile storyline visibility
- `StickyTopNav` separately computes scroll progress and active section for nav state.
- This means scroll-derived UI is currently computed in more than one place.

## 3D Hero

`components/3d/HeroScene.tsx` currently does the following:

- renders a `Canvas` from `@react-three/fiber`
- uses `Float`, `Sphere`, `MeshDistortMaterial`, and `Environment` from `@react-three/drei`
- includes a local React error boundary for WebGL failure
- includes a CSS fallback gradient when WebGL is unavailable or not ready
- reduces sphere geometry on mobile from `64` to `36` segments
- reduces DPR on mobile to `[1, 1.35]`
- disables antialiasing on mobile
- prefers `low-power` GPU mode on mobile

Current performance caveat:

- `Environment preset="city"` introduces extra runtime cost and currently results in an external HDR fetch during runtime. Treat the hero as the main first-screen performance hotspot unless proven otherwise.

## Performance-Sensitive Areas

Be careful when editing these files:

- `components/3d/HeroScene.tsx`
- `components/hero/Hero.tsx`
- `components/providers/SmoothScroll.tsx`
- `components/services/ServicesSection.tsx`
- `components/layout/ScrollUiStateProvider.tsx`
- `components/layout/StickyTopNav.tsx`
- `components/layout/ScrollStoryline.tsx`
- `components/layout/FloatingBotCta.tsx`

Known current hotspots:

- homepage first screen runtime cost
- WebGL hero on mobile
- duplicated scroll listeners / section scanning
- `ServicesSection` renders separate desktop and mobile trees in the same component and hides them with CSS
- shared homepage client code leaks into otherwise simpler routes through the global layout shell

## SEO Strategy

SEO is a first-class concern in this project.

Implemented pieces:

- route-level metadata in App Router pages
- dynamic service metadata via `generateMetadata()`
- JSON-LD for organization, website, item list, service, and FAQ
- dynamic `sitemap.xml`
- dynamic `robots.txt`
- OG/Twitter image routes generated with `next/og`
- `llms.txt` and `llms-full.txt` route handlers

Relevant files:

- `components/seo/OrganizationJsonLd.tsx`
- `components/seo/HomeStructuredData.tsx`
- `components/seo/ServiceStructuredData.tsx`
- `lib/og.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/llms.txt/route.ts`
- `app/llms-full.txt/route.ts`

## Deployment

Current real deployment state:

- production is on Vercel
- domain `botfactory.by` is already connected to Vercel
- Vercel metadata is present in `.vercel/project.json`

Legacy/secondary deployment path still exists:

- `app.js`
- `npm run start:cpanel`

Do not assume cPanel is the primary production target unless the task explicitly says so.

## Path Aliases

- `@/*` maps to the project root

Use imports like:

- `@/components/...`
- `@/lib/...`
- `@/app/...` only when appropriate

## Important Conventions

- All client components must declare `'use client'`.
- `next.config.js` is intentionally minimal and currently only sets `transpilePackages: ['three']`.
- Fonts are defined in `app/layout.tsx` with CSS variables:
  - `--font-syne`
  - `--font-manrope`
- `globals.css` contains important hero sizing and viewport-safe layout rules. Do not treat it as cosmetic-only.
- `lib/bot.ts` currently returns the same Telegram URL for all clusters/sections; if CTA routing becomes more specific, update that file and this document.
- When changing architecture, route behavior, deployment assumptions, or performance-critical behavior, update this file.
