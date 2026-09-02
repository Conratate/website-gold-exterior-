import Link from "next/link";
import { SERVICES, calculateTotal, formatMoney, LAUNCH_OFFER } from "@/lib/services";
import ServiceIcon from "@/components/ServiceIcon";

// The hero preview mirrors a real quote so the advertised figure can never
// drift out of sync with the pricing engine.
const PREVIEW = calculateTotal({
  "pressure-washing": { surface: "driveway", size: "small" },
  "gutter-cleaning": { stories: "two" },
});

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-wave-pattern" />
        <div className="container-x relative grid items-center gap-12 py-16 sm:py-24 lg:py-32 lg:grid-cols-2">
          <div>
            <span className="eyebrow-gold">Premium Exterior Services</span>
            <h1 className="heading-xl mt-6 font-display font-extrabold">
              The outside of your home,{" "}
              <span className="bg-gradient-to-r from-gold-200 via-gold-300 to-gold-400 bg-clip-text text-transparent">
                done right.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-50/90">
              Pressure washing, commercial cleaning, graffiti removal, holiday
              lights, gutter cleaning, weed removal and car detailing — all
              from one local team in Santa Clara County. Get a real quote in
              under two minutes.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/quote" className="btn-gold">
                Get an Instant Quote
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link href="/services" className="btn-ghost">
                Explore Services
              </Link>
            </div>

            <div className="mt-6 inline-flex max-w-md items-start gap-3 rounded-2xl border border-gold-300/40 bg-gold-400/15 px-5 py-4">
              <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 flex-none text-gold-300" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
              </svg>
              <div>
                <div className="font-display text-lg font-extrabold text-gold-100">
                  {LAUNCH_OFFER.headline}
                </div>
                <div className="mt-0.5 text-sm text-gold-100/80">
                  {LAUNCH_OFFER.detail}
                </div>
              </div>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-2 gap-6 border-t border-white/15 pt-8">
              <div>
                <dt className="text-xs uppercase tracking-widest text-brand-200">Avg. response</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-white">&lt; 2hr</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-brand-200">Call us</dt>
                <dd className="mt-1">
                  <a
                    href="tel:+16509433124"
                    className="whitespace-nowrap font-display text-xl font-bold text-white hover:text-gold-300 sm:text-2xl"
                  >
                    (650) 943-3124
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            {/* Height is content-driven — forcing a square crops the card on a
                phone, where the same content needs more room than its width. */}
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-gold-400/30 via-brand-500/20 to-transparent blur-2xl" />
              <div className="relative w-full rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-5 backdrop-blur-md shadow-glow sm:p-8">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-100">
                    Estimate Calculator
                  </span>
                  <span className="text-xs text-brand-200">Live preview</span>
                </div>
                <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
                  <Link
                    href="/quote?service=pressure-washing"
                    className="group block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-gold-300/50 hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs text-brand-200">Service</div>
                      <span className="text-xs font-semibold text-gold-200 opacity-0 transition group-hover:opacity-100">
                        Quote this →
                      </span>
                    </div>
                    <div className="mt-1 font-semibold">Pressure Washing · Driveway (2-Car)</div>
                  </Link>
                  <Link
                    href="/quote?service=gutter-cleaning"
                    className="group block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-gold-300/50 hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs text-brand-200">Add-on</div>
                      <span className="text-xs font-semibold text-gold-200 opacity-0 transition group-hover:opacity-100">
                        Quote this →
                      </span>
                    </div>
                    <div className="mt-1 font-semibold">Gutter Cleaning · 2-Story</div>
                  </Link>
                  <div className="rounded-xl border border-gold-300/40 bg-gold-300/10 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs uppercase tracking-widest text-gold-200">
                        Estimated price
                      </div>
                      {PREVIEW.discountApplied && (
                        <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-charcoal-900">
                          −{Math.round(PREVIEW.discountRate * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="mt-1 font-display text-2xl font-extrabold text-white sm:text-3xl">
                      {formatMoney(PREVIEW.low)} – {formatMoney(PREVIEW.high)}
                    </div>
                    <div className="mt-1 text-xs text-brand-100">
                      {PREVIEW.discountApplied
                        ? `${PREVIEW.discountLabel} applied. Final quote confirmed after photo review.`
                        : "Final quote confirmed after photo review."}
                    </div>
                  </div>
                  <Link href="/quote" className="btn-gold w-full">
                    Build Your Estimate
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="section">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="eyebrow">What we do</span>
              <h2 className="heading-lg mt-4 font-display font-extrabold">
                Seven services. One team you can trust.
              </h2>
              <p className="mt-4 text-charcoal-600">
                Whether you need a one-time deep clean or a recurring service,
                Gold Exterior delivers a consistently premium experience —
                without the hassle of juggling multiple contractors.
              </p>
            </div>
            <Link href="/services" className="btn-outline">
              See all services
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <Link key={service.id} href={`/services#${service.id}`} className="card group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                  <ServiceIcon name={service.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-charcoal-900">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-600">
                  {service.tagline}
                </p>
                {service.sub && (
                  <ul className="mt-4 space-y-1 text-xs font-medium text-charcoal-500">
                    {service.sub.map((s) => (
                      <li key={s} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-brand-500" /> {s}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                  Learn more
                  <svg viewBox="0 0 24 24" className="h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section bg-brand-50/60">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">Why Gold Exterior</span>
            <h2 className="heading-lg mt-4 font-display font-extrabold">
              Premium isn't a price tag — it's a process.
            </h2>
            <p className="mt-4 text-charcoal-600">
              From the moment you submit your quote to the final walkthrough,
              every step is built around clarity, communication and
              craftsmanship.
            </p>

            <ul className="mt-8 space-y-5">
              {[
                {
                  t: "Real, instant pricing",
                  d: "Skip the back-and-forth. Get a transparent estimate the moment you finish our calculator.",
                },
                {
                  t: "One trusted team for everything",
                  d: "Bundle services and let one trusted crew handle it all — no scheduling chaos.",
                },
                {
                  t: "Guaranteed satisfaction",
                  d: "If it isn't right, we'll come back and make it right. Period.",
                },
              ].map((f) => (
                <li key={f.t} className="flex gap-4">
                  <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-gold-400 text-charcoal-900 shadow-gold">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-charcoal-900">{f.t}</h3>
                    <p className="mt-1 text-sm text-charcoal-600">{f.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: "Santa Clara", l: "County we serve" },
                { v: "48hr", l: "Typical lead time" },
                { v: "1", l: "Trusted local team" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
                  <div className="font-display text-3xl font-extrabold text-brand-700">{s.v}</div>
                  <div className="mt-1 text-sm text-charcoal-600">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-charcoal-950 px-6 py-12 text-white sm:px-16 sm:py-16">
            <div className="absolute inset-0 bg-hero-gradient" />
            <div className="absolute inset-0 bg-wave-pattern" />
            <div className="relative grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-center">
              <div>
                <h2 className="heading-lg font-display font-extrabold">
                  Ready for your free, no-obligation quote?
                </h2>
                <p className="mt-3 max-w-xl text-brand-100">
                  Tell us what you need, snap a photo, and we'll have your
                  pricing in your inbox before the day is out.
                </p>
              </div>
              <div className="flex justify-start lg:justify-end">
                <Link href="/quote" className="btn-gold">
                  Start My Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
