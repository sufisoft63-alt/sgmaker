import { isLiveFirebaseActive, testConnection } from '../lib/firebase';
import { storeService } from './store';

export type SplashState = 'initializing' | 'ready' | 'error' | 'timeout' | 'skipped';

export interface InitStepInfo {
  stepIndex: number;
  percent: number;
  label: string;
  sublabel: string;
}

export interface InitServiceResult {
  success: boolean;
  isOffline: boolean;
  hasUser: boolean;
  error?: string;
}

export const INITIALIZATION_STEPS: InitStepInfo[] = [
  { stepIndex: 0, percent: 0, label: 'Initializing Gaming Engine...', sublabel: 'Starting core systems' },
  { stepIndex: 1, percent: 25, label: 'Loading App Configuration...', sublabel: 'Verifying local storage & assets' },
  { stepIndex: 2, percent: 50, label: 'Connecting Cloud & Firebase...', sublabel: 'Synchronizing network state' },
  { stepIndex: 3, percent: 75, label: 'Restoring User Session...', sublabel: 'Checking authentication & theme' },
  { stepIndex: 4, percent: 100, label: 'Initialization Complete!', sublabel: 'Launching SG Maker' },
];

/**
 * Safe with-timeout promise wrapper that never throws an unhandled rejection
 */
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      resolve(fallback);
    }, ms);
  });

  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }).catch((err) => {
      clearTimeout(timer);
      console.warn('Wrapped initialization step warning:', err);
      return fallback;
    }),
    timeoutPromise,
  ]);
}

class InitService {
  private isCancelled = false;

  public cancel(): void {
    this.isCancelled = true;
  }

  public reset(): void {
    this.isCancelled = false;
  }

  /**
   * Safe step-by-step initialization sequence
   */
  public async runInitialization(
    onProgress: (step: InitStepInfo) => void
  ): Promise<InitServiceResult> {
    this.reset();
    let isOffline = false;
    let hasUser = false;

    try {
      // STEP 0: 0% - Starting Gaming Engine
      onProgress(INITIALIZATION_STEPS[0]);
      await new Promise((r) => setTimeout(r, 120));
      if (this.isCancelled) return { success: true, isOffline: false, hasUser: false };

      // STEP 1: 25% - App Configuration & Local Storage Check
      onProgress(INITIALIZATION_STEPS[1]);
      await withTimeout(
        (async () => {
          try {
            // Validate localStorage access
            const testKey = '__sgm_test_storage__';
            localStorage.setItem(testKey, '1');
            localStorage.removeItem(testKey);

            // Preload cached data safely
            storeService.getProducts();
            storeService.getCategories();
            storeService.getServices();
            storeService.getBanners();
          } catch (e) {
            console.warn('Local storage or cache check notice:', e);
          }
        })(),
        1500,
        undefined
      );
      if (this.isCancelled) return { success: true, isOffline: false, hasUser: false };

      // STEP 2: 50% - Firebase & Cloud Network Check
      onProgress(INITIALIZATION_STEPS[2]);
      await withTimeout(
        (async () => {
          try {
            const hasLive = isLiveFirebaseActive();
            if (hasLive) {
              const connected = await testConnection();
              isOffline = !connected;
            } else {
              isOffline = true;
            }
          } catch (e) {
            console.warn('Firebase connection test notice (falling back to offline mode):', e);
            isOffline = true;
          }
        })(),
        2000,
        undefined
      );
      if (this.isCancelled) return { success: true, isOffline: true, hasUser: false };

      // STEP 3: 75% - User Session & Theme Check
      onProgress(INITIALIZATION_STEPS[3]);
      await withTimeout(
        (async () => {
          try {
            // Check auth storage
            const storedUser = localStorage.getItem('sgm_auth_user_v1');
            hasUser = !!storedUser;

            // Apply theme attributes to document if needed
            document.documentElement.classList.add('dark');
          } catch (e) {
            console.warn('User session check notice:', e);
          }
        })(),
        1000,
        undefined
      );
      if (this.isCancelled) return { success: true, isOffline, hasUser };

      // STEP 4: 100% - Ready!
      onProgress(INITIALIZATION_STEPS[4]);
      // Small 500ms delay for smooth perception as required
      await new Promise((r) => setTimeout(r, 450));

      return {
        success: true,
        isOffline,
        hasUser,
      };
    } catch (err) {
      console.error('Fatal initialization error:', err);
      return {
        success: false,
        isOffline: true,
        hasUser: false,
        error: err instanceof Error ? err.message : 'Unknown initialization error',
      };
    }
  }
}

export const initService = new InitService();
