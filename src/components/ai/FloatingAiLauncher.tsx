import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';

interface FloatingAiLauncherProps {
  onClick: () => void;
}

export const FloatingAiLauncher: React.FC<FloatingAiLauncherProps> = ({ onClick }) => {
  const { language } = useApp();

  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center space-x-2.5 px-4 py-3 rounded-full bg-forest hover:bg-forest-dark text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 border-2 border-forest-leaf/50 group cursor-pointer"
      title={language === 'bn' ? 'কৃষি এআই সহকারীকে প্রশ্ন করুন' : 'Ask Agri AI Assistant'}
      aria-label="Open AgroNex Agri AI Assistant"
    >
      <div className="relative">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-forest-leaf group-hover:scale-110 transition-transform">
          <Bot className="w-4 h-4 text-forest-leaf" />
        </div>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping pointer-events-none" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-forest pointer-events-none" />
      </div>

      <div className="text-left">
        <span className="text-xs font-black tracking-wide block leading-none">
          {language === 'bn' ? 'কৃষি এআই' : 'Agri AI'}
        </span>
        <span className="text-[10px] text-forest-leaf/90 font-bold block leading-none mt-0.5">
          {language === 'bn' ? 'যেকোনো প্রশ্ন করুন' : 'Ask Anything'}
        </span>
      </div>

      <Sparkles className="w-3.5 h-3.5 text-harvest-dark animate-pulse" />
    </button>
  );
};
