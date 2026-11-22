import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreateReminderModal } from '../../components/common/CreateReminderModal';
import { 
  Sprout, 
  Beef, 
  Fish, 
  ShoppingBag, 
  Plus, 
  Bot, 
  CalendarCheck, 
  Check, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  CloudRain, 
  ChevronRight,
  Clock,
  AlertTriangle,
  Sun
} from 'lucide-react';
import { formatCurrency, toBengaliDigits } from '../../utils/formatters';

interface HomeDashboardProps {
  onNavigate: (tab: string, subtab?: string) => void;
  onOpenChatbot?: (initialQuery?: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate, onOpenChatbot }) => {
  const { 
    language, 
    user, 
    listings, 
    reminders, 
    toggleReminderComplete 
  } = useApp();

  const [showReminderModal, setShowReminderModal] = useState(false);

  // Time-appropriate greeting
  const hour = new Date().getHours();
  const getGreeting = () => {
    if (language === 'bn') {
      if (hour < 12) return 'শুভ সকাল';
      if (hour < 16) return 'শুভ দুপুর';
      if (hour < 19) return 'শুভ বিকেল';
      return 'শুভ সন্ধ্যা';
    } else {
      if (hour < 12) return 'Good Morning';
      if (hour < 16) return 'Good Afternoon';
      if (hour < 19) return 'Good Evening';
      return 'Welcome';
    }
  };

  const todayStr = new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const pendingReminders = reminders.filter(r => !r.isCompleted);

  // Simulated compact weather for user's district
  const weather = {
    temp: 28,
    conditionBn: 'আংশিক মেঘলা',
    conditionEn: 'Partly Cloudy',
    humidity: 78,
    windKmh: 14,
    rainChance: 65,
    adviceBn: 'আগামী ৩৬ ঘণ্টায় বৃষ্টির সম্ভাবনা রয়েছে; সার ছিটানো স্থগিত রাখুন ও নিষ্কাশন নালা পরিষ্কার রাখুন।',
    adviceEn: 'Rain expected within 36 hours. Postpone top-dressing fertilizers and clear drainage ditches.'
  };

  // Published marketplace listings for preview (up to 4 items)
  const recentListings = listings.filter(l => l.status === 'published').slice(0, 4);

  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      {/* 1. WELCOME MESSAGE & USER LOCATION */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-softBorder shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs text-secondaryText mb-1">
            <span className="font-semibold text-forest">
              {getGreeting()},
            </span>
            <span>•</span>
            <span>{todayStr}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-forest-dark tracking-tight">
            {user.name}
          </h1>
          <div className="flex items-center space-x-1.5 text-xs text-secondaryText mt-1">
            <MapPin className="w-3.5 h-3.5 text-clay shrink-0" />
            <span className="font-medium">
              {user.village ? `${user.village}, ` : ''}{user.upazila}, {user.district}
            </span>
            {user.businessName && (
              <>
                <span className="text-mutedText hidden sm:inline">•</span>
                <span className="hidden sm:inline text-primaryText font-semibold">{user.businessName}</span>
              </>
            )}
          </div>
        </div>

        <div className="self-start sm:self-auto flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-forest-light text-forest font-bold text-xs border border-forest/20">
            {language === 'bn' ? 'সক্রিয় কৃষক প্রোফাইল' : 'Active Farmer Profile'}
          </span>
        </div>
      </div>

      {/* 2. COMPACT WEATHER INFORMATION */}
      <div className="bg-gradient-to-r from-forest-dark via-forest to-forest-800 text-white p-4 sm:p-5 rounded-2xl shadow-xs overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left: Temp & Condition */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
              <Sun className="w-6 h-6 text-harvest-light" />
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-black tracking-tight">
                  {language === 'bn' ? toBengaliDigits(weather.temp) : weather.temp}°C
                </span>
                <span className="text-xs sm:text-sm font-semibold text-rice/90">
                  {language === 'bn' ? weather.conditionBn : weather.conditionEn}
                </span>
              </div>
              <p className="text-[11px] text-rice/70 mt-0.5">
                {user.district} • {language === 'bn' ? 'আজকের আঞ্চলিক পূর্বাভাস' : "Today's regional forecast"}
              </p>
            </div>
          </div>

          {/* Center: Compact Micro Indicators */}
          <div className="grid grid-cols-3 gap-3 text-center border-t md:border-t-0 md:border-l border-white/15 pt-3 md:pt-0 md:pl-5">
            <div>
              <div className="flex items-center justify-center space-x-1 text-sky-200">
                <Droplets className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">
                  {language === 'bn' ? toBengaliDigits(weather.humidity) : weather.humidity}%
                </span>
              </div>
              <span className="text-[10px] text-rice/70 block mt-0.5">
                {language === 'bn' ? 'আর্দ্রতা' : 'Humidity'}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center space-x-1 text-forest-leaf">
                <Wind className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">
                  {language === 'bn' ? toBengaliDigits(weather.windKmh) : weather.windKmh} km/h
                </span>
              </div>
              <span className="text-[10px] text-rice/70 block mt-0.5">
                {language === 'bn' ? 'বাতাস' : 'Wind'}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center space-x-1 text-blue-200">
                <CloudRain className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">
                  {language === 'bn' ? toBengaliDigits(weather.rainChance) : weather.rainChance}%
                </span>
              </div>
              <span className="text-[10px] text-rice/70 block mt-0.5">
                {language === 'bn' ? 'বৃষ্টির সম্ভাবনা' : 'Rain'}
              </span>
            </div>
          </div>

        </div>

        {/* Compact Farming Advisory Line */}
        <div className="mt-3.5 pt-3 border-t border-white/15 flex items-start space-x-2 text-xs text-rice/90">
          <AlertTriangle className="w-4 h-4 text-harvest shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-harvest-light">{language === 'bn' ? 'পরামর্শ:' : 'Advisory:'}</strong>{' '}
            {language === 'bn' ? weather.adviceBn : weather.adviceEn}
          </p>
        </div>
      </div>

      {/* 3. FOUR CLEAR MODULE SHORTCUTS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-forest-dark uppercase tracking-wider">
            {language === 'bn' ? 'প্রধান সেবা ও মডিউল' : 'Core Agricultural Modules'}
          </h2>
          <span className="text-[11px] text-mutedText">
            {language === 'bn' ? 'প্রবেশ করতে যেকোনো মডিউলে চাপুন' : 'Select a module to manage'}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Agriculture */}
          <button
            onClick={() => onNavigate('agriculture')}
            className="card-premium p-4 sm:p-5 text-left hover:border-forest/50 transition-all duration-150 group active:scale-98 flex flex-col justify-between min-h-[110px] sm:min-h-[120px] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-forest-light text-forest flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sprout className="w-5 h-5 text-forest" />
              </div>
              <ChevronRight className="w-4 h-4 text-mutedText group-hover:text-forest group-hover:translate-x-0.5 transition" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-forest-dark mt-2 group-hover:text-forest transition">
                {language === 'bn' ? 'কৃষি ব্যবস্থাপনা' : 'Agriculture'}
              </h3>
              <p className="text-[11px] text-secondaryText mt-0.5">
                {language === 'bn' ? 'জমি প্লট, সার হিসাব ও রোগবালাই' : 'Crops, plots & fertilizer calculator'}
              </p>
            </div>
          </button>

          {/* Livestock */}
          <button
            onClick={() => onNavigate('livestock')}
            className="card-premium p-4 sm:p-5 text-left hover:border-clay/50 transition-all duration-150 group active:scale-98 flex flex-col justify-between min-h-[110px] sm:min-h-[120px] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-clay-light/70 text-clay-dark flex items-center justify-center group-hover:scale-105 transition-transform">
                <Beef className="w-5 h-5 text-clay" />
              </div>
              <ChevronRight className="w-4 h-4 text-mutedText group-hover:text-clay group-hover:translate-x-0.5 transition" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-forest-dark mt-2 group-hover:text-clay transition">
                {language === 'bn' ? 'পশু ও খামারি' : 'Livestock'}
              </h3>
              <p className="text-[11px] text-secondaryText mt-0.5">
                {language === 'bn' ? 'শেড, গবাদিপশু ও খাদ্য হিসাব' : 'Shed planning, feeding & health'}
              </p>
            </div>
          </button>

          {/* Fisheries */}
          <button
            onClick={() => onNavigate('fisheries')}
            className="card-premium p-4 sm:p-5 text-left hover:border-river/50 transition-all duration-150 group active:scale-98 flex flex-col justify-between min-h-[110px] sm:min-h-[120px] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-river-light text-river-dark flex items-center justify-center group-hover:scale-105 transition-transform">
                <Fish className="w-5 h-5 text-river" />
              </div>
              <ChevronRight className="w-4 h-4 text-mutedText group-hover:text-river group-hover:translate-x-0.5 transition" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-forest-dark mt-2 group-hover:text-river transition">
                {language === 'bn' ? 'মৎস্য চাষ' : 'Fisheries'}
              </h3>
              <p className="text-[11px] text-secondaryText mt-0.5">
                {language === 'bn' ? 'পুকুর, পানির মান ও ৩-স্তর মিশ্র চাষ' : 'Pond profiles & water telemetry'}
              </p>
            </div>
          </button>

          {/* Marketplace */}
          <button
            onClick={() => onNavigate('marketplace')}
            className="card-premium p-4 sm:p-5 text-left hover:border-harvest/50 transition-all duration-150 group active:scale-98 flex flex-col justify-between min-h-[110px] sm:min-h-[120px] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-harvest-light text-harvest-dark flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 text-harvest-dark" />
              </div>
              <ChevronRight className="w-4 h-4 text-mutedText group-hover:text-harvest-dark group-hover:translate-x-0.5 transition" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-forest-dark mt-2 group-hover:text-harvest-dark transition">
                {language === 'bn' ? 'কৃষি মার্কেটপ্লেস' : 'Marketplace'}
              </h3>
              <p className="text-[11px] text-secondaryText mt-0.5">
                {language === 'bn' ? 'সরাসরি পণ্য ক্রয়-বিক্রয় ও দরদাম' : 'Direct buying, selling & offers'}
              </p>
            </div>
          </button>

        </div>
      </div>

      {/* 4. TODAY'S TASKS & REMINDERS */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-softBorder shadow-2xs">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <CalendarCheck className="w-5 h-5 text-forest" />
            <h2 className="text-sm sm:text-base font-bold text-forest-dark">
              {language === 'bn' ? 'আজকের কাজ ও রিমাইন্ডার' : "Today's Tasks & Reminders"}
            </h2>
            {pendingReminders.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-status-warning border border-amber-200">
                {language === 'bn' ? `${toBengaliDigits(pendingReminders.length)} টি বাকি` : `${pendingReminders.length} pending`}
              </span>
            )}
          </div>

          <button
            onClick={() => setShowReminderModal(true)}
            className="px-3 py-1.5 rounded-xl bg-forest-light hover:bg-forest text-forest hover:text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'নতুন রিমাইন্ডার' : 'Add Task'}</span>
          </button>
        </div>

        {reminders.length === 0 ? (
          <div className="p-6 text-center text-secondaryText text-xs bg-rice/50 rounded-xl border border-dashed border-softBorder">
            {language === 'bn' 
              ? 'আজকের জন্য কোনো কাজ নির্ধারিত নেই। প্রয়োজনীয় কাজের জন্য নতুন রিমাইন্ডার তৈরি করুন।' 
              : 'No scheduled farming tasks for today. Click "Add Task" to create one.'}
          </div>
        ) : (
          <div className="space-y-2">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                onClick={() => toggleReminderComplete(rem.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  rem.isCompleted
                    ? 'bg-rice/50 border-softBorder text-mutedText opacity-75'
                    : 'bg-warmWhite border-softBorder text-primaryText hover:border-forest/40 shadow-2xs'
                }`}
                title={language === 'bn' ? 'সম্পন্ন করতে ক্লিক করুন' : 'Click to toggle completion'}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                    rem.isCompleted ? 'bg-forest border-forest text-white' : 'border-softBorder bg-white'
                  }`}>
                    {rem.isCompleted && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${rem.isCompleted ? 'line-through text-mutedText' : 'text-forest-dark'}`}>
                      {language === 'bn' ? rem.titleBn : rem.title}
                    </p>
                    <p className="text-[11px] text-secondaryText truncate mt-0.5">
                      {rem.entityName} {rem.stage ? `• ${rem.stage}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    rem.priority === 'high' 
                      ? 'bg-red-50 text-status-error border border-red-200' 
                      : 'bg-rice text-secondaryText'
                  }`}>
                    {rem.priority === 'high' ? (language === 'bn' ? 'জরুরি' : 'High') : (language === 'bn' ? 'সাধারণ' : 'Normal')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. SMALL MARKETPLACE PRODUCT PREVIEW */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-softBorder shadow-2xs">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-forest-dark flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-clay" />
              <span>{language === 'bn' ? 'মার্কেটপ্লেস পণ্য সমাহার' : 'Recent Produce in Marketplace'}</span>
            </h2>
            <p className="text-[11px] text-secondaryText mt-0.5">
              {language === 'bn' ? 'সরাসরি কৃষকদের কাছ থেকে কেনার জন্য যাচাইকৃত পণ্য' : 'Directly available from registered local farmers'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-bold text-forest hover:text-forest-dark hover:underline flex items-center space-x-1 cursor-pointer shrink-0"
          >
            <span>{language === 'bn' ? 'সব পণ্য দেখুন' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentListings.length === 0 ? (
          <div className="p-6 text-center text-secondaryText text-xs bg-rice/50 rounded-xl border border-dashed border-softBorder">
            {language === 'bn' ? 'বর্তমানে কোনো পণ্য প্রকাশিত নেই।' : 'No active marketplace listings.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentListings.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('marketplace')}
                className="p-3 rounded-xl border border-softBorder bg-warmWhite hover:border-forest/40 hover:bg-white transition cursor-pointer shadow-2xs flex flex-col justify-between group"
              >
                <div>
                  <div className="relative mb-2.5 rounded-lg overflow-hidden bg-rice aspect-video flex items-center justify-center">
                    {item.images && item.images.length > 0 ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.productName} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-mutedText" />
                    )}
                    <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-forest backdrop-blur-xs shadow-2xs">
                      {item.district}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-forest-dark group-hover:text-forest truncate">
                    {item.productName}
                  </h3>
                  <p className="text-[11px] text-secondaryText mt-0.5">
                    {language === 'bn' ? 'পরিমাণ:' : 'Qty:'} {language === 'bn' ? toBengaliDigits(item.quantity) : item.quantity} {item.unit}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-softBorder flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-mutedText block leading-tight">
                      {language === 'bn' ? 'দর:' : 'Price:'}
                    </span>
                    <span className="font-black text-forest">
                      {formatCurrency(item.pricePerUnit, language)} / {item.unit}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-forest group-hover:underline flex items-center">
                    {language === 'bn' ? 'দেখুন' : 'View'} →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE REMINDER MODAL */}
      <CreateReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
      />

    </div>
  );
};
