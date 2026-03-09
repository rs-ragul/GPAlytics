import type { Metadata } from "next";
import { KeywordToolPage } from "@/components/seo/KeywordToolPage";

export const metadata: Metadata = {
  title: "SGPA Calculator - Semester GPA Calculator | GPAlytics",
  description:
    "Calculate SGPA using credit-weighted grade points. Built for engineering and university students.",
  keywords: ["sgpa calculator", "semester gpa calculator", "engineering sgpa calculator"],
  alternates: {
    canonical: "/sgpa-calculator",
  },
};

const faqs = [
  {
    question: "What is SGPA?",
    answer: "SGPA is the semester grade point average for one academic term.",
  },
  {
    question: "How do engineering students calculate SGPA?",
    answer: "Use weighted average: sum(credit x grade point) divided by total semester credits.",
  },
  {
    question: "Is SGPA different from CGPA?",
    answer: "Yes. SGPA is semester-specific, while CGPA is cumulative across semesters.",
  },
];

export default function SgpaCalculatorLandingPage() {
  return (
    <KeywordToolPage
      title="SGPA Calculator"
      subtitle="Compute semester SGPA quickly with GPAlytics."
      kind="sgpa"
      faqs={faqs}
      links={[
        { href: "/gpa-calculator", label: "Go to GPA Calculator" },
        { href: "/cgpa-calculator", label: "Go to CGPA Calculator" },
        { href: "/gpa-predictor", label: "Go to GPA Predictor" },
      ]}
    />
  );
}
