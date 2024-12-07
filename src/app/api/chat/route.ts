import { NextResponse } from 'next/server';

// Store messages in memory
let messages: ChatMessage[] = [];

interface ChatMessage {
  text: string;
  username: string;
  timestamp: number;
  ogImage?: string;
  ogTitle?: string;
  recipient?: string;
  isPrivate?: boolean;
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
export async function POST(req: Request) {
  const message: ChatMessage = await req.json();
  messages.push(message);
  return new Response(JSON.stringify({ success: true }));
}

// Optional: Add a DELETE endpoint to clear messages
export async function DELETE() {
  messages = [];
  return corsHeaders(NextResponse.json({ success: true }));
} 