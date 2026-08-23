"use client";

import { useState } from "react";
import ReviewDesk from "./ReviewDesk";

const initial = {
  ownerCode: "",
  customerName: "",
  customerEmail: "",
  jobLabel: "",
  lifetimeDays: 90,
};

export default function CodeIssuer() {
  // Password first, tool second. Checking it up front means you find out you
  // mistyped before filling in a customer's details, not after.
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [tab, setTab] = useState("reviews"); // reviews | send

  const [form, setForm] = useState(initial);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState({ message: "", field: "" });
  const [issued, setIssued] = useState(null);
  const [copied, setCopied] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError((e) => (e.field === field ? { message: "", field: "" } : e));
  }

  async function unlock(e) {
    e.preventDefault();
    if (!form.ownerCode.trim()) {
      setError({ message: "Enter your password.", field: "ownerCode" });
      return;
    }
    setChecking(true);
    setError({ message: "", field: "" });
    try {
      const res = await fetch("/api/review-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerCode: form.ownerCode, verifyOnly: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError({
          message: data.error || `Couldn't check that. (${res.status})`,
          field: "ownerCode",
        });
        return;
      }
      setUnlocked(true);
    } catch {
      setError({ message: "Couldn't reach the site. Try again.", field: "ownerCode" });
    } finally {
      setChecking(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setError({ message: "", field: "" });

    try {
      const res = await fetch("/api/review-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw Object.assign(new Error(data.error || `Failed (${res.status})`), {
          field: data.field || "",
        });
      }
      setIssued(data);
      setCopied(false);
    } catch (err) {
      setError({ message: err.message, field: err.field || "" });
    } finally {
      setSending(false);
    }
  }

  function issueAnother() {
    // The owner password is the tedious part to retype on a phone, so it stays.
    setForm((f) => ({ ...initial, ownerCode: f.ownerCode }));
    setIssued(null);
    setError({ message: "", field: "" });
  }

  const errFor = (field) => (error.field === field ? error.message : "");

  if (!unlocked) {
    return (
      <form onSubmit={unlock} noValidate className="mx-auto max-w-md">
        <div className="rounded-3xl border border-charcoal-100 bg-white p-6 shadow-sm sm:p-9">
          <div className="text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-charcoal-900 text-gold-300">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="10" width="16" height="10" rx="2.5" />
                <path d="M8 10V7a4 4 0 118 0v3" />
              </svg>
            </div>
            <h2 className="mt-5 font-display text-2xl font-extrabold text-charcoal-900">
              Staff sign in
            </h2>
            <p className="mx-auto mt-3 max-w-xs text-sm text-charcoal-600">
              This page is for Gold Exterior only.
            </p>
          </div>

          <div className="mt-7">
            <label className="sr-only" htmlFor="owner-code">
              Password
            </label>
            <input
              id="owner-code"
              type="password"
              className="input text-center tracking-wider"
              value={form.ownerCode}
              onChange={(e) => set("ownerCode", e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              autoFocus
              aria-invalid={Boolean(errFor("ownerCode"))}
            />
            <FieldError message={errFor("ownerCode")} />
          </div>

          <button
            type="submit"
            disabled={checking}
            className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checking ? "Checking…" : "Sign in"}
          </button>

          {error.message && !error.field && (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error.message}
            </p>
          )}
        </div>
      </form>
    );
  }

  if (issued) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-brand-100 bg-white p-6 shadow-glow sm:p-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-gold-400 text-charcoal-900">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="font-display text-xl font-extrabold">Code sent</h2>
            <p className="text-sm text-charcoal-600">
              Emailed to {issued.sentTo}, and copied to you.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-gold-50 p-5 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-gold-700">
            Their code
          </div>
          <div className="mt-2 break-all font-mono text-lg font-bold tracking-wider text-charcoal-900">
            {issued.code}
          </div>
          <div className="mt-2 text-xs text-charcoal-600">
            Expires{" "}
            {new Date(issued.expiresAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(issued.code);
              setCopied(true);
            } catch {
              setCopied(false);
            }
          }}
          className="btn-outline mt-4 w-full"
        >
          {copied ? "Copied" : "Copy the code"}
        </button>

        <button type="button" onClick={issueAnother} className="btn-primary mt-3 w-full">
          Issue another
        </button>

        <p className="mt-4 text-xs leading-relaxed text-charcoal-500">
          They can also just read it out to you — it works once, from anyone,
          then it&apos;s spent.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: "reviews", label: "Reviews" },
    { id: "send", label: "Send a code" },
  ];

  const nav = (
    <div className="mx-auto mb-8 flex max-w-xl gap-2 rounded-full border border-charcoal-200 bg-white p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setTab(t.id)}
          aria-current={tab === t.id ? "page" : undefined}
          className={`min-h-[44px] flex-1 rounded-full px-4 text-sm font-semibold transition ${
            tab === t.id
              ? "bg-brand-600 text-white shadow-sm"
              : "text-charcoal-600 hover:text-charcoal-900"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );

  if (tab === "reviews") {
    return (
      <div className="mx-auto max-w-xl">
        {nav}
        <ReviewDesk ownerCode={form.ownerCode} />
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-xl">
      {nav}
      <div className="rounded-3xl border border-charcoal-100 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <label className="label" htmlFor="cust-name">
            Customer name
          </label>
          <input
            id="cust-name"
            className="input"
            value={form.customerName}
            onChange={(e) => set("customerName", e.target.value)}
            placeholder="Sarah Mitchell"
            autoComplete="off"
            aria-invalid={Boolean(errFor("customerName"))}
          />
          <FieldError message={errFor("customerName")} />
        </div>

        <div className="mt-5">
          <label className="label" htmlFor="cust-email">
            Their email
          </label>
          <input
            id="cust-email"
            type="email"
            inputMode="email"
            className="input"
            value={form.customerEmail}
            onChange={(e) => set("customerEmail", e.target.value)}
            placeholder="sarah@example.com"
            autoComplete="off"
            aria-invalid={Boolean(errFor("customerEmail"))}
          />
          <FieldError message={errFor("customerEmail")} />
        </div>

        <div className="mt-5">
          <label className="label" htmlFor="job-label">
            What did you do?{" "}
            <span className="font-normal text-charcoal-500">(optional)</span>
          </label>
          <input
            id="job-label"
            className="input"
            value={form.jobLabel}
            onChange={(e) => set("jobLabel", e.target.value)}
            placeholder="driveway wash"
            autoComplete="off"
          />
          <p className="mt-1.5 text-xs text-charcoal-500">
            Goes in their email (&ldquo;we finished up your driveway wash&rdquo;)
            and in your copy, so you can find it later.
          </p>
        </div>

        <div className="mt-5">
          <label className="label" htmlFor="lifetime">
            Good for
          </label>
          <select
            id="lifetime"
            className="input"
            value={form.lifetimeDays}
            onChange={(e) => set("lifetimeDays", Number(e.target.value))}
          >
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={180}>6 months</option>
            <option value={365}>A year</option>
          </select>
        </div>

        {error.message && !error.field && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="btn-gold mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Sending…" : "Send them a code"}
        </button>
      </div>
    </form>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-2 text-sm font-medium text-red-600">{message}</p>;
}
