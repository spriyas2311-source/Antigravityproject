import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldAlert, BookOpen, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              {t.appName}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.tagline}. Designed to reduce agricultural uncertainty for smallholder and commercial Indian farming communities.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-agri-600" />
              <span>Scientific Agronomic References</span>
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li className="flex items-center space-x-1">
                <span>ICAR Package of Practices</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center space-x-1">
                <span>IMD Agrometeorological Advisory (AAS)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center space-x-1">
                <span>CIB&RC Central Insecticides Board Standards</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Safety & Uncertainty Notice</span>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed bg-amber-50/70 p-3 rounded-lg border border-amber-200/60">
              {t.disclaimerNotice}
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Krishi Mitra AI. Built with precision for sustainable Indian agriculture.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Empowering Farmers</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>Across India</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

