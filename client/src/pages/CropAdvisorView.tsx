import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Wheat, MapPin, Sparkles, AlertCircle, ArrowRight, HelpCircle } from 'lucide-react';

export const CropAdvisorView: React.FC = () => {
  const { profile } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [state, setState] = useState(profile?.state || 'Karnataka');
  const [district, setDistrict] = useState(profile?.district || 'Dharwad');
  const [village, setVillage] = useState(profile?.village || '');
  const [soilType, setSoilType] = useState('BLACK_COTTON_REGUR');
  const [soilPH, setSoilPH] = useState<number>(7.2);
  const [nitrogen, setNitrogen] = useState<string>('240');
  const [phosphorus, setPhosphorus] = useState<string>('18');
  const [potassium, setPotassium] = useState<string>('260');
  const [nutrientUnit, setNutrientUnit] = useState('kg/ha');
  const [landArea, setLandArea] = useState<number>(3);
  const [landUnit, setLandUnit] = useState<'acre' | 'hectare'>('acre');
  const [irrigationAvailability, setIrrigationAvailability] = useState<'rainfed' | 'limited' | 'available'>('available');
  const [season, setSeason] = useState<'kharif' | 'rabi' | 'zaid' | 'other'>('rabi');
  const [previousCrop, setPreviousCrop] = useState('Tomato');
  const [farmingObjective, setFarmingObjective] = useState('Yield and profit maximization with low pest risk');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      state,
      district,
      village: village || undefined,
      soilType,
      soilPH: Number(soilPH),
      nitrogen: nitrogen ? Number(nitrogen) : undefined,
      phosphorus: phosphorus ? Number(phosphorus) : undefined,
      potassium: potassium ? Number(potassium) : undefined,
      nutrientUnit,
      landArea: Number(landArea),
      landUnit,
      irrigationAvailability,
      season,
      previousCrop: previousCrop || undefined,
      farmingObjective: farmingObjective || undefined,
      preferredLanguage: language
    };

    try {
      const res = await api.createCropRecommendation(payload);
      if (res.success && res.data?.id) {
        navigate(`/crop-recommendation/result/${res.data.id}`);
      } else if (res.success && res.data?.ai_result) {
        // In case created offline/fallback
        sessionStorage.setItem('krishi_latest_crop_result', JSON.stringify(res.data));
        navigate('/crop-recommendation/result/latest');
      } else {
        setErrorMsg(res.message || 'Failed to generate crop recommendation.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network or server error during AI analysis.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 text-agri-700 bg-agri-50 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <Wheat className="w-4 h-4" />
          <span>Scientific Agro-Climatic Matcher</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Crop Suitability Recommendation
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Enter your soil measurements and seasonal parameters to discover the top recommended crops.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs mb-6 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        {/* Geographic Location */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-agri-600" />
            <span>1. Farm Location</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Village / Taluk</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Optional"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Soil Chemistry */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            2. Soil Characteristics & Fertility
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Classification *</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
              >
                <option value="BLACK_COTTON_REGUR">Black Cotton Soil (Regur)</option>
                <option value="ALLUVIAL">Alluvial Soil (Gangetic/Deltaic)</option>
                <option value="RED_SANDY_LOAM">Red Sandy Loam</option>
                <option value="LATERITIC">Laterite Soil</option>
                <option value="COASTAL_SALINE">Coastal Saline Soil</option>
                <option value="DESERT_ARID">Desert / Arid Sandy Soil</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Soil Reaction (pH: 0 to 14) *
              </label>
              <input
                type="number"
                step="0.1"
                min="3.0"
                max="11.0"
                required
                value={soilPH}
                onChange={(e) => setSoilPH(parseFloat(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">Neutral range: 6.5 – 7.5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nitrogen (N)</label>
              <input
                type="number"
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value)}
                placeholder="e.g. 280"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phosphorus (P)</label>
              <input
                type="number"
                value={phosphorus}
                onChange={(e) => setPhosphorus(e.target.value)}
                placeholder="e.g. 15"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Potassium (K)</label>
              <input
                type="number"
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
                placeholder="e.g. 240"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Unit</label>
              <select
                value={nutrientUnit}
                onChange={(e) => setNutrientUnit(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
              >
                <option value="kg/ha">kg/ha</option>
                <option value="kg/acre">kg/acre</option>
                <option value="ppm">ppm (mg/kg)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Season & Land Parameters */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            3. Season, Water & Cropping History
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Season *</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
              >
                <option value="kharif">Kharif (Monsoon / June-Oct)</option>
                <option value="rabi">Rabi (Winter / Oct-March)</option>
                <option value="zaid">Zaid (Summer / March-June)</option>
                <option value="other">Perennial / Irrigated</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Irrigation Access *</label>
              <select
                value={irrigationAvailability}
                onChange={(e) => setIrrigationAvailability(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
              >
                <option value="available">Assured (Drip / Borewell / Canal)</option>
                <option value="limited">Limited (Protective Irrigation)</option>
                <option value="rainfed">Purely Rainfed (Monsoon Dependent)</option>
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
                  onChange={(e) => setLandUnit(e.target.value as any)}
                  className="w-1/3 px-2 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none"
                >
                  <option value="acre">Acre</option>
                  <option value="hectare">Hectare</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Previous Harvested Crop
              </label>
              <input
                type="text"
                value={previousCrop}
                onChange={(e) => setPreviousCrop(e.target.value)}
                placeholder="e.g. Cotton / Tomato / Rice"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Farming Objective
              </label>
              <input
                type="text"
                value={farmingObjective}
                onChange={(e) => setFarmingObjective(e.target.value)}
                placeholder="e.g. High cash return, soil recovery, drought tolerance"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
              />
            </div>
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
              <span>Evaluating with Gemini Agronomy Model...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{t.actions.submit}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

