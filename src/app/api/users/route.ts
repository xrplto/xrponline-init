import { NextResponse } from 'next/server';

// Store online users in memory
let onlineUsers: { username: string; lastSeen: number }[] = [];

// Clean up inactive users (those who haven't updated their status in 10 seconds)
const cleanupInactiveUsers = () => {
  const now = Date.now();
  onlineUsers = onlineUsers.filter(user => now - user.lastSeen < 10000);
};

export async function POST(request: Request) {
  try {
    const { username, timestamp } = await request.json();
    
    cleanupInactiveUsers();
    
    const existingUserIndex = onlineUsers.findIndex(u => u.username === username);
    if (existingUserIndex !== -1) {
      onlineUsers[existingUserIndex].lastSeen = timestamp;
    } else {
      onlineUsers.push({ username, lastSeen: timestamp });
    }
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// In your GET handler, filter out old entries
const activeTimeWindow = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET() {
  try {
    const currentTime = Date.now();
    const activeUsers = onlineUsers.filter(user => 
      currentTime - user.lastSeen < activeTimeWindow
    );
    return new Response(JSON.stringify(activeUsers));
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), { status: 500 });
  }
} 