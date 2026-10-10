import Link from "next/link";
import { GIVEAWAY, CHARITY } from "@/lib/promos";
import { formatMoney } from "@/lib/services";

export const metadata = {
  title: "Free Job Giveaway",
  description: `Win a free Gold Exterior job worth up to ${formatMoney(
    GIVEAWAY.prizeValue
  )}. Get a free quote to enter — no purchase necessary.`,
};

const STEPS = [
  {
    t: "Get a free quote",
    d: "Fill out the quote form. Takes about two minutes.",
  },
  {
    t: "You're entered",
    d: "Every quote request is an entry. You don't have to book anything.",
  },
  {
    t: "Winner drawn",
    d: `We pick one winner at random on ${GIVEAWAY.drawingLabel}.`,
  },
];

const RULES = [
  "No purchase necessary. Requesting a free quote is the only way to enter, and you don't have to book or pay for a job to win.",
  "One entry per household. Extra quote requests from the same person, email, phone number or address don't add entries.",
  `Entries close ${GIVEAWAY.endsLabel} at 11:59 PM Pacific. One winner is picked at random from eligible entries on ${GIVEAWAY.drawingLabel}.`,
  "Open to residents of Santa Clara County, CA who are 18 or older.",
  `Prize: one Gold Exterior job of the winner's choice, valued up to ${formatMoney(
    GIVEAWAY.prizeValue
  )}. If the job costs more, the prize is taken off the total. No cash value, not transferable.`,
  `The prize must be scheduled and completed by ${GIVEAWAY.redeemByLabel}.`,
  "We'll contact the winner by phone and email. If we can't reach them within 7 days, we draw again.",
  "Odds depend on how many eligible entries we receive.",
];

export default function GiveawayPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-wave-pattern" />
        <div className="container-x relative py-14 sm:py-20">
          <span className="eyebrow-gold">Giveaway</span>
          <h1 className="heading-xl mt-5 max-w-3xl font-display font-extrabold">
            {GIVEAWAY.headline}.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-brand-100">
            Get a free quote before {GIVEAWAY.endsLabel} and you're in. No
            purchase needed.
          </p>
          <div className="mt-8">
            <Link href="/quote" className="btn-gold">
              Get My Free Quote
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <span className="eyebrow">How to enter</span>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.t} className="rounded-2xl border border-white/10 bg-charcoal-900 p-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-400 font-display font-extrabold text-charcoal-900">
                  {i + 1}
                </div>
                <h2 className="mt-4 font-display text-lg font-bold text-white">{s.t}</h2>
                <p className="mt-1 text-sm text-charcoal-300">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-white/5">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <span className="eyebrow">We give back</span>
            <h2 className="heading-lg mt-4 font-display font-extrabold">
              {CHARITY.percent}% of every job goes to charity.
            </h2>
            <p className="mt-4 text-charcoal-300">
              It comes out of what we make — your price doesn't go up.
              {CHARITY.name && ` It goes to ${CHARITY.name}, our local food bank.`}
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white">Official rules</h2>
            <ul className="mt-4 space-y-3 text-sm text-charcoal-300">
              {RULES.map((r) => (
                <li key={r} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gold-400" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-charcoal-400">
              Sponsored by Gold Exterior. Void where prohibited.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
