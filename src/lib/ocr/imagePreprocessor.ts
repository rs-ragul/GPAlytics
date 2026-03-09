/**
 * Image Preprocessing Utility
 * Improves OCR accuracy by preparing the image before Tesseract processing
 */

export interface PreprocessingOptions {
  grayscale?: boolean;
  contrast?: number;
  threshold?: boolean;
  resize?: number;
}

const DEFAULT_OPTIONS: PreprocessingOptions = {
  grayscale: true,
  contrast: 1.2,
  threshold: true,
  resize: 1.5,
};

/**
 * Apply image preprocessing using Canvas API
 */
export async function preprocessImage(
  imageSource: File | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
  options: PreprocessingOptions = DEFAULT_OPTIONS
): Promise<string> {
  // Create an ImageBitmap from the source
  let imageBitmap: ImageBitmap;

  if (imageSource instanceof File) {
    imageBitmap = await createImageBitmap(imageSource);
  } else if (imageSource instanceof HTMLImageElement) {
    imageBitmap = await createImageBitmap(imageSource);
  } else {
    throw new Error('Unsupported image source');
  }

  // Calculate dimensions
  const scale = options.resize || 1;
  const width = imageBitmap.width * scale;
  const height = imageBitmap.height * scale;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Enable image smoothing for better quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw the image at the new size
  ctx.drawImage(imageBitmap, 0, 0, width, height);

  // Get image data
  let imageData = ctx.getImageData(0, 0, width, height);

  // Apply grayscale
  if (options.grayscale) {
    imageData = applyGrayscale(imageData);
  }

  // Increase contrast
  if (options.contrast && options.contrast !== 1) {
    imageData = applyContrast(imageData, options.contrast);
  }

  // Adaptive thresholding removes noisy backgrounds in screenshots.
  if (options.threshold) {
    imageData = applyAdaptiveThreshold(imageData);
  }

  // Put processed data back
  ctx.putImageData(imageData, 0, 0);

  // Return as data URL
  return canvas.toDataURL('image/png');
}

/**
 * Convert image to grayscale
 */
function applyGrayscale(imageData: ImageData): ImageData {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Use luminance formula for better results
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = gray;     // R
    data[i + 1] = gray; // G
    data[i + 2] = gray; // B
  }

  return imageData;
}

/**
 * Increase image contrast
 */
function applyContrast(imageData: ImageData, contrast: number): ImageData {
  const data = imageData.data;
  const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));

  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(factor * (data[i] - 128) + 128);
    data[i + 1] = clamp(factor * (data[i + 1] - 128) + 128);
    data[i + 2] = clamp(factor * (data[i + 2] - 128) + 128);
  }

  return imageData;
}

/**
 * Apply adaptive thresholding using local mean values.
 */
function applyAdaptiveThreshold(imageData: ImageData): ImageData {
  const { data, width, height } = imageData;
  const grayscale = new Uint8Array(width * height);

  for (let i = 0; i < data.length; i += 4) {
    grayscale[i / 4] = data[i];
  }

  const radius = 5;
  const bias = 8;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            sum += grayscale[ny * width + nx];
            count++;
          }
        }
      }

      const idx = y * width + x;
      const threshold = sum / Math.max(count, 1) - bias;
      const value = grayscale[idx] > threshold ? 255 : 0;
      const pixel = idx * 4;

      data[pixel] = value;
      data[pixel + 1] = value;
      data[pixel + 2] = value;
    }
  }

  return imageData;
}

/**
 * Clamp value between 0 and 255
 */
function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

/**
 * Quick preprocess for faster processing (less thorough)
 */
export async function quickPreprocess(imageSource: File): Promise<string> {
  return preprocessImage(imageSource, {
    grayscale: true,
    contrast: 1.2,
    threshold: true,
    resize: 1.5,
  });
}

