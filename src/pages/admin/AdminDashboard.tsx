import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Bot, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Layers, 
  Activity, 
  Check, 
  Clock,
  Sparkles,
  BarChart2,
  FileText
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatNumber, toBengaliDigits } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const { 
    language, 
    listings, 
    deleteListing, 
    toggleListingStatus,
    marketPrices, 
    updateMarketPrice, 
    experts, 
    orders, 
    inquiries, 
    showToast 
  } = useApp();

  const [adminTab, setAdminTab] = useState<'overview' | 'experts' | 'listings' | 'prices' | 'ai_reports'>('overview');

  // Price Edit State
  const [editingPriceItem, setEditingPriceItem] = useState<any | null>(null);
  const [editWholesale, setEditWholesale] = useState<number>(0);
  const [editRetail, setEditRetail] = useState<number>(0);

  // Verification state for demo
  const [verifiedExpertIds, setVerifiedExpertIds] = useState<string[]>(['exp_1', 'exp_2', 'exp_3']);
  const [verifiedSellerIds, setVerifiedSellerIds] = useState<string[]>(['usr_001', 'usr_002', 'usr_003']);

  // AI Reported responses mock
  const [aiReports, setAiReports] = useState([
    {
      id: 'rep_1',
      crop: 'বোরো ধান',
      query: 'ধানের পাতায় খড়ের মতো দাগ ও গোড়া পচা',
      aiResponse: 'ব্যাকটেরিয়াল লিফ ব্লাইট (BLB) বা বাদামি দাগ রোগ হতে পারে। নিমপাতা রস স্প্রে করুন।',
      farmerFeedback: 'লক্ষণটি ব্লাস্ট রোগের সাথেও মিলে যায়। রাসায়নিক ছত্রাকনাশকের মাত্রা আরও স্পষ্ট হওয়া প্রয়োজন।',
      status: 'under_review',
      date: '2026-11-18'
    },
    {
      id: 'rep_2',
      crop: 'গবাদিপশু',
      query: 'গরুর মুখে অতিরিক্ত লালা ও খুঁড়িয়ে চলা',
      aiResponse: 'খুরারোগ (FMD) এর জরুরি লক্ষণ। তাত্ক্ষণিক আলাদা করে চিকিৎসকের পরামর্শ নিন।',
      farmerFeedback: 'অত্যন্ত দ্রুত ও সঠিক জরুরি সতর্কতা প্রদান করেছে।',
      status: 'resolved',
      date: '2026-11-19'
    }
  ]);

  const handleSavePriceEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPriceItem) return;

    updateMarketPrice(editingPriceItem.id, Number(editWholesale), Number(editRetail));
    setEditingPriceItem(null);
  };

  const toggleExpertVerification = (id: string) => {
    setVerifiedExpertIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    showToast('বিশেষজ্ঞের ভেরিফিকেশন স্ট্যাটাস হালনাগাদ করা হয়েছে', 'info');
  };

  const tabs = [
    { id: 'overview', icon: BarChart2, label: 'সিস্টেম অ্যানালিটিক্স' },
    { id: 'experts', icon: ShieldCheck, label: 'বিশেষজ্ঞ ভেরিফিকেশন' },
    { id: 'listings', icon: ShoppingBag, label: 'লিস্টিং মডারেশন' },
    { id: 'prices', icon: TrendingUp, label: 'বাজার দর নিয়ন্ত্রণ' },
    { id: 'ai_reports', icon: Bot, label: 'এআই রিপোর্ট ও ফিডব্যাক' }
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-softBorder shadow-2xs">
        <div className="flex items-center space-x-3">
          <span className="p-2.5 rounded-xl bg-forest-50 text-forest-dark border border-forest/20 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-forest" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-forest-dark">
              {language === 'bn' ? 'সিস্টেম অ্যাডমিন ও গভর্ন্যান্স পোর্টাল' : 'System Administrator & Governance Portal'}
            </h1>
            <p className="text-xs text-secondaryText leading-relaxed">
              {language === 'bn' 
                ? 'কৃষক ও বিশেষজ্ঞ যাচাই, মার্কেটপ্লেস লিস্টিং মডারেশন, আঞ্চলিক বাজার দর নিয়ন্ত্রণ ও অডিট ট্রেইল' 
                : 'User governance, expert credentials verification, marketplace moderation & DAM benchmark pricing'}
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-forest-50 text-forest-dark border border-forest/20 self-start sm:self-auto">
          Super Admin Privileges
        </span>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-softBorder pb-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`subtab-pill ${
                isActive 
                  ? 'bg-forest text-white shadow-xs' 
                  : 'bg-white text-secondaryText hover:text-forest-dark hover:bg-forest-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-premium p-4.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondaryText font-medium">নিবন্ধিত কৃষিজীবী ও ব্যবসায়ী</span>
                <Users className="w-4 h-4 text-river" />
              </div>
              <p className="text-2xl font-black text-forest-dark mt-2">
                ১২,৪৫০+
              </p>
              <p className="text-[11px] text-forest-leaf font-semibold mt-1">
                উত্তরবঙ্গ ও ময়মনসিংহ ক্লাস্টার
              </p>
            </div>

            <div className="card-premium p-4.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondaryText font-medium">সক্রিয় মার্কেটপ্লেস বিজ্ঞাপন</span>
                <ShoppingBag className="w-4 h-4 text-clay/70" />
              </div>
              <p className="text-2xl font-black text-clay mt-2">
                {toBengaliDigits(listings.length)} <span className="text-sm font-semibold text-secondaryText">টি</span>
              </p>
              <p className="text-[11px] text-mutedText mt-1">
                মোট মূল্যমান: ৳ {toBengaliDigits(listings.reduce((acc, l) => acc + (l.quantity * l.pricePerUnit), 0))}
              </p>
            </div>

            <div className="card-premium p-4.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondaryText font-medium">সম্পন্ন অর্ডার ও মোট লেনদেন</span>
                <TrendingUp className="w-4 h-4 text-forest/70" />
              </div>
              <p className="text-2xl font-black text-forest mt-2">
                ৳ {toBengaliDigits(orders.reduce((acc, o) => acc + o.totalOrderValue, 0))}
              </p>
              <p className="text-[11px] text-forest-leaf font-semibold mt-1">
                {toBengaliDigits(orders.length)} টি সফল ডিল সম্পন্ন
              </p>
            </div>

            <div className="card-premium p-4.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondaryText font-medium">ভেরিফাইড বিশেষজ্ঞ নেটওয়ার্ক</span>
                <ShieldCheck className="w-4 h-4 text-forest" />
              </div>
              <p className="text-2xl font-black text-forest-dark mt-2">
                {toBengaliDigits(verifiedExpertIds.length)} <span className="text-sm font-semibold text-secondaryText">জন</span>
              </p>
              <p className="text-[11px] text-mutedText mt-1">
                বিসিএস কৃষি, ভেট ও মৎস্য বিশেষজ্ঞ
              </p>
            </div>
          </div>

          {/* Audit History Log */}
          <div className="card-premium p-5 space-y-3">
            <h3 className="text-sm font-bold text-forest-dark">সিস্টেম সিকিউরিটি ও অডিট ট্রেইল (Audit Trail)</h3>
            <div className="space-y-2 text-xs">
              {[
                { time: '১০ মিনিট আগে', user: 'Admin (System)', action: 'আঞ্চলিক বাজার দর আপডেট: ব্রি ধান-২৮ (বগুড়া মহাস্থান আড়ত)', status: 'Success' },
                { time: '৪৫ মিনিট আগে', user: 'Moderator', action: 'লিস্টিং অনুমোদন: প্রিমিয়াম ডায়মন্ড লাল গোল আলু (৩৫ মণ)', status: 'Verified' },
                { time: '২ ঘন্টা আগে', user: 'Security Daemon', action: 'অফলাইন ডেটা সিঙ্ক্রোনাইজেশন চেক সম্পন্ন', status: 'Clean' }
              ].map((log, i) => (
                <div key={i} className="p-3 rounded-xl bg-rice/50 border border-softBorder flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-mutedText" />
                    <div>
                      <p className="font-semibold text-primaryText">{log.action}</p>
                      <p className="text-[11px] text-mutedText">{log.user} • {log.time}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXPERT VERIFICATION */}
      {adminTab === 'experts' && (
        <div className="card-premium p-4 sm:p-5 space-y-4">
          <h3 className="text-sm font-bold text-forest-dark">কৃষি, পশু ও মৎস্য বিশেষজ্ঞ সনদপত্র যাচাই ও অনুমোদন</h3>
          
          {/* Mobile Expert Cards (sm:hidden) */}
          <div className="sm:hidden space-y-3">
            {experts.map((exp) => {
              const isVerified = verifiedExpertIds.includes(exp.id);
              return (
                <div key={exp.id} className="p-3.5 rounded-xl border border-softBorder bg-warmWhite space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-forest-dark text-sm">{exp.nameBn}</h4>
                      <p className="text-[11px] text-mutedText">{exp.designationBn} ({exp.qualification})</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      isVerified ? 'bg-emerald-100 text-status-success' : 'bg-amber-100 text-status-warning'
                    }`}>
                      {isVerified ? '✓ ভেরিফাইড' : 'অপেক্ষমাণ'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-secondaryText pt-1 border-t border-softBorder">
                    <span>বিভাগ: <strong className="uppercase text-forest">{exp.category}</strong></span>
                    <span>অভিজ্ঞতা: {toBengaliDigits(exp.experienceYears)} বছর</span>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => toggleExpertVerification(exp.id)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                        isVerified ? 'bg-red-50 text-status-error border border-red-200' : 'btn-primary'
                      }`}
                    >
                      {isVerified ? 'সনদ বাতিল করুন' : 'সনদপত্র অনুমোদন দিন'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (hidden sm:block) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-rice border-y border-softBorder text-secondaryText">
                  <th className="py-2.5 px-3">বিশেষজ্ঞের নাম</th>
                  <th className="py-2.5 px-3">বিভাগ</th>
                  <th className="py-2.5 px-3">যোগ্যতা ও পদবী</th>
                  <th className="py-2.5 px-3">অভিজ্ঞতা</th>
                  <th className="py-2.5 px-3">ভেরিফিকেশন স্ট্যাটাস</th>
                  <th className="py-2.5 px-3 text-right">মডারেশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-softBorder">
                {experts.map((exp) => {
                  const isVerified = verifiedExpertIds.includes(exp.id);
                  return (
                    <tr key={exp.id} className="hover:bg-warmWhite transition">
                      <td className="py-2.5 px-3 font-bold text-forest-dark">{exp.nameBn}</td>
                      <td className="py-2.5 px-3 uppercase text-[10px] font-bold text-secondaryText">{exp.category}</td>
                      <td className="py-2.5 px-3 text-secondaryText">{exp.designationBn} ({exp.qualification})</td>
                      <td className="py-2.5 px-3">{toBengaliDigits(exp.experienceYears)} বছর</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isVerified ? '✓ ভেরিফাইড' : 'অপেক্ষমাণ'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => toggleExpertVerification(exp.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            isVerified ? 'bg-red-50 text-status-error hover:bg-red-100' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {isVerified ? 'বাতিল করুন' : 'অনুমোদন দিন'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LISTINGS MODERATION */}
      {adminTab === 'listings' && (
        <div className="card-premium p-5 space-y-4">
          <h3 className="text-sm font-bold text-forest-dark">মার্কেটপ্লেস লিস্টিং মডারেশন ও অনুমোদন</h3>
          <div className="space-y-3">
            {listings.map((l) => (
              <div key={l.id} className="p-4 rounded-xl border border-softBorder bg-warmWhite flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <img src={l.images[0]} alt={l.productName} className="w-12 h-12 rounded-xl object-cover border border-softBorder shrink-0" />
                  <div>
                    <h4 className="font-bold text-forest-dark">{l.productName}</h4>
                    <p className="text-secondaryText">বিক্রেতা: {l.sellerName} • {toBengaliDigits(l.quantity)} {l.unit} @ ৳{toBengaliDigits(l.pricePerUnit)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <StatusBadge status={l.status} size="sm" />
                  <button
                    onClick={() => toggleListingStatus(l.id, l.status === 'published' ? 'paused' : 'published')}
                    className="btn-secondary text-xs py-1 px-2.5"
                  >
                    {l.status === 'published' ? 'স্থগিত করুন' : 'অনুমোদন'}
                  </button>
                  <button
                    onClick={() => deleteListing(l.id)}
                    className="p-1.5 text-mutedText hover:text-status-error rounded-lg"
                    title="লিস্টিং মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MARKET PRICE CONTROL */}
      {adminTab === 'prices' && (
        <div className="card-premium p-5 space-y-4">
          <h3 className="text-sm font-bold text-forest-dark">আঞ্চলিক আড়তের পাইকারি ও খুচরা দর নির্ধারণ</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-rice border-y border-softBorder text-secondaryText">
                  <th className="py-2.5 px-3">পণ্য</th>
                  <th className="py-2.5 px-3">আড়ত ও জেলা</th>
                  <th className="py-2.5 px-3">পাইকারি দর</th>
                  <th className="py-2.5 px-3">খুচরা দর</th>
                  <th className="py-2.5 px-3">আপডেট সময়</th>
                  <th className="py-2.5 px-3 text-right">সম্পাদনা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-softBorder">
                {marketPrices.map((m) => (
                  <tr key={m.id} className="hover:bg-warmWhite transition">
                    <td className="py-2.5 px-3 font-bold text-forest-dark">{m.productBn}</td>
                    <td className="py-2.5 px-3">{m.marketLocation} ({m.district})</td>
                    <td className="py-2.5 px-3 font-black text-forest">৳ {toBengaliDigits(m.wholesalePrice)} / {m.unit}</td>
                    <td className="py-2.5 px-3">৳ {toBengaliDigits(m.retailPrice)} / {m.unit}</td>
                    <td className="py-2.5 px-3 text-[11px] text-mutedText">{m.recordedTimestamp}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setEditingPriceItem(m);
                          setEditWholesale(m.wholesalePrice);
                          setEditRetail(m.retailPrice);
                        }}
                        className="btn-clay text-xs py-1 px-2.5"
                      >
                        মূল্য পরিবর্তন
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AI RESPONSE REPORTS & FEEDBACK */}
      {adminTab === 'ai_reports' && (
        <div className="card-premium p-5 space-y-4">
          <h3 className="text-sm font-bold text-forest-dark">কৃষকের এআই পরামর্শ নিরীক্ষা ও ফিডব্যাক রিভিউ</h3>
          <div className="space-y-3">
            {aiReports.map((rep) => (
              <div key={rep.id} className="p-4 rounded-xl border border-softBorder bg-warmWhite space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-forest-dark">{rep.crop} • {rep.query}</span>
                  <StatusBadge status={rep.status} size="sm" />
                </div>
                <div className="p-3 rounded-xl bg-rice text-secondaryText space-y-1">
                  <p><strong>এআই উত্তর:</strong> {rep.aiResponse}</p>
                  <p className="text-clay"><strong>কৃষক/বিশেষজ্ঞ ফিডব্যাক:</strong> {rep.farmerFeedback}</p>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      setAiReports(prev => prev.map(r => r.id === rep.id ? { ...r, status: 'resolved' } : r));
                      showToast('রিপোর্ট সমাধান হিসেবে চিহ্নিত', 'success');
                    }}
                    className="btn-primary text-xs py-1 px-3"
                  >
                    ✓ সমাধান চিহ্নিত করুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: EDIT REGIONAL MARKET PRICE */}
      {editingPriceItem && (
        <Modal
          isOpen={true}
          onClose={() => setEditingPriceItem(null)}
          title="আঞ্চলিক বাজার দর হালনাগাদ"
          subtitle={`${editingPriceItem.productBn} • ${editingPriceItem.marketLocation}`}
          maxWidth="sm"
        >
          <form onSubmit={handleSavePriceEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-primaryText mb-1">
                পাইকারি দর (টাকা প্রতি {editingPriceItem.unit}) *
              </label>
              <input
                type="number"
                required
                value={editWholesale}
                onChange={(e) => setEditWholesale(Number(e.target.value))}
                className="input-field font-bold text-forest"
              />
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">
                খুচরা দর (টাকা প্রতি {editingPriceItem.unit}) *
              </label>
              <input
                type="number"
                required
                value={editRetail}
                onChange={(e) => setEditRetail(Number(e.target.value))}
                className="input-field font-semibold text-primaryText"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-softBorder">
              <button
                type="button"
                onClick={() => setEditingPriceItem(null)}
                className="btn-secondary text-xs"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="btn-primary text-xs"
              >
                হালনাগাদ সম্পন্ন করুন
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
