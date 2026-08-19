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
| `REVIEW_CODE_SECRET` | **Required for reviews.** Signs the per-job codes. A long random string. No default — unset means the review form accepts nothing. |
| `OWNER_CODE`         | **Required for reviews.** Your password for `/reviews/new-code`, where you issue a customer their code. Never given to customers. |

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

### One code per job

A single shared code has a hole in it — a customer can pass it to a friend who
never hired us. So each job gets its own code instead, and each one works once.

After you finish a job, open **`/reviews/new-code`** on your phone, enter your
`OWNER_CODE`, and fill in the customer's name and email. They get a thank-you
email with their code and a link that fills it in for them; you get a copy, so
your inbox is the record of which code went to whom. No ledger to keep.

A code is three things at once:

| | |
| --- | --- |
| **Signed** | It carries an HMAC over its own contents, so the server can tell we issued it without looking anything up. Forging one means guessing 40 bits. |
| **Expiring** | It goes stale on its own — 90 days by default, and you can pick 30 days to a year when you issue it. |
| **Single-use** | It's burned the moment it's redeemed. Forwarding it to a friend gets them nothing. |

Codes look like `RS41-KP7S-T2EG-TEQZ-881V`. They use
[Crockford base32](https://www.crockford.com/base32.html), so there's no I, L,
O or U to misread, and typing `O` for `0` still works. Case, spaces and dashes
are all ignored.

### Where "used once" is recorded

Single-use needs somewhere to write down "this one is spent", and that's
[Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/) —
built into Netlify, nothing to sign up for. The write is a compare-and-set, so
two people submitting the same code at the same instant can't both get through.

If that store is ever unreachable — an incident, or the site running somewhere
without it — a review is **not** rejected. The code was still signed, still
unexpired, and still issued to one named customer, and you read every review
before it goes live anyway. The system degrades to those three facts and says
so in red at the top of the email, rather than throwing away a review someone
took the trouble to write.

### How a review gets published

1. The customer submits the form. It emails you a review marked *Awaiting Your
   Approval*, naming the code it came in on.
2. Search your inbox for that code to see the job it was issued against.
3. The email ends with a ready-made snippet. Paste it at the top of the
   `REVIEWS` array in `lib/reviews.js` (newest first) and deploy.

That's the whole moderation system: `lib/reviews.js` is the site's record of
what's public, and it only changes when you change it.

### If a code gets abused

Change `REVIEW_CODE_SECRET` and redeploy. Every code still outstanding stops
working at once, and you re-issue to anyone who still needs one. That's the
emergency stop.

### What the empty page does

With no published reviews, `/reviews` explains the standard instead of
pretending. The star ratings on the home and about pages also read from
`lib/reviews.js` — with zero reviews they show the service area rather than an
invented 5★, and the `aggregateRating` structured data is omitted entirely.
Both start reporting real numbers the moment you publish one.

## Deploying

The site runs on **[Netlify](https://netlify.com)**, which builds from this
repo on every push and handles HTTPS automatically.

Set these under **Site configuration → Environment variables**, then trigger a
deploy — Netlify only picks up variable changes on a new build:

- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `QUOTE_TO_EMAIL`
- `REVIEW_CODE_SECRET`
- `OWNER_CODE`

Netlify Blobs, which records spent review codes, needs no setup: it comes with
the site.

> **Note:** `.github/workflows/deploy.yml` still deploys to Vercel, left over
> from an earlier host. If Netlify is the only live site, that workflow should
> be deleted so a push doesn't publish to two places.

## Project structure

```
app/
  api/quote/route.js    ← Quote intake → email
  api/review/route.js   ← Review intake: verify code, burn it, email
  api/review-code/route.js ← Owner-only: mint a code and email the customer
  about/page.js
  quote/page.js
  reviews/page.js       ← Published reviews + submission form
  reviews/new-code/page.js ← Owner-only: issue a customer their code
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
  CodeIssuer.js         ← Owner-only code issuing form
  ServiceAreaGrid.js    ← The cities we cover
  ServiceIcon.js
  Stars.js
lib/
  services.js           ← Service catalog + pricing logic (single source of truth)
  location.js           ← Where we're based and which cities we serve
  reviews.js            ← Published reviews (edit this to publish one)
  reviewCodes.js        ← Minting and verifying per-job codes
  codeStore.js          ← Burning a code so it only works once
  throttle.js           ← Per-address rate limiting for the code checks
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
