import React, { useState } from 'react';
import { ActionLog } from '@/lib/types';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  XCircle,
  TrendingUp,
  Filter,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface ResolutionHistoryProps {
  actionLogs: ActionLog[];
  onClearLogs?: () => void;
  onLogClick: (log: ActionLog) => void;
}

export default function ResolutionHistory({ actionLogs, onClearLogs, onLogClick }: ResolutionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Accepted' | 'Escalated' | 'Edited' | 'Rejected'>('All');

  // 1. Calculate KPI Metrics
  const totalCount = actionLogs.length;
  const acceptedCount = actionLogs.filter(log => log.outcomeStatus === 'Accepted').length;
  const escalatedCount = actionLogs.filter(log => log.outcomeStatus === 'Escalated').length;
  const editedCount = actionLogs.filter(log => log.outcomeStatus === 'Edited').length;
  const rejectedCount = actionLogs.filter(log => log.outcomeStatus === 'Rejected').length;

  const getPercentage = (count: number) => {
    if (totalCount === 0) return '0%';
    return `${Math.round((count / totalCount) * 100)}%`;
  };

  // 2. Filter action logs
  const filteredLogs = actionLogs
    .filter(log => {
      // Filter by status
      if (selectedStatus !== 'All' && log.outcomeStatus !== selectedStatus) {
        return false;
      }
      // Filter by search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesId = log.analysisId.toLowerCase().includes(query);
        const matchesSummary = log.ticketSummary.toLowerCase().includes(query);
        const matchesIssue = log.customerIssue.toLowerCase().includes(query);
        const matchesRec = log.aiRecommendation.toLowerCase().includes(query);
        const matchesCategory = log.category.toLowerCase().includes(query);
        const matchesAction = log.agentAction.toLowerCase().includes(query);
        return matchesId || matchesSummary || matchesIssue || matchesRec || matchesCategory || matchesAction;
      }
      return true;
    });

  // Color mappings
  const getStatusStyle = (status: ActionLog['outcomeStatus']) => {
    switch (status) {
      case 'Accepted':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 size={13} className="text-emerald-500" />
        };
      case 'Escalated':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          dot: 'bg-amber-500',
          icon: <AlertTriangle size={13} className="text-amber-500" />
        };
      case 'Edited':
        return {
          bg: 'bg-sky-50 border-sky-200 text-sky-700',
          dot: 'bg-sky-500',
          icon: <Edit3 size={13} className="text-sky-500" />
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          dot: 'bg-rose-500',
          icon: <XCircle size={13} className="text-rose-500" />
        };
    }
  };

  const getPriorityBadge = (priority: string) => {
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

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50 p-6 md:p-8 gap-8">
      
      {/* 1. Header & Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            Resolution History Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Enterprise audit control log of completed support action resolutions.
          </p>
        </div>

        {onClearLogs && actionLogs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="self-start md:self-auto px-4 py-2 border border-slate-200 hover:border-rose-200 hover:text-rose-600 rounded-xl bg-white text-xs font-semibold text-slate-600 transition-all cursor-pointer"
          >
            Clear Session Audit Logs
          </button>
        )}
      </div>

      {/* 2. Operations Metrics Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric: Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[110px] relative overflow-hidden group hover:border-indigo-300 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Actions</span>
            <TrendingUp size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-2xl font-extrabold text-slate-800">{totalCount}</span>
            <span className="text-[10px] text-slate-400 font-semibold">Logged</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200" />
        </div>

        {/* Metric: Accepted */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[110px] relative overflow-hidden group hover:border-emerald-300 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Accepted Rate</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-2xl font-extrabold text-emerald-600">{getPercentage(acceptedCount)}</span>
            <span className="text-[10px] text-slate-400 font-semibold">{acceptedCount} tickets</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Metric: Escalated */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[110px] relative overflow-hidden group hover:border-amber-300 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Escalation Rate</span>
            <AlertTriangle size={16} className="text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-2xl font-extrabold text-amber-600">{getPercentage(escalatedCount)}</span>
            <span className="text-[10px] text-slate-400 font-semibold">{escalatedCount} tickets</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
        </div>

        {/* Metric: Edited */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[110px] relative overflow-hidden group hover:border-sky-300 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Edited Rate</span>
            <Edit3 size={16} className="text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-2xl font-extrabold text-sky-600">{getPercentage(editedCount)}</span>
            <span className="text-[10px] text-slate-400 font-semibold">{editedCount} tickets</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500" />
        </div>

        {/* Metric: Rejected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[110px] relative overflow-hidden group hover:border-rose-300 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rejection Rate</span>
            <XCircle size={16} className="text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-2xl font-extrabold text-rose-600">{getPercentage(rejectedCount)}</span>
            <span className="text-[10px] text-slate-400 font-semibold">{rejectedCount} tickets</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500" />
        </div>

      </div>

      {/* 3. Filter Controls & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Search by ID, summary, issue, action or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-55/30 focus:outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-500/5 transition-all text-slate-700 font-medium"
          />
        </div>

        {/* Chips Filters & Expand/Collapse All */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedStatus('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === 'All'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({totalCount})
            </button>
            
            <button
              onClick={() => setSelectedStatus('Accepted')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === 'Accepted'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Accepted ({acceptedCount})
            </button>

            <button
              onClick={() => setSelectedStatus('Escalated')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === 'Escalated'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-500 hover:text-amber-600'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Escalated ({escalatedCount})
            </button>

            <button
              onClick={() => setSelectedStatus('Edited')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === 'Edited'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-500 hover:text-sky-600'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-sky-505 bg-sky-500" />
              Edited ({editedCount})
            </button>

            <button
              onClick={() => setSelectedStatus('Rejected')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === 'Rejected'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-500 hover:text-rose-600'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>
      </div>

      {/* 4. Log Cards / Rows (Reverse Chronological Order) */}
      <div className="flex flex-col gap-4 flex-grow">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-slate-200 rounded-2xl bg-white text-center">
            <Filter className="text-slate-300 w-10 h-10 mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No Action Records Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
              {actionLogs.length === 0
                ? "Go to the AI Copilot tab, submit a ticket, and perform an action to generate audit logs."
                : "No logs match the current search query or status filter selection."}
            </p>
            {searchTerm.trim() !== '' || selectedStatus !== 'All' ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('All');
                }}
                className="mt-4 px-3.5 py-1.5 bg-indigo-650 bg-indigo-650/10 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-semibold text-indigo-650 cursor-pointer transition-all"
              >
                Clear Search & Filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredLogs.map((log) => {
              const statusStyle = getStatusStyle(log.outcomeStatus);

              return (
                <div
                  key={log.id}
                  onClick={() => onLogClick(log)}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs transition-all duration-200 overflow-hidden cursor-pointer group flex flex-col lg:flex-row lg:items-center justify-between p-5 gap-4 select-none"
                >
                  
                  {/* Identification & Summary */}
                  <div className="flex-grow flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {statusStyle.icon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-[11px] font-extrabold text-slate-750 bg-slate-105 bg-slate-100 px-2 py-0.5 rounded-md group-hover:text-indigo-600 transition-colors">
                          {log.analysisId}
                        </span>
                        <span className="text-xs font-bold text-slate-800 leading-tight">
                          {log.ticketSummary}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[10px] text-slate-450 mt-0.5">
                        <span className="flex items-center gap-1 font-semibold">
                          <Clock size={11} />
                          {log.timestamp}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-slate-500">
                          Action: <strong className="text-slate-700">{log.agentAction}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Badges & Detail Trigger */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 flex-shrink-0">
                    
                    <div className="flex items-center gap-2">
                      {/* Category Badge */}
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {log.category}
                      </span>

                      {/* Priority Badge */}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(log.priority)}`}>
                        {log.priority}
                      </span>

                      {/* Outcome Badge */}
                      <span className={`flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-2xs ${statusStyle.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {log.outcomeStatus}
                      </span>
                    </div>

                    {/* View Details Action Indicator */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-slate-50 group-hover:text-indigo-600 transition-all duration-200">
                      <ArrowUpRight size={15} />
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
