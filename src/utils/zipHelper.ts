import JSZip from 'jszip';
import type { ConvertedResult } from '../types';

/**
 * Triggers browser download for a single Blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Packages multiple converted images into a .zip archive and triggers download
 */
export async function downloadAllAsZip(
  results: ConvertedResult[],
  zipFilename = 'converted-webp-images.zip'
): Promise<void> {
  if (results.length === 0) return;

  if (results.length === 1) {
    downloadBlob(results[0].blob, results[0].webpFileName);
    return;
  }

  const zip = new JSZip();
  const filenameCount: Record<string, number> = {};

  for (const item of results) {
    let name = item.webpFileName;
    // Handle duplicate filenames gracefully
    if (filenameCount[name] !== undefined) {
      filenameCount[name]++;
      const dotIdx = name.lastIndexOf('.');
      const base = dotIdx !== -1 ? name.substring(0, dotIdx) : name;
      name = `${base}_${filenameCount[name]}.webp`;
    } else {
      filenameCount[name] = 0;
    }

    zip.file(name, item.blob);
  }

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  downloadBlob(zipBlob, zipFilename);
}
