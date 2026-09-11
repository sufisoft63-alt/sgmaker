import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { banners, setActiveTab, setSelectedCategorySlug, openServiceRequestModal } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const current = banners[currentIndex];

  const handleAction = () => {
    if (current.linkType === 'services') {
      setActiveTab('services');
    } else if (current.linkType === 'quote') {
      openServiceRequestModal();
    } else if (current.linkType === 'category' && current.linkValue) {
      setSelectedCategorySlug(current.linkValue);
      setActiveTab('shop');
    } else {
      setActiveTab('shop');
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0c0f18] shadow-2xl">
      {/* Background Image with Gradient Overlay */}
      <div className="relative h-[320px] sm:h-[380px] md:h-[420px] w-full overflow-hidden">
        <img
          src={current.image}
          alt={current.title}
          className="h-full w-full object-cover object-center transition-all duration-700 scale-105"
        />
        {/* Multistage dark overlays for pristine readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080c] via-[#07080c]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-transparent to-transparent" />

        {/* Content Box */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl">
          {current.badge && (
            <div className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold tracking-wider text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
              <Sparkles className="h-3 w-3" />
              <span>{current.badge}</span>
            </div>
          )}

          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {current.title}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg line-clamp-2">
            {current.subtitle}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              id={`sgm-hero-cta-${current.id}`}
              onClick={handleAction}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black transition-all hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/30"
            >
              <span>{current.buttonText || 'Explore Now'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {current.linkType === 'services' && (
              <button
                onClick={() => openServiceRequestModal()}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10"
              >
                Request Studio Quote
              </button>
            )}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-white/70 backdrop-blur-sm transition-all hover:bg-emerald-500 hover:text-black sm:left-4"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-white/70 backdrop-blur-sm transition-all hover:bg-emerald-500 hover:text-black sm:right-4"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === idx ? 'w-6 bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'w-2 bg-white/30'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
