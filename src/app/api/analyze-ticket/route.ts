import { NextRequest, NextResponse } from 'next/server';
import { 
  analyzeTicketWithAI, 
  isValidGeminiAnalysisResult, 
  getStructuredFallbackResponse 
} from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Support both 'ticket' (requested specs) and 'ticketText' (frontend compatibility)
    const ticketText = body.ticket || body.ticketText;

    if (!ticketText || typeof ticketText !== 'string' || !ticketText.trim()) {
      return NextResponse.json(
        { error: 'Ticket text is required inside "ticket" parameter and must be a non-empty string.' },
        { status: 400 }
      );
    }

    // Call the Gemini-powered analysis logic
    const result = await analyzeTicketWithAI(ticketText);

    // Double-check validation before returning it to the frontend
    if (isValidGeminiAnalysisResult(result)) {
      return NextResponse.json(result);
    }

    // If somehow validation failed, return the structured fallback response
    console.warn('[API Route] Result failed final validation. Returning structured fallback.');
    const fallback = getStructuredFallbackResponse(ticketText);
    return NextResponse.json(fallback);
  } catch (error) {
    console.error('[API Error] Failed to process ticket:', error);
    
    // In case of a hard crash (e.g. invalid JSON body input), attempt a safe fallback if possible
    try {
      const body = await request.json().catch(() => ({}));
      const ticketText = body.ticket || body.ticketText || "";
      const fallback = getStructuredFallbackResponse(ticketText);
      return NextResponse.json(fallback);
    } catch {
      return NextResponse.json(
        { error: 'Internal server error occurred while processing the ticket.' },
        { status: 500 }
      );
    }
  }
}
