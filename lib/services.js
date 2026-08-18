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
          xs:     [139, 159],
          small:  [219, 249],
          medium: [339, 389],
          large:  [529, 619],
        },
        sidewalk: {
          xs:     [229, 269],
          small:  [369, 429],
          medium: [599, 699],
          large:  [969, 1149],
        },
        fence: {
          xs:     [149, 179],
          small:  [229, 269],
          medium: [349, 399],
          large:  [539, 619],
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
          spot:   [219,  269],
          xs:     [349,  419],
          small:  [579,  689],
          medium: [969,  1149],
          large:  [1649, 1949],
          xl:     [2999, 3549],
        },
        softwash: {
          spot:   [349,  399],
          xs:     [599,  699],
          small:  [1099, 1279],
          medium: [1999, 2329],
          large:  [3649, 4249],
          xl:     [6699, 7799],
        },
        school: {
          spot:   [279,  319],
          xs:     [479,  549],
          small:  [869,  999],
          medium: [1579, 1829],
          large:  [2879, 3329],
          xl:     [4999, 5799],
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
        xs:     [69,  79],
        small:  [119, 139],
        medium: [199, 229],
        large:  [349, 409],
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
        accent:  [279,  319],
        starter: [429,  509],
        basic:   [769,  889],
        premium: [1279, 1489],
        custom:  [2129, 2469],
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
        partial: [109, 129],
        one:     [169, 199],
        two:     [269, 309],
        three:   [419, 489],
      };
      return tiers[stories] || [0, 0];
    },
  },

  {
    id: "detailing",
    name: "Detailing",
    tagline: "Showroom finish — car or boat.",
    blurb:
      "Hand wash, vacuum, interior wipe-down and exterior shine for cars, trucks and SUVs. Boat and PWC detailing priced by surface area and condition, up to 35 feet.",
    icon: "car",
    sub: ["Car & truck detailing", "Boat & PWC detailing"],
    bullets: [
      "Hand wash & dry",
      "Express, Base or Pro packages",
      "Boats & PWC up to 35 ft, priced by area",
    ],
    questions: [
      {
        id: "vehicle",
        label: "What are we detailing?",
        type: "radio",
        options: [
          { value: "car", label: "Car, Truck or SUV" },
          { value: "boat", label: "Boat or PWC" },
        ],
      },
      {
        id: "package",
        label: "Which detail package?",
        type: "radio",
        ladder: true,
        showIf: (a) => a.vehicle === "car",
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
      {
        id: "length",
        label: "Boat length",
        type: "radio",
        ladder: true,
        showIf: (a) => a.vehicle === "boat",
        options: [
          { value: "pwc", label: "Jet ski / PWC" },
          { value: "under20", label: "Under 20 ft" },
          { value: "twenty_25", label: "20 – 25 ft" },
          { value: "twentyfive_30", label: "25 – 30 ft" },
          { value: "thirty_35", label: "30 – 35 ft" },
        ],
        optionHints: () => ({
          pwc: "About 40 sq ft of surface",
          under20: "About 120 sq ft of surface",
          twenty_25: "About 180 sq ft of surface",
          twentyfive_30: "About 240 sq ft of surface",
          thirty_35: "About 290 sq ft — our maximum size",
        }),
      },
      {
        id: "scope",
        label: "What needs cleaning?",
        type: "radio",
        showIf: (a) => a.vehicle === "boat",
        options: [
          { value: "topside", label: "Topside & exterior" },
          { value: "hull", label: "Hull bottom" },
          { value: "both", label: "Full — topside + hull" },
        ],
      },
      {
        id: "condition",
        label: "What kind of shape is it in?",
        type: "radio",
        showIf: (a) => a.vehicle === "boat",
        options: [
          { value: "light", label: "Good — regularly maintained" },
          { value: "standard", label: "Average — a season of use" },
          { value: "heavy", label: "Rough — heavy growth or oxidation" },
        ],
        optionHints: () => ({
          light: "Cleaned within the last few months",
          standard: "General clean — the most common choice",
          heavy: "Neglected, heavy staining or bottom growth",
        }),
      },
    ],
    price: ({ vehicle, package: pkg, length, scope, condition }) => {
      if (vehicle === "car") {
        const tiers = {
          express:  [89,  89],
          standard: [139, 139],
          pro:      [189, 189],
        };
        return tiers[pkg] || [0, 0];
      }
      if (vehicle === "boat") {
        // Priced per square foot of surface, the way boat work is actually
        // quoted. Customers pick a length band rather than measuring a hull,
        // and we map that to a typical surface area.
        const AREA = {
          pwc: 40,
          under20: 120,
          twenty_25: 180,
          twentyfive_30: 240,
          thirty_35: 290,
        };
        // Rate per sq ft. Hull bottom runs slightly under topside work;
        // condition drives the rest, since growth and oxidation are what
        // actually cost time.
        const RATES = {
          light:    { topside: [1.55, 1.75], hull: [1.4, 1.6],  both: [2.85, 3.25] },
          standard: { topside: [1.75, 2.0],  hull: [1.6, 1.8],  both: [3.25, 3.7] },
          heavy:    { topside: [2.3, 2.7],   hull: [2.1, 2.45], both: [4.3, 5.05] },
        };
        const area = AREA[length];
        const rate = RATES[condition] && RATES[condition][scope];
        if (!area || !rate) return [0, 0];
        // Round to a clean 9-ending figure, with a floor that keeps a small
        // job worth the drive out.
        const clean = (n) => Math.round(n / 10) * 10 - 1;
        return [
          Math.max(129, clean(area * rate[0])),
          Math.max(149, clean(area * rate[1])),
        ];
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
