import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isDestructive = true
}) => {
  const { language } = useApp();

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`p-3 rounded-full mb-3 ${isDestructive ? 'bg-red-50 text-status-error' : 'bg-amber-50 text-status-warning'}`}>
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-sm text-secondaryText mb-6">{message}</p>
        <div className="flex items-center space-x-3 w-full">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-primaryText bg-rice hover:bg-gray-200 rounded-xl transition"
          >
            {cancelLabel || (language === 'bn' ? 'বাতিল' : 'Cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-xl transition shadow-sm ${
              isDestructive ? 'bg-status-error hover:bg-red-700' : 'bg-forest hover:bg-forest-dark'
            }`}
          >
            {confirmLabel || (language === 'bn' ? 'নিশ্চিত করুন' : 'Confirm')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

