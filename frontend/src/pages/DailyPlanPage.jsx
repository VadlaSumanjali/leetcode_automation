import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  AlertCircle,
  RotateCcw,
  RefreshCw,
  BookOpen,
  Mail,
  Loader2,
  Check
} from 'lucide-react';
import Card from '../components/Card';
import { DifficultyBadge, StatusBadge } from '../components/Badge';
import apiClient from '../api/client';

export default function DailyPlanPage() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailNotice, setEmailNotice] = useState(null);

  const fetchPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/plans/today');
      // Normalize plan object from API response
      const planData = res?.data?.data ?? res?.data ?? res;
      if (planData && (planData.problems !== undefined || planData.planDate !== undefined || planData.id !== undefined)) {
        setPlan(planData);
      } else {
        setPlan(null);
      }
    } catch (err) {
      console.error('Failed to load today plan:', err);
      setError(err.response?.data?.message || err.message || 'Unable to retrieve today\'s learning plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    setEmailNotice(null);
    try {
      const res = await apiClient.post('/plans/send-email');
      const payload = res?.data ?? res;
      const isSuccess = res?.success === true || payload?.sent === true;
      const msg = res?.message || payload?.message;
      if (isSuccess) {
        setEmailNotice({
          type: 'success',
          message: msg || 'Daily problem email dispatched successfully!'
        });
      } else {
        setEmailNotice({
          type: 'error',
          message: msg || 'Email dispatch failed'
        });
      }
    } catch (err) {
      console.error('Email dispatch error:', err);
      setEmailNotice({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to dispatch email. Check SMTP settings.'
      });
    } finally {
      setSendingEmail(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleUpdateStatus = async (problemId, newStatus) => {
    setUpdatingId(problemId);
    try {
      const res = await apiClient.patch(`/plans/problems/${problemId}/status`, {
        status: newStatus.toUpperCase()
      });

      const updatedProblem = res?.data?.data ?? res?.data;
      if (updatedProblem && updatedProblem.status) {
        setPlan((prev) => {
          if (!prev) return prev;
          const updatedProblems = (prev.problems || []).map((p) =>
            p.problemId === problemId ? { ...p, status: updatedProblem.status } : p
          );
          const solvedCount = updatedProblems.filter(
            (p) => (p.status || '').toUpperCase() === 'SOLVED'
          ).length;
          const completionPercentage = updatedProblems.length > 0 
            ? Math.round((solvedCount / updatedProblems.length) * 100) 
            : 0;

          return {
            ...prev,
            problems: updatedProblems,
            completionPercentage
          };
        });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert(err.response?.data?.message || 'Failed to update problem status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-slate-500">Loading today's personalized plan...</p>
        </div>
      </div>
    );
  }

  const problems = plan?.problems || [];
  const solvedCount = problems.filter((p) => (p.status || '').toUpperCase() === 'SOLVED').length;
  const progressPercent = plan?.completionPercentage ?? (problems.length > 0 ? Math.round((solvedCount / problems.length) * 100) : 0);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchPlan}
              className="text-xs font-semibold text-rose-800 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-subtle">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
              <Calendar className="w-4 h-4" />
              <span>
                Today's Assignment — Day {plan?.dayNumber || 1} ({plan?.planDate || new Date().toISOString().split('T')[0]})
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Daily Problem Schedule</h1>
            <p className="text-xs text-slate-500">
              Solve on LeetCode, then mark your progress. Unsolved problems will automatically carry forward.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSendEmail}
              disabled={sendingEmail}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-sm transition-colors disabled:opacity-50"
              title="Dispatch daily practice problems to your email address"
            >
              {sendingEmail ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
              )}
              {sendingEmail ? 'Dispatching...' : 'Email My Problems'}
            </button>
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200">
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-700">
                  {solvedCount} of {problems.length} Solved
                </span>
                <div className="w-28 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-bold text-indigo-600">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Email Notification Alert */}
        {emailNotice && (
          <div
            className={`p-3 text-xs rounded-xl border flex items-center justify-between ${
              emailNotice.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {emailNotice.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500" />
              )}
              <span>{emailNotice.message}</span>
            </div>
            <button
              onClick={() => setEmailNotice(null)}
              className="text-xs font-semibold underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Problems List */}
        {problems.length === 0 ? (
          <Card className="bg-white p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Problems Scheduled</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No practice problems are assigned for today. If you haven't completed onboarding, set up your preferences.
            </p>
            <Link
              to="/settings"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              Configure Preferences
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {problems.map((problem, index) => {
              const currentStatus = (problem.status || 'PENDING').toUpperCase();
              const isUpdating = updatingId === problem.problemId;

              return (
                <Card key={problem.id || problem.problemId} className="bg-white hover:border-slate-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-slate-400">#{problem.leetcodeId}</span>
                          <a
                            href={problem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-semibold text-slate-900 hover:text-indigo-600 flex items-center gap-1 group"
                          >
                            {problem.title}
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                          </a>
                          <DifficultyBadge difficulty={problem.difficulty} />
                          <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                            {problem.topic}
                          </span>
                          {problem.carriedForward && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                              <RotateCcw className="w-3 h-3 text-amber-600" />
                              Carried forward
                            </span>
                          )}
                        </div>

                        {problem.summary && (
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {problem.summary}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-2">
                          <Link
                            to={`/problems/${problem.problemId}`}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            View AI Hints & Analysis
                          </Link>
                          <a
                            href={problem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
                          >
                            Solve on LeetCode <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Status Switcher Buttons */}
                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200 self-end sm:self-center shrink-0">
                      {[
                        { label: 'Pending', value: 'PENDING', color: 'bg-amber-500' },
                        { label: 'Attempted', value: 'ATTEMPTED', color: 'bg-blue-600' },
                        { label: 'Solved', value: 'SOLVED', color: 'bg-emerald-600' },
                        { label: 'Skipped', value: 'SKIPPED', color: 'bg-slate-600' },
                      ].map((st) => (
                        <button
                          key={st.value}
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(problem.problemId, st.value)}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                            currentStatus === st.value
                              ? `${st.color} text-white shadow-sm`
                              : 'text-slate-600 hover:bg-slate-200'
                          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Informational Footer banner on Carry Forward logic */}
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
          <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-900 space-y-1">
            <p className="font-semibold">How Pending Carry-Forward Works</p>
            <p className="text-indigo-700 leading-relaxed">
              At midnight or next morning delivery, any problem still marked as <strong>Pending</strong> is automatically carried forward and counts toward your daily quota. New problems only fill the remaining slots. Problems marked <strong>Solved</strong> or <strong>Skipped</strong> will never be reassigned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
