import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GRADE_POINTS: Record<string, number> = {
  "O": 10,
  "A+": 9,
  "A": 8,
  "B+": 7,
  "B": 6,
};

// Valid grades that count towards GPA calculation
export const VALID_GRADES = ["O", "A+", "A", "B+", "B"];

// Grades to ignore in GPA calculation
export const IGNORE_GRADES = ["WH", "WD", "UA", "RA"];

// All valid grade patterns for OCR detection
export const VALID_GRADE_PATTERNS = ["O", "A+", "A", "B+", "B", "WH", "WD", "UA", "RA"];

export const GRADES = ["O", "A+", "A", "B+", "B"];

// Subject credits mapping database
export const SUBJECT_CREDITS: Record<string, number> = {
  // English & Communication
  "Professional English and Functional Skills": 4,
  "Technical English": 4,
  "English": 3,
  "Professional English": 3,
  
  // Mathematics
  "Calculus for Engineers": 4,
  "Calculus": 4,
  "Mathematics": 4,
  "Engineering Mathematics": 4,
  "Discrete Mathematics": 3,
  "Linear Algebra": 3,
  "Probability and Statistics": 3,
  "Numerical Methods": 3,
  
  // Physics
  "Engineering Physics": 3,
  "Physics": 3,
  "Physics and Chemistry Laboratory": 2,
  
  // Chemistry
  "Engineering Chemistry": 3,
  "Chemistry": 3,
  
  // Computer Science Core
  "Problem Solving and Python Programming": 3,
  "Problem Solving and Python Programming Laboratory": 2,
  "Data Structures and Algorithms": 4,
  "Database Management Systems": 3,
  "Computer Networks": 3,
  "Operating Systems": 3,
  "Software Engineering": 3,
  "Theory of Computation": 3,
  "Artificial Intelligence": 3,
  "Machine Learning": 3,
  "Data Science": 3,
  "Cyber Security": 3,
  "Cloud Computing": 3,
  "Web Development": 3,
  "Mobile Application Development": 3,
  "Internet of Things": 3,
  "Blockchain Technology": 3,
  
  // Engineering Common
  "Heritage of Tamils": 1,
  "Environmental Science": 2,
  "Engineering Graphics": 3,
  "Workshop Practice": 2,
  "Engineering Mechanics": 3,
  "Electric Circuit Theory": 3,
  "Electronic Devices": 3,
  "Digital Logic Design": 3,
  
  // Labs
  "Data Structures Laboratory": 2,
  "Database Laboratory": 2,
  "Networks Laboratory": 2,
  "Operating Systems Laboratory": 2,
  "Software Development Laboratory": 2,
  "Machine Learning Laboratory": 2,
};

// Default credits for unmapped subjects
export const DEFAULT_CREDITS = 3;

// Get credits for a subject name
export function getSubjectCredits(subjectName: string): number {
  // Normalize the subject name for matching
  const normalized = subjectName.toLowerCase().trim();
  
  // First, try exact match
  if (SUBJECT_CREDITS[subjectName]) {
    return SUBJECT_CREDITS[subjectName];
  }
  
  // Try case-insensitive match
  for (const [key, credits] of Object.entries(SUBJECT_CREDITS)) {
    if (key.toLowerCase() === normalized) {
      return credits;
    }
  }
  
  // Try partial match (subject name contains key)
  for (const [key, credits] of Object.entries(SUBJECT_CREDITS)) {
    if (normalized.includes(key.toLowerCase()) || key.toLowerCase().includes(normalized)) {
      return credits;
    }
  }
  
  return DEFAULT_CREDITS;
}

export function calculateGPA(subjects: Array<{ credits: number; grade: string }>): number {
  // Filter out invalid grades
  const validSubjects = subjects.filter(
    (s) => s.grade && VALID_GRADES.includes(s.grade) && s.credits > 0
  );
  
  if (validSubjects.length === 0) return 0;
  
  const totalCredits = validSubjects.reduce((sum, s) => sum + (s.credits || 0), 0);
  if (totalCredits === 0) return 0;
  
  const totalPoints = validSubjects.reduce((sum, s) => {
    const gradePoint = GRADE_POINTS[s.grade] || 0;
    return sum + (s.credits * gradePoint);
  }, 0);
  
  return Number((totalPoints / totalCredits).toFixed(2));
}

export function calculateCGPA(
  semesters: Array<{ gpa: number; credits: number }>
): number {
  if (semesters.length === 0) return 0;
  
  const totalCredits = semesters.reduce((sum, s) => sum + (s.credits || 0), 0);
  if (totalCredits === 0) return 0;
  
  const totalPoints = semesters.reduce((sum, s) => {
    return sum + (s.gpa * s.credits);
  }, 0);
  
  return Number((totalPoints / totalCredits).toFixed(2));
}

export function getGPAStatus(gpa: number): { label: string; color: string } {
  if (gpa >= 9) return { label: "Outstanding", color: "text-success" };
  if (gpa >= 8) return { label: "Excellent", color: "text-green-400" };
  if (gpa >= 7) return { label: "Good", color: "text-primary" };
  if (gpa >= 6) return { label: "Average", color: "text-warning" };
  return { label: "Needs Improvement", color: "text-error" };
}

export function formatNumber(num: number): string {
  return num.toFixed(2);
}

