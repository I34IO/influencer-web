import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://10.80.222.41:3000/api/public';

// Disable CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET /api/influencers - Proxy to backend API
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  try {
    // Build the backend URL with all query parameters
    const backendUrl = new URL(`${BACKEND_API_URL}/influencers`);
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });
    
    console.log('[API Proxy] Fetching from:', backendUrl.toString());
    
    // Fetch from backend API
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
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch influencers from backend' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// POST /api/influencers - Create new influencer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
    
    // TODO: Replace with actual database insert
    // Example with Supabase:
    // const { data, error } = await supabase
    //   .from('Influencer')
    //   .insert({
    //     name: body.name,
    //     imageUrl: body.imageUrl,
    //     summary: body.summary,
    //     socialHandles: JSON.stringify(body.socialHandles),
    //     niche: body.niche,
    //     language: body.language || 'fr',
    //   })
    //   .select()
    //   .single();
    
    const newInfluencer = {
      id: crypto.randomUUID(),
      name: body.name,
      imageUrl: body.imageUrl || null,
      summary: body.summary || null,
      socialHandles: body.socialHandles ? JSON.stringify(body.socialHandles) : null,
      niche: body.niche || null,
      trustScore: 50.0,
      dramaCount: 0,
      goodActionCount: 0,
      neutralCount: 0,
      avgSentiment: 0.0,
      language: body.language || 'fr',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    return NextResponse.json(
      { success: true, data: newInfluencer },
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error creating influencer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create influencer' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
