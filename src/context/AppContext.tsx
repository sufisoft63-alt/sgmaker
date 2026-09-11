import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  GamingService,
  CartItem,
  Order,
  Address,
  AppNotification,
  ServiceRequest,
  DeliveryArea,
  Banner,
  ProductCategory
} from '../types';
import { storeService } from '../services/store';
import { useAuth } from './AuthContext';

export type ActiveTab = 'home' | 'shop' | 'services' | 'orders' | 'profile' | 'admin';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  // Products
  products: Product[];
  categories: ProductCategory[];
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  // Services
  services: GamingService[];
  selectedService: GamingService | null;
  setSelectedService: (service: GamingService | null) => void;
  serviceRequestModalOpen: boolean;
  setServiceRequestModalOpen: (open: boolean) => void;
  requestTargetService: GamingService | null;
  openServiceRequestModal: (service?: GamingService) => void;
  // Cart
  cart: CartItem[];
  cartCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  grandTotal: number;
  promoCode: string;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  // Orders
  orders: Order[];
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  reorder: (order: Order) => void;
  // Addresses
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address | null) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  updateAddress: (addr: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  // Delivery areas
  deliveryAreas: DeliveryArea[];
  // Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  // UI Modals
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isApkModalOpen: boolean;
  setIsApkModalOpen: (open: boolean) => void;
  apkModalTab: 'public' | 'admin';
  setApkModalTab: (tab: 'public' | 'admin') => void;
  openApkModal: (tab?: 'public' | 'admin') => void;
  // Banners
  banners: Banner[];
  // Toast
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  // Refresh data
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Products & Categories
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Services
  const [services, setServices] = useState<GamingService[]>([]);
  const [selectedService, setSelectedService] = useState<GamingService | null>(null);
  const [serviceRequestModalOpen, setServiceRequestModalOpen] = useState(false);
  const [requestTargetService, setRequestTargetService] = useState<GamingService | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // Delivery Areas
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>([]);

  // Notifications & Banners
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);

  // Modals
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [apkModalTab, setApkModalTab] = useState<'public' | 'admin'>('public');

  const openApkModal = (tab: 'public' | 'admin' = 'public') => {
    setApkModalTab(tab);
    setIsApkModalOpen(true);
  };

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const refreshData = () => {
    setProducts(storeService.getProducts());
    setCategories(storeService.getCategories());
    setServices(storeService.getServices());
    setBanners(storeService.getBanners());
    setDeliveryAreas(storeService.getDeliveryAreas());
    setNotifications(storeService.getNotifications(currentUser?.uid));
    const userAddresses = storeService.getAddresses(currentUser?.uid);
    setAddresses(userAddresses);
    const def = userAddresses.find((a) => a.isDefault) || userAddresses[0] || null;
    setSelectedAddress(def);
    setOrders(storeService.getOrders());
    if (currentUser) {
      setCart(storeService.getCart(currentUser.uid));
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser?.uid]);

  // Cart syncing
  useEffect(() => {
    if (currentUser) {
      storeService.saveCart(currentUser.uid, cart);
    }
  }, [cart, currentUser]);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast('This product is currently out of stock.', 'error');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const nextQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: nextQty } : item
        );
      } else {
        return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
      }
    });
    showToast(`Added "${product.name}" to cart!`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const max = item.product.stock || 1;
          return { ...item, quantity: Math.min(max, quantity) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    if (currentUser) {
      storeService.saveCart(currentUser.uid, []);
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => {
    const unitPrice = item.product.discountPrice || item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const discount = Math.round(subtotal * (discountPercent / 100));

  // Determine delivery fee from selected address or matched delivery area
  const matchedArea = deliveryAreas.find(
    (area) => selectedAddress && area.city.toLowerCase() === selectedAddress.city.toLowerCase()
  );
  const deliveryFee = subtotal > 0 ? matchedArea?.deliveryFee ?? 150 : 0;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SGPROMO') {
      setPromoCode('SGPROMO');
      setDiscountPercent(10);
      showToast('Promo applied: 10% discount added!', 'success');
      return { success: true, message: '10% Discount Applied!' };
    }
    if (clean === 'GAMER15') {
      setPromoCode('GAMER15');
      setDiscountPercent(15);
      showToast('Promo applied: 15% esports discount added!', 'success');
      return { success: true, message: '15% Discount Applied!' };
    }
    if (clean === 'FREESHIP') {
      setPromoCode('FREESHIP');
      setDiscountPercent(5);
      showToast('Promo applied: 5% discount added!', 'success');
      return { success: true, message: 'Discount Applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try "SGPROMO" or "GAMER15"' };
  };

  const openServiceRequestModal = (service?: GamingService) => {
    setRequestTargetService(service || null);
    setServiceRequestModalOpen(true);
  };

  // Orders
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<Order> => {
    const id = `SGM-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...orderData,
      id,
      statusHistory: [
        {
          status: 'Pending',
          timestamp: now,
          note: 'Order placed by customer with Cash on Delivery'
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    await storeService.createOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Order ${id} placed successfully!`, 'success');
    return newOrder;
  };

  const cancelOrder = async (orderId: string) => {
    await storeService.updateOrderStatus(orderId, 'Cancelled', 'Cancelled by customer');
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: 'Cancelled' } : o))
    );
    showToast(`Order ${orderId} has been cancelled.`, 'info');
  };

  const reorder = (order: Order) => {
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod && prod.stock > 0) {
        addToCart(prod, item.quantity);
      }
    });
    setActiveTab('shop');
    setIsCartDrawerOpen(true);
  };

  // Address
  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addr,
      id: `addr-${Date.now()}`
    };
    storeService.addAddress(newAddr);
    const updated = storeService.getAddresses(currentUser?.uid);
    setAddresses(updated);
    if (newAddr.isDefault || !selectedAddress) {
      setSelectedAddress(newAddr);
    }
    showToast('New delivery address saved!');
  };

  const updateAddress = (addr: Address) => {
    storeService.updateAddress(addr);
    const updated = storeService.getAddresses(currentUser?.uid);
    setAddresses(updated);
    if (selectedAddress?.id === addr.id) {
      setSelectedAddress(addr);
    }
    showToast('Address updated!');
  };

  const deleteAddress = (id: string) => {
    storeService.deleteAddress(id);
    const updated = storeService.getAddresses(currentUser?.uid);
    setAddresses(updated);
    if (selectedAddress?.id === id) {
      setSelectedAddress(updated[0] || null);
    }
    showToast('Address removed.', 'info');
  };

  const setDefaultAddress = (id: string) => {
    const target = addresses.find((a) => a.id === id);
    if (target) {
      const updated = { ...target, isDefault: true };
      storeService.updateAddress(updated);
      const list = storeService.getAddresses(currentUser?.uid);
      setAddresses(list);
      setSelectedAddress(updated);
      showToast('Default address set!');
    }
  };

  // Notifications
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = (id: string) => {
    storeService.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    storeService.markAllNotificationsRead(currentUser?.uid);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        products,
        categories,
        selectedCategorySlug,
        setSelectedCategorySlug,
        selectedProduct,
        setSelectedProduct,
        services,
        selectedService,
        setSelectedService,
        serviceRequestModalOpen,
        setServiceRequestModalOpen,
        requestTargetService,
        openServiceRequestModal,
        cart,
        cartCount,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        discount,
        deliveryFee,
        grandTotal,
        promoCode,
        applyPromoCode,
        orders,
        selectedOrder,
        setSelectedOrder,
        createOrder,
        cancelOrder,
        reorder,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        deliveryAreas,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isApkModalOpen,
        setIsApkModalOpen,
        apkModalTab,
        setApkModalTab,
        openApkModal,
        banners,
        showToast,
        toast,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
