import Link from "next/link";
import { SERVICES } from "@/lib/services";
import ServiceIcon from "@/components/ServiceIcon";

export const metadata = {
  title: "Services",
  description:
    "Pressure washing, commercial cleaning, graffiti removal, holiday lights, gutter cleaning, and car detailing by Gold Exterior.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-wave-pattern" />
        <div className="container-x relative py-14 sm:py-20 lg:py-24">
          <span className="eyebrow-gold">Our Services</span>
          <h1 className="heading-xl mt-5 max-w-3xl font-display font-extrabold">
            Seven professional services. One easy phone call.
          </h1>
          <p className="mt-5 max-w-2xl text-brand-100">
            Click any service to jump straight to the details — or skip ahead
            and build your own custom quote.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {SERVICES.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-gold-300 hover:text-gold-200"
              >
                <ServiceIcon name={s.icon} className="h-4 w-4" />
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container-x space-y-24">
          {SERVICES.map((service, i) => (
            <article
              key={service.id}
              id={service.id}
              className="scroll-mt-28 grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <span className="eyebrow">Service</span>
                <h2 className="heading-lg mt-4 font-display font-extrabold">
                  {service.name}
                </h2>
                <p className="mt-3 text-lg text-brand-700">{service.tagline}</p>
                <p className="mt-5 text-charcoal-600">{service.blurb}</p>

                {service.sub && (
                  <div className="mt-8">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-charcoal-500">
                      Sub-services
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {service.sub.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <ul className="mt-8 space-y-3">
                  {service.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-charcoal-700">
                      <span className="mt-1 grid h-5 w-5 flex-none place-items-center rounded-full bg-gold-300 text-charcoal-900">
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                {service.sizingGuide && (
                  <div className="mt-8">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-charcoal-500">
                      Sizing guide
                    </h3>
                    <div className="scroll-x mt-3 rounded-2xl border border-charcoal-100">
                      <table className="w-full min-w-[420px] border-collapse bg-white text-left text-sm">
                        <thead>
                          <tr className="border-b border-charcoal-100 bg-charcoal-50/70">
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                              Tier
                            </th>
                            {service.sizingGuide.columns.map((c) => (
                              <th
                                key={c}
                                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-500"
                              >
                                {c}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {service.sizingGuide.rows.map((row) => (
                            <tr key={row.tier} className="border-b border-charcoal-100 last:border-0">
                              <td className="px-4 py-3 font-semibold text-charcoal-900">
                                {row.tier}
                              </td>
                              {row.cells.map((cell, ci) => (
                                <td key={ci} className="px-4 py-3 text-charcoal-600">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-2 text-xs text-charcoal-500">
                      Not sure which tier you're in? The quote builder has a
                      built-in size helper — enter rough measurements and we'll
                      place you automatically.
                    </p>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={`/quote?service=${service.id}`} className="btn-primary">
                    Quote this service
                  </Link>
                  <Link href="/services" className="btn-outline">
                    All services
                  </Link>
                </div>
              </div>

              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-200/60 via-brand-100 to-gold-100 blur-2xl" />
                  <div className="relative overflow-hidden rounded-3xl border border-brand-100 bg-white p-8 shadow-glow">
                    <div className="flex items-center gap-4">
                      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white shadow-glow">
                        <ServiceIcon name={service.icon} className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                          Gold Exterior
                        </div>
                        <div className="font-display text-xl font-bold text-charcoal-900">
                          {service.name}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3">
                      {service.questions.map((q) => (
                        <div
                          key={q.id}
                          className="rounded-xl border border-charcoal-100 bg-charcoal-50 p-4"
                        >
                          <div className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                            We'll ask
                          </div>
                          <div className="mt-1 text-sm font-medium text-charcoal-800">
                            {q.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-xl bg-gradient-to-br from-brand-50 to-gold-50 p-5">
                      <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                        Instant estimate
                      </div>
                      <div className="mt-1 text-sm text-charcoal-700">
                        Build your custom quote in under two minutes — no phone
                        call required.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section pt-0">
        <div className="container-x">
          <div className="rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-10 sm:p-14">
            <div className="grid items-center gap-6 lg:grid-cols-[2fr_1fr]">
              <div>
                <h2 className="heading-lg font-display font-extrabold text-charcoal-900">
                  Don't see what you need?
                </h2>
                <p className="mt-3 max-w-2xl text-charcoal-600">
                  Reach out anyway. If it's exterior, we probably do it — or know
                  the right local team that does. (We do not offer interior
                  cleaning.)
                </p>
              </div>
              <div className="flex justify-start lg:justify-end">
                <Link href="/quote" className="btn-primary">
                  Start a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
