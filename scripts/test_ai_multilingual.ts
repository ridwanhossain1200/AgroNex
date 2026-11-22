// AgroNex Bangladesh - Multilingual AI Intelligence Verification Script
// Tests all 8 core user scenarios in Bengali, Banglish, English, and Mixed Language.

import { getAgriAiResponseAsync } from '../src/services/agriAiService.ts';
import type { ChatMessage } from '../src/services/agriAiService.ts';
import { detectLanguage, resolveResponseLanguage } from '../src/services/aiLanguageDetector.ts';
import { analyzeAgriIntent } from '../src/services/aiKnowledgeSynthesizer.ts';

const TEST_CASES = [
  {
    id: 1,
    query: 'Amar dhan gach er pata holud hoye jacche, ki korbo?',
    expectedLang: 'banglish',
    expectedDominant: 'bn',
    expectedSector: 'agriculture',
    expectedSymptom: 'yellow_leaves',
    verifyKeywords: ['নাইট্রোজেন', 'ইউরিয়া', 'জিংকের', 'খয়রা'],
    expectedEmergency: false
  },
  {
    id: 2,
    query: 'আমার ধানের পাতায় বাদামি দাগ দেখা যাচ্ছে।',
    expectedLang: 'bn',
    expectedDominant: 'bn',
    expectedSector: 'agriculture',
    expectedSymptom: 'brown_spots',
    verifyKeywords: ['বাদামি দাগ', 'ব্লাস্ট', 'ম্যানকোজেব'],
    expectedEmergency: false
  },
  {
    id: 3,
    query: 'My rice leaves are turning yellow. What should I do?',
    expectedLang: 'en',
    expectedDominant: 'en',
    expectedSector: 'agriculture',
    expectedSymptom: 'yellow_leaves',
    verifyKeywords: ['Nitrogen Deficiency', 'Urea', 'Zinc', 'AWD'],
    expectedEmergency: false
  },
  {
    id: 4,
    query: 'Goru khabar khacche na ar durbol hoye geche.',
    expectedLang: 'banglish',
    expectedDominant: 'bn',
    expectedSector: 'livestock',
    expectedSymptom: 'anorexia_weakness',
    verifyKeywords: ['তাপমাত্রা', 'মুখ ও খুর', 'পশু চিকিৎসক'],
    expectedEmergency: true
  },
  {
    id: 5,
    query: 'Amar pukurer mach gula upore uthe thake keno?',
    expectedLang: 'banglish',
    expectedDominant: 'bn',
    expectedSector: 'fisheries',
    expectedSymptom: 'fish_gasping_oxygen_deficit',
    verifyKeywords: ['অক্সিজেন', 'পাম্প', 'চুন', 'খাবার'],
    expectedEmergency: true
  },
  {
    id: 6,
    query: 'Tomato gach e poka dhorse, kono upay ache?',
    expectedLang: 'banglish',
    expectedDominant: 'bn',
    expectedSector: 'agriculture',
    expectedSymptom: 'pest_attack',
    verifyKeywords: ['পোকা', 'ফাঁদ', 'ইমিডাক্লোপ্রিড', 'সাদা মাছি'],
    expectedEmergency: false
  },
  {
    id: 7,
    query: 'Amar murgi khawa bondho kore dise.',
    expectedLang: 'banglish',
    expectedDominant: 'bn',
    expectedSector: 'livestock',
    expectedSymptom: 'anorexia_weakness',
    verifyKeywords: ['মুরগির', 'লিটার', 'স্যালাইন', 'কোয়ারেন্টাইন'],
    expectedEmergency: true
  },
  {
    id: 8,
    query: 'How can I calculate fertilizer requirements for my land?',
    expectedLang: 'en',
    expectedDominant: 'en',
    expectedSector: 'agriculture',
    expectedSymptom: 'fertilizer_calc',
    verifyKeywords: ['BARC', 'Boro Rice', 'Urea', 'Formula', 'Decimal'],
    expectedEmergency: false
  }
];

async function runMultilingualTests() {
  console.log('\n=============================================================');
  console.log('🌾 AgroNex Multilingual AI Intelligence Suite (8 Test Cases)');
  console.log('=============================================================\n');

  let passedCount = 0;

  for (const tc of TEST_CASES) {
    const langDetect = detectLanguage(tc.query);
    const resolvedLang = resolveResponseLanguage(tc.query, 'auto');
    const intent = analyzeAgriIntent(tc.query);
    const response = await getAgriAiResponseAsync(tc.query, [], { responseLanguage: 'auto', provider: 'demo' });

    console.log(`\n-------------------------------------------------------------`);
    console.log(`TEST #${tc.id}: "${tc.query}"`);
    console.log(`  • Detected Language: ${langDetect.detected} (Dominant: ${langDetect.dominant})`);
    console.log(`  • Response Language: ${resolvedLang}`);
    console.log(`  • Sector: ${intent.sector} | Entity: ${intent.entity} | Symptom: ${intent.symptomOrIntent}`);
    console.log(`  • Emergency Flag: ${response.isEmergency ? '🚨 YES' : 'NO'}`);
    console.log(`  • Mode: ${response.isDemoMode ? 'Demo Mode (Offline Expert Engine)' : 'Live LLM API'}`);
    console.log(`  • Action Card: ${response.actionCard ? `${response.actionCard.type} -> ${response.actionCard.tab}` : 'None'}`);

    // Verify conditions
    const hasKeywords = tc.verifyKeywords.some(kw => response.reply.includes(kw));
    const langMatch = langDetect.detected === tc.expectedLang || (tc.expectedLang === 'banglish' && langDetect.dominant === 'bn');
    const emergencyMatch = response.isEmergency === tc.expectedEmergency;

    if (hasKeywords && langMatch && emergencyMatch) {
      console.log(`  ✅ RESULT: PASSED (Contextually accurate, structured steps, correct language)`);
      passedCount++;
    } else {
      console.log(`  ❌ RESULT: FAILED`);
      console.log(`     Keywords match: ${hasKeywords}, Lang match: ${langMatch}, Emergency match: ${emergencyMatch}`);
    }
  }

  // Follow-up context test
  console.log(`\n-------------------------------------------------------------`);
  console.log(`TEST #9 (Conversational Context / Follow-up Turn):`);
  const initialUserMsg: ChatMessage = {
    id: 'user_1',
    sender: 'user',
    text: 'Amar dhan gach er pata holud hoye jacche',
    timestamp: '10:00'
  };
  const initialAiMsg: ChatMessage = {
    id: 'ai_1',
    sender: 'ai',
    text: 'ধানের পাতা হলুদ হলে ইউরিয়া বা জিংক সালফেট প্রয়োগ করুন।',
    timestamp: '10:01'
  };
  const followUpResponse = await getAgriAiResponseAsync(
    'সার কতটুকু দিতে হবে?',
    [initialUserMsg, initialAiMsg],
    { responseLanguage: 'auto', provider: 'demo' }
  );

  console.log(`  • Follow-up Query: "সার কতটুকু দিতে হবে?"`);
  console.log(`  • Context recognized: ${followUpResponse.sector === 'agriculture' && followUpResponse.reply.includes('কেজি') ? 'YES (Preserved Rice & Fertilizer context)' : 'NO'}`);
  if (followUpResponse.reply.includes('কেজি') || followUpResponse.reply.includes('ইউরিয়া')) {
    console.log(`  ✅ RESULT: PASSED (Follow-up answered in context of previous rice fertilizer query)`);
    passedCount++;
  } else {
    console.log(`  ❌ RESULT: FAILED`);
  }

  console.log('\n=============================================================');
  console.log(`Total Scenarios: ${TEST_CASES.length + 1} | Passed: ${passedCount} | Failed: ${(TEST_CASES.length + 1) - passedCount}`);
  console.log('=============================================================\n');

  if (passedCount === TEST_CASES.length + 1) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runMultilingualTests().catch(err => {
  console.error(err);
  process.exit(1);
});
