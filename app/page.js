import Link from "next/link";
import { SERVICES } from "@/lib/services";
import ServiceIcon from "@/components/ServiceIcon";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-wave-pattern" />
        <div className="container-x relative grid items-center gap-12 py-24 sm:py-32 lg:grid-cols-2">
          <div>
            <span className="eyebrow-gold">Premium Exterior Services</span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              The outside of your home,{" "}
              <span className="bg-gradient-to-r from-gold-200 via-gold-300 to-gold-400 bg-clip-text text-transparent">
                done right.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-50/90">
              Pressure washing, pool cleaning, junk removal, holiday lights and
              gutter cleaning — all from one trusted, insured local team. Get a
              real quote in under two minutes.
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

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-8">
              <div>
                <dt className="text-xs uppercase tracking-widest text-brand-200">Insured</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-white">100%</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-brand-200">Avg. response</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-white">&lt; 2hr</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-brand-200">5-star jobs</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-white">500+</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-lg">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-gold-400/30 via-brand-500/20 to-transparent blur-2xl" />
              <div className="relative h-full w-full rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-md shadow-glow">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-100">
                    Estimate Calculator
                  </span>
                  <span className="text-xs text-brand-200">Live preview</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-brand-200">Service</div>
                    <div className="mt-1 font-semibold">Pool Cleaning · Large In-ground</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-brand-200">Add-on</div>
                    <div className="mt-1 font-semibold">Junk Removal · Single Item</div>
                  </div>
                  <div className="rounded-xl border border-gold-300/40 bg-gold-300/10 p-5">
                    <div className="text-xs uppercase tracking-widest text-gold-200">
                      Estimated price
                    </div>
                    <div className="mt-1 font-display text-3xl font-extrabold text-white">
                      $350 – $575
                    </div>
                    <div className="mt-1 text-xs text-brand-100">
                      Final quote confirmed after photo review.
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
              <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
                Five services. One team you can trust.
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
            <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
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
                  d: "Bundle services and let one insured crew handle it all — no scheduling chaos.",
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
                { v: "100%", l: "Insured & bonded" },
                { v: "5★", l: "Average rating" },
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
          <div className="relative overflow-hidden rounded-3xl bg-charcoal-950 px-8 py-16 text-white sm:px-16">
            <div className="absolute inset-0 bg-hero-gradient" />
            <div className="absolute inset-0 bg-wave-pattern" />
            <div className="relative grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-center">
              <div>
                <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
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
