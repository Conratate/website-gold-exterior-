import QuoteForm from "@/components/QuoteForm";

export const metadata = {
  title: "Get a Quote",
  description:
    "Build a custom estimate for pressure washing, pool cleaning, junk removal, holiday lights, or gutter cleaning in under two minutes.",
};

export default function QuotePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-wave-pattern" />
        <div className="container-x relative py-20 sm:py-24">
          <span className="eyebrow-gold">Estimate Calculator</span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Build your custom quote in under two minutes.
          </h1>
          <p className="mt-5 max-w-2xl text-brand-100">
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
