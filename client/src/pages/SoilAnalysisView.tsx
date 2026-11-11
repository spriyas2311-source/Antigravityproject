import React, { useState } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { SoilHealthRadarChart } from '../components/soil/SoilHealthRadarChart';
import { AudioPlayer } from '../components/common/AudioPlayer';
import {
  FlaskConical,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const SoilAnalysisView: React.FC = () => {
  const { language, t } = useLanguage();

  const [soilType, setSoilType] = useState('BLACK_COTTON_REGUR');
  const [ph, setPh] = useState<number>(7.4);
  const [nitrogen, setNitrogen] = useState<string>('240');
  const [phosphorus, setPhosphorus] = useState<string>('14');
  const [potassium, setPotassium] = useState<string>('280');
  const [nutrientUnit, setNutrientUnit] = useState('kg/ha');
  const [organicCarbon, setOrganicCarbon] = useState<string>('0.52');
  const [electricalConductivity, setElectricalConductivity] = useState<string>('0.45');
  const [soilTestDate, setSoilTestDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      soilType,
      ph: Number(ph),
      nitrogen: nitrogen ? Number(nitrogen) : undefined,
      phosphorus: phosphorus ? Number(phosphorus) : undefined,
      potassium: potassium ? Number(potassium) : undefined,
      nutrientUnit,
      organicCarbon: organicCarbon ? Number(organicCarbon) : undefined,
      electricalConductivity: electricalConductivity ? Number(electricalConductivity) : undefined,
      soilTestDate,
      preferredLanguage: language
    };

    try {
      const res = await api.createSoilAnalysis(payload);
      if (res.success && res.data?.ai_result) {
        setResult(res.data.ai_result);
      } else {
        setErrorMsg(res.message || 'Failed to complete soil analysis.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with AI service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <FlaskConical className="w-4 h-4" />
          <span>ICAR-Aligned Pedological Assessment</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Soil Health & Nutrient Analysis
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Digitize your physical soil testing laboratory report to diagnose nutrient gaps and soil pH balance.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Classification *</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
            >
              <option value="BLACK_COTTON_REGUR">Black Cotton Soil (Regur)</option>
              <option value="ALLUVIAL">Alluvial Soil</option>
              <option value="RED_SANDY_LOAM">Red Sandy Loam</option>
              <option value="LATERITIC">Laterite Soil</option>
              <option value="COASTAL_SALINE">Coastal Saline Soil</option>
              <option value="DESERT_ARID">Arid / Sandy Soil</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Reaction (pH: 0-14) *</label>
            <input
              type="number"
              step="0.1"
              min="3.0"
              max="11.0"
              required
              value={ph}
              onChange={(e) => setPh(parseFloat(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Test Date</label>
            <input
              type="date"
              value={soilTestDate}
              onChange={(e) => setSoilTestDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
            />
          </div>
        </div>

        {/* NPK and Organic Parameters */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Laboratory Nutrient Measurements
            </h3>
            <span className="text-xs text-slate-500">Unit: {nutrientUnit}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Available Nitrogen (N)</label>
              <input
                type="number"
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value)}
                placeholder="kg/ha"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Available Phosphorus (P)</label>
              <input
                type="number"
                value={phosphorus}
                onChange={(e) => setPhosphorus(e.target.value)}
                placeholder="kg/ha"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Available Potassium (K)</label>
              <input
                type="number"
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
                placeholder="kg/ha"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Organic Carbon (OC %)</label>
              <input
                type="number"
                step="0.01"
                value={organicCarbon}
                onChange={(e) => setOrganicCarbon(e.target.value)}
                placeholder="e.g. 0.55"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl shadow-lg shadow-amber-600/20 text-base flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Soil Chemistry...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>Generate Soil Health Assessment</span>
            </>
          )}
        </button>
      </form>

      {/* Analysis Results Display */}
      {result && (
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-8 animate-fadeIn">
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                Soil Health Analysis Dossier
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Fertility Status & Soil Correction Plan
              </h2>
            </div>
            <AudioPlayer text={result.summary} langCode={language} />
          </div>

          {/* Visual Soil Health Radar Chart */}
          <SoilHealthRadarChart
            nitrogen={Number(nitrogen) || 280}
            phosphorus={Number(phosphorus) || 15}
            potassium={Number(potassium) || 200}
            ph={Number(ph) || 7.0}
            organicCarbon={Number(organicCarbon) || 0.6}
          />

          {/* Summary */}
          <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200 text-amber-950 text-sm leading-relaxed">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-amber-900">Soil Condition Summary</h4>
            <p>{result.summary}</p>
          </div>

          {/* pH & Nutrient Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-900 text-sm block">pH Reaction & Availability</span>
              <p className="text-slate-700">
                <span className="font-semibold">Value:</span> {result.ph_assessment?.value} ({result.ph_assessment?.interpretation})
              </p>
              <p className="text-slate-600">{result.ph_assessment?.impact_on_nutrients}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-900 text-sm block">NPK & Organic Carbon Ratings</span>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">NITROGEN</span>
                  <span className="font-extrabold text-slate-800">{result.nutrient_status?.nitrogen || 'NORMAL'}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">PHOSPHORUS</span>
                  <span className="font-extrabold text-slate-800">{result.nutrient_status?.phosphorus || 'NORMAL'}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">POTASSIUM</span>
                  <span className="font-extrabold text-slate-800">{result.nutrient_status?.potassium || 'OPTIMAL'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Improvement Recommendations */}
          {result.soil_amendment_recommendations && result.soil_amendment_recommendations.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Recommended Soil Amendments & Dosing
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.soil_amendment_recommendations.map((amend: any, i: number) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-xs font-bold text-agri-700 block">{amend.amendment_type}</span>
                    <p className="text-xs font-semibold text-slate-800">Dosage: {amend.dosage_per_acre}</p>
                    <p className="text-xs text-slate-500">{amend.application_method}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compatible Crops */}
          {result.compatible_crops_for_soil && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block mb-1">Naturally Compatible Crops for this Soil:</span>
              <p className="text-slate-700">{result.compatible_crops_for_soil.join(', ')}</p>
            </div>
          )}

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block mb-0.5">Laboratory Protocol Notice</span>
              {result.disclaimer || t.disclaimerNotice}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

