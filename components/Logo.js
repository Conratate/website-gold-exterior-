export default function Logo({ className = "" }) {
  return (
    <span className={`flex items-center gap-2 font-display font-extrabold ${className}`}>
      <span
        aria-hidden="true"
        className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-charcoal-900 shadow-gold"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M12 2L4 5.5V11c0 5.3 3.6 10.2 8 11.5 4.4-1.3 8-6.2 8-11.5V5.5L12 2z" />
        </svg>
      </span>
      <span className="text-lg tracking-tight">
        <span className="text-gold-600">Gold</span>
        <span className="text-brand-700"> Exterior</span>
      </span>
    </span>
  );
}
