export type ImageStatus = 'idle' | 'converting' | 'completed' | 'error';

export interface UploadedImage {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
  width?: number;
  height?: number;
  type: string;
  status: ImageStatus;
  progress?: number;
  errorMessage?: string;
}

export interface ConvertedResult {
  id: string;
  originalName: string;
  webpFileName: string;
  blob: Blob;
  previewUrl: string;
  originalSize: number;
  webpSize: number;
  reductionPercentage: number;
  width: number;
  height: number;
}

export interface ConversionSettings {
  quality: number; // 10 to 100
  outputWidth?: number; // optional target width
  maintainAspectRatio: boolean;
}
