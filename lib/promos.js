// Giveaway and charity pledge. Every page that mentions either reads from
// here, so changing a date or the prize value is a one-line edit.

export const GIVEAWAY = {
  // A free job, not cash: a $300 job costs us far less than $300 to do, and a
  // cash prize is just money out the door.
  prizeValue: 300,
  headline: "Win a free job — up to $300",
  // Dates are inclusive and in Pacific time. The banner hides itself once
  // `endsAt` passes, so nothing needs to be taken down by hand.
  endsAt: "2026-11-30T23:59:59-08:00",
  endsLabel: "November 30, 2026",
  drawingLabel: "December 1, 2026",
  redeemByLabel: "March 31, 2027",
};

export function giveawayOpen(now = new Date()) {
  return now <= new Date(GIVEAWAY.endsAt);
}

export const CHARITY = {
  percent: 5,
  // The local food bank. Clearing the name falls back to plain "charity".
  name: "Second Harvest of Silicon Valley",
};

export function charityLine() {
  return `${CHARITY.percent}% of every job goes to ${CHARITY.name || "charity"}.`;
}
