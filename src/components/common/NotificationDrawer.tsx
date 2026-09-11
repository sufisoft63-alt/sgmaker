import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, CheckCheck, Package, Tag, Code, Info } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="h-4 w-4 text-emerald-400" />;
      case 'promo':
        return <Tag className="h-4 w-4 text-amber-400" />;
      case 'service':
        return <Code className="h-4 w-4 text-cyan-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative flex h-full w-full max-w-md flex-col bg-[#0b0e17] border-l border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base">Notifications</h3>
              <p className="text-[11px] text-slate-400">Updates on orders & studio news</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.read) && (
              <button
                id="sgm-notif-mark-all"
                onClick={markAllNotificationsRead}
                className="flex items-center gap-1 rounded bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/10 hover:text-emerald-400"
                title="Mark all as read"
              >
                <CheckCheck className="h-3 w-3" />
                <span>Mark read</span>
              </button>
            )}
            <button
              id="sgm-notif-close"
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center text-slate-400">
              <Bell className="h-10 w-10 text-slate-600 mb-2 stroke-[1.5]" />
              <p className="font-medium text-slate-300">No notifications yet</p>
              <p className="text-xs text-slate-500 mt-1">Order confirmations and studio updates will appear here.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.type === 'order') {
                    setIsNotificationDrawerOpen(false);
                    setActiveTab('orders');
                  } else if (notif.type === 'service') {
                    setIsNotificationDrawerOpen(false);
                    setActiveTab('services');
                  } else if (notif.type === 'promo') {
                    setIsNotificationDrawerOpen(false);
                    setActiveTab('shop');
                  }
                }}
                className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                  notif.read
                    ? 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                    : 'border-emerald-500/30 bg-emerald-500/[0.06] hover:bg-emerald-500/[0.1]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-slate-100">{notif.title}</h4>
                      {!notif.read && (
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                    <span className="mt-2 block text-[10px] text-slate-500">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
