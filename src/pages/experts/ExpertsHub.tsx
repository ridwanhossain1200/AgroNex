import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Stethoscope, 
  Search, 
  Star, 
  Calendar, 
  Clock, 
  Phone, 
  Video, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  FileText,
  Info,
  MapPin,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { ExpertProfile, ExpertSpecialization } from '../../types';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { toBengaliDigits, formatCurrency } from '../../utils/formatters';

export const ExpertsHub: React.FC = () => {
  const { language, user, experts, consultations, bookConsultation, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookingModalExpert, setBookingModalExpert] = useState<ExpertProfile | null>(null);

  // Form State
  const [topic, setTopic] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'emergency'>('normal');
  const [desc, setDesc] = useState('');
  const [prefDate, setPrefDate] = useState(new Date().toISOString().split('T')[0]);
  const [prefTime, setPrefTime] = useState('11:00 AM');

  // Simulated live consultation modal
  const [activeCallBooking, setActiveCallBooking] = useState<any | null>(null);

  const filteredExperts = experts.filter((e) => {
    const matchCat = selectedCategory === 'all' || e.category === selectedCategory;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.nameBn.includes(search) ||
                        e.designationBn.includes(search) ||
                        e.district.includes(search);
    return matchCat && matchSearch;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalExpert) return;

    bookConsultation({
      expertId: bookingModalExpert.id,
      expertName: bookingModalExpert.nameBn,
      category: bookingModalExpert.category,
      farmerId: user.id,
      farmerName: user.name,
      farmerPhone: user.phone,
      sector: bookingModalExpert.category === 'agriculturist' ? 'agriculture' : bookingModalExpert.category === 'veterinary' ? 'livestock' : 'fisheries',
      topic: topic || 'সাধারণ কৃষি ও খামার পরামর্শ',
      urgency,
      description: desc || 'মাঠপর্যায়ে পরামর্শের জন্য অনুরোধ।',
      preferredDate: prefDate,
      preferredTime: prefTime
    });

    setBookingModalExpert(null);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-softBorder shadow-2xs">
        <div className="flex items-center space-x-3">
          <span className="p-2.5 rounded-xl bg-forest-light text-forest border border-forest/20 shadow-2xs">
            <Stethoscope className="w-5 h-5 text-forest" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-forest-dark">
              {language === 'bn' ? 'যাচাইকৃত বিশেষজ্ঞ কনসালটেশন নেটওয়ার্ক' : 'Verified Expert Consultation Network'}
            </h1>
            <p className="text-xs text-secondaryText leading-relaxed">
              {language === 'bn' 
                ? 'বিসিএস কৃষিবিদ, নিবন্ধিত ভেটেরিনারি সার্জন ও মৎস্য বিজ্ঞানীদের সাথে অডিও/ভিডিও টেলিকনসালটেশন' 
                : 'Connect with certified agronomists, veterinary doctors & fisheries scientists'}
            </p>
          </div>
        </div>
      </div>

      {/* Honest Telemedicine Demo Disclosure */}
      <div className="p-3.5 rounded-xl bg-forest-50 border border-forest/20 text-xs text-forest-dark flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-forest shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>{language === 'bn' ? 'স্বচ্ছতার নীতি:' : 'Notice:'}</strong>{' '}
          {language === 'bn' 
            ? 'টেলিকনসালটেশন বুকিংটি এগ্রোনেক্সের ইন্টারঅ্যাক্টিভ ডেমো পরিবেশের অংশ। বুকিং নিশ্চিত হওয়ার পর কনসালটেশন স্ট্যাটাস ও ডিজিটাল প্রেসক্রিপশন সরাসরি সিস্টেমে প্রদর্শিত হবে।' 
            : 'Consultation booking operates in simulated demo mode. Digital prescriptions and consultation queues demonstrate the complete doctor-farmer communication lifecycle.'}
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="card-premium p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-mutedText" />
          <input
            type="text"
            placeholder="বিশেষজ্ঞের নাম, ডিগ্রি, বিশেষত্ব বা এলাকা দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'সকল বিশেষজ্ঞ' },
            { id: 'agriculturist', label: 'কৃষিবিদ (Crop)' },
            { id: 'veterinary', label: 'পশু চিকিৎসক (Vet)' },
            { id: 'fisheries', label: 'মৎস্য বিজ্ঞানী (Fisheries)' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat.id 
                  ? 'bg-forest text-white shadow-xs' 
                  : 'bg-rice text-secondaryText hover:text-primaryText hover:bg-forest-50/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Experts Grid */}
      {filteredExperts.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="কোনো বিশেষজ্ঞ পাওয়া যায়নি"
          description="আপনার অনুসন্ধান বা ফিল্টারের সাথে মিলে এমন কোনো বিশেষজ্ঞের তালিকা নেই। ফিল্টার রিসেট করুন।"
          actionLabel="সকল বিশেষজ্ঞ দেখুন"
          onAction={() => {
            setSearch('');
            setSelectedCategory('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredExperts.map((exp) => (
            <div key={exp.id} className="card-premium p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start space-x-3">
                  <img src={exp.avatarUrl} alt={exp.name} className="w-16 h-16 rounded-2xl object-cover border border-softBorder shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-sm font-bold text-forest-dark">{exp.nameBn}</h3>
                      {exp.verified && (
                        <span className="p-0.5 rounded-full bg-emerald-100 text-emerald-800" title="BCS / BAU Verified">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-secondaryText font-medium mt-0.5">{exp.designationBn}</p>
                    <p className="text-[11px] text-mutedText">{exp.qualification}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-softBorder text-xs space-y-1.5 text-secondaryText">
                  <div className="flex justify-between">
                    <span>অভিজ্ঞতা:</span>
                    <span className="font-semibold text-primaryText">{toBengaliDigits(exp.experienceYears)} বছর</span>
                  </div>
                  <div className="flex justify-between">
                    <span>কর্মক্ষেত্র / জেলা:</span>
                    <span className="font-semibold text-primaryText">{exp.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>রেটিং:</span>
                    <span className="font-bold text-amber-900 flex items-center">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                      {toBengaliDigits(exp.rating)} ({toBengaliDigits(exp.reviewsCount)} রিভিউ)
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-[11px] text-mutedText leading-relaxed">
                  {exp.aboutBn}
                </p>
              </div>

              <div className="pt-3 border-t border-softBorder flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-mutedText block">পরামর্শ ফি:</span>
                  <span className="text-base font-black text-forest">
                    ৳ {toBengaliDigits(exp.consultationFee)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setBookingModalExpert(exp);
                    setTopic(exp.category === 'agriculturist' ? 'ফসলের রোগ নির্ণয় ও সার প্রয়োগ' : exp.category === 'veterinary' ? 'পশুর স্বাস্থ্য ও টিকা পরামর্শ' : 'পুকুর প্রস্তুতি ও মাছের খাদ্য');
                  }}
                  className="btn-primary text-xs"
                >
                  অ্যাপয়েন্টমেন্ট নিন
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Consultations History */}
      {consultations.length > 0 && (
        <div className="card-premium p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-softBorder pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-forest" />
              <h3 className="text-sm font-bold text-forest-dark">আপনার সাম্প্রতিক কনসালটেশন শিডিউল</h3>
            </div>
            <span className="text-xs text-secondaryText">মোট {toBengaliDigits(consultations.length)} টি অ্যাপয়েন্টমেন্ট</span>
          </div>

          <div className="space-y-3">
            {consultations.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-warmWhite border border-softBorder space-y-2.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-forest-dark text-sm">{item.expertName}</span>
                    <StatusBadge status={item.status} size="sm" />
                    {item.urgency === 'emergency' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-status-error font-bold">
                        জরুরি
                      </span>
                    )}
                  </div>
                  <span className="text-mutedText text-[11px]">
                    তারিখ: {item.preferredDate} • সময়: {item.preferredTime}
                  </span>
                </div>

                <p className="text-secondaryText"><strong>বিষয়:</strong> {item.topic}</p>
                <p className="text-[11px] text-mutedText">বিবরণ: {item.description}</p>

                {item.prescription && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 mt-2 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                      <FileText className="w-4 h-4" />
                      <span>প্রদত্ত ডিজিটাল প্রেসক্রিপশন:</span>
                    </div>
                    <p className="text-xs whitespace-pre-line leading-relaxed">{item.prescription}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      <Modal
        isOpen={bookingModalExpert !== null}
        onClose={() => setBookingModalExpert(null)}
        title={bookingModalExpert ? `${bookingModalExpert.nameBn} এর সাথে পরামর্শ বুকিং` : ''}
        maxWidth="md"
      >
        <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-primaryText mb-1">পরামর্শের বিষয় *</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primaryText mb-1">অগ্রাধিকার স্তর</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="input-field"
              >
                <option value="normal">সাধারণ (Normal)</option>
                <option value="emergency">জরুরি সংকট (Emergency)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-primaryText mb-1">পছন্দের তারিখ</label>
              <input
                type="date"
                value={prefDate}
                onChange={(e) => setPrefDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-primaryText mb-1">পছন্দের সময় স্লট</label>
            <select
              value={prefTime}
              onChange={(e) => setPrefTime(e.target.value)}
              className="input-field"
            >
              <option value="10:00 AM">সকাল ১০:০০ টা</option>
              <option value="11:30 AM">সকাল ১১:৩০ টা</option>
              <option value="03:00 PM">বিকাল ০৩:০০ টা</option>
              <option value="05:00 PM">বিকাল ০৫:০০ টা</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-primaryText mb-1">সমস্যার বিস্তারিত বিবরণ</label>
            <textarea
              rows={3}
              placeholder="আক্রান্ত ফসল, পশু বা মাছের লক্ষণ বিস্তারিত লিখুন..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="input-field resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-softBorder">
            <button
              type="button"
              onClick={() => setBookingModalExpert(null)}
              className="btn-secondary text-xs"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="btn-primary text-xs"
            >
              বুকিং নিশ্চিত করুন
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
