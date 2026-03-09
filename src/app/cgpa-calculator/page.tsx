import type { Metadata } from "next";
import CGPACalculatorPage from "@/app/cgpa/page";

export const metadata: Metadata = {
  title: "CGPA Calculator - Cumulative GPA Calculator | GPAlytics",
  description:
    "Track and calculate cumulative GPA accurately with GPAlytics CGPA calculator.",
  keywords: ["cgpa calculator", "cumulative gpa calculator", "college cgpa calculator"],
  alternates: {
    canonical: "/cgpa-calculator",
  },
};

export default function CgpaCalculatorLandingPage() {
  return <CGPACalculatorPage />;
}
