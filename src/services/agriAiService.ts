// AgroNex Bangladesh - Comprehensive Agricultural AI Knowledge Engine
// Multilingual: Bengali script (বাংলা), Romanized Banglish, and English.
// Powered by Dynamic Heuristic Synthesis & Genuine LLM API integrations (Gemini, OpenAI, Groq).

import { getAiConfig } from './aiConfigService.ts';
import { detectLanguage, resolveResponseLanguage } from './aiLanguageDetector.ts';
import { synthesizeDemoResponse } from './aiKnowledgeSynthesizer.ts';
import { queryLlmApi } from './llmClient.ts';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isEmergency?: boolean;
  isDemoMode?: boolean;
  isError?: boolean;
  failedQuery?: string;
  providerUsed?: string;
  toolSteps?: Array<{
    toolName: string;
    arguments: any;
    result: any;
    summaryText: string;
    timestamp: string;
  }>;
  followUpQuestions?: string[];
  actionCard?: {
    type: 'fertilizer' | 'vet_booking' | 'expert_booking' | 'market_prices' | 'disease_guide';
    labelBn: string;
    labelEn: string;
    tab: string;
    subtab?: string;
  };
}

export interface AiResponseResult {
  reply: string;
  isEmergency: boolean;
  isDemoMode: boolean;
  providerUsed: string;
  modelUsed: string;
  detectedLanguage: string;
  dominantLanguage: 'bn' | 'en';
  toolSteps?: Array<{
    toolName: string;
    arguments: any;
    result: any;
    summaryText: string;
    timestamp: string;
  }>;
  actionCard?: ChatMessage['actionCard'];
  followUpQuestions?: string[];
  sector?: string;
}

interface KnowledgeTopic {
  keywords: string[];
  titleBn: string;
  titleEn: string;
  answerBn: string;
  answerEn: string;
  isEmergency?: boolean;
  actionCard?: ChatMessage['actionCard'];
}

export const AGRI_KNOWLEDGE_BASE: KnowledgeTopic[] = [
  // 1. RICE / ধান
  {
    keywords: ['ধান', 'ধানের', 'rice', 'paddy', 'boro', 'aman', 'বোরো', 'আমন', 'ব্লাস্ট', 'blast', 'মাজরা', 'bph'],
    titleBn: 'ধান চাষ ও রোগবালাই প্রতিকার',
    titleEn: 'Rice Cultivation & Pest Management',
    answerBn: `ধানের ফলন ভালো পেতে ও রোগ নিয়ন্ত্রণে নিচের পরামর্শগুলো মেনে চলুন:
১. বোরো ধানের জন্য ব্রি ধান-২৮, ২৯, ৮৯ ও ৯২ জাত বেশি ফলনশীল।
২. ব্লাস্ট রোগ (পাতায় চোখের মতো দাগ বা শিষ শুকিয়ে যাওয়া) দেখা দিলে ট্রাইসাইক্লাজোল গ্রুপের নাটিভো (Nativo) বা ট্রুপার প্রতি লিটার পানিতে ০.৭৫ গ্রাম মিশিয়ে শেষ বিকেলে স্প্রে করুন।
৩. মাজরা পোকা দমনে জমি তৈরির সময় কার্বোফুরান (ফুরাডান) অথবা আক্রমণ হলে ভিরতাকো বা ডায়াজিনন অনুমোদিত মাত্রায় প্রয়োগ করুন।
৪. সুষম সার: ইউরিয়া ৩ কিস্তিতে (চারা রোপণের ১৫, ৩০ ও ৪৫ দিনে) উপরিপ্রয়োগ করুন। ডিএপি বা টিএসপি ও পটাশ সার জমি তৈরির শেষ চাষে দিন।`,
    answerEn: `Key recommendations for maximizing paddy yield and disease management:
1. For Boro season, BRRI dhan-28, 29, 89, and 92 provide superior yields in Bangladesh.
2. For Neck Blast disease (diamond-shaped lesions or dried neck), spray Tricyclazole (Nativo 75WG or Trooper) @ 0.75g/liter in the late afternoon.
3. For stem borers, apply Virtako 40WG or Furadan 5G at recommended dosages with standing water.
4. Fertilizer schedule: Split Urea application into 3 equal doses (15, 30, and 45 days after transplanting). Apply TSP/DAP and MoP as basal doses during final land preparation.`,
    isEmergency: false,
    actionCard: {
      type: 'fertilizer',
      labelBn: 'ধানের সার ক্যালকুলেটর দেখুন',
      labelEn: 'Open Rice Fertilizer Calculator',
      tab: 'agriculture',
      subtab: 'calculator'
    }
  },

  // 2. POTATO / আলু
  {
    keywords: ['আলু', 'potato', 'নাবি ধসা', 'late blight', 'আলুর সার', 'পটেটো'],
    titleBn: 'আলুর নাবি ধসা রোগ ও সার প্রয়োগ',
    titleEn: 'Potato Late Blight & Nutrients',
    answerBn: `⚠️ আলুর প্রধান শত্রু হলো 'নাবি ধসা' বা লেট ব্লাইট রোগ। কুয়াশাচ্ছন্ন ও স্যাঁতসেঁতে আবহাওয়ায় এটি দ্রুত ছড়ায়।
প্রতিকার:
১. কুয়াশা শুরু হওয়ার সাথে সাথে প্রতিষেধক হিসেবে ম্যানকোজেব (ডাইথেন এম-৪৫ বা ইন্দোফিল) প্রতি লিটার পানিতে ২ গ্রাম মিশিয়ে ৭ দিন পর পর স্প্রে করুন।
২. রোগ আক্রমণ দেখা দিলে সিকিউর (Secure) বা রিডোমিল গোল্ড (Ridomil Gold) প্রতি লিটার পানিতে ২ গ্রাম মিশিয়ে ৩-৪ দিন ব্যবধানে ২ বার গাছ ভিজিয়ে স্প্রে করুন।
৩. সেচ দেওয়ার পর জমিতে পানি জমতে দেবেন না; দ্রুত নিষ্কাশন করুন।
৪. শতকে সার: ইউরিয়া ১.৪ কেজি, টিএসপি ৯০০ গ্রাম, এমওপি ১.১ কেজি, জিপসাম ৫০০ গ্রাম প্রয়োগ করুন।`,
    answerEn: `⚠️ Potato Late Blight is the most critical threat in damp, foggy winter weather.
Treatment:
1. Preventive: Spray Mancozeb (Dithane M-45) @ 2g/liter every 7 days when heavy fog appears.
2. Curative (if symptoms appear): Spray Ridomil Gold MZ or Secure @ 2g/liter twice with a 4-day interval. Ensure full foliar coverage.
3. Drainage: Ensure water does not stagnate after furrow irrigation.
4. Fertilizer per decimal: Urea 1.4kg, TSP 900g, MoP 1.1kg, Gypsum 500g.`,
    isEmergency: true,
    actionCard: {
      type: 'expert_booking',
      labelBn: 'বিসিএস কৃষিবিদের জরুরি পরামর্শ নিন',
      labelEn: 'Consult an Agronomist',
      tab: 'experts'
    }
  },

  // 3. FERTILIZER CALCULATION / সারের হিসাব
  {
    keywords: ['সার', 'fertilizer', 'ইউরিয়া', 'টিএসপি', 'পটাশ', 'dap', 'urea', 'tsp', 'mop', 'ডোজ', 'হিসাব'],
    titleBn: 'বিএআরসি অনুমোদিত সুষম সার হিসাব',
    titleEn: 'BARC Recommended Fertilizer Schedule',
    answerBn: `বাংলাদেশ কৃষি গবেষণা কাউন্সিল (BARC) নির্দেশিকা অনুযায়ী ফসলের সঠিক সার মাত্রা:
• বোরো ধান (প্রতি শতকে): ইউরিয়া ১ কেজি, টিএসপি ৪৫০ গ্রাম, এমওপি ৫৫০ গ্রাম, জিপসাম ৩০০ গ্রাম, জিংক সালফেট ৪০ গ্রাম।
• আলু (প্রতি শতকে): ইউরিয়া ১.৪ কেজি, টিএসপি ৯০০ গ্রাম, এমওপি ১.১ কেজি, জিপসাম ৫০০ গ্রাম, বোরন ৩০ গ্রাম।
• ভুট্টা (প্রতি শতকে): ইউরিয়া ১.৭ কেজি, টিএসপি ৭৫০ গ্রাম, এমওপি ৮০০ গ্রাম, জিপসাম ৬৫০ গ্রাম।
সতর্কতা: জমিতে অতিরিক্ত ইউরিয়া দিলে পোকার আক্রমণ বাড়ে। সার প্রয়োগের সময় জমিতে পরিমিত রস থাকতে হবে।`,
    answerEn: `According to Bangladesh Agricultural Research Council (BARC) standard dosage:
• Boro Rice (per decimal): Urea 1.0kg, TSP 450g, MoP 550g, Gypsum 300g, Zinc Sulphate 40g.
• Potato (per decimal): Urea 1.4kg, TSP 900g, MoP 1.1kg, Gypsum 500g, Boron 30g.
• Maize (per decimal): Urea 1.7kg, TSP 750g, MoP 800g, Gypsum 650g.
Tip: Avoid excess Urea as it makes plants vulnerable to fungal and insect attacks. Always maintain soil moisture during application.`,
    isEmergency: false,
    actionCard: {
      type: 'fertilizer',
      labelBn: 'সরাসরি সার ক্যালকুলেটরে যান',
      labelEn: 'Open Fertilizer Calculator',
      tab: 'agriculture',
      subtab: 'calculator'
    }
  },

  // 4. DAIRY CATTLE & MILK / গাভীর দুধ বৃদ্ধি ও পরিচর্যা
  {
    keywords: ['গাভী', 'দুধ', 'cow', 'dairy', 'cattle', 'দুগ্ধ', 'ওলান', 'mastitis', 'দুধ বাড়ানো'],
    titleBn: 'গাভীর দুধ উৎপাদন বৃদ্ধি ও স্বাস্থ্য সুরক্ষা',
    titleEn: 'Dairy Cow Milk Production & Care',
    answerBn: `উন্নত জাতের গাভীর (শাহীওয়াল/হোলস্টেইন ফ্রিজিয়ান সংকর) দুধ বৃদ্ধি ও সুস্থতায় করণীয়:
১. সুষম দানাদার খাদ্য: প্রতি ৩ লিটার দুধের জন্য ১ কেজি সুষম দানাদার খাবার (ভুট্টা ভাঙা, গমের ভুসি, খেসারি/সয়াবিন খৈল, ডিসিপি ও লবণ) দিন।
২. পর্যাপ্ত কাঁচা ঘাস: দৈনিক ২০-২৫ কেজি নেপিয়ার বা জার্মান ঘাস সরবরাহ করুন।
৩. ওলান ফোলা বা ম্যাস্টাইটিস রোগ হলে দুধ পাতলা ও রক্ত মিশ্রিত হয়। এটি দ্রুত এন্টিবায়োটিক ও মলম দিয়ে চিকিৎসা করতে হবে। দুধ দোয়ানোর আগে ও পরে পটাশ মিশ্রিত পানিতে ওলান পরিষ্কার করুন।
৪. কৃমিনাশক: প্রতি ৩-৪ মাস অন্তর গাভীকে কৃমিনাশক বড়ি (যেমন অ্যালবেনডাজল) খাওয়ান।`,
    answerEn: `To maximize milk production and maintain dairy cow health:
1. Balanced Concentrate: Feed 1kg of formulated concentrate mix for every 3 liters of milk produced (cracked corn, wheat bran, soybean meal, DCP, and mineral salt).
2. Green Fodder: Provide 20-25kg of fresh Napier or Para grass daily to stimulate rumination.
3. Mastitis Prevention: Clean teats with warm potassium permanganate (antiseptic) solution before and after milking. Disinfect the milking area.
4. Deworming: Administer broad-spectrum anthelmintics (Albendazole/Levamisole) every 3-4 months.`,
    isEmergency: false,
    actionCard: {
      type: 'vet_booking',
      labelBn: 'পশু চিকিৎসকের সাথে কথা বলুন',
      labelEn: 'Book a Vet Consultation',
      tab: 'experts'
    }
  },

  // 5. CATTLE EMERGENCY (FMD / ANTHRAX) / ক্ষুরারোগ ও তড়কা
  {
    keywords: ['ক্ষুরারোগ', 'ক্ষুরা', 'fmd', 'মুখের ঘা', 'মুখে ঘা', 'খুরের ঘা', 'খুরে ঘা', 'তড়কা', 'anthrax', 'পশু রোগ', 'লালা ঝরা', 'লালা'],
    titleBn: '🚨 জরুরি: ক্ষুরারোগ (FMD) ও তড়কা সতর্কবার্তা',
    titleEn: '🚨 Emergency: Foot & Mouth Disease (FMD) & Anthrax',
    answerBn: `🚨 ক্ষুরারোগ বা তড়কা একটি অত্যন্ত সংক্রামক ও মারাত্মক রোগ। 
লক্ষণ: মুখে ও খুরে ঘা, ফোসকা পড়া, অতিরিক্ত ফেনা ওঠা লালা ঝরা, খাবার বন্ধ হওয়া এবং তীব্র জ্বর।
তাৎক্ষণিক করণীয়:
১. আক্রান্ত পশুকে সুস্থ পশুদের থেকে অন্তত ১০০ ফুট দূরে আলাদা শেডে রাখুন।
২. মুখ ও পায়ের ঘা পটাশিয়াম পারম্যাঙ্গানেট মিশ্রিত হালকা গরম পানি দিয়ে দিনে ৩ বার ধৌত করুন।
৩. ক্ষতে বোরাক্স বা গ্লিসারিন লাগান। নরম খাবার (যেমন পাতলা জাউ, চিড়ার পানি) খাওয়ান।
৪. কালবিলম্ব না করে সরকারি উপজেলা প্রাণিসম্পদ কর্মকর্তা বা ভেটেরিনারি সার্জনের পরামর্শে এন্টিবায়োটিক ও অ্যান্টিহিস্টামিন প্রয়োগ করুন।`,
    answerEn: `🚨 CRITICAL ALERT: Foot & Mouth Disease (FMD) is highly contagious!
Symptoms: Blisters/ulcers inside mouth and between hooves, excessive stringy salivation, high fever, inability to walk or eat.
Immediate Actions:
1. Strictly quarantine the affected animal away from the herd.
2. Wash ulcers with mild Potassium Permanganate solution (KMNO4) 3 times daily.
3. Apply Boroglycerin to mouth lesions. Feed soft gruel/rice starch water.
4. Contact a certified veterinary surgeon immediately for systemic antibiotic coverage against secondary infections.`,
    isEmergency: true,
    actionCard: {
      type: 'vet_booking',
      labelBn: 'জরুরি পশু ডাক্তার বুক করুন',
      labelEn: 'Emergency Vet Consultation',
      tab: 'experts'
    }
  },

  // 6. BEEF FATTENING & FCR / গরু মোটাতাজাকরণ ও খাদ্য রূপান্তর
  {
    keywords: ['মোটাতাজাকরণ', 'fattening', 'fcr', 'এফসিআর', 'ষাঁড়', 'ums', 'খাদ্য রূপান্তর'],
    titleBn: 'গরু মোটাতাজাকরণ ও এফসিআর হিসাব',
    titleEn: 'Beef Fattening & FCR Optimization',
    answerBn: `কোরবানি বা মাংসের জন্য ষাঁড় দ্রুত মোটাতাজাকরণের বিজ্ঞানসম্মত পদ্ধতি:
১. ইউরিয়া মোলাসেস খড় (UMS): ১০০ কেজি শুকনো খড়, ৩ কেজি ইউরিয়া, ২০ কেজি চিটাগুড় ও ৩০ লিটার পানি মিশিয়ে প্রক্রিয়া করে খাওয়ালে দ্রুত মাংস বৃদ্ধি পায়।
২. এফসিআর (FCR) বা খাদ্য রূপান্তর হার: আদর্শ এফসিআর ৫.০ থেকে ৬.০। অর্থাৎ ৫-৬ কেজি সুষম খাবার খেলে গরুর ওজন ১ কেজি বাড়বে।
৩. মোটাতাজাকরণ শুরুর ১ম সপ্তাহে কৃমিনাশক ও লিভার টনিক নিশ্চিত করুন।
৪. পরিষ্কার বিশুদ্ধ পানি সার্বক্ষণিক পাত্রে রাখুন (দৈনিক ৩০-৪০ লিটার)।`,
    answerEn: `Scientific guidelines for profitable beef fattening:
1. Urea Molasses Straw (UMS): Prepare with 100kg rice straw, 3kg urea, 20kg molasses, and 30L water for high-energy digestible roughage.
2. Feed Conversion Ratio (FCR): Target FCR is 5.0 to 6.5 (5-6kg of feed consumed produces 1kg of live weight gain).
3. Deworming & Liver Tonic: Administer broad-spectrum dewormers followed by a 7-day liver tonic course at the start of the cycle.
4. Clean ad-libitum water supply: Ensure 30-40 liters of clean drinking water per animal daily.`,
    isEmergency: false,
    actionCard: {
      type: 'vet_booking',
      labelBn: 'খামার ক্যালকুলেটরে যান',
      labelEn: 'Open Livestock Tools',
      tab: 'livestock',
      subtab: 'fcr'
    }
  },

  // 7. FISHERIES - DISSOLVED OXYGEN & AMMONIA / মাছ চাষ ও পানি শোধন
  {
    keywords: ['মাছ', 'পুকুর', 'fish', 'fisheries', 'অক্সিজেন', 'অ্যামোনিয়া', 'মাছ ভেসে ওঠা', 'চুন', 'গ্যাস', 'pond'],
    titleBn: 'পুকুরে মাছ ভেসে ওঠা ও অ্যামোনিয়া গ্যাস দমন',
    titleEn: 'Fish Dissolved Oxygen Crisis & Ammonia Control',
    answerBn: `ভোরের দিকে মাছ পুকুরের উপরিভাগে খাবি খেলে তা তীব্র অক্সিজেন ঘাটতির লক্ষণ।
জরুরি করণীয়:
১. পুকুরে দ্রুত পানির পাম্প চালিয়ে উপর থেকে ঝরনার মতো পানি ফেলুন অথবা সাঁতার কেটে পানি নাড়াচাড়া করুন।
২. পানিতে পর্যাপ্ত ঢেউ তৈরি করতে অ্যারোয়েটর বা অক্সিজেন পাউডার (যেমন অক্সিফ্লো/অক্সিম্যাক্স প্রতি শতকে ১০-১৫ গ্রাম) ছিটিয়ে দিন।
৩. তাৎক্ষণিকভাবে সকল প্রকার মাছের খাবার ও সার দেওয়া বন্ধ রাখুন।
৪. তলদেশের বিষাক্ত গ্যাস বা অ্যামোনিয়া দূর করতে জিওলাইট (প্রতি শতকে ২০০ গ্রাম) এবং প্রতি শতকে ২৫০ গ্রাম চুন পানিতে গুলে প্রয়োগ করুন।`,
    answerEn: `Early morning fish gasping at the water surface indicates critical Dissolved Oxygen (DO < 3.0 mg/L) depletion!
Emergency Actions:
1. Immediately run water pumps to create splashing cascades or agitate the pond water.
2. Broadcast chemical oxygen tablets (Oxyflow/Oxy-A) @ 10-15g per decimal.
3. Completely stop all supplemental feed and organic manure application.
4. For high ammonia / bottom toxic gases: Apply Zeolite @ 200g/decimal and dissolved quicklime (CaO) @ 250g/decimal.`,
    isEmergency: true,
    actionCard: {
      type: 'expert_booking',
      labelBn: 'মৎস্য বিজ্ঞানীর জরুরি পরামর্শ নিন',
      labelEn: 'Consult Fisheries Specialist',
      tab: 'experts'
    }
  },

  // 8. 3-TIER POLYCULTURE / ৩-স্তর বিশিষ্ট মাছ চাষ
  {
    keywords: ['কার্প', 'পলিকালচার', 'মিশ্র চাষ', 'রুই', 'কাতলা', 'মৃগেল', 'polyculture', 'মাছের পোনা'],
    titleBn: '৩-স্তরের কার্প জাতীয় মাছের আদর্শ মিশ্র চাষ',
    titleEn: '3-Tier Carp Polyculture Stocking Ratios',
    answerBn: `পুকুরের সকল স্তরের প্রাকৃতিক খাদ্য কাজে লাগাতে ৩-স্তর বিশিষ্ট মিশ্র চাষ সবচেয়ে লাভজনক:
• ওপরের স্তর (৩৫%): কাতলা ও সিলভার কার্প (প্লাঙ্কটন খায়)।
• মধ্যম স্তর (৩০%): রুই ও গ্রাস কার্প (শেওলা ও কচি ঘাস খায়)।
• তলদেশের স্তর (৩৫%): মৃগেল, মিরর কার্প ও কালবাউশ (জৈব বর্জ্য ও শ্যাওলা খায়)।
শতকপ্রতি পোনা মজুত: ৩-৪ ইঞ্চি সাইজের ৩৫-৪০টি পোনা প্রতি শতকে মজুত করুন। নিয়মিত খাঁটি পিলেট ফিড শরীরের ওজনের ৩-৫% হারে দিন।`,
    answerEn: `Recommended 3-tier stocking ratios to utilize all ecological layers of the pond:
• Surface Layer (35%): Catla & Silver Carp (feed on zooplankton & phytoplankton).
• Middle Column (30%): Rui & Grass Carp (feed on column plankton and soft weeds).
• Bottom Layer (35%): Mrigal, Mirror Carp & Kalbaush (feed on benthic debris & worms).
Density: 35-40 fingerlings (size 3-4 inches) per decimal. Feed commercial sinking pellets at 3-5% of total biomass daily.`,
    isEmergency: false,
    actionCard: {
      type: 'expert_booking',
      labelBn: 'মৎস্য হাব ও স্টক হিসাব দেখুন',
      labelEn: 'View Fisheries Hub',
      tab: 'fisheries',
      subtab: 'ponds'
    }
  },

  // 9. POULTRY CARE / মুরগি পালন
  {
    keywords: ['মুরগি', 'পোল্ট্রি', 'poultry', 'broiler', 'layer', 'ব্রয়লার', 'লেয়ার', 'গামবোরো', 'রাণীক্ষেত'],
    titleBn: 'ব্রয়লার ও দেশি মুরগির রোগ দমন ও খাদ্য',
    titleEn: 'Broiler & Poultry Management',
    answerBn: `পোল্ট্রি খামারে অধিক মুনাফার নিয়মাবলী:
১. ব্রুডিং তাপমাত্রা: ১ম সপ্তাহে ৯৫°F (৩৫°C) দিয়ে শুরু করে প্রতি সপ্তাহে ৫°F করে কমাতে হবে।
২. টিকা শিডিউল: ৩-৫ দিনে রাণীক্ষেত (BCRDV), ৯-১১ দিনে গামবোরো ১ম ডোজ, ১৭-১৯ দিনে গামবোরো বুস্টার এবং ২১-২৪ দিনে রাণীক্ষেত বুস্টার চোখে ড্রপ দিন।
৩. গরমে হিট স্ট্রোক রোধে ঠান্ডা পানিতে ভিটামিন সি ও স্যালাইন মিশিয়ে খাওয়ান।
৪. লিটার শুকনো রাখুন; ভেজা লিটার থেকে কক্সিডিওসিস রোগ হয়।`,
    answerEn: `Essential poultry husbandry guidelines:
1. Brooding Temperature: Start at 95°F (35°C) in week 1, reducing by 5°F each week until ambient temp.
2. Vaccine Schedule: Day 3-5: Newcastle (BCRDV eye drops), Day 10-12: Gumboro (IBD), Day 18-20: Gumboro booster, Day 24: Newcastle booster.
3. Heat Stress: Add Vitamin C and electrolytes to drinking water during hot summer afternoons.
4. Litter Quality: Keep rice husk litter strictly dry to prevent Coccidiosis outbreaks.`,
    isEmergency: false,
    actionCard: {
      type: 'vet_booking',
      labelBn: 'পশু চিকিৎসকের পরামর্শ নিন',
      labelEn: 'Book Poultry Vet',
      tab: 'experts'
    }
  },

  // 10. MARKET PRICES & ARAT / বাজার দর ও আড়ত
  {
    keywords: ['বাজার দর', 'দাম', 'price', 'market', 'আড়ত', 'পাইকারি', 'ধানের দাম', 'আলুর দাম', 'মণ'],
    titleBn: 'আঞ্চলিক পাইকারি বাজারদর ও বিক্রয় পরামর্শ',
    titleEn: 'Regional Market Prices & Direct Selling',
    answerBn: `এগ্রোনেক্স প্রতিদিন বগুড়া, দিনাজপুর, রাজশাহী, ময়মনসিংহ ও ঢাকা কাওরান বাজারের সরাসরি আড়ত দর ট্র্যাক করে:
• ব্রি ধান-২৮: ৳ ১২৮০ - ৳ ১৩৫০ / মণ (আড়তভেদে)।
• মহাস্থান আলু (ডায়মন্ড/কার্ডিনাল): ৳ ১১০০ - ৳ ১২৫০ / মণ।
• কার্প মাছ (রুই ২ কেজি+): ৳ ৩২০ - ৳ ৩৬০ / কেজি।
পরামর্শ: মধ্যস্বত্বভোগী এড়িয়ে সরাসরি এগ্রোনেক্স মার্কেটপ্লেসে লিস্টিং তৈরি করে পাইকারি ক্রেতাদের সাথে দরদাম করুন। নির্ধারিত মূল্যের অ্যালার্ট সেট করে রাখলে দাম বাড়লে ফোনে নোটিফিকেশন পাবেন।`,
    answerEn: `AgroNex monitors daily wholesale benchmark prices from major regional hubs:
• BRRI dhan-28: ৳ 1,280 - ৳ 1,350 / maund (depending on moisture and regional market).
• Diamond / Cardinal Potato: ৳ 1,100 - ৳ 1,250 / maund.
• Large Rui (2kg+): ৳ 320 - ৳ 360 / kg.
Tip: List directly on AgroNex Marketplace to bypass middlemen. Set price alerts to receive instant notifications when market rates cross your target.`,
    isEmergency: false,
    actionCard: {
      type: 'market_prices',
      labelBn: 'আজকের বাজারদর দেখুন',
      labelEn: 'View Today\'s Market Prices',
      tab: 'prices'
    }
  },

  // 11. VEGETABLE PESTS (BRINJAL & TOMATO) / বেগুন ও টমেটোর পোকা
  {
    keywords: ['বেগুন', 'টমেটো', 'পোকা', 'ডগা ও ফল ছিদ্রকারী', 'leaf curl', 'মরিচ', 'পেঁয়াজ'],
    titleBn: 'সবজির ক্ষতিকর পোকা ও রোগ দমন',
    titleEn: 'Vegetable Pest & Disease Control',
    answerBn: `সবজি সুরক্ষার প্রধান প্রাকৃতিক ও জৈব উপায়:
১. বেগুনের ডগা ও ফল ছিদ্রকারী পোকা: আক্রান্ত ডগা হাত দিয়ে ভেঙে মাটির নিচে পুঁতে ফেলুন। জমিতে সেক্স ফেরোমন ফাঁদ বসান। বেশি আক্রমণে ইমাবেন (Emamectin Benzoate) ১ গ্রাম/লিটার স্প্রে করুন।
২. টমেটোর পাতা কোঁকড়ানো (Leaf Curl): সাদা মাছি এ রোগ ছড়ায়। তুন্দা বা ইমিডাক্লোপ্রিড (যেমন টিডো/অ্যাডমায়ার) প্রতি লিটার পানিতে ০.৫ মিলি মিশিয়ে স্প্রে করে সাদা মাছি দমন করুন।
৩. পেঁয়াজের বেগুনি দাগ রোগ: রোভরাল (Rovral 50WP) ২ গ্রাম/লিটার স্প্রে করুন।`,
    answerEn: `Eco-friendly integrated pest management for vegetables:
1. Brinjal Shoot & Fruit Borer: Prune and bury infested wilted shoots immediately. Install sex pheromone traps (1 trap per 2 decimals). In severe cases, apply Emamectin Benzoate 5SG @ 1g/L.
2. Tomato Leaf Curl Virus: Vectored by whiteflies. Control vector insects using Imidacloprid (Admire/Tido) @ 0.5ml/L alongside yellow sticky traps.
3. Onion Purple Blotch: Spray Iprodione (Rovral 50WP) @ 2g/liter on clear mornings.`,
    isEmergency: false,
    actionCard: {
      type: 'fertilizer',
      labelBn: 'রোগ প্রতিকার গাইড দেখুন',
      labelEn: 'Open Pest Troubleshooter',
      tab: 'agriculture',
      subtab: 'troubleshooter'
    }
  }
];

/**
 * Synchronous Agricultural AI response function (backward compatible with audit test suite).
 * Dynamically synthesizes context-aware agricultural intelligence.
 */
export function getAgriAiResponse(
  query: string,
  language: 'bn' | 'en' = 'bn'
): {
  reply: string;
  isEmergency: boolean;
  actionCard?: ChatMessage['actionCard'];
} {
  const targetLang = resolveResponseLanguage(query, language);
  const synthesized = synthesizeDemoResponse(query, targetLang, []);
  
  return {
    reply: synthesized.reply,
    isEmergency: synthesized.isEmergency,
    actionCard: synthesized.actionCard
  };
}

/**
 * Asynchronous Agricultural AI response function.
 * Supports:
 * 1. Multi-turn chat history context
 * 2. Language preference ('auto' | 'bn' | 'en')
 * 3. Genuine LLM APIs (Google Gemini, OpenAI, Groq) when configured
 * 4. Transparent fallback to AgroNex Demo Expert Synthesizer with clear labeling
 */
export async function getAgriAiResponseAsync(
  query: string,
  history: ChatMessage[] = [],
  options?: {
    responseLanguage?: 'auto' | 'bn' | 'en';
    provider?: import('./aiConfigService.ts').AiProviderType;
  }
): Promise<AiResponseResult> {
  const config = getAiConfig();
  const activeProvider = options?.provider || config.provider;
  const pref = options?.responseLanguage || config.responseLanguage || 'auto';
  const targetLang = resolveResponseLanguage(query, pref);
  const langDetection = detectLanguage(query);

  // 1. If configured for Server-Side Secure Gemini (Production & Dev with proxy)
  if (activeProvider === 'server-gemini') {
    try {
      const llmResult = await queryLlmApi(config, query, history, targetLang);
      return {
        reply: llmResult.reply,
        isEmergency: llmResult.isEmergency,
        actionCard: llmResult.actionCard,
        isDemoMode: false,
        providerUsed: llmResult.providerUsed || 'AgroNex Agentic AI (Google Gemini)',
        modelUsed: llmResult.modelUsed || 'gemini-3.8-flash',
        detectedLanguage: langDetection.detected,
        dominantLanguage: langDetection.dominant,
        toolSteps: llmResult.toolSteps
      };
    } catch (err: any) {
      console.error('[AgroNex AI] Server Gemini call failed:', err?.message || err);
      // DO NOT silently fall back to hardcoded FAQ answers in Gemini mode!
      // Bubble the error so the UI displays the genuine error state and retry option.
      throw err;
    }
  }

  // If a genuine client LLM provider with API key is configured
  if (config.provider !== 'demo' && config.apiKey && config.apiKey.trim()) {
    try {
      const llmResult = await queryLlmApi(config, query, history, targetLang);
      return {
        reply: llmResult.reply,
        isEmergency: llmResult.isEmergency,
        actionCard: llmResult.actionCard,
        isDemoMode: false,
        providerUsed: llmResult.providerUsed,
        modelUsed: llmResult.modelUsed,
        detectedLanguage: langDetection.detected,
        dominantLanguage: langDetection.dominant
      };
    } catch (err: any) {
      console.warn('Configured LLM API call failed, falling back to AgroNex Expert Synthesis:', err);
      // Graceful fallback with transparent disclosure
      const fallback = synthesizeDemoResponse(query, targetLang, history);
      const fallbackNote = targetLang === 'bn' 
        ? `(⚠️ নোট: এআই এপিআই সংযোগে ত্রুটি হওয়ায় অফলাইন বিশেষজ্ঞ ইঞ্জিন থেকে উত্তর দেওয়া হয়েছে: ${err.message || 'নেটওয়ার্ক সমস্যা'})\n\n`
        : `(⚠️ Note: AI API connection failed, answered via Offline Expert Engine: ${err.message || 'Network issue'})\n\n`;
      return {
        reply: fallbackNote + fallback.reply,
        isEmergency: fallback.isEmergency,
        actionCard: fallback.actionCard,
        isDemoMode: true,
        providerUsed: 'Offline Fallback',
        modelUsed: 'offline-expert-engine',
        detectedLanguage: langDetection.detected,
        dominantLanguage: langDetection.dominant,
        followUpQuestions: fallback.followUpQuestions,
        sector: fallback.sector
      };
    }
  }

  // Demo mode (Offline Expert Engine) - Clearly labeled
  const synthesized = synthesizeDemoResponse(query, targetLang, history);
  return {
    reply: synthesized.reply,
    isEmergency: synthesized.isEmergency,
    actionCard: synthesized.actionCard,
    isDemoMode: true,
    providerUsed: 'Demo Mode (Offline Expert Engine)',
    modelUsed: 'agronex-knowledge-v2',
    detectedLanguage: langDetection.detected,
    dominantLanguage: langDetection.dominant,
    followUpQuestions: synthesized.followUpQuestions,
    sector: synthesized.sector
  };
}
