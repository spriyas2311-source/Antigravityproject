import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Wheat,
  FlaskConical,
  Sprout,
  Droplets,
  Bug,
  MessageSquare,
  History,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const DashboardView: React.FC = () => {
  const { profile } = useAuth();
  const { t } = useLanguage();

  const [stats, setStats] = useState({
    cropsCount: 0,
    soilCount: 0,
    fertCount: 0,
    irrCount: 0,
    diseaseCount: 0
  });
  const [recentCrops, setRecentCrops] = useState<any[]>([]);
  const [recentDiseases, setRecentDiseases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [cropsRes, soilRes, fertRes, irrRes, diseaseRes] = await Promise.allSettled([
          api.getCropRecommendations(),
          api.getSoilAnalyses(),
          api.getFertilizerAdvisories(),
          api.getIrrigationAdvisories(),
          api.getDiseaseAnalyses()
        ]);

        const crops = cropsRes.status === 'fulfilled' && cropsRes.value?.data ? cropsRes.value.data : [];
        const soils = soilRes.status === 'fulfilled' && soilRes.value?.data ? soilRes.value.data : [];
        const ferts = fertRes.status === 'fulfilled' && fertRes.value?.data ? fertRes.value.data : [];
        const irrs = irrRes.status === 'fulfilled' && irrRes.value?.data ? irrRes.value.data : [];
        const diseases = diseaseRes.status === 'fulfilled' && diseaseRes.value?.data ? diseaseRes.value.data : [];

        setStats({
          cropsCount: crops.length,
          soilCount: soils.length,
          fertCount: ferts.length,
          irrCount: irrs.length,
          diseaseCount: diseases.length
        });

        setRecentCrops(crops.slice(0, 3));
        setRecentDiseases(diseases.slice(0, 3));
      } catch (err) {
        console.error('[DASHBOARD DATA LOAD ERROR]:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalAdvisories = stats.cropsCount + stats.soilCount + stats.fertCount + stats.irrCount + stats.diseaseCount;

  const quickActions = [
    {
      title: t.nav.cropRecommendation,
      desc: 'Find the best seasonal crop match for your soil and climate',
      icon: Wheat,
      path: '/crop-recommendation',
      color: 'bg-emerald-500 text-white',
      badge: 'Planning'
    },
    {
      title: t.nav.soilAnalysis,
      desc: 'Analyze laboratory NPK, pH & organic carbon with radar charts',
      icon: FlaskConical,
      path: '/soil-analysis',
      color: 'bg-amber-600 text-white',
      badge: 'Soil Health'
    },
    {
      title: t.nav.fertilizerAdvisory,
      desc: 'Calculate stage-wise nutrient requirements and basal application',
      icon: Sprout,
      path: '/fertilizer-advisory',
      color: 'bg-green-600 text-white',
      badge: 'Fertility'
    },
    {
      title: t.nav.irrigationAdvisory,
      desc: 'Schedule irrigation based on crop stage and rainfall trends',
      icon: Droplets,
      path: '/irrigation-advisory',
      color: 'bg-cyan-600 text-white',
      badge: 'Water'
    },
    {
      title: t.nav.diseaseDetection,
      desc: 'Upload leaf or stem photograph for instant pathogen scan',
      icon: Bug,
      path: '/disease-detection',
      color: 'bg-rose-500 text-white',
      badge: 'Plant Doctor'
    },
    {
      title: t.nav.chatAssistant,
      desc: 'Ask direct farming questions in English, Kannada, or Hindi',
      icon: MessageSquare,
      path: '/chat-assistant',
      color: 'bg-indigo-600 text-white',
      badge: 'Assistant'
    }
  ];

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Retrieving farm records & advisory history..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-agri-800 via-agri-700 to-agri-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kisan Command Center</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.dashboard.welcome} {profile?.full_name ? `${profile.full_name}` : ''}
          </h1>

          <p className="mt-2 text-sm text-agri-100 leading-relaxed">
            {t.dashboard.quickSummary}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-agri-200">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>{profile?.district || 'Karnataka'}, {profile?.state || 'India'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>Current Season: Rabi / Zaid Transition</span>
            </span>
          </div>
        </div>

        <Sprout className="w-64 h-64 text-white/5 absolute -right-10 -bottom-10 pointer-events-none" />
      </div>

      {/* Advisory Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">{t.dashboard.totalCrops}</span>
            <Wheat className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.cropsCount}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Completed Evaluations</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">{t.dashboard.totalSoilReports}</span>
            <FlaskConical className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.soilCount}</p>
          <span className="text-[11px] text-amber-700 font-medium">Nutrient & pH Scans</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">{t.dashboard.totalDiagnoses}</span>
            <Bug className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.diseaseCount}</p>
          <span className="text-[11px] text-rose-700 font-medium">Pathology Analyses</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">{t.dashboard.savedReports}</span>
            <History className="w-4 h-4 text-agri-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalAdvisories}</p>
          <span className="text-[11px] text-agri-700 font-medium">Total Historical Records</span>
        </div>
      </div>

      {/* Advisory Launchers Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span>{t.dashboard.startNew}</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Select a service to start</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                to={action.path}
                className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-agri-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${action.color} shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {action.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-agri-700 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-agri-700 group-hover:translate-x-1 transition-transform">
                  <span>Launch Advisor</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Seasonal Alert Banner */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-5 flex items-start space-x-4">
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h3 className="font-bold text-amber-900 text-sm mb-1">{t.dashboard.alertsTitle}</h3>
          <p className="text-amber-800 leading-relaxed mb-2">{t.dashboard.alertsBody}</p>
          <div className="flex items-center space-x-2 text-[11px] font-medium text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Always consult your local Krishi Vigyan Kendra (KVK) for critical chemical application decisions.</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Crops */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Wheat className="w-4 h-4 text-emerald-600" />
              <span>Recent Crop Recommendations</span>
            </h3>
            <Link to="/history" className="text-xs font-semibold text-agri-700 hover:underline">
              View All
            </Link>
          </div>

          {recentCrops.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentCrops.map((rec) => (
                <div key={rec.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {rec.location?.district || 'Farm'}, {rec.farming_data?.season?.toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-500">
                      {rec.ai_result?.recommendations?.map((r: any) => r.crop_name).join(', ') || '3 recommended crops'}
                    </p>
                  </div>
                  <Link
                    to={`/crop-recommendation/result/${rec.id}`}
                    className="text-xs font-bold text-agri-700 hover:text-agri-800"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No crop recommendations generated yet.
              <div className="mt-2">
                <Link to="/crop-recommendation" className="text-agri-700 font-bold hover:underline">
                  Generate your first crop plan
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Recent Disease Diagnoses */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Bug className="w-4 h-4 text-rose-600" />
              <span>Recent Plant Pathology Scans</span>
            </h3>
            <Link to="/history" className="text-xs font-semibold text-agri-700 hover:underline">
              View All
            </Link>
          </div>

          {recentDiseases.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentDiseases.map((diag) => (
                <div key={diag.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {diag.crop_name}
                    </p>
                    <p className="text-xs text-rose-700 font-medium">
                      {diag.ai_result?.possible_conditions?.[0]?.condition_name || 'Diagnosis available'}
                    </p>
                  </div>
                  <Link
                    to={`/disease-detection/result/${diag.id}`}
                    className="text-xs font-bold text-agri-700 hover:text-agri-800"
                  >
                    View Report
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No disease scans recorded yet.
              <div className="mt-2">
                <Link to="/disease-detection" className="text-agri-700 font-bold hover:underline">
                  Scan plant symptoms with camera
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

