"use client";

import { useEffect, useState } from "react";
import { MAX_RATING, REVIEW_SERVICE_OPTIONS } from "@/lib/reviews";
import { shrinkImage } from "@/lib/image";

const RATING_WORDS = {
  1: "Not good",
  2: "Below par",
  3: "Fine",
  4: "Great",
  5: "Couldn't be better",
};

const initialForm = {
  code: "",
  rating: 0,
  name: "",
  city: "",
  email: "",
  serviceId: "",
  headline: "",
  body: "",
  consent: false,
};

const BODY_MIN = 20;
const BODY_MAX = 1500;

export default function ReviewForm() {
  // Three stages: the button, the code gate, then the review itself. The long
  // form stays out of sight until someone actually has a code — and the code is
  // checked before they write a word, so nobody fills this in only to be turned
  // away at the end.
  const [stage, setStage] = useState("closed"); // closed | code | form
  const [checking, setChecking] = useState(false);

  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [compressing, setCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState({ message: "", field: "" });
  const [done, setDone] = useState(false);

  // The code arrives as ?code= on the link in the customer's email, so the
  // field is filled in before they ever look at it. Read on the client rather
  // than from searchParams so this page stays statically rendered.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromLink = new URLSearchParams(window.location.search).get("code");
    if (fromLink) {
      setForm((f) => (f.code ? f : { ...f, code: fromLink }));
      // They came from their email, so skip straight past the button.
      setStage("code");
    }
  }, []);

  // Check the code before showing the form. The submit re-checks and burns it,
  // so a tampered "yes" here gets nobody anything.
  async function checkCode(e) {
    e.preventDefault();
    if (!form.code.trim()) {
      setError({ message: "Enter the code from your email.", field: "code" });
      return;
    }
    setChecking(true);
    setError({ message: "", field: "" });
    try {
      const res = await fetch("/api/review/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: form.code.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError({
          message: data.error || `Couldn't check that code. (${res.status})`,
          field: "code",
        });
        return;
      }
      setStage("form");
    } catch {
      setError({
        message: "Couldn't reach us to check that code. Try again.",
        field: "code",
      });
    } finally {
      setChecking(false);
    }
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    // Clearing on edit means the customer isn't still staring at "that code
    // isn't right" while they retype it.
    setError((e) => (e.field === field ? { message: "", field: "" } : e));
  }

  async function handlePhoto(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setPhoto(null);
      setPhotoPreview("");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError({ message: "Please upload an image file.", field: "photo" });
      return;
    }
    // Refuse the truly enormous before trying to decode it. Anything a phone
    // camera produces is far below this; a file above it is usually a mistake,
    // and decoding one can lock up the browser on a phone.
    if (file.size > 25 * 1024 * 1024) {
      setError({ message: "That photo is too big — 25MB is the limit.", field: "photo" });
      return;
    }
    setCompressing(true);
    try {
      const { file: shrunk, dataUrl } = await shrinkImage(file, "review-photo");
      setPhoto(shrunk);
      setPhotoPreview(dataUrl);
      setError((er) => (er.field === "photo" ? { message: "", field: "" } : er));
    } catch {
      setError({
        message: "We couldn't read that image. Try a different photo.",
        field: "photo",
      });
      setPhoto(null);
      setPhotoPreview("");
    } finally {
      setCompressing(false);
    }
  }

  // Mirrors the server's rules so the common mistakes are caught without a
  // round trip. The server is still the one that decides.
  function localError() {
    if (!form.code.trim()) return { message: "Enter the review code we gave you.", field: "code" };
    if (!form.rating) return { message: "Pick a star rating.", field: "rating" };
    if (!form.name.trim()) return { message: "Tell us what name to credit.", field: "name" };
    if (!form.city.trim()) return { message: "Which city was the job in?", field: "city" };
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      return { message: "Enter a valid email so we can confirm it's you.", field: "email" };
    if (!form.serviceId) return { message: "Pick the service we did for you.", field: "serviceId" };
    if (form.body.trim().length < BODY_MIN)
      return {
        message: `Reviews need at least ${BODY_MIN} characters so they're useful to other customers.`,
        field: "body",
      };
    if (!form.consent)
      return { message: "We need your OK to publish the review.", field: "consent" };
    return null;
  }

  async function submit(e) {
    e.preventDefault();

    const local = localError();
    if (local) {
      setError(local);
      return;
    }

    setSubmitting(true);
    setError({ message: "", field: "" });

    try {
      const fd = new FormData();
      fd.append(
        "payload",
        JSON.stringify({
          code: form.code.trim(),
          rating: form.rating,
          name: form.name.trim(),
          city: form.city.trim(),
          email: form.email.trim(),
          serviceId: form.serviceId,
          headline: form.headline.trim(),
          body: form.body.trim(),
          consent: form.consent,
        })
      );
      if (photo) fd.append("photo", photo);

      const res = await fetch("/api/review", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        throw Object.assign(
          new Error(data.error || `Something went wrong sending your review. (error ${res.status})`),
          { field: data.field || "" }
        );
      }

      setDone(true);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError({ message: err.message, field: err.field || "" });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-glow sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-400 text-charcoal-900 shadow-gold">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-6 font-display text-3xl font-extrabold text-charcoal-900">
          Thank you — we got it
        </h2>
        <p className="mt-3 text-charcoal-600">
          Your review is with us now. We check every one against our job records
          before it goes up, so give it a couple of days to appear on this page.
        </p>
      </div>
    );
  }

  const bodyLeft = BODY_MAX - form.body.length;
  const errFor = (field) => (error.field === field ? error.message : "");

  // ── Stage 1: the button ────────────────────────────────────────────────
  if (stage === "closed") {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-charcoal-100 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="5" width="16" height="15" rx="3" />
            <path d="M9 3v4M15 3v4M9 12h6M9 16h3" />
          </svg>
        </div>
        <h3 className="mt-5 font-display text-2xl font-extrabold text-charcoal-900">
          Worked with us?
        </h3>
        <p className="mx-auto mt-3 max-w-md text-charcoal-600">
          We&apos;d love to hear how it went. You&apos;ll need the code we
          emailed you after your job — it takes about a minute.
        </p>
        <button
          type="button"
          onClick={() => setStage("code")}
          className="btn-gold mt-7 w-full sm:w-auto sm:px-10"
        >
          Add a Review
        </button>
        <p className="mt-5 text-xs text-charcoal-500">
          Only customers can post here. That&apos;s the point.
        </p>
      </div>
    );
  }

  // ── Stage 2: the code ──────────────────────────────────────────────────
  if (stage === "code") {
    return (
      <form onSubmit={checkCode} noValidate className="mx-auto max-w-lg">
        <div className="rounded-3xl border border-charcoal-100 bg-white p-6 shadow-sm sm:p-9">
          <div className="text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gold-100 text-gold-700">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="10" width="16" height="10" rx="2.5" />
                <path d="M8 10V7a4 4 0 118 0v3" />
              </svg>
            </div>
            <h3 className="mt-5 font-display text-2xl font-extrabold text-charcoal-900">
              Enter your review code
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-sm text-charcoal-600">
              We emailed it to you when your job wrapped. It&apos;s yours alone
              and it works once.
            </p>
          </div>

          <div className="mt-7">
            <label className="sr-only" htmlFor="review-code">
              Your review code
            </label>
            <input
              id="review-code"
              className="input text-center font-mono text-lg tracking-widest"
              value={form.code}
              onChange={(e) => set("code", e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              autoFocus
              aria-invalid={Boolean(errFor("code"))}
            />
            <FieldError message={errFor("code")} />
          </div>

          <button
            type="submit"
            disabled={checking}
            className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checking ? "Checking…" : "Continue"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStage("closed");
              setError({ message: "", field: "" });
            }}
            className="mt-4 w-full text-sm font-semibold text-charcoal-500 hover:text-charcoal-800"
          >
            Back
          </button>

          <p className="mt-6 border-t border-charcoal-100 pt-5 text-center text-xs leading-relaxed text-charcoal-500">
            Following the link in that email fills this in for you. Can&apos;t
            find it? Reply to any email from us and we&apos;ll send a fresh one.
          </p>
        </div>
      </form>
    );
  }


  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-charcoal-100 bg-white p-6 shadow-sm sm:p-10">
        {/* The code is already confirmed by this point — show it back rather
            than asking again, and let them correct it if it's the wrong one. */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-brand-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none text-brand-700" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                Code accepted
              </div>
              <div className="break-all font-mono text-sm text-charcoal-700">
                {form.code}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setStage("code");
              setError({ message: "", field: "" });
            }}
            className="text-sm font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
          >
            Change
          </button>
        </div>

        {/* Rating */}
        <fieldset className="mt-8">
          <legend className="label">How did we do?</legend>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: MAX_RATING }, (_, i) => i + 1).map((value) => (
                <label
                  key={value}
                  className="cursor-pointer rounded-lg p-1 focus-within:ring-2 focus-within:ring-brand-400"
                  title={RATING_WORDS[value]}
                >
                  <input
                    type="radio"
                    name="rating"
                    value={value}
                    checked={form.rating === value}
                    onChange={() => set("rating", value)}
                    className="sr-only"
                  />
                  <span className="sr-only">
                    {value} star{value === 1 ? "" : "s"} — {RATING_WORDS[value]}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={`h-9 w-9 transition ${
                      value <= form.rating ? "text-gold-400" : "text-charcoal-200"
                    }`}
                    fill="currentColor"
                  >
                    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                  </svg>
                </label>
              ))}
            </div>
            {form.rating > 0 && (
              <span className="text-sm font-semibold text-charcoal-700">
                {RATING_WORDS[form.rating]}
              </span>
            )}
          </div>
          <FieldError message={errFor("rating")} />
        </fieldset>

        {/* Identity */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="review-name">
              Name to show
            </label>
            <input
              id="review-name"
              className="input"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Sarah M."
              autoComplete="name"
              aria-invalid={Boolean(errFor("name"))}
            />
            <p className="mt-1.5 text-xs text-charcoal-500">
              First name and last initial is plenty.
            </p>
            <FieldError message={errFor("name")} />
          </div>

          <div>
            <label className="label" htmlFor="review-city">
              City
            </label>
            <input
              id="review-city"
              className="input"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Mountain View"
              autoComplete="address-level2"
              aria-invalid={Boolean(errFor("city"))}
            />
            <p className="mt-1.5 text-xs text-charcoal-500">
              City only — we never publish an address.
            </p>
            <FieldError message={errFor("city")} />
          </div>

          <div>
            <label className="label" htmlFor="review-email">
              Your email
            </label>
            <input
              id="review-email"
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errFor("email"))}
            />
            <p className="mt-1.5 text-xs text-charcoal-500">
              Never published. We use it to match you to the job.
            </p>
            <FieldError message={errFor("email")} />
          </div>

          <div>
            <label className="label" htmlFor="review-service">
              What did we do?
            </label>
            <select
              id="review-service"
              className="input"
              value={form.serviceId}
              onChange={(e) => set("serviceId", e.target.value)}
              aria-invalid={Boolean(errFor("serviceId"))}
            >
              <option value="">Choose a service…</option>
              {REVIEW_SERVICE_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            <FieldError message={errFor("serviceId")} />
          </div>
        </div>

        {/* The review itself */}
        <div className="mt-8">
          <label className="label" htmlFor="review-headline">
            Headline <span className="font-normal text-charcoal-500">(optional)</span>
          </label>
          <input
            id="review-headline"
            className="input"
            value={form.headline}
            onChange={(e) => set("headline", e.target.value.slice(0, 90))}
            placeholder="Driveway looks brand new"
            maxLength={90}
          />
        </div>

        <div className="mt-6">
          <label className="label" htmlFor="review-body">
            Your review
          </label>
          <textarea
            id="review-body"
            rows={6}
            className="input resize-y"
            value={form.body}
            onChange={(e) => set("body", e.target.value.slice(0, BODY_MAX))}
            placeholder="What did we clean, how did it go, would you have us back?"
            aria-invalid={Boolean(errFor("body"))}
          />
          <div className="mt-1.5 flex justify-between text-xs text-charcoal-500">
            <span>Honest is more useful than glowing.</span>
            <span className="tabular-nums">{bodyLeft} left</span>
          </div>
          <FieldError message={errFor("body")} />
        </div>

        {/* Photo */}
        <div className="mt-6">
          <label className="label" htmlFor="review-photo">
            Photo of the job{" "}
            <span className="font-normal text-charcoal-500">(optional)</span>
          </label>
          <input
            id="review-photo"
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            className="block w-full text-sm text-charcoal-600 file:mr-4 file:min-h-[44px] file:rounded-full file:border-0 file:bg-brand-600 file:px-5 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
          />
          <p className="mt-1.5 text-xs text-charcoal-500">
            Goes to us, not to the page — it just helps us confirm the job.
          </p>
          {compressing && (
            <p className="mt-2 text-sm text-charcoal-500">Preparing photo…</p>
          )}
          {photoPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoPreview}
              alt="Job photo preview"
              className="mt-3 max-h-48 rounded-xl border border-charcoal-100"
            />
          )}
          <FieldError message={errFor("photo")} />
        </div>

        {/* Consent */}
        <div className="mt-8 rounded-2xl bg-brand-50 p-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => set("consent", e.target.checked)}
              className="mt-0.5 h-5 w-5 flex-none rounded border-charcoal-300 text-brand-600 focus:ring-brand-400"
              aria-invalid={Boolean(errFor("consent"))}
            />
            <span className="text-sm text-charcoal-700">
              Gold Exterior can publish my name, city and review on this site. My
              email, my address and any photo stay private.
            </span>
          </label>
          <FieldError message={errFor("consent")} />
        </div>

        {/* A failure with no field of its own (network, mail, throttle) still
            has to be visible somewhere. */}
        {error.message && !error.field && (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || compressing}
          className="btn-gold mt-8 w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Submit my review"}
        </button>

        <p className="mt-4 text-center text-xs text-charcoal-500">
          Reviews are read by a person before they&apos;re published. Nothing
          goes up automatically.
        </p>
      </div>
    </form>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-2 text-sm font-medium text-red-600">{message}</p>;
}
