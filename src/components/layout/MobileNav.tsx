import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Sprout, 
  Beef, 
  Fish, 
  ShoppingBag, 
  Menu, 
  X, 
  TrendingUp, 
  Stethoscope, 
  ShieldCheck, 
  User,
  Sparkles,
  MapPin,
  UserCheck,
  Wifi,
  WifiOff,
  RotateCcw,
  Globe,
  LogIn,
  LogOut,
  Bot
} from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isDrawerOpen?: boolean;
  onCloseDrawer?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ 
  currentTab, 
  onSelectTab,
  isDrawerOpen: externalDrawerOpen,
  onCloseDrawer
}) => {
  const { 
    language, 
    setLanguage,
    activeRole, 
    user, 
    inquiries, 
    orders, 
    isOffline,
    setIsOffline,
    resetAllData,
    setShowPhase2Modal,
    logout
  } = useApp();
  
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false);

  const drawerOpen = externalDrawerOpen !== undefined ? externalDrawerOpen : internalDrawerOpen;
  const setDrawerOpen = (open: boolean) => {
    if (onCloseDrawer && !open) onCloseDrawer();
    setInternalDrawerOpen(open);
  };

  const pendingCount = inquiries.filter(i => i.status === 'pending' || i.status === 'countered').length + 
                       orders.filter(o => o.status === 'accepted' || o.status === 'ready_for_pickup').length;

  const handleNav = (tab: string) => {
    onSelectTab(tab);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Bottom Sticky Tab Bar for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-softBorder shadow-lg px-1 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex items-center justify-around">
        <button
          onClick={() => handleNav('dashboard')}
          className={`flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1 rounded-xl active:scale-95 transition ${
            currentTab === 'dashboard' ? 'text-forest font-bold bg-forest/10' : 'text-secondaryText hover:text-primaryText'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 leading-none">{language === 'bn' ? 'হোম' : 'Home'}</span>
        </button>

        <button
          onClick={() => handleNav('agriculture')}
          className={`flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1 rounded-xl active:scale-95 transition ${
            currentTab === 'agriculture' ? 'text-forest font-bold bg-forest/10' : 'text-secondaryText hover:text-primaryText'
          }`}
        >
          <Sprout className="w-5 h-5 text-forest-leaf" />
          <span className="text-[10px] mt-0.5 leading-none">{language === 'bn' ? 'কৃষি' : 'Agri'}</span>
        </button>

        <button
          onClick={() => handleNav('livestock')}
          className={`flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1 rounded-xl active:scale-95 transition ${
            currentTab === 'livestock' ? 'text-forest font-bold bg-forest/10' : 'text-secondaryText hover:text-primaryText'
          }`}
        >
          <Beef className="w-5 h-5 text-clay" />
          <span className="text-[10px] mt-0.5 leading-none">{language === 'bn' ? 'খামারি' : 'Livestock'}</span>
        </button>

        <button
          onClick={() => handleNav('fisheries')}
          className={`flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1 rounded-xl active:scale-95 transition ${
            currentTab === 'fisheries' ? 'text-forest font-bold bg-forest/10' : 'text-secondaryText hover:text-primaryText'
          }`}
        >
          <Fish className="w-5 h-5 text-river" />
          <span className="text-[10px] mt-0.5 leading-none">{language === 'bn' ? 'মৎস্য' : 'Fish'}</span>
        </button>

        <button
          onClick={() => handleNav('marketplace')}
          className={`relative flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1 rounded-xl active:scale-95 transition ${
            currentTab === 'marketplace' ? 'text-forest font-bold bg-forest/10' : 'text-secondaryText hover:text-primaryText'
          }`}
        >
          <ShoppingBag className="w-5 h-5 text-clay-dark" />
          {pendingCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 bg-status-error rounded-full ring-2 ring-white" />
          )}
          <span className="text-[10px] mt-0.5 leading-none">{language === 'bn' ? 'বাজার' : 'Market'}</span>
        </button>

        <button
          onClick={() => setDrawerOpen(true)}
          className="flex-1 min-h-[50px] flex flex-col items-center justify-center py-1 px-1 rounded-xl text-secondaryText hover:text-forest active:scale-95 transition"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 leading-none">{language === 'bn' ? 'মেন্যু' : 'More'}</span>
        </button>
      </nav>

      {/* Slide-over Mobile Drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-forest-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
            <div className="w-screen max-w-xs bg-white shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-softBorder mb-3.5">
                  <button 
                    onClick={() => handleNav('dashboard')}
                    className="flex items-center space-x-2 text-left group focus:outline-none cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-forest flex items-center justify-center text-white shadow-xs">
                      <Sprout className="w-4 h-4 text-forest-leaf" />
                    </div>
                    <span className="font-extrabold text-lg text-forest-dark group-hover:text-forest transition">
                      Agro<span className="text-forest-leaf">Nex</span>
                    </span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-forest-light text-forest rounded font-bold border border-forest/20">
                      BD v2.0
                    </span>
                  </button>
                  <button 
                    onClick={() => setDrawerOpen(false)}
                    className="p-2 rounded-xl text-secondaryText hover:bg-rice active:scale-95 transition min-h-[40px] min-w-[40px] flex items-center justify-center"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User quick status in drawer */}
                <div className="p-3 mb-3.5 rounded-xl bg-rice border border-softBorder text-xs space-y-1">
                  <p className="font-bold text-forest-dark">{user.name}</p>
                  <p className="text-[11px] text-secondaryText flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-clay shrink-0" />
                    <span className="truncate">{user.village}, {user.upazila}, {user.district}</span>
                  </p>
                  <p className="text-[11px] text-mutedText flex items-center space-x-1">
                    <UserCheck className="w-3 h-3 text-forest shrink-0" />
                    <span>রোল: <strong>{activeRole}</strong></span>
                  </p>
                </div>

                {/* Drawer Menu Navigation */}
                <div className="space-y-1">
                  <button
                    onClick={() => handleNav('dashboard')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition min-h-[44px] ${
                      currentTab === 'dashboard' ? 'bg-forest text-white' : 'text-primaryText hover:bg-rice active:bg-rice'
                    }`}
                  >
                    <Home className="w-4 h-4 shrink-0" />
                    <span>{language === 'bn' ? 'মূল ড্যাশবোর্ড' : 'Home Dashboard'}</span>
                  </button>

                  <button
                    onClick={() => handleNav('prices')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition min-h-[44px] ${
                      currentTab === 'prices' ? 'bg-forest text-white' : 'text-primaryText hover:bg-rice active:bg-rice'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-harvest-dark shrink-0" />
                    <span>{language === 'bn' ? 'আঞ্চলিক পাইকারি ও খুচরা দর' : 'Regional Market Prices'}</span>
                  </button>

                  <button
                    onClick={() => handleNav('experts')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition min-h-[44px] ${
                      currentTab === 'experts' ? 'bg-forest text-white' : 'text-primaryText hover:bg-rice active:bg-rice'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 text-forest-leaf shrink-0" />
                    <span>{language === 'bn' ? 'বিশেষজ্ঞ পরামর্শ ও ভিডিও কল' : 'Expert Consultations'}</span>
                  </button>

                  {activeRole === 'agri_expert' && (
                    <button
                      onClick={() => handleNav('expert_dashboard')}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition min-h-[44px] ${
                        currentTab === 'expert_dashboard' ? 'bg-forest text-white' : 'text-primaryText hover:bg-rice active:bg-rice'
                      }`}
                    >
                      <Stethoscope className="w-4 h-4 text-river shrink-0" />
                      <span>{language === 'bn' ? 'ডাক্তার ওয়ার্কস্পেস (PRO)' : 'Doctor Workspace'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleNav('admin')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition min-h-[44px] ${
                      currentTab === 'admin' ? 'bg-forest text-white' : 'text-primaryText hover:bg-rice active:bg-rice'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-forest-dark shrink-0" />
                    <span>{language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Portal'}</span>
                  </button>

                  <button
                    onClick={() => handleNav('profile')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition min-h-[44px] ${
                      currentTab === 'profile' ? 'bg-forest text-white' : 'text-primaryText hover:bg-rice active:bg-rice'
                    }`}
                  >
                    <User className="w-4 h-4 text-secondaryText shrink-0" />
                    <span>{language === 'bn' ? 'প্রোফাইল ও বহুবিধ রোল সেটিংস' : 'Profile & Settings'}</span>
                  </button>
                </div>

                {/* Mobile Drawer Utilities */}
                <div className="pt-3 mt-3 border-t border-softBorder space-y-2">
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-rice text-xs">
                    <span className="font-semibold text-secondaryText flex items-center space-x-1.5">
                      <Globe className="w-3.5 h-3.5 text-forest" />
                      <span>{language === 'bn' ? 'ভাষা নির্বাচন' : 'Language'}</span>
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setLanguage('bn')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${language === 'bn' ? 'bg-forest text-white shadow-xs' : 'bg-white text-primaryText hover:bg-rice'}`}
                      >
                        বাংলা
                      </button>
                      <button
                        onClick={() => setLanguage('en')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${language === 'en' ? 'bg-forest text-white shadow-xs' : 'bg-white text-primaryText hover:bg-rice'}`}
                      >
                        EN
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOffline(!isOffline)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-rice hover:bg-warmWhite text-xs font-semibold text-primaryText transition"
                  >
                    <span className="flex items-center space-x-2">
                      {isOffline ? <WifiOff className="w-4 h-4 text-status-warning" /> : <Wifi className="w-4 h-4 text-status-success" />}
                      <span>{language === 'bn' ? 'সিমুলেটেড অফলাইন মোড' : 'Simulated Offline Mode'}</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isOffline ? 'bg-amber-100 text-status-warning' : 'bg-emerald-100 text-status-success'}`}>
                      {isOffline ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setDrawerOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-semibold text-status-error transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-status-error" />
                    <span>{language === 'bn' ? 'লগ আউট (Sign Out)' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-softBorder space-y-2">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    setShowPhase2Modal(true);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-forest/10 hover:bg-forest/15 active:bg-forest/20 text-forest-dark text-xs font-bold transition min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 text-harvest-dark" />
                  <span>{language === 'bn' ? 'পরবর্তী রূপরেখা (Phase 2 Roadmap)' : 'Phase 2 Roadmap'}</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(language === 'bn' ? 'সব ডেমো ডেটা রিসেট করবেন?' : 'Reset all demo data?')) {
                      resetAllData();
                      setDrawerOpen(false);
                    }
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 text-[11px] text-mutedText hover:text-status-error transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{language === 'bn' ? 'ডেমো ডেটা রিসেট করুন' : 'Reset Demo Data'}</span>
                </button>

                <p className="text-[10px] text-center text-mutedText">
                  AgroNex Bangladesh • PRD v2.0
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
