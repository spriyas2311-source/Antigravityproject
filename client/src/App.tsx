import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardView } from './pages/DashboardView';
import { ProfileView } from './pages/ProfileView';
import { CropAdvisorView } from './pages/CropAdvisorView';
import { CropResultView } from './pages/CropResultView';
import { SoilAnalysisView } from './pages/SoilAnalysisView';
import { FertilizerView } from './pages/FertilizerView';
import { IrrigationView } from './pages/IrrigationView';
import { DiseaseDiagnosisView } from './pages/DiseaseDiagnosisView';
import { ChatbotView } from './pages/ChatbotView';
import { AdvisoryHistoryView } from './pages/AdvisoryHistoryView';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfileView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <ProfileView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crop-recommendation"
                  element={
                    <ProtectedRoute>
                      <CropAdvisorView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crop-recommendation/result/:id"
                  element={
                    <ProtectedRoute>
                      <CropResultView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/soil-analysis"
                  element={
                    <ProtectedRoute>
                      <SoilAnalysisView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/fertilizer-advisory"
                  element={
                    <ProtectedRoute>
                      <FertilizerView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/irrigation-advisory"
                  element={
                    <ProtectedRoute>
                      <IrrigationView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/disease-detection"
                  element={
                    <ProtectedRoute>
                      <DiseaseDiagnosisView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/disease-detection/result/:id"
                  element={
                    <ProtectedRoute>
                      <DiseaseDiagnosisView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat-assistant"
                  element={
                    <ProtectedRoute>
                      <ChatbotView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <AdvisoryHistoryView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history/:id"
                  element={
                    <ProtectedRoute>
                      <CropResultView />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;

