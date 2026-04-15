export default function Logo({ className = "" }) {
  return (
    <span className={`flex items-center gap-2 font-display font-extrabold ${className}`}>
      <span
        aria-hidden="true"
        className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-glow"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.5c2.6 3.7 5.5 6.7 5.5 10.2A5.5 5.5 0 1 1 6.5 12.7C6.5 9.2 9.4 6.2 12 2.5Z" />
        </svg>
      </span>
      <span className="text-lg tracking-tight text-charcoal-900">
        Gold<span className="text-brand-600"> Exterior</span>
      </span>
    </span>
  );
}
