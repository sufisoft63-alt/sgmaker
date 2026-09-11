import React from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import { Home, ShoppingBag, Code, Package, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cartCount } = useApp();

  const navItems: { tab: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { tab: 'home', label: 'Home', icon: Home },
    { tab: 'shop', label: 'Shop', icon: ShoppingBag },
    { tab: 'services', label: 'Services', icon: Code },
    { tab: 'orders', label: 'Orders', icon: Package },
    { tab: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-[#090b10]/95 px-2 py-1.5 backdrop-blur-xl md:hidden safe-area-bottom">
      <nav className="flex items-center justify-around">
        {navItems.map(({ tab, label, icon: Icon }) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              id={`sgm-bottom-nav-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 transition-all ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`} />
                {tab === 'shop' && cartCount > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-emerald-500 px-0.5 text-[9px] font-bold text-black">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className={`mt-1 text-[10px] font-medium transition-colors ${isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                {label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 h-0.5 w-5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
