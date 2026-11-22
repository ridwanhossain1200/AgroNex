import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Sprout, 
  Beef, 
  Fish, 
  ShoppingBag, 
  Check, 
  Save, 
  Trash2, 
  Lock, 
  Globe, 
  Sparkles, 
  ArrowRight, 
  LogIn, 
  LogOut 
} from 'lucide-react';
import { UserRole, SectorType } from '../../types';
import { BANGLADESH_DISTRICTS } from '../../data/bangladeshGeo';
import { toBengaliDigits } from '../../utils/formatters';

interface ProfilePageProps {
  onNavigate?: (tab: string, subtab?: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { 
    language, 
    setLanguage, 
    user, 
    updateUser, 
    lands, 
    livestockFarms, 
    ponds, 
    listings, 
    orders, 
    showToast,
    logout
  } = useApp();

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email || '');
  const [district, setDistrict] = useState(user.district);
  const [upazila, setUpazila] = useState(user.upazila);
  const [village, setVillage] = useState(user.village);
  const [businessName, setBusinessName] = useState(user.businessName || '');

  const [userRoles, setUserRoles] = useState<UserRole[]>(user.roles);
  const [userSectors, setUserSectors] = useState<SectorType[]>(user.sectors);

  const selectedDistObj = BANGLADESH_DISTRICTS.find(d => d.name === district) || BANGLADESH_DISTRICTS[0];

  const handleToggleRole = (role: UserRole) => {
    setUserRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleToggleSector = (sec: SectorType) => {
    setUserSectors(prev => 
      prev.includes(sec) ? prev.filter(s => s !== sec) : [...prev, sec]
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      phone,
      email: email || undefined,
      district,
      upazila,
      village,
      businessName: businessName || undefined,
      roles: userRoles,
      sectors: userSectors
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Header Profile Card */}
      <div className="card-premium p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover border border-softBorder shrink-0" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-forest-dark">{user.name}</h1>
              {user.isVerified && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ✓ ভেরিফাইড সদস্য
                </span>
              )}
            </div>
            <p className="text-xs text-secondaryText mt-0.5">
              {user.businessName || 'এগ্রোনেক্স ডিজিটাল সদস্য'} • যোগদান: {user.joinedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-secondaryText">ভাষা:</span>
          <button
            onClick={() => setLanguage('bn')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              language === 'bn' ? 'bg-forest text-white shadow-xs' : 'bg-rice text-secondaryText hover:text-primaryText'
            }`}
          >
            বাংলা
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              language === 'en' ? 'bg-forest text-white shadow-xs' : 'bg-rice text-secondaryText hover:text-primaryText'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Asset Quick Summary Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button 
          onClick={() => onNavigate && onNavigate('agriculture')}
          className="card-premium p-3.5 text-center hover:border-forest transition group cursor-pointer"
        >
          <div className="flex items-center justify-center space-x-1 text-forest mb-1">
            <Sprout className="w-4 h-4" />
            <span className="text-xs font-bold">জমি প্লট</span>
          </div>
          <span className="text-xl font-black text-forest-dark block">{toBengaliDigits(lands.length)} টি</span>
          <span className="text-[10px] text-mutedText group-hover:text-forest transition flex items-center justify-center mt-1">
            ম্যানেজ করুন <ArrowRight className="w-3 h-3 ml-0.5" />
          </span>
        </button>

        <button 
          onClick={() => onNavigate && onNavigate('livestock')}
          className="card-premium p-3.5 text-center hover:border-amber-900 transition group cursor-pointer"
        >
          <div className="flex items-center justify-center space-x-1 text-amber-900 mb-1">
            <Beef className="w-4 h-4" />
            <span className="text-xs font-bold">খামার শেড</span>
          </div>
          <span className="text-xl font-black text-amber-900 block">{toBengaliDigits(livestockFarms.length)} টি</span>
          <span className="text-[10px] text-mutedText group-hover:text-amber-900 transition flex items-center justify-center mt-1">
            ম্যানেজ করুন <ArrowRight className="w-3 h-3 ml-0.5" />
          </span>
        </button>

        <button 
          onClick={() => onNavigate && onNavigate('fisheries')}
          className="card-premium p-3.5 text-center hover:border-river transition group cursor-pointer"
        >
          <div className="flex items-center justify-center space-x-1 text-river mb-1">
            <Fish className="w-4 h-4" />
            <span className="text-xs font-bold">মৎস্য পুকুর</span>
          </div>
          <span className="text-xl font-black text-river block">{toBengaliDigits(ponds.length)} টি</span>
          <span className="text-[10px] text-mutedText group-hover:text-river transition flex items-center justify-center mt-1">
            ম্যানেজ করুন <ArrowRight className="w-3 h-3 ml-0.5" />
          </span>
        </button>

        <button 
          onClick={() => onNavigate && onNavigate('marketplace')}
          className="card-premium p-3.5 text-center hover:border-clay transition group cursor-pointer"
        >
          <div className="flex items-center justify-center space-x-1 text-clay mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-bold">বিজ্ঞাপিত পণ্য</span>
          </div>
          <span className="text-xl font-black text-clay block">{toBengaliDigits(listings.length)} টি</span>
          <span className="text-[10px] text-mutedText group-hover:text-clay transition flex items-center justify-center mt-1">
            মার্কেটপ্লেস <ArrowRight className="w-3 h-3 ml-0.5" />
          </span>
        </button>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">

        {/* Personal & Farm Identity */}
        <div className="card-premium p-5 space-y-4">
          <h3 className="text-sm font-bold text-forest-dark border-b border-softBorder pb-3">
            ব্যক্তিগত ও বাণিজ্যিক পরিচিতি
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-primaryText mb-1">পূর্ণ নাম *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">মোবাইল নম্বর *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">ইমেইল (ঐচ্ছিক)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">খামার বা ট্রেডিং প্রতিষ্ঠানের নাম</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Geographic Location */}
        <div className="card-premium p-5 space-y-4">
          <h3 className="text-sm font-bold text-forest-dark border-b border-softBorder pb-3">
            ভৌগোলিক অবস্থান (Location)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-primaryText mb-1">জেলা (District) *</label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  const found = BANGLADESH_DISTRICTS.find(d => d.name === e.target.value);
                  if (found && found.upazilas.length > 0) setUpazila(found.upazilas[0]);
                }}
                className="input-field"
              >
                {BANGLADESH_DISTRICTS.map(d => (
                  <option key={d.name} value={d.name}>{d.name} ({d.nameBn})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">উপজেলা (Upazila) *</label>
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="input-field"
              >
                {selectedDistObj.upazilas.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">গ্রাম / চাতাল</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Multi-Role Capabilities */}
        <div className="card-premium p-5 space-y-4">
          <div className="border-b border-softBorder pb-3">
            <h3 className="text-sm font-bold text-forest-dark">বহুবিধ ভূমিকা ও সক্ষমতা (Multi-Role Capabilities)</h3>
            <p className="text-xs text-secondaryText leading-relaxed">
              একজন ব্যবহারকারী কৃষক এবং বিক্রেতা উভয় সক্ষমতায় একই অ্যাকাউন্টে কাজ করতে পারেন।
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: 'agri_farmer', label: 'কৃষি কৃষক' },
              { id: 'livestock_farmer', label: 'পশুপালক / খামারি' },
              { id: 'fish_farmer', label: 'মৎস্য চাষী' },
              { id: 'marketplace_seller', label: 'মার্কেটপ্লেস বিক্রেতা' },
              { id: 'wholesale_buyer', label: 'পাইকারি ক্রেতা / আড়তদার' },
              { id: 'consumer', label: 'সাধারণ ভোক্তা' }
            ].map(r => {
              const isChecked = userRoles.includes(r.id as UserRole);
              return (
                <label 
                  key={r.id} 
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center space-x-2 transition ${
                    isChecked ? 'bg-forest-50 border-forest text-forest-dark font-bold shadow-2xs' : 'bg-warmWhite border-softBorder text-primaryText hover:bg-rice'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleRole(r.id as UserRole)}
                    className="rounded text-forest focus:ring-forest"
                  />
                  <span>{r.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Sectors Selection */}
        <div className="card-premium p-5 space-y-4">
          <div className="border-b border-softBorder pb-3">
            <h3 className="text-sm font-bold text-forest-dark">সক্রিয় ব্যবসায়িক সেক্টর (Active Sectors)</h3>
            <p className="text-xs text-secondaryText leading-relaxed">
              আপনি যেসব সেক্টরে সক্রিয়ভাবে কাজ করেন সেগুলো নির্বাচন করুন।
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'agriculture', label: 'কৃষি ফসল (Agriculture)', icon: Sprout },
              { id: 'livestock', label: 'পশু ও খামারি (Livestock)', icon: Beef },
              { id: 'fisheries', label: 'মৎস্য চাষ (Fisheries)', icon: Fish },
              { id: 'marketplace', label: 'মার্কেটপ্লেস (Marketplace)', icon: ShoppingBag }
            ].map(s => {
              const Icon = s.icon;
              const isChecked = userSectors.includes(s.id as SectorType);
              return (
                <label 
                  key={s.id} 
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center space-x-2 transition ${
                    isChecked ? 'bg-forest-50 border-forest text-forest-dark font-bold shadow-2xs' : 'bg-warmWhite border-softBorder text-primaryText hover:bg-rice'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleSector(s.id as SectorType)}
                    className="rounded text-forest focus:ring-forest"
                  />
                  <Icon className="w-3.5 h-3.5 text-forest shrink-0" />
                  <span>{s.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2 text-xs py-2.5 px-6 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>প্রোফাইল পরিবর্তন সংরক্ষণ করুন</span>
          </button>
        </div>

      </form>

      {/* Account Session & Portal Management */}
      <div className="card-premium p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-softBorder">
        <div>
          <h4 className="text-sm font-bold text-forest-dark">
            {language === 'bn' ? 'অ্যাকাউন্ট ও সেশন নিয়ন্ত্রণ' : 'Account & Session Management'}
          </h4>
          <p className="text-xs text-secondaryText mt-0.5">
            {language === 'bn' 
              ? 'লগইন পোর্টাল থেকে সরাসরি অন্য ডেমো রোল নির্বাচন করতে পারেন অথবা বর্তমান সেশন শেষ করতে পারেন।' 
              : 'Switch to another demo persona or end your active session from the login portal.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('login')}
            className="btn-secondary text-xs flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 py-2 px-3.5 cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-forest" />
            <span>{language === 'bn' ? 'লগইন পোর্টাল' : 'Login Portal'}</span>
          </button>
          <button
            type="button"
            onClick={() => logout()}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-status-error border border-red-200 transition flex items-center justify-center space-x-1.5 cursor-pointer flex-1 sm:flex-initial"
          >
            <LogOut className="w-4 h-4 text-status-error" />
            <span>{language === 'bn' ? 'লগ আউট' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
