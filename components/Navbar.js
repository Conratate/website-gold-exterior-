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
    <header className="sticky top-0 z-40 border-b border-charcoal-100 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <nav className="container-x flex items-center justify-between gap-3 py-3 sm:py-4">
        <Link href="/" className="flex items-center" aria-label="Gold Exterior home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-charcoal-700 transition hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/quote" className="btn-primary">
            Get a Quote
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 flex-none place-items-center rounded-lg border border-charcoal-200 text-charcoal-700 transition active:bg-charcoal-50 md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-charcoal-100 bg-white md:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-semibold text-charcoal-800 hover:bg-brand-50 hover:text-brand-700"
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
