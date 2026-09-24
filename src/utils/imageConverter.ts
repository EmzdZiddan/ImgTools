import type { ConversionSettings, ConvertedResult, UploadedImage } from '../types';
import { getWebpFileName, isHeicFile } from './formatters';

/**
 * Load an image from an object URL or data URL into an HTMLImageElement
 */
export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load image into DOM: ' + err));
    img.src = src;
  });
}

/**
 * Get image metadata (preview url, width, height) from File
 */
export async function extractImageMetadata(file: File): Promise<{
  previewUrl: string;
  width?: number;
  height?: number;
}> {
  if (isHeicFile(file)) {
    try {
      const heic2anyModule = await import('heic2any');
      const heic2any = heic2anyModule.default;
      const convertedBlobOrBlobs = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8,
      });

      const convertedBlob = Array.isArray(convertedBlobOrBlobs)
        ? convertedBlobOrBlobs[0]
        : convertedBlobOrBlobs;

      const previewUrl = URL.createObjectURL(convertedBlob);
      const img = await loadImageElement(previewUrl);
      return {
        previewUrl,
        width: img.naturalWidth,
        height: img.naturalHeight,
      };
    } catch {
      // Fallback object url
      return {
        previewUrl: URL.createObjectURL(file),
      };
    }
  }

  const previewUrl = URL.createObjectURL(file);
  try {
    const img = await loadImageElement(previewUrl);
    return {
      previewUrl,
      width: img.naturalWidth,
      height: img.naturalHeight,
    };
  } catch {
    return { previewUrl };
  }
}

/**
 * Convert a single image file to WebP with the specified settings
 */
export async function convertToWebP(
  item: UploadedImage,
  settings: ConversionSettings
): Promise<ConvertedResult> {
  let sourceBlob: Blob = item.file;
  let tempObjectUrl: string | null = null;

  try {
    if (isHeicFile(item.file)) {
      const heic2anyModule = await import('heic2any');
      const heic2any = heic2anyModule.default;
      const converted = await heic2any({
        blob: item.file,
        toType: 'image/png',
        quality: 1,
      });
      sourceBlob = Array.isArray(converted) ? converted[0] : converted;
    }

    tempObjectUrl = URL.createObjectURL(sourceBlob);
    const img = await loadImageElement(tempObjectUrl);

    const origWidth = img.naturalWidth || img.width;
    const origHeight = img.naturalHeight || img.height;

    if (!origWidth || !origHeight) {
      throw new Error('Could not determine source image dimensions.');
    }

    let targetWidth = origWidth;
    let targetHeight = origHeight;

    if (settings.outputWidth && settings.outputWidth > 0) {
      targetWidth = Math.round(settings.outputWidth);
      if (settings.maintainAspectRatio) {
        const ratio = origHeight / origWidth;
        targetHeight = Math.round(targetWidth * ratio);
      }
    }

    // Safety checks for canvas dimensions
    targetWidth = Math.max(1, targetWidth);
    targetHeight = Math.max(1, targetHeight);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      throw new Error('Canvas 2D context is not supported in this browser.');
    }

    // Enable high quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const quality = Math.min(1, Math.max(0.1, settings.quality / 100));

    const webpBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('WebP encoding failed.'));
          }
        },
        'image/webp',
        quality
      );
    });

    const webpSize = webpBlob.size;
    const originalSize = item.file.size;
    const reductionPercentage =
      originalSize > 0 ? ((originalSize - webpSize) / originalSize) * 100 : 0;

    const resultPreviewUrl = URL.createObjectURL(webpBlob);

    return {
      id: item.id,
      originalName: item.name,
      webpFileName: getWebpFileName(item.name),
      blob: webpBlob,
      previewUrl: resultPreviewUrl,
      originalSize,
      webpSize,
      reductionPercentage,
      width: targetWidth,
      height: targetHeight,
    };
  } finally {
    if (tempObjectUrl) {
      URL.revokeObjectURL(tempObjectUrl);
    }
  }
}
