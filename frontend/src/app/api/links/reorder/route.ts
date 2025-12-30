import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// PUT /api/links/reorder - Reorder links
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { linkIds } = await request.json();

    if (!Array.isArray(linkIds)) {
      return NextResponse.json({ error: 'linkIds must be an array' }, { status: 400 });
    }

    // Update order for each link using updated_at as a proxy for order
    // We'll use the array index to set a consistent order
    const updates = linkIds.map((id, index) =>
      supabaseAdmin
        .from('links')
        .update({
          updated_at: new Date(Date.now() - index * 1000).toISOString()
        })
        .eq('id', id)
        .eq('user_id', authUser.userId)
    );

    await Promise.all(updates);

    return NextResponse.json({ message: 'Links reordered successfully' });
  } catch (error) {
    console.error('Links reorder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
