import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sprout, 
  Lock, 
  Phone, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Info, 
  RefreshCw,
  Globe,
  X,
  ShieldCheck,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters';

interface LoginPageProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  onOpenRegister?: () => void;
  onExploreAsGuest?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  isOpen = true,
  onClose,
  onSuccess, 
  onOpenRegister,
  onExploreAsGuest 
}) => {
  const { language, setLanguage, loginWithPhoneOtp, loginWithPassword, showToast } = useApp();

  // Mode: 'otp' | 'password'
  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');

  // OTP Login State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Password Login State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [passwordError, setPasswordError] = useState('');

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showForgotModal) {
          setShowForgotModal(false);
        } else if (onClose) {
          onClose();
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, showForgotModal]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  if (!isOpen) return null;

  // Validate Bangladeshi phone number (11 digits, starts with 01)
  const validatePhone = (phoneStr: string): boolean => {
    const clean = phoneStr.trim().replace(/[^\d]/g, '');
    if (clean.length !== 11) {
      setPhoneError(language === 'bn' ? '১১-সংখ্যার মোবাইল নম্বর লিখুন (যেমন: 017xxxxxxxx)' : 'Enter an 11-digit mobile number');
      return false;
    }
    if (!clean.startsWith('01')) {
      setPhoneError(language === 'bn' ? 'নম্বরটি 01 দিয়ে শুরু হতে হবে' : 'Number must start with 01');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(phoneNumber)) return;

    setOtpSent(true);
    setCountdown(60);
    showToast(
      language === 'bn' ? 'যাচাইকরণ ওটিপি পাঠানো হয়েছে' : 'Verification OTP Sent',
      'success',
      language === 'bn' ? `+88 ${phoneNumber} নম্বরে ৬-সংখ্যার কোড পাঠানো হয়েছে` : `Sent to +88 ${phoneNumber}`
    );
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      showToast(
        language === 'bn' ? '৬-সংখ্যার ওটিপি কোড লিখুন' : 'Enter 6-digit code',
        'warning'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await loginWithPhoneOtp(phoneNumber, fullOtp, rememberMe);
      setIsSubmitting(false);

      if (success) {
        if (onClose) onClose();
        if (onSuccess) onSuccess();
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!identifier.trim()) {
      setPasswordError(language === 'bn' ? 'মোবাইল বা ইমেইল লিখুন' : 'Please enter mobile or email');
      return;
    }

    if (password.length < 6) {
      setPasswordError(language === 'bn' ? 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await loginWithPassword(identifier, password, rememberMe);
      setIsSubmitting(false);

      if (success) {
        if (onClose) onClose();
        if (onSuccess) onSuccess();
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    // Only accept numeric digits
    const cleanDigit = val.replace(/[^\d]/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = cleanDigit.slice(-1);
    setOtpDigits(newDigits);

    // Auto-focus next input field
    if (cleanDigit && index < 5) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-digit-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-forest-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-3xl border border-softBorder shadow-2xl max-w-xl w-full p-6 sm:p-8 relative my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        
        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-secondaryText hover:text-forest-dark hover:bg-rice transition cursor-pointer"
            aria-label="Close Login Modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-forest flex items-center justify-center text-white shadow-xs shrink-0">
            <Sprout className="w-6 h-6 text-forest-leaf" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-black text-xl text-forest-dark tracking-tight">
                Agro<span className="text-forest-leaf">Nex</span>
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-forest-light text-forest rounded-full border border-forest/20">
                লগইন পোর্টাল
              </span>
            </div>
            <p className="text-xs text-secondaryText mt-0.5">
              {language === 'bn' ? 'আপনার অ্যাকাউন্টে সুরক্ষিতভাবে প্রবেশ করুন' : 'Securely access your farm account'}
            </p>
          </div>
        </div>

        {/* Auth Mode Tabs (Mobile OTP vs Password) */}
        <div className="flex items-center p-1 rounded-2xl bg-rice border border-softBorder mb-6 gap-1">
          <button
            type="button"
            onClick={() => { setAuthMode('otp'); setPhoneError(''); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              authMode === 'otp'
                ? 'bg-forest text-white shadow-xs'
                : 'text-secondaryText hover:text-primaryText'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'মোবাইল ওটিপি' : 'Mobile OTP'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('password'); setPasswordError(''); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              authMode === 'password'
                ? 'bg-forest text-white shadow-xs'
                : 'text-secondaryText hover:text-primaryText'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}</span>
          </button>
        </div>

        {/* TAB 1: MOBILE OTP LOGIN */}
        {authMode === 'otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-primaryText mb-1.5">
                    {language === 'bn' ? 'বাংলাদেশী মোবাইল নম্বর' : 'Bangladeshi Mobile Number'}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center space-x-1 text-xs font-bold text-secondaryText pr-2 border-r border-softBorder">
                      <span>🇧🇩 +88</span>
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="017xxxxxxxx"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (phoneError) setPhoneError('');
                      }}
                      className={`input-field pl-20 text-sm font-semibold tracking-wider ${
                        phoneError ? 'border-red-400 focus:border-red-500' : ''
                      }`}
                      autoFocus
                    />
                  </div>
                  {phoneError ? (
                    <span className="text-[11px] text-red-600 font-medium mt-1 block">
                      {phoneError}
                    </span>
                  ) : (
                    <span className="text-[11px] text-mutedText mt-1 block">
                      {language === 'bn' ? '১১-সংখ্যার মোবাইল নম্বর লিখুন (যেমন: 01712345678)' : '11-digit mobile number required'}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-xs pt-1">
                  <input
                    type="checkbox"
                    id="rememberMeOtp"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-forest focus:ring-forest/20 border-softBorder cursor-pointer"
                  />
                  <label htmlFor="rememberMeOtp" className="text-secondaryText cursor-pointer">
                    {language === 'bn' ? 'আমাকে এই ব্রাউজারে লগইন রাখুন' : 'Remember me on this browser'}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3 text-sm font-bold shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <span>{language === 'bn' ? 'ওটিপি কোড পাঠান' : 'Send Verification OTP'}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex items-center justify-between text-xs pb-1">
                  <span className="text-secondaryText">
                    {language === 'bn' ? 'প্রেরিত নম্বর:' : 'Sent to:'} <strong>+88 {phoneNumber}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpDigits(['', '', '', '', '', '']); }}
                    className="text-forest font-bold hover:underline cursor-pointer"
                  >
                    {language === 'bn' ? 'নম্বর পরিবর্তন' : 'Change'}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primaryText mb-2 text-center">
                    {language === 'bn' ? '৬-সংখ্যার যাচাইকরণ কোড লিখুন' : 'Enter 6-Digit Verification Code'}
                  </label>
                  <div className="flex justify-center gap-2 sm:gap-2.5">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-digit-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-10 h-12 sm:w-11 sm:h-12 text-center text-lg font-black rounded-xl border border-softBorder bg-warmWhite focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition"
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-secondaryText pt-1">
                  <span>
                    {countdown > 0 ? (
                      <span>
                        {language === 'bn' 
                          ? `পুনরায় পাঠানো যাবে: ${toBengaliDigits(countdown)} সেকেন্ড` 
                          : `Resend code in: ${countdown}s`}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setCountdown(60);
                          showToast(language === 'bn' ? 'নতুন ওটিপি কোড পাঠানো হয়েছে' : 'New OTP code sent', 'info');
                        }}
                        className="text-forest font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'পুনরায় ওটিপি পাঠান' : 'Resend OTP'}</span>
                      </button>
                    )}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3 text-sm font-bold shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-1.5">
                      <span>{language === 'bn' ? 'যাচাই সম্পন্ন করে প্রবেশ করুন' : 'Verify & Sign In'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: PASSWORD LOGIN */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-primaryText mb-1.5">
                {language === 'bn' ? 'মোবাইল নম্বর অথবা ইমেইল' : 'Mobile Number or Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-mutedText" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="017xxxxxxxx or name@email.com"
                  className="input-field pl-10 text-xs sm:text-sm"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-primaryText">
                  {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-forest font-bold hover:underline cursor-pointer"
                >
                  {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-mutedText" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10 text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-mutedText hover:text-primaryText cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <span className="text-[11px] text-red-600 font-medium mt-1 block">
                  {passwordError}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                id="rememberMePassword"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-forest focus:ring-forest/20 border-softBorder cursor-pointer"
              />
              <label htmlFor="rememberMePassword" className="text-secondaryText cursor-pointer">
                {language === 'bn' ? 'আমাকে এই ব্রাউজারে লগইন রাখুন' : 'Remember me on this browser'}
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 text-sm font-bold shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{language === 'bn' ? 'লগইন হচ্ছে...' : 'Signing in...'}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-1.5">
                  <span>{language === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>
        )}

        {/* Bottom Switch: Registration */}
        <div className="pt-5 mt-5 border-t border-softBorder text-center text-xs text-secondaryText">
          <span>{language === 'bn' ? 'নতুন ব্যবহারকারী?' : "Don't have an account?"} </span>
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              if (onOpenRegister) onOpenRegister();
            }}
            className="font-bold text-forest hover:text-forest-dark hover:underline cursor-pointer"
          >
            {language === 'bn' ? 'বিনামূল্যে অ্যাকাউন্ট নিবন্ধন করুন' : 'Register Free Account'}
          </button>
        </div>

      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div 
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowForgotModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-softBorder"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-softBorder pb-3">
              <h3 className="font-bold text-forest-dark text-sm">
                {language === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Reset Password'}
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-mutedText hover:text-primaryText font-bold"
              >
                ✕
              </button>
            </div>
            
            {!forgotSent ? (
              <div className="space-y-3">
                <p className="text-xs text-secondaryText leading-relaxed">
                  {language === 'bn'
                    ? 'আপনার নিবন্ধিত মোবাইল নম্বর লিখুন। পাসওয়ার্ড রিসেট করার জন্য একটি এককালীন যাচাইকরণ লিংক পাঠানো হবে।'
                    : 'Enter your registered phone number to receive reset instructions.'}
                </p>
                <div>
                  <label className="block text-xs font-bold text-primaryText mb-1">
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
                  </label>
                  <input
                    type="tel"
                    placeholder="017xxxxxxxx"
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    className="input-field text-xs"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="btn-secondary text-xs"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!forgotPhone || forgotPhone.length < 11) {
                        showToast(language === 'bn' ? 'সঠিক নম্বর দিন' : 'Enter valid phone', 'warning');
                        return;
                      }
                      setForgotSent(true);
                      showToast(
                        language === 'bn' ? 'রিসেট নির্দেশিকা পাঠানো হয়েছে' : 'Reset instructions sent',
                        'success'
                      );
                    }}
                    className="btn-primary text-xs"
                  >
                    {language === 'bn' ? 'কোড পাঠান' : 'Send Instructions'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-xs text-secondaryText leading-relaxed">
                  {language === 'bn'
                    ? `+88 ${forgotPhone} নম্বরে পাসওয়ার্ড রিসেট করার নির্দেশিকা সফলভাবে পাঠানো হয়েছে।`
                    : `Password reset instructions have been sent to +88 ${forgotPhone}.`}
                </p>
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(false); setForgotSent(false); }}
                  className="btn-primary text-xs w-full py-2"
                >
                  {language === 'bn' ? 'লগইনে ফিরুন' : 'Back to Sign In'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
