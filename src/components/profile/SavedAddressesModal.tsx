import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Address } from '../../types';
import { X, MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const SavedAddressesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { addresses, addAddress, deleteAddress, setDefaultAddress, deliveryAreas } = useApp();
  const { currentUser } = useAuth();

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState('Lahore');
  const [area, setArea] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [type, setType] = useState<'Home' | 'Office' | 'Other'>('Home');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${house}, ${street}, ${area}, ${city}`;
    addAddress({
      userId: currentUser?.uid || 'usr-anon',
      name,
      phone,
      type,
      city,
      province: 'Punjab',
      area,
      street,
      houseNumber: house,
      fullAddress,
      isDefault: addresses.length === 0
    });
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md">
      <div
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c101a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <h3 className="font-heading font-bold text-white text-base">Saved Addresses</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4 text-xs">
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 py-3 font-bold text-emerald-400 hover:bg-emerald-500/10"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Address</span>
            </button>
          )}

          {showAddForm ? (
            <form onSubmit={handleSave} className="space-y-3 rounded-xl border border-white/10 p-4 bg-white/[0.02]">
              <h4 className="font-bold text-white">New Delivery Location</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-white/10 bg-[#090b10] px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full rounded-lg border border-white/10 bg-[#090b10] px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#090b10] px-2.5 py-1.5 text-white"
                  >
                    {deliveryAreas.map((a) => (
                      <option key={a.id} value={a.city}>
                        {a.city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Area</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Gulberg, F-8, Clifton"
                    required
                    className="w-full rounded-lg border border-white/10 bg-[#090b10] px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">House / Flat #</label>
                  <input
                    type="text"
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    placeholder="House 12"
                    required
                    className="w-full rounded-lg border border-white/10 bg-[#090b10] px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Street</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Street 4"
                    required
                    className="w-full rounded-lg border border-white/10 bg-[#090b10] px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 rounded-lg border border-white/10 py-1.5 font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-emerald-500 py-1.5 font-bold text-black hover:bg-emerald-400"
                >
                  Save Address
                </button>
              </div>
            </form>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className="flex items-start justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3.5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{addr.name}</span>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-slate-300">
                      {addr.type}
                    </span>
                    {addr.isDefault && (
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-slate-300 text-[11px]">{addr.fullAddress}</p>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                    {addr.phone}
                  </span>

                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="mt-2 text-[10px] font-bold text-emerald-400 hover:underline"
                    >
                      Set as Default
                    </button>
                  )}
                </div>

                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
