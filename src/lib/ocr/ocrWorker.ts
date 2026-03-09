/**
 * OCR Worker Service
 * Handles Tesseract execution in a separate worker for non-blocking UI
 */

import { createWorker, Worker, OEM, PSM } from 'tesseract.js';

export interface OCRProgress {
  status: string;
  progress: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  words: Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
  lines: Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
}

export interface OCROptions {
  language?: string;
  pagesegmode?: PSM;
  whitelist?: string;
  logger?: (progress: OCRProgress) => void;
}

// Tesseract configuration
const DEFAULT_OPTIONS: OCROptions = {
  language: 'eng',
  pagesegmode: PSM.SINGLE_BLOCK,
  whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-',
};

/**
 * Create a configured Tesseract worker
 */
export async function createOCRWorker(
  options: OCROptions = DEFAULT_OPTIONS,
  onProgress?: (progress: OCRProgress) => void
): Promise<Worker> {
  const worker = await createWorker(options.language || 'eng', OEM.LSTM_ONLY, {
    logger: (m) => {
      if (onProgress && m.status) {
        onProgress({
          status: m.status,
          progress: m.progress || 0,
        });
      }
    },
  });

  // Configure page segmentation mode
  await worker.setParameters({
    // PSM.SINGLE_BLOCK maps to tessedit_pageseg_mode 6.
    tessedit_pageseg_mode: options.pagesegmode ?? PSM.SINGLE_BLOCK,
  });

  // Set character whitelist if provided
  if (options.whitelist) {
    await worker.setParameters({
      tessedit_char_whitelist: options.whitelist,
    });
  }

  return worker;
}

/**
 * Perform OCR on an image file with full preprocessing
 */
export async function performOCR(
  imageSource: string | File,
  options: OCROptions = DEFAULT_OPTIONS,
  onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
  // Report starting status
  if (onProgress) {
    onProgress({ status: 'initializing', progress: 0 });
  }

  let worker: Worker | null = null;

  try {
    worker = await createOCRWorker(options, onProgress);
    const result = await performOCRWithWorker(worker, imageSource);
    return result;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error(`OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    if (worker) {
      await terminateOCRWorker(worker);
    }
  }
}

/**
 * Perform OCR with a pre-configured worker (reusable)
 */
export async function performOCRWithWorker(
  worker: Worker,
  imageSource: string | File
): Promise<OCRResult> {
  const result = await worker.recognize(imageSource);
  
  // Type assertion for the data
  const data = result.data as any;

  return {
    text: data.text,
    confidence: data.confidence,
    words: data.words?.map((w: any) => ({
      text: w.text,
      confidence: w.confidence,
      bbox: w.bbox,
    })) || [],
    lines: data.lines?.map((l: any) => ({
      text: l.text,
      confidence: l.confidence,
      bbox: l.bbox,
    })) || [],
  };
}

/**
 * Terminate a worker when done
 */
export async function terminateOCRWorker(worker: Worker): Promise<void> {
  await worker.terminate();
}

/**
 * Quick OCR with minimal options for faster processing
 */
export async function quickOCR(
  imageSource: string | File,
  onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
  return performOCR(
    imageSource,
    {
      language: 'eng',
      pagesegmode: PSM.SINGLE_BLOCK,
      whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    },
    onProgress
  );
}

