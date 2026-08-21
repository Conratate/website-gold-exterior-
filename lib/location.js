// Where Gold Exterior actually works. Every place the site names a city, a
// city or a service area reads from here, so the answer stays the same
// on the home page, the footer, the metadata and the structured data.

export const BUSINESS = {
  name: "Gold Exterior",
  site: "goldexterior.com",
  url: "https://goldexterior.com",

  // We're a mobile crew, not a storefront. The city is as specific as this
  // ever gets — no neighborhood, no street. Where the truck sleeps is nobody's
  // business but ours.
  city: "Mountain View",
  region: "CA",
  regionName: "California",
  country: "US",

  // Short forms for pills, stat tiles and sentence copy.
  base: "Mountain View, CA",
  baseLong: "Mountain View, California",
  serviceArea: "the Bay Area",
  serviceAreaShort: "Bay Area",
};

// One line that answers "where are you?" — used in the hero pill, the footer
// and the quote page.
export const LOCATION_LINE = `Based in ${BUSINESS.base} · Serving ${BUSINESS.serviceArea}`;

// Grouped by how we actually route work: the Peninsula and South Bay are the
// home routes, the East Bay and the city get scheduled around them.
export const SERVICE_AREAS = [
  {
    name: "Peninsula & South Bay",
    note: "Home turf. Usually same-week scheduling, no travel surcharge.",
    cities: [
      "Mountain View",
      "Los Altos",
      "Palo Alto",
      "Menlo Park",
      "Sunnyvale",
      "Cupertino",
      "Santa Clara",
      "San Jose",
      "Campbell",
      "Los Gatos",
      "Saratoga",
      "Redwood City",
      "San Carlos",
      "San Mateo",
      "Milpitas",
    ],
  },
  {
    name: "East Bay",
    note: "Regular routes. Small jobs may wait for a nearby booking.",
    cities: [
      "Fremont",
      "Newark",
      "Union City",
      "Hayward",
      "San Leandro",
      "Oakland",
      "Berkeley",
      "Dublin",
      "Pleasanton",
      "Livermore",
      "San Ramon",
      "Danville",
      "Walnut Creek",
      "Concord",
    ],
  },
  {
    name: "San Francisco & North Bay",
    note: "Scheduled around larger jobs and bundled services.",
    cities: [
      "San Francisco",
      "Daly City",
      "South San Francisco",
      "Brisbane",
      "Sausalito",
      "Mill Valley",
      "San Rafael",
      "Novato",
    ],
  },
];

// Outside the Bay Area we still travel, but it has to be worth the drive.
export const WIDER_AREA_NOTE =
  "Elsewhere in California we take larger commercial and multi-property jobs by arrangement — travel is quoted up front, never added after the fact.";

export const SERVICE_AREA_CITIES = SERVICE_AREAS.flatMap((a) => a.cities);

// Google reads this to show the business in local results. areaServed is the
// part that matters for "pressure washing near me" style searches.
export function localBusinessSchema({ aggregateRating } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: BUSINESS.name,
    url: BUSINESS.url,
    description:
      "Pressure washing, commercial cleaning, graffiti removal, holiday lights, gutter cleaning, and car & boat detailing across the Bay Area.",
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "San Francisco Bay Area" },
      ...SERVICE_AREA_CITIES.map((city) => ({
        "@type": "City",
        name: city,
        addressRegion: BUSINESS.region,
      })),
    ],
    // Only ever emitted once real reviews exist — an invented rating is both a
    // lie to customers and a structured-data penalty.
    ...(aggregateRating ? { aggregateRating } : {}),
  };
}
