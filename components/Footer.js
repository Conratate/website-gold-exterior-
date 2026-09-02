import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-charcoal-100 bg-charcoal-950 text-charcoal-200">
      <div className="container-x grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo className="text-white [&_span:last-child]:text-white" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal-300">
            Gold Exterior is a full-service exterior property care company. We
            handle the dirty work outside your home so you can enjoy what's
            inside it.
          </p>
          <div className="mt-5 space-y-1 text-sm">
            <a
              href="tel:+16509433124"
              className="inline-flex min-h-[44px] items-center gap-2 font-display text-xl font-bold text-white hover:text-gold-300"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none text-gold-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2Z" />
              </svg>
              (650) 943-3124
            </a>
            <p className="text-charcoal-300">Serving Santa Clara County</p>
          </div>
          <Link href="/quote" className="btn-gold mt-5">
            Get a Free Quote
          </Link>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Services
          </h4>
          <ul className="text-sm">
            <li><Link className="-mx-2 inline-flex min-h-[44px] items-center px-2 py-2 hover:text-white" href="/services#pressure-washing">Pressure Washing</Link></li>
            <li><Link className="-mx-2 inline-flex min-h-[44px] items-center px-2 py-2 hover:text-white" href="/services#commercial-cleaning">Commercial Cleaning</Link></li>
            <li><Link className="-mx-2 inline-flex min-h-[44px] items-center px-2 py-2 hover:text-white" href="/services#graffiti-removal">Graffiti Removal</Link></li>
            <li><Link className="-mx-2 inline-flex min-h-[44px] items-center px-2 py-2 hover:text-white" href="/services#holiday-lights">Holiday Lights</Link></li>
            <li><Link className="-mx-2 inline-flex min-h-[44px] items-center px-2 py-2 hover:text-white" href="/services#gutter-cleaning">Gutter Cleaning</Link></li>
            <li><Link className="-mx-2 inline-flex min-h-[44px] items-center px-2 py-2 hover:text-white" href="/services#detailing">Car Detailing</Link></li>
            <li><Link className="-mx-2 inline-flex min-h-[44px] items-center px-2 py-2 hover:text-white" href="/services#weed-removal">Weed &amp; Debris Removal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Company
          </h4>
          <ul className="text-sm">
            <li><Link className="-mx-2 inline-flex min-h-[44px] items-center px-2 py-2 hover:text-white" href="/">Home</Link></li>
            <li><Link className="-mx-2 inline-flex min-h-[44px] items-center px-2 py-2 hover:text-white" href="/services">Services</Link></li>
            <li><Link className="-mx-2 inline-flex min-h-[44px] items-center px-2 py-2 hover:text-white" href="/about">About Us</Link></li>
            <li><Link className="-mx-2 inline-flex min-h-[44px] items-center px-2 py-2 hover:text-white" href="/quote">Get a Quote</Link></li>
            <li><Link className="-mx-2 inline-flex min-h-[44px] items-center px-2 py-2 hover:text-white" href="/review">Leave a Review</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-x flex flex-col items-start justify-between gap-3 py-6 text-xs text-charcoal-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Gold Exterior. All rights reserved.</p>
          <p>Santa Clara County, CA · goldexterior.com</p>
        </div>
      </div>
    </footer>
  );
}
