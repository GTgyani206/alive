import { OpenRouter } from "@openrouter/sdk";

export type AnimeStyle = 'modern' | 'chibi' | 'ghibli' | 'cyberpunk';

const STYLE_PROMPTS: Record<AnimeStyle, string> = {
    modern: 'in a modern anime art style with vibrant colors, detailed shading, and expressive features like those seen in recent popular anime series',
    chibi: 'in a chibi anime style with an adorable oversized head, tiny body, large sparkly eyes, and cute exaggerated expressions',
    ghibli: 'in a Studio Ghibli inspired art style with soft colors, gentle lighting, hand-painted textures, and a whimsical dreamlike quality',
    cyberpunk: 'in a cyberpunk anime style with neon accents, futuristic elements, tech accessories, holographic effects, and a dark urban aesthetic',
};

// Define interfaces for OpenRouter response structure
interface OpenRouterImage {
    image_url: {
        url: string;
    };
}

interface OpenRouterMessage {
    content?: string;
    images?: OpenRouterImage[];
}

interface OpenRouterChoice {
    message: OpenRouterMessage;
}

interface OpenRouterResult {
    choices: OpenRouterChoice[];
}

// Extended request type to include modalities since it might be missing in SDK types
interface ExtendedChatRequest {
    model: string;
    messages: Array<{
        role: string;
        content: string | Array<{ type: string; text?: string; imageUrl?: { url: string } }>;
    }>;
    modalities?: string[];
}

export async function generateAnimeAvatar(
    imageBase64: string,
    style: AnimeStyle = 'modern'
): Promise<{ imageUrl: string | null; error: string | null }> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return { imageUrl: null, error: 'OpenRouter API key not configured' };
    }

    const stylePrompt = STYLE_PROMPTS[style];

    const prompt = `Transform this person's photo into an anime-style 3D avatar character ${stylePrompt}. 

IMPORTANT: Preserve the FULL composition of the original image. If the person is shown full-body in the photo, generate a FULL-BODY anime character. If it's a portrait, generate a portrait. DO NOT crop or change the framing - maintain the exact same body composition as the input image.

Keep the person's distinctive features like face shape, hairstyle, body proportions, clothing, and overall appearance recognizable. 
Use a clean, simple background that complements the character.
The result should be a beautiful, high-quality anime character that captures the essence and full composition of the original person.`;

    try {
        const imageDataUrl = imageBase64.startsWith('data:')
            ? imageBase64
            : `data:image/jpeg;base64,${imageBase64}`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "AvatarAI",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "openai/gpt-5-image-mini",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": imageDataUrl
                                }
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenRouter raw error:', response.status, errorText);
            throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
        }

        const result = await response.json() as OpenRouterResult;
        console.log('OpenRouter Response:', JSON.stringify(result, null, 2));

        const message = result.choices[0]?.message;

        // Check for images in message.images (if supported) or content if it returns a URL
        if (message?.images && message.images.length > 0) {
            const generatedImage = message.images[0];
            return { imageUrl: generatedImage.image_url.url, error: null };
        }

        // Fallback: Check if the content contains a markdown image or URL
        if (message?.content) {
            console.log("Checking content for image URL:", message.content);
            // Simple regex to find a URL in the text if the model returns it as text
            const urlMatch = message.content.match(/https?:\/\/[^\s)]+/);
            if (urlMatch) {
                return { imageUrl: urlMatch[0], error: null };
            }
        }

        console.log('OpenRouter Response Structure mismatch or empty:', result);
        return { imageUrl: null, error: 'No image generated in response' };
    } catch (error) {
        console.error('OpenRouter API error (Detailed):', error);
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
