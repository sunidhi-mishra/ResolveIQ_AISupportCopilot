import React from 'react';
import { Sparkles, History } from 'lucide-react';

interface HeaderProps {
  activeTab: 'copilot' | 'history';
  setActiveTab: (tab: 'copilot' | 'history') => void;
  historyCount: number;
}

export default function Header({ activeTab, setActiveTab, historyCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 border-b bg-white border-slate-200 shadow-xs flex-wrap md:flex-nowrap gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 font-extrabold text-white text-lg rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-200 select-none">
          R
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">
          ResolveIQ
        </span>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 hidden sm:inline-block">
          Copilot v1.2
        </span>
      </div>

      {/* Center Tabs Navigation */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('copilot')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
            activeTab === 'copilot'
              ? 'bg-white text-indigo-650 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          type="button"
        >
          <Sparkles size={13} className={activeTab === 'copilot' ? 'text-indigo-500 animate-pulse' : 'text-slate-400'} />
          AI Copilot
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer relative ${
            activeTab === 'history'
              ? 'bg-white text-indigo-650 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          type="button"
        >
          <History size={13} className={activeTab === 'history' ? 'text-indigo-500' : 'text-slate-400'} />
          Resolution History
          {historyCount > 0 && (
            <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center min-w-[15px]">
              {historyCount}
            </span>
          )}
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full border bg-slate-50 border-slate-200 select-none">
          <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-indigo-500">
            SU
          </div>
          <span className="text-xs font-semibold text-slate-600 hidden md:inline">
            Sunid (Agent)
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
        </div>
      </div>
    </header>
  );
}

