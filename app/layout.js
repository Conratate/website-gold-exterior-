import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GiveawayBanner from "@/components/GiveawayBanner";
import { SERVICES } from "@/lib/services";
import { SITE_URL, BUSINESS } from "@/lib/site";

const TITLE = "Gold Exterior — Pressure Washing, Holiday Lights & Mobile Detailing in San Jose";
const DESCRIPTION = `Pressure washing, holiday light installation, yard cleanup and mobile car detailing in ${BUSINESS.cities
  .slice(0, 4)
  .join(", ")} and across Santa Clara County. See your price instantly online.`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Gold Exterior",
  },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Gold Exterior",
    type: "website",
  },
};

// Tells Google this is a local service business and where it works, so it
// can show up for "pressure washing near me" style searches. A mobile
// business lists the area it serves instead of a street address.
const LOCAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: BUSINESS.name,
  url: SITE_URL,
  telephone: BUSINESS.phone,
  priceRange: "$$",
  areaServed: [
    ...BUSINESS.cities.map((name) => ({ "@type": "City", name })),
    { "@type": "AdministrativeArea", name: "Santa Clara County, CA" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name },
    })),
  },
};

export const viewport = {
  themeColor: "#0e0d0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-charcoal-950 text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS) }}
        />
        <GiveawayBanner />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
