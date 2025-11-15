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

// GET /api/community-signals?influencerId=xxx - Get community signals
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const influencerId = searchParams.get('influencerId');
  const userId = searchParams.get('userId');
  const type = searchParams.get('type'); // RATING, DRAMA_REPORT, POSITIVE_ACTION, COMMENT
  const limit = parseInt(searchParams.get('limit') || '50');
  
  try {
    // TODO: Replace with actual database query
    // Example with Supabase:
    // let query = supabase
    //   .from('CommunitySignal')
    //   .select('*')
    //   .eq('isHidden', false)
    //   .order('createdAt', { ascending: false })
    //   .limit(limit);
    //
    // if (influencerId) query = query.eq('influencerId', influencerId);
    // if (userId) query = query.eq('userId', userId);
    // if (type) query = query.eq('type', type);
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
    console.error('Error fetching community signals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch community signals' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// POST /api/community-signals - Create new community signal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.influencerId || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, influencerId, type' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
    
    // Validate type
    const validTypes = ['RATING', 'DRAMA_REPORT', 'POSITIVE_ACTION', 'COMMENT'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid type. Must be: RATING, DRAMA_REPORT, POSITIVE_ACTION, or COMMENT' },
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
    //   .from('CommunitySignal')
    //   .insert({
    //     userId: body.userId,
    //     influencerId: body.influencerId,
    //     type: body.type,
    //     rating: body.rating,
    //     comment: body.comment,
    //     tags: body.tags,
    //   })
    //   .select()
    //   .single();
    
    const newSignal = {
      id: crypto.randomUUID(),
      userId: body.userId,
      influencerId: body.influencerId,
      type: body.type,
      rating: body.rating || null,
      comment: body.comment || null,
      tags: body.tags || null,
      isVerified: false,
      verifiedAt: null,
      isHidden: false,
      hiddenReason: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(
      { success: true, data: newSignal },
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error creating community signal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create community signal' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
