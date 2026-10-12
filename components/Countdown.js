"use client";

import { useEffect, useState } from "react";
import { GIVEAWAY } from "@/lib/promos";

function remaining() {
  const ms = Math.max(0, new Date(GIVEAWAY.endsAt) - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    done: ms === 0,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

// The time only exists in the browser, so nothing renders until mount —
// otherwise the build-time snapshot would flash a stale countdown.
function useRemaining() {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    setLeft(remaining());
    const id = setInterval(() => setLeft(remaining()), 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

const pad = (n) => String(n).padStart(2, "0");

export function CountdownInline() {
  const left = useRemaining();
  if (!left || left.done) return null;
  return (
    <span className="font-semibold tabular-nums">
      Winner in {left.days}d {pad(left.hours)}h {pad(left.minutes)}m {pad(left.seconds)}s
    </span>
  );
}

export default function Countdown() {
  const left = useRemaining();
  if (!left) return <div className="h-[92px]" />;
  if (left.done) {
    return (
      <p className="font-display text-2xl font-extrabold text-gold-300">
        Entries are closed — we're drawing the winner now.
      </p>
    );
  }
  const units = [
    ["Days", left.days],
    ["Hours", pad(left.hours)],
    ["Min", pad(left.minutes)],
    ["Sec", pad(left.seconds)],
  ];
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-gold-200">
        Winner announced in
      </div>
      <div className="mt-2 flex gap-2 sm:gap-3">
        {units.map(([label, value]) => (
          <div
            key={label}
            className="w-[4.25rem] rounded-xl border border-gold-300/40 bg-gold-400/10 py-2 text-center sm:w-20"
          >
            <div className="font-display text-2xl font-extrabold tabular-nums text-white sm:text-3xl">
              {value}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gold-200">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
