import ReviewForm from "@/components/ReviewForm";

export const metadata = {
  title: "Leave a Review",
  description:
    "Tell us how your Gold Exterior job went — rate the quality, professionalism, timeliness, communication and value.",
};

export default function ReviewPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-wave-pattern" />
        <div className="container-x relative py-14 sm:py-20">
          <span className="eyebrow-gold">Your Feedback</span>
          <h1 className="heading-xl mt-5 max-w-3xl font-display font-extrabold">
            How did we do?
          </h1>
          <p className="mt-5 max-w-2xl text-brand-100">
            It takes about a minute. Honest scores are more useful to us than
            kind ones — if something fell short, we&apos;d rather hear it from
            you than not hear it at all.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <ReviewForm />
        </div>
      </section>
    </>
  );
}
