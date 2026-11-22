// AgroNex Bangladesh - Real Gemini API Verification Suite
// Directly executes the 5 user-provided agricultural test questions against Google Gemini
// using the official @google/genai SDK.

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

function loadApiKey(): string {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    return process.env.GEMINI_API_KEY.trim();
  }

  const paths = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), 'src', '.env.local'),
    path.resolve(process.cwd(), '.env')
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      const m = content.match(/GEMINI_API_KEY\s*=\s*([^\r\n]+)/);
      if (m && m[1].trim()) {
        return m[1].trim();
      }
    }
  }

  throw new Error('GEMINI_API_KEY not found in process.env or .env.local');
}

const TEST_QUESTIONS = [
  {
    id: 1,
    question: "Why are my rice leaves turning yellow?",
    lang: "English"
  },
  {
    id: 2,
    question: "Amar dhan gach er pata holud hoye jacche, ki korbo?",
    lang: "Banglish (Romanized Bengali)"
  },
  {
    id: 3,
    question: "How do I take care of a sick cow?",
    lang: "English"
  },
  {
    id: 4,
    question: "Amar pukurer mach gula upore uthe thakche keno?",
    lang: "Banglish (Romanized Bengali)"
  },
  {
    id: 5,
    question: "What is the best way to manage tomato pests?",
    lang: "English"
  }
];

const AGRONEX_SYSTEM_INSTRUCTION = `You are AgroNex AI, a dedicated multilingual agricultural assistant designed to help ordinary farmers and agricultural communities in Bangladesh.
Help farmers with practical, understandable information about crop agriculture, livestock, fisheries, and agricultural marketing.
- Understand Bengali script, English, Banglish, mixed-language messages, informal spelling, phonetic Bengali.
- Automatically detect the user's language.
- If the user writes in Banglish, normally respond in simple Bengali script.
- If the user writes in English, respond in English.
- Use simple, friendly language suitable for ordinary Bangladeshi farmers.
- Give practical steps in a clear order.
- Explain unfamiliar technical terms.
- Safety: Never invent medicine doses. Recommend urgent professional help for emergencies.`;

async function main() {
  const apiKey = loadApiKey();
  console.log('\n=============================================================');
  console.log('🤖 AgroNex Live Gemini API Real Request Verification');
  console.log(`🔑 Key loaded: ${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`);
  console.log('=============================================================\n');

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  console.log(`Target Model: ${model}\n`);

  let successCount = 0;

  const candidateModels = [model, 'gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'].filter((v, i, a) => a.indexOf(v) === i);

  for (const t of TEST_QUESTIONS) {
    console.log(`-------------------------------------------------------------`);
    console.log(`TEST #${t.id}: "${t.question}" [${t.lang}]`);

    let success = false;
    for (const m of candidateModels) {
      const startTime = Date.now();
      try {
        console.log(`Calling Gemini (${m})...`);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('TIMEOUT_EXCEEDED')), 10000);
        });

        const generatePromise = ai.models.generateContent({
          model: m,
          contents: t.question,
          config: {
            systemInstruction: AGRONEX_SYSTEM_INSTRUCTION,
            temperature: 0.6
          }
        });

        const response: any = await Promise.race([generatePromise, timeoutPromise]);

        const elapsed = Date.now() - startTime;
        const text = response.text || '';

        if (!text || text.trim().length === 0) {
          throw new Error('Empty response from model');
        }

        console.log(`  ⏱️ Model: ${m} | Response time: ${elapsed}ms | Length: ${text.length} chars`);
        console.log(`  📝 Output Preview (first 250 chars):`);
        console.log(`     ${text.slice(0, 250).replace(/\n/g, ' ')}...`);
        console.log(`  ✅ Verified: Real Gemini-generated dynamic response.`);
        success = true;
        successCount++;
        break;
      } catch (err: any) {
        console.warn(`  ⚠️ Model ${m} attempt failed: ${err?.message?.slice(0, 120)}`);
      }
    }

    if (!success) {
      console.error(`  ❌ All model attempts failed for Test #${t.id}`);
    }
  }

  console.log('\n=============================================================');
  console.log(`Live Verification Complete: ${successCount}/${TEST_QUESTIONS.length} Questions Answered Successfully`);
  console.log('=============================================================\n');

  if (successCount === TEST_QUESTIONS.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
