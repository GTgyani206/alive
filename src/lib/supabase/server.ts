import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create client only if env vars are present (prevents build errors)
let supabaseAdminInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseServiceRoleKey) {
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

export const supabaseAdmin = supabaseAdminInstance as SupabaseClient;

export function getSupabaseAdmin(): SupabaseClient {
    if (!supabaseAdminInstance) {
        throw new Error('Supabase is not configured. Please set environment variables.');
    }
    return supabaseAdminInstance;
}
