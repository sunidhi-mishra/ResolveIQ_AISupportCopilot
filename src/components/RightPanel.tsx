import React from 'react';
import { AnalysisResponse, EscalationType } from '@/lib/types';
import { Shield, Sparkles, AlertCircle, ArrowUpRight, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';

interface RightPanelProps {
  isLoading: boolean;
  analysisResult: AnalysisResponse | null;
  onAccept: () => void;
  onEscalateTrigger: () => void;
  onEditToggle: () => void;
  isEditingResponse: boolean;
  lastAgentAction: string | null;
}

export default function RightPanel({
  isLoading,
  analysisResult,
  onAccept,
  onEscalateTrigger,
  onEditToggle,
  isEditingResponse,
  lastAgentAction,
}: RightPanelProps) {

  // helper for progress bar colors
  const getBarColor = (score: number) => {
    if (score >= 90) return '#10b981'; // Emerald
    if (score >= 80) return '#6366f1'; // Indigo
    return '#f59e0b'; // Amber
  };

  // 1. Loading Skeleton Screen
  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white border-l border-slate-200 p-6 gap-6 overflow-y-auto">
        
        {/* Confidence Breakdown Skeleton */}
        <div className="relative overflow-hidden w-full h-[350px] bg-white border border-slate-200 rounded-2xl p-5 shimmer">
          <div className="w-32 h-3.5 bg-slate-100 rounded-full mb-6" />
          <div className="w-[80px] h-[80px] bg-slate-100 rounded-full mx-auto mb-6" />
          <div className="flex flex-col gap-3.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <div className="w-24 h-2.5 bg-slate-100 rounded" />
                  <div className="w-8 h-2.5 bg-slate-100 rounded" />
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Escalation Skeleton */}
        <div className="relative overflow-hidden w-full h-[120px] bg-white border border-slate-200 rounded-2xl p-5 shimmer">
          <div className="w-40 h-3.5 bg-slate-100 rounded-full mb-4" />
          <div className="w-full h-3 bg-slate-100 rounded-full mb-2" />
          <div className="w-2/3 h-3 bg-slate-100 rounded-full" />
        </div>

        {/* Actions Skeleton */}
        <div className="relative overflow-hidden w-full h-[190px] bg-white border border-slate-200 rounded-2xl p-5 shimmer">
          <div className="w-28 h-3.5 bg-slate-100 rounded-full mb-6" />
          <div className="w-full h-10 bg-slate-150 rounded-xl mb-3" />
          <div className="w-full h-10 bg-slate-150 rounded-xl" />
        </div>
      </div>
    );
  }

  // 2. Empty State
  if (!analysisResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-4 border border-slate-200">
          <Shield size={22} />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Copilot Offline</h3>
        <p className="text-xs text-slate-400 max-w-[280px] mt-1.5 leading-relaxed">
          Recommendations and operational controls will activate once ticket text has been submitted.
        </p>
      </div>
    );
  }

  // Calculate overall average confidence score
  const overallConfidence = Math.round(
    (analysisResult.categoryConfidence +
      analysisResult.priorityConfidence +
      analysisResult.sentimentConfidence +
      analysisResult.responseConfidence) /
      4
  );

  // Render Escalation Details styling
  const getEscalationStyle = (esc: EscalationType) => {
    switch (esc) {
      case 'No Escalation Required':
        return {
          icon: <CheckCircle2 className="text-emerald-500" size={20} />,
          bgColor: 'bg-emerald-50/50 border-emerald-100',
          textColor: 'text-slate-800',
          badgeColor: 'bg-emerald-100 text-emerald-800'
        };
      case 'Escalate to Tier 2':
        return {
          icon: <UserCheck className="text-amber-500" size={20} />,
          bgColor: 'bg-amber-50/50 border-amber-100',
          textColor: 'text-slate-800',
          badgeColor: 'bg-amber-100 text-amber-800'
        };
      case 'Escalate to Specialist Team':
        return {
          icon: <ShieldAlert className="text-rose-500" size={20} />,
          bgColor: 'bg-rose-50/50 border-rose-100',
          textColor: 'text-slate-800',
          badgeColor: 'bg-rose-100 text-rose-800'
        };
      default:
        return {
          icon: <AlertCircle className="text-slate-500" size={20} />,
          bgColor: 'bg-slate-50 border-slate-100',
          textColor: 'text-slate-800',
          badgeColor: 'bg-slate-100 text-slate-800'
        };
    }
  };

  const escConfig = getEscalationStyle(analysisResult.escalation);

  const confidenceItems = [
    { label: 'Category Confidence', val: analysisResult.categoryConfidence },
    { label: 'Priority Confidence', val: analysisResult.priorityConfidence },
    { label: 'Sentiment Confidence', val: analysisResult.sentimentConfidence },
    { label: 'Response Confidence', val: analysisResult.responseConfidence },
  ];

  // SVG Progress circle parameters
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // ~282.74
  const strokeDashoffset = circumference - (overallConfidence / 100) * circumference;

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 p-6 gap-6 overflow-y-auto">
      
      {/* Confidence Score & Breakdown Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-350 transition-all duration-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-slate-500" />
          <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
            Confidence Score
          </h3>
        </div>

        {/* Radial SVG overall Match Ring */}
        <div className="flex items-center justify-center py-2 mb-2">
          <div className="relative w-28 h-28 flex items-center justify-center select-none">
            <svg width="112" height="112" className="progress-ring">
              <circle
                className="stroke-slate-100"
                strokeWidth="8"
                fill="transparent"
                cx="56"
                cy="56"
                r={radius}
              />
              <circle
                className="progress-ring-circle transition-all duration-500"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                cx="56"
                cy="56"
                r={radius}
                style={{
                  stroke: getBarColor(overallConfidence),
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-slate-800 leading-none">
                {overallConfidence}%
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                Match
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-4" />

        {/* Component progress bars list */}
        <div className="flex flex-col gap-3.5">
          {confidenceItems.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>{item.label}</span>
                <span className="font-bold text-slate-750 select-all">{item.val}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden select-none">
                <div
                  className="h-full rounded-full transition-all duration-600 ease-out"
                  style={{
                    width: `${item.val}%`,
                    backgroundColor: getBarColor(item.val),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation Recommendation Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-350 transition-all duration-200">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={16} className="text-slate-500" />
          <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
            Escalation Recommendation
          </h3>
        </div>
        
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${escConfig.bgColor}`}>
          <div className="mt-0.5 flex-shrink-0">
            {escConfig.icon}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-800">
              {analysisResult.escalation}
            </span>
            <p className="text-[11px] leading-relaxed text-slate-500 font-medium select-text">
              {analysisResult.escalationReason}
            </p>
          </div>
        </div>
      </div>

      {/* Agent Actions */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs flex-grow flex flex-col gap-4 mt-auto">
        <div>
          <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider select-none">
            Copilot Actions
          </h3>
        </div>

        <div className="flex flex-col gap-2.5 flex-grow">
          {/* Action 1: Accept Recommendation */}
          <button
            onClick={onAccept}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:translate-y-[0.5px] transition-all cursor-pointer shadow-sm shadow-emerald-100"
            type="button"
          >
            <CheckCircle2 size={14} />
            Accept Recommendation
          </button>

          {/* Action 2: Edit Response */}
          <button
            onClick={onEditToggle}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isEditingResponse
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
            type="button"
          >
            {isEditingResponse ? (
              <>
                <CheckCircle2 size={14} />
                Save Custom Changes
              </>
            ) : (
              <>
                <ArrowUpRight size={14} />
                Edit Response
              </>
            )}
          </button>

          {/* Action 3: Escalate Ticket */}
          <button
            onClick={onEscalateTrigger}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all cursor-pointer"
            type="button"
          >
            <ArrowUpRight size={14} />
            Escalate Ticket
          </button>
        </div>

        {/* Audit Status Display */}
        {lastAgentAction && (
          <div className="border-t border-slate-200/60 pt-3 mt-auto text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block select-none">
              Last Action Taken:
            </span>
            <span className="inline-block mt-1 px-2.5 py-0.5 text-[9px] font-extrabold rounded-md bg-indigo-50 text-indigo-600 border border-indigo-150 select-all">
              {lastAgentAction}
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
