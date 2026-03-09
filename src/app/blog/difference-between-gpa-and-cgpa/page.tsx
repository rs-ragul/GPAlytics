import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/shared/GlassCard";

export const metadata: Metadata = {
  title: "Difference between GPA and CGPA | GPAlytics Blog",
  description: "Understand the key differences between GPA and CGPA with simple examples.",
  alternates: {
    canonical: "/blog/difference-between-gpa-and-cgpa",
  },
};

export default function DifferencePostPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <article className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Difference between GPA and CGPA</h1>
        <GlassCard>
          <p className="text-muted-foreground leading-relaxed">
            GPA is your performance score for one semester. CGPA is your cumulative score across all semesters.
            GPA helps you track short-term progress, while CGPA reflects overall consistency over your degree.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Students usually improve CGPA by consistently improving semester GPA. Both metrics are important for
            internships, placements, and higher studies applications.
          </p>
        </GlassCard>
        <Link href="/cgpa-calculator" className="text-primary hover:text-primary/80">Try the CGPA calculator</Link>
      </article>
    </div>
  );
}
