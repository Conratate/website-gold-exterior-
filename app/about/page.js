import Link from "next/link";
import ServiceAreaGrid from "@/components/ServiceAreaGrid";
import { BUSINESS, WIDER_AREA_NOTE } from "@/lib/location";
import { ratingStat } from "@/lib/reviews";
import { publishedReviews } from "@/lib/publishedReviews";

export const metadata = {
  title: "About Us",
  description:
    "Gold Exterior is a full-service exterior property care company serving the Bay Area from Mountain View — built on craftsmanship, communication, and trust.",
};

export const revalidate = 60;

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
  { y: "Year 1", t: "Expanded into gutter cleaning and detailing" },
  { y: "Year 2", t: "Launched holiday lighting service" },
  { y: "Today", t: "Serving homeowners and businesses across the Bay Area" },
];

export default async function AboutPage() {
  const RATING = ratingStat(await publishedReviews());

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-wave-pattern" />
        <div className="container-x relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <span className="eyebrow-gold">About Us</span>
            <h1 className="heading-xl mt-5 font-display font-extrabold">
              Local and obsessed with doing it right.
            </h1>
            <p className="mt-5 max-w-xl text-brand-100">
              Gold Exterior was founded on a simple idea: homeowners shouldn't
              need a Rolodex of contractors to keep the outside of their home
              looking great. One trusted local team. Six premium services.
              Zero compromise.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-brand-50">
              <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none text-gold-300" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {BUSINESS.base} · Serving {BUSINESS.serviceArea}
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
                { v: RATING.value, l: RATING.label },
                { v: "6", l: "Premium services" },
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
            <h2 className="heading-lg mt-4 font-display font-extrabold">
              Built on the work, not the marketing.
            </h2>
          </div>
          <div className="space-y-5 text-charcoal-700">
            <p>
              Gold Exterior started where most great service businesses do:
              with a single truck, a single crew, and a long list of frustrated
              homeowners tired of unreliable contractors — right here in{" "}
              {BUSINESS.city}.
            </p>
            <p>
              We built our reputation one driveway, one storefront, one gutter at
              a time — by showing up when we said we would, doing the work the
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
            <h2 className="heading-lg mt-4 font-display font-extrabold">
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
            <span className="eyebrow">Where we work</span>
            <h2 className="heading-lg mt-4 font-display font-extrabold">
              {BUSINESS.base} — and everywhere our routes reach.
            </h2>
            <p className="mt-4 text-charcoal-600">
              We run out of {BUSINESS.city} and cover {BUSINESS.serviceArea}{" "}
              week to week. There&apos;s no shop to visit;
              the truck comes to you.
            </p>
          </div>

          <div className="mt-12">
            <ServiceAreaGrid />
          </div>

          <p className="mt-8 max-w-3xl text-sm text-charcoal-600">{WIDER_AREA_NOTE}</p>
        </div>
      </section>

      <section className="section bg-brand-50/60">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">How we got here</span>
            <h2 className="heading-lg mt-4 font-display font-extrabold">
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
          <div className="relative overflow-hidden rounded-3xl bg-charcoal-950 px-6 py-12 text-white sm:px-16 sm:py-16">
            <div className="absolute inset-0 bg-hero-gradient" />
            <div className="absolute inset-0 bg-wave-pattern" />
            <div className="relative grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-center">
              <div>
                <h2 className="heading-lg font-display font-extrabold">
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
