"use client";

import { useCallback, useEffect, useState } from "react";
import Stars from "./Stars";

// The moderation half of the staff page: what's waiting, what's live, and one
// button to move a review between the two.
export default function ReviewDesk({ ownerCode }) {
  const [pending, setPending] = useState([]);
  const [published, setPublished] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const call = useCallback(
    async (action, id) => {
      const res = await fetch("/api/staff/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerCode, action, id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || `Failed (${res.status})`);
      return data;
    },
    [ownerCode]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await call("list");
      setPending(data.pending || []);
      setPublished(data.published || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [call]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function act(action, id) {
    setBusyId(id);
    setError("");
    try {
      await call(action, id);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  }

  if (loading) {
    return (
      <p className="rounded-2xl border border-charcoal-100 bg-white p-6 text-center text-sm text-charcoal-500">
        Loading reviews…
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <section>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold text-charcoal-900">
            Waiting on you
          </h2>
          <span className="text-sm font-semibold text-charcoal-500">
            {pending.length}
          </span>
        </div>

        {pending.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-charcoal-200 p-6 text-center text-sm text-charcoal-500">
            Nothing waiting. New reviews land here the moment a customer sends
            one.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {pending.map((r) => (
              <ReviewCard
                key={r.id}
                review={r}
                busy={busyId === r.id}
                actions={[
                  { label: "Publish", kind: "primary", onClick: () => act("publish", r.id) },
                  { label: "Delete", kind: "quiet", onClick: () => act("delete", r.id) },
                ]}
              />
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold text-charcoal-900">
            Live on the site
          </h2>
          <span className="text-sm font-semibold text-charcoal-500">
            {published.length}
          </span>
        </div>

        {published.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-charcoal-200 p-6 text-center text-sm text-charcoal-500">
            None published yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {published.map((r) => (
              <ReviewCard
                key={r.id}
                review={r}
                live
                busy={busyId === r.id}
                actions={[
                  {
                    label: "Take down",
                    kind: "quiet",
                    onClick: () => act("unpublish", r.id),
                  },
                ]}
              />
            ))}
          </ul>
        )}
      </section>

      <button type="button" onClick={refresh} className="btn-outline w-full">
        Refresh
      </button>
    </div>
  );
}

function ReviewCard({ review, actions, busy, live }) {
  return (
    <li className="rounded-2xl border border-charcoal-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Stars rating={review.rating} size="h-4 w-4" />
        {live && (
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-700">
            Live
          </span>
        )}
      </div>

      {review.headline && (
        <h3 className="mt-3 font-display text-base font-bold text-charcoal-900">
          {review.headline}
        </h3>
      )}
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-charcoal-700">
        {review.body}
      </p>

      <div className="mt-4 border-t border-charcoal-100 pt-3 text-xs text-charcoal-500">
        <span className="font-semibold text-charcoal-800">{review.name}</span>
        {" · "}
        {[review.city, review.service].filter(Boolean).join(" · ")}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            disabled={busy}
            onClick={a.onClick}
            className={
              a.kind === "primary"
                ? "btn-gold flex-1 disabled:cursor-not-allowed disabled:opacity-60"
                : "btn-outline flex-1 disabled:cursor-not-allowed disabled:opacity-60"
            }
          >
            {busy ? "Working…" : a.label}
          </button>
        ))}
      </div>
    </li>
  );
}
