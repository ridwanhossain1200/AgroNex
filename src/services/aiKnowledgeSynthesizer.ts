// AgroNex Bangladesh - Multilingual Agricultural Knowledge Synthesizer
// Provides intelligent contextual reasoning, entity/symptom extraction, and structured dynamic generation.

import type { ChatMessage } from './agriAiService.ts';

export interface SectorAnalysis {
  sector: 'agriculture' | 'livestock' | 'fisheries' | 'marketplace' | 'general';
  entity: string; // e.g., 'rice', 'potato', 'tomato', 'cow', 'fish', 'poultry'
  symptomOrIntent: string; // e.g., 'yellow_leaves', 'brown_spots', 'anorexia', 'fish_gasping', 'pest_attack', 'fertilizer_calc'
  isEmergency: boolean;
  confidence: number;
}

export interface DynamicAiResponse {
  reply: string;
  isEmergency: boolean;
  sector: SectorAnalysis['sector'];
  actionCard?: ChatMessage['actionCard'];
  followUpQuestions: string[];
}

/**
 * Normalizes input text across Bengali script, Banglish, and English.
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[।.,!?/\\()\-_{}[\]:;"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Inspects query + recent chat history to determine sector, entity, and exact symptom.
 */
export function analyzeAgriIntent(query: string, history: ChatMessage[] = []): SectorAnalysis {
  const norm = normalizeText(query);
  
  // Also check previous turn for follow-up questions
  const lastUserTurn = history.filter(m => m.sender === 'user').slice(-2);
  const contextNorm = lastUserTurn.map(m => normalizeText(m.text)).join(' ') + ' ' + norm;

  // 1. CROPS & AGRICULTURE
  const isRice = /dhan|dhaner|rice|paddy|boro|aman|ধান|বোরো|আমন|চারা/.test(norm);
  const isPotato = /alu|potato|আলু|আলুর|নাবি ধসা|লেট ব্লাইট/.test(norm);
  const isTomato = /tomato|tomater|টমেটো|টমেটোর/.test(norm);
  const isBrinjal = /begun|brinjal|eggplant|বেগুন|বেগুনের/.test(norm);
  const isChili = /morich|chili|pepper|মরিচ/.test(norm);
  const isWheat = /gom|wheat|গম/.test(norm);
  const isMaize = /bhutta|maize|corn|ভুট্টা/.test(norm);

  // Symptoms in crops
  const isLateBlight = /late blight|নাবি ধসা|লেট ব্লাইট|blight/.test(norm);
  const hasYellowLeaves = /holud|yellow|হোলদে|হলুদ|chlorosis/.test(norm) && /pata|patay|leaves|leaf|গাছ|গাছের|plant|গাছে/.test(norm);
  const hasBrownSpots = /badami dag|brown spot|brown spots|চোখের মতো দাগ|বাদামি দাগ|বাদামী দাগ|ব্লাস্ট|blast|dag|spots/.test(norm);
  const hasPestAttack = /poka|pokar|pest|insect|pests|পোকা|মাজরা|পোকার|borer|whitefly|মাছি/.test(norm);
  const hasFertilizerCalc = /calculate fertilizer|fertilizer|sar hisab|সারের পরিমাণ|সারের হিসাব|কতটুকু সার|সার মাত্রা|সার প্রয়োগ|সার প্রয়োগ মাত্রা|urea|tsp|mop|dap|ইউরিয়া|টিএসপি|পটাশ/.test(norm) || (/sar|সার|fertilizer/.test(norm) && /matra|মাত্রা|proyog|প্রয়োগ|hisab|হিসাব|koto|কত/.test(norm));

  // 2. LIVESTOCK & VETERINARY
  const isCow = /goru|gorur|cow|cattle|dairy|gavi|গাভী|ষাঁড়|বাছুর|গরু|গরুর|দুধ/.test(norm);
  const isPoultry = /murgi|murgir|chicken|poultry|broiler|layer|মুরগি|মুরগির|পোল্ট্রি/.test(norm);
  const isGoat = /chagol|goat|ছাগল|খাসি/.test(norm);
  
  // Livestock symptoms
  const hasFmdSymptoms = /fmd|ক্ষুরারোগ|ক্ষুরা|খুরের ঘা|খুরে ঘা|মুখে ঘা|লালা|stringy salivation|ফেনা ওঠা/.test(norm);
  const hasAnorexiaWeakness = (/khabar khacche na|khawa bondho|not eating|loss of appetite|durbol|weak|দুর্বল|অরুচি|খাবার খাচ্ছে না|খাওয়া বন্ধ/.test(norm) && (isCow || isPoultry || isGoat || /animal|পশু|প্রাণী/.test(norm)));
  const hasMilkIncrease = /dudh barano|milk production|increase milk|দুধ বৃদ্ধি|দুধ বাড়ানোর|ওলান/.test(norm);
  const hasFatteningFcr = /motatajakoron|fattening|fcr|এফসিআর|মোটাতাজাকরণ|ums/.test(norm);

  // 3. FISHERIES & PONDS
  const isFish = /mach|mas|fish|pukur|pond|fisheries|মাছ|পুকুর|পুকুরে|পোনা|কাতলা|রুই|কার্প|তেলাপিয়া/.test(norm);
  const hasFishGasping = /upore uthe|upore utheche|bheshe utha|veshe utha|gasping|floating|মাছ ভেসে|ভেসে উঠছে|খাবি খাচ্ছে|অক্সিজেন|oxygen|ammonia|অ্যামোনিয়া/.test(norm) && isFish;
  const hasPolyculture = /polyculture|মিশ্র চাষ|৩-স্তর|৩ স্তর|পলিকালচার|কাতলা রুই|কার্প/.test(norm);

  // 4. MARKETPLACE & PRICES
  const isMarket = /dam|daam|price|market|bazar|arat|বাজার দর|পাইকারি|আড়ত|বিক্রি|দরদাম|মণ|দর/.test(norm) && !hasYellowLeaves && !hasBrownSpots;

  // Decision logic
  if (hasFmdSymptoms) {
    return {
      sector: 'livestock',
      entity: 'cattle',
      symptomOrIntent: 'fmd_emergency',
      isEmergency: true,
      confidence: 0.95
    };
  }

  if (hasFishGasping) {
    return {
      sector: 'fisheries',
      entity: 'fish_pond',
      symptomOrIntent: 'fish_gasping_oxygen_deficit',
      isEmergency: true,
      confidence: 0.95
    };
  }

  if (hasAnorexiaWeakness) {
    return {
      sector: 'livestock',
      entity: isPoultry ? 'poultry' : (isGoat ? 'goat' : 'cattle'),
      symptomOrIntent: 'anorexia_weakness',
      isEmergency: true,
      confidence: 0.9
    };
  }

  if (isLateBlight || (isPotato && (hasBrownSpots || /rog|disease|treatment/.test(norm)))) {
    return {
      sector: 'agriculture',
      entity: 'potato',
      symptomOrIntent: 'potato_late_blight',
      isEmergency: true,
      confidence: 0.95
    };
  }

  if (hasYellowLeaves) {
    return {
      sector: 'agriculture',
      entity: isRice ? 'rice' : (isTomato ? 'tomato' : (isPotato ? 'potato' : 'general_crop')),
      symptomOrIntent: 'yellow_leaves',
      isEmergency: false,
      confidence: 0.9
    };
  }

  if (hasBrownSpots) {
    return {
      sector: 'agriculture',
      entity: isRice ? 'rice' : (isPotato ? 'potato' : 'general_crop'),
      symptomOrIntent: 'brown_spots',
      isEmergency: isPotato, // Potato blight can be devastating emergency
      confidence: 0.9
    };
  }

  if (hasPestAttack) {
    return {
      sector: 'agriculture',
      entity: isTomato ? 'tomato' : (isBrinjal ? 'brinjal' : (isRice ? 'rice' : 'vegetables')),
      symptomOrIntent: 'pest_attack',
      isEmergency: false,
      confidence: 0.88
    };
  }

  if (hasFertilizerCalc) {
    return {
      sector: 'agriculture',
      entity: isRice ? 'rice' : (isPotato ? 'potato' : (isMaize ? 'maize' : 'land_calculation')),
      symptomOrIntent: 'fertilizer_calc',
      isEmergency: false,
      confidence: 0.9
    };
  }

  if (hasMilkIncrease) {
    return {
      sector: 'livestock',
      entity: 'dairy_cow',
      symptomOrIntent: 'milk_increase',
      isEmergency: false,
      confidence: 0.88
    };
  }

  if (hasFatteningFcr) {
    return {
      sector: 'livestock',
      entity: 'bull_fattening',
      symptomOrIntent: 'beef_fattening',
      isEmergency: false,
      confidence: 0.88
    };
  }

  if (hasPolyculture) {
    return {
      sector: 'fisheries',
      entity: 'carp_polyculture',
      symptomOrIntent: 'stocking_ratio',
      isEmergency: false,
      confidence: 0.88
    };
  }

  if (isFish) {
    return {
      sector: 'fisheries',
      entity: 'fish_general',
      symptomOrIntent: 'pond_management',
      isEmergency: false,
      confidence: 0.75
    };
  }

  if (isPoultry) {
    return {
      sector: 'livestock',
      entity: 'poultry',
      symptomOrIntent: 'poultry_care',
      isEmergency: false,
      confidence: 0.8
    };
  }

  if (isCow || isGoat) {
    return {
      sector: 'livestock',
      entity: isCow ? 'cattle' : 'goat',
      symptomOrIntent: 'livestock_general',
      isEmergency: false,
      confidence: 0.8
    };
  }

  if (isRice || isPotato || isTomato || isBrinjal || isChili || isWheat || isMaize) {
    return {
      sector: 'agriculture',
      entity: isRice ? 'rice' : (isPotato ? 'potato' : (isTomato ? 'tomato' : 'crop')),
      symptomOrIntent: 'crop_care',
      isEmergency: false,
      confidence: 0.8
    };
  }

  if (isMarket) {
    return {
      sector: 'marketplace',
      entity: 'commodity',
      symptomOrIntent: 'price_inquiry',
      isEmergency: false,
      confidence: 0.8
    };
  }

  // Check context from history if this is a follow-up
  if (/koto|how much|dose|oshudh|oshud|medicine|ki sar|alternative|ar ki|bikalpo|kobe|interval/.test(norm)) {
    if (/dhan|rice|leaf|pata|blast|paddy/.test(contextNorm)) {
      return {
        sector: 'agriculture',
        entity: 'rice',
        symptomOrIntent: 'dosage_followup',
        isEmergency: false,
        confidence: 0.75
      };
    }
    if (/goru|cow|cattle|fmd|khura|dudh/.test(contextNorm)) {
      return {
        sector: 'livestock',
        entity: 'cattle',
        symptomOrIntent: 'dosage_followup',
        isEmergency: false,
        confidence: 0.75
      };
    }
    if (/mach|pukur|fish|pond|oxygen/.test(contextNorm)) {
      return {
        sector: 'fisheries',
        entity: 'fish_pond',
        symptomOrIntent: 'dosage_followup',
        isEmergency: false,
        confidence: 0.75
      };
    }
  }

  return {
    sector: 'general',
    entity: 'general_query',
    symptomOrIntent: 'general_guidance',
    isEmergency: false,
    confidence: 0.5
  };
}

/**
 * Dynamically synthesizes an authentic, tailored agricultural response for Demo Mode.
 * It formats specific step-by-step guidance rather than fixed boilerplate.
 */
export function synthesizeDemoResponse(
  query: string,
  targetLang: 'bn' | 'en',
  history: ChatMessage[] = []
): DynamicAiResponse {
  const analysis = analyzeAgriIntent(query, history);

  // 1. RICE LEAVES YELLOWING (Chlorosis / Nitrogen or Zinc deficiency)
  if (analysis.sector === 'agriculture' && analysis.symptomOrIntent === 'yellow_leaves') {
    if (targetLang === 'bn') {
      return {
        reply: `ধানের গাছের পাতা হলুদ হয়ে যাওয়ার প্রধান ৩টি কারণ ও তার সমাধান:

১. নাইট্রোজেন (ইউরিয়া) সারের ঘাটতি:
• লক্ষণ: নিচের দিকের পুরনো পাতাগুলো প্রথমে হালকা সবুজ থেকে ক্রমান্বয়ে সম্পূর্ণ হলুদ হয়ে যায়।
• করণীয়: জমিতে পরিমিত রস থাকা অবস্থায় শতকে ১ কেজি হারে ইউরিয়া উপরিপ্রয়োগ করুন। অথবা শতকে ৫০ গ্রাম ইউরিয়া ১০ লিটার পানিতে গুলিয়ে শেষ বিকেলে স্প্রে করতে পারেন।

২. দস্তা বা জিংকের ঘাটতি (খয়রা রোগ):
• লক্ষণ: পাতা হলুদ হওয়ার সাথে সাথে তাতে মরচে পড়ার মতো লালচে-বাদামি ছোপ দেখা যায়।
• করণীয়: জিংক সালফেট (মনোহাইড্রেট ৩৬%) প্রতি শতকে ৪০ গ্রাম অথবা কিলেটেড জিংক (যেমন জিংভিট/গ্রোজিন) প্রতি লিটার পানিতে ১ গ্রাম হারে মিশিয়ে শেষ বিকেলে স্প্রে করুন।

৩. অতিরিক্ত পানি বা শিকড় পচা:
• গাছের গোড়ার শিকড় পরীক্ষা করুন। শিকড় কালো হয়ে গন্ধ বের হলে জমি থেকে পানি বের করে দিয়ে ২-৩ দিন রোদ লাগান (জমি শুকানো ও ভিজানো পদ্ধতি)।

জরুরি সতর্কতা: পাতা হলুদ হওয়ার কারণ নিশ্চিত না হয়ে উচ্চমাত্রায় অতিরিক্ত কীটনাশক স্প্রে করবেন না।`,
        isEmergency: false,
        sector: 'agriculture',
        actionCard: {
          type: 'fertilizer',
          labelBn: 'ধানের সুষম সার ক্যালকুলেটর দেখুন',
          labelEn: 'Rice Fertilizer Calculator',
          tab: 'agriculture',
          subtab: 'calculator'
        },
        followUpQuestions: [
          'হলুদ হওয়া কি নিচের পুরনো পাতায় নাকি ওপরের কচি পাতায় শুরু হয়েছে?',
          'পাতায় কি মরচে পড়ার মতো বাদামি ছোপ আছে?',
          'চারা রোপণের কত দিন পার হয়েছে?'
        ]
      };
    } else {
      return {
        reply: `Yellowing of rice plant leaves (Chlorosis) is typically caused by one of three primary issues:

1. Nitrogen Deficiency (Most Common):
• Symptoms: Older, lower leaves turn uniformly pale green then yellow first, while upper leaves stay relatively green.
• Action: Top-dress Urea @ 1.0 kg per decimal with standing soil moisture. Alternatively, foliar spray 50g Urea dissolved in 10L water in late afternoon.

2. Zinc (Zn) Deficiency (Khaira Disease):
• Symptoms: Yellowing accompanied by reddish-brown rust-like speckling/patches across leaf blades.
• Action: Foliar spray Chelated Zinc (e.g., Chelamin/Grozin) @ 1.0g per liter of water, or soil-apply Zinc Sulphate 36% @ 40g per decimal.

3. Root Suffocation / Water Stagnation:
• Pull out 1-2 plants and inspect the roots. If roots are black with a sour sulfur smell, drain the standing water immediately for 2-3 days to aerate the root zone (AWD irrigation).

Precaution: Avoid indiscriminate chemical pesticide spraying before identifying whether the issue is nutritional or fungal.`,
        isEmergency: false,
        sector: 'agriculture',
        actionCard: {
          type: 'fertilizer',
          labelBn: 'Open Rice Fertilizer Calculator',
          labelEn: 'Open Rice Fertilizer Calculator',
          tab: 'agriculture',
          subtab: 'calculator'
        },
        followUpQuestions: [
          'Did the yellowing begin on lower older leaves or top young leaves?',
          'Are there any reddish-brown rust specks visible on the leaves?',
          'How many days ago was the rice transplanted?'
        ]
      };
    }
  }

  // 1.5. POTATO LATE BLIGHT
  if (analysis.sector === 'agriculture' && analysis.symptomOrIntent === 'potato_late_blight') {
    if (targetLang === 'bn') {
      return {
        reply: `⚠️ আলুর প্রধান শত্রু হলো 'নাবি ধসা' বা লেট ব্লাইট রোগ। কুয়াশাচ্ছন্ন ও স্যাঁতসেঁতে আবহাওয়ায় এটি দ্রুত ছড়ায়।

প্রতিকার ও চিকিৎসা:
১. কুয়াশা শুরু হওয়ার সাথে সাথে প্রতিষেধক হিসেবে ম্যানকোজেব (ডাইথেন এম-৪৫ বা ইন্দোফিল) প্রতি লিটার পানিতে ২ গ্রাম মিশিয়ে ৭ দিন পর পর স্প্রে করুন।
২. রোগ আক্রমণ দেখা দিলে সিকিউর (Secure) বা রিডোমিল গোল্ড (Ridomil Gold) প্রতি লিটার পানিতে ২ গ্রাম মিশিয়ে ৩-৪ দিন ব্যবধানে ২ বার গাছ ভিজিয়ে স্প্রে করুন।
৩. সেচ দেওয়ার পর জমিতে পানি জমতে দেবেন না; দ্রুত নিষ্কাশন করুন।
৪. শতকে সুষম সার: ইউরিয়া ১.৪ কেজি, টিএসপি ৯০০ গ্রাম, এমওপি ১.১ কেজি, জিপসাম ৫০০ গ্রাম প্রয়োগ করুন।`,
        isEmergency: true,
        sector: 'agriculture',
        actionCard: {
          type: 'expert_booking',
          labelBn: 'বিসিএস কৃষিবিদের জরুরি পরামর্শ নিন',
          labelEn: 'Consult an Agronomist',
          tab: 'experts'
        },
        followUpQuestions: [
          'পাতায় কি কালচে জলছাপের মতো দাগ ও সাদা ছত্রাকের আস্তরণ দেখা যাচ্ছে?',
          'আবহাওয়া কি বর্তমানে কুয়াশাচ্ছন্ন ও স্যাঁতসেঁতে?'
        ]
      };
    } else {
      return {
        reply: `⚠️ Potato Late Blight (*Phytophthora infestans*) is a critical fungal threat that spreads rapidly during foggy, damp weather.

Recommended Treatment Protocol:
1. Preventive: Spray Mancozeb (Dithane M-45) @ 2.0g per liter of water every 7 days when heavy fog appears.
2. Curative: Once lesions appear on leaves or stems, spray Ridomil Gold MZ or Secure @ 2.0g per liter twice with a 4-day interval. Ensure thorough foliar coverage.
3. Drainage: Ensure water does not stagnate after furrow irrigation; good soil aeration prevents spore germination.
4. Balanced Nutrition per Decimal: Urea 1.4kg, TSP 900g, MoP 1.1kg, Gypsum 500g.`,
        isEmergency: true,
        sector: 'agriculture',
        actionCard: {
          type: 'expert_booking',
          labelBn: 'Consult an Agronomist',
          labelEn: 'Consult an Agronomist',
          tab: 'experts'
        },
        followUpQuestions: [
          'Are there water-soaked dark lesions with white mold on leaf undersides?',
          'What stage are the potato tubers currently in?'
        ]
      };
    }
  }

  // 2. RICE / CROP BROWN SPOTS (Bipolaris oryzae / Brown Spot or Blast)
  if (analysis.sector === 'agriculture' && analysis.symptomOrIntent === 'brown_spots') {
    if (targetLang === 'bn') {
      return {
        reply: `ধানের পাতায় বাদামি দাগ প্রধানত 'বাদামি দাগ রোগ' (Brown Spot) অথবা 'ব্লাস্ট' (Blast) রোগের কারণে হয়।

প্রতিকার ও করণীয়:
১. বাদামি দাগ রোগ (Brown Spot):
• পাতায় ছোট ছোট গোল বা ডিম্বাকৃতির বাদামি দাগ হয় যার কেন্দ্রস্থল ধূসর হয়।
• মাটিতে পটাশ বা সিলিকনের ঘাটতি থাকলে এ রোগ বেশি বাড়ে। জমি তৈরির সময় প্রতি শতকে ৫৫০ গ্রাম এমওপি (পটাশ) সার প্রয়োগ জরুরি।
• আক্রমণ দেখা দিলে ম্যানকোজেব গ্রুপের ছত্রাকনাশক (যেমন ডাইথেন এম-৪৫ বা কম্প্যানিয়ন) প্রতি লিটার পানিতে ২ গ্রাম মিশিয়ে শেষ বিকেলে স্প্রে করুন।

২. ব্লাস্ট রোগ (Blast):
• দাগগুলো দুই প্রান্ত চোখ বা মাকু আকৃতির হয়ে থাকে।
• প্রতিরোধে ট্রাইসাইক্লাজোল গ্রুপের নাটিভো (Nativo 75WG) অথবা ট্রুপার প্রতি লিটার পানিতে ০.৭৫ গ্রাম মিশিয়ে ৫-৭ দিন পর পর ২ বার স্প্রে করুন।

৩. পরিচর্যা: রোগাক্রান্ত জমিতে আপাতত অতিরিক্ত ইউরিয়া সার প্রয়োগ বন্ধ রাখুন; অন্যথায় রোগের প্রকোপ আরও দ্রুত ছড়াবে।`,
        isEmergency: false,
        sector: 'agriculture',
        actionCard: {
          type: 'fertilizer',
          labelBn: 'রোগ প্রতিকার ও স্প্রে গাইড',
          labelEn: 'Pest & Spray Guide',
          tab: 'agriculture',
          subtab: 'troubleshooter'
        },
        followUpQuestions: [
          'দাগগুলো কি গোল ডিম্বাকৃতির নাকি চোখের মতো মাকু আকৃতির?',
          'শীষ বা গিট কি আক্রান্ত হয়েছে?'
        ]
      };
    } else {
      return {
        reply: `Brown spots on rice leaves indicate either fungal Brown Spot (*Bipolaris oryzae*) or Leaf Blast (*Magnaporthe oryzae*).

Recommended Step-by-Step Treatment:
1. For Typical Brown Spot:
• Oval to circular brown lesions with grayish centers. Often aggravated by potassium deficiency.
• Spray Mancozeb (Dithane M-45) or Carbendazim+Mancozeb (Companion) @ 2.0g per liter of water. Ensure thorough canopy wetting.
• Ensure balanced Potash (MoP @ 550g/decimal); avoid nutrient starvation.

2. For Leaf Blast (Diamond/Spindle Lesions):
• Spray Tricyclazole 75% WP (Trooper or Nativo 75WG) @ 0.75g per liter in the late afternoon.
• Repeat after 5-7 days if conditions remain overcast and humid.

3. Cultural Warning:
• Suspend all supplemental Urea application immediately, as high nitrogen accelerates fungal proliferation.`,
        isEmergency: false,
        sector: 'agriculture',
        actionCard: {
          type: 'fertilizer',
          labelBn: 'Open Crop Troubleshooter',
          labelEn: 'Open Crop Troubleshooter',
          tab: 'agriculture',
          subtab: 'troubleshooter'
        },
        followUpQuestions: [
          'Are the lesions circular or diamond/eye-shaped?',
          'Is the flag leaf or panicle neck affected?'
        ]
      };
    }
  }

  // 3. FERTILIZER CALCULATION (Land / BARC Dosage)
  if (analysis.sector === 'agriculture' && analysis.symptomOrIntent === 'fertilizer_calc') {
    if (targetLang === 'bn') {
      return {
        reply: `আপনার জমির জন্য বাংলাদেশ কৃষি গবেষণা কাউন্সিল (BARC) নির্দেশিত সার গণনার নিয়ম:

১. বোরো ধান (প্রতি শতক / Decimal):
• ইউরিয়া: ১.০ কেজি (৩ কিস্তিতে ভাগ করে প্রয়োগ: চারা লাগানোর ১৫, ৩০ ও ৪৫ দিনে)
• টিএসপি / ডিএপি: ৪৫০ গ্রাম (জমি তৈরির শেষ চাষে)
• এমওপি (পটাশ): ৫৫০ গ্রাম (শেষ চাষে ২/৩ অংশ এবং কাইচ থোড় আসার সময় ১/৩ অংশ)
• জিপসাম: ৩০০ গ্রাম এবং জিংক সালফেট: ৪০ গ্রাম (জমি তৈরিতে)

২. আলু (প্রতি শতক):
• ইউরিয়া: ১.৪ কেজি, টিএসপি: ৯০০ গ্রাম, এমওপি: ১.১ কেজি, জিপসাম: ৫০০ গ্রাম, বোরন: ৩০ গ্রাম।

৩. গণনা সূত্র:
মোট সার = (শতক সংখ্যা) × (প্রতি শতকের নির্ধারিত মাত্রা)
উদাহরণ: ৩৩ শতক (১ বিঘা) বোরো ধানের জন্য ইউরিয়া লাগবে ৩৩ কেজি, টিএসপি ১৫ কেজি ও পটাশ ১৮ কেজি।

নিচের বোতাম চেপে এগ্রোনেক্সের ডিজিটাল ক্যালকুলেটরে আপনার জমির সঠিক শতক বা বিঘা বসালে মুহূর্তেই সারের পরিমাণ ও আনুমানিক খরচ বের হয়ে আসবে।`,
        isEmergency: false,
        sector: 'agriculture',
        actionCard: {
          type: 'fertilizer',
          labelBn: 'সরাসরি সার ক্যালকুলেটরে হিসাব করুন',
          labelEn: 'Open Fertilizer Calculator',
          tab: 'agriculture',
          subtab: 'calculator'
        },
        followUpQuestions: [
          'আপনার জমি কত শতক বা বিঘা?',
          'কোন ফসল আবাদ করছেন (ধান, আলু, ভুট্টা নাকি সবজি)?'
        ]
      };
    } else {
      return {
        reply: `Here is the official Bangladesh Agricultural Research Council (BARC) fertilizer calculation standard:

1. Boro Rice (Dosage per Decimal / 435.6 sq ft):
• Urea: 1.0 kg (Split into 3 applications: 15, 30, and 45 days after transplanting)
• TSP / DAP: 450 grams (Basal dose during final land puddling)
• MoP (Potash): 550 grams (2/3 during land preparation, 1/3 at panicle initiation)
• Gypsum: 300 grams & Zinc Sulphate: 40 grams (Basal)

2. Calculation Formula:
Total Fertilizer (kg) = (Land Area in Decimals) × (Standard Rate per Decimal)
Example: For 1 Bigha (33 Decimals) of Boro Rice, you will need 33 kg Urea, ~15 kg TSP, and 18 kg MoP (Est. Cost: ~৳1,950).

3. Instant Calculation Tool:
Click the action card below to open the AgroNex Fertilizer Calculator. Simply select your crop and land size for an automated breakdown.`,
        isEmergency: false,
        sector: 'agriculture',
        actionCard: {
          type: 'fertilizer',
          labelBn: 'Open Fertilizer Calculator',
          labelEn: 'Open Fertilizer Calculator',
          tab: 'agriculture',
          subtab: 'calculator'
        },
        followUpQuestions: [
          'What is your land area (in decimals, bighas, or acres)?',
          'Which specific crop are you planting?'
        ]
      };
    }
  }

  // 4. COW ANOREXIA & WEAKNESS (খাবার না খাওয়া ও দুর্বলতা)
  if (analysis.sector === 'livestock' && analysis.symptomOrIntent === 'anorexia_weakness' && analysis.entity === 'cattle') {
    if (targetLang === 'bn') {
      return {
        reply: `🚨 গরুর খাবার বন্ধ হওয়া এবং দুর্বল হয়ে যাওয়া একটি ঝুঁকিপূর্ণ লক্ষণ। এর প্রধান কারণ ও করণীয়:

১. প্রাথমিক শারীরিক পরীক্ষা:
• শরীরের তাপমাত্রা মাপুন: থার্মোমিটার পায়ুপথে ২ মিনিট রাখুন (গরুর স্বাভাবিক তাপমাত্রা ১০১.৫°F থেকে ১০২.৫°F)। তীব্র জ্বর থাকলে প্যারাসিটামল বোলাস ও ভেটেরিনারি পরামর্শ দিন।
• মুখ ও খুর পরীক্ষা করুন: মুখে কোনো ঘা, ফোসকা বা লালা ঝরছে কি না লক্ষ্য করুন (ক্ষুরারোগের লক্ষণ হতে পারে)।
• পেট ফাঁপা (Bloat): পেটের বাঁ পাশ ফুলে শক্ত হয়ে আছে কি না হাত দিয়ে দেখুন। পেট ফাঁপা থাকলে ডাইমেথিকন সিরাপ খাওয়ান।

২. তাৎক্ষণিক পরিচর্যা:
• গরুকে ছায়াযুক্ত শুকনো স্থানে রাখুন এবং পর্যাপ্ত বিশুদ্ধ খাবার পানি দিন।
• খাবার জোর করে না খাইয়ে পাতলা চিড়ার পানি, ভাতের মাড় ও স্যালাইন দিন।
• অতিরিক্ত শক্ত বা ভেজা দানাদার খাদ্য দেওয়া আপাতত বন্ধ রাখুন।

৩. জরুরি ব্যবস্থা:
গরু যদি ২৪ ঘণ্টার বেশি না খায় বা দাঁড়াতে না পারে, দ্রুত নিবন্ধিত পশু চিকিৎসক (DVM / সার্জন) ডেকে স্যালাইন বা ইনজেকশন নিশ্চিত করুন।`,
        isEmergency: true,
        sector: 'livestock',
        actionCard: {
          type: 'vet_booking',
          labelBn: 'জরুরি পশু ডাক্তার বুক করুন',
          labelEn: 'Emergency Vet Consultation',
          tab: 'experts'
        },
        followUpQuestions: [
          'গরুর শরীরের তাপমাত্রা কত মেপে দেখেছেন কি?',
          'মুখে বা খুরে কি ঘা অথবা মুখ দিয়ে লালা ঝরছে?',
          'পায়খানা কি শক্ত, পাতলা নাকি সম্পূর্ণ বন্ধ?'
        ]
      };
    } else {
      return {
        reply: `🚨 Anorexia (loss of appetite) combined with physical weakness in cattle is an urgent veterinary concern.

Primary Diagnostic Checklist & Immediate Steps:
1. Physical Temperature Check:
• Normal cattle rectal temperature is 101.5°F – 102.5°F. If above 103°F, acute infection or fever is present.
• Inspect Mouth and Hooves: Check for blisters, sores, or stringy salivation (potential Foot & Mouth Disease).
• Assess Rumen / Bloat: Gently press the left flank. If swollen and tight like a drum, rumen acidosis or gas bloat is occurring.

2. Immediate Supportive Care:
• House the animal in a well-ventilated, dry, shaded shed with clean bedding.
• Offer fresh oral rehydration electrolytes, cooled rice starch water, or thin molasses gruel. Avoid force-feeding dry roughage.
• Discontinue spoiled or wet concentrate feed immediately.

3. Veterinary Escalation:
If the cow has been recumbent or completely off feed for over 24 hours, immediate intravenous fluid therapy and antibiotic evaluation by a registered Veterinary Surgeon (DVM) is required.`,
        isEmergency: true,
        sector: 'livestock',
        actionCard: {
          type: 'vet_booking',
          labelBn: 'Emergency Vet Consultation',
          labelEn: 'Emergency Vet Consultation',
          tab: 'experts'
        },
        followUpQuestions: [
          'Have you recorded the animal\'s rectal temperature?',
          'Is there any drooling/salivation or sores on the muzzle/hooves?',
          'What is the condition of dung (diarrhea, normal, or absent)?'
        ]
      };
    }
  }

  // 5. POULTRY ANOREXIA (মুরগির খাওয়া বন্ধ)
  if (analysis.sector === 'livestock' && analysis.entity === 'poultry') {
    if (targetLang === 'bn') {
      return {
        reply: `মুরগির খাবার বন্ধ হওয়া এবং ঝিমানোর সম্ভাব্য কারণ ও জরুরি প্রতিকার:

১. প্রধান কারণসমূহ:
• হিট স্ট্রোক বা অতিরিক্ত তাপমাত্রা: গরমে মুরগি হাঁ করে শ্বাস নেয় ও খাবার খায় না।
• ভাইরাস বা ব্যাকটেরিয়াজনিত রোগ: রাণীক্ষেত (সবুজ বা সাদা চুনা পায়খানা), গামবোরো বা কক্সিডিওসিস (রক্ত আমাশয়)।
• ভেজা বা ছত্রাকযুক্ত লিটার থেকে বিষাক্ত গ্যাস (অ্যামোনিয়া)।

২. তাৎক্ষণিক করণীয়:
• অসুস্থ মুরগিগুলোকে সুস্থ মুরগি থেকে অবিলম্বে আলাদা (কোয়ারেন্টাইন) করুন।
• খাবার পানিতে ইলেকট্রোলাইট স্যালাইন ও ভিটামিন সি মিশিয়ে দিন। এতে শরীরের দুর্বলতা দ্রুত কাটে।
• লিটার পরীক্ষা করুন; ভেজা স্যাঁতসেঁতে লিটার থাকলে তা পরিবর্তন করে শুকনো কাঠের গুঁড়া বা তুষ দিন।
• ঝাঁকে যদি প্রতিদিন মুরগি মারা যেতে থাকে, কালবিলম্ব না করে নিকটস্থ উপজেলা প্রাণিসম্পদ অফিসে মৃত মুরগি নিয়ে পোস্টমর্টেম করান।`,
        isEmergency: true,
        sector: 'livestock',
        actionCard: {
          type: 'vet_booking',
          labelBn: 'পোল্ট্রি ডাক্তারের পরামর্শ নিন',
          labelEn: 'Consult Poultry Vet',
          tab: 'experts'
        },
        followUpQuestions: [
          'মুরগির বয়স কত দিন (ব্রয়লার, লেয়ার নাকি দেশি)?',
          'পায়খানার রঙ কেমন (চুনা সাদা, সবুজ নাকি রক্ত মিশ্রিত)?',
          'মুরগির শ্বাসকষ্ট বা ঘড়ঘড় শব্দ হচ্ছে কি?'
        ]
      };
    } else {
      return {
        reply: `Sudden feed refusal (anorexia) and lethargy in poultry requires prompt biosecurity action:

Probable Causes & Recommended Steps:
1. Common Etiologies:
• Heat Stress: Birds pant with open beaks and drink excessive water while refusing feed.
• Infectious Diseases: Newcastle Disease (greenish/whitish droppings), Gumboro (IBD), or Coccidiosis (bloody diarrhea).
• Toxic Ammonia / Damp Litter: Irritates the respiratory tract and depresses feed intake.

2. Immediate Supportive Measures:
• Quarantine: Separate depressed and drooping birds immediately.
• Hydration: Administer electrolytes with Vitamin C in cool drinking water to combat dehydration and metabolic stress.
• Litter Management: Rake damp litter and replace with dry rice husks to eliminate ammonia fumes.
• Vet Diagnosis: If sudden mortality occurs, send a fresh casualty to the Upazila Livestock Office for post-mortem analysis.`,
        isEmergency: true,
        sector: 'livestock',
        actionCard: {
          type: 'vet_booking',
          labelBn: 'Consult Poultry Specialist',
          labelEn: 'Consult Poultry Specialist',
          tab: 'experts'
        },
        followUpQuestions: [
          'What is the age and breed (Broiler, Layer, or Sonali)?',
          'What color are the droppings (watery white, green, or bloody)?',
          'Are birds showing respiratory rattle or swollen faces?'
        ]
      };
    }
  }

  // 6. FISH GASPING AT SURFACE (মাছ ভেসে ওঠা / অক্সিজেন সংকট)
  if (analysis.sector === 'fisheries' && (analysis.symptomOrIntent === 'fish_gasping_oxygen_deficit' || analysis.symptomOrIntent === 'pond_management')) {
    if (targetLang === 'bn') {
      return {
        reply: `🚨 পুকুরে ভোরে মাছ উপরিভাগে খাবি খাওয়া বা ভেসে থাকা তীব্র অক্সিজেন ঘাটতি (DO < 3.0 mg/L) এবং তলদেশে বিষাক্ত গ্যাসের লক্ষণ।

তাৎক্ষণিক জরুরি পদক্ষেপ (১ ঘণ্টার মধ্যে করুন):
১. পানি সঞ্চালন ও ঢেউ তৈরি:
• পুকুরের এক প্রান্ত থেকে শ্যালো বা সেচ পাম্প চালিয়ে উপর থেকে ঝরনার মতো পানি ফেলুন অথবা বাঁশ বা সাঁতার কেটে পানি প্রচণ্ডভাবে নাড়াচাড়া করুন।
২. রাসায়নিক অক্সিজেন প্রয়োগ:
• বাজারে প্রাপ্ত অক্সিজেন পাউডার বা ট্যাবলেট (যেমন অক্সিফ্লো, অক্সিম্যাক্স বা বায়ো-অক্স) প্রতি শতকে ১০ থেকে ১৫ গ্রাম হারে পুকুরের পানিতে ছিটিয়ে দিন।
৩. খাবার ও সার সম্পূর্ণ বন্ধ:
• পরিস্থিতি স্বাভাবিক না হওয়া পর্যন্ত সব ধরণের পিলেট খাবার, খৈল ও জৈব সার দেওয়া সম্পূর্ণ বন্ধ রাখুন।
৪. বিষাক্ত গ্যাস ও অ্যামোনিয়া দূরীকরণ:
• দুপুরের দিকে প্রতি শতকে ২০০-২৫০ গ্রাম চুন পানিতে গুলে ঠাণ্ডা করে ছিটিয়ে দিন। তলদেশের বিষাক্ত অ্যামোনিয়া গ্যাস শোষণে শতকে ২০০ গ্রাম জিওলাইট প্রয়োগ করুন।`,
        isEmergency: true,
        sector: 'fisheries',
        actionCard: {
          type: 'expert_booking',
          labelBn: 'মৎস্য কর্মকর্তার জরুরি পরামর্শ নিন',
          labelEn: 'Fisheries Emergency Advice',
          tab: 'experts'
        },
        followUpQuestions: [
          'পুকুরের আয়তন কত শতক এবং পানির গভীরতা কত ফুট?',
          'মাছ ভেসে ওঠা কি মূলত ভোরে হয় নাকি সারাদিন থাকে?',
          'পুকুরের পানি কি অতিরিক্ত ঘন সবুজ বা দুর্গন্ধযুক্ত?'
        ]
      };
    } else {
      return {
        reply: `🚨 Fish gasping or crowding at the surface during early morning hours indicates critical Dissolved Oxygen depletion (DO < 3.0 mg/L) or bottom ammonia toxicity.

Immediate Emergency Interventions:
1. Immediate Water Agitation:
• Run water pumps or shallow engines to spray water back into the pond like a fountain. If no pumps are available, manually beat the water with bamboo poles.
2. Broadcast Oxygen Tablets:
• Disperse chemical oxygenators (e.g., Oxyflow, Oxy-A, or Bio-Ox) @ 10-15 grams per decimal across the water surface immediately.
3. Completely Stop Feeding:
• Suspend all supplemental feed pellets, rice bran, and organic fertilizers until water parameters stabilize.
4. Neutralize Toxic Ammonia & Acidity:
• In the afternoon, dissolve Quicklime (CaO) @ 250g per decimal and broadcast evenly. Apply Zeolite @ 200g per decimal to absorb lethal benthic ammonia.`,
        isEmergency: true,
        sector: 'fisheries',
        actionCard: {
          type: 'expert_booking',
          labelBn: 'Fisheries Emergency Advice',
          labelEn: 'Fisheries Emergency Advice',
          tab: 'experts'
        },
        followUpQuestions: [
          'What is the pond surface area (in decimals) and water depth?',
          'Does this occur exclusively in pre-dawn hours or all day long?',
          'Is the water dark green or emitting a foul smell?'
        ]
      };
    }
  }

  // 7. TOMATO / VEGETABLE PEST ATTACK (পোকা আক্রমণ)
  if (analysis.sector === 'agriculture' && analysis.symptomOrIntent === 'pest_attack') {
    if (targetLang === 'bn') {
      return {
        reply: `টমেটো ও সবজি গাছে পোকার আক্রমণ নিয়ন্ত্রণের পরিবেশবান্ধব ও কার্যকর সমাধান:

১. ক্ষতিকর পোকার ধরন শনাক্ত করুন:
• সাদা মাছি ও জাবপোকা: পাতার রস চুষে খায় এবং পাতা কোঁকড়ানো ভাইরাস (Leaf Curl) ছড়ায়।
• ফল ও ডগা ছিদ্রকারী পোকা: ফল ও কচি ডগা ছিদ্র করে ভেতরে পচন ধরায়।

২. সমন্বিত বালাই দমন পদ্ধতি (IPM):
• হলুদ আঠালো ফাঁদ (Yellow Sticky Trap): জমিতে প্রতি ২ শতকে ১টি হলুদ আঠালো ফাঁদ টানিয়ে দিলে সাদা মাছি ও জাবপোকা প্রাকৃতিক উপায়ে মারা যায়।
• সেক্স ফেরোমন ফাঁদ: ফল ছিদ্রকারী পোকা দমনে এটি সবচেয়ে নিরাপদ ও কার্যকর।
• নিমের নির্যাস বা নিমতেল: প্রতি লিটার পানিতে ৫ মিলি নিমতেল ও সামান্য ডিটারজেন্ট মিশিয়ে স্প্রে করলে ডিম ও কচি পোকা ধ্বংস হয়।

৩. রাসায়নিক সমাধান (তীব্র আক্রমণে):
• রসচোষা সাদা মাছির জন্য: ইমিডাক্লোপ্রিড (যেমন টিডো বা অ্যাডমায়ার) প্রতি লিটার পানিতে ০.৫ মিলি স্প্রে করুন।
• ফল ছিদ্রকারী পোকার জন্য: ইমাবেন বা প্রোক্লেম (এমামেকটিন বেনজোয়েট) প্রতি লিটার পানিতে ১ গ্রাম স্প্রে করুন।
সতর্কতা: কীটনাশক স্প্রে করার পর অন্তত ৭-১০ দিন ওই সবজি তোলা বা বিক্রি করা থেকে বিরত থাকুন।`,
        isEmergency: false,
        sector: 'agriculture',
        actionCard: {
          type: 'fertilizer',
          labelBn: 'রোগ ও বালাই নির্দেশিকা দেখুন',
          labelEn: 'Open Pest Guide',
          tab: 'agriculture',
          subtab: 'troubleshooter'
        },
        followUpQuestions: [
          'পোকা কি পাতার রস চুষছে নাকি ফল/ডগা ছিদ্র করছে?',
          'পাতায় কি কোঁকড়ানো ভাব দেখা দিয়েছে?'
        ]
      };
    } else {
      return {
        reply: `Integrated Pest Management (IPM) guidelines for tomato and vegetable insect attacks:

1. Identify the Culprit:
• Whiteflies & Aphids: Sap-sucking insects that cause foliar curling and transmit Tomato Leaf Curl Virus.
• Fruit & Shoot Borers: Caterpillars boring into fruits, causing internal rotting and premature drop.

2. Safe Eco-Friendly IPM Controls:
• Yellow Sticky Traps: Install 1 trap per 2 decimals. Highly effective for capturing flying whiteflies without chemicals.
• Sex Pheromone Traps: Place lure traps at canopy height to capture adult male borer moths.
• Botanical Spray: Spray cold-pressed Neem Oil @ 5ml/L with a few drops of mild soap as a natural repellent.

3. Targeted Chemical Remedies (Severe Infestations):
• For Sucking Pests / Whitefly: Spray Imidacloprid (Admire/Tido) @ 0.5 ml/L on leaf undersides.
• For Fruit Borers: Spray Emamectin Benzoate 5SG (Proclaim) @ 1.0 g/L in late afternoon.
Pre-Harvest Interval (PHI): Observe a strict 7-day waiting period between spraying and harvesting vegetables for human consumption.`,
        isEmergency: false,
        sector: 'agriculture',
        actionCard: {
          type: 'fertilizer',
          labelBn: 'Open Pest Troubleshooter',
          labelEn: 'Open Pest Troubleshooter',
          tab: 'agriculture',
          subtab: 'troubleshooter'
        },
        followUpQuestions: [
          'Are insects boring holes into fruits or sucking sap under leaves?',
          'Is severe leaf curling visible?'
        ]
      };
    }
  }

  // 8. CATTLE FMD EMERGENCY (ক্ষুরারোগ)
  if (analysis.sector === 'livestock' && analysis.symptomOrIntent === 'fmd_emergency') {
    if (targetLang === 'bn') {
      return {
        reply: `🚨 জরুরি সতর্কবার্তা: আপনার গরুর লক্ষণগুলো অত্যন্ত মারাত্মক ও সংক্রামক 'ক্ষুরারোগ' (Foot and Mouth Disease - FMD)-এর সাথে মিলে যাচ্ছে!

তাৎক্ষণিক জরুরি করণীয়:
১. সম্পূর্ণ আলাদা করুন (Strict Isolation):
আক্রান্ত পশুকে সুস্থ পশুদের শেড থেকে অবিলম্বে অন্তত ৫০-১০০ ফুট দূরে আলাদা শুকনো শেডে নিয়ে যান। একজনের ব্যবহৃত পাত্র অন্য গরুতে ব্যবহার করবেন না।
২. ঘা ও ক্ষতের প্রাথমিক চিকিৎসা:
• মুখ ও পায়ের ঘা পটাশিয়াম পারম্যাঙ্গানেট মিশ্রিত হালকা গরম লালচে পানি দিয়ে দিনে ৩ বার ভালো করে ধুয়ে পরিষ্কার করুন।
• মুখের ক্ষতে বোরোগ্লিসারিন বা মধু ও ফিটকিরির গুঁড়া প্রলেপ দিন। পায়ে আলকাতরা বা অ্যান্টিসেপটিক মলম লাগান যাতে মাছি না বসে।
৩. খাদ্য ব্যবস্থাপনা:
• পশু শক্ত খাবার চিবোতে পারে না; তাই নরম পাতলা জাউ, ভাতের মাড়, চিড়ার পানি ও স্যালাইন অল্প অল্প করে খাওয়ান।
৪. সরকারি ভেটেরিনারি সার্জন:
কালবিলম্ব না করে সরকারি উপজেলা প্রাণিসম্পদ হাসপাতাল বা রেজিস্টার্ড পশু চিকিৎসকের সাথে যোগাযোগ করে অ্যান্টিবায়োটিক ও অ্যান্টিহিস্টামিন প্রয়োগ নিশ্চিত করুন।`,
        isEmergency: true,
        sector: 'livestock',
        actionCard: {
          type: 'vet_booking',
          labelBn: 'জরুরি পশু ডাক্তার বুক করুন',
          labelEn: 'Emergency Vet Consultation',
          tab: 'experts'
        },
        followUpQuestions: [
          'খামারের আর কোনো পশুতে কি এই লক্ষণ দেখা যাচ্ছে?',
          'গরুর কি তীব্র জ্বর বা পায়ের খুর খুড়িয়ে হাঁটছে?'
        ]
      };
    } else {
      return {
        reply: `🚨 CRITICAL ALERT: Symptoms strongly indicate acute, highly contagious Foot & Mouth Disease (FMD)!

Immediate Emergency Protocol:
1. Strict Quarantine:
Isolate the infected animal at least 50-100 feet away from the rest of the herd immediately. Do not share feed buckets or cleaning tools.
2. Topical Lesion Decontamination:
• Wash mouth and interdigital hoof ulcers with mild Potassium Permanganate (KMnO4) warm solution 3 times daily.
• Apply Boroglycerin to mouth sores. Dress hoof ulcers with antiseptic zinc oxide ointment to keep flies away.
3. Soft Nutrition:
• The animal cannot chew rough fodder. Provide cooled rice starch gruel, softened wheat bran with molasses, and clean hydration electrolytes.
4. Veterinary Treatment:
Contact a licensed Veterinary Surgeon (DVM) immediately for secondary bacterial infection control (antibiotics and antipyretics).`,
        isEmergency: true,
        sector: 'livestock',
        actionCard: {
          type: 'vet_booking',
          labelBn: 'Emergency Vet Consultation',
          labelEn: 'Emergency Vet Consultation',
          tab: 'experts'
        },
        followUpQuestions: [
          'Are other herd animals exhibiting drooling or lameness?',
          'What is the animal\'s current body temperature?'
        ]
      };
    }
  }

  // 9. GENERAL FALLBACK ADVICE
  if (targetLang === 'bn') {
    return {
      reply: `ধন্যবাদ আপনার কৃষি ও খামার সংক্রান্ত অনুসন্ধানের জন্য। এগ্রোনেক্স এআই সহকারী বাংলা, বাংলিশ ও ইংরেজি তিন ভাষাতেই সঠিক সমাধান প্রদানে সক্ষম।

আপনার প্রশ্নের ধরন অনুযায়ী নিচের সেবাগুলো নির্বাচন করতে পারেন:
• ফসল ও সার: ধানের রোগ, আলুর ব্লাইট, সবজির পোকা বা বিএআরসি অনুমোদিত সুষম সার হিসাব।
• পশু চিকিৎসা: গাভীর দুধ বৃদ্ধি, মোটাতাজাকরণ, পোল্ট্রি টিকা ও জরুরি ক্ষুরারোগের চিকিৎসা।
• মৎস্য বিজ্ঞান: পুকুরে মাছ ভেসে ওঠা, অক্সিজেনের ঘাটতি, অ্যামোনিয়া গ্যাস ও ৩-স্তর বিশিষ্ট মিশ্র চাষ।
• পাইকারি বাজারদর: বগুড়া, রাজশাহী, দিনাজপুর ও ঢাকার আড়তের সরাসরি দরদাম।

আরও স্পষ্ট সমাধান পেতে আপনার ফসল বা প্রাণীর নাম ও নির্দিষ্ট লক্ষণটি লিখুন।`,
      isEmergency: false,
      sector: 'general',
      actionCard: {
        type: 'expert_booking',
        labelBn: 'কৃষি বিশেষজ্ঞের পরামর্শ নিন',
        labelEn: 'Consult an Expert',
        tab: 'experts'
      },
      followUpQuestions: [
        'আপনার প্রশ্নটি কোন খাতের (ফসল, গবাদিপশু, মৎস্য নাকি বাজারদর)?',
        'কী ধরনের লক্ষণ বা সমস্যা লক্ষ্য করছেন?'
      ]
    };
  } else {
    return {
      reply: `Thank you for consulting the AgroNex Multilingual Agricultural Advisor. AgroNex AI supports inquiries in Bengali script, Romanized Banglish, and English across four agricultural disciplines:

1. Crop Agriculture: Pest identification, fertilizer requirements (BARC recommendations), and disease treatment.
2. Livestock & Veterinary: Dairy nutrition, beef fattening FCR, poultry health, and emergency illness protocols.
3. Fisheries: Pond water quality, Dissolved Oxygen depletion, stocking densities, and polyculture management.
4. Marketplace & Prices: Regional wholesale market benchmarks (maund/kg) and direct trading tips.

To receive instant guidance, please specify the crop/animal and the exact symptom you are observing.`,
      isEmergency: false,
      sector: 'general',
      actionCard: {
        type: 'expert_booking',
        labelBn: 'Consult an Expert',
        labelEn: 'Consult an Expert',
        tab: 'experts'
      },
      followUpQuestions: [
        'Which sector does your inquiry concern (Crops, Livestock, Fisheries, or Market)?',
        'What specific symptoms or figures are you working with?'
      ]
    };
  }
}
