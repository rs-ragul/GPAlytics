import { GRADE_POINTS } from "./utils";

export interface Subject {
  name: string;
  credits: number;
  grade: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: "success" | "warning" | "info";
  icon: string;
}

export function generateInsights(subjects: Subject[]): Insight[] {
  const insights: Insight[] = [];
  
  if (subjects.length === 0) {
    return [{
      id: "empty",
      title: "Add Your Subjects",
      description: "Start by adding your subjects to get personalized insights about your academic performance.",
      type: "info",
      icon: "info"
    }];
  }

  // Calculate GPA
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const totalPoints = subjects.reduce((sum, s) => {
    return sum + (s.credits * (GRADE_POINTS[s.grade] || 0));
  }, 0);
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

  // Insight 1: Overall GPA performance
  if (gpa > 8.5) {
    insights.push({
      id: "outstanding",
      title: "Outstanding Performance! 🌟",
      description: "Your GPA is excellent. Keep up the outstanding work! You're performing at the highest level.",
      type: "success",
      icon: "trophy"
    });
  } else if (gpa >= 7 && gpa <= 8.5) {
    insights.push({
      id: "good-standing",
      title: "Good Academic Standing",
      description: "You're performing well. Consider focusing on high-credit subjects to push your GPA higher.",
      type: "info",
      icon: "trending-up"
    });
  } else if (gpa < 7) {
    insights.push({
      id: "needs-focus",
      title: "Focus on Improvement",
      description: "Focus on high credit subjects next semester to significantly boost your GPA.",
      type: "warning",
      icon: "target"
    });
  }

  // Insight 2: High credit subjects with lower grades
  const weakSubjects = subjects.filter(s => 
    s.credits >= 4 && (GRADE_POINTS[s.grade] || 0) < 8
  );
  
  if (weakSubjects.length > 0) {
    const subject = weakSubjects[0];
    const currentPoints = GRADE_POINTS[subject.grade] || 0;
    const maxPoints = 10;
    const potentialImprovement = ((maxPoints - currentPoints) * subject.credits / totalCredits).toFixed(2);
    
    insights.push({
      id: "improve-high-credit",
      title: `Boost ${subject.name}`,
      description: `Improving "${subject.name}" (${subject.credits} credits) from ${subject.grade} to O could increase your GPA by approximately ${potentialImprovement} points.`,
      type: "warning",
      icon: "zap"
    });
  }

  // Insight 3: All excellent grades
  const allExcellent = subjects.every(s => (GRADE_POINTS[s.grade] || 0) >= 9);
  if (allExcellent && subjects.length >= 3) {
    insights.push({
      id: "exceptional",
      title: "Exceptional Performance! 🎯",
      description: "You're achieving the highest grades across all subjects. Maintain this excellent trajectory!",
      type: "success",
      icon: "star"
    });
  }

  // Insight 4: Credits-based advice
  if (totalCredits > 20 && gpa < 8) {
    insights.push({
      id: "high-load",
      title: "Consider Additional Support",
      description: "With a high credit load and GPA below 8, consider visiting professor office hours for challenging subjects.",
      type: "warning",
      icon: "users"
    });
  }

  // Insight 5: Trend analysis (if multiple subjects)
  if (subjects.length >= 4) {
    const sortedByCredits = [...subjects].sort((a, b) => b.credits - a.credits);
    const lowGrades = subjects.filter(s => (GRADE_POINTS[s.grade] || 0) < 7);
    
    if (lowGrades.length > 0 && sortedByCredits[0].credits >= 3) {
      insights.push({
        id: "priority-subject",
        title: "Priority Focus Area",
        description: `Your highest credit subject is "${sortedByCredits[0].name}". Ensuring strong performance here will have the biggest impact on your GPA.`,
        type: "info",
        icon: "alert-circle"
      });
    }
  }

  // Insight 6: Balanced performance
  const gradeValues = subjects.map(s => GRADE_POINTS[s.grade] || 0);
  const avgGrade = gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length;
  const variance = gradeValues.reduce((sum, g) => sum + Math.pow(g - avgGrade, 2), 0) / gradeValues.length;
  
  if (variance < 1 && subjects.length >= 3) {
    insights.push({
      id: "consistent",
      title: "Consistent Performance",
      description: "You have consistent grades across subjects. Keep maintaining this balance!",
      type: "success",
      icon: "check-circle"
    });
  }

  // Limit to 5 insights
  return insights.slice(0, 5);
}

export function predictFutureCGPA(
  currentCGPA: number,
  currentCredits: number,
  targetCGPA: number,
  futureCredits: number
): { achievable: boolean; requiredGPA: number | null } {
  if (futureCredits === 0) {
    return { achievable: true, requiredGPA: null };
  }

  const totalFutureCredits = currentCredits + futureCredits;
  const requiredPoints = targetCGPA * totalFutureCredits;
  const currentPoints = currentCGPA * currentCredits;
  const requiredFuturePoints = requiredPoints - currentPoints;
  const requiredGPA = requiredFuturePoints / futureCredits;

  return {
    achievable: requiredGPA <= 10 && requiredGPA >= 0,
    requiredGPA: Number(requiredGPA.toFixed(2))
  };
}

