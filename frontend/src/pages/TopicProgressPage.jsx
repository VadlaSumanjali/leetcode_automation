import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import apiClient from '../api/client';

export default function TopicProgressPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/dashboard/topics');
      const topicList = res?.data?.data ?? res?.data;
      if (Array.isArray(topicList)) {
        setTopics(topicList);
      }
    } catch (err) {
      console.error('Failed to load topic progress:', err);
      setError(err.response?.data?.message || 'Failed to retrieve topic metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Categorize topics
  const getStrength = (item) => {
    if (item.total === 0) return 'Untracked';
    if (item.percent >= 75) return 'Strong';
    if (item.percent >= 50) return 'Moderate';
    if (item.percent >= 25) return 'Needs Work';
    return 'Weak';
  };

  const strongCount = topics.filter((t) => getStrength(t) === 'Strong').length;
  const needsWorkCount = topics.filter((t) => getStrength(t) === 'Needs Work').length;
  const weakCount = topics.filter((t) => getStrength(t) === 'Weak').length;

  // Find weakest topics among assigned
  const assignedTopics = topics.filter((t) => t.total > 0);
  const weakestTopics = [...assignedTopics]
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 2);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchTopics}
              className="text-xs font-semibold text-rose-800 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Skill Matrix</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Topic-Wise Mastery</h1>
            <p className="text-xs text-slate-500">
              Real-time performance tracking across all practice categories in your curriculum.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              {strongCount} Strong
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-medium">
              {needsWorkCount} Needs Work
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-medium">
              {weakCount} Weak
            </span>
          </div>
        </div>

        {/* AI Weak Topic Recommendation Insight */}
        <Card className="bg-white border-indigo-100 shadow-card">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Google Gemini AI Adaptive Recommendation
              </h3>
              {weakestTopics.length > 0 ? (
                <p className="text-xs text-slate-600 leading-relaxed">
                  Based on your historical performance, your current priority areas are{' '}
                  <strong>{weakestTopics[0]?.topic}</strong> ({weakestTopics[0]?.percent}%)
                  {weakestTopics[1] ? (
                    <> and <strong>{weakestTopics[1]?.topic}</strong> ({weakestTopics[1]?.percent}%)</>
                  ) : null}
                  . The scheduling engine will bias upcoming practice sessions toward foundational problems in these categories to solidify your fundamentals.
                </p>
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed">
                  You are at the beginning of your learning journey! As you solve daily problems across your selected topics, Google Gemini will evaluate your completion patterns and automatically bias future assignments toward your growth areas.
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Topics Grid */}
        {loading ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500">Loading topic progress...</p>
          </div>
        ) : topics.length === 0 ? (
          <Card className="bg-white p-12 text-center space-y-3">
            <h3 className="text-base font-bold text-slate-800">No Topics Configured</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Complete your onboarding preferences to configure your targeted DSA topics.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((item) => {
              const strength = getStrength(item);
              return (
                <Card key={item.topic} className="bg-white p-4 space-y-2 hoverable">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">{item.topic}</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        strength === 'Strong'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : strength === 'Moderate'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : strength === 'Needs Work'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : strength === 'Weak'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {strength}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs text-slate-500">
                    <span>{item.solved} solved of {item.total} assigned</span>
                    <span className="font-semibold text-slate-700">{item.percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        strength === 'Strong'
                          ? 'bg-emerald-500'
                          : strength === 'Moderate'
                          ? 'bg-indigo-600'
                          : strength === 'Needs Work'
                          ? 'bg-amber-500'
                          : strength === 'Weak'
                          ? 'bg-rose-500'
                          : 'bg-slate-300'
                      }`}
                      style={{ width: `${item.total > 0 ? item.percent : 0}%` }}
                    ></div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
