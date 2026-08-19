import { MAX_RATING } from "@/lib/reviews";

function Star({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
    </svg>
  );
}

// A grey row of stars with a gold row clipped over the top, so a 4.3 average
// renders as 4.3 stars rather than rounding to something we didn't earn.
export default function Stars({ rating, size = "h-5 w-5", label }) {
  const pct = Math.max(0, Math.min(1, Number(rating) / MAX_RATING)) * 100;
  const stars = Array.from({ length: MAX_RATING });

  return (
    <span
      className="relative inline-flex align-middle"
      role="img"
      aria-label={label || `${rating} out of ${MAX_RATING} stars`}
    >
      <span className="flex gap-0.5 text-charcoal-200">
        {stars.map((_, i) => (
          <Star key={i} className={size} />
        ))}
      </span>
      <span
        className="absolute inset-0 flex gap-0.5 overflow-hidden text-gold-400"
        style={{ width: `${pct}%` }}
      >
        {stars.map((_, i) => (
          <Star key={i} className={`${size} flex-none`} />
        ))}
      </span>
    </span>
  );
}
