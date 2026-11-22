import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sprout, 
  Plus, 
  Calculator, 
  Bug, 
  Calendar, 
  Stethoscope, 
  MapPin, 
  Trash2, 
  Edit3, 
  Check, 
  AlertTriangle, 
  Upload, 
  Mic, 
  Info, 
  Save, 
  ArrowRight,
  Droplets,
  Clock,
  Sparkles,
  Layers,
  Compass,
  BarChart2,
  CalendarCheck
} from 'lucide-react';
import { BANGLADESH_DISTRICTS, SOIL_TYPES, SEASONS } from '../../data/bangladeshGeo';
import { LandProfile, LandUnit, FertilizerPlan } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { CreateReminderModal } from '../../components/common/CreateReminderModal';
import { formatCurrency, formatNumber, toBengaliDigits } from '../../utils/formatters';

export const AgricultureHub: React.FC<{ initialSubTab?: string }> = ({ initialSubTab = 'overview' }) => {
  const { 
    language, 
    user,
    lands, 
    addLand, 
    updateLand, 
    deleteLand, 
    fertilizerPlans, 
    addFertilizerPlan, 
    reminders, 
    addReminder, 
    toggleReminderComplete,
    deleteReminder,
    experts,
    bookConsultation
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(initialSubTab);

  // Land modal state
  const [showLandModal, setShowLandModal] = useState(false);
  const [editingLandId, setEditingLandId] = useState<string | null>(null);
  const [landName, setLandName] = useState('');
  const [landSize, setLandSize] = useState<number>(33);
  const [landUnit, setLandUnit] = useState<LandUnit>('decimal');
  const [soilType, setSoilType] = useState<any>('Loam (দোআঁশ)');
  const [district, setDistrict] = useState('Bogura');
  const [upazila, setUpazila] = useState('Shibganj');
  const [village, setVillage] = useState('Gokul');
  const [waterSource, setWaterSource] = useState<any>('Deep Tubewell');
  const [season, setSeason] = useState<any>('Rabi (রবি)');
  const [crop, setCrop] = useState('বোরো ধান (Boro Rice)');

  // Confirm delete dialog
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Crop Planning (Part 7.2) Interactive State
  const [planSoil, setPlanSoil] = useState<string>('Loam (দোআঁশ)');
  const [planSeason, setPlanSeason] = useState<string>('Rabi (রবি)');
  const [planWater, setPlanWater] = useState<string>('Deep Tubewell');
  const [planSize, setPlanSize] = useState<number>(33);

  // Fertilizer Calculator State
  const [calcCrop, setCalcCrop] = useState<'rice' | 'potato' | 'maize' | 'wheat'>('rice');
  const [calcSize, setCalcSize] = useState<number>(33);
  const [calcUnit, setCalcUnit] = useState<LandUnit>('decimal');
  const [calcSoil, setCalcSoil] = useState<string>('Loam (দোআঁশ)');
  const [calcStage, setCalcStage] = useState<'basal' | 'tillering' | 'panicle'>('basal');
  const [calculatedPlan, setCalculatedPlan] = useState<FertilizerPlan | null>(null);

  // Pest & Disease State
  const [pestCrop, setPestCrop] = useState('ধান (Rice)');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [pestText, setPestText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [pestDiagnosisResult, setPestDiagnosisResult] = useState<any | null>(null);

  // Consultation Booking Modal State
  const [selectedExpertForBooking, setSelectedExpertForBooking] = useState<any | null>(null);
  const [bookingTopic, setBookingTopic] = useState('');
  const [bookingUrgency, setBookingUrgency] = useState<'normal' | 'emergency'>('normal');

  // Reminder Modal State
  const [showReminderModal, setShowReminderModal] = useState(false);

  // Convert any land size to Decimals for calculations
  const convertToDecimals = (size: number, unit: LandUnit): number => {
    switch (unit) {
      case 'decimal': return size;
      case 'bigha': return size * 33; // Standard 1 Bigha = 33 Decimals in BD
      case 'acre': return size * 100; // 1 Acre = 100 Decimals
      case 'hectare': return size * 247.1; // 1 Hectare ~ 247.1 Decimals
      case 'katha': return size * 1.65; // 1 Katha = 1.65 Decimals (20 Katha = 1 Bigha)
      default: return size;
    }
  };

  const handleOpenAddLand = () => {
    setEditingLandId(null);
    setLandName('');
    setLandSize(33);
    setLandUnit('decimal');
    setSoilType('Loam (দোআঁশ)');
    setDistrict('Bogura');
    setUpazila('Shibganj');
    setVillage('Gokul');
    setWaterSource('Deep Tubewell');
    setSeason('Rabi (রবি)');
    setCrop('বোরো ধান (Boro Rice)');
    setShowLandModal(true);
  };

  const handleEditLand = (land: LandProfile) => {
    setEditingLandId(land.id);
    setLandName(land.name);
    setLandSize(land.size);
    setLandUnit(land.unit);
    setSoilType(land.soilType);
    setDistrict(land.district);
    setUpazila(land.upazila);
    setVillage(land.village);
    setWaterSource(land.waterSource);
    setSeason(land.season);
    setCrop(land.currentCrop || '');
    setShowLandModal(true);
  };

  const handleSaveLand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landName.trim()) return;

    if (editingLandId) {
      updateLand(editingLandId, {
        name: landName,
        size: Number(landSize),
        unit: landUnit,
        soilType,
        district,
        upazila,
        village,
        waterSource,
        season,
        currentCrop: crop
      });
    } else {
      addLand({
        name: landName,
        size: Number(landSize),
        unit: landUnit,
        soilType,
        division: 'Rajshahi',
        district,
        upazila,
        village,
        waterSource,
        season,
        currentCrop: crop
      });
    }
    setShowLandModal(false);
  };

  // Fertilizer Calculation Logic (Based on Bangladesh Agricultural Research Council - BARC guidelines)
  const handleCalculateFertilizer = () => {
    const totalDecimals = convertToDecimals(calcSize, calcUnit);

    let ureaPerDec = 1.0;
    let tspPerDec = 0.45;
    let mopPerDec = 0.55;
    let gypsumPerDec = 0.35;

    if (calcCrop === 'potato') {
      ureaPerDec = 1.4;
      tspPerDec = 0.9;
      mopPerDec = 1.1;
      gypsumPerDec = 0.45;
    } else if (calcCrop === 'maize') {
      ureaPerDec = 1.8;
      tspPerDec = 0.8;
      mopPerDec = 0.9;
      gypsumPerDec = 0.5;
    }

    const fertilizers = [
      {
        name: 'Urea (ইউরিয়া)',
        nameBn: 'ইউরিয়া সার',
        quantityKg: Math.round(ureaPerDec * totalDecimals * 10) / 10,
        applicationSchedule: '৩ কিস্তিতে: চারা রোপণের ১৫, ৩০ ও ৪৫ দিন পর',
        applicationScheduleBn: '৩ কিস্তিতে: ১ম কুশি, কুশি বৃদ্ধি ও কাইচথোড় আসার আগে',
        method: 'জমিতে ছিটানো (Top-dressing)',
        methodBn: 'জমিতে রস থাকা অবস্থায় উপরিপ্রয়োগ',
        estimatedCost: Math.round(ureaPerDec * totalDecimals * 27)
      },
      {
        name: 'TSP (টিএসপি)',
        nameBn: 'টিএসপি সার',
        quantityKg: Math.round(tspPerDec * totalDecimals * 10) / 10,
        applicationSchedule: 'জমি তৈরির শেষ চাষে (Basal)',
        applicationScheduleBn: 'জমি তৈরির শেষ চাষের সময় পুরোটা প্রয়োগ করুন',
        method: 'মাটিতে মিশিয়ে দেওয়া',
        methodBn: 'মাটির সাথে ভালোভাবে মিশিয়ে দিন',
        estimatedCost: Math.round(tspPerDec * totalDecimals * 32)
      },
      {
        name: 'MoP (মিউরেট অব পটাশ)',
        nameBn: 'এমওপি (পটাশ) সার',
        quantityKg: Math.round(mopPerDec * totalDecimals * 10) / 10,
        applicationSchedule: '৫০% শেষ চাষে, ৫০% কাইচথোড় আসার সময়',
        applicationScheduleBn: 'অর্ধেক জমি তৈরির সময় এবং বাকি অর্ধেক কাইচথোড় আসার সময়',
        method: 'মাটিতে প্রয়োগ',
        methodBn: 'মাটিতে প্রয়োগ',
        estimatedCost: Math.round(mopPerDec * totalDecimals * 22)
      },
      {
        name: 'Gypsum (জিপসাম)',
        nameBn: 'জিপসাম সার',
        quantityKg: Math.round(gypsumPerDec * totalDecimals * 10) / 10,
        applicationSchedule: 'জমি তৈরির সময়',
        applicationScheduleBn: 'জমি তৈরির শেষ চাষে এককালীন',
        method: 'মাটি মিশ্রণ',
        methodBn: 'মাটির সাথে মিশিয়ে দেওয়া',
        estimatedCost: Math.round(gypsumPerDec * totalDecimals * 16)
      }
    ];

    const totalCost = fertilizers.reduce((sum, f) => sum + f.estimatedCost, 0);

    const plan: FertilizerPlan = {
      id: 'plan_' + Date.now(),
      cropName: calcCrop === 'rice' ? 'বোরো ধান' : calcCrop === 'potato' ? 'আলু' : 'ভুট্টা',
      landSize: calcSize,
      unit: calcUnit,
      soilType: calcSoil,
      growthStage: calcStage,
      fertilizers,
      totalEstimatedCost: totalCost,
      guidanceBn: `মোট ${toBengaliDigits(totalDecimals)} শতাংশ জমির জন্য সুষম সারের সুপারিশ। ইউরিয়া প্রয়োগের সময় জমিতে পরিমিত আর্দ্রতা বজায় রাখুন। পাতা হলুদ হলে জিংক স্প্রে করুন।`,
      guidanceEn: `Balanced fertilizer recommendation calculated for ${totalDecimals} decimals. Split Urea into 3 doses to reduce nitrogen leaching.`,
      createdAt: new Date().toISOString()
    };

    setCalculatedPlan(plan);
  };

  // Pest Symptom Troubleshooter
  const handleDiagnosePest = () => {
    setPestDiagnosisResult({
      crop: pestCrop,
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ['পাতায় হলুদাভ দাগ ও ঝলসে যাওয়া'],
      possibleDiseases: [
        {
          name: 'Bacterial Leaf Blight (ধানের পাতা পোড়া রোগ)',
          nameBn: 'ব্যাকটেরিয়াজনিত পাতা পোড়া রোগ (BLB)',
          confidence: 88,
          severity: 'high',
          symptomsBn: 'পাতার আগা থেকে শুরু করে দুই কিনারা দিয়ে ঢেউ খেলানো হলুদাভ ও পরবর্তীতে খড় রঙের শুকিয়ে যাওয়া দাগ।',
          preventionBn: 'রোগমুক্ত প্রত্যায়িত বীজ ব্যবহার করা এবং অতিরিক্ত ইউরিয়া সার প্রয়োগ পরিহার করা।',
          organicControlBn: 'প্রতি শতাংশ জমিতে ৬০ গ্রাম হারে পটাশ ও ৬০ গ্রাম থিওভিট স্প্রে করা। নিমপাতার রস স্প্রে।',
          chemicalControlBn: 'বিঘাপ্রতি ৫০ গ্রাম বা প্রোপিকোনাজল জাতীয় অনুমোদিত ছত্রাকনাশক ১৬ লিটার জলে গুলে বিকেলে স্প্রে করা।',
          expertConsultationRecommended: true
        },
        {
          name: 'Brown Spot (বাদামি দাগ রোগ)',
          nameBn: 'ধানের বাদামি দাগ রোগ (Brown Spot)',
          confidence: 55,
          severity: 'moderate',
          symptomsBn: 'পাতায় ছোট ছোট বাদামি থেকে গাঢ় তামাটে রঙের চোখের মতো দাগ দেখা দেওয়া।',
          preventionBn: 'সুষম সার প্রয়োগ ও পরিমিত সেচ প্রদান।',
          organicControlBn: 'ট্রাইকোডার্মা মিশ্রিত জৈব কম্পোস্ট ব্যবহার।',
          chemicalControlBn: 'ম্যানকোজেব বা কার্বেনডাজিম স্প্রে।',
          expertConsultationRecommended: false
        }
      ]
    });
  };

  const handleBookingSubmit = () => {
    if (!selectedExpertForBooking) return;
    bookConsultation({
      expertId: selectedExpertForBooking.id,
      expertName: selectedExpertForBooking.nameBn,
      category: 'agriculturist',
      farmerId: user.id,
      farmerName: user.name,
      farmerPhone: user.phone,
      sector: 'agriculture',
      topic: bookingTopic || 'ফসলের পোকার আক্রমণ ও রোগবালাই সমাধান',
      urgency: bookingUrgency,
      description: `রোগ লক্ষণ: ${selectedSymptoms.join(', ') || 'ধানের পাতা বিবর্ণ ও দাগ'}. ${pestText}`,
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: '03:30 PM'
    });
    setSelectedExpertForBooking(null);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-softBorder shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest/15 text-forest flex items-center justify-center shrink-0">
            <Sprout className="w-6 h-6 text-forest" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-forest-dark tracking-tight">
              {language === 'bn' ? 'কৃষি মডিউল (Agriculture Hub)' : 'Agriculture Management'}
            </h1>
            <p className="text-xs sm:text-sm text-secondaryText mt-0.5">
              {language === 'bn' 
                ? 'জমি প্রোফাইল, স্মার্ট সার ক্যালকুলেটর, ফসল পরিকল্পনা, রোগ সনাক্তকরণ ও শস্য ক্যালেন্ডার' 
                : 'Land profiles, smart fertilizer calculator, crop planning, disease diagnostics and calendar'}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddLand}
          className="btn-primary self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন জমি যোগ করুন' : 'Add Land Profile'}</span>
        </button>
      </div>

      {/* Unified Sub-Navigation Tabs */}
      <div className="flex items-center space-x-1.5 border-b border-softBorder overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
        {[
          { id: 'overview', labelBn: 'একনজরে', labelEn: 'Overview', icon: BarChart2 },
          { id: 'lands', labelBn: `আমার জমি (${lands.length})`, labelEn: `My Lands (${lands.length})`, icon: Layers },
          { id: 'planning', labelBn: 'ফসল পরিকল্পনা', labelEn: 'Crop Planning', icon: Compass },
          { id: 'calculator', labelBn: 'সার ক্যালকুলেটর', labelEn: 'Calculator', icon: Calculator },
          { id: 'troubleshoot', labelBn: 'রোগ ও পোকা AI', labelEn: 'Pest AI', icon: Bug },
          { id: 'calendar', labelBn: 'শস্য ক্যালেন্ডার', labelEn: 'Calendar', icon: Calendar },
          { id: 'experts', labelBn: 'কৃষিবিদ নেটওয়ার্ক', labelEn: 'Ask Expert', icon: Stethoscope }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`subtab-pill ${
                isActive 
                  ? 'bg-forest text-white shadow-2xs font-bold' 
                  : 'text-secondaryText hover:text-forest-dark hover:bg-rice'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{language === 'bn' ? tab.labelBn : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-softBorder shadow-2xs">
              <span className="text-xs text-secondaryText font-semibold block">মোট নথিভুক্ত জমি</span>
              <p className="text-2xl sm:text-3xl font-black text-forest-dark mt-1">
                {language === 'bn' ? toBengaliDigits(lands.length) : lands.length} <span className="text-sm font-normal text-secondaryText">টি প্লট</span>
              </p>
              <p className="text-xs text-mutedText mt-1">
                মোট এলাকা: {lands.reduce((acc, l) => acc + convertToDecimals(l.size, l.unit), 0).toFixed(1)} শতাংশ
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-softBorder shadow-2xs">
              <span className="text-xs text-secondaryText font-semibold block">চলতি মৌসুমে আবাদি ফসল</span>
              <p className="text-lg font-bold text-forest-dark mt-1">
                বোরো ধান ও ডায়মন্ড আলু
              </p>
              <p className="text-xs text-status-success font-bold mt-1">
                রবি মৌসুম (অনুকূল অবস্থা)
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-softBorder shadow-2xs">
              <span className="text-xs text-secondaryText font-semibold block">আসন্ন কৃষি কাজ</span>
              <p className="text-lg font-bold text-clay mt-1">
                ২য় কিস্তির ইউরিয়া প্রয়োগ
              </p>
              <p className="text-xs text-mutedText mt-1">
                আগামীকাল আলু জমিতে নির্ধারিত
              </p>
            </div>
          </div>

          {/* Quick Lands List preview */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-softBorder shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-forest-dark">আপনার জমি ও আবাদের বিবরণ</h3>
              <button onClick={() => setActiveTab('lands')} className="text-xs font-bold text-forest hover:underline">
                সকল জমি দেখুন ({lands.length}) →
              </button>
            </div>

            {lands.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="কোনো জমি যুক্ত করা নেই"
                description="আপনার প্রথম জমির রেকর্ড তৈরি করুন যাতে মাটি অনুযায়ী সার ও ফসলের সুপারিশ পাওয়া যায়।"
                actionLabel="জমি যোগ করুন"
                onAction={handleOpenAddLand}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lands.map((land) => (
                  <div key={land.id} className="p-4 rounded-xl bg-rice/50 border border-softBorder flex flex-col justify-between hover:bg-white hover:shadow-2xs transition">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-light text-forest">
                          {land.season}
                        </span>
                        <span className="text-[11px] text-mutedText">{land.lastUpdated}</span>
                      </div>
                      <h4 className="text-sm font-bold text-forest-dark">{land.name}</h4>
                      <p className="text-xs font-semibold text-primaryText mt-1">
                        {land.size} {land.unit === 'decimal' ? 'শতাংশ' : land.unit === 'bigha' ? 'বিঘা' : 'একর'} • {land.soilType}
                      </p>
                      <p className="text-xs text-secondaryText mt-1">
                        বর্তমান ফসল: <strong className="text-forest-dark">{land.currentCrop || 'পরিকল্পনাধীন'}</strong>
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-softBorder flex items-center justify-between text-xs">
                      <span className="text-[11px] text-mutedText">{land.waterSource}</span>
                      <button
                        onClick={() => {
                          setCalcSize(land.size);
                          setCalcUnit(land.unit);
                          setCalcSoil(land.soilType);
                          setActiveTab('calculator');
                        }}
                        className="font-bold text-forest hover:underline"
                      >
                        সার গণনা করুন →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY LANDS (CRUD Working Outcomes) */}
      {activeTab === 'lands' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-forest-dark">
              {language === 'bn' ? `নিবন্ধিত জমির তালিকা (${lands.length} টি)` : `Registered Land Profiles (${lands.length})`}
            </h3>
            <button
              onClick={handleOpenAddLand}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'bn' ? 'নতুন জমি যোগ' : 'Add Land'}</span>
            </button>
          </div>

          {lands.length === 0 ? (
            <EmptyState
              icon={Layers}
              title="কোনো জমি পাওয়া যায়নি"
              description="সার পরিকল্পনা ও ফসল ক্যালেন্ডার সক্রিয় করতে অনুগ্রহ করে অন্তত একটি জমির প্রোফাইল যোগ করুন।"
              actionLabel="জমি যোগ করুন"
              onAction={handleOpenAddLand}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {lands.map((land) => (
                <div key={land.id} className="p-5 rounded-2xl bg-white border border-softBorder shadow-2xs flex flex-col justify-between hover:shadow-xs transition">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest-light">
                          {land.season}
                        </span>
                        <h4 className="text-base font-bold text-forest-dark mt-2">{land.name}</h4>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEditLand(land)}
                          className="p-1.5 text-secondaryText hover:text-forest hover:bg-rice rounded-lg transition"
                          title="Edit land"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(land.id)}
                          className="p-1.5 text-secondaryText hover:text-status-error hover:bg-red-50 rounded-lg transition"
                          title="Delete land"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-softBorder/60">
                        <span className="text-secondaryText">জমির পরিমাণ:</span>
                        <span className="font-bold text-primaryText">
                          {land.size} {land.unit === 'decimal' ? 'শতাংশ' : land.unit === 'bigha' ? 'বিঘা' : 'একর'}
                          {' '}({convertToDecimals(land.size, land.unit).toFixed(1)} শতক)
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-softBorder/60">
                        <span className="text-secondaryText">মাটির ধরন:</span>
                        <span className="font-semibold text-primaryText">{land.soilType}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-softBorder/60">
                        <span className="text-secondaryText">বর্তমান ফসল:</span>
                        <span className="font-bold text-forest-dark">{land.currentCrop || 'অনাবাদি'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-softBorder/60">
                        <span className="text-secondaryText">সেচ ব্যবস্থা:</span>
                        <span className="font-semibold text-primaryText">{land.waterSource}</span>
                      </div>
                      <div className="flex justify-between py-1 text-mutedText text-[11px]">
                        <span>অবস্থান:</span>
                        <span>{land.village}, {land.upazila}, {land.district}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-softBorder flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setCalcSize(land.size);
                        setCalcUnit(land.unit);
                        setCalcSoil(land.soilType);
                        setActiveTab('calculator');
                      }}
                      className="font-bold text-forest hover:underline"
                    >
                      সার হিসেব করুন →
                    </button>
                    <button
                      onClick={() => {
                        setPestCrop(land.currentCrop || 'ধান (Rice)');
                        setActiveTab('troubleshoot');
                      }}
                      className="font-bold text-clay hover:underline"
                    >
                      রোগবালাই পরীক্ষা
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CROP PLANNING (Part 7.2 of PRD) */}
      {activeTab === 'planning' && (
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-softBorder shadow-2xs space-y-4">
            <div className="border-b border-softBorder pb-3">
              <h3 className="text-base font-bold text-forest-dark flex items-center space-x-2">
                <Compass className="w-5 h-5 text-forest" />
                <span>মৌসুম ও মাটি উপযোগী ফসল পরিকল্পনা (Crop Planning Engine)</span>
              </h3>
              <p className="text-xs sm:text-sm text-secondaryText mt-0.5">
                আপনার এলাকার মাটির ধরন, সেচ সুবিধা ও মৌসুম নির্বাচন করে সর্বোচ্চ উৎপাদনশীল ফসল ও আনুমানিক লাভজনকতা জানুন।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-bold text-primaryText mb-1">মৌসুম (Season)</label>
                <select
                  value={planSeason}
                  onChange={(e) => setPlanSeason(e.target.value)}
                  className="input-field"
                >
                  <option value="Rabi (রবি)">রবি (Rabi - শীতকালীন)</option>
                  <option value="Kharif-1 (খরিপ-১)">খরিপ-১ (গ্রীষ্মকালীন)</option>
                  <option value="Kharif-2 (খরিপ-২)">খরিপ-২ (বর্ষাকালীন)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-primaryText mb-1">মাটির ধরন (Soil Type)</label>
                <select
                  value={planSoil}
                  onChange={(e) => setPlanSoil(e.target.value)}
                  className="input-field"
                >
                  {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-primaryText mb-1">সেচের উৎস (Water Source)</label>
                <select
                  value={planWater}
                  onChange={(e) => setPlanWater(e.target.value)}
                  className="input-field"
                >
                  <option value="Deep Tubewell">গভীর নলকূপ (সুনিশ্চিত সেচ)</option>
                  <option value="Pond / River">নদী বা পুকুর</option>
                  <option value="Rainfed">বৃষ্টি নির্ভর</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-primaryText mb-1">পরিকল্পিত জমির আয়তন (শতক)</label>
                <input
                  type="number"
                  value={planSize}
                  onChange={(e) => setPlanSize(Number(e.target.value))}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Recommended Crop Cards based on Plan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                cropBn: 'বোরো ধান (ব্রি ধান-২৮ / ব্রি ধান-৮৯)',
                suitability: '৯৮% অত্যন্ত উপযোগী',
                plantingWindow: '১৫ ডিসেম্বর - ১৫ জানুয়ারি',
                duration: '১৪০-১৫০ দিন',
                waterNeed: 'উচ্চ (নিয়মিত সেচ প্রয়োজন)',
                practices: 'চারার বয়স ২৫-৩০ দিন হলে রোপণ করুন। সুষম সার ও খড় মাটিতে মিশিয়ে দিন।',
                inputCostEst: planSize * 650,
                yieldEst: `${(planSize * 0.8).toFixed(1)} মণ`
              },
              {
                cropBn: 'ডায়মন্ড / কার্ডিনাল গোল আলু',
                suitability: '৯৫% চমৎকার উপযোগী',
                plantingWindow: '১ নভেম্বর - ৩০ নভেম্বর',
                duration: '৮৫-৯০ দিন',
                waterNeed: 'মাঝারি (২-৩টি হালকা সেচ)',
                practices: 'বেলে দোআঁশ মাটিতে উঁচু বেড তৈরি করে সারিতে আলু রোপণ করুন। কান্দি তোলা জরুরি।',
                inputCostEst: planSize * 1100,
                yieldEst: `${(planSize * 2.8).toFixed(1)} মণ`
              },
              {
                cropBn: 'হাইব্রিড ভুট্টা (এনকে-৪০ / প্যাক-৭৫১)',
                suitability: '৯২% লাভজনক বিকল্প',
                plantingWindow: '১৫ নভেম্বর - ১৫ ডিসেম্বর',
                duration: '১৩০-১৪০ দিন',
                waterNeed: 'মাঝারি (৪-৫টি সেচ)',
                practices: 'উঁচু ও মাঝারি জমিতে লাইন করে বীজ বপন। জল নিষ্কাশন ব্যবস্থা নিশ্চিত করুন।',
                inputCostEst: planSize * 550,
                yieldEst: `${(planSize * 1.4).toFixed(1)} মণ`
              }
            ].map((cropPlan, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-softBorder shadow-2xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-status-success">
                      {cropPlan.suitability}
                    </span>
                    <span className="text-xs text-mutedText">{cropPlan.duration}</span>
                  </div>
                  <h4 className="text-base font-bold text-forest-dark mt-2">{cropPlan.cropBn}</h4>
                  
                  <div className="mt-3 space-y-1.5 text-xs text-secondaryText">
                    <p><strong className="text-primaryText">রোপণের উপযুক্ত সময়:</strong> {cropPlan.plantingWindow}</p>
                    <p><strong className="text-primaryText">সেচ চাহিদা:</strong> {cropPlan.waterNeed}</p>
                    <p><strong className="text-primaryText">সম্ভাব্য ফলন ({planSize} শতকে):</strong> <span className="font-bold text-forest">{cropPlan.yieldEst}</span></p>
                    <p><strong className="text-primaryText">আনুমানিক ইনপুট খরচ:</strong> ৳ {toBengaliDigits(cropPlan.inputCostEst)}</p>
                  </div>

                  <p className="p-2.5 rounded-xl bg-rice text-[11px] text-primaryText mt-3 leading-relaxed">
                    {cropPlan.practices}
                  </p>
                </div>

                <div className="pt-3 border-t border-softBorder flex items-center justify-between">
                  <button
                    onClick={() => {
                      setCalcSize(planSize);
                      setActiveTab('calculator');
                    }}
                    className="text-xs font-bold text-forest hover:underline"
                  >
                    সার তালিকা তৈরি করুন →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SMART FERTILIZER CALCULATOR (Real working frontend calculator) */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Calculator Inputs */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-softBorder shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-softBorder pb-3">
              <Calculator className="w-5 h-5 text-forest" />
              <h3 className="text-base font-bold text-forest-dark">স্মার্ট সার সুপারিশ ক্যালকুলেটর</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-primaryText mb-1">ফসল নির্বাচন করুন</label>
              <select
                value={calcCrop}
                onChange={(e) => setCalcCrop(e.target.value as any)}
                className="input-field"
              >
                <option value="rice">বোরো ধান (Boro Rice - ব্রি ২৮/২৯)</option>
                <option value="potato">গোল আলু (Diamond / Cardinal Potato)</option>
                <option value="maize">হাইব্রিড ভুট্টা (Hybrid Maize)</option>
                <option value="wheat">গম (Wheat)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-primaryText mb-1">জমির পরিমাণ ও পরিমাপ একক</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="1"
                  value={calcSize}
                  onChange={(e) => setCalcSize(Number(e.target.value))}
                  className="input-field w-2/3 font-bold"
                />
                <select
                  value={calcUnit}
                  onChange={(e) => setCalcUnit(e.target.value as LandUnit)}
                  className="input-field w-1/3 font-bold"
                >
                  <option value="decimal">শতাংশ</option>
                  <option value="katha">কাঠা (১.৬৫ শতক)</option>
                  <option value="bigha">বিঘা (৩৩ শতক)</option>
                  <option value="acre">একর (১০০ শতক)</option>
                  <option value="hectare">হেক্টর</option>
                </select>
              </div>
              <p className="text-[11px] text-mutedText mt-1">
                = {convertToDecimals(calcSize, calcUnit).toFixed(1)} শতাংশ জমি হিসেবে গণনা হবে।
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-primaryText mb-1">মাটির ধরন</label>
              <select
                value={calcSoil}
                onChange={(e) => setCalcSoil(e.target.value)}
                className="input-field"
              >
                {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-primaryText mb-1">বৃদ্ধির পর্যায় (Growth Stage)</label>
              <select
                value={calcStage}
                onChange={(e) => setCalcStage(e.target.value as any)}
                className="input-field"
              >
                <option value="basal">জমি তৈরি ও রোপণ পর্যায় (Basal Application)</option>
                <option value="tillering">কুশি বৃদ্ধি পর্যায় (Tillering / Vegetative)</option>
                <option value="panicle">কাইচথোড় ও ফুল আসার পর্যায় (Panicle Initiation)</option>
              </select>
            </div>

            <button
              onClick={handleCalculateFertilizer}
              className="btn-primary w-full"
            >
              <Calculator className="w-4 h-4" />
              <span>সার ডোজ গণনা করুন</span>
            </button>

            {/* Scientific Note */}
            <div className="p-3 rounded-xl bg-rice border border-softBorder text-xs text-secondaryText flex items-start space-x-2">
              <Info className="w-4 h-4 text-forest shrink-0 mt-0.5" />
              <p>
                <strong>নির্দেশনা:</strong> বিএআরসি (BARC) সার সুপারিশ সহায়িকা নির্দেশিকা ভিত্তিক নমুনা মডেল। মাটির গুণগত বিশ্লেষণ (Soil Test) করা থাকলে স্থানীয় কৃষি কর্মকর্তার মতামত অনুযায়ী সমন্বয় করুন।
              </p>
            </div>
          </div>

          {/* Calculator Output Display */}
          <div className="lg:col-span-2 space-y-4">
            {calculatedPlan ? (
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-softBorder shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-softBorder pb-3 gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-light text-forest">
                      গণনাকৃত সার পরিকল্পনা
                    </span>
                    <h3 className="text-lg font-bold text-forest-dark mt-1">
                      {calculatedPlan.cropName} — {calculatedPlan.landSize} {calculatedPlan.unit}
                    </h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-mutedText block">আনুমানিক মোট সার খরচ</span>
                    <span className="text-xl font-black text-forest">
                      {formatCurrency(calculatedPlan.totalEstimatedCost, language)}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-rice border-y border-softBorder text-secondaryText font-bold">
                        <th className="py-2.5 px-3">সারের নাম</th>
                        <th className="py-2.5 px-3">প্রস্তাবিত পরিমাণ</th>
                        <th className="py-2.5 px-3">প্রয়োগের সময়</th>
                        <th className="py-2.5 px-3">পদ্ধতি</th>
                        <th className="py-2.5 px-3 text-right">খরচ (টাকা)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-softBorder">
                      {calculatedPlan.fertilizers.map((f, i) => (
                        <tr key={i} className="hover:bg-warmWhite">
                          <td className="py-2.5 px-3 font-bold text-forest-dark">{f.nameBn}</td>
                          <td className="py-2.5 px-3 font-semibold text-primaryText">
                            {toBengaliDigits(f.quantityKg)} কেজি
                          </td>
                          <td className="py-2.5 px-3 text-secondaryText text-xs">{f.applicationScheduleBn}</td>
                          <td className="py-2.5 px-3 text-secondaryText text-xs">{f.methodBn}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-primaryText">
                            ৳ {toBengaliDigits(f.estimatedCost)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 rounded-xl bg-forest-50 border border-forest/20 text-xs sm:text-sm text-forest-dark">
                  <p className="font-bold mb-1">কৃষি পরামর্শ:</p>
                  <p className="leading-relaxed">{calculatedPlan.guidanceBn}</p>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => addFertilizerPlan(calculatedPlan)}
                    className="btn-primary"
                  >
                    <Save className="w-4 h-4" />
                    <span>পরিকল্পনাটি সংরক্ষণ করুন</span>
                  </button>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Calculator}
                title="সার ডোজ দেখতে বামপাশে ইনপুট দিন"
                description="ফসল, জমির আয়তন ও একক নির্বাচন করে ‘সার ডোজ গণনা করুন’ বাটনে ক্লিক করুন।"
              />
            )}
          </div>

        </div>
      )}

      {/* TAB 5: PEST & DISEASE MANAGEMENT (Symptom, voice, image upload, multi-match) */}
      {activeTab === 'troubleshoot' && (
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-softBorder shadow-2xs">
            <h3 className="text-base font-bold text-forest-dark mb-1">
              {language === 'bn' ? 'ফসল রোগ ও ক্ষতিকর পোকা সনাক্তকরণ (Pest AI Troubleshooter)' : 'Crop Pest & Disease Troubleshooter'}
            </h3>
            <p className="text-xs sm:text-sm text-secondaryText mb-5">
              {language === 'bn' 
                ? 'লক্ষণ নির্বাচন করুন অথবা ছবি আপলোড করে প্রাথমিক কারণ ও জৈব/রাসায়নিক প্রতিকার জানুন।' 
                : 'Select symptoms, upload an image or describe to receive preliminary diagnosis and organic treatment.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-primaryText mb-1">আক্রান্ত ফসল</label>
                <select
                  value={pestCrop}
                  onChange={(e) => setPestCrop(e.target.value)}
                  className="input-field font-semibold"
                >
                  <option value="ধান (Rice)">ধান (Rice)</option>
                  <option value="আলু (Potato)">আলু (Potato)</option>
                  <option value="ভুট্টা (Maize)">ভুট্টা (Maize)</option>
                  <option value="টমেটো ও বেগুন">টমেটো ও বেগুন</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-primaryText mb-1">ছবি আপলোড (ঐচ্ছিক)</label>
                <div className="flex items-center space-x-2">
                  <label className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2.5 border border-dashed border-softBorder rounded-xl cursor-pointer hover:bg-rice text-xs text-secondaryText transition">
                    <Upload className="w-4 h-4 text-forest" />
                    <span>{imagePreview ? 'ছবি নির্বাচিত হয়েছে (পরিবর্তন করুন)' : 'আক্রান্ত পাতার ছবি নির্বাচন করুন'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImagePreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                    />
                  </label>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-11 h-11 object-cover rounded-xl border border-softBorder shrink-0" />
                  )}
                </div>
              </div>
            </div>

            {/* Symptom Checkboxes */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-primaryText mb-2">দৃশ্যমান লক্ষণসমূহ নির্বাচন করুন:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {[
                  'পাতার কিনারায় হলুদাভ শুকিয়ে যাওয়া',
                  'পাতায় বাদামি তামাটে দাগ',
                  'গাছের কাণ্ড পচে যাওয়া বা কালো দাগ',
                  'পাতার নিচের অংশে সাদা পাউডার',
                  'গাছ খাটো হয়ে যাওয়া ও কুশি কম হওয়া',
                  'পোকার ডিম বা পাতার ডগা মোড়ানো'
                ].map((symptom) => {
                  const isChecked = selectedSymptoms.includes(symptom);
                  return (
                    <label 
                      key={symptom}
                      className={`flex items-center space-x-2.5 p-3 rounded-xl border text-xs cursor-pointer transition ${
                        isChecked ? 'bg-forest-50 border-forest text-forest-dark font-bold' : 'bg-warmWhite border-softBorder text-primaryText hover:bg-rice'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setSelectedSymptoms(prev => 
                            prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
                          );
                        }}
                        className="rounded text-forest focus:ring-forest w-4 h-4"
                      />
                      <span>{symptom}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Voice Input & Text */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-primaryText">অতিরিক্ত বিবরণ লিখুন বা মুখে বলুন:</label>
                <button
                  type="button"
                  onClick={() => setIsRecordingVoice(!isRecordingVoice)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 text-xs rounded-lg transition ${
                    isRecordingVoice ? 'bg-red-100 text-status-error font-bold animate-pulse' : 'bg-rice text-secondaryText hover:text-forest'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isRecordingVoice ? 'শুনছি... (ক্লিক করে থামান)' : 'ভয়েস ইনপুট'}</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={pestText}
                onChange={(e) => setPestText(e.target.value)}
                placeholder="যেমন: ৩ দিন ধরে পাতার ডগা হলুদ হয়ে খড়ের মতো শুকিয়ে যাচ্ছে, গত সপ্তাহে বৃষ্টি হয়েছিল..."
                className="input-field"
              />
            </div>

            <button
              onClick={handleDiagnosePest}
              className="btn-primary"
            >
              <Bug className="w-4 h-4" />
              <span>রোগ সনাক্ত করুন (Analyze Symptoms)</span>
            </button>
          </div>

          {/* Diagnosis Result (Honest AI Match Disclosure) */}
          {pestDiagnosisResult && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-status-warning flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-status-warning shrink-0 mt-0.5" />
                <p>
                  <strong>{language === 'bn' ? 'সতর্কতা ও স্বচ্ছতা:' : 'Notice:'}</strong>{' '}
                  {language === 'bn' 
                    ? 'এটি এআই-ভিত্তিক প্রাথমিক সম্ভাবনা ম্যাচিং। নিশ্চিত নির্ণয়ের জন্য জটিল ক্ষেত্রে অনুমোদিত কৃষি কর্মকর্তার সহায়তা নিন।' 
                    : 'This is a preliminary rule-based match. Consult a verified agronomist for severe crop damage.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pestDiagnosisResult.possibleDiseases.map((disease: any, idx: number) => (
                  <div key={idx} className="bg-white p-5 sm:p-6 rounded-2xl border border-softBorder shadow-2xs space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              disease.severity === 'high' ? 'bg-red-50 text-status-error' : 'bg-amber-50 text-status-warning'
                            }`}>
                              তীব্রতা: {disease.severity}
                            </span>
                            <span className="text-[11px] text-mutedText font-semibold">
                              ম্যাচ: {toBengaliDigits(disease.confidence)}%
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-forest-dark mt-1.5">{disease.nameBn}</h4>
                          <p className="text-xs text-mutedText italic">{disease.name}</p>
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm space-y-2.5 text-primaryText mt-3">
                        <div>
                          <span className="font-bold text-forest-dark block">লক্ষণ:</span>
                          <p className="text-secondaryText text-xs leading-relaxed">{disease.symptomsBn}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                          <span className="font-bold text-emerald-900 block text-xs">জৈব ও প্রাকৃতিক প্রতিকার:</span>
                          <p className="text-emerald-800 text-xs mt-0.5 leading-relaxed">{disease.organicControlBn}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-rice border border-softBorder">
                          <span className="font-bold text-forest-dark block text-xs">রাসায়নিক ব্যবস্থাপনা (যদি তীব্র হয়):</span>
                          <p className="text-secondaryText text-xs mt-0.5 leading-relaxed">{disease.chemicalControlBn}</p>
                        </div>
                      </div>
                    </div>

                    {disease.expertConsultationRecommended && (
                      <div className="pt-3 border-t border-softBorder flex items-center justify-between">
                        <span className="text-xs text-status-error font-bold">
                          বিশেষজ্ঞ পরামর্শ প্রয়োজন
                        </span>
                        <button
                          onClick={() => {
                            setSelectedExpertForBooking(experts.find(e => e.category === 'agriculturist') || experts[0]);
                            setBookingTopic(`জরুরি রোগ পরামর্শ: ${disease.nameBn}`);
                            setBookingUrgency('emergency');
                          }}
                          className="btn-primary"
                        >
                          কৃষিবিদ বুক করুন
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: CROP CALENDAR & REMINDERS */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-forest-dark">শস্য ক্যালেন্ডার ও ক্ষেত্র রিমাইন্ডার</h3>
              <p className="text-xs text-secondaryText">বোরো ধান ও আলু আবাদের পর্যায়ক্রমিক সময়সূচি</p>
            </div>
            <button
              onClick={() => setShowReminderModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>রিমাইন্ডার যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reminders.filter(r => r.sector === 'agriculture').map((rem) => (
              <div 
                key={rem.id} 
                className={`p-4 rounded-2xl border flex items-start justify-between transition ${
                  rem.isCompleted ? 'bg-rice/50 border-softBorder opacity-75' : 'bg-white border-softBorder shadow-2xs'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleReminderComplete(rem.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition ${
                      rem.isCompleted ? 'bg-forest border-forest text-white' : 'border-mutedText bg-white'
                    }`}
                  >
                    {rem.isCompleted && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <div>
                    <h5 className={`text-xs sm:text-sm font-bold ${rem.isCompleted ? 'line-through text-mutedText' : 'text-forest-dark'}`}>
                      {language === 'bn' ? rem.titleBn : rem.title}
                    </h5>
                    <p className="text-xs text-secondaryText mt-0.5">
                      {rem.entityName} • {rem.stage}
                    </p>
                    <span className="inline-block mt-2 text-[11px] text-mutedText font-semibold">
                      নির্ধারিত তারিখ: {toBengaliDigits(rem.date)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="text-mutedText hover:text-status-error p-1 rounded-md transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: ASK AGRICULTURIST */}
      {activeTab === 'experts' && (
        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-softBorder shadow-2xs">
            <h3 className="text-base font-bold text-forest-dark mb-1">
              যাচাইকৃত কৃষিবিদ ও শস্য বিশেষজ্ঞ ডিরেক্টরি
            </h3>
            <p className="text-xs sm:text-sm text-secondaryText mb-5">
              বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট ও কৃষি সম্প্রসারণ অধিদপ্তরের সনদপ্রাপ্ত বিশেষজ্ঞদের তালিকা।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {experts.filter(e => e.category === 'agriculturist').map((exp) => (
                <div key={exp.id} className="p-5 rounded-2xl bg-warmWhite border border-softBorder flex items-start space-x-4">
                  <img src={exp.avatarUrl} alt={exp.name} className="w-16 h-16 rounded-2xl object-cover border border-softBorder shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-1.5">
                      <h4 className="text-sm font-bold text-forest-dark">{exp.nameBn}</h4>
                      {exp.verified && <span className="text-[10px] text-status-success font-bold">✓ ভেরিফাইড</span>}
                    </div>
                    <p className="text-xs text-secondaryText font-medium mt-0.5">{exp.designationBn}</p>
                    <p className="text-[11px] text-mutedText mt-1">{exp.aboutBn}</p>
                    <div className="mt-4 flex items-center justify-between pt-2 border-t border-softBorder/60">
                      <span className="text-xs sm:text-sm font-bold text-forest">ফি: ৳ {toBengaliDigits(exp.consultationFee)}</span>
                      <button
                        onClick={() => {
                          setSelectedExpertForBooking(exp);
                          setBookingTopic('ফসলের উৎপাদন ও রোগ ব্যবস্থাপনা');
                        }}
                        className="btn-primary text-xs py-1.5"
                      >
                        অ্যাপয়েন্টমেন্ট নিন
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT LAND */}
      <Modal
        isOpen={showLandModal}
        onClose={() => setShowLandModal(false)}
        title={editingLandId ? (language === 'bn' ? 'জমির তথ্য সম্পাদনা' : 'Edit Land Profile') : (language === 'bn' ? 'নতুন কৃষি জমি যোগ করুন' : 'Add New Land Profile')}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveLand} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-primaryText mb-1">জমির নাম / প্লট নম্বর *</label>
            <input
              type="text"
              required
              placeholder="যেমন: উত্তর মাঠের ধান জমি"
              value={landName}
              onChange={(e) => setLandName(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primaryText mb-1">জমির আয়তন *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={landSize}
                onChange={(e) => setLandSize(Number(e.target.value))}
                className="input-field font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">পরিমাপ একক *</label>
              <select
                value={landUnit}
                onChange={(e) => setLandUnit(e.target.value as LandUnit)}
                className="input-field font-semibold"
              >
                <option value="decimal">শতাংশ (Decimal)</option>
                <option value="katha">কাঠা (Katha)</option>
                <option value="bigha">বিঘা (Bigha)</option>
                <option value="acre">একর (Acre)</option>
                <option value="hectare">হেক্টর (Hectare)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primaryText mb-1">মাটির ধরন</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="input-field"
              >
                {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">সেচ ব্যবস্থা</label>
              <select
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                className="input-field"
              >
                <option value="Deep Tubewell">গভীর নলকূপ (Deep Tubewell)</option>
                <option value="Pond / River">পুকুর / নদী সেচ</option>
                <option value="Rainfed">বৃষ্টি নির্ভর (Rainfed)</option>
                <option value="Canal Irrigation">খাল সেচ প্রকল্প</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primaryText mb-1">মৌসুম</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="input-field"
              >
                <option value="Rabi (রবি)">রবি (Rabi - Winter)</option>
                <option value="Kharif-1 (খরিপ-১)">খরিপ-১ (Kharif-1)</option>
                <option value="Kharif-2 (খরিপ-২)">খরিপ-২ (Kharif-2)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">বর্তমান আবাদি ফসল</label>
              <input
                type="text"
                placeholder="যেমন: ব্রি ধান-২৮"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-softBorder">
            <button
              type="button"
              onClick={() => setShowLandModal(false)}
              className="btn-secondary"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE LAND */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="জমি রেকর্ড মুছে ফেলবেন?"
        message="এই জমির প্রোফাইল মুছে ফেললে এর সাথে সংশ্লিষ্ট সার ও রিমাইন্ডার ডেটাও মুছে যেতে পারে। আপনি কি নিশ্চিত?"
        onConfirm={() => {
          if (deleteTargetId) deleteLand(deleteTargetId);
          setDeleteTargetId(null);
        }}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* MODAL: EXPERT CONSULTATION BOOKING DEMO */}
      {selectedExpertForBooking && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedExpertForBooking(null)}
          title="বিশেষজ্ঞ কৃষি পরামর্শ বুকিং"
          subtitle={`${selectedExpertForBooking.nameBn} • ফি: ৳ ${selectedExpertForBooking.consultationFee}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3 rounded-xl bg-forest-50 border border-forest/20 text-forest-dark flex items-start space-x-2">
              <Info className="w-4 h-4 text-forest shrink-0 mt-0.5" />
              <p>
                <strong>ডেমো মোড:</strong> বুকিং সম্পন্ন হলে ডেমো অ্যাপয়েন্টমেন্ট হিস্ট্রি ও প্রেসক্রিপশন ওয়ার্কফ্লো আপডেট হবে।
              </p>
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">পরামর্শের বিষয়</label>
              <input
                type="text"
                value={bookingTopic}
                onChange={(e) => setBookingTopic(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">জরুরিতা (Urgency Level)</label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setBookingUrgency('normal')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                    bookingUrgency === 'normal' ? 'bg-forest text-white border-forest' : 'bg-rice text-secondaryText'
                  }`}
                >
                  সাধারণ শিডিউল
                </button>
                <button
                  type="button"
                  onClick={() => setBookingUrgency('emergency')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                    bookingUrgency === 'emergency' ? 'bg-status-error text-white border-status-error' : 'bg-rice text-secondaryText'
                  }`}
                >
                  জরুরি (Emergency)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-softBorder">
              <button
                type="button"
                onClick={() => setSelectedExpertForBooking(null)}
                className="btn-secondary"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleBookingSubmit}
                className="btn-primary"
              >
                বুকিং নিশ্চিত করুন
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* CREATE REMINDER MODAL */}
      <CreateReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        defaultSector="agriculture"
      />

    </div>
  );
};
