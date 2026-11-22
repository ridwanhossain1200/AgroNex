import React from 'react';
import { LucideIcon, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-dashed border-softBorder rounded-2xl my-4">
      <div className="w-16 h-16 rounded-2xl bg-forest-50 border border-forest/15 text-forest flex items-center justify-center mb-4 shadow-2xs">
        <Icon className="w-8 h-8 text-forest" />
      </div>
      <h4 className="text-base sm:text-lg font-bold text-forest-dark">{title}</h4>
      <p className="text-xs sm:text-sm text-secondaryText max-w-md mt-1.5 mb-6 leading-relaxed">
        {description}
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {secondaryActionLabel && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-primaryText bg-rice hover:bg-gray-200 border border-softBorder transition"
          >
            {secondaryActionLabel}
          </button>
        )}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl text-white bg-forest hover:bg-forest-dark shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};
