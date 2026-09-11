import React from 'react';
import { useApp } from '../../context/AppContext';
import { HeroSlider } from './HeroSlider';
import { ProductCard } from '../shop/ProductCard';
import {
  Code,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Flame,
  Zap,
  Gamepad2
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    products,
    categories,
    services,
    setActiveTab,
    setSelectedCategorySlug,
    setSelectedService,
    openServiceRequestModal
  } = useApp();

  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 6);
  const spotlightServices = services.slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Hero Carousel */}
      <HeroSlider />

      {/* 2. Studio Spotlight Callout */}
      <section className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-[#0c101a] to-cyan-950/30 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20 mb-2">
              <Gamepad2 className="h-3 w-3" />
              Game Development Studio
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">
              Turn Your Game Idea Into A High-Octane Reality
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              We design, build, and deploy 3D mobile games, Photon multiplayer backends, custom monetization, and cross-platform esports titles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="sgm-home-explore-services"
              onClick={() => setActiveTab('services')}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black transition-all hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/25"
            >
              <Code className="h-4 w-4" />
              <span>Explore 14+ Studio Services</span>
            </button>
            <button
              id="sgm-home-custom-quote"
              onClick={() => openServiceRequestModal()}
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Get Free Project Estimate
            </button>
          </div>
        </div>
      </section>

      {/* 3. Categories Quick Horizontal Scroller */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              Shop by Category
            </h3>
            <p className="text-xs text-slate-400">Pro-grade accessories tailored for mobile gamers</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setActiveTab('shop');
            }}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:underline"
          >
            <span>All Categories</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategorySlug(cat.slug);
                setActiveTab('shop');
              }}
              className="group flex min-w-[150px] shrink-0 items-center gap-3 rounded-xl border border-white/5 bg-[#0e111a] p-3 text-left transition-all hover:border-emerald-500/40 hover:bg-white/[0.04]"
            >
              <img
                src={cat.icon}
                alt={cat.name}
                className="h-10 w-10 rounded-lg object-cover ring-1 ring-white/10 group-hover:ring-emerald-400"
              />
              <div>
                <span className="block text-xs font-bold text-slate-200 group-hover:text-emerald-400">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-500">{cat.productCount} items</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Featured Accessories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Featured Accessories
            </h3>
            <p className="text-xs text-slate-400">Top-rated mobile esports gear in Pakistan</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setActiveTab('shop');
            }}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:underline"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 5. Gaming Studio Services Showcase */}
      <section className="rounded-2xl border border-white/10 bg-[#0b0e17] p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-500/20 mb-1">
              SG Maker Dev Services
            </div>
            <h3 className="font-heading text-xl font-bold text-white">Popular Studio Services</h3>
            <p className="text-xs text-slate-400">Custom game engineering with Pakistan local support</p>
          </div>
          <button
            onClick={() => setActiveTab('services')}
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:underline"
          >
            <span>Browse All 14 Services</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {spotlightServices.map((svc) => (
            <div
              key={svc.id}
              className="flex flex-col justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-cyan-500/40 hover:bg-white/[0.04]"
            >
              <div>
                <img
                  src={svc.image}
                  alt={svc.title}
                  className="h-32 w-full rounded-lg object-cover mb-3"
                />
                <span className="text-[10px] font-semibold text-cyan-400">{svc.category}</span>
                <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">{svc.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{svc.shortDescription}</p>
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {svc.technologies.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[10px] text-slate-400">Starting price</span>
                  <span className="text-xs font-bold text-cyan-400">
                    Rs. {svc.startingPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedService(svc)}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-white/10"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => openServiceRequestModal(svc)}
                    className="flex-1 rounded-lg bg-cyan-500 py-1.5 text-[11px] font-bold text-black hover:bg-cyan-400 shadow-sm"
                  >
                    Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Best Sellers */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Flame className="h-4 w-4 text-rose-500" />
              Best Sellers
            </h3>
            <p className="text-xs text-slate-400">Most ordered gaming items by Pakistani gamers</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setActiveTab('shop');
            }}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:underline"
          >
            <span>View Shop</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 7. Trust Pillars & Pakistan Delivery Badges */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-[#0e111a] p-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-2">
            <Truck className="h-5 w-5" />
          </div>
          <h4 className="text-xs font-bold text-white">Cash On Delivery</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Pay at your doorstep anywhere in Pakistan</p>
        </div>

        <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-[#0e111a] p-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-2">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h4 className="text-xs font-bold text-white">7-Day Warranty</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Hassle-free replacement for defective items</p>
        </div>

        <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-[#0e111a] p-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-2">
            <RotateCcw className="h-5 w-5" />
          </div>
          <h4 className="text-xs font-bold text-white">Fast Courier</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">1-3 business days express dispatch</p>
        </div>

        <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-[#0e111a] p-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-2">
            <Headphones className="h-5 w-5" />
          </div>
          <h4 className="text-xs font-bold text-white">24/7 Gamer Support</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">WhatsApp & phone helpline assistance</p>
        </div>
      </section>
    </div>
  );
};
