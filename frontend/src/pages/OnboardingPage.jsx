import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  FileUp, 
  Target, 
  GraduationCap, 
  Layers, 
  Mail, 
  Clock, 
  ShieldCheck, 
  User, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';
import Card from '../components/Card';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

const ALL_TOPICS = [
  'Arrays', 'Strings', 'Hash Tables', 'Linked Lists', 'Two Pointers',
  'Sliding Window', 'Binary Search', 'Stack', 'Queue', 'Trees',
  'Graphs', 'Heaps', 'Greedy', 'Backtracking', 'Dynamic Programming',
  'Recursion', 'Sorting', 'Tries'
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  // Form State
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [selectedTopics, setSelectedTopics] = useState(['Arrays', 'Strings', 'Hash Tables']);
  const [dailyTarget, setDailyTarget] = useState(3);
  const [preferredDifficulty, setPreferredDifficulty] = useState('Mixed');
  const [deliveryTime, setDeliveryTime] = useState('06:00');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [emailEnabled, setEmailEnabled] = useState(true);

  // History State (Step 7)
  const [hasHistory, setHasHistory] = useState('no'); // 'yes' | 'no'
  const [historyItems, setHistoryItems] = useState([]);
  const [manualTitle, setManualTitle] = useState('');
  const [manualDiff, setManualDiff] = useState('Easy');
  const [manualTopic, setManualTopic] = useState('Arrays');
  const [manualStatus, setManualStatus] = useState('SOLVED');
  const [csvFileName, setCsvFileName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const toggleTopic = (t) => {
    if (selectedTopics.includes(t)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((item) => item !== t));
      }
    } else {
      setSelectedTopics([...selectedTopics, t]);
    }
  };

  const handleAddManualItem = (e) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;
    setHistoryItems([
      ...historyItems,
      {
        title: manualTitle.trim(),
        difficulty: manualDiff,
        topic: manualTopic,
        status: manualStatus,
      },
    ]);
    setManualTitle('');
  };

  const handleRemoveHistoryItem = (index) => {
    setHistoryItems(historyItems.filter((_, i) => i !== index));
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n');
        const parsed = [];
        let isHeader = true;

        for (const line of lines) {
          if (!line.trim()) continue;
          const parts = line.split(',');
          if (isHeader) {
            isHeader = false;
            const first = parts[0]?.trim().toLowerCase();
            if (first === 'title' || first === 'problem' || first === 'name') continue;
          }
          const title = parts[0]?.trim().replace(/"/g, '');
          if (title) {
            const diff = parts[1]?.trim().replace(/"/g, '') || 'Easy';
            const topic = parts[2]?.trim().replace(/"/g, '') || 'General';
            const status = parts[3]?.trim().replace(/"/g, '') || 'SOLVED';
            parsed.push({ title, difficulty: diff, topic, status });
          }
        }
        setHistoryItems((prev) => [...prev, ...parsed]);
      } catch (err) {
        setError('Could not parse CSV. Please ensure format: Title, Difficulty, Topic, Status');
      }
    };
    reader.readAsText(file);
  };

  const handleCompleteSetup = async () => {
    setIsSubmitting(true);
    setError(null);

    const payload = {
      experienceLevel: skillLevel,
      topics: selectedTopics,
      dailyTarget: Number(dailyTarget),
      preferredDifficulty: preferredDifficulty,
      preferredDeliveryTime: deliveryTime,
      timezone: timezone,
      emailNotificationsEnabled: emailEnabled,
      historyList: hasHistory === 'yes' ? historyItems : [],
    };

    try {
      const response = await apiClient.post('/onboarding', payload);
      if (response?.data?.user) {
        updateUser(response.data.user);
        navigate('/dashboard');
      } else {
        // Fallback refresh user
        const meRes = await apiClient.get('/auth/me');
        if (meRes?.data) updateUser(meRes.data);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding. Please check settings.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Wizard Header & Progress Bar */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Step {currentStep} of {totalSteps}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personalize Your Practice Path</h1>
          <p className="text-xs text-slate-500">
            Mandatory onboarding: Configure your algorithm preferences to receive your daily curated problem plan.
          </p>

          {/* Stepper bar */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-4">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Card className="bg-white">
          {/* STEP 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <User className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 1: Account Information</h3>
                  <p className="text-xs text-slate-500">Authenticated user credentials</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="block text-slate-500 font-semibold mb-1">Full Name</span>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800">
                    {user?.name || 'Developer'}
                  </div>
                </div>
                <div>
                  <span className="block text-slate-500 font-semibold mb-1">Email Address</span>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800">
                    {user?.email || 'user@example.com'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Current DSA skill level */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 2: DSA Skill Level</h3>
                  <p className="text-xs text-slate-500">What is your current DSA experience level?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { level: 'Beginner', desc: 'Learning core structures: Arrays, Strings, basic recursion' },
                  { level: 'Intermediate', desc: 'Comfortable with Trees, Graphs, Binary Search, Sliding Window' },
                  { level: 'Advanced', desc: 'Mastering Dynamic Programming, Hard graphs, Tries & Heaps' },
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setSkillLevel(item.level)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      skillLevel === item.level
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="block text-sm font-bold text-slate-900">{item.level}</span>
                    <span className="block text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Select topics */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Step 3: Focus Topics</h3>
                    <p className="text-xs text-slate-500">Which DSA topics do you want to practice? ({selectedTopics.length} selected)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTopics(selectedTopics.length === ALL_TOPICS.length ? ['Arrays'] : [...ALL_TOPICS])}
                  className="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  {selectedTopics.length === ALL_TOPICS.length ? 'Reset' : 'Select All'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {ALL_TOPICS.map((topic) => {
                  const active = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {active && <Check className="w-3.5 h-3.5" />}
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Daily problem target */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Target className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 4: Daily Target</h3>
                  <p className="text-xs text-slate-500">How many problems do you want to solve every day?</p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDailyTarget(num)}
                    className={`py-4 rounded-xl border text-center transition-all ${
                      dailyTarget === num
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-800 bg-white'
                    }`}
                  >
                    <span className="block text-xl font-bold">{num}</span>
                    <span className="block text-[11px] opacity-80 mt-0.5">problem{num > 1 ? 's' : ''}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Difficulty preference */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 5: Preferred Difficulty</h3>
                  <p className="text-xs text-slate-500">What difficulty do you prefer?</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Easy', 'Medium', 'Hard', 'Mixed'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setPreferredDifficulty(diff)}
                    className={`py-4 px-3 rounded-xl border text-center transition-all ${
                      preferredDifficulty === diff
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span className="block text-sm font-bold">{diff}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Daily email automation */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Clock className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 6: Daily Email Automation</h3>
                  <p className="text-xs text-slate-500">When would you like to receive your daily LeetCode problems?</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Preferred Delivery Time</label>
                  <input
                    type="time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full sm:w-48 px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Default is 06:00 AM in your selected timezone</p>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Your Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                    <option value="America/Chicago">America/Chicago (CST)</option>
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                    <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-slate-800">Enable Daily Morning Email Notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Previous LeetCode history */}
          {currentStep === 7 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 7: Previous LeetCode History</h3>
                  <p className="text-xs text-slate-500">Have you solved LeetCode problems before?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHasHistory('no')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    hasHistory === 'no'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="block text-sm font-bold text-slate-900">No, start fresh</span>
                  <span className="block text-xs text-slate-500 mt-1">Begin from Day 1 with zero pre-loaded history.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHasHistory('yes')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    hasHistory === 'yes'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="block text-sm font-bold text-slate-900">Yes, import my history</span>
                  <span className="block text-xs text-slate-500 mt-1">Upload CSV or enter problems to guarantee zero duplicates.</span>
                </button>
              </div>

              {hasHistory === 'yes' && (
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  {/* CSV Upload */}
                  <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg text-center hover:border-indigo-400 transition-colors">
                    <input
                      type="file"
                      id="onboard-csv"
                      accept=".csv"
                      className="hidden"
                      onChange={handleCsvUpload}
                    />
                    <label htmlFor="onboard-csv" className="cursor-pointer block">
                      <FileUp className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <span className="text-xs font-semibold text-indigo-600 hover:underline">
                        {csvFileName ? `Uploaded: ${csvFileName}` : 'Upload LeetCode CSV export'}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Columns: Title, Difficulty, Topic, Status</p>
                    </label>
                  </div>

                  {/* Manual entry */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-3">
                    <span className="text-xs font-semibold text-slate-800 block">Or Add Solved Problem Manually:</span>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Two Sum"
                        value={manualTitle}
                        onChange={(e) => setManualTitle(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                      <select
                        value={manualDiff}
                        onChange={(e) => setManualDiff(e.target.value)}
                        className="px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddManualItem}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* List of imported items */}
                  {historyItems.length > 0 && (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      <span className="text-[11px] font-semibold text-slate-600">
                        Recorded Problems for Duplicate Prevention ({historyItems.length}):
                      </span>
                      {historyItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 bg-white rounded border border-slate-200">
                          <span className="font-medium text-slate-800">{item.title} ({item.difficulty})</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveHistoryItem(idx)}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 8: Review and confirmation */}
          {currentStep === 8 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 8: Review & Confirm Preferences</h3>
                  <p className="text-xs text-slate-500">Verify your setup before generating your Day 1 plan.</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">DSA Skill Level:</span>
                  <span className="font-semibold text-slate-900">{skillLevel}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Daily Target:</span>
                  <span className="font-semibold text-slate-900">{dailyTarget} problems / day</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Preferred Difficulty:</span>
                  <span className="font-semibold text-slate-900">{preferredDifficulty}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Focus Topics ({selectedTopics.length}):</span>
                  <span className="font-semibold text-slate-900 max-w-xs text-right truncate">
                    {selectedTopics.join(', ')}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Daily Email Schedule:</span>
                  <span className="font-semibold text-slate-900">
                    {emailEnabled ? `${deliveryTime} (${timezone})` : 'Disabled'}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Recorded Problem History:</span>
                  <span className="font-semibold text-slate-900">
                    {hasHistory === 'yes' ? `${historyItems.length} problems (excluded from assignment)` : 'None (Fresh start)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
              >
                Continue
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCompleteSetup}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'Saving to Database...' : 'Complete Setup & Generate Plan'}
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
