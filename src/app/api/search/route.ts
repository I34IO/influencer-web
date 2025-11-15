import { NextRequest, NextResponse } from 'next/server';

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

// GET /api/search?q=query - Search influencers
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
    // TODO: Replace with actual database search
    // Example with Supabase:
    // const { data, error } = await supabase
    //   .from('Influencer')
    //   .select('*')
    //   .or(`name.ilike.%${query}%,niche.ilike.%${query}%`)
    //   .order('trustScore', { ascending: false })
    //   .limit(20);
    
    return NextResponse.json(
      { 
        success: true, 
        data: [],
        query,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error searching influencers:', error);
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
