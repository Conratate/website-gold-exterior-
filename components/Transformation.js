// Before and after, side by side and the same size, so the difference is the
// only thing that changes between them.
//
// Deliberately a plain <img> rather than next/image: these are static files the
// owner has already sized down (see public/reviews/README.md), so the only
// thing image optimisation would add here is a dependency on how the host
// happens to implement it.
export default function Transformation({ photos, className = "" }) {
  if (!photos?.before || !photos?.after) return null;

  const sides = [
    { src: photos.before, label: "Before" },
    { src: photos.after, label: "After" },
  ];

  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      {sides.map((side) => (
        <figure
          key={side.label}
          className="relative aspect-[4/3] overflow-hidden rounded-xl bg-charcoal-100"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={side.src}
            alt={`${side.label} — ${photos.alt || "Gold Exterior job"}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <figcaption
            className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              side.label === "After"
                ? "bg-gold-400 text-charcoal-900"
                : "bg-charcoal-900/75 text-white"
            }`}
          >
            {side.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
