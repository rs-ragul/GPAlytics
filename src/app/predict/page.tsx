"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, AlertCircle, CheckCircle, Calculator, Info } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { predictFutureCGPA } from "@/lib/insights";
import { cn } from "@/lib/utils";

export default function PredictPage() {
  const [currentCGPA, setCurrentCGPA] = useState(8.0);
  const [currentCredits, setCurrentCredits] = useState(40);
  const [targetCGPA, setTargetCGPA] = useState(8.5);
  const [semestersRemaining, setSemestersRemaining] = useState(2);
  const [creditsPerSemester, setCreditsPerSemester] = useState(20);

  const result = useMemo(() => {
    const futureCredits = semestersRemaining * creditsPerSemester;
    return predictFutureCGPA(
      currentCGPA,
      currentCredits,
      targetCGPA,
      futureCredits
    );
  }, [currentCGPA, currentCredits, targetCGPA, semestersRemaining, creditsPerSemester]);

  const totalFutureCredits = semestersRemaining * creditsPerSemester;
  const totalCredits = currentCredits + totalFutureCredits;
  const predictedCGPA = result.achievable && result.requiredGPA !== null
    ? ((currentCGPA * currentCredits + result.requiredGPA * totalFutureCredits) / totalCredits)
    : 0;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            CGPA <span className="gradient-text">Goal Simulator</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Plan your academic journey and achieve your target CGPA
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Current Stats */}
            <GlassCard>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Current Academic Status
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current CGPA
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={currentCGPA}
                    onChange={(e) => setCurrentCGPA(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-lg text-center focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Total Credits
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentCredits}
                    onChange={(e) => setCurrentCredits(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-lg text-center focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Goal Settings */}
            <GlassCard>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Goal Settings
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Target CGPA</label>
                    <span className="text-primary font-bold">{targetCGPA.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={targetCGPA}
                    onChange={(e) => setTargetCGPA(parseFloat(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Semesters Remaining</label>
                    <span className="text-primary font-bold">{semestersRemaining}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={semestersRemaining}
                    onChange={(e) => setSemestersRemaining(parseInt(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Credits Per Semester</label>
                    <span className="text-primary font-bold">{creditsPerSemester}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    step="1"
                    value={creditsPerSemester}
                    onChange={(e) => setCreditsPerSemester(parseInt(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Result Card */}
            <GlassCard className={cn(
              "text-center",
              result.achievable ? "border-success/30" : "border-error/30"
            )}>
              <div className="flex items-center justify-center gap-2 mb-4">
                {result.achievable ? (
                  <CheckCircle className="w-6 h-6 text-success" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-error" />
                )}
                <h3 className="text-lg font-semibold">
                  {result.achievable ? "Goal Achievable! 🎉" : "Goal Not Achievable"}
                </h3>
              </div>

              {result.achievable && result.requiredGPA !== null ? (
                <>
                  <div className="text-sm text-muted-foreground mb-2">
                    Required GPA for next {semestersRemaining} semester(s):
                  </div>
                  <motion.div
                    className={cn(
                      "text-5xl font-bold mb-2",
                      result.requiredGPA > 10 ? "text-error" : "text-success"
                    )}
                    key={result.requiredGPA}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {result.requiredGPA > 10 ? "10.00" : result.requiredGPA.toFixed(2)}
                  </motion.div>
                  <div className="text-sm text-muted-foreground">
                    per semester
                  </div>

                  {/* Predicted CGPA */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="text-sm text-muted-foreground mb-1">
                      Predicted Final CGPA
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      <AnimatedNumber value={predictedCGPA} decimals={2} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-4">
                  <p className="text-error">
                    It's not mathematically possible to achieve this target CGPA 
                    with the given number of semesters.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try increasing the number of semesters or lowering your target.
                  </p>
                </div>
              )}
            </GlassCard>

            {/* Summary */}
            <GlassCard>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-primary" />
                Calculation Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-muted-foreground">Current CGPA</span>
                  <span className="font-medium">{currentCGPA.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-muted-foreground">Current Credits</span>
                  <span className="font-medium">{currentCredits}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-muted-foreground">Future Credits</span>
                  <span className="font-medium">{totalFutureCredits}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-muted-foreground">Total Credits</span>
                  <span className="font-medium">{totalCredits}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-muted-foreground">Target CGPA</span>
                  <span className="font-medium">{targetCGPA.toFixed(2)}</span>
                </div>
              </div>
            </GlassCard>

            {/* Info */}
            <GlassCard className="bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">How it works</p>
                  The calculator uses weighted average to determine what GPA you need 
                  in your remaining semesters to achieve your target CGPA. Each semester's 
                  credits are factored into the final calculation.
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

