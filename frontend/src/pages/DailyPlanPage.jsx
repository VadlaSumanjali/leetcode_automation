import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import Card from '../components/Card';
import { DifficultyBadge, StatusBadge } from '../components/Badge';

export default function DailyPlanPage() {
  const [problems, setProblems] = useState([
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      topic: 'Arrays',
      status: 'Solved',
      isCarriedForward: false,
      url: 'https://leetcode.com/problems/two-sum/',
    },
    {
      id: 2,
      title: 'Valid Anagram',
      difficulty: 'Easy',
      topic: 'Strings',
      status: 'Attempted',
      isCarriedForward: false,
      url: 'https://leetcode.com/problems/valid-anagram/',
    },
    {
      id: 3,
      title: 'Maximum Subarray',
      difficulty: 'Medium',
      topic: 'Dynamic Programming',
      status: 'Pending',
      isCarriedForward: true, // Carried forward from yesterday
      url: 'https://leetcode.com/problems/maximum-subarray/',
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setProblems(
      problems.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const solvedCount = problems.filter((p) => p.status === 'Solved').length;
  const progressPercent = Math.round((solvedCount / problems.length) * 100);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-subtle">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
              <Calendar className="w-4 h-4" />
              <span>Today's Assignment — Day 14</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Daily Problem Schedule</h1>
            <p className="text-xs text-slate-500">
              Complete each problem, then update its status to track your progress and trigger tomorrow's plan.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200">
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-700">{solvedCount} of {problems.length} Solved</span>
              <div className="w-28 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
            <span className="text-sm font-bold text-indigo-600">{progressPercent}%</span>
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          {problems.map((problem, index) => (
            <Card key={problem.id} className="bg-white hover:border-slate-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
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
                      {problem.isCarriedForward && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                          <RotateCcw className="w-3 h-3 text-amber-600" />
                          Carried forward
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Solve on LeetCode, then select your progress below. Unsolved problems will automatically carry forward.
                    </p>
                  </div>
                </div>

                {/* Status Switcher Buttons */}
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200 self-end sm:self-center shrink-0">
                  {['Pending', 'Attempted', 'Solved', 'Skipped'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateStatus(problem.id, st)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                        problem.status === st
                          ? st === 'Solved'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : st === 'Attempted'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : st === 'Skipped'
                            ? 'bg-slate-600 text-white shadow-sm'
                            : 'bg-amber-500 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Informational Footer banner on Carry Forward logic */}
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
          <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-900 space-y-1">
            <p className="font-semibold">How Pending Carry-Forward Works</p>
            <p className="text-indigo-700 leading-relaxed">
              At midnight or the next morning delivery, any problem still marked as <strong>Pending</strong> will be carried forward to Day 15 and counted towards your daily quota. New problems will only fill the remaining slots. Problems marked <strong>Solved</strong> or <strong>Skipped</strong> will never be reassigned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
