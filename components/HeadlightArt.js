// Drawn stand-in for the headlight before/after until there are real job
// photos. Same lens both ways; "foggy" adds the yellow haze and crazing.
export default function HeadlightArt({ foggy = false }) {
  const id = foggy ? "hl-foggy" : "hl-clear";
  return (
    <svg viewBox="0 0 300 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-paint`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2823" />
          <stop offset="1" stopColor="#0e0d0c" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.42" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity={foggy ? 0.35 : 0.95} />
          <stop offset="0.6" stopColor="#dfe8f2" stopOpacity={foggy ? 0.15 : 0.35} />
          <stop offset="1" stopColor="#dfe8f2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-haze`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9a441" stopOpacity="0.75" />
          <stop offset="0.5" stopColor="#c99a4a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#8a6a2e" stopOpacity="0.8" />
        </linearGradient>
        <clipPath id={`${id}-lens`}>
          <path d="M40 150 C60 105 230 95 268 140 C285 165 280 245 250 268 C200 300 70 295 45 260 C28 232 28 180 40 150 Z" />
        </clipPath>
      </defs>

      <rect width="300" height="400" fill={`url(#${id}-paint)`} />
      <path d="M0 330 C80 315 220 315 300 335 L300 400 L0 400 Z" fill="#171512" />
      <path d="M0 330 C80 315 220 315 300 335" stroke="#43413d" strokeWidth="2" fill="none" />

      {/* Housing and lens */}
      <path d="M40 150 C60 105 230 95 268 140 C285 165 280 245 250 268 C200 300 70 295 45 260 C28 232 28 180 40 150 Z" fill="#1a1917" stroke="#55534e" strokeWidth="4" />
      <g clipPath={`url(#${id}-lens)`}>
        <rect x="0" y="80" width="300" height="240" fill="#26303a" />
        <circle cx="120" cy="200" r="70" fill={`url(#${id}-glow)`} />
        <circle cx="120" cy="200" r="38" fill="#3a4654" stroke="#8fa3b8" strokeWidth="3" />
        <circle cx="120" cy="200" r="22" fill="#cfd9e4" opacity={foggy ? 0.45 : 1} />
        <circle cx="205" cy="200" r="24" fill="#3a4654" stroke="#8fa3b8" strokeWidth="2" />
        <circle cx="205" cy="200" r="12" fill="#cfd9e4" opacity={foggy ? 0.4 : 0.95} />
        <path d="M60 255 H250" stroke="#f2c424" strokeWidth="6" strokeLinecap="round" opacity={foggy ? 0.35 : 0.9} />

        {foggy ? (
          <>
            <rect x="0" y="80" width="300" height="240" fill={`url(#${id}-haze)`} />
            <rect x="0" y="80" width="300" height="240" fill="#f3e6c4" opacity="0.25" />
            <g stroke="#f7ecd0" strokeOpacity="0.45" strokeWidth="1.2" fill="none">
              <path d="M70 140 l25 18 l-8 22 M150 120 l-10 30 l22 12 M210 150 l18 20 l-15 25" />
              <path d="M90 240 l30 -12 l12 20 M180 250 l25 -8 l5 18 M240 210 l-20 10" />
            </g>
            <g fill="#5c4a24" opacity="0.35">
              <ellipse cx="80" cy="170" rx="22" ry="10" />
              <ellipse cx="230" cy="235" rx="28" ry="12" />
              <ellipse cx="160" cy="262" rx="30" ry="9" />
            </g>
          </>
        ) : (
          <>
            <path d="M58 150 C110 118 200 112 250 140 L245 150 C195 126 115 130 64 160 Z" fill="#ffffff" opacity="0.55" />
            <path d="M232 232 l18 -30" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" />
          </>
        )}
      </g>
    </svg>
  );
}
