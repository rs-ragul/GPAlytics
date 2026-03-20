import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gpa-analytics.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/gpa-calculator",
    "/cgpa-calculator",
    "/sgpa-calculator",
    "/gpa-predictor",
    "/blog",
    "/blog/how-gpa-is-calculated-in-engineering",
    "/blog/difference-between-gpa-and-cgpa",
    "/blog/how-to-improve-gpa-in-college",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
