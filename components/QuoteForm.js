"use client";

import { useEffect, useMemo, useState } from "react";
import { SERVICES, calculateTotal, formatMoney } from "@/lib/services";
import ServiceIcon from "./ServiceIcon";

const STEPS = [
  { id: "services", label: "Services" },
  { id: "details", label: "Job details" },
  { id: "contact", label: "Contact" },
  { id: "photo", label: "Photo" },
  { id: "review", label: "Review" },
];

const initialContact = {
  name: "",
  address: "",
  phone: "",
  email: "",
  notes: "",
};

export default function QuoteForm() {
  const [step, setStep] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]); // service ids
  const [answers, setAnswers] = useState({}); // { [serviceId]: { [questionId]: value } }
  const [contact, setContact] = useState(initialContact);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });

  // Pre-select a service if ?service= passed via query string
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const presel = params.get("service");
    if (presel && SERVICES.find((s) => s.id === presel)) {
      setSelectedIds([presel]);
    }
  }, []);

  const selectedServices = useMemo(
    () => SERVICES.filter((s) => selectedIds.includes(s.id)),
    [selectedIds]
  );

  // Live estimate that updates as the form changes
  const estimate = useMemo(() => {
    const selections = {};
    for (const id of selectedIds) selections[id] = answers[id] || {};
    return calculateTotal(selections);
  }, [selectedIds, answers]);

  function toggleService(id) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        // also strip its answers
        setAnswers((a) => {
          const n = { ...a };
          delete n[id];
          return n;
        });
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  }

  function setAnswer(serviceId, questionId, value) {
    setAnswers((prev) => ({
      ...prev,
      [serviceId]: { ...(prev[serviceId] || {}), [questionId]: value },
    }));
  }

  function toggleCheckbox(serviceId, questionId, value) {
    setAnswers((prev) => {
      const cur = (prev[serviceId] && prev[serviceId][questionId]) || [];
      const next = cur.includes(value)
        ? cur.filter((v) => v !== value)
        : [...cur, value];
      return {
        ...prev,
        [serviceId]: { ...(prev[serviceId] || {}), [questionId]: next },
      };
    });
  }

  function handlePhoto(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setPhoto(null);
      setPhotoPreview("");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrors((er) => ({ ...er, photo: "File must be 8MB or smaller." }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrors((er) => ({ ...er, photo: "Please upload an image file." }));
      return;
    }
    setErrors((er) => {
      const n = { ...er };
      delete n.photo;
      return n;
    });
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  function validateStep(targetStep) {
    const er = {};
    if (targetStep >= 1 && selectedIds.length === 0) {
      er.services = "Pick at least one service to continue.";
    }
    if (targetStep >= 2) {
      for (const svc of selectedServices) {
        for (const q of svc.questions) {
          const val = answers[svc.id] && answers[svc.id][q.id];
          if (q.type === "checkbox") {
            if (!val || val.length === 0) {
              er[`${svc.id}.${q.id}`] = "Please choose at least one option.";
            }
          } else if (!val) {
            er[`${svc.id}.${q.id}`] = "Required.";
          }
        }
      }
    }
    if (targetStep >= 3) {
      if (!contact.name.trim()) er["contact.name"] = "Name is required.";
      if (!contact.address.trim()) er["contact.address"] = "Address is required.";
      if (!contact.phone.trim()) er["contact.phone"] = "Phone is required.";
      if (!contact.email.trim()) {
        er["contact.email"] = "Email is required.";
      } else if (!/^\S+@\S+\.\S+$/.test(contact.email)) {
        er["contact.email"] = "Please enter a valid email.";
      }
    }
    return er;
  }

  function next() {
    const er = validateStep(step + 1);
    setErrors(er);
    if (Object.keys(er).length === 0) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    // Final validation pass
    const er = validateStep(STEPS.length - 1);
    setErrors(er);
    if (Object.keys(er).length > 0) {
      // Walk back to the earliest step containing an error
      const firstKey = Object.keys(er)[0];
      if (firstKey === "services") setStep(0);
      else if (firstKey.startsWith("contact.")) setStep(2);
      else setStep(1);
      return;
    }

    setSubmitting(true);
    setSubmitState({ status: "idle", message: "" });

    try {
      const fd = new FormData();
      const payload = {
        services: selectedServices.map((s) => ({
          id: s.id,
          name: s.name,
          answers: Object.fromEntries(
            s.questions.map((q) => {
              const val = answers[s.id]?.[q.id];
              const label = Array.isArray(val)
                ? val.map((v) => q.options.find((o) => o.value === v)?.label ?? v).join(", ")
                : (q.options.find((o) => o.value === val)?.label ?? val ?? "—");
              return [q.label, label];
            })
          ),
        })),
        contact,
        estimate,
      };
      fd.append("payload", JSON.stringify(payload));
      if (photo) fd.append("photo", photo);

      const res = await fetch("/api/quote", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong sending your quote.");
      }

      setSubmitState({
        status: "success",
        message:
          "Thanks! Your quote request is in. We'll be in touch by email shortly.",
      });
    } catch (err) {
      setSubmitState({
        status: "error",
        message: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // ───────────────────────── Success state
  if (submitState.status === "success") {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-brand-100 bg-white p-10 text-center shadow-glow">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-400 text-charcoal-900 shadow-gold">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-6 font-display text-3xl font-extrabold text-charcoal-900">
          Quote request received
        </h2>
        <p className="mt-3 text-charcoal-600">{submitState.message}</p>
        <div className="mt-6 rounded-2xl bg-brand-50 p-5 text-left">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-700">
            Your estimate
          </div>
          <div className="mt-1 font-display text-3xl font-extrabold text-charcoal-900">
            {formatMoney(estimate.low)} – {formatMoney(estimate.high)}
          </div>
          <p className="mt-2 text-xs text-charcoal-500">
            Final pricing confirmed after our team reviews your photo and address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      {/* Form column */}
      <div className="rounded-3xl border border-charcoal-100 bg-white p-6 shadow-sm sm:p-10">
        {/* Progress */}
        <ol className="mb-8 grid grid-cols-5 gap-2 text-[11px] font-semibold uppercase tracking-wider">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={s.id} className="flex flex-col items-center text-center">
                <div
                  className={`grid h-9 w-9 place-items-center rounded-full border transition ${
                    active
                      ? "border-brand-600 bg-brand-600 text-white"
                      : done
                        ? "border-gold-400 bg-gold-400 text-charcoal-900"
                        : "border-charcoal-200 bg-white text-charcoal-400"
                  }`}
                >
                  {done ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`mt-2 hidden sm:block ${
                    active ? "text-brand-700" : done ? "text-charcoal-700" : "text-charcoal-400"
                  }`}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>

        {/* STEP 1: Services */}
        {step === 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-charcoal-900">
              What services do you need?
            </h2>
            <p className="mt-2 text-sm text-charcoal-600">
              Pick one or more — bundle as many as you'd like.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {SERVICES.map((svc) => {
                const checked = selectedIds.includes(svc.id);
                return (
                  <label
                    key={svc.id}
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                      checked
                        ? "border-brand-500 bg-brand-50 shadow-glow"
                        : "border-charcoal-200 hover:border-brand-300 hover:bg-brand-50/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleService(svc.id)}
                    />
                    <div
                      className={`grid h-11 w-11 flex-none place-items-center rounded-xl ${
                        checked ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700"
                      }`}
                    >
                      <ServiceIcon name={svc.icon} className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-charcoal-900">{svc.name}</div>
                        <div
                          className={`grid h-5 w-5 place-items-center rounded-full border ${
                            checked
                              ? "border-brand-600 bg-brand-600 text-white"
                              : "border-charcoal-300 bg-white text-transparent"
                          }`}
                        >
                          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-charcoal-600">{svc.tagline}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            {errors.services && (
              <p className="mt-3 text-sm font-medium text-red-600">{errors.services}</p>
            )}
          </div>
        )}

        {/* STEP 2: Details per service */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-charcoal-900">
              A few quick questions
            </h2>
            <p className="mt-2 text-sm text-charcoal-600">
              We use this to calculate your estimate. Pick the closest match —
              we'll confirm before the job.
            </p>

            <div className="mt-6 space-y-8">
              {selectedServices.map((svc) => (
                <div key={svc.id} className="rounded-2xl border border-charcoal-100 bg-charcoal-50/60 p-6">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
                      <ServiceIcon name={svc.icon} className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-brand-700">
                        Service
                      </div>
                      <div className="font-display text-lg font-bold text-charcoal-900">
                        {svc.name}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-5">
                    {svc.questions.map((q) => {
                      const errKey = `${svc.id}.${q.id}`;
                      const cur = answers[svc.id] && answers[svc.id][q.id];
                      return (
                        <div key={q.id}>
                          <label className="label">{q.label}</label>

                          {q.type === "select" && (
                            <select
                              className="input"
                              value={cur || ""}
                              onChange={(e) => setAnswer(svc.id, q.id, e.target.value)}
                            >
                              <option value="">Select an option…</option>
                              {q.options.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          )}

                          {q.type === "radio" && (
                            <div className="grid gap-2 sm:grid-cols-2">
                              {q.options.map((o) => {
                                const active = cur === o.value;
                                return (
                                  <label
                                    key={o.value}
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                                      active
                                        ? "border-brand-500 bg-brand-50 text-brand-800"
                                        : "border-charcoal-200 bg-white text-charcoal-700 hover:border-brand-300"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`${svc.id}-${q.id}`}
                                      value={o.value}
                                      checked={active}
                                      onChange={() => setAnswer(svc.id, q.id, o.value)}
                                      className="sr-only"
                                    />
                                    <span
                                      className={`grid h-5 w-5 place-items-center rounded-full border ${
                                        active ? "border-brand-600 bg-brand-600" : "border-charcoal-300"
                                      }`}
                                    >
                                      {active && <span className="h-2 w-2 rounded-full bg-white" />}
                                    </span>
                                    {o.label}
                                  </label>
                                );
                              })}
                            </div>
                          )}

                          {q.type === "checkbox" && (
                            <div className="grid gap-2 sm:grid-cols-2">
                              {q.options.map((o) => {
                                const arr = Array.isArray(cur) ? cur : [];
                                const active = arr.includes(o.value);
                                return (
                                  <label
                                    key={o.value}
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                                      active
                                        ? "border-brand-500 bg-brand-50 text-brand-800"
                                        : "border-charcoal-200 bg-white text-charcoal-700 hover:border-brand-300"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={active}
                                      onChange={() => toggleCheckbox(svc.id, q.id, o.value)}
                                      className="sr-only"
                                    />
                                    <span
                                      className={`grid h-5 w-5 place-items-center rounded-md border ${
                                        active
                                          ? "border-brand-600 bg-brand-600 text-white"
                                          : "border-charcoal-300 text-transparent"
                                      }`}
                                    >
                                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 13l4 4L19 7" />
                                      </svg>
                                    </span>
                                    {o.label}
                                  </label>
                                );
                              })}
                            </div>
                          )}

                          {errors[errKey] && (
                            <p className="mt-2 text-sm font-medium text-red-600">{errors[errKey]}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Contact */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-charcoal-900">
              Where should we send your quote?
            </h2>
            <p className="mt-2 text-sm text-charcoal-600">
              We'll only use this to follow up on your request.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Full name" error={errors["contact.name"]}>
                <input
                  className="input"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  autoComplete="name"
                />
              </Field>
              <Field label="Phone number" error={errors["contact.phone"]}>
                <input
                  className="input"
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  autoComplete="tel"
                />
              </Field>
              <Field label="Email address" error={errors["contact.email"]} className="sm:col-span-2">
                <input
                  className="input"
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  autoComplete="email"
                />
              </Field>
              <Field label="Address of the job" error={errors["contact.address"]} className="sm:col-span-2">
                <input
                  className="input"
                  value={contact.address}
                  onChange={(e) => setContact({ ...contact, address: e.target.value })}
                  autoComplete="street-address"
                  placeholder="Street, City, ZIP"
                />
              </Field>
              <Field label="Anything else? (optional)" className="sm:col-span-2">
                <textarea
                  className="input min-h-[100px]"
                  value={contact.notes}
                  onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                  placeholder="Gate code, preferred day, particular concerns…"
                />
              </Field>
            </div>
          </div>
        )}

        {/* STEP 4: Photo */}
        {step === 3 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-charcoal-900">
              Add a photo of the job
            </h2>
            <p className="mt-2 text-sm text-charcoal-600">
              A picture helps us nail the final price on the first try. Optional,
              but highly recommended.
            </p>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/40 p-10 text-center transition hover:border-brand-400">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview}
                  alt="Uploaded preview"
                  className="max-h-64 w-auto rounded-xl border border-brand-200 shadow-sm"
                />
              ) : (
                <>
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-brand-700">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                  <div className="font-semibold text-charcoal-800">
                    Tap to upload an image
                  </div>
                  <div className="text-xs text-charcoal-500">
                    JPG, PNG or HEIC · 8 MB max
                  </div>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="sr-only"
              />
              {photoPreview && (
                <span className="text-xs font-semibold text-brand-700">
                  Tap again to replace
                </span>
              )}
            </label>
            {errors.photo && (
              <p className="mt-3 text-sm font-medium text-red-600">{errors.photo}</p>
            )}
          </div>
        )}

        {/* STEP 5: Review */}
        {step === 4 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-charcoal-900">
              Review your request
            </h2>
            <p className="mt-2 text-sm text-charcoal-600">
              Looks good? We'll fire it off to our team.
            </p>

            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-charcoal-100 bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-charcoal-500">
                  Services
                </div>
                <ul className="mt-2 space-y-2 text-sm text-charcoal-800">
                  {selectedServices.map((s) => (
                    <li key={s.id} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-brand-500" />
                      <div>
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-xs text-charcoal-500">
                          {s.questions
                            .map((q) => {
                              const v = answers[s.id] && answers[s.id][q.id];
                              if (!v) return null;
                              const txt = Array.isArray(v)
                                ? v
                                    .map(
                                      (val) =>
                                        q.options.find((o) => o.value === val)?.label || val
                                    )
                                    .join(", ")
                                : q.options.find((o) => o.value === v)?.label || v;
                              return `${q.label.replace(/[?:]$/, "")}: ${txt}`;
                            })
                            .filter(Boolean)
                            .join(" · ")}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-charcoal-100 bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-charcoal-500">
                  Contact
                </div>
                <div className="mt-2 grid gap-1 text-sm text-charcoal-800 sm:grid-cols-2">
                  <div><span className="text-charcoal-500">Name: </span>{contact.name}</div>
                  <div><span className="text-charcoal-500">Phone: </span>{contact.phone}</div>
                  <div className="sm:col-span-2"><span className="text-charcoal-500">Email: </span>{contact.email}</div>
                  <div className="sm:col-span-2"><span className="text-charcoal-500">Address: </span>{contact.address}</div>
                  {contact.notes && (
                    <div className="sm:col-span-2"><span className="text-charcoal-500">Notes: </span>{contact.notes}</div>
                  )}
                </div>
              </div>

              {photoPreview && (
                <div className="rounded-2xl border border-charcoal-100 bg-white p-5">
                  <div className="text-xs font-semibold uppercase tracking-widest text-charcoal-500">
                    Photo
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Job preview"
                    className="mt-2 max-h-48 w-auto rounded-xl border border-charcoal-100"
                  />
                </div>
              )}
            </div>

            {submitState.status === "error" && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {submitState.message}
              </div>
            )}
          </div>
        )}

        {/* Footer / nav buttons */}
        <div className="mt-10 flex items-center justify-between gap-3 border-t border-charcoal-100 pt-6">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="btn border border-charcoal-200 text-charcoal-700 hover:bg-charcoal-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary">
              Continue
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="btn-gold disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send My Quote Request"}
            </button>
          )}
        </div>
      </div>

      {/* Live estimate sidebar */}
      <aside className="lg:sticky lg:top-24 self-start">
        <div className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-glow">
          <div className="relative bg-charcoal-950 p-6 text-white">
            <div className="absolute inset-0 bg-hero-gradient" />
            <div className="absolute inset-0 bg-wave-pattern" />
            <div className="relative">
              <div className="text-xs font-semibold uppercase tracking-widest text-brand-200">
                Estimated price
              </div>
              <div className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                {estimate.low > 0
                  ? `${formatMoney(estimate.low)} – ${formatMoney(estimate.high)}`
                  : "—"}
              </div>
              <p className="mt-2 text-xs text-brand-100">
                Live estimate based on your selections. Final pricing confirmed
                after our team reviews your photo & address.
              </p>
            </div>
          </div>

          <div className="p-6">
            {estimate.breakdown.length === 0 ? (
              <p className="text-sm text-charcoal-500">
                Pick a service to see your estimate update in real time.
              </p>
            ) : (
              <ul className="divide-y divide-charcoal-100">
                {estimate.breakdown.map((b) => (
                  <li key={b.service} className="flex items-center justify-between py-3 text-sm">
                    <span className="text-charcoal-700">{b.service}</span>
                    <span className="font-semibold text-charcoal-900">
                      {formatMoney(b.low)} – {formatMoney(b.high)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 rounded-xl bg-brand-50 p-4 text-xs text-brand-800">
              <div className="font-semibold">No surprises, ever.</div>
              <p className="mt-1 text-brand-700/90">
                The price you see is the price we'll honor when the job matches
                what you described.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
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
