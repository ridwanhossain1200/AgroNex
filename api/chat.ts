// AgroNex Bangladesh - Serverless Gemini Agent Backend
// Uses official @google/genai SDK with autonomous tool calling & multi-step orchestration.

import fs from 'fs';
import path from 'path';
import { runAgentOrchestrator } from './agent/orchestrator.ts';

interface ChatHistoryItem {
  id?: string;
  sender: 'user' | 'ai';
  text: string;
}

/**
 * Safely resolves GEMINI_API_KEY from environment or local env files.
 */
function resolveGeminiApiKey(): string | undefined {
  if (process.env.GEMINI_API_KEY !== undefined) {
    const trimmed = process.env.GEMINI_API_KEY.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  // Fallback for local development if process.env was not populated by shell
  const candidatePaths = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), 'src', '.env.local'),
    path.resolve(process.cwd(), '.env')
  ];

  for (const envPath of candidatePaths) {
    try {
      if (fs.existsSync(envPath)) {
        const raw = fs.readFileSync(envPath, 'utf8');
        const match = raw.match(/GEMINI_API_KEY\s*=\s*([^\r\n]+)/);
        if (match && match[1].trim().length > 0) {
          const key = match[1].trim();
          process.env.GEMINI_API_KEY = key; // cache for process
          return key;
        }
      }
    } catch {
      // Ignore read errors
    }
  }

  return undefined;
}

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = resolveGeminiApiKey();

  // Health-check endpoint: verify backend availability without exposing secrets
  if (req.method === 'GET') {
    const isConfigured = !!apiKey && apiKey.length > 0;
    return res.status(200).json({
      status: 'online',
      service: 'AgroNex Agentic AI Backend',
      sdk: '@google/genai',
      geminiConfigured: isConfigured,
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      version: '3.8.0',
      capabilities: [
        'function_calling',
        'multi_step_agent_loop',
        'barc_fertilizer_tools',
        'market_price_retrieval',
        'crop_disease_ipm_diagnostics',
        'fisheries_dissolved_oxygen',
        'livestock_nutrition_ums'
      ]
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      error: 'Only POST requests are accepted.'
    });
  }

  // 1. Validate API Key from Server Environment
  if (!apiKey || apiKey.length === 0) {
    console.warn('[AgroNex Serverless] GEMINI_API_KEY is not configured on server.');
    return res.status(503).json({
      success: false,
      code: 'API_NOT_CONFIGURED',
      error: 'GEMINI_API_KEY is not configured in server environment variables. Please add GEMINI_API_KEY in Vercel Project Settings.',
      isDemoMode: false
    });
  }

  // 2. Validate Request Body
  const { message, history = [], responseLanguage = 'auto' } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      code: 'EMPTY_MESSAGE',
      error: 'Message parameter is required and must be a string.'
    });
  }

  const rawQuery = message.trim();
  if (rawQuery.length === 0) {
    return res.status(400).json({
      success: false,
      code: 'EMPTY_MESSAGE',
      error: 'Message cannot be empty.'
    });
  }

  // Reject excessively long messages (prevent denial of service and token exhaustion)
  if (rawQuery.length > 2000) {
    return res.status(400).json({
      success: false,
      code: 'MESSAGE_TOO_LONG',
      error: 'Message exceeds the maximum allowed limit of 2,000 characters.'
    });
  }

  // Safe server-side diagnostic logging (NEVER LOG API KEY)
  console.log(`[AgroNex Serverless Agent] Incoming query: length=${rawQuery.length}, lang=${responseLanguage}, historyTurns=${Array.isArray(history) ? history.length : 0}`);

  try {
    const agentResult = await runAgentOrchestrator({
      apiKey,
      query: rawQuery,
      history,
      responseLanguage
    });

    console.log(`[AgroNex Serverless Agent] Success: model=${agentResult.model}, toolsExecuted=${agentResult.toolSteps.length}, emergency=${agentResult.isEmergency}`);

    return res.status(200).json({
      success: true,
      reply: agentResult.reply,
      toolSteps: agentResult.toolSteps,
      isEmergency: agentResult.isEmergency,
      actionCard: agentResult.actionCard,
      provider: agentResult.provider,
      model: agentResult.model,
      iterationsRun: agentResult.iterationsRun
    });
  } catch (err: any) {
    console.error('[AgroNex Serverless Agent] Error during orchestrator run:', err?.message || err);

    if (err?.message === 'REQUEST_TIMEOUT') {
      return res.status(504).json({
        success: false,
        code: 'TIMEOUT',
        error: 'AgroNex Agent request timed out. Please try again.',
        isDemoMode: false
      });
    }

    const errMessage = err?.message || 'Agent execution failed';
    const isAuth = /API_KEY_INVALID|UNAUTHENTICATED|permission/i.test(errMessage);
    const isQuota = /RESOURCE_EXHAUSTED|quota|rate limit/i.test(errMessage);

    return res.status(isAuth ? 401 : (isQuota ? 429 : 500)).json({
      success: false,
      code: isAuth ? 'INVALID_API_KEY' : (isQuota ? 'QUOTA_EXCEEDED' : 'API_ERROR'),
      error: isAuth
        ? 'Invalid GEMINI_API_KEY. Please verify your API key in Vercel settings.'
        : (isQuota ? 'Gemini API quota exceeded or high demand. Please try again in a few moments.' : `AgroNex Agent error: ${errMessage}`),
      isDemoMode: false
    });
  }
}
