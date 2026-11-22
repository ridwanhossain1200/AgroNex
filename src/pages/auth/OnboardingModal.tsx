import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { 
  Sprout, 
  Beef, 
  Fish, 
  ShoppingBag, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  KeyRound, 
  Phone, 
  MapPin, 
  Sparkles,
  Info
} from 'lucide-react';
import { BANGLADESH_DISTRICTS, SOIL_TYPES, SEASONS } from '../../data/bangladeshGeo';
import { UserRole, SectorType, LandUnit, ProduceUnit } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { 
    language, 
    setLanguage, 
    updateUser, 
    addLand, 
    addLivestockFarm, 
    addPond, 
    showToast 
  } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Bogura');
  const [upazila, setUpazila] = useState('Shibganj');
  const [village, setVillage] = useState('Gokul');

  // OTP State
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);

  // Role & Sector Selection State
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(['agri_farmer', 'marketplace_seller']);
  const [selectedSectors, setSelectedSectors] = useState<SectorType[]>(['agriculture', 'marketplace']);

  // Environment Setup - Agriculture
  const [landName, setLandName] = useState('আমার প্রথম জমি (Field 1)');
  const [landSize, setLandSize] = useState<number>(33);
  const [landUnit, setLandUnit] = useState<LandUnit>('decimal');
  const [soilType, setSoilType] = useState<any>('Loam (দোআঁশ)');
  const [cropName, setCropName] = useState('বোরো ধান (Boro Rice)');

  // Environment Setup - Livestock
  const [farmName, setFarmName] = useState('আমার ডেইরি শেড (My Dairy)');
  const [livestockType, setLivestockType] = useState<'cattle' | 'goat' | 'poultry'>('cattle');
  const [animalCount, setAnimalCount] = useState<number>(5);

  // Environment Setup - Fisheries
  const [pondName, setPondName] = useState('পুকুর নম্বর ১ (Pond 1)');
  const [pondSize, setPondSize] = useState<number>(40);
  const [pondDepth, setPondDepth] = useState<number>(5.5);

  const selectedDistrictObj = BANGLADESH_DISTRICTS.find(d => d.name === district) || BANGLADESH_DISTRICTS[0];

  const handleToggleRole = (role: UserRole) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleToggleSector = (sector: SectorType) => {
    setSelectedSectors(prev => 
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  };

  const handleCompleteOnboarding = () => {
    // 1. Update user
    updateUser({
      name: fullName || 'কৃষক ভাই (Farmer)',
      phone: phone || '01700000000',
      email: email || undefined,
      district,
      upazila,
      village,
      roles: selectedRoles.length > 0 ? selectedRoles : ['agri_farmer'],
      sectors: selectedSectors.length > 0 ? selectedSectors : ['agriculture']
    });

    // 2. Create initial records based on chosen sectors
    if (selectedSectors.includes('agriculture')) {
      addLand({
        name: landName,
        size: Number(landSize),
        unit: landUnit,
        soilType,
        division: selectedDistrictObj.division,
        district,
        upazila,
        village,
        waterSource: 'Deep Tubewell',
        season: 'Rabi (রবি)',
        currentCrop: cropName
      });
    }

    if (selectedSectors.includes('livestock')) {
      addLivestockFarm({
        name: farmName,
        livestockType,
        animalCount: Number(animalCount),
        budget: 350000,
        purpose: 'Dairy (দুগ্ধ)',
        district,
        upazila,
        availableSpaceSqFt: 1800,
        capacity: 10,
        setupCostEstimate: 200000,
        monthlyOperatingCost: 35000
      });
    }

    if (selectedSectors.includes('fisheries')) {
      addPond({
        name: pondName,
        sizeDecimal: Number(pondSize),
        depthFeet: Number(pondDepth),
        waterSource: 'Groundwater / Deep Tube-well',
        farmingType: 'polyculture',
        primarySpecies: ['Rui (রুই)', 'Katla (কাতলা)'],
        district,
        upazila,
        budget: 120000,
        stockingDate: new Date().toISOString().split('T')[0]
      });
    }

    showToast(
      language === 'bn' ? 'স্বাগতম! আপনার পার্সোনালাইজড ড্যাশবোর্ড তৈরি সম্পন্ন' : 'Welcome! Your personalized dashboard is ready',
      'success'
    );
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="2xl">
      <div className="py-2">

        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-softBorder">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center">
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  step === i 
                    ? 'bg-forest text-white shadow-xs' 
                    : step > i 
                    ? 'bg-emerald-100 text-forest font-extrabold' 
                    : 'bg-rice text-mutedText'
                }`}
              >
                {step > i ? '✓' : i}
              </div>
              {i < 6 && (
                <div className={`h-1 w-6 sm:w-10 mx-1 rounded-full ${step > i ? 'bg-forest/60' : 'bg-rice'}`} />
              )}
            </div>
          ))}
        </div>

        {/* SCREEN 1: Welcome & Language */}
        {step === 1 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-forest-50 border border-forest/20 text-forest flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Sprout className="w-8 h-8 text-forest-leaf" />
            </div>
            <h2 className="text-2xl font-black text-forest-dark mb-2">
              {language === 'bn' ? 'AgroNex প্ল্যাটফর্মে স্বাগতম' : 'Welcome to AgroNex'}
            </h2>
            <p className="text-sm text-secondaryText max-w-md mx-auto mb-6 leading-relaxed">
              {language === 'bn' 
                ? 'বাংলাদেশের কৃষিজীবী, খামারি, মৎস্যচাষী ও ব্যবসায়ীদের জন্য সমন্বিত ডিজিটাল কৃষি প্রযুক্তি ও সরাসরি মার্কেটপ্লেস ইকোসিস্টেম।'
                : 'Bangladesh’s integrated digital agricultural ecosystem connecting producers, livestock managers, fish farmers, and direct buyers.'}
            </p>

            {/* Language Choice */}
            <div className="flex justify-center space-x-4 mb-8">
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-5 py-3 rounded-2xl border text-sm font-bold flex items-center space-x-2 transition ${
                  language === 'bn' ? 'bg-forest text-white border-forest shadow-md' : 'bg-rice text-primaryText border-softBorder'
                }`}
              >
                <span>🇧🇩</span>
                <span>বাংলা ভাষায় শুরু করুন</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-5 py-3 rounded-2xl border text-sm font-bold flex items-center space-x-2 transition ${
                  language === 'en' ? 'bg-forest text-white border-forest shadow-md' : 'bg-rice text-primaryText border-softBorder'
                }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
            </div>

            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-forest hover:bg-forest-dark text-white font-bold text-sm shadow-md transition"
            >
              <span>{language === 'bn' ? 'নিবন্ধন শুরু করুন' : 'Begin Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SCREEN 2: Registration Fields */}
        {step === 2 && (
          <div>
            <h3 className="text-lg font-bold text-forest-dark mb-1">
              {language === 'bn' ? 'ব্যক্তিগত ও ভৌগোলিক তথ্য' : 'Personal & Geographic Details'}
            </h3>
            <p className="text-xs text-secondaryText mb-5">
              {language === 'bn' ? 'আপনার সঠিক অবস্থান দিন যাতে আঞ্চলিক বাজার দর ও আবহাওয়া পরামর্শ নিখুঁত হয়।' : 'Accurate location ensures localized market prices and weather advisories.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-primaryText mb-1">
                  {language === 'bn' ? 'পূর্ণ নাম *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  placeholder="যেমন: মো: রফিকুল ইসলাম"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-softBorder focus:border-forest focus:ring-1 focus:ring-forest outline-none bg-warmWhite"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primaryText mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর (১১ ডিজিট) *' : 'Mobile Number (11 digits) *'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-semibold text-mutedText">+880</span>
                  <input
                    type="tel"
                    placeholder="1712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-14 pr-3 py-2 text-xs rounded-xl border border-softBorder focus:border-forest focus:ring-1 focus:ring-forest outline-none bg-warmWhite"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primaryText mb-1">
                  {language === 'bn' ? 'জেলা (District) *' : 'District *'}
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    const found = BANGLADESH_DISTRICTS.find(d => d.name === e.target.value);
                    if (found && found.upazilas.length > 0) setUpazila(found.upazilas[0]);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-softBorder focus:border-forest outline-none bg-warmWhite"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.nameBn}) - {d.division}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-primaryText mb-1">
                  {language === 'bn' ? 'উপজেলা (Upazila) *' : 'Upazila *'}
                </label>
                <select
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-softBorder focus:border-forest outline-none bg-warmWhite"
                >
                  {selectedDistrictObj.upazilas.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-primaryText mb-1">
                  {language === 'bn' ? 'গ্রাম / এলাকা' : 'Village / Locality'}
                </label>
                <input
                  type="text"
                  placeholder="যেমন: গোকুল, উত্তরপাড়া"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-softBorder focus:border-forest outline-none bg-warmWhite"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-softBorder">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center space-x-1 px-4 py-2 text-xs font-semibold text-secondaryText hover:text-primaryText"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'পূর্ববর্তী' : 'Back'}</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-dark text-white font-bold text-xs shadow-sm transition"
              >
                <span>{language === 'bn' ? 'ওটিপি যাচাইয়ে যান' : 'Proceed to OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 3: OTP Verification (Honest Demo Simulation) */}
        {step === 3 && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-status-warning flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-forest-dark mb-1">
              {language === 'bn' ? 'মোবাইল নম্বর যাচাই (ওটিপি)' : 'Simulated Mobile OTP Verification'}
            </h3>
            <p className="text-xs text-secondaryText max-w-sm mx-auto mb-4">
              {language === 'bn'
                ? `প্রদত্ত নম্বর +880 ${phone || '01712345678'} এ প্রেরিত ৬ সংখ্যার ওটিপি কোডটি লিখুন।`
                : `Enter the 6-digit verification code sent to +880 ${phone || '01712345678'}.`}
            </p>

            {/* Honest Demo Notification Banner */}
            <div className="p-2.5 mb-5 rounded-xl bg-blue-50 border border-river/30 text-xs text-river-dark flex items-start space-x-2 text-left max-w-md mx-auto">
              <Info className="w-4 h-4 text-river shrink-0 mt-0.5" />
              <p>
                <strong>{language === 'bn' ? 'সরাসরি ডেমো মোড:' : 'Demo Sandbox:'}</strong>{' '}
                {language === 'bn' 
                  ? 'প্রোডাকশন এসএমএস গেটওয়ে সংযুক্ত নয়। ওটিপি স্বয়ংক্রিয়ভাবে ১২৩৪৫৬ সেট করা রয়েছে।' 
                  : 'Production SMS gateway not live. Demo OTP code 123456 prefilled.'}
              </p>
            </div>

            {/* 6 Box Inputs */}
            <div className="flex justify-center space-x-2 mb-6">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[idx] = e.target.value;
                    setOtp(newOtp);
                  }}
                  className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-softBorder focus:border-forest outline-none bg-warmWhite"
                />
              ))}
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-softBorder">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center space-x-1 px-4 py-2 text-xs font-semibold text-secondaryText hover:text-primaryText"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'পূর্ববর্তী' : 'Back'}</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-dark text-white font-bold text-xs shadow-sm transition"
              >
                <span>{language === 'bn' ? 'ওটিপি নিশ্চিত করুন' : 'Verify & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 4: Multi-Role Selection */}
        {step === 4 && (
          <div>
            <h3 className="text-lg font-bold text-forest-dark mb-1">
              {language === 'bn' ? 'আপনার ভূমিকা (রোল) নির্বাচন করুন' : 'Select Your Roles & Capabilities'}
            </h3>
            <p className="text-xs text-secondaryText mb-5">
              {language === 'bn' 
                ? 'একই সাথে একাধিক ভূমিকা নির্বাচন করা যাবে (যেমন: কৃষক + বিক্রেতা)।' 
                : 'Select multiple capabilities (e.g. Farmer + Marketplace Seller).'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { role: 'agri_farmer', titleBn: 'কৃষি কৃষক (Agriculture Farmer)', titleEn: 'Agri Farmer', descBn: 'ফসল চাষ, জমি ব্যবস্থাপনা ও সার পরিকল্পনা' },
                { role: 'livestock_farmer', titleBn: 'পশুপালক / খামারি (Livestock)', titleEn: 'Livestock Farmer', descBn: 'ডেইরি, ছাগল ও পোল্ট্রি খামার' },
                { role: 'fish_farmer', titleBn: 'মৎস্য চাষী (Fish Farmer)', titleEn: 'Fish Farmer', descBn: 'পুকুর, কার্প মিশ্র ও তেলাপিয়া চাষ' },
                { role: 'marketplace_seller', titleBn: 'মার্কেটপ্লেস বিক্রেতা (Seller)', titleEn: 'Produce Seller', descBn: 'পাইকারি বা খুচরা ফসল বিক্রি ও দরদাম' },
                { role: 'wholesale_buyer', titleBn: 'পাইকারি ক্রেতা / আড়তদার', titleEn: 'Wholesale Buyer / Aratdar', descBn: 'সরাসরি কৃষকের কাছ থেকে বাল্ক ক্রয়' },
                { role: 'consumer', titleBn: 'সাধারণ ভোক্তা (Consumer)', titleEn: 'Individual Consumer', descBn: 'তাজা কৃষিপণ্য সরাসরি কেনাকাটা' }
              ].map((item) => {
                const isSelected = selectedRoles.includes(item.role as UserRole);
                return (
                  <div
                    key={item.role}
                    onClick={() => handleToggleRole(item.role as UserRole)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                      isSelected 
                        ? 'bg-forest-50 border-forest text-forest-dark font-medium shadow-xs' 
                        : 'bg-warmWhite border-softBorder text-primaryText hover:bg-rice'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{language === 'bn' ? item.titleBn : item.titleEn}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-forest border-forest text-white' : 'border-mutedText'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-secondaryText">{item.descBn}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-softBorder">
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center space-x-1 px-4 py-2 text-xs font-semibold text-secondaryText hover:text-primaryText"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'পূর্ববর্তী' : 'Back'}</span>
              </button>
              <button
                onClick={() => setStep(5)}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-dark text-white font-bold text-xs shadow-sm transition"
              >
                <span>{language === 'bn' ? 'পরবর্তী: সেক্টর নির্বাচন' : 'Next: Sectors'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 5: Multi-Sector Selection */}
        {step === 5 && (
          <div>
            <h3 className="text-lg font-bold text-forest-dark mb-1">
              {language === 'bn' ? 'কাজের খাতসমূহ (Sectors) নির্বাচন করুন' : 'Select Agricultural Sectors'}
            </h3>
            <p className="text-xs text-secondaryText mb-5">
              {language === 'bn' ? 'যেসব খাতে আপনার সক্রিয় কার্যক্রম রয়েছে তা নির্বাচন করুন।' : 'Select the sectors you manage or operate in.'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { sector: 'agriculture', titleBn: '১. কৃষি (Crops & Land)', icon: Sprout, color: 'text-emerald-700 bg-emerald-50' },
                { sector: 'livestock', titleBn: '২. খামারি (Livestock)', icon: Beef, color: 'text-amber-800 bg-amber-50' },
                { sector: 'fisheries', titleBn: '৩. মৎস্য (Fisheries)', icon: Fish, color: 'text-blue-700 bg-blue-50' },
                { sector: 'marketplace', titleBn: '৪. মার্কেটপ্লেস (Marketplace)', icon: ShoppingBag, color: 'text-clay bg-clay/10' }
              ].map((item) => {
                const isSelected = selectedSectors.includes(item.sector as SectorType);
                const Icon = item.icon;
                return (
                  <div
                    key={item.sector}
                    onClick={() => handleToggleSector(item.sector as SectorType)}
                    className={`p-4 rounded-2xl border cursor-pointer text-center transition ${
                      isSelected 
                        ? 'bg-forest-50 border-forest text-forest-dark font-bold shadow-xs' 
                        : 'bg-warmWhite border-softBorder text-primaryText hover:bg-rice'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-2`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs">{item.titleBn}</span>
                    <div className="mt-2 flex justify-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-forest text-white' : 'bg-rice text-mutedText'}`}>
                        {isSelected ? '✓ নির্বাচিত' : '+ যোগ করুন'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-softBorder">
              <button
                onClick={() => setStep(4)}
                className="inline-flex items-center space-x-1 px-4 py-2 text-xs font-semibold text-secondaryText hover:text-primaryText"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'পূর্ববর্তী' : 'Back'}</span>
              </button>
              <button
                onClick={() => setStep(6)}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-dark text-white font-bold text-xs shadow-sm transition"
              >
                <span>{language === 'bn' ? 'পরবর্তী: প্রাথমিক সেটআপ' : 'Next: Environment Setup'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 6: Environment Setup (Based on selected sectors) */}
        {step === 6 && (
          <div>
            <h3 className="text-lg font-bold text-forest-dark mb-1">
              {language === 'bn' ? 'প্রাথমিক খামার ও জমির তথ্য' : 'Initial Environment Setup'}
            </h3>
            <p className="text-xs text-secondaryText mb-5">
              {language === 'bn' ? 'নির্বাচিত সেক্টর অনুযায়ী আপনার প্রথম জমি বা খামারের বিবরণ যোগ করুন।' : 'Add your initial farm/land details according to selected sectors.'}
            </p>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {/* Agri setup */}
              {selectedSectors.includes('agriculture') && (
                <div className="p-3.5 rounded-2xl bg-rice border border-softBorder">
                  <h4 className="text-xs font-bold text-forest flex items-center space-x-1.5 mb-2">
                    <Sprout className="w-4 h-4" />
                    <span>{language === 'bn' ? 'কৃষি জমি সেটআপ' : 'Land Profile'}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-secondaryText">জমির নাম</label>
                      <input
                        type="text"
                        value={landName}
                        onChange={(e) => setLandName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-softBorder bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-secondaryText">জমির পরিমাণ ও একক</label>
                      <div className="flex space-x-1">
                        <input
                          type="number"
                          value={landSize}
                          onChange={(e) => setLandSize(Number(e.target.value))}
                          className="w-2/3 px-2.5 py-1.5 text-xs rounded-lg border border-softBorder bg-white"
                        />
                        <select
                          value={landUnit}
                          onChange={(e) => setLandUnit(e.target.value as LandUnit)}
                          className="w-1/3 px-1 py-1.5 text-xs rounded-lg border border-softBorder bg-white"
                        >
                          <option value="decimal">শতাংশ</option>
                          <option value="katha">কাঠা</option>
                          <option value="bigha">বিঘা</option>
                          <option value="acre">একর</option>
                          <option value="hectare">হেক্টর</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-secondaryText">মাটির ধরন</label>
                      <select
                        value={soilType}
                        onChange={(e) => setSoilType(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-softBorder bg-white"
                      >
                        {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Livestock setup */}
              {selectedSectors.includes('livestock') && (
                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center space-x-1.5 mb-2">
                    <Beef className="w-4 h-4" />
                    <span>{language === 'bn' ? 'পশু খামার সেটআপ' : 'Livestock Farm'}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-secondaryText">খামারের নাম</label>
                      <input
                        type="text"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-softBorder bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-secondaryText">পশুর ধরন</label>
                      <select
                        value={livestockType}
                        onChange={(e) => setLivestockType(e.target.value as any)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-softBorder bg-white"
                      >
                        <option value="cattle">গরু / গাভী (Cattle)</option>
                        <option value="goat">ছাগল (Goat)</option>
                        <option value="poultry">পোল্ট্রি (Poultry)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-secondaryText">পশুর সংখ্যা</label>
                      <input
                        type="number"
                        value={animalCount}
                        onChange={(e) => setAnimalCount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-softBorder bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Fisheries setup */}
              {selectedSectors.includes('fisheries') && (
                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200">
                  <h4 className="text-xs font-bold text-river-dark flex items-center space-x-1.5 mb-2">
                    <Fish className="w-4 h-4" />
                    <span>{language === 'bn' ? 'মৎস্য পুকুর সেটআপ' : 'Pond Profile'}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-secondaryText">পুকুরের নাম</label>
                      <input
                        type="text"
                        value={pondName}
                        onChange={(e) => setPondName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-softBorder bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-secondaryText">পুকুরের আয়তন (শতাংশ)</label>
                      <input
                        type="number"
                        value={pondSize}
                        onChange={(e) => setPondSize(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-softBorder bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-secondaryText">গড় গভীরতা (ফুট)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={pondDepth}
                        onChange={(e) => setPondDepth(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-softBorder bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-softBorder mt-6">
              <button
                onClick={() => setStep(5)}
                className="inline-flex items-center space-x-1 px-4 py-2 text-xs font-semibold text-secondaryText hover:text-primaryText"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'পূর্ববর্তী' : 'Back'}</span>
              </button>
              <button
                onClick={handleCompleteOnboarding}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-dark text-white font-bold text-xs shadow-md transition"
              >
                <Sparkles className="w-4 h-4 text-forest-leaf" />
                <span>{language === 'bn' ? 'ড্যাশবোর্ড তৈরি সম্পন্ন করুন' : 'Generate Dashboard'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};

