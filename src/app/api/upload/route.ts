import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { BUCKETS } from '@/lib/supabase/client';
import { generateId } from '@/lib/utils';
import type { AnimeStyle, UploadResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
    try {
        // Check if Supabase is configured
        if (!supabaseAdmin) {
            console.error('Supabase not configured - missing environment variables');
            return NextResponse.json({
                success: false,
                error: 'Database not configured. Please set Supabase environment variables on Vercel.'
            }, { status: 503 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const sessionToken = formData.get('sessionToken') as string | null;
        const style = (formData.get('style') as AnimeStyle) || 'modern';

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        if (!sessionToken) {
            return NextResponse.json({ success: false, error: 'No session token provided' }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 });
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ success: false, error: 'File too large (max 10MB)' }, { status: 400 });
        }

        // Get or create session
        let { data: session } = await supabaseAdmin
            .from('sessions')
            .select('id')
            .eq('session_token', sessionToken)
            .single();

        if (!session) {
            const { data: newSession, error: sessionError } = await supabaseAdmin
                .from('sessions')
                .insert({ session_token: sessionToken })
                .select('id')
                .single();

            if (sessionError) {
                console.error('Session creation error:', sessionError);
                return NextResponse.json({ success: false, error: 'Failed to create session' }, { status: 500 });
            }
            session = newSession;
        }

        // Generate unique file path
        const fileId = generateId();
        const extension = file.name.split('.').pop() || 'jpg';
        const filePath = `${session.id}/${fileId}.${extension}`;

        // Upload to Supabase storage
        const arrayBuffer = await file.arrayBuffer();
        const { error: uploadError } = await supabaseAdmin.storage
            .from(BUCKETS.USER_PHOTOS)
            .upload(filePath, arrayBuffer, { contentType: file.type, cacheControl: '3600' });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 });
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage.from(BUCKETS.USER_PHOTOS).getPublicUrl(filePath);

        // Create generation record
        const { data: generation, error: genError } = await supabaseAdmin
            .from('generations')
            .insert({
                session_id: session.id,
                original_photo_url: urlData.publicUrl,
                style: style,
                status: 'pending',
            })
            .select('id')
            .single();

        if (genError) {
            console.error('Generation record error:', genError);
            return NextResponse.json({ success: false, error: 'Failed to create generation record' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            generationId: generation.id,
            photoUrl: urlData.publicUrl,
        });
    } catch (error) {
        console.error('Upload API error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
