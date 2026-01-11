import { GoogleGenAI } from "@google/genai";

export type AnimeStyle = 'modern' | 'chibi' | 'ghibli' | 'cyberpunk';

const STYLE_PROMPTS: Record<AnimeStyle, string> = {
    modern: 'Transform this photo into a modern anime art style with vibrant colors, detailed shading, and expressive features like those seen in recent popular anime series.',
    chibi: 'Transform this photo into a chibi anime style with an adorable oversized head, tiny body, large sparkly eyes, and cute exaggerated expressions.',
    ghibli: 'Transform this photo into a Studio Ghibli inspired art style with soft colors, gentle lighting, hand-painted textures, and a whimsical dreamlike quality.',
    cyberpunk: 'Transform this photo into a cyberpunk anime style with neon accents, futuristic elements, tech accessories, holographic effects, and a dark urban aesthetic.',
};

interface GeminiPart {
    text?: string;
    inlineData?: {
        mimeType: string;
        data: string;
    };
}

interface GeminiCandidate {
    content: {
        parts: GeminiPart[];
    };
}

interface GeminiResponse {
    candidates: GeminiCandidate[];
}

export async function generateAnimeAvatar(
    imageBase64: string,
    style: AnimeStyle = 'modern'
): Promise<{ imageUrl: string | null; error: string | null }> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return { imageUrl: null, error: 'Gemini API key not configured' };
    }

    const stylePrompt = STYLE_PROMPTS[style];

    const prompt = `${stylePrompt}
Keep the person's distinctive features like face shape, hairstyle, and overall appearance recognizable. 
Make it suitable as a profile avatar with a clean background. 
The result should be a beautiful, high-quality anime character portrait that captures the essence of the original person.`;

    try {
        const ai = new GoogleGenAI({ apiKey });

        // Remove the data URL prefix if present to get raw base64
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        const contents = [
            { text: prompt },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Data,
                },
            },
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-05-20",
            contents: contents,
        }) as unknown as GeminiResponse;

        // Extract the generated image from the response
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const generatedImageBase64 = part.inlineData.data;
                const mimeType = part.inlineData.mimeType || "image/png";
                return { imageUrl: `data:${mimeType};base64,${generatedImageBase64}`, error: null };
            }
        }

        return { imageUrl: null, error: 'No image generated in response' };
    } catch (error) {
        console.error('Gemini API error:', error);
        return {
            imageUrl: null,
            error: error instanceof Error ? error.message : 'Failed to generate avatar'
        };
    }
}

// Convert base64 to Blob for storage
export function base64ToBlob(base64: string): Blob {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1] || 'image/png';
    const raw = atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}
