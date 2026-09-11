import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  ShieldCheck,
  Gamepad2,
  Download,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  APK_CONFIGS,
  setDocumentManifest,
  downloadApkPackage
} from '../../utils/apkGenerator';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'public' | 'admin';
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'public'
}) => {
  const [activeEdition, setActiveEdition] = useState<'public' | 'admin'>(defaultTab);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [installStatus, setInstallStatus] = useState<string | null>(null);

  const { install, isInstallable, isInstalled, isIOS } = usePWAInstall();
  const { setActiveTab, showToast } = useApp();
  const { isAdmin, currentUser, loginAsDemo } = useAuth();

  useEffect(() => {
    if (isOpen) {
      const tab: 'public' | 'admin' = defaultTab === 'admin' ? 'admin' : 'public';
      setActiveEdition(tab);
      setDocumentManifest(tab);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const publicUrl = `${window.location.origin}/?mode=public`;
  const adminUrl = `${window.location.origin}/?mode=admin`;
  const activeUrl = activeEdition === 'admin' ? adminUrl : publicUrl;

  const handleSwitchTab = (tab: 'public' | 'admin') => {
    setActiveEdition(tab);
    setDocumentManifest(tab);
  };

  const handleCopyLink = (url: string, label: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(label);
      showToast(`${label} link copied to clipboard!`, 'success');
      setTimeout(() => setCopiedLink(null), 2500);
    });
  };

  const handleInstallClick = async () => {
    setDocumentManifest(activeEdition);
    setInstallStatus('prompting');
    
    if (isInstallable) {
      const success = await install();
      if (success) {
        showToast(`SG Maker ${activeEdition === 'admin' ? 'Admin' : 'Public'} APK installed successfully!`, 'success');
      }
      setInstallStatus(null);
    } else {
      // In desktop or web preview, explain how to install or download
      setInstallStatus('info');
    }
  };

  const handleOpenDirectly = () => {
    if (activeEdition === 'admin') {
      if (!isAdmin) {
        loginAsDemo('admin');
      }
      setActiveTab('admin');
      showToast('Switched to SG Maker Admin Operations mode.', 'info');
    } else {
      setActiveTab('home');
      showToast('Switched to SG Maker Public Gamer mode.', 'info');
    }
    onClose();
  };

  return (
    <div
      id="sgm-apk-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        id="sgm-apk-modal-content"
        className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0c0e17] p-5 sm:p-7 shadow-2xl shadow-emerald-500/10 text-left my-auto"
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#090b10]">
                <Smartphone className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl font-bold text-white tracking-wide">
                  SG Maker Dual Android APK Hub
                </h2>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  2 APKS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Install both dedicated APKs on your Android phone or generate ready-to-use packages
              </p>
            </div>
          </div>
          <button
            id="sgm-apk-close-btn"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Edition Selector Tabs (Public Gamer vs Admin Portal) */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {/* TAB 1: Public Gamer APK */}
          <button
            id="sgm-apk-tab-public"
            type="button"
            onClick={() => handleSwitchTab('public')}
            className={`flex items-center gap-3 rounded-xl p-3 border text-left transition-all ${
              activeEdition === 'public'
                ? 'border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">1. Public APK</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
                  Gamers
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">Store, Services & Orders</p>
            </div>
          </button>

          {/* TAB 2: Admin Operations APK */}
          <button
            id="sgm-apk-tab-admin"
            type="button"
            onClick={() => handleSwitchTab('admin')}
            className={`flex items-center gap-3 rounded-xl p-3 border text-left transition-all ${
              activeEdition === 'admin'
                ? 'border-cyan-500/60 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">2. Admin APK</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-400">
                  Sufisoft
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">Manager & App Controller</p>
            </div>
          </button>
        </div>

        {/* Selected Edition Details Card */}
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3.5">
              <img
                src={activeEdition === 'admin' ? '/admin-icon-192.png' : '/icon-192.png'}
                alt={activeEdition}
                className="h-14 w-14 rounded-2xl ring-2 ring-emerald-500/30 shadow-lg shadow-black/40"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    {APK_CONFIGS[activeEdition].name}
                  </h3>
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">
                    v{APK_CONFIGS[activeEdition].version}
                  </span>
                </div>
                <p className="font-mono text-xs text-emerald-400/90">
                  Package: {APK_CONFIGS[activeEdition].packageName}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {APK_CONFIGS[activeEdition].description}
                </p>
              </div>
            </div>

            {/* Quick Open in Browser Button */}
            <button
              id="sgm-apk-open-mode-btn"
              type="button"
              onClick={handleOpenDirectly}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              <span>Switch View Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Core Features Included in this APK */}
          <div className="mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Features in {activeEdition === 'admin' ? 'Admin APK' : 'Public Gamer APK'}:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {activeEdition === 'public' ? (
                <>
                  <div className="flex items-center gap-2 rounded-lg bg-black/30 p-2 border border-white/5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Gaming Accessories Store & COD Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-black/30 p-2 border border-white/5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Studio Game Dev & Custom Modding Booking</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-black/30 p-2 border border-white/5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Real-time Order Tracking & Delivery Status</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-black/30 p-2 border border-white/5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Offline Mode & Local Catalog Storage</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 rounded-lg bg-black/30 p-2 border border-white/5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span>Live Order Dispatcher (Pending / Processing / Delivered)</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-black/30 p-2 border border-white/5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span>Inventory & Product Price / Stock Controller</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-black/30 p-2 border border-white/5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span>Studio Project Quotes & Inquiries Management</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-black/30 p-2 border border-white/5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span>Revenue Metrics & Authorized for sufisoft63@gmail.com</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons: Instant Android Install & APK Package Download */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Direct Android Install Trigger */}
            <button
              id="sgm-apk-install-trigger-btn"
              type="button"
              onClick={handleInstallClick}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition-all shadow-lg active:scale-95 ${
                activeEdition === 'admin'
                  ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/20'
                  : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span>
                {isInstalled
                  ? 'App Installed on Device'
                  : `Install ${activeEdition === 'admin' ? 'Admin APK' : 'Public APK'} to Android`}
              </span>
            </button>

            {/* Download APK Package */}
            <button
              id="sgm-apk-download-bundle-btn"
              type="button"
              onClick={() => downloadApkPackage(activeEdition)}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 px-4 text-xs font-bold text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              <Download className="h-4 w-4 text-emerald-400" />
              <span>Download {activeEdition === 'admin' ? 'Admin' : 'Public'} APK Bundle</span>
            </button>
          </div>

          {/* Mobile Chrome Installation Guide (Urdu & English) */}
          <div className="mt-4 rounded-lg bg-black/40 p-3 border border-white/5 text-[11px] text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-emerald-400 mb-1">
              <Info className="h-3.5 w-3.5" />
              <span>Mobile Phone Pe Direct Install Karne Ka Tareeqa (How to Install on Phone):</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              1. Apne Android phone ke Google Chrome browser mein yeh link open karein.
              <br />
              2. Chrome ke top-right <strong>3 dots (⋮)</strong> menu par click karein aur <strong>"Install App"</strong> ya <strong>"Add to Home screen"</strong> select karein.
              <br />
              3. Yeh direct standalone Native Android APK ban kar aapke mobile ki home screen par install ho jaye gi!
            </p>
          </div>

          {/* Link Copier Row */}
          <div className="mt-3 flex items-center justify-between rounded-lg bg-[#07080d] p-2 px-3 border border-white/10">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                Direct Link for Android Phone:
              </span>
              <span className="text-xs font-mono text-slate-300 truncate block">
                {activeUrl}
              </span>
            </div>
            <button
              id="sgm-apk-copy-btn"
              type="button"
              onClick={() => handleCopyLink(activeUrl, activeEdition === 'admin' ? 'Admin APK' : 'Public APK')}
              className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>Both editions operate independently with separated local state & manifests.</span>
          <span className="font-mono text-slate-400">Developer: sufisoft63@gmail.com</span>
        </div>
      </div>
    </div>
  );
};
