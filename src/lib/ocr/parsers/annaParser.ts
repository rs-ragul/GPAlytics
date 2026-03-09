/**
 * Anna University Parser
 * Specialized parser for Anna University result formats
 */

import { BaseParser, ParseStrategyResult, ParserOptions } from './baseParser';
import type { ParsedSubject } from '../subjectParser';
import { getSubjectCredits, suggestCanonicalSubjectName } from '../subjectCredits';
import { VALID_GRADE_PATTERNS, IGNORE_GRADES } from '../../utils';

// Anna University specific patterns
const ANNA_PATTERNS = {
  // Subject codes typically have format like CY2112, MA2151, etc.
  subjectCode: /^[A-Z]{2}\d{4}\s*/,
  
  // Grade patterns specific to Anna University
  gradeWithCredits: /(\d+)\s*(\([^)]+\))?\s*$/,
  
  // Semester header pattern
  semesterHeader: /semester\s*[-]?\s*\d+/i,
  
  // Result table header
  tableHeader: /s\.no|subject\s*code|subject\s*name|grade|credit/i,
};

const NOISE_PATTERNS = [
  /anna\s*university/i,
  /affiliated\s*colleges/i,
  /controller\s*of\s*examinations/i,
  /examination\s*results/i,
  /grade\s*sheet/i,
  /semester\s*\d+/i,
  /page/i,
  /contd/i,
];

const STATUS_NOISE_REGEX = /\b(with\s*drawn|withdrawn|with\s*held|withheld|absent|detained|malpractice|reappear|arrear)\b/i;
const LEGEND_LINE_REGEX = /\bwd\b[^\n]*\bwh\b[^\n]*\bua\b[^\n]*\bra\b/i;

export class AnnaParser extends BaseParser {
  constructor(options: ParserOptions = {}) {
    super({
      ...options,
      removeCodes: options.removeCodes ?? true,
      filterNoise: options.filterNoise ?? true,
    });
  }

  getName(): string {
    return 'anna_university';
  }

  canParse(text: string): boolean {
    // Check for Anna University specific patterns
    const hasAnnaKeyword = /anna\s*university/i.test(text);
    const hasSubjectCodes = ANNA_PATTERNS.subjectCode.test(text);
    const hasStandardGrades = ['0', ...VALID_GRADE_PATTERNS].some(g => 
      new RegExp(`\\b${escapeRegex(g)}\\b`, 'i').test(text)
    );
    
    return (hasAnnaKeyword || hasSubjectCodes) && hasStandardGrades;
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
      if (this.options.filterNoise && NOISE_PATTERNS.some(p => p.test(line))) {
        continue;
      }
      
      // Skip semester headers
      if (ANNA_PATTERNS.semesterHeader.test(line)) {
        continue;
      }
      
      // Skip table headers
      if (ANNA_PATTERNS.tableHeader.test(line)) {
        continue;
      }
      
      const gradeMatch = line.match(gradePattern);
      if (!gradeMatch) continue;

      if (STATUS_NOISE_REGEX.test(line)) {
        continue;
      }
      
      const grade = normalizeExtractedGrade(gradeMatch[1]);
      const gradeIndex = line.indexOf(gradeMatch[0]);
      
      // Extract subject name
      let subjectName = '';
      
      // Try text before grade first
      if (gradeIndex > 0) {
        subjectName = line.substring(0, gradeIndex).trim();
      }
      
      // If too short, try after grade
      if (subjectName.length < 3) {
        const afterGrade = line.substring(gradeIndex + grade.length).trim();
        if (afterGrade.length > subjectName.length) {
          subjectName = afterGrade;
        }
      }
      
      // Remove Anna University subject codes (e.g., CY2112, MA2151)
      if (this.options.removeCodes) {
        subjectName = subjectName.replace(ANNA_PATTERNS.subjectCode, '');
      }
      
      // Clean up
      subjectName = subjectName
        .replace(/\d+/g, '') // Remove remaining numbers
        .replace(/[^a-zA-Z\s&]/g, '')
        .trim();

      if (STATUS_NOISE_REGEX.test(subjectName)) continue;
      
      // Remove common words
      subjectName = this.removeCommonWords(subjectName);
      subjectName = suggestCanonicalSubjectName(subjectName);
      
      if (subjectName.length < 3) continue;
      
      // Get credits
      const credits = getSubjectCredits(subjectName);
      
      // Calculate confidence
      let confidence = 0.85; // Higher confidence for specific parser
      
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
      strategy: 'anna_university',
    };
  }

  private removeCommonWords(subjectName: string): string {
    const wordsToRemove = [
      'theory', 'practical', 'lab', 'tutorial', 
      'internal', 'external', 'total',
      'subject', 'course', 'code'
    ];
    
    let cleaned = subjectName;
    for (const word of wordsToRemove) {
      cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
    }
    
    return cleaned.replace(/\s+/g, ' ').trim();
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

