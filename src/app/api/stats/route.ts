import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

// GET /api/stats - Proxy to backend API
export async function GET(request: NextRequest) {
  try {
    if (!BACKEND_API_URL) {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured');
    }

    const backendUrl = `${BACKEND_API_URL}/stats`;

    console.log('[API Proxy] Fetching stats from:', backendUrl);

    // Fetch from backend API
    const response = await fetch(backendUrl, {
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
    console.error('Error proxying stats to backend:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats from backend' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
