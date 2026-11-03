import React from 'react';
import { Download, Trash2, CheckCircle2, Eye, Archive, Plus } from 'lucide-react';
import { ProcessedImage, Language } from '../types';
import { translations } from '../utils/translations';
import { formatBytes, downloadBlob, downloadAllAsZip } from '../utils/compressor';

interface FileListProps {
  images: ProcessedImage[];
  selectedId: string;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onAddMore: () => void;
  lang: Language;
}

export const FileList: React.FC<FileListProps> = ({
  images,
  selectedId,
  onSelect,
  onRemove,
  onClearAll,
  onAddMore,
  lang,
}) => {
  const t = translations[lang];

  if (images.length === 0) return null;

  const totalOrig = images.reduce((acc, img) => acc + img.originalSize, 0);
  const totalComp = images.reduce((acc, img) => acc + (img.compressedSize || img.originalSize), 0);
  const overallSavings = totalOrig > 0 ? Math.round(((totalOrig - totalComp) / totalOrig) * 100) : 0;

  const handleDownloadSingle = (e: React.MouseEvent, img: ProcessedImage) => {
    e.stopPropagation();
    if (!img.compressedBlob) return;
    const ext = img.compressedBlob.type.includes('png')
      ? 'png'
      : img.compressedBlob.type.includes('webp')
      ? 'webp'
      : 'jpg';
    const cleanName = img.name.replace(/\.[^/.]+$/, '');
    downloadBlob(img.compressedBlob, `${cleanName}_compressed.${ext}`);
  };

  const handleDownloadAllZip = () => {
    downloadAllAsZip(images);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      {/* Top summary row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'hinglish' ? 'Compressed Photos Batch' : lang === 'hindi' ? 'कंप्रेस की गई फोटो सूची' : 'Batch Photo Queue'}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
              {images.length} {images.length === 1 ? 'file' : 'files'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>Total: <strong className="font-mono text-slate-700 dark:text-slate-200">{formatBytes(totalOrig)}</strong></span>
            <span>&rarr;</span>
            <span>Now: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{formatBytes(totalComp)}</strong></span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">({overallSavings}% Saved)</span>
          </div>
        </div>

        {/* Batch buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onAddMore}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addMore}</span>
          </button>

          <button
            onClick={handleDownloadAllZip}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-xs hover:shadow-indigo-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Archive className="w-4 h-4" />
            <span>{t.downloadAllZip}</span>
          </button>

          <button
            onClick={onClearAll}
            className="p-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            title={t.clearAll}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of uploaded images */}
      <div className="mt-4 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {images.map((img) => {
          const isSelected = img.id === selectedId;
          const savings =
            img.compressedSize && img.originalSize > 0
              ? Math.round(((img.originalSize - img.compressedSize) / img.originalSize) * 100)
              : 0;

          return (
            <div
              key={img.id}
              onClick={() => onSelect(img.id)}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <img
                    src={img.compressedUrl || img.originalUrl}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {img.name}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{formatBytes(img.originalSize)}</span>
                    <span>&rarr;</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {img.compressedSize ? formatBytes(img.compressedSize) : 'Processing...'}
                    </span>
                    {savings > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                        -{savings}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(img.id);
                  }}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Compare / Inspect"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDownloadSingle(e, img)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
                  title="Download this file"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(img.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Remove from queue"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
