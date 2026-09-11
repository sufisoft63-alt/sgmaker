import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, ShoppingBag, Code, ArrowRight, TrendingUp, History } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    products,
    services,
    categories,
    setSelectedProduct,
    setSelectedService,
    setActiveTab,
    setSelectedCategorySlug
  } = useApp();

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'PUBG Cooling Fan',
    'Unity Game Development',
    'Gaming Headset',
    'Hall Effect Controller'
  ]);

  const popularSearches = [
    'CryoFrost Fan',
    'Multiplayer',
    'Type-C 90-Degree Cable',
    'Battle Royale',
    'Earbuds 35ms',
    'Mechanical Triggers'
  ];

  const handleSearchCommit = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => [term, ...prev.filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, 6));
  };

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { products: [], services: [], categories: [] };

    const matchedProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );

    const matchedServices = services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.technologies.some((t) => t.toLowerCase().includes(q))
    );

    const matchedCategories = categories.filter((c) => c.name.toLowerCase().includes(q));

    return {
      products: matchedProducts,
      services: matchedServices,
      categories: matchedCategories
    };
  }, [query, products, services, categories]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-3 pt-16 sm:p-6 backdrop-blur-md">
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0d101a] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-white/10 px-4 py-3.5 bg-white/[0.02]">
          <Search className="h-5 w-5 text-emerald-400 mr-3" />
          <input
            id="sgm-global-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchCommit(query);
            }}
            placeholder="Search games, accessories and services..."
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="mr-2 rounded-full p-1 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-slate-400 hover:bg-white/5 hover:text-white"
          >
            Esc
          </button>
        </div>

        {/* Content Area */}
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {!query ? (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <History className="h-3.5 w-3.5 text-slate-500" />
                      Recent Searches
                    </span>
                    <button
                      onClick={() => setRecentSearches([])}
                      className="text-[11px] text-slate-500 hover:text-slate-300"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setQuery(term);
                          handleSearchCommit(term);
                        }}
                        className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(term);
                        handleSearchCommit(term);
                      }}
                      className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Empty state */}
              {filteredResults.products.length === 0 &&
                filteredResults.services.length === 0 &&
                filteredResults.categories.length === 0 && (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium text-slate-300">No matching results for "{query}"</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Try searching for "headset", "cooler", "controller", "unity", or "fps".
                    </p>
                  </div>
                )}

              {/* Categories */}
              {filteredResults.categories.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Categories ({filteredResults.categories.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {filteredResults.categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategorySlug(cat.slug);
                          setActiveTab('shop');
                          setIsSearchModalOpen(false);
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/15"
                      >
                        <span>{cat.name}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {filteredResults.products.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <ShoppingBag className="h-3.5 w-3.5 text-emerald-400" />
                    Products ({filteredResults.products.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredResults.products.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProduct(p);
                          setIsSearchModalOpen(false);
                        }}
                        className="flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5 transition-all hover:border-emerald-500/30 hover:bg-white/[0.05]"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-200 line-clamp-1">{p.name}</p>
                            <span className="text-[10px] text-slate-400">{p.category}</span>
                            <div className="mt-0.5 flex items-center gap-1.5">
                              <span className="text-xs font-bold text-emerald-400">
                                Rs. {(p.discountPrice || p.price).toLocaleString()}
                              </span>
                              {p.discountPrice && (
                                <span className="text-[10px] text-slate-500 line-through">
                                  Rs. {p.price.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gaming Services */}
              {filteredResults.services.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <Code className="h-3.5 w-3.5 text-cyan-400" />
                    Gaming Studio Services ({filteredResults.services.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredResults.services.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setSelectedService(s);
                          setIsSearchModalOpen(false);
                        }}
                        className="flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5 transition-all hover:border-cyan-500/30 hover:bg-white/[0.05]"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={s.image}
                            alt={s.title}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-200">{s.title}</p>
                            <p className="text-[10px] text-slate-400 line-clamp-1">{s.shortDescription}</p>
                            <span className="text-[11px] font-semibold text-cyan-400">
                              Starting from Rs. {s.startingPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
