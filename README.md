# Gold Exterior — goldexterior.com

A modern Next.js 14 (App Router) marketing site for **Gold Exterior**, a premium
exterior property services business. Built with React, Tailwind CSS, and a
Resend-powered quote intake API.

## Features

- **Home, Services, About Us, Get a Quote** — clean, mobile-first layout with a
  professional blue/gold/charcoal palette.
- **Five service pages** (anchored sections on `/services`):
  - Pressure Washing (driveways, siding, decks)
  - Pool Cleaning
  - Junk Removal
  - Holiday Lights Installation
  - Gutter Cleaning
- **Multi-step Estimate Calculator** at `/quote` with:
  - Service checklist (multi-select)
  - Service-specific dynamic questions (e.g., pool type & size, junk truck size)
  - Required contact fields (name, address, phone, email)
  - Optional photo upload
  - **Live, instant price estimate** that updates as the user fills the form
  - Review screen before submission
- **`/api/quote` API route** that emails a structured HTML summary (with the
  attached photo and reply-to set to the customer) to your business address
  using [Resend](https://resend.com).

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router, JavaScript)
- [React 18](https://react.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Resend](https://resend.com) for transactional email

## Getting started locally

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env.local
#    then edit .env.local with your real values

# 3. Run the dev server
npm run dev
```

Open <http://localhost:3000>.

## Environment variables

Set these in `.env.local` (and in your hosting provider's dashboard for
production):

| Variable          | Description                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`  | Your Resend API key. Create one at <https://resend.com/api-keys>.                                    |
| `QUOTE_TO_EMAIL`  | The business email that should receive quote requests (e.g. `owner@goldexterior.com`).               |
| `QUOTE_FROM_EMAIL`| The verified sender address, e.g. `"Gold Exterior Quotes <quotes@goldexterior.com>"`. The domain must be verified in Resend. |

## Setting up Resend (one-time)

1. Sign up at <https://resend.com> and create an account.
2. **Add your domain** (`goldexterior.com`) under **Domains** and add the DNS
   records Resend gives you (SPF, DKIM, and optionally DMARC) at your DNS host.
3. Wait for verification (usually a few minutes).
4. Go to **API Keys → Create API Key** with "Sending access" and copy it into
   `RESEND_API_KEY`.
5. Pick a sender on your verified domain and put it in `QUOTE_FROM_EMAIL` (e.g.
   `quotes@goldexterior.com`). Set `QUOTE_TO_EMAIL` to wherever you want to
   receive leads.

That's it — your form submissions will be delivered as styled HTML emails with
the customer's photo attached, and replying directly will reach the customer
because `replyTo` is set to their email.

## Deploying to a public HTTPS URL

The simplest path is **[Vercel](https://vercel.com)** (made by the creators of
Next.js, free tier is plenty for a marketing site):

1. Push this repo to GitHub (the branch is already set up).
2. Go to <https://vercel.com/new>, import the repo.
3. In the project's **Settings → Environment Variables**, add:
   - `RESEND_API_KEY`
   - `QUOTE_TO_EMAIL`
   - `QUOTE_FROM_EMAIL`
4. Hit **Deploy**. Vercel gives you an HTTPS URL like
   `gold-exterior.vercel.app` immediately.
5. In **Settings → Domains**, add `goldexterior.com` and follow the DNS
   instructions to point your domain at Vercel. HTTPS is automatic.

Other hosts that work out of the box: Netlify, Cloudflare Pages, Render, Fly.io.

## Project structure

```
app/
  api/quote/route.js   ← Resend-powered email API
  about/page.js
  quote/page.js
  services/page.js
  layout.js            ← Site shell
  page.js              ← Home
  globals.css          ← Tailwind + design tokens
components/
  Footer.js
  Navbar.js
  Logo.js
  QuoteForm.js         ← Multi-step estimate calculator
  ServiceIcon.js
lib/
  services.js          ← Service catalog + pricing logic (single source of truth)
tailwind.config.js
next.config.js
```

## Customizing

- **Service catalog & pricing** lives in `lib/services.js`. Tweak the `price`
  function on any service to adjust your math. The Home, Services, and Quote
  pages all read from this file.
- **Colors** are defined in `tailwind.config.js` under `theme.extend.colors`
  (`brand`, `gold`, `charcoal`).
- **Copy** lives in each page file under `app/`.

## Notes

- We **do not** offer interior cleaning. The site copy reflects that.
- All quotes are explicitly described as **rough, non-binding estimates** until
  Gold Exterior reviews the photo and address.
