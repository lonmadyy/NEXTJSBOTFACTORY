# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run start:cpanel # cPanel/Passenger deployment via app.js
```

Node >= 20.9.0 required.

## Architecture

**BOT FACTORY** — premium agency website (botfactory.by). Russian-language (locale `ru_BY`), Minsk-based.

### Stack

- **Next.js 14** (App Router, no Pages Router)
- **React 18** + **TypeScript** (strict mode)
- **Tailwind CSS 3** with custom theme (fonts: Syne for headings, Manrope for body)
- **GSAP 3** + ScrollTrigger for scroll-linked and timeline animations
- **Three.js** via `@react-three/fiber` + `@react-three/drei` for 3D hero sphere
- **Lenis** (`@studio-freight/react-lenis`) for smooth scroll (desktop only, respects `prefers-reduced-motion`)
- **Google Analytics** via `gtag()` — minimal wrapper in `lib/analytics.ts`

### Routing

```
/                          Homepage (all sections composed in page.tsx)
/services                  Services hub
/services/[slug]           4 dynamic service landings (data-driven from lib/site.ts)
/contact                   Contact page
/llms.txt                  Plain-text summary for LLMs (API route)
/llms-full.txt             Extended LLM info (API route)
/sitemap.ts                Dynamic XML sitemap
/robots.ts                 Robots rules
```

Service slugs: `web-development-minsk`, `telegram-bots-minsk`, `mini-apps-minsk`, `ai-integration-minsk`.

### Key Data Flow

All site content, service definitions (FAQ, use cases, deliverables, workflow), and SEO metadata live in **`lib/site.ts`** — the single source of truth. Service landing pages are generated from `ServiceLanding` type definitions rendered through `components/seo/ServiceLandingTemplate.tsx`.

### Component Organization

```
components/
  3d/          Three.js hero scene (with WebGL error boundary + mobile LOD reduction)
  hero/        Hero section with GSAP timeline animations
  layout/      Navigation, footer, scroll storyline, floating CTA, ambient overlay
  providers/   SmoothScroll (Lenis + GSAP ScrollTrigger integration)
  seo/         Structured data (JSON-LD), FAQ schema, E-E-A-T, service templates
  services/    Services grid with GSAP scroll animations
  trust/       Trust/credibility section
  proof/       Social proof marquee
  process/     Workflow methodology
  integrations/ Partners showcase
  ui/          CustomCursor, MagneticButton (elastic gsap.quickTo effects)
```

### Global State

Minimal — **Context API only**, no external state library:
- `ScrollUiStateProvider` tracks active section, scroll progress, floating CTA visibility
- Section IDs: `hero`, `services`, `proof`, `integrations`, `workflow`, `contact`

### Animation Patterns

- GSAP animations use `useGSAP()` hook from `@gsap/react` for proper cleanup
- ScrollTrigger scrub animations for scroll-linked effects
- Three.js renders at reduced quality on mobile (36 vs 64 geometry segments)
- Smooth scroll activates only on desktop with hover capability (`@media (hover: hover)`)
- All animations respect `prefers-reduced-motion`

### SEO Strategy

Heavy SEO focus: every page has OpenGraph images (generated via `ImageResponse`), Twitter cards, structured data (Organization, Service, FAQ JSON-LD), dynamic sitemap, and robots.txt. OG images are co-located with their routes.

### Deployment

cPanel/Passenger via `app.js` entry point. Host `0.0.0.0`, port from `PORT` env var or `3000`.

### Path Aliases

`@/*` maps to project root (`./`). Use `@/components/...`, `@/lib/...`, etc.

### Important Conventions

- All client components must have `'use client'` directive
- ESLint is skipped during builds (`eslint.ignoreDuringBuilds: true` in next.config.js)
- `three` is in `transpilePackages` in next.config.js
- Fonts use CSS variables (`--font-syne`, `--font-manrope`) defined in layout.tsx and consumed in tailwind.config.ts
