import { BUSINESS } from "./location";
import { SERVICES } from "./services";

// ─────────────────────────────────────────────────────────────────────────────
// Published customer reviews.
//
// Nothing a visitor types goes live on its own. A customer submits a review at
// /reviews behind the review code, it lands in the owner's inbox, and the owner
// publishes it by pasting the snippet from that email into the array below and
// deploying. That's the whole moderation story: this file is the website's
// record of what's public.
//
// Newest first. Shape:
//   {
//     id:      "unique-slug",          // stable key; never reuse one
//     name:    "First L.",             // how the customer is credited
//     city:    "Mountain View",        // city only, never a street address
//     service: "Pressure Washing",     // what we actually did
//     rating:  5,                      // whole number, 1–5
//     date:    "2026-08-19",           // ISO date the job wrapped
//     headline:"Driveway looks new",   // optional; omit the key if unused
//     body:    "…",                    // the customer's words, lightly trimmed
//   }
// ─────────────────────────────────────────────────────────────────────────────
export const REVIEWS = [];

export const MAX_RATING = 5;

export function reviewStats(reviews = REVIEWS) {
  const count = reviews.length;
  if (count === 0) {
    return { count: 0, average: 0, distribution: [0, 0, 0, 0, 0] };
  }

  const total = reviews.reduce((sum, r) => sum + clampRating(r.rating), 0);
  const distribution = [0, 0, 0, 0, 0];
  for (const r of reviews) distribution[clampRating(r.rating) - 1] += 1;

  return {
    count,
    // One decimal is the convention everywhere ratings are shown, and it keeps
    // a single 4-star review from rendering as "4.333333".
    average: Math.round((total / count) * 10) / 10,
    distribution,
  };
}

export function clampRating(value) {
  const n = Math.round(Number(value) || 0);
  return Math.min(MAX_RATING, Math.max(1, n));
}

// The stat tiles on the home and about pages used to advertise a flat 5★ with
// no reviews behind it. Until a real one is published they show something we
// can stand behind instead.
export function ratingStat() {
  const { count, average } = reviewStats();
  if (count === 0) {
    return { value: BUSINESS.serviceAreaShort, label: "Where we work" };
  }
  return {
    value: `${average}★`,
    label: count === 1 ? "From 1 review" : `From ${count} reviews`,
  };
}

// Structured data only claims a rating once one exists.
export function aggregateRatingSchema() {
  const { count, average } = reviewStats();
  if (count === 0) return null;
  return {
    "@type": "AggregateRating",
    ratingValue: average,
    reviewCount: count,
    bestRating: MAX_RATING,
    worstRating: 1,
  };
}

export function formatReviewDate(iso) {
  if (!iso) return "";
  // Parse the parts by hand: `new Date("2026-08-19")` is UTC midnight, which
  // renders as the previous day for anyone west of Greenwich — including us.
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return "";
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// What a reviewer can say the job was. The form renders these and the API
// resolves the submitted id back to a name, so a review can never credit a
// service we don't offer.
export const REVIEW_SERVICE_OPTIONS = [
  ...SERVICES.map((s) => ({ id: s.id, name: s.name })),
  { id: "multiple", name: "Multiple services" },
  { id: "other", name: "Something else" },
];

export function reviewServiceName(id) {
  const match = REVIEW_SERVICE_OPTIONS.find((o) => o.id === id);
  return match ? match.name : null;
}
