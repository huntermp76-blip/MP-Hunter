import JSZip from 'jszip';
import { CompressionSettings, ProcessedImage } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image: ' + err));
    };
    img.src = url;
  });
}

function calculateDimensions(
  origW: number,
  origH: number,
  settings: CompressionSettings
): { width: number; height: number } {
  let width = origW;
  let height = origH;

  // Apply scale percentage if provided and not 100
  if (settings.scalePercent && settings.scalePercent !== 100) {
    const scale = settings.scalePercent / 100;
    width = Math.max(1, Math.round(origW * scale));
    height = Math.max(1, Math.round(origH * scale));
    return { width, height };
  }

  // Apply max width / height if specified
  if (settings.maxWidth || settings.maxHeight) {
    const maxW = settings.maxWidth || origW;
    const maxH = settings.maxHeight || origH;

    if (settings.maintainAspectRatio) {
      const ratio = Math.min(maxW / origW, maxH / origH, 1);
      width = Math.max(1, Math.round(origW * ratio));
      height = Math.max(1, Math.round(origH * ratio));
    } else {
      width = maxW;
      height = maxH;
    }
  }

  return { width, height };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob failed'));
        }
      },
      format,
      quality
    );
  });
}

export async function compressImage(
  file: File,
  settings: CompressionSettings
): Promise<{ blob: Blob; width: number; height: number }> {
  const img = await loadImage(file);
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  let { width, height } = calculateDimensions(origW, origH, settings);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas context is not supported');

  // Handle PNG transparent background when converting to JPEG
  const format = settings.format;
  const isJpeg = format === 'image/jpeg';

  const renderToCanvas = (w: number, h: number) => {
    canvas.width = w;
    canvas.height = h;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (isJpeg) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.clearRect(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);
  };

  renderToCanvas(width, height);

  // 1. Manual Quality Mode
  if (settings.mode === 'quality') {
    const quality = format === 'image/png' ? undefined : settings.quality;
    const blob = await canvasToBlob(canvas, format, quality ?? 0.8);
    return { blob, width, height };
  }

  // 2. Target File Size Mode (e.g. exactly under 50KB or 20KB for Govt Exams)
  const targetBytes = settings.targetSizeKb * 1024;
  let currentWidth = width;
  let currentHeight = height;

  // For PNG, PNG does not have quality parameter in toBlob; if target size requested, fallback to JPEG/WebP
  const compressionFormat = format === 'image/png' ? 'image/jpeg' : format;

  // Binary search for optimal quality
  let lowQ = 0.05;
  let highQ = 0.98;
  let bestBlob: Blob | null = null;
  let iterations = 0;

  while (iterations < 7) {
    iterations++;
    const midQ = (lowQ + highQ) / 2;
    const testBlob = await canvasToBlob(canvas, compressionFormat, midQ);

    if (testBlob.size <= targetBytes) {
      bestBlob = testBlob;
      // We can try higher quality
      lowQ = midQ;
    } else {
      // Too big, reduce quality
      highQ = midQ;
    }

    // Stop if close enough (within 5% under target)
    if (bestBlob && Math.abs(bestBlob.size - targetBytes) < targetBytes * 0.05) {
      break;
    }
  }

  // If even at lowest quality (~0.05) the blob is still bigger than targetBytes,
  // we must downscale dimensions and retry
  let downscaleCount = 0;
  while ((!bestBlob || bestBlob.size > targetBytes) && downscaleCount < 4) {
    downscaleCount++;
    const ratio = Math.sqrt(targetBytes / (bestBlob?.size || targetBytes * 1.5)) * 0.9;
    currentWidth = Math.max(100, Math.round(currentWidth * Math.min(0.8, ratio)));
    currentHeight = Math.max(100, Math.round(currentHeight * Math.min(0.8, ratio)));

    renderToCanvas(currentWidth, currentHeight);

    // Try at 0.7 quality first with smaller dimensions
    bestBlob = await canvasToBlob(canvas, compressionFormat, 0.7);
    if (bestBlob.size > targetBytes) {
      bestBlob = await canvasToBlob(canvas, compressionFormat, 0.4);
    }
  }

  if (!bestBlob) {
    bestBlob = await canvasToBlob(canvas, compressionFormat, 0.5);
  }

  return { blob: bestBlob, width: currentWidth, height: currentHeight };
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadAllAsZip(images: ProcessedImage[], zipName = 'indoretools_compressed_photos.zip'): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('compressed_images');

  images.forEach((img, idx) => {
    if (img.compressedBlob) {
      const ext = img.compressedBlob.type.includes('png')
        ? 'png'
        : img.compressedBlob.type.includes('webp')
        ? 'webp'
        : 'jpg';
      const cleanName = img.name.replace(/\.[^/.]+$/, '');
      folder?.file(`${idx + 1}_${cleanName}_compressed.${ext}`, img.compressedBlob);
    }
  });

  const content = await zip.generateAsync({ type: 'blob' });
  downloadBlob(content, zipName);
}
