"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Lightbulb, BookOpen, Plus, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedButton } from "@/components/shared/AnimatedButton";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { SubjectRow, SubjectTableHeader } from "@/components/features/SubjectRow";
import { InsightsList } from "@/components/features/InsightCard";
import { calculateGPA, getGPAStatus, GRADE_POINTS } from "@/lib/utils";
import { generateInsights } from "@/lib/insights";

interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

export default function InsightsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "Mathematics", credits: 4, grade: "A" },
    { id: "2", name: "Physics", credits: 4, grade: "B+" },
    { id: "3", name: "Computer Science", credits: 3, grade: "A+" },
    { id: "4", name: "English", credits: 2, grade: "A" },
  ]);

  const gpa = useMemo(() => {
    return calculateGPA(subjects);
  }, [subjects]);

  const totalCredits = useMemo(() => {
    return subjects.reduce((sum, s) => sum + s.credits, 0);
  }, [subjects]);

  const status = getGPAStatus(gpa);

  const insights = useMemo(() => {
    return generateInsights(subjects);
  }, [subjects]);

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

  // Calculate potential improvements
  const potentialImprovements = useMemo(() => {
    const improvements: Array<{
      subject: Subject;
      potentialGPA: number;
      improvement: number;
    }> = [];

    subjects.forEach((subject) => {
      if (!subject.grade || subject.grade === "O") return;

      const currentPoints = GRADE_POINTS[subject.grade] || 0;
      const maxPoints = 10;
      
      // Calculate what GPA would be if this subject was O
      const newSubjects = subjects.map((s) =>
        s.id === subject.id ? { ...s, grade: "O" } : s
      );
      const newGPA = calculateGPA(newSubjects);

      improvements.push({
        subject,
        potentialGPA: newGPA,
        improvement: newGPA - gpa,
      });
    });

    return improvements.sort((a, b) => b.improvement - a.improvement).slice(0, 3);
  }, [subjects, gpa]);

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
            Smart <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Get personalized academic recommendations based on your performance
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Status */}
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Your Subjects
                </h2>
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  onClick={addSubject}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Subject
                </AnimatedButton>
              </div>

              <SubjectTableHeader />

              <div className="space-y-3 mt-4">
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
              </div>
            </GlassCard>

            {/* Potential Improvements */}
            {potentialImprovements.length > 0 && (
              <GlassCard>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-warning" />
                  Potential Improvements
                </h2>
                <div className="space-y-3">
                  {potentialImprovements.map((item, index) => (
                    <motion.div
                      key={item.subject.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div>
                        <div className="font-medium">{item.subject.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Current: {item.subject.grade} → Target: O ({item.subject.credits} credits)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-success">
                          +{item.improvement.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          New GPA: {item.potentialGPA.toFixed(2)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* GPA Summary */}
            <GlassCard className="text-center">
              <h3 className="text-lg font-semibold mb-4">Current GPA</h3>
              <motion.div
                className="text-5xl font-bold mb-2"
                key={gpa}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className={status.color}>
                  <AnimatedNumber value={gpa} decimals={2} />
                </span>
              </motion.div>
              <div className={`font-medium ${status.color}`}>{status.label}</div>
              <div className="mt-4 pt-4 border-t border-white/10 text-sm text-muted-foreground">
                {totalCredits} total credits
              </div>
            </GlassCard>

            {/* Insights */}
            <div>
              <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
              <InsightsList insights={insights} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

