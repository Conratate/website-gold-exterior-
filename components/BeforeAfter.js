"use client";

import { useRef, useState } from "react";

// Drag-to-compare. "Before" sits on the left, "after" on the right, and the
// handle starts in the middle so both are visible at a glance. Horizontal
// drags move the handle; vertical swipes still scroll the page on a phone.
export default function BeforeAfter({ before, after, label = "Before and after" }) {
  const [pos, setPos] = useState(50);
  const box = useRef(null);
  const dragging = useRef(false);

  function moveTo(clientX) {
    const r = box.current.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }

  return (
    <div
      ref={box}
      className="relative aspect-[3/4] w-full cursor-ew-resize select-none overflow-hidden rounded-3xl border border-white/10 bg-charcoal-900 shadow-glow"
      style={{ touchAction: "pan-y" }}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div className="absolute inset-0">{after}</div>
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {before}
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-charcoal-950/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-charcoal-900">
        After
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-gold-400 shadow-[0_0_12px_rgba(242,196,36,0.7)]"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-gold-400 bg-charcoal-950 text-gold-400 shadow-gold">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>

      {/* Keyboard and screen-reader control for the same handle. */}
      <input
        type="range"
        min="0"
        max="100"
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`${label}: drag to compare`}
        className="sr-only"
      />
    </div>
  );
}
