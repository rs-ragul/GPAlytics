"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Scan, 
  FileText, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Info,
  Calculator,
  Edit2,
  Trash2,
  Plus,
  RefreshCw
} from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { UploadZone } from "@/components/features/UploadZone";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { 
  calculateGPA, 
  GRADE_POINTS, 
  VALID_GRADE_PATTERNS,
  VALID_GRADES,
  getGPAStatus
} from "@/lib/utils";
import { processOCR } from "@/lib/ocr/ocrService";
import { getSubjectCredits } from "@/lib/ocr/subjectCredits";

interface ExtractedSubject {
  id: string;
  name: string;
  grade: string;
  credits: number;
  confidence: number;
}

interface GradeImpact {
  subject: string;
  currentGrade: string;
  currentPoints: number;
  improvedGrade: string;
  improvedPoints: number;
  gpaImprovement: number;
}

const GRADE_OPTIONS = ["O", "A+", "A", "B+", "B", "C+", "C", "WH", "WD", "UA", "RA"];
const CREDIT_OPTIONS = [1, 2, 3, 4];

export default function ScanPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [extractedSubjects, setExtractedSubjects] = useState<ExtractedSubject[]>([]);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);

  // Calculate GPA from extracted subjects
  const { calculatedGPA, totalCredits, totalGradePoints } = useMemo(() => {
    const validSubjects = extractedSubjects.filter(
      (s) =>
        s.name.trim().length > 0 &&
        s.credits > 0 &&
        s.grade &&
        VALID_GRADES.includes(s.grade)
    );
    
    const gpa = calculateGPA(validSubjects.map((s) => ({
      credits: s.credits,
      grade: s.grade
    })));
    
    const credits = validSubjects.reduce((sum, s) => sum + s.credits, 0);
    const gradePoints = validSubjects.reduce((sum, s) => {
      return sum + (s.credits * (GRADE_POINTS[s.grade] || 0));
    }, 0);
    
    return { 
      calculatedGPA: gpa, 
      totalCredits: credits, 
      totalGradePoints: gradePoints 
    };
  }, [extractedSubjects]);

  // Calculate potential GPA improvements
  const gradeImpacts = useMemo((): GradeImpact[] => {
    if (extractedSubjects.length === 0 || calculatedGPA === 0) return [];
    
    const impacts: GradeImpact[] = [];
    const validSubjects = extractedSubjects.filter(
      (s) =>
        s.name.trim().length > 0 &&
        s.credits > 0 &&
        s.grade &&
        VALID_GRADES.includes(s.grade)
    );
    
    // Current total grade points
    const currentTotalPoints = validSubjects.reduce(
      (sum, s) => sum + s.credits * (GRADE_POINTS[s.grade] || 0), 0
    );
    const currentTotalCredits = validSubjects.reduce((sum, s) => sum + s.credits, 0);
    
    if (currentTotalCredits === 0) return [];
    
    // Check improvements for each subject
    for (const subject of validSubjects) {
      const currentGradePoint = GRADE_POINTS[subject.grade] || 0;
      
      // Check if can improve to O (10 points)
      if (currentGradePoint < 10) {
        const improvedPoints = 10;
        const newTotalPoints = currentTotalPoints - (subject.credits * currentGradePoint) + (subject.credits * improvedPoints);
        const newGPA = newTotalPoints / currentTotalCredits;
        const improvement = newGPA - calculatedGPA;
        
        if (improvement > 0) {
          impacts.push({
            subject: subject.name,
            currentGrade: subject.grade,
            currentPoints: currentGradePoint,
            improvedGrade: "O",
            improvedPoints: improvedPoints,
            gpaImprovement: improvement
          });
        }
      }
    }
    
    // Sort by biggest improvement first
    return impacts.sort((a, b) => b.gpaImprovement - a.gpaImprovement);
  }, [extractedSubjects, calculatedGPA]);

  // Process image with new OCR pipeline
  const processImage = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setStatus("processing");
    setError("");
    setWarnings([]);
    setExtractedSubjects([]);
    setIsEditing(false);

    try {
      const result = await processOCR(file, {
        preprocessImage: true,
        useAdvancedParsing: true,
        onProgress: (progress) => {
          setProgress(progress.progress);
          setStatusMessage(progress.status);
        }
      });

      // Convert parsed subjects to editable format
      const subjects: ExtractedSubject[] = result.subjects.map((s, index) => ({
        id: `subject-${Date.now()}-${index}`,
        name: s.name,
        grade: s.grade,
        credits: s.credits,
        confidence: s.confidence
      }));

      if (subjects.length === 0) {
        setExtractedSubjects([
          { id: `subject-${Date.now()}-0`, name: "", grade: "", credits: 3, confidence: 0 },
          { id: `subject-${Date.now()}-1`, name: "", grade: "", credits: 3, confidence: 0 },
        ]);
        setWarnings([
          "OCR could not confidently detect subject rows from this image.",
          "Please fill/edit the table manually and continue.",
          ...result.warnings,
        ]);
        setStatus("success");
        setIsEditing(true);
        return;
      }

      setExtractedSubjects(subjects);
      setWarnings(result.warnings);
      setStatus("success");
      setIsEditing(true); // Start in edit mode for user verification
    } catch (err) {
      console.error("OCR Error:", err);
      setStatus("error");
      setError("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Add new subject row
  const addSubject = useCallback(() => {
    const newSubject: ExtractedSubject = {
      id: `subject-${Date.now()}`,
      name: "",
      grade: "",
      credits: 3,
      confidence: 0
    };
    setExtractedSubjects([...extractedSubjects, newSubject]);
    setIsEditing(true);
  }, [extractedSubjects]);

  // Update subject field
  const updateSubject = useCallback((id: string, field: keyof ExtractedSubject, value: string | number) => {
    setExtractedSubjects(prev => 
      prev.map(s => {
        if (s.id === id) {
          const updated = { ...s, [field]: value };
          // Auto-update credits when name changes
          if (field === 'name' && typeof value === 'string') {
            updated.credits = getSubjectCredits(value);
          }
          return updated;
        }
        return s;
      })
    );
  }, []);

  // Remove subject
  const removeSubject = useCallback((id: string) => {
    setExtractedSubjects(prev => prev.filter(s => s.id !== id));
  }, []);

  // Get GPA status
  const gpaStatus = getGPAStatus(calculatedGPA);

  // Get unique warnings
  const uniqueWarnings = useMemo(() => {
    return [...new Set(warnings)];
  }, [warnings]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Result <span className="gradient-text">Scanner</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload a screenshot of your results and auto-extract your grades
          </p>
        </motion.div>

        {/* Upload Zone */}
        <GlassCard className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Scan className="w-5 h-5 text-primary" />
            Upload Result Image
          </h2>
          <UploadZone
            onFileSelect={processImage}
            isProcessing={isProcessing}
            progress={progress}
            status={status}
          />
          {status === "processing" && statusMessage && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Analyzing result screenshot...
            </p>
          )}
        </GlassCard>

        {/* Results */}
        {status === "success" && extractedSubjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Section 1: Performance Status */}
            <GlassCard className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${calculatedGPA >= 9 ? 'bg-success/20' : calculatedGPA >= 8 ? 'bg-green-500/20' : calculatedGPA >= 7 ? 'bg-primary/20' : 'bg-warning/20'}`}>
                    <Award className={`w-8 h-8 ${calculatedGPA >= 9 ? 'text-success' : calculatedGPA >= 8 ? 'text-green-400' : calculatedGPA >= 7 ? 'text-primary' : 'text-warning'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Performance Status</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on {extractedSubjects.filter(s => s.name.trim().length > 0 && s.credits > 0 && VALID_GRADES.includes(s.grade)).length} subjects
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-success">
                    <AnimatedNumber value={calculatedGPA} decimals={2} />
                  </div>
                  <div className={`text-lg font-medium ${gpaStatus.color}`}>
                    {gpaStatus.label}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Section 2: Calculation Summary */}
            <GlassCard className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Calculation Summary
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="text-3xl font-bold text-white">
                    <AnimatedNumber value={totalCredits} decimals={0} />
                  </div>
                  <div className="text-sm text-muted-foreground">Total Credits</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="text-3xl font-bold text-white">
                    <AnimatedNumber value={totalGradePoints} decimals={0} />
                  </div>
                  <div className="text-sm text-muted-foreground">Total Grade Points</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="text-3xl font-bold text-success">
                    <AnimatedNumber value={calculatedGPA} decimals={2} />
                  </div>
                  <div className="text-sm text-muted-foreground">Calculated SGPA</div>
                </div>
              </div>
            </GlassCard>

            {/* Section 3: Manual Correction UI */}
            <GlassCard className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Manual Correction Table
                  {isEditing && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                      Edit Mode
                    </span>
                  )}
                </h3>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Done
                      </button>
                      <button
                        onClick={addSubject}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Subject
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Warnings */}
              {uniqueWarnings.length > 0 && isEditing && (
                <div className="mb-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                  <p className="text-sm text-warning font-medium mb-1">Attention:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {uniqueWarnings.slice(0, 5).map((warning, i) => (
                      <li key={i}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Subject Table */}
              <div className="space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-white/5 rounded-lg">
                  <div className="col-span-5">Subject</div>
                  <div className="col-span-3">Credits</div>
                  <div className="col-span-3">Grade</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Subject Rows */}
                {extractedSubjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    className="grid grid-cols-12 gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/5 items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {isEditing ? (
                      // Edit Mode
                      <>
                        <div className="col-span-5">
                          <input
                            type="text"
                            value={subject.name}
                            onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                            placeholder="Subject name"
                            className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-primary/50"
                          />
                        </div>
                        <div className="col-span-3">
                          <select
                            value={subject.credits}
                            onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-primary/50"
                          >
                            {CREDIT_OPTIONS.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-3">
                          <select
                            value={subject.grade}
                            onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none ${
                              !subject.grade || VALID_GRADE_PATTERNS.includes(subject.grade)
                                ? 'bg-white/10 border border-white/10' 
                                : 'bg-warning/20 border border-warning/50'
                            }`}
                          >
                            <option value="">Select</option>
                            {GRADE_OPTIONS.map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button
                            onClick={() => removeSubject(subject.id)}
                            className="p-2 text-error hover:bg-error/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      // View Mode
                      <>
                        <div className="col-span-5 flex items-center gap-3">
                          <CheckCircle className={`w-5 h-5 ${subject.grade && VALID_GRADE_PATTERNS.includes(subject.grade) ? 'text-success' : 'text-warning'}`} />
                          <div>
                            <div className="font-medium">{subject.name || "Unknown"}</div>
                            {subject.confidence > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {Math.round(subject.confidence * 100)}% confidence
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-span-3 text-muted-foreground">
                          {subject.credits} credits
                        </div>
                        <div className="col-span-3">
                          <span
                            className={`px-3 py-1 rounded-lg font-bold ${
                              subject.grade === "O"
                                ? "bg-success/20 text-success"
                                : subject.grade === "A+"
                                ? "bg-green-500/20 text-green-400"
                                : subject.grade === "A"
                                ? "bg-primary/20 text-primary"
                                : subject.grade === "B+"
                                ? "bg-warning/20 text-warning"
                                : subject.grade === "B"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-white/10 text-muted-foreground"
                            }`}
                          >
                            {subject.grade || "-"}
                          </span>
                        </div>
                        <div className="col-span-1"></div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Section 4: GPA Impact Analyzer */}
            {gradeImpacts.length > 0 && !isEditing && (
              <GlassCard className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  GPA Impact Analyzer
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  See how improving your grades can boost your GPA:
                </p>
                <div className="space-y-3">
                  {gradeImpacts.slice(0, 5).map((impact, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div>
                        <div className="font-medium">{impact.subject}</div>
                        <div className="text-sm text-muted-foreground">
                          {impact.currentGrade} → {impact.improvedGrade}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-success">
                          +{impact.gpaImprovement.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          GPA points
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            )}
          </motion.div>
        )}

        {/* Error State */}
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="border-error/30">
              <div className="flex items-center gap-3 text-error">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Scan Failed</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Tips */}
        <GlassCard className="mt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            Tips for Better Results
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
              Use a clear, well-lit image
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
              Ensure text is readable and not blurred
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
              Include the grade column in the image
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
              Avoid shadows and glare on the image
            </li>
            <li className="flex items-start gap-2">
              <RefreshCw className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              Review and edit detected subjects for accuracy
            </li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

