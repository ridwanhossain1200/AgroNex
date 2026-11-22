// AgroNex Agentic Intelligence System - Domain Tools
// Grounded in official BARC, BRRI, BLRI, and BFRI standards & AgroNex verified data.

export interface ToolExecutionResult {
  toolName: string;
  arguments: any;
  result: any;
  summaryText: string;
  timestamp: string;
}

// 1. BARC Fertilizer Dosage & Schedule Calculator
export interface FertilizerCalcArgs {
  crop: string;
  landSize: number;
  unit?: 'decimal' | 'bigha' | 'acre' | 'katha';
}

export function toolCalculateFertilizer(args: FertilizerCalcArgs): {
  crop: string;
  standardLandDecimals: number;
  inputSize: number;
  inputUnit: string;
  nutrients: {
    ureaKg: number;
    tspKg: number;
    mopKg: number;
    gypsumKg: number;
    zincKg: number;
    boronKg?: number;
  };
  applicationSchedule: string[];
  estimatedCostBdt: number;
  advisory: string;
} {
  const unit = args.unit || 'decimal';
  const size = Math.max(0.1, Number(args.landSize) || 1);

  // Convert to standard decimals (শতক)
  let decimals = size;
  if (unit === 'bigha') decimals = size * 33;
  else if (unit === 'acre') decimals = size * 100;
  else if (unit === 'katha') decimals = size * 1.65;

  const cropLower = (args.crop || '').toLowerCase();

  // BARC Recommended Dosage (per decimal in kg)
  let perDecimal = {
    urea: 1.0,
    tsp: 0.45,
    mop: 0.55,
    gypsum: 0.3,
    zinc: 0.04,
    boron: 0
  };

  let schedule: string[] = [];
  let advisory = '';
  let identifiedCrop = 'Boro Rice (বোরো ধান)';

  if (cropLower.includes('potato') || cropLower.includes('alu') || cropLower.includes('আলু')) {
    identifiedCrop = 'Diamond Potato (ডায়মন্ড/কার্ডিনাল আলু)';
    perDecimal = { urea: 1.4, tsp: 0.9, mop: 1.1, gypsum: 0.5, zinc: 0.04, boron: 0.03 };
    schedule = [
      'জমি তৈরির শেষ চাষে: অর্ধেক ইউরিয়া এবং সম্পূর্ণ টিএসপি, এমওপি, জিপসাম, জিংক ও বোরন প্রয়োগ করুন।',
      'বপনের ৩০-৩৫ দিন পর (গাছের গোড়ায় মাটি তোলার সময়): বাকি অর্ধেক ইউরিয়া উপরিপ্রয়োগ করুন।'
    ];
    advisory = 'আলু গাছে অতিরিক্ত ইউরিয়া দিলে নাবি ধসা রোগের প্রকোপ বাড়ে। সেচের পর জমি থেকে অতিরিক্ত পানি নিষ্কাশন নিশ্চিত করুন।';
  } else if (cropLower.includes('maize') || cropLower.includes('vutta') || cropLower.includes('ভুট্টা')) {
    identifiedCrop = 'Hybrid Maize (হাইব্রিড ভুট্টা)';
    perDecimal = { urea: 1.7, tsp: 0.75, mop: 0.8, gypsum: 0.65, zinc: 0.05, boron: 0.02 };
    schedule = [
      'জমি তৈরির শেষ চাষে: এক-তৃতীয়াংশ ইউরিয়া এবং সম্পূর্ণ টিএসপি, জিপসাম, জিংক ও বোরন।',
      'বপনের ২৫-৩০ দিন পর (৮-১০ পাতা অবস্থা): দ্বিতীয় কিস্তির এক-তৃতীয়াংশ ইউরিয়া ও অর্ধেক এমওপি।',
      'বপনের ৫০-৫৫ দিন পর (মোচা আসার পূর্বে): শেষ কিস্তির ইউরিয়া ও বাকি এমওপি উপরিপ্রয়োগ।'
    ];
    advisory = 'ভুট্টায় ইউরিয়া ৩ কিস্তিতে দিলে ফলন ২০-২৫% বৃদ্ধি পায়। ফুল ফোটার সময় মাটিতে পর্যাপ্ত রস থাকা আবশ্যক।';
  } else if (cropLower.includes('tomato') || cropLower.includes('টমেটো')) {
    identifiedCrop = 'Winter/Summer Tomato (উচ্চফলনশীল টমেটো)';
    perDecimal = { urea: 1.2, tsp: 0.8, mop: 0.9, gypsum: 0.4, zinc: 0.03, boron: 0.025 };
    schedule = [
      'মাদায় চারা রোপণের পূর্বে: সম্পূর্ণ টিএসপি, জিপসাম ও গোবর সার মাটির সাথে মিশিয়ে দিন।',
      'চারা লাগানোর ১৫, ৩০ এবং ৪৫ দিন পর: ইউরিয়া ও এমওপি ৩ সমান কিস্তিতে উপরিপ্রয়োগ করুন।'
    ];
    advisory = 'ফল পচা ও বোরন ঘাটতি রোধে ফুল আসার পর সলুবোর বোরন প্রতি লিটার পানিতে ২ গ্রাম মিশিয়ে স্প্রে করতে পারেন।';
  } else if (cropLower.includes('mustard') || cropLower.includes('shorisha') || cropLower.includes('সরিষা')) {
    identifiedCrop = 'Tori-7 / BARI Sarisha-14 (সরিষা)';
    perDecimal = { urea: 0.9, tsp: 0.5, mop: 0.35, gypsum: 0.55, zinc: 0.03, boron: 0.03 };
    schedule = [
      'জমি তৈরির শেষ চাষে: অর্ধেক ইউরিয়া এবং সম্পূর্ণ টিএসপি, এমওপি, জিপসাম, জিংক ও বোরন।',
      'বপনের ২৫-৩০ দিন পর (ফুল আসার আগে প্রথম সেচের পর): অবশিষ্ট অর্ধেক ইউরিয়া উপরিপ্রয়োগ।'
    ];
    advisory = 'সরিষায় সালফার (জিপসাম) ও বোরন অতি গুরুত্বপূর্ণ, যা দানায় তেলের পরিমাণ বাড়ায়।';
  } else if (cropLower.includes('aman') || cropLower.includes('আমন')) {
    identifiedCrop = 'T. Aman Rice (রোপা আমন ধান - ব্রি ধান ৪৯/৮৭)';
    perDecimal = { urea: 0.8, tsp: 0.35, mop: 0.4, gypsum: 0.25, zinc: 0.03, boron: 0 };
    schedule = [
      'শেষ চাষে: সম্পূর্ণ টিএসপি, জিপসাম ও জিংক এবং এক-তৃতীয়াংশ এমওপি।',
      'চারা রোপণের ১৫-২০ দিন পর: প্রথম কিস্তি ইউরিয়া।',
      'চারা রোপণের ৩৫-৪০ দিন পর (কুশি আসার শেষ সময়): দ্বিতীয় কিস্তি ইউরিয়া ও বাকি এমওপি।',
      'কাইচ থোড় আসার ৫-৭ দিন আগে: শেষ কিস্তি ইউরিয়া উপরিপ্রয়োগ।'
    ];
    advisory = 'আমন মৌসুমে বৃষ্টির কারণে ইউরিয়া লিচিং হতে পারে, তাই পরিমিত পানি থাকা অবস্থায় প্রয়োগ করুন।';
  } else {
    // Default Boro Rice (বোরো ধান)
    identifiedCrop = 'Boro Rice (বোরো ধান - ব্রি ধান ২৮/২৯/৮৯/৯২)';
    perDecimal = { urea: 1.0, tsp: 0.45, mop: 0.55, gypsum: 0.3, zinc: 0.04, boron: 0 };
    schedule = [
      'জমি তৈরির শেষ চাষে: সম্পূর্ণ টিএসপি, জিপসাম, জিংক এবং এক-তৃতীয়াংশ এমওপি প্রয়োগ করুন।',
      'চারা রোপণের ১৫ দিন পর: প্রথম কিস্তির ইউরিয়া উপরিপ্রয়োগ করুন।',
      'চারা রোপণের ৩০-৩৫ দিন পর (সর্বোচ্চ কুশি অবস্থায়): দ্বিতীয় কিস্তি ইউরিয়া এবং বাকি এমওপি দিন।',
      'কাইচ থোড় আসার ৫-৭ দিন আগে (৪৫-৫০ দিন): শেষ কিস্তির ইউরিয়া প্রয়োগ করুন।'
    ];
    advisory = 'বোরো ধানে গুটি ইউরিয়া (USG) ব্যবহার করলে সাধারণ ইউরিয়ার তুলনায় ২৫-৩০% ইউরিয়া সাশ্রয় হয়।';
  }

  const ureaTotal = Number((decimals * perDecimal.urea).toFixed(2));
  const tspTotal = Number((decimals * perDecimal.tsp).toFixed(2));
  const mopTotal = Number((decimals * perDecimal.mop).toFixed(2));
  const gypsumTotal = Number((decimals * perDecimal.gypsum).toFixed(2));
  const zincTotal = Number((decimals * perDecimal.zinc).toFixed(2));
  const boronTotal = perDecimal.boron > 0 ? Number((decimals * perDecimal.boron).toFixed(2)) : undefined;

  // Approx standard market rates in BDT: Urea ~27, TSP ~32, MoP ~20, Gypsum ~12, Zinc ~180, Boron ~220
  const cost = Math.round(
    ureaTotal * 27 +
    tspTotal * 32 +
    mopTotal * 20 +
    gypsumTotal * 12 +
    zincTotal * 180 +
    (boronTotal || 0) * 220
  );

  return {
    crop: identifiedCrop,
    inputSize: size,
    inputUnit: unit,
    standardLandDecimals: Number(decimals.toFixed(2)),
    nutrients: {
      ureaKg: ureaTotal,
      tspKg: tspTotal,
      mopKg: mopTotal,
      gypsumKg: gypsumTotal,
      zincKg: zincTotal,
      boronKg: boronTotal
    },
    applicationSchedule: schedule,
    estimatedCostBdt: cost,
    advisory
  };
}

// 2. Regional Wholesale Market Price Query
export interface MarketPriceArgs {
  commodity: string;
  district?: string;
}

export function toolGetRegionalMarketPrices(args: MarketPriceArgs) {
  const comm = (args.commodity || '').toLowerCase();
  const dist = (args.district || '').toLowerCase();

  const mockDb = [
    {
      commodity: 'BRRI dhan-28 (ব্রি ধান-২৮)',
      category: 'Paddy / ধান',
      district: 'Bogura',
      marketLocation: 'মহাস্থান আড়ত ও গোকুল হাট',
      wholesalePrice: '৳ ১,৩২০ / মণ (40kg)',
      retailPrice: '৳ ১,৪২০ / মণ',
      minMaxRange: '৳ ১,২৮০ - ৳ ১,৩৬০ / মণ',
      recordedDate: '2026-11-19',
      trend: 'স্থির (গত ৭ দিনে +৳৩০ বৃদ্ধি)',
      advisory: 'আর্দ্রতা ১৪% এর নিচে থাকলে আড়তদাররা প্রতি মণে ৪০-৫০ টাকা বেশি দর দিচ্ছে।'
    },
    {
      commodity: 'Diamond Potato (ডায়মন্ড গোল আলু)',
      category: 'Potatoes / আলু',
      district: 'Bogura',
      marketLocation: 'মহাস্থান পাইকারি সবজি আড়ত',
      wholesalePrice: '৳ ১,৪২০ / মণ (40kg)',
      retailPrice: '৳ ১,৬০০ / মণ',
      minMaxRange: '৳ ১,৩৮০ - ৳ ১,৪৬০ / মণ',
      recordedDate: '2026-11-19',
      trend: 'ঊর্ধ্বমুখী (চাহিদা বৃদ্ধি পাওয়ায় স্থিতিশীল)',
      advisory: 'কোল্ড স্টোরেজের আলু শেষ হওয়ায় তাজা আলুর প্রিমিয়াম চাহিদা রয়েছে।'
    },
    {
      commodity: 'Katari Bhog Rice (কাটারিভোগ চাল)',
      category: 'Rice / সুগন্ধি চাল',
      district: 'Dinajpur',
      marketLocation: 'রাণীরবন্দর ও দিনাজপুর সদর আড়ত',
      wholesalePrice: '৳ ৩,৩৫০ / মণ (40kg)',
      retailPrice: '৳ ৩,৬০০ / মণ',
      minMaxRange: '৳ ৩,৩০০ - ৳ ৩,৪৫০ / মণ',
      recordedDate: '2026-11-18',
      trend: 'উচ্চমূল্যে স্থিতিশীল',
      advisory: 'প্যাকেটজাত কোম্পানিগুলো সরাসরি মিলগেটে বুকিং করছে।'
    },
    {
      commodity: 'Baneswar Hybrid Maize (ভুট্টা)',
      category: 'Maize / দানাদার ভুট্টা',
      district: 'Rajshahi',
      marketLocation: 'বানেশ্বর হাট',
      wholesalePrice: '৳ ১,১৮০ / মণ (40kg)',
      retailPrice: '৳ ১,২৮০ / মণ',
      minMaxRange: '৳ ১,১৪০ - ৳ ১,২১০ / মণ',
      recordedDate: '2026-11-19',
      trend: 'হালকা ঊর্ধ্বমুখী (+৳৩০)',
      advisory: 'পোল্ট্রি ফিড মিলের ব্যাপক চাহিদা রয়েছে।'
    },
    {
      commodity: 'Live Black Bengal Goat (ব্ল্যাক বেঙ্গল ছাগল)',
      category: 'Livestock / গবাদিপশু',
      district: 'Bogura',
      marketLocation: 'গাবতলী পশু হাট',
      wholesalePrice: '৳ ৮২০ / কেজি (জীবন্ত ওজন)',
      retailPrice: '৳ ৯৫০ / কেজি মাংস',
      minMaxRange: '৳ ৭৮০ - ৳ ৮৬০ / কেজি',
      recordedDate: '2026-11-19',
      trend: 'চাহিদা তুঙ্গে',
      advisory: '২০-২৫ কেজি ওজনের সুস্থ খাসির সর্বোচ্চ দর পাওয়া যাচ্ছে।'
    },
    {
      commodity: 'Fresh Cow Milk (খাঁটি গরুর দুধ)',
      category: 'Dairy / তরল দুধ',
      district: 'Bogura',
      marketLocation: 'রাজাবাজার দুগ্ধ আড়ত',
      wholesalePrice: '৳ ৭০ / লিটার',
      retailPrice: '৳ ৮৫ / লিটার',
      minMaxRange: '৳ ৬৫ - ৳ ৭৫ / লিটার',
      recordedDate: '2026-11-19',
      trend: 'স্থিতিশীল',
      advisory: 'ফ্যাট ৪.০%+ থাকলে দুগ্ধ কোম্পানি ও মিষ্টি ব্যবসায়ীরা নগদ ক্যাশ সংগ্রহ করছে।'
    },
    {
      commodity: 'Large Rui Fish (তাজা রুই মাছ ২কেজি+)',
      category: 'Fisheries / মিষ্টি জলের মাছ',
      district: 'Mymensingh',
      marketLocation: 'ত্রিশাল ফিশ আড়ত ও কাওরান বাজার',
      wholesalePrice: '৳ ১৩,৮০০ / মণ (৳ ৩৪৫/কেজি)',
      retailPrice: '৳ ৩৮০ - ৳ ৪২০ / কেজি',
      minMaxRange: '৳ ১৩,২০০ - ৳ ১৪,২০০ / মণ',
      recordedDate: '2026-11-19',
      trend: 'স্থিতিশীল',
      advisory: 'জীবন্ত পৌঁছালে ঢাকার পাইকারি বাজারে কেজিপ্রতি ৩০-৪০ টাকা অতিরিক্ত পাওয়া যায়।'
    }
  ];

  let matches = mockDb.filter(item => {
    const commMatch = !comm || item.commodity.toLowerCase().includes(comm) || item.category.toLowerCase().includes(comm);
    const distMatch = !dist || item.district.toLowerCase().includes(dist);
    return commMatch && distMatch;
  });

  if (matches.length === 0 && comm) {
    matches = mockDb.filter(item => item.commodity.toLowerCase().includes(comm) || item.category.toLowerCase().includes(comm));
  }

  if (matches.length === 0) {
    return {
      searchedCommodity: args.commodity,
      searchedDistrict: args.district,
      found: false,
      message: `নির্দিষ্ট পণ্য '${args.commodity}' এর আজকের সরাসরি পাইকারি রেকর্ড পাওয়া যায়নি। তবে ধান (৳ ১৩২০/মণ), আলু (৳ ১৪২০/মণ), ভুট্টা (৳ ১১৮০/মণ) এবং রুই মাছ (৳ ৩৪৫/কেজি) বাজারে স্থিতিশীল রয়েছে।`,
      benchmarkHaltSummary: mockDb.slice(0, 3)
    };
  }

  return {
    searchedCommodity: args.commodity,
    searchedDistrict: args.district,
    found: true,
    totalRecords: matches.length,
    rates: matches
  };
}

// 3. Crop Pest & Disease Diagnostic Engine
export interface PestDiagArgs {
  crop: string;
  symptoms: string;
}

export function toolDiagnoseCropPestDisease(args: PestDiagArgs) {
  const crop = (args.crop || '').toLowerCase();
  const sym = (args.symptoms || '').toLowerCase();

  // Rice Blast
  if (crop.includes('rice') || crop.includes('dhan') || crop.includes('ধান')) {
    if (sym.includes('blast') || sym.includes('ব্লাস্ট') || sym.includes('চোখের') || sym.includes('শীষ শুকিয়ে') || sym.includes('spotted')) {
      return {
        diseaseName: 'Rice Blast (ধানের ব্লাস্ট রোগ - পাতা ও গ্রীবা ব্লাস্ট)',
        causativeAgent: 'Magnaporthe oryzae (ছত্রাকজনিত)',
        severity: 'high',
        symptomsIdentified: 'পাতায় দুপ্রান্ত সূচালো চোখের মতো বাদামি দাগ, শিষের গোড়া কালো হয়ে শুকিয়ে চিটা হওয়া।',
        chemicalPrescription: [
          {
            activeIngredient: 'Tricyclazole 75% WP (যেমন: ট্রুপার / নাটিভো ৭৫ ডব্লিউজি)',
            dosage: '০.৭৫ গ্রাম প্রতি লিটার পানিতে মিশিয়ে শেষ বিকেলে স্প্রে করুন।',
            interval: '৫-৭ দিন পর পুনরায় স্প্রে করুন।'
          },
          {
            activeIngredient: 'Kasugamycin 2% (যেমন: কাসুমিন)',
            dosage: '১.৫ মিলি প্রতি লিটার পানিতে।'
          }
        ],
        ipmAndCulturalControl: [
          'জমিতে ইউরিয়া সারের অতিরিক্ত প্রয়োগ অবিলম্বে বন্ধ রাখুন।',
          'জমিতে সবসময় ৪-৫ সেন্টিমিটার পানি ধরে রাখুন (শুকনো জমিতে ব্লাস্ট দ্রুত ছড়ায়)।',
          'এমওপি (পটাশ) সার ৫ কেজি প্রতি বিঘায় উপরিপ্রয়োগ করলে গাছের রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি পায়।'
        ],
        isEmergency: true
      };
    }

    if (sym.includes('holud') || sym.includes('yellow') || sym.includes('হলুদ')) {
      return {
        diseaseName: 'Nitrogen Deficiency / Zinc Deficiency / Waterlogging (নাইট্রোজেন বা জিংক ঘাটতি)',
        severity: 'medium',
        symptomsIdentified: 'নিচের পুরোনো পাতা থেকে শুরু করে গাছ হালকা সবুজ বা হলুদ বর্ণ ধারণ করা।',
        chemicalPrescription: [
          {
            activeIngredient: 'Foliar Urea + Zinc Sulphate (হেপ্টাহাইড্রেট)',
            dosage: 'প্রতি লিটার পানিতে ১০ গ্রাম ইউরিয়া ও ২ গ্রাম জিংক সালফেট গুলে পরিষ্কার রোদে স্প্রে করুন।'
          }
        ],
        ipmAndCulturalControl: [
          'জমির অতিরিক্ত পানি নিষ্কাশন করে ২ দিন বাতাস চলাচলের সুযোগ দিন।',
          'গাছের গোড়ায় হালকা রস থাকা অবস্থায় বিএআরসি নির্ধারিত হারে ইউরিয়ার উপরিপ্রয়োগ করুন।'
        ],
        isEmergency: false
      };
    }

    if (sym.includes('poka') || sym.includes('borer') || sym.includes('মাজরা') || sym.includes('bph') || sym.includes('বাদামি গাছফড়িং')) {
      return {
        diseaseName: 'Stem Borer / Brown Plant Hopper (মাজরা পোকা বা বাদামি গাছফড়িং)',
        severity: 'high',
        symptomsIdentified: 'গাছের মাঝখানের কুশি মরে যাওয়া (মরা ডিগ) এবং শিষের সময় বের হওয়া চিটা সাদা শীষ (সাদা শিষ)।',
        chemicalPrescription: [
          {
            activeIngredient: 'Chlorantraniliprole + Thiamethoxam (যেমন: Virtako 40WG)',
            dosage: 'প্রতি একরে ৭৫ গ্রাম অথবা ১০ লিটার পানিতে ১.৫ গ্রাম মিশিয়ে প্রয়োগ।',
            interval: 'আক্রমণের তীব্রতায় ১০ দিন পর একবার।'
          },
          {
            activeIngredient: 'Cartap 50SP (যেমন: সানটাপ)',
            dosage: 'প্রতি লিটার পানিতে ২ গ্রাম।'
          }
        ],
        ipmAndCulturalControl: [
          'পার্চিং (Perching): প্রতি বিঘাতে ১০-১২টি বাঁশের কঞ্চি বা ডাল পুঁতে দিন যাতে ফিঙ্গে বা শালিক পাখি বসে পোকা খেতে পারে।',
          'জমিতে আলোর ফাঁদ ও সেক্স ফেরোমন ফাঁদ স্থাপন করুন।'
        ],
        isEmergency: false
      };
    }
  }

  // Potato Late Blight
  if (crop.includes('potato') || crop.includes('alu') || crop.includes('আলু')) {
    return {
      diseaseName: 'Late Blight of Potato (আলুর নাবি ধসা রোগ)',
      causativeAgent: 'Phytophthora infestans (মারাত্মক ছত্রাকজনিত)',
      severity: 'critical_emergency',
      symptomsIdentified: 'পাতার কিনারায় জলছাপ দাগ, কুয়াশাচ্ছন্ন আবহাওয়ায় দাগ দ্রুত কালো হয়ে পচে যাওয়া এবং পাতার নিচে সাদা পাউডারের মতো ছত্রাক দেখা যাওয়া।',
      chemicalPrescription: [
        {
          activeIngredient: 'Curative: Fenamidone + Mancozeb (যেমন: Secure 600WG) অথবা Dimethomorph + Mancozeb (Acrobat MZ)',
          dosage: '২ গ্রাম প্রতি লিটার পানিতে গুলে পুরো গাছ ভিজিয়ে স্প্রে করুন।',
          interval: '৪-৫ দিন পর পর দ্বিতীয় ডোজ।'
        },
        {
          activeIngredient: 'Preventive: Mancozeb 80WP (যেমন: Dithane M-45 / Indofil)',
          dosage: 'কুয়াশা দেখা মাত্র প্রতি লিটার পানিতে ২.৫ গ্রাম মিশিয়ে ৭ দিন পর পর স্প্রে।'
        }
      ],
      ipmAndCulturalControl: [
        '⚠️ সেচ সম্পূর্ণ বন্ধ রাখুন এবং কুয়াশাচ্ছন্ন আবহাওয়ায় কোনো অবস্থাতেই জমিতে পানি জমতে দেবেন না।',
        'আক্রান্ত গাছ তুলে অবিলম্বে মাটির নিচে পুঁতে ফেলুন।'
      ],
      isEmergency: true
    };
  }

  // Tomato Leaf Curl or Whitefly
  if (crop.includes('tomato') || crop.includes('টমেটো') || crop.includes('brinjal') || crop.includes('বেগুন')) {
    return {
      diseaseName: 'Tomato Leaf Curl Virus / Shoot & Fruit Borer (টমেটোর পাতা কোঁকড়ানো বা বেগুনের ডগা ছিদ্রকারী)',
      severity: 'high',
      symptomsIdentified: 'পাতা খাটো ও কোঁকড়া হয়ে বৃদ্ধি বন্ধ হওয়া অথবা ডগা নুয়ে পড়ে ফলের ভেতর পোকা ঢোকা।',
      chemicalPrescription: [
        {
          activeIngredient: 'Imidacloprid 20SL (যেমন: Admire / Tido) - বাহক সাদা মাছি দমনে',
          dosage: '০.৫ মিলি প্রতি লিটার পানিতে মিশিয়ে স্প্রে করুন।'
        },
        {
          activeIngredient: 'Emamectin Benzoate 5SG (যেমন: Proclaim / Wonder)',
          dosage: '১ গ্রাম প্রতি লিটার পানিতে (ডগা ও ফল ছিদ্রকারীর জন্য)।'
        }
      ],
      ipmAndCulturalControl: [
        'হলুদ আঠালো ফাঁদ (Yellow Sticky Trap) প্রতি শতকে ২টি করে টাঙিয়ে দিন।',
        'বেগুনে সেক্স ফেরোমন ফাঁদ ব্যবহার করুন।'
      ],
      isEmergency: false
    };
  }

  // Generic Crop Advisory
  return {
    diseaseName: 'General Crop Health & Nutritional Stress',
    severity: 'medium',
    symptomsIdentified: args.symptoms || 'ফসল স্বাভাবিক বৃদ্ধি ব্যাহত হওয়া',
    chemicalPrescription: [
      {
        activeIngredient: 'Broad-spectrum Mancozeb 80WP (ছত্রাক দমনে) + সলুবোর বোরন',
        dosage: 'ম্যানকোজেব ২ গ্রাম ও বোরন ১ গ্রাম প্রতি লিটার পানিতে স্প্রে করুন।'
      }
    ],
    ipmAndCulturalControl: [
      'জমির আর্দ্রতা পরীক্ষা করুন; অতিরিক্ত জলাবদ্ধতা দ্রুত নিষ্কাশন করুন।',
      'আক্রান্ত পাতার স্পষ্ট ছবি তুলে স্থানীয় কৃষি সম্প্রসারণ কর্মকর্তা (SAAO) বা এগ্রোনেক্স বিশেষজ্ঞকে সরাসরি দেখান।'
    ],
    isEmergency: false
  };
}

// 4. Fisheries Management & Oxygen Emergency Calculator
export interface FisheriesCalcArgs {
  action: 'stocking_ratio' | 'oxygen_emergency' | 'water_quality_check';
  pondAreaDecimal: number;
  pondDepthFeet?: number;
}

export function toolCalculateFisheries(args: FisheriesCalcArgs) {
  const decimals = Math.max(1, Number(args.pondAreaDecimal) || 20);
  const depth = Number(args.pondDepthFeet) || 5;

  if (args.action === 'oxygen_emergency') {
    return {
      alertType: '🚨 CRITICAL DISSOLVED OXYGEN (DO) DEPLETION',
      identifiedProblem: 'ভোরে মাছ পুকুরের উপরিভাগে খাবি খাওয়া ও ভাসমান থাকা (DO < 3.0 mg/L)',
      pondSize: `${decimals} শতক (গভীরতা: ${depth} ফুট)`,
      immediateEmergencyProtocol: [
        '১. তাৎক্ষণিকভাবে সকল প্রকার সম্পূরক খাদ্য, খৈল ও গোবর/সার প্রয়োগ বন্ধ করুন।',
        '২. পাম্প বা স্যালো ইঞ্জিন চালু করে ওপর থেকে ঝরনার মতো পানি ফেলে অক্সিজেন মিশ্রণ তৈরি করুন। অথবা কলাগাছের গুঁড়ি বা নৌকা নিয়ে পুকুরে তীব্র ঢেউ সৃষ্টি করুন।',
        `৩. রাসায়নিক অক্সিজেন ট্যাবলেট (যেমন Oxyflow, Oxy-A বা Bio-Oxy): প্রতি শতকে ১৫ গ্রাম হারে মোট ${Math.round(decimals * 15)} গ্রাম পানিতে ছিটিয়ে দিন।`,
        `৪. তলায় জমে থাকা অ্যামোনিয়া ও বিষাক্ত গ্যাস দূর করতে জিওলাইট (Zeolite) প্রতি শতকে ২০০ গ্রাম হারে মোট ${(decimals * 0.2).toFixed(1)} কেজি এবং পাথুরে চুন ${(decimals * 0.25).toFixed(1)} কেজি প্রয়োগ করুন।`
      ],
      isEmergency: true
    };
  }

  // 3-tier Stocking Ratio
  const totalFingerlings = Math.round(decimals * 38); // 38 per decimal standard density
  const surfaceCount = Math.round(totalFingerlings * 0.35); // 35%
  const columnCount = Math.round(totalFingerlings * 0.30); // 30%
  const bottomCount = Math.round(totalFingerlings * 0.35); // 35%

  return {
    pondSize: `${decimals} শতক`,
    averageDepth: `${depth} ফুট`,
    totalFingerlingsRecommended: totalFingerlings,
    threeTierStockingBreakdown: {
      surfaceLayer: {
        percentage: '৩৫%',
        species: 'কাতলা (১২টি/শতক) ও সিলভার কার্প (২টি/শতক)',
        count: surfaceCount,
        role: 'ওপরের স্তরের জুওপ্লাঙ্কটন ও ফাইটোপ্লাঙ্কটন খাদ্য গ্রহণ করে পুকুরের ওপরের পরিবেশ পরিষ্কার রাখে।'
      },
      middleColumnLayer: {
        percentage: '৩০%',
        species: 'রুই (১০টি/শতক) ও গ্রাস কার্প (১-২টি/শতক)',
        count: columnCount,
        role: 'মধ্যম স্তরের উদ্ভিদকণা, কচি ঘাস ও শ্যাওলা খেয়ে সুষম বৃদ্ধি নিশ্চিত করে।'
      },
      bottomLayer: {
        percentage: '৩৫%',
        species: 'মৃগেল (১০টি/শতক), মিরর কার্প (৩টি/শতক) ও কালবাউশ (১টি/শতক)',
        count: bottomCount,
        role: 'তলদেশের জৈব বর্জ্য ও শ্যাওলা খেয়ে গ্যাসের সৃষ্টি রোধ করে।'
      }
    },
    preStockingPreparation: [
      `চুন প্রয়োগ: প্রতি শতকে ১ কেজি হারে মোট ${decimals} কেজি চুন প্রয়োগ করে পানি শোধন করুন।`,
      'পোনা মজুত: ৩-৪ ইঞ্চি সাইজের সুস্থ রোগমুক্ত পোনা এনে ঠান্ডা আবহাওয়ায় (সকাল বা বিকেলে) তাপমাত্রা সহনশীল করে ছাড়ুন।'
    ],
    feedingAdvisory: 'দৈনিক মোট মাছের ওজনের ৩-৫% হারে বাণিজ্যিক ভাসমান বা ডুবন্ত পিলেট খাবার ২ কিস্তিতে সরবরাহ করুন।'
  };
}

// 5. Livestock Nutrition & FCR Calculator
export interface LivestockNutritionArgs {
  animalType: 'dairy_cow' | 'beef_cattle' | 'goat' | 'poultry';
  purpose?: 'milk_production' | 'fattening' | 'general';
  weightKg?: number;
  milkYieldLiters?: number;
}

export function toolCalculateLivestock(args: LivestockNutritionArgs) {
  const type = args.animalType || 'dairy_cow';
  const weight = Number(args.weightKg) || (type === 'goat' ? 25 : (type === 'poultry' ? 1.8 : 350));
  const milkLiters = Number(args.milkYieldLiters) || 12;

  if (type === 'dairy_cow') {
    const dryMatterDailyKg = Number((weight * 0.03).toFixed(1)); // 3% of body weight
    const maintenanceConcentrateKg = 1.5;
    const productionConcentrateKg = Number((milkLiters / 2.5).toFixed(1)); // 1kg feed per 2.5L milk
    const totalConcentrateKg = Number((maintenanceConcentrateKg + productionConcentrateKg).toFixed(1));
    const greenGrassKg = Math.min(30, Math.round(weight * 0.06));

    return {
      animal: 'High-Yielding Dairy Cow (উন্নত দুগ্ধবতী গাভী)',
      liveWeight: `${weight} kg`,
      dailyMilkProduction: `${milkLiters} Liters`,
      dailyNutritionalRequirements: {
        totalDryMatter: `${dryMatterDailyKg} kg`,
        freshGreenFodder: `${greenGrassKg} kg (নেপিয়ার, জার্মান বা জাম্বো ঘাস)`,
        dryStraw: '৩-৪ কেজি শুকনা ধানের খড় (কুচি করে কাটা)',
        concentrateFeedTotal: `${totalConcentrateKg} kg সুষম দানাদার খাদ্য`
      },
      concentrateMixFormula: [
        'ভুট্টা ভাঙা: ৩৫%',
        'গমের ভুসি: ৩০%',
        'সয়াবিন খৈল / সরিষার খৈল: ২৫%',
        'রাইস পলিশ: ৬%',
        'ডাই-ক্যালসিয়াম ফসফেট (DCP): ২%',
        'ভিটামিন-মিনারেল প্রিমিক্স ও লবণ: ২%'
      ],
      healthProtocol: 'ওলান প্রদাহ (Mastitis) রোধে দুধ দোয়ানোর পর পটাশ মিশ্রিত পানিতে ওলান ডুবিয়ে পরিষ্কার রাখুন।'
    };
  }

  if (type === 'beef_cattle') {
    return {
      animal: 'Beef Fattening Bull (কোরবানি/মাংসের জন্য ষাঁড় মোটাতাজাকরণ)',
      liveWeight: `${weight} kg`,
      umsFormula: {
        title: 'ইউরিয়া মোলাসেস খড় (UMS) তৈরির নিয়ম (১০০ কেজি ব্যাচ)',
        ingredients: [
          'শুকনো ধানের খড় (ছোট করে কাটা): ১০০ কেজি',
          'চিটাগুড় (মোলাসেস): ২০ কেজি',
          'ইউরিয়া সার (সাদা দানাদার): ৩ কেজি',
          'পরিষ্কার পানি: ৩০ লিটার'
        ],
        preparationMethod: 'পানিতে ইউরিয়া ও চিটাগুড় ভালোভাবে গুলিয়ে খড়ের ওপর সমানভাবে ছিটিয়ে ভালো করে মিশিয়ে দিন। প্রক্রিয়াজাত এই খড় সরাসরি গরুকে খাওয়ালে প্রোটিন ও শক্তি বহুগুণ বাড়ে।'
      },
      targetFcr: '৫.০ থেকে ৬.০ (অর্থাৎ ৫-৬ কেজি সুষম খাবার গ্রহণে ১ কেজি মাংস বৃদ্ধি)',
      dailyRation: `দৈনিক দানাদার খাদ্য ${(weight * 0.015).toFixed(1)} কেজি + ইউএমএস খড় ${(weight * 0.02).toFixed(1)} কেজি + পরিষ্কার পানি ৩০-৩৫ লিটার।`
    };
  }

  if (type === 'goat') {
    return {
      animal: 'Black Bengal Goat (ব্ল্যাক বেঙ্গল ছাগল)',
      liveWeight: `${weight} kg`,
      dailyRation: {
        greenLeaves: '২-৩ কেজি কাঁঠাল পাতা, ইপিল-ইপিল বা নেপিয়ার ঘাস',
        concentrate: '২৫০-৩০০ গ্রাম দানাদার মিশ্রণ (গমের ভুসি ৬০%, খৈল ২৫%, ভুট্টা ভাঙা ১০%, লবণ ও খনিজ ৫%)',
        water: 'পর্যাপ্ত বিশুদ্ধ খাবার পানি'
      },
      diseasePrevention: 'পিপিআর (PPR) টিকা প্রতি বছর নিশ্চিত করুন। ঠান্ডা লাগা ও নিউমোনিয়া রোধে মাচায় শুকনো মেঝে রাখুন।'
    };
  }

  // Poultry
  return {
    animal: 'Commercial Broiler / Sonali Poultry',
    targetFcr: '১.৫ - ১.৬ (৩৫ দিনে ২ কেজি ওজনে পৌঁছানো)',
    vaccinationSchedule: [
      '৩-৫ দিন: রাণীক্ষেত ও ব্রঙ্কাইটিস (Ma5+Clone30) চোখে ড্রপ',
      '১০-১২ দিন: গামবোরো ১ম ডোজ (IBD Intermediate Plus) খাবার পানিতে',
      '১৭-১৯ দিন: গামবোরো বুস্টার ডোজ',
      '২১-২৪ দিন: রাণীক্ষেত ক্লোন বুস্টার'
    ]
  };
}

// 6. Search Verified Experts Directory
export interface ExpertSearchArgs {
  category?: 'veterinary' | 'agriculturist' | 'fisheries';
  district?: string;
}

export function toolSearchVerifiedExperts(args: ExpertSearchArgs) {
  const cat = (args.category || '').toLowerCase();
  const dist = (args.district || '').toLowerCase();

  const experts = [
    {
      id: 'exp_1',
      name: 'ড. মো: আনোয়ার হোসেন (Dr. Md. Anwar Hossain)',
      category: 'agriculturist',
      designation: 'Senior Agronomist & Crop Specialist (Ex-BARI)',
      qualification: 'Ph.D. in Agronomy (BAU), M.Sc. (Ag)',
      experienceYears: 16,
      district: 'Bogura',
      consultationFee: '৳ ৩০০',
      phone: '01718001122',
      availableDays: 'শনিবার, সোমবার, বুধবার, বৃহস্পতিবার',
      speciality: 'উত্তরবঙ্গের ধান, গম, আলু ও ভুট্টা ফসলের রোগবালাই দমন, সুষম সার ও মাটি পরীক্ষা।'
    },
    {
      id: 'exp_2',
      name: 'ডা: নাজমুল হক (Dr. Nazmul Haque, DVM)',
      category: 'veterinary',
      designation: 'Veterinary Surgeon & Livestock Specialist',
      qualification: 'DVM, MS in Animal Science (BAU, Mymensingh)',
      experienceYears: 11,
      district: 'Bogura',
      consultationFee: '৳ ৩৫০',
      phone: '01819556677',
      availableDays: 'প্রতিদিন (জরুরি ভেট কল ২৪/৭)',
      speciality: 'ডেইরি ও ছাগলের খুরা রোগ, তড়কা, ওলান ফোলা (ম্যাস্টাইটিস) এবং কৃত্রিম প্রজনন।'
    },
    {
      id: 'exp_3',
      name: 'ড. ফারহানা সুলতানা (Dr. Farhana Sultana)',
      category: 'fisheries',
      designation: 'Aquaculture Specialist & Fish Pathologist (BFRI)',
      qualification: 'Ph.D. in Aquaculture (KU), MS in Fisheries (BAU)',
      experienceYears: 14,
      district: 'Mymensingh',
      consultationFee: '৳ ৩০০',
      phone: '01911448833',
      availableDays: 'রবিবার, মঙ্গলবার, বৃহস্পতিবার',
      speciality: 'কার্প ও ক্যাটফিশ পলিকালচার, পুকুরে গ্যাস ও অক্সিজেন সমস্যা, হ্যাচারি ব্রিডিং।'
    }
  ];

  let matches = experts.filter(e => {
    const catMatch = !cat || e.category.toLowerCase().includes(cat);
    const distMatch = !dist || e.district.toLowerCase().includes(dist);
    return catMatch && distMatch;
  });

  if (matches.length === 0 && cat) {
    matches = experts.filter(e => e.category.toLowerCase().includes(cat));
  }

  return {
    searchedCategory: args.category || 'all',
    searchedDistrict: args.district || 'all',
    count: matches.length > 0 ? matches.length : experts.length,
    experts: matches.length > 0 ? matches : experts
  };
}

// 7. Search Marketplace Inventory
export interface MarketplaceSearchArgs {
  sector?: 'agriculture' | 'livestock' | 'fisheries';
  searchQuery?: string;
  district?: string;
}

export function toolSearchMarketplaceInventory(args: MarketplaceSearchArgs) {
  const q = (args.searchQuery || '').toLowerCase();
  const sec = (args.sector || '').toLowerCase();
  const dist = (args.district || '').toLowerCase();

  const inventory = [
    {
      listingId: 'lst_101',
      seller: 'মো: রফিকুল ইসলাম (Verified Farmer)',
      product: 'প্রিমিয়াম ব্রি ধান-২৮ (BRRI dhan-28 Paddy)',
      sector: 'agriculture',
      category: 'Rice & Paddy',
      availableQuantity: '১২০ মণ',
      price: '৳ ১,৩৫০ / মণ',
      district: 'Bogura',
      location: 'গোকুল, শিবগঞ্জ, বগুড়া (মহাস্থানগড় সংলগ্ন)',
      qualityGrade: 'Grade A (আর্দ্রতা ১৪% এর নিচে, চকচকে)',
      contactPhone: '01712345678'
    },
    {
      listingId: 'lst_102',
      seller: 'মো: রফিকুল ইসলাম (Verified Farmer)',
      product: 'বগুড়ার তাজা ডায়মন্ড লাল গোল আলু (Diamond Potato)',
      sector: 'agriculture',
      category: 'Potatoes',
      availableQuantity: '৩৫০ মণ',
      price: '৳ ১,৪৫০ / মণ',
      district: 'Bogura',
      location: 'মহাস্থানগড়, শিবগঞ্জ, বগুড়া',
      qualityGrade: 'Grade A (এক সাইজ, সম্পূর্ণ দাগমুক্ত)',
      contactPhone: '01712345678'
    },
    {
      listingId: 'lst_103',
      seller: 'আনিসুর রহমান খন্দকার (Verified Farmer)',
      product: 'খাঁটি দেশি ব্ল্যাক বেঙ্গল খাসি (Black Bengal Goat)',
      sector: 'livestock',
      category: 'Goats',
      availableQuantity: '৮টি (প্রতিটি ২৫-২৮ কেজি)',
      price: '৳ ৮৫০ / কেজি জীবন্ত ওজন',
      district: 'Bogura',
      location: 'পুনড্র নগর, গাবতলী, বগুড়া',
      qualityGrade: 'সম্পূর্ণ প্রাকৃতিক ঘাস ও খড় খাওয়া',
      contactPhone: '01817766554'
    },
    {
      listingId: 'lst_104',
      seller: 'আলহাজ্ব মকবুল হোসেন এগ্রো (Agri-Business)',
      product: 'ময়মনসিংহের জীবন্ত তাজা রুই মাছ (Live Rui Fish 2kg+)',
      sector: 'fisheries',
      category: 'Rui',
      availableQuantity: '৪৫ মণ',
      price: '৳ ১৪,০০০ / মণ (৳ ৩৫০/কেজি)',
      district: 'Mymensingh',
      location: 'ত্রিশাল, ময়মনসিংহ',
      qualityGrade: 'Export Quality (ড্রামে জীবন্ত পরিবহণযোগ্য)',
      contactPhone: '01912443322'
    },
    {
      listingId: 'lst_105',
      seller: 'হেমন্ত এগ্রো ট্রেডার্স (Trader)',
      product: 'দিনাজপুরের সুগন্ধি কাটারিভোগ চাল (Katari Bhog)',
      sector: 'agriculture',
      category: 'Rice & Paddy',
      availableQuantity: '২০০ মণ',
      price: '৳ ৩,৪০০ / মণ',
      district: 'Dinajpur',
      location: 'রাণীরবন্দর, দিনাজপুর সদর',
      qualityGrade: 'অটোরাইস মিল প্রক্রিয়াজাত ৫০ কেজি বস্তা',
      contactPhone: '01733889900'
    }
  ];

  let matches = inventory.filter(item => {
    const qMatch = !q || item.product.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    const secMatch = !sec || item.sector.toLowerCase().includes(sec);
    const distMatch = !dist || item.district.toLowerCase().includes(dist);
    return qMatch && secMatch && distMatch;
  });

  if (matches.length === 0 && q) {
    matches = inventory.filter(item => item.product.toLowerCase().includes(q) || item.category.toLowerCase().includes(q));
  }

  return {
    query: args.searchQuery,
    totalFound: matches.length,
    listings: matches.length > 0 ? matches : inventory.slice(0, 3)
  };
}

// Master Dispatcher for Tool Calls
export function executeAgentTool(name: string, args: any): ToolExecutionResult {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  let result: any = null;
  let summaryText = '';

  try {
    switch (name) {
      case 'calculate_fertilizer':
        result = toolCalculateFertilizer(args);
        summaryText = `Calculated BARC fertilizer requirement for ${result.crop} on ${result.standardLandDecimals} decimals: Urea ${result.nutrients.ureaKg}kg, TSP ${result.nutrients.tspKg}kg, MoP ${result.nutrients.mopKg}kg.`;
        break;

      case 'get_regional_market_prices':
        result = toolGetRegionalMarketPrices(args);
        summaryText = `Retrieved wholesale market rates for '${args.commodity}': found ${result.found ? result.totalRecords : 0} matching regional benchmarks.`;
        break;

      case 'diagnose_crop_pest_disease':
        result = toolDiagnoseCropPestDisease(args);
        summaryText = `Diagnosed pest/disease condition '${result.diseaseName}' with severity: ${result.severity}.`;
        break;

      case 'calculate_fisheries_management':
        result = toolCalculateFisheries(args);
        summaryText = `Processed fisheries advisory for ${result.pondSize}: ${args.action === 'oxygen_emergency' ? 'Oxygen Emergency Action Plan' : 'Polyculture 3-Tier stocking distribution'}.`;
        break;

      case 'calculate_livestock_nutrition_and_fcr':
        result = toolCalculateLivestock(args);
        summaryText = `Calculated nutrition and feeding schedule for ${result.animal}.`;
        break;

      case 'search_verified_experts':
        result = toolSearchVerifiedExperts(args);
        summaryText = `Searched verified experts in ${args.category || 'all'} sectors: found ${result.count} verified specialists.`;
        break;

      case 'search_marketplace_inventory':
        result = toolSearchMarketplaceInventory(args);
        summaryText = `Searched live AgroNex marketplace inventory for '${args.searchQuery || ''}': found ${result.totalFound} listings.`;
        break;

      default:
        result = { error: `Tool '${name}' is not recognized.` };
        summaryText = `Tool '${name}' failed: unrecognized tool name.`;
    }
  } catch (err: any) {
    result = { error: err.message || 'Execution error' };
    summaryText = `Tool '${name}' encountered an error: ${err.message}`;
  }

  return {
    toolName: name,
    arguments: args,
    result,
    summaryText,
    timestamp
  };
}
