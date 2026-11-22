import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  MapPin, 
  UserCheck, 
  Check, 
  Sprout, 
  Beef,
  Fish,
  ShoppingBag,
  TrendingUp,
  Stethoscope,
  ShieldCheck,
  Wifi, 
  WifiOff, 
  RotateCcw,
  Sparkles,
  Menu,
  ChevronDown,
  LogOut,
  LogIn,
  User,
  Bot
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onSelectTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu, onSelectTab }) => {
  const { 
    language, 
    setLanguage, 
    user, 
    activeRole, 
    setActiveRole, 
    notifications, 
    markAllNotificationsRead,
    markNotificationRead,
    isOffline,
    setIsOffline,
    setShowPhase2Modal,
    resetAllData,
    isAuthenticated,
    logout
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const rolesList: { role: UserRole; labelBn: string; labelEn: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { role: 'agri_farmer', labelBn: 'কৃষি কৃষক (Agri Farmer)', labelEn: 'Agri Farmer', icon: Sprout },
    { role: 'livestock_farmer', labelBn: 'পশুপালক / খামারি', labelEn: 'Livestock Farmer', icon: Beef },
    { role: 'fish_farmer', labelBn: 'মৎস্য চাষী (Fish Farmer)', labelEn: 'Fish Farmer', icon: Fish },
    { role: 'marketplace_seller', labelBn: 'মার্কেটপ্লেস বিক্রেতা (Seller)', labelEn: 'Marketplace Seller', icon: ShoppingBag },
    { role: 'wholesale_buyer', labelBn: 'পাইকারি ক্রেতা / আড়তদার', labelEn: 'Wholesale Buyer / Aratdar', icon: TrendingUp },
    { role: 'agri_expert', labelBn: 'কৃষি / পশু বিশেষজ্ঞ (Expert)', labelEn: 'Agri / Vet Expert', icon: Stethoscope },
    { role: 'admin', labelBn: 'সিস্টেম অ্যাডমিন (Admin)', labelEn: 'Platform Admin', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-softBorder shadow-2xs px-4 lg:px-8 py-2.5">
      <div className="flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle + Branding & Location */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-primaryText hover:bg-rice active:scale-95 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-forest" />
          </button>

          {/* Interactive Logo Button */}
          <button
            onClick={() => onSelectTab && onSelectTab('dashboard')}
            className="flex items-center space-x-2.5 text-left group focus:outline-none cursor-pointer"
            title={language === 'bn' ? 'মূল ড্যাশবোর্ডে ফিরুন' : 'Return to Home Dashboard'}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-forest group-hover:bg-forest-dark flex items-center justify-center text-white shadow-xs transition-colors">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-forest-leaf group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-forest-dark group-hover:text-forest transition-colors">
                  Agro<span className="text-forest-leaf">Nex</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-forest-light text-forest rounded-full border border-forest/20">
                  BD v2.0
                </span>
              </div>
              <p className="text-[11px] text-secondaryText hidden md:block">
                {language === 'bn' ? 'সমন্বিত এগ্রো-টেক ও ডিরেক্ট মার্কেটপ্লেস' : 'Integrated Agro-Tech & Direct Marketplace'}
              </p>
            </div>
          </button>

          {/* Location Badge */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rice border border-softBorder text-xs text-primaryText">
            <MapPin className="w-3.5 h-3.5 text-clay shrink-0" />
            <span className="font-semibold">{user.district}, {user.upazila}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">

          {/* Phase 2 Roadmap shortcut button */}
          <button
            onClick={() => setShowPhase2Modal(true)}
            className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-forest/10 to-harvest/20 hover:from-forest/20 hover:to-harvest/30 text-xs font-bold text-forest-dark border border-forest/20 transition shadow-2xs"
            title="View Phase 2 Roadmap"
          >
            <Sparkles className="w-3.5 h-3.5 text-harvest-dark" />
            <span>{language === 'bn' ? 'পরবর্তী রূপরেখা' : 'Phase 2'}</span>
          </button>

          {/* Offline indicator toggle */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              isOffline ? 'bg-amber-50 text-status-warning border-amber-300' : 'bg-emerald-50 text-status-success border-emerald-200'
            }`}
            title="Toggle simulated offline mode"
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isOffline ? (language === 'bn' ? 'অফলাইন' : 'Offline') : (language === 'bn' ? 'অনলাইন' : 'Online')}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center border border-softBorder rounded-xl bg-rice p-0.5">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                language === 'bn' ? 'bg-forest text-white shadow-xs' : 'text-secondaryText hover:text-primaryText'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                language === 'en' ? 'bg-forest text-white shadow-xs' : 'text-secondaryText hover:text-primaryText'
              }`}
            >
              EN
            </button>
          </div>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-warmWhite border border-softBorder hover:border-forest/40 text-xs font-semibold text-primaryText transition shadow-2xs"
            >
              <UserCheck className="w-4 h-4 text-forest" />
              <span className="hidden md:inline font-bold">
                {language === 'bn' ? 'রোল:' : 'Role:'}
              </span>
              <span className="font-bold text-forest-dark max-w-[100px] truncate">
                {rolesList.find(r => r.role === activeRole)?.labelEn || activeRole}
              </span>
              <ChevronDown className="w-3 h-3 text-mutedText" />
            </button>

            {showRoleMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-softBorder p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowRoleMenu(false)}
              >
                <div className="px-3 py-2 border-b border-softBorder mb-1">
                  <p className="text-xs font-bold text-forest-dark">
                    {language === 'bn' ? 'রোল / দৃষ্টিভঙ্গি পরিবর্তন' : 'Switch Role & Perspective'}
                  </p>
                  <p className="text-[11px] text-secondaryText">
                    {language === 'bn' ? 'প্ল্যাটফর্ম রোল অনুযায়ী অভিযোজিত হবে' : 'Dashboard adapts to selected role'}
                  </p>
                </div>
                <div className="space-y-1">
                  {rolesList.map((item) => {
                    const RoleIcon = item.icon;
                    return (
                      <button
                        key={item.role}
                        onClick={() => setActiveRole(item.role)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition ${
                          activeRole === item.role ? 'bg-forest/10 text-forest-dark font-bold' : 'hover:bg-rice text-primaryText'
                        }`}
                      >
                        <span className="flex items-center space-x-2.5">
                          <RoleIcon className={`w-4 h-4 shrink-0 ${activeRole === item.role ? 'text-forest' : 'text-secondaryText'}`} />
                          <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
                        </span>
                        {activeRole === item.role && <Check className="w-4 h-4 text-forest" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-xl text-secondaryText hover:text-forest hover:bg-rice active:scale-95 transition min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-status-error text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div 
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-softBorder p-3 z-50 animate-in fade-in duration-100"
              >
                <div className="flex items-center justify-between border-b border-softBorder pb-2 mb-2 px-1">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-forest" />
                    <span className="text-xs font-bold text-forest-dark">
                      {language === 'bn' ? 'নোটিফিকেশন সেন্টার' : 'Notifications'}
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-red-100 text-status-error text-[10px] font-bold rounded-full">
                        {unreadCount} {language === 'bn' ? 'নতুন' : 'New'}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAllNotificationsRead();
                      }}
                      className="text-[11px] text-forest hover:underline font-bold"
                    >
                      {language === 'bn' ? 'সব পড়া হয়েছে' : 'Mark all read'}
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-secondaryText text-center py-4">
                      {language === 'bn' ? 'কোনো নোটিফিকেশন নেই' : 'No notifications'}
                    </p>
                  ) : (
                    notifications.slice(0, 6).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          setShowNotifMenu(false);
                          if (notif.linkTab && onSelectTab) {
                            onSelectTab(notif.linkTab);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer hover:border-forest/40 ${
                          notif.isRead ? 'bg-white border-softBorder opacity-75' : 'bg-forest-50/60 border-forest/20 font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] text-mutedText mb-1">
                          <span className="uppercase tracking-wider font-bold text-forest">{notif.sector}</span>
                          <span>{notif.timestamp}</span>
                        </div>
                        <p className="text-forest-dark font-bold text-xs">
                          {language === 'bn' ? notif.titleBn : notif.title}
                        </p>
                        <p className="text-secondaryText text-[11px] mt-0.5 line-clamp-2">
                          {language === 'bn' ? notif.messageBn : notif.message}
                        </p>
                        {notif.linkTab && (
                          <span className="inline-block mt-1 text-[10px] text-forest font-bold hover:underline">
                            সরাসরি দেখুন →
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Reset */}
          <button
            onClick={resetAllData}
            title={language === 'bn' ? 'ডেমো ডেটা রিসেট করুন' : 'Reset mock demo data'}
            className="p-2 text-mutedText hover:text-clay hover:bg-rice rounded-xl transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User Account & Login Portal Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-rice border border-softBorder hover:border-forest/40 transition text-xs cursor-pointer"
                title="Account & Portal"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-forest/20 shrink-0"
                />
                <span className="hidden xl:inline-block font-bold text-forest-dark max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-mutedText hidden sm:block" />
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-softBorder p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-softBorder mb-1">
                    <p className="text-xs font-bold text-forest-dark truncate">{user.name}</p>
                    <p className="text-[11px] text-secondaryText truncate">{user.phone}</p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => onSelectTab && onSelectTab('profile')}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-left hover:bg-rice text-primaryText transition cursor-pointer"
                    >
                      <User className="w-4 h-4 text-forest" />
                      <span>{language === 'bn' ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}</span>
                    </button>

                    <div className="pt-1 border-t border-softBorder">
                      <button
                        onClick={() => logout()}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-left hover:bg-red-50 text-status-error font-medium transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-status-error" />
                        <span>{language === 'bn' ? 'লগ আউট (Sign Out)' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onSelectTab && onSelectTab('login')}
              className="btn-primary text-xs py-1.5 px-3 flex items-center space-x-1 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'লগইন' : 'Sign In'}</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
