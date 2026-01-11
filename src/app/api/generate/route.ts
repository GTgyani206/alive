import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { BUCKETS } from '@/lib/supabase/client';
import { generateAnimeAvatar, base64ToBlob } from '@/lib/gemini';
import { generateId } from '@/lib/utils';
import type { AnimeStyle, GenerateResponse } from '@/types';

export const maxDuration = 60;

export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse>> {
    try {
        const body = await request.json();
        const { generationId, imageBase64, style = 'modern' } = body as {
            generationId: string;
            imageBase64: string;
            style?: AnimeStyle;
        };

        if (!generationId || !imageBase64) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // Update status to processing
        await supabaseAdmin.from('generations').update({ status: 'processing' }).eq('id', generationId);

        // Generate anime avatar using Gemini
        const { imageUrl: avatarBase64, error: genError } = await generateAnimeAvatar(imageBase64, style);

        if (genError || !avatarBase64) {
            await supabaseAdmin.from('generations').update({ status: 'failed' }).eq('id', generationId);
            return NextResponse.json({ success: false, error: genError || 'Failed to generate avatar' }, { status: 500 });
        }

        // Get session ID from generation record
        const { data: generation } = await supabaseAdmin
            .from('generations')
            .select('session_id')
            .eq('id', generationId)
            .single();

        if (!generation) {
            return NextResponse.json({ success: false, error: 'Generation not found' }, { status: 404 });
        }

        // Convert base64 to blob and upload to storage
        const avatarBlob = base64ToBlob(avatarBase64);
        const avatarPath = `${generation.session_id}/${generateId()}.png`;

        const { error: uploadError } = await supabaseAdmin.storage
            .from(BUCKETS.GENERATED_AVATARS)
            .upload(avatarPath, avatarBlob, { contentType: 'image/png', cacheControl: '3600' });

        if (uploadError) {
            console.error('Avatar upload error:', uploadError);
            // Still return the base64 URL even if storage fails
            await supabaseAdmin.from('generations').update({
                avatar_url: avatarBase64,
                status: 'completed',
                completed_at: new Date().toISOString(),
            }).eq('id', generationId);

            return NextResponse.json({ success: true, avatarUrl: avatarBase64 });
        }

        // Get public URL for the uploaded avatar
        const { data: urlData } = supabaseAdmin.storage.from(BUCKETS.GENERATED_AVATARS).getPublicUrl(avatarPath);

        // Update generation record with completed status
        await supabaseAdmin.from('generations').update({
            avatar_url: urlData.publicUrl,
            status: 'completed',
            completed_at: new Date().toISOString(),
        }).eq('id', generationId);

        return NextResponse.json({ success: true, avatarUrl: urlData.publicUrl });
    } catch (error) {
        console.error('Generate API error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
