import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, ShoppingCart, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useApp();

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercent =
    product.discountPrice && product.price > product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  return (
    <div
      id={`sgm-product-card-${product.id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#0e111a] p-3 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10"
    >
      {/* Top Image Container */}
      <div
        className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-black/40"
        onClick={() => setSelectedProduct(product)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {discountPercent > 0 && (
            <span className="rounded-md bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
              -{discountPercent}% OFF
            </span>
          )}
          {product.featured && (
            <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-black shadow-md">
              HOT
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(product);
          }}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-white backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-emerald-500 hover:text-black"
          title="Quick View Details"
        >
          <Eye className="h-4 w-4" />
        </button>

        {/* Stock Badge Overlay */}
        <div className="absolute bottom-2 left-2.5">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 rounded bg-red-950/80 px-2 py-0.5 text-[10px] font-semibold text-rose-300 border border-rose-800/50 backdrop-blur-sm">
              <AlertCircle className="h-3 w-3 text-rose-400" />
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 rounded bg-amber-950/80 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-800/50 backdrop-blur-sm">
              Only {product.stock} left!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded bg-emerald-950/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-800/50 backdrop-blur-sm">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Info Content */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-medium text-emerald-400/90">{product.category}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-200">{product.rating}</span>
              <span className="text-[10px] text-slate-500">({product.reviewCount})</span>
            </div>
          </div>

          <h3
            onClick={() => setSelectedProduct(product)}
            className="mt-1 cursor-pointer text-xs font-semibold text-slate-200 line-clamp-2 hover:text-emerald-400 transition-colors"
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-2.5 border-t border-white/5">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="font-heading text-sm sm:text-base font-bold text-white">
                Rs. {(product.discountPrice || product.price).toLocaleString()}
              </span>
              {product.discountPrice && (
                <span className="ml-1.5 text-[11px] text-slate-500 line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            id={`sgm-prod-add-${product.id}`}
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
              isOutOfStock
                ? 'cursor-not-allowed border border-white/5 bg-white/[0.04] text-slate-500'
                : 'bg-emerald-500 text-black hover:bg-emerald-400 active:scale-95 shadow-md shadow-emerald-500/20'
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
