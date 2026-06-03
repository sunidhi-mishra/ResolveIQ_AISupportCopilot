import React, { useRef, useEffect } from 'react';
import { AnalysisResponse, TicketCategory, TicketPriority, TicketSentiment } from '@/lib/types';
import { Info, LayoutGrid, AlertTriangle, MessageSquare, Copy, Check, FileText, Smile, Brain } from 'lucide-react';

interface MiddlePanelProps {
  isLoading: boolean;
  analysisResult: AnalysisResponse | null;
  activeTone: 'empathy' | 'professional' | 'concise';
  setActiveTone: (tone: 'empathy' | 'professional' | 'concise') => void;
  suggestedResponseText: string;
  setSuggestedResponseText: (text: string) => void;
  isEditingResponse: boolean;
  onCopyResponse: () => void;
  isCopied: boolean;
}

export default function MiddlePanel({
  isLoading,
  analysisResult,
  activeTone,
  setActiveTone,
  suggestedResponseText,
  setSuggestedResponseText,
  isEditingResponse,
  onCopyResponse,
  isCopied,
}: MiddlePanelProps) {
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea height on editing
  useEffect(() => {
    if (isEditingResponse && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditingResponse, suggestedResponseText]);

  // Render Category Badge Styling
  const getCategoryStyles = (cat: TicketCategory) => {
    switch (cat) {
      case 'Hardware Support':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Software Support':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Account Access':
        return 'bg-sky-50 text-sky-600 border-sky-100';
      case 'Payment Issue':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Delivery Issue':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  // Render Priority Badge Styling
  const getPriorityStyles = (prio: TicketPriority) => {
    switch (prio) {
      case 'Low':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'Medium':
        return 'bg-blue-50 text-blue-600 border-blue-150';
      case 'High':
        return 'bg-rose-50 text-rose-600 border-rose-150 pulse-critical';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  // Render Sentiment Badge Styling
  const getSentimentStyles = (sent: TicketSentiment) => {
    switch (sent) {
      case 'Satisfied':
        return 'bg-emerald-50 text-emerald-600 border-emerald-150';
      case 'Frustrated':
        return 'bg-amber-50 text-amber-600 border-amber-150';
      case 'Angry':
        return 'bg-rose-50 text-rose-600 border-rose-150 pulse-critical';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  // 1. Loading Skeleton Screen
  if (isLoading) {
    return (
      <div className="flex flex-col h-full p-6 gap-5 overflow-y-auto">
        {/* Summary Skeleton */}
        <div className="relative overflow-hidden w-full h-[110px] bg-white border border-slate-200 rounded-2xl p-5 shimmer">
          <div className="w-24 h-4 bg-slate-100 rounded-full mb-4" />
          <div className="w-full h-3 bg-slate-100 rounded-full mb-2" />
          <div className="w-3/4 h-3 bg-slate-100 rounded-full" />
        </div>

        {/* Reasoning Skeleton */}
        <div className="relative overflow-hidden w-full h-[140px] bg-white border border-slate-200 rounded-2xl p-5 shimmer">
          <div className="w-32 h-4 bg-slate-100 rounded-full mb-4" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-14 bg-slate-100/60 rounded-xl" />
            <div className="h-14 bg-slate-100/60 rounded-xl" />
            <div className="h-14 bg-slate-100/60 rounded-xl" />
          </div>
        </div>

        {/* Classifications Skeleton */}
        <div className="grid grid-cols-3 gap-4">
          <div className="relative overflow-hidden h-[120px] bg-white border border-slate-200 rounded-2xl p-5 shimmer">
            <div className="w-16 h-3 bg-slate-100 rounded-full mb-5" />
            <div className="w-24 h-7 bg-slate-100 rounded-full" />
          </div>
          <div className="relative overflow-hidden h-[120px] bg-white border border-slate-200 rounded-2xl p-5 shimmer">
            <div className="w-16 h-3 bg-slate-100 rounded-full mb-5" />
            <div className="w-24 h-7 bg-slate-100 rounded-full" />
          </div>
          <div className="relative overflow-hidden h-[120px] bg-white border border-slate-200 rounded-2xl p-5 shimmer">
            <div className="w-16 h-3 bg-slate-100 rounded-full mb-5" />
            <div className="w-24 h-7 bg-slate-100 rounded-full" />
          </div>
        </div>

        {/* Response Skeleton */}
        <div className="relative overflow-hidden flex-grow min-h-[240px] bg-white border border-slate-200 rounded-2xl p-5 shimmer">
          <div className="w-32 h-4 bg-slate-100 rounded-full mb-5" />
          <div className="w-full h-3 bg-slate-100 rounded-full mb-3" />
          <div className="w-full h-3 bg-slate-100 rounded-full mb-3" />
          <div className="w-2/3 h-3 bg-slate-100 rounded-full" />
        </div>
      </div>
    );
  }

  // 2. Empty State
  if (!analysisResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-4 border border-slate-200">
          <Info size={22} />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Awaiting Ticket Input</h3>
        <p className="text-xs text-slate-400 max-w-[280px] mt-1.5 leading-relaxed">
          Submit customer ticket text on the left to trigger AI Copilot analysis and draft response.
        </p>
      </div>
    );
  }

  // 3. Analysis Card Display
  return (
    <div className="flex flex-col h-full p-6 gap-5 overflow-y-auto animate-fadeIn select-none">
      
      {/* AI Summary Card */}
      <div 
        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all duration-200 animate-fade-in-up"
        style={{ animationDelay: '0ms' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-slate-500" />
          <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
            AI Summary
          </h3>
        </div>
        <p className="text-sm font-semibold leading-relaxed text-slate-800">
          {analysisResult.summary}
        </p>
        <p className="text-[10px] font-medium text-slate-400 mt-2 italic select-none">
          AI-generated concise summary • 2-3 sentences max
        </p>
      </div>

      {/* AI Reasoning Panel */}
      <div 
        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all duration-200 animate-fade-in-up"
        style={{ animationDelay: '50ms' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain size={16} className="text-indigo-500 animate-pulse" />
          <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
            AI Reasoning & Rationale
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Category Rationale Card */}
          <div className="bg-slate-50/70 border border-slate-200/50 p-3 rounded-xl flex flex-col gap-1 hover:bg-slate-50 hover:border-slate-200 transition-all">
            <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider select-none">
              Category Reason
            </span>
            <p className="text-[11px] leading-relaxed text-slate-500 font-medium select-text">
              {analysisResult.categoryReason}
            </p>
          </div>

          {/* Priority Rationale Card */}
          <div className="bg-slate-50/70 border border-slate-200/50 p-3 rounded-xl flex flex-col gap-1 hover:bg-slate-50 hover:border-slate-200 transition-all">
            <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider select-none">
              Priority Reason
            </span>
            <p className="text-[11px] leading-relaxed text-slate-500 font-medium select-text">
              {analysisResult.priorityReason}
            </p>
          </div>

          {/* Sentiment Rationale Card */}
          <div className="bg-slate-50/70 border border-slate-200/50 p-3 rounded-xl flex flex-col gap-1 hover:bg-slate-50 hover:border-slate-200 transition-all">
            <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider select-none">
              Sentiment Reason
            </span>
            <p className="text-[11px] leading-relaxed text-slate-500 font-medium select-text">
              {analysisResult.sentimentReason}
            </p>
          </div>
        </div>
      </div>

      {/* Classification Grid (Category, Priority, Sentiment tags) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Category Card */}
        <div 
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all duration-200 animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          <div className="flex items-center gap-2 mb-3.5">
            <LayoutGrid size={16} className="text-slate-500" />
            <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Category
            </h3>
          </div>
          <div className="flex flex-col gap-1 items-start">
            <span className="text-[10px] text-slate-400 font-semibold uppercase select-none">Classification</span>
            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border mt-1 select-all ${getCategoryStyles(analysisResult.category)}`}>
              {analysisResult.category}
            </span>
          </div>
        </div>

        {/* Priority Card */}
        <div 
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all duration-200 animate-fade-in-up"
          style={{ animationDelay: '150ms' }}
        >
          <div className="flex items-center gap-2 mb-3.5">
            <AlertTriangle size={16} className="text-slate-500" />
            <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Priority
            </h3>
          </div>
          <div className="flex flex-col gap-1 items-start">
            <span className="text-[10px] text-slate-400 font-semibold uppercase select-none">Urgency Level</span>
            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border mt-1 select-all ${getPriorityStyles(analysisResult.priority)}`}>
              {analysisResult.priority}
            </span>
          </div>
        </div>

        {/* Sentiment Card */}
        <div 
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all duration-200 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex items-center gap-2 mb-3.5">
            <Smile size={16} className="text-slate-500" />
            <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Sentiment
            </h3>
          </div>
          <div className="flex flex-col gap-1 items-start">
            <span className="text-[10px] text-slate-400 font-semibold uppercase select-none">Customer Mood</span>
            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border mt-1 select-all ${getSentimentStyles(analysisResult.sentiment)}`}>
              {analysisResult.sentiment}
            </span>
          </div>
        </div>

      </div>

      {/* Suggested Response Card */}
      <div 
        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all duration-200 flex-grow flex flex-col min-h-[260px] animate-fade-in-up"
        style={{ animationDelay: '250ms' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-slate-500" />
            <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Suggested Response
            </h3>
          </div>
          <button
            onClick={onCopyResponse}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-150 cursor-pointer ${
              isCopied
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            type="button"
          >
            {isCopied ? <Check size={13} /> : <Copy size={13} />}
            {isCopied ? 'Copied!' : 'Copy Response'}
          </button>
        </div>

        {/* Tone Selector */}
        <div className="flex items-center justify-between bg-slate-50 p-1 border border-slate-200 rounded-lg mb-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase pl-2 select-none">Tone Adjuster:</span>
          <div className="flex gap-1">
            {(['empathy', 'professional', 'concise'] as const).map((tone) => (
              <button
                key={tone}
                onClick={() => setActiveTone(tone)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md capitalize transition-all duration-150 cursor-pointer ${
                  activeTone === tone
                    ? 'bg-white text-indigo-600 border border-slate-200 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                disabled={isEditingResponse}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area (Scrollable) */}
        <div className={`relative flex-grow border border-slate-200 rounded-xl bg-slate-50/50 p-4 overflow-y-auto max-h-[180px] transition-all duration-150 ${
          isEditingResponse ? 'border-indigo-500 bg-white ring-3 ring-indigo-500/10' : ''
        }`}>
          {isEditingResponse ? (
            <textarea
              ref={textareaRef}
              className="w-full bg-transparent text-sm leading-relaxed text-slate-800 focus:outline-hidden resize-none"
              value={suggestedResponseText}
              onChange={(e) => setSuggestedResponseText(e.target.value)}
            />
          ) : (
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap select-text">
              {suggestedResponseText}
            </p>
          )}
          <div className="absolute bottom-2 right-3 text-[9px] text-slate-400 font-semibold select-none bg-white px-1.5 py-0.5 rounded border border-slate-200">
            {suggestedResponseText.length} chars
          </div>
        </div>
      </div>

    </div>
  );
}
