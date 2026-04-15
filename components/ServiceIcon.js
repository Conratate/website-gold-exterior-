// Inline SVG icons keep us free of any third-party icon dependency.
const ICONS = {
  spray: (
    <>
      <path d="M9 3h6v4H9z" />
      <path d="M12 7v3" />
      <path d="M8 10h8l-1 4H9l-1-4Z" />
      <path d="M10 14v6m4-6v6" />
      <path d="M18 5h2m0 3h-2m2 3h-3" />
    </>
  ),
  droplet: (
    <>
      <path d="M12 2.5c2.6 3.7 5.5 6.7 5.5 10.2A5.5 5.5 0 1 1 6.5 12.7C6.5 9.2 9.4 6.2 12 2.5Z" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M7 7l2 2M15 15l2 2M7 17l2-2M15 9l2-2" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-9 7-14 16-14 0 9-5 16-14 16-2 0-2-2-2-2Z" />
      <path d="M5 19c4-4 8-7 12-9" />
    </>
  ),
};

export default function ServiceIcon({ name, className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name] || ICONS.droplet}
    </svg>
  );
}
