import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Stethoscope, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  User, 
  FileText, 
  Save, 
  PhoneCall, 
  Check, 
  X,
  AlertTriangle,
  Activity,
  Sparkles,
  Phone,
  MessageSquare
} from 'lucide-react';
import { ConsultationBooking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { toBengaliDigits } from '../../utils/formatters';

export const ExpertDashboard: React.FC = () => {
  const { language, user, consultations, updateConsultationStatus } = useApp();

  const [selectedCaseForPrescription, setSelectedCaseForPrescription] = useState<ConsultationBooking | null>(null);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  const pendingRequests = consultations.filter(c => c.status === 'pending');
  const activeCases = consultations.filter(c => c.status === 'confirmed');
  const completedCases = consultations.filter(c => c.status === 'completed');

  const filteredConsultations = consultations.filter(c => {
    if (activeFilter === 'all') return true;
    return c.status === activeFilter;
  });

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseForPrescription) return;

    updateConsultationStatus(
      selectedCaseForPrescription.id,
      'completed',
      doctorNotes || 'কেস পরীক্ষা সম্পন্ন ও প্রেসক্রিপশন প্রদান করা হলো।',
      prescriptionText
    );

    setSelectedCaseForPrescription(null);
    setPrescriptionText('');
    setDoctorNotes('');
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
              {language === 'bn' ? 'বিশেষজ্ঞ পরামর্শক ওয়ার্কস্পেস (Doctor Workspace)' : 'Expert Consultant Workspace'}
            </h1>
            <p className="text-xs text-secondaryText leading-relaxed">
              {language === 'bn'
                ? 'কৃষকদের অ্যাপয়েন্টমেন্ট পর্যালোচনা, টেলিমেডিসিন পরামর্শ ও প্রেসক্রিপশন প্রদান'
                : 'Manage farmer consultation requests, conduct telemedicine calls and issue digital prescriptions'}
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center space-x-1.5 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>ডিউটিতে সক্রিয় (Online)</span>
        </span>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-premium p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondaryText font-medium">অপেক্ষমাণ কনসালটেশন অনুরোধ</span>
            <Clock className="w-4 h-4 text-amber-800/60" />
          </div>
          <p className="text-2xl font-black text-amber-900 mt-2">
            {toBengaliDigits(pendingRequests.length)} <span className="text-sm font-semibold text-secondaryText">টি</span>
          </p>
          <p className="text-[11px] text-mutedText mt-1">
            তাত্ক্ষণিক পর্যালোচনা ও গ্রহণ প্রয়োজন
          </p>
        </div>

        <div className="card-premium p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondaryText font-medium">নিশ্চিতকৃত সক্রিয় শিডিউল</span>
            <Activity className="w-4 h-4 text-forest/60" />
          </div>
          <p className="text-2xl font-black text-forest mt-2">
            {toBengaliDigits(activeCases.length)} <span className="text-sm font-semibold text-secondaryText">টি</span>
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">
            আজকের নির্ধারিত টেলিমেডিসিন রোগী
          </p>
        </div>

        <div className="card-premium p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondaryText font-medium">মোট সমাপ্তকৃত কেস</span>
            <CheckCircle2 className="w-4 h-4 text-forest-dark/60" />
          </div>
          <p className="text-2xl font-black text-forest-dark mt-2">
            {toBengaliDigits(completedCases.length)} <span className="text-sm font-semibold text-secondaryText">টি</span>
          </p>
          <p className="text-[11px] text-mutedText mt-1">
            প্রেসক্রিপশন ও ফলোআপ সংরক্ষিত
          </p>
        </div>
      </div>

      {/* Filter Tabs & Cases Management */}
      <div className="card-premium p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-softBorder pb-3">
          <h3 className="text-sm font-bold text-forest-dark">পরামর্শ আবেদন ও রোগী কেস ব্যবস্থাপনা</h3>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'সকল কেস' },
              { id: 'pending', label: `অপেক্ষমাণ (${toBengaliDigits(pendingRequests.length)})` },
              { id: 'confirmed', label: `নিশ্চিতকৃত (${toBengaliDigits(activeCases.length)})` },
              { id: 'completed', label: `সমাপ্ত (${toBengaliDigits(completedCases.length)})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeFilter === f.id ? 'bg-forest text-white shadow-xs' : 'bg-rice text-secondaryText hover:text-primaryText'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredConsultations.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="কোনো কেস পাওয়া যায়নি"
            description="এই ক্যাটাগরিতে বর্তমানে কোনো কনসালটেশন রেকর্ড নেই।"
          />
        ) : (
          <div className="space-y-3">
            {filteredConsultations.map((item) => (
              <div key={item.id} className="p-4.5 rounded-2xl border border-softBorder bg-warmWhite space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-softBorder">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-forest-dark text-sm">{item.farmerName}</span>
                      <span className="text-mutedText">({item.farmerPhone})</span>
                      <StatusBadge status={item.status} size="sm" />
                      {item.urgency === 'emergency' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-status-error font-bold">
                          জরুরি
                        </span>
                      )}
                    </div>
                    <p className="text-secondaryText font-semibold mt-0.5">{item.topic}</p>
                  </div>

                  <div className="text-left sm:text-right text-[11px] text-mutedText">
                    <span>তারিখ: {item.preferredDate} • সময়: {item.preferredTime}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rice/70 text-secondaryText leading-relaxed">
                  <span className="font-bold text-primaryText block mb-0.5">কৃষকের সমস্যা বিবরণ:</span>
                  {item.description}
                </div>

                {item.prescription && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-200 space-y-1">
                    <span className="font-bold block text-emerald-900">প্রদত্ত প্রেসক্রিপশন:</span>
                    <p className="whitespace-pre-line text-[11px] leading-relaxed">{item.prescription}</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-mutedText">কেস আইডি: #{item.id}</span>

                  <div className="flex items-center space-x-2">
                    {item.status === 'pending' && (
                      <button
                        onClick={() => updateConsultationStatus(item.id, 'confirmed')}
                        className="btn-primary text-xs py-1.5 px-3"
                      >
                        ✓ অ্যাপয়েন্টমেন্ট অনুমোদন করুন
                      </button>
                    )}

                    {item.status === 'confirmed' && (
                      <button
                        onClick={() => {
                          setSelectedCaseForPrescription(item);
                          setPrescriptionText(`১. ঔষধ / প্রতিষেধক: \n২. প্রয়োগমাত্রা ও নিয়ম: \n৩. বিশেষ খাদ্য ও পরিচর্যা: `);
                        }}
                        className="btn-clay text-xs py-1.5 px-3"
                      >
                        ডিজিটাল প্রেসক্রিপশন লিখুন
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PRESCRIPTION ISSUANCE MODAL */}
      <Modal
        isOpen={selectedCaseForPrescription !== null}
        onClose={() => setSelectedCaseForPrescription(null)}
        title="ডিজিটাল প্রেসক্রিপশন প্রদান (Digital Prescription Pad)"
        maxWidth="lg"
      >
        <form onSubmit={handleSavePrescription} className="space-y-4 text-xs">
          {selectedCaseForPrescription && (
            <div className="p-3.5 rounded-xl bg-rice/70 border border-softBorder text-xs space-y-1">
              <div className="flex justify-between font-bold text-forest-dark">
                <span>রোগী / কৃষক: {selectedCaseForPrescription.farmerName}</span>
                <span>ফোন: {selectedCaseForPrescription.farmerPhone}</span>
              </div>
              <p className="text-secondaryText">বিষয়: {selectedCaseForPrescription.topic}</p>
            </div>
          )}

          <div>
            <label className="block font-bold text-primaryText mb-1">চিকিৎসকের ডায়াগনসিস নোট</label>
            <input
              type="text"
              placeholder="যেমন: প্রাথমিক লক্ষণ দেখে পুষ্টিহীনতা ও ব্যাক্টেরিয়াল সংক্রমণ নির্ণয় করা হয়েছে।"
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block font-bold text-primaryText mb-1">
              প্রেসক্রিপশন বিবরণ (ওষুধের নাম, মাত্রা, প্রয়োগবিধি ও বিশেষ সতর্কতা) *
            </label>
            <textarea
              required
              rows={6}
              value={prescriptionText}
              onChange={(e) => setPrescriptionText(e.target.value)}
              className="input-field font-mono resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-softBorder">
            <button
              type="button"
              onClick={() => setSelectedCaseForPrescription(null)}
              className="btn-secondary text-xs"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="btn-primary text-xs"
            >
              প্রেসক্রিপশন ইস্যু ও কেস সম্পন্ন করুন
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
