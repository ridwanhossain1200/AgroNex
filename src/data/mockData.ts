import type { 
  UserProfile, 
  LandProfile, 
  LivestockFarm, 
  AnimalRecord, 
  VaccinationRecord, 
  FeedingLog, 
  PondProfile, 
  WaterQualityRecord, 
  HatcheryListing, 
  MarketplaceListing, 
  NegotiationInquiry, 
  OrderRecord, 
  PriceAlert, 
  MarketPriceItem, 
  ExpertProfile, 
  ConsultationBooking, 
  NotificationItem, 
  CalendarReminder 
} from '../types/index.ts';

export const INITIAL_USER: UserProfile = {
  id: 'usr_001',
  name: 'মো: রফিকুল ইসলাম (Md. Rafiqul Islam)',
  phone: '01712345678',
  email: 'rafiqul.agri@agronex.bd',
  roles: ['agri_farmer', 'livestock_farmer', 'marketplace_seller'],
  sectors: ['agriculture', 'livestock', 'marketplace'],
  division: 'Rajshahi',
  district: 'Bogura',
  upazila: 'Shibganj',
  village: 'Gokul, Uttarpara',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  isVerified: true,
  businessName: 'ইসলাম এগ্রো অ্যান্ড ডেইরি খামার (Islam Agro & Dairy)',
  joinedDate: '12 Jan 2024'
};

export const INITIAL_LANDS: LandProfile[] = [
  {
    id: 'lnd_1',
    name: 'উত্তর মাঠের ধান জমি (North Paddy Field)',
    size: 45,
    unit: 'decimal',
    soilType: 'Loam (দোআঁশ)',
    division: 'Rajshahi',
    district: 'Bogura',
    upazila: 'Shibganj',
    village: 'Gokul',
    waterSource: 'Deep Tubewell',
    season: 'Rabi (রবি)',
    currentCrop: 'Boro Rice (বোরো ধান - ব্রি ধান ২৮)',
    lastUpdated: '2026-11-15'
  },
  {
    id: 'lnd_2',
    name: 'মহাস্থান আলু প্রজেক্ট (Mahasthan Potato Project)',
    size: 2.5,
    unit: 'bigha',
    soilType: 'Sandy Loam (বেলে দোআঁশ)',
    division: 'Rajshahi',
    district: 'Bogura',
    upazila: 'Shibganj',
    village: 'Mahasthangarh',
    waterSource: 'Deep Tubewell',
    season: 'Rabi (রবি)',
    currentCrop: 'Diamond Potato (ডায়মন্ড আলু)',
    lastUpdated: '2026-11-18'
  },
  {
    id: 'lnd_3',
    name: 'নদীর চর ভুট্টা জমি (Char Maize Field)',
    size: 1.2,
    unit: 'acre',
    soilType: 'Alluvial (পলি)',
    division: 'Rajshahi',
    district: 'Bogura',
    upazila: 'Sariakandi',
    village: 'Kornibari',
    waterSource: 'Pond / River',
    season: 'Rabi (রবি)',
    currentCrop: 'Hybrid Maize (হাইব্রিড ভুট্টা - এনকে৪০)',
    lastUpdated: '2026-11-10'
  }
];

export const INITIAL_LIVESTOCK_FARMS: LivestockFarm[] = [
  {
    id: 'lsk_1',
    name: 'গ্রীন ভ্যালি ডেইরি ফার্ম (Green Valley Dairy)',
    livestockType: 'cattle',
    animalCount: 14,
    budget: 850000,
    purpose: 'Dairy (দুগ্ধ)',
    district: 'Bogura',
    upazila: 'Shibganj',
    availableSpaceSqFt: 3200,
    capacity: 20,
    setupCostEstimate: 500000,
    monthlyOperatingCost: 65000,
    lastUpdated: '2026-11-12'
  },
  {
    id: 'lsk_2',
    name: 'দেশি ব্ল্যাক বেঙ্গল ছাগল প্রকল্প (Black Bengal Project)',
    livestockType: 'goat',
    animalCount: 22,
    budget: 240000,
    purpose: 'Breeding (প্রজনন)',
    district: 'Bogura',
    upazila: 'Gabtali',
    availableSpaceSqFt: 1400,
    capacity: 35,
    setupCostEstimate: 120000,
    monthlyOperatingCost: 18000,
    lastUpdated: '2026-11-16'
  }
];

export const INITIAL_ANIMALS: AnimalRecord[] = [
  { id: 'anm_1', farmId: 'lsk_1', tagNumber: 'COW-BD-041', breed: 'Friesian Cross (হোলস্টেইন ফ্রিজিয়ান সংকর)', ageMonths: 34, gender: 'Female', weightKg: 420, healthStatus: 'healthy', notes: 'দৈনিক দুধ উৎপাদন ২২ লিটার' },
  { id: 'anm_2', farmId: 'lsk_1', tagNumber: 'COW-BD-042', breed: 'Sahiwal Cross (শাহীওয়াল সংকর)', ageMonths: 28, gender: 'Female', weightKg: 380, healthStatus: 'healthy', notes: 'গর্ভবতী - ৫ মাস' },
  { id: 'anm_3', farmId: 'lsk_1', tagNumber: 'BULL-BD-019', breed: 'Red Chittagong Cattle (আরসিসি)', ageMonths: 20, gender: 'Male', weightKg: 310, healthStatus: 'treatment', notes: 'সামান্য কাশি ও খুরা লক্ষণ পরিলক্ষিত' },
  { id: 'anm_4', farmId: 'lsk_2', tagNumber: 'GT-BB-108', breed: 'Black Bengal (ব্ল্যাক বেঙ্গল)', ageMonths: 14, gender: 'Female', weightKg: 24, healthStatus: 'healthy', notes: 'যমজ বাচ্চা প্রসব করেছে' },
  { id: 'anm_5', farmId: 'lsk_2', tagNumber: 'GT-BB-109', breed: 'Black Bengal (ব্ল্যাক বেঙ্গল)', ageMonths: 16, gender: 'Male', weightKg: 32, healthStatus: 'healthy', notes: 'প্রজনন পাঠা' }
];

export const INITIAL_VACCINATIONS: VaccinationRecord[] = [
  { id: 'vac_1', farmId: 'lsk_1', animalIdOrGroup: 'COW-BD-041', vaccineName: 'FMD Vaccine (খুরারোগের টিকা)', administeredDate: '2026-06-10', nextDueDate: '2026-12-10', veterinarian: 'Dr. মোস্তাফিজুর রহমান', status: 'upcoming', notes: '৬ মাস পর বুস্টার ডোজ' },
  { id: 'vac_2', farmId: 'lsk_1', animalIdOrGroup: 'COW-BD-042', vaccineName: 'Anthrax (তড়কা টিকা)', administeredDate: '2026-04-15', nextDueDate: '2027-04-15', veterinarian: 'উপজেলা প্রাণিসম্পদ কর্মকর্তা', status: 'completed' },
  { id: 'vac_3', farmId: 'lsk_2', animalIdOrGroup: 'All Goats (সমগ্র ছাগল পাল)', vaccineName: 'PPR Vaccine (পিপিআর টিকা)', administeredDate: '2026-08-01', nextDueDate: '2027-08-01', veterinarian: 'Dr. সেলিনা আখতার', status: 'completed' },
  { id: 'vac_4', farmId: 'lsk_1', animalIdOrGroup: 'BULL-BD-019', vaccineName: 'HS Vaccine (গলাফুলা টিকা)', administeredDate: '2026-03-20', nextDueDate: '2026-09-20', veterinarian: 'Dr. মোস্তাফিজুর রহমান', status: 'overdue', notes: 'জরুরি ডোজ দেওয়া প্রয়োজন' }
];

export const INITIAL_FEEDING_LOGS: FeedingLog[] = [
  { id: 'fd_1', farmId: 'lsk_1', date: '2026-11-18', feedType: 'সবুজ ঘাস (Napier) + দানাদার মিশ্রণ', feedQuantityKg: 180, totalWeightGainKg: 0, calculatedFCR: 0, notes: 'দুধ উৎপাদন সুস্থ ও স্বাভাবিক' },
  { id: 'fd_2', farmId: 'lsk_1', date: '2026-11-17', feedType: 'সাইলেজ ও খড় মিশ্রিত ফিড', feedQuantityKg: 175, totalWeightGainKg: 0, calculatedFCR: 0 },
  { id: 'fd_3', farmId: 'lsk_2', date: '2026-11-18', feedType: 'দানাদার খৈল-ভুসি ও গাছের পাতা', feedQuantityKg: 28, totalWeightGainKg: 4.2, calculatedFCR: 6.66, notes: 'ব্ল্যাক বেঙ্গল ছাগলের সন্তোষজনক বৃদ্ধি' }
];

export const INITIAL_PONDS: PondProfile[] = [
  {
    id: 'pnd_1',
    name: 'ত্রিশাল কার্প মিশ্র খামার (Trishal Carp Poly-pond)',
    sizeDecimal: 65,
    depthFeet: 6.5,
    waterSource: 'Groundwater / Deep Tube-well',
    farmingType: 'polyculture',
    primarySpecies: ['Rui (রুই)', 'Katla (কাতলা)', 'Mrigal (মৃগেল)', 'Silver Carp (সিলভার কার্প)'],
    district: 'Mymensingh',
    upazila: 'Trishal',
    budget: 350000,
    stockingDate: '2026-07-20',
    lastUpdated: '2026-11-17'
  },
  {
    id: 'pnd_2',
    name: 'মনোসেক্স তেলাপিয়া নার্সারি (Monosex Tilapia)',
    sizeDecimal: 35,
    depthFeet: 5.0,
    waterSource: 'Groundwater / Deep Tube-well',
    farmingType: 'monoculture',
    primarySpecies: ['GIFT Tilapia (মনোসেক্স তেলাপিয়া)'],
    district: 'Mymensingh',
    upazila: 'Trishal',
    budget: 180000,
    stockingDate: '2026-09-05',
    lastUpdated: '2026-11-18'
  }
];

export const INITIAL_WATER_QUALITY: WaterQualityRecord[] = [
  {
    id: 'wq_1',
    pondId: 'pnd_1',
    recordedDate: '2026-11-19 08:30 AM',
    ph: 7.6,
    ammoniaPpm: 0.02,
    dissolvedOxygenMgL: 6.4,
    temperatureC: 27.5,
    transparencyCm: 30,
    status: 'optimal',
    recommendations: ['জলের গুণমান চমৎকার ও স্থিতিশীল রয়েছে। স্বাভাবিক খাদ্য সরবরাহ চালিয়ে যান।']
  },
  {
    id: 'wq_2',
    pondId: 'pnd_1',
    recordedDate: '2026-11-12 09:00 AM',
    ph: 7.4,
    ammoniaPpm: 0.04,
    dissolvedOxygenMgL: 5.2,
    temperatureC: 28.0,
    transparencyCm: 26,
    status: 'optimal',
    recommendations: ['অক্সিজেনের মাত্রা সন্তোষজনক। তবে ভোরে কিছুটা পর্যবেক্ষণ রাখুন।']
  },
  {
    id: 'wq_3',
    pondId: 'pnd_2',
    recordedDate: '2026-11-19 07:15 AM',
    ph: 6.3,
    ammoniaPpm: 0.12,
    dissolvedOxygenMgL: 3.8,
    temperatureC: 26.8,
    transparencyCm: 18,
    status: 'warning',
    recommendations: [
      'অ্যামোনিয়ার মাত্রা সহনশীল সীমার উপরে এবং দ্রবীভূত অক্সিজেন কম।',
      'তাত্ক্ষণিক ব্যবস্থা: ফিডিং ২০% কমান, আংশিক পরিষ্কার জল যোগ করুন বা এয়ারেটর চালু করুন।',
      'প্রতি শতাংশে ২৫০ গ্রাম হারে কৃষি চুন প্রয়োগ করুন।'
    ]
  }
];

export const INITIAL_HATCHERIES: HatcheryListing[] = [
  {
    id: 'hat_1',
    hatcheryName: 'ব্রহ্মপুত্র মডার্ন ফিশ হ্যাচারি (Brahmaputra Fish Hatchery)',
    ownerName: 'হাজী মোজাম্মেল হক',
    phone: '01711223344',
    district: 'Mymensingh',
    upazila: 'Trishal',
    verified: true,
    species: [
      { name: 'রুই পোনা (Rui Fry)', sizeInch: '3-4 ইঞ্চি', pricePerThousand: 2200, availableStock: 85000 },
      { name: 'কাতলা পোনা (Katla Fry)', sizeInch: '4-5 ইঞ্চি', pricePerThousand: 3500, availableStock: 40000 },
      { name: 'মনোসেক্স তেলাপিয়া (GIFT)', sizeInch: '1.5-2 ইঞ্চি', pricePerThousand: 950, availableStock: 150000 }
    ],
    rating: 4.8,
    reviewsCount: 42
  },
  {
    id: 'hat_2',
    hatcheryName: 'যমুনা এগ্রো অ্যান্ড কার্প ব্রিডার্স',
    ownerName: 'মো: শফিকুল ইসলাম',
    phone: '01819334455',
    district: 'Bogura',
    upazila: 'Sherpur',
    verified: true,
    species: [
      { name: 'পাঙ্গাস পোনা (Pangas)', sizeInch: '2-3 ইঞ্চি', pricePerThousand: 1100, availableStock: 90000 },
      { name: 'মৃগেল পোনা (Mrigal)', sizeInch: '3-4 ইঞ্চি', pricePerThousand: 1800, availableStock: 30000 },
      { name: 'গুলশা ট্যাংরা (Gulsha)', sizeInch: '1-1.5 ইঞ্চি', pricePerThousand: 2800, availableStock: 50000 }
    ],
    rating: 4.6,
    reviewsCount: 29
  }
];

export const INITIAL_LISTINGS: MarketplaceListing[] = [
  {
    id: 'lst_101',
    sellerId: 'usr_001',
    sellerName: 'মো: রফিকুল ইসলাম',
    sellerPhone: '01712345678',
    sellerType: 'Farmer',
    sellerVerified: true,
    sector: 'agriculture',
    category: 'Rice & Paddy',
    productName: 'প্রিমিয়াম ব্রি ধান-২৮ (BRRI dhan-28 Paddy)',
    description: 'সম্পূর্ণ জৈব সার মিশ্রিত উর্বর মাটিতে উৎপাদিত শুকনা চকচকে ব্রি ধান-২৮। আর্দ্রতা ১৪% এর নিচে। পাইকারি ক্রেতাদের জন্য প্রস্তুত। মহাস্থানগড় সংলগ্ন শস্যভাণ্ডার থেকে সরাসরি সংগ্রহ করা যাবে।',
    quantity: 120,
    unit: 'maund',
    pricePerUnit: 1350,
    wholesaleRefPrice: 1320,
    qualityGrade: 'Grade A (প্রিমিয়াম)',
    harvestDate: '2026-11-05',
    availabilityDate: '2026-11-20',
    district: 'Bogura',
    upazila: 'Shibganj',
    village: 'Gokul',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80'
    ],
    status: 'published',
    createdAt: '2026-11-14'
  },
  {
    id: 'lst_102',
    sellerId: 'usr_001',
    sellerName: 'মো: রফিকুল ইসলাম',
    sellerPhone: '01712345678',
    sellerType: 'Farmer',
    sellerVerified: true,
    sector: 'agriculture',
    category: 'Potatoes',
    productName: 'বগুড়ার তাজা ডায়মন্ড লাল গোল আলু (Bogura Diamond Potato)',
    description: 'মাটি থেকে সদ্য উত্তোলিত এক সাইজের সুস্থ রোগমুক্ত ডায়মন্ড জাতের আলু। কোল্ড স্টোরেজ সংরক্ষণ বা পাইকারি পাইপের জন্য শতভাগ উপযোগী।',
    quantity: 350,
    unit: 'maund',
    pricePerUnit: 1450,
    wholesaleRefPrice: 1420,
    qualityGrade: 'Grade A (প্রিমিয়াম)',
    harvestDate: '2026-11-12',
    availabilityDate: '2026-11-22',
    district: 'Bogura',
    upazila: 'Shibganj',
    village: 'Mahasthangarh',
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'
    ],
    status: 'published',
    createdAt: '2026-11-15'
  },
  {
    id: 'lst_103',
    sellerId: 'usr_002',
    sellerName: 'আনিসুর রহমান খন্দকার',
    sellerPhone: '01817766554',
    sellerType: 'Farmer',
    sellerVerified: true,
    sector: 'livestock',
    category: 'Goats',
    productName: 'খাঁটি দেশি ব্ল্যাক বেঙ্গল খাসি (Black Bengal Goat)',
    description: 'উন্নত দেশি ব্ল্যাক বেঙ্গল জাতের সম্পূর্ণ প্রাকৃতিক ঘাস ও খড় খাওয়া সুস্থ তাজা খাসি। কোনো কৃত্রিম হরমোন বা ক্ষতিকর ওষুধ ব্যবহার করা হয়নি। ওজন প্রায় ২৫-২৮ কেজি।',
    quantity: 8,
    unit: 'kg',
    pricePerUnit: 850,
    wholesaleRefPrice: 820,
    qualityGrade: 'Grade A (প্রিমিয়াম)',
    harvestDate: '2026-11-18',
    availabilityDate: '2026-11-21',
    district: 'Bogura',
    upazila: 'Gabtali',
    village: 'Pundro Nagar',
    images: [
      'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600&auto=format&fit=crop&q=80'
    ],
    status: 'published',
    createdAt: '2026-11-16'
  },
  {
    id: 'lst_104',
    sellerId: 'usr_003',
    sellerName: 'আলহাজ্ব মকবুল হোসেন এগ্রো',
    sellerPhone: '01912443322',
    sellerType: 'Agri-Business',
    sellerVerified: true,
    sector: 'fisheries',
    category: 'Rui',
    productName: 'ময়মনসিংহের জীবন্ত তাজা রুই মাছ (Live Rui Fish 1.8-2.2kg)',
    description: 'ত্রিশালের গভীর মিষ্টি জলের নিজস্ব ফিশারি থেকে আহরিত জীবন্ত রুই মাছ। প্রতিটি মাছের গড় ওজন ২ কেজির উপরে। সরাসরি জ্যান্ত পৌঁছানোর বিশেষ ড্রাম পরিবহণ ব্যবস্থা রয়েছে।',
    quantity: 45,
    unit: 'maund',
    pricePerUnit: 14000,
    wholesaleRefPrice: 13800,
    qualityGrade: 'Export Quality (রপ্তানি মান)',
    harvestDate: '2026-11-20',
    availabilityDate: '2026-11-21',
    district: 'Mymensingh',
    upazila: 'Trishal',
    village: 'Dhala',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80'
    ],
    status: 'published',
    createdAt: '2026-11-17'
  },
  {
    id: 'lst_105',
    sellerId: 'usr_004',
    sellerName: 'হেমন্ত এগ্রো ট্রেডার্স',
    sellerPhone: '01733889900',
    sellerType: 'Trader',
    sellerVerified: false,
    sector: 'agriculture',
    category: 'Rice & Paddy',
    productName: 'দিনাজপুরের সুগন্ধি কাটারিভোগ চাল (Katari Bhog Rice)',
    description: 'দিনাজপুরের খাঁটি নিজস্ব ঘ্রাণের সরু কাটারিভোগ চাল। অটোরাইস মিলে প্রক্রিয়াজাত। ৫০ কেজি সিল করা বস্তায় সরবরাহযোগ্য।',
    quantity: 200,
    unit: 'maund',
    pricePerUnit: 3400,
    wholesaleRefPrice: 3350,
    qualityGrade: 'Export Quality (রপ্তানি মান)',
    harvestDate: '2026-11-01',
    availabilityDate: '2026-11-20',
    district: 'Dinajpur',
    upazila: 'Dinajpur Sadar',
    village: 'Ranirbandar',
    images: [
      'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600&auto=format&fit=crop&q=80'
    ],
    status: 'published',
    createdAt: '2026-11-12'
  },
  {
    id: 'lst_106',
    sellerId: 'usr_001',
    sellerName: 'মো: রফিকুল ইসলাম',
    sellerPhone: '01712345678',
    sellerType: 'Farmer',
    sellerVerified: true,
    sector: 'livestock',
    category: 'Milk',
    productName: 'খাঁটি গরুর খাঁটি দুধ (Fresh Cow Milk)',
    description: 'ফ্রিজিয়ান ও শাহীওয়াল সংকর গরুর সরাসরি গোয়াল থেকে সংগৃহীত খাঁটি ঘন দুধ। ফ্যাট ৪.২% এর বেশি। হোটেল বা মিষ্টি ব্যবসায়ীদের জন্য প্রতিদিন সকালে সরবরাহ সম্ভব।',
    quantity: 80,
    unit: 'kg',
    pricePerUnit: 75,
    wholesaleRefPrice: 70,
    qualityGrade: 'Grade A (প্রিমিয়াম)',
    harvestDate: '2026-11-19',
    availabilityDate: '2026-11-20',
    district: 'Bogura',
    upazila: 'Shibganj',
    village: 'Gokul',
    images: [
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'
    ],
    status: 'published',
    createdAt: '2026-11-18'
  }
];

export const INITIAL_INQUIRIES: NegotiationInquiry[] = [
  {
    id: 'inq_501',
    listingId: 'lst_101',
    productName: 'প্রিমিয়াম ব্রি ধান-২৮ (BRRI dhan-28 Paddy)',
    productImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    sector: 'agriculture',
    sellerId: 'usr_001',
    sellerName: 'মো: রফিকুল ইসলাম',
    sellerPhone: '01712345678',
    buyerId: 'byr_201',
    buyerName: 'হাজী কাশেম অ্যান্ড সন্স (কাওরান বাজার আড়তদার)',
    buyerPhone: '01711998877',
    buyerRole: 'Wholesale Buyer (পাইকারি আড়তদার)',
    requestedQuantity: 50,
    unit: 'maund',
    initialOfferedPrice: 1280,
    currentAgreedPrice: 1330,
    status: 'accepted',
    createdAt: '2026-11-17 11:20 AM',
    updatedAt: '2026-11-18 04:30 PM',
    messages: [
      {
        id: 'msg_1',
        senderId: 'byr_201',
        senderName: 'হাজী কাশেম',
        text: 'আসসালামু আলাইকুম রফিকুল ভাই। আপনার ব্রি-২৮ ধান ৫০ মণ নিতে চাই। দাম ১২৮০ টাকা মণ ধরে দিলে কালই ট্রাক পাঠাতে পারি।',
        timestamp: '2026-11-17 11:20 AM',
        offerUpdate: { pricePerUnit: 1280, quantity: 50 }
      },
      {
        id: 'msg_2',
        senderId: 'usr_001',
        senderName: 'মো: রফিকুল ইসলাম',
        text: 'ওয়ালাইকুম আসসালাম হাজী সাহেব। ধান একদম প্রথম শ্রেণির শুকনো। বাজারে এখন পাইকারি ১৩২০ এর উপরে চলছে। আপনি সম্মানজনক ১৩৪০ টাকা দিলে চুক্তি করতে পারি।',
        timestamp: '2026-11-17 01:15 PM',
        offerUpdate: { pricePerUnit: 1340, quantity: 50 }
      },
      {
        id: 'msg_3',
        senderId: 'byr_201',
        senderName: 'হাজী কাশেম',
        text: 'ভাই, গাড়িভাড়া ও লেবার খরচ মিলিয়ে খরচ বেশি পড়ে। মাঝামাঝি ১৩৩০ টাকা মণ নির্ধারণ করলে আমি নিশ্চিত করছি। ক্যাশ অন পিকআপ হবে।',
        timestamp: '2026-11-18 03:00 PM',
        offerUpdate: { pricePerUnit: 1330, quantity: 50 }
      },
      {
        id: 'msg_4',
        senderId: 'usr_001',
        senderName: 'মো: রফিকুল ইসলাম',
        text: 'ঠিক আছে হাজী সাহেব, আপনার নিয়মিত ব্যবসার খাতিরে ১৩৩০ টাকা মণ দরে রাজি হলাম। আমি অর্ডার কনফার্ম করে রসিদ পাঠাচ্ছি।',
        timestamp: '2026-11-18 04:30 PM'
      }
    ]
  },
  {
    id: 'inq_502',
    listingId: 'lst_102',
    productName: 'বগুড়ার তাজা ডায়মন্ড লাল গোল আলু (Bogura Diamond Potato)',
    productImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    sector: 'agriculture',
    sellerId: 'usr_001',
    sellerName: 'মো: রফিকুল ইসলাম',
    sellerPhone: '01712345678',
    buyerId: 'byr_202',
    buyerName: 'মেসার্স ভাই ভাই এন্টারপ্রাইজ (যাত্রাবাড়ী)',
    buyerPhone: '01815123456',
    buyerRole: 'Trader / আড়তদার',
    requestedQuantity: 100,
    unit: 'maund',
    initialOfferedPrice: 1380,
    currentAgreedPrice: 1400,
    status: 'countered',
    createdAt: '2026-11-19 09:10 AM',
    updatedAt: '2026-11-19 11:45 AM',
    messages: [
      {
        id: 'msg_11',
        senderId: 'byr_202',
        senderName: 'আব্দুল কাদের',
        text: 'রফিকুল ভাই, মহাস্থানগড় থেকে ১০০ মণ লাল আলু ১৩৮০ টাকায় নেওয়া যাবে? বস্তা কি আপনার থাকবে?',
        timestamp: '2026-11-19 09:10 AM',
        offerUpdate: { pricePerUnit: 1380, quantity: 100 }
      },
      {
        id: 'msg_12',
        senderId: 'usr_001',
        senderName: 'মো: রফিকুল ইসলাম',
        text: 'কাদের ভাই, বস্তাসহ দিতে পারব তবে প্রতি মণ ১৪২০ টাকা লাগবে। আলু ফ্রেশ কোনো দাগ নেই।',
        timestamp: '2026-11-19 11:45 AM',
        offerUpdate: { pricePerUnit: 1420, quantity: 100 }
      }
    ]
  }
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord_9001',
    listingId: 'lst_101',
    inquiryId: 'inq_501',
    buyerId: 'byr_201',
    buyerName: 'হাজী কাশেম অ্যান্ড সন্স',
    buyerPhone: '01711998877',
    sellerId: 'usr_001',
    sellerName: 'মো: রফিকুল ইসলাম',
    sellerPhone: '01712345678',
    productName: 'প্রিমিয়াম ব্রি ধান-২৮ (BRRI dhan-28 Paddy)',
    sector: 'agriculture',
    quantity: 50,
    unit: 'maund',
    agreedPricePerUnit: 1330,
    totalOrderValue: 66500,
    paymentMethod: 'Cash on Pickup',
    orderDate: '2026-11-18',
    expectedDate: '2026-11-20',
    status: 'ready_for_pickup',
    pickupLocation: 'গ্রাম: গোকুল উত্তরপাড়া, শিবগঞ্জ, বগুড়া (রফিকুল ইসলামের চাতাল)',
    district: 'Bogura',
    upazila: 'Shibganj',
    receiptNumber: 'AGX-REC-2026-11801',
    notes: 'ক্রেতা নিজ খরচে ট্রাক পাঠাবেন। লোডিংয়ের সময় ক্যাশ টাকা পরিশোধ হবে।'
  },
  {
    id: 'ord_9002',
    listingId: 'lst_106',
    buyerId: 'byr_203',
    buyerName: 'বগুড়া মিষ্টি মেলা (সুইট মার্ট)',
    buyerPhone: '01552334455',
    sellerId: 'usr_001',
    sellerName: 'মো: রফিকুল ইসলাম',
    sellerPhone: '01712345678',
    productName: 'খাঁটি গরুর খাঁটি দুধ (Fresh Cow Milk)',
    sector: 'livestock',
    quantity: 40,
    unit: 'kg',
    agreedPricePerUnit: 72,
    totalOrderValue: 2880,
    paymentMethod: 'Cash on Delivery',
    orderDate: '2026-11-17',
    expectedDate: '2026-11-18',
    status: 'completed',
    pickupLocation: 'সাতমাথা মোড়, বগুড়া সদর',
    district: 'Bogura',
    upazila: 'Bogura Sadar',
    receiptNumber: 'AGX-REC-2026-11704',
    notes: 'দুধ ডেলিভারি সম্পন্ন হয়েছে এবং মূল্য নগদে পরিশোধিত।'
  }
];

export const INITIAL_PRICE_ALERTS: PriceAlert[] = [
  {
    id: 'alt_1',
    userId: 'usr_001',
    productName: 'ব্রি ধান-২৮ (Paddy BRRI-28)',
    sector: 'agriculture',
    district: 'Bogura',
    marketName: 'Gokul Haat',
    targetPrice: 1350,
    unit: 'maund',
    condition: 'at_or_above',
    isActive: true,
    currentObservedPrice: 1320,
    source: 'কৃষি বিপণন অধিদপ্তর (DAM Regional)',
    updatedAt: '2026-11-19 08:00 AM'
  },
  {
    id: 'alt_2',
    userId: 'usr_001',
    productName: 'ডায়মন্ড আলু (Diamond Potato)',
    sector: 'agriculture',
    district: 'Bogura',
    marketName: 'Mahasthangarh Arat',
    targetPrice: 1500,
    unit: 'maund',
    condition: 'at_or_above',
    isActive: true,
    currentObservedPrice: 1420,
    source: 'কৃষি বিপণন অধিদপ্তর (DAM Regional)',
    updatedAt: '2026-11-19 08:00 AM'
  },
  {
    id: 'alt_3',
    userId: 'usr_001',
    productName: 'রুই মাছ (Rui 1.5-2kg)',
    sector: 'fisheries',
    district: 'Mymensingh',
    marketName: 'Trishal Fish Arat',
    targetPrice: 13500,
    unit: 'maund',
    condition: 'at_or_below',
    isActive: false,
    currentObservedPrice: 13800,
    source: 'মৎস্য আড়ত অ্যাসোসিয়েশন',
    updatedAt: '2026-11-18 10:00 AM'
  }
];

export const INITIAL_MARKET_PRICES: MarketPriceItem[] = [
  {
    id: 'mkt_1',
    product: 'BRRI-28 Paddy',
    productBn: 'ব্রি ধান-২৮ (ধান)',
    sector: 'agriculture',
    category: 'Rice & Paddy',
    wholesalePrice: 1320,
    retailPrice: 1420,
    minPrice: 1280,
    maxPrice: 1360,
    unit: 'maund',
    marketLocation: 'মহাস্থান আড়ত ও গোকুল হাট',
    district: 'Bogura',
    source: 'কৃষি বিপণন অধিদপ্তর (DAM Demo Hub)',
    recordedTimestamp: '2026-11-19 09:30 AM',
    historicalTrend: [
      { date: '13 Nov', price: 1290 },
      { date: '14 Nov', price: 1300 },
      { date: '15 Nov', price: 1310 },
      { date: '16 Nov', price: 1315 },
      { date: '17 Nov', price: 1320 },
      { date: '18 Nov', price: 1325 },
      { date: '19 Nov', price: 1320 }
    ]
  },
  {
    id: 'mkt_2',
    product: 'Diamond Potato',
    productBn: 'ডায়মন্ড গোল আলু',
    sector: 'agriculture',
    category: 'Potatoes',
    wholesalePrice: 1420,
    retailPrice: 1600,
    minPrice: 1380,
    maxPrice: 1460,
    unit: 'maund',
    marketLocation: 'মহাস্থান সবজি আড়ত',
    district: 'Bogura',
    source: 'কৃষি বিপণন অধিদপ্তর (DAM Demo Hub)',
    recordedTimestamp: '2026-11-19 09:30 AM',
    historicalTrend: [
      { date: '13 Nov', price: 1480 },
      { date: '14 Nov', price: 1460 },
      { date: '15 Nov', price: 1450 },
      { date: '16 Nov', price: 1440 },
      { date: '17 Nov', price: 1430 },
      { date: '18 Nov', price: 1420 },
      { date: '19 Nov', price: 1420 }
    ]
  },
  {
    id: 'mkt_3',
    product: 'Baneswar Hybrid Maize',
    productBn: 'শুকনো ভুট্টা (দানাদার)',
    sector: 'agriculture',
    category: 'Other Crops',
    wholesalePrice: 1180,
    retailPrice: 1280,
    minPrice: 1140,
    maxPrice: 1210,
    unit: 'maund',
    marketLocation: 'বানেশ্বর হাট ও মাস্টারপাড়া',
    district: 'Rajshahi',
    source: 'কৃষি বিপণন অধিদপ্তর (DAM Demo Hub)',
    recordedTimestamp: '2026-11-19 09:15 AM',
    historicalTrend: [
      { date: '13 Nov', price: 1150 },
      { date: '14 Nov', price: 1160 },
      { date: '15 Nov', price: 1165 },
      { date: '16 Nov', price: 1170 },
      { date: '17 Nov', price: 1175 },
      { date: '18 Nov', price: 1180 },
      { date: '19 Nov', price: 1180 }
    ]
  },
  {
    id: 'mkt_4',
    product: 'Black Bengal Goat Meat',
    productBn: 'ব্ল্যাক বেঙ্গল ছাগল (জীবন্ত)',
    sector: 'livestock',
    category: 'Goats',
    wholesalePrice: 820,
    retailPrice: 950,
    minPrice: 780,
    maxPrice: 860,
    unit: 'kg',
    marketLocation: 'গাবতলী পশু হাট',
    district: 'Bogura',
    source: 'উপজেলা প্রাণিসম্পদ বাজার মনিটরিং',
    recordedTimestamp: '2026-11-19 08:45 AM',
    historicalTrend: [
      { date: '13 Nov', price: 800 },
      { date: '14 Nov', price: 810 },
      { date: '15 Nov', price: 815 },
      { date: '16 Nov', price: 820 },
      { date: '17 Nov', price: 825 },
      { date: '18 Nov', price: 820 },
      { date: '19 Nov', price: 820 }
    ]
  },
  {
    id: 'mkt_5',
    product: 'Fresh Cow Milk',
    productBn: 'খাঁটি তরল দুধ (গোয়াল)',
    sector: 'livestock',
    category: 'Milk',
    wholesalePrice: 70,
    retailPrice: 85,
    minPrice: 65,
    maxPrice: 75,
    unit: 'kg',
    marketLocation: 'রাজাবাজার দুগ্ধ আড়ত',
    district: 'Bogura',
    source: 'বাংলাদেশ ডেইরি ফার্মার্স অ্যাসোসিয়েশন',
    recordedTimestamp: '2026-11-19 07:30 AM',
    historicalTrend: [
      { date: '13 Nov', price: 68 },
      { date: '14 Nov', price: 70 },
      { date: '15 Nov', price: 70 },
      { date: '16 Nov', price: 72 },
      { date: '17 Nov', price: 70 },
      { date: '18 Nov', price: 70 },
      { date: '19 Nov', price: 70 }
    ]
  },
  {
    id: 'mkt_6',
    product: 'Trishal Fresh Rui Fish',
    productBn: 'ত্রিশাল তাজা রুই মাছ (২ কেজি সাইজ)',
    sector: 'fisheries',
    category: 'Rui',
    wholesalePrice: 13800,
    retailPrice: 15500,
    minPrice: 13200,
    maxPrice: 14200,
    unit: 'maund',
    marketLocation: 'ত্রিশাল মাছের আড়ত',
    district: 'Mymensingh',
    source: 'ত্রিশাল ফিশ ট্রেডার্স সমিতি',
    recordedTimestamp: '2026-11-19 06:45 AM',
    historicalTrend: [
      { date: '13 Nov', price: 13500 },
      { date: '14 Nov', price: 13600 },
      { date: '15 Nov', price: 13700 },
      { date: '16 Nov', price: 13750 },
      { date: '17 Nov', price: 13900 },
      { date: '18 Nov', price: 13800 },
      { date: '19 Nov', price: 13800 }
    ]
  },
  {
    id: 'mkt_7',
    product: 'Monosex Tilapia',
    productBn: 'মনোসেক্স তেলাপিয়া (মাঝারি)',
    sector: 'fisheries',
    category: 'Tilapia',
    wholesalePrice: 6800,
    retailPrice: 7800,
    minPrice: 6500,
    maxPrice: 7200,
    unit: 'maund',
    marketLocation: 'মেচুয়া বাজার মৎস্য আড়ত',
    district: 'Mymensingh',
    source: 'কৃষি বিপণন অধিদপ্তর',
    recordedTimestamp: '2026-11-19 08:30 AM',
    historicalTrend: [
      { date: '13 Nov', price: 6600 },
      { date: '14 Nov', price: 6700 },
      { date: '15 Nov', price: 6700 },
      { date: '16 Nov', price: 6800 },
      { date: '17 Nov', price: 6850 },
      { date: '18 Nov', price: 6800 },
      { date: '19 Nov', price: 6800 }
    ]
  }
];

export const INITIAL_EXPERTS: ExpertProfile[] = [
  {
    id: 'exp_1',
    name: 'ড. মো: আনোয়ার হোসেন (Dr. Md. Anwar Hossain)',
    nameBn: 'ড. মো: আনোয়ার হোসেন',
    category: 'agriculturist',
    designation: 'Senior Agronomist & Crop Specialist',
    designationBn: 'ঊর্ধ্বতন কৃষিবিদ ও ফসল বিশেষজ্ঞ (সাবেক বৈজ্ঞানিক কর্মকর্তা, BARI)',
    qualification: 'Ph.D. in Agronomy (BAU), M.Sc. (Ag)',
    experienceYears: 16,
    verified: true,
    district: 'Bogura',
    rating: 4.9,
    reviewsCount: 148,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    availableDays: ['শনিবার', 'সোমবার', 'বুধবার', 'বৃহস্পতিবার'],
    consultationFee: 300,
    phone: '01718001122',
    email: 'dr.anwar.bari@agronex.bd',
    aboutBn: 'উত্তরবঙ্গের ধান, গম, আলু ও ভুট্টা ফসলের রোগবালাই দমন, জৈব চাষাবাদ এবং সুষম সার প্রয়োগে দীর্ঘ ১৬ বছরের মাঠপর্যায়ের অভিজ্ঞতা।'
  },
  {
    id: 'exp_2',
    name: 'ডা: নাজমুল হক (Dr. Nazmul Haque, DVM)',
    nameBn: 'ডা: নাজমুল হক',
    category: 'veterinary',
    designation: 'Veterinary Surgeon & Livestock Consultant',
    designationBn: 'ভেটেরিনারি সার্জন ও গবাদিপশু পুষ্টিবিদ',
    qualification: 'DVM, MS in Animal Science (BAU, Mymensingh)',
    experienceYears: 11,
    verified: true,
    district: 'Bogura',
    rating: 4.8,
    reviewsCount: 112,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    availableDays: ['প্রতিদিন (জরুরি সেবা ২৪/৭)'],
    consultationFee: 350,
    phone: '01819556677',
    email: 'dr.nazmul.vet@agronex.bd',
    aboutBn: 'ডেইরি ও ছাগলের সংক্রামক ব্যাধি, খুরা রোগ, তড়কা, কৃমিনাশক শিডিউল এবং এআই (কৃত্রিম প্রজনন) বিশেষজ্ঞ।'
  },
  {
    id: 'exp_3',
    name: 'ড. ফারহানা সুলতানা (Dr. Farhana Sultana)',
    nameBn: 'ড. ফারহানা সুলতানা',
    category: 'fisheries',
    designation: 'Aquaculture Specialist & Fish Pathologist',
    designationBn: 'মৎস্য বিজ্ঞানী ও রোগতত্ত্ব বিশেষজ্ঞ (BFRI)',
    qualification: 'Ph.D. in Aquaculture (KU), MS in Fisheries (BAU)',
    experienceYears: 14,
    verified: true,
    district: 'Mymensingh',
    rating: 4.9,
    reviewsCount: 95,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    availableDays: ['রবিবার', 'মঙ্গলবার', 'বৃহস্পতিবার'],
    consultationFee: 300,
    phone: '01911448833',
    email: 'dr.farhana.bfri@agronex.bd',
    aboutBn: 'পুকুরের জলের গুণমান নিয়ন্ত্রণ, অক্সিজেন সংকট সমাধান, কার্প মিশ্র চাষ এবং মনোসেক্স তেলাপিয়ার আধুনিক চাষে বিশেষজ্ঞ।'
  }
];

export const INITIAL_CONSULTATIONS: ConsultationBooking[] = [
  {
    id: 'cns_801',
    expertId: 'exp_2',
    expertName: 'ডা: নাজমুল হক (Dr. Nazmul Haque)',
    category: 'veterinary',
    farmerId: 'usr_001',
    farmerName: 'মো: রফিকুল ইসলাম',
    farmerPhone: '01712345678',
    sector: 'livestock',
    topic: 'ষাঁড়ের গায়ে হঠাৎ কাশি ও খুরা ফোলা ভাব',
    urgency: 'emergency',
    description: 'আমার আরসিসি জাতের ষাঁড়ের মুখে ফেনা এবং পায়ে ফোলা দেখা দিয়েছে। জ্বর ১০৩ ডিগ্রি। জরুরি পরামর্শ চাই।',
    preferredDate: '2026-11-19',
    preferredTime: '11:00 AM',
    status: 'confirmed',
    notes: 'ভিডিও কলে প্রাথমিক নিরীক্ষা সম্পন্ন। প্যারাসিটামল বোলাস ও অ্যান্টিসেপটিক স্প্রে ব্যবহারের পরামর্শ দেওয়া হয়েছে।',
    prescription: '১. রেনামাইসিন ভেট ইনজেকশন (প্রেসক্রিপশন অনুযায়ী)\n২. পটাশিয়াম পারম্যাঙ্গানেট দিয়ে ক্ষুর ধোয়া\n৩. নরম খাদ্য ও ঠাণ্ডা ছায়াযুক্ত স্থানে রাখা',
    createdAt: '2026-11-19 09:00 AM'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'ntf_1',
    userId: 'usr_001',
    sector: 'marketplace',
    title: 'Offer Accepted! (অফার গৃহীত হয়েছে)',
    titleBn: 'অফার গৃহীত হয়েছে! ব্রি-২৮ ধান ৫০ মণ',
    message: 'Haji Kashem and Sons has accepted your counteroffer of BDT 1,330/maund.',
    messageBn: 'হাজী কাশেম অ্যান্ড সন্স আপনার ১৩৩০ টাকা/মণ প্রতি কাউন্টার অফার গ্রহণ করেছে। ডিজিটাল রসিদ তৈরি হয়েছে।',
    type: 'offer',
    isRead: false,
    timestamp: '১ ঘন্টা আগে',
    linkTab: 'marketplace'
  },
  {
    id: 'ntf_2',
    userId: 'usr_001',
    sector: 'agriculture',
    title: 'Weather Advisory (আবহাওয়া সতর্কতা)',
    titleBn: 'আগামী ৪৮ ঘণ্টায় হালকা বৃষ্টিপাতের সম্ভাবনা',
    message: 'Postpone fertilizer spreading in North Paddy Field to avoid leaching.',
    messageBn: 'বগুড়া অঞ্চলে হালকা বৃষ্টির সম্ভাবনা রয়েছে। উত্তর মাঠের ধান জমিতে আজ ইউরিয়া ছিটানো স্থগিত রাখুন।',
    type: 'weather',
    isRead: false,
    timestamp: '৩ ঘন্টা আগে',
    linkTab: 'agriculture'
  },
  {
    id: 'ntf_3',
    userId: 'usr_001',
    sector: 'livestock',
    title: 'Vaccination Alert (টিকা সতর্কবার্তা)',
    titleBn: 'খুরারোগের বুস্টার ডোজ সময় আসন্ন',
    message: 'Friesian Cow (COW-BD-041) vaccination is due on 10 Dec 2026.',
    messageBn: 'গাভী COW-BD-041 এর এফএমডি (খুরারোগ) বুস্টার ডোজের তারিখ ১০ ডিসেম্বর। উপজেলা প্রাণিসম্পদে যোগাযোগ করুন।',
    type: 'reminder',
    isRead: true,
    timestamp: 'গতকাল',
    linkTab: 'livestock'
  },
  {
    id: 'ntf_4',
    userId: 'usr_001',
    sector: 'fisheries',
    title: 'Water Quality Warning (জলের গুণমান সতর্কতা)',
    titleBn: 'তেলাপিয়া পুকুরে অ্যামোনিয়ার মাত্রা বৃদ্ধি',
    message: 'Pond 2 Ammonia measured 0.12 ppm (Safe limit < 0.05 ppm).',
    messageBn: 'পুকুর ২ তে অ্যামোনিয়া বৃদ্ধি পেয়েছে। খাদ্য সরবরাহ ২০% কমান এবং কৃষি চুন প্রয়োগ করুন।',
    type: 'alert',
    isRead: false,
    timestamp: 'আজ সকাল ৭:১৫',
    linkTab: 'fisheries'
  }
];

export const INITIAL_REMINDERS: CalendarReminder[] = [
  {
    id: 'rem_1',
    sector: 'agriculture',
    title: 'ইউরিয়া ও পটাশ সার প্রয়োগ (Fertilizer)',
    titleBn: 'আলু জমিতে ২য় কিস্তির ইউরিয়া ও পটাশ সার প্রয়োগ',
    date: '2026-11-20',
    stage: 'বৃদ্ধি পর্যায় (Vegetative)',
    priority: 'high',
    isCompleted: false,
    entityName: 'মহাস্থান আলু প্রজেক্ট'
  },
  {
    id: 'rem_2',
    sector: 'agriculture',
    title: 'হালকা সেচ প্রদান (Light Irrigation)',
    titleBn: 'উত্তর মাঠের ধান জমিতে ২ ইঞ্চি সেচ নিশ্চিত করা',
    date: '2026-11-21',
    stage: 'কুশি পর্যায় (Tillering)',
    priority: 'medium',
    isCompleted: false,
    entityName: 'উত্তর মাঠের ধান জমি'
  },
  {
    id: 'rem_3',
    sector: 'livestock',
    title: 'গবাদিপশুর কৃমিনাশক ডোজ (Deworming)',
    titleBn: 'সব ব্ল্যাক বেঙ্গল ছাগলকে অ্যালবেনডাজল সিরাপ প্রয়োগ',
    date: '2026-11-22',
    stage: 'নিয়মিত স্বাস্থ্য সুরক্ষা',
    priority: 'high',
    isCompleted: false,
    entityName: 'দেশি ব্ল্যাক বেঙ্গল ছাগল প্রকল্প'
  },
  {
    id: 'rem_4',
    sector: 'fisheries',
    title: 'পুকুরে চুন ও লবণ প্রয়োগ (Liming)',
    titleBn: 'তেলাপিয়া নার্সারিতে শতাংশ প্রতি ২৫০ গ্রাম চুন প্রয়োগ',
    date: '2026-11-20',
    stage: 'জল শোধন পর্যায়',
    priority: 'high',
    isCompleted: false,
    entityName: 'মনোসেক্স তেলাপিয়া নার্সারি'
  }
];

