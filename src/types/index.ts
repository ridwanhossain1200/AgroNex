export type UserRole = 
  | 'agri_farmer'
  | 'livestock_farmer'
  | 'fish_farmer'
  | 'marketplace_seller'
  | 'wholesale_buyer'
  | 'trader_aratdar'
  | 'retailer'
  | 'consumer'
  | 'agri_expert'
  | 'vet_doctor'
  | 'fisheries_specialist'
  | 'admin';

export type SectorType = 'agriculture' | 'livestock' | 'fisheries' | 'marketplace';

export type Language = 'bn' | 'en';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  roles: UserRole[];
  sectors: SectorType[];
  division: string;
  district: string;
  upazila: string;
  village: string;
  avatar?: string;
  isVerified: boolean;
  businessName?: string;
  joinedDate: string;
}

// 7. Agriculture
export type LandUnit = 'decimal' | 'bigha' | 'acre' | 'hectare' | 'katha';

export interface LandProfile {
  id: string;
  name: string;
  size: number;
  unit: LandUnit;
  soilType: 'Alluvial (পলি)' | 'Clay (এঁটেল)' | 'Loam (দোআঁশ)' | 'Sandy Loam (বেলে দোআঁশ)' | 'Saline (লবণাক্ত)';
  division: string;
  district: string;
  upazila: string;
  village: string;
  waterSource: 'Deep Tubewell' | 'Pond / River' | 'Rainfed' | 'Canal Irrigation';
  season: 'Kharif-1 (খরিপ-১)' | 'Kharif-2 (খরিপ-২)' | 'Rabi (রবি)';
  currentCrop?: string;
  lastUpdated: string;
}

export interface FertilizerDetail {
  name: string;
  nameBn: string;
  quantityKg: number;
  applicationSchedule: string;
  applicationScheduleBn: string;
  method: string;
  methodBn: string;
  estimatedCost: number;
}

export interface FertilizerPlan {
  id: string;
  cropName: string;
  landSize: number;
  unit: LandUnit;
  soilType: string;
  growthStage: string;
  fertilizers: FertilizerDetail[];
  totalEstimatedCost: number;
  guidanceBn: string;
  guidanceEn: string;
  createdAt: string;
}

export interface PestTroubleshoot {
  id: string;
  crop: string;
  symptoms: string[];
  description: string;
  possibleDiseases: Array<{
    name: string;
    nameBn: string;
    confidence: number;
    severity: 'low' | 'moderate' | 'high' | 'critical';
    symptomsBn: string;
    preventionBn: string;
    organicControlBn: string;
    chemicalControlBn: string;
    expertConsultationRecommended: boolean;
  }>;
  date: string;
}

// 8. Livestock
export type LivestockType = 'cattle' | 'goat' | 'poultry';

export interface LivestockFarm {
  id: string;
  name: string;
  livestockType: LivestockType;
  animalCount: number;
  budget: number;
  purpose: 'Dairy (দুগ্ধ)' | 'Fattening (হৃষ্টপুষ্টকরণ)' | 'Meat (মাংস)' | 'Layer (ডিম)' | 'Broiler (ব্রয়লার)' | 'Breeding (প্রজনন)';
  district: string;
  upazila: string;
  availableSpaceSqFt: number;
  capacity: number;
  setupCostEstimate: number;
  monthlyOperatingCost: number;
  lastUpdated: string;
}

export interface AnimalRecord {
  id: string;
  farmId: string;
  tagNumber: string;
  breed: string;
  ageMonths: number;
  gender: 'Male' | 'Female';
  weightKg: number;
  healthStatus: 'healthy' | 'treatment' | 'quarantine' | 'sold';
  notes?: string;
}

export interface VaccinationRecord {
  id: string;
  farmId: string;
  animalIdOrGroup: string;
  vaccineName: string;
  administeredDate: string;
  nextDueDate: string;
  veterinarian: string;
  status: 'completed' | 'upcoming' | 'overdue';
  notes?: string;
}

export interface FeedingLog {
  id: string;
  farmId: string;
  date: string;
  feedType: string;
  feedQuantityKg: number;
  totalWeightGainKg: number;
  calculatedFCR: number; // feed / gain
  notes?: string;
}

// 9. Fisheries
export interface PondProfile {
  id: string;
  name: string;
  sizeDecimal: number;
  depthFeet: number;
  waterSource: 'Groundwater / Deep Tube-well' | 'River / Canal' | 'Rainfed Reservoir';
  farmingType: 'monoculture' | 'polyculture';
  primarySpecies: string[];
  district: string;
  upazila: string;
  budget: number;
  stockingDate: string;
  lastUpdated: string;
}

export interface WaterQualityRecord {
  id: string;
  pondId: string;
  recordedDate: string;
  ph: number; // ideal: 6.5 - 8.5
  ammoniaPpm: number; // ideal: < 0.05
  dissolvedOxygenMgL: number; // ideal: 5 - 8
  temperatureC: number; // ideal: 25 - 32
  transparencyCm: number; // ideal: 25 - 35
  status: 'optimal' | 'warning' | 'critical';
  recommendations: string[];
}

export interface HatcheryListing {
  id: string;
  hatcheryName: string;
  ownerName: string;
  phone: string;
  district: string;
  upazila: string;
  verified: boolean;
  species: Array<{
    name: string;
    sizeInch: string;
    pricePerThousand: number;
    availableStock: number;
  }>;
  rating: number;
  reviewsCount: number;
}

// 10. Marketplace
export type ProduceUnit = 'maund' | 'kg' | 'quintal' | 'piece' | 'ton';
export type QualityGrade = 'Grade A (প্রিমিয়াম)' | 'Grade B (স্ট্যান্ডার্ড)' | 'Standard (সাধারণ)' | 'Export Quality (রপ্তানি মান)';
export type ListingStatus = 'draft' | 'published' | 'reserved' | 'sold' | 'paused' | 'expired';

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerType: 'Farmer' | 'Trader' | 'Agri-Business';
  sellerVerified: boolean;
  sector: SectorType;
  category: string;
  productName: string;
  description: string;
  quantity: number;
  unit: ProduceUnit;
  pricePerUnit: number; // BDT
  wholesaleRefPrice?: number;
  qualityGrade: QualityGrade;
  harvestDate: string;
  availabilityDate: string;
  district: string;
  upazila: string;
  village: string;
  images: string[];
  status: ListingStatus;
  createdAt: string;
}

export interface NegotiationMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  offerUpdate?: {
    pricePerUnit: number;
    quantity: number;
  };
}

export interface NegotiationInquiry {
  id: string;
  listingId: string;
  productName: string;
  productImage?: string;
  sector: SectorType;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerRole: string;
  requestedQuantity: number;
  unit: ProduceUnit;
  initialOfferedPrice: number;
  currentAgreedPrice: number;
  status: 'pending' | 'countered' | 'accepted' | 'rejected' | 'ordered';
  messages: NegotiationMessage[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'accepted' | 'ready_for_pickup' | 'completed' | 'cancelled';

export interface OrderRecord {
  id: string;
  listingId: string;
  inquiryId?: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  productName: string;
  sector: SectorType;
  quantity: number;
  unit: ProduceUnit;
  agreedPricePerUnit: number;
  totalOrderValue: number;
  paymentMethod: 'Cash on Pickup' | 'Cash on Delivery';
  orderDate: string;
  expectedDate: string;
  status: OrderStatus;
  pickupLocation: string;
  district: string;
  upazila: string;
  receiptNumber: string;
  notes?: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  productName: string;
  sector: SectorType;
  district: string;
  marketName?: string;
  targetPrice: number;
  unit: ProduceUnit;
  condition: 'at_or_above' | 'at_or_below';
  isActive: boolean;
  currentObservedPrice: number;
  lastTriggered?: string;
  source: string;
  updatedAt: string;
}

// 11. Market Price Intelligence
export interface MarketPriceItem {
  id: string;
  product: string;
  productBn: string;
  sector: SectorType;
  category: string;
  wholesalePrice: number;
  retailPrice: number;
  minPrice: number;
  maxPrice: number;
  unit: ProduceUnit;
  marketLocation: string;
  district: string;
  source: string;
  recordedTimestamp: string;
  historicalTrend: Array<{ date: string; price: number }>;
}

// 12. Experts
export type ExpertSpecialization = 'agriculturist' | 'veterinary' | 'fisheries';

export interface ExpertProfile {
  id: string;
  name: string;
  nameBn: string;
  category: ExpertSpecialization;
  designation: string;
  designationBn: string;
  qualification: string;
  experienceYears: number;
  verified: boolean;
  district: string;
  rating: number;
  reviewsCount: number;
  avatarUrl: string;
  availableDays: string[];
  consultationFee: number;
  phone: string;
  email: string;
  aboutBn: string;
}

export interface ConsultationBooking {
  id: string;
  expertId: string;
  expertName: string;
  category: ExpertSpecialization;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  sector: SectorType;
  topic: string;
  urgency: 'normal' | 'emergency';
  description: string;
  preferredDate: string;
  preferredTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  prescription?: string;
  createdAt: string;
}

// 13. Notifications
export interface NotificationItem {
  id: string;
  userId: string;
  sector: SectorType | 'general';
  title: string;
  titleBn: string;
  message: string;
  messageBn: string;
  type: 'reminder' | 'offer' | 'order' | 'weather' | 'alert' | 'expert' | 'emergency';
  isRead: boolean;
  timestamp: string;
  linkTab?: string;
}

// Reminders & Crop Calendar
export interface CalendarReminder {
  id: string;
  sector: SectorType;
  title: string;
  titleBn: string;
  date: string;
  stage: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  entityName?: string; // Land name, farm name, or pond name
}

