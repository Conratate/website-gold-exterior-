// Single source of truth for service data + pricing logic.
// Used by the Services page, the Home page, and the Estimate Calculator.

export const SERVICES = [
  {
    id: "pressure-washing",
    name: "Pressure Washing",
    tagline: "Restore curb appeal in a single visit.",
    blurb:
      "Concrete driveways, commercial sidewalks, and full fence restoration. Soft- and high-pressure washing for residential & commercial.",
    icon: "spray",
    sub: ["Concrete driveways", "Commercial sidewalks", "Fence restoration"],
    bullets: [
      "Driveways, sidewalks & fences",
      "Residential & commercial",
      "Eco-friendly, surface-safe cleaning",
    ],
    questions: [
      {
        id: "surface",
        label: "What needs cleaning?",
        type: "select",
        options: [
          { value: "driveway", label: "Concrete driveway" },
          { value: "sidewalk", label: "Commercial sidewalk" },
          { value: "fence", label: "Fence restoration" },
        ],
      },
      {
        id: "size",
        label: "Approximate size",
        type: "radio",
        options: [
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
      },
    ],
    // Pricing per the latest Gold Exterior price chart.
    price: ({ surface, size }) => {
      const matrix = {
        driveway: {
          small: [349, 349],   // 2-Car
          medium: [499, 499],  // 4-Car
          large: [699, 799],   // Long / Estate
        },
        sidewalk: {
          small: [650, 650],   // Standard Front
          medium: [700, 700],  // Corner Lot
          large: [950, 1200],  // Full Plaza
        },
        fence: {
          small: [329, 329],   // Short Span
          medium: [429, 429],  // Standard Yard
          large: [529, 529],   // Perimeter
        },
      };
      if (!surface || !size) return [0, 0];
      return matrix[surface][size];
    },
  },

  {
    id: "commercial-cleaning",
    name: "Commercial Cleaning",
    tagline: "High-volume exterior cleaning, by the square foot.",
    blurb:
      "Commercial flatwork, building soft-wash, parking garages and school plazas. Volume pricing for large-scale jobs.",
    icon: "building",
    sub: [
      "Commercial flatwork",
      "Building soft wash",
      "Parking garages",
      "School plazas",
    ],
    bullets: [
      "Per-sq-ft volume pricing",
      "Commercial-grade equipment",
      "Insured & bonded crews",
    ],
    questions: [
      {
        id: "type",
        label: "What kind of commercial cleaning?",
        type: "select",
        options: [
          { value: "flatwork", label: "Commercial flatwork (gum / grease)" },
          { value: "softwash", label: "Building soft wash" },
          { value: "garage", label: "Parking garages" },
          { value: "school", label: "School plazas" },
        ],
      },
      {
        id: "sqft",
        label: "Approximate square footage",
        type: "radio",
        options: [
          { value: "small", label: "Under 5,000 sq ft" },
          { value: "medium", label: "5,000 – 15,000 sq ft" },
          { value: "large", label: "15,000+ sq ft" },
        ],
      },
    ],
    // Per-sq-ft rates × representative footprint for the chosen tier.
    price: ({ type, sqft }) => {
      const rates = {
        flatwork: [0.95, 0.95],
        softwash: [0.95, 1.15],
        garage: [0.65, 0.80],
        school: [0.58, 1.00],
      };
      const area = { small: 3000, medium: 10000, large: 22000 };
      if (!type || !sqft) return [0, 0];
      const [low, high] = rates[type];
      const a = area[sqft];
      return [Math.round(low * a), Math.round(high * a)];
    },
  },

  {
    id: "graffiti-removal",
    name: "Graffiti Removal",
    tagline: "Vandalism gone — without a trace.",
    blurb:
      "Tag removal on brick, concrete, stucco, and commercial walls. From single tags to large-scale vandalism cleanups.",
    icon: "shield",
    bullets: [
      "Non-porous & porous surfaces",
      "Brick, concrete & stucco",
      "Same-week response",
    ],
    questions: [
      {
        id: "size",
        label: "How big is the affected area?",
        type: "radio",
        options: [
          { value: "small", label: "Small — single tag, up to 5 sq ft" },
          { value: "medium", label: "Medium — up to 20 sq ft" },
          { value: "large", label: "Large — 20–50 sq ft (commercial)" },
          { value: "xlarge", label: "Extra Large — 50–100 sq ft" },
        ],
      },
    ],
    price: ({ size }) => {
      const tiers = {
        small: [299, 299],
        medium: [550, 550],
        large: [850, 850],
        xlarge: [999, 1500],
      };
      return tiers[size] || [0, 0];
    },
  },

  {
    id: "holiday-lights",
    name: "Holiday Lights Installation",
    tagline: "The brightest house on the block.",
    blurb:
      "Custom-fit installation, take-down, and storage of professional-grade holiday lighting for roofs, trees and landscapes.",
    icon: "sparkles",
    bullets: [
      "Commercial-grade LED bulbs",
      "Design consultation included",
      "Take-down & storage at season end",
    ],
    questions: [
      {
        id: "tier",
        label: "Which package fits your home?",
        type: "radio",
        options: [
          { value: "basic", label: "Basic Eaves" },
          { value: "custom", label: "Custom / Estate" },
          { value: "luxury", label: "Full Luxury" },
        ],
      },
    ],
    price: ({ tier }) => {
      const tiers = {
        basic: [999, 999],
        custom: [1900, 1900],
        luxury: [3500, 5000],
      };
      return tiers[tier] || [0, 0];
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
          { value: "one", label: "1-story" },
          { value: "two", label: "2-story" },
          { value: "three", label: "3-story / large" },
        ],
      },
    ],
    price: ({ stories }) => {
      const tiers = {
        one: [199, 199],
        two: [350, 350],
        three: [550, 800],
      };
      return tiers[stories] || [0, 0];
    },
  },

  {
    id: "car-detailing",
    name: "Car Detailing",
    tagline: "Showroom finish, in your driveway.",
    blurb:
      "Hand wash, vacuum, interior wipe-down and exterior shine. Standard or Pro packages for any vehicle.",
    icon: "car",
    bullets: [
      "Hand wash & dry",
      "Vacuum & interior wipe-down",
      "Standard or Pro detail",
    ],
    questions: [
      {
        id: "tier",
        label: "Which detail package?",
        type: "radio",
        options: [
          { value: "standard", label: "Standard ($99)" },
          { value: "pro", label: "Pro ($129 – $149)" },
        ],
      },
    ],
    price: ({ tier }) => {
      const tiers = {
        standard: [99, 99],
        pro: [129, 149],
      };
      return tiers[tier] || [0, 0];
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
