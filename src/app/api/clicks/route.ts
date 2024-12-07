import { NextResponse } from 'next/server';

// In-memory storage for click counts (replace with database in production)
let clickCounts: { [url: string]: number } = {};

export async function POST(request: Request) {
  const { url } = await request.json();
  
  if (!clickCounts[url]) {
    clickCounts[url] = 0;
  }
  clickCounts[url]++;
  
  return NextResponse.json({ count: clickCounts[url] });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' });
  }
  
  return NextResponse.json({ count: clickCounts[url] || 0 });
} 