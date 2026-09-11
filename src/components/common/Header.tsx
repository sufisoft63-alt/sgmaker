import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Gamepad2,
  MapPin,
  Search,
  ShoppingCart,
  Bell,
  User,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartCount,
    unreadNotificationCount,
    setIsSearchModalOpen,
    setIsCartDrawerOpen,
    setIsNotificationDrawerOpen,
    setIsLoginModalOpen,
    openApkModal,
    selectedAddress
  } = useApp();

  const { currentUser, isLoggedIn, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0a0c13]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Brand Logo */}
        <div
          id="sgm-header-brand"
          onClick={() => setActiveTab('home')}
          className="flex cursor-pointer items-center gap-2.5 transition-transform active:scale-95"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#090b10]">
              <Gamepad2 className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-lg font-bold tracking-wider text-white">
                SG <span className="text-emerald-400">MAKER</span>
              </span>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-emerald-400 border border-emerald-500/20">
                STUDIO
              </span>
            </div>
            <p className="hidden text-[10px] font-medium tracking-wide text-slate-400 sm:block">
              Gaming. Development. Technology.
            </p>
          </div>
        </div>

        {/* Location selector / Delivery Badge */}
        <div
          id="sgm-header-location"
          onClick={() => {
            if (isLoggedIn) {
              setActiveTab('profile');
            } else {
              setIsLoginModalOpen(true);
            }
          }}
          className="hidden cursor-pointer items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-emerald-500/30 hover:bg-white/[0.06] md:flex"
        >
          <MapPin className="h-3.5 w-3.5 text-emerald-400" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-slate-400">Deliver to</span>
            <span className="max-w-[130px] truncate font-medium text-slate-200">
              {selectedAddress ? `${selectedAddress.city}, ${selectedAddress.area}` : 'Pakistan (Select)'}
            </span>
          </div>
        </div>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors hover:text-emerald-400 ${activeTab === 'home' ? 'text-emerald-400 font-semibold' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`transition-colors hover:text-emerald-400 ${activeTab === 'shop' ? 'text-emerald-400 font-semibold' : ''}`}
          >
            Accessories Shop
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`transition-colors hover:text-emerald-400 ${activeTab === 'services' ? 'text-emerald-400 font-semibold' : ''}`}
          >
            Gaming Studio
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`transition-colors hover:text-emerald-400 ${activeTab === 'orders' ? 'text-emerald-400 font-semibold' : ''}`}
          >
            My Orders
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition-colors hover:bg-emerald-500/20 ${
                activeTab === 'admin' ? 'ring-1 ring-emerald-400' : ''
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Admin
            </button>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Global Search Trigger */}
          <button
            id="sgm-header-search-btn"
            onClick={() => setIsSearchModalOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03] text-slate-300 transition-colors hover:border-white/20 hover:text-white"
            title="Search games, accessories and services..."
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Dual Android APK Hub Trigger */}
          <button
            id="sgm-header-apk-btn"
            onClick={() => openApkModal('public')}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2.5 text-cyan-400 transition-colors hover:bg-cyan-500/20 hover:border-cyan-500/40"
            title="Download & Install 2 APKs (Admin & Public)"
          >
            <Smartphone className="h-4 w-4" />
            <span className="text-xs font-bold hidden sm:inline">2 APKs</span>
          </button>

          {/* Notifications Button with Badge */}
          <button
            id="sgm-header-notif-btn"
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03] text-slate-300 transition-colors hover:border-white/20 hover:text-white"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-black shadow-md shadow-emerald-500/50">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Drawer Trigger */}
          <button
            id="sgm-header-cart-btn"
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative flex h-9 items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 text-emerald-400 transition-colors hover:bg-emerald-500/20"
            title="Shopping Cart"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-xs font-semibold">{cartCount}</span>
          </button>

          {/* User Profile / Login */}
          {isLoggedIn && currentUser ? (
            <button
              id="sgm-header-profile-btn"
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-1 pr-2.5 transition-colors hover:border-emerald-500/40"
              title="Profile"
            >
              <img
                src={currentUser.profilePhoto}
                alt={currentUser.fullName}
                className="h-7 w-7 rounded-md object-cover ring-1 ring-emerald-500/40"
                referrerPolicy="no-referrer"
              />
              <span className="hidden text-xs font-medium text-slate-200 sm:block max-w-[80px] truncate">
                {currentUser.username}
              </span>
            </button>
          ) : (
            <button
              id="sgm-header-login-btn"
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-black transition-transform hover:bg-emerald-400 active:scale-95 shadow-md shadow-emerald-500/20"
            >
              <User className="h-3.5 w-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
