import React from 'react';
import { X, Gamepad2, Sparkles, ShieldCheck, MapPin, Globe, Cpu } from 'lucide-react';

export const AboutModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md">
      <div
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c101a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-emerald-400" />
            <h3 className="font-heading font-bold text-white text-base">About SG Maker</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="text-center py-2">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-xl font-bold text-white">
              SG <span className="text-emerald-400">MAKER</span>
            </h2>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
              Gaming. Development. Technology.
            </p>
          </div>

          <p>
            <strong>SG Maker</strong> is Pakistan’s pioneering hybrid gaming technology platform, unifying an advanced Game Development Studio with an esports-grade mobile accessories marketplace.
          </p>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              Our Core Pillars
            </h4>
            <div className="space-y-1 text-[11px]">
              <p>• <strong>Game Studio:</strong> Unity & Unreal Engine development, Photon multiplayer servers, and 3D environment art.</p>
              <p>• <strong>Hardware Gear:</strong> CryoFrost cooling fans, 7.1 surround headsets, mechanical triggers, and low-latency Bluetooth controllers.</p>
              <p>• <strong>Local Dispatch:</strong> Nationwide Cash on Delivery (COD) service covering Lahore, Karachi, Islamabad, Rawalpindi, and 50+ cities.</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2 text-slate-200">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span>Studio HQ: MM Alam Road, Gulberg III, Lahore, Pakistan</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              <span>Developer Portal: www.sgmaker.pk</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <Cpu className="h-3.5 w-3.5 text-purple-400" />
              <span>Engine Version: SG Maker Core v2.4 PWA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
