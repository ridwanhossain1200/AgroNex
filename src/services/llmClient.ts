// AgroNex Bangladesh - Direct LLM Client
// Supports Google Gemini, OpenAI, Groq, and OpenRouter APIs with rich agricultural prompting.

import type { AiConfig } from './aiConfigService.ts';
import type { ChatMessage } from './agriAiService.ts';

export interface LlmCallResult {
  reply: string;
  isEmergency: boolean;
  actionCard?: ChatMessage['actionCard'];
  providerUsed: string;
  modelUsed: string;
  toolSteps?: Array<{
    toolName: string;
    arguments: any;
    result: any;
    summaryText: string;
    timestamp: string;
  }>;
}

const AGRONEX_SYSTEM_PROMPT = `You are AgroNex AI (এগ্রোনেক্স এআই কৃষি সহকারী), a dedicated multilingual agricultural assistant designed to help ordinary farmers and agricultural communities in Bangladesh.

YOUR PURPOSE:
Help farmers with practical, understandable information about crop agriculture, livestock, fisheries, and agricultural marketing.

LANGUAGE UNDERSTANDING & OUTPUT RULES:
- Understand Bengali script, English, Banglish, mixed-language messages, informal spelling, phonetic Bengali, and common spelling mistakes.
- Automatically detect the user's language.
- If the user writes in Banglish, normally respond in simple Bengali script.
- If the user writes in English, respond in English.
- Respect the user's explicit language preference.
- Never reject a question simply because its spelling or grammar is incorrect. Understand the farmer's real problem, not just match keywords.

FOUR CORE KNOWLEDGE DOMAINS:
1. AGRICULTURE: Crops, seeds, soil, irrigation, fertilizer, pests, diseases, harvesting, and cultivation (Follow BARC, BRRI, and BARI standards).
2. LIVESTOCK: Cattle, goats, poultry, animal nutrition, vaccination, disease prevention, and veterinary care (Follow BLRI and DLS guidelines).
3. FISHERIES: Pond management, fish species, fingerlings, feeding, water quality, oxygen, and fish diseases (Follow BFRI and DoF recommendations).
4. MARKETPLACE: Selling agricultural produce, listing products, finding buyers, negotiation, and regional market information.

ANSWER STYLE:
- Use simple, friendly language suitable for ordinary Bangladeshi farmers (আঞ্চলিক কৃষকদের উপযোগী সহজ-সরল ভাষা).
- Give practical steps in a clear order (ধাপে ধাপে করণীয়).
- Explain unfamiliar technical terms in plain terms.
- Ask follow-up questions when important details (crop stage, land area, animal temperature, water depth) are missing.
- Do not give generic answers when the question contains specific symptoms or circumstances.
- Never claim that an uncertain diagnosis is confirmed.

SAFETY & INTEGRITY:
- NEVER invent medicine doses, pesticide quantities, fertilizer rates, or market prices.
- Ask for crop type, growth stage, location, symptoms, and relevant details when needed.
- For serious animal illness, suspected poisoning, severe fish mortality, or dangerous outbreaks, recommend urgent help from qualified professionals and mark as EMERGENCY: [EMERGENCY:true].
- Never present AI output as a replacement for a qualified agricultural or veterinary expert.
- If reliable information is unavailable, clearly say so.
- Do not pretend to have live weather, market-price, or expert-directory data unless the relevant service is actually connected.

ACTION TAGS FOR AGRONEX TOOLS:
If relevant to the question, include exactly one action tag:
[ACTION:fertilizer] -> for land & fertilizer calculations
[ACTION:vet_booking] -> for livestock diseases and veterinary doctors
[ACTION:expert_booking] -> for fisheries & agronomist consultations
[ACTION:market_prices] -> for regional wholesale market rates
[ACTION:troubleshooter] -> for pest & disease troubleshooting`;

/**
 * Extracts emergency flags and action cards from raw LLM text.
 */
function parseLlmOutput(rawText: string, targetLang: 'bn' | 'en'): {
  cleanedText: string;
  isEmergency: boolean;
  actionCard?: ChatMessage['actionCard'];
} {
  let isEmergency = false;
  let actionCard: ChatMessage['actionCard'] = undefined;
  let cleaned = rawText;

  if (cleaned.includes('[EMERGENCY:true]')) {
    isEmergency = true;
    cleaned = cleaned.replace(/\[EMERGENCY:true\]/g, '').trim();
  }

  const actionMatch = cleaned.match(/\[ACTION:(fertilizer|vet_booking|expert_booking|market_prices|troubleshooter)\]/);
  if (actionMatch) {
    const actionType = actionMatch[1];
    cleaned = cleaned.replace(/\[ACTION:[a-z_]+\]/g, '').trim();

    switch (actionType) {
      case 'fertilizer':
        actionCard = {
          type: 'fertilizer',
          labelBn: 'সার ক্যালকুলেটরে সরাসরি হিসাব দেখুন',
          labelEn: 'Open Fertilizer Calculator',
          tab: 'agriculture',
          subtab: 'calculator'
        };
        break;
      case 'vet_booking':
        actionCard = {
          type: 'vet_booking',
          labelBn: 'রেজিস্টার্ড পশু ডাক্তারের সাথে কথা বলুন',
          labelEn: 'Consult Veterinary Surgeon',
          tab: 'experts'
        };
        break;
      case 'expert_booking':
        actionCard = {
          type: 'expert_booking',
          labelBn: 'বিসিএস মৎস্য/কৃষি কর্মকর্তার পরামর্শ নিন',
          labelEn: 'Consult Agricultural Specialist',
          tab: 'experts'
        };
        break;
      case 'market_prices':
        actionCard = {
          type: 'market_prices',
          labelBn: 'আজকের পাইকারি বাজারদর দেখুন',
          labelEn: 'View Live Market Rates',
          tab: 'prices'
        };
        break;
      case 'troubleshooter':
        actionCard = {
          type: 'fertilizer',
          labelBn: 'রোগ ও বালাই নির্দেশিকা দেখুন',
          labelEn: 'Open Pest Troubleshooter',
          tab: 'agriculture',
          subtab: 'troubleshooter'
        };
        break;
    }
  }

  return { cleanedText: cleaned, isEmergency, actionCard };
}

/**
 * Dispatches query to Google Gemini API.
 */
async function callGeminiApi(
  config: AiConfig,
  query: string,
  history: ChatMessage[],
  targetLang: 'bn' | 'en'
): Promise<LlmCallResult> {
  const model = config.model || 'gemini-3.8-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

  const contents: any[] = [];

  // Add system instruction as first user/model pair or systemInstruction
  const systemPromptWithLang = `${AGRONEX_SYSTEM_PROMPT}\nTarget Output Language for this query: ${targetLang === 'bn' ? 'বাংলা (Bengali)' : 'English'}.`;

  // History messages
  const recentHistory = history.slice(-6);
  for (const m of recentHistory) {
    contents.push({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    });
  }

  // Current query
  contents.push({
    role: 'user',
    parts: [{ text: query }]
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: systemPromptWithLang }]
      },
      generationConfig: {
        temperature: config.temperature ?? 0.6,
        maxOutputTokens: 1024
      }
    })
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errBody}`);
  }

  const json = await response.json();
  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!rawText) {
    throw new Error('Gemini API returned an empty response.');
  }

  const parsed = parseLlmOutput(rawText, targetLang);

  return {
    reply: parsed.cleanedText,
    isEmergency: parsed.isEmergency,
    actionCard: parsed.actionCard,
    providerUsed: 'Google Gemini',
    modelUsed: model
  };
}

/**
 * Dispatches query to OpenAI compatible API (OpenAI, Groq, OpenRouter).
 */
async function callOpenAiCompatibleApi(
  config: AiConfig,
  query: string,
  history: ChatMessage[],
  targetLang: 'bn' | 'en'
): Promise<LlmCallResult> {
  let endpoint = 'https://api.openai.com/v1/chat/completions';
  if (config.provider === 'groq') {
    endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  } else if (config.provider === 'openrouter') {
    endpoint = 'https://openrouter.ai/api/v1/chat/completions';
  }

  const systemPromptWithLang = `${AGRONEX_SYSTEM_PROMPT}\nTarget Output Language for this query: ${targetLang === 'bn' ? 'বাংলা (Bengali)' : 'English'}.`;

  const messages: any[] = [
    { role: 'system', content: systemPromptWithLang }
  ];

  // Add recent context
  const recentHistory = history.slice(-6);
  for (const m of recentHistory) {
    messages.push({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    });
  }

  messages.push({ role: 'user', content: query });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.apiKey}`
  };

  if (config.provider === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin || 'https://agronex.vercel.app';
    headers['X-Title'] = 'AgroNex Bangladesh';
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature ?? 0.6,
      max_tokens: 1024
    })
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`${config.provider.toUpperCase()} API Error (${response.status}): ${errBody}`);
  }

  const json = await response.json();
  const rawText = json.choices?.[0]?.message?.content || '';
  if (!rawText) {
    throw new Error(`${config.provider} returned an empty response.`);
  }

  const parsed = parseLlmOutput(rawText, targetLang);

  return {
    reply: parsed.cleanedText,
    isEmergency: parsed.isEmergency,
    actionCard: parsed.actionCard,
    providerUsed: config.provider.toUpperCase(),
    modelUsed: config.model
  };
}

/**
 * Calls the secure AgroNex Serverless API (/api/chat).
 * The server securely holds the GEMINI_API_KEY environment variable.
 */
export async function queryServerAiApi(
  query: string,
  history: ChatMessage[] = [],
  targetLang: 'bn' | 'en' = 'bn'
): Promise<LlmCallResult> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: query,
      history,
      responseLanguage: targetLang
    })
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error || `Server AI endpoint error (${response.status})`);
  }

  const json = await response.json();
  if (!json.success || !json.reply) {
    throw new Error(json.error || 'Invalid response from server AI endpoint');
  }

  return {
    reply: json.reply,
    isEmergency: !!json.isEmergency,
    actionCard: json.actionCard,
    providerUsed: json.provider || 'AgroNex Agentic AI (Google Gemini)',
    modelUsed: json.model || 'gemini-3.8-flash',
    toolSteps: json.toolSteps || []
  };
}

/**
 * Checks serverless backend status and whether GEMINI_API_KEY is configured.
 */
export async function checkServerAiStatus(): Promise<{
  online: boolean;
  geminiConfigured: boolean;
  model: string;
}> {
  try {
    const res = await fetch('/api/chat', { method: 'GET' });
    if (!res.ok) return { online: false, geminiConfigured: false, model: 'gemini-3.8-flash' };
    const json = await res.json();
    return {
      online: json.status === 'online',
      geminiConfigured: !!json.geminiConfigured,
      model: json.model || 'gemini-3.8-flash'
    };
  } catch {
    return { online: false, geminiConfigured: false, model: 'gemini-3.8-flash' };
  }
}

/**
 * Generic entry point to query the configured LLM API.
 */
export async function queryLlmApi(
  config: AiConfig,
  query: string,
  history: ChatMessage[],
  targetLang: 'bn' | 'en'
): Promise<LlmCallResult> {
  if (config.provider === 'server-gemini') {
    return queryServerAiApi(query, history, targetLang);
  }

  if (config.provider === 'gemini') {
    return callGeminiApi(config, query, history, targetLang);
  }

  if (config.provider === 'openai' || config.provider === 'groq' || config.provider === 'openrouter') {
    return callOpenAiCompatibleApi(config, query, history, targetLang);
  }

  throw new Error(`Provider '${config.provider}' is not supported for external LLM calls.`);
}

/**
 * Tests connection to the chosen AI provider.
 */
export async function testAiConnection(config: AiConfig): Promise<{ success: boolean; message: string }> {
  if (config.provider === 'server-gemini') {
    try {
      const status = await checkServerAiStatus();
      if (!status.online) {
        return {
          success: false,
          message: 'Server API endpoint /api/chat is not reachable (check Vercel deployment or run "vercel dev").'
        };
      }
      if (!status.geminiConfigured) {
        return {
          success: false,
          message: 'Server is online, but GEMINI_API_KEY is not configured in Vercel Environment Variables.'
        };
      }
      return {
        success: true,
        message: `Secure Server Connection Verified (Google Gemini ${status.model})`
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Server check failed.'
      };
    }
  }

  if (!config.apiKey && config.provider !== 'demo') {
    return {
      success: false,
      message: 'API Key is empty. Please enter an API key.'
    };
  }

  if (config.provider === 'demo') {
    return {
      success: true,
      message: 'AgroNex Offline Expert Engine is active and ready.'
    };
  }

  try {
    const result = await queryLlmApi(
      config,
      'Test connection: respond with "OK"',
      [],
      'en'
    );
    if (result.reply) {
      return {
        success: true,
        message: `Connection successful (${config.provider} - ${config.model})`
      };
    }
    return {
      success: false,
      message: 'Empty response received from provider.'
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Connection test failed.'
    };
  }
}
