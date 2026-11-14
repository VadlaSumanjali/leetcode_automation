import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  CheckCircle2, 
  Clock, 
  Layers, 
  TrendingUp, 
  Calendar, 
  Filter, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  BarChart2
} from 'lucide-react';
import Card from '../components/Card';
import { DifficultyBadge, StatusBadge } from '../components/Badge';

export default function DashboardPage() {
  const [topicFilter, setTopicFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  // Realistic sample data for Phase 1 UI showcase (will be hooked to backend in Phase 6)
  const summary = {
    totalAssigned: 42,
    totalSolved: 31,
    pendingProblems: 3,
    currentStreak: 12,
    todayProgress: 67,
  };

  const todayProblems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', status: 'Solved', url: 'https://leetcode.com/problems/two-sum/' },
    { id: 2, title: 'Valid Anagram', difficulty: 'Easy', topic: 'Strings', status: 'Attempted', url: 'https://leetcode.com/problems/valid-anagram/' },
    { id: 3, title: 'Maximum Subarray', difficulty: 'Medium', topic: 'Dynamic Programming', status: 'Pending', url: 'https://leetcode.com/problems/maximum-subarray/' },
  ];

  const topicStats = [
    { topic: 'Arrays', solved: 12, total: 14, percent: 85 },
    { topic: 'Strings', solved: 8, total: 10, percent: 80 },
    { topic: 'Two Pointers', solved: 5, total: 7, percent: 71 },
    { topic: 'Hash Tables', solved: 4, total: 6, percent: 66 },
    { topic: 'Dynamic Programming', solved: 2, total: 5, percent: 40 },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-subtle">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized DSA Learning Hub</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Good morning, Coder!</h1>
            <p className="text-xs text-slate-500">You are on a 12-day problem solving streak. Keep the momentum going!</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Open Today's Plan
            </Link>
          </div>
        </div>

        {/* 4 Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card hoverable className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Assigned</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{summary.totalAssigned}</span>
              <span className="text-[11px] text-slate-400">all time</span>
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
              <span className="text-2xl font-bold text-emerald-600">{summary.totalSolved}</span>
              <span className="text-[11px] text-slate-400">74% solve rate</span>
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
              <span className="text-2xl font-bold text-amber-600">{summary.pendingProblems}</span>
              <span className="text-[11px] text-slate-400">carries forward if undone</span>
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
              <span className="text-2xl font-bold text-rose-600">{summary.currentStreak} days</span>
              <span className="text-[11px] text-slate-400">record high</span>
            </div>
          </Card>
        </div>

        {/* Main 2-column layout: Today's Plan & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 spans): Today's Active Plan */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Today's Learning Plan</h2>
                  <p className="text-xs text-slate-500">Day 14 Practice Set • 2 of 3 completed</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-indigo-600">{summary.todayProgress}% Completed</span>
                  <div className="w-32 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${summary.todayProgress}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Problem list */}
              <div className="divide-y divide-slate-100 mt-2">
                {todayProblems.map((prob, idx) => (
                  <div key={prob.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-semibold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link to={`/problems/${prob.id}`} className="text-sm font-semibold text-slate-900 hover:text-indigo-600">
                            {prob.title}
                          </Link>
                          <DifficultyBadge difficulty={prob.difficulty} />
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

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link to="/plan" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                  View full daily schedule & manage status <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] text-slate-400">Next dispatch: Tomorrow 6:00 AM</span>
              </div>
            </Card>

            {/* Weekly Activity Heatmap skeleton */}
            <Card className="bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Weekly Consistency</h3>
                <span className="text-xs text-slate-500">Past 7 days</span>
              </div>
              <div className="grid grid-cols-7 gap-2 mt-4 text-center">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} className="space-y-1.5">
                    <div className={`h-12 rounded-lg flex items-center justify-center text-xs font-semibold ${
                      i < 5 ? 'bg-indigo-600 text-white' : i === 5 ? 'bg-indigo-200 text-indigo-900' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {i < 5 ? '3/3' : i === 5 ? '2/3' : '—'}
                    </div>
                    <span className="text-[11px] text-slate-500">{day}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Topic Breakdown & Difficulty Split */}
          <div className="space-y-6">
            <Card className="bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Topic-Wise Progress</h3>
                <Link to="/topics" className="text-xs text-indigo-600 hover:underline font-medium">All Topics</Link>
              </div>
              <div className="space-y-3 mt-3">
                {topicStats.map((item) => (
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
            </Card>

            <Card className="bg-white">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">Difficulty Distribution</h3>
              <div className="space-y-2.5 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-emerald-700">Easy (18 solved)</span>
                  <span className="text-slate-500">58%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '58%' }}></div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-medium text-amber-700">Medium (11 solved)</span>
                  <span className="text-slate-500">35%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '35%' }}></div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-medium text-rose-700">Hard (2 solved)</span>
                  <span className="text-slate-500">7%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: '7%' }}></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

