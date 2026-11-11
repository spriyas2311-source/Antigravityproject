import React, { useState } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { CameraDropzone } from '../components/diagnostics/CameraDropzone';
import { AudioPlayer } from '../components/common/AudioPlayer';
import {
  Bug,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  AlertTriangle,
  Stethoscope,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const DiseaseDiagnosisView: React.FC = () => {
  const { language, t } = useLanguage();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [cropName, setCropName] = useState('Chili (Capsicum annuum)');
  const [growthStage, setGrowthStage] = useState('FLOWERING_REPRODUCTIVE');
  const [affectedPart, setAffectedPart] = useState('LEAF');
  const [symptomDurationDays, setSymptomDurationDays] = useState<number>(4);
  const [symptoms, setSymptoms] = useState('Upward curling of young leaves, crinkling and stunted growth.');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      setErrorMsg('Please upload or take a clear photograph of the affected plant leaf or tissue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('cropName', cropName);
    formData.append('growthStage', growthStage);
    formData.append('affectedPart', affectedPart);
    formData.append('symptomDurationDays', String(symptomDurationDays));
    formData.append('symptoms', symptoms);
    formData.append('preferredLanguage', language);

    try {
      const res = await api.createDiseaseAnalysis(formData);
      if (res.success && res.data?.ai_result) {
        setResult(res.data.ai_result);
      } else {
        setErrorMsg(res.message || 'Failed to complete disease diagnosis.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading image or processing AI analysis.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 text-rose-700 bg-rose-50 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <Stethoscope className="w-4 h-4" />
          <span>Multimodal Plant Pathology Scanner</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Plant Doctor (Crop Disease & Pest Scanner)
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Take or upload a leaf photo to diagnose fungal, bacterial, viral, or insect pest damage.
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
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            1. Photograph of Affected Foliage / Plant Tissue *
          </label>
          <CameraDropzone
            onImageSelected={setSelectedImage}
            selectedFile={selectedImage}
          />
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            2. Symptom & Field Context
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Affected Plant Organ *</label>
              <select
                value={affectedPart}
                onChange={(e) => setAffectedPart(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
              >
                <option value="LEAF">Leaves / Foliage</option>
                <option value="STEM">Stem / Shoot</option>
                <option value="FRUIT_GRAIN">Fruit / Pod / Grain</option>
                <option value="ROOT">Root / Crown</option>
                <option value="WHOLE_PLANT">Whole Plant Wilting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Days Since First Onset *</label>
              <input
                type="number"
                min="1"
                max="180"
                required
                value={symptomDurationDays}
                onChange={(e) => setSymptomDurationDays(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Describe Visible Symptoms (Color, Spot Patterns, Pests seen)
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Yellowing between leaf veins, black concentric rings, tiny white insects on leaf underside"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !selectedImage}
          className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-lg shadow-rose-600/20 text-base flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Plant Pathology with Gemini Vision...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-rose-200" />
              <span>Scan & Diagnose Plant Disease</span>
            </>
          )}
        </button>
      </form>

      {/* Diagnosis Results Display */}
      {result && (
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-8 animate-fadeIn">
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
                Plant Pathology Diagnostic Dossier
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Diagnosis for {result.crop_name}
              </h2>
            </div>
            <AudioPlayer text={result.summary} langCode={language} />
          </div>

          <div className="bg-rose-50/70 p-5 rounded-xl border border-rose-200 text-rose-950 text-sm leading-relaxed">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-rose-900">Clinical Assessment</h4>
            <p>{result.summary}</p>
          </div>

          {/* Suspected Conditions */}
          {result.possible_conditions && result.possible_conditions.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Identified Conditions & Differential Diagnosis
              </h3>
              <div className="space-y-4">
                {result.possible_conditions.map((cond: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-slate-900">{cond.condition_name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                        cond.confidence === 'high'
                          ? 'bg-emerald-100 text-emerald-800'
                          : cond.confidence === 'moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        Confidence: {cond.confidence}
                      </span>
                    </div>

                    {cond.visual_evidence && (
                      <div className="text-xs text-slate-700">
                        <span className="font-semibold block mb-0.5">Observed Visual Evidence:</span>
                        <ul className="list-disc list-inside space-y-0.5">
                          {cond.visual_evidence.map((v: string, i: number) => (
                            <li key={i}>{v}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {cond.alternative_explanations && cond.alternative_explanations.length > 0 && (
                      <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                        <span className="font-semibold block mb-0.5">Alternative Differential Explanations:</span>
                        <ul className="list-disc list-inside">
                          {cond.alternative_explanations.map((alt: string, i: number) => (
                            <li key={i}>{alt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Next Steps & Prevention */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-900 text-sm block">Recommended Remediation Steps</span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {result.recommended_next_steps?.map((step: string, i: number) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-900 text-sm block">Integrated Pest Prevention (IPM)</span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {result.prevention_measures?.map((prev: string, i: number) => (
                  <li key={i}>{prev}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block mb-0.5">Safety & Chemical Compliance Warning</span>
              {result.safety_warning || t.disclaimerNotice}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

