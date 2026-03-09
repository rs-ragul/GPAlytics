import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/gpa", destination: "/gpa-calculator", permanent: true },
      { source: "/cgpa", destination: "/cgpa-calculator", permanent: true },
      { source: "/predict", destination: "/gpa-predictor", permanent: true },
    ];
  },
};

export default nextConfig;
