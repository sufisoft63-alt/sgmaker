import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Product, Order, OrderStatus, ServiceRequest, ServiceRequestStatus } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import {
  ShieldCheck,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Phone,
  MessageSquare,
  Truck,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  ExternalLink,
  Smartphone
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser, isAdmin, toggleRole } = useAuth();
  const {
    products,
    deleteProduct,
    updateProduct,
    orders,
    updateOrderStatus,
    serviceRequests,
    updateServiceRequestStatus,
    deliveryAreas,
    updateDeliveryAreaFee,
    showToast,
    setSelectedOrder,
    openApkModal
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'products' | 'orders' | 'requests' | 'delivery'
  >('overview');

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('all');

  // Stats Calculations
  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;
    const activeRequests = serviceRequests.filter(
      (r) => r.status !== 'Completed' && r.status !== 'Declined'
    ).length;

    return {
      totalRevenue,
      orderCount: orders.length,
      pendingOrders,
      productCount: products.length,
      requestCount: serviceRequests.length,
      activeRequests
    };
  }, [orders, products, serviceRequests]);

  // If not admin, show clear authorization gateway with test toggle
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mb-4 border border-amber-500/30">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h2 className="font-heading text-xl font-bold text-white">Administrator Access Required</h2>
        <p className="mt-1 text-xs text-slate-400 max-w-sm">
          The SG Maker Management Console is restricted to administrative personnel. You can switch your demo account role to Admin below to inspect all backoffice features.
        </p>
        <button
          id="sgm-admin-switch-role-btn"
          onClick={() => {
            toggleRole();
            showToast('Role updated to Admin! Loading console...');
          }}
          className="mt-5 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/25"
        >
          Enable Admin Role & Enter Console
        </button>
      </div>
    );
  }

  const handleEditProduct = (prod: Product) => {
    setProductToEdit(prod);
    setIsProductModalOpen(true);
  };

  const handleAddNewProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleStockChange = (prod: Product, delta: number) => {
    const newStock = Math.max(0, prod.stock + delta);
    updateProduct({ ...prod, stock: newStock });
    showToast(`Stock for "${prod.name}" adjusted to ${newStock}.`);
  };

  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === 'all' ? true : o.orderStatus === orderStatusFilter
  );

  const filteredRequests = serviceRequests.filter((r) =>
    requestStatusFilter === 'all' ? true : r.status === requestStatusFilter
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-[#0c101a] p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-black shadow-md shadow-emerald-500/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-bold text-white">SG Maker Control Center</h1>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage ecommerce catalog, nationwide dispatch, and game studio pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="sgm-admin-apk-btn"
            onClick={() => openApkModal('admin')}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-bold text-cyan-400 hover:bg-cyan-500/20 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <Smartphone className="h-4 w-4" />
            <span>Admin APK Hub</span>
          </button>

          <button
            id="sgm-admin-add-product-btn"
            onClick={handleAddNewProduct}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-white/10 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview & Metrics' },
          { id: 'products', label: `Products (${products.length})` },
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'requests', label: `Studio Requests (${serviceRequests.length})` },
          { id: 'delivery', label: `Shipping & Cities (${deliveryAreas.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`sgm-admin-tab-${tab.id}`}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeAdminTab === tab.id
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/25'
                : 'border border-white/5 bg-[#0e111a] text-slate-300 hover:border-emerald-500/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================
          1. OVERVIEW & METRICS TAB
         ======================================================== */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/5 bg-[#0e111a] p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Total Revenue</span>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="font-heading text-lg sm:text-xl font-bold text-white">
                Rs. {stats.totalRevenue.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                Across completed shipments
              </span>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0e111a] p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>All Orders</span>
                <ShoppingCart className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="font-heading text-lg sm:text-xl font-bold text-white">
                {stats.orderCount}
              </div>
              <span className="text-[10px] text-amber-400 font-medium mt-1 block">
                {stats.pendingOrders} pending dispatch
              </span>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0e111a] p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Gear In Catalog</span>
                <Package className="h-4 w-4 text-purple-400" />
              </div>
              <div className="font-heading text-lg sm:text-xl font-bold text-white">
                {stats.productCount} Items
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                7 Active Categories
              </span>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0e111a] p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Studio Requests</span>
                <MessageSquare className="h-4 w-4 text-amber-400" />
              </div>
              <div className="font-heading text-lg sm:text-xl font-bold text-white">
                {stats.requestCount}
              </div>
              <span className="text-[10px] text-cyan-400 font-medium mt-1 block">
                {stats.activeRequests} in consultation
              </span>
            </div>
          </div>

          {/* Quick overview of latest orders */}
          <div className="rounded-2xl border border-white/5 bg-[#0e111a] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                Latest Customer Orders
              </h3>
              <button
                onClick={() => setActiveAdminTab('orders')}
                className="text-xs text-emerald-400 hover:underline"
              >
                View all orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">City</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 font-mono font-bold text-white">{order.id}</td>
                      <td className="py-2.5">{order.customerName}</td>
                      <td className="py-2.5">{order.deliveryAddress.city}</td>
                      <td className="py-2.5 font-bold text-emerald-400">
                        Rs. {order.total.toLocaleString()}
                      </td>
                      <td className="py-2.5">
                        <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-semibold">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="rounded bg-white/10 px-2 py-1 text-[10px] font-bold text-white hover:bg-white/20"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          2. PRODUCTS MANAGEMENT TAB
         ======================================================== */}
      {activeAdminTab === 'products' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing <strong>{products.length}</strong> products in catalog
            </span>
            <button
              onClick={handleAddNewProduct}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-emerald-400"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Hardware Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="flex flex-col justify-between rounded-2xl border border-white/5 bg-[#0e111a] p-4 transition-all hover:border-white/15"
              >
                <div>
                  <div className="flex gap-3">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="h-16 w-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] font-bold text-slate-300">
                          {prod.category}
                        </span>
                        {prod.featured && (
                          <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
                            Featured
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading font-bold text-white text-xs mt-1 truncate">
                        {prod.name}
                      </h4>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-heading font-bold text-emerald-400 text-xs">
                          Rs. {(prod.discountPrice || prod.price).toLocaleString()}
                        </span>
                        {prod.discountPrice && (
                          <span className="text-[10px] text-slate-500 line-through">
                            Rs. {prod.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stock counter */}
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-black/40 border border-white/5 px-3 py-1.5 text-xs">
                    <span className="text-slate-400">Inventory Units:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStockChange(prod, -1)}
                        className="h-5 w-5 rounded bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                      >
                        -
                      </button>
                      <span className={`font-mono font-bold ${prod.stock <= 5 ? 'text-rose-400' : 'text-white'}`}>
                        {prod.stock}
                      </span>
                      <button
                        onClick={() => handleStockChange(prod, 1)}
                        className="h-5 w-5 rounded bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
                  <button
                    onClick={() => handleEditProduct(prod)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit Specs</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${prod.name}" from catalog?`)) {
                        deleteProduct(prod.id);
                        showToast(`Deleted ${prod.name}`);
                      }
                    }}
                    className="flex items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          3. ORDERS MANAGEMENT TAB
         ======================================================== */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Status filter bar */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex gap-1.5">
              {[
                'all',
                'Pending',
                'Confirmed',
                'Preparing',
                'Packed',
                'Shipped',
                'Out for Delivery',
                'Delivered',
                'Cancelled'
              ].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold ${
                    orderStatusFilter === st
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'All Orders' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="rounded-2xl border border-white/5 bg-[#0e111a] p-4 transition-all hover:border-white/10"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-white text-sm">{ord.id}</span>
                    <span className="text-xs text-slate-400">
                      • {new Date(ord.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Interactive Status Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Update Status:</span>
                    <select
                      id={`sgm-admin-order-status-${ord.id}`}
                      value={ord.orderStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="rounded-lg border border-emerald-500/30 bg-[#090b10] px-2.5 py-1 text-xs font-bold text-emerald-400 focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Customer Details</span>
                    <strong className="text-white block">{ord.customerName}</strong>
                    <span className="text-slate-400 font-mono text-[11px] block">
                      {ord.customerPhone}
                    </span>
                    <span className="text-slate-500 text-[10px]">{ord.customerEmail}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">Delivery Destination</span>
                    <strong className="text-white block">
                      {ord.deliveryAddress.city} ({ord.deliveryAddress.area})
                    </strong>
                    <span className="text-slate-400 text-[11px] line-clamp-1">
                      {ord.deliveryAddress.fullAddress}
                    </span>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-slate-500 block text-[10px]">Payment & Total</span>
                    <strong className="text-emerald-400 font-heading text-sm block">
                      Rs. {ord.total.toLocaleString()}
                    </strong>
                    <span className="text-slate-400 text-[11px] block">
                      {ord.paymentMethod} ({ord.paymentStatus})
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    Items: {ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(ord)}
                    className="flex items-center gap-1 font-bold text-emerald-400 hover:underline"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          4. STUDIO SERVICE REQUESTS TAB
         ======================================================== */}
      {activeAdminTab === 'requests' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              'all',
              'New',
              'Contacted',
              'In Discussion',
              'Proposal Sent',
              'In Progress',
              'Completed',
              'Declined'
            ].map((st) => (
              <button
                key={st}
                onClick={() => setRequestStatusFilter(st)}
                className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold ${
                  requestStatusFilter === st
                    ? 'bg-cyan-400 text-black font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'All Inquiries' : st}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredRequests.map((req) => {
              const cleanPhone = req.phone.replace(/[^0-9]/g, '');
              const waUrl = `https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(
                req.name
              )},%20this%20is%20SG%20Maker%20Game%20Studio%20regarding%20your%20project:%20${encodeURIComponent(
                req.projectTitle
              )}`;

              return (
                <div
                  key={req.id}
                  className="rounded-2xl border border-white/5 bg-[#0e111a] p-4 transition-all hover:border-cyan-500/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-white text-sm">
                          {req.projectTitle}
                        </span>
                        <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                          {req.gameType}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        Ref ID: {req.id} • {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Status:</span>
                      <select
                        value={req.status}
                        onChange={(e) =>
                          updateServiceRequestStatus(req.id, e.target.value as ServiceRequestStatus)
                        }
                        className="rounded-lg border border-cyan-500/30 bg-[#090b10] px-2.5 py-1 text-xs font-bold text-cyan-300 focus:outline-none"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Discussion">In Discussion</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </div>
                  </div>

                  <div className="py-3 text-xs space-y-2">
                    <p className="text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                      {req.description}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Platform</span>
                        <span className="text-slate-200 font-semibold">{req.platform}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Client Budget</span>
                        <span className="text-emerald-400 font-semibold">{req.budget}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Client Contact</span>
                        <span className="text-slate-200">{req.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Phone</span>
                        <span className="text-slate-200 font-mono">{req.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex gap-2 justify-end">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-black hover:bg-emerald-400"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>WhatsApp Client</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          5. DELIVERY CITIES & RATES TAB
         ======================================================== */}
      {activeAdminTab === 'delivery' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-2xl border border-white/5 bg-[#0e111a] p-5">
            <h3 className="font-heading font-bold text-white text-sm mb-1 flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-400" />
              Pakistan Cities Delivery Rates & SLA
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-time shipping calculations applied during customer checkout.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deliveryAreas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs"
                >
                  <div>
                    <strong className="text-white block text-sm">{area.city}</strong>
                    <span className="text-slate-400 text-[11px] block">{area.deliveryTime}</span>
                    <span className="text-slate-500 text-[10px]">
                      {area.active ? 'Active Courier Route' : 'Route Inactive'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Rs.</span>
                    <input
                      type="number"
                      min={0}
                      step={10}
                      defaultValue={area.deliveryFee}
                      onBlur={(e) => {
                        const newFee = Number(e.target.value);
                        updateDeliveryAreaFee(area.id, newFee);
                        showToast(`Delivery fee for ${area.city} updated to Rs. ${newFee}.`);
                      }}
                      className="w-20 rounded-lg border border-white/10 bg-[#090b10] px-2 py-1 text-center font-bold text-emerald-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
      />
    </div>
  );
};
