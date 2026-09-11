import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Order, OrderStatus } from '../../types';
import {
  Package,
  Clock,
  ArrowRight,
  RotateCcw,
  ShoppingBag,
  Truck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { orders, setSelectedOrder, reorder, setActiveTab, setIsLoginModalOpen } = useApp();
  const { currentUser, isLoggedIn } = useAuth();

  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  // Filter orders for current user or all if admin
  const userOrders = useMemo(() => {
    if (!currentUser) return [];
    // User sees their orders (or demo orders)
    return orders.filter(
      (o) => o.userId === currentUser.uid || currentUser.role === 'admin' || o.userId === 'usr-demo-1'
    );
  }, [orders, currentUser]);

  const filteredOrders = useMemo(() => {
    return userOrders.filter((o) => {
      if (activeTabFilter === 'active') {
        return o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled';
      }
      if (activeTabFilter === 'completed') {
        return o.orderStatus === 'Delivered';
      }
      if (activeTabFilter === 'cancelled') {
        return o.orderStatus === 'Cancelled';
      }
      return true;
    });
  }, [userOrders, activeTabFilter]);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="h-16 w-16 text-slate-600 mb-4" />
        <h2 className="font-heading text-xl font-bold text-white">Sign In To View Orders</h2>
        <p className="mt-1 text-xs text-slate-400 max-w-sm">
          Track real-time shipment status, delivery estimates, and view order history with Cash on Delivery tracking.
        </p>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="mt-5 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-black hover:bg-emerald-400"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
            <Package className="h-6 w-6 text-emerald-400" />
            My Orders
          </h1>
          <p className="text-xs text-slate-400">Track current shipments and view order archives</p>
        </div>
        <button
          onClick={() => setActiveTab('shop')}
          className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Shop More Accessories</span>
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: `All (${userOrders.length})` },
          {
            id: 'active',
            label: `Active (${userOrders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length})`
          },
          {
            id: 'completed',
            label: `Completed (${userOrders.filter((o) => o.orderStatus === 'Delivered').length})`
          },
          {
            id: 'cancelled',
            label: `Cancelled (${userOrders.filter((o) => o.orderStatus === 'Cancelled').length})`
          }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabFilter(tab.id as any)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTabFilter === tab.id
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white bg-white/[0.02]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#0e111a] py-16 text-center">
          <Package className="h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-sm font-bold text-slate-200">No orders in this category</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Any gaming hardware or accessories you order will show up right here.
          </p>
          <button
            onClick={() => setActiveTab('shop')}
            className="mt-4 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-black hover:bg-emerald-400"
          >
            Explore Accessories
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              id={`sgm-order-card-${order.id}`}
              className="rounded-2xl border border-white/5 bg-[#0e111a] p-4 sm:p-5 transition-all hover:border-emerald-500/30"
            >
              {/* Card top */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-heading font-bold text-white text-sm">
                    {order.id}
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Items preview */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3 overflow-hidden">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.productImage}
                        alt={item.productName}
                        className="inline-block h-12 w-12 rounded-xl object-cover ring-2 ring-[#0e111a]"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {order.items[0]?.productName}{' '}
                      {order.items.length > 1 ? `+ ${order.items.length - 1} other item(s)` : ''}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      Destination: {order.deliveryAddress.city}, {order.deliveryAddress.area}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-500 block">Total ({order.paymentMethod})</span>
                  <span className="font-heading text-sm font-bold text-white">
                    Rs. {order.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Card actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <Truck className="h-3.5 w-3.5" />
                  <span>{order.estimatedDeliveryDate || 'Courier Dispatched'}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => reorder(order)}
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reorder</span>
                  </button>
                  <button
                    id={`sgm-track-order-${order.id}`}
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-emerald-400 shadow-sm"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
