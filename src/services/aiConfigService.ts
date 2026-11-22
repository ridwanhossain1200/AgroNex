// AgroNex Bangladesh - AI Configuration & Provider Service
// Manages LLM Provider settings, API Keys, and response preferences securely.

export type AiProviderType = 'server-gemini' | 'demo' | 'gemini' | 'openai' | 'groq' | 'openrouter';
export type AiResponseLanguagePref = 'auto' | 'bn' | 'en';

export interface AiConfig {
  provider: AiProviderType;
  apiKey: string;
  model: string;
  responseLanguage: AiResponseLanguagePref;
  temperature: number;
}

const STORAGE_KEY_CONFIG = 'agronex_ai_config';

export const DEFAULT_AI_CONFIG: AiConfig = {
  provider: 'server-gemini',
  apiKey: '',
  model: 'gemini-3.8-flash',
  responseLanguage: 'auto',
  temperature: 0.6
};

export const PROVIDER_MODELS: Record<AiProviderType, { id: string; name: string }[]> = {
  'server-gemini': [
    { id: 'gemini-3.8-flash', name: 'Google Gemini 3.8 Flash (সার্ভার সিকিউরড Vercel API)' },
    { id: 'gemini-3.5-flash', name: 'Google Gemini 3.5 Flash' }
  ],
  demo: [
    { id: 'offline-expert-engine', name: 'AgroNex Offline Expert Engine (ডেমো)' }
  ],
  gemini: [
    { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (সরাসরি ক্লায়েন্ট এপিআই)' },
    { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash' }
  ],
  openai: [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini (দ্রুত ও সাশ্রয়ী)' },
    { id: 'gpt-4o', name: 'GPT-4o (হাই পারফরম্যান্স)' }
  ],
  groq: [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (আল্ট্রা ফাস্ট)' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' }
  ],
  openrouter: [
    { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5 (OpenRouter)' },
    { id: 'meta-llama/llama-3-8b-instruct', name: 'Llama 3 8B' }
  ]
};

/**
 * Loads AI configuration from browser localStorage.
 */
export function getAiConfig(): AiConfig {
  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return { ...DEFAULT_AI_CONFIG };
    }
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (!raw) return { ...DEFAULT_AI_CONFIG };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_AI_CONFIG,
      ...parsed
    };
  } catch (err) {
    return { ...DEFAULT_AI_CONFIG };
  }
}

/**
 * Saves AI configuration to browser localStorage.
 */
export function saveAiConfig(config: Partial<AiConfig>): AiConfig {
  const current = getAiConfig();
  const updated: AiConfig = {
    ...current,
    ...config
  };
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
    }
  } catch (err) {
    console.error('Failed to save AI config to localStorage:', err);
  }
  return updated;
}

/**
 * Resets AI configuration to default demo mode.
 */
export function resetAiConfig(): AiConfig {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_CONFIG);
    }
  } catch (err) {
    console.error('Failed to reset AI config:', err);
  }
  return { ...DEFAULT_AI_CONFIG };
}

/**
 * Security disclaimer for AgroNex Server-Side Architecture.
 */
export const AI_SECURITY_NOTICE = {
  bn: `🛡️ নিরাপদ সার্ভার আর্কিটেকচার (Server-Secured Gemini):
এগ্রোনেক্স এখন Vercel Serverless Function (/api/chat)-এর মাধ্যমে Google Gemini 1.5 Flash পরিচালনা করে। আপনার আসল Gemini API Key সুরক্ষিতভাবে Vercel Environment Variables (GEMINI_API_KEY)-এ সংরক্ষিত থাকে। ব্রাউজারের নেটওয়ার্ক ট্র্যাফিক, সোর্স কোড কিংবা গিটহাবে কোনো এপিআই কি কখনো দৃশ্যমান বা উন্মুক্ত হয় না।`,
  en: `🛡️ Secure Server Architecture (Server-Secured Gemini):
AgroNex routes all AI requests through a Vercel Serverless Function (/api/chat) executing Google Gemini 1.5 Flash. Your Gemini API key is securely stored in Vercel Environment Variables (GEMINI_API_KEY). No API secrets are exposed to the client browser, bundle output, or GitHub.`
};
