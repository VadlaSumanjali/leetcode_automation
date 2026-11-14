import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Clock, 
  TrendingUp, 
  ExternalLink, 
  Lightbulb, 
  Layers, 
  BookOpen, 
  Flame, 
  Database,
  Shuffle
} from 'lucide-react';
import Card from '../components/Card';
import { DifficultyBadge, StatusBadge } from '../components/Badge';

export default function LandingPage() {
  const [activeHintIndex, setActiveHintIndex] = useState(null);

  // Sample realistic daily plan for preview
  const previewProblems = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      topic: 'Arrays',
      url: 'https://leetcode.com/problems/two-sum/',
      status: 'Solved',
      hint: 'Consider using a hash map to look up the complement in O(1) time rather than nested loops.',
    },
    {
      id: 2,
      title: 'Valid Anagram',
      difficulty: 'Easy',
      topic: 'Strings',
      url: 'https://leetcode.com/problems/valid-anagram/',
      status: 'Attempted',
      hint: 'Frequency counting of 26 English lowercase characters or sorting both strings.',
    },
    {
      id: 3,
      title: 'Maximum Subarray',
      difficulty: 'Medium',
      topic: 'Dynamic Programming',
      url: 'https://leetcode.com/problems/maximum-subarray/',
      status: 'Pending',
      hint: "Kadane's algorithm: at each index, decide whether to extend previous subarray or start fresh.",
    },
  ];

  const topicsList = [
    'Arrays', 'Strings', 'Hash Tables', 'Linked Lists', 'Two Pointers', 
    'Sliding Window', 'Binary Search', 'Stack', 'Queue', 'Trees', 
    'Binary Search Trees', 'Graphs', 'Heaps', 'Greedy', 'Backtracking', 
    'Dynamic Programming', 'Sorting', 'Recursion', 'Tries'
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Personalized DSA Practice Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Master Data Structures & Algorithms, <br className="hidden sm:inline" />
              <span className="text-indigo-600">One Curated Problem a Day.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Eliminate decision fatigue and inconsistent practice. LeetCode Daily delivers custom problem sets matched to your experience, tracks your streak, carries forward pending problems, and guides you with Google Gemini AI hints.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all"
              >
                Start Practicing Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              >
                Sign In to Account
              </Link>
            </div>

            {/* Quick Guarantees bar */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero duplicate guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                Intelligent carry-forward
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-indigo-600" />
                Gmail daily morning dispatch
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Gemini AI progressive hints
              </span>
            </div>
          </div>

          {/* Interactive Live Preview Card */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="bg-slate-900 rounded-t-xl px-4 py-3 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="ml-2 font-mono text-[11px] text-slate-400">today-learning-plan.json</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-medium text-emerald-300">Live Interactive Preview</span>
              </div>
            </div>

            <Card className="rounded-t-none border-t-0 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Today's Practice Assignment — Day 14</h3>
                  <p className="text-xs text-slate-500">Target: 3 problems • 1 solved, 1 attempted, 1 pending</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-700">67% Completion</span>
                    <div className="w-28 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Problems list */}
              <div className="divide-y divide-slate-100 mt-2">
                {previewProblems.map((prob, idx) => (
                  <div key={prob.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <a 
                            href={prob.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm font-semibold text-slate-900 hover:text-indigo-600 flex items-center gap-1 group"
                          >
                            {prob.title}
                            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                          </a>
                          <DifficultyBadge difficulty={prob.difficulty} />
                          <span className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            {prob.topic}
                          </span>
                        </div>
                        {activeHintIndex === idx && (
                          <div className="mt-2 text-xs bg-indigo-50/70 text-indigo-900 p-2.5 rounded-lg border border-indigo-100 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                            <p className="leading-relaxed"><strong>AI Hint:</strong> {prob.hint}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => setActiveHintIndex(activeHintIndex === idx ? null : idx)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1 ${
                          activeHintIndex === idx
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        {activeHintIndex === idx ? 'Hide Hint' : 'Gemini Hint'}
                      </button>
                      <StatusBadge status={prob.status} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Unfinished problems automatically carry forward to tomorrow's plan
                </span>
                <span className="text-indigo-600 font-medium">Reset at midnight</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 4-Step Architecture Workflow */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">How It Works</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">A structured system for daily mastery</p>
            <p className="text-sm text-slate-600 mt-2">No more browsing through 3,000+ questions wondering what to solve next.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="relative hoverable">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1.5">Set Preferences</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose your experience tier (Beginner, Intermediate, Advanced), focus topics, and daily target (1-5 problems).
              </p>
            </Card>

            <Card className="relative hoverable">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1.5">Import History</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload your past solved problems via CSV or manual entry. The platform records every problem to guarantee zero duplicates.
              </p>
            </Card>

            <Card className="relative hoverable">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1.5">Daily Problem Plan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive fresh problems matched to your skill. Yesterday's unfinished problems carry forward without counting twice.
              </p>
            </Card>

            <Card className="relative hoverable">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
                4
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1.5">Email & AI Guidance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Problems arrive in your Gmail at 6:00 AM. Progressive Google Gemini hints guide you without spoiling solutions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Engineering Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Engineered For Consistency</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">Key features designed for real developers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hoverable className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Strict Duplicate Prevention</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Backend transaction constraints and indexed history checks guarantee you will never receive the same problem twice—even across CSV imports, skips, or retries.
              </p>
            </Card>

            <Card hoverable className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Pending Carry-Forward Logic</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Life happens. Problems left pending yesterday automatically roll into today's quota. New problems fill only the remaining slots so you never fall behind.
              </p>
            </Card>

            <Card hoverable className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Google Gemini Progressive AI</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get tiered hints that prompt your problem-solving intuition rather than dumping complete code. Includes algorithmic complexity breakdown on demand.
              </p>
            </Card>

            <Card hoverable className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Daily 6:00 AM Gmail Dispatch</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spring Scheduler powers automated morning deliveries via Gmail SMTP with idempotent retry logs, problem links, and morning warmup hints.
              </p>
            </Card>

            <Card hoverable className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Topic-Wise Weakness Detection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visual analytics reveal your solve rate across 19 categories. AI analyzes your skipped and slow topics to adapt problem recommendations dynamically.
              </p>
            </Card>

            <Card hoverable className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Private Multi-User Isolation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Normalized MySQL 8 schema with JWT authentication ensures every user's plan, history, and AI recommendations are strictly isolated and protected.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 19 Topics Matrix Preview */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Extensive Curriculum</h3>
            <p className="text-xl font-bold text-slate-900">19 Supported Data Structure & Algorithm Categories</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {topicsList.map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 bg-white text-slate-700 rounded-lg text-xs font-medium border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-subtle"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Ready to build an unbreakable coding habit?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Join LeetCode Daily today, configure your learning track, and receive your personalized daily plan tomorrow at 6:00 AM.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

