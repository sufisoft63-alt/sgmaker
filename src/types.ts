export type UserRole = 'user' | 'admin' | 'developer';

export interface UserProfile {
  uid: string;
  userId: string; // e.g. SGM-84920
  username: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  profilePhoto: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  itemCount?: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userUid?: string;
  userName: string;
  userPhoto?: string;
  userHandle?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  updatedAt?: string;
  verifiedPurchase: boolean;
  orderId?: string;
  helpfulCount?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number; // in PKR
  discountPrice?: number; // in PKR
  discountPercent?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  featured?: boolean;
  newProduct?: boolean;
  bestSeller?: boolean;
  active: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  type: 'Home' | 'Office' | 'Shop' | 'Other';
  province: string;
  city: string;
  area: string;
  street: string;
  houseNumber: string;
  landmark?: string;
  fullAddress: string;
  deliveryInstructions?: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'Cash on Delivery' | 'Easypaisa' | 'JazzCash' | 'Bank Transfer';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string; // e.g. SGM-ORD-98231
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid';
  paymentReference?: string;
  orderStatus: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  estimatedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface GamingService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  startingPrice: number; // in PKR
  image: string;
  technologies: string[];
  features: string[];
  estimatedTime: string;
  active: boolean;
  category: 'Game Development' | 'Design & Art' | 'Backend & Cloud' | 'Support & Maintenance';
}

export type ServiceRequestStatus =
  | 'New'
  | 'Contacted'
  | 'In Discussion'
  | 'Quotation Sent'
  | 'Approved'
  | 'Development'
  | 'Completed'
  | 'Cancelled';

export interface ServiceRequest {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  projectTitle: string;
  gameType: string;
  platform: string;
  budget: string;
  description: string;
  referenceUrl?: string;
  serviceId?: string;
  serviceTitle?: string;
  status: ServiceRequestStatus;
  createdAt: string;
  notes?: string;
}

export interface DeliveryArea {
  id: string;
  country: string;
  province: string;
  city: string;
  area: string;
  deliveryFee: number; // in PKR
  estimatedDays: string;
  active: boolean;
}

export type BannerButtonAction =
  | 'Open Product'
  | 'Open Category'
  | 'Open Gaming Service'
  | 'Open Offer'
  | 'Open News'
  | 'Open External Link';

export interface Banner {
  id: string;
  bannerId?: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  image?: string;
  buttonText?: string;
  buttonAction?: BannerButtonAction;
  targetId?: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
  priority?: number;
}

export type NewsCategory =
  | 'Gaming'
  | 'Technology'
  | 'SG Maker'
  | 'Game Development'
  | 'Mobile'
  | 'Accessories'
  | 'Updates'
  | 'Announcements';

export interface NewsArticle {
  id: string;
  newsId: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  category: NewsCategory;
  author: string;
  publishedAt: string;
  active: boolean;
  featured: boolean;
  priority: number;
  readTimeMinutes?: number;
  tags?: string[];
  startDate?: string;
  endDate?: string;
}

export type OfferDiscountType = 'percentage' | 'fixed' | 'bogo' | 'flash' | 'limited';

export interface LiveOffer {
  id: string;
  offerId: string;
  title: string;
  description: string;
  image: string;
  discountType: OfferDiscountType;
  discountValue: number; // Percentage or PKR amount
  productIds: string[];
  couponCode: string;
  startDate: string;
  endDate: string;
  active: boolean;
  featured: boolean;
  terms?: string;
}

export interface FlashDeal {
  id: string;
  dealId?: string;
  productId: string;
  title: string;
  productName: string;
  image: string;
  oldPrice: number;
  salePrice: number;
  discountPercent: number;
  stockRemaining: number;
  maxStock: number;
  startDate: string;
  endDate: string;
  active: boolean;
  category?: string;
}

export type AnnouncementType =
  | 'Important announcement'
  | 'Maintenance notice'
  | 'New update'
  | 'New product'
  | 'Delivery notice'
  | 'Special event';

export interface Announcement {
  id: string;
  announcementId: string;
  text: string;
  icon?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  startTime?: string;
  endTime?: string;
  active: boolean;
  type: AnnouncementType;
  linkAction?: string;
  linkTarget?: string;
}

export type NotificationType =
  | 'Order'
  | 'Offer'
  | 'News'
  | 'Gaming'
  | 'System'
  | 'Promotion';

export interface AppNotification {
  id: string;
  notificationId?: string;
  userId: string; // 'all' or specific user uid
  title: string;
  message: string;
  image?: string;
  type: 'order' | 'promo' | 'service' | 'system' | NotificationType;
  target?: string;
  createdAt: string;
  scheduledAt?: string;
  active?: boolean;
  read: boolean;
  linkAction?: string;
}

export interface AppSettings {
  appName: string;
  tagline: string;
  logo: string;
  supportPhone: string;
  supportEmail: string;
  currency: string;
  currencySymbol: string;
  defaultCountry: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  minimumAppVersion: string;
  latestVersion: string;
  forceUpdate: boolean;
  updateMessage?: string;
  updateUrl?: string;
  freeDeliveryThreshold: number;
  defaultDeliveryFee: number;
  minimumOrder: number;
  codAvailable: boolean;
}

export type HomeSectionId =
  | 'banners'
  | 'announcements'
  | 'flashDeals'
  | 'offers'
  | 'categories'
  | 'gamingStudio'
  | 'newProducts'
  | 'news'
  | 'featuredProducts'
  | 'services';

export interface HomeSectionConfig {
  id: HomeSectionId;
  label: string;
  visible: boolean;
  order: number;
}

export interface AppHomeController {
  sections: HomeSectionConfig[];
}

export interface AppThemeConfig {
  primaryColor: string; // hex
  secondaryColor: string; // hex
  accentColor: string; // hex
  buttonStyle: 'rounded' | 'pill' | 'sharp';
  cardRadius: 'small' | 'medium' | 'large' | 'pill';
  mode: 'dark' | 'light';
  homeBackground: 'cyber-dark' | 'deep-midnight' | 'pure-black' | 'obsidian-matrix';
  logo: string;
  appIcon: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  category: 'banner' | 'product' | 'news' | 'offer' | 'service' | 'profile' | 'general';
  size?: string;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType:
    | 'Product'
    | 'Offer'
    | 'News'
    | 'Banner'
    | 'FlashDeal'
    | 'Announcement'
    | 'Notification'
    | 'Order'
    | 'Service'
    | 'Settings'
    | 'Theme'
    | 'Delivery';
  targetId: string;
  timestamp: string;
  details?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}
