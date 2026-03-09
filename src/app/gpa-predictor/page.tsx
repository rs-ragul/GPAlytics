import type { Metadata } from "next";
import { KeywordToolPage } from "@/components/seo/KeywordToolPage";

export const metadata: Metadata = {
  title: "GPA Predictor - Predict Future GPA and CGPA | GPAlytics",
  description:
    "Use GPAlytics GPA predictor to estimate required future GPA for your target CGPA.",
  keywords: ["gpa predictor", "cgpa predictor", "future gpa calculator"],
  alternates: {
    canonical: "/gpa-predictor",
  },
};

const faqs = [
  {
    question: "What is a GPA predictor?",
    answer: "A GPA predictor estimates the GPA you need in future semesters to reach your target CGPA.",
  },
  {
    question: "How accurate is this GPA predictor?",
    answer: "It is mathematically accurate for weighted-credit models when your inputs are accurate.",
  },
  {
    question: "Can I use it for engineering credit systems?",
    answer: "Yes. Enter your actual credits and target CGPA for engineering-specific predictions.",
  },
];

export default function GpaPredictorLandingPage() {
  return (
    <KeywordToolPage
      title="GPA Predictor"
      subtitle="Predict future GPA targets and plan your next semesters confidently."
      kind="predictor"
      faqs={faqs}
      links={[
        { href: "/gpa-calculator", label: "Go to GPA Calculator" },
        { href: "/cgpa-calculator", label: "Go to CGPA Calculator" },
        { href: "/sgpa-calculator", label: "Go to SGPA Calculator" },
      ]}
    />
  );
}
