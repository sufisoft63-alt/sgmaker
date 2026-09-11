import {
  Product,
  ProductCategory,
  GamingService,
  ServiceRequest,
  Order,
  Address,
  AppNotification,
  DeliveryArea,
  Banner,
  ProductReview,
  ContactMessage,
  CartItem,
  OrderStatus,
  ServiceRequestStatus
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_SERVICES,
  INITIAL_BANNERS,
  INITIAL_DELIVERY_AREAS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS
} from '../data/mockData';
import { isLiveFirebaseActive, getFirebaseDb, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

const STORAGE_KEYS = {
  PRODUCTS: 'sgm_products_v1',
  SERVICES: 'sgm_services_v1',
  CATEGORIES: 'sgm_categories_v1',
  ORDERS: 'sgm_orders_v1',
  REQUESTS: 'sgm_service_requests_v1',
  ADDRESSES: 'sgm_addresses_v1',
  NOTIFICATIONS: 'sgm_notifications_v1',
  BANNERS: 'sgm_banners_v1',
  DELIVERY_AREAS: 'sgm_delivery_areas_v1',
  REVIEWS: 'sgm_reviews_v1',
  CART: 'sgm_cart_v1',
  CONTACTS: 'sgm_contacts_v1',
};

// Safe storage helpers
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to store data for ${key}:`, err);
  }
}

class StoreService {
  // PRODUCTS
  getProducts(): Product[] {
    return getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  saveProducts(products: Product[]): void {
    setStored(STORAGE_KEYS.PRODUCTS, products);
  }

  async addProduct(product: Product): Promise<void> {
    const products = this.getProducts();
    const updated = [product, ...products];
    this.saveProducts(updated);

    if (isLiveFirebaseActive()) {
      try {
        const db = getFirebaseDb()!;
        await setDoc(doc(db, 'products', product.id), product);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'products');
      }
    }
  }

  async updateProduct(updatedProduct: Product): Promise<void> {
    const products = this.getProducts();
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    this.saveProducts(updated);

    if (isLiveFirebaseActive()) {
      try {
        const db = getFirebaseDb()!;
        await updateDoc(doc(db, 'products', updatedProduct.id), { ...updatedProduct });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `products/${updatedProduct.id}`);
      }
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    const products = this.getProducts();
    const updated = products.filter((p) => p.id !== productId);
    this.saveProducts(updated);

    if (isLiveFirebaseActive()) {
      try {
        const db = getFirebaseDb()!;
        await deleteDoc(doc(db, 'products', productId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
      }
    }
  }

  // CATEGORIES
  getCategories(): ProductCategory[] {
    return getStored<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  // SERVICES
  getServices(): GamingService[] {
    return getStored<GamingService[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  }

  saveServices(services: GamingService[]): void {
    setStored(STORAGE_KEYS.SERVICES, services);
  }

  async addService(service: GamingService): Promise<void> {
    const services = this.getServices();
    const updated = [service, ...services];
    this.saveServices(updated);

    if (isLiveFirebaseActive()) {
      try {
        const db = getFirebaseDb()!;
        await setDoc(doc(db, 'services', service.id), service);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'services');
      }
    }
  }

  async updateService(updatedService: GamingService): Promise<void> {
    const services = this.getServices();
    const updated = services.map((s) => (s.id === updatedService.id ? updatedService : s));
    this.saveServices(updated);

    if (isLiveFirebaseActive()) {
      try {
        const db = getFirebaseDb()!;
        await updateDoc(doc(db, 'services', updatedService.id), { ...updatedService });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `services/${updatedService.id}`);
      }
    }
  }

  async deleteService(serviceId: string): Promise<void> {
    const services = this.getServices();
    const updated = services.filter((s) => s.id !== serviceId);
    this.saveServices(updated);

    if (isLiveFirebaseActive()) {
      try {
        const db = getFirebaseDb()!;
        await deleteDoc(doc(db, 'services', serviceId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `services/${serviceId}`);
      }
    }
  }

  // SERVICE REQUESTS
  getServiceRequests(): ServiceRequest[] {
    return getStored<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, [
      {
        id: 'REQ-72910',
        name: 'Hamza Malik',
        email: 'hamza.malik@example.com',
        phone: '+92 300 1234567',
        projectTitle: 'CyberTactics 3D Battle Royale',
        gameType: 'Battle Royale',
        platform: 'Android & iOS',
        budget: 'Rs. 250,000 - 500,000',
        description: 'Multiplayer survival shooter with custom Pakistani skins, voice chat, and local payment integration for skins.',
        status: 'In Discussion',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        serviceTitle: 'Battle Royale Development'
      },
      {
        id: 'REQ-72911',
        name: 'Zeeshan Ali',
        email: 'zeeshan@indiegame.pk',
        phone: '+92 321 9876543',
        projectTitle: 'Desi Street Racer Multiplayer',
        gameType: 'Racing / Arcade',
        platform: 'Android',
        budget: 'Rs. 100,000 - 200,000',
        description: 'Need Photon Fusion integration and draw call optimization for low end 3GB RAM devices.',
        status: 'New',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        serviceTitle: 'Photon Multiplayer Setup'
      }
    ]);
  }

  async createServiceRequest(reqData: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>): Promise<ServiceRequest> {
    const id = `REQ-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReq: ServiceRequest = {
      ...reqData,
      id,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    const current = this.getServiceRequests();
    const updated = [newReq, ...current];
    setStored(STORAGE_KEYS.REQUESTS, updated);

    // Notify user
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: reqData.userId || 'all',
      title: 'Service Request Submitted!',
      message: `Your request for "${reqData.projectTitle}" has been received. Our studio lead will contact you via WhatsApp / Phone.`,
      type: 'service',
      read: false,
      createdAt: new Date().toISOString()
    });

    if (isLiveFirebaseActive()) {
      try {
        const db = getFirebaseDb()!;
        await setDoc(doc(db, 'serviceRequests', id), newReq);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'serviceRequests');
      }
    }

    return newReq;
  }

  async updateServiceRequestStatus(id: string, status: ServiceRequestStatus, notes?: string): Promise<void> {
    const current = this.getServiceRequests();
    const updated = current.map((r) => (r.id === id ? { ...r, status, notes: notes || r.notes } : r));
    setStored(STORAGE_KEYS.REQUESTS, updated);

    if (isLiveFirebaseActive()) {
      try {
        const db = getFirebaseDb()!;
        await updateDoc(doc(db, 'serviceRequests', id), { status, notes });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `serviceRequests/${id}`);
      }
    }
  }

  // ORDERS
  getOrders(): Order[] {
    return getStored<Order[]>(STORAGE_KEYS.ORDERS, [
      {
        id: 'SGM-ORD-91204',
        userId: 'usr-demo-1',
        customerName: 'Usman Tariq',
        customerEmail: 'usman.gaming@gmail.com',
        customerPhone: '+92 301 5556677',
        items: [
          {
            productId: 'prod-1',
            productName: 'SG Viper 7.1 Surround Gaming Headset',
            productImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
            price: 4299,
            quantity: 1,
            total: 4299
          },
          {
            productId: 'prod-4',
            productName: 'SG PulseStrike Mechanical Gaming Triggers',
            productImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
            price: 1199,
            quantity: 1,
            total: 1199
          }
        ],
        subtotal: 5498,
        discount: 0,
        deliveryFee: 150,
        total: 5648,
        deliveryAddress: {
          id: 'addr-1',
          userId: 'usr-demo-1',
          name: 'Usman Tariq',
          phone: '+92 301 5556677',
          type: 'Home',
          province: 'Punjab',
          city: 'Lahore',
          area: 'Gulberg & DHA',
          street: 'Main Boulevard Gulberg III',
          houseNumber: 'House 42-B',
          landmark: 'Near Liberty Market',
          fullAddress: 'House 42-B, Main Boulevard Gulberg III, Near Liberty Market, Lahore',
          isDefault: true
        },
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderStatus: 'Shipped',
        statusHistory: [
          { status: 'Pending', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Order placed by customer' },
          { status: 'Confirmed', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(), note: 'Verified by SG Maker Dispatch' },
          { status: 'Preparing', timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Packed with fragile anti-shock wrap' },
          { status: 'Shipped', timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), note: 'Dispatched via Express Courier' }
        ],
        estimatedDeliveryDate: 'Tomorrow, 3:00 PM - 7:00 PM',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 8).toISOString()
      }
    ]);
  }

  async createOrder(order: Order): Promise<void> {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    setStored(STORAGE_KEYS.ORDERS, updated);

    // Create confirmation notification
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: order.userId,
      title: `Order ${order.id} Confirmed!`,
      message: `Your order for Rs. ${order.total.toLocaleString()} has been received. Our team will verify and dispatch shortly.`,
      type: 'order',
      read: false,
      createdAt: new Date().toISOString()
    });

    if (isLiveFirebaseActive()) {
      try {
        const db = getFirebaseDb()!;
        await setDoc(doc(db, 'orders', order.id), order);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'orders');
      }
    }
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Promise<void> {
    const orders = this.getOrders();
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const history = [
          ...o.statusHistory,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: note || `Status changed to ${newStatus}`
          }
        ];
        return {
          ...o,
          orderStatus: newStatus,
          statusHistory: history,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    });
    setStored(STORAGE_KEYS.ORDERS, updated);

    // Notify user
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      this.addNotification({
        id: `notif-${Date.now()}`,
        userId: targetOrder.userId,
        title: `Order ${orderId}: ${newStatus}`,
        message: note || `Your order status is now ${newStatus}. Estimated delivery: ${targetOrder.estimatedDeliveryDate}`,
        type: 'order',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    if (isLiveFirebaseActive()) {
      try {
        const db = getFirebaseDb()!;
        await updateDoc(doc(db, 'orders', orderId), {
          orderStatus: newStatus,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
      }
    }
  }

  // ADDRESSES
  getAddresses(userId?: string): Address[] {
    const all = getStored<Address[]>(STORAGE_KEYS.ADDRESSES, [
      {
        id: 'addr-default-1',
        userId: 'usr-demo-1',
        name: 'Usman Tariq',
        phone: '+92 301 5556677',
        type: 'Home',
        province: 'Punjab',
        city: 'Lahore',
        area: 'Gulberg & DHA',
        street: 'Main Boulevard Gulberg III',
        houseNumber: 'House 42-B',
        landmark: 'Near Liberty Market',
        fullAddress: 'House 42-B, Main Boulevard Gulberg III, Near Liberty Market, Lahore',
        deliveryInstructions: 'Ring bell and leave at guard gate if not answering',
        isDefault: true
      },
      {
        id: 'addr-default-2',
        userId: 'usr-demo-1',
        name: 'Usman (Studio Office)',
        phone: '+92 301 5556677',
        type: 'Office',
        province: 'Punjab',
        city: 'Lahore',
        area: 'Gulberg & DHA',
        street: 'MM Alam Road',
        houseNumber: 'Office 402, Al-Hafeez Tower',
        landmark: 'Opposite Mall 1',
        fullAddress: 'Office 402, Al-Hafeez Tower, MM Alam Road, Lahore',
        deliveryInstructions: 'Deliver between 10am to 6pm on weekdays',
        isDefault: false
      }
    ]);
    if (!userId) return all;
    return all.filter((a) => a.userId === userId);
  }

  saveAddresses(addresses: Address[]): void {
    setStored(STORAGE_KEYS.ADDRESSES, addresses);
  }

  addAddress(address: Address): void {
    let list = this.getAddresses();
    if (address.isDefault) {
      list = list.map((a) => (a.userId === address.userId ? { ...a, isDefault: false } : a));
    }
    const updated = [address, ...list];
    this.saveAddresses(updated);
  }

  updateAddress(address: Address): void {
    let list = this.getAddresses();
    if (address.isDefault) {
      list = list.map((a) => (a.userId === address.userId && a.id !== address.id ? { ...a, isDefault: false } : a));
    }
    const updated = list.map((a) => (a.id === address.id ? address : a));
    this.saveAddresses(updated);
  }

  deleteAddress(addressId: string): void {
    const list = this.getAddresses();
    const updated = list.filter((a) => a.id !== addressId);
    this.saveAddresses(updated);
  }

  // NOTIFICATIONS
  getNotifications(userId?: string): AppNotification[] {
    const all = getStored<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (!userId) return all;
    return all.filter((n) => n.userId === userId || n.userId === 'all');
  }

  addNotification(notif: AppNotification): void {
    const all = this.getNotifications();
    const updated = [notif, ...all];
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  markNotificationRead(notifId: string): void {
    const all = this.getNotifications();
    const updated = all.map((n) => (n.id === notifId ? { ...n, read: true } : n));
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  markAllNotificationsRead(userId?: string): void {
    const all = this.getNotifications();
    const updated = all.map((n) => (userId && n.userId !== userId && n.userId !== 'all' ? n : { ...n, read: true }));
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  // CART
  getCart(userId: string): CartItem[] {
    const allCarts = getStored<Record<string, CartItem[]>>(STORAGE_KEYS.CART, {});
    return allCarts[userId] || [];
  }

  saveCart(userId: string, items: CartItem[]): void {
    const allCarts = getStored<Record<string, CartItem[]>>(STORAGE_KEYS.CART, {});
    allCarts[userId] = items;
    setStored(STORAGE_KEYS.CART, allCarts);
  }

  // DELIVERY AREAS
  getDeliveryAreas(): DeliveryArea[] {
    return getStored<DeliveryArea[]>(STORAGE_KEYS.DELIVERY_AREAS, INITIAL_DELIVERY_AREAS);
  }

  saveDeliveryAreas(areas: DeliveryArea[]): void {
    setStored(STORAGE_KEYS.DELIVERY_AREAS, areas);
  }

  // BANNERS
  getBanners(): Banner[] {
    return getStored<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
  }

  saveBanners(banners: Banner[]): void {
    setStored(STORAGE_KEYS.BANNERS, banners);
  }

  // REVIEWS
  getReviews(productId: string): ProductReview[] {
    const all = getStored<ProductReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    return all.filter((r) => r.productId === productId);
  }

  getAllReviews(): ProductReview[] {
    return getStored<ProductReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  async addReview(review: ProductReview): Promise<void> {
    const all = getStored<ProductReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const existingIndex = all.findIndex(
      (r) => r.id === review.id || (r.productId === review.productId && (r.userId === review.userId || (review.userUid && r.userUid === review.userUid)))
    );
    
    let updated: ProductReview[];
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...review,
        updatedAt: new Date().toISOString()
      };
    } else {
      updated = [review, ...all];
    }
    setStored(STORAGE_KEYS.REVIEWS, updated);

    // Recalculate product rating and review count
    const productReviews = updated.filter((r) => r.productId === review.productId);
    const avgRating = Number((productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1));
    const products = this.getProducts();
    const product = products.find((p) => p.id === review.productId);
    if (product) {
      product.rating = avgRating;
      product.reviewCount = productReviews.length;
      await this.updateProduct(product);
    }

    if (isLiveFirebaseActive()) {
      try {
        const db = getFirebaseDb()!;
        await setDoc(doc(db, 'reviews', review.id), review);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `reviews/${review.id}`);
      }
    }
  }

  async deleteReview(reviewId: string, productId: string): Promise<void> {
    const all = getStored<ProductReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const updated = all.filter((r) => r.id !== reviewId);
    setStored(STORAGE_KEYS.REVIEWS, updated);

    // Recalculate product rating
    const productReviews = updated.filter((r) => r.productId === productId);
    const avgRating = productReviews.length > 0
      ? Number((productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1))
      : 5.0;
    const products = this.getProducts();
    const product = products.find((p) => p.id === productId);
    if (product) {
      product.rating = avgRating;
      product.reviewCount = productReviews.length;
      await this.updateProduct(product);
    }

    if (isLiveFirebaseActive()) {
      try {
        const db = getFirebaseDb()!;
        await deleteDoc(doc(db, 'reviews', reviewId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `reviews/${reviewId}`);
      }
    }
  }

  // CONTACT MESSAGES
  getContactMessages(): ContactMessage[] {
    return getStored<ContactMessage[]>(STORAGE_KEYS.CONTACTS, []);
  }

  saveContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const current = this.getContactMessages();
    setStored(STORAGE_KEYS.CONTACTS, [newMsg, ...current]);
    return newMsg;
  }
}

export const storeService = new StoreService();
