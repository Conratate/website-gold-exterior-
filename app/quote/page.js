import QuoteForm from "@/components/QuoteForm";

export const metadata = {
  title: "Get a Quote",
  description:
    "Build a custom estimate for pressure washing, commercial cleaning, graffiti removal, holiday lights, gutter cleaning, or car & boat detailing in under two minutes.",
};

export default function QuotePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-wave-pattern" />
        <div className="container-x relative py-12 sm:py-16 lg:py-24">
          <span className="eyebrow-gold">Estimate Calculator</span>
          <h1 className="mt-4 max-w-3xl font-display text-[1.875rem] font-extrabold leading-[1.15] sm:mt-5 sm:text-4xl lg:text-5xl">
            Build your custom quote in under two minutes.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-brand-100 sm:mt-5 sm:text-base">
            Pick your services, answer a few quick questions, and we'll show
            you a transparent estimate instantly. Submit it and we'll email
            you to confirm the final number.
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
