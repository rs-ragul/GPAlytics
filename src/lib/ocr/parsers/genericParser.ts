/**
 * Generic University Parser
 * Works with most university result formats
 */

import { BaseParser, ParseStrategyResult, ParserOptions } from './baseParser';
import type { ParsedSubject } from '../subjectParser';
import { getSubjectCredits, suggestCanonicalSubjectName } from '../subjectCredits';
import { VALID_GRADE_PATTERNS, IGNORE_GRADES } from '../../utils';

const NOISE_PATTERNS = [
  /college/i, /university/i, /institute/i, /department/i,
  /semester/i, /result/i, /examination/i, /session/i,
  /register/i, /roll/i, /student/i, /candidate/i,
  /total/i, /sgpa/i, /cgpa/i, /gpa/i, /credit/i,
];

const STATUS_NOISE_REGEX = /\b(with\s*drawn|withdrawn|with\s*held|withheld|absent|detained|malpractice|reappear|arrear)\b/i;
const LEGEND_LINE_REGEX = /\bwd\b[^\n]*\bwh\b[^\n]*\bua\b[^\n]*\bra\b/i;

export class GenericParser extends BaseParser {
  constructor(options: ParserOptions = {}) {
    super(options);
  }

  getName(): string {
    return 'generic';
  }

  canParse(text: string): boolean {
    // Generic parser can handle any text with grades
    const hasGrades = ['0', ...VALID_GRADE_PATTERNS].some(g => 
      new RegExp(`\\b${escapeRegex(g)}\\b`, 'i').test(text)
    );
    return hasGrades;
  }

  parse(text: string): ParseStrategyResult {
    const processed = this.preprocess(text);
    const lines = processed.split('\n').filter(l => l.trim().length > 0);
    
    const subjects: ParsedSubject[] = [];
    const warnings: string[] = [];
    
    const escapedGrades = ['0', ...VALID_GRADE_PATTERNS].map((grade) => escapeRegex(grade));
    const gradePattern = new RegExp(`\\b(${escapedGrades.join('|')})\\b`, 'i');
    
    for (const line of lines) {
      if (LEGEND_LINE_REGEX.test(line)) {
        continue;
      }

      // Skip noise lines
      if (this.options.filterNoise && NOISE_PATTERNS.some(p => p.test(line)) && !hasLikelySubjectPayload(line)) {
        continue;
      }

      if (STATUS_NOISE_REGEX.test(line)) {
        continue;
      }
      
      const gradeMatch = line.match(gradePattern);
      if (!gradeMatch) continue;
      
      const grade = normalizeExtractedGrade(gradeMatch[1]);
      const gradeIndex = line.indexOf(gradeMatch[0]);
      
      // Extract subject name (text before or after grade)
      let subjectName = '';
      
      if (gradeIndex > 0) {
        subjectName = line.substring(0, gradeIndex).trim();
      }
      
      if (subjectName.length < 3) {
        const afterGrade = line.substring(gradeIndex + grade.length).trim();
        if (afterGrade.length > subjectName.length) {
          subjectName = afterGrade;
        }
      }
      
      // Remove subject codes (e.g., CS101, MA2122)
      if (this.options.removeCodes) {
        subjectName = subjectName.replace(/^[A-Z]{2,4}\d{2,4}\s*/gi, '');
      }
      
      // Clean up
      subjectName = subjectName
        .replace(/[0-9]/g, '')
        .replace(/[^a-zA-Z\s&]/g, '')
        .trim();

      if (STATUS_NOISE_REGEX.test(subjectName)) {
        continue;
      }

      subjectName = suggestCanonicalSubjectName(subjectName);
      
      if (subjectName.length < 3) continue;
      
      // Get credits
      const credits = getSubjectCredits(subjectName);
      
      // Calculate confidence
      let confidence = 0.8;
      if (subjectName.length > 10) confidence += 0.1;
      if (IGNORE_GRADES.includes(grade)) {
        confidence = 0.5;
        warnings.push(`Grade "${grade}" not counted in GPA`);
      }
      
      subjects.push({
        name: this.capitalizeName(subjectName),
        grade,
        credits,
        confidence,
        rawLine: line,
      });
    }
    
    // Remove duplicates
    const uniqueSubjects = this.removeDuplicates(subjects);
    
    return {
      subjects: uniqueSubjects,
      confidence: uniqueSubjects.length > 0 
        ? uniqueSubjects.reduce((s, p) => s + p.confidence, 0) / uniqueSubjects.length 
        : 0,
      warnings,
      strategy: 'generic',
    };
  }

  private capitalizeName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
      .trim();
  }

  private removeDuplicates(subjects: ParsedSubject[]): ParsedSubject[] {
    const seen = new Map<string, ParsedSubject>();
    
    for (const subject of subjects) {
      const key = subject.name.toLowerCase();
      const existing = seen.get(key);
      
      if (!existing || subject.confidence > existing.confidence) {
        seen.set(key, subject);
      }
    }
    
    return Array.from(seen.values());
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeExtractedGrade(value: string): string {
  const token = value.trim().toUpperCase();
  if (token === '0' || token === 'D' || token === 'Q') {
    return 'O';
  }
  return token;
}

function hasLikelySubjectPayload(line: string): boolean {
  const stripped = line
    .replace(/\b(O|0|A\+|A|B\+|B|C\+|C|WH|WD|UA|RA)\b/gi, ' ')
    .replace(/^semester\s*[ivx\d]+\s+/i, '')
    .replace(/^[a-z]{2,4}\d{3,5}\s+/i, '')
    .replace(/[^a-z\s&]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return stripped.split(' ').filter(Boolean).length >= 2;
}

