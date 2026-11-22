import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Fish, 
  Plus, 
  Droplets, 
  Activity, 
  Search, 
  Edit3, 
  Bot, 
  Stethoscope, 
  Trash2, 
  AlertTriangle, 
  Check, 
  Info, 
  Save, 
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Building,
  BarChart2,
  Layers,
  Calculator,
  Compass,
  MapPin,
  Phone,
  Sparkles
} from 'lucide-react';
import { PondProfile, WaterQualityRecord, HatcheryListing } from '../../types';
import { INITIAL_HATCHERIES } from '../../data/mockData';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatNumber, toBengaliDigits } from '../../utils/formatters';

export const FisheriesHub: React.FC<{ initialSubTab?: string }> = ({ initialSubTab = 'overview' }) => {
  const { 
    language, 
    user,
    ponds, 
    addPond, 
    updatePond, 
    deletePond, 
    waterQualityRecords, 
    addWaterQualityRecord,
    experts,
    bookConsultation,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(initialSubTab);

  // Pond modal state
  const [showPondModal, setShowPondModal] = useState(false);
  const [pondName, setPondName] = useState('');
  const [pondSize, setPondSize] = useState<number>(50);
  const [pondDepth, setPondDepth] = useState<number>(6.0);
  const [farmingType, setFarmingType] = useState<'monoculture' | 'polyculture'>('polyculture');
  const [waterSource, setWaterSource] = useState<any>('Groundwater / Deep Tube-well');
  const [budget, setBudget] = useState<number>(250000);

  // Water Quality Entry State
  const [showWqModal, setShowWqModal] = useState(false);
  const [selectedPondId, setSelectedPondId] = useState<string>(ponds[0]?.id || 'pnd_1');
  const [ph, setPh] = useState<number>(7.4);
  const [ammonia, setAmmonia] = useState<number>(0.02);
  const [dissolvedOxygen, setDissolvedOxygen] = useState<number>(6.2);
  const [tempC, setTempC] = useState<number>(27.5);
  const [transparency, setTransparency] = useState<number>(28);

  // Interactive Stocking Density Guide State (PRD Part 9.2)
  const [stockingPondSize, setStockingPondSize] = useState<number>(50); // in decimals
  const [stockingFarmingType, setStockingFarmingType] = useState<'carp_polyculture' | 'monosex_tilapia' | 'pangasius'>('carp_polyculture');

  // Hatchery Directory Filter state
  const [hatcherySearch, setHatcherySearch] = useState('');
  const [hatcheryDistrict, setHatcheryDistrict] = useState('All');

  // AI Fisheries Assistant state
  const [fishChat, setFishChat] = useState<Array<{ sender: 'user' | 'bot'; text: string; alert?: boolean }>>([
    {
      sender: 'bot',
      text: 'নমস্কার / আসসালামু আলাইকুম। আমি এগ্রোনেক্স মৎস্য এআই সহকারী। আপনার পুকুরের মাছের ভাসমান হাবভাব, খাবার গ্রহণ হ্রাস বা জলের রঙ পরিবর্তন সংক্রান্ত যেকোনো প্রশ্ন করুন।'
    }
  ]);
  const [fishInput, setFishInput] = useState('');

  // Delete target
  const [deleteTargetPondId, setDeleteTargetPondId] = useState<string | null>(null);

  // Edit target
  const [editingPondId, setEditingPondId] = useState<string | null>(null);

  const handleOpenAddPond = () => {
    setEditingPondId(null);
    setPondName('');
    setPondSize(50);
    setPondDepth(6.0);
    setFarmingType('polyculture');
    setWaterSource('Groundwater / Deep Tube-well');
    setBudget(250000);
    setShowPondModal(true);
  };

  const handleOpenEditPond = (pond: PondProfile) => {
    setEditingPondId(pond.id);
    setPondName(pond.name);
    setPondSize(pond.sizeDecimal);
    setPondDepth(pond.depthFeet);
    setFarmingType(pond.farmingType);
    setWaterSource(pond.waterSource);
    setBudget(pond.budget);
    setShowPondModal(true);
  };

  const handleSavePond = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pondName.trim()) return;

    if (editingPondId) {
      updatePond(editingPondId, {
        name: pondName,
        sizeDecimal: Number(pondSize),
        depthFeet: Number(pondDepth),
        farmingType,
        waterSource,
        budget: Number(budget)
      });
      setEditingPondId(null);
    } else {
      addPond({
        name: pondName,
        sizeDecimal: Number(pondSize),
        depthFeet: Number(pondDepth),
        waterSource,
        farmingType,
        primarySpecies: farmingType === 'polyculture' ? ['Rui (রুই)', 'Katla (কাতলা)', 'Mrigal (মৃগেল)'] : ['Monosex Tilapia (তেলাপিয়া)'],
        district: 'Mymensingh',
        upazila: 'Trishal',
        budget: Number(budget),
        stockingDate: new Date().toISOString().split('T')[0]
      });
    }
    setPondName('');
    setShowPondModal(false);
  };

  const handleSaveWaterQuality = (e: React.FormEvent) => {
    e.preventDefault();

    let status: 'optimal' | 'warning' | 'critical' = 'optimal';
    const recs: string[] = [];

    if (ammonia > 0.08 || dissolvedOxygen < 3.5 || ph < 6.0 || ph > 9.0) {
      status = 'critical';
      recs.push('জরুরি সতর্কতা: পুকুরের জলে বিষাক্ত অ্যামোনিয়া বৃদ্ধি ও মারাত্মক অক্সিজেন সংকট!');
      recs.push('তাত্ক্ষণিক ব্যবস্থা: খাবার সরবরাহ সম্পূর্ণ বন্ধ রাখুন, অবিলম্বে এয়ারেটর চালু করুন এবং নতুন পরিষ্কার জল প্রবেশ করান।');
    } else if (ammonia > 0.04 || dissolvedOxygen < 5.0 || ph < 6.5 || ph > 8.5) {
      status = 'warning';
      recs.push('সতর্কতা: প্যারামিটার সামান্য অস্বাভাবিক। খাবার ২৫% হ্রাস করুন এবং শতাংশ প্রতি ২৫০ গ্রাম চুন প্রয়োগ করুন।');
    } else {
      recs.push('পুকুরের জলের সকল সূচক স্বাভাবিক ও উৎপাদন অনুকূল রয়েছে। সাধারণ নিয়মে খাদ্য প্রদান চালিয়ে যান।');
    }

    addWaterQualityRecord({
      pondId: selectedPondId,
      recordedDate: new Date().toLocaleString(),
      ph: Number(ph),
      ammoniaPpm: Number(ammonia),
      dissolvedOxygenMgL: Number(dissolvedOxygen),
      temperatureC: Number(tempC),
      transparencyCm: Number(transparency),
      status,
      recommendations: recs
    });

    setShowWqModal(false);
  };

  const handleSendFishAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fishInput.trim()) return;

    const userMsg = fishInput;
    setFishChat(prev => [...prev, { sender: 'user', text: userMsg }]);
    setFishInput('');

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      const isOxygenAlert = lower.includes('ভেসে') || lower.includes('খাবি') || lower.includes('অক্সিজেন') || lower.includes('মরে');

      let reply = '';
      if (isOxygenAlert) {
        reply = `🚨 জরুরি সংকট বিশ্লেষণ:\nমাছ ভোরে জলের উপরিভাগে ভেসে খাবি খাওয়ার অর্থ হলো দ্রবীভূত অক্সিজেন (DO) আশঙ্কাজনকভাবে কমে গেছে।\n\nতাত্ক্ষণিক পদক্ষেপ:\n১. সাঁতার কেটে বা বাঁশ পিটিয়ে জলের ওপর ঢেউ সৃষ্টি করুন অথবা এয়ারেটর থাকলে দ্রুত চালু করুন।\n২. পুকুরে তাৎক্ষণিক টিউবওয়েল থেকে নতুন জল প্রবেশ করান।\n৩. অক্সিজেন পাউডার (যেমন অক্সিফ্লো বা অক্সিম্যাক্স) প্রতি শতাংশে ৫০-১০০ গ্রাম হারে ছিটিয়ে দিন।\n৪. আজকের দিনের খাবার দেওয়া সম্পূর্ণ বন্ধ রাখুন।`;
      } else {
        reply = `মৎস্য পুষ্টি ও পরিচর্যা পরামর্শ:\nমাছের খাবার গ্রহণ কমে যাওয়ার প্রধান কারণগুলোর মধ্যে রয়েছে জলের তাপমাত্রা কমে যাওয়া অথবা অ্যামোনিয়ার আধিক্য।\n\nপ্রস্তাবিত পদক্ষেপ:\n১. খাদ্য প্রয়োগের ১ ঘণ্টা পর ট্রে পর্যবেক্ষণ করুন খাবার অবশিষ্ট থাকে কিনা।\n২. পুকুরের তলদেশে গ্যাস তৈরি হয়েছে কিনা বাঁশ বা হররা টেনে পরীক্ষা করুন।\n৩. প্রোবায়োটিক বা জিওলাইট প্রয়োগ করে তলদেশের বিষাক্ত গ্যাস দূর করুন।`;
      }

      setFishChat(prev => [...prev, { sender: 'bot', text: reply, alert: isOxygenAlert }]);
    }, 600);
  };

  const filteredHatcheries = INITIAL_HATCHERIES.filter((h) => {
    const matchSearch = h.hatcheryName.toLowerCase().includes(hatcherySearch.toLowerCase()) ||
                        h.ownerName.toLowerCase().includes(hatcherySearch.toLowerCase()) ||
                        h.species.some(s => s.name.toLowerCase().includes(hatcherySearch.toLowerCase()));
    const matchDistrict = hatcheryDistrict === 'All' || h.district === hatcheryDistrict;
    return matchSearch && matchDistrict;
  });

  const tabs = [
    { id: 'overview', icon: BarChart2, labelBn: 'একনজরে', labelEn: 'Overview' },
    { id: 'ponds', icon: Layers, labelBn: 'আমার পুকুর', labelEn: 'My Ponds' },
    { id: 'water', icon: Droplets, labelBn: 'জলের গুণমান', labelEn: 'Water Quality' },
    { id: 'stocking', icon: Calculator, labelBn: 'পোনা মজুত গাইড', labelEn: 'Stocking Density' },
    { id: 'hatcheries', icon: Building, labelBn: 'হ্যাচারি ডিরেক্টরি', labelEn: 'Hatcheries' },
    { id: 'aifish', icon: Bot, labelBn: 'এআই মৎস্য সহকারী', labelEn: 'AI Assistant' },
    { id: 'specialist', icon: Stethoscope, labelBn: 'মৎস্য বিশেষজ্ঞ', labelEn: 'Specialist' }
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-softBorder shadow-2xs">
        <div className="flex items-center space-x-3">
          <span className="p-2.5 rounded-xl bg-blue-50 text-river border border-blue-200/60 shadow-2xs">
            <Fish className="w-5 h-5 text-river" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-forest-dark">
              {language === 'bn' ? 'মৎস্য ও অ্যাকুয়াকালচার ব্যবস্থাপনা (Fisheries Hub)' : 'Fisheries & Aquaculture Hub'}
            </h1>
            <p className="text-xs text-secondaryText leading-relaxed">
              {language === 'bn' 
                ? 'পুকুর ব্যবস্থাপনা, জলের গুণমান (DO/pH/Ammonia) ট্র্যাকিং, পোনা মজুত পরিকল্পনা ও হ্যাচারি ডিরেক্টরি' 
                : 'Pond management, water quality telemetry, stocking density guide & certified hatchery network'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWqModal(true)}
            className="btn-secondary text-xs"
          >
            <Activity className="w-3.5 h-3.5 text-river" />
            <span>জলের পরীক্ষা রেকর্ড</span>
          </button>
          <button
            onClick={handleOpenAddPond}
            className="btn-primary text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন পুকুর যোগ</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-softBorder overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`subtab-pill ${
                isActive 
                  ? 'bg-river text-white shadow-xs' 
                  : 'bg-white text-secondaryText hover:text-river hover:bg-blue-50/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{language === 'bn' ? tab.labelBn : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-premium p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondaryText font-medium">নিবন্ধিত সক্রিয় পুকুর</span>
                <Fish className="w-4 h-4 text-river/70" />
              </div>
              <p className="text-2xl font-black text-forest-dark mt-2">
                {toBengaliDigits(ponds.length)} <span className="text-sm font-semibold text-secondaryText">টি</span>
              </p>
              <p className="text-[11px] text-mutedText mt-1">
                মোট আয়তন: {toBengaliDigits(ponds.reduce((acc, p) => acc + p.sizeDecimal, 0))} শতাংশ
              </p>
            </div>

            <div className="card-premium p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondaryText font-medium">জলের সাম্প্রতিক pH মান</span>
                <Droplets className="w-4 h-4 text-river/70" />
              </div>
              <p className="text-2xl font-black text-river mt-2">
                {toBengaliDigits(waterQualityRecords[0]?.ph || 7.4)}
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                অনুকূল সীমা (৬.৫ - ৮.৫)
              </p>
            </div>

            <div className="card-premium p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondaryText font-medium">দ্রবীভূত অক্সিজেন (DO)</span>
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-forest mt-2">
                {toBengaliDigits(waterQualityRecords[0]?.dissolvedOxygenMgL || 6.2)} <span className="text-xs font-normal">mg/L</span>
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                সন্তোষজনক ও ঝুঁকিমুক্ত
              </p>
            </div>

            <div className="card-premium p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondaryText font-medium">বিষাক্ত অ্যামোনিয়া (NH3)</span>
                <AlertTriangle className="w-4 h-4 text-status-warning" />
              </div>
              <p className="text-2xl font-black text-status-warning mt-2">
                {toBengaliDigits(waterQualityRecords[0]?.ammoniaPpm || 0.02)} <span className="text-xs font-normal">ppm</span>
              </p>
              <p className="text-[11px] text-secondaryText mt-1">
                নিরাপদ মাত্রা (&lt; ০.০৫ ppm)
              </p>
            </div>
          </div>

          {/* Ponds Quick Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-forest-dark">পুকুরের স্বাস্থ্য ও জলের অবস্থা</h3>
              <button onClick={() => setActiveTab('ponds')} className="text-xs font-bold text-river hover:underline">
                সকল পুকুর ({toBengaliDigits(ponds.length)})
              </button>
            </div>

            {ponds.length === 0 ? (
              <EmptyState
                icon={Fish}
                title="কোনো পুকুর নিবন্ধিত নেই"
                description="পুকুরের আয়তন, গভীরতা ও চাষকৃত মাছের তথ্য যুক্ত করে নিয়মিত পরিচর্যা ট্র্যাক করুন।"
                actionLabel="+ নতুন পুকুর যোগ করুন"
                onAction={() => setShowPondModal(true)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ponds.map((pnd) => (
                  <div key={pnd.id} className="card-premium p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-river border border-blue-200/60 uppercase">
                            {pnd.farmingType === 'polyculture' ? 'মিশ্র কার্প চাষ' : 'একক চাষ'}
                          </span>
                          <h4 className="text-base font-bold text-forest-dark mt-1.5">{pnd.name}</h4>
                          <p className="text-xs text-secondaryText">{pnd.upazila}, {pnd.district}</p>
                        </div>
                        <span className="text-xs font-bold text-primaryText bg-rice px-2.5 py-1 rounded-lg border border-softBorder">
                          {toBengaliDigits(pnd.sizeDecimal)} শতাংশ
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-softBorder text-xs">
                        <div className="p-2 rounded-xl bg-rice">
                          <span className="text-[10px] text-secondaryText block">গড় গভীরতা</span>
                          <span className="font-semibold text-primaryText">{toBengaliDigits(pnd.depthFeet)} ফুট</span>
                        </div>
                        <div className="p-2 rounded-xl bg-rice">
                          <span className="text-[10px] text-secondaryText block">জলের উৎস</span>
                          <span className="font-semibold text-primaryText">{pnd.waterSource}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="text-[10px] text-secondaryText block mb-1">মাছের প্রজাতি:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {pnd.primarySpecies.map((sp, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-warmWhite font-medium text-primaryText border border-softBorder">
                              {sp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-softBorder flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedPondId(pnd.id);
                          setShowWqModal(true);
                        }}
                        className="text-xs font-bold text-river hover:underline"
                      >
                        + জলের পরীক্ষা যোগ
                      </button>
                      <button
                        onClick={() => setActiveTab('aifish')}
                        className="text-xs font-bold text-forest hover:underline"
                      >
                        রোগবালাই সমাধান →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY PONDS */}
      {activeTab === 'ponds' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-forest-dark">পুকুর প্রোফাইল ও ইনভেন্টরি</h3>
              <p className="text-xs text-secondaryText">আয়তন, গভীরতা, স্টকিং তারিখ ও খাদ্য বাজেট ব্যবস্থাপনা</p>
            </div>
            <button
              onClick={handleOpenAddPond}
              className="btn-primary text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন পুকুর যোগ</span>
            </button>
          </div>

          {ponds.length === 0 ? (
            <EmptyState
              icon={Fish}
              title="কোনো নিবন্ধিত পুকুর নেই"
              description="আপনার মৎস্য খামারের আয়তন ও চাষকৃত প্রজাতি যুক্ত করে পুকুর ব্যবস্থাপনা শুরু করুন।"
              actionLabel="+ নতুন পুকুর যোগ করুন"
              onAction={handleOpenAddPond}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ponds.map((pnd) => (
                <div key={pnd.id} className="card-premium p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-forest-dark">{pnd.name}</h4>
                      <p className="text-xs text-secondaryText">আয়তন: {toBengaliDigits(pnd.sizeDecimal)} শতক • গভীরতা: {toBengaliDigits(pnd.depthFeet)} ফুট</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEditPond(pnd)}
                        className="p-1.5 text-secondaryText hover:text-river hover:bg-blue-50 rounded-lg transition"
                        title="পুকুরের তথ্য সম্পাদনা করুন"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetPondId(pnd.id)}
                        className="p-1.5 text-secondaryText hover:text-status-error hover:bg-red-50 rounded-lg transition"
                        title="পুকুর মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-rice/60 space-y-1.5 text-xs">
                    <p><span className="text-secondaryText">চাষ পদ্ধতি:</span> <strong className="text-primaryText">{pnd.farmingType === 'polyculture' ? 'কার্প জাতীয় মিশ্র চাষ' : 'মনোসেক্স একক চাষ'}</strong></p>
                    <p><span className="text-secondaryText">স্টকিং তারিখ:</span> <span className="font-semibold">{toBengaliDigits(pnd.stockingDate)}</span></p>
                    <p><span className="text-secondaryText">আনুমানিক বিনিয়োগ:</span> <span className="font-bold text-forest">{formatCurrency(pnd.budget, language)}</span></p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-softBorder text-xs">
                    <span className="text-[11px] text-mutedText">আপডেট: {pnd.lastUpdated}</span>
                    <button
                      onClick={() => {
                        setSelectedPondId(pnd.id);
                        setShowWqModal(true);
                      }}
                      className="font-bold text-river hover:underline"
                    >
                      জলের টেস্ট ইনপুট দিন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WATER QUALITY TRACKING */}
      {activeTab === 'water' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-forest-dark">জলের রাসায়নিক ও শারীরিক গুণমান রেকর্ড</h3>
              <p className="text-xs text-secondaryText">pH, অ্যামোনিয়া (NH3), দ্রবীভূত অক্সিজেন (DO) ও তাপমাত্রা নিরীক্ষা</p>
            </div>
            <button
              onClick={() => setShowWqModal(true)}
              className="btn-secondary text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন টেস্ট এন্ট্রি</span>
            </button>
          </div>

          {/* Reference Safe Range Guide Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-softBorder text-xs">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <span className="font-bold text-emerald-900 block">pH নিরাপদ রেঞ্জ: ৬.৫ - ৮.৫</span>
              <p className="text-[11px] text-emerald-800 mt-0.5">৬.৫ এর নিচে জল অম্লীয় হয় (চুন দিন); ৮.৫ এর বেশি ক্ষারীয়।</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
              <span className="font-bold text-blue-900 block">DO (অক্সিজেন): &gt; ৫.০ mg/L</span>
              <p className="text-[11px] text-blue-800 mt-0.5">ভোরবেলা ৩.০ এর নিচে নামলে মাছ ভেসে খাবি খায়।</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
              <span className="font-bold text-amber-900 block">অ্যামোনিয়া (NH3): &lt; ০.০৫ ppm</span>
              <p className="text-[11px] text-amber-800 mt-0.5">০.০৮ এর বেশি হলে খাদ্য গ্রহণ বন্ধ ও মাছের ফুলকা নষ্ট হয়।</p>
            </div>
          </div>

          {waterQualityRecords.length === 0 ? (
            <EmptyState
              icon={Droplets}
              title="জলের কোনো পরীক্ষার রেকর্ড নেই"
              description="জলের pH, অক্সিজেন এবং অ্যামোনিয়া মাত্রা পরীক্ষা করে রেকর্ড রাখুন।"
              actionLabel="+ টেস্ট রেকর্ড করুন"
              onAction={() => setShowWqModal(true)}
            />
          ) : (
            <div className="space-y-3">
              {waterQualityRecords.map((rec) => (
                <div key={rec.id} className="card-premium p-4.5 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-softBorder">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-forest-dark text-sm">
                        {ponds.find(p => p.id === rec.pondId)?.name || 'পুকুর রেকর্ড'}
                      </span>
                      <StatusBadge status={rec.status} size="sm" />
                    </div>
                    <span className="text-[11px] text-mutedText">রেকর্ডের সময়: {rec.recordedDate}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-rice">
                      <span className="text-[10px] text-secondaryText block">pH মাত্রা</span>
                      <span className="font-bold text-forest text-sm">{toBengaliDigits(rec.ph)}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-rice">
                      <span className="text-[10px] text-secondaryText block">অ্যামোনিয়া (NH3)</span>
                      <span className={`font-bold text-sm ${rec.ammoniaPpm > 0.05 ? 'text-status-error' : 'text-forest'}`}>
                        {toBengaliDigits(rec.ammoniaPpm)} ppm
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-rice">
                      <span className="text-[10px] text-secondaryText block">অক্সিজেন (DO)</span>
                      <span className={`font-bold text-sm ${rec.dissolvedOxygenMgL < 4.0 ? 'text-status-error' : 'text-forest'}`}>
                        {toBengaliDigits(rec.dissolvedOxygenMgL)} mg/L
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-rice">
                      <span className="text-[10px] text-secondaryText block">তাপমাত্রা</span>
                      <span className="font-bold text-primaryText text-sm">{toBengaliDigits(rec.temperatureC)} °C</span>
                    </div>
                    <div className="p-2 rounded-xl bg-rice">
                      <span className="text-[10px] text-secondaryText block">স্বচ্ছতা (সেকি ডিস্ক)</span>
                      <span className="font-bold text-primaryText text-sm">{toBengaliDigits(rec.transparencyCm)} সেমি</span>
                    </div>
                  </div>

                  {rec.recommendations && rec.recommendations.length > 0 && (
                    <div className="p-3 rounded-xl bg-warmWhite border border-softBorder text-[11px] text-secondaryText space-y-1">
                      <strong className="text-forest-dark block">বিশেষজ্ঞ সুপারিশ:</strong>
                      {rec.recommendations.map((rc, i) => (
                        <p key={i}>• {rc}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: INTERACTIVE STOCKING DENSITY GUIDE (PRD Part 9.2) */}
      {activeTab === 'stocking' && (
        <div className="space-y-6">
          <div className="card-premium p-5 space-y-5">
            <div>
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-river" />
                <h3 className="text-base font-bold text-forest-dark">
                  বিজ্ঞানসম্মত পোনা মজুত ঘনত্ব ও প্রজাতি অনুপাত ক্যালকুলেটর
                </h3>
              </div>
              <p className="text-xs text-secondaryText mt-1 leading-relaxed">
                বাংলাদেশ মৎস্য গবেষণা ইনস্টিটিউট (BFRI) ও মৎস্য অধিদপ্তর নির্দেশিত ৩-স্তর বিশিষ্ট কার্প মিশ্র চাষ এবং তেলাপিয়া মজুত ঘনত্ব হিসাব।
              </p>
            </div>

            {/* Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-warmWhite border border-softBorder text-xs">
              <div>
                <label className="block font-bold text-primaryText mb-1">পুকুরের আয়তন (শতাংশ / শতক) *</label>
                <input
                  type="number"
                  min="5"
                  max="1000"
                  value={stockingPondSize}
                  onChange={(e) => setStockingPondSize(Number(e.target.value))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-bold text-primaryText mb-1">চাষের ধরন নির্বাচন করুন *</label>
                <select
                  value={stockingFarmingType}
                  onChange={(e) => setStockingFarmingType(e.target.value as any)}
                  className="input-field"
                >
                  <option value="carp_polyculture">৩-স্তর কার্প মিশ্র চাষ (Surface + Column + Bottom)</option>
                  <option value="monosex_tilapia">উন্নত মনোসেক্স তেলাপিয়া নিবিড় চাষ</option>
                  <option value="pangasius">বাণিজ্যিক পাঙ্গাশ ও কার্প সহাবস্থান</option>
                </select>
              </div>
            </div>

            {/* Calculated Recommended Breakdown */}
            {stockingFarmingType === 'carp_polyculture' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Surface Feeders */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-900">উপরের স্তর (Surface)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 font-bold">৩৫% অনুপাত</span>
                    </div>
                    <p className="text-xs text-secondaryText">প্রজাতি: কাতলা, সিলভার কার্প ও বিগহেড</p>
                    <p className="text-2xl font-black text-blue-900">
                      {toBengaliDigits(Math.round(stockingPondSize * 14))} <span className="text-xs font-normal">টি পোনা</span>
                    </p>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      জলের উপরের প্লাঙ্কটন খেয়ে বাঁচে। সিলভার কার্প প্রতি শতকে ৬-৮টি, কাতলা ৫-৬টি।
                    </p>
                  </div>

                  {/* Column Feeders */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-900">মধ্যম স্তর (Column)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">৩০% অনুপাত</span>
                    </div>
                    <p className="text-xs text-secondaryText">প্রজাতি: রুই ও গ্রাস কার্প</p>
                    <p className="text-2xl font-black text-emerald-900">
                      {toBengaliDigits(Math.round(stockingPondSize * 12))} <span className="text-xs font-normal">টি পোনা</span>
                    </p>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      জলের মাঝখানের স্তরের খাবার ও জলজ উদ্ভিদ গ্রহণ করে। রুই প্রতি শতকে ৮-১০টি।
                    </p>
                  </div>

                  {/* Bottom Feeders */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-900">তলদেশের স্তর (Bottom)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">৩৫% অনুপাত</span>
                    </div>
                    <p className="text-xs text-secondaryText">প্রজাতি: মৃগেল, কালবাউশ ও কার্পিও</p>
                    <p className="text-2xl font-black text-amber-900">
                      {toBengaliDigits(Math.round(stockingPondSize * 14))} <span className="text-xs font-normal">টি পোনা</span>
                    </p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      পুকুরের তলদেশের জৈব বর্জ্য ও ডেব্রিটাস পরিষ্কার করে পুকুর সুস্থ রাখে।
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-forest-50 border border-forest/20 text-xs text-forest-dark flex items-center justify-between">
                  <div>
                    <span className="font-bold block">মোট সর্বমোট অনুমোদিত পোনা মজুত:</span>
                    <span>{toBengaliDigits(stockingPondSize)} শতক পুকুরের জন্য মোট {toBengaliDigits(Math.round(stockingPondSize * 40))} টি সুস্থ পোনা (আঙ্গুলিপোনা সাইজ ৩-৪ ইঞ্চি)</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('hatcheries')}
                    className="btn-primary text-xs shrink-0"
                  >
                    সার্টিফাইড হ্যাচারি খুঁজুন →
                  </button>
                </div>
              </div>
            )}

            {stockingFarmingType === 'monosex_tilapia' && (
              <div className="p-5 rounded-2xl bg-warmWhite border border-softBorder space-y-3 text-xs">
                <h4 className="font-bold text-forest-dark text-sm">মনোসেক্স তেলাপিয়া মজুত নির্দেশিকা</h4>
                <p className="text-secondaryText leading-relaxed">
                  প্রতি শতকে ২০০ থেকে ২৫০টি মানসম্মত মনোসেক্স তেলাপিয়ার পোনা মজুত করা যায় (এয়ারেটর থাকলে ৩০০ পর্যন্ত)। 
                  আপনার {toBengaliDigits(stockingPondSize)} শতক পুকুরে মোট <strong>{toBengaliDigits(stockingPondSize * 220)}</strong> টি পোনা প্রয়োজন।
                </p>
                <div className="p-3 rounded-xl bg-blue-50 text-river-dark border border-blue-200">
                  ⚠️ <strong>সতর্কতা:</strong> তেলাপিয়ার ক্ষেত্রে সঠিক জেন্ডার রিভার্সড (৯৮%+ পুরুষ) পোনা নিশ্চিত করতে অনুমোদিত হ্যাচারি থেকে পোনা সংগ্রহ করুন।
                </div>
              </div>
            )}

            {stockingFarmingType === 'pangasius' && (
              <div className="p-5 rounded-2xl bg-warmWhite border border-softBorder space-y-3 text-xs">
                <h4 className="font-bold text-forest-dark text-sm">বাণিজ্যিক পাঙ্গাশ মজুত নির্দেশিকা</h4>
                <p className="text-secondaryText leading-relaxed">
                  প্রতি শতকে ১৫০ থেকে ২০০টি পাঙ্গাশ পোনার সাথে উপরের স্তরের জন্য ১০টি সিলভার কার্প ও তলার জন্য ৫টি কার্পিও দেওয়া স্বাস্থ্যকর।
                  আপনার {toBengaliDigits(stockingPondSize)} শতক পুকুরে মোট <strong>{toBengaliDigits(stockingPondSize * 160)}</strong> টি পাঙ্গাশ পোনা সুপারিশকৃত।
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: HATCHERY DIRECTORY */}
      {activeTab === 'hatcheries' && (
        <div className="space-y-4">
          <div className="card-premium p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-mutedText" />
              <input
                type="text"
                placeholder="হ্যাচারির নাম বা মাছের প্রজাতি দিয়ে খুঁজুন..."
                value={hatcherySearch}
                onChange={(e) => setHatcherySearch(e.target.value)}
                className="input-field pl-9"
              />
            </div>

            <select
              value={hatcheryDistrict}
              onChange={(e) => setHatcheryDistrict(e.target.value)}
              className="input-field sm:w-48"
            >
              <option value="All">সকল জেলা</option>
              <option value="Mymensingh">ময়মনসিংহ</option>
              <option value="Jashore">যশোর</option>
              <option value="Bogura">বগুড়া</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredHatcheries.map((htc) => (
              <div key={htc.id} className="card-premium p-5 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-forest-dark">{htc.hatcheryName}</h4>
                      <p className="text-xs text-secondaryText flex items-center mt-1">
                        <MapPin className="w-3.5 h-3.5 text-mutedText mr-1" />
                        {htc.upazila}, {htc.district}
                      </p>
                    </div>
                    {htc.verified && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        BFRI সার্টিফাইড
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-softBorder text-xs space-y-1.5 text-secondaryText">
                    <p><span className="text-mutedText">মালিক / ম্যানেজার:</span> <strong className="text-primaryText">{htc.ownerName}</strong></p>
                    <div>
                      <span className="text-mutedText block mb-1">উপলব্ধ পোনা ও দর:</span>
                      <div className="space-y-1">
                        {htc.species.map((sp, idx) => (
                          <div key={idx} className="flex justify-between p-1.5 rounded-lg bg-rice text-[11px]">
                            <span className="font-semibold text-primaryText">{sp.name} ({sp.sizeInch})</span>
                            <span className="font-bold text-forest">৳{toBengaliDigits(sp.pricePerThousand)}/হাজার</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="font-mono text-primaryText flex items-center pt-1">
                      <Phone className="w-3 h-3 text-mutedText mr-1" />
                      {htc.phone}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-softBorder flex items-center justify-between">
                  <span className="text-[11px] text-mutedText font-semibold">রেটিং: ★ {toBengaliDigits(htc.rating)} ({toBengaliDigits(htc.reviewsCount)})</span>
                  <a
                    href={`tel:${htc.phone}`}
                    className="btn-clay text-xs py-1.5 px-3"
                  >
                    সরাসরি কল করুন
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: AI FISHERIES ASSISTANT */}
      {activeTab === 'aifish' && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-softBorder shadow-2xs overflow-hidden flex flex-col h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-river to-river-dark text-white p-4 flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="text-sm font-bold">এআই মৎস্য সহকারী (AI Fisheries Advisor)</h3>
              <p className="text-[11px] text-blue-100">মাছের ভাসমান খাবি খাওয়া, ফুলকা পচা বা জল বিষাক্ত হওয়ার প্রাথমিক সমাধান</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-rice/30">
            {fishChat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs whitespace-pre-line leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-river text-white rounded-br-xs'
                      : msg.alert
                      ? 'bg-red-50 border border-status-error text-status-error rounded-bl-xs font-medium'
                      : 'bg-white border border-softBorder text-primaryText rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}

                  {msg.alert && (
                    <div className="mt-3 pt-2 border-t border-status-error/30 flex justify-end">
                      <button
                        onClick={() => setActiveTab('specialist')}
                        className="px-3 py-1.5 rounded-lg bg-status-error text-white font-bold text-xs hover:bg-red-700 transition"
                      >
                        🚨 মৎস্য বিশেষজ্ঞকে কল করুন
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendFishAI} className="p-3 bg-white border-t border-softBorder flex items-center space-x-2">
            <input
              type="text"
              placeholder="পুকুরের লক্ষণ লিখুন (যেমন: ভোরে মাছ ভেসে খাবি খাচ্ছে বা ফুলকায় লাল ঘা)..."
              value={fishInput}
              onChange={(e) => setFishInput(e.target.value)}
              className="flex-1 input-field"
            />
            <button
              type="submit"
              className="btn-clay text-xs shrink-0"
            >
              পাঠান
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: SPECIALIST BOOKING */}
      {activeTab === 'specialist' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center space-x-2 text-xs text-river-dark">
            <Info className="w-4 h-4 text-river shrink-0" />
            <span>বাংলাদেশ কৃষি বিশ্ববিদ্যালয় (BAU) ও মৎস্য অধিদপ্তর সার্টিফাইড বিজ্ঞানীদের সাথে সরাসরি অডিও/ভিডিও টেলিকনসালটেশন।</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experts.filter(e => e.category === 'fisheries').map((exp) => (
              <div key={exp.id} className="card-premium p-5 flex items-start space-x-4">
                <img src={exp.avatarUrl} alt={exp.name} className="w-16 h-16 rounded-2xl object-cover border border-softBorder shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-forest-dark">{exp.nameBn}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">ভেরিফাইড</span>
                  </div>
                  <p className="text-xs text-secondaryText font-medium mt-0.5">{exp.designationBn}</p>
                  <p className="text-[11px] text-mutedText mt-1 leading-relaxed">{exp.aboutBn}</p>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-softBorder">
                    <span className="text-xs font-bold text-river">ফি: ৳ {toBengaliDigits(exp.consultationFee)}</span>
                    <button
                      onClick={() => {
                        bookConsultation({
                          expertId: exp.id,
                          expertName: exp.nameBn,
                          category: 'fisheries',
                          farmerId: user.id,
                          farmerName: user.name,
                          farmerPhone: user.phone,
                          sector: 'fisheries',
                          topic: 'পুকুর ও মাছের রোগবালাই ব্যবস্থাপনা',
                          urgency: 'normal',
                          description: 'পুকুরের জলের গুণমান ও পোনা মৃত্যু রোধে বিশেষজ্ঞ সহায়তা',
                          preferredDate: new Date().toISOString().split('T')[0],
                          preferredTime: '04:00 PM'
                        });
                      }}
                      className="btn-primary text-xs"
                    >
                      পরামর্শ বুক করুন
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT POND */}
      <Modal
        isOpen={showPondModal}
        onClose={() => setShowPondModal(false)}
        title={editingPondId ? 'পুকুরের তথ্য সম্পাদনা করুন' : 'নতুন পুকুর যুক্ত করুন'}
        maxWidth="md"
      >
        <form onSubmit={handleSavePond} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-primaryText mb-1">পুকুরের নাম *</label>
            <input
              type="text"
              required
              placeholder="যেমন: আনন্দ মৎস্য খামার পুকুর-১"
              value={pondName}
              onChange={(e) => setPondName(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primaryText mb-1">আয়তন (শতক / শতাংশ)</label>
              <input
                type="number"
                value={pondSize}
                onChange={(e) => setPondSize(Number(e.target.value))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">গড় গভীরতা (ফুট)</label>
              <input
                type="number"
                step="0.5"
                value={pondDepth}
                onChange={(e) => setPondDepth(Number(e.target.value))}
                className="input-field"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primaryText mb-1">চাষের ধরন</label>
              <select
                value={farmingType}
                onChange={(e) => setFarmingType(e.target.value as any)}
                className="input-field"
              >
                <option value="polyculture">মিশ্র কার্প চাষ (Polyculture)</option>
                <option value="monoculture">একক চাষ (Monoculture)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">জলের প্রধান উৎস</label>
              <select
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                className="input-field"
              >
                <option value="Groundwater / Deep Tube-well">ভূগর্ভস্থ নলকূপ (Deep Tube-well)</option>
                <option value="River / Canal Canal">নদী বা খাল</option>
                <option value="Rainfed">বৃষ্টির জল (Rainfed)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-softBorder">
            <button
              type="button"
              onClick={() => setShowPondModal(false)}
              className="btn-secondary text-xs"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="btn-primary text-xs"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD WATER QUALITY */}
      <Modal
        isOpen={showWqModal}
        onClose={() => setShowWqModal(false)}
        title="জলের রাসায়নিক গুণমান পরীক্ষা এন্ট্রি"
        maxWidth="md"
      >
        <form onSubmit={handleSaveWaterQuality} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-primaryText mb-1">পুকুর নির্বাচন করুন *</label>
            <select
              value={selectedPondId}
              onChange={(e) => setSelectedPondId(e.target.value)}
              className="input-field"
            >
              {ponds.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({toBengaliDigits(p.sizeDecimal)} শতক)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primaryText mb-1">pH স্তর (নিরাপদ: ৬.৫ - ৮.৫)</label>
              <input
                type="number"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(Number(e.target.value))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">অ্যামোনিয়া (ppm, নিরাপদ: &lt; ০.০৫)</label>
              <input
                type="number"
                step="0.01"
                value={ammonia}
                onChange={(e) => setAmmonia(Number(e.target.value))}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-primaryText mb-1">অক্সিজেন (DO mg/L)</label>
              <input
                type="number"
                step="0.1"
                value={dissolvedOxygen}
                onChange={(e) => setDissolvedOxygen(Number(e.target.value))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">তাপমাত্রা (°C)</label>
              <input
                type="number"
                step="0.5"
                value={tempC}
                onChange={(e) => setTempC(Number(e.target.value))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">স্বচ্ছতা (সেমি)</label>
              <input
                type="number"
                value={transparency}
                onChange={(e) => setTransparency(Number(e.target.value))}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-softBorder">
            <button
              type="button"
              onClick={() => setShowWqModal(false)}
              className="btn-secondary text-xs"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="btn-primary text-xs"
            >
              রেকর্ড সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE POND */}
      <ConfirmDialog
        isOpen={deleteTargetPondId !== null}
        title="পুকুর মুছে ফেলবেন?"
        message="এই পুকুর মুছে ফেললে এর সাথে সম্পর্কিত সকল জলের টেস্ট হিস্ট্রি মুছে যাবে। আপনি কি নিশ্চিত?"
        onConfirm={() => {
          if (deleteTargetPondId) deletePond(deleteTargetPondId);
          setDeleteTargetPondId(null);
        }}
        onCancel={() => setDeleteTargetPondId(null)}
      />

    </div>
  );
};
