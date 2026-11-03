import React, { useState } from 'react';
import { BookOpen, Search, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { examPresets } from '../utils/examPresets';
import { ExamPreset, Language } from '../types';
import { translations } from '../utils/translations';

interface GovtExamGuideProps {
  lang: Language;
  onSelectPreset: (preset: ExamPreset) => void;
}

export const GovtExamGuide: React.FC<GovtExamGuideProps> = ({ lang, onSelectPreset }) => {
  const t = translations[lang];
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Exam', 'Document', 'Social'];

  const filtered = examPresets.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.nameHindi.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="exam-guide-section" className="w-full bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors my-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.examGuideTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.examGuideSubtitle}
          </p>
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'hinglish' ? 'Exam / Portal search karein...' : lang === 'hindi' ? 'परीक्षा खोजें...' : 'Search exam or portal...'}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Category selector */}
      <div className="flex items-center gap-2 py-4 border-b border-slate-200/40 dark:border-slate-800/60 overflow-x-auto text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat === 'All' ? 'All Portals' : cat}
          </button>
        ))}
      </div>

      {/* Grid of exam requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {item.category}
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  &le; {item.targetSizeKb} KB
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'hindi' ? item.nameHindi : item.name}
              </h4>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {lang === 'hindi' ? item.descriptionHindi : item.description}
              </p>
            </div>

            <button
              onClick={() => onSelectPreset(item)}
              className="mt-4 w-full py-2 px-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t.applyPreset}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Pro tip footer */}
      <div className="mt-6 p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Indore Tools Portal Guarantee: </strong>
          {lang === 'hinglish'
            ? 'Humari algorithm photo ko target size se 1 KB bhi upar nahi jane deti, jisse SSC, UPSC aur Bank portal par form reject hone ka koi khatra nahi rehta.'
            : lang === 'hindi'
            ? 'हमारा एल्गोरिदम फोटो को तय सीमा से 1 KB भी अधिक नहीं होने देता, जिससे आपका फॉर्म रिजेक्ट होने का कोई खतरा नहीं रहता।'
            : 'Our binary search compression ensures the final image strictly adheres to portal file size ceilings to prevent rejection.'}
        </div>
      </div>
    </div>
  );
};
