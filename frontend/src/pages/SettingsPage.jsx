import React, { useState, useEffect } from 'react';
import { Settings, User, Mail, Shield, Sparkles, Check, Clock, Globe, Bell, AlertCircle, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

const ALL_TOPICS = [
  'Arrays', 'Strings', 'Hash Tables', 'Linked Lists', 'Two Pointers',
  'Sliding Window', 'Binary Search', 'Stack', 'Queue', 'Trees',
  'Graphs', 'Heaps', 'Greedy', 'Backtracking', 'Dynamic Programming',
  'Recursion', 'Sorting', 'Tries'
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [level, setLevel] = useState('Beginner');
  const [difficulty, setDifficulty] = useState('Mixed');
  const [target, setTarget] = useState(3);
  const [deliveryTime, setDeliveryTime] = useState('06:00');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get('/user/preferences');
        const pref = res?.data?.data ?? res?.data;
        if (pref) {
          setLevel(pref.experienceLevel || 'Beginner');
          setDifficulty(pref.preferredDifficulty || 'Mixed');
          setTarget(pref.dailyTarget || 3);
          setDeliveryTime(pref.preferredDeliveryTime || '06:00');
          setTimezone(pref.timezone || 'Asia/Kolkata');
          setEmailNotifications(pref.emailNotificationsEnabled !== false);
          setSelectedTopics(pref.selectedTopics || []);
        }
      } catch (err) {
        console.error('Failed to load preferences:', err);
        setError('Failed to load your preferences.');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleToggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage(null);
    setError(null);

    try {
      await apiClient.put('/user/preferences', {
        experienceLevel: level,
        preferredDifficulty: difficulty,
        dailyTarget: target,
        preferredDeliveryTime: deliveryTime,
        timezone,
        emailNotificationsEnabled: emailNotifications,
        selectedTopics
      });
      setSavedMessage('Preferences successfully updated! Tomorrow\'s schedule will reflect these changes.');
      setTimeout(() => setSavedMessage(null), 5000);
    } catch (err) {
      console.error('Failed to update preferences:', err);
      setError(err.response?.data?.message || 'Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-slate-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mb-1">
            <Settings className="w-4 h-4" />
            <span>Preferences & Account</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-xs text-slate-500">
            Personalize your daily problem targets, delivery schedule, and targeted curriculum topics.
          </p>
        </div>

        {savedMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{savedMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Account Details */}
          <Card className="bg-white space-y-3">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block font-medium text-slate-500">Full Name</span>
                <span className="font-semibold text-slate-800">{user?.name || 'User'}</span>
              </div>
              <div>
                <span className="block font-medium text-slate-500">Email Address</span>
                <span className="font-semibold text-slate-800">{user?.email || 'user@example.com'}</span>
              </div>
            </div>
          </Card>

          {/* Scheduling Preferences */}
          <Card className="bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Practice Scheduling Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">DSA Experience Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Beginner">Beginner (Foundations & syntax)</option>
                  <option value="Intermediate">Intermediate (Core patterns & paradigms)</option>
                  <option value="Advanced">Advanced (Complex DP, Graphs, Optimization)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Mixed">Mixed (Balanced mix per level)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Problem Target</label>
                <select
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={1}>1 problem / day</option>
                  <option value={2}>2 problems / day</option>
                  <option value={3}>3 problems / day</option>
                  <option value={4}>4 problems / day</option>
                  <option value={5}>5 problems / day</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Delivery Time</label>
                <input
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span>Receive Daily Practice Email</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Targeted Curriculum Topics */}
          <Card className="bg-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Targeted DSA Topics</h3>
              <span className="text-xs text-indigo-600 font-semibold">
                {selectedTopics.length} of {ALL_TOPICS.length} Selected
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_TOPICS.map((topic) => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleToggleTopic(topic)}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-semibold'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Integration Status (Read-only secure indicators) */}
          <Card className="bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Backend Services & Integrations
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Gmail SMTP Dispatcher</span>
                    <span className="text-[11px] text-slate-500">JavaMailSender with Google App Password (sumanjali8324@gmail.com)</span>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Google Gemini AI Engine</span>
                    <span className="text-[11px] text-slate-500">Model: gemini-1.5-flash (Google AI Studio)</span>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                  Active
                </span>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
