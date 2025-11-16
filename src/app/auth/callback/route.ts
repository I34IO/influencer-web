import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        // Redirect to login with error
        return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
      }

      // Successful authentication - redirect to dashboard
      return NextResponse.redirect(`${origin}/`);
    } catch (err) {
      console.error('Unexpected error in auth callback:', err);
      return NextResponse.redirect(`${origin}/login?error=unexpected_error`);
    }
  }

  // No code present, redirect to login
  return NextResponse.redirect(`${origin}/login`);
}
