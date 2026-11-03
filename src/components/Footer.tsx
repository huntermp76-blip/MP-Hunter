import React from 'react';
import { ShieldCheck, Heart, Zap, Cpu } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200/60 dark:border-slate-800 pt-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">IT</div>
              <span className="font-bold text-slate-900 dark:text-white">Indore Tools</span>
            </div>
            <span className="text-xs text-slate-400"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'hinglish' ? 'Photo Size Kam Karo' : lang === 'hindi' ? 'फोटो का साइज कम करें' : 'Image Compression Tool'}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md">
              {lang === 'hinglish' ? 'Bina quality kharab hue photo ka size kam karein. SSC, UPSC, Bank, PAN Card aur WhatsApp ke liye sahi.' : lang === 'hindi' ? 'बिना क्वालिटी खराब हुए फोटो का साइज घटाएं. सरकारी परीक्षाओं, पैन कार्ड व वेब उपयोग हेतु सर्वोत्तम निःशुल्क टूल।' : '100% free client-side image compression tool. Compress photos for SSC, UPSC, banking portals, and web.'}
            </p>
          </div>

          <div id="privacy-guarantee" className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200">100% Private & On-Device Processing</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                {lang === 'hinglish' ? 'Aapki photos hamare server par nahi aati, browser me hi compress hoti hain.' : lang === 'hindi' ? 'आपकी फोटो सुरक्षित हैं, यह केवल आपके फोन/कंप्यूटर पर ही प्रोसेस होती हैं।' : 'Files never leave your device. All compression runs via HTML5 Canvas.'}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <div>&copy; {new Date().getFullYear()} Indore Tools. All rights reserved.</div>
          
          <div className="flex items-center gap-4">
            <a href="/about.html" className="hover:text-indigo-600 hover:underline">About</a>
            <a href="/contact.html" className="hover:text-indigo-600 hover:underline">Contact</a>
            <a href="/privacy.html" className="hover:text-indigo-600 hover:underline">Privacy Policy</a>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Made with precision for India & global web</span>
            <span aria-hidden="true">•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium"><Zap className="w-3.5 h-3.5" />Works Offline</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
