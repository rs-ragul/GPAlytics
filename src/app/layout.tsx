import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GradePilot - Smart GPA & CGPA Calculator",
  description: "Calculate, track, and predict your academic performance with advanced analytics.",
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
        <Header />
        <main className="pt-24 pb-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

