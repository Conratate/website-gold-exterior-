import Link from "next/link";
import { CHARITY, mealsForJob } from "@/lib/promos";
import DonationTracker from "@/components/DonationTracker";

export const metadata = {
  title: "Our Charity",
  description: `${CHARITY.percent}% of every Gold Exterior job goes to ${CHARITY.name}, the food bank for Santa Clara and San Mateo counties.`,
};

const LINES = [
  "Your clean driveway puts dinner on a neighbor's table.",
  `A $300 job here is about ${mealsForJob(300)} meals there.`,
  "Same price to you. More food for families down the street.",
];

const FACTS = [
  {
    t: `${CHARITY.percent}% of every job`,
    d: "Of the full price you pay, not just profit. It comes out of our cut — your price doesn't go up.",
  },
  {
    t: "Stays local",
    d: `${CHARITY.name} feeds families in Santa Clara and San Mateo counties — the same neighborhoods we work in.`,
  },
  {
    t: "Goes a long way",
    d: `Every $${CHARITY.jobDollarsPerMeal} of your job counts as one meal. That's on the low side: ${CHARITY.name} says every $1 donated provides about ${CHARITY.mealsPerDollar} meals.`,
  },
];

export default function CharityPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-wave-pattern" />
        <div className="absolute inset-x-0 top-0 h-32 bg-header-fade" />
        <div className="container-x relative py-14 sm:py-20">
          <span className="eyebrow-gold">We give back</span>
          <h1 className="heading-xl mt-5 max-w-3xl font-display font-extrabold">
            {CHARITY.percent}% of every job goes to {CHARITY.name}.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-brand-100">
            Every driveway, every detail, every string of lights. Part of it
            puts food on a local family's table.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={CHARITY.url} target="_blank" rel="noopener noreferrer" className="btn-gold">
              Visit {CHARITY.name}
            </a>
            <Link href="/quote" className="btn-ghost">
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <DonationTracker />
          <div className="space-y-6">
            {LINES.map((line) => (
              <blockquote
                key={line}
                className="border-l-4 border-gold-400 pl-5 font-display text-xl font-bold leading-snug text-white sm:text-2xl"
              >
                &ldquo;{line}&rdquo;
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white/5">
        <div className="container-x grid gap-6 md:grid-cols-3">
          {FACTS.map((f) => (
            <div key={f.t} className="rounded-2xl border border-white/10 bg-charcoal-900 p-6">
              <h2 className="font-display text-xl font-bold text-gold-400">{f.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-300">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
