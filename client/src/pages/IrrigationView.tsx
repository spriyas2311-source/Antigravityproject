import React, { useState } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { AudioPlayer } from '../components/common/AudioPlayer';
import { Droplets, Sparkles, AlertCircle, ShieldAlert, CheckCircle2, CloudRain } from 'lucide-react';

export const IrrigationView: React.FC = () => {
  const { language, t } = useLanguage();

  const [cropName, setCropName] = useState('Paddy (Rice)');
  const [growthStage, setGrowthStage] = useState('FLOWERING_REPRODUCTIVE');
  const [soilType, setSoilType] = useState('CLAY_LOAM');
  const [irrigationMethod, setIrrigationMethod] = useState('Alternate Wetting & Drying (AWD)');
  const [waterAvailability, setWaterAvailability] = useState('Adequate canal & borewell reserves');
  const [recentRainfall, setRecentRainfall] = useState<number>(0);
  const [ambientTemp, setAmbientTemp] = useState<number>(31);

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
      irrigationMethod,
      waterAvailability,
      environmentalData: {
        recentRainfallMm: recentRainfall,
        ambientTemperatureCelsius: ambientTemp
      },
      preferredLanguage: language
    };

    try {
      const res = await api.createIrrigationAdvisory(payload);
      if (res.success && res.data?.ai_result) {
        setResult(res.data.ai_result);
      } else {
        setErrorMsg(res.message || 'Failed to generate irrigation advisory.');
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
        <div className="inline-flex items-center space-x-2 text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <Droplets className="w-4 h-4" />
          <span>Water Conservation & Scheduling</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Precision Irrigation Advisory
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Optimize water volume, cycle intervals, and drainage safety according to crop evapotranspiration needs.
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
              <option value="SEEDLING_GERMINATION">Seedling / Germination</option>
              <option value="VEGETATIVE_TILLERING">Vegetative / Tillering</option>
              <option value="FLOWERING_REPRODUCTIVE">Flowering / Booting (Sensitive)</option>
              <option value="FRUIT_SET_GRAIN_FILLING">Fruit Setting / Grain Filling</option>
              <option value="MATURITY_HARVEST">Maturity / Ripening</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Texture *</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
            >
              <option value="BLACK_COTTON_REGUR">Black Soil (High Water Retention)</option>
              <option value="RED_SANDY_LOAM">Sandy Loam (Fast Drainage)</option>
              <option value="CLAY_LOAM">Clay Loam (Moderate Drainage)</option>
              <option value="ALLUVIAL">Alluvial Silt</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Irrigation Method *</label>
            <select
              value={irrigationMethod}
              onChange={(e) => setIrrigationMethod(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
            >
              <option value="Drip Irrigation">Drip Irrigation</option>
              <option value="Sprinkler System">Sprinkler System</option>
              <option value="Furrow / Basin">Furrow / Ridge & Furrow</option>
              <option value="Flood / Border">Flood / Border Strip</option>
              <option value="Alternate Wetting & Drying (AWD)">AWD (for Paddy)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Water Reserves *</label>
            <select
              value={waterAvailability}
              onChange={(e) => setWaterAvailability(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
            >
              <option value="Adequate canal & borewell reserves">Abundant / Assured</option>
              <option value="Limited (Water rationing required)">Moderate / Deficit</option>
              <option value="Critical (Scarcity mode)">Severely Constrained</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Recent Rainfall (mm)</label>
            <input
              type="number"
              min="0"
              value={recentRainfall}
              onChange={(e) => setRecentRainfall(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Ambient Temperature (°C)</label>
            <input
              type="number"
              value={ambientTemp}
              onChange={(e) => setAmbientTemp(parseFloat(e.target.value) || 30)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-cyan-700 hover:bg-cyan-800 text-white font-extrabold rounded-xl shadow-lg shadow-cyan-700/20 text-base flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Simulating Evapotranspiration & Moisture Budget...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-cyan-200" />
              <span>Generate Irrigation Schedule</span>
            </>
          )}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-8 animate-fadeIn">
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider block">
                Irrigation Management Dossier
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Water Schedule for {result.crop_name} ({result.growth_stage})
              </h2>
            </div>
            <AudioPlayer text={result.summary} langCode={language} />
          </div>

          <div className="bg-cyan-50/70 p-5 rounded-xl border border-cyan-200 text-cyan-950 text-sm leading-relaxed">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-cyan-900">Summary</h4>
            <p>{result.summary}</p>
          </div>

          {/* Recommendations & Stress Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs space-y-3">
              <span className="font-bold text-slate-900 text-sm block">Core Irrigation Guidelines</span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {result.irrigation_recommendations?.map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs space-y-3">
              <span className="font-bold text-slate-900 text-sm block">Water Stress Indicators to Check</span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {result.water_management_observations?.map((obs: string, i: number) => (
                  <li key={i}>{obs}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Water Conservation */}
          {result.water_conservation_methods && (
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/60 text-xs">
              <span className="font-bold text-slate-900 block mb-1">Water Conservation Techniques:</span>
              <ul className="list-disc list-inside text-emerald-900 space-y-0.5">
                {result.water_conservation_methods.map((w: string, i: number) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block mb-0.5">Hydrological Sensor Advisory Notice</span>
              {result.disclaimer || t.disclaimerNotice}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

