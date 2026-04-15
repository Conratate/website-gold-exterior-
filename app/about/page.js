import Link from "next/link";

export const metadata = {
  title: "About Us",
  description:
    "Gold Exterior is a full-service exterior property care company built on craftsmanship, communication, and trust.",
};

const VALUES = [
  {
    t: "Craftsmanship",
    d: "We treat every job like it's our own home — because the only review that matters is the one our customers tell their neighbors.",
  },
  {
    t: "Transparency",
    d: "Real prices, real timelines, real photos. No surprises, no upsells, no high-pressure sales.",
  },
  {
    t: "Reliability",
    d: "We show up on time, in uniform, and with the equipment we promised. Every single visit.",
  },
];

const TIMELINE = [
  { y: "Day 1", t: "Locally founded with one truck and a promise" },
  { y: "Year 1", t: "Expanded into pool care and gutter cleaning" },
  { y: "Year 2", t: "Launched holiday lighting service" },
  { y: "Today", t: "500+ five-star jobs across the region" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-wave-pattern" />
        <div className="container-x relative grid items-center gap-12 py-24 sm:py-28 lg:grid-cols-2">
          <div>
            <span className="eyebrow-gold">About Us</span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
              Local, insured, and obsessed with doing it right.
            </h1>
            <p className="mt-5 max-w-xl text-brand-100">
              Gold Exterior was founded on a simple idea: homeowners shouldn't
              need a Rolodex of contractors to keep the outside of their home
              looking great. One trusted local team. Six premium services.
              Zero compromise.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/quote" className="btn-gold">
                Get an Instant Quote
              </Link>
              <Link href="/services" className="btn-ghost">
                See Our Services
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: "5★", l: "Customer rating" },
                { v: "500+", l: "Jobs completed" },
                { v: "100%", l: "Insured & bonded" },
                { v: "5", l: "Premium services" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur"
                >
                  <div className="font-display text-3xl font-extrabold text-gold-200">
                    {s.v}
                  </div>
                  <div className="mt-1 text-sm text-brand-100">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <span className="eyebrow">Our story</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
              Built on the work, not the marketing.
            </h2>
          </div>
          <div className="space-y-5 text-charcoal-700">
            <p>
              Gold Exterior started where most great service businesses do:
              with a single truck, a single crew, and a long list of frustrated
              homeowners tired of unreliable contractors.
            </p>
            <p>
              We built our reputation one driveway, one pool, one gutter at a
              time — by showing up when we said we would, doing the work the
              right way, and standing behind it.
            </p>
            <p>
              Today, we offer six tightly focused exterior services so we can
              be excellent at all of them — not average at twenty. (And no, we
              don't do interior cleaning. We'll happily refer you to a local
              pro who does.)
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-brand-50/60">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">What we stand for</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
              Three values. No exceptions.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.t} className="card">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold-400 text-charcoal-900 shadow-gold">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                  </svg>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{v.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">Where we are</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
              Growing the right way.
            </h2>
          </div>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((m) => (
              <li
                key={m.y}
                className="relative rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm"
              >
                <div className="text-xs font-semibold uppercase tracking-widest text-brand-700">
                  {m.y}
                </div>
                <div className="mt-2 font-display text-lg font-bold text-charcoal-900">
                  {m.t}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-charcoal-950 px-8 py-16 text-white sm:px-16">
            <div className="absolute inset-0 bg-hero-gradient" />
            <div className="absolute inset-0 bg-wave-pattern" />
            <div className="relative grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-center">
              <div>
                <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
                  Let's make your home look its best.
                </h2>
                <p className="mt-3 max-w-xl text-brand-100">
                  Tell us what you need and we'll handle the rest. Most quotes
                  back the same day.
                </p>
              </div>
              <div className="flex justify-start lg:justify-end">
                <Link href="/quote" className="btn-gold">
                  Get My Free Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
