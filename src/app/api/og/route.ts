import { NextResponse } from 'next/server';
import ogs from 'open-graph-scraper';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    const options = { url };
    const { result } = await ogs(options);
    
    return NextResponse.json({
      ogImage: result.ogImage?.[0]?.url,
      ogTitle: result.ogTitle
    });
  } catch (error) {
    console.error('Error fetching OG data:', error);
    return NextResponse.json({}, { status: 500 });
  }
} 