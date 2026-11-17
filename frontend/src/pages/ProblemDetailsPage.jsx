import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Sparkles, 
  Lightbulb, 
  BookOpen, 
  Clock, 
  Code2, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import Card from '../components/Card';
import { DifficultyBadge, StatusBadge } from '../components/Badge';
import apiClient from '../api/client';

export default function ProblemDetailsPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status
  const [status, setStatus] = useState('PENDING');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Progressive hints
  const [hintLevel, setHintLevel] = useState(1);
  const [hints, setHints] = useState({});
  const [loadingHint, setLoadingHint] = useState(false);

  // Explanation
  const [explanation, setExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/problems/${id}`);
        const prob = res?.data?.data ?? res?.data;
        if (prob) {
          setProblem(prob);
          setStatus(prob.userStatus || 'PENDING');
          // Fetch initial level 1 hint automatically
          fetchHint(1);
        }
      } catch (err) {
        console.error('Failed to load problem:', err);
        setError(err.response?.data?.message || 'Problem not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id]);

  const fetchHint = async (level) => {
    if (hints[level]) {
      setHintLevel(level);
      return;
    }

    setLoadingHint(true);
    setHintLevel(level);
    try {
      const res = await apiClient.post(`/problems/${id}/ai-hint`, { level });
      const hintData = res?.data?.data ?? res?.data;
      if (hintData) {
        setHints((prev) => ({ ...prev, [level]: hintData }));
      }
    } catch (err) {
      console.error('Failed to fetch hint:', err);
    } finally {
      setLoadingHint(false);
    }
  };

  const fetchExplanation = async () => {
    if (explanation) return;
    setLoadingExplanation(true);
    try {
      const res = await apiClient.post(`/problems/${id}/ai-explanation`);
      const explData = res?.data?.data ?? res?.data;
      if (explData && explData.explanation) {
        setExplanation(explData.explanation);
      }
    } catch (err) {
      console.error('Failed to fetch explanation:', err);
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await apiClient.patch(`/problems/${id}/status`, { status: newStatus });
      setStatus(newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Loading problem details...</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">{error || 'Problem not found'}</h2>
          <Link
            to="/daily-plan"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Daily Plan
          </Link>
        </div>
      </div>
    );
  }

  const currentHint = hints[hintLevel];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          to="/daily-plan"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Daily Plan
        </Link>

        {/* Problem Header Card */}
        <Card className="bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-xs font-mono text-slate-400">#{problem.leetcodeId}</span>
                <h1 className="text-xl font-bold text-slate-900">{problem.title}</h1>
                <DifficultyBadge difficulty={problem.difficulty} />
                <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {problem.topic}
                </span>
              </div>
              <a
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1"
              >
                Solve on LeetCode <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Status Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
              {['PENDING', 'ATTEMPTED', 'SOLVED', 'SKIPPED'].map((st) => (
                <button
                  key={st}
                  disabled={updatingStatus}
                  onClick={() => handleUpdateStatus(st)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    status === st
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.charAt(0) + st.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Problem Overview</h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {problem.summary || 'Algorithmic practice challenge on LeetCode.'}
            </p>
          </div>
        </Card>

        {/* Google Gemini AI Progressive Hints Section */}
        <Card className="bg-white border-indigo-100 shadow-card">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Google Gemini AI Progressive Hints
              </h2>
            </div>
            <span className="text-[11px] text-slate-500">
              3 Progressive Stages (Without Spoiling the Answer)
            </span>
          </div>

          {/* Hint Level Pills */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { level: 1, label: '1. Intuition' },
              { level: 2, label: '2. Pattern & DS' },
              { level: 3, label: '3. Algorithm Steps' },
            ].map((tab) => (
              <button
                key={tab.level}
                type="button"
                onClick={() => fetchHint(tab.level)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                  hintLevel === tab.level
                    ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Hint Display Box */}
          <div className="mt-4 p-4 rounded-lg bg-indigo-50/40 border border-indigo-100 min-h-[90px] flex items-center">
            {loadingHint ? (
              <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium mx-auto">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Google Gemini AI is crafting your hint...</span>
              </div>
            ) : currentHint ? (
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900">
                    {currentHint.title}
                  </span>
                  <span className="text-[10px] text-indigo-500 font-mono uppercase">
                    via {currentHint.source}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentHint.content}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mx-auto">Click a hint stage above to generate guidance.</p>
            )}
          </div>
        </Card>

        {/* Full AI Analysis & Complexity Breakdown */}
        <Card className="bg-white">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Detailed Solution Analysis & Complexity
              </h2>
            </div>
            {!explanation && (
              <button
                onClick={fetchExplanation}
                disabled={loadingExplanation}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-50"
              >
                {loadingExplanation && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {loadingExplanation ? 'Analyzing...' : 'Generate Full Breakdown'}
              </button>
            )}
          </div>

          {explanation ? (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
              {explanation}
            </div>
          ) : (
            <p className="text-xs text-slate-500 mt-4">
              Stuck or want to verify optimal time/space complexity? Generate an AI-powered technical breakdown tailored to this problem.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
