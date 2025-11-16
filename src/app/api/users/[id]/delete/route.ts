import { NextRequest, NextResponse } from 'next/server';

// Disable CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// POST /api/users/[id]/delete - Delete user (setter, admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // TODO: Add admin authentication check
    // TODO: Replace with actual database delete or soft delete
    // Example with Supabase (soft delete):
    // const { data, error } = await supabase
    //   .from('User')
    //   .update({ status: 'DELETED' })
    //   .eq('id', id)
    //   .select()
    //   .single();
    //
    // Or hard delete:
    // const { error } = await supabase
    //   .from('User')
    //   .delete()
    //   .eq('id', id);
    
    return NextResponse.json(
      { success: false, error: 'Not implemented - connect database' },
      {
        status: 501,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
