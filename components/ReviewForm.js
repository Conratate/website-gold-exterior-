"use client";

import { useEffect, useMemo, useState } from "react";
import { SERVICES } from "@/lib/services";
import { REVIEW_DIMENSIONS, averageOf, starLabel } from "@/lib/reviews";

const initial = {
  accessCode: "",
  name: "",
  email: "",
  serviceId: "",
  headline: "",
  body: "",
  consent: false,
};

export default function ReviewForm() {
  const [form, setForm] = useState(initial);
  const [ratings, setRatings] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [state, setState] = useState({ status: "idle", message: "" });
  // A code carried in the link is confirmed rather than shown as an empty
  // box — most customers should never have to type one.
  const [codeFromLink, setCodeFromLink] = useState(false);
  const [editingCode, setEditingCode] = useState(false);

  // Let a follow-up email deep-link straight to the right service.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const presel = params.get("service");
    const code = params.get("code");
    setForm((f) => ({
      ...f,
      ...(presel && SERVICES.some((s) => s.id === presel) ? { serviceId: presel } : {}),
      ...(code ? { accessCode: code } : {}),
    }));
    if (code) setCodeFromLink(true);
  }, []);

  const overall = useMemo(() => averageOf(ratings), [ratings]);
  const answered = REVIEW_DIMENSIONS.filter((d) => ratings[d.id]).length;

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validate() {
    const er = {};
    if (!form.name.trim()) er.name = "Please tell us who you are.";
    if (!form.email.trim()) er.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Please enter a valid email.";
    if (!form.serviceId) er.serviceId = "Which service was this for?";
    if (answered === 0) er.ratings = "Please rate at least one category.";
    return er;
  }

  async function submit(e) {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    setSubmitting(true);
    setState({ status: "idle", message: "" });
    try {
      const service = SERVICES.find((s) => s.id === form.serviceId);
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          serviceName: service ? service.name : form.serviceId,
          ratings,
          overall: Math.round(overall * 10) / 10,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        if (data.code === "BAD_CODE") {
          setErrors({ accessCode: data.error });
          setEditingCode(true);
          setSubmitting(false);
          return;
        }
        throw new Error(data.error || `Couldn't send your review. (error ${res.status})`);
      }
      setState({ status: "success", message: "" });
    } catch (err) {
      setState({ status: "error", message: err.message || "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  }

  if (state.status === "success") {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-glow sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-400 text-charcoal-900 shadow-gold">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="heading-lg mt-6 font-display font-extrabold text-charcoal-900">
          Thank you — that genuinely helps.
        </h2>
        <p className="mt-3 text-charcoal-600">
          {overall >= 4
            ? "We're glad we got it right. If you'd share the same words with a neighbour, that means more to a local business than any advert we could buy."
            : "We'd rather hear this than not. Someone will read it properly and reach out if there's something we should put right."}
        </p>
        <div className="mt-6 rounded-2xl bg-brand-50 p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-700">
            Your rating
          </div>
          <div className="mt-2 flex items-center justify-center gap-3">
            <Stars value={overall} readOnly />
            <span className="font-display text-2xl font-extrabold text-charcoal-900">
              {overall.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-3xl rounded-3xl border border-charcoal-100 bg-white p-6 shadow-sm sm:p-10"
    >
      {codeFromLink && !editingCode && !errors.accessCode ? (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-green-800">
            <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
            Review code applied — nothing to type
          </div>
          <button
            type="button"
            onClick={() => setEditingCode(true)}
            className="text-xs font-semibold text-green-800 underline underline-offset-2"
          >
            Enter a different code
          </button>
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border border-brand-200 bg-brand-50/60 p-4 sm:p-5">
          <label className="label" htmlFor="rv-code">
            Your review code
          </label>
          <input
            id="rv-code"
            className="input max-w-xs"
            value={form.accessCode}
            onChange={(e) => set("accessCode", e.target.value)}
            placeholder="e.g. GOLD2026"
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            /* Password managers otherwise offer saved logins here, which is
               confusing for a short code that isn't a password. */
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
          />
          <p className="mt-2 text-xs text-charcoal-600">
            We send this with your invoice or follow-up message. It keeps
            reviews to people we&apos;ve actually worked for. Not sure? Reply to
            any email from us and we&apos;ll resend it.
          </p>
          {errors.accessCode && (
            <p className="mt-2 text-sm font-medium text-red-600">{errors.accessCode}</p>
          )}
        </div>
      )}

      {/* Ratings — the part people actually came to do */}
      <fieldset>
        <legend className="heading-md font-display font-bold text-charcoal-900">
          How did we do?
        </legend>
        <p className="mt-2 text-sm text-charcoal-600">
          Rate whichever categories matter to you — skip any that don&apos;t apply.
        </p>

        <div className="mt-6 space-y-4">
          {REVIEW_DIMENSIONS.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl border border-charcoal-100 bg-charcoal-50/60 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="font-semibold text-charcoal-900">{d.label}</div>
                  <div className="mt-0.5 text-xs text-charcoal-500">{d.hint}</div>
                </div>
                <Stars
                  value={ratings[d.id] || 0}
                  onChange={(v) => setRatings((r) => ({ ...r, [d.id]: v }))}
                  name={d.id}
                />
              </div>
            </div>
          ))}
        </div>

        {errors.ratings && (
          <p className="mt-3 text-sm font-medium text-red-600">{errors.ratings}</p>
        )}

        {overall > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold-300/60 bg-gold-50 px-5 py-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-charcoal-500">
                Overall
              </div>
              <div className="mt-0.5 text-sm text-charcoal-600">
                {starLabel(overall)} · averaged from {answered}{" "}
                {answered === 1 ? "category" : "categories"}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Stars value={overall} readOnly />
              <span className="font-display text-2xl font-extrabold tabular-nums text-charcoal-900">
                {overall.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </fieldset>

      {/* Written review */}
      <div className="mt-10">
        <label className="label" htmlFor="rv-headline">
          Sum it up in a line (optional)
        </label>
        <input
          id="rv-headline"
          className="input"
          value={form.headline}
          onChange={(e) => set("headline", e.target.value)}
          placeholder="Driveway looks brand new"
          maxLength={80}
        />

        <label className="label mt-5" htmlFor="rv-body">
          Tell us more (optional)
        </label>
        <textarea
          id="rv-body"
          className="input min-h-[130px]"
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          placeholder="What went well, and anything we could do better next time…"
          maxLength={1500}
        />
        <div className="mt-1 text-right text-xs text-charcoal-400">
          {form.body.length}/1500
        </div>
      </div>

      {/* Who + what */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Your name" error={errors.name}>
          <input
            className="input"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            autoComplete="name"
          />
        </Field>
        <Field label="Email address" error={errors.email}>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
          />
        </Field>
        <Field label="Which service?" error={errors.serviceId} className="sm:col-span-2">
          <select
            className="input"
            value={form.serviceId}
            onChange={(e) => set("serviceId", e.target.value)}
          >
            <option value="">Select the service…</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-charcoal-200 p-4 transition hover:border-brand-300">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => set("consent", e.target.checked)}
          className="mt-0.5 h-5 w-5 flex-none accent-brand-600"
        />
        <span className="text-sm text-charcoal-700">
          Gold Exterior may publish this review, with my first name and last
          initial, on their website.
          <span className="mt-0.5 block text-xs text-charcoal-500">
            Leave this unticked and your feedback stays private — we&apos;ll still read it.
          </span>
        </span>
      </label>

      {state.status === "error" && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <button type="submit" disabled={submitting} className="btn-gold mt-8 w-full disabled:opacity-60">
        {submitting ? "Sending…" : "Submit My Review"}
      </button>
    </form>
  );
}

function Stars({ value = 0, onChange, readOnly = false, name }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  if (readOnly) {
    return (
      <div className="flex" aria-label={`${value.toFixed(1)} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} filled={value >= n - 0.5} className="h-5 w-5" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-none" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n === value ? 0 : n)}
          onMouseEnter={() => setHover(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          aria-pressed={value === n}
          name={name}
          className="grid h-11 w-11 place-items-center rounded-lg transition hover:bg-gold-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        >
          <Star filled={shown >= n} className="h-6 w-6" />
        </button>
      ))}
    </div>
  );
}

function Star({ filled, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} ${filled ? "text-gold-400" : "text-charcoal-300"}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2.6l2.9 6.1 6.6.9-4.8 4.5 1.2 6.6-5.9-3.2-5.9 3.2 1.2-6.6L2.5 9.6l6.6-.9z" />
    </svg>
  );
}

function Field({ label, error, children, className = "" }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
