// Single source of truth for service data + pricing logic.
// Used by the Services page, the Home page, and the Estimate Calculator.

export const SERVICES = [
  {
    id: "pressure-washing",
    name: "Pressure Washing",
    tagline: "Restore curb appeal in a single visit.",
    blurb:
      "Soft and high-pressure washing that lifts dirt, mildew, oil and algae from the surfaces around your home.",
    icon: "spray",
    sub: ["Driveways & walkways", "Siding & exterior walls", "Decks & patios"],
    bullets: [
      "Eco-friendly, surface-safe detergents",
      "Commercial-grade hot/cold water units",
      "Trained, insured technicians",
    ],
    // Question definitions for the quote form
    questions: [
      {
        id: "surface",
        label: "Which surface needs cleaning?",
        type: "select",
        options: [
          { value: "driveway", label: "Driveway / walkway" },
          { value: "siding", label: "Siding / exterior walls" },
          { value: "deck", label: "Deck / patio" },
        ],
      },
      {
        id: "size",
        label: "Approximate area size",
        type: "radio",
        options: [
          { value: "small", label: "Small (under 500 sq ft)" },
          { value: "medium", label: "Medium (500 – 1,500 sq ft)" },
          { value: "large", label: "Large (1,500+ sq ft)" },
        ],
      },
    ],
    // Pricing returns [low, high] in dollars
    price: ({ size }) => {
      const tiers = {
        small: [120, 220],
        medium: [220, 400],
        large: [400, 750],
      };
      return tiers[size] || tiers.small;
    },
  },
  {
    id: "pool-cleaning",
    name: "Pool Cleaning",
    tagline: "Crystal-clear water, every visit.",
    blurb:
      "Skimming, brushing, vacuuming, water testing and chemical balancing for in-ground and above-ground pools.",
    icon: "droplet",
    bullets: [
      "Full chemical balancing",
      "Filter & pump inspection",
      "Weekly, bi-weekly, or one-time visits",
    ],
    questions: [
      {
        id: "poolType",
        label: "What type of pool is it?",
        type: "radio",
        options: [
          { value: "in-ground", label: "In-ground" },
          { value: "above-ground", label: "Above-ground" },
        ],
      },
      {
        id: "size",
        label: "How large is the pool?",
        type: "radio",
        options: [
          { value: "small", label: "Small (under 10,000 gal)" },
          { value: "medium", label: "Medium (10,000 – 20,000 gal)" },
          { value: "large", label: "Large (20,000+ gal)" },
        ],
      },
    ],
    price: ({ size, poolType }) => {
      const tiers = {
        small: [95, 160],
        medium: [160, 250],
        large: [250, 400],
      };
      const base = tiers[size] || tiers.small;
      // In-ground pools generally cost a touch more.
      const bump = poolType === "in-ground" ? 25 : 0;
      return [base[0] + bump, base[1] + bump];
    },
  },
  {
    id: "junk-removal",
    name: "Junk Removal",
    tagline: "We haul it. You relax.",
    blurb:
      "Fast, no-mess removal of furniture, appliances, yard waste, construction debris and full clean-outs.",
    icon: "truck",
    bullets: [
      "Single item to full truck loads",
      "Same- or next-day pickups",
      "Donation-first disposal where possible",
    ],
    questions: [
      {
        id: "size",
        label: "Roughly how much junk?",
        type: "radio",
        options: [
          { value: "single", label: "Single item" },
          { value: "quarter", label: "Quarter truck" },
          { value: "half", label: "Half truck" },
          { value: "full", label: "Full truck" },
        ],
      },
    ],
    price: ({ size }) => {
      const tiers = {
        single: [75, 150],
        quarter: [150, 275],
        half: [275, 450],
        full: [450, 700],
      };
      return tiers[size] || tiers.single;
    },
  },
  {
    id: "holiday-lights",
    name: "Holiday Lights Installation",
    tagline: "The brightest house on the block.",
    blurb:
      "Custom-fit installation, take-down and storage of professional-grade holiday lighting for roofs, trees and landscapes.",
    icon: "sparkles",
    bullets: [
      "Commercial-grade LED bulbs",
      "Design consultation included",
      "Take-down & storage at season end",
    ],
    questions: [
      {
        id: "homeSize",
        label: "What size home are we lighting?",
        type: "radio",
        options: [
          { value: "small", label: "Small (1 story / under 1,500 sq ft)" },
          { value: "medium", label: "Medium (2 story / 1,500 – 3,000 sq ft)" },
          { value: "large", label: "Large (3,000+ sq ft or extensive landscape)" },
        ],
      },
      {
        id: "scope",
        label: "What should we light up?",
        type: "checkbox",
        options: [
          { value: "roofline", label: "Roofline" },
          { value: "trees", label: "Trees & shrubs" },
          { value: "landscape", label: "Walkways & landscape" },
        ],
      },
    ],
    price: ({ homeSize, scope }) => {
      const base = {
        small: [350, 650],
        medium: [650, 1100],
        large: [1100, 1800],
      }[homeSize] || [350, 650];
      const extras = Array.isArray(scope) ? scope.length : 0;
      const bump = extras * 75;
      return [base[0] + bump, base[1] + bump * 1.5];
    },
  },
  {
    id: "gutter-cleaning",
    name: "Gutter Cleaning",
    tagline: "Protect your home from the top down.",
    blurb:
      "Hand-clearing of leaves and debris, downspout flushing, and a full inspection of your gutter system.",
    icon: "leaf",
    bullets: [
      "Hand-cleared, never just blown out",
      "Free downspout flush included",
      "Photo report after every job",
    ],
    questions: [
      {
        id: "stories",
        label: "How many stories is the home?",
        type: "radio",
        options: [
          { value: "one", label: "Single story" },
          { value: "two", label: "Two story" },
          { value: "threeplus", label: "Three+ story" },
        ],
      },
      {
        id: "size",
        label: "Approximate linear footage",
        type: "radio",
        options: [
          { value: "small", label: "Small (under 100 ft)" },
          { value: "medium", label: "Medium (100 – 200 ft)" },
          { value: "large", label: "Large (200+ ft)" },
        ],
      },
    ],
    price: ({ stories, size }) => {
      const base = {
        small: [125, 200],
        medium: [200, 325],
        large: [325, 500],
      }[size] || [125, 200];
      const storyMultiplier =
        stories === "two" ? 1.25 : stories === "threeplus" ? 1.55 : 1;
      return [
        Math.round(base[0] * storyMultiplier),
        Math.round(base[1] * storyMultiplier),
      ];
    },
  },
];

export function getService(id) {
  return SERVICES.find((s) => s.id === id);
}

// Aggregate price across multiple services + their answer state
export function calculateTotal(selections) {
  // selections: { [serviceId]: answers }
  let low = 0;
  let high = 0;
  const breakdown = [];
  for (const [serviceId, answers] of Object.entries(selections)) {
    const service = getService(serviceId);
    if (!service) continue;
    const [l, h] = service.price(answers || {});
    low += l;
    high += h;
    breakdown.push({ service: service.name, low: l, high: h });
  }
  return { low: Math.round(low), high: Math.round(high), breakdown };
}

export function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
