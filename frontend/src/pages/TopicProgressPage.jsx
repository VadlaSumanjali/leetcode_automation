import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import Card from '../components/Card';

const TOPICS_DATA = [
  { topic: 'Arrays', solved: 12, total: 15, percent: 80, strength: 'Strong' },
  { topic: 'Strings', solved: 8, total: 10, percent: 80, strength: 'Strong' },
  { topic: 'Two Pointers', solved: 5, total: 7, percent: 71, strength: 'Moderate' },
  { topic: 'Hash Tables', solved: 4, total: 6, percent: 66, strength: 'Moderate' },
  { topic: 'Linked Lists', solved: 3, total: 5, percent: 60, strength: 'Moderate' },
  { topic: 'Binary Search', solved: 3, total: 6, percent: 50, strength: 'Needs Work' },
  { topic: 'Trees', solved: 2, total: 5, percent: 40, strength: 'Needs Work' },
  { topic: 'Dynamic Programming', solved: 2, total: 6, percent: 33, strength: 'Weak' },
  { topic: 'Graphs', solved: 1, total: 4, percent: 25, strength: 'Weak' },
  { topic: 'Sliding Window', solved: 2, total: 3, percent: 66, strength: 'Moderate' },
  { topic: 'Stack', solved: 3, total: 4, percent: 75, strength: 'Strong' },
  { topic: 'Queue', solved: 1, total: 2, percent: 50, strength: 'Needs Work' },
  { topic: 'Binary Search Trees', solved: 1, total: 3, percent: 33, strength: 'Weak' },
  { topic: 'Heaps', solved: 1, total: 2, percent: 50, strength: 'Needs Work' },
  { topic: 'Greedy', solved: 2, total: 4, percent: 50, strength: 'Needs Work' },
  { topic: 'Backtracking', solved: 1, total: 3, percent: 33, strength: 'Weak' },
  { topic: 'Sorting', solved: 4, total: 5, percent: 80, strength: 'Strong' },
  { topic: 'Recursion', solved: 2, total: 3, percent: 66, strength: 'Moderate' },
  { topic: 'Tries', solved: 0, total: 2, percent: 0, strength: 'Untracked' },
];

export default function TopicProgressPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Skill Matrix</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Topic-Wise Mastery</h1>
            <p className="text-xs text-slate-500">
              Track your performance across all 19 Data Structures and Algorithms categories.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              4 Strong
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-medium">
              5 Needs Work
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-medium">
              4 Weak
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
                Google Gemini AI Practice Recommendation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Based on your historical performance, your lowest completion rates are in <strong>Dynamic Programming</strong> (33%) and <strong>Graphs</strong> (25%). The scheduling engine will bias upcoming practice sessions toward foundational problems in these categories to solidify your fundamentals.
              </p>
            </div>
          </div>
        </Card>

        {/* 19 Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS_DATA.map((item) => (
            <Card key={item.topic} className="bg-white p-4 space-y-2 hoverable">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{item.topic}</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  item.strength === 'Strong'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : item.strength === 'Moderate'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : item.strength === 'Needs Work'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {item.strength}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs text-slate-500">
                <span>{item.solved} solved of {item.total} assigned</span>
                <span className="font-semibold text-slate-700">{item.percent}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.strength === 'Strong'
                      ? 'bg-emerald-500'
                      : item.strength === 'Moderate'
                      ? 'bg-indigo-500'
                      : item.strength === 'Needs Work'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

