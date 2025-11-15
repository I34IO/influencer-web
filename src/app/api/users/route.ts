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

// GET /api/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // TODO: Replace with actual database query
    // Example with Supabase:
    // const { data, error } = await supabase
    //   .from('User')
    //   .select('id, email, role, status, firstName, lastName, company, avatar, createdAt')
    //   .order('createdAt', { ascending: false });
    
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
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// POST /api/users - Create new user (registration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
    
    // TODO: Hash password before storing
    // TODO: Replace with actual database insert
    // Example with Supabase:
    // const passwordHash = await bcrypt.hash(body.password, 10);
    //
    // const { data, error } = await supabase
    //   .from('User')
    //   .insert({
    //     email: body.email,
    //     passwordHash,
    //     role: body.role || 'COMMUNITY',
    //     firstName: body.firstName,
    //     lastName: body.lastName,
    //     company: body.company,
    //   })
    //   .select('id, email, role, firstName, lastName, createdAt')
    //   .single();
    
    const newUser = {
      id: crypto.randomUUID(),
      email: body.email,
      role: body.role || 'COMMUNITY',
      status: 'ACTIVE',
      firstName: body.firstName || null,
      lastName: body.lastName || null,
      company: body.company || null,
      avatar: null,
      subscriptionTier: null,
      subscriptionStatus: null,
      subscriptionExpiry: null,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      emailVerified: false,
    };
    
    // Don't return passwordHash
    const { ...userWithoutPassword } = newUser;
    
    return NextResponse.json(
      { success: true, data: userWithoutPassword },
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
