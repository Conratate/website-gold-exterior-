import Link from "next/link";
import ReviewForm from "@/components/ReviewForm";
import Stars from "@/components/Stars";
import Transformation from "@/components/Transformation";
import { BUSINESS } from "@/lib/location";
import {
  MAX_RATING,
  REVIEWS,
  formatReviewDate,
  reviewStats,
  transformations,
} from "@/lib/reviews";
import { listPublished } from "@/lib/reviewStore";

export const metadata = {
  title: "Reviews",
  description:
    "Verified reviews from Gold Exterior customers across the Bay Area. Every review comes from someone we've actually worked for.",
};

// Reviews are published from the staff page, so this can't be baked in at
// build time any more. Rebuilding once a minute is invisible to a reader and
// means a review you publish is live before you've put your phone away.
export const revalidate = 60;

export default async function ReviewsPage() {
  // Anything committed to lib/reviews.js still shows, so the file remains a
  // perfectly good way to seed the page. If the store can't be reached we fall
  // back to that rather than telling a visitor the page is broken.
  const stored = await listPublished();
  const reviews = [...(stored || []), ...REVIEWS];

  const stats = reviewStats(reviews);
  const TRANSFORMATIONS = transformations(reviews);

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-wave-pattern" />
        <div className="container-x relative py-14 sm:py-20">
          <span className="eyebrow-gold">Reviews</span>
          <h1 className="heading-xl mt-5 max-w-3xl font-display font-extrabold">
            Reviews from people we&apos;ve actually worked for.
          </h1>
          <p className="mt-5 max-w-2xl text-brand-100">
            Every review on this page comes from a {BUSINESS.serviceAreaShort}{" "}
            customer, writing with a one-time code we emailed them after their
            job. No purchased ratings, no reviews from people we&apos;ve never
            met.
          </p>

          {stats.count > 0 ? (
            <div className="mt-8 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 backdrop-blur">
              <Stars
                rating={stats.average}
                size="h-6 w-6"
                label={`${stats.average} out of ${MAX_RATING} stars`}
              />
              <span className="font-display text-2xl font-extrabold">
                {stats.average}
                <span className="text-base font-semibold text-brand-200">
                  {" "}
                  / {MAX_RATING}
                </span>
              </span>
              <span className="text-sm text-brand-100">
                {stats.count} verified {stats.count === 1 ? "review" : "reviews"}
              </span>
            </div>
          ) : (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#leave-a-review" className="btn-gold">
                Leave a Review
              </Link>
              <Link href="/quote" className="btn-ghost">
                Get an Instant Quote
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section bg-brand-50/60">
        <div className="container-x">
          {stats.count > 0 ? (
            <>
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <span className="eyebrow">What customers say</span>
                  <h2 className="heading-lg mt-4 font-display font-extrabold">
                    {stats.count === 1
                      ? "Our first review."
                      : `All ${stats.count} of them.`}
                  </h2>
                </div>
                <Link href="#leave-a-review" className="btn-outline">
                  Leave a review
                </Link>
              </div>

              <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => (
                  <li key={review.id} className="card flex flex-col">
                    {review.photos?.before && review.photos?.after && (
                      <Transformation photos={review.photos} className="mb-5" />
                    )}
                    <Stars rating={review.rating} />
                    {review.headline && (
                      <h3 className="mt-4 font-display text-lg font-bold text-charcoal-900">
                        {review.headline}
                      </h3>
                    )}
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-700">
                      {review.body}
                    </p>
                    <div className="mt-5 border-t border-charcoal-100 pt-4">
                      <div className="font-semibold text-charcoal-900">
                        {review.name}
                      </div>
                      <div className="mt-0.5 text-xs text-charcoal-500">
                        {[review.city, review.service, formatReviewDate(review.date)]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      {TRANSFORMATIONS.length > 0 && (
        <section className="section bg-brand-50/60 pt-0">
          <div className="container-x">
            <div className="max-w-2xl">
              <span className="eyebrow">Transformations</span>
              <h2 className="heading-lg mt-4 font-display font-extrabold">
                The same driveway, an afternoon apart.
              </h2>
              <p className="mt-4 text-charcoal-600">
                Every pair below belongs to a review on this page — real jobs,
                photographed as we found them and as we left them.
              </p>
            </div>

            <ul className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2">
              {TRANSFORMATIONS.map((review) => (
                <li key={`t-${review.id}`}>
                  <Transformation photos={review.photos} />
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-charcoal-900">
                        {review.name}
                      </div>
                      <div className="mt-0.5 text-xs text-charcoal-500">
                        {[review.city, review.service].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                    <Stars rating={review.rating} size="h-4 w-4" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section" id="leave-a-review">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">For customers</span>
            <h2 className="heading-lg mt-4 font-display font-extrabold">
              Leave a review
            </h2>
            <p className="mt-4 text-charcoal-600">
              You&apos;ll need the code we emailed you after your job. Following
              the link in that email fills it in for you — the gate is there so
              this page stays honest, not to make you jump through hoops.
            </p>
          </div>
          <div className="mt-10">
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  );
}

// A reviews page with nothing on it is a chance to explain the standard rather
// than an embarrassment to paper over.
function EmptyState() {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-charcoal-100 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto flex justify-center text-charcoal-200">
        <Stars rating={0} size="h-8 w-8" label="No reviews published yet" />
      </div>
      <h2 className="heading-md mt-6 font-display font-extrabold text-charcoal-900">
        No published reviews yet.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-charcoal-600">
        We&apos;d rather show you an empty page than fill it with reviews we
        didn&apos;t earn. When our customers write them, they&apos;ll show up
        right here — name, city, job and all.
      </p>

      <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
        {[
          {
            t: "Customers only",
            d: "Every review needs a one-time code, emailed to one customer after one job.",
          },
          {
            t: "Read by a person",
            d: "We read every review and match it to the job before it goes up.",
          },
          {
            t: "Posted as written",
            d: "Good or bad, we don't edit the words or bury the low ones.",
          },
        ].map((item) => (
          <div key={item.t} className="rounded-2xl bg-brand-50 p-5">
            <div className="font-display font-bold text-charcoal-900">{item.t}</div>
            <p className="mt-1 text-sm text-charcoal-600">{item.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/quote" className="btn-primary">
          Get an Instant Quote
        </Link>
        <Link href="#leave-a-review" className="btn-outline">
          I&apos;m a customer — leave a review
        </Link>
      </div>
    </div>
  );
}
