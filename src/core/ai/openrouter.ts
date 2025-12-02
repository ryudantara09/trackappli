/**
 * OpenRouter AI Client
 * 
 * Provides a client for interacting with OpenRouter API, specifically for multimodal models.
 */

interface OpenRouterMessage {
    role: 'user' | 'assistant' | 'system';
    content: string | Array<{
        type: 'text' | 'image_url';
        text?: string;
        image_url?: {
            url: string; // data:image/jpeg;base64,...
        };
    }>;
}

interface OpenRouterResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
    error?: {
        message: string;
    };
}

/**
 * Generate content using OpenRouter API
 * 
 * @param messages - Array of messages to send
 * @param model - Model ID (default: nvidia/nemotron-nano-12b-v2-vl)
 * @returns Generated text response
 */
export async function generateOpenRouterContent(
    messages: OpenRouterMessage[],
    model: string = 'nvidia/nemotron-nano-12b-v2-vl'
): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY environment variable is not set');
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                'X-Title': 'Trakaply CV Extractor',
            },
            body: JSON.stringify({
                model,
                messages,
                temperature: 0.1, // Low temperature for extraction tasks
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                `OpenRouter API failed with status ${response.status}: ${errorData.error?.message || response.statusText}`
            );
        }

        const data: OpenRouterResponse = await response.json();

        if (data.error) {
            throw new Error(`OpenRouter API error: ${data.error.message}`);
        }

        if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
            throw new Error('OpenRouter returned an empty response');
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error('OpenRouter generation error:', error);
        throw error;
    }
}
