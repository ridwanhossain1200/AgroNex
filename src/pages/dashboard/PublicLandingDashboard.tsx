import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sprout, 
  Beef, 
  Fish, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  LogIn, 
  UserPlus, 
  TrendingUp, 
  CheckCircle2, 
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { formatCurrency, toBengaliDigits } from '../../utils/formatters';

interface PublicLandingDashboardProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const PublicLandingDashboard: React.FC<PublicLandingDashboardProps> = ({
  onOpenLogin,
  onOpenRegister
}) => {
  const { language, setLanguage, marketPrices } = useApp();

  return (
    <div className="min-h-screen bg-rice flex flex-col justify-between selection:bg-forest/20 selection:text-forest-dark antialiased">
      
      {/* 1. PUBLIC TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-softBorder shadow-2xs px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-forest flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-6 h-6 text-forest-leaf" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl tracking-tight text-forest-dark">
                  Agro<span className="text-forest-leaf">Nex</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-forest-light text-forest rounded-full border border-forest/20">
                  BD v2.0
                </span>
              </div>
              <p className="text-[11px] text-secondaryText hidden sm:block">
                {language === 'bn' ? 'সমন্বিত এগ্রো-টেক ও সরাসরি মার্কেটপ্লেস' : 'Integrated Agro-Tech & Direct Marketplace'}
              </p>
            </div>
          </div>

          {/* Right Controls: Language & Login Access */}
          <div className="flex items-center space-x-3">
            
            {/* Language Switcher */}
            <div className="flex items-center border border-softBorder rounded-xl bg-rice p-0.5">
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                  language === 'bn' ? 'bg-forest text-white shadow-xs' : 'text-secondaryText hover:text-primaryText'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                  language === 'en' ? 'bg-forest text-white shadow-xs' : 'text-secondaryText hover:text-primaryText'
                }`}
              >
                EN
              </button>
            </div>

            {/* Primary Login Button */}
            <button
              type="button"
              onClick={onOpenLogin}
              className="btn-primary py-2 px-4 text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <LogIn className="w-4 h-4 text-forest-leaf" />
              <span>{language === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN HERO SECTION */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-forest-dark via-forest to-forest-800 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-forest-leaf/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-harvest/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-forest-leaf border border-white/15 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'বাংলাদেশের আধুনিক কৃষি পোর্টাল' : 'Smart Agricultural Platform of Bangladesh'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {language === 'bn'
                ? 'কৃষি, খামার ও বাজার — এক সমন্বিত ডিজিটাল প্ল্যাটফর্মে'
                : 'Smart Farming, Livestock & Direct Trade in One Platform'}
            </h1>

            <p className="text-xs sm:text-base text-rice/85 leading-relaxed">
              {language === 'bn'
                ? 'বাংলাদেশের কৃষক, খামারি ও পাইকারি ব্যবসায়ীদের জন্য জাতীয় গবেষণা কাউন্সিল (BARC, BRRI, BLRI, BFRI) অনুমোদিত সুষম সার হিসাব, গবাদিপশু ব্যবস্থাপনা ও মধ্যস্বত্বভোগীহীন সরাসরি বাজার।'
                : 'Empowering Bangladeshi farmers, livestock owners, and wholesale traders with BARC fertilizer schedules, BLRI animal nutrition, BFRI fisheries guidance, and transparent direct marketplace.'}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-6 py-3.5 rounded-2xl bg-harvest-light hover:bg-harvest text-forest-dark font-extrabold text-sm sm:text-base transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
              >
                <LogIn className="w-4 h-4 text-forest-dark" />
                <span>{language === 'bn' ? 'লগইন করে ড্যাশবোর্ডে প্রবেশ করুন' : 'Sign In to Access Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenRegister}
                className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/20 text-white border border-white/25 font-bold text-sm transition flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
              >
                <UserPlus className="w-4 h-4 text-forest-leaf" />
                <span>{language === 'bn' ? 'বিনামূল্যে অ্যাকাউন্ট নিবন্ধন' : 'Register Free Account'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. FOUR CORE MODULE PILLARS */}
        <div className="space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-lg sm:text-2xl font-black text-forest-dark">
              {language === 'bn' ? 'প্ল্যাটফর্মের ৪টি প্রধান কৃষি স্তম্ভ' : 'Four Core Agricultural Pillars'}
            </h2>
            <p className="text-xs sm:text-sm text-secondaryText">
              {language === 'bn' ? 'লগইন করার পর প্রতিটি মডিউল সম্পূর্ণ কার্যকরীভাবে ব্যবহার করা যাবে' : 'Sign in to access and manage your private farm records'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Agriculture */}
            <div className="p-5 rounded-2xl bg-white border border-softBorder shadow-2xs space-y-3">
              <div className="w-11 h-11 rounded-xl bg-forest-light text-forest flex items-center justify-center">
                <Sprout className="w-6 h-6 text-forest" />
              </div>
              <h3 className="font-bold text-base text-forest-dark">
                {language === 'bn' ? '১. ফসল ও জমি ব্যবস্থাপনা' : '1. Crop & Soil Care'}
              </h3>
              <p className="text-xs text-secondaryText leading-relaxed">
                {language === 'bn'
                  ? 'বিএআরসি অনুমোদিত সুষম সার হিসাব, সেচ ড্রেন পরিকল্পনা ও ফসলের বালাই দমন।'
                  : 'BARC recommended balanced nutrient calculation, split schedules, and pest diagnostics.'}
              </p>
            </div>

            {/* 2. Livestock */}
            <div className="p-5 rounded-2xl bg-white border border-softBorder shadow-2xs space-y-3">
              <div className="w-11 h-11 rounded-xl bg-clay-light/70 text-clay-dark flex items-center justify-center">
                <Beef className="w-6 h-6 text-clay" />
              </div>
              <h3 className="font-bold text-base text-forest-dark">
                {language === 'bn' ? '২. গবাদিপশু ও খামারি' : '2. Livestock & Vet'}
              </h3>
              <p className="text-xs text-secondaryText leading-relaxed">
                {language === 'bn'
                  ? 'গরু মোটাতাজাকরণ ইউএমএস ফর্মুলা, এফসিআর ট্র্যাকিং, টিকা শিডিউল ও ওলান প্রদাহ প্রতিরোধ।'
                  : 'UMS feed recipes, FCR ratio optimization, vaccination calendar, and disease prevention.'}
              </p>
            </div>

            {/* 3. Fisheries */}
            <div className="p-5 rounded-2xl bg-white border border-softBorder shadow-2xs space-y-3">
              <div className="w-11 h-11 rounded-xl bg-river-light text-river-dark flex items-center justify-center">
                <Fish className="w-6 h-6 text-river" />
              </div>
              <h3 className="font-bold text-base text-forest-dark">
                {language === 'bn' ? '৩. মৎস্য চাষ হাব' : '3. Fisheries Hub'}
              </h3>
              <p className="text-xs text-secondaryText leading-relaxed">
                {language === 'bn'
                  ? '৩-স্তর বিশিষ্ট কার্প পলিকালচার পোনা মজুত, অক্সিজেন জরুরি প্রতিকার ও পানি শোধন।'
                  : '3-tier carp polyculture stocking density, dissolved oxygen crisis protocols, and pH management.'}
              </p>
            </div>

            {/* 4. Marketplace */}
            <div className="p-5 rounded-2xl bg-white border border-softBorder shadow-2xs space-y-3">
              <div className="w-11 h-11 rounded-xl bg-harvest-light text-harvest-dark flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-harvest-dark" />
              </div>
              <h3 className="font-bold text-base text-forest-dark">
                {language === 'bn' ? '৪. সরাসরি কৃষি মার্কেটপ্লেস' : '4. Direct Marketplace'}
              </h3>
              <p className="text-xs text-secondaryText leading-relaxed">
                {language === 'bn'
                  ? 'পাইকারি আড়তদার ও ক্রেতাদের সাথে সরাসরি দরদাম, অর্ডার রসিদ ও মধ্যস্বত্বভোগীহীন ব্যবসা।'
                  : 'Direct negotiation with wholesale aratdars, transparent bidding, and certified orders.'}
              </p>
            </div>

          </div>
        </div>

        {/* 4. PUBLIC BENCHMARK MARKET PRICES REFERENCE */}
        <div className="bg-white rounded-2xl border border-softBorder shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-softBorder pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-forest-dark flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-harvest-dark" />
                <span>{language === 'bn' ? 'আজকের আঞ্চলিক পাইকারি বাজারদর (পাবলিক রেফারেন্স)' : "Today's Regional Wholesale Rates (Public Reference)"}</span>
              </h2>
              <p className="text-xs text-secondaryText mt-0.5">
                {language === 'bn' ? 'কৃষি বিপণন অধিদপ্তর ও প্রধান আঞ্চলিক আড়তসমূহ থেকে সংগৃহীত' : 'Sourced from Department of Agricultural Marketing (DAM) Regional Hubs'}
              </p>
            </div>
            
            <button
              type="button"
              onClick={onOpenLogin}
              className="text-xs font-bold text-forest hover:text-forest-dark hover:underline flex items-center space-x-1"
            >
              <span>{language === 'bn' ? 'সম্পূর্ণ বাজারদর দেখতে লগইন করুন' : 'Sign In for Full Price Analytics'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {marketPrices.slice(0, 6).map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl border border-softBorder bg-warmWhite flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-forest-dark">
                    {language === 'bn' ? item.productBn : item.product}
                  </h4>
                  <p className="text-[11px] text-mutedText mt-0.5">
                    {item.district} • {item.marketLocation}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-secondaryText block">পাইকারি দর</span>
                  <span className="font-black text-forest text-xs sm:text-sm">
                    {formatCurrency(item.wholesalePrice, language)} / {item.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. ACCESS BANNER */}
        <div className="p-6 rounded-2xl bg-forest-50 border border-forest/20 text-center space-y-3">
          <ShieldCheck className="w-8 h-8 text-forest mx-auto" />
          <h3 className="text-base sm:text-lg font-bold text-forest-dark">
            {language === 'bn' ? 'আপনার কৃষি খামারকে ডিজিটাল করুন' : 'Digitize Your Farm Operations'}
          </h3>
          <p className="text-xs sm:text-sm text-secondaryText max-w-xl mx-auto">
            {language === 'bn'
              ? 'লগইন করে আপনার নিজস্ব জমির খতিয়ান, সার হিসাব, গবাদিপশু ও মৎস্য পুকুর সংরক্ষণ করুন।'
              : 'Sign in to record your private land parcels, fertilizer formulas, animals, and pond telemetry.'}
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={onOpenLogin}
              className="btn-primary py-2.5 px-6 text-sm font-bold shadow-xs cursor-pointer active:scale-95"
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              <span>{language === 'bn' ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'Sign In to Dashboard'}</span>
            </button>
          </div>
        </div>

      </main>

      {/* 6. PUBLIC FOOTER */}
      <footer className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 border-t border-softBorder text-[11px] text-mutedText flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          © 2026 AgroNex Bangladesh. {language === 'bn' ? 'সকল অধিকার সংরক্ষিত।' : 'All rights reserved.'}
        </p>
        <div className="flex items-center space-x-4">
          <span className="hover:text-primaryText cursor-pointer">{language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</span>
          <span>•</span>
          <span className="hover:text-primaryText cursor-pointer">{language === 'bn' ? 'শর্তাবলী' : 'Terms of Service'}</span>
          <span>•</span>
          <span className="hover:text-primaryText cursor-pointer flex items-center space-x-1">
            <PhoneCall className="w-3 h-3 text-forest" />
            <span>{language === 'bn' ? 'কৃষি কল সেন্টার (১৬১২৩)' : 'Agri Call Center (16123)'}</span>
          </span>
        </div>
      </footer>

    </div>
  );
};
