import type { Metadata } from "next";
import { KeywordToolPage } from "@/components/seo/KeywordToolPage";

export const metadata: Metadata = {
  title: "CGPA Calculator - Cumulative GPA Calculator | GPAlytics",
  description:
    "Track and calculate cumulative GPA accurately with GPAlytics CGPA calculator.",
  keywords: ["cgpa calculator", "cumulative gpa calculator", "college cgpa calculator"],
  alternates: {
    canonical: "/cgpa-calculator",
  },
};

const faqs = [
  {
    question: "What is CGPA?",
    answer: "CGPA is your cumulative GPA across multiple semesters.",
  },
  {
    question: "How is CGPA calculated?",
    answer: "CGPA is the weighted average of semester GPAs using semester credits.",
  },
  {
    question: "Can engineering students use this calculator?",
    answer: "Yes. It supports credit-based engineering semester calculations.",
  },
];

export default function CgpaCalculatorLandingPage() {
  return (
    <KeywordToolPage
      title="CGPA Calculator"
      subtitle="Calculate and monitor cumulative GPA with semester-wise weighting."
      kind="cgpa"
      faqs={faqs}
      links={[
        { href: "/gpa-calculator", label: "Go to GPA Calculator" },
        { href: "/sgpa-calculator", label: "Go to SGPA Calculator" },
        { href: "/gpa-predictor", label: "Go to GPA Predictor" },
      ]}
    />
  );
}
