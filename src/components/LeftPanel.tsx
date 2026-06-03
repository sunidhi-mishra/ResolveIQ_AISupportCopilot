import React from 'react';
import { PRESET_TICKETS, PresetTicket } from '@/lib/mockData';
import { ActionLog } from '@/lib/types';
import { Sparkles, Trash2, History } from 'lucide-react';

interface LeftPanelProps {
  ticketText: string;
  setTicketText: (text: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  isLoading: boolean;
  actionLogs: ActionLog[];
  selectedPresetId: string | null;
  setSelectedPresetId: (id: string | null) => void;
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
}: LeftPanelProps) {
  
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
      <div className="border-t border-slate-100 pt-5 mt-auto flex flex-col gap-3 min-h-[160px] max-h-[220px]">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase flex items-center gap-1.5">
            <History size={13} />
            Session Log
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
            {actionLogs.length}
          </span>
        </div>
        
        <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-grow">
          {actionLogs.length === 0 ? (
            <div className="flex items-center justify-center text-[11px] text-slate-400 py-6 border border-dashed border-slate-200 rounded-lg">
              No actions logged in this session.
            </div>
          ) : (
            actionLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-2.5 rounded-lg border bg-slate-50 border-slate-200 hover:bg-white transition-all text-[11px]"
              >
                <div className="flex flex-col gap-0.5 max-w-[70%]">
                  <span className="font-semibold text-slate-700 truncate" title={log.ticketText}>
                    {log.ticketText}
                  </span>
                  <span className="text-[9px] text-slate-400">{log.timestamp}</span>
                </div>
                <span
                  className={`px-2 py-0.5 font-bold rounded-full text-[9px] capitalize ${
                    log.action === 'Accept Recommendation'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : log.action === 'Escalate Ticket'
                      ? 'bg-amber-50 text-amber-600 border border-amber-100'
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}
                >
                  {log.action === 'Accept Recommendation' ? 'accepted' : log.action === 'Escalate Ticket' ? 'escalated' : 'edited'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
