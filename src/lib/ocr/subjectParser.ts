/**
 * Subject Parser
 * Parses OCR text to extract subject names and grades
 */

import { 
  VALID_GRADE_PATTERNS, 
  VALID_GRADES, 
  IGNORE_GRADES
} from '../utils';
import {
  normalizeText,
  splitIntoLines,
  cleanLine,
  isNoiseLine,
  trimSubjectWords,
  removeSubjectCodes,
  capitalizeSubjectName,
} from './textNormalizer';
import { getSubjectCredits, suggestCanonicalSubjectName } from './subjectCredits';
import { defaultRegistry } from './parsers';

export interface ParsedSubject {
  name: string;
  grade: string;
  credits: number;
  confidence: number;
  rawLine: string;
}

export interface ParseResult {
  subjects: ParsedSubject[];
  rawText: string;
  confidence: number;
  warnings: string[];
}

// Noise patterns to filter out
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
  /total/i,
  /grade/i,
  /credit/i,
  /point/i,
  /sgpa/i,
  /cgpa/i,
  /gpa/i,
  /result/i,
  /examination/i,
  /semester/i,
];

const VALID_GRADE_LINE_REGEX = /\b(O|0|A\+|A|B\+|B|C\+|C|WH|WD|UA|RA)\b/i;
const SUBJECT_GRADE_END_REGEX = /(.+?)\s+(O|0|A\+|A|B\+|B|C\+|C|WH|WD|UA|RA)$/i;
const STATUS_NOISE_REGEX = /\b((with|zwith|wth)\s*drawn|withdrawn|drawn|with\s*held|withheld|held|absent|detained|malpractice|reappear|reappearance|arrear)\b/i;
const HEADER_ROW_REGEX = /\b(sem\s*code|sub\s*code|subject\s*name|grade|credits?)\b/i;
const SEMESTER_ROW_REGEX = /^semester\s*[ivx\d]+\s+[a-z]{2,4}\d{3,5}\s+.+\s+(O|0|A\+|A|B\+|B|C\+|C|WH|WD|UA|RA)$/i;
const SUBCODE_ROW_REGEX = /^[a-z]{2,4}\d{3,5}\s+.+\s+(O|0|A\+|A|B\+|B|C\+|C|WH|WD|UA|RA)$/i;
const LEGEND_LINE_REGEX = /\bwd\b[^\n]*\bwh\b[^\n]*\bua\b[^\n]*\bra\b/i;

/**
 * Parse OCR text to extract subjects and grades
 */
export function parseOCRText(text: string): ParseResult {
  const warnings: string[] = [];
  
  // Normalize the text
  const normalizedText = normalizeText(text);
  
  // Split into lines
  const lines = splitIntoLines(normalizedText);
  
  const subjects: ParsedSubject[] = [];

  // Step 4: table-like row detection using grade presence + noise filtering.
  const candidateRows = detectSubjectRows(lines, warnings);

  // Step 5: subject + grade extraction.
  for (const row of candidateRows) {
    const extracted = extractSubjectAndGrade(row);
    if (!extracted) {
      warnings.push(`Skipped unparseable row: ${row.substring(0, 60)}...`);
      continue;
    }

    let subjectName = trimSubjectWords(removeSubjectCodes(extracted.subjectName));
    if (STATUS_NOISE_REGEX.test(subjectName)) {
      warnings.push(`Filtered status row: ${row.substring(0, 60)}...`);
      continue;
    }
    // Keep grade-line extraction primary; canonical mapping is a soft refinement only.
    subjectName = suggestCanonicalSubjectName(subjectName);
    subjectName = capitalizeSubjectName(subjectName);

    if (!subjectName || subjectName.length < 3) {
      warnings.push(`Skipped row with short subject name: ${row}`);
      continue;
    }

    if (IGNORE_GRADES.includes(extracted.grade) && subjectName.split(' ').filter(Boolean).length < 2) {
      warnings.push(`Filtered likely status row for ${extracted.grade}: ${row.substring(0, 60)}...`);
      continue;
    }

    const credits = getSubjectCredits(subjectName);
    let confidence = 0.8;
    if (subjectName.length > 10) confidence += 0.1;
    if (IGNORE_GRADES.includes(extracted.grade)) {
      confidence = 0.5;
      warnings.push(`Subject "${subjectName}" has grade "${extracted.grade}" which is not counted in GPA`);
    }

    subjects.push({
      name: subjectName,
      grade: extracted.grade,
      credits,
      confidence: Math.min(confidence, 1),
      rawLine: row,
    });
  }
  
  // Remove duplicates (same subject name)
  const uniqueSubjects = removeDuplicates(subjects);
  
  // Calculate overall confidence
  const avgConfidence = uniqueSubjects.length > 0
    ? uniqueSubjects.reduce((sum, s) => sum + s.confidence, 0) / uniqueSubjects.length
    : 0;
  
  return {
    subjects: uniqueSubjects,
    rawText: normalizedText,
    confidence: avgConfidence,
    warnings,
  };
}

/**
 * Remove duplicate subjects (keep the one with higher confidence)
 */
function removeDuplicates(subjects: ParsedSubject[]): ParsedSubject[] {
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

/**
 * Filter subjects to only include valid grades for GPA calculation
 */
export function filterValidSubjects(subjects: ParsedSubject[]): ParsedSubject[] {
  return subjects.filter(s => VALID_GRADES.includes(s.grade));
}

/**
 * Get validation errors for subjects
 */
export function validateSubjects(subjects: ParsedSubject[]): string[] {
  const errors: string[] = [];
  
  for (const subject of subjects) {
    if (!subject.name || subject.name.length < 2) {
      errors.push(`Subject name is too short: "${subject.name}"`);
    }
    
    if (!VALID_GRADE_PATTERNS.includes(subject.grade)) {
      errors.push(`Invalid grade "${subject.grade}" for subject "${subject.name}"`);
    }
    
    if (subject.credits <= 0) {
      errors.push(`Invalid credits "${subject.credits}" for subject "${subject.name}"`);
    }
  }
  
  return errors;
}

/**
 * Parse with multiple strategies (for different university formats)
 */
export function parseWithStrategies(text: string): ParseResult {
  const baseResult = parseOCRText(text);
  const autoParser = defaultRegistry.autoDetect(text);

  if (autoParser) {
    const parserResult = autoParser.parse(text);
    const parserClearlyBetter =
      parserResult.subjects.length >= baseResult.subjects.length + 2 ||
      parserResult.confidence >= baseResult.confidence + 0.15;

    if (parserClearlyBetter) {
      return {
        subjects: parserResult.subjects,
        rawText: baseResult.rawText,
        confidence: parserResult.confidence,
        warnings: [`Used ${parserResult.strategy} parser strategy`, ...baseResult.warnings, ...parserResult.warnings],
      };
    }
  }

  // Try parsing with reversed order (grade first, then subject)
  if (baseResult.subjects.length === 0) {
    const reversedSubjects = parseReversedOrder(text);

    if (reversedSubjects.length > 0) {
      return {
        subjects: reversedSubjects,
        rawText: baseResult.rawText,
        confidence: 0.7,
        warnings: ['Used reversed order parsing strategy', ...baseResult.warnings],
      };
    }
  }

  return baseResult;
}

/**
 * Parse lines where grade appears before subject name
 */
function parseReversedOrder(text: string): ParsedSubject[] {
  const subjects: ParsedSubject[] = [];
  const lines = splitIntoLines(normalizeText(text));
  
  const gradePattern = /\b(O|0|A\+|A|B\+|B|C\+|C|WH|WD|UA|RA)\b/i;
  
  for (const line of lines) {
    if (line.length < 3) continue;
    
    // Check for noise
    if (isNoiseLine(line)) continue;
    
    const gradeMatch = line.match(gradePattern);
    if (!gradeMatch) continue;
    
    const grade = normalizeExtractedGrade(gradeMatch[1]);
    const gradeIndex = line.indexOf(gradeMatch[0]);
    
    // Get text after grade (subject name)
    const afterGrade = line.substring(gradeIndex + grade.length).trim();
    
    if (afterGrade.length < 3) continue;
    
    let subjectName = removeSubjectCodes(afterGrade);
    subjectName = trimSubjectWords(subjectName);
    if (STATUS_NOISE_REGEX.test(subjectName)) continue;
    subjectName = suggestCanonicalSubjectName(subjectName);
    subjectName = capitalizeSubjectName(subjectName);
    
    if (subjectName.length < 3) continue;

    if (IGNORE_GRADES.includes(grade) && subjectName.split(' ').filter(Boolean).length < 2) {
      continue;
    }
    
    subjects.push({
      name: subjectName,
      grade,
      credits: getSubjectCredits(subjectName),
      confidence: 0.7,
      rawLine: line,
    });
  }
  
  return removeDuplicates(subjects);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function detectSubjectRows(lines: string[], warnings: string[]): string[] {
  const rows: string[] = [];

  for (const line of lines) {
    const cleaned = cleanLine(line);
    if (cleaned.length < 3) continue;
    if (!VALID_GRADE_LINE_REGEX.test(cleaned)) continue;
    if (HEADER_ROW_REGEX.test(cleaned)) continue;
    if (LEGEND_LINE_REGEX.test(cleaned)) continue;

    // Keep canonical marksheet row shapes before generic noise filtering.
    if (SEMESTER_ROW_REGEX.test(cleaned) || SUBCODE_ROW_REGEX.test(cleaned)) {
      rows.push(cleaned);
      continue;
    }

    if (STATUS_NOISE_REGEX.test(cleaned)) {
      warnings.push(`Filtered status/noise row: ${cleaned.substring(0, 50)}...`);
      continue;
    }
    if ((isNoiseLine(cleaned) || NOISE_PATTERNS.some((pattern) => pattern.test(cleaned))) && !hasLikelySubjectPayload(cleaned)) {
      warnings.push(`Filtered noise line: ${cleaned.substring(0, 50)}...`);
      continue;
    }
    rows.push(cleaned);
  }

  return rows;
}

function extractSubjectAndGrade(line: string): { subjectName: string; grade: string } | null {
  const exactEndMatch = line.match(SUBJECT_GRADE_END_REGEX);
  if (exactEndMatch) {
    return {
      subjectName: stripLeadingSemesterAndCode(exactEndMatch[1].trim()),
      grade: normalizeExtractedGrade(exactEndMatch[2]),
    };
  }

  // Fallback for formats where grade is present but followed by extra symbols.
  const escapedGrades = ['0', ...VALID_GRADE_PATTERNS].map((grade) => escapeRegex(grade));
  const gradePattern = new RegExp(`\\b(${escapedGrades.join('|')})\\b`, 'i');
  const gradeMatch = line.match(gradePattern);
  if (!gradeMatch) return null;

  const grade = normalizeExtractedGrade(gradeMatch[1]);
  const gradeIndex = line.indexOf(gradeMatch[0]);
  const beforeGrade = stripLeadingSemesterAndCode(line.substring(0, gradeIndex).trim());
  const afterGrade = stripLeadingSemesterAndCode(line.substring(gradeIndex + gradeMatch[0].length).trim());

  const subjectName = chooseBestSubjectCandidate(beforeGrade, afterGrade);

  if (!subjectName) return null;
  return { subjectName, grade };
}

function hasLikelySubjectPayload(line: string): boolean {
  const stripped = line
    .replace(/\b(O|0|A\+|A|B\+|B|C\+|C|WH|WD|UA|RA)\b/gi, ' ')
    .replace(/^semester\s*[ivx\d]+\s+/i, '')
    .replace(/^[a-z]{2,4}\d{3,5}\s+/i, '')
    .replace(/[^a-z\s&]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = stripped.split(' ').filter(Boolean);
  return words.length >= 2 && stripped.length >= 8;
}

function chooseBestSubjectCandidate(beforeGrade: string, afterGrade: string): string {
  const normalizedBefore = sanitizeSubjectCandidate(beforeGrade);
  const normalizedAfter = sanitizeSubjectCandidate(afterGrade);

  const beforeWords = normalizedBefore.split(' ').filter(Boolean).length;
  const afterWords = normalizedAfter.split(' ').filter(Boolean).length;

  if (beforeWords === 0 && afterWords === 0) return '';
  if (beforeWords >= afterWords && normalizedBefore.length >= 3) return normalizedBefore;
  if (normalizedAfter.length >= 3) return normalizedAfter;
  return normalizedBefore || normalizedAfter;
}

function sanitizeSubjectCandidate(value: string): string {
  return value
    .replace(/^semester\s*[ivx\d]+\s+/i, '')
    .replace(/^[a-z]{2,4}\d{3,5}\s+/i, '')
    .replace(/\b(subcode|subject\s*name|grade|credits?)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeExtractedGrade(value: string): string {
  const token = value.trim().toUpperCase();
  if (token === '0' || token === 'D' || token === 'Q') {
    return 'O';
  }
  return token;
}

function stripLeadingSemesterAndCode(value: string): string {
  return value
    .replace(/^semester\s*[ivx\d]+\s+/i, '')
    .replace(/^[a-z]{2,4}\d{3,5}\s+/i, '')
    .trim();
}

