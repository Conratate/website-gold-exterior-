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
    "Pressure washing, holiday lights, yard cleanup and mobile car detailing across Santa Clara County. Instant online quotes.",
  openGraph: {
    title: "Gold Exterior — Premium Exterior Property Services",
    description:
      "Exterior cleaning and mobile car detailing in Santa Clara County. Get an instant online quote.",
    url: "https://goldexterior.com",
    siteName: "Gold Exterior",
    type: "website",
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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
