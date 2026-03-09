import type { Metadata } from "next";
import GPACalculatorPage from "@/app/gpa/page";

export const metadata: Metadata = {
  title: "SGPA Calculator - Semester GPA Calculator | GPAlytics",
  description:
    "Calculate SGPA using credit-weighted grade points. Built for engineering and university students.",
  keywords: ["sgpa calculator", "semester gpa calculator", "engineering sgpa calculator"],
  alternates: {
    canonical: "/sgpa-calculator",
  },
};

export default function SgpaCalculatorLandingPage() {
  return <GPACalculatorPage />;
}
