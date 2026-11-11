import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/translations';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { language, setLanguage } = useLanguage();

  const options: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' }
  ];

  return (
    <div className="flex items-center space-x-1.5 bg-white/90 border border-slate-200 rounded-lg px-2.5 py-1 shadow-sm">
      <Globe className="w-4 h-4 text-agri-700" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-transparent text-xs sm:text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
        aria-label="Select Language"
      >
        {options.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {compact ? opt.code.toUpperCase() : opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

