import { NextRequest, NextResponse } from 'next/server';

// Disable CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET /api/mentions?influencerId=xxx - Get mentions for an influencer
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const influencerId = searchParams.get('influencerId');
  const limit = parseInt(searchParams.get('limit') || '50');
  const label = searchParams.get('label'); // POSITIVE, NEGATIVE, NEUTRAL
  
  try {
    // TODO: Replace with actual database query
    // Example with Supabase:
    // let query = supabase
    //   .from('Mention')
    //   .select('*')
    //   .order('scrapedAt', { ascending: false })
    //   .limit(limit);
    //
    // if (influencerId) {
    //   query = query.eq('influencerId', influencerId);
    // }
    //
    // if (label) {
    //   query = query.eq('label', label);
    // }
    //
    // const { data, error } = await query;
    
    return NextResponse.json(
      { 
        success: true, 
        data: [],
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching mentions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mentions' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// POST /api/mentions - Create new mention
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.influencerId || !body.source || !body.textExcerpt || !body.sentimentScore || !body.label) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
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
    //   .from('Mention')
    //   .insert({
    //     influencerId: body.influencerId,
    //     source: body.source,
    //     sourceUrl: body.sourceUrl,
    //     textExcerpt: body.textExcerpt,
    //     sentimentScore: body.sentimentScore,
    //     label: body.label,
    //   })
    //   .select()
    //   .single();
    
    const newMention = {
      id: crypto.randomUUID(),
      ...body,
      scrapedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(
      { success: true, data: newMention },
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error creating mention:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create mention' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
