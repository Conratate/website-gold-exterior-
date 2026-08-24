// Single source of truth for the customer review form.
// Shared by the /review page and the /api/review email route so the form and
// the server validate against exactly the same list.

export const MAX_STARS = 5;

// The parts of a job a customer can actually judge. Kept short on purpose —
// a six-question form gets finished, a twelve-question one gets abandoned.
export const RATING_CATEGORIES = [
  {
    id: "professionalism",
    label: "Professionalism",
    hint: "Courteous, in uniform, respectful of your property",
  },
  {
    id: "quality",
    label: "Quality of work",
    hint: "How the finished job actually looks",
  },
  {
    id: "timeliness",
    label: "On time",
    hint: "Showed up inside the window we promised",
  },
  {
    id: "communication",
    label: "Communication",
    hint: "Clear quote, updates, and straight answers",
  },
  {
    id: "cleanup",
    label: "Cleanup",
    hint: "Site left as tidy as we found it — or tidier",
  },
  {
    id: "value",
    label: "Value for the price",
    hint: "What you paid versus what you got",
  },
];

export const STAR_LABELS = {
  1: "Poor",
  2: "Below expectations",
  3: "Fine",
  4: "Good",
  5: "Excellent",
};

/** True for a whole number of stars inside 1–5. Anything else is discarded. */
export function isValidRating(value) {
  return Number.isInteger(value) && value >= 1 && value <= MAX_STARS;
}

/**
 * Average of whichever categories the customer actually rated, rounded to one
 * decimal. Skipped categories are ignored rather than counted as zero, so a
 * customer who only rates two of six isn't penalized for it.
 */
export function averageRating(ratings = {}) {
  const values = Object.values(ratings).filter(isValidRating);
  if (values.length === 0) return null;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

/** "★★★★☆" — used in the email, where CSS star widgets can't be trusted. */
export function starString(value) {
  const n = isValidRating(value) ? value : 0;
  return "★".repeat(n) + "☆".repeat(MAX_STARS - n);
}
