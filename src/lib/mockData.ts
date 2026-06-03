import { AnalysisResponse, TicketCategory, TicketPriority, TicketSentiment, EscalationType, ActionLog } from './types';

// Default mock response requested in specs
export const DEFAULT_MOCK_RESPONSE: AnalysisResponse = {
  summary: "Battery performance issue reported after software update.",
  category: "Hardware Support",
  priority: "Medium",
  sentiment: "Frustrated",
  categoryReason: "The ticket description lists physical laptop battery degradation, which matches hardware support classification.",
  priorityReason: "A battery draining within 30 minutes limits mobile operations but has a standard workaround (plugging in), justifying Medium priority.",
  sentimentReason: "User sentiment is Frustrated due to the loss of battery productivity immediately following a software update.",
  suggestedResponse: "Thank you for contacting support. Please run the battery diagnostics tool and share the results so we can investigate further.",
  escalation: "No Escalation Required",
  escalationReason: "Known troubleshooting workflow available.",
  categoryConfidence: 92,
  priorityConfidence: 81,
  sentimentConfidence: 84,
  responseConfidence: 78
};

export interface PresetTicket {
  id: string;
  label: string;
  brief: string;
  text: string;
}

export const PRESET_TICKETS: PresetTicket[] = [
  {
    id: "preset-battery",
    label: "Battery Drain",
    brief: "Battery drains rapidly after software update",
    text: "My laptop battery drains within 30 minutes after the latest software update. It was working fine yesterday but now it doesn't hold charge at all."
  },
  {
    id: "preset-login",
    label: "Account Locked",
    brief: "Locked out due to security failure",
    text: "Hi, my account has been locked. I tried resetting my password but I'm locked out due to multiple failed login attempts. Can you unlock it?"
  },
  {
    id: "preset-billing",
    label: "Refund Claim",
    brief: "Billing dispute for credit card charge",
    text: "I noticed an extra $149 transaction on my credit card this morning from your site. I need an immediate refund of this unauthorized fee."
  },
  {
    id: "preset-server",
    label: "API 500 Error",
    brief: "System checkout API throwing errors",
    text: "Urgent: Our application checkouts are failing. The API is returning 500 Internal Server Errors for all checkout endpoints."
  },
  {
    id: "preset-shipping",
    label: "Delayed Order",
    brief: "Inquiry on delayed shipment tracking",
    text: "Hello, my order status says delayed but there's no carrier tracking link. Can you tell me when my package will be delivered?"
  }
];

// Expanded dictionary of mock responses for a rich experience
export function getMockAnalysis(text: string): AnalysisResponse {
  const lowercase = text.toLowerCase().trim();

  if (!lowercase) {
    return DEFAULT_MOCK_RESPONSE;
  }

  // 1. Dynamic Sentiment Parser
  let sentiment: TicketSentiment = "Neutral";
  if (
    lowercase.includes("angry") ||
    lowercase.includes("furious") ||
    lowercase.includes("unacceptable") ||
    lowercase.includes("unauthorized") ||
    lowercase.includes("worst") ||
    lowercase.includes("terrible") ||
    lowercase.includes("furious")
  ) {
    sentiment = "Angry";
  } else if (
    lowercase.includes("frustrated") ||
    lowercase.includes("annoyed") ||
    lowercase.includes("drain") ||
    lowercase.includes("locked") ||
    lowercase.includes("error") ||
    lowercase.includes("fail") ||
    lowercase.includes("broken") ||
    lowercase.includes("disappointed")
  ) {
    sentiment = "Frustrated";
  } else if (
    lowercase.includes("thanks") ||
    lowercase.includes("great") ||
    lowercase.includes("satisfied") ||
    lowercase.includes("happy") ||
    lowercase.includes("solved") ||
    lowercase.includes("good")
  ) {
    sentiment = "Satisfied";
  }

  // 2. Determine Category & Urgency and generate text
  let category: TicketCategory = "General Inquiry";
  let priority: TicketPriority = "Low";
  let categoryReason = "";
  let priorityReason = "";
  let sentimentReason = "";

  // Dynamic Rationale Generators
  // Category Reason
  if (
    lowercase.includes('battery') ||
    lowercase.includes('power') ||
    lowercase.includes('screen') ||
    lowercase.includes('keyboard') ||
    lowercase.includes('mouse') ||
    lowercase.includes('laptop') ||
    lowercase.includes('charger') ||
    lowercase.includes('hardware') ||
    lowercase.includes('device')
  ) {
    category = "Hardware Support";
    categoryReason = "Classified as Hardware Support because the customer references physical laptop components or battery accessories failing.";
  } else if (
    lowercase.includes('login') ||
    lowercase.includes('password') ||
    lowercase.includes('sign in') ||
    lowercase.includes('account') ||
    lowercase.includes('locked') ||
    lowercase.includes('2fa') ||
    lowercase.includes('reset') ||
    lowercase.includes('access')
  ) {
    category = "Account Access";
    categoryReason = "Categorized as Account Access because the issue involves login blocks, passwords, security locked state, or user credentials.";
  } else if (
    lowercase.includes('charge') ||
    lowercase.includes('bill') ||
    lowercase.includes('invoice') ||
    lowercase.includes('payment') ||
    lowercase.includes('credit card') ||
    lowercase.includes('refund') ||
    lowercase.includes('subscription') ||
    lowercase.includes('checkout') ||
    lowercase.includes('pay') ||
    lowercase.includes('pricing')
  ) {
    category = "Payment Issue";
    categoryReason = "Classified as Payment Issue because the description involves card transactions, fees, invoicing details, or credit refunds.";
  } else if (
    lowercase.includes('shipping') ||
    lowercase.includes('delivery') ||
    lowercase.includes('order') ||
    lowercase.includes('package') ||
    lowercase.includes('track') ||
    lowercase.includes('tracking') ||
    lowercase.includes('carrier') ||
    lowercase.includes('delay')
  ) {
    category = "Delivery Issue";
    categoryReason = "Categorized under Delivery Issue since the request asks for shipment statuses, courier carrier links, or delayed parcel deliveries.";
  } else if (
    lowercase.includes('update') ||
    lowercase.includes('crash') ||
    lowercase.includes('freeze') ||
    lowercase.includes('software') ||
    lowercase.includes('error') ||
    lowercase.includes('bug') ||
    lowercase.includes('fail') ||
    lowercase.includes('api') ||
    lowercase.includes('server') ||
    lowercase.includes('app')
  ) {
    category = "Software Support";
    categoryReason = "Classified under Software Support due to reports of application freezes, crashes, software updates, or API route errors.";
  } else {
    category = "General Inquiry";
    categoryReason = "Classified as General Inquiry as the ticket contains routine client questions with no hardware, software, or payment keywords.";
  }

  // Priority & Priority Reason
  const isServerErr = lowercase.includes('server') || lowercase.includes('api') || lowercase.includes('500');
  const isLockedOut = lowercase.includes('locked');
  const isBillingDispute = lowercase.includes('refund') || lowercase.includes('charge') || lowercase.includes('unauthorized');

  if (isServerErr) {
    priority = "High";
    priorityReason = "Assigned High priority because an API/server exception (500) blocks core system operations and checkouts.";
  } else if (isLockedOut) {
    priority = "High";
    priorityReason = "Assigned High priority because account lockout restricts all user access to the dashboard tool.";
  } else if (isBillingDispute) {
    priority = "High";
    priorityReason = "Assigned High priority because credit card transactions and refund claims require immediate resolution for customer trust.";
  } else if (category === "General Inquiry") {
    priority = "Low";
    priorityReason = "Assigned Low priority since this is a general question with no blocking operational defects.";
  } else {
    priority = "Medium";
    priorityReason = "Assigned Medium priority because it represents active component failures that require assistance but have bypass options.";
  }

  // Sentiment Reason
  if (sentiment === "Angry") {
    sentimentReason = "Angry sentiment detected due to strong negative statements (like 'unauthorized charge', 'worst support', or 'furious').";
  } else if (sentiment === "Frustrated") {
    sentimentReason = "Frustrated mood flagged due to descriptions of system friction like battery draining, locked screens, or app errors.";
  } else if (sentiment === "Satisfied") {
    sentimentReason = "Satisfied sentiment inferred because the text contains positive feedback keywords like 'thanks', 'great', or 'happy'.";
  } else {
    sentimentReason = "Neutral sentiment is recorded since the description is a matter-of-fact ticket description containing no emotional markers.";
  }

  // Define dynamic confidence scores
  let categoryConfidence = 85;
  let priorityConfidence = 82;
  let sentimentConfidence = 80;
  let responseConfidence = 78;

  // Let's add some variations based on categories
  if (category === "Hardware Support") {
    categoryConfidence = lowercase.includes('battery') ? 92 : 89;
    priorityConfidence = 81;
    sentimentConfidence = 84;
    responseConfidence = lowercase.includes('battery') ? 78 : 82;
  } else if (category === "Account Access") {
    categoryConfidence = 95;
    priorityConfidence = 91;
    sentimentConfidence = 88;
    responseConfidence = 85;
  } else if (category === "Payment Issue") {
    categoryConfidence = 93;
    priorityConfidence = 89;
    sentimentConfidence = 86;
    responseConfidence = 80;
  } else if (category === "Delivery Issue") {
    categoryConfidence = 91;
    priorityConfidence = 83;
    sentimentConfidence = 85;
    responseConfidence = 84;
  } else if (category === "Software Support") {
    categoryConfidence = 90;
    priorityConfidence = 88;
    sentimentConfidence = 82;
    responseConfidence = 81;
  } else {
    categoryConfidence = 80;
    priorityConfidence = 82;
    sentimentConfidence = 81;
    responseConfidence = 75;
  }

  // Sub-blocks matching
  let suggestedResponse = "";
  let escalation: EscalationType = "No Escalation Required";
  let escalationReason = "";

  if (category === "Hardware Support") {
    suggestedResponse = "Thank you for reaching out. Let's start by isolating the hardware component. Please restart your device, reconnect all cables, and run the built-in Hardware Diagnostics Utility. Let us know the diagnostic error code.";
    escalation = "No Escalation Required";
    escalationReason = "Standard diagnostics checklist applies.";
  } else if (category === "Account Access") {
    suggestedResponse = isLockedOut
      ? "Hi, I have reviewed your account and verified it was locked for security after consecutive failed logins. I have sent a secure unlock link to your registered email address. Please click it within 15 minutes to recover access."
      : "Thank you for reaching out. To reset your password, please visit our password recovery portal at /recover and enter your email address. You will receive an automated link to set up your new credentials.";
    escalation = isLockedOut ? "Escalate to Tier 2" : "No Escalation Required";
    escalationReason = isLockedOut ? "Account lockouts require secondary identity verification by Tier 2 agents." : "Self-service recovery flows are active.";
  } else if (category === "Payment Issue") {
    suggestedResponse = isBillingDispute
      ? "Hello, I apologize for this billing discrepancy. I've reviewed your account history and verified the charge in question. I have processed a full refund of the amount back to your payment card. Please allow 3 to 5 business days for this credit to appear."
      : "Thank you for your inquiry. You can download all historical invoices and change your billing information directly from your Account Dashboard under Billing Settings. Let us know if you need assistance with specific invoices.";
    escalation = isBillingDispute ? "Escalate to Specialist Team" : "No Escalation Required";
    escalationReason = isBillingDispute ? "Financial charge reversals and refund claims must be processed by Billing Operations." : "Standard billing administrative issue resolved by front-line support.";
  } else if (category === "Delivery Issue") {
    suggestedResponse = "Hello, I've checked the status of your order. It is currently in transit with our carrier. You can track its live progress here: [Tracking Link]. It is currently scheduled for delivery by the end of the day tomorrow.";
    escalation = "No Escalation Required";
    escalationReason = "Tracking link successfully generated from carrier API.";
  } else if (category === "Software Support") {
    suggestedResponse = isServerErr
      ? "Thank you for reporting this API behavior. I have isolated the 500 error logs and confirmed a potential service bottleneck in our routing layer. Our operations team is currently working on hotfixing this cluster."
      : "Hello, thank you for report. Please ensure you are running the latest version of the app. Clear your browser cache or reinstall the application, then try again. Let us know if the issue persists.";
    escalation = isServerErr ? "Escalate to Specialist Team" : "Escalate to Tier 2";
    escalationReason = isServerErr ? "API server failures and infrastructure defects require immediate engineering attention." : "Unresolved client-side software bugs require Tier 2 diagnostics.";
  } else {
    suggestedResponse = "Thank you for contacting customer support. We have received your query and are reviewing it. A customer support representative will get back to you with detailed assistance shortly.";
    escalation = "No Escalation Required";
    escalationReason = "General customer inquiry. Standard response templates apply.";
  }

  return {
    summary: text.length > 80 ? text.substring(0, 80) + '...' : text,
    category,
    priority,
    sentiment,
    categoryReason,
    priorityReason,
    sentimentReason,
    suggestedResponse,
    escalation,
    escalationReason,
    categoryConfidence,
    priorityConfidence,
    sentimentConfidence,
    responseConfidence
  };
}

export const INITIAL_ACTION_LOGS: ActionLog[] = [
  {
    id: "hist-1",
    analysisId: "#124",
    ticketSummary: "Account lockout due to password failure",
    category: "Account Access",
    priority: "High",
    escalation: "Escalate to Tier 2",
    agentAction: "Accept Recommendation",
    timestamp: "2026-06-03 18:24",
    outcomeStatus: "Accepted",
    customerIssue: "I cannot log in to the dashboard. It says my account is locked due to security failed attempts. Please unlock it immediately.",
    aiRecommendation: "Hi, I have reviewed your account and verified it was locked for security after consecutive failed logins. I have sent a secure unlock link to your registered email address. Please click it within 15 minutes to recover access.",
    sentiment: "Frustrated"
  },
  {
    id: "hist-2",
    analysisId: "#123",
    ticketSummary: "Subscription double charge dispute",
    category: "Payment Issue",
    priority: "High",
    escalation: "Escalate to Specialist Team",
    agentAction: "Escalate Ticket",
    timestamp: "2026-06-03 16:45",
    outcomeStatus: "Escalated",
    customerIssue: "Urgent! I have been charged twice for my subscription this month. I need a refund for the second transaction of $149.00.",
    aiRecommendation: "Hello, I apologize for this billing discrepancy. I've reviewed your account history and verified the charge in question. I have processed a full refund of the amount back to your payment card. Please allow 3 to 5 business days for this credit to appear.",
    sentiment: "Angry"
  },
  {
    id: "hist-3",
    analysisId: "#122",
    ticketSummary: "External monitor HDMI flickering",
    category: "Hardware Support",
    priority: "Medium",
    escalation: "No Escalation Required",
    agentAction: "Edit Response",
    timestamp: "2026-06-03 14:15",
    outcomeStatus: "Edited",
    customerIssue: "My external monitor screen is flickering when connected to my laptop via HDMI. I tried replacing the cable but it didn't help.",
    aiRecommendation: "Thank you for reaching out. Let's start by isolating the hardware component. Please restart your device, reconnect all cables, and run the built-in Hardware Diagnostics Utility. Let us know the diagnostic error code.",
    sentiment: "Frustrated"
  },
  {
    id: "hist-4",
    analysisId: "#121",
    ticketSummary: "Enterprise pricing volume inquiries",
    category: "General Inquiry",
    priority: "Low",
    escalation: "No Escalation Required",
    agentAction: "Reject Recommendation",
    timestamp: "2026-06-03 11:05",
    outcomeStatus: "Rejected",
    customerIssue: "Do you offer volume discounts for enterprise teams of more than 50 users?",
    aiRecommendation: "Thank you for contacting customer support. We have received your query and are reviewing it. A customer support representative will get back to you with detailed assistance shortly.",
    sentiment: "Neutral"
  }
];

