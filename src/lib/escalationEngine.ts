import { TicketCategory, TicketPriority, TicketSentiment, EscalationType, EscalationRule } from './types';

export interface EscalationTriggerResult {
  name: string;
  triggered: boolean;
  explanation: string;
}

export interface EscalationEngineResult {
  triggers: EscalationTriggerResult[];
  calculatedEscalation: EscalationType;
  justification: string;
}

/**
 * Dynamically evaluates a ticket against predefined escalation triggers
 * and calculates the corresponding escalation recommendation.
 */
export function evaluateEscalationRules(
  ticketText: string,
  category: TicketCategory,
  priority: TicketPriority,
  sentiment: TicketSentiment,
  rulesConfig?: EscalationRule[]
): EscalationEngineResult {
  const isRuleActive = (ruleName: string) => {
    if (!rulesConfig) return true;
    const rule = rulesConfig.find(r => r.name === ruleName);
    return rule ? rule.status === 'Active' : true;
  };
  const text = ticketText.toLowerCase().trim();
  const triggers: EscalationTriggerResult[] = [];

  // 1. Angry Customer
  const isAngry = (sentiment === 'Angry' || text.includes('angry') || text.includes('furious') || text.includes('unacceptable') || text.includes('worst') || text.includes('terrible')) && isRuleActive('Angry Customer');
  triggers.push({
    name: 'Angry Customer',
    triggered: isAngry,
    explanation: isAngry
      ? 'Detected angry customer sentiment or strong negative language markers.'
      : 'No severe customer anger indicators detected.'
  });

  // 2. Payment Dispute
  const isPaymentDispute = (category === 'Payment Issue' || text.includes('refund') || text.includes('charge') || text.includes('billing') || text.includes('invoice') || text.includes('transaction') || text.includes('unauthorized transaction')) && isRuleActive('Payment Dispute');
  triggers.push({
    name: 'Payment Dispute',
    triggered: isPaymentDispute,
    explanation: isPaymentDispute
      ? 'Detected refund-related language or billing dispute expressions.'
      : 'No payment disputes detected.'
  });

  // 3. Fraud Concern
  const isFraud = (text.includes('fraud') || text.includes('scam') || text.includes('stolen') || text.includes('hacked') || text.includes('phishing') || text.includes('unauthorized charge')) && isRuleActive('Fraud Concern');
  triggers.push({
    name: 'Fraud Concern',
    triggered: isFraud,
    explanation: isFraud
      ? 'Detected potential security compromise or fraudulent transaction markers.'
      : 'No fraud indicators detected.'
  });

  // 4. Repeat Complaint
  const isRepeat = (text.includes('again') || text.includes('second time') || text.includes('multiple times') || text.includes('already reported') || text.includes('still not working') || text.includes('previously')) && isRuleActive('Repeat Complaint');
  triggers.push({
    name: 'Repeat Complaint',
    triggered: isRepeat,
    explanation: isRepeat
      ? 'Detected references to previous support requests or repeated component failures.'
      : 'No repeat complaint markers detected.'
  });

  // 5. High Severity Issue
  const isHighSeverity = (priority === 'High' || text.includes('outage') || text.includes('blocking') || text.includes('500') || text.includes('crash') || text.includes('down') || text.includes('critical')) && isRuleActive('High Severity Issue');
  triggers.push({
    name: 'High Severity Issue',
    triggered: isHighSeverity,
    explanation: isHighSeverity
      ? 'Critical system failure, blocking bug, API 500 error, or high priority level detected.'
      : 'Standard severity level.'
  });

  // 6. Security Risk
  const isSecurity = (category === 'Account Access' || text.includes('locked') || text.includes('unauthorized access') || text.includes('hack') || text.includes('password reset') || text.includes('security check') || text.includes('credentials') || text.includes('2fa')) && isRuleActive('Security Risk');
  triggers.push({
    name: 'Security Risk',
    triggered: isSecurity,
    explanation: isSecurity
      ? 'Detected customer security block, account lockout event, or authentication risk.'
      : 'No security risks detected.'
  });

  // 7. No Resolution Path Available
  const isNoPath = ((category === 'General Inquiry' && priority === 'Low' && text.length > 500) || text.includes('not sure how') || text.includes('no option') || text.includes('confused') || text.includes('cannot resolve') || text.includes('no troubleshooting')) && isRuleActive('No Resolution Path Available');
  triggers.push({
    name: 'No Resolution Path Available',
    triggered: isNoPath,
    explanation: isNoPath
      ? 'Complex customer query terms with no mapping standard auto-resolution templates.'
      : 'Resolvable through standard automation templates.'
  });

  // Calculate recommendation based on conditions
  let calculatedEscalation: EscalationType = 'No Escalation Required';
  let justification = '';

  const triggeredCount = triggers.filter(t => t.triggered).length;
  const hasCriticalTrigger = triggers.some(t => t.triggered && (t.name === 'Security Risk' || t.name === 'Fraud Concern'));
  
  if (hasCriticalTrigger) {
    calculatedEscalation = 'Escalate to Specialist Team';
    justification = 'Escalated to Specialist Team due to triggered security risks or fraud concerns requiring strict audit checks.';
  } else if (triggeredCount > 0) {
    calculatedEscalation = 'Escalate to Tier 2';
    const activeNames = triggers.filter(t => t.triggered).map(t => t.name).join(', ');
    justification = `Escalated to Tier 2 support due to matching triggers: ${activeNames}.`;
  } else {
    calculatedEscalation = 'No Escalation Required';
    justification = 'No escalation triggers matched. Issue can be resolved by front-line support.';
  }

  return {
    triggers,
    calculatedEscalation,
    justification
  };
}
