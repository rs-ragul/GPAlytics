import type { Metadata } from "next";
import { KeywordToolPage } from "@/components/seo/KeywordToolPage";

export const metadata: Metadata = {
  title: "GPA Calculator - Free Engineering GPA Calculator | GPAlytics",
  description:
    "Use GPAlytics GPA calculator to compute semester GPA instantly. Ideal for engineering and college students.",
  keywords: ["gpa calculator", "engineering gpa calculator", "college gpa calculator"],
  alternates: {
    canonical: "/gpa-calculator",
  },
};

const faqs = [
  {
    question: "What is GPA?",
    answer: "GPA is your semester-level Grade Point Average based on credit-weighted subject scores.",
  },
  {
    question: "How do I calculate GPA?",
    answer: "Multiply each subject's grade point by its credits, then divide by total credits.",
  },
  {
    question: "Is this GPA calculator free?",
    answer: "Yes, GPAlytics is free for students.",
  },
];

export default function GpaCalculatorLandingPage() {
  return (
    <KeywordToolPage
      title="GPA Calculator"
      subtitle="Calculate your GPA in seconds with GPAlytics."
      kind="gpa"
      faqs={faqs}
      links={[
        { href: "/cgpa-calculator", label: "Go to CGPA Calculator" },
        { href: "/sgpa-calculator", label: "Go to SGPA Calculator" },
        { href: "/gpa-predictor", label: "Go to GPA Predictor" },
      ]}
    />
  );
}
