import React, { useState, useEffect, useMemo } from 'react';
import { Product, ProductReview, Order } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { storeService } from '../../services/store';
import {
  X,
  Star,
  ShoppingCart,
  Zap,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  MessageSquare,
  Send,
  Lock,
  ShieldAlert,
  Edit3,
  Trash2,
  ThumbsUp,
  Filter,
  Sparkles,
  BadgeCheck,
  UserCheck
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    setIsCartDrawerOpen,
    setIsLoginModalOpen,
    orders,
    createOrder,
    refreshData,
    showToast
  } = useApp();
  const { currentUser, isLoggedIn } = useAuth();

  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRatingFilter, setActiveRatingFilter] = useState<number | 'all' | 'mine'>('all');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  // Reload reviews when selected product changes
  useEffect(() => {
    if (selectedProduct) {
      setActiveImage(selectedProduct.images[0] || '');
      setQuantity(1);
      setShowReviewForm(false);
      setIsEditingExisting(false);
      setUserRating(5);
      setUserComment('');
      setActiveRatingFilter('all');
      const productReviews = storeService.getReviews(selectedProduct.id);
      setReviews(productReviews);
    }
  }, [selectedProduct]);

  // Check if current logged-in user has purchased this specific item
  const userPurchasedOrder: Order | null = useMemo(() => {
    if (!currentUser || !selectedProduct) return null;
    const found = orders.find((order) => {
      const isUserMatch =
        order.userId === currentUser.uid ||
        order.userId === currentUser.userId ||
        (currentUser.email && order.customerEmail?.toLowerCase() === currentUser.email.toLowerCase());
      const hasItem = order.items.some((item) => item.productId === selectedProduct.id);
      const isValidStatus = order.orderStatus !== 'Cancelled';
      return isUserMatch && hasItem && isValidStatus;
    });
    return found || null;
  }, [currentUser, selectedProduct, orders]);

  const hasPurchased = Boolean(userPurchasedOrder);

  // Check if current user already has an existing review for this product
  const existingUserReview = useMemo(() => {
    if (!currentUser || !selectedProduct) return null;
    return reviews.find(
      (rev) =>
        rev.userId === currentUser.uid ||
        rev.userId === currentUser.userId ||
        (rev.userUid && rev.userUid === currentUser.uid)
    );
  }, [reviews, currentUser, selectedProduct]);

  if (!selectedProduct) return null;

  const isOutOfStock = selectedProduct.stock <= 0;
  const isLowStock = selectedProduct.stock > 0 && selectedProduct.stock <= 5;
  const discountPercent =
    selectedProduct.discountPrice && selectedProduct.price > selectedProduct.discountPrice
      ? Math.round(((selectedProduct.price - selectedProduct.discountPrice) / selectedProduct.price) * 100)
      : 0;

  // Star Rating Breakdown
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : selectedProduct.rating.toFixed(1);

  const starCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeRatingFilter === 'all') return true;
    if (activeRatingFilter === 'mine') {
      return (
        currentUser &&
        (r.userId === currentUser.uid ||
          r.userId === currentUser.userId ||
          r.userUid === currentUser.uid)
      );
    }
    return r.rating === activeRatingFilter;
  });

  const ratingDescriptions: Record<number, string> = {
    1: '1 Star - Poor (Defective or below expectations)',
    2: '2 Stars - Below Average (Needs improvement)',
    3: '3 Stars - Average (Standard performance)',
    4: '4 Stars - Very Good (Highly recommended)',
    5: '5 Stars - Outstanding (Elite Esports Grade)'
  };

  const quickFeedbackChips = [
    '⚡ Ultra Low Latency',
    '❄️ Ice-Cold Cooling',
    '🎮 Ergonomic & Comfortable',
    '🔊 Clear 7.1 Footsteps',
    '🚚 Fast 24-Hour COD Delivery',
    '🛡️ High Durability'
  ];

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCartDrawerOpen(true);
  };

  // Pre-fill form if editing existing review
  const handleStartEditReview = () => {
    if (existingUserReview) {
      setUserRating(existingUserReview.rating);
      setUserComment(existingUserReview.comment);
      setIsEditingExisting(true);
      setShowReviewForm(true);
    }
  };

  // Helper for developers/testers to simulate a verified purchase on this item
  const handleSimulatePurchase = async () => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }
    try {
      await createOrder({
        userId: currentUser.uid,
        customerName: currentUser.fullName || currentUser.username,
        customerEmail: currentUser.email || 'customer@gamingpk.com',
        customerPhone: currentUser.phone || '+92 300 1234567',
        items: [
          {
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            productImage: selectedProduct.images[0] || '',
            price: selectedProduct.discountPrice || selectedProduct.price,
            quantity: 1,
            total: selectedProduct.discountPrice || selectedProduct.price
          }
        ],
        subtotal: selectedProduct.discountPrice || selectedProduct.price,
        discount: 0,
        deliveryFee: 150,
        total: (selectedProduct.discountPrice || selectedProduct.price) + 150,
        deliveryAddress: {
          id: `addr-${Date.now()}`,
          userId: currentUser.uid,
          name: currentUser.fullName,
          phone: currentUser.phone,
          type: 'Home',
          province: 'Punjab',
          city: 'Lahore',
          area: 'Gulberg',
          street: 'Main Boulevard',
          houseNumber: 'Plot 12',
          fullAddress: 'Plot 12, Main Boulevard, Gulberg, Lahore',
          isDefault: true
        },
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderStatus: 'Delivered',
        estimatedDeliveryDate: 'Delivered Today'
      });
      showToast(`Verified purchase registered for ${selectedProduct.name}! You can now leave a review.`, 'success');
      setShowReviewForm(true);
    } catch {
      showToast('Failed to simulate purchase.', 'error');
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!hasPurchased) {
      showToast('Only verified purchasers can submit a review for this item.', 'error');
      return;
    }

    if (userComment.trim().length < 5) {
      showToast('Please write at least 5 characters in your review comment.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewPayload: ProductReview = {
        id: existingUserReview ? existingUserReview.id : `rev-${Date.now()}`,
        productId: selectedProduct.id,
        userId: currentUser.userId || currentUser.uid,
        userUid: currentUser.uid,
        userName: currentUser.fullName || currentUser.username || 'Verified Gamer',
        userHandle: currentUser.username || 'gamer_pk',
        userPhoto: currentUser.profilePhoto || undefined,
        rating: userRating,
        comment: userComment.trim(),
        createdAt: existingUserReview ? existingUserReview.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        verifiedPurchase: true,
        orderId: userPurchasedOrder?.id || 'SGM-ORD-VERIFIED',
        helpfulCount: existingUserReview?.helpfulCount || 0
      };

      await storeService.addReview(reviewPayload);

      // Update local state
      const updatedReviews = storeService.getReviews(selectedProduct.id);
      setReviews(updatedReviews);

      // Refresh products in app context to sync rating & review count
      refreshData();

      setShowReviewForm(false);
      setIsEditingExisting(false);
      setUserComment('');
      showToast(
        isEditingExisting
          ? 'Your verified review has been updated successfully!'
          : 'Thank you! Your verified purchase review is published and linked to your profile.',
        'success'
      );
    } catch (err) {
      console.error('Failed to submit review:', err);
      showToast('Could not save review. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      await storeService.deleteReview(reviewId, selectedProduct.id);
      const updatedReviews = storeService.getReviews(selectedProduct.id);
      setReviews(updatedReviews);
      refreshData();
      showToast('Your review has been removed.', 'info');
      setShowReviewForm(false);
    } catch {
      showToast('Could not delete review.', 'error');
    }
  };

  const handleVoteHelpful = (reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
    showToast('Marked review as helpful. Thank you for your feedback!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 pt-6 sm:p-6 backdrop-blur-md">
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0f18] shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="sgm-product-modal-close"
          onClick={() => setSelectedProduct(null)}
          className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/60 p-2 text-slate-300 backdrop-blur-md hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {/* Left: Gallery */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/5 bg-black/50">
                <img
                  src={activeImage || selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {discountPercent > 0 && (
                  <span className="absolute left-3 top-3 rounded-lg bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {selectedProduct.images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                        activeImage === img
                          ? 'border-emerald-400 shadow-md shadow-emerald-500/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Guarantees */}
              <div className="mt-6 space-y-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-emerald-400" />
                  <span>Cash on delivery available all across Pakistan</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  <span>Official 7-day test & replacement warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-purple-400" />
                  <span>100% Genuine esports grade hardware</span>
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  {selectedProduct.category}
                </span>

                <h1 className="mt-1 font-heading text-xl sm:text-2xl font-bold text-white">
                  {selectedProduct.name}
                </h1>

                {/* Rating & Stock */}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-200">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{averageRating}</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      ({totalReviews} verified {totalReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>

                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-1 rounded bg-rose-950/80 px-2.5 py-1 text-xs font-semibold text-rose-300 border border-rose-800/40">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-950/80 px-2.5 py-1 text-xs font-semibold text-amber-300 border border-amber-800/40">
                      Only {selectedProduct.stock} units remaining!
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-950/80 px-2.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-800/40">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      In Stock ({selectedProduct.stock} available)
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                    Rs. {(selectedProduct.discountPrice || selectedProduct.price).toLocaleString()}
                  </span>
                  {selectedProduct.discountPrice && (
                    <span className="text-sm text-slate-500 line-through">
                      Rs. {selectedProduct.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Specifications */}
                {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                  <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Technical Specs
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(selectedProduct.specifications).map(([key, val]) => (
                        <div key={key}>
                          <span className="text-slate-500 block text-[10px]">{key}</span>
                          <span className="text-slate-200 font-medium">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity & CTA */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-medium text-slate-300">Quantity:</span>
                  <div className="flex items-center rounded-xl border border-white/10 bg-white/5">
                    <button
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="px-3 py-1.5 text-sm text-slate-300 hover:text-white disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-white min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((prev) => Math.min(selectedProduct.stock, prev + 1))}
                      disabled={quantity >= selectedProduct.stock || isOutOfStock}
                      className="px-3 py-1.5 text-sm text-slate-300 hover:text-white disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    id="sgm-modal-add-to-cart"
                    onClick={() => addToCart(selectedProduct, quantity)}
                    disabled={isOutOfStock}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all ${
                      isOutOfStock
                        ? 'cursor-not-allowed border border-white/5 bg-white/[0.04] text-slate-500'
                        : 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 active:scale-95'
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add To Cart</span>
                  </button>
                  <button
                    id="sgm-modal-buy-now"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all ${
                      isOutOfStock
                        ? 'cursor-not-allowed border border-white/5 bg-white/[0.04] text-slate-500'
                        : 'bg-emerald-500 text-black hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/25'
                    }`}
                  >
                    <Zap className="h-4 w-4" />
                    <span>Instant Checkout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* VERIFIED CUSTOMER REVIEWS SECTION (LINKED TO FIRESTORE USER PROFILE) */}
          {/* ========================================================================= */}
          <div className="mt-10 border-t border-white/10 pt-6">
            {/* Header & Stats Overview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-heading text-lg font-bold text-white">
                    Verified Customer Reviews
                  </h3>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                    {totalReviews}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real feedback exclusively submitted by authenticated buyers with verified orders
                </p>
              </div>

              {/* Conditional Action Button based on Authorization */}
              {isLoggedIn && hasPurchased && !showReviewForm && (
                <button
                  id="sgm-write-verified-review-btn"
                  onClick={() => {
                    if (existingUserReview) {
                      handleStartEditReview();
                    } else {
                      setUserRating(5);
                      setUserComment('');
                      setIsEditingExisting(false);
                      setShowReviewForm(true);
                    }
                  }}
                  className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-all shadow-md shadow-emerald-500/10"
                >
                  {existingUserReview ? <Edit3 className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />}
                  <span>{existingUserReview ? 'Edit Your Review' : 'Write Verified Review'}</span>
                </button>
              )}
            </div>

            {/* Scorecard & Rating Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-5 mb-6">
              {/* Left Score Block */}
              <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-4">
                <span className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {averageRating}
                </span>
                <div className="flex items-center gap-1 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(Number(averageRating))
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  Based on {totalReviews} verified {totalReviews === 1 ? 'purchase' : 'purchases'}
                </span>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  <span>100% Genuine Buyers</span>
                </div>
              </div>

              {/* Right Bars Breakdown */}
              <div className="md:col-span-8 flex flex-col justify-center space-y-1.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = starCounts[stars as keyof typeof starCounts];
                  const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                  return (
                    <div key={stars} className="flex items-center gap-3 text-xs">
                      <span className="w-12 text-slate-400 flex items-center gap-1">
                        {stars} <Star className="h-3 w-3 fill-amber-400 text-amber-400 inline" />
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-slate-400 text-[11px]">
                        {percentage}% ({count})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ===================================================================== */}
            {/* PURCHASE VERIFICATION GATEWAYS (3 STATES) */}
            {/* ===================================================================== */}

            {/* STATE 1: User is NOT logged in */}
            {!isLoggedIn && (
              <div className="mb-6 rounded-2xl border border-white/10 bg-[#0e111a] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 shrink-0">
                    <Lock className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>Verified Purchase Policy</span>
                      <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300 font-semibold border border-amber-500/20">
                        Sign-In Required
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Only gamers who have previously ordered this accessory can submit ratings and comments linked to their Firestore user profile.
                    </p>
                  </div>
                </div>
                <button
                  id="sgm-signin-to-review-btn"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                >
                  Sign In to Check Eligibility
                </button>
              </div>
            )}

            {/* STATE 2: User is Logged In, but has NOT purchased this item */}
            {isLoggedIn && !hasPurchased && (
              <div className="mb-6 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-[#120f09] to-[#0c0f18] p-4 sm:p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-amber-400 shrink-0">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          Verified Buyers Only
                        </h4>
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400 font-semibold border border-amber-500/20">
                          Order Not Found
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        To maintain 100% authentic community reviews, you must have an active or completed order for{' '}
                        <strong className="text-white">{selectedProduct.name}</strong> on your account (
                        <span className="text-emerald-400">@{currentUser?.username || 'user'}</span>).
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>Order This Item</span>
                    </button>
                    {/* Simulated purchase button for easy instant verification testing in demo */}
                    <button
                      onClick={handleSimulatePurchase}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
                      title="Quickly simulate a completed order to test the review form"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Simulate Purchase (Test)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STATE 3: User is Logged In and HAS purchased this item */}
            {isLoggedIn && hasPurchased && !showReviewForm && (
              <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 to-transparent p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-2 text-emerald-400 shrink-0">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white">
                        Verified Purchaser Authenticated
                      </span>
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        {userPurchasedOrder?.id || 'Order Verified'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {existingUserReview
                        ? 'You have already submitted a verified review for this item. You can edit it below.'
                        : 'Your review will be officially published and linked to your SG Maker profile.'}
                    </p>
                  </div>
                </div>

                <button
                  id="sgm-verified-review-action"
                  onClick={() => {
                    if (existingUserReview) {
                      handleStartEditReview();
                    } else {
                      setUserRating(5);
                      setUserComment('');
                      setIsEditingExisting(false);
                      setShowReviewForm(true);
                    }
                  }}
                  className="shrink-0 flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
                >
                  <Star className="h-3.5 w-3.5 fill-black text-black" />
                  <span>{existingUserReview ? 'Edit My Review' : 'Write Verified Review'}</span>
                </button>
              </div>
            )}

            {/* ===================================================================== */}
            {/* INTERACTIVE REVIEW FORM (LINKED TO FIRESTORE USER PROFILE) */}
            {/* ===================================================================== */}
            {showReviewForm && currentUser && hasPurchased && (
              <form
                onSubmit={handleSaveReview}
                className="mb-8 rounded-2xl border border-emerald-500/40 bg-[#0f1422] p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* Linked Firestore User Profile Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {currentUser.profilePhoto ? (
                        <img
                          src={currentUser.profilePhoto}
                          alt={currentUser.fullName}
                          className="h-11 w-11 rounded-xl object-cover border-2 border-emerald-400 shadow-md"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-black font-extrabold flex items-center justify-center text-sm border-2 border-emerald-400">
                          {currentUser.fullName ? currentUser.fullName.slice(0, 2).toUpperCase() : 'SG'}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-0.5 text-black">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {currentUser.fullName || currentUser.username}
                        </span>
                        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                          Verified Buyer
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>@{currentUser.username}</span>
                        <span>•</span>
                        <span className="text-slate-400">Order: {userPurchasedOrder?.id}</span>
                        <span>•</span>
                        <span className="text-cyan-400 font-mono text-[10px]">
                          Firestore UID: {currentUser.uid.slice(0, 10)}...
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-emerald-400 font-medium self-end sm:self-center">
                    {isEditingExisting ? 'Editing Existing Review' : 'New Verified Review'}
                  </span>
                </div>

                {/* Star Rating Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-2">
                    Your Rating <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-1.5 bg-black/40 p-2 rounded-xl border border-white/5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = star <= (hoverRating || userRating);
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-transform hover:scale-125 focus:outline-none"
                            title={`${star} Stars`}
                          >
                            <Star
                              className={`h-6 w-6 transition-colors ${
                                isFilled
                                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                  : 'text-slate-700 hover:text-slate-500'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-semibold text-amber-300">
                      {ratingDescriptions[hoverRating || userRating]}
                    </span>
                  </div>
                </div>

                {/* Quick Feedback Chips */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                    Quick Highlights (Click to add)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {quickFeedbackChips.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const separator = userComment.trim() ? ' ' : '';
                          if (!userComment.includes(chip)) {
                            setUserComment((prev) => `${prev.trim()}${separator}${chip}. `);
                          }
                        }}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-200">
                      Your Detailed Experience <span className="text-rose-400">*</span>
                    </label>
                    <span
                      className={`text-[10px] ${
                        userComment.length > 950 ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    >
                      {userComment.length} / 1000 characters
                    </span>
                  </div>
                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value.slice(0, 1000))}
                    rows={4}
                    placeholder="Describe build quality, trigger responsiveness, thermal cooling efficiency, sound precision in competitive games like PUBG Mobile, and shipping speed across Pakistan..."
                    className="w-full rounded-xl border border-white/10 bg-[#090b10] p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    required
                  />
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    {isEditingExisting && existingUserReview && (
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(existingUserReview.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete Review</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || userComment.trim().length < 5}
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 transition-all"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isSubmitting ? 'Publishing...' : isEditingExisting ? 'Update Review' : 'Publish Verified Review'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-4 pb-2 border-b border-white/5">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="h-3 w-3" />
                <span>Filter:</span>
              </span>

              <button
                onClick={() => setActiveRatingFilter('all')}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  activeRatingFilter === 'all'
                    ? 'bg-emerald-500 text-black'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                All ({reviews.length})
              </button>

              {[5, 4, 3, 2, 1].map((st) => (
                <button
                  key={st}
                  onClick={() => setActiveRatingFilter(st)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    activeRatingFilter === st
                      ? 'bg-amber-400 text-black'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>{st}</span>
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-[10px] opacity-75">
                    ({starCounts[st as keyof typeof starCounts]})
                  </span>
                </button>
              ))}

              {currentUser && existingUserReview && (
                <button
                  onClick={() => setActiveRatingFilter('mine')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    activeRatingFilter === 'mine'
                      ? 'bg-cyan-400 text-black'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  My Review
                </button>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-3.5">
              {filteredReviews.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 text-center">
                  <MessageSquare className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-400">
                    {activeRatingFilter !== 'all'
                      ? 'No reviews found matching this filter.'
                      : 'No verified reviews yet for this product.'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {hasPurchased
                      ? 'You are a verified owner! Click "Write Verified Review" above to share your thoughts.'
                      : 'Order this product to become the first verified reviewer!'}
                  </p>
                </div>
              ) : (
                filteredReviews.map((rev) => {
                  const isCurrentUserReview =
                    currentUser &&
                    (rev.userId === currentUser.uid ||
                      rev.userId === currentUser.userId ||
                      rev.userUid === currentUser.uid);

                  const helpfulTotal = (rev.helpfulCount || 0) + (helpfulVotes[rev.id] || 0);

                  return (
                    <div
                      key={rev.id}
                      className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                        isCurrentUserReview
                          ? 'border-emerald-500/40 bg-emerald-500/[0.04] shadow-md shadow-emerald-500/5'
                          : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                      }`}
                    >
                      {/* Review Card Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {/* User Avatar */}
                          {rev.userPhoto ? (
                            <img
                              src={rev.userPhoto}
                              alt={rev.userName}
                              className="h-9 w-9 rounded-xl object-cover border border-white/10 shadow-sm"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 text-emerald-400 font-bold flex items-center justify-center text-xs">
                              {rev.userName ? rev.userName.slice(0, 2).toUpperCase() : 'SG'}
                            </div>
                          )}

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-white">{rev.userName}</span>
                              {rev.verifiedPurchase && (
                                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                                  <CheckCircle2 className="h-2.5 w-2.5" />
                                  <span>Verified Buyer</span>
                                </span>
                              )}
                              {isCurrentUserReview && (
                                <span className="rounded bg-cyan-500/15 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-500/30">
                                  You
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              {rev.userHandle && <span>@{rev.userHandle}</span>}
                              {rev.orderId && <span>• Order {rev.orderId}</span>}
                              <span>•</span>
                              <span>{new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                              {rev.updatedAt && rev.updatedAt !== rev.createdAt && (
                                <span className="text-slate-400 italic">(edited)</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Current User Quick Actions */}
                        {isCurrentUserReview && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={handleStartEditReview}
                              className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-emerald-400 transition-colors"
                              title="Edit Review"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteReview(rev.id)}
                              className="rounded-lg p-1 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                              title="Delete Review"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Stars Representation */}
                      <div className="flex items-center gap-1 mb-2.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${
                              s <= rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                        <span className="text-[11px] font-semibold text-amber-300/80 ml-1.5">
                          {ratingDescriptions[rev.rating]?.split('-')[1]?.trim() || ''}
                        </span>
                      </div>

                      {/* Review Comment */}
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {rev.comment}
                      </p>

                      {/* Helpful Button Bar */}
                      <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-white/5 text-[11px] text-slate-400">
                        <span className="text-[10px] text-slate-400">
                          Was this review helpful to your gaming setup?
                        </span>
                        <button
                          onClick={() => handleVoteHelpful(rev.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-1 text-slate-300 hover:border-emerald-500/30 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all"
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span>Helpful ({helpfulTotal})</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
