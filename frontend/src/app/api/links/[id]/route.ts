import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// PUT /api/links/[id] - Update a link
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title, url, categoryId, memo } = await request.json();

    // Verify ownership
    const { data: existingLink } = await supabaseAdmin
      .from('links')
      .select('id')
      .eq('id', id)
      .eq('user_id', authUser.userId)
      .single();

    if (!existingLink) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title;
    if (url !== undefined) {
      updateData.url = url;
      // Update favicon if URL changed
      try {
        const urlObj = new URL(url);
        updateData.favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
      } catch {
        // Invalid URL, skip favicon update
      }
    }
    if (categoryId !== undefined) updateData.category_id = categoryId || null;
    if (memo !== undefined) updateData.memo = memo || null;

    const { data: link, error } = await supabaseAdmin
      .from('links')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating link:', error);
      return NextResponse.json({ error: 'Failed to update link' }, { status: 500 });
    }

    return NextResponse.json({ link });
  } catch (error) {
    console.error('Link PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/links/[id] - Delete a link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const { data: existingLink } = await supabaseAdmin
      .from('links')
      .select('id')
      .eq('id', id)
      .eq('user_id', authUser.userId)
      .single();

    if (!existingLink) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from('links')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting link:', error);
      return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Link DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
