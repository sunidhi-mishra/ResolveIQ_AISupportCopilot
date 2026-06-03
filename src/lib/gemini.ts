import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResponse } from './types';
import { getMockAnalysis } from './mockData';

// Initialize the Google Gen AI SDK client
// We read the key from process.env.GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY;

// Only instantiate GoogleGenAI client if apiKey is defined
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

// Define the structured JSON schema for Gemini response
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A brief, one-sentence summary of the customer's problem or inquiry.",
    },
    category: {
      type: Type.STRING,
      enum: [
        "Hardware Support",
        "Software Support",
        "Account Access",
        "Payment Issue",
        "Delivery Issue",
        "General Inquiry"
      ],
      description: "The primary category classification for the support ticket.",
    },
    priority: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High"],
      description: "Calculated urgency level based on the customer problem severity.",
    },
    sentiment: {
      type: Type.STRING,
      enum: ["Neutral", "Frustrated", "Angry", "Satisfied"],
      description: "The calculated customer sentiment of the support ticket.",
    },
    categoryReason: {
      type: Type.STRING,
      description: "A concise 1-2 sentence explanation of why the support ticket was classified into this category.",
    },
    priorityReason: {
      type: Type.STRING,
      description: "A concise 1-2 sentence explanation of why this priority level was assigned.",
    },
    sentimentReason: {
      type: Type.STRING,
      description: "A concise 1-2 sentence explanation of why this sentiment level was detected.",
    },
    suggestedResponse: {
      type: Type.STRING,
      description: "A helpful, polite, and accurate support agent response draft addressing the customer query.",
    },
    escalation: {
      type: Type.STRING,
      enum: [
        "No Escalation Required",
        "Escalate to Tier 2",
        "Escalate to Specialist Team"
      ],
      description: "Whether the issue can be resolved by front-line support or needs routing to a higher tier/team.",
    },
    escalationReason: {
      type: Type.STRING,
      description: "The logic, justification, or next steps explaining the escalation recommendation.",
    },
    categoryConfidence: {
      type: Type.INTEGER,
      description: "Confidence percentage from 1 to 100 in the category classification.",
    },
    priorityConfidence: {
      type: Type.INTEGER,
      description: "Confidence percentage from 1 to 100 in the priority assignment.",
    },
    sentimentConfidence: {
      type: Type.INTEGER,
      description: "Confidence percentage from 1 to 100 in the sentiment detection.",
    },
    responseConfidence: {
      type: Type.INTEGER,
      description: "Confidence percentage from 1 to 100 in the suggested draft response quality.",
    }
  },
  required: [
    "summary",
    "category",
    "priority",
    "sentiment",
    "categoryReason",
    "priorityReason",
    "sentimentReason",
    "suggestedResponse",
    "escalation",
    "escalationReason",
    "categoryConfidence",
    "priorityConfidence",
    "sentimentConfidence",
    "responseConfidence"
  ]
};

/**
 * Analyzes a customer support ticket.
 * It will attempt to call the Gemini API if a key is present,
 * and will gracefully fall back to local mock parsing if anything fails or key is missing.
 */
export async function analyzeTicketWithAI(ticketText: string): Promise<AnalysisResponse> {
  // If no API key is set, immediately run mock analysis
  if (!aiClient) {
    console.log("[ResolveIQ AI] No GEMINI_API_KEY environment variable found. Falling back to Mock Data engine.");
    return getMockAnalysis(ticketText);
  }

  try {
    const prompt = `
      You are an advanced AI Customer Support Copilot assisting a support operations agent.
      Analyze the following customer support ticket and extract the required fields exactly matching the output schema.
      
      Support Ticket Text:
      """
      ${ticketText}
      """
      
      Generate a suggested response that directly addresses the issue, is highly professional, and provides concrete next steps or troubleshooting.
    `;

    console.log("[ResolveIQ AI] Forwarding ticket to Gemini API...");

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        temperature: 0.1, // Low temperature for deterministic analysis
      }
    });

    const responseText = response.text();
    if (!responseText) {
      throw new Error("Received empty response from Gemini API.");
    }

    const parsedResult: AnalysisResponse = JSON.parse(responseText);
    console.log("[ResolveIQ AI] Successfully analyzed ticket via Gemini API.");
    return parsedResult;
  } catch (error) {
    console.error("[ResolveIQ AI] Failed to analyze ticket with Gemini API. Error details:", error);
    console.log("[ResolveIQ AI] Gracefully falling back to local Mock Data engine.");
    return getMockAnalysis(ticketText);
  }
}
