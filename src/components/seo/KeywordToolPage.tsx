"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedButton } from "@/components/shared/AnimatedButton";

type ToolKind = "gpa" | "cgpa" | "sgpa" | "predictor";

interface FaqItem {
  question: string;
  answer: string;
}

interface KeywordToolPageProps {
  title: string;
  subtitle: string;
  kind: ToolKind;
  faqs: FaqItem[];
  links: Array<{ href: string; label: string }>;
}

interface CourseInput {
  id: string;
  credits: number;
  gradePoint: number;
}

interface SemesterInput {
  id: string;
  credits: number;
  gpa: number;
}

function weightedAverage(items: Array<{ credits: number; value: number }>): number {
  const totalCredits = items.reduce((sum, item) => sum + item.credits, 0);
  if (!totalCredits) return 0;
  const weighted = items.reduce((sum, item) => sum + item.credits * item.value, 0);
  return weighted / totalCredits;
}

function CourseTool({ label }: { label: string }) {
  const [rows, setRows] = useState<CourseInput[]>([
    { id: "1", credits: 4, gradePoint: 9 },
    { id: "2", credits: 3, gradePoint: 8 },
    { id: "3", credits: 3, gradePoint: 7 },
  ]);

  const score = useMemo(
    () => weightedAverage(rows.map((row) => ({ credits: row.credits, value: row.gradePoint }))),
    [rows]
  );

  const updateRow = (id: string, field: "credits" | "gradePoint", value: number) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, { id: Date.now().toString(), credits: 3, gradePoint: 8 }]);
  };

  return (
    <GlassCard>
      <h2 className="text-xl font-semibold mb-4">{label} Tool Interface</h2>
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div key={row.id} className="grid grid-cols-3 gap-3 items-center">
            <span className="text-sm text-muted-foreground">Subject {idx + 1}</span>
            <input
              type="number"
              min="1"
              value={row.credits}
              onChange={(e) => updateRow(row.id, "credits", Number(e.target.value) || 0)}
              className="rounded-lg bg-background/50 border border-white/10 px-3 py-2"
            />
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={row.gradePoint}
              onChange={(e) => updateRow(row.id, "gradePoint", Number(e.target.value) || 0)}
              className="rounded-lg bg-background/50 border border-white/10 px-3 py-2"
            />
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <AnimatedButton size="sm" onClick={addRow}>Add Subject</AnimatedButton>
        <div className="text-lg font-semibold">{label}: <span className="gradient-text">{score.toFixed(2)}</span></div>
      </div>
    </GlassCard>
  );
}

function CgpaTool() {
  const [rows, setRows] = useState<SemesterInput[]>([
    { id: "1", credits: 20, gpa: 8.1 },
    { id: "2", credits: 22, gpa: 8.4 },
    { id: "3", credits: 21, gpa: 8.7 },
  ]);

  const cgpa = useMemo(
    () => weightedAverage(rows.map((row) => ({ credits: row.credits, value: row.gpa }))),
    [rows]
  );

  const updateRow = (id: string, field: "credits" | "gpa", value: number) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  return (
    <GlassCard>
      <h2 className="text-xl font-semibold mb-4">CGPA Tool Interface</h2>
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div key={row.id} className="grid grid-cols-3 gap-3 items-center">
            <span className="text-sm text-muted-foreground">Semester {idx + 1}</span>
            <input
              type="number"
              min="1"
              value={row.credits}
              onChange={(e) => updateRow(row.id, "credits", Number(e.target.value) || 0)}
              className="rounded-lg bg-background/50 border border-white/10 px-3 py-2"
            />
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={row.gpa}
              onChange={(e) => updateRow(row.id, "gpa", Number(e.target.value) || 0)}
              className="rounded-lg bg-background/50 border border-white/10 px-3 py-2"
            />
          </div>
        ))}
      </div>
      <div className="mt-5 text-right text-lg font-semibold">CGPA: <span className="gradient-text">{cgpa.toFixed(2)}</span></div>
    </GlassCard>
  );
}

function PredictorTool() {
  const [currentGpa, setCurrentGpa] = useState(8.1);
  const [currentCredits, setCurrentCredits] = useState(60);
  const [targetCgpa, setTargetCgpa] = useState(8.5);
  const [futureCredits, setFutureCredits] = useState(40);

  const requiredFutureGpa = useMemo(() => {
    if (!futureCredits) return 0;
    return ((targetCgpa * (currentCredits + futureCredits)) - currentGpa * currentCredits) / futureCredits;
  }, [currentCredits, currentGpa, futureCredits, targetCgpa]);

  return (
    <GlassCard>
      <h2 className="text-xl font-semibold mb-4">GPA Predictor Tool Interface</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <input type="number" step="0.01" value={currentGpa} onChange={(e) => setCurrentGpa(Number(e.target.value) || 0)} className="rounded-lg bg-background/50 border border-white/10 px-3 py-2" aria-label="Current GPA" />
        <input type="number" value={currentCredits} onChange={(e) => setCurrentCredits(Number(e.target.value) || 0)} className="rounded-lg bg-background/50 border border-white/10 px-3 py-2" aria-label="Current credits" />
        <input type="number" step="0.01" value={targetCgpa} onChange={(e) => setTargetCgpa(Number(e.target.value) || 0)} className="rounded-lg bg-background/50 border border-white/10 px-3 py-2" aria-label="Target CGPA" />
        <input type="number" value={futureCredits} onChange={(e) => setFutureCredits(Number(e.target.value) || 0)} className="rounded-lg bg-background/50 border border-white/10 px-3 py-2" aria-label="Future credits" />
      </div>
      <div className="mt-5 text-lg font-semibold">
        Required Future GPA: <span className="gradient-text">{requiredFutureGpa.toFixed(2)}</span>
      </div>
    </GlassCard>
  );
}

export function KeywordToolPage({ title, subtitle, kind, faqs, links }: KeywordToolPageProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <Script
        id={`${kind}-faq-schema`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
          <p className="text-muted-foreground text-lg">{subtitle}</p>
        </header>

        {kind === "gpa" && <CourseTool label="GPA" />}
        {kind === "sgpa" && <CourseTool label="SGPA" />}
        {kind === "cgpa" && <CgpaTool />}
        {kind === "predictor" && <PredictorTool />}

        <GlassCard>
          <h2 className="text-2xl font-semibold mb-3">How this calculator works</h2>
          <p className="text-muted-foreground leading-relaxed">
            GPAlytics uses weighted-average formulas that most colleges and engineering universities follow.
            For GPA and SGPA, each course credit is multiplied by grade point and divided by the total semester credits.
            For CGPA, semester GPAs are aggregated using semester credit weights.
          </p>
        </GlassCard>

        <GlassCard>
          <h2 className="text-2xl font-semibold mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg bg-white/5 border border-white/10 p-4">
                <h3 className="font-medium mb-1">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="flex flex-wrap gap-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
