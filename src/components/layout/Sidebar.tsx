import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Sprout, 
  Beef, 
  Fish, 
  ShoppingBag, 
  TrendingUp, 
  Stethoscope, 
  ShieldCheck, 
  User, 
  Sparkles,
  ChevronRight,
  CalendarCheck,
  CheckCircle2,
  LogIn,
  LogOut,
  Bot
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed
}) => {
  const { language, activeRole, inquiries, orders, reminders, user, logout } = useApp();

  const pendingOffersCount = inquiries.filter(i => i.status === 'pending' || i.status === 'countered').length;
  const activeOrdersCount = orders.filter(o => o.status === 'accepted' || o.status === 'ready_for_pickup').length;
  const pendingTasksCount = reminders.filter(r => !r.isCompleted).length;

  const navItems = [
    {
      id: 'dashboard',
      labelBn: 'মূল ড্যাশবোর্ড',
      labelEn: 'Home Dashboard',
      icon: Home,
      badge: null
    },
    {
      id: 'agriculture',
      labelBn: 'কৃষি ব্যবস্থাপনা',
      labelEn: 'Agriculture',
      icon: Sprout,
      color: 'text-forest-leaf',
      badge: null
    },
    {
      id: 'livestock',
      labelBn: 'পশু ও খামারি',
      labelEn: 'Livestock & Vet',
      icon: Beef,
      color: 'text-clay',
      badge: null
    },
    {
      id: 'fisheries',
      labelBn: 'মৎস্য চাষ',
      labelEn: 'Fisheries Hub',
      icon: Fish,
      color: 'text-river',
      badge: null
    },
    {
      id: 'marketplace',
      labelBn: 'কৃষি মার্কেটপ্লেস',
      labelEn: 'Direct Marketplace',
      icon: ShoppingBag,
      color: 'text-clay-dark',
      badge: (pendingOffersCount + activeOrdersCount) > 0 ? `${pendingOffersCount + activeOrdersCount}` : null
    },
    {
      id: 'prices',
      labelBn: 'বাজার দর ও অ্যানালিটিক্স',
      labelEn: 'Market Prices',
      icon: TrendingUp,
      color: 'text-harvest-dark',
      badge: null
    },
    {
      id: 'experts',
      labelBn: 'বিশেষজ্ঞ নেটওয়ার্ক',
      labelEn: 'Expert Consultations',
      icon: Stethoscope,
      color: 'text-forest',
      badge: null
    }
  ];

  // Expert specific dashboard if in expert role
  if (activeRole === 'agri_expert') {
    navItems.push({
      id: 'expert_dashboard',
      labelBn: 'বিশেষজ্ঞ ড্যাশবোর্ড',
      labelEn: 'Doctor Workspace',
      icon: Stethoscope,
      color: 'text-river-dark',
      badge: 'PRO'
    });
  }

  // Admin dashboard (Always accessible or prominent when activeRole is admin)
  navItems.push({
    id: 'admin',
    labelBn: 'অ্যাডমিন প্যানেল',
    labelEn: 'Admin Portal',
    icon: ShieldCheck,
    color: 'text-forest-dark',
    badge: activeRole === 'admin' ? 'ADMIN' : null
  });

  navItems.push({
    id: 'profile',
    labelBn: 'প্রোফাইল ও সেটিংস',
    labelEn: 'Profile & Settings',
    icon: User,
    color: 'text-secondaryText',
    badge: null
  });

  return (
    <aside 
      className={`hidden md:flex flex-col bg-white border-r border-softBorder transition-all duration-200 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header with Interactive Logo */}
      <div className={`p-4 border-b border-softBorder flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <button
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center space-x-2.5 text-left group focus:outline-none cursor-pointer"
          title={language === 'bn' ? 'মূল ড্যাশবোর্ডে ফিরুন' : 'Return to Dashboard'}
        >
          <div className="w-8 h-8 rounded-xl bg-forest group-hover:bg-forest-dark flex items-center justify-center text-white shadow-xs transition-colors">
            <Sprout className="w-4 h-4 text-forest-leaf group-hover:scale-105 transition-transform" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-extrabold text-base tracking-tight text-forest-dark group-hover:text-forest transition-colors">
                Agro<span className="text-forest-leaf">Nex</span>
              </span>
              <span className="block text-[9px] text-mutedText font-semibold">ডিজিটাল এগ্রো-ইকোসিস্টেম</span>
            </div>
          )}
        </button>
      </div>
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 mb-2">
          {!collapsed && (
            <p className="text-[11px] font-bold text-mutedText tracking-wider uppercase">
              {language === 'bn' ? 'প্রধান মডিউলসমূহ' : 'Core Modules'}
            </p>
          )}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-3.5'} py-2.5 rounded-xl text-xs font-semibold transition group ${
                isActive 
                  ? 'bg-forest text-white shadow-sm' 
                  : 'text-primaryText hover:bg-rice hover:text-forest-dark'
              }`}
              title={collapsed ? (language === 'bn' ? item.labelBn : item.labelEn) : undefined}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : item.color || 'text-forest'}`} />
                {!collapsed && (
                  <span className="truncate">
                    {language === 'bn' ? item.labelBn : item.labelEn}
                  </span>
                )}
              </div>

              {!collapsed && item.badge && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-forest/10 text-forest'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Daily Farming Tasks Quick widget in sidebar */}
      {!collapsed && (
        <div className="p-3 mx-3 mb-4 rounded-2xl bg-forest-50 border border-forest/15">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-forest-dark flex items-center space-x-1">
              <CalendarCheck className="w-3.5 h-3.5 text-forest" />
              <span>{language === 'bn' ? 'আজকের কাজ' : 'Daily Tasks'}</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-forest/20 text-forest-dark">
              {pendingTasksCount} বাকি
            </span>
          </div>
          <p className="text-[11px] text-secondaryText leading-relaxed">
            {language === 'bn' 
              ? 'কৃষি জমি ও খামারের রিমাইন্ডার যথাসময়ে সম্পন্ন করুন।' 
              : 'Keep track of scheduled irrigation & feed.'}
          </p>
        </div>
      )}

      {/* User Session Bar */}
      <div className={`p-3 border-t border-softBorder flex items-center ${collapsed ? 'justify-center' : 'justify-between'} bg-warmWhite`}>
        <button
          onClick={() => onSelectTab('profile')}
          className="flex items-center space-x-2.5 text-left min-w-0 group cursor-pointer"
          title="Go to profile"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-xl object-cover border border-forest/20 shrink-0"
          />
          {!collapsed && (
            <div className="truncate">
              <p className="text-xs font-bold text-forest-dark group-hover:text-forest truncate">
                {user.name.split(' ')[0]}
              </p>
              <p className="text-[10px] text-mutedText truncate">{user.district}</p>
            </div>
          )}
        </button>

        {!collapsed && (
          <button
            onClick={() => logout()}
            className="p-1.5 text-mutedText hover:text-status-error hover:bg-red-50 rounded-lg transition cursor-pointer"
            title={language === 'bn' ? 'লগ আউট করুন' : 'Sign out'}
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};

