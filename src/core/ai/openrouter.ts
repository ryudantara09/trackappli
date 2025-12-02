const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterGenerateOptions {
  model: string;
  systemPrompt?: string;
}

function buildHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'https://trakapp.li',
    'X-Title': process.env.OPENROUTER_APP_NAME || 'TrakApp.li',
    'Content-Type': 'application/json',
  };
}

function normalizeContent(content: any): string {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map(part => {
        if (typeof part === 'string') return part;
        if (typeof part?.text === 'string') return part.text;
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }

  if (typeof content?.text === 'string') {
    return content.text;
  }

  return '';
}

export async function generateContentWithOpenRouter(
  prompt: string,
  options: OpenRouterGenerateOptions
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set');
  }

  const messages: OpenRouterMessage[] = [];
  if (options.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: buildHeaders(apiKey),
    body: JSON.stringify({
      model: options.model,
      messages,
    }),
  });

  if (!response.ok) {
    let errorDetails: string | undefined;
    try {
      const body = await response.json();
      errorDetails = JSON.stringify(body);
    } catch {
      errorDetails = await response.text();
    }
    throw new Error(`OpenRouter API error: ${response.status} ${errorDetails || ''}`.trim());
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  const normalized = normalizeContent(content);

  if (!normalized) {
    throw new Error('OpenRouter response did not include any content');
  }

  return normalized;
}
