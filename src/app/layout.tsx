import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://gpalytics.vercel.app"),
  title: "GPAlytics - Free GPA, CGPA & SGPA Calculator for Students",
  description:
    "Calculate GPA, CGPA, and SGPA instantly with GPAlytics. Upload results, track academic performance, and predict future GPA with advanced analytics.",
  keywords: [
    "gpa calculator",
    "cgpa calculator",
    "sgpa calculator",
    "engineering gpa calculator",
    "college gpa calculator",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GPAlytics - Smart GPA Calculator",
    description: "Track and predict your GPA with analytics",
    type: "website",
    url: "/",
    siteName: "GPAlytics",
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "GPAlytics",
  applicationCategory: "EducationApplication",
  operatingSystem: "Web",
  description: "GPA and CGPA calculator with analytics",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased min-h-screen`}
      >
        <Script
          id="software-application-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
        />
        <Header />
        <main className="pt-24 pb-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

