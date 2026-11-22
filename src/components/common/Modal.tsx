import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-forest-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 text-center sm:p-4">
        <div 
          className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all my-4 sm:my-8 w-full ${maxWidthClasses[maxWidth]} border border-softBorder max-h-[92vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-softBorder px-4 py-3.5 sm:px-6 sm:py-4 bg-warmWhite shrink-0">
            <div className="pr-2">
              <h3 className="text-base sm:text-lg font-bold text-forest-dark break-words">{title}</h3>
              {subtitle && <p className="text-xs text-secondaryText mt-0.5 break-words">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-mutedText hover:bg-rice hover:text-primaryText transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0 active:scale-95"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 py-4 sm:px-6 sm:py-5 overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

