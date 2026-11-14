import React from 'react';
import { Code2, Heart, Shield, Sparkles, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-900">LeetCode Daily</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Personalized coding practice platform engineered to help software engineers master DSA systematically without burnout.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/plan" className="hover:text-indigo-600">Daily Plan</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-600">Analytics Dashboard</Link></li>
              <li><Link to="/history" className="hover:text-indigo-600">Problem History</Link></li>
              <li><Link to="/topics" className="hover:text-indigo-600">Topic Progress</Link></li>
            </ul>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Guarantees</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>Zero Duplicate Guarantee</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Progressive Gemini Hints</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>6:00 AM Gmail Delivery</span>
              </li>
            </ul>
          </div>

          {/* System Info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Architecture</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-2">
              Built with Spring Boot 3, Java 21, React 18, Tailwind CSS, MySQL 8 and Google Gemini AI.
            </p>
            <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              All systems operational
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LeetCode Daily. Multi-user DSA Practice Platform.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered with precision for consistent learning
          </p>
        </div>
      </div>
    </footer>
  );
}

