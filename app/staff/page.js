import CodeIssuer from "@/components/CodeIssuer";

export const metadata = {
  title: "Issue a review code",
  // Owner-only. It's password-gated, but there's no reason for it to turn up
  // in a search result either.
  robots: { index: false, follow: false, nocache: true },
};

export default function NewCodePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="container-x relative py-12 sm:py-16">
          <span className="eyebrow-gold">Staff</span>
          <h1 className="heading-lg mt-4 max-w-2xl font-display font-extrabold">
            Reviews and codes.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-brand-100">
            Publish the reviews waiting on you, and send a finished customer
            their code. Nothing here is reachable without your password.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <CodeIssuer />
        </div>
      </section>
    </>
  );
}
