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

// GET /api/niches - Get all unique niches/categories
export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with actual database query
    // Example with Supabase:
    // const { data, error } = await supabase
    //   .from('Influencer')
    //   .select('niche')
    //   .not('niche', 'is', null);
    //
    // const uniqueNiches = [...new Set(data.map(i => i.niche))].sort();
    
    const niches = [
      'Gaming',
      'Music',
      'Science',
      'Tech',
      'Education',
      'Beauty',
      'Fitness',
      'Cooking',
      'Travel',
      'Art',
      'Fashion',
      'Sports',
      'Comedy',
      'Business',
      'Lifestyle',
    ];
    
    return NextResponse.json(
      { 
        success: true, 
        data: niches,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching niches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch niches' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
