import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 border-b bg-white border-slate-200 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 font-extrabold text-white text-lg rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-200">
          R
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">
          ResolveIQ
        </span>
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
          Copilot v1.2
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full border bg-slate-50 border-slate-200">
          <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-indigo-500">
            SU
          </div>
          <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
            Sunid (Agent)
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-dot" />
        </div>
      </div>
    </header>
  );
}
