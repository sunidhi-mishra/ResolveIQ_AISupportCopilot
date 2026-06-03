import React, { useState } from 'react';
import { PRESET_TICKETS, PresetTicket } from '@/lib/mockData';
import { ActionLog } from '@/lib/types';
import { Sparkles, Trash2, History, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface LeftPanelProps {
  ticketText: string;
  setTicketText: (text: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  isLoading: boolean;
  actionLogs: ActionLog[];
  selectedPresetId: string | null;
  setSelectedPresetId: (id: string | null) => void;
  onViewFullHistory?: () => void;
  onLogClick?: (log: ActionLog) => void;
}

export default function LeftPanel({
  ticketText,
  setTicketText,
  onSubmit,
  onClear,
  isLoading,
  actionLogs,
  selectedPresetId,
  setSelectedPresetId,
  onViewFullHistory,
  onLogClick,
}: LeftPanelProps) {
  
  const [filter, setFilter] = useState<'All' | 'Accepted' | 'Escalated' | 'Edited' | 'Rejected'>('All');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTicketText(e.target.value);
    if (selectedPresetId) {
      setSelectedPresetId(null); // Deselect preset if user edits text
    }
  };

  const handleSelectPreset = (preset: PresetTicket) => {
    setTicketText(preset.text);
    setSelectedPresetId(preset.id);
  };

  const filteredLogs = actionLogs.filter(log => {
    if (filter === 'All') return true;
    return log.outcomeStatus === filter;
  });

  const charLimit = 2000;

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 p-6 gap-6 overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Customer Ticket</h2>
        <p className="text-xs text-slate-500 mt-1">
          Input incoming support requests for real-time AI copilot analysis.
        </p>
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        {/* Text Area */}
        <div className="relative flex flex-col min-h-[220px] flex-grow">
          <textarea
            className="w-full h-full p-4 border border-slate-200 rounded-xl bg-slate-50/50 text-sm leading-relaxed text-slate-800 resize-none focus:outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-500/10 transition-all duration-150"
            placeholder="Paste or type customer support email, chat transcript, or issue description here... (e.g. 'My laptop battery drains within 30 minutes...')"
            value={ticketText}
            onChange={handleTextChange}
            maxLength={charLimit}
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3 text-[10px] font-semibold text-slate-400 select-none">
            {ticketText.length} / {charLimit}
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-slate-500">
            Or Select a Sample Ticket:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_TICKETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-[11px] font-medium px-2.5 py-1.5 rounded-full border transition-all duration-150 cursor-pointer ${
                  selectedPresetId === preset.id
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                }`}
                title={preset.brief}
                disabled={isLoading}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons Row */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            onClick={onClear}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-200 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !ticketText}
            type="button"
          >
            <Trash2 size={15} />
            Clear
          </button>
          <button
            onClick={onSubmit}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:translate-y-[1px] transition-all shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isLoading || !ticketText.trim()}
            type="button"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles size={15} />
            )}
            Analyze Ticket
          </button>
        </div>
      </div>

      {/* Session Audit History Log */}
      <div className="border-t border-slate-100 pt-5 mt-auto flex flex-col gap-3 min-h-[220px] max-h-[360px] overflow-hidden">
        <div className="flex justify-between items-center select-none">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase flex items-center gap-1.5">
            <History size={13} />
            Session Log
          </span>
          <div className="flex items-center gap-2">
            {onViewFullHistory && actionLogs.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewFullHistory();
                }}
                className="flex items-center gap-0.5 text-[9px] font-extrabold text-indigo-650 hover:underline cursor-pointer bg-indigo-50/50 px-1.5 py-0.5 rounded border border-indigo-100/30"
                title="View full operations dashboard"
                type="button"
              >
                <ExternalLink size={10} />
                Full View
              </button>
            )}
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
              {actionLogs.length}
            </span>
          </div>
        </div>

        {/* Compact Filters */}
        {actionLogs.length > 0 && (
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none select-none">
            {(['All', 'Accepted', 'Escalated', 'Edited', 'Rejected'] as const).map((status) => {
              const count = status === 'All' 
                ? actionLogs.length 
                : actionLogs.filter(l => l.outcomeStatus === status).length;
              return (
                <button
                  key={status}
                  onClick={() => {
                    setFilter(status);
                    setExpandedLogId(null);
                  }}
                  className={`text-[9px] font-extrabold px-2.5 py-1 rounded-md border transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                    filter === status
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-650'
                      : 'bg-white border-slate-200 text-slate-550 hover:bg-slate-50'
                  }`}
                  type="button"
                >
                  {status} ({count})
                </button>
              );
            })}
          </div>
        )}
        
        <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-grow">
          {actionLogs.length === 0 ? (
            <div className="flex items-center justify-center text-[11px] text-slate-400 py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
              No actions logged in this session.
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center text-[11px] text-slate-400 py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
              No records match filter.
            </div>
          ) : (
            filteredLogs.map((log) => {
              return (
                <div
                  key={log.id}
                  onClick={() => onLogClick?.(log)}
                  className="flex flex-col gap-1.5 p-3 rounded-xl border border-slate-200 bg-slate-55/40 hover:bg-white hover:border-indigo-300 hover:shadow-2xs transition-all duration-150 text-[11px] cursor-pointer group"
                >
                  <div className="flex justify-between items-center select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-700 text-[10px] group-hover:text-indigo-600 transition-colors">
                        {log.analysisId}
                      </span>
                      <ExternalLink size={10} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-150" />
                    </div>
                    <span
                      className={`px-2 py-0.5 font-bold rounded-full text-[9px] border ${
                        log.outcomeStatus === 'Accepted'
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                          : log.outcomeStatus === 'Edited'
                          ? 'bg-sky-50 border-sky-100 text-sky-600'
                          : log.outcomeStatus === 'Escalated'
                          ? 'bg-amber-50 border-amber-100 text-amber-600'
                          : 'bg-rose-50 border-rose-100 text-rose-600'
                      }`}
                    >
                      {log.outcomeStatus}
                    </span>
                  </div>
                  
                  <p className="font-bold text-slate-800 leading-snug truncate" title={log.ticketSummary}>
                    {log.ticketSummary}
                  </p>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] text-slate-400 border-t border-slate-100 pt-1.5 font-medium select-none">
                    <div className="truncate">
                      Cat: <span className="font-bold text-slate-700">{log.category}</span>
                    </div>
                    <div className="truncate">
                      Urgency: <span className="font-bold text-slate-700">{log.priority}</span>
                    </div>
                    <div className="col-span-2 truncate">
                      Rec: <span className="font-bold text-slate-700">{log.escalation}</span>
                    </div>
                    <div className="col-span-2 truncate">
                      Action: <span className="font-bold text-slate-700">{log.agentAction}</span>
                    </div>
                  </div>

                  <div className="text-[8px] font-semibold text-slate-400 text-right mt-1 select-none">
                    {log.timestamp}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
