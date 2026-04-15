import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL("https://goldexterior.com"),
  title: {
    default: "Gold Exterior — Premium Exterior Property Services",
    template: "%s · Gold Exterior",
  },
  description:
    "Pressure washing, pool cleaning, junk removal, holiday lights, and gutter cleaning. Professional, insured exterior property services with instant online quotes.",
  openGraph: {
    title: "Gold Exterior — Premium Exterior Property Services",
    description:
      "Pressure washing, pool cleaning, junk removal, holiday lights, and gutter cleaning. Get an instant online quote.",
    url: "https://goldexterior.com",
    siteName: "Gold Exterior",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#1857d4",
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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
