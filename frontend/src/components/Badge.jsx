import React from 'react';

export function DifficultyBadge({ difficulty }) {
  const norm = (difficulty || '').toLowerCase();
  
  if (norm === 'easy') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        Easy
      </span>
    );
  }
  if (norm === 'medium') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        Medium
      </span>
    );
  }
  if (norm === 'hard') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
        Hard
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      {difficulty || 'Mixed'}
    </span>
  );
}

export function StatusBadge({ status }) {
  const norm = (status || '').toLowerCase();
  
  if (norm === 'solved') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Solved
      </span>
    );
  }
  if (norm === 'attempted') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        Attempted
      </span>
    );
  }
  if (norm === 'skipped') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        Skipped
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
      Pending
    </span>
  );
}
