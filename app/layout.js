import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { localBusinessSchema } from "@/lib/location";
import { aggregateRatingSchema } from "@/lib/reviews";

export const metadata = {
  metadataBase: new URL("https://goldexterior.com"),
  title: {
    default: "Gold Exterior — Premium Exterior Property Services in the Bay Area",
    template: "%s · Gold Exterior",
  },
  description:
    "Pressure washing, commercial cleaning, graffiti removal, holiday lights, gutter cleaning, and car & boat detailing across the Bay Area. Based in Mountain View, with instant online quotes.",
  keywords: [
    "pressure washing Bay Area",
    "gutter cleaning Mountain View",
    "graffiti removal Bay Area",
    "commercial cleaning Peninsula",
    "holiday lights installation South Bay",
  ],
  openGraph: {
    title: "Gold Exterior — Premium Exterior Property Services in the Bay Area",
    description:
      "Pressure washing, commercial cleaning, graffiti removal, holiday lights, gutter cleaning, and car & boat detailing across the Bay Area. Get an instant online quote.",
    url: "https://goldexterior.com",
    siteName: "Gold Exterior",
    locale: "en_US",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#11244f",
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
      <body className="min-h-screen bg-white text-charcoal-900 antialiased">
        {/* Tells search engines the cities we cover, so we surface on local
            "near me" searches instead of only on our own name. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              localBusinessSchema({ aggregateRating: aggregateRatingSchema() })
            ),
          }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
