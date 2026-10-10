"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-charcoal-950/85 backdrop-blur-md">
      <nav className="container-x flex items-center justify-between py-4">
        <Link href="/" className="flex min-h-[44px] items-center" aria-label="Gold Exterior home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-charcoal-200 transition hover:text-gold-400"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="tel:+16509433124"
            className="text-sm font-semibold text-charcoal-200 transition hover:text-gold-400"
          >
            (650) 943-3124
          </a>
          <Link href="/quote" className="btn-primary">
            Get a Quote
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Phones get the number as a one-tap icon instead of in the menu, so
            it's always reachable without appearing twice. */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="tel:+16509433124"
            aria-label="Call (650) 943-3124"
            className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 text-gold-400"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2Z" />
            </svg>
          </a>
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 text-charcoal-200 md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-charcoal-900 md:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-semibold text-charcoal-100 hover:bg-white/5 hover:text-gold-400"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 w-full"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
