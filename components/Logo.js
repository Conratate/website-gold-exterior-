export default function Logo({ className = "" }) {
  return (
    <span className={`flex items-center gap-2.5 font-display font-extrabold ${className}`}>
      <span
        aria-hidden="true"
        className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 text-charcoal-900 shadow-gold ring-1 ring-inset ring-white/40"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.5c2.6 3.7 5.5 6.7 5.5 10.2A5.5 5.5 0 1 1 6.5 12.7C6.5 9.2 9.4 6.2 12 2.5Z" />
          {/* A single highlight turns the droplet from a plain water icon into a
              polished, just-detailed finish — the "gold standard" in one stroke. */}
          <path d="M9.6 13.4a2.6 2.6 0 0 0 2.2 2.4" strokeWidth="1.6" opacity="0.75" />
        </svg>
      </span>
      <span className="text-lg tracking-tight text-charcoal-900">
        Gold<span className="text-brand-600"> Exterior</span>
      </span>
    </span>
  );
}
