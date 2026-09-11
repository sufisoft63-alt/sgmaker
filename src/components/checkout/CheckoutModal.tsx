import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Address, OrderItem, PaymentMethod } from '../../types';
import {
  X,
  MapPin,
  Plus,
  Truck,
  CreditCard,
  Building,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderPlaced }) => {
  const {
    cart,
    subtotal,
    discount,
    deliveryFee,
    grandTotal,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    deliveryAreas,
    createOrder,
    showToast
  } = useApp();

  const { currentUser } = useAuth();

  // Address sub-view
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddrName, setNewAddrName] = useState(currentUser?.fullName || '');
  const [newAddrPhone, setNewAddrPhone] = useState(currentUser?.phone || '');
  const [newAddrCity, setNewAddrCity] = useState('Lahore');
  const [newAddrArea, setNewAddrArea] = useState('Gulberg & DHA');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrHouse, setNewAddrHouse] = useState('');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');
  const [newAddrType, setNewAddrType] = useState<'Home' | 'Office' | 'Other'>('Home');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [transactionRef, setTransactionRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // HTML5 Geolocation helper
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }
    showToast('Detecting location via GPS coordinates...', 'info');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Mock reverse-geocode coordinate mapping for Pakistan
        setNewAddrCity('Lahore');
        setNewAddrArea('Gulberg & Liberty Area');
        setNewAddrStreet(`GPS Pin Near Lat ${pos.coords.latitude.toFixed(4)}, Long ${pos.coords.longitude.toFixed(4)}`);
        showToast('Approximate location detected!');
      },
      (err) => {
        console.warn('Geo error', err);
        showToast('Could not detect GPS location. Please type manually.', 'info');
      }
    );
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName.trim() || !newAddrPhone.trim() || !newAddrHouse.trim() || !newAddrStreet.trim()) {
      showToast('Please fill out all address fields.', 'error');
      return;
    }

    const fullAddress = `${newAddrHouse}, ${newAddrStreet}, ${newAddrArea}, ${newAddrCity}${
      newAddrLandmark ? ` (Near ${newAddrLandmark})` : ''
    }`;

    addAddress({
      userId: currentUser?.uid || 'usr-anon',
      name: newAddrName.trim(),
      phone: newAddrPhone.trim(),
      type: newAddrType,
      city: newAddrCity,
      province: 'Punjab',
      area: newAddrArea,
      street: newAddrStreet,
      houseNumber: newAddrHouse,
      landmark: newAddrLandmark || undefined,
      fullAddress,
      isDefault: addresses.length === 0
    });

    setShowNewAddressForm(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showToast('Please select or add a delivery address.', 'error');
      return;
    }
    if (cart.length === 0) {
      showToast('Your cart is empty.', 'error');
      return;
    }

    if (paymentMethod !== 'Cash on Delivery' && !transactionRef.trim()) {
      showToast('Please enter your transaction ID / Reference for digital payment.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const orderItems: OrderItem[] = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        price: item.product.discountPrice || item.product.price,
        quantity: item.quantity,
        total: (item.product.discountPrice || item.product.price) * item.quantity
      }));

      // Calculate estimated delivery
      const estDate =
        selectedAddress.city.toLowerCase() === 'lahore'
          ? 'Tomorrow, 2:00 PM - 7:00 PM'
          : '2-3 Business Days via Express Courier';

      const placedOrder = await createOrder({
        userId: currentUser?.uid || 'usr-anon',
        customerName: selectedAddress.name || currentUser?.fullName || 'Valued Gamer',
        customerEmail: currentUser?.email || 'customer@gmail.com',
        customerPhone: selectedAddress.phone || currentUser?.phone || '+92 300 0000000',
        items: orderItems,
        subtotal,
        discount,
        deliveryFee,
        total: grandTotal,
        deliveryAddress: selectedAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
        orderStatus: 'Pending',
        estimatedDeliveryDate: estDate
      });

      onClose();
      onOrderPlaced(placedOrder.id);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 pt-6 sm:p-6 backdrop-blur-md">
      <div
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c101a] shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base">Checkout & Delivery</h3>
              <p className="text-[11px] text-slate-400">Cash on Delivery & Express Courier in Pakistan</p>
            </div>
          </div>
          <button
            id="sgm-checkout-close"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
          {/* 1. DELIVERY ADDRESS SECTION */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                Delivery Address
              </h4>
              {!showNewAddressForm && (
                <button
                  id="sgm-checkout-add-address-btn"
                  onClick={() => setShowNewAddressForm(true)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add New Address</span>
                </button>
              )}
            </div>

            {showNewAddressForm ? (
              <form
                onSubmit={handleSaveNewAddress}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Add Delivery Address</span>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-[10px] font-medium text-emerald-300 hover:bg-white/15"
                  >
                    <Navigation className="h-3 w-3" />
                    <span>Auto-Detect GPS</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Receiver Name</label>
                    <input
                      type="text"
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                      placeholder="Usman Tariq"
                      className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      placeholder="+92 301 5556677"
                      className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">City</label>
                    <select
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      {deliveryAreas.map((area) => (
                        <option key={area.id} value={area.city} className="bg-[#090b10] text-white">
                          {area.city} ({area.deliveryTime} - Rs. {area.deliveryFee})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Area / Sector</label>
                    <input
                      type="text"
                      value={newAddrArea}
                      onChange={(e) => setNewAddrArea(e.target.value)}
                      placeholder="Gulberg III, DHA Phase 5, F-7"
                      className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">House / Flat / Office #</label>
                    <input
                      type="text"
                      value={newAddrHouse}
                      onChange={(e) => setNewAddrHouse(e.target.value)}
                      placeholder="House # 42-B"
                      className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Street / Block</label>
                    <input
                      type="text"
                      value={newAddrStreet}
                      onChange={(e) => setNewAddrStreet(e.target.value)}
                      placeholder="Street 14, Block L"
                      className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Nearby Landmark (Optional)</label>
                  <input
                    type="text"
                    value={newAddrLandmark}
                    onChange={(e) => setNewAddrLandmark(e.target.value)}
                    placeholder="Near Liberty Market or Al-Fatah"
                    className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-slate-400">Address Type:</span>
                  {(['Home', 'Office', 'Other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewAddrType(t)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        newAddrType === t
                          ? 'bg-emerald-500 text-black'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(false)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 font-semibold text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-emerald-500 py-2 font-bold text-black hover:bg-emerald-400"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                {addresses.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 p-4 text-center">
                    <p className="text-slate-400">No saved address yet.</p>
                    <button
                      onClick={() => setShowNewAddressForm(true)}
                      className="mt-2 rounded-lg bg-emerald-500 px-3 py-1.5 font-bold text-black hover:bg-emerald-400"
                    >
                      Add Delivery Address
                    </button>
                  </div>
                ) : (
                  addresses.map((addr) => {
                    const isSelected = selectedAddress?.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`flex cursor-pointer items-start justify-between rounded-xl border p-3.5 transition-all ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500/10 shadow-md shadow-emerald-500/10'
                            : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{addr.name}</span>
                            <span className="rounded bg-white/10 px-1.5 py-0.2 text-[10px] text-slate-300">
                              {addr.type}
                            </span>
                            {addr.isDefault && (
                              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald-400">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-slate-300 text-[11px] leading-relaxed">
                            {addr.fullAddress}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                            Phone: {addr.phone}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* 2. PAYMENT METHODS SECTION */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-emerald-400" />
              Payment Method
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Cash on delivery */}
              <div
                id="sgm-pay-cod"
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`cursor-pointer rounded-xl border p-3 transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Truck className="h-4 w-4 text-emerald-400" />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                  {paymentMethod === 'Cash on Delivery' && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  )}
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Pay with physical cash at your doorstep upon inspecting the courier parcel.
                </p>
              </div>

              {/* Easypaisa */}
              <div
                id="sgm-pay-easypaisa"
                onClick={() => setPaymentMethod('Easypaisa')}
                className={`cursor-pointer rounded-xl border p-3 transition-all ${
                  paymentMethod === 'Easypaisa'
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="h-4 w-4 rounded-full bg-green-500 text-[10px] font-bold text-black flex items-center justify-center">
                      EP
                    </span>
                    <span>Easypaisa Mobile Account</span>
                  </div>
                  {paymentMethod === 'Easypaisa' && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  )}
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Send to <strong>0301-5556677</strong> (SG Maker Studio).
                </p>
              </div>

              {/* JazzCash */}
              <div
                id="sgm-pay-jazzcash"
                onClick={() => setPaymentMethod('JazzCash')}
                className={`cursor-pointer rounded-xl border p-3 transition-all ${
                  paymentMethod === 'JazzCash'
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="h-4 w-4 rounded-full bg-red-600 text-[10px] font-bold text-white flex items-center justify-center">
                      JC
                    </span>
                    <span>JazzCash Mobile Account</span>
                  </div>
                  {paymentMethod === 'JazzCash' && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  )}
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Send to <strong>0301-5556677</strong> (SG Maker Studio).
                </p>
              </div>

              {/* Bank Transfer */}
              <div
                id="sgm-pay-bank"
                onClick={() => setPaymentMethod('Bank Transfer')}
                className={`cursor-pointer rounded-xl border p-3 transition-all ${
                  paymentMethod === 'Bank Transfer'
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Building className="h-4 w-4 text-cyan-400" />
                    <span>Direct Bank Transfer</span>
                  </div>
                  {paymentMethod === 'Bank Transfer' && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  )}
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Meezan Bank - IBAN: <strong>PK44MEZN000100912401</strong>
                </p>
              </div>
            </div>

            {/* Online payment reference field */}
            {paymentMethod !== 'Cash on Delivery' && (
              <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                <label className="block text-slate-200 font-medium mb-1">
                  Transaction / TID / Reference ID <span className="text-rose-400">*</span>
                </label>
                <input
                  id="sgm-checkout-tid-input"
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. 19283746501 or TRX-84920"
                  className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
                <p className="mt-1 text-[10px] text-slate-400">
                  Please transfer exact amount (Rs. {grandTotal.toLocaleString()}) and paste transaction ID above for automated instant confirmation.
                </p>
              </div>
            )}
          </div>

          {/* 3. ORDER ITEMS SUMMARY */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
              Order Items ({cart.length})
            </h4>
            <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 max-w-[280px]">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="h-7 w-7 rounded object-cover"
                    />
                    <span className="truncate text-slate-200">{item.product.name}</span>
                    <span className="text-slate-500">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold text-white">
                    Rs. {((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-2 space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>- Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Fee ({selectedAddress?.city || 'Pakistan'})</span>
                <span>Rs. {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-white">
                <span>Grand Total</span>
                <span className="text-emerald-400 font-heading">
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Place Order CTA */}
        <div className="border-t border-white/10 bg-[#090b10] px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Total Payable</span>
            <span className="font-heading text-base font-extrabold text-white">
              Rs. {grandTotal.toLocaleString()}
            </span>
          </div>

          <button
            id="sgm-confirm-order-btn"
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-bold text-black transition-all hover:bg-emerald-400 active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-500/30"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{isProcessing ? 'Confirming Order...' : 'Place Official Order'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
