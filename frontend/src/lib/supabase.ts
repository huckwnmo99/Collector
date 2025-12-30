import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Supabase 클라이언트 생성 함수 (lazy initialization)
function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

function createSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase admin environment variables');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Client-side Supabase client (limited permissions)
export const supabase: SupabaseClient = createSupabaseClient();

// Server-side Supabase client (full permissions) - only use in API routes
export const supabaseAdmin: SupabaseClient = createSupabaseAdminClient();

// Database types
export interface DbUser {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface DbCategory {
  id: string;
  user_id: string;
  name: string;
  color: string;
  order_index: number;
  created_at: string;
}

export interface DbLink {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  url: string;
  favicon: string | null;
  created_at: string;
  updated_at: string;
}
