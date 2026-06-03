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
}

export interface ActionLog {
  id: string;
  timestamp: string;
  action: 'Accept Recommendation' | 'Escalate Ticket' | 'Edit Response';
  ticketText: string;
  details?: string;
}
