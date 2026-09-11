import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck
} from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    deliveryFee,
    grandTotal,
    promoCode,
    applyPromoCode,
    setActiveTab,
    setIsLoginModalOpen
  } = useApp();

  const { isLoggedIn } = useAuth();
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage(res.message);
  };

  const handleCheckoutClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsCartDrawerOpen(false);
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative flex h-full w-full max-w-md flex-col bg-[#0b0e17] border-l border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShoppingCart className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base">Your Gaming Cart</h3>
              <p className="text-[11px] text-slate-400">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in cart
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                id="sgm-cart-clear-btn"
                onClick={clearCart}
                className="text-[11px] text-slate-400 hover:text-rose-400"
              >
                Clear all
              </button>
            )}
            <button
              id="sgm-cart-close-btn"
              onClick={() => setIsCartDrawerOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center text-slate-400">
              <ShoppingCart className="h-12 w-12 text-slate-600 mb-2 stroke-[1.5]" />
              <p className="font-medium text-slate-300">Your cart is empty</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore our catalog of pro coolers, headsets, triggers, and low-latency gear.
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setActiveTab('shop');
                }}
                className="mt-4 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-black hover:bg-emerald-400"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            cart.map(({ product, quantity }) => {
              const unitPrice = product.discountPrice || product.price;
              const itemTotal = unitPrice * quantity;

              return (
                <div
                  key={product.id}
                  className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:border-white/10"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-slate-500 hover:text-rose-400 ml-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium">
                        Rs. {unitPrice.toLocaleString()} each
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity Buttons */}
                      <div className="flex items-center rounded-lg border border-white/10 bg-black/40">
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity - 1)}
                          className="px-2 py-0.5 text-xs text-slate-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-bold text-white min-w-[20px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="px-2 py-0.5 text-xs text-slate-400 hover:text-white disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-heading text-xs font-bold text-white">
                        Rs. {itemTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with promo and checkout */}
        {cart.length > 0 && (
          <div className="border-t border-white/10 bg-[#090b10] p-4 space-y-3">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  id="sgm-cart-promo-input"
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="Promo (SGPROMO, GAMER15)"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none uppercase"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
              >
                Apply
              </button>
            </form>
            {promoMessage && (
              <p className="text-[11px] text-emerald-400">{promoMessage}</p>
            )}

            {/* Bill Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({promoCode})</span>
                  <span>- Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Fee (PK)</span>
                <span>Rs. {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-white">
                <span>Grand Total</span>
                <span className="text-emerald-400 font-heading">
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              id="sgm-cart-checkout-btn"
              onClick={handleCheckoutClick}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-black transition-all hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/25"
            >
              <span>{isLoggedIn ? 'Proceed to Delivery & Payment' : 'Login to Checkout'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Truck className="h-3 w-3 text-emerald-400" />
                Cash on Delivery Available
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-cyan-400" />
                Genuine Warranty
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
