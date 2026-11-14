import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  FileUp, 
  Layers, 
  Target, 
  GraduationCap, 
  Info 
} from 'lucide-react';
import Card from '../components/Card';

const TOPICS = [
  'Arrays', 'Strings', 'Hash Tables', 'Linked Lists', 'Two Pointers',
  'Sliding Window', 'Binary Search', 'Stack', 'Queue', 'Trees',
  'Binary Search Trees', 'Graphs', 'Heaps', 'Greedy', 'Backtracking',
  'Dynamic Programming', 'Sorting', 'Recursion', 'Tries'
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form selections
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [selectedTopics, setSelectedTopics] = useState(['Arrays', 'Strings', 'Hash Tables']);
  const [dailyTarget, setDailyTarget] = useState(3);
  const [preferredDifficulty, setPreferredDifficulty] = useState('Mixed');
  const [csvFile, setCsvFile] = useState(null);

  const toggleTopic = (t) => {
    if (selectedTopics.includes(t)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((x) => x !== t));
      }
    } else {
      setSelectedTopics([...selectedTopics, t]);
    }
  };

  const handleFinish = () => {
    // Store onboarding settings locally (will connect to backend in Phase 3)
    const preferences = {
      experienceLevel,
      topics: selectedTopics,
      dailyTarget,
      preferredDifficulty,
    };
    localStorage.setItem('leetcode_daily_preferences', JSON.stringify(preferences));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Personalization Setup</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Configure Your Daily Practice</h1>
          <p className="text-xs text-slate-500">
            Customize your learning path. LeetCode Daily uses these preferences to schedule your problems.
          </p>
        </div>

        <Card className="bg-white">
          {/* Step 1: Experience & Difficulty */}
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperienceLevel(lvl)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                      experienceLevel === lvl
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                <Target className="w-4 h-4 text-indigo-600" />
                Daily Target & Preferred Difficulty
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs text-slate-600 mb-1.5 font-medium">Daily Problem Target</span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setDailyTarget(num)}
                        className={`py-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                          dailyTarget === num
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs text-slate-600 mb-1.5 font-medium">Preferred Difficulty</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['Easy', 'Medium', 'Hard', 'Mixed'].map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setPreferredDifficulty(diff)}
                        className={`py-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                          preferredDifficulty === diff
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Topics Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Select Focus Topics ({selectedTopics.length} selected)
                </label>
                <button
                  type="button"
                  onClick={() => setSelectedTopics(selectedTopics.length === TOPICS.length ? ['Arrays'] : [...TOPICS])}
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  {selectedTopics.length === TOPICS.length ? 'Clear all' : 'Select all'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {TOPICS.map((topic) => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional CSV History Import */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                <FileUp className="w-4 h-4 text-indigo-600" />
                Import Solved History (Optional)
              </label>
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  id="csv-upload"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="csv-upload" className="cursor-pointer block">
                  <FileUp className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <span className="text-xs font-semibold text-indigo-600 hover:underline">
                    {csvFile ? csvFile.name : 'Click to upload CSV history'}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Format: Title, Difficulty, Status (or standard LeetCode export)
                  </p>
                </label>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>Any imported problem will be recorded into history to ensure it is never assigned again.</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">
                You can change these preferences anytime in Settings.
              </span>
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
              >
                Save Preferences & Open Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
