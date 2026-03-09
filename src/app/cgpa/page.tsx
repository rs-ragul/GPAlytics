"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, TrendingUp, Award, CreditCard } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedButton } from "@/components/shared/AnimatedButton";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { SemesterRow, SemesterTableHeader } from "@/components/features/SemesterRow";
import { calculateCGPA } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface Semester {
  id: string;
  name: string;
  gpa: number;
  credits: number;
}

export default function CGPACalculatorPage() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: "1", name: "Semester 1", gpa: 8.5, credits: 20 },
    { id: "2", name: "Semester 2", gpa: 8.2, credits: 22 },
    { id: "3", name: "Semester 3", gpa: 8.8, credits: 21 },
    { id: "4", name: "Semester 4", gpa: 0, credits: 0 },
  ]);

  const cgpa = useMemo(() => {
    const validSemesters = semesters.filter(s => s.gpa > 0 && s.credits > 0);
    return calculateCGPA(validSemesters);
  }, [semesters]);

  const totalCredits = useMemo(() => {
    return semesters.reduce((sum, s) => sum + (s.credits || 0), 0);
  }, [semesters]);

  const validSemestersCount = useMemo(() => {
    return semesters.filter(s => s.gpa > 0 && s.credits > 0).length;
  }, [semesters]);

  const chartData = useMemo(() => {
    return semesters
      .filter(s => s.gpa > 0)
      .map((s, index) => ({
        name: s.name || `Sem ${index + 1}`,
        gpa: s.gpa,
        credits: s.credits,
      }));
  }, [semesters]);

  const addSemester = () => {
    setSemesters([
      ...semesters,
      { 
        id: Date.now().toString(), 
        name: `Semester ${semesters.length + 1}`, 
        gpa: 0, 
        credits: 0 
      },
    ]);
  };

  const removeSemester = (id: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter((s) => s.id !== id));
    }
  };

  const updateSemester = (id: string, field: keyof Semester, value: string | number) => {
    setSemesters(
      semesters.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
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
            CGPA <span className="gradient-text">Calculator</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your cumulative GPA across all semesters
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Semesters
                </h2>
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  onClick={addSemester}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Semester
                </AnimatedButton>
              </div>

              <SemesterTableHeader />

              <div className="space-y-3 mt-4">
                <AnimatePresence mode="popLayout">
                  {semesters.map((semester) => (
                    <SemesterRow
                      key={semester.id}
                      id={semester.id}
                      name={semester.name}
                      gpa={semester.gpa}
                      credits={semester.credits}
                      onNameChange={(id, name) => updateSemester(id, "name", name)}
                      onGPAChange={(id, gpa) => updateSemester(id, "gpa", gpa)}
                      onCreditsChange={(id, credits) => updateSemester(id, "credits", credits)}
                      onRemove={removeSemester}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </GlassCard>

            {/* Performance Chart */}
            {chartData.length > 0 && (
              <GlassCard>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  GPA Trend
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#94A3B8" 
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        domain={[0, 10]} 
                        stroke="#94A3B8" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1E293B",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#F8FAFC",
                        }}
                        labelStyle={{ color: "#F8FAFC" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="gpa"
                        stroke="#6366F1"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorGpa)"
                        dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: "#818CF8" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            {/* CGPA Display */}
            <GlassCard className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Award className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">Your CGPA</h3>
              </div>
              
              <motion.div
                className="text-5xl sm:text-6xl font-bold mb-2"
                key={cgpa}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className={cgpa >= 8 ? "text-success" : cgpa >= 6 ? "text-primary" : "text-warning"}>
                  <AnimatedNumber value={cgpa} decimals={2} />
                </span>
              </motion.div>
              
              <div className={`text-lg font-medium mb-4 ${
                cgpa >= 8 ? "text-success" : cgpa >= 6 ? "text-primary" : "text-warning"
              }`}>
                {cgpa >= 8.5 ? "Outstanding" : cgpa >= 8 ? "Excellent" : cgpa >= 7 ? "Good" : cgpa >= 6 ? "Average" : "Needs Improvement"}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{totalCredits}</div>
                  <div className="text-sm text-muted-foreground">Total Credits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{validSemestersCount}</div>
                  <div className="text-sm text-muted-foreground">Semesters</div>
                </div>
              </div>
            </GlassCard>

            {/* Semester Breakdown */}
            <GlassCard>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Semester Breakdown
              </h3>
              <div className="space-y-3">
                {semesters.filter(s => s.gpa > 0).map((semester) => (
                  <div
                    key={semester.id}
                    className="flex justify-between items-center p-3 rounded-lg bg-white/5"
                  >
                    <div>
                      <div className="font-medium">{semester.name}</div>
                      <div className="text-sm text-muted-foreground">{semester.credits} credits</div>
                    </div>
                    <div className={`text-lg font-bold ${
                      semester.gpa >= 8 ? "text-success" : semester.gpa >= 6 ? "text-primary" : "text-warning"
                    }`}>
                      {semester.gpa.toFixed(2)}
                    </div>
                  </div>
                ))}
                {semesters.filter(s => s.gpa > 0).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Add semester GPAs to see breakdown
                  </p>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

