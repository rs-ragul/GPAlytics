"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  CalendarClock,
  CreditCard,
  LayoutDashboard,
  LineChart,
  LogOut,
  Target,
  TrendingUp,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedButton } from "@/components/shared/AnimatedButton";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { useAuthUser } from "@/lib/useAuthUser";
import { AcademicRecord, getUserRecords } from "@/lib/records";
import { getFirebaseAuth } from "@/lib/firebase";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatRecordLabel(record: AcademicRecord) {
  if (record.type === "gpa") return "GPA";
  if (record.type === "cgpa") return "CGPA";
  return "Prediction";
}

function formatDate(value: number) {
  return new Date(value).toLocaleString();
}

export default function DashboardPage() {
  const { user, loading, error } = useAuthUser();
  const [records, setRecords] = useState<AcademicRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecords(uid: string) {
      setRecordsLoading(true);
      setRecordsError(null);

      try {
        const nextRecords = await getUserRecords(uid);
        setRecords(nextRecords);
      } catch (err) {
        setRecordsError(err instanceof Error ? err.message : "Failed to load your records.");
      } finally {
        setRecordsLoading(false);
      }
    }

    if (user?.uid) {
      loadRecords(user.uid);
      return;
    }

    setRecords([]);
  }, [user?.uid]);

  const latestGpa = useMemo(() => {
    return records.find((record) => record.type === "gpa")?.score ?? 0;
  }, [records]);

  const latestCgpa = useMemo(() => {
    return records.find((record) => record.type === "cgpa")?.score ?? 0;
  }, [records]);

  const predictionCount = useMemo(() => {
    return records.filter((record) => record.type === "predict").length;
  }, [records]);

  const gpaTrend = useMemo(() => {
    const gpaRecords = records.filter((record) => record.type === "gpa");
    if (gpaRecords.length < 2) {
      return 0;
    }

    return Number((gpaRecords[0].score - gpaRecords[1].score).toFixed(2));
  }, [records]);

  const chartData = useMemo(() => {
    const sortedAsc = [...records]
      .sort((a, b) => a.createdAtMs - b.createdAtMs)
      .slice(-12);

    return sortedAsc.map((record, index) => ({
      index: index + 1,
      score: Number(record.score.toFixed(2)),
      type: formatRecordLabel(record),
    }));
  }, [records]);

  const topRecords = useMemo(() => {
    return [...records].sort((a, b) => b.score - a.score).slice(0, 3);
  }, [records]);

  const focusRecords = useMemo(() => {
    return records.filter((record) => record.score < 7).slice(0, 3);
  }, [records]);

  async function handleLogout() {
    const auth = getFirebaseAuth();
    await signOut(auth);
  }

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="text-center py-10">
            <p className="text-lg">Loading your dashboard...</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="text-center py-10">
            <h1 className="text-2xl font-bold mb-3">Firebase setup required</h1>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground mt-4">
              Set NEXT_PUBLIC_FIREBASE_API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET,
              MESSAGING_SENDER_ID, and APP_ID in your environment.
            </p>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="max-w-xl w-full">
          <GlassCard className="text-center py-10">
            <h1 className="text-3xl font-bold mb-3">Personal Dashboard</h1>
            <p className="text-muted-foreground mb-8">
              Login or register to view your own records, trends, and academic analytics.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/login">
                <AnimatedButton className="w-full sm:w-auto">Login</AnimatedButton>
              </Link>
              <Link href="/register">
                <AnimatedButton variant="outline" className="w-full sm:w-auto">Register</AnimatedButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Personal <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Welcome {user.displayName || user.email}. This dashboard is built from your saved records.
            </p>
          </div>
          <AnimatedButton
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4" />}
          >
            Logout
          </AnimatedButton>
        </motion.div>

        {recordsError ? (
          <GlassCard className="mb-6 border border-error/40">
            <p className="text-error text-sm">{recordsError}</p>
          </GlassCard>
        ) : null}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassCard>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Award className="w-4 h-4 text-primary" />
              Latest GPA
            </div>
            <div className="text-3xl font-bold text-primary">
              <AnimatedNumber value={latestGpa} decimals={2} />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              Latest CGPA
            </div>
            <div className="text-3xl font-bold text-success">
              <AnimatedNumber value={latestCgpa} decimals={2} />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <CreditCard className="w-4 h-4 text-warning" />
              Saved Records
            </div>
            <div className="text-3xl font-bold text-white">
              <AnimatedNumber value={records.length} decimals={0} />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Target className="w-4 h-4 text-primary" />
              Predictions
            </div>
            <div className="text-3xl font-bold text-white">
              <AnimatedNumber value={predictionCount} decimals={0} />
            </div>
          </GlassCard>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-primary" />
                  Performance Timeline
                </h2>
                <span className={`text-sm font-semibold ${gpaTrend >= 0 ? "text-success" : "text-error"}`}>
                  {gpaTrend >= 0 ? "+" : ""}
                  {gpaTrend.toFixed(2)} from previous GPA record
                </span>
              </div>

              {recordsLoading ? (
                <p className="text-muted-foreground">Loading records...</p>
              ) : chartData.length === 0 ? (
                <p className="text-muted-foreground">
                  No records yet. Save from GPA, CGPA, or Predictor pages to see your analytics.
                </p>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="dashScoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis dataKey="index" stroke="#94A3B8" tickLine={false} />
                      <YAxis domain={[0, 10]} stroke="#94A3B8" tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1E293B",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#F8FAFC",
                        }}
                        labelFormatter={(label) => `Record ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#6366F1"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#dashScoreGradient)"
                        dot={{ fill: "#6366F1", strokeWidth: 2, r: 5 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </GlassCard>

            <div className="grid sm:grid-cols-2 gap-6">
              <GlassCard>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-success" />
                  Top Records
                </h3>
                {topRecords.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No saved records yet.</p>
                ) : (
                  <div className="space-y-3">
                    {topRecords.map((record) => (
                      <div key={record.id} className="p-3 rounded-lg bg-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{formatRecordLabel(record)}</span>
                          <span className="font-bold text-success">{record.score.toFixed(2)}</span>
                        </div>
                        <p className="font-medium mt-1">{record.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>

              <GlassCard>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-warning" />
                  Focus Area
                </h3>
                {focusRecords.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No low-score records right now. Keep it up.</p>
                ) : (
                  <div className="space-y-3">
                    {focusRecords.map((record) => (
                      <div key={record.id} className="p-3 rounded-lg bg-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{formatRecordLabel(record)}</span>
                          <span className="font-bold text-warning">{record.score.toFixed(2)}</span>
                        </div>
                        <p className="font-medium mt-1">{record.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          </div>

          <div className="space-y-6">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-primary" />
                Recent Activity
              </h3>

              {records.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No activity yet. Save your calculations to build history.
                </p>
              ) : (
                <div className="space-y-3">
                  {records.slice(0, 8).map((record) => (
                    <div key={record.id} className="p-3 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                          {formatRecordLabel(record)}
                        </span>
                        <span className="font-semibold">{record.score.toFixed(2)}</span>
                      </div>
                      <p className="text-sm mt-1">{record.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(record.createdAtMs)}</p>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold mb-3">Save More Records</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use calculators and save snapshots to keep your dashboard updated.
              </p>
              <div className="grid grid-cols-1 gap-2">
                <Link href="/gpa-calculator" className="text-primary hover:underline">Go to GPA Calculator</Link>
                <Link href="/cgpa-calculator" className="text-primary hover:underline">Go to CGPA Calculator</Link>
                <Link href="/predict" className="text-primary hover:underline">Go to Predictor</Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
