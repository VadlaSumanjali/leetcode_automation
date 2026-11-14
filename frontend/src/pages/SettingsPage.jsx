import React, { useState } from 'react';
import { Settings, User, Mail, Shield, Sparkles, Check, Clock } from 'lucide-react';
import Card from '../components/Card';

export default function SettingsPage() {
  const [target, setTarget] = useState(3);
  const [level, setLevel] = useState('Beginner');
  const [difficulty, setDifficulty] = useState('Mixed');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
          <p className="text-xs text-slate-500">Manage your learning schedule, email delivery, and account security.</p>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Scheduling Preferences */}
          <Card className="bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Practice Scheduling Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Experience Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Problem Target</label>
                <select
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value={1}>1 problem / day</option>
                  <option value={2}>2 problems / day</option>
                  <option value={3}>3 problems / day</option>
                  <option value={4}>4 problems / day</option>
                  <option value={5}>5 problems / day</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Global Delivery Schedule</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>06:00 AM Daily (Configured via backend)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Integration Status (Read-only secure indicators) */}
          <Card className="bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Integrations & Services
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Gmail SMTP Dispatcher</span>
                    <span className="text-[11px] text-slate-500">JavaMailSender with Google App Password</span>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                  Configured
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
                  Connected
                </span>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
