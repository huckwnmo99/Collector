import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/links - Get all links for user
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    let query = supabaseAdmin
      .from('links')
      .select('*')
      .eq('user_id', authUser.userId)
      .order('order_index', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data: links, error } = await query;

    if (error) {
      console.error('Error fetching links:', error);
      return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
    }

    return NextResponse.json({ links });
  } catch (error) {
    console.error('Links GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/links - Create a new link
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, url, categoryId } = await request.json();

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
    }

    // Extract favicon URL
    let favicon = null;
    try {
      const urlObj = new URL(url);
      favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch {
      // Invalid URL, skip favicon
    }

    // Get max order_index for new link
    const { data: maxOrderData } = await supabaseAdmin
      .from('links')
      .select('order_index')
      .eq('user_id', authUser.userId)
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const newOrderIndex = (maxOrderData?.order_index ?? -1) + 1;

    const { data: link, error } = await supabaseAdmin
      .from('links')
      .insert({
        user_id: authUser.userId,
        category_id: categoryId || null,
        title,
        url,
        favicon,
        order_index: newOrderIndex,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating link:', error);
      return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
    }

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error('Links POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
