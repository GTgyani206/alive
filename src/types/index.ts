export type AnimeStyle = 'modern' | 'chibi' | 'ghibli' | 'cyberpunk';

export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Generation {
    id: string;
    session_id: string;
    original_photo_url: string;
    avatar_url: string | null;
    style: AnimeStyle;
    status: GenerationStatus;
    prompt_used: string | null;
    created_at: string;
    completed_at: string | null;
}

export interface Session {
    id: string;
    session_token: string;
    created_at: string;
    updated_at: string;
}

export interface UploadResponse {
    success: boolean;
    generationId?: string;
    photoUrl?: string;
    error?: string;
}

export interface GenerateResponse {
    success: boolean;
    avatarUrl?: string;
    error?: string;
}

export interface HistoryResponse {
    success: boolean;
    generations?: Generation[];
    error?: string;
}
