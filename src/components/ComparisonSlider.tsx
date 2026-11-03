import React, { useState, useRef, useEffect } from 'react';
import { Download, Copy, Check, Eye, ArrowRight, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import { ProcessedImage, Language } from '../types';
import { translations } from '../utils/translations';
import { formatBytes, downloadBlob } from '../utils/compressor';

interface ComparisonSliderProps {
  image: ProcessedImage;
  lang: Language;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ image, lang }) => {
  const t = translations[lang];
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side'>('split');
  const containerRef = useRef<HTMLDivElement>(null);

  const origSize = image.originalSize;
  const compSize = image.compressedSize || 0;
  const savingsPercent = origSize > 0 && compSize > 0 ? Math.round(((origSize - compSize) / origSize) * 100) : 0;

  const handlePointerDown = () => setIsDragging(true);

  useEffect(() => {
    const handlePointerUp = () => setIsDragging(false);
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const offsetX = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
      setSliderPos(pct);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging]);

  const handleDownload = () => {
    if (!image.compressedBlob) return;
    const ext = image.compressedBlob.type.includes('png')
      ? 'png'
      : image.compressedBlob.type.includes('webp')
      ? 'webp'
      : 'jpg';
    const cleanName = image.name.replace(/\.[^/.]+$/, '');
    downloadBlob(image.compressedBlob, `${cleanName}_compressed.${ext}`);
  };

  const handleCopy = async () => {
    if (!image.compressedBlob) return;
    try {
      if (navigator.clipboard && 'write' in navigator.clipboard) {
        // Clipboard write supports image/png best in modern browsers
        let blobToCopy = image.compressedBlob;
        if (blobToCopy.type !== 'image/png') {
          // Convert to PNG on canvas to copy to clipboard
          const img = new Image();
          img.src = image.compressedUrl || '';
          await new Promise((r) => (img.onload = r));
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext('2d')?.drawImage(img, 0, 0);
          blobToCopy = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), 'image/png'));
        }
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blobToCopy }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  if (!image.compressedUrl) {
    return null;
  }

  return (
    <div id="comparison-view" className="w-full bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      {/* Header with savings badge & user's exact phrase */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'hinglish' ? 'Live Before vs After Quality Check' : lang === 'hindi' ? 'गुणवत्ता तुलना' : 'Quality Inspector'}
            </h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
              {savingsPercent > 0 ? `-${savingsPercent}% 🚀` : 'Optimized'}
            </span>
          </div>

          {/* User's signature tagline phrase: "Pehle: oldSizeKB | Ab: newSizeKB - Ho Gaya!" */}
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
            {lang === 'hinglish' ? (
              <>Pehle: <span className="font-mono tabular-nums">{formatBytes(origSize)}</span> | Ab: <span className="font-mono tabular-nums">{formatBytes(compSize)}</span> - Ho Gaya!</>
            ) : lang === 'hindi' ? (
              <>पहले: <span className="font-mono tabular-nums">{formatBytes(origSize)}</span> | अब: <span className="font-mono tabular-nums">{formatBytes(compSize)}</span> - हो गया!</>
            ) : (
              <>Original: <span className="font-mono tabular-nums">{formatBytes(origSize)}</span> | Compressed: <span className="font-mono tabular-nums">{formatBytes(compSize)}</span> - Done!</>
            )}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                viewMode === 'split' ? 'bg-white dark:bg-slate-700 shadow-xs text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
              }`}
            >
              Split Slider
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                viewMode === 'side-by-side' ? 'bg-white dark:bg-slate-700 shadow-xs text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
              }`}
            >
              Side-by-Side
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            title={t.copyImage}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-xs hover:shadow-indigo-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>{t.downloadSingle}</span>
          </button>
        </div>
      </div>

      {copied && (
        <div className="my-2 py-1.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          <span>{t.copiedNotice}</span>
        </div>
      )}

      {/* Viewport: Split or Side by Side */}
      <div className="mt-5">
        {viewMode === 'split' ? (
          <div
            ref={containerRef}
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
            className="relative w-full h-[360px] sm:h-[460px] rounded-xl overflow-hidden select-none cursor-ew-resize bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            {/* Background Layer: Compressed Image */}
            <img
              src={image.compressedUrl}
              alt="Compressed"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Foreground Layer: Original Image clipped by slider position */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={image.originalUrl}
                alt="Original"
                className="absolute inset-0 w-full h-full object-contain max-w-none"
                style={{ width: containerRef.current?.clientWidth || '100%' }}
              />
            </div>

            {/* Vertical Divider Line with handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-md flex items-center justify-center border border-slate-300 dark:border-slate-700 pointer-events-auto cursor-ew-resize">
                <span className="text-[11px] font-bold select-none">&harr;</span>
              </div>
            </div>

            {/* Labels overlay */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-medium pointer-events-none">
              Original: <span className="font-mono tabular-nums">{formatBytes(origSize)}</span>
            </div>
            <div className="absolute top-3 right-3 bg-indigo-600/90 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-medium pointer-events-none">
              Compressed: <span className="font-mono tabular-nums">{formatBytes(compSize)}</span>
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-slate-200 text-[11px] px-3 py-1 rounded-full pointer-events-none">
              Drag slider left &amp; right to inspect sharpness
            </div>
          </div>
        ) : (
          /* Side by side view */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-900">
              <div className="px-3 py-2 bg-slate-800/80 text-white text-xs flex justify-between items-center">
                <span className="font-medium">Original</span>
                <span className="font-mono tabular-nums text-slate-300">{formatBytes(origSize)} ({image.originalWidth}x{image.originalHeight}px)</span>
              </div>
              <div className="h-[280px] sm:h-[340px] flex items-center justify-center p-2">
                <img src={image.originalUrl} alt="Original" className="max-h-full max-w-full object-contain" />
              </div>
            </div>

            <div className="flex flex-col border border-indigo-200 dark:border-indigo-900/40 rounded-xl overflow-hidden bg-slate-900">
              <div className="px-3 py-2 bg-indigo-900/80 text-white text-xs flex justify-between items-center">
                <span className="font-medium text-indigo-300">Compressed</span>
                <span className="font-mono tabular-nums text-emerald-400 font-bold">{formatBytes(compSize)} ({image.compressedWidth}x{image.compressedHeight}px)</span>
              </div>
              <div className="h-[280px] sm:h-[340px] flex items-center justify-center p-2">
                <img src={image.compressedUrl} alt="Compressed" className="max-h-full max-w-full object-contain" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compression Metadata Details */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="text-slate-400 text-[11px]">Original File</div>
          <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{image.name}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="text-slate-400 text-[11px]">Initial Size</div>
          <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">{formatBytes(origSize)}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="text-slate-400 text-[11px]">Compressed Size</div>
          <div className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{formatBytes(compSize)}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="text-slate-400 text-[11px]">Space Reduced</div>
          <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
            {savingsPercent}% Saved
          </div>
        </div>
      </div>
    </div>
  );
};
