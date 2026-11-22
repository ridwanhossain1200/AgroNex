import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  Search, 
  Bell, 
  Plus, 
  MapPin, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Info, 
  AlertTriangle,
  Play,
  Trash2,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  BarChart2,
  Filter
} from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '../../data/bangladeshGeo';
import { MarketPriceItem, PriceAlert, SectorType, ProduceUnit } from '../../types';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatNumber, toBengaliDigits } from '../../utils/formatters';

export const MarketPricesPage: React.FC = () => {
  const { 
    language, 
    user,
    marketPrices, 
    priceAlerts, 
    addPriceAlert, 
    togglePriceAlert, 
    deletePriceAlert, 
    simulatePriceUpdate 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'prices' | 'alerts' | 'simulation'>('prices');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected item for historical trend chart
  const [activeItemForChart, setActiveItemForChart] = useState<MarketPriceItem>(marketPrices[0] || {
    id: 'mkt_1',
    product: 'BRRI Dhan-28 (Paddy)',
    productBn: 'ব্রি ধান-২৮ (ধান)',
    category: 'Cereal / ধান',
    sector: 'agriculture',
    wholesalePrice: 1320,
    retailPrice: 1450,
    unit: 'maund',
    minPrice: 1290,
    maxPrice: 1350,
    marketLocation: 'মহাস্থান পাইকারি আড়ত',
    district: 'Bogura',
    source: 'কৃষি বিপণন অধিদপ্তর (DAM)',
    recordedTimestamp: '২০২৬-১১-১৯ সকাল ০৮:৩০',
    historicalTrend: [
      { date: '১৩ নভে', price: 1280 },
      { date: '১৪ নভে', price: 1295 },
      { date: '১৫ নভে', price: 1300 },
      { date: '১৬ নভে', price: 1315 },
      { date: '১৭ নভে', price: 1310 },
      { date: '১৮ নভে', price: 1325 },
      { date: '১৯ নভে', price: 1320 }
    ]
  });

  // Price Alert Modal State
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertProduct, setAlertProduct] = useState('ব্রি ধান-২৮ (ধান)');
  const [alertSector, setAlertSector] = useState<SectorType>('agriculture');
  const [alertDistrict, setAlertDistrict] = useState('Bogura');
  const [alertTargetPrice, setAlertTargetPrice] = useState<number>(1350);
  const [alertUnit, setAlertUnit] = useState<ProduceUnit>('maund');
  const [alertCondition, setAlertCondition] = useState<'at_or_above' | 'at_or_below'>('at_or_above');

  // Simulated price trigger test state
  const [simTargetProductId, setSimTargetProductId] = useState<string>('mp_1');
  const [simNewPrice, setSimNewPrice] = useState<number>(1360);

  const filteredPrices = marketPrices.filter((item) => {
    const matchSector = selectedSector === 'all' || item.sector === selectedSector;
    const matchDistrict = selectedDistrict === 'all' || item.district === selectedDistrict;
    const matchSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.productBn.includes(searchQuery) ||
                        item.marketLocation.includes(searchQuery);
    return matchSector && matchDistrict && matchSearch;
  });

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    addPriceAlert({
      userId: user.id,
      productName: alertProduct,
      sector: alertSector,
      district: alertDistrict,
      targetPrice: Number(alertTargetPrice),
      unit: alertUnit,
      condition: alertCondition,
      isActive: true,
      currentObservedPrice: activeItemForChart.wholesalePrice,
      source: 'কৃষি বিপণন অধিদপ্তর (DAM Regional Hub)'
    });
    setShowAlertModal(false);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-softBorder shadow-2xs">
        <div className="flex items-center space-x-3">
          <span className="p-2.5 rounded-xl bg-harvest-light text-harvest-dark border border-harvest/30 shadow-2xs">
            <TrendingUp className="w-5 h-5 text-harvest-dark" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-forest-dark">
              {language === 'bn' ? 'আঞ্চলিক বাজার দর ও মূল্য বুদ্ধিমত্তা (Market Prices)' : 'Regional Market Price Intelligence'}
            </h1>
            <p className="text-xs text-secondaryText leading-relaxed">
              {language === 'bn' 
                ? 'কৃষি বিপণন অধিদপ্তর (DAM) ও দেশের প্রধান পাইকারি আড়তসমূহের দৈনিক পাইকারি ও খুচরা দর' 
                : 'Daily wholesale & retail market prices from Department of Agricultural Marketing (DAM) and regional hubs'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAlertModal(true)}
          className="btn-primary text-xs"
        >
          <Bell className="w-4 h-4 text-emerald-300" />
          <span>{language === 'bn' ? 'মূল্য সতর্কবার্তা (Alert) সেট করুন' : 'Create Price Alert'}</span>
        </button>
      </div>

      {/* Honest Disclosure Banner */}
      <div className="p-3.5 rounded-xl bg-forest-50 border border-forest/20 text-xs text-forest-dark flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-forest shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>{language === 'bn' ? 'স্বচ্ছতার নীতি ও সূত্র:' : 'Notice & Attribution:'}</strong>{' '}
          {language === 'bn' 
            ? 'প্রদর্শিত বাজার দরসমূহ প্রদর্শনী ডেমো ডেটা হিসেবে কৃষি বিপণন অধিদপ্তরের (DAM) কাঠামোর সাথে মিল রেখে সাজানো। এটি প্রকৃত বাণিজ্যিক কেনাবেচার নিশ্চয়তা নয়, বরং সিদ্ধান্ত গ্রহণে সহায়ক নির্দেশক।' 
            : 'Market prices shown reflect simulated regional wholesale benchmarks based on Department of Agricultural Marketing (DAM) reporting.'}
        </p>
      </div>

      {/* View Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-softBorder pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('prices')}
          className={`subtab-pill ${
            activeSubTab === 'prices' 
              ? 'bg-forest text-white shadow-xs' 
              : 'bg-white text-secondaryText hover:text-forest hover:bg-forest-50/50'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5 shrink-0" />
          <span>{language === 'bn' ? 'পাইকারি বাজার দর তালিকা' : 'Market Price Directory'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('alerts')}
          className={`subtab-pill ${
            activeSubTab === 'alerts' 
              ? 'bg-harvest-dark text-white shadow-xs' 
              : 'bg-white text-secondaryText hover:text-harvest-dark hover:bg-harvest-light/40'
          }`}
        >
          <Bell className="w-3.5 h-3.5 shrink-0" />
          <span>
            {language === 'bn' ? 'আমার প্রাইস অ্যালার্ট' : 'My Price Alerts'} ({toBengaliDigits(priceAlerts.length)})
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('simulation')}
          className={`subtab-pill ${
            activeSubTab === 'simulation' 
              ? 'bg-river-dark text-white shadow-xs' 
              : 'bg-white text-secondaryText hover:text-river-dark hover:bg-river/10'
          }`}
        >
          <Play className="w-3.5 h-3.5 shrink-0" />
          <span>{language === 'bn' ? 'দর পরিবর্তন টেস্ট ল্যাব' : 'Simulation Test Lab'}</span>
        </button>
      </div>

      {/* SUBTAB 1: PRICES DIRECTORY & CHART */}
      {activeSubTab === 'prices' && (
        <div className="space-y-6">

          {/* Historical Trend Chart Panel */}
          <div className="card-premium p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-softBorder pb-3">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-harvest-light text-harvest-dark uppercase">
                  {activeItemForChart.category} • {activeItemForChart.district}
                </span>
                <h3 className="text-base font-bold text-forest-dark mt-1">
                  {language === 'bn' ? activeItemForChart.productBn : activeItemForChart.product} — ৭ দিনের বাজার দর প্রবণতা
                </h3>
                <p className="text-xs text-secondaryText mt-0.5">
                  আড়ত: {activeItemForChart.marketLocation} • সূত্র: {activeItemForChart.source}
                </p>
              </div>

              <div className="flex items-center space-x-5">
                <div className="text-right">
                  <span className="text-[10px] text-mutedText block">বর্তমান পাইকারি দর</span>
                  <span className="text-xl font-black text-forest">
                    {formatCurrency(activeItemForChart.wholesalePrice, language)}
                  </span>
                  <span className="text-[10px] text-secondaryText"> / {activeItemForChart.unit === 'maund' ? 'মণ' : activeItemForChart.unit === 'kg' ? 'কেজি' : 'একক'}</span>
                </div>
                <div className="text-right border-l border-softBorder pl-5">
                  <span className="text-[10px] text-mutedText block">খুচরা বাজার দর</span>
                  <span className="text-xl font-bold text-primaryText">
                    {formatCurrency(activeItemForChart.retailPrice, language)}
                  </span>
                  <span className="text-[10px] text-secondaryText"> / {activeItemForChart.unit === 'maund' ? 'মণ' : activeItemForChart.unit === 'kg' ? 'কেজি' : 'একক'}</span>
                </div>
              </div>
            </div>

            {/* Responsive Custom SVG Trend Chart */}
            <div className="h-44 w-full pt-4">
              <div className="h-32 flex items-end justify-between gap-2 px-4 border-b border-l border-softBorder relative">
                {activeItemForChart.historicalTrend.map((t, idx) => {
                  const maxP = Math.max(...activeItemForChart.historicalTrend.map(x => x.price)) * 1.05;
                  const minP = Math.min(...activeItemForChart.historicalTrend.map(x => x.price)) * 0.95;
                  const range = maxP - minP || 1;
                  const heightPct = Math.max(18, Math.min(95, ((t.price - minP) / range) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition text-[10px] font-bold bg-forest text-white px-2 py-0.5 rounded shadow mb-1.5 whitespace-nowrap">
                        ৳{toBengaliDigits(t.price)}
                      </div>
                      <div 
                        style={{ height: `${heightPct}%` }}
                        className="w-full max-w-[42px] bg-gradient-to-t from-forest to-forest-leaf rounded-t-lg transition-all duration-300 group-hover:from-forest-dark group-hover:to-harvest shadow-2xs"
                      />
                      <span className="text-[10px] text-mutedText font-semibold mt-2">
                        {t.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filters Toolbar */}
          <div className="card-premium p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-mutedText" />
                <input
                  type="text"
                  placeholder="পণ্য বা আড়তের নাম দিয়ে ফিল্টার করুন (যেমন: ধান, আলু, ইলিশ, মহাস্থান)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-9"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="input-field"
                >
                  <option value="all">সকল সেক্টর</option>
                  <option value="agriculture">কৃষি ফসল</option>
                  <option value="livestock">পশু ও ডেইরি</option>
                  <option value="fisheries">মৎস্য / মাছ</option>
                </select>

                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="input-field"
                >
                  <option value="all">সকল জেলা</option>
                  {BANGLADESH_DISTRICTS.map(d => (
                    <option key={d.name} value={d.name}>{d.name} ({d.nameBn})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Market Price Table */}
          {filteredPrices.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="কোনো বাজার দর পাওয়া যায়নি"
              description="আপনার অনুসন্ধানের সাথে মিলে এমন কোনো পণ্য বা আড়তের দর রেকর্ড নেই। ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।"
              actionLabel="সকল পণ্য দেখুন"
              onAction={() => {
                setSearchQuery('');
                setSelectedSector('all');
                setSelectedDistrict('all');
              }}
            />
          ) : (
            <div className="card-premium overflow-hidden">
              {/* Mobile Cards View (sm:hidden for Android & mobile screens) */}
              <div className="sm:hidden divide-y divide-softBorder">
                {filteredPrices.map((item) => {
                  const isSelected = activeItemForChart.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveItemForChart(item)}
                      className={`p-4 transition cursor-pointer space-y-2.5 ${
                        isSelected ? 'bg-forest/5 border-l-4 border-l-forest' : 'hover:bg-warmWhite'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rice text-secondaryText uppercase">
                            {item.sector} • {item.category}
                          </span>
                          <h4 className="font-bold text-forest-dark text-sm mt-1">
                            {language === 'bn' ? item.productBn : item.product}
                          </h4>
                          <p className="text-[11px] text-mutedText flex items-center space-x-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-clay shrink-0" />
                            <span>{item.marketLocation}, {item.district}</span>
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAlertProduct(item.productBn);
                            setAlertSector(item.sector);
                            setAlertDistrict(item.district);
                            setAlertTargetPrice(item.wholesalePrice);
                            setAlertUnit(item.unit);
                            setShowAlertModal(true);
                          }}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-harvest-light text-harvest-dark hover:bg-harvest/30 transition shrink-0 active:scale-95 shadow-2xs"
                        >
                          + অ্যালার্ট
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-rice/60 text-xs">
                        <div>
                          <span className="text-[10px] text-mutedText block">পাইকারি দর</span>
                          <span className="text-base font-black text-forest">
                            ৳ {toBengaliDigits(item.wholesalePrice)}
                          </span>
                          <span className="text-[10px] text-secondaryText"> / {item.unit === 'maund' ? 'মণ' : item.unit === 'kg' ? 'কেজি' : 'একক'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-mutedText block">খুচরা মূল্য</span>
                          <span className="text-sm font-bold text-primaryText">
                            ৳ {toBengaliDigits(item.retailPrice)}
                          </span>
                          <span className="text-[10px] text-secondaryText"> / {item.unit === 'maund' ? 'মণ' : item.unit === 'kg' ? 'কেজি' : 'একক'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-mutedText pt-1">
                        <span>দৈনিক রেঞ্জ: ৳{toBengaliDigits(item.minPrice)} - ৳{toBengaliDigits(item.maxPrice)}</span>
                        <span>{item.recordedTimestamp}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View (hidden sm:block) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-rice border-b border-softBorder text-secondaryText">
                      <th className="py-3 px-4 font-bold">পণ্য ও জাত</th>
                      <th className="py-3 px-4 font-bold">পাইকারি বাজার দর</th>
                      <th className="py-3 px-4 font-bold">খুচরা মূল্য</th>
                      <th className="py-3 px-4 font-bold">দৈনিক রেঞ্জ (সর্বনিম্ন - সর্বোচ্চ)</th>
                      <th className="py-3 px-4 font-bold">বাজার ও জেলা</th>
                      <th className="py-3 px-4 font-bold">সর্বশেষ আপডেট</th>
                      <th className="py-3 px-4 font-bold text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-softBorder">
                    {filteredPrices.map((item) => {
                      const isSelected = activeItemForChart.id === item.id;
                      return (
                        <tr 
                          key={item.id} 
                          className={`transition cursor-pointer ${isSelected ? 'bg-forest/5 font-semibold' : 'hover:bg-warmWhite'}`}
                          onClick={() => setActiveItemForChart(item)}
                        >
                          <td className="py-3 px-4">
                            <span className="font-bold text-forest-dark block">
                              {language === 'bn' ? item.productBn : item.product}
                            </span>
                            <span className="text-[10px] text-mutedText uppercase">{item.sector} • {item.category}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm font-black text-forest">
                              ৳ {toBengaliDigits(item.wholesalePrice)}
                            </span>
                            <span className="text-[10px] text-secondaryText"> / {item.unit === 'maund' ? 'মণ' : item.unit === 'kg' ? 'কেজি' : 'একক'}</span>
                          </td>
                          <td className="py-3 px-4 text-primaryText font-semibold">
                            ৳ {toBengaliDigits(item.retailPrice)} / {item.unit === 'maund' ? 'মণ' : item.unit === 'kg' ? 'কেজি' : 'একক'}
                          </td>
                          <td className="py-3 px-4 text-secondaryText text-[11px]">
                            ৳{toBengaliDigits(item.minPrice)} - ৳{toBengaliDigits(item.maxPrice)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-primaryText block">{item.marketLocation}</span>
                            <span className="text-[10px] text-mutedText">{item.district}</span>
                          </td>
                          <td className="py-3 px-4 text-[11px] text-mutedText">
                            {item.recordedTimestamp}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAlertProduct(item.productBn);
                                setAlertSector(item.sector);
                                setAlertDistrict(item.district);
                                setAlertTargetPrice(item.wholesalePrice);
                                setAlertUnit(item.unit);
                                setShowAlertModal(true);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-harvest-light text-harvest-dark hover:bg-harvest/30 transition"
                            >
                              + অ্যালার্ট
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
        </div>
      )}

      {/* SUBTAB 2: USER'S PRICE ALERTS */}
      {activeSubTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-forest-dark">আপনার সক্রিয় মূল্য সতর্কবার্তা তালিকা</h3>
              <p className="text-xs text-secondaryText">আড়তের দাম আপনার টার্গেট মূল্যে পৌঁছালে নোটিফিকেশন পাবেন</p>
            </div>
            <button
              onClick={() => setShowAlertModal(true)}
              className="btn-primary text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন অ্যালার্ট সেট করুন</span>
            </button>
          </div>

          {priceAlerts.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="কোনো প্রাইস অ্যালার্ট নেই"
              description="ধান, আলু, পেঁয়াজ বা মাছের কাঙ্ক্ষিত মূল্য নির্ধারণ করে অ্যালার্ট চালু করুন।"
              actionLabel="+ নতুন অ্যালার্ট যোগ করুন"
              onAction={() => setShowAlertModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {priceAlerts.map((alt) => (
                <div key={alt.id} className="card-premium p-4.5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-forest-dark">{alt.productName}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          alt.condition === 'at_or_above' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {alt.condition === 'at_or_above' ? '≥ বেশি হলে' : '≤ কম হলে'}
                        </span>
                      </div>
                      <p className="text-xs text-secondaryText mt-0.5">জেলা: {alt.district} • সূত্র: {alt.source}</p>
                    </div>

                    <button
                      onClick={() => deletePriceAlert(alt.id)}
                      className="text-mutedText hover:text-status-error p-1 rounded transition"
                      title="অ্যালার্ট মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-rice/70 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-secondaryText block">টার্গেট মূল্য:</span>
                      <span className="font-bold text-forest text-sm">
                        ৳ {toBengaliDigits(alt.targetPrice)} / {alt.unit === 'maund' ? 'মণ' : 'কেজি'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-secondaryText block">সাম্প্রতিক আড়ত দর:</span>
                      <span className="font-semibold text-primaryText">
                        ৳ {toBengaliDigits(alt.currentObservedPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-secondaryText">স্ট্যাটাস: <strong>{alt.isActive ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয়'}</strong></span>
                    <button
                      onClick={() => togglePriceAlert(alt.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        alt.isActive ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                      }`}
                    >
                      {alt.isActive ? 'সাময়িক বন্ধ রাখুন' : 'চালু করুন'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: SIMULATION TEST LAB */}
      {activeSubTab === 'simulation' && (
        <div className="card-premium p-5 space-y-4 max-w-2xl">
          <div className="flex items-center space-x-2 border-b border-softBorder pb-3">
            <Play className="w-5 h-5 text-river" />
            <div>
              <h3 className="text-sm font-bold text-forest-dark">মূল্য পরিবর্তন ও নোটিফিকেশন টেস্ট ল্যাব</h3>
              <p className="text-xs text-secondaryText">আড়তের দাম পরিবর্তিত হলে কীভাবে অ্যালার্ট ট্রিগার হয় তার বাস্তব প্রদর্শনী</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-river/10 border border-river/25 text-xs text-river-dark space-y-2">
            <p className="leading-relaxed">
              <strong>টেস্ট সিনারিও:</strong> আপনি ব্রি ধান-২৮ এর পাইকারি দর ৳ ১৩৫০ বা তার বেশিতে পৌঁছালে সতর্কবার্তা পাওয়ার জন্য অ্যালার্ট তৈরি করেছেন। নিচের ইনপুটে দর পরিবর্তন করে টেস্ট ট্রিগার করুন।
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-primaryText mb-1">পরীক্ষামূলক পণ্য নির্বাচন করুন</label>
              <select
                value={simTargetProductId}
                onChange={(e) => {
                  setSimTargetProductId(e.target.value);
                  const item = marketPrices.find(m => m.id === e.target.value);
                  if (item) setSimNewPrice(item.wholesalePrice + 40);
                }}
                className="input-field"
              >
                {marketPrices.map(m => (
                  <option key={m.id} value={m.id}>{m.productBn} ({m.district}) — বর্তমান পাইকারি: ৳{toBengaliDigits(m.wholesalePrice)}/{m.unit}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">সিমুলেটেড নতুন পাইকারি মূল্য (টাকা)</label>
              <input
                type="number"
                value={simNewPrice}
                onChange={(e) => setSimNewPrice(Number(e.target.value))}
                className="input-field"
              />
            </div>

            <button
              onClick={() => {
                simulatePriceUpdate(simTargetProductId, Number(simNewPrice));
              }}
              className="w-full btn-primary"
            >
              🚀 মূল্য হালনাগাদ প্রয়োগ করুন ও অ্যালার্ট ট্রিগার পরীক্ষা করুন
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CREATE PRICE ALERT */}
      <Modal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="নতুন মূল্য সতর্কবার্তা (Price Alert) সেট করুন"
        maxWidth="md"
      >
        <form onSubmit={handleCreateAlert} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-primaryText mb-1">পণ্যের নাম *</label>
            <input
              type="text"
              required
              value={alertProduct}
              onChange={(e) => setAlertProduct(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primaryText mb-1">টার্গেট মূল্য (টাকা) *</label>
              <input
                type="number"
                required
                value={alertTargetPrice}
                onChange={(e) => setAlertTargetPrice(Number(e.target.value))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">পরিমাপের একক</label>
              <select
                value={alertUnit}
                onChange={(e) => setAlertUnit(e.target.value as ProduceUnit)}
                className="input-field"
              >
                <option value="maund">মণ (৪০ কেজি)</option>
                <option value="kg">কেজি (Kilogram)</option>
                <option value="piece">পিস / হালি</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primaryText mb-1">শর্ত (Condition)</label>
              <select
                value={alertCondition}
                onChange={(e) => setAlertCondition(e.target.value as any)}
                className="input-field"
              >
                <option value="at_or_above">মূল্য সমান বা বেশি হলে (≥)</option>
                <option value="at_or_below">মূল্য সমান বা কম হলে (≤)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">লক্ষ্য জেলা</label>
              <select
                value={alertDistrict}
                onChange={(e) => setAlertDistrict(e.target.value)}
                className="input-field"
              >
                {BANGLADESH_DISTRICTS.map(d => (
                  <option key={d.name} value={d.name}>{d.name} ({d.nameBn})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-softBorder">
            <button
              type="button"
              onClick={() => setShowAlertModal(false)}
              className="btn-secondary text-xs"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="btn-primary text-xs"
            >
              অ্যালার্ট সক্রিয় করুন
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
