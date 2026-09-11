import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { X, Settings, User, Bell, Shield, Save } from 'lucide-react';

export const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useApp();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [allowNotifications, setAllowNotifications] = useState(true);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName,
      username,
      phone
    });
    showToast('Settings saved successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md">
      <div
        className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c101a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-emerald-400" />
            <h3 className="font-heading font-bold text-white text-base">Account Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="overflow-y-auto p-5 space-y-4 text-xs">
          <div>
            <label className="text-slate-300 block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-medium">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div>
              <span className="text-white font-medium block">Order Push Notifications</span>
              <span className="text-[10px] text-slate-500">
                Receive instant status updates when packages are dispatched
              </span>
            </div>
            <input
              type="checkbox"
              checked={allowNotifications}
              onChange={(e) => setAllowNotifications(e.target.checked)}
              className="h-4 w-4 accent-emerald-500 rounded"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 py-2.5 font-semibold text-slate-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2.5 font-bold text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
