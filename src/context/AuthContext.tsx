import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { storeService } from '../services/store';

interface AuthContextType {
  currentUser: UserProfile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  needsProfileSetup: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginAsDemo: (role?: 'admin' | 'user') => void;
  sendPhoneOtp: (countryCode: string, phone: string) => Promise<{ success: boolean; testOtp?: string; message: string }>;
  verifyPhoneOtp: (otp: string) => Promise<{ success: boolean; message: string }>;
  loginWithEmail: (email: string, pass: string, isSignUp?: boolean) => Promise<{ success: boolean; message: string }>;
  completeProfileSetup: (data: { username: string; fullName: string; profilePhoto?: string }) => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  toggleRole: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'sgm_auth_user_v1';
const PENDING_PHONE_KEY = 'sgm_pending_phone_v1';

// Default initial user for instant preview / demo convenience
export const DEMO_ADMIN_USER: UserProfile = {
  uid: 'usr-demo-1',
  userId: 'SGM-84920',
  username: 'gamer_pro_pk',
  fullName: 'Sufiyan (Developer)',
  email: 'sufisoft63@gmail.com', // Admin email specified in instructions
  phone: '+92 301 5556677',
  country: 'Pakistan',
  countryCode: '+92',
  profilePhoto: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
  role: 'admin',
  createdAt: '2025-01-01T00:00:00Z'
};

export const DEMO_GAMER_USER: UserProfile = {
  uid: 'usr-demo-2',
  userId: 'SGM-19283',
  username: 'pak_esports_ace',
  fullName: 'Hamza Khan',
  email: 'hamza.gamer@gmail.com',
  phone: '+92 321 9876543',
  country: 'Pakistan',
  countryCode: '+92',
  profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  role: 'user',
  createdAt: '2025-01-02T00:00:00Z'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [needsProfileSetup, setNeedsProfileSetup] = useState<boolean>(false);
  const [pendingAuthData, setPendingAuthData] = useState<{
    phone?: string;
    email?: string;
    country?: string;
    countryCode?: string;
    generatedOtp?: string;
  } | null>(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const generateUserId = () => {
    return `SGM-${Math.floor(10000 + Math.random() * 90000)}`;
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Simulate real Google Sign-In with developer or mock details
      await new Promise((res) => setTimeout(res, 800));
      const user: UserProfile = {
        uid: `goog-${Date.now()}`,
        userId: generateUserId(),
        username: 'sufi_gamer',
        fullName: 'Sufi Soft',
        email: 'sufisoft63@gmail.com',
        phone: '+92 300 0000000',
        country: 'Pakistan',
        countryCode: '+92',
        profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      setCurrentUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      const user: UserProfile = {
        uid: `fb-${Date.now()}`,
        userId: generateUserId(),
        username: 'facebook_gamer',
        fullName: 'FB Gaming User',
        email: 'user.fb@gamingpk.com',
        phone: '+92 321 0000000',
        country: 'Pakistan',
        countryCode: '+92',
        profilePhoto: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
        role: 'user',
        createdAt: new Date().toISOString()
      };
      setCurrentUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const sendPhoneOtp = async (countryCode: string, phone: string) => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 600));
      // Standard demo OTP
      const testOtp = '746251';
      setPendingAuthData({
        phone,
        countryCode,
        country: countryCode === '+92' ? 'Pakistan' : 'International',
        generatedOtp: testOtp
      });
      return {
        success: true,
        testOtp,
        message: `OTP sent successfully to ${countryCode} ${phone}.`
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhoneOtp = async (otp: string) => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 600));
      // Accept either generated demo OTP 746251 or any valid 6-digit number in demo
      if (otp.length !== 6) {
        return { success: false, message: 'Please enter a valid 6-digit OTP code.' };
      }
      
      const fullPhone = `${pendingAuthData?.countryCode || '+92'} ${pendingAuthData?.phone || '300 1234567'}`;
      
      // New login triggers profile setup requirement
      setNeedsProfileSetup(true);
      const partialUser: UserProfile = {
        uid: `phone-${Date.now()}`,
        userId: generateUserId(),
        username: '',
        fullName: '',
        email: '',
        phone: fullPhone,
        country: pendingAuthData?.country || 'Pakistan',
        countryCode: pendingAuthData?.countryCode || '+92',
        profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        role: 'user',
        createdAt: new Date().toISOString()
      };
      setCurrentUser(partialUser);
      return { success: true, message: 'OTP verified successfully!' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string, isSignUp?: boolean) => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 700));
      if (!email.includes('@')) {
        return { success: false, message: 'Please enter a valid email address.' };
      }
      if (pass.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters.' };
      }

      const isAdminEmail = email.toLowerCase().trim() === 'sufisoft63@gmail.com' || email.includes('admin');
      const user: UserProfile = {
        uid: `email-${Date.now()}`,
        userId: generateUserId(),
        username: email.split('@')[0],
        fullName: email.split('@')[0].toUpperCase(),
        email,
        phone: '+92 300 1234567',
        country: 'Pakistan',
        countryCode: '+92',
        profilePhoto: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
        role: isAdminEmail ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      };

      if (isSignUp) {
        setNeedsProfileSetup(true);
      }
      setCurrentUser(user);
      return { success: true, message: isSignUp ? 'Account created!' : 'Signed in successfully!' };
    } finally {
      setIsLoading(false);
    }
  };

  const completeProfileSetup = async (data: { username: string; fullName: string; profilePhoto?: string }) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      username: data.username.trim().toLowerCase().replace(/\s+/g, '_') || currentUser.username || 'gamer',
      fullName: data.fullName.trim() || currentUser.fullName || 'Valued Gamer',
      profilePhoto: data.profilePhoto || currentUser.profilePhoto
    };
    setCurrentUser(updated);
    setNeedsProfileSetup(false);
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const nextUser = { ...currentUser, ...updated, updatedAt: new Date().toISOString() };
    setCurrentUser(nextUser);
  };

  const loginAsDemo = (role: 'admin' | 'user' = 'admin') => {
    const userToUse = role === 'admin' ? DEMO_ADMIN_USER : DEMO_GAMER_USER;
    setCurrentUser(userToUse);
    setNeedsProfileSetup(false);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userToUse));
  };

  const toggleRole = () => {
    if (!currentUser) return;
    const nextRole: UserRole = currentUser.role === 'admin' ? 'user' : 'admin';
    setCurrentUser({ ...currentUser, role: nextRole });
  };

  const logout = () => {
    setCurrentUser(null);
    setNeedsProfileSetup(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isLoggedIn: currentUser !== null,
        isAdmin: currentUser?.role === 'admin',
        needsProfileSetup,
        loginWithGoogle,
        loginWithFacebook,
        loginAsDemo,
        sendPhoneOtp,
        verifyPhoneOtp,
        loginWithEmail,
        completeProfileSetup,
        updateProfile,
        toggleRole,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
