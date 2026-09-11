import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import {
  SlidersHorizontal,
  Search,
  Check,
  RotateCcw,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const ShopView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategorySlug && product.categorySlug !== selectedCategorySlug) {
          return false;
        }
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            product.name.toLowerCase().includes(q) ||
            product.category.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q);
          if (!match) return false;
        }
        // Stock filter
        if (onlyInStock && product.stock <= 0) {
          return false;
        }
        // Price filter
        const effPrice = product.discountPrice || product.price;
        if (effPrice > maxPrice) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') {
          const discA = a.discountPrice ? a.price - a.discountPrice : 0;
          const discB = b.discountPrice ? b.price - b.discountPrice : 0;
          return discB - discA;
        }
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategorySlug, searchQuery, onlyInStock, maxPrice, sortBy]);

  const resetFilters = () => {
    setSelectedCategorySlug(null);
    setSearchQuery('');
    setSortBy('featured');
    setOnlyInStock(false);
    setMaxPrice(15000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0f18] p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent" />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20 mb-2">
            <ShoppingBag className="h-3 w-3" />
            Official Gear Store
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Mobile Gaming Accessories
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Engineered for low latency, cooling efficiency, and competitive advantage across PUBG Mobile, COD Warzone, and Free Fire.
          </p>
        </div>
      </div>

      {/* Category Pills Scroller */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategorySlug(null)}
          className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            selectedCategorySlug === null
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
              : 'border border-white/5 bg-[#0e111a] text-slate-300 hover:border-emerald-500/30'
          }`}
        >
          All Items ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategorySlug(cat.slug)}
            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              selectedCategorySlug === cat.slug
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                : 'border border-white/5 bg-[#0e111a] text-slate-300 hover:border-emerald-500/30'
            }`}
          >
            {cat.name} ({cat.productCount})
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-white/5 bg-[#0e111a] p-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="sgm-shop-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accessories by name, specs or game..."
            className="w-full rounded-xl border border-white/5 bg-white/[0.03] pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Sort selector */}
          <select
            id="sgm-shop-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Biggest Discount</option>
          </select>

          {/* Toggle Filter Button */}
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
              showFiltersMobile || onlyInStock || maxPrice < 15000
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Expanded Filter Drawer / Panel */}
      {showFiltersMobile && (
        <div className="rounded-2xl border border-white/10 bg-[#0c0f18] p-4 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-emerald-400" />
              Filter Catalog
            </h4>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400"
            >
              <RotateCcw className="h-3 w-3" />
              Reset all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stock Toggle */}
            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-300 font-medium">Availability:</label>
              <button
                onClick={() => setOnlyInStock(!onlyInStock)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  onlyInStock
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {onlyInStock && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                <span>In Stock Only</span>
              </button>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Max Price:</span>
                <span className="font-bold text-emerald-400">Rs. {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={500}
                max={15000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Products Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#0e111a] py-16 text-center">
          <ShoppingBag className="h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-sm font-bold text-slate-200">No matching products found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Try loosening your filters or resetting category selection.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span>
              Showing <strong className="text-slate-200">{filteredProducts.length}</strong> items
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
