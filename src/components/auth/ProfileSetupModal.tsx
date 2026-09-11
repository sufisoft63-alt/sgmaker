import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserCheck, Sparkles, Camera } from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
];

export const ProfileSetupModal: React.FC = () => {
  const { currentUser, needsProfileSetup, completeProfileSetup } = useAuth();
  const { showToast } = useApp();

  const [username, setUsername] = useState(currentUser?.username || '');
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [profilePhoto, setProfilePhoto] = useState(currentUser?.profilePhoto || PRESET_AVATARS[0]);
  const [error, setError] = useState<string | null>(null);

  if (!needsProfileSetup) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) {
      setError('Please choose a username.');
      return;
    }
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    await completeProfileSetup({
      username,
      fullName,
      profilePhoto
    });
    showToast('Profile setup complete! Welcome to SG Maker.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#0d101a] p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/30">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0d101a]">
              <Sparkles className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <h2 className="font-heading text-2xl font-bold text-white tracking-wide">
            Welcome to SG <span className="text-emerald-400">MAKER</span>!
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Complete your gaming profile to personalize your experience
          </p>
          <div className="mt-2 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-mono font-semibold text-emerald-400 border border-emerald-500/20">
            ID: {currentUser?.userId || 'SGM-ASSIGNED'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Selector */}
          <div>
            <label className="mb-2 block text-center text-xs font-semibold text-slate-300">
              Select Avatar
            </label>
            <div className="flex items-center justify-center gap-2.5">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setProfilePhoto(url)}
                  className={`relative h-11 w-11 overflow-hidden rounded-xl border-2 transition-transform hover:scale-105 ${
                    profilePhoto === url
                      ? 'border-emerald-400 shadow-md shadow-emerald-500/40'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Avatar ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Gamer Username</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-emerald-400">@</span>
              <input
                id="sgm-setup-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                placeholder="shadow_sniper"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-7 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Full Name</label>
            <input
              id="sgm-setup-fullname"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Usman Tariq"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          {error && <p className="text-center text-[11px] text-rose-400">{error}</p>}

          <button
            id="sgm-setup-submit"
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-black transition-all hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/25"
          >
            <UserCheck className="h-4 w-4" />
            <span>Complete Setup & Enter Studio</span>
          </button>
        </form>
      </div>
    </div>
  );
};
