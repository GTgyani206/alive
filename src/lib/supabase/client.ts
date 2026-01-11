import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client only if env vars are present (prevents build errors)
let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseInstance as SupabaseClient;

// Storage bucket names
export const BUCKETS = {
    USER_PHOTOS: 'user-photos',
    GENERATED_AVATARS: 'generated-avatars',
} as const;

// Helper to get public URL for a file in a bucket
export function getPublicUrl(bucket: string, path: string): string {
    if (!supabase) {
        throw new Error('Supabase client not initialized');
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}
