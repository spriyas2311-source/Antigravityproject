import React, { useState } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { AudioPlayer } from '../components/common/AudioPlayer';
import { Sprout, Sparkles, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const FertilizerView: React.FC = () => {
  const { language, t } = useLanguage();

  const [cropName, setCropName] = useState('Tomato');
  const [growthStage, setGrowthStage] = useState('FLOWERING_REPRODUCTIVE');
  const [soilType, setSoilType] = useState('BLACK_COTTON_REGUR');
  const [landArea, setLandArea] = useState<number>(2.5);
  const [landUnit, setLandUnit] = useState('acre');
  const [previousFertilizer, setPreviousFertilizer] = useState('Basal DAP @ 50kg/acre + FYM');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      cropName,
      growthStage,
      soilType,
      landArea: Number(landArea),
      landUnit,
      previousFertilizer,
      preferredLanguage: language
    };

    try {
      const res = await api.createFertilizerAdvisory(payload);
      if (res.success && res.data?.ai_result) {
        setResult(res.data.ai_result);
      } else {
        setErrorMsg(res.message || 'Failed to generate fertilizer guidance.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 text-agri-700 bg-agri-50 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <Sprout className="w-4 h-4" />
          <span>Stage-Specific Nutrient Management</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Fertilizer & Nutrient Advisory
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Calculate balanced nutrient dosing tailored to your crop's active growth stage and soil type.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Name *</label>
            <input
              type="text"
              required
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="e.g. Tomato / Paddy / Wheat"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Growth Stage *</label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
            >
              <option value="SEEDLING_GERMINATION">Seedling / Germination (0-15 days)</option>
              <option value="VEGETATIVE_TILLERING">Vegetative / Tillering Stage</option>
              <option value="FLOWERING_REPRODUCTIVE">Flowering / Booting (Critical Stage)</option>
              <option value="FRUIT_SET_GRAIN_FILLING">Fruit Setting / Grain Filling</option>
              <option value="MATURITY_HARVEST">Maturity / Ripening</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Classification</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
            >
              <option value="BLACK_COTTON_REGUR">Black Cotton Soil</option>
              <option value="ALLUVIAL">Alluvial Soil</option>
              <option value="RED_SANDY_LOAM">Red Sandy Loam</option>
              <option value="LATERITIC">Laterite Soil</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Land Size *</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                value={landArea}
                onChange={(e) => setLandArea(parseFloat(e.target.value))}
                className="w-2/3 px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
              />
              <select
                value={landUnit}
                onChange={(e) => setLandUnit(e.target.value)}
                className="w-1/3 px-2 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none"
              >
                <option value="acre">Acre</option>
                <option value="hectare">Hectare</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Previously Applied Fertilizers</label>
            <input
              type="text"
              value={previousFertilizer}
              onChange={(e) => setPreviousFertilizer(e.target.value)}
              placeholder="e.g. Urea 45kg, DAP 50kg"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-agri-600 hover:bg-agri-700 text-white font-extrabold rounded-xl shadow-lg shadow-agri-600/20 text-base flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Calculating Nutrient Requirements...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>Calculate Stage-Wise Fertilizer Plan</span>
            </>
          )}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-8 animate-fadeIn">
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <span className="text-xs font-bold text-agri-700 uppercase tracking-wider block">
                Crop Nutrition Dossier
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Fertilizer Guidance for {result.crop_name} ({result.growth_stage})
              </h2>
            </div>
            <AudioPlayer text={result.summary} langCode={language} />
          </div>

          <div className="bg-agri-50/70 p-5 rounded-xl border border-agri-200 text-agri-950 text-sm leading-relaxed">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-agri-900">Stage Summary</h4>
            <p>{result.summary}</p>
          </div>

          {/* Fertilizer Categories */}
          {result.fertilizer_categories && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Recommended Fertilizer Regimen
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.fertilizer_categories.map((cat: any, i: number) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <span className="font-bold text-agri-800 text-sm block">{cat.category}</span>
                    <p className="text-slate-700"><span className="font-semibold">Purpose:</span> {cat.purpose}</p>
                    <p className="text-slate-700"><span className="font-semibold">Timing:</span> {cat.timing}</p>
                    {cat.precautions && cat.precautions.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 text-slate-500">
                        <span className="font-bold block text-[10px] uppercase">Precautions:</span>
                        <ul className="list-disc list-inside">
                          {cat.precautions.map((p: string, idx: number) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organic Alternatives */}
          {result.organic_alternatives && result.organic_alternatives.length > 0 && (
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/60 text-xs text-emerald-950">
              <span className="font-bold text-sm block mb-1">Organic & Bio-Fertilizer Alternatives:</span>
              <ul className="list-disc list-inside space-y-0.5 text-emerald-900">
                {result.organic_alternatives.map((org: string, i: number) => (
                  <li key={i}>{org}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block mb-0.5">Agricultural Advisory Safety Warning</span>
              {result.safety_warning || t.disclaimerNotice}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

