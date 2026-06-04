// Type definitions for ResolveIQ Copilot

export type TicketCategory =
  | 'Hardware Support'
  | 'Software Support'
  | 'Account Access'
  | 'Payment Issue'
  | 'Delivery Issue'
  | 'General Inquiry';

export type TicketPriority = 'Low' | 'Medium' | 'High';

export type TicketSentiment = 'Neutral' | 'Frustrated' | 'Angry' | 'Satisfied';

export type EscalationType =
  | 'No Escalation Required'
  | 'Escalate to Tier 2'
  | 'Escalate to Specialist Team';

export interface AnalysisResponse {
  summary: string;
  category: TicketCategory;
  priority: TicketPriority;
  sentiment: TicketSentiment;
  categoryReason: string;
  priorityReason: string;
  sentimentReason: string;
  suggestedResponse: string;
  escalation: EscalationType;
  escalationReason: string;
  categoryConfidence: number;
  priorityConfidence: number;
  sentimentConfidence: number;
  responseConfidence: number;
  categoryConfidenceReasoning: string;
  priorityConfidenceReasoning: string;
  sentimentConfidenceReasoning: string;
  responseConfidenceReasoning: string;
}

export interface ActionLog {
  id: string;
  analysisId: string;
  ticketSummary: string;
  category: TicketCategory;
  priority: TicketPriority;
  escalation: EscalationType;
  agentAction:
    | 'Accept Recommendation'
    | 'Edit Response'
    | 'Escalate Ticket'
    | 'Reject Recommendation';
  timestamp: string;
  outcomeStatus: 'Accepted' | 'Edited' | 'Escalated' | 'Rejected';
  customerIssue: string;
  aiRecommendation: string;
  sentiment: TicketSentiment;
}

export interface EscalationRule {
  id: string;
  name: string;
  description: string;
  weight: number;
  status: 'Active' | 'Disabled';
}
