import React, { useState, useEffect } from 'react';
import { 
  History, 
  FileUp, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import Card from '../components/Card';
import { DifficultyBadge, StatusBadge } from '../components/Badge';
import apiClient from '../api/client';

const TOPIC_OPTIONS = [
  'Arrays', 'Strings', 'Hash Tables', 'Linked Lists', 'Two Pointers',
  'Sliding Window', 'Binary Search', 'Stack', 'Queue', 'Trees',
  'Graphs', 'Heaps', 'Greedy', 'Backtracking', 'Dynamic Programming',
  'Recursion', 'Sorting', 'Tries'
];

export default function ProblemHistoryPage() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  // Manual entry modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualTopic, setManualTopic] = useState('Arrays');
  const [manualDifficulty, setManualDifficulty] = useState('Easy');
  const [manualStatus, setManualStatus] = useState('SOLVED');
  const [submittingManual, setSubmittingManual] = useState(false);

  // CSV upload
  const [uploadingCsv, setUploadingCsv] = useState(false);
  const [csvSuccessMessage, setCsvSuccessMessage] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/history');
      if (res.data && res.data.data) {
        setHistoryItems(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
      setError(err.response?.data?.message || 'Failed to load problem history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAddManual = async (e) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    setSubmittingManual(true);
    try {
      const res = await apiClient.post('/history/manual', {
        title: manualTitle.trim(),
        difficulty: manualDifficulty,
        topic: manualTopic,
        status: manualStatus
      });

      if (res.data && res.data.data) {
        setHistoryItems((prev) => [res.data.data, ...prev]);
        setManualTitle('');
        setShowManualModal(false);
      }
    } catch (err) {
      console.error('Failed to add problem:', err);
      alert(err.response?.data?.message || 'Failed to record problem.');
    } finally {
      setSubmittingManual(false);
    }
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingCsv(true);
    setCsvSuccessMessage(null);
    try {
      const res = await apiClient.post('/history/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data) {
        setCsvSuccessMessage(res.data.message || `Successfully imported problems.`);
        fetchHistory(); // Reload list
      }
    } catch (err) {
      console.error('CSV upload failed:', err);
      alert(err.response?.data?.message || 'Failed to parse and upload CSV.');
    } finally {
      setUploadingCsv(false);
      e.target.value = '';
    }
  };

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch = 
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.topic || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || item.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();
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
              Every solved, attempted, skipped, or imported problem is tracked here. The scheduling engine strictly excludes these from future assignments.
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
              {uploadingCsv ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileUp className="w-3.5 h-3.5" />
              )}
              {uploadingCsv ? 'Importing...' : 'Import CSV'}
              <input
                type="file"
                accept=".csv"
                disabled={uploadingCsv}
                className="hidden"
                onChange={handleCsvUpload}
              />
            </label>
          </div>
        </div>

        {/* Success / Error Messages */}
        {csvSuccessMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{csvSuccessMessage}</span>
            </div>
            <button onClick={() => setCsvSuccessMessage(null)}>
              <X className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchHistory}
              className="text-xs font-semibold text-rose-800 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

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

        {/* Table / List */}
        {loading ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500">Loading your problem history...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="bg-white p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {historyItems.length === 0 ? 'No Problems Recorded Yet' : 'No Matching Problems Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {historyItems.length === 0
                ? 'Your problem history is currently clean. As you complete assignments or import past solved problems, they will appear here to ensure you are never reassigned duplicate questions.'
                : 'Try adjusting your search query or difficulty filter.'}
            </p>
          </Card>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Problem Title</th>
                    <th className="px-4 py-3">Difficulty</th>
                    <th className="px-4 py-3">Topic</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Recorded Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 text-slate-400 font-mono">
                        {item.leetcodeId ? `#${item.leetcodeId}` : index + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {item.title}
                      </td>
                      <td className="px-4 py-3">
                        <DifficultyBadge difficulty={item.difficulty} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 text-[11px]">
                          {item.topic}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {item.completedAt ? item.completedAt.split('T')[0] : 'Today'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
              <span>Showing {filteredItems.length} of {historyItems.length} problems</span>
              <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Guaranteed Duplicate Protection Active
              </span>
            </div>
          </div>
        )}

        {/* Manual Modal */}
        {showManualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Add Solved Problem Manually</h3>
                <button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddManual} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Problem Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Reverse Linked List"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                    <select
                      value={manualDifficulty}
                      onChange={(e) => setManualDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Topic</label>
                    <select
                      value={manualTopic}
                      onChange={(e) => setManualTopic(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      {TOPIC_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={manualStatus}
                    onChange={(e) => setManualStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="SOLVED">Solved</option>
                    <option value="ATTEMPTED">Attempted</option>
                    <option value="SKIPPED">Skipped</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingManual}
                    className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    {submittingManual && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save to History
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
