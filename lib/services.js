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
    price: ({ surface, size }) => {
      const matrix = {
        driveway: {
          small: [284.19, 324.19],
          medium: [404.19, 484.19],
          large: [564.19, 804.99],
        },
        sidewalk: {
          small: [550, 650],
          medium: [700, 850],
          large: [950, 1800],
        },
        fence: {
          small: [279, 349],
          medium: [399, 449],
          large: [549, 749],
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
      "Trained, uniformed crews",
    ],
    questions: [
      {
        id: "type",
        label: "What kind of commercial cleaning?",
        type: "select",
        options: [
          { value: "flatwork", label: "Flatwork / Parking" },
          { value: "softwash", label: "Building soft wash" },
          { value: "school", label: "School plazas" },
        ],
      },
      {
        id: "sqft",
        label: "Approximate square footage",
        type: "radio",
        options: [
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
          { value: "xl", label: "XL / Estate" },
        ],
      },
    ],
    price: ({ type, sqft }) => {
      const matrix = {
        flatwork: {
          small:  [549,  749],
          medium: [799,  1749],
          large:  [1799, 3299],
          xl:     [3299, 6500],
        },
        softwash: {
          small:  [799,  1199],
          medium: [1299, 2699],
          large:  [2799, 5499],
          xl:     [5599, 9500],
        },
        school: {
          small:  [649,  999],
          medium: [1049, 2499],
          large:  [2549, 4499],
          xl:     [4549, 7500],
        },
      };
      if (!type || !sqft) return [0, 0];
      return matrix[type]?.[sqft] || [0, 0];
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
        ],
      },
    ],
    price: ({ size }) => {
      const tiers = {
        small: [65, 95],
        medium: [120, 230],
        large: [230, 500],
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
          { value: "starter", label: "Starter Eaves" },
          { value: "basic", label: "Basic Eaves Package" },
          { value: "custom", label: "Custom / Estate Package" },
        ],
      },
    ],
    price: ({ tier }) => {
      const tiers = {
        starter: [449, 599],
        basic:   [849, 1049],
        custom:  [1799, 3499],
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
        one:   [189, 269],
        two:   [329, 479],
        three: [599, 899],
      };
      return tiers[stories] || [0, 0];
    },
  },

  {
    id: "detailing",
    name: "Detailing",
    tagline: "Showroom finish — car or boat.",
    blurb:
      "Hand wash, vacuum, interior wipe-down and exterior shine for cars, trucks and SUVs. Boat detailing priced by length, hull to bow.",
    icon: "car",
    sub: ["Car & truck detailing", "Boat detailing"],
    bullets: [
      "Hand wash & dry",
      "Standard or Pro packages",
      "Boat detailing priced by length",
    ],
    questions: [
      {
        id: "vehicle",
        label: "What are we detailing?",
        type: "radio",
        options: [
          { value: "car", label: "Car, Truck or SUV" },
          { value: "boat", label: "Boat" },
        ],
      },
      {
        id: "package",
        label: "Which detail package?",
        type: "radio",
        showIf: (a) => a.vehicle === "car",
        options: [
          { value: "standard", label: "Base ($139)" },
          { value: "pro", label: "Pro ($189)" },
        ],
      },
      {
        id: "length",
        label: "Boat length",
        type: "radio",
        showIf: (a) => a.vehicle === "boat",
        options: [
          { value: "under20", label: "Under 20 ft" },
          { value: "twenty_thirty", label: "20 – 30 ft" },
          { value: "thirty_forty", label: "30 – 40 ft" },
          { value: "forty_plus", label: "40+ ft" },
        ],
      },
    ],
    price: ({ vehicle, package: pkg, length }) => {
      if (vehicle === "car") {
        const tiers = {
          standard: [139, 139],
          pro: [189, 189],
        };
        return tiers[pkg] || [0, 0];
      }
      if (vehicle === "boat") {
        // Priced by length at roughly $16–24/ft, which is how marinas quote
        // detailing jobs since customers rarely know exact hull square footage.
        const tiers = {
          under20: [279, 379],
          twenty_thirty: [449, 649],
          thirty_forty: [699, 999],
          forty_plus: [1099, 1599],
        };
        return tiers[length] || [0, 0];
      }
      return [0, 0];
    },
  },
];

// Bundle discount: once a quote's midpoint estimate clears the threshold,
// customers get a modest break for consolidating work with one crew instead
// of hiring multiple contractors. Applied on top of the calculated total.
export const BUNDLE_DISCOUNT_THRESHOLD = 600;
export const BUNDLE_DISCOUNT_RATE = 0.1;

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

  // Bundle discount rewards consolidating work with one crew instead of
  // hiring separately — applied once the midpoint clears the threshold.
  const midpoint = (low + high) / 2;
  const discounted = midpoint >= BUNDLE_DISCOUNT_THRESHOLD && midpoint > 0;
  if (discounted) {
    low = low * (1 - BUNDLE_DISCOUNT_RATE);
    high = high * (1 - BUNDLE_DISCOUNT_RATE);
  }

  return {
    low: Math.round(low),
    high: Math.round(high),
    breakdown,
    discountApplied: discounted,
    discountRate: BUNDLE_DISCOUNT_RATE,
  };
}

export function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
