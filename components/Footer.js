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
          <Link href="/quote" className="btn-gold mt-6">
            Get a Free Quote
          </Link>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Services
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/services#pressure-washing">Pressure Washing</Link></li>
            <li><Link className="hover:text-white" href="/services#commercial-cleaning">Commercial Cleaning</Link></li>
            <li><Link className="hover:text-white" href="/services#graffiti-removal">Graffiti Removal</Link></li>
            <li><Link className="hover:text-white" href="/services#holiday-lights">Holiday Lights</Link></li>
            <li><Link className="hover:text-white" href="/services#gutter-cleaning">Gutter Cleaning</Link></li>
            <li><Link className="hover:text-white" href="/services#car-detailing">Car Detailing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Company
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/">Home</Link></li>
            <li><Link className="hover:text-white" href="/services">Services</Link></li>
            <li><Link className="hover:text-white" href="/about">About Us</Link></li>
            <li><Link className="hover:text-white" href="/quote">Get a Quote</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-x flex flex-col items-start justify-between gap-3 py-6 text-xs text-charcoal-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Gold Exterior. All rights reserved.</p>
          <p>Licensed & insured · goldexterior.com</p>
        </div>
      </div>
    </footer>
  );
}
