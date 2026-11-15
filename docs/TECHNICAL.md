# Tais Tattoos: technical documentation

**Designed and developed by Daniel Cikora** · [github.com/DanielCikora](https://github.com/DanielCikora)

This document is for developers. The guide for Tais (how to edit content in `/admin`) is the [README](../README.md).

---

## Overview

A multilingual (English, Serbian, Russian) portfolio and booking site for a tattoo artist working in Belgrade, Novi Sad and Zrenjanin. All content lives as Markdown files in this repository and is edited through a Git-based CMS at `/admin`, so there is no database.

| | |
|---|---|
| Live site | https://taistattoos.com |
| CMS | https://taistattoos.com/admin |
| Repository | `DanielCikora/tattoo-website` (branch `main`) |
| Hosting | Vercel (auto-deploys every push to `main`) |

---

## Tech stack

| Area | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org) 16 (App Router, static generation), React 19, TypeScript 5 |
| Styling | [Tailwind CSS](https://tailwindcss.com) 4, custom utilities in `styles/globals.css` (`wrapper`, `link-underline`, `btn-fill`) |
| Font | Inter via `next/font/google` (Latin + Cyrillic) |
| Animation | [Framer Motion](https://motion.dev) for reveals, menu, accordions and scroll-linked steps |
| Smooth scrolling | [Lenis](https://lenis.darkroom.engineering) (disabled automatically for reduced-motion users) |
| Content | Markdown + front matter, parsed with `gray-matter`; rich text rendered with `react-markdown` |
| CMS | [Decap CMS](https://decapcms.org) 3 (loaded from unpkg with an integrity hash), GitHub backend |
| Email | `nodemailer` over Gmail SMTP |
| Spam protection | Cloudflare Turnstile (`@marsidev/react-turnstile`), honeypot field, minimum fill time |
| Rate limiting | Upstash Redis + `@upstash/ratelimit` (sliding window) |
| Images | `next/image` (automatic resizing and modern formats on Vercel) |
| Linting | ESLint 9 with `eslint-config-next` |

---

## External services

| Service | Used for | Where it's configured | Env vars |
|---|---|---|---|
| **Vercel** | Hosting, builds, image optimisation, serverless API routes | Vercel dashboard | all below |
| **GitHub** | Code and content storage; the CMS commits content here | `public/admin/index.html` (`REPO`) | — |
| **GitHub OAuth App** | Logging into `/admin` | GitHub → Settings → Developer settings → OAuth Apps. Callback: `https://taistattoos.com/api/callback` | `OAUTH_GITHUB_CLIENT_ID`, `OAUTH_GITHUB_CLIENT_SECRET` |
| **Gmail (SMTP)** | Sending contact inquiries and shop orders to Tais, and order confirmations to customers | Google account with 2-step verification + an App Password | `CONTACT_SMTP_USER`, `CONTACT_SMTP_PASS`, `CONTACT_TO_EMAIL` |
| **Cloudflare Turnstile** | Bot protection on both forms (invisible "interaction-only" mode) | Cloudflare dashboard → Turnstile | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| **Upstash Redis** | Rate limiting the forms | Upstash console → REST API section (URL must start with `https://`) | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| **Google Fonts** | Inter, self-hosted at build time by `next/font` (no request to Google from visitors) | `app/[locale]/layout.tsx` | — |
| **unpkg** | Serves the Decap CMS script for `/admin` only | `public/admin/index.html` | — |

Other env var: `ALLOW_INDEXING=true` on **Production only** lets search engines index the site. Anywhere else the site sends `noindex` and a blocking `robots.txt`.

All variables are documented in `.env.example`. In Vercel, enter values **without quotes**.

---

## Project structure

```
app/
  [locale]/            Root layout (sets <html lang>) and all pages: home, gallery, about, contact, shop, privacy
  api/contact/         Contact form endpoint
  api/order/           Shop order endpoint
  api/auth, callback/  GitHub OAuth for the CMS
  sitemap.ts, robots.ts, global-not-found.tsx
components/
  layout/              Page sections (hero, gallery, about, testimonials, booking, faq, contact, shop, footer, navigation)
  ui/                  Shared pieces (CTA, ChoiceChip, Accordion, FormTurnstile, FormAlert, Markdown…)
  animations/          SplitText and animation config
content/               All site content as Markdown (edited through /admin)
hooks/                 Form state, scroll progress, anchor scrolling
lib/
  content/content.ts   Reads and localises content files
  server/              Email, validation, rate limiting, Turnstile (server only)
  constants/           Labels, limits, SEO copy, shared class names
  seo.ts               Canonical/hreflang/Open Graph helper and indexing switch
public/admin/          Decap CMS entry page and config.yml
styles/globals.css     Tailwind setup and custom utilities
types/                 TypeScript types for content and forms
```

---

## How things work

### Languages
- Every page lives under `/en`, `/sr` or `/ru`. Visiting `/` redirects based on the browser language (`proxy.ts`).
- Content fields come in `_en`, `_sr`, `_ru` variants. Empty Serbian or Russian fields fall back to English (`pick()` in `lib/content/content.ts`).
- Small UI labels (nav, buttons, error messages) are in `lib/constants/*`.

### Content and CMS
- Decap CMS reads `public/admin/config.yml`. Collections are listed in the same order as the website sections.
- Saving in `/admin` commits to `main` on GitHub, which triggers a Vercel deploy (about a minute).
- Locally, `npm run dev` starts both Next.js and `decap-server`, so `/admin` edits the local files directly (`local_backend: true`).

### SEO
- Per-page canonical URL, `hreflang` alternates (+ `x-default` → English) and localised Open Graph tags via `pageMetadata()` in `lib/seo.ts`.
- `sitemap.xml` with language alternates, `robots.txt`, and `TattooParlor` JSON-LD on the home page.
- Home page titles and descriptions per language are in `lib/constants/seo.ts`.
- Share image: `public/og-default.jpg` (1200×630). **Must be added.**

### Forms (contact and shop order)
1. The browser gets an invisible Turnstile token (the widget only appears if Cloudflare needs a click).
2. `POST /api/contact` or `/api/order` checks, in order: same origin → per-IP rate limit → body size → JSON → honeypot and minimum fill time (bots get a fake success) → consent → validation → Turnstile → global and per-recipient limits → send email.
3. Each failure returns a code (`rate`, `captcha`, `invalid`, `unavailable`, `send`…) that `lib/utils/post-form.ts` turns into a translated message. Requests time out after 25 s.
4. Rate-limit rules are in `lib/constants/rate-limit.ts`. Contact limits *fail open* (the form keeps working if Redis is down); shop limits *fail closed* (orders are refused with "temporarily unavailable").

### Shop safeguard
- `getSite()` in `lib/content/content.ts` is the single source for whether the shop exists (page, menu link, sitemap, order API).
- When `ALLOW_INDEXING=true` (the live site), the shop is only enabled if `shop_enabled` **and** all seller details (`seller_name`, `seller_address`, `seller_mb`, `seller_pib`) are set. Otherwise `/shop` returns 404. In development the switch alone decides.
- `/admin` also shows a confirmation dialog (`preSave` listener in `public/admin/index.html`) when saving Settings with the shop on and seller details missing.
- Filled-in seller details are shown at the bottom of the Shop page, as Serbian e-commerce rules require.

### Performance notes
- **Above-the-fold headings** use `SplitText` with `reveal='focus'`: letters are painted from the first frame (blur + rise) instead of fading in from `opacity: 0`, which Largest Contentful Paint would ignore until the animation ends. Headings further down keep the default `'fade'`.
- **Hero video:** keep it under ~3 MB (720p H.264, no audio, "web optimized"/faststart) and set a poster image in the CMS. The current file is a placeholder.

### Security
- Security headers and a Content-Security-Policy in `next.config.ts` (CSP is currently **report-only**; switch to enforcing once the browser console is clean).
- Only hashes of IPs and emails are stored by the rate limiter.
- The OAuth flow uses a `state` cookie to prevent CSRF.

---

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values (quotes are fine locally)
npm run dev                  # site on http://localhost:3000, CMS on http://localhost:3000/admin
npm run build                # production build (run before pushing)
```

---

## Launch and handover checklist

- [ ] Add `public/og-default.jpg` (1200×630 photo of her work).
- [ ] Replace placeholder gallery items and remove test shop products (or turn the shop off in Site settings).
- [ ] Set `ALLOW_INDEXING=true` in Vercel **Production**.
- [ ] Verify the domain in Google Search Console and Bing Webmaster Tools; submit `/sitemap.xml`.
- [ ] Create a Google Business Profile (service-area business) and link the site.
- [ ] Switch the CSP header from report-only to enforcing.
- [ ] On handover: transfer the repo, update `REPO` in `public/admin/index.html`, update the OAuth App owner and callback URL, and move env vars to the new Vercel account.

---

<sub>Built by Daniel Cikora, 2026.</sub>
