import type { Metadata } from "next";
import PredictPage from "@/app/predict/page";

export const metadata: Metadata = {
  title: "GPA Predictor - Predict Future GPA and CGPA | GPAlytics",
  description:
    "Use GPAlytics GPA predictor to estimate required future GPA for your target CGPA.",
  keywords: ["gpa predictor", "cgpa predictor", "future gpa calculator"],
  alternates: {
    canonical: "/gpa-predictor",
  },
};

export default function GpaPredictorLandingPage() {
  return <PredictPage />;
}
