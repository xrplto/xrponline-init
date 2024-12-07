import { NextResponse } from 'next/server';

// Store messages in memory
const messages: ChatMessage[] = [];

interface ChatMessage {
  id?: string;
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
  message.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  messages.push(message);
  return new Response(JSON.stringify({ success: true }));
}

// Optional: Add a DELETE endpoint to clear messages
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const messageId = searchParams.get('id');
  
  if (!messageId) {
    // If no ID is provided, clear all messages (existing functionality)
    messages.length = 0;
    return new Response(JSON.stringify({ success: true }));
  }

  // Find and remove specific message
  const index = messages.findIndex(msg => msg.id === messageId);
  if (index !== -1) {
    messages.splice(index, 1);
  }

  return new Response(JSON.stringify({ success: true }));
} 