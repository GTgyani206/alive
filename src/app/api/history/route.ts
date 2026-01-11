import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { HistoryResponse } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse<HistoryResponse>> {
    try {
        const { searchParams } = new URL(request.url);
        const sessionToken = searchParams.get('sessionToken');
        const limit = parseInt(searchParams.get('limit') || '20', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);

        if (!sessionToken) {
            return NextResponse.json({ success: false, error: 'No session token provided' }, { status: 400 });
        }

        // Get session
        const { data: session } = await supabaseAdmin
            .from('sessions')
            .select('id')
            .eq('session_token', sessionToken)
            .single();

        if (!session) {
            return NextResponse.json({ success: true, generations: [] });
        }

        // Get generations for this session
        const { data: generations, error } = await supabaseAdmin
            .from('generations')
            .select('*')
            .eq('session_id', session.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('History fetch error:', error);
            return NextResponse.json({ success: false, error: 'Failed to fetch history' }, { status: 500 });
        }

        return NextResponse.json({ success: true, generations: generations || [] });
    } catch (error) {
        console.error('History API error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
