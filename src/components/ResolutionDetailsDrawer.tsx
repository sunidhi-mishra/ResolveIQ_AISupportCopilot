import React from 'react';
import { ActionLog } from '@/lib/types';
import {
  X,
  Clock,
  Sparkles,
  User,
  Heart,
  AlertTriangle,
  FolderOpen,
  ArrowUpRight,
  Clipboard,
  Shield,
  FileText
} from 'lucide-react';

interface ResolutionDetailsDrawerProps {
  log: ActionLog | null;
  onClose: () => void;
}

export default function ResolutionDetailsDrawer({ log, onClose }: ResolutionDetailsDrawerProps) {
  if (!log) return null;

  // Outcome status visual themes
  const getStatusTheme = (status: ActionLog['outcomeStatus']) => {
    switch (status) {
      case 'Accepted':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          dot: 'bg-emerald-500',
        };
      case 'Escalated':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          dot: 'bg-amber-500',
        };
      case 'Edited':
        return {
          bg: 'bg-sky-50 border-sky-200 text-sky-700',
          dot: 'bg-sky-500',
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          dot: 'bg-rose-500',
        };
    }
  };

  const getPriorityTheme = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'Medium':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'Low':
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getSentimentTheme = (sentiment: string) => {
    switch (sentiment) {
      case 'Angry':
        return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'Frustrated':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'Satisfied':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'Neutral':
      default:
        return 'bg-slate-55/35 border-slate-200 text-slate-700';
    }
  };

  const statusTheme = getStatusTheme(log.outcomeStatus);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden select-none">
      
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md md:max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col h-full z-10 animate-slide-in-right">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-black tracking-wider uppercase bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 border border-slate-200">
              AUDIT RECORD
            </span>
            <h2 className="text-sm font-extrabold text-slate-800">
              Analysis ID: {log.analysisId}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
            type="button"
            aria-label="Close Audit Details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          {/* Section: Outcome Status Card */}
          <div className="p-4.5 rounded-2xl border border-slate-200 bg-slate-55/15 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider">Outcome Status</span>
              <span className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-2xs ${statusTheme.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusTheme.dot}`} />
                {log.outcomeStatus}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs mt-1 border-t border-slate-200/60 pt-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <User size={10} />
                  Agent Action
                </span>
                <span className="font-extrabold text-slate-850">{log.agentAction}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Clock size={10} />
                  Logged At
                </span>
                <span className="font-bold text-slate-700">{log.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Section: Original Customer Ticket */}
          <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={11} className="text-slate-400" />
              Original Customer Ticket
            </h3>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-h-[160px] overflow-y-auto whitespace-pre-wrap text-xs text-slate-700 leading-relaxed font-medium">
              {log.customerIssue || "No ticket content recorded."}
            </div>
          </div>

          {/* Section: AI Summarization */}
          <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={11} className="text-indigo-400" />
              AI Issues Summary
            </h3>
            <div className="p-4 bg-indigo-50/5 border border-indigo-100/30 rounded-xl text-xs text-slate-750 leading-relaxed font-semibold">
              {log.ticketSummary || "No issue summary logged."}
            </div>
          </div>

          {/* Section: Decision Classifications Grid */}
          <div className="grid grid-cols-3 gap-3">
            
            {/* Category */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex flex-col gap-1.5 select-none">
              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FolderOpen size={9} />
                Category
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-center truncate">
                {log.category}
              </span>
            </div>

            {/* Urgency */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex flex-col gap-1.5 select-none">
              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle size={9} />
                Priority
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border text-center truncate ${getPriorityTheme(log.priority)}`}>
                {log.priority}
              </span>
            </div>

            {/* Sentiment */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex flex-col gap-1.5 select-none">
              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Heart size={9} />
                Sentiment
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border text-center truncate ${getSentimentTheme(log.sentiment)}`}>
                {log.sentiment}
              </span>
            </div>

          </div>

          {/* Section: AI Suggested Response */}
          <div className="flex flex-col gap-2 relative">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={11} className="text-indigo-400" />
                AI Suggested Response
              </h3>
              {log.aiRecommendation && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(log.aiRecommendation);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer border border-indigo-100"
                  type="button"
                >
                  <Clipboard size={10} />
                  Copy Reply
                </button>
              )}
            </div>
            <div className="p-4 bg-indigo-50/10 border border-indigo-100/40 rounded-xl max-h-[180px] overflow-y-auto whitespace-pre-wrap text-xs text-slate-700 leading-relaxed font-semibold">
              {log.aiRecommendation || "No recommendation text recorded."}
            </div>
          </div>

          {/* Section: Escalation Routing details */}
          <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={11} className="text-slate-400" />
              Escalation Recommendation
            </h3>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed font-medium">
              <div className="font-bold text-slate-800 text-xs mb-1">
                Recommendation: <span className="text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 text-[11px] ml-1 font-extrabold">{log.escalation}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-100 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-250 hover:bg-slate-100 rounded-xl font-bold text-xs text-slate-600 transition-colors cursor-pointer"
            type="button"
          >
            Close Audit Log
          </button>
        </div>

      </div>

    </div>
  );
}
