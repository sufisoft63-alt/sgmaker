import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { SplashScreen } from './components/common/SplashScreen';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { LoginModal } from './components/auth/LoginModal';
import { ProfileSetupModal } from './components/auth/ProfileSetupModal';
import { HomeView } from './components/home/HomeView';
import { ShopView } from './components/shop/ShopView';
import { ServicesView } from './components/services/ServicesView';
import { OrdersView } from './components/orders/OrdersView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductDetailModal } from './components/shop/ProductDetailModal';
import { ServiceDetailModal } from './components/services/ServiceDetailModal';
import { ServiceRequestModal } from './components/services/ServiceRequestModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderDetailModal } from './components/orders/OrderDetailModal';
import { ApkDownloadModal } from './components/common/ApkDownloadModal';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { SplashFinishPayload } from './components/common/SplashScreen';
import { setDocumentManifest } from './utils/apkGenerator';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    toast,
    orders,
    setSelectedOrder,
    setIsLoginModalOpen,
    isApkModalOpen,
    setIsApkModalOpen,
    apkModalTab,
    showToast
  } = useApp();
  const { isLoggedIn, currentUser, isAdmin, loginAsDemo } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Check URL query parameters on initial launch (?mode=admin or ?mode=public)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'admin') {
      setDocumentManifest('admin');
      if (!isAdmin) {
        loginAsDemo('admin');
      }
      setActiveTab('admin');
    } else if (mode === 'public') {
      setDocumentManifest('public');
      setActiveTab('home');
    }
  }, [isAdmin, loginAsDemo, setActiveTab]);

  const handleSplashFinish = (payload: SplashFinishPayload) => {
    setShowSplash(false);

    if (payload.isOffline) {
      showToast('Offline Mode: Local gaming engine active.', 'info');
    }

    // AUTH ROUTING:
    // If authenticated: go to Home.
    // If not authenticated: go to Login.
    const authenticated = Boolean(currentUser || isLoggedIn || payload.hasUser);

    if (authenticated) {
      setActiveTab('home');
      setIsLoginModalOpen(false);
    } else {
      setActiveTab('home');
      setIsLoginModalOpen(true);
    }
  };

  const handleOrderPlaced = (orderId: string) => {
    const found = orders.find((o) => o.id === orderId);
    if (found) {
      setSelectedOrder(found);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Interactive Mobile Splash Screen with Guaranteed State Machine & Timeout */}
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {/* Global Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 sm:pb-8">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'shop' && <ShopView />}
        {activeTab === 'services' && <ServicesView />}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Bottom Navigation for Mobile Devices */}
      <BottomNav />

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <ServiceDetailModal />
      <ServiceRequestModal />
      <GlobalSearchModal />
      <NotificationDrawer />
      <LoginModal />
      <ProfileSetupModal />
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />
      <OrderDetailModal />
      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        defaultTab={apkModalTab}
      />

      {/* Global Toast Notification System */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-[90] flex items-center justify-center animate-in slide-in-from-bottom-3 duration-200 pointer-events-none">
          <div
            className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-2xl backdrop-blur-xl ${
              toast.type === 'success'
                ? 'border-emerald-500/40 bg-[#091512]/95 text-emerald-300 shadow-emerald-500/20'
                : toast.type === 'error'
                ? 'border-rose-500/40 bg-[#190d10]/95 text-rose-300 shadow-rose-500/20'
                : 'border-cyan-500/40 bg-[#0b141f]/95 text-cyan-300 shadow-cyan-500/20'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />}
            {toast.type === 'info' && <Info className="h-4 w-4 shrink-0 text-cyan-400" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
