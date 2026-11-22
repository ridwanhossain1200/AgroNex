// AgroNex Bangladesh - Multilingual Language & Intent Detector
// Accurately recognizes Bengali script, Romanized Banglish, English, and mixed-language inputs.

export type DetectedLanguageType = 'bn' | 'banglish' | 'en' | 'mixed';

export interface LanguageDetectionResult {
  detected: DetectedLanguageType;
  dominant: 'bn' | 'en';
  confidence: number;
  banglishScore: number;
  bengaliScriptScore: number;
  englishScore: number;
}

// Common phonetic Banglish root words and expressions
const BANGLISH_VOCABULARY: Set<string> = new Set([
  // Pronouns, auxiliaries, connectors
  'amar', 'amr', 'apnar', 'apner', 'tumi', 'tomar', 'amra', 'amader', 'tara',
  'ki', 'kibhabe', 'kivabe', 'keno', 'kobe', 'kothay', 'kothaye', 'kon',
  'korbo', 'korbo?', 'korle', 'hobe', 'hobe?', 'hoy', 'hoye', 'hocche', 'hochhe', 'hoche',
  'geche', 'gese', 'dise', 'dibo', 'debo', 'lagbe', 'lagbe?', 'korte', 'parbo', 'parbo?',
  'bolun', 'bolben', 'bujhte', 'parchi', 'dekhun', 'deksen', 'dhorse', 'dhoreche',
  'ache', 'ase', 'ase?', 'nai', 'nei', 'jani', 'janen', 'na', 'ar', 'aar', 'o',
  'er', 'te', 'ye', 'e', 'gula', 'gulo', 'guli', 'ta', 'ti', 'khana', 'khani',
  'shob', 'sob', 'ekhon', 'ajke', 'kalke', 'shokal', 'bikel', 'raat', 'din',
  'upay', 'upaye', 'solution', 'upadesh', 'poramorsho', 'sahajjo', 'help',

  // Crops & Agriculture
  'dhan', 'dhaner', 'dhaner?', 'paddy', 'alu', 'alute', 'aluy', 'potol', 'begun', 'tomato', 'tomater',
  'morich', 'peyaj', 'piaj', 'roshun', 'ada', 'gom', 'bhutta', 'lebu', 'kola', 'aam',
  'gach', 'gacher', 'gash', 'gasher', 'pata', 'patay', 'patai', 'holud', 'holud?',
  'dag', 'daag', 'badami', 'kala', 'shada', 'shukaye', 'shukiye', 'shukna', 'shukie',
  'sar', 'shaar', 'urea', 'tsp', 'mop', 'dap', 'gypsum', 'zinc', 'boron', 'chital',
  'sech', 'shech', 'pani', 'paani', 'jomi', 'jomite', 'bigha', 'shotok', 'decimal',
  'poka', 'pokar', 'majra', 'blast', 'dhasa', 'blight', 'chara', 'bij', 'ropon',
  'katbo', 'tulte', 'folon', 'kom', 'beshi', 'barate', 'chash', 'krishi',

  // Livestock & Dairy
  'goru', 'gorur', 'gavi', 'gaavi', 'shar', 'shaar', 'bokna', 'bachur', 'chagol', 'chagoler',
  'khashi', 'murgi', 'murgir', 'murgi?', 'poultry', 'broiler', 'layer', 'sonali',
  'khamar', 'khamare', 'khabar', 'khawar', 'khawa', 'khacche', 'khay', 'durbol',
  'rogo', 'rog', 'ashukh', 'fola', 'olan', 'dudh', 'doodh', 'jhor', 'jor',
  'lala', 'fena', 'khura', 'khurer', 'mukhe', 'mukher', 'gha', 'paykhana',
  'patla', 'torka', 'fcr', 'motatajakoron', 'fattening', 'ums', 'ghas', 'napier',

  // Fisheries & Ponds
  'mach', 'macer', 'mas', 'masher', 'pukur', 'pukurer', 'pokur', 'pona', 'fry',
  'ruhi', 'rui', 'katla', 'catla', 'mrigal', 'mirgel', 'carp', 'tilapia', 'telapia',
  'shing', 'magur', 'pangash', 'bheshe', 'veshe', 'uthe', 'utheche', 'thake', 'thakche',
  'oxygen', 'ammonia', 'chun', 'shobuj', 'durgondho', 'khabi', 'gasping', 'dube',

  // Marketplace & Trade
  'dam', 'daam', 'koto', 'koto?', 'bikri', 'kena', 'kinbo', 'bechbo',
  'bazar', 'bajaar', 'arat', 'maund', 'mon', 'kg', 'taka', 'tk', 'dor'
]);

// English structural tokens
const ENGLISH_STOPWORDS: Set<string> = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'for', 'with', 'about',
  'what', 'how', 'why', 'when', 'where', 'who', 'should', 'can', 'could', 'would', 'do',
  'does', 'did', 'have', 'has', 'had', 'my', 'your', 'our', 'their', 'plant', 'plants',
  'leaves', 'turning', 'yellow', 'disease', 'fertilizer', 'calculate', 'treatment',
  'symptoms', 'medicine', 'solution', 'advice', 'recommend', 'requirements'
]);

/**
 * Analyzes an input string and returns detailed language detection.
 */
export function detectLanguage(input: string): LanguageDetectionResult {
  const text = (input || '').trim();
  if (!text) {
    return {
      detected: 'bn',
      dominant: 'bn',
      confidence: 1,
      banglishScore: 0,
      bengaliScriptScore: 0,
      englishScore: 0
    };
  }

  // 1. Check for Bengali Unicode script characters: \u0980-\u09FF
  const bengaliScriptChars = (text.match(/[\u0980-\u09FF]/g) || []).length;
  const totalChars = text.replace(/\s+/g, '').length;
  const bengaliRatio = totalChars > 0 ? bengaliScriptChars / totalChars : 0;

  // If majority is Bengali script, it's unmistakably Bengali
  if (bengaliRatio > 0.35) {
    return {
      detected: 'bn',
      dominant: 'bn',
      confidence: Math.min(1, bengaliRatio + 0.3),
      banglishScore: 0,
      bengaliScriptScore: bengaliScriptChars,
      englishScore: 0
    };
  }

  // 2. Tokenize Latin words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0);

  if (words.length === 0) {
    return {
      detected: 'bn',
      dominant: 'bn',
      confidence: 0.5,
      banglishScore: 0,
      bengaliScriptScore: 0,
      englishScore: 0
    };
  }

  let banglishMatchCount = 0;
  let englishMatchCount = 0;

  for (const word of words) {
    if (BANGLISH_VOCABULARY.has(word)) {
      banglishMatchCount += 1;
    } else if (ENGLISH_STOPWORDS.has(word)) {
      englishMatchCount += 1;
    } else {
      // Check for common Banglish suffixes: -er, -te, -e, -gula, -gulo, -ta
      if (
        word.endsWith('er') || 
        word.endsWith('gula') || 
        word.endsWith('gulo') || 
        word.endsWith('cche') || 
        word.endsWith('che') || 
        word.endsWith('bo') || 
        word.endsWith('te')
      ) {
        banglishMatchCount += 0.8;
      }
    }
  }

  const totalRecognized = banglishMatchCount + englishMatchCount;

  // Decide language type
  if (banglishMatchCount >= 1 && englishMatchCount >= 1 && banglishMatchCount / words.length > 0.2 && englishMatchCount / words.length > 0.2) {
    const dominant = banglishMatchCount >= englishMatchCount ? 'bn' : 'en';
    return {
      detected: 'mixed',
      dominant,
      confidence: 0.85,
      banglishScore: banglishMatchCount,
      bengaliScriptScore: 0,
      englishScore: englishMatchCount
    };
  }

  if (banglishMatchCount > 0 && banglishMatchCount >= englishMatchCount) {
    return {
      detected: 'banglish',
      dominant: 'bn',
      confidence: Math.min(1, 0.5 + (banglishMatchCount / words.length) * 0.5),
      banglishScore: banglishMatchCount,
      bengaliScriptScore: 0,
      englishScore: englishMatchCount
    };
  }

  if (englishMatchCount > 0 || (words.length > 0 && banglishMatchCount === 0)) {
    return {
      detected: 'en',
      dominant: 'en',
      confidence: Math.min(1, 0.6 + (englishMatchCount / words.length) * 0.4),
      banglishScore: banglishMatchCount,
      bengaliScriptScore: 0,
      englishScore: englishMatchCount
    };
  }

  return {
    detected: 'bn',
    dominant: 'bn',
    confidence: 0.5,
    banglishScore: banglishMatchCount,
    bengaliScriptScore: 0,
    englishScore: englishMatchCount
  };
}

/**
 * Resolves the final response language based on user preference and input characteristics.
 * - 'bn' preference -> always 'bn'
 * - 'en' preference -> always 'en'
 * - 'auto' preference:
 *    - Bengali script -> 'bn'
 *    - Banglish -> 'bn' (natural conversational Bengali for Bangladeshi farmers)
 *    - English -> 'en'
 *    - Mixed -> dominant language
 */
export function resolveResponseLanguage(
  input: string,
  preference: 'auto' | 'bn' | 'en' = 'auto'
): 'bn' | 'en' {
  if (preference === 'bn') return 'bn';
  if (preference === 'en') return 'en';

  const detection = detectLanguage(input);

  if (detection.detected === 'bn' || detection.detected === 'banglish') {
    return 'bn';
  }

  if (detection.detected === 'en') {
    return 'en';
  }

  // Mixed: return dominant
  return detection.dominant;
}
