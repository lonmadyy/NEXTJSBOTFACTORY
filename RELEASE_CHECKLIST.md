# Pre-Release Checklist

## 1) Local technical checks
- `npm run lint`
- `npm run build`
- `npx tsc --noEmit`

## 2) Production smoke checks
- Start production server: `npm run start -- --port 3100`
- Open and verify:
  - `/` returns `200`
  - `/robots.txt` returns `200`
  - `/sitemap.xml` returns `200`
- Confirm:
  - `robots.txt` contains `Sitemap: https://botfactory.by/sitemap.xml`
  - `sitemap.xml` contains service landing URLs

## 3) Visual checks
- Desktop: `1366x768`, `1920x1080`
- Mobile: `390x844`, `430x932`, `400x642`, `360x640`
- Validate:
  - No horizontal page scroll
  - Sticky nav and top progress bar visible and stable
  - Floating CTA is inside viewport
  - Services cards and mockups look correct on low-height mobile viewports

## 4) SEO checks
- Home and service pages have non-empty `title` and `description`
- Favicon/app icons load (`/favicon.ico`, `/icon-192.png`, `/icon-512.png`, `/apple-touch-icon.png`)
- JSON-LD is present on page (`Organization` + `sameAs`, `FAQPage`)

## 5) Release hygiene
- `git status` is clean
- Commit messages reflect scope
- Tag/release notes prepared

## One-command runner
- Use `npm run pre-release` to run the local automated subset:
  - lint
  - build
  - typecheck
  - production server smoke checks
