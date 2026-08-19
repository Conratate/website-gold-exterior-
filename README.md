# Gold Exterior — goldexterior.com

A modern Next.js 14 (App Router) marketing site for **Gold Exterior**, a premium
exterior property services business serving the Bay Area from Rex Manor,
Mountain View. Built with React, Tailwind CSS, and Gmail-backed quote and
review intake APIs.

## Features

- **Home, Services, Reviews, About Us, Get a Quote** — clean, mobile-first
  layout with a professional blue/gold/charcoal palette.
- **Six services** (anchored sections on `/services`):
  - Pressure Washing (driveways, siding, fences)
  - Commercial Cleaning
  - Graffiti Removal
  - Holiday Lights Installation
  - Gutter Cleaning
  - Detailing (car & boat)
- **Multi-step Estimate Calculator** at `/quote` with:
  - Service checklist (multi-select)
  - Service-specific dynamic questions (e.g. surface & size, boat length)
  - Required contact fields (name, address, phone, email)
  - Optional photo upload
  - **Live, instant price estimate** that updates as the user fills the form
  - Review screen before submission
- **`/api/quote` API route** that emails a structured HTML summary (with the
  attached photo and reply-to set to the customer) to your business address
  over Gmail SMTP.
- **Reviews page** at `/reviews` with a customer-only submission form — see
  [Reviews](#reviews) below.
- **Service area** — the cities we cover live in `lib/location.js` and feed the
  home page, the about page, the footer and the `LocalBusiness` structured data
  that puts us in local search results.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router, JavaScript)
- [React 18](https://react.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Nodemailer](https://nodemailer.com/) over Gmail SMTP for transactional email

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

| Variable             | Description                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `GMAIL_USER`         | The Gmail address that sends quote and review emails.                                            |
| `GMAIL_APP_PASSWORD` | A Gmail **App Password**, not your account password. Spaces are stripped, so paste it as shown.   |
| `QUOTE_TO_EMAIL`     | Where quote requests and review submissions land. Defaults to `goldexterior0@gmail.com`.          |
| `REVIEW_CODE`        | **Required for reviews.** The code a customer needs to submit one. No default — unset means the form accepts nothing. See [Reviews](#reviews). |

## Setting up Gmail sending (one-time)

1. Turn on **2-Step Verification** for the Gmail account at
   <https://myaccount.google.com/security>.
2. Create an App Password at <https://myaccount.google.com/apppasswords>
   (pick "Mail" / "Other"). Google shows it as four groups of four letters.
3. Put the address in `GMAIL_USER` and the app password in
   `GMAIL_APP_PASSWORD`. You can leave the spaces in — they're stripped before
   the SMTP handshake.
4. Set `QUOTE_TO_EMAIL` to wherever you want to receive leads and reviews.

Replying to either email reaches the customer directly, because `replyTo` is
set to their address.

## Reviews

The `/reviews` page has two halves: the reviews that are published, and a form
for customers to submit new ones. **Nothing a visitor types ever appears on the
site on its own.**

### How a customer submits one

They need the **review code** — whatever you set `REVIEW_CODE` to. Hand it out
when a job wraps: say it at the final walkthrough, print it on the invoice, put
it in the follow-up email. It's checked on the server and never sent to the
browser, so it can't be read out of the page source.

The check is forgiving about how it's typed — case, spaces, dashes and dots are
all ignored, so `two words 2026` and `TWO-WORDS-2026` are the same answer. Pick
a phrase people can remember without writing down. Six wrong guesses from one
address earns that address a 15-minute timeout.

**There is no default code, and none should ever be committed here.** This
repository is public, so a code in the source would be a published password
rather than a gate. With `REVIEW_CODE` unset the form fails closed — it accepts
nothing and tells the visitor reviews aren't open yet, while logging a loud
warning server-side. That's the intended behaviour for a misconfiguration.

**Rotate the code by changing `REVIEW_CODE` in your host's environment
variables and redeploying.** Old codes stop working as soon as the new
deployment is live — handy at the turn of the year if your code carries one.

### How a review gets published

1. The customer submits the form. It emails you a review marked *Awaiting Your
   Approval*, with their email address and the month they say the job happened.
2. Check the name and the month against your records. The code proves they were
   given it — not that they're the person you think they are.
3. The email ends with a ready-made snippet. Paste it at the top of the
   `REVIEWS` array in `lib/reviews.js` (newest first) and deploy.

That's the whole moderation system: `lib/reviews.js` is the site's record of
what's public, and it only changes when you change it.

### What the empty page does

With no published reviews, `/reviews` explains the standard instead of
pretending. The star ratings on the home and about pages also read from
`lib/reviews.js` — with zero reviews they show the service area rather than an
invented 5★, and the `aggregateRating` structured data is omitted entirely.
Both start reporting real numbers the moment you publish one.

## Deploying to a public HTTPS URL

The simplest path is **[Vercel](https://vercel.com)** (made by the creators of
Next.js, free tier is plenty for a marketing site):

1. Push this repo to GitHub (the branch is already set up).
2. Go to <https://vercel.com/new>, import the repo.
3. In the project's **Settings → Environment Variables**, add:
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `QUOTE_TO_EMAIL`
   - `REVIEW_CODE`
4. Hit **Deploy**. Vercel gives you an HTTPS URL like
   `gold-exterior.vercel.app` immediately.
5. In **Settings → Domains**, add `goldexterior.com` and follow the DNS
   instructions to point your domain at Vercel. HTTPS is automatic.

Other hosts that work out of the box: Netlify, Cloudflare Pages, Render, Fly.io.

## Project structure

```
app/
  api/quote/route.js    ← Quote intake → email
  api/review/route.js   ← Review intake: code check → email
  about/page.js
  quote/page.js
  reviews/page.js       ← Published reviews + submission form
  services/page.js
  layout.js             ← Site shell + LocalBusiness structured data
  page.js               ← Home
  globals.css           ← Tailwind + design tokens
components/
  Footer.js
  Navbar.js
  Logo.js
  QuoteForm.js          ← Multi-step estimate calculator
  ReviewForm.js         ← Code-gated review submission
  ServiceAreaGrid.js    ← The cities we cover
  ServiceIcon.js
  Stars.js
lib/
  services.js           ← Service catalog + pricing logic (single source of truth)
  location.js           ← Where we're based and which cities we serve
  reviews.js            ← Published reviews (edit this to publish one)
  mailer.js             ← Shared Gmail SMTP transport
  image.js              ← Client-side photo downscaling
  escape.js             ← HTML escaping for outbound email
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
- **Service area** (the city chips, the "where we work" copy, the structured
  data) lives in `lib/location.js`. Add a city there and it appears everywhere.
- **Published reviews** live in `lib/reviews.js`. See [Reviews](#reviews).

## Notes

- We **do not** offer interior cleaning. The site copy reflects that.
- All quotes are explicitly described as **rough, non-binding estimates** until
  Gold Exterior reviews the photo and address.
- We're based in **Rex Manor, Mountain View** and serve **the Bay Area**, with
  larger jobs elsewhere in California by arrangement. There's no storefront —
  the site says so rather than implying one.
- The site never claims a star rating it doesn't have. Ratings and
  `aggregateRating` structured data are derived from `lib/reviews.js`.
