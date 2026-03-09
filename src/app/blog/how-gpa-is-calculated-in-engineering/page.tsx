import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/shared/GlassCard";

export const metadata: Metadata = {
  title: "How GPA is Calculated in Engineering | GPAlytics Blog",
  description: "Learn the engineering GPA formula with worked examples and credit-weighted calculation steps.",
  alternates: {
    canonical: "/blog/how-gpa-is-calculated-in-engineering",
  },
};

export default function EngineeringGpaPostPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <article className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">How GPA is calculated in engineering</h1>
        <GlassCard>
          <p className="text-muted-foreground leading-relaxed">
            Engineering GPA calculation uses a weighted average model. Every course carries credit hours,
            and each letter grade maps to a grade point. Multiply course credits by grade points for every
            course, sum them, and divide by the total semester credits.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Formula: GPA = Sum(credit x grade point) / Sum(credits). If your courses are 4 credits at 9 points,
            3 credits at 8 points, and 3 credits at 7 points, GPA = 8.1.
          </p>
        </GlassCard>
        <Link href="/gpa-calculator" className="text-primary hover:text-primary/80">Try the GPA calculator</Link>
      </article>
    </div>
  );
}
