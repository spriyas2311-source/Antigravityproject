import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  History,
  Wheat,
  FlaskConical,
  Sprout,
  Droplets,
  Bug,
  Trash2,
  ExternalLink,
  Filter,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AdvisoryHistoryView: React.FC = () => {
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'all' | 'crop' | 'soil' | 'fertilizer' | 'irrigation' | 'disease'>('all');
  const [crops, setCrops] = useState<any[]>([]);
  const [soils, setSoils] = useState<any[]>([]);
  const [ferts, setFerts] = useState<any[]>([]);
  const [irrs, setIrrs] = useState<any[]>([]);
  const [diseases, setDiseases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllHistory();
  }, []);

  const loadAllHistory = async () => {
    setIsLoading(true);
    try {
      const [cropsRes, soilRes, fertRes, irrRes, diseaseRes] = await Promise.allSettled([
        api.getCropRecommendations(),
        api.getSoilAnalyses(),
        api.getFertilizerAdvisories(),
        api.getIrrigationAdvisories(),
        api.getDiseaseAnalyses()
      ]);

      if (cropsRes.status === 'fulfilled' && cropsRes.value?.data) setCrops(cropsRes.value.data);
      if (soilRes.status === 'fulfilled' && soilRes.value?.data) setSoils(soilRes.value.data);
      if (fertRes.status === 'fulfilled' && fertRes.value?.data) setFerts(fertRes.value.data);
      if (irrRes.status === 'fulfilled' && irrRes.value?.data) setIrrs(irrRes.value.data);
      if (diseaseRes.status === 'fulfilled' && diseaseRes.value?.data) setDiseases(diseaseRes.value.data);
    } catch (err) {
      console.error('History load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCrop = async (id: string) => {
    if (!confirm('Are you sure you want to delete this crop recommendation?')) return;
    await api.deleteCropRecommendation(id);
    setCrops(prev => prev.filter(c => c.id !== id));
  };

  interface HistoryItem {
    id: string;
    type: string;
    title: string;
    subtitle: string;
    date: string;
    link: string;
    onDelete?: () => void;
  }

  // Aggregate items into a unified list
  const combinedList: HistoryItem[] = [
    ...crops.map(c => ({
      id: c.id,
      type: 'crop',
      title: `Crop Recommendation (${c.farming_data?.season?.toUpperCase() || 'Seasonal'})`,
      subtitle: c.ai_result?.recommendations?.map((r: any) => r.crop_name).join(', ') || '3 recommended crops',
      date: c.created_at,
      link: `/crop-recommendation/result/${c.id}`,
      onDelete: () => handleDeleteCrop(c.id)
    })),
    ...soils.map(s => ({
      id: s.id,
      type: 'soil',
      title: `Soil Analysis: ${s.soil_type}`,
      subtitle: `pH: ${s.ph} • N: ${s.nitrogen || 'N/A'} • P: ${s.phosphorus || 'N/A'} • K: ${s.potassium || 'N/A'}`,
      date: s.created_at,
      link: `/soil-analysis`
    })),
    ...ferts.map(f => ({
      id: f.id,
      type: 'fertilizer',
      title: `Fertilizer Plan: ${f.crop_name}`,
      subtitle: `Stage: ${f.growth_stage} • Area: ${f.land_area} ${f.land_unit}`,
      date: f.created_at,
      link: `/fertilizer-advisory`
    })),
    ...irrs.map(i => ({
      id: i.id,
      type: 'irrigation',
      title: `Irrigation Schedule: ${i.crop_name}`,
      subtitle: `Method: ${i.irrigation_method} • Stage: ${i.growth_stage}`,
      date: i.created_at,
      link: `/irrigation-advisory`
    })),
    ...diseases.map(d => ({
      id: d.id,
      type: 'disease',
      title: `Plant Pathology: ${d.crop_name}`,
      subtitle: d.ai_result?.possible_conditions?.[0]?.condition_name || 'Diagnosis record',
      date: d.created_at,
      link: `/disease-detection`
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredList = activeTab === 'all'
    ? combinedList
    : combinedList.filter(item => item.type === activeTab);

  if (isLoading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Loading historical farm records..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <History className="w-6 h-6 text-agri-700" />
            <span>Advisory History & Records</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit trail of all your generated crop plans, soil tests, and plant disease diagnoses.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'crop', label: 'Crops' },
            { id: 'soil', label: 'Soil Tests' },
            { id: 'fertilizer', label: 'Fertilizer' },
            { id: 'irrigation', label: 'Irrigation' },
            { id: 'disease', label: 'Plant Doctor' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-agri-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredList.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-md mx-auto space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Advisory Reports Found</h3>
          <p className="text-xs text-slate-500">
            You haven't generated any reports in this category yet. Launch a new consultation from your dashboard!
          </p>
          <Link
            to="/dashboard"
            className="inline-block py-2.5 px-4 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredList.map((item, idx) => (
            <div key={idx} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-start space-x-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-2xs ${
                  item.type === 'crop' ? 'bg-emerald-600' :
                  item.type === 'soil' ? 'bg-amber-600' :
                  item.type === 'fertilizer' ? 'bg-green-600' :
                  item.type === 'irrigation' ? 'bg-cyan-600' : 'bg-rose-600'
                }`}>
                  {item.type === 'crop' && <Wheat className="w-5 h-5" />}
                  {item.type === 'soil' && <FlaskConical className="w-5 h-5" />}
                  {item.type === 'fertilizer' && <Sprout className="w-5 h-5" />}
                  {item.type === 'irrigation' && <Droplets className="w-5 h-5" />}
                  {item.type === 'disease' && <Bug className="w-5 h-5" />}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
                  <span className="inline-flex items-center space-x-1 text-[10px] text-slate-400 mt-1 font-medium">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <Link
                  to={item.link}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-agri-700 bg-agri-50 hover:bg-agri-100 px-3 py-1.5 rounded-lg border border-agri-200"
                >
                  <span>Open Report</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                {item.onDelete && (
                  <button
                    onClick={item.onDelete}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
