import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { SavedAddressesModal } from './SavedAddressesModal';
import { SettingsModal } from './SettingsModal';
import { AboutModal } from './AboutModal';
import { ContactModal } from './ContactModal';
import {
  User,
  Package,
  MapPin,
  Bell,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Info,
  MessageSquare,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Smartphone
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, isLoggedIn, isAdmin, toggleRole, logout } = useAuth();
  const {
    setActiveTab,
    setIsLoginModalOpen,
    setIsNotificationDrawerOpen,
    unreadNotificationCount,
    openApkModal,
    showToast
  } = useApp();

  const [isAddressesOpen, setIsAddressesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-400 mb-4">
          <User className="h-8 w-8" />
        </div>
        <h2 className="font-heading text-xl font-bold text-white">Your Gamer Profile</h2>
        <p className="mt-1 text-xs text-slate-400 max-w-sm">
          Sign in or register with phone number, Google, or email to access orders, saved addresses, and studio privileges.
        </p>
        <button
          id="sgm-profile-login-btn"
          onClick={() => setIsLoginModalOpen(true)}
          className="mt-5 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-14">
      {/* 1. Main Profile Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c101a] p-5 sm:p-6 shadow-xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {/* Avatar with status ring */}
          <div className="relative">
            <img
              src={currentUser.profilePhoto}
              alt={currentUser.fullName}
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/20"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0c101a] ring-2 ring-emerald-500">
              <Sparkles className="h-3 w-3 text-emerald-400" />
            </span>
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-heading text-xl font-bold text-white">
                  {currentUser.fullName}
                </h2>
                <p className="text-xs text-emerald-400 font-semibold">@{currentUser.username}</p>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-mono text-slate-300">
                  ID: {currentUser.userId}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                    isAdmin
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-white/10 text-slate-300 border-white/10'
                  }`}
                >
                  {currentUser.role}
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-400">
              <div>Email: <span className="text-slate-200">{currentUser.email || 'N/A'}</span></div>
              <div>Phone: <span className="text-slate-200">{currentUser.phone}</span></div>
              <div>Region: <span className="text-slate-200">{currentUser.country} ({currentUser.countryCode})</span></div>
            </div>
          </div>
        </div>

        {/* Developer / Tester Role Toggle Switch */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="text-left">
            <span className="text-xs font-semibold text-white block">Developer / Tester Role Mode</span>
            <span className="text-[10px] text-slate-400">
              Active role: <strong className="text-emerald-400 uppercase">{currentUser.role}</strong> (Allows testing Admin Dashboard)
            </span>
          </div>
          <button
            id="sgm-toggle-role-btn"
            onClick={() => {
              toggleRole();
              showToast(`Switched role to ${currentUser.role === 'admin' ? 'User' : 'Admin'}!`);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20"
          >
            {isAdmin ? <ToggleRight className="h-4 w-4 text-emerald-400" /> : <ToggleLeft className="h-4 w-4 text-slate-400" />}
            <span>{isAdmin ? 'Admin Mode (Active)' : 'User Mode'}</span>
          </button>
        </div>
      </div>

      {/* 2. Admin Quick Access Banner if Admin */}
      {isAdmin && (
        <div
          id="sgm-profile-admin-banner"
          onClick={() => setActiveTab('admin')}
          className="cursor-pointer flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-[#0e1424] to-[#0c101a] p-4 transition-all hover:border-emerald-400"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-black shadow-md shadow-emerald-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-sm">SG Maker Admin Management</h3>
              <p className="text-[11px] text-emerald-300">
                Manage products, inventory, customer orders, and studio service requests
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-emerald-400" />
        </div>
      )}

      {/* 3. Navigation List */}
      <div className="rounded-2xl border border-white/5 bg-[#0e111a] overflow-hidden text-xs">
        {/* My Orders */}
        <button
          id="sgm-profile-orders"
          onClick={() => setActiveTab('orders')}
          className="flex w-full items-center justify-between p-4 text-slate-200 hover:bg-white/[0.04] transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-emerald-400">
              <Package className="h-4 w-4" />
            </div>
            <span className="font-semibold">My Orders & Tracking</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </button>

        {/* Saved Addresses */}
        <button
          id="sgm-profile-addresses"
          onClick={() => setIsAddressesOpen(true)}
          className="flex w-full items-center justify-between p-4 text-slate-200 hover:bg-white/[0.04] transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-cyan-400">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="font-semibold">Saved Delivery Addresses</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </button>

        {/* Notifications */}
        <button
          id="sgm-profile-notifs"
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="flex w-full items-center justify-between p-4 text-slate-200 hover:bg-white/[0.04] transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-amber-400">
              <Bell className="h-4 w-4" />
            </div>
            <span className="font-semibold">Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            {unreadNotificationCount > 0 && (
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-black">
                {unreadNotificationCount}
              </span>
            )}
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </div>
        </button>

        {/* Dual Android APK Hub (Admin & Public) */}
        <button
          id="sgm-profile-apk-btn"
          onClick={() => openApkModal('public')}
          className="flex w-full items-center justify-between p-4 text-slate-200 hover:bg-white/[0.04] transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Smartphone className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">Dual Android APKs</span>
                <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300">
                  Admin & Public
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Download or install standalone mobile APKs</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </button>

        {/* Settings */}
        <button
          id="sgm-profile-settings"
          onClick={() => setIsSettingsOpen(true)}
          className="flex w-full items-center justify-between p-4 text-slate-200 hover:bg-white/[0.04] transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-purple-400">
              <Settings className="h-4 w-4" />
            </div>
            <span className="font-semibold">Account Settings</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </button>

        {/* About SG Maker */}
        <button
          id="sgm-profile-about"
          onClick={() => setIsAboutOpen(true)}
          className="flex w-full items-center justify-between p-4 text-slate-200 hover:bg-white/[0.04] transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-blue-400">
              <Info className="h-4 w-4" />
            </div>
            <span className="font-semibold">About SG Maker</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </button>

        {/* Contact Studio */}
        <button
          id="sgm-profile-contact"
          onClick={() => setIsContactOpen(true)}
          className="flex w-full items-center justify-between p-4 text-slate-200 hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-rose-400">
              <MessageSquare className="h-4 w-4" />
            </div>
            <span className="font-semibold">Contact Studio Helpline</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      {/* Logout */}
      <button
        id="sgm-profile-logout-btn"
        onClick={() => {
          logout();
          showToast('Logged out safely.');
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 py-3 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-all"
      >
        <LogOut className="h-4 w-4" />
        <span>Sign Out of SG Maker</span>
      </button>

      {/* Modals */}
      <SavedAddressesModal isOpen={isAddressesOpen} onClose={() => setIsAddressesOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
};
