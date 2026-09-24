export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${value} ${sizes[i]}`;
}

export function formatPercentage(reduction: number): string {
  if (reduction > 0) {
    return `-${reduction.toFixed(1)}%`;
  } else if (reduction < 0) {
    return `+${Math.abs(reduction).toFixed(1)}%`;
  }
  return '0%';
}

export function getWebpFileName(originalName: string): string {
  const lastDotIndex = originalName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return `${originalName}.webp`;
  }
  return `${originalName.substring(0, lastDotIndex)}.webp`;
}

export function isHeicFile(file: File): boolean {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return (
    type === 'image/heic' ||
    type === 'image/heif' ||
    name.endsWith('.heic') ||
    name.endsWith('.heif')
  );
}

export const SUPPORTED_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.heic',
  '.heif',
  '.avif',
  '.gif',
  '.webp',
];

export const ACCEPT_STRING = 'image/png,image/jpeg,image/heic,image/heif,image/avif,image/gif,image/webp,.heic,.heif,.png,.jpg,.jpeg,.avif,.gif,.webp';

export function isSupportedImage(file: File): boolean {
  if (file.type.startsWith('image/')) return true;
  return isHeicFile(file);
}
