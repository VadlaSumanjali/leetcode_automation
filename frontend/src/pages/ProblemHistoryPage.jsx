import React, { useState } from 'react';
import { 
  History, 
  FileUp, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import Card from '../components/Card';
import { DifficultyBadge, StatusBadge } from '../components/Badge';

export default function ProblemHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [manualTitle, setManualTitle] = useState('');
  const [manualTopic, setManualTopic] = useState('Arrays');
  const [manualDifficulty, setManualDifficulty] = useState('Easy');
  const [manualStatus, setManualStatus] = useState('Solved');
  const [showManualModal, setShowManualModal] = useState(false);

  const [historyItems, setHistoryItems] = useState([
    { id: 1, title: 'Two Sum', leetcodeId: 1, difficulty: 'Easy', topic: 'Arrays', status: 'Solved', completedAt: '2026-11-14' },
    { id: 2, title: 'Valid Anagram', leetcodeId: 242, difficulty: 'Easy', topic: 'Strings', status: 'Solved', completedAt: '2026-11-13' },
    { id: 3, title: 'Reverse Linked List', leetcodeId: 206, difficulty: 'Easy', topic: 'Linked Lists', status: 'Solved', completedAt: '2026-11-12' },
    { id: 4, title: 'Best Time to Buy and Sell Stock', leetcodeId: 121, difficulty: 'Easy', topic: 'Arrays', status: 'Solved', completedAt: '2026-11-11' },
    { id: 5, title: 'Merge Two Sorted Lists', leetcodeId: 21, difficulty: 'Easy', topic: 'Linked Lists', status: 'Solved', completedAt: '2026-11-10' },
  ]);

  const handleAddManual = (e) => {
    e.preventDefault();
    if (!manualTitle) return;
    const newItem = {
      id: Date.now(),
      title: manualTitle,
      leetcodeId: Math.floor(Math.random() * 1000) + 1,
      difficulty: manualDifficulty,
      topic: manualTopic,
      status: manualStatus,
      completedAt: new Date().toISOString().split('T')[0],
    };
    setHistoryItems([newItem, ...historyItems]);
    setManualTitle('');
    setShowManualModal(false);
  };

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || item.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-subtle">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Duplicate Prevention Registry</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Problem History</h1>
            <p className="text-xs text-slate-500">
              Every solved, attempted, skipped or imported problem is logged here. The engine never assigns any problem on this list.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowManualModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Manually
            </button>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">
              <FileUp className="w-3.5 h-3.5" />
              Import CSV
              <input type="file" accept=".csv" className="hidden" onChange={(e) => alert('CSV file selected: ' + e.target.files[0]?.name + ' (Import processing configured in Phase 4)')} />
            </label>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* History Table */}
        <Card className="p-0 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Problem Title</th>
                  <th className="px-6 py-3">Difficulty</th>
                  <th className="px-6 py-3">Topic</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Recorded Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">{item.title}</td>
                    <td className="px-6 py-3.5">
                      <DifficultyBadge difficulty={item.difficulty} />
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">{item.topic}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-3.5 text-slate-400 font-mono">{item.completedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Manual Modal */}
        {showManualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-slate-900">Add Problem to History</h3>
              <form onSubmit={handleAddManual} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Problem Title</label>
                  <input
                    type="text"
                    required
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="e.g. Climbing Stairs"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
                    <select
                      value={manualDifficulty}
                      onChange={(e) => setManualDifficulty(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Topic</label>
                    <input
                      type="text"
                      value={manualTopic}
                      onChange={(e) => setManualTopic(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  >
                    Save Problem
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

