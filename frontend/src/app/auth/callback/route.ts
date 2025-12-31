import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Exchange code for session
    const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code);

    if (authError || !authData.user) {
      console.error('OAuth callback error:', authError);
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }

    const googleUser = authData.user;
    const email = googleUser.email!;
    const username = email.split('@')[0]; // Use email prefix as username

    try {
      // Check if user exists in our users table
      let { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (!existingUser) {
        // Create new user
        const { data: newUser, error: createError } = await supabaseAdmin
          .from('users')
          .insert({
            username: username,
            email: email,
            password_hash: 'GOOGLE_OAUTH', // Placeholder for OAuth users
          })
          .select('*')
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          return NextResponse.redirect(`${origin}/login?error=user_creation_failed`);
        }

        existingUser = newUser;
      }

      // Create JWT token
      const jwtSecret = process.env.JWT_SECRET!;
      const token = jwt.sign(
        { userId: existingUser.id, username: existingUser.username },
        jwtSecret,
        { expiresIn: '7d' }
      );

      // Set cookie and redirect to dashboard
      const response = NextResponse.redirect(`${origin}/dashboard`);
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    } catch (error) {
      console.error('OAuth callback error:', error);
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }
  }

  // No code, redirect to login
  return NextResponse.redirect(`${origin}/login`);
}
