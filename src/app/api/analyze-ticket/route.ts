import { NextRequest, NextResponse } from 'next/server';
import { analyzeTicketWithAI } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketText } = body;

    if (!ticketText || typeof ticketText !== 'string' || !ticketText.trim()) {
      return NextResponse.json(
        { error: 'Ticket text is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    // Call modular AI service (falls back to mock automatically if key is missing)
    const result = await analyzeTicketWithAI(ticketText);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API Error] Failed to process ticket:', error);
    return NextResponse.json(
      { error: 'Internal server error occurred while analyzing the ticket.' },
      { status: 500 }
    );
  }
}
