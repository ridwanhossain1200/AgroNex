import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgColor = 'bg-white border-l-4 border-forest shadow-lg';
        let icon = <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" />;

        if (toast.type === 'error') {
          bgColor = 'bg-white border-l-4 border-status-error shadow-lg';
          icon = <AlertCircle className="w-5 h-5 text-status-error shrink-0" />;
        } else if (toast.type === 'warning') {
          bgColor = 'bg-white border-l-4 border-status-warning shadow-lg';
          icon = <AlertTriangle className="w-5 h-5 text-status-warning shrink-0" />;
        } else if (toast.type === 'info') {
          bgColor = 'bg-white border-l-4 border-river shadow-lg';
          icon = <Info className="w-5 h-5 text-river shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`${bgColor} p-4 rounded-r-lg border border-softBorder text-primaryText flex items-start justify-between pointer-events-auto transition-all transform translate-y-0 opacity-100`}
          >
            <div className="flex items-start space-x-3">
              {icon}
              <div>
                <p className="font-semibold text-sm text-primaryText">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-secondaryText mt-0.5">{toast.message}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-mutedText hover:text-primaryText ml-2 p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

