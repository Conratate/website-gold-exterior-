"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GIVEAWAY, giveawayOpen } from "@/lib/promos";
import { CountdownInline } from "./Countdown";

export default function GiveawayBanner() {
  // Pages are built ahead of time, so the end date has to be checked in the
  // visitor's browser — otherwise the banner would outlive the giveaway.
  const [open, setOpen] = useState(true);
  useEffect(() => setOpen(giveawayOpen()), []);

  if (!open) return null;

  return (
    <Link
      href="/giveaway"
      className="block bg-gold-400 text-charcoal-900 transition hover:bg-gold-300"
    >
      <div className="container-x flex min-h-[44px] flex-wrap items-center justify-center gap-x-3 py-2 text-center text-sm">
        <span className="font-display font-extrabold">{GIVEAWAY.headline}.</span>
        <span className="hidden sm:inline">Get a free quote to enter.</span>
        <CountdownInline />
      </div>
    </Link>
  );
}
