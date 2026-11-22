import React from 'react';
import { useApp } from '../../context/AppContext';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { language } = useApp();

  let colorClasses = 'bg-gray-100 text-gray-700 border-gray-200';
  let dotColor = 'bg-gray-500';
  let label = status;

  switch (status.toLowerCase()) {
    case 'published':
    case 'completed':
    case 'optimal':
    case 'healthy':
    case 'verified':
    case 'active':
      colorClasses = 'bg-[#2F8058]/10 text-[#2F8058] border-[#2F8058]/25';
      dotColor = 'bg-[#2F8058]';
      if (status.toLowerCase() === 'published') label = language === 'bn' ? 'বিজ্ঞাপিত' : 'Published';
      else if (status.toLowerCase() === 'completed') label = language === 'bn' ? 'সম্পন্ন' : 'Completed';
      else if (status.toLowerCase() === 'optimal') label = language === 'bn' ? 'অনুকূল' : 'Optimal';
      else if (status.toLowerCase() === 'healthy') label = language === 'bn' ? 'সুস্থ' : 'Healthy';
      else if (status.toLowerCase() === 'verified') label = language === 'bn' ? 'যাচাইকৃত' : 'Verified';
      else label = language === 'bn' ? 'সক্রিয়' : 'Active';
      break;

    case 'accepted':
    case 'ready_for_pickup':
    case 'upcoming':
    case 'confirmed':
      colorClasses = 'bg-[#477A9A]/10 text-[#477A9A] border-[#477A9A]/25';
      dotColor = 'bg-[#477A9A]';
      if (status.toLowerCase() === 'accepted') label = language === 'bn' ? 'গৃহীত' : 'Accepted';
      else if (status.toLowerCase() === 'ready_for_pickup') label = language === 'bn' ? 'পিকআপের জন্য প্রস্তুত' : 'Ready for Pickup';
      else if (status.toLowerCase() === 'upcoming') label = language === 'bn' ? 'আসন্ন' : 'Upcoming';
      else if (status.toLowerCase() === 'confirmed') label = language === 'bn' ? 'নিশ্চিতকৃত' : 'Confirmed';
      break;

    case 'pending':
    case 'countered':
    case 'treatment':
    case 'warning':
    case 'under_review':
    case 'draft':
      colorClasses = 'bg-[#B98228]/10 text-[#B98228] border-[#B98228]/25';
      dotColor = 'bg-[#B98228]';
      if (status.toLowerCase() === 'pending') label = language === 'bn' ? 'বিবেচনাধীন' : 'Pending';
      else if (status.toLowerCase() === 'countered') label = language === 'bn' ? 'কাউন্টার অফার' : 'Countered';
      else if (status.toLowerCase() === 'treatment') label = language === 'bn' ? 'চিকিৎসাধীন' : 'Under Treatment';
      else if (status.toLowerCase() === 'warning') label = language === 'bn' ? 'সতর্কতা' : 'Warning';
      else if (status.toLowerCase() === 'under_review') label = language === 'bn' ? 'পর্যালোচনাধীন' : 'Under Review';
      else if (status.toLowerCase() === 'draft') label = language === 'bn' ? 'খসড়া' : 'Draft';
      break;

    case 'cancelled':
    case 'rejected':
    case 'overdue':
    case 'critical':
    case 'quarantine':
    case 'emergency':
      colorClasses = 'bg-[#BD5147]/10 text-[#BD5147] border-[#BD5147]/25';
      dotColor = 'bg-[#BD5147]';
      if (status.toLowerCase() === 'cancelled') label = language === 'bn' ? 'বাতিল' : 'Cancelled';
      else if (status.toLowerCase() === 'rejected') label = language === 'bn' ? 'প্রত্যাখ্যাত' : 'Rejected';
      else if (status.toLowerCase() === 'overdue') label = language === 'bn' ? 'বকেয়া' : 'Overdue';
      else if (status.toLowerCase() === 'critical') label = language === 'bn' ? 'সংকটজনক' : 'Critical';
      else if (status.toLowerCase() === 'quarantine') label = language === 'bn' ? 'কোয়ারেন্টাইন' : 'Quarantine';
      else if (status.toLowerCase() === 'emergency') label = language === 'bn' ? 'জরুরি' : 'Emergency';
      break;

    case 'sold':
    case 'paused':
      colorClasses = 'bg-gray-100 text-gray-700 border-gray-300';
      dotColor = 'bg-gray-400';
      label = language === 'bn' ? (status.toLowerCase() === 'sold' ? 'বিক্রিত' : 'স্থগিত') : status;
      break;

    default:
      label = status;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-bold rounded-full border shadow-2xs ${colorClasses} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${dotColor}`} />
      <span className="leading-none">{label}</span>
    </span>
  );
};
