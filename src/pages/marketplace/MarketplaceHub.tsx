import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Plus, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Send, 
  DollarSign, 
  Printer, 
  Share2, 
  ShieldCheck, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Pause, 
  Play, 
  Phone, 
  X,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Info,
  Calendar,
  Layers,
  FileText,
  PackageCheck
} from 'lucide-react';
import { 
  MarketplaceListing, 
  NegotiationInquiry, 
  OrderRecord, 
  ProduceUnit, 
  QualityGrade, 
  SectorType, 
  ListingStatus 
} from '../../types';
import { BANGLADESH_DISTRICTS } from '../../data/bangladeshGeo';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatNumber, toBengaliDigits } from '../../utils/formatters';

export const MarketplaceHub: React.FC<{ initialSubTab?: string }> = ({ initialSubTab = 'explore' }) => {
  const { 
    language, 
    user, 
    listings, 
    addListing, 
    updateListing, 
    deleteListing, 
    toggleListingStatus,
    inquiries, 
    sendInquiry, 
    sendNegotiationMessage, 
    acceptOffer, 
    rejectOffer,
    orders, 
    updateOrderStatus,
    priceAlerts, 
    marketPrices,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(initialSubTab === 'sell' ? 'my_listings' : initialSubTab);

  // Filters state for Explore Products
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('latest');

  // Multi-step Listing Creation State (10-Step Wizard)
  const [showSellModal, setShowSellModal] = useState<boolean>(initialSubTab === 'sell');
  const [listingStep, setListingStep] = useState(1);
  const [sellSector, setSellSector] = useState<SectorType>('agriculture');
  const [sellCategory, setSellCategory] = useState('Rice & Paddy');
  const [sellName, setSellName] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellQuantity, setSellQuantity] = useState<number>(50);
  const [sellUnit, setSellUnit] = useState<ProduceUnit>('maund');
  const [sellPrice, setSellPrice] = useState<number>(1350);
  const [sellGrade, setSellGrade] = useState<QualityGrade>('Grade A (প্রিমিয়াম)');
  const [sellHarvestDate, setSellHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [sellAvailDate, setSellAvailDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [sellDistrict, setSellDistrict] = useState('Bogura');
  const [sellUpazila, setSellUpazila] = useState('Shibganj');
  const [sellVillage, setSellVillage] = useState('Gokul');
  const [sellImages, setSellImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
  ]);

  // Product Details Modal state
  const [selectedProductDetails, setSelectedProductDetails] = useState<MarketplaceListing | null>(null);

  // Send Offer / Purchase Inquiry Modal state
  const [offerListing, setOfferListing] = useState<MarketplaceListing | null>(null);
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [offerQty, setOfferQty] = useState<number>(10);
  const [offerNote, setOfferNote] = useState('');

  // Active Negotiation Chat State
  const [activeInquiryId, setActiveInquiryId] = useState<string>(inquiries[0]?.id || '');
  const [showMobileChat, setShowMobileChat] = useState<boolean>(false);
  const [chatInputText, setChatInputText] = useState('');
  const [counterPriceInput, setCounterPriceInput] = useState<number | ''>('');
  const [counterQtyInput, setCounterQtyInput] = useState<number | ''>('');

  // Digital Receipt Modal
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<OrderRecord | null>(null);

  // Delete listing confirmation
  const [deleteListingId, setDeleteListingId] = useState<string | null>(null);

  // Edit listing state
  const [editingListing, setEditingListing] = useState<MarketplaceListing | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editGrade, setEditGrade] = useState<any>('Grade A (প্রিমিয়াম)');
  const [editDescription, setEditDescription] = useState('');

  const handleOpenEditListing = (listing: MarketplaceListing) => {
    setEditingListing(listing);
    setEditPrice(listing.pricePerUnit);
    setEditQuantity(listing.quantity);
    setEditGrade(listing.qualityGrade);
    setEditDescription(listing.description);
  };

  const handleSaveListingEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    updateListing(editingListing.id, {
      pricePerUnit: Number(editPrice),
      quantity: Number(editQuantity),
      qualityGrade: editGrade,
      description: editDescription
    });

    setEditingListing(null);
  };

  // Regional wholesale benchmark comparison for the currently selected product in sell form
  const benchmarkItem = marketPrices.find(m => 
    m.product.toLowerCase().includes(sellName.toLowerCase()) || 
    m.productBn.includes(sellName) ||
    m.category === sellCategory
  ) || marketPrices[0];

  // Filtering products
  const filteredListings = listings.filter((l) => {
    if (l.status !== 'published') return false;

    const matchSearch = l.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        l.sellerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSector = selectedSector === 'all' || l.sector === selectedSector;
    const matchCategory = selectedCategory === 'all' || l.category === selectedCategory;
    const matchDistrict = selectedDistrict === 'all' || l.district === selectedDistrict;

    return matchSearch && matchSector && matchCategory && matchDistrict;
  }).sort((a, b) => {
    if (selectedSort === 'price_asc') return a.pricePerUnit - b.pricePerUnit;
    if (selectedSort === 'price_desc') return b.pricePerUnit - a.pricePerUnit;
    if (selectedSort === 'quantity') return b.quantity - a.quantity;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const myListings = listings.filter(l => l.sellerId === user.id);
  const currentInquiry = inquiries.find(i => i.id === activeInquiryId) || inquiries[0];

  const handlePublishListing = () => {
    if (!sellName.trim()) return;

    addListing({
      sellerId: user.id,
      sellerName: user.name,
      sellerPhone: user.phone,
      sellerType: 'Farmer',
      sellerVerified: user.isVerified,
      sector: sellSector,
      category: sellCategory,
      productName: sellName,
      description: sellDesc || 'সরাসরি নিজস্ব জমি/খামার থেকে উৎপাদিত সতেজ ও গুণমানসম্পন্ন ফসল।',
      quantity: Number(sellQuantity),
      unit: sellUnit,
      pricePerUnit: Number(sellPrice),
      wholesaleRefPrice: benchmarkItem ? benchmarkItem.wholesalePrice : undefined,
      qualityGrade: sellGrade,
      harvestDate: sellHarvestDate,
      availabilityDate: sellAvailDate,
      district: sellDistrict,
      upazila: sellUpazila,
      village: sellVillage,
      images: sellImages,
      status: 'published'
    });

    setShowSellModal(false);
    setListingStep(1);
    setActiveTab('my_listings');
  };

  const handleSendPurchaseInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerListing) return;

    sendInquiry({
      listingId: offerListing.id,
      productName: offerListing.productName,
      productImage: offerListing.images[0],
      sector: offerListing.sector,
      sellerId: offerListing.sellerId,
      sellerName: offerListing.sellerName,
      sellerPhone: offerListing.sellerPhone,
      buyerId: user.id,
      buyerName: user.name,
      buyerPhone: user.phone,
      buyerRole: 'Wholesale Buyer (ক্রয়কারী)',
      requestedQuantity: Number(offerQty),
      unit: offerListing.unit,
      initialOfferedPrice: Number(offerPrice),
      currentAgreedPrice: Number(offerPrice),
      status: 'pending'
    }, offerNote || `আসসালামু আলাইকুম। আমি আপনার ${offerListing.productName} ${offerQty} ${offerListing.unit} প্রতি ${offerListing.unit} ${offerPrice} টাকা দরে নিতে আগ্রহী।`);

    setOfferListing(null);
    setActiveTab('inquiries');
  };

  const handleSendMessageInChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim() && counterPriceInput === '') return;

    const offerUpdate = counterPriceInput !== '' ? {
      pricePerUnit: Number(counterPriceInput),
      quantity: counterQtyInput !== '' ? Number(counterQtyInput) : currentInquiry.requestedQuantity
    } : undefined;

    const messageText = chatInputText || (offerUpdate ? `কাউন্টার অফার: প্রতি ${currentInquiry.unit} ৳${offerUpdate.pricePerUnit} (পরিমাণ: ${offerUpdate.quantity} ${currentInquiry.unit})` : '');

    sendNegotiationMessage(currentInquiry.id, messageText, offerUpdate);

    setChatInputText('');
    setCounterPriceInput('');
    setCounterQtyInput('');
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-softBorder shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-clay-light text-clay-dark flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6 text-clay" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-forest-dark tracking-tight">
              {language === 'bn' ? 'সরাসরি কৃষি মার্কেটপ্লেস (Direct Marketplace)' : 'Direct Agricultural Marketplace'}
            </h1>
            <p className="text-xs sm:text-sm text-secondaryText mt-0.5">
              {language === 'bn' 
                ? 'মধ্যস্বত্বভোগী ছাড়া কৃষক-ক্রেতা সরাসরি সংযোগ, লাইভ দরদাম ও ডিজিটাল ডেলিভারি অর্ডার' 
                : 'Connecting farmers directly with wholesale buyers, live negotiations and verified digital receipts'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setListingStep(1);
            setShowSellModal(true);
          }}
          className="btn-clay self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন পণ্য বিক্রি করুন' : 'Sell Produce'}</span>
        </button>
      </div>

      {/* Unified Sub-Navigation Tabs */}
      <div className="flex items-center space-x-1.5 border-b border-softBorder overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
        {[
          { id: 'explore', labelBn: 'পণ্য অনুসন্ধান', labelEn: 'Explore Products', icon: Search },
          { id: 'my_listings', labelBn: `আমার বিজ্ঞাপন (${myListings.length})`, labelEn: `My Listings (${myListings.length})`, icon: Layers },
          { id: 'inquiries', labelBn: `দরদাম ও চ্যাট (${inquiries.length})`, labelEn: `Negotiations (${inquiries.length})`, icon: MessageSquare },
          { id: 'orders', labelBn: `অর্ডার ও রসিদ (${orders.length})`, labelEn: `Orders (${orders.length})`, icon: PackageCheck }
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

      {/* ======================================================== */}
      {/* TAB 1: EXPLORE PRODUCTS (Rich Multi-Filters & Discovery) */}
      {/* ======================================================== */}
      {activeTab === 'explore' && (
        <div className="space-y-5">
          
          {/* Filters Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-softBorder shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-mutedText" />
                <input
                  type="text"
                  placeholder="ফসলের নাম, বিবরণ বা বিক্রেতা দিয়ে খুঁজুন (যেমন: ধান, আলু, রুই মাছ)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-2 text-xs">
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="input-field w-auto font-medium"
                >
                  <option value="all">সকল সেক্টর</option>
                  <option value="agriculture">কৃষি (Crops)</option>
                  <option value="livestock">পশু ও ডেইরি (Livestock)</option>
                  <option value="fisheries">মৎস্য (Fisheries)</option>
                </select>

                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="input-field w-auto font-medium"
                >
                  <option value="all">সকল জেলা (All Districts)</option>
                  {BANGLADESH_DISTRICTS.map(d => (
                    <option key={d.name} value={d.name}>{d.name} ({d.nameBn})</option>
                  ))}
                </select>

                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="input-field w-auto font-medium"
                >
                  <option value="latest">সর্বশেষ বিজ্ঞাপিত</option>
                  <option value="price_asc">দাম: কম থেকে বেশি</option>
                  <option value="price_desc">দাম: বেশি থেকে কম</option>
                  <option value="quantity">পরিমাণ: সর্বোচ্চ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredListings.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="কোনো পণ্য পাওয়া যায়নি"
              description="অনুগ্রহ করে ফিল্টার বা অনুসন্ধানের শব্দ পরিবর্তন করে পুনরায় চেষ্টা করুন।"
              actionLabel="ফিল্টার রিসেট করুন"
              onAction={() => {
                setSearchTerm('');
                setSelectedSector('all');
                setSelectedDistrict('all');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredListings.map((prod) => (
                <div 
                  key={prod.id} 
                  className="card-premium overflow-hidden flex flex-col justify-between group hover:border-forest/40"
                >
                  <div>
                    {/* Image with Badges */}
                    <div className="relative h-48 overflow-hidden bg-rice">
                      <img 
                        src={prod.images[0]} 
                        alt={prod.productName} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-forest/90 text-white backdrop-blur-xs">
                          {prod.qualityGrade}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-forest-dark backdrop-blur-xs uppercase shadow-2xs">
                          {prod.sector}
                        </span>
                      </div>
                      
                      {/* Price Tag Pill */}
                      <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-forest-900/90 text-white backdrop-blur-xs shadow-md">
                        <span className="text-sm font-black text-warmWhite">
                          {formatCurrency(prod.pricePerUnit, language)}
                        </span>
                        <span className="text-[10px] text-rice/80 ml-0.5">/ {prod.unit}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 space-y-2.5">
                      <div className="flex items-center text-xs text-secondaryText">
                        <MapPin className="w-3.5 h-3.5 text-clay shrink-0 mr-1" />
                        <span className="truncate">{prod.village}, {prod.upazila}, {prod.district}</span>
                      </div>

                      <h3 className="text-base font-bold text-forest-dark line-clamp-1 group-hover:text-forest transition">
                        {prod.productName}
                      </h3>

                      <p className="text-xs text-secondaryText line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>

                      <div className="pt-2 border-t border-softBorder flex items-center justify-between text-xs">
                        <span className="text-secondaryText">উপলব্ধ পরিমাণ:</span>
                        <span className="font-bold text-primaryText">
                          {toBengaliDigits(prod.quantity)} {prod.unit}
                        </span>
                      </div>

                      {/* Wholesale Benchmark Compare */}
                      {prod.wholesaleRefPrice && (
                        <div className="p-2 rounded-xl bg-rice text-[11px] flex items-center justify-between">
                          <span className="text-secondaryText">আড়তের রেফারেন্স দর:</span>
                          <span className="font-bold text-harvest-dark">
                            ৳ {toBengaliDigits(prod.wholesaleRefPrice)} / {prod.unit}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-secondaryText pt-1">
                        <span>বিক্রেতা: <strong className="text-forest-dark">{prod.sellerName}</strong></span>
                        {prod.sellerVerified && <span className="text-status-success font-bold text-[11px]">✓ ভেরিফাইড</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 sm:p-5 pt-0 flex space-x-2">
                    <button
                      onClick={() => setSelectedProductDetails(prod)}
                      className="btn-secondary flex-1"
                    >
                      বিস্তারিত দেখুন
                    </button>
                    <button
                      onClick={() => {
                        setOfferListing(prod);
                        setOfferPrice(prod.pricePerUnit);
                        setOfferQty(Math.min(10, prod.quantity));
                      }}
                      className="btn-primary flex-1"
                    >
                      দরদাম ও প্রস্তাব
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MY LISTINGS (Manage, Pause, Edit, Delete)           */}
      {/* ======================================================== */}
      {activeTab === 'my_listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-forest-dark">আমার বিজ্ঞাপিত ফসল ও পণ্যসমূহ ({myListings.length})</h3>
            <button
              onClick={() => {
                setListingStep(1);
                setShowSellModal(true);
              }}
              className="btn-clay"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন লিস্টিং তৈরি</span>
            </button>
          </div>

          {myListings.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="আপনি এখনো কোনো পণ্য বিক্রি বা বিজ্ঞাপিত করেননি"
              description="আপনার জমির ধান, আলু, গবাদিপশু বা মাছ সরাসরি পাইকারি ক্রেতাদের নিকট বিক্রি করতে নতুন বিজ্ঞাপন দিন।"
              actionLabel="পণ্য বিক্রি শুরু করুন"
              onAction={() => {
                setListingStep(1);
                setShowSellModal(true);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myListings.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 rounded-2xl bg-white border border-softBorder shadow-2xs flex space-x-4">
                  <img src={item.images[0]} alt={item.productName} className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-softBorder shrink-0" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <StatusBadge status={item.status} size="sm" />
                        <span className="text-[11px] text-mutedText">{item.createdAt}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-forest-dark mt-1 line-clamp-1">{item.productName}</h4>
                      <p className="text-xs sm:text-sm font-bold text-forest mt-0.5">
                        {formatCurrency(item.pricePerUnit, language)} / {item.unit}
                      </p>
                      <p className="text-xs text-secondaryText mt-1">
                        মজুদ: <strong>{toBengaliDigits(item.quantity)} {item.unit}</strong> • {item.qualityGrade}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-softBorder/60">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleListingStatus(item.id, item.status === 'published' ? 'paused' : 'published')}
                          className="text-xs font-bold text-secondaryText hover:text-primaryText flex items-center space-x-1"
                        >
                          {item.status === 'published' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{item.status === 'published' ? 'বিজ্ঞাপন স্থগিত' : 'সক্রিয় করুন'}</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditListing(item)}
                          className="text-xs font-bold text-forest hover:underline flex items-center space-x-1"
                          title="বিজ্ঞাপন সম্পাদনা করুন"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>সম্পাদনা</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setDeleteListingId(item.id)}
                        className="p-1.5 text-mutedText hover:text-status-error transition rounded-lg"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: INQUIRIES, BIDDING & NEGOTIATION (Core Workflow!)   */}
      {/* ======================================================== */}
      {activeTab === 'inquiries' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Inquiries List Column */}
          <div className={`space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-softBorder shadow-2xs h-[600px] overflow-y-auto ${
            showMobileChat ? 'hidden lg:block' : 'block'
          }`}>
            <h3 className="text-xs font-bold text-forest-dark uppercase tracking-wider mb-2">
              দরদাম আলোচনা ({inquiries.length})
            </h3>

            {inquiries.length === 0 ? (
              <p className="text-xs text-secondaryText text-center py-8">কোনো চলমান দরদাম আলোচনা নেই।</p>
            ) : (
              inquiries.map((inq) => {
                const isSelected = inq.id === activeInquiryId;
                return (
                  <div
                    key={inq.id}
                    onClick={() => {
                      setActiveInquiryId(inq.id);
                      setShowMobileChat(true);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-1 active:scale-[0.99] ${
                      isSelected ? 'bg-forest-50 border-forest text-forest-dark font-medium shadow-2xs' : 'bg-warmWhite border-softBorder text-primaryText hover:bg-rice'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold truncate max-w-[130px]">{inq.buyerName}</span>
                      <StatusBadge status={inq.status} size="sm" />
                    </div>
                    <p className="font-bold text-forest-dark truncate">{inq.productName}</p>
                    <div className="flex items-center justify-between text-[11px] text-secondaryText pt-1">
                      <span>প্রস্তাব: <strong>৳ {toBengaliDigits(inq.currentAgreedPrice)}</strong>/{inq.unit}</span>
                      <span>{toBengaliDigits(inq.requestedQuantity)} {inq.unit}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Active Chat & Negotiation Room */}
          <div className={`lg:col-span-2 bg-white rounded-2xl border border-softBorder shadow-2xs overflow-hidden flex flex-col h-[600px] ${
            !showMobileChat ? 'hidden lg:flex' : 'flex'
          }`}>
            {currentInquiry ? (
              <>
                {/* Negotiation Header */}
                <div className="bg-gradient-to-r from-forest-900 to-forest-dark text-white p-4 sm:p-5 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5 sm:space-x-3">
                    <button
                      onClick={() => setShowMobileChat(false)}
                      className="lg:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition shrink-0 flex items-center"
                      title="আলোচনা তালিকায় ফিরে যান"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold shrink-0">
                      <MessageSquare className="w-5 h-5 text-forest-leaf" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold truncate max-w-[180px] sm:max-w-none">{currentInquiry.productName}</h4>
                      <p className="text-[11px] sm:text-xs text-rice/80 truncate max-w-[180px] sm:max-w-none">
                        ক্রেতা: {currentInquiry.buyerName} • ফোন: {currentInquiry.buyerPhone}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-rice/70 block">বর্তমান প্রস্তাবিত দর</span>
                    <span className="text-sm sm:text-lg font-black text-harvest">
                      ৳ {toBengaliDigits(currentInquiry.currentAgreedPrice)} / {currentInquiry.unit}
                    </span>
                  </div>
                </div>

                {/* Offer Action Banner (Accept / Reject / Counter) */}
                <div className="p-3.5 bg-warmWhite border-b border-softBorder flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-secondaryText">চাহিদাকৃত পরিমাণ:</span>
                    <span className="font-bold text-forest-dark">
                      {toBengaliDigits(currentInquiry.requestedQuantity)} {currentInquiry.unit}
                    </span>
                    <span className="text-mutedText">|</span>
                    <span className="text-secondaryText">মোট মূল্য:</span>
                    <span className="font-bold text-forest">
                      {formatCurrency(currentInquiry.currentAgreedPrice * currentInquiry.requestedQuantity, language)}
                    </span>
                  </div>

                  {currentInquiry.status !== 'accepted' && currentInquiry.status !== 'ordered' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => rejectOffer(currentInquiry.id)}
                        className="px-3.5 py-1.5 rounded-xl border border-red-300 text-status-error hover:bg-red-50 text-xs font-bold transition"
                      >
                        প্রত্যাখ্যান
                      </button>
                      <button
                        onClick={() => acceptOffer(currentInquiry.id)}
                        className="btn-primary text-xs py-1.5"
                      >
                        ✓ অফার গ্রহণ করুন
                      </button>
                    </div>
                  )}

                  {currentInquiry.status === 'accepted' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-status-success font-bold text-xs">
                      ✓ অফার গৃহীত হয়েছে — অর্ডার ও ডিজিটাল রসিদ প্রস্তুত
                    </span>
                  )}
                </div>

                {/* Messages Chat Flow */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-rice/20">
                  {currentInquiry.messages.map((msg) => {
                    const isMe = msg.senderId === user.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm space-y-1.5 ${
                          isMe ? 'bg-forest text-white rounded-br-xs' : 'bg-white border border-softBorder text-primaryText rounded-bl-xs shadow-2xs'
                        }`}>
                          <div className={`flex items-center justify-between text-[10px] sm:text-[11px] pb-1 border-b ${
                            isMe ? 'border-white/20 text-rice/80' : 'border-softBorder text-mutedText'
                          }`}>
                            <span className="font-bold">{msg.senderName}</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                          {msg.offerUpdate && (
                            <div className={`p-2.5 rounded-xl mt-1 text-xs font-bold ${
                              isMe ? 'bg-black/25 text-white' : 'bg-amber-50 text-amber-900 border border-amber-200'
                            }`}>
                              দর আপডেট: ৳{toBengaliDigits(msg.offerUpdate.pricePerUnit)} / {currentInquiry.unit} (পরিমাণ: {toBengaliDigits(msg.offerUpdate.quantity)} {currentInquiry.unit})
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Counter Offer & Message Input Form */}
                <form onSubmit={handleSendMessageInChat} className="p-3.5 bg-white border-t border-softBorder space-y-2.5">
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs">
                    <span className="text-[11px] text-mutedText font-semibold shrink-0">কাউন্টার অফার দিন (ঐচ্ছিক):</span>
                    <div className="flex items-center space-x-2 flex-1 w-full sm:w-auto">
                      <input
                        type="number"
                        placeholder={`নতুন দর ৳/${currentInquiry.unit}`}
                        value={counterPriceInput}
                        onChange={(e) => setCounterPriceInput(e.target.value === '' ? '' : Number(e.target.value))}
                        className="input-field flex-1 sm:w-32 py-1.5 text-xs font-bold"
                      />
                      <input
                        type="number"
                        placeholder={`পরিমাণ (${currentInquiry.unit})`}
                        value={counterQtyInput}
                        onChange={(e) => setCounterQtyInput(e.target.value === '' ? '' : Number(e.target.value))}
                        className="input-field flex-1 sm:w-28 py-1.5 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="বার্তা লিখুন..."
                      value={chatInputText}
                      onChange={(e) => setChatInputText(e.target.value)}
                      className="input-field"
                    />
                    <button
                      type="submit"
                      className="btn-primary shrink-0 min-h-[42px] px-4"
                    >
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">পাঠান</span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <EmptyState
                icon={MessageSquare}
                title="কোনো দরদাম আলোচনা নির্বাচিত নেই"
                description="বামপাশের তালিকা থেকে আলোচনা নির্বাচন করুন অথবা এক্সপ্লোর থেকে যেকোনো পণ্যে প্রস্তাব পাঠান।"
              />
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: ORDERS & DIGITAL RECEIPTS (Working Lifecycle)      */}
      {/* ======================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-forest-dark">অর্ডার ও ডিজিটাল বিক্রয় রসিদ ({orders.length})</h3>
            <span className="text-xs text-secondaryText">পেমেন্ট ব্যবস্থা: ক্যাশ অন পিকআপ / ডেলিভারি</span>
          </div>

          {orders.length === 0 ? (
            <EmptyState
              icon={PackageCheck}
              title="কোনো নিশ্চিতকৃত অর্ডার নেই"
              description="দরদাম চূড়ান্ত হয়ে অফার গৃহীত হলে স্বয়ংক্রিয়ভাবে এখানে ডিজিটাল অর্ডার ও রসিদ তৈরি হবে।"
            />
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="p-5 sm:p-6 rounded-2xl bg-white border border-softBorder shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-softBorder gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-forest-dark bg-rice px-2.5 py-1 rounded-md">{ord.receiptNumber}</span>
                        <StatusBadge status={ord.status} size="sm" />
                      </div>
                      <h4 className="text-base font-bold text-forest-dark mt-1.5">{ord.productName}</h4>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-mutedText block">অর্ডারের মোট মূল্য</span>
                      <span className="text-xl font-black text-forest">
                        {formatCurrency(ord.totalOrderValue, language)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                    <div>
                      <span className="text-secondaryText block">ক্রেতা:</span>
                      <span className="font-bold text-primaryText">{ord.buyerName}</span>
                      <p className="text-xs text-mutedText">{ord.buyerPhone}</p>
                    </div>
                    <div>
                      <span className="text-secondaryText block">পরিমাণ ও দর:</span>
                      <span className="font-bold text-primaryText">
                        {toBengaliDigits(ord.quantity)} {ord.unit} @ ৳{toBengaliDigits(ord.agreedPricePerUnit)}
                      </span>
                    </div>
                    <div>
                      <span className="text-secondaryText block">পেমেন্ট মেথড:</span>
                      <span className="font-bold text-clay-dark">{ord.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-secondaryText block">প্রত্যাশিত পিকআপ:</span>
                      <span className="font-semibold text-primaryText">{toBengaliDigits(ord.expectedDate)}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-rice text-xs text-secondaryText flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span>পিকআপ অবস্থান: <strong className="text-forest-dark">{ord.pickupLocation}</strong></span>
                    <span>অর্ডারের তারিখ: {toBengaliDigits(ord.orderDate)}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-softBorder">
                    <button
                      onClick={() => setSelectedReceiptOrder(ord)}
                      className="btn-secondary text-xs py-2"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>ডিজিটাল রসিদ দেখুন / প্রিন্ট</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      {ord.status === 'accepted' && (
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'ready_for_pickup')}
                          className="px-4 py-2 rounded-xl bg-river hover:bg-river-dark text-white text-xs font-bold transition shadow-xs"
                        >
                          পিকআপের জন্য প্রস্তুত করুন
                        </button>
                      )}
                      {ord.status === 'ready_for_pickup' && (
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'completed')}
                          className="btn-primary text-xs py-2"
                        >
                          ✓ ডেলিভারি ও পেমেন্ট সম্পন্ন
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* PRODUCT DETAILS MODAL (High-Resolution View)             */}
      {/* ======================================================== */}
      {selectedProductDetails && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedProductDetails(null)}
          title={selectedProductDetails.productName}
          subtitle={`${selectedProductDetails.category} • ${selectedProductDetails.district}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs sm:text-sm">
            {/* Gallery Image */}
            <div className="relative h-64 rounded-2xl overflow-hidden bg-rice border border-softBorder">
              <img 
                src={selectedProductDetails.images[0]} 
                alt={selectedProductDetails.productName} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex space-x-1.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-forest text-white shadow">
                  {selectedProductDetails.qualityGrade}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-forest-dark uppercase shadow">
                  {selectedProductDetails.sector}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-bold text-forest-dark mb-1">ফসলের বিবরণ:</h4>
              <p className="text-secondaryText leading-relaxed">{selectedProductDetails.description}</p>
            </div>

            {/* Product Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-rice border border-softBorder text-xs">
              <div>
                <span className="text-mutedText block">বিক্রয় মূল্য</span>
                <span className="text-base font-black text-forest">
                  ৳ {toBengaliDigits(selectedProductDetails.pricePerUnit)}
                </span>
                <span className="text-[10px] text-secondaryText"> / {selectedProductDetails.unit}</span>
              </div>
              <div>
                <span className="text-mutedText block">উপলব্ধ পরিমাণ</span>
                <span className="text-base font-bold text-primaryText">
                  {toBengaliDigits(selectedProductDetails.quantity)} {selectedProductDetails.unit}
                </span>
              </div>
              <div>
                <span className="text-mutedText block">উত্তোলনের তারিখ</span>
                <span className="font-semibold text-primaryText">{toBengaliDigits(selectedProductDetails.harvestDate)}</span>
              </div>
              <div>
                <span className="text-mutedText block">সরবরাহ প্রস্তুত</span>
                <span className="font-semibold text-primaryText">{toBengaliDigits(selectedProductDetails.availabilityDate)}</span>
              </div>
            </div>

            {/* Seller Info Card */}
            <div className="p-4 rounded-xl border border-softBorder flex items-center justify-between bg-warmWhite">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-forest-dark text-sm">{selectedProductDetails.sellerName}</span>
                  {selectedProductDetails.sellerVerified && (
                    <span className="text-status-success font-bold text-xs">✓ ভেরিফাইড কৃষক</span>
                  )}
                </div>
                <p className="text-xs text-secondaryText mt-0.5">
                  {selectedProductDetails.village}, {selectedProductDetails.upazila}, {selectedProductDetails.district}
                </p>
              </div>

              <a
                href={`tel:${selectedProductDetails.sellerPhone}`}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-forest/10 hover:bg-forest text-forest hover:text-white font-bold text-xs transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{selectedProductDetails.sellerPhone}</span>
              </a>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-softBorder">
              <button
                type="button"
                onClick={() => setSelectedProductDetails(null)}
                className="btn-secondary"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={() => {
                  const prod = selectedProductDetails;
                  setSelectedProductDetails(null);
                  setOfferListing(prod);
                  setOfferPrice(prod.pricePerUnit);
                  setOfferQty(Math.min(10, prod.quantity));
                }}
                className="btn-primary"
              >
                দরদাম ও অফার পাঠান
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ======================================================== */}
      {/* 10-STEP SELL PRODUCE WIZARD MODAL                        */}
      {/* ======================================================== */}
      <Modal
        isOpen={showSellModal}
        onClose={() => setShowSellModal(false)}
        title={language === 'bn' ? 'মার্কেটপ্লেসে ফসল বিক্রি (Sell Produce Wizard)' : 'Sell Produce Wizard'}
        subtitle={`ধাপ ${listingStep} / ১০`}
        maxWidth="2xl"
      >
        <div className="space-y-4">

          {/* Step 1: Sector */}
          {listingStep === 1 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-forest-dark">ধাপ ১: ফসলের খাত (Sector) নির্বাচন করুন</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'agriculture', label: 'কৃষি ও শস্য (Crops)' },
                  { id: 'livestock', label: 'পশু ও দুগ্ধ (Livestock)' },
                  { id: 'fisheries', label: 'তাজা মাছ (Fisheries)' }
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSellSector(s.id as SectorType)}
                    className={`p-4 rounded-xl border text-xs sm:text-sm font-bold transition text-center ${
                      sellSector === s.id ? 'bg-forest text-white border-forest shadow-xs' : 'bg-rice text-primaryText border-softBorder'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Category */}
          {listingStep === 2 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-forest-dark">ধাপ ২: পণ্য ক্যাটাগরি নির্বাচন</h4>
              <select
                value={sellCategory}
                onChange={(e) => setSellCategory(e.target.value)}
                className="input-field"
              >
                {sellSector === 'agriculture' && (
                  <>
                    <option value="Rice & Paddy">ধান ও চাল (Rice & Paddy)</option>
                    <option value="Potatoes">গোল আলু (Potatoes)</option>
                    <option value="Vegetables">তাজা সবজি (Fresh Vegetables)</option>
                    <option value="Maize">ভুট্টা ও দানাদার শস্য</option>
                  </>
                )}
                {sellSector === 'livestock' && (
                  <>
                    <option value="Cattle">গরু / ষাঁড় (Cattle)</option>
                    <option value="Goats">ছাগল / খাসি (Goats)</option>
                    <option value="Milk">খাঁটি তরল দুধ (Fresh Milk)</option>
                  </>
                )}
                {sellSector === 'fisheries' && (
                  <>
                    <option value="Rui">রুই মাছ (Rui)</option>
                    <option value="Katla">কাতলা মাছ (Katla)</option>
                    <option value="Tilapia">তেলাপিয়া (Tilapia)</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* Step 3: Product Info */}
          {listingStep === 3 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-forest-dark">ধাপ ৩: পণ্যের নাম ও বিবরণ</h4>
              <div>
                <label className="block text-xs font-bold text-primaryText mb-1">পণ্যের পূর্ণ নাম *</label>
                <input
                  type="text"
                  placeholder="যেমন: প্রিমিয়াম শুকনা ব্রি ধান-২৮"
                  value={sellName}
                  onChange={(e) => setSellName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primaryText mb-1">বিবরণ (Description)</label>
                <textarea
                  rows={3}
                  placeholder="ফসলের আর্দ্রতা, গুণগত মান ও প্যাকিং সম্পর্কে লিখুন..."
                  value={sellDesc}
                  onChange={(e) => setSellDesc(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {listingStep === 4 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-forest-dark">ধাপ ৪: পণ্যের ছবি</h4>
              <p className="text-xs text-secondaryText">বাস্তবমুখী ছবি ক্রেতার আস্থা বৃদ্ধি করে।</p>
              <div className="grid grid-cols-2 gap-3">
                <img src={sellImages[0]} alt="Selected" className="w-full h-36 object-cover rounded-xl border border-softBorder" />
                <div className="flex flex-col items-center justify-center border border-dashed border-softBorder rounded-xl bg-rice p-4 text-center text-xs text-secondaryText">
                  <span>+ ছবি নির্বাচন সম্পন্ন</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Quantity & Measurement Unit */}
          {listingStep === 5 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-forest-dark">ধাপ ৫: মোট পরিমাণ ও একক</h4>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="1"
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(Number(e.target.value))}
                  className="input-field w-2/3 font-bold"
                />
                <select
                  value={sellUnit}
                  onChange={(e) => setSellUnit(e.target.value as ProduceUnit)}
                  className="input-field w-1/3 font-bold"
                >
                  <option value="maund">মণ (Maund)</option>
                  <option value="kg">কেজি (Kg)</option>
                  <option value="quintal">কুইন্টাল (Quintal)</option>
                </select>
              </div>
              <p className="text-[11px] text-mutedText">১ মণ = ৪০ কেজি (স্ট্যান্ডার্ড বাংলাদেশী পরিমাপ)</p>
            </div>
          )}

          {/* Step 6: Expected Price with Smart Wholesale Benchmark Reference */}
          {listingStep === 6 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-forest-dark">ধাপ ৬: প্রত্যাশিত বিক্রয় মূল্য ও বাজার দর যাচাই</h4>
              
              {/* Benchmark Reference Card */}
              {benchmarkItem && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>{benchmarkItem.marketLocation} এর রেফারেন্স দর:</span>
                    <span>৳ {toBengaliDigits(benchmarkItem.wholesalePrice)} / {benchmarkItem.unit}</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    রেঞ্জ: ৳{toBengaliDigits(benchmarkItem.minPrice)} - ৳{toBengaliDigits(benchmarkItem.maxPrice)} • উৎস: {benchmarkItem.source}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-primaryText mb-1">
                  আপনার প্রত্যাশিত দর (টাকা প্রতি {sellUnit}) *
                </label>
                <input
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(Number(e.target.value))}
                  className="input-field font-bold text-forest text-base"
                />
              </div>
            </div>
          )}

          {/* Step 7: Quality Grade */}
          {listingStep === 7 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-forest-dark">ধাপ ৭: গুণমান গ্রেড নির্বাচন</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Grade A (প্রিমিয়াম)',
                  'Grade B (স্ট্যান্ডার্ড)',
                  'Standard (সাধারণ)',
                  'Export Quality (রপ্তানি মান)'
                ].map(grade => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setSellGrade(grade as QualityGrade)}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-bold transition text-left ${
                      sellGrade === grade ? 'bg-forest text-white border-forest shadow-xs' : 'bg-rice text-primaryText'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 8: Harvest & Availability Dates */}
          {listingStep === 8 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-forest-dark">ধাপ ৮: উত্তোলন ও সরবরাহের তারিখ</h4>
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-primaryText mb-1">উত্তোলনের তারিখ</label>
                  <input
                    type="date"
                    value={sellHarvestDate}
                    onChange={(e) => setSellHarvestDate(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block font-bold text-primaryText mb-1">কবে থেকে ডেলিভারি প্রস্তুত</label>
                  <input
                    type="date"
                    value={sellAvailDate}
                    onChange={(e) => setSellAvailDate(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 9: Location */}
          {listingStep === 9 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-forest-dark">ধাপ ৯: সংগ্রহের অবস্থান (পিকআপ লোকেশন)</h4>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-primaryText mb-1">জেলা</label>
                  <input
                    type="text"
                    value={sellDistrict}
                    onChange={(e) => setSellDistrict(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block font-bold text-primaryText mb-1">উপজেলা</label>
                  <input
                    type="text"
                    value={sellUpazila}
                    onChange={(e) => setSellUpazila(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-primaryText mb-1">গ্রাম ও চাতাল</label>
                  <input
                    type="text"
                    value={sellVillage}
                    onChange={(e) => setSellVillage(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 10: Preview & Publish */}
          {listingStep === 10 && (
            <div className="space-y-3 text-xs sm:text-sm">
              <h4 className="text-sm font-bold text-forest-dark">ধাপ ১০: লিস্টিং চূড়ান্ত প্রিভিউ</h4>
              <div className="p-4 rounded-xl bg-rice space-y-2">
                <p><strong>পণ্যের নাম:</strong> {sellName || 'ব্রি ধান-২৮'}</p>
                <p><strong>সেক্টর ও ক্যাটাগরি:</strong> {sellSector} • {sellCategory}</p>
                <p><strong>পরিমাণ:</strong> {toBengaliDigits(sellQuantity)} {sellUnit}</p>
                <p><strong>মূল্য:</strong> ৳ {toBengaliDigits(sellPrice)} / {sellUnit}</p>
                <p><strong>গুণমান:</strong> {sellGrade}</p>
                <p><strong>লোকেশন:</strong> {sellVillage}, {sellUpazila}, {sellDistrict}</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-softBorder">
            <button
              type="button"
              disabled={listingStep === 1}
              onClick={() => setListingStep(prev => Math.max(1, prev - 1))}
              className="btn-secondary"
            >
              পূর্ববর্তী
            </button>

            {listingStep < 10 ? (
              <button
                type="button"
                onClick={() => setListingStep(prev => Math.min(10, prev + 1))}
                className="btn-primary"
              >
                পরবর্তী ধাপ
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublishListing}
                className="btn-clay"
              >
                ✓ মার্কেটপ্লেসে প্রকাশ করুন
              </button>
            )}
          </div>

        </div>
      </Modal>

      {/* ======================================================== */}
      {/* SEND OFFER / PURCHASE INQUIRY MODAL                       */}
      {/* ======================================================== */}
      {offerListing && (
        <Modal
          isOpen={true}
          onClose={() => setOfferListing(null)}
          title="ক্রয় প্রস্তাব ও দরদাম পাঠান"
          subtitle={`${offerListing.productName} • বিক্রেতা: ${offerListing.sellerName}`}
          maxWidth="md"
        >
          <form onSubmit={handleSendPurchaseInquiry} className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-rice space-y-1.5">
              <div className="flex justify-between">
                <span className="text-secondaryText">বিক্রেতার চাওয়া দর:</span>
                <span className="font-bold text-forest">৳ {toBengaliDigits(offerListing.pricePerUnit)} / {offerListing.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondaryText">উপলব্ধ মোট স্টক:</span>
                <span className="font-semibold text-primaryText">{toBengaliDigits(offerListing.quantity)} {offerListing.unit}</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">
                আপনার প্রস্তাবিত দর (টাকা প্রতি {offerListing.unit}) *
              </label>
              <input
                type="number"
                required
                value={offerPrice}
                onChange={(e) => setOfferPrice(Number(e.target.value))}
                className="input-field font-bold text-forest"
              />
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">
                প্রয়োজনীয় পরিমাণ ({offerListing.unit}) *
              </label>
              <input
                type="number"
                required
                min="1"
                max={offerListing.quantity}
                value={offerQty}
                onChange={(e) => setOfferQty(Number(e.target.value))}
                className="input-field font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">বার্তা বা পরিবহণ সংক্রান্ত নোট</label>
              <textarea
                rows={2}
                value={offerNote}
                onChange={(e) => setOfferNote(e.target.value)}
                placeholder="যেমন: নিজস্ব ট্রাকে এসে মহাস্থান চাতাল থেকে ক্যাশ অন পিকআপে নেব..."
                className="input-field"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-softBorder">
              <button
                type="button"
                onClick={() => setOfferListing(null)}
                className="btn-secondary"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                প্রস্তাব প্রেরণ করুন
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ======================================================== */}
      {/* DIGITAL ORDER RECEIPT PRINTABLE MODAL                    */}
      {/* ======================================================== */}
      {selectedReceiptOrder && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReceiptOrder(null)}
          title="ডিজিটাল ডেলিভারি ও বিক্রয় রসিদ"
          maxWidth="lg"
        >
          <div id="printable-receipt" className="space-y-4 p-5 border border-softBorder rounded-2xl bg-white text-xs sm:text-sm">
            {/* Receipt Header */}
            <div className="flex items-center justify-between border-b border-softBorder pb-4">
              <div>
                <span className="font-extrabold text-xl text-forest-dark">Agro<span className="text-forest-leaf">Nex</span></span>
                <p className="text-[11px] text-mutedText">বাংলাদেশ ডিজিটাল কৃষি বিপণন ও সরাসরি ইকোসিস্টেম</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-primaryText bg-rice px-2.5 py-1 rounded-md">{selectedReceiptOrder.receiptNumber}</span>
                <p className="text-xs text-mutedText mt-1">তারিখ: {selectedReceiptOrder.orderDate}</p>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-4 py-3 border-b border-softBorder">
              <div>
                <span className="text-[10px] uppercase font-bold text-mutedText block">বিক্রেতা (Farmer/Seller)</span>
                <p className="font-bold text-forest-dark text-sm">{selectedReceiptOrder.sellerName}</p>
                <p className="text-secondaryText">{selectedReceiptOrder.sellerPhone}</p>
                <p className="text-xs text-mutedText mt-1">{selectedReceiptOrder.pickupLocation}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-mutedText block">ক্রেতা (Wholesale Buyer)</span>
                <p className="font-bold text-forest-dark text-sm">{selectedReceiptOrder.buyerName}</p>
                <p className="text-secondaryText">{selectedReceiptOrder.buyerPhone}</p>
                <p className="text-xs text-mutedText mt-1">পেমেন্ট মেথড: {selectedReceiptOrder.paymentMethod}</p>
              </div>
            </div>

            {/* Order Item Table */}
            <table className="w-full text-left">
              <thead>
                <tr className="bg-rice border-y border-softBorder text-secondaryText font-bold">
                  <th className="py-2.5 px-3">পণ্যের বিবরণ</th>
                  <th className="py-2.5 px-3">পরিমাণ</th>
                  <th className="py-2.5 px-3">একক দর</th>
                  <th className="py-2.5 px-3 text-right">মোট মূল্য</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-3 font-bold text-forest-dark">{selectedReceiptOrder.productName}</td>
                  <td className="py-3 px-3">{toBengaliDigits(selectedReceiptOrder.quantity)} {selectedReceiptOrder.unit}</td>
                  <td className="py-3 px-3">৳ {toBengaliDigits(selectedReceiptOrder.agreedPricePerUnit)}</td>
                  <td className="py-3 px-3 text-right font-black text-forest text-base">
                    {formatCurrency(selectedReceiptOrder.totalOrderValue, language)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Terms & Signatures */}
            <div className="pt-4 border-t border-softBorder flex items-center justify-between text-xs text-mutedText">
              <div>
                <p>পণ্য যাচাই ও ওজন নিশ্চিতকরণের পর ক্যাশ অর্থ পরিশোধিত হবে।</p>
                <p className="font-mono text-[10px] text-forest font-semibold mt-0.5">Verification Hash: AGX-SEC-{selectedReceiptOrder.id}-VERIFIED</p>
              </div>
              <div className="text-center border-t border-dashed border-mutedText pt-2 px-6">
                <span className="font-semibold text-primaryText">অনুমোদিত স্বাক্ষর</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3">
            <button
              onClick={() => window.print()}
              className="btn-primary"
            >
              <Printer className="w-4 h-4" />
              <span>রসিদ প্রিন্ট করুন</span>
            </button>
          </div>
        </Modal>
      )}

      {/* MODAL: EDIT LISTING */}
      {editingListing && (
        <Modal
          isOpen={true}
          onClose={() => setEditingListing(null)}
          title={`বিজ্ঞাপন সম্পাদনা — ${editingListing.productName}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveListingEdit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-primaryText mb-1">
                  বিক্রয় দর (টাকা প্রতি {editingListing.unit}) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="input-field font-bold text-forest"
                />
              </div>

              <div>
                <label className="block font-bold text-primaryText mb-1">
                  উপলব্ধ পরিমাণ ({editingListing.unit}) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(Number(e.target.value))}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">গুণমান গ্রেড</label>
              <select
                value={editGrade}
                onChange={(e) => setEditGrade(e.target.value as any)}
                className="input-field"
              >
                <option value="Grade A (প্রিমিয়াম)">গ্রেড এ (প্রিমিয়াম ও বাছাইকৃত)</option>
                <option value="Grade B (স্ট্যান্ডার্ড)">গ্রেড বি (স্ট্যান্ডার্ড বাজার মান)</option>
                <option value="Standard (সাধারণ)">সাধারণ পাইকারি মান</option>
                <option value="Export Quality (রপ্তানি মান)">রপ্তানি মান (Export Quality)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-primaryText mb-1">পণ্যের অতিরিক্ত বিবরণ</label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="input-field resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-softBorder">
              <button
                type="button"
                onClick={() => setEditingListing(null)}
                className="btn-secondary text-xs"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="btn-clay text-xs"
              >
                হালনাগাদ সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* CONFIRM DELETE LISTING */}
      <ConfirmDialog
        isOpen={deleteListingId !== null}
        title="লিস্টিং মুছে ফেলবেন?"
        message="এই ফসল বিজ্ঞাপনটি মুছে ফেললে মার্কেটপ্লেস ও অনুসন্ধান ফলাফল থেকে স্থায়ীভাবে অপসারিত হবে। আপনি কি নিশ্চিত?"
        onConfirm={() => {
          if (deleteListingId) deleteListing(deleteListingId);
          setDeleteListingId(null);
        }}
        onCancel={() => setDeleteListingId(null)}
      />

    </div>
  );
};
