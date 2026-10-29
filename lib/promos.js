// Giveaway and charity pledge. Every page that mentions either reads from
// here, so changing a date or the prize value is a one-line edit.

export const GIVEAWAY = {
  prizeValue: 300,
  headline: "Win a free $300 job",
  // Counted down on the site. Entries close and the winner is drawn when it
  // hits zero, and the banner hides itself then.
  endsAt: "2026-12-14T23:59:59-08:00",
  endsLabel: "December 14, 2026",
  redeemByLabel: "March 31, 2027",
};

export function giveawayOpen(now = new Date()) {
  return now <= new Date(GIVEAWAY.endsAt);
}

export const CHARITY = {
  percent: 6.5,
  // The local food bank. Clearing the name falls back to plain "charity".
  name: "Second Harvest of Silicon Valley",
  url: "https://www.shfb.org",
  // What we've actually given so far. Only raise this once a donation has
  // gone through and there's a receipt for it — the site shows it publicly.
  donated: 375,
  goal: 10000,
  // Second Harvest's own figure: every $1 provides about two meals.
  mealsPerDollar: 2,
};

export function charityLine() {
  return `${CHARITY.percent}% of every job goes to ${CHARITY.name || "charity"}.`;
}
