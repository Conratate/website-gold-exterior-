// Single source of truth for service data + pricing logic.
// Used by the Services page, the Home page, and the Estimate Calculator.
// SERVICES are bookable on their own; ADD_ONS only ride along with one.
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
          xs:     [89, 119],
          small:  [149, 199],
          medium: [249, 329],
          large:  [409, 559],
        },
        sidewalk: {
          xs:     [149,  199],
          small:  [279,  389],
          medium: [529,  709],
          large:  [769, 1029],
        },
        fence: {
          xs:     [109, 149],
          small:  [179, 239],
          medium: [289, 399],
          large:  [389, 529],
        },
      };
      if (!surface || !size) return [0, 0];
      return matrix[surface]?.[size] || [0, 0];
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
        accent:  [189,  219],
        starter: [289,  339],
        basic:   [529,  619],
        premium: [869, 1019],
        custom:  [1459, 1689],
      };
      return tiers[tier] || [0, 0];
    },
  },

  {
    id: "weed-removal",
    name: "Weed & Junk Removal",
    tagline: "Overgrown yard? We clear it out and haul it off.",
    blurb:
      "Weeds pulled, debris cleared, and old junk hauled away. Every yard is different, so this is a custom quote — the calculator gives you a ballpark.",
    icon: "sprout",
    sub: ["Weeds & overgrowth", "Yard debris", "Junk haul-away"],
    bullets: [
      "Pulled at the root, not just trimmed back",
      "Junk hauled away for a flat add-on fee",
      "Custom quote, confirmed before we start",
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
          xs: "Up to ~150 sq ft — a side strip or one planter bed",
          small: "~150–400 sq ft — a small front yard",
          medium: "~400–1,000 sq ft — a full front or back yard",
          large: "1,000+ sq ft — a big lot or front and back",
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
          heavy: "Fully overgrown — ground hidden under weeds and litter",
        }),
      },
      {
        id: "junk",
        label: "Any junk to haul away?",
        type: "radio",
        options: [
          { value: "none", label: "No junk" },
          { value: "few", label: "A few items" },
          { value: "truck", label: "About a pickup load" },
          { value: "more", label: "More than a pickup load" },
        ],
        optionHints: () => ({
          none: "Just the weeds and yard waste",
          few: "An old chair, a few bags, some scrap wood",
          truck: "Enough to fill a pickup bed",
          more: "Ballpark only — we'll confirm on site",
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
    // How overgrown it is drives the hours more than the area does. Junk is
    // priced as a flat add-on on top, since dump fees don't scale with the yard.
    price: ({ size, growth, junk }) => {
      const matrix = {
        light: {
          xs:     [99, 129],
          small:  [179, 239],
          medium: [339, 469],
          large:  [659, 889],
        },
        moderate: {
          xs:     [129, 179],
          small:  [249, 329],
          medium: [479, 639],
          large:  [909, 1229],
        },
        heavy: {
          xs:     [179, 249],
          small:  [339, 459],
          medium: [639, 869],
          large:  [1229, 1669],
        },
      };
      const junkFee = {
        none:  [0,   0],
        few:   [49,  79],
        truck: [149, 229],
        more:  [299, 449],
      };
      if (!size || !growth || !junk) return [0, 0];
      const base = matrix[growth]?.[size];
      const fee = junkFee[junk];
      if (!base || !fee) return [0, 0];
      return [base[0] + fee[0], base[1] + fee[1]];
    },
  },

  {
    id: "detailing",
    name: "Car Detailing",
    tagline: "Showroom finish, in your driveway.",
    blurb:
      "Mobile detailing for cars, trucks and SUVs. Three packages, from a quick exterior wash to a full detail.",
    icon: "car",
    sub: ["Cars, trucks & SUVs", "Interior & exterior", "Headlight restoration"],
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
        express:  [79,  79],
        standard: [119, 119],
        pro:      [169, 169],
      };
      return tiers[pkg] || [0, 0];
    },
  },

  {
    id: "headlight-restoration",
    name: "Headlight Restoration",
    tagline: "Foggy, yellow headlights made clear again.",
    blurb:
      "Sanded, polished and UV-sealed so they stay clear. Book it on its own or add it to any detail.",
    icon: "headlight",
    bullets: [
      "Both headlights, one price",
      "UV sealant so the haze doesn't come back fast",
      "Done in your driveway in about an hour",
    ],
    questions: [
      {
        id: "condition",
        label: "How bad are the headlights?",
        type: "radio",
        ladder: true,
        options: [
          { value: "hazy", label: "Hazy" },
          { value: "yellowed", label: "Yellowed / oxidized" },
        ],
        optionHints: () => ({
          hazy: "Cloudy, but you can still see the bulb clearly",
          yellowed: "Yellow, crusty or hard to see through",
        }),
      },
    ],
    price: ({ condition }) => {
      const tiers = {
        hazy:     [79, 79],
        yellowed: [99, 99],
      };
      return tiers[condition] || [0, 0];
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
          spot:   [109,  149],
          xs:     [219,  289],
          small:  [409,  559],
          medium: [769, 1029],
          large:  [1249, 1689],
          xl:     [1799, 2429],
        },
        softwash: {
          spot:   [179,  229],
          xs:     [329,  449],
          small:  [639,  859],
          medium: [1179, 1609],
          large:  [1939, 2629],
          xl:     [2789, 3779],
        },
        school: {
          spot:   [119,  179],
          xs:     [249,  329],
          small:  [479,  639],
          medium: [869, 1189],
          large:  [1439, 1949],
          xl:     [2069, 2799],
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
        xs:     [39,  49],
        small:  [79, 99],
        medium: [129, 159],
        large:  [239, 279],
      };
      return tiers[size] || [0, 0];
    },
  },
];

// Add-ons can't be booked on their own — they only show up once a customer
// has picked a real service, and they're priced at a steep cut to reward
// stacking work onto a trip we're already making.
export const ADD_ON_RATE = 0.5;

export const ADD_ONS = [
  {
    id: "gutter-cleaning",
    name: "Gutter Cleaning",
    addOn: true,
    tagline: "Add it to any job for half price.",
    icon: "leaf",
    questions: [
      {
        id: "stories",
        label: "How many stories is the home?",
        type: "radio",
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
    // Full price before the add-on cut. calculateTotal applies ADD_ON_RATE.
    price: ({ stories }) => {
      const tiers = {
        partial: [79,  89],
        one:     [109, 129],
        two:     [179, 219],
        three:   [279, 339],
      };
      return tiers[stories] || [0, 0];
    },
  },
];

export const ALL_SERVICES = [...SERVICES, ...ADD_ONS];

// Bundle discount: once a quote's midpoint estimate clears the threshold,
// customers get a modest break for consolidating work with one crew instead
// of hiring multiple contractors. Applied on top of the calculated total.
export const BUNDLE_DISCOUNT_THRESHOLD = 600;
export const BUNDLE_DISCOUNT_RATE = 0.1;

// Launch offer. The minimum keeps it off the thinnest jobs — a $79 wash or a
// $169 detail can't absorb 15% — while still covering everything a first
// customer is likely to book. Flip `active` to false to end the sale; the
// bundle discount takes over again on its own.
export const LAUNCH_OFFER = {
  active: true,
  rate: 0.15,
  minimum: 250,
  label: "New customer offer",
  headline: "15% off your first job",
  detail: "Automatically applied to first-time jobs over $250. No code needed.",
};

// Mobilization costs the same whether a job is $109 or $900. Below this
// figure a dedicated trip doesn't pay for itself, so those jobs get routed
// alongside other work in the area rather than scheduled on demand.
export const ROUTING_MINIMUM = 149;

export function getService(id) {
  return ALL_SERVICES.find((s) => s.id === id);
}

// Aggregate price across multiple services + their answer state
export function calculateTotal(selections) {
  // selections: { [serviceId]: answers }
  let low = 0;
  let high = 0;
  let addOnLow = 0;
  let addOnHigh = 0;
  const breakdown = [];
  for (const [serviceId, answers] of Object.entries(selections)) {
    const service = getService(serviceId);
    if (!service) continue;
    const [l, h] = service.price(answers || {});
    if (service.addOn) {
      const al = Math.round(l * (1 - ADD_ON_RATE));
      const ah = Math.round(h * (1 - ADD_ON_RATE));
      addOnLow += al;
      addOnHigh += ah;
      breakdown.push({
        service: `${service.name} (${Math.round(ADD_ON_RATE * 100)}% off add-on)`,
        low: al,
        high: ah,
        addOn: true,
      });
      continue;
    }
    low += l;
    high += h;
    breakdown.push({ service: service.name, low: l, high: h });
  }

  // A single large job can clear a threshold on its own, so the bundle
  // discount is named for what actually earned it. Add-ons are already
  // discounted, so they neither count toward it nor get cut again.
  const pricedCount = breakdown.filter((b) => b.high > 0 && !b.addOn).length;
  const midpoint = (low + high) / 2;

  // Offers never stack — the customer gets whichever single one saves them
  // most. Stacking a launch offer on top of a bundle discount would reach 25%
  // off, which several services cannot absorb.
  const candidates = [];
  if (midpoint >= BUNDLE_DISCOUNT_THRESHOLD && midpoint > 0) {
    candidates.push({
      rate: BUNDLE_DISCOUNT_RATE,
      label: pricedCount > 1 ? "Bundle discount" : "Large job discount",
    });
  }
  if (LAUNCH_OFFER.active && midpoint >= LAUNCH_OFFER.minimum && midpoint > 0) {
    candidates.push({ rate: LAUNCH_OFFER.rate, label: LAUNCH_OFFER.label });
  }
  const best = candidates.sort((a, b) => b.rate - a.rate)[0] || null;

  if (best) {
    low = low * (1 - best.rate);
    high = high * (1 - best.rate);
  }

  return {
    low: Math.round(low + addOnLow),
    high: Math.round(high + addOnHigh),
    breakdown,
    discountApplied: Boolean(best),
    discountRate: best ? best.rate : 0,
    discountLabel: best ? best.label : null,
  };
}

export function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
