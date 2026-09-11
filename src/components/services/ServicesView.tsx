import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Code,
  Sparkles,
  ArrowRight,
  Gamepad2,
  CheckCircle2,
  Layers,
  Cpu,
  Trophy,
  Users
} from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Services' },
  { id: 'Game Development', label: 'Game Development' },
  { id: 'Design & Art', label: 'Design & 3D Art' },
  { id: 'Backend & Cloud', label: 'Backend & Cloud' },
  { id: 'Support & Maintenance', label: 'Support & Optimization' },
];

export const ServicesView: React.FC = () => {
  const { services, setSelectedService, openServiceRequestModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'all') return services;
    return services.filter((s) => s.category === selectedCategory);
  }, [services, selectedCategory]);

  return (
    <div className="space-y-8 pb-12">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#070b14] via-[#0d1424] to-[#08182b] p-6 sm:p-10 shadow-2xl">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-500/20 mb-3">
            <Gamepad2 className="h-3.5 w-3.5" />
            SG Maker Engineering Studio
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            Full-Cycle Game Development & Engineering
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            From hyper-casual tap-to-play prototypes to massive multiplayer battle royales and low-draw-call optimization for mid-range Pakistani smartphones.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              id="sgm-services-quote-btn"
              onClick={() => openServiceRequestModal()}
              className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-xs font-bold text-black transition-all hover:bg-cyan-300 active:scale-95 shadow-lg shadow-cyan-500/25"
            >
              <Sparkles className="h-4 w-4" />
              <span>Get Free Technical Estimate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Studio Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/5 bg-[#0e111a] p-4 text-center">
          <div className="flex h-9 w-9 mx-auto items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-2">
            <Trophy className="h-4 w-4" />
          </div>
          <div className="font-heading text-xl font-bold text-white">45+</div>
          <span className="text-[11px] text-slate-400">Games & Prototypes Delivered</span>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0e111a] p-4 text-center">
          <div className="flex h-9 w-9 mx-auto items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-2">
            <Users className="h-4 w-4" />
          </div>
          <div className="font-heading text-xl font-bold text-white">6.2M+</div>
          <span className="text-[11px] text-slate-400">Total Player Sessions</span>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0e111a] p-4 text-center">
          <div className="flex h-9 w-9 mx-auto items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-2">
            <Cpu className="h-4 w-4" />
          </div>
          <div className="font-heading text-xl font-bold text-white">60-90 FPS</div>
          <span className="text-[11px] text-slate-400">Optimized Performance</span>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0e111a] p-4 text-center">
          <div className="flex h-9 w-9 mx-auto items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-2">
            <Layers className="h-4 w-4" />
          </div>
          <div className="font-heading text-xl font-bold text-white">14 Services</div>
          <span className="text-[11px] text-slate-400">End-to-End Capabilities</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              selectedCategory === tab.id
                ? 'bg-cyan-400 text-black shadow-md shadow-cyan-500/25'
                : 'border border-white/5 bg-[#0e111a] text-slate-300 hover:border-cyan-500/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Services Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((svc) => (
          <div
            key={svc.id}
            id={`sgm-service-card-${svc.id}`}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#0e111a] transition-all duration-300 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div>
              {/* Image */}
              <div
                className="relative h-44 w-full cursor-pointer overflow-hidden bg-black"
                onClick={() => setSelectedService(svc)}
              >
                <img
                  src={svc.image}
                  alt={svc.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e111a] via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-3 rounded-md bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                  {svc.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-4">
                <h3
                  onClick={() => setSelectedService(svc)}
                  className="cursor-pointer font-heading text-base font-bold text-white hover:text-cyan-400 transition-colors"
                >
                  {svc.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {svc.shortDescription}
                </p>

                {/* Tech Chips */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {svc.technologies.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {svc.technologies.length > 3 && (
                    <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                      +{svc.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* Features highlights */}
                <ul className="mt-3 space-y-1 text-[11px] text-slate-400">
                  {svc.features.slice(0, 2).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 truncate">
                      <CheckCircle2 className="h-3 w-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Pricing & CTA */}
            <div className="border-t border-white/5 p-4 pt-3">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-[11px] text-slate-400">Starting price</span>
                <span className="font-heading text-sm font-bold text-cyan-300">
                  Rs. {svc.startingPrice.toLocaleString()}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedService(svc)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={() => openServiceRequestModal(svc)}
                  className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-cyan-400 py-2 text-xs font-bold text-black hover:bg-cyan-300 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
                >
                  <span>Request</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
