// Review data + the rating dimensions a customer scores after a job.
//
// There's no database behind the site, so submitted reviews arrive by email
// and the ones worth showing get pasted into PUBLISHED below by hand. That
// keeps the owner in control of what appears publicly, which matters more
// than automation for a business this size.

export const REVIEW_DIMENSIONS = [
  {
    id: "quality",
    label: "Quality of work",
    hint: "Did the finished result meet what was promised?",
  },
  {
    id: "professionalism",
    label: "Professionalism",
    hint: "Courteous, tidy, respectful of your property?",
  },
  {
    id: "timeliness",
    label: "On time & on schedule",
    hint: "Did we show up and finish when we said we would?",
  },
  {
    id: "communication",
    label: "Communication",
    hint: "Kept you informed before, during and after?",
  },
  {
    id: "value",
    label: "Value for the price",
    hint: "Did the final price match the quote and the work?",
  },
];

// Reviews cleared for publication. Add an entry here after a customer ticks
// the consent box on their submission.
export const PUBLISHED = [];

export function averageOf(ratings = {}) {
  const scores = REVIEW_DIMENSIONS.map((d) => Number(ratings[d.id]) || 0).filter(
    (n) => n > 0
  );
  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

// Aggregate shown alongside published reviews. Returns null when there's
// nothing published yet so callers can hide the section entirely rather
// than advertise an empty or invented rating.
export function publishedSummary(list = PUBLISHED) {
  if (!list.length) return null;
  const totals = list.map((r) => r.overall || averageOf(r.ratings));
  const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
  return { count: list.length, average: Math.round(avg * 10) / 10 };
}

export function starLabel(n) {
  return (
    {
      1: "Poor",
      2: "Below expectations",
      3: "Met expectations",
      4: "Great",
      5: "Excellent",
    }[Math.round(n)] || ""
  );
}
