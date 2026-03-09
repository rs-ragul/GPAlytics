/**
 * OCR Module Index
 * Export all OCR utilities and services
 */

// Image preprocessing
export { preprocessImage, quickPreprocess } from './imagePreprocessor';

// OCR Worker
export { 
  performOCR, 
  quickOCR, 
  createOCRWorker, 
  terminateOCRWorker 
} from './ocrWorker';
export type { OCRProgress, OCRResult, OCROptions } from './ocrWorker';

// Text normalization
export { 
  normalizeText, 
  splitIntoLines, 
  cleanLine, 
  removeSubjectCodes,
  isNoiseLine,
  extractGrade,
  extractSubjectName,
  capitalizeSubjectName,
  trimSubjectWords
} from './textNormalizer';

// Subject credits
export { 
  getSubjectCredits, 
  isLabSubject, 
  getSubjectVariations,
  SUBJECT_CREDITS_MAP,
  DEFAULT_CREDITS 
} from './subjectCredits';

// Subject parser
export { 
  parseOCRText, 
  parseWithStrategies,
  filterValidSubjects,
  validateSubjects 
} from './subjectParser';
export type { ParsedSubject, ParseResult } from './subjectParser';

// OCR Service
export { 
  processOCR, 
  quickOCR as quickOCRService,
  validateExtractedSubjects,
  toGPAInput 
} from './ocrService';
export type { OCRServiceOptions, OCRServiceResult } from './ocrService';

