import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  AlertTriangle, 
  RotateCcw, 
  ChevronRight, 
  Globe,
  Maximize2,
  Minimize2,
  Settings,
  Key,
  Eye,
  EyeOff,
  Cpu,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { ChatMessage, getAgriAiResponseAsync } from '../../services/agriAiService.ts';
import { 
  getAiConfig, 
  saveAiConfig, 
  resetAiConfig, 
  PROVIDER_MODELS, 
  AI_SECURITY_NOTICE, 
  AiConfig, 
  AiProviderType, 
  AiResponseLanguagePref 
} from '../../services/aiConfigService.ts';
import { testAiConnection, checkServerAiStatus } from '../../services/llmClient.ts';

interface AgriChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string, subtab?: string) => void;
  initialQuery?: string;
}

export const AgriChatbotModal: React.FC<AgriChatbotModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  initialQuery
}) => {
  const { language, setLanguage, showToast } = useApp();

  // AI Configuration state
  const [aiConfig, setAiConfig] = useState<AiConfig>(() => getAiConfig());
  const [responseLangPref, setResponseLangPref] = useState<AiResponseLanguagePref>(() => aiConfig.responseLanguage || 'auto');
  
  // Settings Dialog state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempConfig, setTempConfig] = useState<AiConfig>(aiConfig);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Server Gemini configuration status
  const [serverStatus, setServerStatus] = useState<{ checked: boolean; configured: boolean; model: string }>({
    checked: false,
    configured: true,
    model: 'gemini-3.8-flash'
  });

  useEffect(() => {
    if (isOpen && aiConfig.provider === 'server-gemini') {
      checkServerAiStatus()
        .then(st => {
          setServerStatus({ checked: true, configured: st.geminiConfigured, model: st.model });
        })
        .catch(() => {
          setServerStatus({ checked: true, configured: false, model: 'gemini-3.8-flash' });
        });
    }
  }, [isOpen, aiConfig.provider]);

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome_1',
      sender: 'ai',
      text: language === 'bn'
        ? `আসসালামু আলাইকুম! আমি এগ্রোনেক্সের কৃত্রিম বুদ্ধিমত্তা সম্পন্ন কৃষি সহকারী।
আমি বাংলা লিপি, রোমানাইজড বাংলিশ (যেমন: "Amar dhan pata holud hoye jacche") এবং ইংরেজি তিনটি ভাষাতেই কৃষি, পশু-পাখি, মৎস্য ও বাজারদরের প্রশ্নের উত্তর দিতে পারি।

কোন বিষয়ে সহায়তা প্রয়োজন? নিচের বাটনে চাপ দিন অথবা সরাসরি প্রশ্ন লিখুন!`
        : `Welcome! I am your AgroNex Multilingual Agricultural AI Advisor.
I understand Bengali script, Romanized Banglish (e.g. "Goru khabar khacche na ki korbo"), and English. Ask me anything regarding crops, diseases, livestock, pond water, or wholesale prices!`,
      timestamp: 'এখন',
      isDemoMode: aiConfig.provider === 'demo',
      providerUsed: aiConfig.provider === 'demo' ? 'Demo Mode' : aiConfig.provider.toUpperCase()
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Handle initial query if passed
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery.trim());
    }
  }, [initialQuery]);

  // Read aloud helper (TTS)
  const speakText = (text: string) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = responseLangPref === 'en' ? 'en-US' : 'bn-BD';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS not supported or blocked by browser', e);
    }
  };

  // Change Response Language Preference
  const handleResponseLangChange = (pref: AiResponseLanguagePref) => {
    setResponseLangPref(pref);
    const updated = saveAiConfig({ responseLanguage: pref });
    setAiConfig(updated);
    showToast(
      pref === 'auto' ? 'ভাষা: স্বয়ংক্রিয় নির্বাচন' : (pref === 'bn' ? 'ভাষা: বাংলা নির্ধারণ করা হয়েছে' : 'Language: English set'),
      'info'
    );
  };

  // Send message to AI engine
  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getAgriAiResponseAsync(queryText, updatedHistory, {
        responseLanguage: responseLangPref
      });

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency: response.isEmergency,
        isDemoMode: response.isDemoMode,
        providerUsed: response.providerUsed,
        toolSteps: response.toolSteps,
        actionCard: response.actionCard,
        followUpQuestions: response.followUpQuestions
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      if (speechEnabled) {
        speakText(response.reply);
      }
    } catch (err: any) {
      setIsTyping(false);
      const errMsg: ChatMessage = {
        id: `ai_err_${Date.now()}`,
        sender: 'ai',
        text: language === 'bn'
          ? `দুঃখিত, এআই সার্ভার সংযোগে ত্রুটি দেখা দিয়েছে: ${err.message || 'অজানা ত্রুটি'}। পুনরায় চেষ্টা করার জন্য নিচের বাটনে চাপ দিন।`
          : `AI connection error: ${err.message || 'Unknown error'}. Please click retry below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        failedQuery: queryText,
        isDemoMode: false,
        providerUsed: 'Gemini Error'
      };
      setMessages(prev => [...prev, errMsg]);
    }
  };

  const handleVoiceInputSimulate = () => {
    if (!isListening) {
      setIsListening(true);
      showToast(
        language === 'bn' ? 'মাইক্রোফোন সক্রিয়...' : 'Listening...',
        'info',
        language === 'bn' ? 'আপনার প্রশ্নটি বলুন (যেমন: ধানের ব্লাস্ট রোগ)' : 'Speak your question now'
      );

      // Simulate voice capture
      setTimeout(() => {
        setIsListening(false);
        const sampleVoiceQueries = language === 'bn' ? [
          'Amar dhan gach er pata holud hoye jacche, ki korbo?',
          'বোরো ধানের সার প্রয়োগ মাত্রা কত?',
          'আলুর নাবি ধসা রোগ হলে কি করব?',
          'Goru khabar khacche na ar durbol hoye geche.',
          'Amar pukurer mach gula upore uthe thake keno?'
        ] : [
          'My rice leaves are turning yellow. What should I do?',
          'How to treat potato late blight?',
          'Why are fish gasping at the pond surface?'
        ];
        const randomQuery = sampleVoiceQueries[Math.floor(Math.random() * sampleVoiceQueries.length)];
        setInput(randomQuery);
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const handleResetChat = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setMessages([
      {
        id: `reset_${Date.now()}`,
        sender: 'ai',
        text: language === 'bn'
          ? 'কথোপকথন পরিষ্কার করা হয়েছে। বাংলা, বাংলিশ বা ইংরেজিতে যেকোনো প্রশ্ন করতে পারেন।'
          : 'Chat history cleared. Feel free to ask any agricultural question in Bangla, Banglish, or English.',
        timestamp: 'এখন',
        isDemoMode: aiConfig.provider === 'demo'
      }
    ]);
  };

  // Open Settings Modal
  const openSettings = () => {
    setTempConfig(getAiConfig());
    setTestResult(null);
    setIsSettingsOpen(true);
  };

  // Test API Connection
  const handleTestConnection = async () => {
    setIsTestingApi(true);
    setTestResult(null);
    try {
      const res = await testAiConnection(tempConfig);
      setTestResult(res);
    } catch (e: any) {
      setTestResult({ success: false, message: e.message || 'Error testing connection' });
    } finally {
      setIsTestingApi(false);
    }
  };

  // Save Settings
  const handleSaveSettings = () => {
    const saved = saveAiConfig(tempConfig);
    setAiConfig(saved);
    setResponseLangPref(saved.responseLanguage || 'auto');
    setIsSettingsOpen(false);
    showToast(
      saved.provider === 'demo' ? 'ডেমো মোড সক্রিয় করা হয়েছে' : `${saved.provider.toUpperCase()} এআই সফলভাবে সংরক্ষিত হয়েছে`,
      'success'
    );
  };

  // Reset to Demo
  const handleResetSettings = () => {
    const res = resetAiConfig();
    setTempConfig(res);
    setAiConfig(res);
    setResponseLangPref('auto');
    setTestResult({ success: true, message: 'Reset to default Offline Demo Mode.' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        className={`bg-white w-full flex flex-col shadow-2xl transition-all duration-200 overflow-hidden ${
          isFullScreen 
            ? 'h-full max-h-screen rounded-none' 
            : 'h-[92vh] sm:h-[650px] max-w-2xl sm:rounded-3xl border border-softBorder'
        }`}
      >
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-forest to-forest-dark text-white p-3.5 sm:p-4 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white">
                <Bot className="w-6 h-6 text-forest-leaf" />
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-forest rounded-full ${
                aiConfig.provider === 'demo' || (aiConfig.provider === 'server-gemini' && serverStatus.checked && !serverStatus.configured)
                  ? 'bg-amber-400' 
                  : 'bg-emerald-400 animate-pulse'
              }`} />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  {language === 'bn' ? 'এগ্রোনেক্স এআই সহকারী' : 'AgroNex AI Advisor'}
                </h3>
                
                {/* Visible Status Indicator: Gemini AI Connected vs Demo/FAQ Mode */}
                <button
                  onClick={openSettings}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full border transition flex items-center space-x-1.5 ${
                    aiConfig.provider === 'demo' || (aiConfig.provider === 'server-gemini' && serverStatus.checked && !serverStatus.configured)
                      ? 'bg-amber-500/20 text-amber-200 border-amber-400/40 hover:bg-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 hover:bg-emerald-500/30'
                  }`}
                  title="Click to view AI Configuration & Diagnostics"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    aiConfig.provider === 'demo' || (aiConfig.provider === 'server-gemini' && serverStatus.checked && !serverStatus.configured)
                      ? 'bg-amber-400'
                      : 'bg-emerald-400 animate-ping'
                  }`} />
                  <span>
                    {aiConfig.provider === 'server-gemini' 
                      ? (serverStatus.checked && !serverStatus.configured 
                          ? 'Demo/FAQ Mode (Key Unset)' 
                          : `Agentic AI Active (${serverStatus.model || 'gemini-3.8-flash'})`)
                      : (aiConfig.provider === 'demo' ? 'Demo/FAQ Mode' : `${aiConfig.provider.toUpperCase()} AI Connected`)}
                  </span>
                </button>
              </div>

              <p className="text-[11px] text-rice/80 mt-0.5">
                {language === 'bn' ? 'বাংলা • Banglish • English ত্রিভাষিক বুদ্ধিমত্তা' : 'Trilingual Crop, Livestock & Fisheries Intelligence'}
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            {/* AI Settings Gear */}
            <button
              onClick={openSettings}
              className="p-2 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition"
              title="এআই সেটিংস ও এপিআই কি (AI Settings)"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Read aloud toggle */}
            <button
              onClick={() => {
                setSpeechEnabled(!speechEnabled);
                if (speechEnabled && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`p-2 rounded-xl transition ${speechEnabled ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'}`}
              title={speechEnabled ? (language === 'bn' ? 'ভয়েস বন্ধ করুন' : 'Mute voice') : (language === 'bn' ? 'ভয়েস চালু করুন' : 'Enable voice')}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4 text-forest-leaf" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Clear chat */}
            <button
              onClick={handleResetChat}
              className="p-2 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition"
              title={language === 'bn' ? 'নতুন করে শুরু' : 'Clear Chat'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen toggle (desktop only) */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="hidden sm:inline-flex p-2 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={() => {
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                onClose();
              }}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Response Language Preference Selector */}
        <div className="bg-rice border-b border-softBorder px-3.5 py-1.5 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center space-x-1.5 text-secondaryText text-[11px] font-semibold">
            <Globe className="w-3.5 h-3.5 text-forest" />
            <span>{language === 'bn' ? 'উত্তর দেওয়ার ভাষা:' : 'Response Language:'}</span>
          </div>

          <div className="flex items-center p-0.5 bg-white border border-softBorder rounded-xl shadow-2xs">
            {(['auto', 'bn', 'en'] as AiResponseLanguagePref[]).map((pref) => {
              const isActive = responseLangPref === pref;
              const label = pref === 'auto' ? (language === 'bn' ? 'স্বয়ংক্রিয় (Auto)' : 'Auto Detect') : (pref === 'bn' ? 'বাংলা' : 'English');
              return (
                <button
                  key={pref}
                  onClick={() => handleResponseLangChange(pref)}
                  className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg transition ${
                    isActive 
                      ? 'bg-forest text-white shadow-xs' 
                      : 'text-secondaryText hover:text-primaryText hover:bg-forest-50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Server Environment Variable Alert Banner (API Not Configured State) */}
        {serverStatus.checked && !serverStatus.configured && aiConfig.provider === 'server-gemini' && (
          <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-1.5 flex items-center justify-between text-xs text-amber-900 shrink-0">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-[11px] font-medium">
                {language === 'bn'
                  ? 'সার্ভারে GEMINI_API_KEY এখনও যুক্ত করা হয়নি (অফলাইন এক্সপার্ট ইঞ্জিন সক্রিয়)'
                  : 'Server GEMINI_API_KEY not set yet (Running on Offline Expert Engine)'}
              </span>
            </div>
            <button
              onClick={openSettings}
              className="text-[11px] font-bold text-forest hover:underline shrink-0 ml-2"
            >
              {language === 'bn' ? 'যুক্ত করার নিয়ম ↗' : 'Setup Guide ↗'}
            </button>
          </div>
        )}

        {/* Suggestion Pills Banner for Basic-Level Users */}
        <div className="bg-forest-50/70 border-b border-softBorder px-3.5 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold text-forest shrink-0 flex items-center space-x-1 mr-1">
            <Sparkles className="w-3 h-3 text-harvest-dark" />
            <span>{language === 'bn' ? 'উদাহরণ প্রশ্নসমূহ:' : 'Quick Questions:'}</span>
          </span>

          {[
            { label: 'Amar dhan gach er pata holud', query: 'Amar dhan gach er pata holud hoye jacche, ki korbo?' },
            { label: 'ধানের বাদামি দাগ রোগ', query: 'আমার ধানের পাতায় বাদামি দাগ দেখা যাচ্ছে।' },
            { label: 'Goru khabar khacche na', query: 'Goru khabar khacche na ar durbol hoye geche.' },
            { label: 'মাছ সকালে ভেসে উঠছে', query: 'Amar pukurer mach gula upore uthe thake keno?' },
            { label: 'Tomato gach e poka', query: 'Tomato gach e poka dhorse, kono upay ache?' },
            { label: 'Calculate Fertilizer', query: 'How can I calculate fertilizer requirements for my land?' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.query)}
              className="px-2.5 py-1 rounded-xl bg-white border border-forest/20 text-[11px] font-medium text-forest-dark hover:bg-forest hover:text-white hover:border-forest transition whitespace-nowrap shadow-2xs shrink-0 active:scale-95"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-rice/40">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 animate-in fade-in duration-150`}
              >
                <div className="flex items-center space-x-2 text-[10px] text-mutedText px-1">
                  <span>{isUser ? (language === 'bn' ? 'আপনি' : 'You') : (language === 'bn' ? 'এগ্রোনেক্স এআই' : 'AgroNex AI')}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <>
                      <span>•</span>
                      <span className={`px-1.5 py-0.2 rounded font-semibold ${
                        msg.isError
                          ? 'bg-rose-100 text-rose-800'
                          : (msg.isDemoMode ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800')
                      }`}>
                        {msg.isError 
                          ? 'Error' 
                          : (msg.isDemoMode ? 'Demo / FAQ Mode' : (msg.providerUsed || 'Gemini AI'))}
                      </span>
                    </>
                  )}
                </div>

                <div 
                  className={`max-w-[88%] sm:max-w-[82%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser 
                      ? 'bg-forest text-white rounded-tr-xs font-medium' 
                      : 'bg-white text-primaryText border border-softBorder rounded-tl-xs space-y-2.5'
                  }`}
                >
                  {/* Emergency Warning Badge */}
                  {msg.isEmergency && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-300 text-status-error flex items-start space-x-2 text-xs font-bold mb-1">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-status-error mt-0.5" />
                      <div>
                        <div className="font-bold">{language === 'bn' ? '🚨 জরুরি সংকট সনাক্ত হয়েছে!' : '🚨 Critical Agricultural Emergency Detected!'}</div>
                        <div className="text-[11px] font-normal text-status-error/90 mt-0.5">
                          {language === 'bn' 
                            ? 'কালবিলম্ব না করে বিশেষজ্ঞ চিকিৎসক বা কর্মকর্তার জরুরি সহায়তা নিন।' 
                            : 'Immediate on-site intervention or certified veterinary/agronomy consultation is recommended.'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error & Retry Box */}
                  {msg.isError ? (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-status-error space-y-2">
                      <div className="flex items-center space-x-1.5 font-bold text-xs">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                        <span>{language === 'bn' ? 'সংযোগ ত্রুটি' : 'Connection Error'}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-red-700">{msg.text}</p>
                      {msg.failedQuery && (
                        <div className="pt-1 flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleSendMessage(msg.failedQuery!)}
                            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center space-x-1.5 active:scale-95 shadow-2xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{language === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Retry'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={openSettings}
                            className="px-2.5 py-1.5 text-xs text-red-700 hover:underline font-semibold"
                          >
                            {language === 'bn' ? 'সেটিংস পরীক্ষা' : 'Check Settings'}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Agent Reasoning & Grounded Tools Trace */}
                      {!isUser && msg.toolSteps && msg.toolSteps.length > 0 && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs text-forest-dark space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-forest text-[11px]">
                            <span className="flex items-center space-x-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-harvest-dark" />
                              <span>
                                {language === 'bn' 
                                  ? `এজেন্টিক বিশ্লেষণ ও টুল যাচাই (${msg.toolSteps.length}টি টুল কার্যকর)` 
                                  : `Agent Reasoning & Grounded Tools (${msg.toolSteps.length} executed)`}
                              </span>
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-900 font-bold">
                              Verified
                            </span>
                          </div>
                          <div className="space-y-1">
                            {msg.toolSteps.map((tool, idx) => (
                              <div key={idx} className="text-[11px] bg-white rounded-lg p-2 border border-emerald-100/90 shadow-2xs flex items-start space-x-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-forest mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-forest font-mono text-[10px] bg-forest-50 px-1 rounded">{tool.toolName}</span>
                                    <span className="text-[9px] text-mutedText">{tool.timestamp}</span>
                                  </div>
                                  <p className="text-secondaryText text-[11px] mt-0.5 leading-snug">{tool.summaryText}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    </>
                  )}

                  {/* Follow-up Question Chips */}
                  {!isUser && msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                    <div className="pt-2 border-t border-softBorder/60 space-y-1.5">
                      <div className="text-[10px] font-bold text-forest uppercase tracking-wider flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-harvest" />
                        <span>{language === 'bn' ? 'সম্পর্কিত ফলো-আপ প্রশ্ন:' : 'Relevant Follow-up Questions:'}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUpQuestions.map((fq, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(fq)}
                            className="text-[11px] px-2.5 py-1 rounded-xl bg-forest-50 hover:bg-forest hover:text-white text-forest-dark border border-forest/20 transition text-left active:scale-95"
                          >
                            {fq} →
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Read Aloud button on individual response */}
                  {!isUser && (
                    <div className="pt-2 border-t border-softBorder/60 flex items-center justify-between text-[11px] text-secondaryText">
                      <button
                        onClick={() => speakText(msg.text)}
                        className="inline-flex items-center space-x-1 text-forest hover:underline font-bold"
                        title="পড়ে শোনান"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'পড়ে শোনান' : 'Listen'}</span>
                      </button>

                      <span className="text-[10px] text-mutedText">
                        {language === 'bn' ? 'বিএআরসি, বিআরআরআই ও বিএলআরআই সমর্থিত' : 'BARC, BRRI & BLRI Standard'}
                      </span>
                    </div>
                  )}

                  {/* Action Link Card */}
                  {msg.actionCard && onNavigate && (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onNavigate(msg.actionCard!.tab, msg.actionCard!.subtab);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-forest-50 hover:bg-forest-100/80 border border-forest/20 text-forest-dark text-xs font-bold transition group"
                      >
                        <span className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-forest" />
                          <span>{language === 'bn' ? msg.actionCard.labelBn : msg.actionCard.labelEn}</span>
                        </span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Bouncing Dots */}
          {isTyping && (
            <div className="flex items-center space-x-2 p-3 rounded-2xl bg-white border border-softBorder max-w-[120px] text-forest">
              <Bot className="w-4 h-4 animate-bounce" />
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-forest rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-forest rounded-full animate-pulse delay-100" />
                <span className="w-1.5 h-1.5 bg-forest rounded-full animate-pulse delay-200" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Form */}
        <div className="p-3 sm:p-4 bg-white border-t border-softBorder shrink-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }} 
            className="flex items-center space-x-2"
          >
            {/* Voice Simulation Button */}
            <button
              type="button"
              onClick={handleVoiceInputSimulate}
              className={`p-2.5 sm:p-3 rounded-2xl transition shrink-0 active:scale-95 ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-rice text-secondaryText hover:text-forest hover:bg-forest-50 border border-softBorder'
              }`}
              title={language === 'bn' ? 'মুখে বলে প্রশ্ন করুন' : 'Voice Query'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'bn' 
                  ? 'বাংলা, Banglish বা ইংরেজিতে লিখুন (যেমন: ধান পাতা হলুদ, goru khacche na)...' 
                  : 'Ask in Bangla, Banglish, or English (e.g. Yellow leaves, fish gasping)...'
              }
              className="input-field py-3 text-xs sm:text-sm font-medium flex-1 rounded-2xl"
            />

            {/* Submit Send Button */}
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn-primary p-2.5 sm:p-3 rounded-2xl shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
              title={language === 'bn' ? 'পাঠান' : 'Send'}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-mutedText mt-2 px-1">
            <span>
              {aiConfig.provider === 'demo' 
                ? (language === 'bn' ? 'অফলাইন ডেমো ইঞ্জিন সক্রিয় (সেটিংসে গিয়ে নিজস্ব এআই যুক্ত করতে পারেন)' : 'Offline Demo Engine Active (configure real LLM in Settings)')
                : (language === 'bn' ? `${aiConfig.provider.toUpperCase()} এআই লাইভ সক্রিয়` : `Live ${aiConfig.provider.toUpperCase()} active`)}
            </span>
            <button
              type="button"
              onClick={openSettings}
              className="text-forest hover:underline font-bold"
            >
              {language === 'bn' ? '⚙️ এআই কনফিগারেশন' : '⚙️ AI Settings'}
            </button>
          </div>
        </div>

      </div>

      {/* AI Settings & API Key Modal Dialog */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-softBorder space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-softBorder">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-forest/10 text-forest">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-primaryText text-base">
                    {language === 'bn' ? 'এগ্রোনেক্স এআই কনফিগারেশন' : 'AgroNex AI Engine Settings'}
                  </h4>
                  <p className="text-xs text-mutedText">
                    {language === 'bn' ? 'ডেমো ইঞ্জিন বা নিজস্ব এআই মডেল যুক্ত করুন' : 'Switch between Demo Mode and Live LLM APIs'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 text-secondaryText hover:text-primaryText rounded-xl hover:bg-forest-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Provider Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primaryText">
                {language === 'bn' ? 'এআই প্রোভাইডার নির্বাচন করুন:' : 'Select AI Provider:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'server-gemini', name: 'Google Gemini (Server)', desc: 'Vercel Serverless • Recommended' },
                  { id: 'demo', name: 'অফলাইন ডেমো ইঞ্জিন', desc: 'No API key needed' },
                  { id: 'gemini', name: 'Gemini (Client Key)', desc: 'Direct browser API' },
                  { id: 'openai', name: 'OpenAI (GPT-4o)', desc: 'Custom OpenAI key' }
                ].map(prov => (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => {
                      const firstModel = PROVIDER_MODELS[prov.id as AiProviderType]?.[0]?.id || '';
                      setTempConfig(prev => ({
                        ...prev,
                        provider: prov.id as AiProviderType,
                        model: firstModel
                      }));
                      setTestResult(null);
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition ${
                      tempConfig.provider === prov.id
                        ? 'border-forest bg-forest/5 text-forest font-bold ring-2 ring-forest/20'
                        : 'border-softBorder hover:border-forest/40 bg-white text-secondaryText'
                    }`}
                  >
                    <div className="text-xs">{prov.name}</div>
                    <div className="text-[10px] text-mutedText font-normal mt-0.5">{prov.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Server-Gemini Explanatory Card */}
            {tempConfig.provider === 'server-gemini' && (
              <div className="p-3.5 rounded-2xl bg-forest-50 border border-forest/20 text-forest-dark text-xs space-y-2">
                <div className="font-bold flex items-center space-x-1.5 text-forest">
                  <CheckCircle2 className="w-4 h-4 text-forest" />
                  <span>{language === 'bn' ? 'সার্ভার-সাইড সুরক্ষিত কনফিগারেশন' : 'Server-Secured Gemini Integration'}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-secondaryText">
                  {language === 'bn'
                    ? 'আপনার Gemini API Key সরাসরি Vercel Dashboard-এ Environment Variable হিসেবে সংরক্ষিত থাকে (/api/chat)। এটি ব্রাউজারের নেটওয়ার্ক ট্র্যাফিক কিংবা কোডে কখনো উন্মুক্ত হয় না।'
                    : 'Your Gemini API key is securely stored in Vercel Environment Variables (/api/chat) and never exposed to the client browser or repository.'}
                </p>
                <div className="bg-white/90 p-2.5 rounded-xl text-[11px] font-mono border border-forest/15 space-y-1">
                  <div><span className="font-bold text-forest">Vercel Env:</span> GEMINI_API_KEY</div>
                  <div><span className="font-bold text-forest">Active Model:</span> gemini-3.8-flash</div>
                  <div><span className="font-bold text-forest">Endpoint:</span> /api/chat</div>
                </div>
              </div>
            )}

            {/* Model Selection (for client providers) */}
            {tempConfig.provider !== 'demo' && tempConfig.provider !== 'server-gemini' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primaryText">
                  {language === 'bn' ? 'মডেল সংস্করণ:' : 'Model Version:'}
                </label>
                <select
                  value={tempConfig.model}
                  onChange={(e) => setTempConfig(prev => ({ ...prev, model: e.target.value }))}
                  className="input-field py-2 text-xs rounded-xl w-full"
                >
                  {(PROVIDER_MODELS[tempConfig.provider] || []).map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* API Key Input (only for client-mode fallback) */}
            {tempConfig.provider !== 'demo' && tempConfig.provider !== 'server-gemini' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-primaryText flex items-center space-x-1">
                    <Key className="w-3.5 h-3.5 text-forest" />
                    <span>{language === 'bn' ? 'এপিআই কি (API Key):' : 'Provider API Key:'}</span>
                  </label>
                  {tempConfig.provider === 'gemini' && (
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-forest hover:underline font-bold"
                    >
                      Google AI Studio Key পান ↗
                    </a>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={tempConfig.apiKey}
                    onChange={(e) => setTempConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder={`Enter your ${tempConfig.provider.toUpperCase()} API key...`}
                    className="input-field py-2.5 pr-10 text-xs font-mono rounded-xl w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-2.5 text-mutedText hover:text-primaryText"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-[11px] space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{language === 'bn' ? 'ক্লায়েন্ট-সাইড নিরাপত্তা নোটিশ' : 'Client-Side Security Notice'}</span>
              </div>
              <p className="leading-relaxed text-amber-800">
                {language === 'bn' ? AI_SECURITY_NOTICE.bn : AI_SECURITY_NOTICE.en}
              </p>
            </div>

            {/* Test Connection Result */}
            {testResult && (
              <div className={`p-2.5 rounded-2xl text-xs font-medium border flex items-center space-x-2 ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* Modal Action Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-softBorder">
              <button
                type="button"
                onClick={handleResetSettings}
                className="btn-secondary py-2 px-3 text-xs rounded-xl text-mutedText hover:text-red-600"
              >
                {language === 'bn' ? 'ডিফল্ট রিসেট' : 'Reset to Demo'}
              </button>

              <div className="flex items-center space-x-2">
                {tempConfig.provider !== 'demo' && (
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTestingApi || (tempConfig.provider !== 'server-gemini' && !tempConfig.apiKey)}
                    className="btn-secondary py-2 px-3 text-xs rounded-xl disabled:opacity-50 flex items-center space-x-1"
                  >
                    {isTestingApi && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{tempConfig.provider === 'server-gemini' ? (language === 'bn' ? 'সার্ভার পরীক্ষা' : 'Test Server') : (language === 'bn' ? 'সংযোগ পরীক্ষা' : 'Test API')}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="btn-primary py-2 px-4 text-xs rounded-xl shadow-xs"
                >
                  {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Settings'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
