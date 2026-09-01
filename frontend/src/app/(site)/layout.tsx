import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/shared/Preloader";
import SmoothScroll from "@/components/shared/SmoothScroll";
import { SITE } from "@/lib/constants";
import { getSiteSettings } from "@/sanity/siteSettings";
import { getProductCategories } from "@/sanity/productCategories";
import { sanityFetchList } from "@/sanity/fetch";
import { SERVICE_LIST_QUERY } from "@/sanity/queries";
import { fallbackServices } from "@/sanity/fallbacks";
import type { ServiceDoc } from "@/sanity/types";

// Note: next/font/google requires network access to fonts.googleapis.com at build
// time. In environments without that access, self-host Geist via next/font/local
// (see /public/fonts) or swap back to next/font/google once network access is
// available. For now we rely on the system font stack defined in globals.css.

export const metadata: Metadata = {
  metadataBase: new URL("https://vecosoft.com"),
  title: {
    default: `${SITE.name} — Digital Products, AI Solutions & Software`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "VecoSoft builds modern software, AI solutions, and digital products for ambitious businesses.",
  openGraph: {
    title: `${SITE.name} — Digital Products, AI Solutions & Software`,
    description:
      "VecoSoft builds modern software, AI solutions, and digital products for ambitious businesses.",
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Digital Products, AI Solutions & Software`,
    description:
      "VecoSoft builds modern software, AI solutions, and digital products for ambitious businesses.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetched once here (not per-page) since Navbar/Footer render on every
  // route. Falls back to constants.ts inside <Footer>/<Navbar> for any
  // collection not yet populated through the Studio.
  const [settings, productCategories, fetchedServices] = await Promise.all([
    getSiteSettings(),
    getProductCategories(),
    sanityFetchList<ServiceDoc>(SERVICE_LIST_QUERY, {}, { tags: ["service"] }),
  ]);
  const services = fetchedServices.length > 0 ? fetchedServices : fallbackServices();
  const footerServices = services.map((s) => ({ name: s.name, slug: s.slug.current }));

  return (
    <html lang="en">
      <body className="antialiased">
        <Preloader />
        <SmoothScroll />
        <Navbar productCategories={productCategories} />
        <main>{children}</main>
        <Footer settings={settings} services={footerServices} />
      </body>
    </html>
  );
}
