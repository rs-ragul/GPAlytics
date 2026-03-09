"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Tesseract from "tesseract.js";
import { 
  Scan, 
  FileText, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Info,
  Calculator
} from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { UploadZone } from "@/components/features/UploadZone";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { 
  calculateGPA, 
  GRADE_POINTS, 
  VALID_GRADE_PATTERNS,
  getSubjectCredits,
  VALID_GRADES,
  getGPAStatus
} from "@/lib/utils";

interface ExtractedSubject {
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

// Words to trim from subject names
const TRIM_WORDS = [
  "semester", "course", "college", "register", "name", 
  "subject", "code", "grade", "result", "examination",
  "internal", "external", "total", "credits", "credit"
];

// Common non-subject patterns to filter out
const NOISE_PATTERNS = [
  /psna/i,
  /nba/i,
  /aicte/i,
  /naac/i,
  /university/i,
  /institute/i,
  /college/i,
  /department/i,
  /affiliated/i,
  /autonomous/i,
  /approved/i,
  / accredited/i,
  /session/i,
  /roll no/i,
  /register no/i,
  /student/i,
  /candidate/i,
  /signature/i,
  /date/i,
  /page/i,
  /contd/i,
  /continued/i,
];

export default function ScanPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [extractedText, setExtractedText] = useState("");
  const [extractedSubjects, setExtractedSubjects] = useState<ExtractedSubject[]>([]);
  const [error, setError] = useState("");

  // Calculate GPA from extracted subjects
  const { calculatedGPA, totalCredits, totalGradePoints } = useMemo(() => {
    const validSubjects = extractedSubjects.filter(
      (s) => s.grade && VALID_GRADES.includes(s.grade)
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
      (s) => s.grade && VALID_GRADES.includes(s.grade)
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

  const parseExtractedText = (text: string): ExtractedSubject[] => {
    const subjects: ExtractedSubject[] = [];
    const lines = text.split("\n").filter((line) => line.trim());

    // Build regex pattern for valid grades
    const gradePattern = new RegExp(`\\b(${VALID_GRADE_PATTERNS.join("|")})\\b`, "i");
    
    // Find subject-grade pairs
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty or very short lines
      if (trimmedLine.length < 3) continue;
      
      // Check if line contains a valid grade pattern
      const gradeMatch = trimmedLine.match(gradePattern);
      
      if (!gradeMatch) continue;
      
      // Check for noise patterns
      const isNoise = NOISE_PATTERNS.some(pattern => pattern.test(trimmedLine));
      if (isNoise) continue;
      
      const foundGrade = gradeMatch[1];
      const gradeIndex = trimmedLine.indexOf(foundGrade);
      
      // Extract subject name (text before the grade)
      let subjectName = trimmedLine.substring(0, gradeIndex).trim();
      
      // Also check for subject name after grade (some formats have grade first)
      if (subjectName.length < 3) {
        const afterGrade = trimmedLine.substring(gradeIndex + foundGrade.length).trim();
        if (afterGrade.length > subjectName.length) {
          subjectName = afterGrade;
        }
      }
      
      // Remove numbers and extra characters
      subjectName = subjectName.replace(/[0-9]/g, "").replace(/[^a-zA-Z\s&]/g, "").trim();
      
      // Trim unnecessary words
      for (const word of TRIM_WORDS) {
        const wordPattern = new RegExp(`\\b${word}\\b`, "gi");
        subjectName = subjectName.replace(wordPattern, "").trim();
      }
      
      // Capitalize first letter of each word
      subjectName = subjectName
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
        .trim();

      // Get credits using the mapping
      const credits = getSubjectCredits(subjectName);

      if (subjectName.length > 2) {
        subjects.push({
          name: subjectName,
          grade: foundGrade.toUpperCase(),
          credits,
          confidence: 0.8,
        });
      }
    }

    return subjects;
  };

  const processImage = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setStatus("processing");
    setError("");
    setExtractedSubjects([]);

    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(m.progress * 100);
          }
        },
      });

      const text = result.data.text;
      setExtractedText(text);

      // Parse the extracted text
      const subjects = parseExtractedText(text);
      
      if (subjects.length === 0) {
        setStatus("error");
        setError("Could not detect any subjects. Please try a clearer image.");
        return;
      }

      // Filter valid grades only
      const validSubjects = subjects.filter((s) => VALID_GRADES.includes(s.grade));

      if (validSubjects.length === 0) {
        setStatus("error");
        setError("Could not detect valid grades (O, A+, A, B+, B). Please try a clearer image.");
        return;
      }

      setExtractedSubjects(validSubjects);
      setStatus("success");
    } catch (err) {
      console.error("OCR Error:", err);
      setStatus("error");
      setError("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Get GPA status
  const gpaStatus = getGPAStatus(calculatedGPA);

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
            Result <span className="gradient-text">Scanner</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload a screenshot of your results and let AI extract your grades
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
                      Based on {extractedSubjects.length} subjects
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

            {/* Section 3: Detected Subjects */}
            <GlassCard className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Detected Subjects
              </h3>
              <div className="space-y-3">
                {extractedSubjects.map((subject, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <div>
                        <div className="font-medium">{subject.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {subject.credits} credits
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                            : "bg-orange-500/20 text-orange-400"
                        }`}
                      >
                        {subject.grade}
                      </span>
                      <span className="text-muted-foreground">
                        ({GRADE_POINTS[subject.grade]})
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Section 4: GPA Impact Analyzer */}
            {gradeImpacts.length > 0 && (
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
              Include the grade scale in the image if possible
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
              Avoid shadows and glare on the image
            </li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

