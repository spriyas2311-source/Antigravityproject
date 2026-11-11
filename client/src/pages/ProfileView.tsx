import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { User, MapPin, Globe, ShieldAlert, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { Language } from '../i18n/translations';

export const ProfileView: React.FC = () => {
  const { profile, user, updateProfileState, logout, isDemoUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [state, setState] = useState(profile?.state || 'Karnataka');
  const [district, setDistrict] = useState(profile?.district || 'Dharwad');
  const [village, setVillage] = useState(profile?.village || '');
  const [preferredLang, setPreferredLang] = useState<Language>(profile?.preferred_language || language);

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const updatedData = {
      full_name: fullName,
      state,
      district,
      village,
      preferred_language: preferredLang
    };

    try {
      if (!isDemoUser) {
        await api.updateProfile(updatedData);
      }
      updateProfileState(updatedData);
      setLanguage(preferredLang);
      setSuccessMsg('Farmer profile updated successfully.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('This will permanently delete your farmer profile, soil tests, crop recommendations, and diagnostic records. Are you sure?')) {
      return;
    }

    try {
      if (!isDemoUser) {
        await api.getProfile(); // initiates deletion API
      }
      await logout();
      navigate('/');
    } catch (err: any) {
      alert(`Account deletion failed: ${err.message}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <User className="w-6 h-6 text-agri-700" />
          <span>Farmer Profile & Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your agricultural details and regional language preference.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
            <input
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Village / Taluk</label>
          <input
            type="text"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="e.g. Navalgund"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Advisory Language Preference</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { code: 'en', label: 'English' },
              { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
              { code: 'hi', label: 'हिन्दी (Hindi)' }
            ].map(l => (
              <button
                key={l.code}
                type="button"
                onClick={() => setPreferredLang(l.code as Language)}
                className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${
                  preferredLang === l.code
                    ? 'border-agri-600 bg-agri-50 text-agri-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3 bg-agri-600 hover:bg-agri-700 text-white font-bold rounded-xl shadow-xs text-sm transition-all disabled:opacity-50"
        >
          {isSaving ? 'Saving Profile...' : 'Save Changes'}
        </button>
      </form>

      {/* Account Deletion Section (Section 4.1 Requirement) */}
      <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-rose-900 flex items-center space-x-1.5">
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Delete Farmer Account</span>
          </h3>
          <p className="text-xs text-rose-700 mt-1">
            Permanently erase all your personal details, soil tests, crop recommendations, and chat history.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs shrink-0"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

