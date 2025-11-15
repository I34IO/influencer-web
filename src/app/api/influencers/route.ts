import { NextRequest, NextResponse } from 'next/server';

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

// GET /api/influencers - Get all influencers with filters and sorting
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Extract query parameters
  const limit = parseInt(searchParams.get('limit') || '100');
  const page = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sortBy') || 'trustScore';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const search = searchParams.get('q') || '';
  const niche = searchParams.get('niche') || '';
  
  try {
    // TODO: Replace with actual database query
    // Example with Supabase:
    // const { data, error } = await supabase
    //   .from('Influencer')
    //   .select('*')
    //   .order(sortBy, { ascending: sortOrder === 'asc' })
    //   .limit(limit);
    
    // For now, return mock response structure
    const mockData = {
      success: true,
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    };
    
    return NextResponse.json(mockData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching influencers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch influencers' },
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
