// Giveaway and charity pledge. Every page that mentions either reads from
// here, so changing a date or the prize value is a one-line edit.

export const GIVEAWAY = {
  // The winner picks one: a free job, or cash at 75% of the job value. Cash
  // costs us real money, a job mostly costs time, so cash is worth less.
  prizeValue: 300,
  cashValue: 225,
  headline: "Win a $300 job or $225 cash",
  // A 60-day run, counted down on the site. Entries close and the winner is
  // drawn when it hits zero, and the banner hides itself then.
  endsAt: "2026-12-10T23:59:59-08:00",
  endsLabel: "December 10, 2026",
  redeemByLabel: "March 31, 2027",
};

export function giveawayOpen(now = new Date()) {
  return now <= new Date(GIVEAWAY.endsAt);
}

export const CHARITY = {
  percent: 5,
  // The local food bank. Clearing the name falls back to plain "charity".
  name: "Second Harvest of Silicon Valley",
  url: "https://www.shfb.org",
};

export function charityLine() {
  return `${CHARITY.percent}% of every job goes to ${CHARITY.name || "charity"}.`;
}
