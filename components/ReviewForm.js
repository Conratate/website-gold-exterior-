"use client";

import { useMemo, useState } from "react";
import { SERVICES } from "@/lib/services";
import {
  MAX_STARS,
  RATING_CATEGORIES,
  STAR_LABELS,
  averageRating,
} from "@/lib/reviews";

function Star({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-7 w-7 transition ${
        filled ? "text-gold-400" : "text-charcoal-200"
      }`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.45l-5.81 3.05 1.11-6.47-4.7-4.58 6.5-.95z" />
    </svg>
  );
}

/**
 * Star input built from real radios so it works with a keyboard and a screen
 * reader; the visible stars are the radio labels.
 */
function StarRating({ name, label, hint, value, onChange, required }) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="label mb-1">
        {label}
        {required ? <span className="text-brand-600"> *</span> : null}
      </legend>
      {hint ? (
        <p className="mb-2 text-sm text-charcoal-500">{hint}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center">
          {Array.from({ length: MAX_STARS }, (_, i) => i + 1).map((n) => (
            <label
              key={n}
              className="cursor-pointer p-1.5 focus-within:rounded-lg focus-within:ring-4 focus-within:ring-brand-100"
              title={`${n} star${n > 1 ? "s" : ""} — ${STAR_LABELS[n]}`}
            >
              <input
                type="radio"
                name={name}
                value={n}
                checked={value === n}
                onChange={() => onChange(n)}
                className="sr-only"
              />
              <span className="sr-only">
                {n} star{n > 1 ? "s" : ""} — {STAR_LABELS[n]}
              </span>
              <Star filled={value >= n} />
            </label>
          ))}
        </div>
        <span className="text-sm font-semibold text-charcoal-600">
          {value ? STAR_LABELS[value] : "Not rated"}
        </span>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(0)}
            className="text-xs font-semibold text-charcoal-400 underline underline-offset-2 hover:text-charcoal-700"
          >
            Clear
          </button>
        ) : null}
      </div>
    </fieldset>
  );
}

const EMPTY_RATINGS = Object.fromEntries(
  RATING_CATEGORIES.map((c) => [c.id, 0])
);

export default function ReviewForm() {
  const [contact, setContact] = useState({ name: "", email: "", city: "" });
  const [serviceId, setServiceId] = useState("");
  const [overall, setOverall] = useState(0);
  const [ratings, setRatings] = useState(EMPTY_RATINGS);
  const [body, setBody] = useState("");
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const detailAverage = useMemo(() => averageRating(ratings), [ratings]);

  // Any edit clears the error banner — leaving a stale "tell us your name"
  // above a filled-in name field reads as the form being broken.
  function setField(key, value) {
    setError("");
    setContact((c) => ({ ...c, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!contact.name.trim()) return setError("Please tell us your name.");
    if (!serviceId) return setError("Please pick the service we did for you.");
    if (!overall) return setError("Please give an overall star rating.");
    if (body.trim().length < 10) {
      return setError("Please write a sentence or two about how it went.");
    }

    setSubmitting(true);
    try {
      const service = SERVICES.find((s) => s.id === serviceId);
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: {
            name: contact.name.trim(),
            email: contact.email.trim(),
            city: contact.city.trim(),
          },
          service: {
            id: serviceId,
            name: service ? service.name : "Other / not listed",
          },
          overall,
          // Drop the categories they skipped rather than sending zeros.
          ratings: Object.fromEntries(
            Object.entries(ratings).filter(([, v]) => v > 0)
          ),
          body: body.trim(),
          consent,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(
          data.error || `We couldn't send your review. (error ${res.status})`
        );
      }
      setDone(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-charcoal-100 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold-400 text-charcoal-900 shadow-gold">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="heading-md mt-6 font-display font-extrabold">
          Thank you — that means a lot.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-charcoal-600">
          Your review went straight to the owner. If anything fell short of a
          five, we'll reach out personally to make it right.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-charcoal-100 bg-white p-6 shadow-sm sm:p-10"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="rv-name">
            Your name <span className="text-brand-600">*</span>
          </label>
          <input
            id="rv-name"
            className="input"
            value={contact.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Jordan Alvarez"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="label" htmlFor="rv-email">
            Email <span className="font-normal text-charcoal-400">(optional)</span>
          </label>
          <input
            id="rv-email"
            type="email"
            className="input"
            value={contact.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="label" htmlFor="rv-city">
            Town or neighborhood{" "}
            <span className="font-normal text-charcoal-400">(optional)</span>
          </label>
          <input
            id="rv-city"
            className="input"
            value={contact.city}
            onChange={(e) => setField("city", e.target.value)}
            placeholder="Riverbend"
          />
        </div>
        <div>
          <label className="label" htmlFor="rv-service">
            Which service? <span className="text-brand-600">*</span>
          </label>
          <select
            id="rv-service"
            className="input"
            value={serviceId}
            onChange={(e) => {
              setError("");
              setServiceId(e.target.value);
            }}
          >
            <option value="">Choose a service…</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
            <option value="other">Other / not listed</option>
          </select>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-gold-200 bg-gold-50/60 p-5">
        <StarRating
          name="overall"
          label="Overall, how did we do?"
          value={overall}
          onChange={(n) => {
            setError("");
            setOverall(n);
          }}
          required
        />
      </div>

      <div className="mt-8">
        <h3 className="font-display text-lg font-bold text-charcoal-900">
          Rate the parts that matter
        </h3>
        <p className="mt-1 text-sm text-charcoal-500">
          Skip anything that doesn't apply — only what you rate gets counted.
        </p>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          {RATING_CATEGORIES.map((c) => (
            <StarRating
              key={c.id}
              name={c.id}
              label={c.label}
              hint={c.hint}
              value={ratings[c.id]}
              onChange={(n) => setRatings((r) => ({ ...r, [c.id]: n }))}
            />
          ))}
        </div>
        {detailAverage !== null ? (
          <p className="mt-5 text-sm font-semibold text-charcoal-600">
            Your detail average so far:{" "}
            <span className="text-brand-700">{detailAverage} / {MAX_STARS}</span>
          </p>
        ) : null}
      </div>

      <div className="mt-8">
        <label className="label" htmlFor="rv-body">
          Your review <span className="text-brand-600">*</span>
        </label>
        <textarea
          id="rv-body"
          className="input min-h-[140px] resize-y"
          value={body}
          onChange={(e) => {
            setError("");
            setBody(e.target.value);
          }}
          maxLength={2000}
          placeholder="What did we clean, how did the crew treat you, and how did it turn out?"
        />
        <p className="mt-1 text-xs text-charcoal-400">
          {body.length}/2000
        </p>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-charcoal-700">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-5 w-5 rounded border-charcoal-300 text-brand-600 focus:ring-brand-300"
        />
        <span>
          Gold Exterior may publish this review with my first name and town. My
          email address is never shown publicly.
        </span>
      </label>

      {error ? (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          {error}
        </p>
      ) : null}

      <button type="submit" className="btn-primary mt-8 w-full sm:w-auto" disabled={submitting}>
        {submitting ? "Sending…" : "Send My Review"}
      </button>
    </form>
  );
}
