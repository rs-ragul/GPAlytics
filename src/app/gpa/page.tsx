"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Save, Award } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedButton } from "@/components/shared/AnimatedButton";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { SubjectRow, SubjectTableHeader } from "@/components/features/SubjectRow";
import { InsightsList } from "@/components/features/InsightCard";
import { calculateGPA, getGPAStatus } from "@/lib/utils";
import { generateInsights } from "@/lib/insights";
import { saveAcademicRecord } from "@/lib/records";

interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

export default function GPACalculatorPage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "", credits: 3, grade: "" },
    { id: "2", name: "", credits: 3, grade: "" },
    { id: "3", name: "", credits: 3, grade: "" },
    { id: "4", name: "", credits: 3, grade: "" },
  ]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const gpa = useMemo(() => {
    return calculateGPA(subjects);
  }, [subjects]);

  const totalCredits = useMemo(() => {
    return subjects.reduce((sum, s) => sum + s.credits, 0);
  }, [subjects]);

  const status = getGPAStatus(gpa);

  const gradedSubjects = useMemo(() => {
    return subjects
      .filter((s) => s.grade)
      .map((s) => ({
        name: s.name || "Untitled",
        credits: s.credits,
        grade: s.grade,
      }));
  }, [subjects]);

  const insights = useMemo(() => {
    return generateInsights(gradedSubjects);
  }, [gradedSubjects]);

  const addSubject = () => {
    setSubjects([
      ...subjects,
      { id: Date.now().toString(), name: "", credits: 3, grade: "" },
    ]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const updateSubject = (id: string, field: keyof Subject, value: string | number) => {
    setSubjects(
      subjects.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const saveCurrentRecord = async () => {
    if (gradedSubjects.length === 0) {
      setSaveMessage("Add at least one graded subject to save.");
      return;
    }

    setSaving(true);
    const result = await saveAcademicRecord({
      type: "gpa",
      title: `GPA Snapshot (${new Date().toLocaleDateString()})`,
      score: gpa,
      credits: totalCredits,
      metadata: { subjects: gradedSubjects },
    });
    setSaveMessage(result.message);
    setSaving(false);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            GPA <span className="gradient-text">Calculator</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Calculate your semester GPA with real-time updates
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard>
              <div className="mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Subjects
                </h2>
              </div>

              <SubjectTableHeader />

              <div className="space-y-3 mt-4">
                <AnimatePresence mode="popLayout">
                  {subjects.map((subject) => (
                    <SubjectRow
                      key={subject.id}
                      id={subject.id}
                      name={subject.name}
                      credits={subject.credits}
                      grade={subject.grade}
                      onNameChange={(id, name) => updateSubject(id, "name", name)}
                      onCreditsChange={(id, credits) => updateSubject(id, "credits", credits)}
                      onGradeChange={(id, grade) => updateSubject(id, "grade", grade)}
                      onRemove={removeSubject}
                    />
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-5">
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  onClick={addSubject}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Subject
                </AnimatedButton>
              </div>
            </GlassCard>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            {/* GPA Display */}
            <GlassCard className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Award className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">Your GPA</h3>
              </div>
              
              <motion.div
                className="text-5xl sm:text-6xl font-bold mb-2"
                key={gpa}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className={status.color}>
                  <AnimatedNumber value={gpa} decimals={2} />
                </span>
              </motion.div>
              
              <div className={`text-lg font-medium ${status.color} mb-4`}>
                {status.label}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{totalCredits}</div>
                  <div className="text-sm text-muted-foreground">Total Credits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{gradedSubjects.length}</div>
                  <div className="text-sm text-muted-foreground">Subjects Graded</div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  onClick={saveCurrentRecord}
                  loading={saving}
                  icon={<Save className="w-4 h-4" />}
                  className="w-full"
                >
                  Save to Dashboard
                </AnimatedButton>
                {saveMessage ? (
                  <p className="text-xs text-muted-foreground">{saveMessage}</p>
                ) : null}
              </div>
            </GlassCard>

            {/* Insights */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Smart Insights</h3>
              <InsightsList insights={insights} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

