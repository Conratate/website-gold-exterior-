import QuoteForm from "@/components/QuoteForm";
import { BUSINESS } from "@/lib/location";

export const metadata = {
  title: "Get a Quote",
  description:
    "Build a custom estimate for pressure washing, commercial cleaning, graffiti removal, holiday lights, gutter cleaning, or car & boat detailing anywhere in the Bay Area — in under two minutes.",
};

export default function QuotePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-wave-pattern" />
        <div className="container-x relative py-14 sm:py-20">
          <span className="eyebrow-gold">Estimate Calculator</span>
          <h1 className="heading-xl mt-5 max-w-3xl font-display font-extrabold">
            Build your custom quote in under two minutes.
          </h1>
          <p className="mt-5 max-w-2xl text-brand-100">
            Pick your services, answer a few quick questions, and we'll show
            you a transparent estimate instantly. Submit it and we'll email
            you to confirm the final number.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-brand-50">
            <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none text-gold-300" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {BUSINESS.base} · Serving {BUSINESS.serviceArea}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
