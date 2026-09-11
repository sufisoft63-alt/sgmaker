import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { storeService } from '../../services/store';
import { X, Mail, Phone, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ContactModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useApp();

  const [name, setName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    storeService.saveContactMessage({
      name,
      email,
      phone,
      subject: subject || 'General Inquiry',
      message
    });

    setIsSent(true);
    showToast('Your message has been received! We will respond shortly.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md">
      <div
        className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c101a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            <h3 className="font-heading font-bold text-white text-base">Contact Studio Help</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4 text-xs">
          {/* Quick contact channels */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://wa.me/923015556677"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-slate-200 hover:bg-emerald-500/15"
            >
              <Phone className="h-4 w-4 text-emerald-400" />
              <div>
                <span className="font-bold block text-[11px]">WhatsApp Help</span>
                <span className="text-[10px] text-slate-400">+92 301 5556677</span>
              </div>
            </a>
            <a
              href="mailto:sufisoft63@gmail.com"
              className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 text-slate-200 hover:bg-cyan-500/15"
            >
              <Mail className="h-4 w-4 text-cyan-400" />
              <div>
                <span className="font-bold block text-[11px]">Official Email</span>
                <span className="text-[10px] text-slate-400 truncate max-w-[110px] block">
                  sufisoft63@gmail.com
                </span>
              </div>
            </a>
          </div>

          {isSent ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
              <h4 className="font-bold text-white text-sm">Message Transmitted</h4>
              <p className="text-slate-400 mt-1">Our support staff will get back to you via WhatsApp or Email.</p>
              <button
                onClick={onClose}
                className="mt-4 rounded-xl bg-emerald-500 px-5 py-2 font-bold text-black hover:bg-emerald-400"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Order Inquiry / Custom Studio Game"
                  className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Message</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="How can our gaming team help you today?"
                  className="w-full rounded-xl border border-white/10 bg-[#090b10] p-3 text-white"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 font-bold text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
