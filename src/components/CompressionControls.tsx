import React from 'react';
import { Sliders, Target, Check, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { CompressionSettings, Language, OutputFormat } from '../types';
import { translations } from '../utils/translations';

interface CompressionControlsProps {
  settings: CompressionSettings;
  onChange: (updated: Partial<CompressionSettings>) => void;
  lang: Language;
  onCompress: () => void;
  isProcessing: boolean;
  hasFiles: boolean;
}

export const CompressionControls: React.FC<CompressionControlsProps> = ({
  settings,
  onChange,
  lang,
  onCompress,
  isProcessing,
  hasFiles,
}) => {
  const t = translations[lang];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {t.compressionMode}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {settings.mode === 'targetSize' ? t.modeTargetSizeDesc : t.modeQualityDesc}
          </p>
        </div>

        {/* Mode Segmented Switch */}
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onChange({ mode: 'targetSize' })}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              settings.mode === 'targetSize'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            {lang === 'hinglish' ? 'Target KB (Exact Size)' : lang === 'hindi' ? 'निश्चित KB सीमा' : 'Target KB Size'}
          </button>
          <button
            type="button"
            onClick={() => onChange({ mode: 'quality' })}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              settings.mode === 'quality'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {lang === 'hinglish' ? 'Quality Slider (70%)' : lang === 'hindi' ? 'क्वालिटी स्लाइडर' : 'Quality Slider'}
          </button>
        </div>
      </div>

      <div className="py-6 space-y-6">
        {/* Branch 1: Target Size Mode */}
        {settings.mode === 'targetSize' ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{t.targetSizeLabel}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold">
                  {settings.targetSizeKb} KB
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Custom KB:</span>
                <input
                  type="number"
                  min="5"
                  max="5000"
                  value={settings.targetSizeKb}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) onChange({ targetSizeKb: val });
                  }}
                  className="w-20 px-2.5 py-1 text-sm font-mono font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-xs font-medium text-slate-500">KB</span>
              </div>
            </div>

            {/* Quick preset chips */}
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                {t.quickPresets}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ targetSizeKb: 18, format: 'image/jpeg' })}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    settings.targetSizeKb === 18
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">Signature (Sign)</div>
                  <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                    &lt; 20 KB
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ targetSizeKb: 45, format: 'image/jpeg' })}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    settings.targetSizeKb === 45
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">Passport Photo</div>
                  <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                    &lt; 50 KB (SSC/Bank)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ targetSizeKb: 150, format: 'image/jpeg' })}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    settings.targetSizeKb === 150
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">ID & Documents</div>
                  <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                    &lt; 200 KB (UPSC/Govt)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ targetSizeKb: 250, format: 'image/webp' })}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    settings.targetSizeKb === 250
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">WhatsApp / Social</div>
                  <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                    &lt; 300 KB (WebP)
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Branch 2: Quality Slider Mode (Matches user prototype with slider + % label) */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="quality-range"
                className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2"
              >
                <span>{t.qualityLabel}</span>
                <span
                  id="qval"
                  className="font-mono text-sm px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold"
                >
                  {Math.round(settings.quality * 100)}%
                </span>
              </label>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Recommended: 70%</span>
              </div>
            </div>

            <div className="relative">
              <input
                id="quality-range"
                type="range"
                min="10"
                max="100"
                step="5"
                value={Math.round(settings.quality * 100)}
                onChange={(e) => onChange({ quality: Number(e.target.value) / 100 })}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1.5">
                <span>10% (Maximum Size Drop)</span>
                <span>50%</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">70% (Sweet Spot)</span>
                <span>90%</span>
                <span>100% (Lossless)</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              {t.qualityHint}
            </p>
          </div>
        )}

        {/* Format & Dimension Scaling Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60 dark:border-slate-800">
          {/* Format Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {t.outputFormat}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onChange({ format: 'image/jpeg' })}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-center ${
                  settings.format === 'image/jpeg'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                JPG / JPEG
              </button>
              <button
                type="button"
                onClick={() => onChange({ format: 'image/webp' })}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-center ${
                  settings.format === 'image/webp'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                WebP (Smallest)
              </button>
              <button
                type="button"
                onClick={() => onChange({ format: 'image/png' })}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-center ${
                  settings.format === 'image/png'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                PNG
              </button>
            </div>
          </div>

          {/* Scale Resolution */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {t.resizeOptions}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[100, 75, 50, 25].map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => onChange({ scalePercent: scale })}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-center ${
                    settings.scalePercent === scale
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {scale}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Metadata Stripping Checkbox */}
        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={settings.stripMetadata}
              onChange={(e) => onChange({ stripMetadata: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
            />
            <span>{t.stripExif}</span>
          </label>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero Data Leakage
          </span>
        </div>
      </div>

      {/* Main Compress Action Trigger */}
      {hasFiles && (
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Settings badalne par button dabayein taaki photo re-compress ho jaye
          </span>

          <button
            type="button"
            disabled={isProcessing}
            onClick={onCompress}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? t.actionCompressing : t.actionRecompress}</span>
          </button>
        </div>
      )}
    </div>
  );
};
