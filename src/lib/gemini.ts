import { GoogleGenAI, Type } from '@google/genai';
import { getMockAnalysis } from './mockData';

// Initialize the Google Gen AI SDK client
const apiKey = process.env.GEMINI_API_KEY;

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
      description: "A concise summary of the support ticket, 2-3 sentences maximum.",
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
      description: "Calculated priority level based on the customer problem severity.",
    },
    sentiment: {
      type: Type.STRING,
      enum: ["Neutral", "Frustrated", "Angry", "Satisfied"],
      description: "The calculated customer sentiment of the support ticket.",
    },
    suggested_response: {
      type: Type.STRING,
      description: "A professional support agent response draft addressing the customer query.",
    },
    confidence_signals: {
      type: Type.OBJECT,
      properties: {
        category_confidence: {
          type: Type.INTEGER,
          description: "Confidence percentage (1-100) in the category classification.",
        },
        priority_confidence: {
          type: Type.INTEGER,
          description: "Confidence percentage (1-100) in the priority assignment.",
        },
        sentiment_confidence: {
          type: Type.INTEGER,
          description: "Confidence percentage (1-100) in the sentiment detection.",
        },
        response_confidence: {
          type: Type.INTEGER,
          description: "Confidence percentage (1-100) in the suggested response quality.",
        }
      },
      required: ["category_confidence", "priority_confidence", "sentiment_confidence", "response_confidence"]
    },
    reasoning: {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          description: "Explanation of why the issue was classified into this category.",
        },
        priority: {
          type: Type.STRING,
          description: "Explanation of why this priority level was assigned.",
        },
        sentiment: {
          type: Type.STRING,
          description: "Explanation of why this sentiment level was detected.",
        }
      },
      required: ["category", "priority", "sentiment"]
    },
    confidence_reasoning: {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          description: "Explanation of why this category confidence value was assigned.",
        },
        priority: {
          type: Type.STRING,
          description: "Explanation of why this priority confidence value was assigned.",
        },
        sentiment: {
          type: Type.STRING,
          description: "Explanation of why this sentiment confidence value was assigned.",
        },
        response: {
          type: Type.STRING,
          description: "Explanation of why this response confidence value was assigned.",
        }
      },
      required: ["category", "priority", "sentiment", "response"]
    },
    escalation: {
      type: Type.OBJECT,
      properties: {
        recommended: {
          type: Type.BOOLEAN,
          description: "True if escalation is recommended, false otherwise.",
        },
        team: {
          type: Type.STRING,
          description: "The team to escalate to (e.g. 'Tier 2 Support', 'Specialist Team', or empty string if not recommended).",
        },
        reason: {
          type: Type.STRING,
          description: "The rationale for recommending escalation or lack thereof.",
        }
      },
      required: ["recommended", "team", "reason"]
    }
  },
  required: [
    "summary",
    "category",
    "priority",
    "sentiment",
    "suggested_response",
    "confidence_signals",
    "reasoning",
    "confidence_reasoning",
    "escalation"
  ]
};

export interface GeminiAnalysisResult {
  summary: string;
  category: string;
  priority: string;
  sentiment: string;
  suggested_response: string;
  confidence_signals: {
    category_confidence: number;
    priority_confidence: number;
    sentiment_confidence: number;
    response_confidence: number;
  };
  reasoning: {
    category: string;
    priority: string;
    sentiment: string;
  };
  confidence_reasoning: {
    category: string;
    priority: string;
    sentiment: string;
    response: string;
  };
  escalation: {
    recommended: boolean;
    team: string;
    reason: string;
  };
}

/**
 * Validates the structure and property types of a Gemini analysis response.
 */
export function isValidGeminiAnalysisResult(data: any): data is GeminiAnalysisResult {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.summary !== 'string') return false;
  if (typeof data.category !== 'string') return false;
  if (typeof data.priority !== 'string') return false;
  if (typeof data.sentiment !== 'string') return false;
  if (typeof data.suggested_response !== 'string') return false;
  
  if (!data.confidence_signals || typeof data.confidence_signals !== 'object') return false;
  if (typeof data.confidence_signals.category_confidence !== 'number') return false;
  if (typeof data.confidence_signals.priority_confidence !== 'number') return false;
  if (typeof data.confidence_signals.sentiment_confidence !== 'number') return false;
  if (typeof data.confidence_signals.response_confidence !== 'number') return false;

  if (!data.reasoning || typeof data.reasoning !== 'object') return false;
  if (typeof data.reasoning.category !== 'string') return false;
  if (typeof data.reasoning.priority !== 'string') return false;
  if (typeof data.reasoning.sentiment !== 'string') return false;

  if (!data.confidence_reasoning || typeof data.confidence_reasoning !== 'object') return false;
  if (typeof data.confidence_reasoning.category !== 'string') return false;
  if (typeof data.confidence_reasoning.priority !== 'string') return false;
  if (typeof data.confidence_reasoning.sentiment !== 'string') return false;
  if (typeof data.confidence_reasoning.response !== 'string') return false;

  if (!data.escalation || typeof data.escalation !== 'object') return false;
  if (typeof data.escalation.recommended !== 'boolean') return false;
  if (typeof data.escalation.team !== 'string') return false;
  if (typeof data.escalation.reason !== 'string') return false;

  return true;
}

/**
 * Generates a structured fallback response that matches the exact Gemini schema.
 */
export function getStructuredFallbackResponse(ticketText: string): GeminiAnalysisResult {
  const oldMock = getMockAnalysis(ticketText);
  const isEscalated = oldMock.escalation !== 'No Escalation Required';
  let teamName = '';
  if (oldMock.escalation === 'Escalate to Specialist Team') {
    teamName = 'Specialist Team';
  } else if (oldMock.escalation === 'Escalate to Tier 2') {
    teamName = 'Tier 2 Support';
  }

  return {
    summary: oldMock.summary,
    category: oldMock.category,
    priority: oldMock.priority,
    sentiment: oldMock.sentiment,
    suggested_response: oldMock.suggestedResponse,
    confidence_signals: {
      category_confidence: oldMock.categoryConfidence,
      priority_confidence: oldMock.priorityConfidence,
      sentiment_confidence: oldMock.sentimentConfidence,
      response_confidence: oldMock.responseConfidence
    },
    reasoning: {
      category: oldMock.categoryReason,
      priority: oldMock.priorityReason,
      sentiment: oldMock.sentimentReason
    },
    confidence_reasoning: {
      category: oldMock.categoryConfidenceReasoning,
      priority: oldMock.priorityConfidenceReasoning,
      sentiment: oldMock.sentimentConfidenceReasoning,
      response: oldMock.responseConfidenceReasoning
    },
    escalation: {
      recommended: isEscalated,
      team: teamName,
      reason: oldMock.escalationReason
    }
  };
}

/**
 * Analyzes a customer support ticket using the Gemini API.
 * Performs schema validation and falls back to a structured mock response if needed.
 */
export async function analyzeTicketWithAI(ticketText: string): Promise<GeminiAnalysisResult> {
  if (!aiClient) {
    console.log("[ResolveIQ AI] No GEMINI_API_KEY environment variable configured. Using fallback parser.");
    return getStructuredFallbackResponse(ticketText);
  }

  try {
    const prompt = `
You are an enterprise customer support operations analyst.

Your job is to analyse customer support tickets and return structured JSON.

Rules:

1. Return valid JSON only.
2. Do not include markdown.
3. Do not include explanations outside JSON.
4. Use only the provided schema.

Tasks:

* Summarise the issue
* Classify the category
* Determine priority
* Identify customer sentiment
* Draft a professional support response
* Explain classification decisions
* Explain confidence reasoning for all metrics
* Recommend escalation when appropriate

Categories:

* Hardware Support
* Software Support
* Account Access
* Payment Issue
* Delivery Issue
* General Inquiry

Priorities:

* Low
* Medium
* High

Sentiments:

* Neutral
* Frustrated
* Angry
* Satisfied

Escalate when:

* payment disputes exist
* fraud indicators exist
* security concerns exist
* repeated unresolved complaints exist
* confidence is low

Confidence Guidelines:
* Provide confidence values from 0 to 100.
* Confidence must reflect certainty based on ticket information.
* Do not generate arbitrary numbers.
* Lower confidence when ticket details are incomplete.
* Lower confidence when multiple interpretations are possible.
* Higher confidence when category and issue type are clear.

Return JSON only.

Customer Support Ticket to Analyse:
"""
${ticketText}
"""
`;

    console.log("[ResolveIQ AI] Calling Gemini API...");

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        temperature: 0.15,
      }
    });

    const responseText = response.text();
    if (!responseText) {
      throw new Error("Gemini returned empty text.");
    }

    const parsedResult = JSON.parse(responseText);

    if (isValidGeminiAnalysisResult(parsedResult)) {
      console.log("[ResolveIQ AI] Gemini response successfully validated.");
      return parsedResult;
    } else {
      console.warn("[ResolveIQ AI] Gemini response failed validation format. Activating fallback schema.");
      return getStructuredFallbackResponse(ticketText);
    }
  } catch (error) {
    console.error("[ResolveIQ AI] Gemini API processing failed:", error);
    return getStructuredFallbackResponse(ticketText);
  }
}
