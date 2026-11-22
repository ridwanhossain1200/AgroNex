// AgroNex Agentic Agricultural Intelligence System - Orchestrator
// Multi-step reasoning & tool execution loop powered by official @google/genai

import { GoogleGenAI } from '@google/genai';
import { AGENT_FUNCTION_DECLARATIONS } from './declarations.ts';
import { executeAgentTool, type ToolExecutionResult } from './tools.ts';

export interface AgentRunParams {
  apiKey: string;
  query: string;
  history?: Array<{ id?: string; sender: 'user' | 'ai'; text: string }>;
  responseLanguage?: 'auto' | 'bn' | 'en';
  preferredModel?: string;
  maxIterations?: number;
}

export interface AgentRunResult {
  reply: string;
  toolSteps: ToolExecutionResult[];
  isEmergency: boolean;
  actionCard?: {
    type: 'fertilizer' | 'vet_booking' | 'expert_booking' | 'market_prices' | 'disease_guide';
    labelBn: string;
    labelEn: string;
    tab: string;
    subtab?: string;
  };
  provider: string;
  model: string;
  iterationsRun: number;
}

const AGRONEX_AGENT_SYSTEM_PROMPT = `You are AgroNex Agent (এগ্রোনেক্স এজেন্টিক কৃষি বুদ্ধিমত্তা), an advanced autonomous agricultural AI agent designed for farmers, livestock owners, and fisheries managers in Bangladesh.

YOUR OPERATIONAL IDENTITY:
You are not a generic conversational chatbot. You are an AGENT equipped with certified domain tools grounded in Bangladesh Agricultural Research Council (BARC), BRRI, BLRI, and BFRI standards.

WHEN TO CALL TOOLS:
- If a question asks about fertilizer or nutrient dosages -> ALWAYS call 'calculate_fertilizer' first with crop and land size.
- If a question asks about market prices, selling price, or mandi/arat rates -> ALWAYS call 'get_regional_market_prices'.
- If a question mentions crop symptoms, diseases, spots, pests, or insects -> ALWAYS call 'diagnose_crop_pest_disease'.
- If a question mentions pond management, gasping fish, oxygen loss, or carp polyculture -> ALWAYS call 'calculate_fisheries_management'.
- If a question mentions cow milk production, fattening, FCR, feed recipe, UMS, or sick animals -> ALWAYS call 'calculate_livestock_nutrition_and_fcr'.
- If a user needs expert assistance or veterinary contact -> call 'search_verified_experts'.
- If a user asks about buying or selling farm produce or current listings -> call 'search_marketplace_inventory'.

REASONING & EVIDENCE RULES:
1. Always ground your final advice in the exact numbers, dosages, and chemicals returned by the tools.
2. If tool results provide specific chemical ingredients (e.g. Tricyclazole, Mancozeb, Imidacloprid, Virtako) or exact kg of fertilizers, state them clearly.
3. If the user writes in Bengali or Banglish, explain the results in clear, respectful, practical Bengali (সহজ-সরল কৃষক উপযোগী বাংলা).
4. If the situation is urgent (e.g., foot & mouth disease, sudden fish mortality, late blight outbreak), include [EMERGENCY:true] in your response.
5. Include relevant action tags at the end of your response if applicable:
   [ACTION:fertilizer]
   [ACTION:vet_booking]
   [ACTION:expert_booking]
   [ACTION:market_prices]
   [ACTION:troubleshooter]
`;

export async function runAgentOrchestrator(params: AgentRunParams): Promise<AgentRunResult> {
  const { apiKey, query, history = [], responseLanguage = 'auto', maxIterations = 5 } = params;

  // Resolve target output language
  const hasBengaliScript = /[\u0980-\u09FF]/.test(query);
  const banglishMarkers = /(amar|amr|dhan|gach|pata|holud|goru|khabar|khacche|durbol|mach|pukur|upore|uthe|poka|murgi|sar|koto|ki|korbo|keno|hoye|hocche|dhorse|lagbe)/i.test(query);

  let targetLang: 'bn' | 'en' = 'bn';
  if (responseLanguage === 'en') {
    targetLang = 'en';
  } else if (responseLanguage === 'bn') {
    targetLang = 'bn';
  } else {
    targetLang = hasBengaliScript || banglishMarkers ? 'bn' : 'en';
  }

  const systemInstruction = `${AGRONEX_AGENT_SYSTEM_PROMPT}\nTarget Output Language for this query: ${targetLang === 'bn' ? 'বাংলা (Bengali)' : 'English'}.`;

  const ai = new GoogleGenAI({ apiKey });

  // Fallback candidate list: gemini-3.8-flash first, then gemini-3.5-flash-lite, then gemini-3.1-flash-lite
  const requestedModel = params.preferredModel || process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const candidateModels = [
    requestedModel,
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite'
  ].filter((v, i, a) => a.indexOf(v) === i);

  const tools = [{ functionDeclarations: AGENT_FUNCTION_DECLARATIONS }];

  let lastError: any = null;
  let activeModelUsed = requestedModel;

  for (const modelToTry of candidateModels) {
    activeModelUsed = modelToTry;
    const toolSteps: ToolExecutionResult[] = [];
    const executedToolSignatures = new Set<string>();

    // Build contents payload
    const contents: any[] = [];

    // Append recent history context (up to last 6 turns)
    if (Array.isArray(history)) {
      const validHistory = history
        .filter(h => h && typeof h.text === 'string' && h.text.trim().length > 0)
        .slice(-6);

      for (const msg of validHistory) {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text.trim().slice(0, 1000) }]
        });
      }
    }

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: query.trim() }]
    });

    try {
      let iteration = 0;
      let finalReply = '';

      while (iteration < maxIterations) {
        iteration++;

        const timeoutMs = 25000;
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), timeoutMs);
        });

        const generatePromise = ai.models.generateContent({
          model: modelToTry,
          contents,
          config: {
            systemInstruction,
            tools,
            temperature: 0.4,
            maxOutputTokens: 1024
          }
        });

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        const functionCalls = response.functionCalls;

        // If no tool calls, Gemini has synthesized its final answer
        if (!functionCalls || functionCalls.length === 0) {
          finalReply = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || '';
          break;
        }

        // Gemini requested tool calls: record candidate turn
        const candidate = response.candidates?.[0];
        if (candidate?.content) {
          contents.push(candidate.content);
        }

        const toolResponseParts: any[] = [];

        for (const call of functionCalls) {
          const sig = `${call.name}:${JSON.stringify(call.args || {})}`;
          if (executedToolSignatures.has(sig)) {
            // Prevent duplicate tool call in the same query loop
            toolResponseParts.push({
              functionResponse: {
                name: call.name,
                response: { info: 'Tool already executed with identical arguments in previous step.' }
              }
            });
            continue;
          }

          executedToolSignatures.add(sig);

          // Execute tool securely
          const toolExecution = executeAgentTool(call.name, call.args || {});
          toolSteps.push(toolExecution);

          toolResponseParts.push({
            functionResponse: {
              name: call.name,
              response: { result: toolExecution.result }
            }
          });
        }

        // In Gemini API, function responses are passed back with role: 'user'
        contents.push({
          role: 'user',
          parts: toolResponseParts
        });
      }

      // If loop finished and we got an answer
      if (finalReply && finalReply.trim().length > 0) {
        // Parse emergency and action cards
        let isEmergency = false;
        let cleanedText = finalReply;

        if (cleanedText.includes('[EMERGENCY:true]') || toolSteps.some(t => t.result?.isEmergency)) {
          isEmergency = true;
          cleanedText = cleanedText.replace(/\[EMERGENCY:true\]/g, '').trim();
        }

        let actionCard: any = undefined;
        const actionMatch = cleanedText.match(/\[ACTION:(fertilizer|vet_booking|expert_booking|market_prices|troubleshooter)\]/);
        if (actionMatch) {
          const actionType = actionMatch[1];
          cleanedText = cleanedText.replace(/\[ACTION:[a-z_]+\]/g, '').trim();

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

        return {
          reply: cleanedText,
          toolSteps,
          isEmergency,
          actionCard,
          provider: 'AgroNex Agentic AI (Google Gemini)',
          model: activeModelUsed,
          iterationsRun: iteration
        };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[AgroNex Agent] Model ${modelToTry} failed:`, err.message?.slice(0, 150));
      // If error is invalid API key or auth, break immediately
      if (/API_KEY_INVALID|UNAUTHENTICATED/i.test(err?.message || '')) {
        break;
      }
      // Otherwise try next candidate model in list
    }
  }

  // If all models failed, throw error to be handled by caller
  throw lastError || new Error('Agent execution failed on all candidate models.');
}
