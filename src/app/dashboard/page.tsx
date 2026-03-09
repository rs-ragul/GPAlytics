"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Award, 
  CreditCard,
  BookOpen,
  Target,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { InsightsList } from "@/components/features/InsightCard";
import { calculateGPA, calculateCGPA, getGPAStatus, GRADE_POINTS } from "@/lib/utils";
import { generateInsights } from "@/lib/insights";
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

interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

interface Semester {
  id: string;
  name: string;
  gpa: number;
  credits: number;
}

export default function DashboardPage() {
  // Sample data for demonstration
  const [subjects] = useState<Subject[]>([
    { id: "1", name: "Mathematics", credits: 4, grade: "A" },
    { id: "2", name: "Physics", credits: 4, grade: "A+" },
    { id: "3", name: "Computer Science", credits: 3, grade: "A" },
    { id: "4", name: "English", credits: 2, grade: "A+" },
    { id: "5", name: "Data Structures", credits: 3, grade: "B+" },
  ]);

  const [semesters] = useState<Semester[]>([
    { id: "1", name: "Sem 1", gpa: 8.2, credits: 20 },
    { id: "2", name: "Sem 2", gpa: 8.5, credits: 22 },
    { id: "3", name: "Sem 3", gpa: 8.0, credits: 21 },
    { id: "4", name: "Sem 4", gpa: 8.8, credits: 23 },
  ]);

  const currentGPA = useMemo(() => calculateGPA(subjects), [subjects]);
  const cgpa = useMemo(() => calculateCGPA(semesters), [semesters]);
  const totalCredits = useMemo(() => subjects.reduce((sum, s) => sum + s.credits, 0), [subjects]);
  const status = getGPAStatus(currentGPA);

  const insights = useMemo(() => generateInsights(subjects), [subjects]);

  const chartData = useMemo(() => {
    return semesters.map((s) => ({
      name: s.name,
      gpa: s.gpa,
    }));
  }, [semesters]);

  const gpaTrend = useMemo(() => {
    if (semesters.length < 2) return 0;
    const last = semesters[semesters.length - 1].gpa;
    const prev = semesters[semesters.length - 2].gpa;
    return Number((last - prev).toFixed(2));
  }, [semesters]);

  const topSubjects = useMemo(() => {
    return [...subjects]
      .sort((a, b) => (GRADE_POINTS[b.grade] || 0) - (GRADE_POINTS[a.grade] || 0))
      .slice(0, 3);
  }, [subjects]);

  const subjectsNeedingAttention = useMemo(() => {
    return subjects
      .filter((s) => (GRADE_POINTS[s.grade] || 0) < 8 && s.credits >= 3)
      .slice(0, 3);
  }, [subjects]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Academic <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Your comprehensive academic performance overview
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Current GPA</span>
            </div>
            <div className={`text-3xl font-bold ${status.color}`}>
              <AnimatedNumber value={currentGPA} decimals={2} />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Overall CGPA</span>
            </div>
            <div className="text-3xl font-bold text-success">
              <AnimatedNumber value={cgpa} decimals={2} />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-warning/20">
                <CreditCard className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Total Credits</span>
            </div>
            <div className="text-3xl font-bold text-white">
              <AnimatedNumber value={totalCredits} decimals={0} />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <LayoutDashboard className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm text-muted-foreground">Semesters</span>
            </div>
            <div className="text-3xl font-bold text-white">
              <AnimatedNumber value={semesters.length} decimals={0} />
            </div>
          </GlassCard>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Chart */}
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  GPA Trend
                </h2>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  gpaTrend > 0 ? "text-success" : gpaTrend < 0 ? "text-error" : "text-muted-foreground"
                }`}>
                  {gpaTrend > 0 ? <ArrowUp className="w-4 h-4" /> : gpaTrend < 0 ? <ArrowDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  {Math.abs(gpaTrend)} from last semester
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGpaDash" x1="0" y1="0" x2="0" y2="1">
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
                    />
                    <Area
                      type="monotone"
                      dataKey="gpa"
                      stroke="#6366F1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorGpaDash)"
                      dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: "#818CF8" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Subject Performance */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Performers */}
              <GlassCard>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-success" />
                  Top Performers
                </h3>
                <div className="space-y-3">
                  {topSubjects.map((subject, index) => (
                    <motion.div
                      key={subject.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? "bg-yellow-500/20 text-yellow-400" :
                          index === 1 ? "bg-gray-400/20 text-gray-300" :
                          "bg-amber-700/20 text-amber-600"
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{subject.name}</div>
                          <div className="text-xs text-muted-foreground">{subject.credits} credits</div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-success/20 text-success font-bold">
                        {subject.grade}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              {/* Needs Attention */}
              <GlassCard>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-warning" />
                  Focus Areas
                </h3>
                {subjectsNeedingAttention.length > 0 ? (
                  <div className="space-y-3">
                    {subjectsNeedingAttention.map((subject, index) => (
                      <motion.div
                        key={subject.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div>
                          <div className="font-medium">{subject.name}</div>
                          <div className="text-xs text-muted-foreground">{subject.credits} credits</div>
                        </div>
                        <span className="px-3 py-1 rounded-lg bg-warning/20 text-warning font-bold">
                          {subject.grade}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="w-12 h-12 text-success mx-auto mb-2" />
                    <p>All subjects are performing well!</p>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-muted-foreground">GPA Status</span>
                  <span className={`font-bold ${status.color}`}>{status.label}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-muted-foreground">Subjects</span>
                  <span className="font-bold">{subjects.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-muted-foreground">Semesters</span>
                  <span className="font-bold">{semesters.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-muted-foreground">Trend</span>
                  <span className={`font-bold ${
                    gpaTrend > 0 ? "text-success" : gpaTrend < 0 ? "text-error" : "text-muted-foreground"
                  }`}>
                    {gpaTrend > 0 ? "+" : ""}{gpaTrend}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Insights */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              <InsightsList insights={insights.slice(0, 3)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

