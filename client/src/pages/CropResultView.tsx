import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { AudioPlayer } from '../components/common/AudioPlayer';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Wheat,
  Download,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Droplets,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const CropResultView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const reportRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function fetchResult() {
      if (!id || id === 'latest') {
        const cached = sessionStorage.getItem('krishi_latest_crop_result');
        if (cached) {
          setData(JSON.parse(cached));
          setIsLoading(false);
          return;
        }
      }

      try {
        const res = await api.getCropRecommendationById(id!);
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setErrorMsg('Advisory report could not be found.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error loading report.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchResult();
  }, [id]);

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`KrishiMitra_CropPlan_${id || 'Report'}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Formatting Agronomic Dossier..." />
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800">Report Unavailable</h2>
          <p className="text-xs text-slate-500 mt-1">{errorMsg}</p>
          <Link
            to="/crop-recommendation"
            className="mt-6 inline-flex items-center space-x-2 text-xs font-bold text-white bg-agri-600 px-4 py-2.5 rounded-xl shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Generate New Recommendation</span>
          </Link>
        </div>
      </div>
    );
  }

  const aiResult = data.ai_result || {};
  const recs = aiResult.recommendations || [];
  const location = data.location || {};
  const farming = data.farming_data || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 no-print">
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-agri-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.actions.back}</span>
        </Link>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <AudioPlayer text={aiResult.summary || 'Summary of recommendations.'} langCode={language} />

          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PDF...' : t.actions.exportPdf}</span>
          </button>
        </div>
      </div>

      {/* Main Printable Dossier */}
      <div ref={reportRef} className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-8">
        {/* Report Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-agri-700 font-bold text-xs uppercase tracking-wider mb-1">
              <Wheat className="w-4 h-4" />
              <span>{t.appName} Official Crop Advisory Dossier</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Crop Suitability & Rotation Plan
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Farm Location: {location.district || 'Dharwad'}, {location.state || 'Karnataka'} • Season: {farming.season?.toUpperCase() || 'RABI'}
            </p>
          </div>

          <div className="text-right">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              aiResult.overall_confidence === 'high'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : aiResult.overall_confidence === 'moderate'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-slate-100 text-slate-700 border border-slate-300'
            }`}>
              Confidence: {aiResult.overall_confidence || 'Moderate'}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">
              Generated: {new Date(data.created_at || Date.now()).toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-800 text-sm leading-relaxed">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Agronomic Assessment</h4>
          <p>{aiResult.summary}</p>
        </div>

        {/* Recommended Crops Cards */}
        <div className="space-y-6">
          <h3 className="text-base font-bold text-slate-900">
            Top Recommended Crops ({recs.length} Identified)
          </h3>

          <div className="grid grid-cols-1 gap-6">
            {recs.map((crop: any, index: number) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-agri-400 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-agri-700 bg-agri-50 px-2 py-0.5 rounded-md border border-agri-200">
                      Rank #{index + 1} Recommendation
                    </span>
                    <h4 className="text-xl font-bold text-slate-900 mt-1">{crop.crop_name}</h4>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-agri-700">
                      {crop.suitability_score}%
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Suitability Score</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {crop.reason}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Soil Compatibility</span>
                    <span className="text-slate-800 font-semibold">{crop.soil_compatibility}</span>
                  </div>
                  <div className="bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Water Need</span>
                    <span className="text-slate-800 font-semibold">{crop.water_requirements}</span>
                  </div>
                  <div className="bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Estimated Duration</span>
                    <span className="text-slate-800 font-semibold">{crop.estimated_duration}</span>
                  </div>
                </div>

                {crop.management_tips && crop.management_tips.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-1">Key Cultivation Steps:</span>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                      {crop.management_tips.map((tip: string, i: number) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {crop.potential_risks && crop.potential_risks.length > 0 && (
                  <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200/60 text-xs text-amber-900">
                    <span className="font-bold flex items-center space-x-1 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Potential Risks to Monitor:</span>
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                      {crop.potential_risks.map((r: string, i: number) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Missing Info & Disclaimers */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          {aiResult.missing_information && aiResult.missing_information.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-800 block mb-1">Missing Parameters That Could Improve Accuracy:</span>
              <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                {aiResult.missing_information.map((info: string, i: number) => (
                  <li key={i}>{info}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block mb-0.5">Scientific Advisory Protocol Notice</span>
              {aiResult.disclaimer || t.disclaimerNotice}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

