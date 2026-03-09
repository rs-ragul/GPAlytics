import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/shared/GlassCard";

export const metadata: Metadata = {
  title: "GPAlytics Blog - GPA Guides for Students",
  description: "Read GPA, CGPA, and SGPA guides for engineering and college students.",
  alternates: {
    canonical: "/blog",
  },
};

const posts = [
  {
    slug: "how-gpa-is-calculated-in-engineering",
    title: "How GPA is calculated in engineering",
    excerpt: "A practical step-by-step guide to credit-weighted engineering GPA calculations.",
  },
  {
    slug: "difference-between-gpa-and-cgpa",
    title: "Difference between GPA and CGPA",
    excerpt: "Understand when to use GPA vs CGPA and why both matter academically.",
  },
  {
    slug: "how-to-improve-gpa-in-college",
    title: "How to improve GPA in college",
    excerpt: "Actionable methods to improve semester performance and raise your CGPA over time.",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">GPAlytics Blog</h1>
        <p className="text-muted-foreground">SEO-focused GPA resources for college and engineering students.</p>
        <div className="grid gap-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <GlassCard hover>
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                <p className="text-muted-foreground">{post.excerpt}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
