import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Gamepad2, Cpu, Sparkles, AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react';
import { initService, InitStepInfo, INITIALIZATION_STEPS, SplashState } from '../../services/initService';

export interface SplashFinishPayload {
  skipped?: boolean;
  isOffline?: boolean;
  hasUser?: boolean;
  reason?: 'ready' | 'skipped' | 'timeout' | 'error';
}

interface SplashScreenProps {
  onFinish?: (payload: SplashFinishPayload) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [status, setStatus] = useState<SplashState>('initializing');
  const [currentStep, setCurrentStep] = useState<InitStepInfo>(INITIALIZATION_STEPS[0]);
  const [progress, setProgress] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // References to guarantee no stale closures or dangling timeouts
  const statusRef = useRef<SplashState>('initializing');
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasFinishedRef = useRef<boolean>(false);

  statusRef.current = status;

  const triggerCompletion = useCallback(
    (payload: SplashFinishPayload) => {
      if (hasFinishedRef.current) return;
      hasFinishedRef.current = true;

      // Clear any pending timers
      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
        timeoutTimerRef.current = null;
      }

      // Mark dismissed internally
      setIsDismissed(true);

      // Guarantee call to onFinish
      if (typeof onFinish === 'function') {
        try {
          onFinish(payload);
        } catch (err) {
          console.warn('Splash onFinish callback notice:', err);
        }
      }
    },
    [onFinish]
  );

  const startInitialization = useCallback(() => {
    hasFinishedRef.current = false;
    setStatus('initializing');
    setProgress(0);
    setCurrentStep(INITIALIZATION_STEPS[0]);

    // Setup 10-Second Safety Timeout Protection
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
    }
    timeoutTimerRef.current = setTimeout(() => {
      if (statusRef.current === 'initializing' && !hasFinishedRef.current) {
        console.warn('Splash initialization hit 10s maximum timeout protection.');
        setStatus('timeout');
      }
    }, 10000);

    // Run safe step-by-step sequence
    initService
      .runInitialization((step) => {
        if (statusRef.current !== 'initializing') return;
        setCurrentStep(step);
        setProgress(step.percent);
      })
      .then((result) => {
        // If already timed out or skipped, do not overwrite state
        if (statusRef.current !== 'initializing' || hasFinishedRef.current) {
          return;
        }

        if (result.success) {
          setProgress(100);
          setStatus('ready');

          // Guaranteed 100% transition: wait 500ms then navigate to application
          setTimeout(() => {
            triggerCompletion({
              hasUser: result.hasUser,
              isOffline: result.isOffline,
              reason: 'ready'
            });
          }, 500);
        } else {
          setStatus('error');
        }
      })
      .catch((err) => {
        console.warn('Initialization error caught safely:', err);
        if (statusRef.current === 'initializing') {
          setStatus('error');
        }
      });
  }, [triggerCompletion]);

  useEffect(() => {
    startInitialization();

    return () => {
      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
      }
      initService.cancel();
    };
  }, [startInitialization]);

  // Handler for "Skip to App →" (Always Works)
  const handleSkip = () => {
    initService.cancel();
    setStatus('skipped');
    const storedUser = localStorage.getItem('sgm_auth_user_v1');
    triggerCompletion({
      skipped: true,
      hasUser: !!storedUser,
      reason: 'skipped'
    });
  };

  // Handler for "Continue to App" in Timeout or Error state (Always Works)
  const handleContinue = () => {
    const storedUser = localStorage.getItem('sgm_auth_user_v1');
    triggerCompletion({
      isOffline: true,
      hasUser: !!storedUser,
      reason: status === 'timeout' ? 'timeout' : 'error'
    });
  };

  // Handler for "Retry" in Timeout or Error state
  const handleRetry = () => {
    startInitialization();
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div
      id="sgm-splash-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080c] px-6 text-center select-none"
    >
      {/* Ambient background glow effects */}
      <div className="absolute top-1/3 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="absolute bottom-1/3 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
        {/* Animated Cyber Logo Container */}
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-2xl bg-emerald-500/20 duration-1000" />
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-400 to-emerald-400 p-0.5 shadow-[0_0_35px_rgba(16,185,129,0.4)]">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#090b10]">
              <Gamepad2 className="h-12 w-12 text-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="mb-2 flex items-center justify-center gap-2">
          <h1 className="font-heading text-4xl font-extrabold tracking-wider text-white">
            SG <span className="text-emerald-400">MAKER</span>
          </h1>
          <Sparkles className="h-5 w-5 text-cyan-400 animate-bounce" />
        </div>

        {/* Tagline */}
        <p className="mb-8 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Gaming. Development. Technology.
        </p>

        {/* ACTIVE INITIALIZING STATE */}
        {(status === 'initializing' || status === 'ready') && (
          <div className="w-full flex flex-col items-center">
            {/* Loading Progress Bar */}
            <div className="w-64 overflow-hidden rounded-full bg-slate-800/80 p-0.5 border border-white/10 shadow-inner">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${Math.max(progress, 5)}%` }}
              />
            </div>

            {/* Step Status Text */}
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-300">
              <Cpu className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
              <span>
                {currentStep.label} {progress}%
              </span>
            </div>
            <span className="mt-1 text-[11px] text-slate-500">{currentStep.sublabel}</span>
          </div>
        )}

        {/* TIMEOUT PROTECTION UI (After 10 seconds) */}
        {status === 'timeout' && (
          <div className="w-full rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-amber-200">
              Some services are taking longer than expected.
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              You can proceed directly in offline mode or try re-connecting.
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <button
                id="sgm-splash-continue-btn"
                type="button"
                onClick={handleContinue}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-black transition-all hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                <span>Continue to App</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                id="sgm-splash-retry-btn"
                type="button"
                onClick={handleRetry}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {/* ERROR STATE UI */}
        {status === 'error' && (
          <div className="w-full rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-rose-200">
              Some services could not be initialized.
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              You can continue to the app with cached offline features.
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <button
                id="sgm-splash-error-continue-btn"
                type="button"
                onClick={handleContinue}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-black transition-all hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                <span>Continue to App</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                id="sgm-splash-error-retry-btn"
                type="button"
                onClick={handleRetry}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Skip Button - ALWAYS VISIBLE, NEVER DISABLED */}
      <button
        id="sgm-splash-skip-btn"
        type="button"
        onClick={handleSkip}
        className="absolute bottom-8 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 underline decoration-slate-600 transition-colors hover:text-emerald-400 cursor-pointer"
      >
        <span>Skip to App →</span>
      </button>
    </div>
  );
};
