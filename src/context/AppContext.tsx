import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole, 
  SectorType, 
  Language, 
  LandProfile, 
  FertilizerPlan, 
  LivestockFarm, 
  AnimalRecord, 
  VaccinationRecord, 
  FeedingLog, 
  PondProfile, 
  WaterQualityRecord, 
  MarketplaceListing, 
  NegotiationInquiry, 
  OrderRecord, 
  PriceAlert, 
  MarketPriceItem, 
  ExpertProfile, 
  ConsultationBooking, 
  NotificationItem, 
  CalendarReminder 
} from '../types';

import { 
  INITIAL_USER, 
  INITIAL_LANDS, 
  INITIAL_LIVESTOCK_FARMS, 
  INITIAL_ANIMALS, 
  INITIAL_VACCINATIONS, 
  INITIAL_FEEDING_LOGS, 
  INITIAL_PONDS, 
  INITIAL_WATER_QUALITY, 
  INITIAL_LISTINGS, 
  INITIAL_INQUIRIES, 
  INITIAL_ORDERS, 
  INITIAL_PRICE_ALERTS, 
  INITIAL_MARKET_PRICES, 
  INITIAL_EXPERTS, 
  INITIAL_CONSULTATIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_REMINDERS 
} from '../data/mockData';

export const DEFAULT_USER: UserProfile = {
  id: 'usr_guest',
  name: 'সম্মানিত কৃষক সদস্য (Member)',
  phone: '01700000000',
  email: '',
  roles: ['agri_farmer'],
  sectors: ['agriculture'],
  division: 'Rajshahi',
  district: 'Bogura',
  upazila: 'Bogura Sadar',
  village: '',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  isVerified: true,
  businessName: '',
  joinedDate: 'আজ (Today)'
};

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  // Global & User State
  language: Language;
  setLanguage: (lang: Language) => void;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;

  // Auth & Session
  isAuthenticated: boolean;
  login: (userProfile: UserProfile, remember?: boolean) => void;
  loginWithPhoneOtp: (phone: string, otp: string, remember?: boolean) => Promise<boolean>;
  loginWithPassword: (identifier: string, password: string, remember?: boolean) => Promise<boolean>;
  loginAsPersona?: (personaId: string) => void;
  logout: () => void;

  // Toast System
  toasts: ToastMessage[];
  showToast: (title: string, type?: 'success' | 'error' | 'warning' | 'info', message?: string) => void;
  dismissToast: (id: string) => void;

  // Phase 2 Roadmap Modal
  showPhase2Modal: boolean;
  setShowPhase2Modal: (show: boolean) => void;

  // Agriculture Module
  lands: LandProfile[];
  addLand: (land: Omit<LandProfile, 'id' | 'lastUpdated'>) => void;
  updateLand: (id: string, updates: Partial<LandProfile>) => void;
  deleteLand: (id: string) => void;
  fertilizerPlans: FertilizerPlan[];
  addFertilizerPlan: (plan: Omit<FertilizerPlan, 'id' | 'createdAt'>) => void;

  // Livestock Module
  livestockFarms: LivestockFarm[];
  addLivestockFarm: (farm: Omit<LivestockFarm, 'id' | 'lastUpdated'>) => void;
  updateLivestockFarm: (id: string, updates: Partial<LivestockFarm>) => void;
  deleteLivestockFarm: (id: string) => void;
  animals: AnimalRecord[];
  addAnimal: (animal: Omit<AnimalRecord, 'id'>) => void;
  updateAnimal: (id: string, updates: Partial<AnimalRecord>) => void;
  deleteAnimal: (id: string) => void;
  vaccinations: VaccinationRecord[];
  addVaccination: (vac: Omit<VaccinationRecord, 'id'>) => void;
  updateVaccinationStatus: (id: string, status: 'completed' | 'upcoming' | 'overdue') => void;
  feedingLogs: FeedingLog[];
  addFeedingLog: (log: Omit<FeedingLog, 'id'>) => void;

  // Fisheries Module
  ponds: PondProfile[];
  addPond: (pond: Omit<PondProfile, 'id' | 'lastUpdated'>) => void;
  updatePond: (id: string, updates: Partial<PondProfile>) => void;
  deletePond: (id: string) => void;
  waterQualityRecords: WaterQualityRecord[];
  addWaterQualityRecord: (record: Omit<WaterQualityRecord, 'id'>) => void;

  // Marketplace Module
  listings: MarketplaceListing[];
  addListing: (listing: Omit<MarketplaceListing, 'id' | 'createdAt'>) => void;
  updateListing: (id: string, updates: Partial<MarketplaceListing>) => void;
  deleteListing: (id: string) => void;
  toggleListingStatus: (id: string, newStatus: MarketplaceListing['status']) => void;

  // Negotiation & Orders
  inquiries: NegotiationInquiry[];
  sendInquiry: (inquiry: Omit<NegotiationInquiry, 'id' | 'createdAt' | 'updatedAt' | 'messages'>, initialMessage: string) => void;
  sendNegotiationMessage: (inquiryId: string, text: string, offerUpdate?: { pricePerUnit: number; quantity: number }) => void;
  acceptOffer: (inquiryId: string) => void;
  rejectOffer: (inquiryId: string) => void;
  orders: OrderRecord[];
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => void;

  // Price Alerts
  priceAlerts: PriceAlert[];
  addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'updatedAt'>) => void;
  togglePriceAlert: (id: string) => void;
  deletePriceAlert: (id: string) => void;
  simulatePriceUpdate: (productName: string, newPrice: number) => void;

  // Market Prices
  marketPrices: MarketPriceItem[];
  updateMarketPrice: (id: string, wholesale: number, retail: number) => void;

  // Experts & Consultations
  experts: ExpertProfile[];
  consultations: ConsultationBooking[];
  bookConsultation: (booking: Omit<ConsultationBooking, 'id' | 'createdAt' | 'status'>) => void;
  updateConsultationStatus: (id: string, status: ConsultationBooking['status'], notes?: string, prescription?: string) => void;

  // Notifications
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id' | 'isRead'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Reminders
  reminders: CalendarReminder[];
  addReminder: (rem: Omit<CalendarReminder, 'id' | 'isCompleted'>) => void;
  toggleReminderComplete: (id: string) => void;
  deleteReminder: (id: string) => void;

  // Reset to default mock data
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'agronex_';

function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function saveStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Global states
  const [language, setLanguageState] = useState<Language>(() => getStoredItem('lang', 'bn'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getStoredItem('is_auth', false));
  const [user, setUserState] = useState<UserProfile>(() => getStoredItem('user', DEFAULT_USER));
  const [activeRole, setActiveRoleState] = useState<UserRole>(() => getStoredItem('role', 'agri_farmer'));
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showPhase2Modal, setShowPhase2Modal] = useState<boolean>(false);

  // Entities state - Start empty for user data (No fake mock user data)
  const [lands, setLands] = useState<LandProfile[]>(() => getStoredItem('lands', []));
  const [fertilizerPlans, setFertilizerPlans] = useState<FertilizerPlan[]>(() => getStoredItem('fertilizers', []));
  const [livestockFarms, setLivestockFarms] = useState<LivestockFarm[]>(() => getStoredItem('livestock', []));
  const [animals, setAnimals] = useState<AnimalRecord[]>(() => getStoredItem('animals', []));
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>(() => getStoredItem('vaccinations', []));
  const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>(() => getStoredItem('feeding', []));
  const [ponds, setPonds] = useState<PondProfile[]>(() => getStoredItem('ponds', []));
  const [waterQualityRecords, setWaterQualityRecords] = useState<WaterQualityRecord[]>(() => getStoredItem('water_quality', []));
  const [listings, setListings] = useState<MarketplaceListing[]>(() => getStoredItem('listings', INITIAL_LISTINGS));
  const [inquiries, setInquiries] = useState<NegotiationInquiry[]>(() => getStoredItem('inquiries', []));
  const [orders, setOrders] = useState<OrderRecord[]>(() => getStoredItem('orders', []));
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => getStoredItem('alerts', []));
  const [marketPrices, setMarketPrices] = useState<MarketPriceItem[]>(() => getStoredItem('market_prices', INITIAL_MARKET_PRICES));
  const [experts] = useState<ExpertProfile[]>(INITIAL_EXPERTS);
  const [consultations, setConsultations] = useState<ConsultationBooking[]>(() => getStoredItem('consultations', []));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => getStoredItem('notifications', []));
  const [reminders, setReminders] = useState<CalendarReminder[]>(() => getStoredItem('reminders', []));

  // Persistence helpers
  useEffect(() => { saveStoredItem('lang', language); }, [language]);
  useEffect(() => { 
    if (isAuthenticated) {
      saveStoredItem('user', user); 
    }
  }, [user, isAuthenticated]);
  useEffect(() => { saveStoredItem('role', activeRole); }, [activeRole]);
  useEffect(() => { saveStoredItem('is_auth', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { saveStoredItem('lands', lands); }, [lands]);
  useEffect(() => { saveStoredItem('fertilizers', fertilizerPlans); }, [fertilizerPlans]);
  useEffect(() => { saveStoredItem('livestock', livestockFarms); }, [livestockFarms]);
  useEffect(() => { saveStoredItem('animals', animals); }, [animals]);
  useEffect(() => { saveStoredItem('vaccinations', vaccinations); }, [vaccinations]);
  useEffect(() => { saveStoredItem('feeding', feedingLogs); }, [feedingLogs]);
  useEffect(() => { saveStoredItem('ponds', ponds); }, [ponds]);
  useEffect(() => { saveStoredItem('water_quality', waterQualityRecords); }, [waterQualityRecords]);
  useEffect(() => { saveStoredItem('listings', listings); }, [listings]);
  useEffect(() => { saveStoredItem('inquiries', inquiries); }, [inquiries]);
  useEffect(() => { saveStoredItem('orders', orders); }, [orders]);
  useEffect(() => { saveStoredItem('alerts', priceAlerts); }, [priceAlerts]);
  useEffect(() => { saveStoredItem('market_prices', marketPrices); }, [marketPrices]);
  useEffect(() => { saveStoredItem('consultations', consultations); }, [consultations]);
  useEffect(() => { saveStoredItem('notifications', notifications); }, [notifications]);
  useEffect(() => { saveStoredItem('reminders', reminders); }, [reminders]);

  // Toast Helpers
  const showToast = (title: string, type: 'success' | 'error' | 'warning' | 'info' = 'success', message?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // User actions
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    showToast(lang === 'bn' ? 'ভাষা বাংলায় পরিবর্তিত হয়েছে' : 'Language switched to English', 'info');
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUserState((prev) => ({ ...prev, ...updates }));
    showToast(language === 'bn' ? 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে' : 'Profile updated successfully', 'success');
  };

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    showToast(language === 'bn' ? `রোল পরিবর্তিত হয়েছে: ${role}` : `Role switched to: ${role}`, 'info');
  };

  // Auth & Session methods
  const login = (userProfile: UserProfile, remember: boolean = true) => {
    setUserState(userProfile);
    if (userProfile.roles.length > 0) {
      setActiveRoleState(userProfile.roles[0]);
    }
    setIsAuthenticated(true);
    if (remember) {
      saveStoredItem('is_auth', true);
      saveStoredItem('user', userProfile);
    }
    showToast(
      language === 'bn' ? `স্বাগতম, ${userProfile.name}!` : `Welcome, ${userProfile.name}!`,
      'success',
      language === 'bn' ? 'লগইন সফল হয়েছে।' : 'Login successful.'
    );
  };

  const loginWithPhoneOtp = async (phone: string, otp: string, remember: boolean = true): Promise<boolean> => {
    const cleanPhone = phone.trim().replace(/[^\d+]/g, '');
    const cleanOtp = otp.trim();

    if (cleanPhone.length < 11) {
      showToast(
        language === 'bn' ? 'সঠিক মোবাইল নম্বর দিন' : 'Enter valid phone number',
        'error',
        language === 'bn' ? '১১-সংখ্যার বাংলাদেশী মোবাইল নম্বর আবশ্যক (যেমন: 017xxxxxxxx)' : '11-digit mobile number required'
      );
      return false;
    }

    if (cleanOtp.length !== 6) {
      showToast(
        language === 'bn' ? '৬-সংখ্যার কোড দিন' : 'Enter 6-digit code',
        'error',
        language === 'bn' ? 'যাচাইকরণ ওটিপি কোড ৬ সংখ্যার হতে হবে।' : 'Verification code must be 6 digits.'
      );
      return false;
    }

    // Check if user exists in saved user registry
    const registeredUsers = getStoredItem<UserProfile[]>('registered_users', []);
    let profile = registeredUsers.find(u => u.phone === cleanPhone);

    if (!profile) {
      // Create new profile for this authenticated phone
      profile = {
        ...DEFAULT_USER,
        id: `usr_${Date.now()}`,
        phone: cleanPhone,
        name: `সদস্য কৃষক (${cleanPhone.slice(-4)})`,
        joinedDate: new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      saveStoredItem('registered_users', [...registeredUsers, profile]);
    }

    login(profile, remember);
    return true;
  };

  const loginWithPassword = async (identifier: string, password: string, remember: boolean = true): Promise<boolean> => {
    const cleanId = identifier.trim();
    if (!cleanId) {
      showToast(language === 'bn' ? 'মোবাইল বা ইমেইল লিখুন' : 'Enter mobile or email', 'error');
      return false;
    }

    if (password.length < 6) {
      showToast(
        language === 'bn' ? 'পাসওয়ার্ড অত্যন্ত ছোট' : 'Password too short',
        'error',
        language === 'bn' ? 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.'
      );
      return false;
    }

    // Check saved user registry
    const registeredUsers = getStoredItem<UserProfile[]>('registered_users', []);
    let profile = registeredUsers.find(u => u.phone === cleanId || u.email === cleanId);

    if (!profile) {
      profile = {
        ...DEFAULT_USER,
        id: `usr_${Date.now()}`,
        phone: cleanId.includes('@') ? '01700000000' : cleanId,
        email: cleanId.includes('@') ? cleanId : undefined,
        name: cleanId.includes('@') ? cleanId.split('@')[0] : `সদস্য (${cleanId.slice(-4)})`,
        joinedDate: new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      saveStoredItem('registered_users', [...registeredUsers, profile]);
    }

    login(profile, remember);
    return true;
  };

  const loginAsPersona = (personaId: string) => {
    const customUser: UserProfile = {
      ...DEFAULT_USER,
      id: `usr_${personaId}`,
      name: `কৃষক সদস্য`,
      joinedDate: 'আজ'
    };
    login(customUser, false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserState(DEFAULT_USER);
    try {
      localStorage.removeItem(STORAGE_PREFIX + 'is_auth');
      localStorage.removeItem(STORAGE_PREFIX + 'user');
    } catch {
      // Ignore
    }
    showToast(
      language === 'bn' ? 'লগ আউট সম্পন্ন হয়েছে' : 'Logged out successfully',
      'info',
      language === 'bn' ? 'আপনার সেশন সমাপ্ত হয়েছে। ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন।' : 'Your session has ended.'
    );
  };

  // Agriculture actions
  const addLand = (landData: Omit<LandProfile, 'id' | 'lastUpdated'>) => {
    const newLand: LandProfile = {
      ...landData,
      id: 'lnd_' + Date.now(),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setLands((prev) => [newLand, ...prev]);
    showToast(language === 'bn' ? 'নতুন জমির রেকর্ড যোগ করা হয়েছে' : 'New land record added', 'success');
  };

  const updateLand = (id: string, updates: Partial<LandProfile>) => {
    setLands((prev) => prev.map((l) => l.id === id ? { ...l, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : l));
    showToast(language === 'bn' ? 'জমির তথ্য হালনাগাদ করা হয়েছে' : 'Land details updated', 'success');
  };

  const deleteLand = (id: string) => {
    setLands((prev) => prev.filter((l) => l.id !== id));
    showToast(language === 'bn' ? 'জমি রেকর্ড সফলভাবে মুছে ফেলা হয়েছে' : 'Land record deleted', 'info');
  };

  const addFertilizerPlan = (planData: Omit<FertilizerPlan, 'id' | 'createdAt'>) => {
    const newPlan: FertilizerPlan = {
      ...planData,
      id: 'fer_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setFertilizerPlans((prev) => [newPlan, ...prev]);
    showToast(language === 'bn' ? 'সার প্রয়োগের পরিকল্পনা সংরক্ষিত হয়েছে' : 'Fertilizer plan saved', 'success');
  };

  // Livestock actions
  const addLivestockFarm = (farmData: Omit<LivestockFarm, 'id' | 'lastUpdated'>) => {
    const newFarm: LivestockFarm = {
      ...farmData,
      id: 'lsk_' + Date.now(),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setLivestockFarms((prev) => [newFarm, ...prev]);
    showToast(language === 'bn' ? 'নতুন খামার যোগ করা হয়েছে' : 'New livestock farm added', 'success');
  };

  const updateLivestockFarm = (id: string, updates: Partial<LivestockFarm>) => {
    setLivestockFarms((prev) => prev.map((f) => f.id === id ? { ...f, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : f));
    showToast(language === 'bn' ? 'খামারের তথ্য হালনাগাদ করা হয়েছে' : 'Farm updated', 'success');
  };

  const deleteLivestockFarm = (id: string) => {
    setLivestockFarms((prev) => prev.filter((f) => f.id !== id));
    showToast(language === 'bn' ? 'খামার মুছে ফেলা হয়েছে' : 'Farm deleted', 'info');
  };

  const addAnimal = (animalData: Omit<AnimalRecord, 'id'>) => {
    const newAnimal: AnimalRecord = {
      ...animalData,
      id: 'anm_' + Date.now()
    };
    setAnimals((prev) => [newAnimal, ...prev]);
    showToast(language === 'bn' ? 'পশুর রেকর্ড যুক্ত হয়েছে' : 'Animal record added', 'success');
  };

  const updateAnimal = (id: string, updates: Partial<AnimalRecord>) => {
    setAnimals((prev) => prev.map((a) => a.id === id ? { ...a, ...updates } : a));
    showToast(language === 'bn' ? 'পশুর তথ্য হালনাগাদ হয়েছে' : 'Animal record updated', 'success');
  };

  const deleteAnimal = (id: string) => {
    setAnimals((prev) => prev.filter((a) => a.id !== id));
    showToast(language === 'bn' ? 'পশু রেকর্ড মুছে ফেলা হয়েছে' : 'Animal removed', 'info');
  };

  const addVaccination = (vacData: Omit<VaccinationRecord, 'id'>) => {
    const newVac: VaccinationRecord = {
      ...vacData,
      id: 'vac_' + Date.now()
    };
    setVaccinations((prev) => [newVac, ...prev]);
    showToast(language === 'bn' ? 'টিকা রেকর্ড সফলভাবে সংরক্ষিত হয়েছে' : 'Vaccination record saved', 'success');
  };

  const updateVaccinationStatus = (id: string, status: 'completed' | 'upcoming' | 'overdue') => {
    setVaccinations((prev) => prev.map((v) => v.id === id ? { ...v, status } : v));
    showToast(language === 'bn' ? 'টিকার স্ট্যাটাস পরিবর্তন হয়েছে' : 'Vaccination status updated', 'info');
  };

  const addFeedingLog = (logData: Omit<FeedingLog, 'id'>) => {
    const newLog: FeedingLog = {
      ...logData,
      id: 'fd_' + Date.now()
    };
    setFeedingLogs((prev) => [newLog, ...prev]);
    showToast(language === 'bn' ? 'খাদ্য প্রয়োগ ও FCR হিসাব সংরক্ষিত হয়েছে' : 'Feeding & FCR logged', 'success');
  };

  // Fisheries actions
  const addPond = (pondData: Omit<PondProfile, 'id' | 'lastUpdated'>) => {
    const newPond: PondProfile = {
      ...pondData,
      id: 'pnd_' + Date.now(),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setPonds((prev) => [newPond, ...prev]);
    showToast(language === 'bn' ? 'নতুন পুকুর যোগ করা হয়েছে' : 'New pond added', 'success');
  };

  const updatePond = (id: string, updates: Partial<PondProfile>) => {
    setPonds((prev) => prev.map((p) => p.id === id ? { ...p, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : p));
    showToast(language === 'bn' ? 'পুকুরের তথ্য হালনাগাদ করা হয়েছে' : 'Pond updated', 'success');
  };

  const deletePond = (id: string) => {
    setPonds((prev) => prev.filter((p) => p.id !== id));
    showToast(language === 'bn' ? 'পুকুর মুছে ফেলা হয়েছে' : 'Pond removed', 'info');
  };

  const addWaterQualityRecord = (recordData: Omit<WaterQualityRecord, 'id'>) => {
    const newRecord: WaterQualityRecord = {
      ...recordData,
      id: 'wq_' + Date.now()
    };
    setWaterQualityRecords((prev) => [newRecord, ...prev]);
    if (newRecord.status === 'warning' || newRecord.status === 'critical') {
      showToast(language === 'bn' ? 'সতর্কতা: জলের গুণমানে সমস্যা চিহ্নিত হয়েছে!' : 'Warning: Water parameters abnormal!', 'warning');
    } else {
      showToast(language === 'bn' ? 'জলের গুণমান পরীক্ষা সংরক্ষিত হয়েছে' : 'Water quality test recorded', 'success');
    }
  };

  // Marketplace actions
  const addListing = (listingData: Omit<MarketplaceListing, 'id' | 'createdAt'>) => {
    const newListing: MarketplaceListing = {
      ...listingData,
      id: 'lst_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setListings((prev) => [newListing, ...prev]);
    showToast(language === 'bn' ? 'পণ্য মার্কেটপ্লেসে সফলভাবে তালিকাভুক্ত হয়েছে' : 'Product successfully listed', 'success');
  };

  const updateListing = (id: string, updates: Partial<MarketplaceListing>) => {
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, ...updates } : l));
    showToast(language === 'bn' ? 'তালিকাভুক্ত পণ্য আপডেট করা হয়েছে' : 'Listing updated', 'success');
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    showToast(language === 'bn' ? 'পণ্য তালিকা থেকে মুছে ফেলা হয়েছে' : 'Listing removed', 'info');
  };

  const toggleListingStatus = (id: string, newStatus: MarketplaceListing['status']) => {
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l));
    showToast(language === 'bn' ? `লিস্টিং স্ট্যাটাস: ${newStatus}` : `Listing status changed to ${newStatus}`, 'info');
  };

  // Negotiation & Orders
  const sendInquiry = (inquiryData: Omit<NegotiationInquiry, 'id' | 'createdAt' | 'updatedAt' | 'messages'>, initialMessage: string) => {
    const newInquiry: NegotiationInquiry = {
      ...inquiryData,
      id: 'inq_' + Date.now(),
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      messages: [
        {
          id: 'msg_' + Date.now(),
          senderId: inquiryData.buyerId,
          senderName: inquiryData.buyerName,
          text: initialMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          offerUpdate: {
            pricePerUnit: inquiryData.initialOfferedPrice,
            quantity: inquiryData.requestedQuantity
          }
        }
      ]
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    showToast(language === 'bn' ? 'ক্রয়ের প্রস্তাব ও দরদাম পাঠানো হয়েছে' : 'Purchase inquiry & offer submitted', 'success');
  };

  const sendNegotiationMessage = (inquiryId: string, text: string, offerUpdate?: { pricePerUnit: number; quantity: number }) => {
    setInquiries((prev) => prev.map((inq) => {
      if (inq.id === inquiryId) {
        const newMsg = {
          id: 'msg_' + Date.now(),
          senderId: user.id,
          senderName: user.name,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          offerUpdate
        };
        const updatedStatus = offerUpdate ? 'countered' : inq.status;
        const currentAgreed = offerUpdate ? offerUpdate.pricePerUnit : inq.currentAgreedPrice;
        const requestedQty = offerUpdate ? offerUpdate.quantity : inq.requestedQuantity;
        return {
          ...inq,
          status: updatedStatus,
          currentAgreedPrice: currentAgreed,
          requestedQuantity: requestedQty,
          updatedAt: new Date().toLocaleString(),
          messages: [...inq.messages, newMsg]
        };
      }
      return inq;
    }));
    showToast(language === 'bn' ? 'বার্তা ও কাউন্টার অফার প্রেরিত হয়েছে' : 'Message & counter-offer sent', 'info');
  };

  const acceptOffer = (inquiryId: string) => {
    const inq = inquiries.find((i) => i.id === inquiryId);
    if (!inq) return;

    // Update inquiry status
    setInquiries((prev) => prev.map((i) => i.id === inquiryId ? { ...i, status: 'accepted' } : i));

    // Update listing available stock
    const targetListing = listings.find((l) => l.id === inq.listingId);
    if (targetListing) {
      const remaining = Math.max(0, targetListing.quantity - inq.requestedQuantity);
      setListings((prev) => prev.map((l) => l.id === targetListing.id ? {
        ...l,
        quantity: remaining,
        status: remaining === 0 ? 'sold' : l.status
      } : l));
    }

    // Automatically create the verified Order
    const newOrder: OrderRecord = {
      id: 'ord_' + Math.floor(1000 + Math.random() * 9000),
      listingId: inq.listingId,
      inquiryId: inq.id,
      buyerId: inq.buyerId,
      buyerName: inq.buyerName,
      buyerPhone: inq.buyerPhone,
      sellerId: inq.sellerId,
      sellerName: inq.sellerName,
      sellerPhone: inq.sellerPhone,
      productName: inq.productName,
      sector: inq.sector,
      quantity: inq.requestedQuantity,
      unit: inq.unit,
      agreedPricePerUnit: inq.currentAgreedPrice,
      totalOrderValue: inq.requestedQuantity * inq.currentAgreedPrice,
      paymentMethod: 'Cash on Pickup',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      status: 'accepted',
      pickupLocation: targetListing ? `${targetListing.village}, ${targetListing.upazila}, ${targetListing.district}` : 'কৃষকের চাতাল',
      district: targetListing?.district || 'Bogura',
      upazila: targetListing?.upazila || 'Shibganj',
      receiptNumber: `AGX-REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      notes: 'অফার গ্রহণ সম্পন্ন হয়েছে। উভয় পক্ষের সম্মতিতে ডিজিটাল রসিদ প্রস্তুত।'
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Send notification to buyer
    const newNotif: NotificationItem = {
      id: 'ntf_' + Date.now(),
      userId: inq.buyerId,
      sector: 'marketplace',
      title: 'Offer Accepted! Order Created',
      titleBn: 'অফার গৃহীত হয়েছে! ডিজিটাল অর্ডার তৈরি সম্পন্ন',
      message: `${user.name} accepted your offer of BDT ${inq.currentAgreedPrice}/${inq.unit} for ${inq.productName}.`,
      messageBn: `${user.name} আপনার ${inq.productName} এর দরদাম গ্রহণ করেছেন। মোট মূল্য ৳${newOrder.totalOrderValue}।`,
      type: 'order',
      isRead: false,
      timestamp: 'এইমাত্র',
      linkTab: 'marketplace'
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(
      language === 'bn' ? 'অফার গৃহীত! অর্ডার ও ডিজিটাল রসিদ প্রস্তুত হয়েছে' : 'Offer accepted! Order and digital receipt generated',
      'success'
    );
  };

  const rejectOffer = (inquiryId: string) => {
    setInquiries((prev) => prev.map((i) => i.id === inquiryId ? { ...i, status: 'rejected' } : i));
    showToast(language === 'bn' ? 'অফার প্রত্যাখ্যান করা হয়েছে' : 'Offer rejected', 'info');
  };

  const updateOrderStatus = (orderId: string, status: OrderRecord['status']) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    showToast(
      language === 'bn' ? `অর্ডার স্ট্যাটাস আপডেট: ${status}` : `Order status updated: ${status}`,
      'success'
    );
  };

  // Price Alert Actions
  const addPriceAlert = (alertData: Omit<PriceAlert, 'id' | 'updatedAt'>) => {
    const newAlert: PriceAlert = {
      ...alertData,
      id: 'alt_' + Date.now(),
      updatedAt: new Date().toLocaleString()
    };
    setPriceAlerts((prev) => [newAlert, ...prev]);
    showToast(language === 'bn' ? 'মূল্য সতর্কবার্তা (Price Alert) চালু করা হয়েছে' : 'Price alert created', 'success');
  };

  const togglePriceAlert = (id: string) => {
    setPriceAlerts((prev) => prev.map((a) => a.id === id ? { ...a, isActive: !a.isActive } : a));
    showToast(language === 'bn' ? 'অ্যালার্টের অবস্থা পরিবর্তন হয়েছে' : 'Price alert toggled', 'info');
  };

  const deletePriceAlert = (id: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast(language === 'bn' ? 'মূল্য সতর্কবার্তা মুছে ফেলা হয়েছে' : 'Price alert deleted', 'info');
  };

  const simulatePriceUpdate = (idOrName: string, newPrice: number) => {
    let targetItemName = idOrName;
    setMarketPrices((prev) => prev.map((m) => {
      const isMatch = m.id === idOrName || m.productBn.includes(idOrName) || m.product.toLowerCase().includes(idOrName.toLowerCase()) || idOrName.includes(m.productBn);
      if (isMatch) {
        targetItemName = m.productBn;
        return {
          ...m,
          wholesalePrice: newPrice,
          recordedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return m;
    }));

    // Update alerts with latest observed price
    setPriceAlerts((prev) => prev.map((a) => {
      const isAlertMatch = a.productName.includes(targetItemName) || targetItemName.includes(a.productName) || a.productName.includes(idOrName) || idOrName.includes(a.productName);
      if (isAlertMatch) {
        return {
          ...a,
          currentObservedPrice: newPrice,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return a;
    }));

    // Check alerts
    priceAlerts.forEach((a) => {
      if (a.isActive && (a.productName.includes(targetItemName) || targetItemName.includes(a.productName) || a.productName.includes(idOrName) || idOrName.includes(a.productName))) {
        const isTriggered = (a.condition === 'at_or_above' && newPrice >= a.targetPrice) ||
                            (a.condition === 'at_or_below' && newPrice <= a.targetPrice);
        if (isTriggered) {
          const alertNotif: NotificationItem = {
            id: 'ntf_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            userId: user.id,
            sector: a.sector,
            title: `Price Alert Triggered: ${a.productName}`,
            titleBn: `মূল্য সতর্কতা! ${a.productName} এর দাম লক্ষ্যমাত্রায় পৌঁছেছে`,
            message: `Current observed wholesale price is now BDT ${newPrice}/${a.unit} (Target was ${a.targetPrice}).`,
            messageBn: `পাইকারি বাজারে ${a.productName} এর দাম এখন ৳${newPrice}/${a.unit} (আপনার টার্গেট ছিল ৳${a.targetPrice})।`,
            type: 'alert',
            isRead: false,
            timestamp: 'এইমাত্র',
            linkTab: 'prices'
          };
          setNotifications((prev) => [alertNotif, ...prev]);
          showToast(
            language === 'bn' ? `সতর্কবার্তা: ${a.productName} এখন ৳${newPrice}/${a.unit}` : `Price Alert: ${a.productName} is now BDT ${newPrice}/${a.unit}`,
            'warning'
          );
        }
      }
    });
  };

  const updateMarketPrice = (id: string, wholesale: number, retail: number) => {
    setMarketPrices((prev) => prev.map((m) => m.id === id ? {
      ...m,
      wholesalePrice: wholesale,
      retailPrice: retail,
      recordedTimestamp: new Date().toLocaleString()
    } : m));
    showToast(language === 'bn' ? 'বাজার দর হালনাগাদ করা হয়েছে' : 'Market price updated', 'success');
  };

  // Experts & Consultations
  const bookConsultation = (bookingData: Omit<ConsultationBooking, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: ConsultationBooking = {
      ...bookingData,
      id: 'cns_' + Date.now(),
      status: 'pending',
      createdAt: new Date().toLocaleString()
    };
    setConsultations((prev) => [newBooking, ...prev]);
    showToast(
      language === 'bn' ? 'বিশেষজ্ঞ পরামর্শের অ্যাপয়েন্টমেন্ট সফলভাবে অনুরোধ করা হয়েছে' : 'Consultation appointment requested',
      'success'
    );
  };

  const updateConsultationStatus = (id: string, status: ConsultationBooking['status'], notes?: string, prescription?: string) => {
    setConsultations((prev) => prev.map((c) => c.id === id ? {
      ...c,
      status,
      notes: notes || c.notes,
      prescription: prescription || c.prescription
    } : c));
    showToast(language === 'bn' ? 'পরামর্শ স্ট্যাটাস ও প্রেসক্রিপশন সংরক্ষিত হয়েছে' : 'Consultation updated', 'info');
  };

  // Notifications
  const addNotification = (notifData: Omit<NotificationItem, 'id' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...notifData,
      id: 'ntf_' + Date.now(),
      isRead: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast(language === 'bn' ? 'সকল নোটিফিকেশন পড়া হিসেবে চিহ্নিত' : 'All notifications marked as read', 'info');
  };

  // Reminders
  const addReminder = (remData: Omit<CalendarReminder, 'id' | 'isCompleted'>) => {
    const newRem: CalendarReminder = {
      ...remData,
      id: 'rem_' + Date.now(),
      isCompleted: false
    };
    setReminders((prev) => [newRem, ...prev]);
    showToast(language === 'bn' ? 'নতুন রিমাইন্ডার যোগ করা হয়েছে' : 'Reminder added', 'success');
  };

  const toggleReminderComplete = (id: string) => {
    setReminders((prev) => prev.map((r) => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    showToast(language === 'bn' ? 'রিমাইন্ডার মুছে ফেলা হয়েছে' : 'Reminder deleted', 'info');
  };

  const resetAllData = () => {
    localStorage.clear();
    setLands([]);
    setLivestockFarms([]);
    setAnimals([]);
    setVaccinations([]);
    setFeedingLogs([]);
    setPonds([]);
    setWaterQualityRecords([]);
    setListings(INITIAL_LISTINGS);
    setInquiries([]);
    setOrders([]);
    setPriceAlerts([]);
    setMarketPrices(INITIAL_MARKET_PRICES);
    setConsultations([]);
    setNotifications([]);
    setReminders([]);
    setUserState(DEFAULT_USER);
    setIsAuthenticated(false);
    showToast(language === 'bn' ? 'সিস্টেম ডেটা সফলভাবে পরিষ্কার করা হয়েছে' : 'System data cleared', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        user,
        updateUser,
        activeRole,
        setActiveRole,
        isOffline,
        setIsOffline,
        isAuthenticated,
        login,
        loginWithPhoneOtp,
        loginWithPassword,
        loginAsPersona,
        logout,
        toasts,
        showToast,
        dismissToast,
        showPhase2Modal,
        setShowPhase2Modal,
        lands,
        addLand,
        updateLand,
        deleteLand,
        fertilizerPlans,
        addFertilizerPlan,
        livestockFarms,
        addLivestockFarm,
        updateLivestockFarm,
        deleteLivestockFarm,
        animals,
        addAnimal,
        updateAnimal,
        deleteAnimal,
        vaccinations,
        addVaccination,
        updateVaccinationStatus,
        feedingLogs,
        addFeedingLog,
        ponds,
        addPond,
        updatePond,
        deletePond,
        waterQualityRecords,
        addWaterQualityRecord,
        listings,
        addListing,
        updateListing,
        deleteListing,
        toggleListingStatus,
        inquiries,
        sendInquiry,
        sendNegotiationMessage,
        acceptOffer,
        rejectOffer,
        orders,
        updateOrderStatus,
        priceAlerts,
        addPriceAlert,
        togglePriceAlert,
        deletePriceAlert,
        simulatePriceUpdate,
        marketPrices,
        updateMarketPrice,
        experts,
        consultations,
        bookConsultation,
        updateConsultationStatus,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        reminders,
        addReminder,
        toggleReminderComplete,
        deleteReminder,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

