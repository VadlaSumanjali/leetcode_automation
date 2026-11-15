import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Sparkles, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import Card from '../components/Card';
import { DifficultyBadge, StatusBadge } from '../components/Badge';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/dashboard');
      if (res?.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Loading your personalized DSA progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchDashboard} className="ml-auto underline font-semibold">Retry</button>
        </div>
      </div>
    );
  }

  const {
    totalAssigned = 0,
    totalSolved = 0,
    pendingCount = 0,
    currentStreak = 0,
    todayProgress = 0,
    todayPlan,
    topicProgress = [],
    difficultyStats = { easySolved: 0, mediumSolved: 0, hardSolved: 0, totalSolved: 0 },
  } = dashboardData || {};

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-subtle">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized DSA Learning Hub</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Welcome back, {user?.name || 'Developer'}!
            </h1>
            <p className="text-xs text-slate-500">
              {currentStreak > 0
                ? `You are on a ${currentStreak}-day problem solving streak. Keep up the momentum!`
                : 'Solve your assigned problems today to build your streak!'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Open Daily Plan
            </Link>
          </div>
        </div>

        {/* 4 Summary Cards (Real database metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card hoverable className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Assigned</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{totalAssigned}</span>
              <span className="text-[11px] text-slate-400">problems</span>
            </div>
          </Card>

          <Card hoverable className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Solved</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600">{totalSolved}</span>
              <span className="text-[11px] text-slate-400">
                {totalAssigned > 0 ? `${Math.round((totalSolved / totalAssigned) * 100)}% solved` : 'all time'}
              </span>
            </div>
          </Card>

          <Card hoverable className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Pending Today</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-600">{pendingCount}</span>
              <span className="text-[11px] text-slate-400">to complete</span>
            </div>
          </Card>

          <Card hoverable className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Current Streak</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-rose-600">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</span>
              <span className="text-[11px] text-slate-400">consecutive</span>
            </div>
          </Card>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 spans): Today's Active Plan */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {todayPlan ? `Today's Plan — Day ${todayPlan.dayNumber}` : "Today's Learning Plan"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {todayPlan
                      ? `${todayPlan.problems?.length || 0} problems assigned for ${todayPlan.planDate}`
                      : 'Your personalized plan'}
                  </p>
                </div>
                {todayPlan && (
                  <div className="text-right">
                    <span className="text-xs font-semibold text-indigo-600">{todayProgress}% Completed</span>
                    <div className="w-28 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${todayProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Problems list or Empty State */}
              {!todayPlan || !todayPlan.problems || todayPlan.problems.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800">Your learning journey starts here.</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Your personalized DSA plan is being prepared. Complete onboarding to receive your curated problem set.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 mt-2">
                  {todayPlan.problems.map((prob, idx) => (
                    <div key={prob.id} className="py-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-semibold shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-slate-900">{prob.title}</span>
                            <DifficultyBadge difficulty={prob.difficulty} />
                            {prob.carriedForward && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                                <RotateCcw className="w-3 h-3 text-amber-600" />
                                Carried forward
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">{prob.topic}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                          title="Open on LeetCode"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <StatusBadge status={prob.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link to="/plan" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                  Manage plan & update problem status <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] text-slate-400">Strict zero-duplicate guarantee active</span>
              </div>
            </Card>
          </div>

          {/* Right Column: Topic Breakdown & Difficulty Split (Real DB values) */}
          <div className="space-y-6">
            <Card className="bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Topic-Wise Progress</h3>
                <Link to="/topics" className="text-xs text-indigo-600 hover:underline font-medium">All Topics</Link>
              </div>

              {topicProgress.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No topics tracked yet. Solve problems to see topic statistics.
                </div>
              ) : (
                <div className="space-y-3 mt-3">
                  {topicProgress.slice(0, 6).map((item) => (
                    <div key={item.topic} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700">{item.topic}</span>
                        <span className="text-slate-500">{item.solved}/{item.total} ({item.percent}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${item.percent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="bg-white">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">Solved Difficulty Breakdown</h3>
              <div className="space-y-3 mt-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-emerald-700">Easy ({difficultyStats.easySolved} solved)</span>
                    <span className="text-slate-500">
                      {difficultyStats.totalSolved > 0
                        ? `${Math.round((difficultyStats.easySolved / difficultyStats.totalSolved) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{
                        width: difficultyStats.totalSolved > 0
                          ? `${(difficultyStats.easySolved / difficultyStats.totalSolved) * 100}%`
                          : '0%',
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-amber-700">Medium ({difficultyStats.mediumSolved} solved)</span>
                    <span className="text-slate-500">
                      {difficultyStats.totalSolved > 0
                        ? `${Math.round((difficultyStats.mediumSolved / difficultyStats.totalSolved) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{
                        width: difficultyStats.totalSolved > 0
                          ? `${(difficultyStats.mediumSolved / difficultyStats.totalSolved) * 100}%`
                          : '0%',
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-rose-700">Hard ({difficultyStats.hardSolved} solved)</span>
                    <span className="text-slate-500">
                      {difficultyStats.totalSolved > 0
                        ? `${Math.round((difficultyStats.hardSolved / difficultyStats.totalSolved) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500"
                      style={{
                        width: difficultyStats.totalSolved > 0
                          ? `${(difficultyStats.hardSolved / difficultyStats.totalSolved) * 100}%`
                          : '0%',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
