import React, { useState } from 'react';
import { X, DollarSign, Check, ExternalLink, AlertCircle, Info, Copy } from 'lucide-react';
import { Language } from '../types';

interface AdSenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pubId: string;
  onSavePubId: (id: string) => void;
  showTestAds: boolean;
  onToggleTestAds: (show: boolean) => void;
  lang: Language;
}

export const AdSenseModal: React.FC<AdSenseModalProps> = ({
  isOpen,
  onClose,
  pubId,
  onSavePubId,
  showTestAds,
  onToggleTestAds,
  lang,
}) => {
  const [localPubId, setLocalPubId] = useState(pubId);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSavePubId(localPubId.trim());
    onClose();
  };

  const adCodeSnippet = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${
    localPubId || 'ca-pub-XXXXXXXXXXXXXXXX'
  }" crossorigin="anonymous"></script>
<!-- Indore Tools Responsive Ad -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${localPubId || 'ca-pub-XXXXXXXXXXXXXXXX'}"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(adCodeSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Google AdSense Monetization Setup
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                "Yaha par baad me Google Ad aayega - Yahi se kamai hogi"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          {/* Ad slot visibility toggle */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Ad Slots Preview Mode</div>
              <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                Displays the 728x90 and 300x250 placeholder ad containers on screen
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showTestAds}
                onChange={(e) => onToggleTestAds(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* AdSense Publisher ID Input */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Google AdSense Publisher ID (Client ID)
            </label>
            <input
              type="text"
              value={localPubId}
              onChange={(e) => setLocalPubId(e.target.value)}
              placeholder="e.g. ca-pub-1234567890123456"
              className="w-full px-3 py-2 font-mono text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Found inside your Google AdSense account &rarr; Account &rarr; Settings &rarr; Account information.
            </p>
          </div>

          {/* Ad script snippet preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Ready-to-Deploy Ad Unit Code
              </span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
              {adCodeSnippet}
            </pre>
          </div>

          {/* AdSense Approval Advice for Indore Tools */}
          <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-slate-700 dark:text-slate-300 space-y-1.5">
            <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>How to maximize AdSense revenue on this tool:</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
              <li><strong>High Utility Traffic:</strong> Indian exam applicants (SSC, UPSC, Railway) compress millions of photos monthly.</li>
              <li><strong>Clean Layout:</strong> Ads placed adjacent to download buttons achieve 2.5x higher CTR.</li>
              <li><strong>100% Privacy:</strong> Zero server uploads ensures strict compliance with Google Publisher Policies.</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 rounded-lg shadow-xs cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
