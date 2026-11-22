import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { CalendarReminder, SectorType } from '../../types';

interface CreateReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSector?: SectorType;
  defaultEntity?: string;
}

export const CreateReminderModal: React.FC<CreateReminderModalProps> = ({
  isOpen,
  onClose,
  defaultSector = 'agriculture',
  defaultEntity = ''
}) => {
  const { language, addReminder, lands, livestockFarms, ponds } = useApp();

  const [title, setTitle] = useState('');
  const [sector, setSector] = useState<SectorType>(defaultSector);
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [stage, setStage] = useState('সেচ ও জল নিষ্কাশন');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [entityName, setEntityName] = useState(defaultEntity || (lands[0]?.name || 'প্রধান জমি প্লট'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReminder({
      sector,
      title: title,
      titleBn: title,
      date,
      stage,
      priority,
      entityName: entityName || 'সাধারণ ক্ষেত্র'
    });

    setTitle('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'bn' ? 'নতুন কৃষি/খামার রিমাইন্ডার সেট করুন' : 'Create New Farm Reminder'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block font-bold text-primaryText mb-1">
            {language === 'bn' ? 'কাজের বিবরণ / শিরোনাম *' : 'Task Description / Title *'}
          </label>
          <input
            type="text"
            required
            placeholder={language === 'bn' ? 'যেমন: জমিতে ২য় কিস্তির ইউরিয়া প্রয়োগ ও সেচ' : 'e.g. 2nd dose of Urea and irrigation'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-primaryText mb-1">
              {language === 'bn' ? 'বিভাগ / সেক্টর' : 'Sector'}
            </label>
            <select
              value={sector}
              onChange={(e) => {
                const s = e.target.value as SectorType;
                setSector(s);
                if (s === 'agriculture') {
                  setEntityName(lands[0]?.name || 'কৃষি জমি');
                  setStage('সেচ ও জল নিষ্কাশন');
                } else if (s === 'livestock') {
                  setEntityName(livestockFarms[0]?.name || 'ডেইরি শেড');
                  setStage('টিকা ও কৃমিনাশক');
                } else {
                  setEntityName(ponds[0]?.name || 'মৎস্য পুকুর');
                  setStage('জলের প্যারামিটার টেস্ট ও চুন');
                }
              }}
              className="input-field font-medium"
            >
              <option value="agriculture">{language === 'bn' ? 'কৃষি ফসল (Agriculture)' : 'Agriculture'}</option>
              <option value="livestock">{language === 'bn' ? 'পশু ও ডেইরি (Livestock)' : 'Livestock'}</option>
              <option value="fisheries">{language === 'bn' ? 'মৎস্য চাষ (Fisheries)' : 'Fisheries'}</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-primaryText mb-1">
              {language === 'bn' ? 'নির্ধারিত তারিখ *' : 'Target Date *'}
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-primaryText mb-1">
              {language === 'bn' ? 'কাজের পর্যায় / স্টেজ' : 'Stage / Category'}
            </label>
            <input
              type="text"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block font-bold text-primaryText mb-1">
              {language === 'bn' ? 'অগ্রাধিকার স্তর' : 'Priority'}
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="input-field"
            >
              <option value="high">{language === 'bn' ? 'জরুরি (High Priority)' : 'High'}</option>
              <option value="medium">{language === 'bn' ? 'সাধারণ (Medium)' : 'Medium'}</option>
              <option value="low">{language === 'bn' ? 'কম গুরুত্বপূর্ণ (Low)' : 'Low'}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-primaryText mb-1">
            {language === 'bn' ? 'সংশ্লিষ্ট জমি / খামার / পুকুর' : 'Associated Entity / Farm'}
          </label>
          <input
            type="text"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-softBorder">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs"
          >
            {language === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
          <button
            type="submit"
            className="btn-primary text-xs"
          >
            {language === 'bn' ? 'রিমাইন্ডার সেভ করুন' : 'Save Reminder'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

