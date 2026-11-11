import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  Wheat,
  FlaskConical,
  Droplets,
  Bug,
  MessageSquare,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const { user, loginAsDemo } = useAuth();

  const features = [
    {
      icon: Wheat,
      title: t.nav.cropRecommendation,
      desc: "Matches your soil type, pH, NPK, and seasonal weather window against top yielding ICAR/SAU verified crop varieties."
    },
    {
      icon: FlaskConical,
      title: t.nav.soilAnalysis,
      desc: "Translates raw soil health cards into interactive radar charts with organic carbon restoration and amendment dosing."
    },
    {
      icon: Sprout,
      title: t.nav.fertilizerAdvisory,
      desc: "Contextual stage-wise nutrient management (Basal, Tillering, Flowering) avoiding toxic over-application."
    },
    {
      icon: Droplets,
      title: t.nav.irrigationAdvisory,
      desc: "Precision water scheduling tuned to crop phenology, soil water-holding capacity, and drainage precautions."
    },
    {
      icon: Bug,
      title: t.nav.diseaseDetection,
      desc: "Instant multimodal camera scanning for plant pathology with integrated pest management (Cultural -> Bio -> Regulated Chemical)."
    },
    {
      icon: MessageSquare,
      title: t.nav.chatAssistant,
      desc: "Trilingual conversational agricultural assistant answering farming questions in English, Kannada, and Hindi."
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-agri-50/70 via-white to-slate-50 pt-16 pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-agri-100 text-agri-800 px-3.5 py-1.5 rounded-full text-xs font-bold mb-6 border border-agri-200 shadow-xs">
            <Sprout className="w-4 h-4 text-agri-700" />
            <span>AI Agricultural Decision Support Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Scientific Agronomy Intelligence for Every <span className="text-agri-700">Indian Farmer</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            {t.tagline}. Eliminate agricultural guesswork with personalized crop suitability, soil health digitization, pest diagnosis, and vernacular audio guidance.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-agri-600 hover:bg-agri-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-agri-600/25 transition-all text-base"
              >
                <span>Go to Farmer Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-agri-600 hover:bg-agri-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-agri-600/25 transition-all text-base"
                >
                  <span>Start Free Consultation</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <button
                  type="button"
                  onClick={loginAsDemo}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3.5 rounded-xl border border-slate-300 shadow-xs transition-all text-base"
                >
                  <span>Try Instant Demo Account</span>
                </button>
              </>
            )}
          </div>

          {/* Value Props Bar */}
          <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-agri-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">ICAR Package of Practices Compliant</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-agri-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">English, Kannada & Hindi Native</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-agri-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">Strict Regulated Chemical Safety</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-agri-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">Zero Unverified Prescriptions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest font-bold text-agri-700 mb-2">
            End-To-End Decision Support
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Six Comprehensive Agricultural Intelligence Modules
          </h3>
          <p className="text-sm text-slate-600 mt-3">
            Every module complies with agricultural scientific rigor, providing practical explanations rather than black-box guesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-slate-200 hover:border-agri-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-agri-50 border border-agri-200 flex items-center justify-center text-agri-700 mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h3 className="text-3xl font-bold tracking-tight">How Krishi Mitra Works</h3>
            <p className="text-slate-400 text-sm mt-3">Simple enough for first-time smartphone users, powerful enough for certified agronomists.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700">
              <div className="w-8 h-8 rounded-lg bg-agri-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-white mb-2">Enter Farm Information</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide your location, soil type, NPK test figures, irrigation source, or photograph of plant disease symptoms.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700">
              <div className="w-8 h-8 rounded-lg bg-agri-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-white mb-2">Gemini AI Synthesis</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The official Google GenAI model analyzes your inputs against validated Indian agro-climatic datasets and IPM protocols.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700">
              <div className="w-8 h-8 rounded-lg bg-agri-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-white mb-2">Read, Listen & Act</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review structured recommendations, listen to localized vernacular audio readouts, or export printable PDF dossiers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

