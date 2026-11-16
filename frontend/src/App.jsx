import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, OnboardingRoute, PublicOnlyRoute } from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import DailyPlanPage from './pages/DailyPlanPage';
import ProblemDetailsPage from './pages/ProblemDetailsPage';
import ProblemHistoryPage from './pages/ProblemHistoryPage';
import TopicProgressPage from './pages/TopicProgressPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-white text-slate-800">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public visitor routes */}
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/register"
                element={
                  <PublicOnlyRoute>
                    <RegisterPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />

              {/* Mandatory onboarding wizard */}
              <Route
                path="/onboarding"
                element={
                  <OnboardingRoute>
                    <OnboardingPage />
                  </OnboardingRoute>
                }
              />

              {/* Protected user-specific routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/daily-plan"
                element={
                  <ProtectedRoute>
                    <DailyPlanPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/plan"
                element={
                  <ProtectedRoute>
                    <DailyPlanPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/problems/:id"
                element={
                  <ProtectedRoute>
                    <ProblemDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <ProblemHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/topic-progress"
                element={
                  <ProtectedRoute>
                    <TopicProgressPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/topics"
                element={
                  <ProtectedRoute>
                    <TopicProgressPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback to landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
