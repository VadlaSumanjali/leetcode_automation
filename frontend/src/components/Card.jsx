import React from 'react';

export default function Card({ children, className = '', hoverable = false, padding = true }) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-subtle ${
        hoverable ? 'hover:shadow-card-hover hover:border-slate-300 transition-all duration-200' : ''
      } ${padding ? 'p-6' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

