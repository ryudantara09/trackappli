import { GEMINI_MODEL } from './constants';

export type AIProvider = 'gemini' | 'openrouter';

export interface CVModelOption {
  id: string;
  label: string;
  provider: AIProvider;
  description?: string;
}

export const DEFAULT_CV_MODEL_ID = GEMINI_MODEL ?? 'gemini-1.5-flash';

export const CV_MODEL_OPTIONS: CVModelOption[] = [
  {
    id: DEFAULT_CV_MODEL_ID,
    label: 'Gemini (default)',
    provider: 'gemini',
    description: 'Google Gemini model used for extraction when no override is selected.'
  },
  {
    id: 'arcee-ai/trinity-mini:free',
    label: 'Arcee Trinity Mini',
    provider: 'openrouter',
    description: 'Smaller multilingual model suitable for quick experiments.'
  },
  {
    id: 'alibaba/tongyi-deepresearch-30b-a3b:free',
    label: 'Tongyi DeepResearch 30B',
    provider: 'openrouter',
    description: 'Alibaba Tongyi DeepResearch focused on reasoning tasks.'
  },
  {
    id: 'nvidia/nemotron-nano-12b-v2-vl:free',
    label: 'NVIDIA Nemotron Nano 12B',
    provider: 'openrouter',
    description: 'NVIDIA multimodal model (text focus for extraction).'
  },
  {
    id: 'openai/gpt-oss-20b:free',
    label: 'OpenAI GPT-OSS 20B',
    provider: 'openrouter',
    description: 'Open-source tuned model offered via OpenRouter.'
  },
  {
    id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
    label: 'Dolphin Mistral 24B (Venice)',
    provider: 'openrouter',
    description: 'Dolphin instruction model fine-tuned for structured outputs.'
  },
  {
    id: 'moonshotai/kimi-k2:free',
    label: 'Moonshot Kimi K2',
    provider: 'openrouter',
    description: 'Moonshot AI bilingual assistant model.'
  },
  {
    id: 'google/gemma-3-27b-it:free',
    label: 'Gemma 3 27B IT',
    provider: 'openrouter',
    description: 'Google Gemma instruction-tuned model via OpenRouter.'
  }
];

const OPTION_MAP = new Map(CV_MODEL_OPTIONS.map(option => [option.id, option] as const));

export function getCVModelOption(modelId?: string): CVModelOption | undefined {
  if (!modelId) return undefined;
  return OPTION_MAP.get(modelId);
}
