/**
 * OCR Service
 * Main entry point for OCR processing pipeline
 */

import { performOCR } from './ocrWorker';
import { preprocessImage } from './imagePreprocessor';
import { parseOCRText, parseWithStrategies, ParsedSubject } from './subjectParser';
import { VALID_GRADES } from '../utils';
import { initializeSubjectCatalog } from './subjectCredits';

const MIN_WORD_CONFIDENCE = 55;
const VALID_GRADE_LINE_REGEX = /\b(O|0|A\+|A|B\+|B|C\+|C|WH|WD|UA|RA)\b/;

export interface OCRServiceOptions {
  preprocessImage?: boolean;
  useAdvancedParsing?: boolean;
  onProgress?: (progress: { status: string; progress: number }) => void;
}

export interface OCRServiceResult {
  subjects: ParsedSubject[];
  rawText: string;
  confidence: number;
  warnings: string[];
  preprocessedImage?: string;
}

/**
 * Process an image file through the complete OCR pipeline
 */
export async function processOCR(
  imageFile: File,
  options: OCRServiceOptions = {}
): Promise<OCRServiceResult> {
  const { 
    preprocessImage: doPreprocess = true, 
    useAdvancedParsing = true,
    onProgress 
  } = options;

  try {
    // Step 1: Image preprocessing
    let imageSource: string | File = imageFile;
    
    if (doPreprocess && onProgress) {
      onProgress({ status: 'preprocessing', progress: 0 });
    }

    if (doPreprocess) {
      try {
        imageSource = await preprocessImage(imageFile);
      } catch (preprocessError) {
        console.warn('Image preprocessing failed, using original:', preprocessError);
        imageSource = imageFile;
      }
    }

    // Step 2: OCR extraction
    if (onProgress) {
      onProgress({ status: 'recognizing text', progress: 20 });
    }

    const ocrResult = await performOCR(
      imageSource,
      {
        language: 'eng',
        whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+- ',
      },
      (progress) => {
        if (onProgress) {
          // Scale progress from 0-100 to 20-80
          const scaledProgress = 20 + (progress.progress * 60);
          onProgress({ status: progress.status, progress: scaledProgress });
        }
      }
    );

    // Step 3: Parse the extracted text
    if (onProgress) {
      onProgress({ status: 'parsing results', progress: 85 });
    }

    const confidenceFilteredText = buildConfidenceFilteredText(ocrResult);

    await initializeSubjectCatalog();

    let parseResult = useAdvancedParsing
      ? parseWithStrategies(confidenceFilteredText)
      : parseOCRText(confidenceFilteredText);

    // Fallback: if too few subjects were found, parse full OCR text and keep the richer result.
    if (parseResult.subjects.length < 6) {
      const fallbackParse = useAdvancedParsing
        ? parseWithStrategies(ocrResult.text)
        : parseOCRText(ocrResult.text);

      if (fallbackParse.subjects.length > parseResult.subjects.length) {
        parseResult = {
          ...fallbackParse,
          warnings: ['Used fallback full-text parsing to recover missing rows.', ...fallbackParse.warnings],
        };
      }
    }

    const subjects = parseResult.subjects;

    const warnings = [...parseResult.warnings];
    if (subjects.length < 6) {
      warnings.push('Detected fewer than expected subjects. Please review and correct rows manually.');
    }

    // Step 5: Complete
    if (onProgress) {
      onProgress({ status: 'complete', progress: 100 });
    }

    return {
      subjects,
      rawText: parseResult.rawText,
      confidence: parseResult.confidence,
      warnings,
      preprocessedImage: typeof imageSource === 'string' ? imageSource : undefined,
    };
  } catch (error) {
    console.error('OCR Service Error:', error);
    throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function buildConfidenceFilteredText(ocrResult: {
  text: string;
  lines: Array<{ text: string; bbox: { x0: number; y0: number; x1: number; y1: number } }>;
  words: Array<{ text: string; confidence: number; bbox: { x0: number; y0: number; x1: number; y1: number } }>;
}): string {
  const linesFromWords = ocrResult.lines
    .map((line) => {
      const lineWords = ocrResult.words.filter((word) => isWordInsideLine(word.bbox, line.bbox));
      const highConfidenceWords = lineWords
        .filter((word) => word.confidence >= MIN_WORD_CONFIDENCE)
        .map((word) => word.text.trim())
        .filter(Boolean);

      if (highConfidenceWords.length >= 3) {
        return highConfidenceWords.join(' ').replace(/\s+/g, ' ').trim();
      }

      // Small-font tables often produce lower confidence words; keep the line text as fallback.
      return line.text.trim().replace(/\s+/g, ' ');
    })
    .filter((line) => VALID_GRADE_LINE_REGEX.test(line));

  if (linesFromWords.length > 0) {
    return linesFromWords.join('\n');
  }

  // If no OCR line metadata is available, still enforce grade-line filtering.
  return ocrResult.text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && VALID_GRADE_LINE_REGEX.test(line))
    .join('\n');
}

function isWordInsideLine(
  wordBox: { x0: number; y0: number; x1: number; y1: number },
  lineBox: { x0: number; y0: number; x1: number; y1: number }
): boolean {
  const tolerance = 6;
  return (
    wordBox.x0 >= lineBox.x0 - tolerance &&
    wordBox.x1 <= lineBox.x1 + tolerance &&
    wordBox.y0 >= lineBox.y0 - tolerance &&
    wordBox.y1 <= lineBox.y1 + tolerance
  );
}

/**
 * Quick OCR without preprocessing (faster but less accurate)
 */
export async function quickOCR(
  imageFile: File,
  onProgress?: (progress: { status: string; progress: number }) => void
): Promise<OCRServiceResult> {
  return processOCR(imageFile, {
    preprocessImage: false,
    useAdvancedParsing: true,
    onProgress,
  });
}

/**
 * Validate extracted subjects
 */
export function validateExtractedSubjects(subjects: ParsedSubject[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (subjects.length === 0) {
    errors.push('No subjects detected');
    return { isValid: false, errors, warnings };
  }

  for (const subject of subjects) {
    // Check subject name
    if (!subject.name || subject.name.length < 2) {
      errors.push(`Invalid subject name: "${subject.name}"`);
    }

    // Check grade
    if (!VALID_GRADES.includes(subject.grade)) {
      warnings.push(`Grade "${subject.grade}" for "${subject.name}" is not counted in GPA`);
    }

    // Check credits
    if (subject.credits <= 0) {
      errors.push(`Invalid credits for "${subject.name}": ${subject.credits}`);
    }

    // Check confidence
    if (subject.confidence < 0.5) {
      warnings.push(`Low confidence for "${subject.name}": ${Math.round(subject.confidence * 100)}%`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Convert parsed subjects to a format suitable for GPA calculation
 */
export function toGPAInput(subjects: ParsedSubject[]): Array<{
  name: string;
  credits: number;
  grade: string;
}> {
  return subjects.map(s => ({
    name: s.name,
    credits: s.credits,
    grade: s.grade,
  }));
}

