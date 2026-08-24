import Link from "next/link";
import ReviewForm from "@/components/ReviewForm";
import { RATING_CATEGORIES } from "@/lib/reviews";

export const metadata = {
  title: "Leave a Review",
  description:
    "Tell us how the crew did — professionalism, quality, timeliness and more. Your review goes straight to the owner.",
};

export default function ReviewPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-wave-pattern" />
        <div className="container-x relative py-14 sm:py-20">
          <span className="eyebrow-gold">Leave a Review</span>
          <h1 className="heading-xl mt-5 max-w-3xl font-display font-extrabold">
            How did we do?
          </h1>
          <p className="mt-5 max-w-2xl text-brand-100">
            Two minutes, {RATING_CATEGORIES.length} quick star ratings, and a few
            words. It goes straight to the owner's inbox — not a review farm, not
            a call center. If we missed the mark anywhere, this is how we find
            out and fix it.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-x max-w-3xl">
          <ReviewForm />
          <p className="mt-8 text-center text-sm text-charcoal-500">
            Need work done instead?{" "}
            <Link href="/quote" className="font-semibold text-brand-700 underline underline-offset-2">
              Get an instant estimate
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
