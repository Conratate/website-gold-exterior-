import Link from "next/link";
import { CHARITY } from "@/lib/promos";

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
    d: "Real prices up front. No surprises, no upsells, no high-pressure sales.",
  },
  {
    t: "Reliability",
    d: "We show up when we said we would, with everything the job needs. Every single visit.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-wave-pattern" />
        <div className="absolute inset-x-0 top-0 h-32 bg-header-fade" />
        <div className="container-x relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <span className="eyebrow-gold">About Us</span>
            <h1 className="heading-xl mt-5 font-display font-extrabold">
              Local and obsessed with doing it right.
            </h1>
            <p className="mt-5 max-w-xl text-brand-100">
              Gold Exterior was founded on a simple idea: homeowners shouldn't
              need a Rolodex of contractors to keep the outside of their home
              looking great. One local crew, start to finish.
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
                { v: "Santa Clara", l: "County we serve" },
                { v: "7", l: "Premium services" },
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
          <div className="space-y-5 text-charcoal-200">
            <p>
              Gold Exterior is two people, one van and a lot of elbow grease.
              No call center, no subcontractors — the people who quote your job
              are the people who show up and do it.
            </p>
            <p>
              We&apos;re new, and we know that means we have to earn every
              customer. So we price up front, show up when we say we will, and
              come back if something isn&apos;t right.
            </p>
            <p>
              And {CHARITY.percent}% of every job goes to {CHARITY.name}, so
              your clean driveway feeds a family down the street too.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white/5">
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
                <p className="mt-2 text-sm leading-relaxed text-charcoal-300">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
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
                  Tell us what you need and see your price before you book.
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
