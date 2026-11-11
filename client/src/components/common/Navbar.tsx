import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import {
  Sprout,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Wheat,
  FlaskConical,
  Droplets,
  Bug,
  MessageSquare,
  History
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: t.nav.dashboard, path: '/dashboard', icon: LayoutDashboard },
    { name: t.nav.cropRecommendation, path: '/crop-recommendation', icon: Wheat },
    { name: t.nav.soilAnalysis, path: '/soil-analysis', icon: FlaskConical },
    { name: t.nav.fertilizerAdvisory, path: '/fertilizer-advisory', icon: Sprout },
    { name: t.nav.irrigationAdvisory, path: '/irrigation-advisory', icon: Droplets },
    { name: t.nav.diseaseDetection, path: '/disease-detection', icon: Bug },
    { name: t.nav.chatAssistant, path: '/chat-assistant', icon: MessageSquare },
    { name: t.nav.history, path: '/history', icon: History }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-agri-600 flex items-center justify-center text-white shadow-md shadow-agri-200">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 tracking-tight block">
                  {t.appName}
                </span>
                <span className="text-[10px] uppercase font-semibold text-agri-700 tracking-wider block -mt-0.5">
                  Krishi AI
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSelector />

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-agri-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-agri-100 flex items-center justify-center text-agri-700 font-semibold text-xs border border-agri-300">
                    {profile?.full_name?.charAt(0).toUpperCase() || 'F'}
                  </div>
                  <span className="hidden xl:inline">{profile?.full_name || 'Farmer'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.nav.logout}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-agri-700 px-4 py-2 rounded-lg hover:bg-slate-50"
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-agri-600 hover:bg-agri-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden space-x-2">
            <LanguageSelector compact />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          {user ? (
            <>
              <div className="py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-agri-100 flex items-center justify-center text-agri-700 font-bold">
                    {profile?.full_name?.charAt(0).toUpperCase() || 'F'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{profile?.full_name || 'Farmer'}</p>
                    <p className="text-xs text-slate-500">{profile?.district || 'India'}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold text-agri-700 hover:underline"
                >
                  {t.nav.profile}
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 p-2.5 rounded-lg text-xs font-medium ${
                        isActive(link.path)
                          ? 'bg-agri-50 text-agri-700 font-bold border border-agri-200'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-agri-600 shrink-0" />
                      <span className="truncate">{link.name}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-rose-50 text-rose-700 text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.nav.logout}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center py-2.5 rounded-lg text-sm font-semibold text-slate-700 border border-slate-300"
              >
                {t.nav.login}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center py-2.5 rounded-lg text-sm font-semibold text-white bg-agri-600"
              >
                {t.nav.register}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

