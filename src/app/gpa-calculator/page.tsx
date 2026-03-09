import type { Metadata } from "next";
import GPACalculatorPage from "@/app/gpa/page";

export const metadata: Metadata = {
  title: "GPA Calculator - Free Engineering GPA Calculator | GPAlytics",
  description:
    "Use GPAlytics GPA calculator to compute semester GPA instantly. Ideal for engineering and college students.",
  keywords: ["gpa calculator", "engineering gpa calculator", "college gpa calculator"],
  alternates: {
    canonical: "/gpa-calculator",
  },
};

export default function GpaCalculatorLandingPage() {
  return <GPACalculatorPage />;
}
