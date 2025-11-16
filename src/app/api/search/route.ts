import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://10.80.222.41:3000/api/public';

// Disable CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET /api/search?q=query - Proxy search to backend API
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  
  if (!query) {
    return NextResponse.json(
      { success: false, error: 'Search query is required' },
      { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
  
  try {
    const backendUrl = new URL(`${BACKEND_API_URL}/search`);
    backendUrl.searchParams.append('q', query);
    
    console.log('[API Proxy] Searching from:', backendUrl.toString());
    
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Backend API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error proxying search to backend:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
