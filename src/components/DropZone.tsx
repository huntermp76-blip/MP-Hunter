import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { createSamplePassportPhoto, createSampleSignature, createSampleCameraPhoto } from '../utils/samples';

interface DropZoneProps {
  lang: Language;
  onFilesSelected: (files: File[]) => void;
  isLoadingSample: boolean;
  setIsLoadingSample: (loading: boolean) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  lang,
  onFilesSelected,
  isLoadingSample,
  setIsLoadingSample,
}) => {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
      // Reset input value so same file can be re-selected if deleted
      e.target.value = '';
    }
  };

  const loadSample = async (type: 'passport' | 'signature' | 'camera') => {
    try {
      setIsLoadingSample(true);
      let sampleFile: File;
      if (type === 'passport') {
        sampleFile = await createSamplePassportPhoto();
      } else if (type === 'signature') {
        sampleFile = await createSampleSignature();
      } else {
        sampleFile = await createSampleCameraPhoto();
      }
      onFilesSelected([sampleFile]);
    } catch (err) {
      console.error('Failed to create sample image:', err);
    } finally {
      setIsLoadingSample(false);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 ring-4 ring-indigo-500/10'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50/50 dark:hover:bg-slate-900/80 shadow-xs'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/jpeg,image/png,image/webp,image/jpg"
          multiple
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-inner">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {t.dropTitle}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {t.dropSubtitle}
          </p>

          <button
            type="button"
            className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl shadow-sm hover:shadow-indigo-500/25 transition-all cursor-pointer"
          >
            {t.browseButton}
          </button>

          <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 dark:text-slate-500">
            <span>{t.pasteTip}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Private (No upload)</span>
          </div>
        </div>
      </div>

      {/* Quick Sample Photos for instant 1-click test */}
      <div className="mt-4 p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="font-medium">{t.samplePrompt}</span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            disabled={isLoadingSample}
            onClick={() => loadSample('passport')}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            📋 {t.samplePassport} (SSC/Bank)
          </button>
          <button
            type="button"
            disabled={isLoadingSample}
            onClick={() => loadSample('signature')}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            ✍️ {t.sampleSignature} (Sign)
          </button>
          <button
            type="button"
            disabled={isLoadingSample}
            onClick={() => loadSample('camera')}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            🌄 {t.sampleScenery} (HD Photo)
          </button>
        </div>
      </div>
    </div>
  );
};
