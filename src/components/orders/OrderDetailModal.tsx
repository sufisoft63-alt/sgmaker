import React from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  X,
  Package,
  Clock,
  MapPin,
  Truck,
  RotateCcw,
  Ban,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ORDER_STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'Pending', label: 'Placed' },
  { status: 'Confirmed', label: 'Confirmed' },
  { status: 'Preparing', label: 'Preparing' },
  { status: 'Packed', label: 'Packed' },
  { status: 'Shipped', label: 'Dispatched' },
  { status: 'Out for Delivery', label: 'Out for Delivery' },
  { status: 'Delivered', label: 'Delivered' }
];

export const OrderDetailModal: React.FC = () => {
  const { selectedOrder, setSelectedOrder, cancelOrder, reorder } = useApp();

  if (!selectedOrder) return null;

  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.status === selectedOrder.orderStatus);
  const isCancelled = selectedOrder.orderStatus === 'Cancelled';
  const isDelivered = selectedOrder.orderStatus === 'Delivered';
  const canCancel = selectedOrder.orderStatus === 'Pending' || selectedOrder.orderStatus === 'Confirmed';

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Cancelled':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
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
              <Package className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-white text-base">
                  {selectedOrder.id}
                </h3>
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(
                    selectedOrder.orderStatus
                  )}`}
                >
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            id="sgm-order-detail-close"
            onClick={() => setSelectedOrder(null)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable details */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
          {/* Estimated delivery banner */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="flex items-center gap-2.5">
              <Truck className="h-5 w-5 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 block">Estimated Arrival</span>
                <span className="font-bold text-slate-200">
                  {selectedOrder.estimatedDeliveryDate || '2-3 Business Days'}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">
              {selectedOrder.paymentMethod}
            </span>
          </div>

          {/* Progression timeline */}
          {!isCancelled ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">
                Delivery Progression
              </h4>
              <div className="relative flex justify-between">
                {/* Connecting line */}
                <div className="absolute top-3.5 left-3 right-3 h-0.5 bg-slate-800 -z-0" />
                <div
                  className="absolute top-3.5 left-3 h-0.5 bg-emerald-500 transition-all duration-500 -z-0"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, (currentStepIndex / (ORDER_STEPS.length - 1)) * 100)
                    )}%`
                  }}
                />

                {ORDER_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={step.status} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all ${
                          isCurrent
                            ? 'border-emerald-400 bg-emerald-500 text-black ring-4 ring-emerald-500/20'
                            : isDone
                            ? 'border-emerald-500 bg-emerald-500 text-black'
                            : 'border-slate-700 bg-[#0c101a] text-slate-500'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                      </div>
                      <span
                        className={`mt-1.5 text-[9px] font-semibold text-center max-w-[50px] leading-tight ${
                          isCurrent
                            ? 'text-emerald-400'
                            : isDone
                            ? 'text-slate-300'
                            : 'text-slate-600'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
              <div>
                <span className="font-bold block">Order Cancelled</span>
                <span className="text-[11px] text-rose-200">
                  This order was cancelled. No charges were made.
                </span>
              </div>
            </div>
          )}

          {/* Items Breakdown */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
              Items Ordered ({selectedOrder.items.length})
            </h4>
            <div className="space-y-3">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2.5 last:border-none last:pb-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-200 line-clamp-1">
                        {item.productName}
                      </p>
                      <span className="text-[11px] text-slate-500">
                        Rs. {item.price.toLocaleString()} x {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-heading font-bold text-white">
                    Rs. {item.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill computation */}
            <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span>Rs. {selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>- Rs. {selectedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Fee</span>
                <span>Rs. {selectedOrder.deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-white">
                <span>Total Amount Paid / Due</span>
                <span className="text-emerald-400 font-heading">
                  Rs. {selectedOrder.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address & Receiver */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              Delivery Destination
            </h4>
            <div className="space-y-1 text-slate-300">
              <p className="font-bold text-white">
                {selectedOrder.customerName} ({selectedOrder.deliveryAddress.type})
              </p>
              <p className="text-[11px] leading-relaxed text-slate-400">
                {selectedOrder.deliveryAddress.fullAddress}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Phone: {selectedOrder.customerPhone}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="border-t border-white/10 bg-[#090b10] px-6 py-4 flex gap-3">
          {canCancel && (
            <button
              id="sgm-cancel-order-btn"
              onClick={() => cancelOrder(selectedOrder.id)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2.5 px-4 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
            >
              <Ban className="h-3.5 w-3.5" />
              <span>Cancel Order</span>
            </button>
          )}
          <button
            id="sgm-reorder-btn"
            onClick={() => {
              reorder(selectedOrder);
              setSelectedOrder(null);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reorder Items</span>
          </button>
        </div>
      </div>
    </div>
  );
};
