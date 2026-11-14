import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import Card from '../components/Card';
import { DifficultyBadge, StatusBadge } from '../components/Badge';

export default function ProblemDetailsPage() {
  const { id } = useParams();
  const [hintLevel, setHintLevel] = useState(1);
  const [showFullExplanation, setShowFullExplanation] = useState(false);
  const [status, setStatus] = useState('Pending');

  // Original algorithmic summary for Phase 1 UI preview
  const problem = {
    id: id || 1,
    title: 'Two Sum',
    leetcodeId: 1,
    difficulty: 'Easy',
    topic: 'Arrays',
    url: 'https://leetcode.com/problems/two-sum/',
    description: 'Find two distinct indices in a list of numbers whose values add up to a specified target value. A single valid solution is guaranteed to exist.',
    hints: [
      { level: 1, title: 'Intuition', text: 'Can you check if each element’s complement (target - num) exists in the array?' },
      { level: 2, title: 'Data Structure', text: 'Searching an array takes linear time, but lookup in a Hash Table is constant time on average.' },
      { level: 3, title: 'Algorithm Details', text: 'Iterate once: for each value, verify if complement exists in the map; otherwise store the current value and index.' },
    ],
    explanation: {
      approach: 'Single-pass Hash Map approach: Store visited numbers with their index. Look up target minus current element in constant expected time.',
      timeComplexity: 'O(N) — Linear scan over N items with O(1) hash map operations.',
      spaceComplexity: 'O(N) — Auxiliary memory for storing elements in the map.',
    },
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link to="/plan" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
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
              {['Pending', 'Attempted', 'Solved', 'Skipped'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    status === st ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Problem Summary</h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {problem.description}
            </p>
          </div>
        </Card>

        {/* Google Gemini AI Progressive Hints Section */}
        <Card className="bg-white border-indigo-100 shadow-card">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Gemini AI Progressive Hints</h2>
                <p className="text-xs text-slate-500">Tiered guidance designed to prompt intuition without spoiling answers</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setHintLevel(lvl)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded ${
                    hintLevel === lvl ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hint {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {problem.hints.slice(0, hintLevel).map((h) => (
              <div key={h.level} className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-lg flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-950 space-y-0.5">
                  <span className="font-semibold text-indigo-700">Tier {h.level}: {h.title}</span>
                  <p className="leading-relaxed">{h.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Toggle Full Explanation */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowFullExplanation(!showFullExplanation)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              {showFullExplanation ? 'Hide Full Algorithmic Breakdown' : 'Show Full Algorithmic Breakdown & Complexity'}
            </button>

            {showFullExplanation && (
              <div className="mt-4 space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Optimal Approach</h4>
                  <p className="text-slate-600 leading-relaxed">{problem.explanation.approach}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <span className="font-semibold text-slate-800 block mb-0.5">Time Complexity</span>
                    <span className="text-slate-600">{problem.explanation.timeComplexity}</span>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <span className="font-semibold text-slate-800 block mb-0.5">Space Complexity</span>
                    <span className="text-slate-600">{problem.explanation.spaceComplexity}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
