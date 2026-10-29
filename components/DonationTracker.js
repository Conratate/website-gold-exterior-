"use client";

import { useState } from "react";
import { CHARITY, mealsForJob } from "@/lib/promos";

const MIN_JOB = 50;
const MAX_JOB = 2000;

// Cents only when there are any: "$19.50", but "$130", not "$130.00".
const dollars = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);

// Real total so far, the goal, and what the visitor's own job would add.
// Nothing here is projected into the "raised" figure — the slider only
// previews a job that hasn't happened yet, and it's labeled that way.
export default function DonationTracker() {
  const [job, setJob] = useState(300);
  const give = Math.round(job * CHARITY.percent) / 100;
  const meals = mealsForJob(job);
  // Two meals a bowl keeps the grid readable at the top of the slider.
  const bowls = Math.floor(meals / 2);

  const raisedPct = Math.min(100, (CHARITY.donated / CHARITY.goal) * 100);
  const yoursPct = Math.min(100 - raisedPct, Math.max(0.75, (give / CHARITY.goal) * 100));
  const sliderPct = ((job - MIN_JOB) / (MAX_JOB - MIN_JOB)) * 100;
  // Near the left edge a centered label would hang off the bar.
  const labelAlign = raisedPct < 15 ? "left-0" : raisedPct > 85 ? "right-0" : "left-1/2 -translate-x-1/2";

  return (
    <div className="rounded-3xl border border-white/10 bg-charcoal-900 p-5 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-charcoal-400">
            Donated so far
          </div>
          <div className="mt-1 font-display text-4xl font-extrabold text-gold-400 sm:text-5xl">
            {dollars(CHARITY.donated)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-widest text-charcoal-400">
            Our goal
          </div>
          <div className="mt-1 font-display text-2xl font-extrabold text-white sm:text-3xl">
            {dollars(CHARITY.goal)}
          </div>
        </div>
      </div>

      {/* Goal bar with the "we are here" marker */}
      <div className="relative mt-20">
        <div className="absolute bottom-full mb-1" style={{ left: `${raisedPct}%` }}>
          <div className={`absolute bottom-10 whitespace-nowrap ${labelAlign}`}>
            <span className="rounded-full bg-gold-400 px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wider text-charcoal-900 shadow-gold">
              We are here
            </span>
          </div>
          <svg
            viewBox="0 0 24 40"
            className="h-10 w-6 -translate-x-1/2 text-gold-400 motion-safe:animate-bounce"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9 0h6v26h7L12 40 2 26h7z" />
          </svg>
        </div>
        <div
          className="relative h-6 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={CHARITY.goal}
          aria-valuenow={CHARITY.donated}
          aria-label={`${dollars(CHARITY.donated)} donated of a ${dollars(CHARITY.goal)} goal`}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold-500 to-gold-300"
            style={{ width: `${raisedPct}%` }}
          />
          <div
            className="absolute inset-y-0 rounded-r-full bg-gold-200/50 transition-[width] duration-300 motion-safe:animate-pulse"
            style={{ left: `${raisedPct}%`, width: `${yoursPct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-charcoal-400">
          <span>{dollars(0)}</span>
          <span>{Math.round(raisedPct * 10) / 10}% of the way there</span>
          <span>{dollars(CHARITY.goal)}</span>
        </div>
      </div>

      {/* Your job */}
      <div className="mt-10 rounded-2xl border border-gold-300/30 bg-gold-400/5 p-5 sm:p-6">
        <label htmlFor="job-slider" className="text-sm font-semibold text-white">
          Drag to your job&apos;s price
        </label>
        <div className="mt-1 font-display text-3xl font-extrabold text-white">
          {dollars(job)} job
        </div>
        <input
          id="job-slider"
          type="range"
          min={MIN_JOB}
          max={MAX_JOB}
          step={10}
          value={job}
          onChange={(e) => setJob(Number(e.target.value))}
          className="donation-slider mt-4 w-full"
          style={{ "--fill": `${sliderPct}%` }}
        />
        <div className="mt-1 flex justify-between text-xs text-charcoal-500">
          <span>{dollars(MIN_JOB)}</span>
          <span>{dollars(MAX_JOB)}</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-charcoal-950/60 p-4">
            <div className="text-xs uppercase tracking-widest text-charcoal-400">
              {CHARITY.percent}% donated
            </div>
            <div className="mt-1 whitespace-nowrap font-display text-xl font-extrabold text-gold-400 tabular-nums sm:text-2xl">
              {dollars(give)}
            </div>
          </div>
          <div className="rounded-xl bg-charcoal-950/60 p-4">
            <div className="text-xs uppercase tracking-widest text-charcoal-400">
              Meals provided
            </div>
            <div className="mt-1 whitespace-nowrap font-display text-xl font-extrabold text-white tabular-nums sm:text-2xl">
              ~{meals}
            </div>
          </div>
        </div>

        <div className="mt-5 flex min-h-[3rem] flex-wrap gap-1" aria-hidden="true">
          {Array.from({ length: bowls }, (_, i) => (
            <svg
              key={i}
              viewBox="0 0 24 24"
              className="h-5 w-5 text-gold-400 motion-safe:animate-pop"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12h18a9 9 0 0 1-18 0Z" fill="currentColor" fillOpacity="0.25" />
              <path d="M9 8c0-1 1-1 1-2s-1-1-1-2M14 8c0-1 1-1 1-2s-1-1-1-2" />
            </svg>
          ))}
        </div>
        <p className="mt-3 text-xs text-charcoal-400">
          Every bowl is 2 meals, and every ${CHARITY.jobDollarsPerMeal} of your job counts
          as one. That&apos;s on the low side of {CHARITY.name}&apos;s own estimate of{" "}
          {CHARITY.mealsPerDollar} meals per $1 donated. It comes out of our cut, so your
          price doesn&apos;t go up.
        </p>
      </div>
    </div>
  );
}
