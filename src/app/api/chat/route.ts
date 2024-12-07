import { NextResponse } from 'next/server';

// Store messages in memory
let messages: ChatMessage[] = [];

interface ChatMessage {
  text: string;
  username: string;
  timestamp: number;
}

// Helper function to add CORS headers
function corsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 200 }));
}

// Handle GET requests to fetch messages
export async function GET() {
  return corsHeaders(NextResponse.json(messages));
}

// Handle POST requests to send messages
export async function POST(request: Request) {
  const message = await request.json();
  messages.push(message);
  return corsHeaders(NextResponse.json(messages));
}

// Optional: Add a DELETE endpoint to clear messages
export async function DELETE() {
  messages = [];
  return corsHeaders(NextResponse.json({ success: true }));
} 