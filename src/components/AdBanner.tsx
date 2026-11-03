import React from 'react';
import { Sparkles, DollarSign, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface AdBannerProps {
  slotType: 'top-leaderboard' | 'sidebar-rectangle' | 'in-feed-bottom';
  lang: Language;
  showTestAds: boolean;
  pubId?: string;
  onOpenSettings?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotType,
  lang,
  showTestAds,
  pubId,
  onOpenSettings,
}) => {
  const t = translations[lang];

  if (!showTestAds) return null;

  if (slotType === 'top-leaderboard') {
    return (
      <div className="w-full my-4 flex flex-col items-center">
        <div className="w-full max-w-4xl min-h-[90px] p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-dashed border-amber-300 dark:border-amber-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  {lang === 'hinglish' ? 'Google Ad Slot (Header)' : lang === 'hindi' ? 'गूगल एड्स स्लॉट' : 'Google Ad Placement'}
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-mono">
                  728x90 / Responsive
                </span>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                {lang === 'hinglish'
                  ? 'Yaha par baad me Google Ad aayega - Yahi se kamai hogi'
                  : lang === 'hindi'
                  ? 'यहाँ पर बाद में गूगल एड्स (Google AdSense) आएगा - यहीं से कमाई होगी'
                  : 'Reserved for Google AdSense Leaderboard · Auto-monetizes traffic'}
              </p>
            </div>
          </div>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-200/60 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors whitespace-nowrap cursor-pointer"
            >
              Configure AdSense
            </button>
          )}
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
          Advertisement
        </span>
      </div>
    );
  }

  if (slotType === 'sidebar-rectangle') {
    return (
      <div className="w-full my-4 flex flex-col items-center">
        <div className="w-full min-h-[220px] p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-dashed border-amber-300 dark:border-amber-800/60 flex flex-col items-center justify-center text-center gap-2 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            {lang === 'hinglish' ? 'Google Ad Slot (300x250)' : lang === 'hindi' ? 'गूगल विज्ञापन स्लॉट (300x250)' : 'Google Ad Placement (300x250)'}
          </span>
          <p className="text-xs text-amber-700 dark:text-amber-400 max-w-xs">
            {lang === 'hinglish'
              ? 'Yaha dusra Ad aayega (High CTR Rectangle)'
              : lang === 'hindi'
              ? 'यहाँ दूसरा विज्ञापन स्लॉट आएगा'
              : 'High CTR Medium Rectangle slot (300x250)'}
          </p>
          <span className="text-[11px] font-mono text-amber-600/80 dark:text-amber-400/80 mt-1">
            {pubId ? `Client: ${pubId}` : 'Slot Ready: Paste ca-pub ID'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
          Advertisement
        </span>
      </div>
    );
  }

  // in-feed-bottom
  return (
    <div className="w-full my-6 flex flex-col items-center">
      <div className="w-full max-w-4xl min-h-[80px] p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-dashed border-amber-300 dark:border-amber-800/60 flex items-center justify-between text-left gap-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              {lang === 'hinglish' ? 'In-Feed Ad Placement' : lang === 'hindi' ? 'निचला विज्ञापन स्लॉट' : 'Bottom Leaderboard Ad'}
            </span>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              {lang === 'hinglish'
                ? 'Download ke baad user dekhega - Maximum visibility & earnings'
                : lang === 'hindi'
                ? 'डाउनलोड के उपरांत दृश्यमान विज्ञापन स्लॉट'
                : 'High engagement placement post-conversion'}
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-1 rounded bg-amber-200/50 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 hidden sm:inline">
          Responsive Banner
        </span>
      </div>
      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
        Advertisement
      </span>
    </div>
  );
};
