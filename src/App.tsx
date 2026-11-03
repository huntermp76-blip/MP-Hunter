/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, ArrowDown, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { Header } from './components/Header';
import { AdBanner } from './components/AdBanner';
import { DropZone } from './components/DropZone';
import { CompressionControls } from './components/CompressionControls';
import { ComparisonSlider } from './components/ComparisonSlider';
import { FileList } from './components/FileList';
import { GovtExamGuide } from './components/GovtExamGuide';
import { AdSenseModal } from './components/AdSenseModal';
import { Footer } from './components/Footer';
import { CompressionSettings, ProcessedImage, Language, ExamPreset } from './types';
import { compressImage } from './utils/compressor';
import { translations } from './utils/translations';

export default function App() {
  const [lang, setLang] = useState<Language>('hinglish');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('indore_theme') === 'dark' ||
        (!('indore_theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoadingSample, setIsLoadingSample] = useState<boolean>(false);

  // AdSense state
  const [isAdModalOpen, setIsAdModalOpen] = useState<boolean>(false);
  const [showTestAds, setShowTestAds] = useState<boolean>(true);
  const [pubId, setPubId] = useState<string>(() => {
    return localStorage.getItem('indore_pub_id') || '';
  });

  // Compression settings
  const [settings, setSettings] = useState<CompressionSettings>({
    mode: 'targetSize', // Default to target size as it's the #1 need in India, or easily switch to quality slider
    quality: 0.7, // 70% quality matching user prototype
    targetSizeKb: 45, // Under 50 KB standard
    format: 'image/jpeg',
    scalePercent: 100,
    maintainAspectRatio: true,
    stripMetadata: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync dark class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('indore_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('indore_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Save AdSense Publisher ID
  const handleSavePubId = (newId: string) => {
    setPubId(newId);
    localStorage.setItem('indore_pub_id', newId);
  };

  // Process a list of files with given settings
  const processFiles = useCallback(
    async (files: File[], currentSettings: CompressionSettings) => {
      setIsProcessing(true);
      const newItems: ProcessedImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const originalUrl = URL.createObjectURL(file);

        // Read initial dimensions
        const img = new Image();
        img.src = originalUrl;
        await new Promise((r) => (img.onload = r));

        const item: ProcessedImage = {
          id,
          name: file.name,
          originalFile: file,
          originalSize: file.size,
          originalWidth: img.naturalWidth || img.width,
          originalHeight: img.naturalHeight || img.height,
          originalUrl,
          status: 'compressing',
        };

        try {
          const startTime = performance.now();
          const { blob, width, height } = await compressImage(file, currentSettings);
          const endTime = performance.now();

          item.compressedBlob = blob;
          item.compressedSize = blob.size;
          item.compressedWidth = width;
          item.compressedHeight = height;
          item.compressedUrl = URL.createObjectURL(blob);
          item.status = 'done';
          item.compressionTimeMs = Math.round(endTime - startTime);
        } catch (err: any) {
          item.status = 'error';
          item.errorMessage = err?.message || 'Compression failed';
        }

        newItems.push(item);
      }

      setImages((prev) => [...newItems, ...prev]);
      if (newItems.length > 0) {
        setSelectedId(newItems[0].id);
      }
      setIsProcessing(false);
    },
    []
  );

  // Handle incoming files from Dropzone / input
  const handleFilesSelected = (files: File[]) => {
    processFiles(files, settings);
  };

  // Re-compress existing files when settings change
  const handleRecompressAll = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    const updated = await Promise.all(
      images.map(async (item) => {
        try {
          const startTime = performance.now();
          const { blob, width, height } = await compressImage(
            item.originalFile,
            settings
          );
          const endTime = performance.now();

          // Revoke old URL if present
          if (item.compressedUrl) {
            URL.revokeObjectURL(item.compressedUrl);
          }

          return {
            ...item,
            compressedBlob: blob,
            compressedSize: blob.size,
            compressedWidth: width,
            compressedHeight: height,
            compressedUrl: URL.createObjectURL(blob),
            status: 'done' as const,
            compressionTimeMs: Math.round(endTime - startTime),
          };
        } catch (err: any) {
          return {
            ...item,
            status: 'error' as const,
            errorMessage: err?.message || 'Failed',
          };
        }
      })
    );

    setImages(updated);
    setIsProcessing(false);
  };

  // Apply exam preset
  const handleSelectExamPreset = (preset: ExamPreset) => {
    const updatedSettings: CompressionSettings = {
      ...settings,
      mode: 'targetSize',
      targetSizeKb: preset.targetSizeKb,
      format: preset.format,
      scalePercent: 100,
    };
    setSettings(updatedSettings);

    // Scroll smoothly to compressor card
    document.getElementById('compressor-card')?.scrollIntoView({ behavior: 'smooth' });

    // If images exist, re-compress them with this preset automatically!
    if (images.length > 0) {
      setTimeout(() => {
        processFiles(
          images.map((img) => img.originalFile),
          updatedSettings
        );
      }, 100);
    }
  };

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const imageFiles = Array.from(e.clipboardData.files).filter((f) =>
          f.type.startsWith('image/')
        );
        if (imageFiles.length > 0) {
          processFiles(imageFiles, settings);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFiles, settings]);

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (selectedId === id && filtered.length > 0) {
        setSelectedId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleClearAll = () => {
    images.forEach((img) => {
      if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
      if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
    });
    setImages([]);
    setSelectedId('');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectedImage = images.find((img) => img.id === selectedId) || images[0];
  const t = translations[lang];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Bar Contract compliant navigation */}
      <Header
        lang={lang}
        onLangChange={setLang}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenAdSettings={() => setIsAdModalOpen(true)}
        onScrollToSection={scrollToSection}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Ad Slot #1: Header Leaderboard (As requested in user brief: "Yaha par baad me Google Ad aayega - Yahi se kamai hogi") */}
        <AdBanner
          slotType="top-leaderboard"
          lang={lang}
          showTestAds={showTestAds}
          pubId={pubId}
          onOpenSettings={() => setIsAdModalOpen(true)}
        />

        {/* Hero Section: Indore Tools Title & Headline */}
        <div className="text-center my-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Indore Tools · 100% Free &amp; Offline Browser Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            📸 {t.tagline}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 font-normal">
            {t.subtitle}
          </p>
        </div>

        {/* Primary Interactive Workspace Grid */}
        <div id="compressor-card" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-6">
          {/* Left Column: Dropzone & Controls (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <DropZone
              lang={lang}
              onFilesSelected={handleFilesSelected}
              isLoadingSample={isLoadingSample}
              setIsLoadingSample={setIsLoadingSample}
            />

            <CompressionControls
              settings={settings}
              onChange={(updated) => setSettings((prev) => ({ ...prev, ...updated }))}
              lang={lang}
              onCompress={handleRecompressAll}
              isProcessing={isProcessing}
              hasFiles={images.length > 0}
            />
          </div>

          {/* Right Column: Queue, Inspector & Sidebar Ad (5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Ad Slot #2: Sidebar Medium Rectangle (As requested in user brief: "Yaha dusra Ad aayega") */}
            <AdBanner
              slotType="sidebar-rectangle"
              lang={lang}
              showTestAds={showTestAds}
              pubId={pubId}
              onOpenSettings={() => setIsAdModalOpen(true)}
            />

            {/* Batch Files Queue */}
            {images.length > 0 && (
              <FileList
                images={images}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onRemove={handleRemoveImage}
                onClearAll={handleClearAll}
                onAddMore={() => fileInputRef.current?.click()}
                lang={lang}
              />
            )}
          </div>
        </div>

        {/* Full-width Quality Inspector (Comparison Slider) when an image is processed */}
        {selectedImage && selectedImage.compressedUrl && (
          <div className="my-8">
            <ComparisonSlider image={selectedImage} lang={lang} />
          </div>
        )}

        {/* Ad Slot #3: In-feed bottom leaderboard */}
        <AdBanner
          slotType="in-feed-bottom"
          lang={lang}
          showTestAds={showTestAds}
          pubId={pubId}
          onOpenSettings={() => setIsAdModalOpen(true)}
        />

        {/* Comprehensive Indian Govt Exams Photo Size Guide */}
        <GovtExamGuide lang={lang} onSelectPreset={handleSelectExamPreset} />
      </main>

      {/* Hidden file input for "Add More" */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files) handleFilesSelected(Array.from(e.target.files));
          e.target.value = '';
        }}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Webmaster AdSense Configuration Modal */}
      <AdSenseModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        pubId={pubId}
        onSavePubId={handleSavePubId}
        showTestAds={showTestAds}
        onToggleTestAds={setShowTestAds}
        lang={lang}
      />

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
}
