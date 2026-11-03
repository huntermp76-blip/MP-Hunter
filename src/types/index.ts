export type OutputFormat = 'image/jpeg' | 'image/webp' | 'image/png';

export type CompressionMode = 'quality' | 'targetSize';

export interface CompressionSettings {
  mode: CompressionMode;
  quality: number; // 0.1 to 1.0
  targetSizeKb: number; // e.g. 50 KB
  format: OutputFormat;
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio: boolean;
  scalePercent: number; // 25, 50, 75, 100
  stripMetadata: boolean;
}

export interface ProcessedImage {
  id: string;
  name: string;
  originalFile: File;
  originalSize: number; // in bytes
  originalWidth: number;
  originalHeight: number;
  originalUrl: string;
  
  compressedBlob?: Blob;
  compressedUrl?: string;
  compressedSize?: number; // in bytes
  compressedWidth?: number;
  compressedHeight?: number;
  
  status: 'idle' | 'compressing' | 'done' | 'error';
  errorMessage?: string;
  compressionTimeMs?: number;
}

export interface ExamPreset {
  id: string;
  name: string;
  nameHindi: string;
  category: 'Exam' | 'Document' | 'Social' | 'Web';
  targetSizeKb: number;
  recommendedWidth?: number;
  recommendedHeight?: number;
  format: OutputFormat;
  description: string;
  descriptionHindi: string;
}

export type Language = 'hinglish' | 'english' | 'hindi';
