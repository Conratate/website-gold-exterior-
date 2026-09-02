// Single source of truth for service data + pricing logic.
// Used by the Services page, the Home page, and the Estimate Calculator.
//
// Pricing note: tiers are spaced so no boundary crossing costs more than
// roughly 1.7x the tier below it. A customer who lands just over a line
// should never feel punished for measuring honestly.

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
        ladder: true,
        options: [
          { value: "xs", label: "Extra small" },
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
        optionHints: (a) => {
          const bySurface = {
            driveway: {
              xs: "Up to ~300 sq ft — single-car pad or small apron",
              small: "~300–600 sq ft — a 1–2 car driveway",
              medium: "~600–1,200 sq ft — 3-car or extended driveway",
              large: "1,200+ sq ft — estate drive, RV pad or courtyard",
            },
            sidewalk: {
              xs: "Up to ~600 sq ft — a short entry walk",
              small: "~600–1,500 sq ft — single storefront",
              medium: "~1,500–3,500 sq ft — full frontage",
              large: "3,500+ sq ft — full block or plaza",
            },
            fence: {
              xs: "Up to ~50 linear ft — a single gate run",
              small: "~50–100 linear ft — a typical side yard",
              medium: "~100–200 linear ft — full backyard perimeter",
              large: "200+ linear ft — corner lot or acreage",
            },
          };
          return bySurface[a.surface] || null;
        },
        sizer: (a) => {
          if (!a.surface) return null;
          if (a.surface === "fence") {
            return {
              mode: "linear",
              prompt: "Walk the fence line and estimate its total length.",
              tiers: [
                { value: "xs", max: 50 },
                { value: "small", max: 100 },
                { value: "medium", max: 200 },
                { value: "large", max: Infinity },
              ],
            };
          }
          const tiers =
            a.surface === "driveway"
              ? [
                  { value: "xs", max: 300 },
                  { value: "small", max: 600 },
                  { value: "medium", max: 1200 },
                  { value: "large", max: Infinity },
                ]
              : [
                  { value: "xs", max: 600 },
                  { value: "small", max: 1500 },
                  { value: "medium", max: 3500 },
                  { value: "large", max: Infinity },
                ];
          return {
            mode: "area",
            prompt: "Pace off the length and width — one big step is about 3 feet.",
            tiers,
          };
        },
      },
    ],
    sizingGuide: {
      columns: ["Driveway", "Sidewalk", "Fence"],
      rows: [
        {
          tier: "Extra small",
          cells: ["Up to ~300 sq ft", "Up to ~600 sq ft", "Up to ~50 linear ft"],
        },
        {
          tier: "Small",
          cells: ["~300–600 sq ft", "~600–1,500 sq ft", "~50–100 linear ft"],
        },
        {
          tier: "Medium",
          cells: ["~600–1,200 sq ft", "~1,500–3,500 sq ft", "~100–200 linear ft"],
        },
        {
          tier: "Large",
          cells: ["1,200+ sq ft", "3,500+ sq ft", "200+ linear ft"],
        },
      ],
    },
    price: ({ surface, size }) => {
      const matrix = {
        driveway: {
          xs:     [119, 159],
          small:  [199, 269],
          medium: [329, 439],
          large:  [549, 739],
        },
        sidewalk: {
          xs:     [199,  269],
          small:  [379,  519],
          medium: [699,  939],
          large:  [1019, 1379],
        },
        fence: {
          xs:     [149, 199],
          small:  [239, 319],
          medium: [389, 529],
          large:  [519, 699],
        },
      };
      if (!surface || !size) return [0, 0];
      return matrix[surface]?.[size] || [0, 0];
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
        ladder: true,
        options: [
          { value: "spot", label: "Spot clean" },
          { value: "xs", label: "Extra small" },
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
          { value: "xl", label: "XL / Estate" },
        ],
        optionHints: () => ({
          spot: "Up to ~400 sq ft — one entry, dumpster pad or single stain",
          xs: "~400–1,000 sq ft — small patio or walkway",
          small: "~1,000–2,500 sq ft — small storefront frontage",
          medium: "~2,500–6,000 sq ft — restaurant patio, mid-size lot",
          large: "~6,000–12,000 sq ft — full lot or building face",
          xl: "12,000+ sq ft — garage decks, campuses, plazas",
        }),
        sizer: () => ({
          mode: "area",
          prompt:
            "A rough length × width is all we need — we confirm exact footage on site.",
          tiers: [
            { value: "spot", max: 400 },
            { value: "xs", max: 1000 },
            { value: "small", max: 2500 },
            { value: "medium", max: 6000 },
            { value: "large", max: 12000 },
            { value: "xl", max: Infinity },
          ],
        }),
      },
    ],
    sizingGuide: {
      columns: ["Approximate area"],
      rows: [
        { tier: "Spot clean", cells: ["Up to ~400 sq ft"] },
        { tier: "Extra small", cells: ["~400–1,000 sq ft"] },
        { tier: "Small", cells: ["~1,000–2,500 sq ft"] },
        { tier: "Medium", cells: ["~2,500–6,000 sq ft"] },
        { tier: "Large", cells: ["~6,000–12,000 sq ft"] },
        { tier: "XL / Estate", cells: ["12,000+ sq ft"] },
      ],
    },
    price: ({ type, sqft }) => {
      const matrix = {
        flatwork: {
          spot:   [149,  199],
          xs:     [289,  389],
          small:  [549,  739],
          medium: [1019, 1379],
          large:  [1669, 2259],
          xl:     [2399, 3239],
        },
        softwash: {
          spot:   [229,  309],
          xs:     [439,  599],
          small:  [849,  1149],
          medium: [1579, 2139],
          large:  [2589, 3499],
          xl:     [3719, 5029],
        },
        school: {
          spot:   [169,  229],
          xs:     [329,  439],
          small:  [629,  849],
          medium: [1169, 1589],
          large:  [1919, 2599],
          xl:     [2759, 3729],
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
        ladder: true,
        options: [
          { value: "xs", label: "Extra small" },
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
        optionHints: () => ({
          xs: "Up to ~2 sq ft — a sticker or small marker tag",
          small: "~2–8 sq ft — a single spray tag",
          medium: "~8–20 sq ft — multiple tags or one large piece",
          large: "20–50 sq ft — commercial-scale vandalism",
        }),
        sizer: () => ({
          mode: "area",
          prompt: "Measure the tagged area — height × width in feet.",
          tiers: [
            { value: "xs", max: 2 },
            { value: "small", max: 8 },
            { value: "medium", max: 20 },
            { value: "large", max: Infinity },
          ],
        }),
      },
    ],
    sizingGuide: {
      columns: ["Affected area"],
      rows: [
        { tier: "Extra small", cells: ["Up to ~2 sq ft — sticker or marker tag"] },
        { tier: "Small", cells: ["~2–8 sq ft — a single spray tag"] },
        { tier: "Medium", cells: ["~8–20 sq ft — multiple tags"] },
        { tier: "Large", cells: ["20–50 sq ft — commercial scale"] },
      ],
    },
    price: ({ size }) => {
      const tiers = {
        xs:     [59,  69],
        small:  [109, 129],
        medium: [179, 209],
        large:  [319, 379],
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
        ladder: true,
        options: [
          { value: "accent", label: "Accent" },
          { value: "starter", label: "Starter Eaves" },
          { value: "basic", label: "Basic Eaves Package" },
          { value: "premium", label: "Premium Package" },
          { value: "custom", label: "Custom / Estate Package" },
        ],
        optionHints: () => ({
          accent: "One tree or entryway — a single accent feature",
          starter: "Front eaves only — the main roofline",
          basic: "Full front elevation plus walkway",
          premium: "Wraparound eaves, trees and landscape lighting",
          custom: "Whole-property design, multi-story and specialty features",
        }),
      },
    ],
    price: ({ tier }) => {
      const tiers = {
        accent:  [249,  289],
        starter: [389,  459],
        basic:   [699,  819],
        premium: [1159, 1359],
        custom:  [1939, 2259],
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
        ladder: true,
        options: [
          { value: "partial", label: "Partial / small run" },
          { value: "one", label: "1-story" },
          { value: "two", label: "2-story" },
          { value: "three", label: "3-story / large" },
        ],
        optionHints: () => ({
          partial: "A single run or one section — not the whole home",
          one: "Full perimeter, single-story home",
          two: "Full perimeter, two-story home",
          three: "Three stories, or a large/complex roofline",
        }),
      },
    ],
    price: ({ stories }) => {
      const tiers = {
        partial: [99,  119],
        one:     [149, 179],
        two:     [239, 289],
        three:   [379, 449],
      };
      return tiers[stories] || [0, 0];
    },
  },

  {
    id: "detailing",
    name: "Car Detailing",
    tagline: "Showroom finish, in your driveway.",
    blurb:
      "Hand wash, vacuum, interior wipe-down and exterior shine for cars, trucks and SUVs. Three packages, from a quick exterior wash to a full detail.",
    icon: "car",
    sub: ["Cars, trucks & SUVs", "Interior & exterior"],
    bullets: [
      "Hand wash & dry",
      "Express, Base or Pro packages",
      "We come to you — no drop-off",
    ],
    questions: [
      {
        id: "package",
        label: "Which detail package?",
        type: "radio",
        ladder: true,
        options: [
          { value: "express", label: "Express" },
          { value: "standard", label: "Base" },
          { value: "pro", label: "Pro" },
        ],
        optionHints: () => ({
          express: "Exterior hand wash & dry only",
          standard: "Wash, vacuum and interior wipe-down",
          pro: "Full detail — clay, wax and interior deep clean",
        }),
      },
    ],
    price: ({ package: pkg }) => {
      const tiers = {
        express:  [99,  99],
        standard: [149, 149],
        pro:      [229, 229],
      };
      return tiers[pkg] || [0, 0];
    },
  },

  {
    id: "weed-removal",
    name: "Weed & Debris Removal",
    tagline: "Reclaim the hardscape hiding under the overgrowth.",
    blurb:
      "Weeds pulled out of paver, brick and concrete joints, leaves and debris cleared, and the green waste hauled away. The surface underneath is usually in far better shape than it looks.",
    icon: "sprout",
    sub: ["Paver & brick joints", "Leaf & debris clearing", "Green-waste haul-away"],
    bullets: [
      "Pulled at the root, not just strimmed back",
      "Joints swept clean and re-sanded on request",
      "All green waste hauled away, nothing left in bags",
    ],
    questions: [
      {
        id: "size",
        label: "How much area is affected?",
        type: "radio",
        ladder: true,
        options: [
          { value: "xs", label: "Extra small" },
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
        optionHints: () => ({
          xs: "Up to ~150 sq ft — a short path or one bed edge",
          small: "~150–400 sq ft — a walkway or driveway strip",
          medium: "~400–1,000 sq ft — a full driveway apron or patio",
          large: "1,000+ sq ft — a courtyard or whole frontage",
        }),
        sizer: () => ({
          mode: "area",
          prompt: "Pace off the overgrown area — one big step is about 3 feet.",
          tiers: [
            { value: "xs", max: 150 },
            { value: "small", max: 400 },
            { value: "medium", max: 1000 },
            { value: "large", max: Infinity },
          ],
        }),
      },
      {
        id: "growth",
        label: "How far gone is it?",
        type: "radio",
        options: [
          { value: "light", label: "Light — a few weeds coming through" },
          { value: "moderate", label: "Moderate — established, joints filling in" },
          { value: "heavy", label: "Heavy — surface barely visible" },
        ],
        optionHints: () => ({
          light: "Recently tidied, just starting to come back",
          moderate: "A season or two of growth with real roots",
          heavy: "Fully overgrown — pavers hidden under weeds and litter",
        }),
      },
    ],
    sizingGuide: {
      columns: ["Affected area"],
      rows: [
        { tier: "Extra small", cells: ["Up to ~150 sq ft"] },
        { tier: "Small", cells: ["~150–400 sq ft"] },
        { tier: "Medium", cells: ["~400–1,000 sq ft"] },
        { tier: "Large", cells: ["1,000+ sq ft"] },
      ],
    },
    // Hand-pulling joints is slow work, so this sits well above the rate for
    // simply washing the same square footage — and how overgrown it is drives
    // the hours more than the area does.
    price: ({ size, growth }) => {
      const matrix = {
        light: {
          xs:     [129, 179],
          small:  [239, 319],
          medium: [459, 619],
          large:  [879, 1189],
        },
        moderate: {
          xs:     [179, 239],
          small:  [329, 439],
          medium: [629, 849],
          large:  [1209, 1629],
        },
        heavy: {
          xs:     [239, 329],
          small:  [449, 609],
          medium: [859, 1159],
          large:  [1639, 2219],
        },
      };
      if (!size || !growth) return [0, 0];
      return matrix[growth]?.[size] || [0, 0];
    },
  },
];

// Bundle discount: once a quote's midpoint estimate clears the threshold,
// customers get a modest break for consolidating work with one crew instead
// of hiring multiple contractors. Applied on top of the calculated total.
export const BUNDLE_DISCOUNT_THRESHOLD = 600;
export const BUNDLE_DISCOUNT_RATE = 0.1;

// Mobilization costs the same whether a job is $109 or $900. Below this
// figure a dedicated trip doesn't pay for itself, so those jobs get routed
// alongside other work in the area rather than scheduled on demand.
export const ROUTING_MINIMUM = 149;

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

  // A single large job can clear the threshold on its own, so name the
  // discount for what actually earned it rather than always saying "bundle".
  const pricedCount = breakdown.filter((b) => b.high > 0).length;

  return {
    low: Math.round(low),
    high: Math.round(high),
    breakdown,
    discountApplied: discounted,
    discountRate: BUNDLE_DISCOUNT_RATE,
    discountLabel: pricedCount > 1 ? "Bundle discount" : "Large job discount",
  };
}

export function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
