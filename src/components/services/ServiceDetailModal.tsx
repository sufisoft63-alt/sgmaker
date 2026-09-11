import React from 'react';
import { GamingService } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Code, Clock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const ServiceDetailModal: React.FC = () => {
  const {
    selectedService,
    setSelectedService,
    openServiceRequestModal
  } = useApp();

  if (!selectedService) return null;

  const handleRequest = () => {
    const svc = selectedService;
    setSelectedService(null);
    openServiceRequestModal(svc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 pt-6 sm:p-6 backdrop-blur-md">
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#0c101a] shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedService(null)}
          className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/60 p-2 text-slate-300 backdrop-blur-md hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto p-5 sm:p-7">
          {/* Header image & badges */}
          <div className="relative mb-5 h-48 w-full overflow-hidden rounded-xl bg-black">
            <img
              src={selectedService.image}
              alt={selectedService.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c101a] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4">
              <span className="rounded-md bg-cyan-500 px-2 py-0.5 text-[10px] font-bold text-black uppercase tracking-wider">
                {selectedService.category}
              </span>
            </div>
          </div>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
            {selectedService.title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-2.5 py-1 text-cyan-300 border border-cyan-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Starting from <strong>Rs. {selectedService.startingPrice.toLocaleString()}</strong></span>
            </div>
            {selectedService.estimatedTimeline && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span>Timeline: {selectedService.estimatedTimeline}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {selectedService.fullDescription}
          </p>

          {/* Tech Stacks */}
          <div className="mt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Tech Stack & Tooling
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedService.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Service Deliverables
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {selectedService.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action CTA */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setSelectedService(null)}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-slate-300 hover:bg-white/10"
            >
              Close
            </button>
            <button
              id="sgm-service-request-trigger"
              onClick={handleRequest}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-xs font-bold text-black hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              <span>Request This Service</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
