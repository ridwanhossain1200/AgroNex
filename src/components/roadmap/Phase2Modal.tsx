import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { 
  Sparkles, 
  Satellite, 
  CreditCard, 
  Truck, 
  Bot, 
  Radio, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  CheckCircle2,
  Clock
} from 'lucide-react';

export const Phase2Modal: React.FC = () => {
  const { language, showPhase2Modal, setShowPhase2Modal } = useApp();
  const [activeCategory, setActiveCategory] = useState<'all' | 'ai' | 'agri' | 'livestock' | 'fisheries' | 'marketplace'>('all');

  const roadmapItems = [
    {
      category: 'ai',
      titleBn: 'উন্নত কৃত্রিম বুদ্ধিমত্তা ও ভয়েস মডেল (Advanced AI)',
      titleEn: 'Advanced AI & Bengali Voice',
      status: 'Research & Model Fine-tuning',
      itemsBn: [
        'স্যাটেলাইট ও হাই-রেজোলিউশন ড্রোন ইমেজ থেকে শস্য রোগ সনাক্তকরণ',
        'স্থানীয় আঞ্চলিক বাংলা ভাষায় পূর্ণাঙ্গ দ্বিমুখী ভয়েস পরামর্শ',
        'বিশেষজ্ঞ চিকিৎসকদের জন্য এআই-অ্যাসিস্টেড কেস সামারি ও ড্রাফট প্রেসক্রিপশন'
      ]
    },
    {
      category: 'agri',
      titleBn: 'স্যাটেলাইট পর্যবেক্ষণ ও দূর অনুধাবন (Satellite & IoT)',
      titleEn: 'Satellite Crop Monitoring',
      status: 'Architecture Design',
      itemsBn: [
        'NDVI স্যাটেলাইট ইন্ডেক্স দ্বারা ফসলের সজীবতা ও আর্দ্রতা ট্র্যাকিং',
        'মাটির ল্যাব টেস্ট রিপোর্ট ডিজিটাল OCR স্ক্যান ও মাইক্রোনিউট্রিয়েন্ট পরামর্শ',
        'উপগ্রহ তথ্যের ভিত্তিতে সম্ভাব্য ফলন (Yield) অনুমানের অ্যালগরিদম'
      ]
    },
    {
      category: 'livestock',
      titleBn: 'আইওটি ও স্মার্ট খামার ট্র্যাকিং (Smart Livestock IoT)',
      titleEn: 'Livestock IoT & Biosensors',
      status: 'Hardware Testing',
      itemsBn: [
        'গবাদিপশুর গলার আরএফআইডি / স্মার্ট কলার দিয়ে তাপমাত্রা ও রোমন্থন ট্র্যাকিং',
        'হঠাৎ অসুস্থতা বা হিটে আসার পূর্বাভাস স্বয়ংক্রিয় অ্যালার্ট',
        'ডেইরি পাল উৎপাদন ব্যয় ও লাভ-ক্ষতির ভবিষ্যৎ পূর্বাভাস'
      ]
    },
    {
      category: 'fisheries',
      titleBn: 'আইওটি ওয়াটার সেন্সর ও স্বয়ংক্রিয় ফিডার (Fisheries IoT)',
      titleEn: 'Fisheries IoT & Sensor Integration',
      status: 'Prototype Stage',
      itemsBn: [
        'পুকুরে অবিচ্ছিন্ন দ্রবীভূত অক্সিজেন (DO) ও অ্যামোনিয়া সেন্সর ড্রোন',
        'স্বয়ংক্রিয় ভাসমান সৌর-চালিত এয়ারেটর অটোমেশন কন্ট্রোল',
        'মাছের বৃদ্ধি ও এফসিআর ভবিষ্যৎ প্রক্ষেপণ মডেল'
      ]
    },
    {
      category: 'marketplace',
      titleBn: 'ডিজিটাল পেমেন্ট এসক্রো ও ট্রাক ভাড়া (Payments & Logistics)',
      titleEn: 'Escrow Payments & Truck Rental',
      status: 'Gateway Integration & Compliance',
      itemsBn: [
        'বিকাশ, নগদ ও ব্যাংক গেটওয়ের মাধ্যমে নিয়ন্ত্রিত এসক্রো (Escrow) পেমেন্ট',
        'কৃষিপণ্য পরিবহনের জন্য পিকআপ ও ট্রাক বুকিং নেটওয়ার্ক এবং দূরত্বভিত্তিক ভাড়া হিসাব',
        'লাইভ জিপিএস ট্র্যাকিং ও ডেলিভারি কনফার্মেশন কোড',
        'ক্রেতা-বিক্রেতা রেটিং ও প্রাতিষ্ঠানিক বাল্ক পারচেজ পোর্টাল'
      ]
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? roadmapItems 
    : roadmapItems.filter(item => item.category === activeCategory);

  return (
    <Modal
      isOpen={showPhase2Modal}
      onClose={() => setShowPhase2Modal(false)}
      title={language === 'bn' ? 'পরবর্তী ধাপের রূপরেখা (Phase 2 Features Roadmap)' : 'AgroNex Phase 2 Roadmap'}
      subtitle={language === 'bn' ? 'এমভিপি সংস্করণের পরবর্তী প্রজন্মের প্রযুক্তি ও সেবা' : 'Next-Generation Agricultural Innovations'}
      maxWidth="3xl"
    >
      <div>
        {/* Transparency Banner */}
        <div className="p-3 mb-5 rounded-xl bg-forest-50 border border-forest/20 text-xs text-forest-dark flex items-start space-x-2">
          <Clock className="w-4 h-4 text-forest shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>{language === 'bn' ? 'স্বচ্ছতার নীতি:' : 'Honest Architecture Note:'}</strong>{' '}
            {language === 'bn' 
              ? 'নিচের ফিচারসমূহ পিআরডি সংস্করণ ২.০ অনুযায়ী ফেজ-২ এর অন্তর্ভুক্ত। বর্তমান এমভিপিতে কোনো ফেক লাইভ গেটওয়ে বা নকল স্যাটেলাইট তৈরি না করে ভবিষ্যৎ রোডম্যাপ হিসেবে পৃথকভাবে উপস্থাপন করা হয়েছে।'
              : 'The following advanced features are designated for Phase 2 under PRD 2.0. In accordance with platform integrity rules, they are presented transparently as scheduled roadmap milestones.'}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 pb-3 border-b border-softBorder mb-4 text-xs font-semibold">
          {[
            { id: 'all', labelBn: 'সকল ফিচার' },
            { id: 'ai', labelBn: 'উন্নত AI ও ভয়েস' },
            { id: 'agri', labelBn: 'স্যাটেলাইট কৃষি' },
            { id: 'livestock', labelBn: 'স্মার্ট খামার' },
            { id: 'fisheries', labelBn: 'মৎস্য সেন্সর' },
            { id: 'marketplace', labelBn: 'পেমেন্ট ও ট্রাক' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeCategory === cat.id 
                  ? 'bg-forest text-white' 
                  : 'bg-rice text-secondaryText hover:text-primaryText'
              }`}
            >
              {cat.labelBn}
            </button>
          ))}
        </div>

        {/* Roadmap Items Grid */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {filteredItems.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-warmWhite border border-softBorder shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-forest-dark flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-harvest-dark" />
                  <span>{language === 'bn' ? item.titleBn : item.titleEn}</span>
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-status-warning border border-amber-200">
                  {item.status}
                </span>
              </div>
              <ul className="space-y-1.5 mt-2">
                {item.itemsBn.map((point, pIdx) => (
                  <li key={pIdx} className="text-xs text-primaryText flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-softBorder mt-5">
          <button
            onClick={() => setShowPhase2Modal(false)}
            className="px-5 py-2 text-xs font-bold text-white bg-forest hover:bg-forest-dark rounded-xl transition"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close Roadmap'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

