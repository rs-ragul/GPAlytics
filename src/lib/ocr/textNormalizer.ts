/**
 * Text Normalization Utility
 * Cleans and normalizes OCR output for better parsing
 */

/**
 * Normalize OCR text output
 */
export function normalizeText(text: string): string {
  let normalized = text;

  // Normalize case first to stabilize downstream matching.
  normalized = normalized.toLowerCase();

  // Remove extra spaces
  normalized = normalized.replace(/[ \t]+/g, ' ');

  // Remove extra newlines
  normalized = normalized.replace(/\n{3,}/g, '\n\n');

  // Trim each line
  normalized = normalized
    .split('\n')
    .map(line => line.trim())
    .join('\n');

  return normalized.trim();
}

/**
 * Split text into lines
 */
export function splitIntoLines(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * Clean a single line of OCR text
 */
export function cleanLine(line: string): string {
  let cleaned = line.trim();

  // Remove special characters that are likely OCR errors
  cleaned = cleaned.replace(/[|\\]/g, '');

  // Fix common OCR misreads
  cleaned = cleaned
    .replace(/O(?=[a-zA-Z])/g, '0')  // O followed by letter is likely 0
    .replace(/(?<=[a-zA-Z])O(?=[a-zA-Z])/g, '0')  // O between letters
    .replace(/l(?=[a-zA-Z])/g, 'I')  // l followed by letter is likely I
    .replace(/(?<=[a-zA-Z])l(?=[a-zA-Z])/g, 'I');  // l between letters

  // Fix common grade misreads
  cleaned = cleaned
    .replace(/0(?=\s*$|\s+[A-Z])/g, 'O')  // 0 at end or before grade could be O
    .replace(/D(?=\s*$|\s+[A-Z])/g, 'O')  // D at end could be O
    .replace(/Q(?=\s*$|\s+[A-Z])/g, 'O')  // Q at end could be O
    .replace(/(\w)\1{2,}/g, '$1$1');  // Repeated characters

  return cleaned.trim();
}

/**
 * Remove subject codes from text
 * e.g., "CY2124 Engineering Chemistry" -> "Engineering Chemistry"
 */
export function removeSubjectCodes(text: string): string {
  // Pattern for subject codes: 2-4 letters followed by 2-4 digits
  // Examples: CY2124, MA2122, GE2C25, CS101
  const codePattern = /^[a-z]{2,4}\d{2,4}\s*/i;
  
  return text.replace(codePattern, '').trim();
}

/**
 * Check if a line contains noise keywords
 */
export function isNoiseLine(line: string): boolean {
  const noisePatterns = [
    /college/i,
    /institution/i,
    /register/i,
    /semester/i,
    /name/i,
    /result/i,
    /examination/i,
    /university/i,
    /student/i,
    /candidate/i,
    /roll\s*no/i,
    /register\s*no/i,
    /affiliated/i,
    /autonomous/i,
    /department/i,
    /session/i,
    /contd/i,
    /continued/i,
    /page/i,
    /date/i,
    /signature/i,
  ];

  return noisePatterns.some(pattern => pattern.test(line));
}

/**
 * Extract grade from a line
 */
export function extractGrade(line: string): string | null {
  // Valid grades pattern
  const gradePattern = /\b(O|A\+|A|B\+|B|C\+|C|WH|WD|UA|RA)\b/i;
  const match = line.match(gradePattern);

  if (match) {
    return match[1].toUpperCase();
  }

  return null;
}

/**
 * Extract subject name from a line given the grade
 */
export function extractSubjectName(line: string, grade: string): string {
  // Find the position of the grade in the line
  const gradeIndex = line.toUpperCase().indexOf(grade);
  
  if (gradeIndex === -1) {
    return line.trim();
  }

  // Get text before the grade
  let subjectName = line.substring(0, gradeIndex).trim();

  // If subject is too short, try text after grade
  if (subjectName.length < 3) {
    const afterGrade = line.substring(gradeIndex + grade.length).trim();
    if (afterGrade.length > subjectName.length) {
      subjectName = afterGrade;
    }
  }

  // Remove subject codes
  subjectName = removeSubjectCodes(subjectName);

  // Clean the subject name
  subjectName = cleanLine(subjectName);

  // Capitalize properly
  subjectName = capitalizeSubjectName(subjectName);

  return subjectName;
}

/**
 * Capitalize subject name properly
 */
export function capitalizeSubjectName(name: string): string {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
}

/**
 * Trim unnecessary words from subject name
 */
export function trimSubjectWords(subjectName: string): string {
  const trimWords = [
    'semester', 'course', 'college', 'register', 'name',
    'subject', 'code', 'grade', 'result', 'examination',
    'internal', 'external', 'total', 'credits', 'credit',
    'theory', 'practical', 'lab', 'tutorial'
  ];

  let trimmed = subjectName;

  for (const word of trimWords) {
    const pattern = new RegExp(`\\b${word}\\b`, 'gi');
    trimmed = trimmed.replace(pattern, '').trim();
  }

  // Remove any extra spaces
  trimmed = trimmed.replace(/\s+/g, ' ').trim();

  return trimmed;
}

