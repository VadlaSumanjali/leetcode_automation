import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
    <Router>
      <div className="min-h-screen flex flex-col bg-white text-slate-800">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/plan" element={<DailyPlanPage />} />
            <Route path="/problems/:id" element={<ProblemDetailsPage />} />
            <Route path="/history" element={<ProblemHistoryPage />} />
            <Route path="/topics" element={<TopicProgressPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Fallback to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
