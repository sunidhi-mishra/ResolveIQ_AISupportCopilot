'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LeftPanel from '@/components/LeftPanel';
import MiddlePanel from '@/components/MiddlePanel';
import RightPanel from '@/components/RightPanel';
import ResolutionHistory from '@/components/ResolutionHistory';
import { AnalysisResponse, ActionLog, TicketCategory, TicketPriority, EscalationType } from '@/lib/types';
import { INITIAL_ACTION_LOGS } from '@/lib/mockData';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Main Dashboard States
  const [ticketText, setTicketText] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  // Analysis ID State Tracking
  const [nextAnalysisId, setNextAnalysisId] = useState(125);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);

  // Suggested Response Editing / Tone States
  const [activeTone, setActiveTone] = useState<'empathy' | 'professional' | 'concise'>('empathy');
  const [responseVariations, setResponseVariations] = useState<{
    empathy: string;
    professional: string;
    concise: string;
  } | null>(null);
  const [suggestedResponseText, setSuggestedResponseText] = useState('');
  const [isEditingResponse, setIsEditingResponse] = useState(false);

  // Active Tab state (AI Copilot vs Resolution History Dashboard)
  const [activeTab, setActiveTab] = useState<'copilot' | 'history'>('copilot');

  // Operational Audits / History
  const [lastAgentAction, setLastAgentAction] = useState<string | null>(null);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>(INITIAL_ACTION_LOGS);

  // Toast Queue
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Escalation Modal States
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [escalateDept, setEscalateDept] = useState('tier2');
  const [escalatePriority, setEscalatePriority] = useState('high');
  const [escalateNotes, setEscalateNotes] = useState('');

  // 1. Toast triggers
  const addToast = (title: string, message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to get formatted timestamp YYYY-MM-DD HH:mm
  const getFormattedTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // 2. Fetch Analysis Action
  const handleAnalyzeTicket = async () => {
    if (!ticketText.trim()) {
      addToast('Validation Error', 'Please enter a ticket description first.', 'warning');
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setResponseVariations(null);
    setSuggestedResponseText('');
    setIsEditingResponse(false);

    try {
      const response = await fetch('/api/analyze-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketText }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze ticket');
      }

      const data: AnalysisResponse = await response.json();
      
      // Calculate simple tone variations dynamically
      const variations = generateToneVariations(data.suggestedResponse, data.category);
      setResponseVariations(variations);
      
      // Generate unique analysis ID sequentially
      const currentId = `#${nextAnalysisId}`;
      setActiveAnalysisId(currentId);
      setNextAnalysisId(prev => prev + 1);

      // Bind data
      setAnalysisResult(data);
      setSuggestedResponseText(variations.empathy);
      setActiveTone('empathy');
      
      addToast('Analysis Loaded', `AI recommendations loaded under ID: ${currentId}.`, 'success');
    } catch (error) {
      console.error('Error analyzing ticket:', error);
      addToast('API Error', 'Failed to communicate with analysis server.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to generate variations in client for dynamic tone switching
  const generateToneVariations = (base: string, category: TicketCategory) => {
    // Concise
    let conciseText = base;
    const lines = base.split('\n').filter(l => l.trim().length > 0);
    if (lines.length > 1) {
      const coreLines = lines.filter(l => !l.startsWith('Dear') && !l.startsWith('Hi') && !l.startsWith('Hello') && !l.startsWith('Thank') && !l.startsWith('Sincerely') && !l.startsWith('Best') && !l.includes('patience'));
      if (coreLines.length > 0) {
        conciseText = `Regarding the issue: ${coreLines[0]}\n\nWe have initiated investigation. Updates will follow shortly.`;
      } else {
        conciseText = lines.slice(0, 2).join('\n');
      }
    }

    // Professional (more formal syntax)
    let professionalText = base
      .replace(/Hi|Hello|Hey/g, 'Dear Customer')
      .replace(/sorry|apologize/g, 'sincerely regret the inconvenience')
      .replace(/get back to you|let you know/g, 'provide formal correspondence');
    
    if (!professionalText.includes('Sincerely')) {
      professionalText += '\n\nSincerely,\nResolveIQ Agent Team';
    }

    // Empathy (polite, gentle)
    let empathyText = base;
    if (!base.toLowerCase().includes('sorry') && !base.toLowerCase().includes('apologize') && category !== 'General Inquiry') {
      empathyText = `Hello,\n\nI understand your concern and am very sorry for any inconvenience caused. Let's work together to resolve this.\n\n${base}`;
    }

    return {
      empathy: empathyText,
      professional: professionalText,
      concise: conciseText,
    };
  };

  // Tone Switch
  const handleToneChange = (tone: 'empathy' | 'professional' | 'concise') => {
    if (!responseVariations) return;
    
    // Save current custom edits into variations cache before switching
    if (isEditingResponse) {
      setResponseVariations(prev => prev ? { ...prev, [activeTone]: suggestedResponseText } : null);
    }

    setActiveTone(tone);
    setSuggestedResponseText(responseVariations[tone]);
    addToast('Tone Updated', `Suggested response switched to ${tone} layout.`, 'info');
  };

  // 3. Clear Dashboard
  const handleClearDashboard = () => {
    setTicketText('');
    setSelectedPresetId(null);
    setAnalysisResult(null);
    setResponseVariations(null);
    setSuggestedResponseText('');
    setIsEditingResponse(false);
    setActiveAnalysisId(null);
    addToast('Dashboard Cleared', 'Resetting active workspace values.', 'info');
  };

  // 4. Copy Response Clipboard
  const handleCopyResponse = () => {
    if (!suggestedResponseText) return;
    
    navigator.clipboard.writeText(suggestedResponseText)
      .then(() => {
        addToast('Copied', 'Draft response copied to clipboard.', 'success');
      })
      .catch((err) => {
        console.error('Copy failed:', err);
        addToast('Clipboard Error', 'Please select and copy response manually.', 'warning');
      });
  };

  // 5. Actions: Accept
  const handleAcceptRecommendation = () => {
    if (!analysisResult || !activeAnalysisId) return;

    navigator.clipboard.writeText(suggestedResponseText)
      .then(() => {
        const timestamp = getFormattedTimestamp();
        
        // Log action
        const logItem: ActionLog = {
          id: Math.random().toString(36).substring(2, 9),
          analysisId: activeAnalysisId,
          ticketSummary: analysisResult.summary,
          category: analysisResult.category,
          priority: analysisResult.priority,
          escalation: analysisResult.escalation,
          agentAction: 'Accept Recommendation',
          timestamp,
          outcomeStatus: 'Accepted',
          customerIssue: ticketText,
          aiRecommendation: suggestedResponseText,
          sentiment: analysisResult.sentiment
        };
        setActionLogs((prev) => [logItem, ...prev]);
        setLastAgentAction('Accepted Recommendation');

        // Clear dashboard state for next ticket
        setTicketText('');
        setSelectedPresetId(null);
        setAnalysisResult(null);
        setResponseVariations(null);
        setSuggestedResponseText('');
        setIsEditingResponse(false);
        setActiveAnalysisId(null);

        addToast('Recommendation Accepted', 'Response copied and audit logged. Dashboard reset.', 'success');
      });
  };

  // 6. Actions: Edit Toggle
  const handleEditToggle = () => {
    if (!analysisResult || !activeAnalysisId) return;

    if (isEditingResponse) {
      // Save changes
      if (responseVariations) {
        setResponseVariations((prev) =>
          prev ? { ...prev, [activeTone]: suggestedResponseText } : null
        );
      }
      setIsEditingResponse(false);
      setLastAgentAction('Edit Response');
      
      const timestamp = getFormattedTimestamp();
      const logItem: ActionLog = {
        id: Math.random().toString(36).substring(2, 9),
        analysisId: activeAnalysisId,
        ticketSummary: analysisResult.summary,
        category: analysisResult.category,
        priority: analysisResult.priority,
        escalation: analysisResult.escalation,
        agentAction: 'Edit Response',
        timestamp,
        outcomeStatus: 'Edited',
        customerIssue: ticketText,
        aiRecommendation: suggestedResponseText,
        sentiment: analysisResult.sentiment
      };
      setActionLogs((prev) => [logItem, ...prev]);

      addToast('Changes Saved', 'Custom draft changes stored and audit logged.', 'success');
    } else {
      setIsEditingResponse(true);
      addToast('Editing Enabled', 'You can now customize the response draft.', 'info');
    }
  };

  // 7. Actions: Escalate Modal Trigger
  const handleEscalateTrigger = () => {
    if (!analysisResult) return;

    // Set defaults based on analysis
    const cat = analysisResult.category.toLowerCase();
    if (cat.includes('hardware')) {
      setEscalateDept('tier2');
    } else if (cat.includes('software') || cat.includes('access')) {
      setEscalateDept('engineering');
    } else if (cat.includes('payment')) {
      setEscalateDept('billing');
    } else {
      setEscalateDept('tier2');
    }

    const pri = analysisResult.priority.toLowerCase();
    setEscalatePriority(pri === 'critical' ? 'critical' : pri === 'high' ? 'high' : 'medium');
    setEscalateNotes(`Routing summary: ${analysisResult.summary}`);
    
    setIsEscalateModalOpen(true);
  };

  const handleEscalateSubmit = () => {
    if (!analysisResult || !activeAnalysisId) return;

    const timestamp = getFormattedTimestamp();
    const targetDept = 
      escalateDept === 'engineering' ? 'Engineering Team' :
      escalateDept === 'billing' ? 'Billing Operations' : 'Tier-2 Support';

    // Log action
    const logItem: ActionLog = {
      id: Math.random().toString(36).substring(2, 9),
      analysisId: activeAnalysisId,
      ticketSummary: analysisResult.summary,
      category: analysisResult.category,
      priority: analysisResult.priority,
      escalation: analysisResult.escalation,
      agentAction: 'Escalate Ticket',
      timestamp,
      outcomeStatus: 'Escalated',
      customerIssue: ticketText,
      aiRecommendation: suggestedResponseText,
      sentiment: analysisResult.sentiment
    };

    setActionLogs((prev) => [logItem, ...prev]);
    setLastAgentAction('Escalated Ticket');

    // Update recommendation inside card to display escalated status
    setAnalysisResult(prev => prev ? {
      ...prev,
      escalation: escalateDept === 'engineering' ? 'Escalate to Specialist Team' : 'Escalate to Tier 2',
      escalationReason: `Routed to ${targetDept} on priority ${escalatePriority.toUpperCase()}. Notes: ${escalateNotes}`
    } : null);

    setIsEscalateModalOpen(false);
    addToast('Ticket Escalated', `Ticket successfully routed to ${targetDept} and logged.`, 'warning');
  };

  // 8. Actions: Reject Recommendation
  const handleRejectRecommendation = () => {
    if (!analysisResult || !activeAnalysisId) return;

    const timestamp = getFormattedTimestamp();
    
    // Log action
    const logItem: ActionLog = {
      id: Math.random().toString(36).substring(2, 9),
      analysisId: activeAnalysisId,
      ticketSummary: analysisResult.summary,
      category: analysisResult.category,
      priority: analysisResult.priority,
      escalation: analysisResult.escalation,
      agentAction: 'Reject Recommendation',
      timestamp,
      outcomeStatus: 'Rejected',
      customerIssue: ticketText,
      aiRecommendation: suggestedResponseText,
      sentiment: analysisResult.sentiment
    };
    setActionLogs((prev) => [logItem, ...prev]);
    setLastAgentAction('Rejected Recommendation');

    // Clear dashboard state
    setTicketText('');
    setSelectedPresetId(null);
    setAnalysisResult(null);
    setResponseVariations(null);
    setSuggestedResponseText('');
    setIsEditingResponse(false);
    setActiveAnalysisId(null);

    addToast('Recommendation Rejected', 'Copilot recommendation rejected and ticket reset.', 'warning');
  };

  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-650/30 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={actionLogs.length}
      />

      {/* Main Content Area */}
      {activeTab === 'copilot' ? (
        /* 3-Column Layout */
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[380px_1fr_340px] overflow-y-auto lg:overflow-hidden bg-slate-50">
          
          {/* Left Column: Ticket Intake */}
          <LeftPanel
            ticketText={ticketText}
            setTicketText={setTicketText}
            onSubmit={handleAnalyzeTicket}
            onClear={handleClearDashboard}
            isLoading={isLoading}
            actionLogs={actionLogs}
            selectedPresetId={selectedPresetId}
            setSelectedPresetId={setSelectedPresetId}
            onViewFullHistory={() => setActiveTab('history')}
          />

          {/* Middle Column: Summary & Suggested Response */}
          <MiddlePanel
            isLoading={isLoading}
            analysisResult={analysisResult}
            activeTone={activeTone}
            setActiveTone={handleToneChange}
            suggestedResponseText={suggestedResponseText}
            setSuggestedResponseText={setSuggestedResponseText}
            isEditingResponse={isEditingResponse}
            onCopyResponse={handleCopyResponse}
            isCopied={toasts.some(t => t.title === 'Copied')}
          />

          {/* Right Column: Confidence & Resolution Actions */}
          <RightPanel
            isLoading={isLoading}
            analysisResult={analysisResult}
            onAccept={handleAcceptRecommendation}
            onEscalateTrigger={handleEscalateTrigger}
            onEditToggle={handleEditToggle}
            onReject={handleRejectRecommendation}
            isEditingResponse={isEditingResponse}
            lastAgentAction={lastAgentAction}
          />

        </main>
      ) : (
        /* Resolution History Operations Dashboard */
        <ResolutionHistory
          actionLogs={actionLogs}
          onClearLogs={() => {
            setActionLogs([]);
            addToast('History Cleared', 'All audit logs have been successfully cleared.', 'info');
          }}
        />
      )}

      {/* Escalation Modal Portal */}
      {isEscalateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-[480px] max-w-[90%] shadow-xl border border-slate-200 overflow-hidden transform scale-100 transition-all">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Escalate Ticket Support</h3>
              <button 
                onClick={() => setIsEscalateModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-700 cursor-pointer transition-colors"
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Target Team / Department</label>
                <select
                  value={escalateDept}
                  onChange={(e) => setEscalateDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 transition-colors"
                >
                  <option value="tier2">Tier-2 General Support</option>
                  <option value="engineering">Engineering Team (Bugs/API/DB)</option>
                  <option value="billing">Billing Operations & Finance</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Escalation Urgency</label>
                <select
                  value={escalatePriority}
                  onChange={(e) => setEscalatePriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 transition-colors"
                >
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical (Blocking Outage)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Justification Notes</label>
                <textarea
                  placeholder="Explain diagnostic findings or reasons why front-line agents cannot resolve..."
                  value={escalateNotes}
                  onChange={(e) => setEscalateNotes(e.target.value)}
                  className="w-full min-h-[90px] p-3 border border-slate-200 rounded-xl bg-slate-50 text-sm leading-relaxed text-slate-850 resize-none focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setIsEscalateModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-100 cursor-pointer transition-all"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleEscalateSubmit}
                className="px-4 py-2 rounded-xl font-semibold text-xs text-white bg-amber-500 hover:bg-amber-600 shadow-xs cursor-pointer transition-all"
                type="button"
              >
                Dispatch Escalation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert Queue Container */}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border bg-white shadow-lg min-w-[320px] max-w-[420px] border-l-4 transition-all duration-300 animate-slide-in ${
              toast.type === 'success'
                ? 'border-l-emerald-500 border-slate-200'
                : toast.type === 'warning'
                ? 'border-l-rose-500 border-slate-200'
                : 'border-l-indigo-500 border-slate-200'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {toast.type === 'success' ? (
                <CheckCircle size={18} className="text-emerald-500" />
              ) : toast.type === 'warning' ? (
                <AlertCircle size={18} className="text-rose-500" />
              ) : (
                <Info size={18} className="text-indigo-500" />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="text-xs font-bold text-slate-800">{toast.title}</span>
              <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer transition-colors"
              type="button"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
