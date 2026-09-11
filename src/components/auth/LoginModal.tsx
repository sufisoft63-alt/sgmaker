import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { X, Phone, Mail, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

interface Country {
  name: string;
  code: string;
  flag: string;
  format: string;
}

const COUNTRIES: Country[] = [
  { name: 'Pakistan', code: '+92', flag: '🇵🇰', format: '300 1234567' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪', format: '50 123 4567' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦', format: '50 123 4567' },
  { name: 'United States', code: '+1', flag: '🇺🇸', format: '555 123 4567' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧', format: '7911 123456' },
  { name: 'Canada', code: '+1', flag: '🇨🇦', format: '555 123 4567' },
  { name: 'Turkey', code: '+90', flag: '🇹🇷', format: '501 234 5678' }
];

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, showToast } = useApp();
  const {
    loginWithGoogle,
    loginWithFacebook,
    loginAsDemo,
    sendPhoneOtp,
    verifyPhoneOtp,
    loginWithEmail,
    isLoading
  } = useAuth();

  const [authMethod, setAuthMethod] = useState<'phone' | 'email' | 'social'>('phone');
  
  // Phone OTP States
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]); // Default Pakistan
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpStep, setOtpStep] = useState<'phone-input' | 'otp-verify'>('phone-input');
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [testOtpHint, setTestOtpHint] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Email States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Timer countdown for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpStep === 'otp-verify' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, timer]);

  if (!isLoginModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    const cleanNumber = phoneNumber.trim().replace(/\D/g, '');
    if (cleanNumber.length < 9) {
      setPhoneError('Please enter a valid phone number (e.g. 300 1234567).');
      return;
    }

    const res = await sendPhoneOtp(selectedCountry.code, cleanNumber);
    if (res.success) {
      setOtpStep('otp-verify');
      setTimer(60);
      if (res.testOtp) {
        setTestOtpHint(res.testOtp);
        setOtpCode(res.testOtp); // prefill for tester convenience
      }
      showToast(res.message);
    } else {
      setPhoneError(res.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    if (otpCode.length !== 6) {
      setPhoneError('Please enter 6-digit verification code.');
      return;
    }

    const res = await verifyPhoneOtp(otpCode);
    if (res.success) {
      setIsLoginModalOpen(false);
      showToast(res.message);
    } else {
      setPhoneError(res.message);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setTimer(60);
    const cleanNumber = phoneNumber.trim().replace(/\D/g, '');
    const res = await sendPhoneOtp(selectedCountry.code, cleanNumber);
    if (res.testOtp) {
      setTestOtpHint(res.testOtp);
      setOtpCode(res.testOtp);
    }
    showToast('New OTP code sent!');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    const res = await loginWithEmail(email, password, isSignUp);
    if (res.success) {
      setIsLoginModalOpen(false);
      showToast(res.message);
    } else {
      setEmailError(res.message);
    }
  };

  const handleSocialGoogle = async () => {
    await loginWithGoogle();
    setIsLoginModalOpen(false);
    showToast('Signed in with Google successfully!');
  };

  const handleSocialFacebook = async () => {
    await loginWithFacebook();
    setIsLoginModalOpen(false);
    showToast('Signed in with Facebook successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0d101a] p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="sgm-login-close"
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-white tracking-wide">
            SG <span className="text-emerald-400">MAKER</span> AUTH
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Sign in to track orders, save addresses & request studio services
          </p>
        </div>

        {/* Method Switcher Tabs */}
        <div className="mb-5 flex rounded-xl bg-white/[0.04] p-1 border border-white/5">
          <button
            onClick={() => {
              setAuthMethod('phone');
              setPhoneError(null);
            }}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              authMethod === 'phone'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Phone & OTP
          </button>
          <button
            onClick={() => {
              setAuthMethod('email');
              setEmailError(null);
            }}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              authMethod === 'email'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Email Login
          </button>
          <button
            onClick={() => setAuthMethod('social')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              authMethod === 'social'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Social
          </button>
        </div>

        {/* METHOD 1: PHONE + OTP */}
        {authMethod === 'phone' && (
          <div>
            {otpStep === 'phone-input' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">
                    Country / Region
                  </label>
                  <div className="relative">
                    <select
                      id="sgm-login-country-select"
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const c = COUNTRIES.find((item) => item.code === e.target.value);
                        if (c) setSelectedCountry(c);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.name} value={c.code} className="bg-[#0e111a] text-white">
                          {c.flag} {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-white/[0.05] px-3 text-xs font-semibold text-emerald-400">
                      <span>{selectedCountry.flag}</span>
                      <span>{selectedCountry.code}</span>
                    </div>
                    <input
                      id="sgm-login-phone-input"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={selectedCountry.format}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                  {phoneError && (
                    <p className="mt-1 text-[11px] text-rose-400">{phoneError}</p>
                  )}
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Standard SMS rates may apply. A 6-digit verification code will be sent.
                  </p>
                </div>

                <button
                  id="sgm-login-send-otp-btn"
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-black transition-all hover:bg-emerald-400 active:scale-95 disabled:opacity-60"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Phone className="h-4 w-4" />
                      <span>Send OTP Code</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center">
                  <span className="text-xs text-slate-400">
                    Enter code sent to{' '}
                    <strong className="text-white">
                      {selectedCountry.code} {phoneNumber}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpStep('phone-input')}
                    className="ml-2 text-xs text-emerald-400 underline"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="mb-1.5 block text-center text-xs font-medium text-slate-300">
                    6-Digit OTP Code
                  </label>
                  <input
                    id="sgm-login-otp-input"
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="746251"
                    className="w-full rounded-xl border border-emerald-500/40 bg-white/[0.05] py-3 text-center text-lg font-bold tracking-[0.5em] text-emerald-400 placeholder-slate-600 focus:border-emerald-400 focus:outline-none"
                    required
                  />
                  {testOtpHint && (
                    <div className="mt-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-center text-[11px] text-emerald-300">
                      Demo Code: <strong>{testOtpHint}</strong> (pre-filled)
                    </div>
                  )}
                  {phoneError && (
                    <p className="mt-1 text-center text-[11px] text-rose-400">{phoneError}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Didn't receive code?</span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={timer > 0}
                    className={`font-semibold ${
                      timer > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-emerald-400 hover:underline'
                    }`}
                  >
                    {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                  </button>
                </div>

                <button
                  id="sgm-login-verify-otp-btn"
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-black transition-all hover:bg-emerald-400 active:scale-95 disabled:opacity-60"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* METHOD 2: EMAIL / PASSWORD */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">Email Address</label>
              <input
                id="sgm-login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sufisoft63@gmail.com"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">Password</label>
              <input
                id="sgm-login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            {emailError && <p className="text-[11px] text-rose-400">{emailError}</p>}

            <button
              id="sgm-login-email-btn"
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-black transition-all hover:bg-emerald-400 active:scale-95 disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  <span>{isSignUp ? 'Create SG Maker Account' : 'Sign In with Email'}</span>
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-slate-400 hover:text-emerald-400"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        )}

        {/* METHOD 3: SOCIAL AUTH (GOOGLE & FACEBOOK) */}
        {authMethod === 'social' && (
          <div className="space-y-3">
            {/* Google Sign In */}
            <button
              id="sgm-login-google-btn"
              onClick={handleSocialGoogle}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-xs font-semibold text-white transition-colors hover:bg-white/[0.08]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.1.1-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 12c0 1.4.6 3.6 1.6 5.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 15.9C3.5 19.8 7.4 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Facebook Sign In */}
            <button
              id="sgm-login-fb-btn"
              onClick={handleSocialFacebook}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#1877F2]/20 py-3 text-xs font-semibold text-blue-300 transition-colors hover:bg-[#1877F2]/30"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Continue with Facebook</span>
            </button>
          </div>
        )}
        {/* Quick Demo Sign-In for Easy Testing */}
        <div className="mt-5 border-t border-white/10 pt-4">
          <div className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Instant Demo Access
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="sgm-demo-login-admin"
              type="button"
              onClick={() => {
                loginAsDemo('admin');
                setIsLoginModalOpen(false);
                showToast('Signed in as Sufiyan (Developer Admin)');
              }}
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2 text-center text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
            >
              👑 Sufi Admin
            </button>
            <button
              id="sgm-demo-login-user"
              type="button"
              onClick={() => {
                loginAsDemo('user');
                setIsLoginModalOpen(false);
                showToast('Signed in as Gamer Ace');
              }}
              className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-2 text-center text-xs font-semibold text-cyan-400 transition-colors hover:bg-cyan-500/20"
            >
              🎮 Gamer Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
