import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { storeService } from '../../services/store';
import { X, Send, Code, Sparkles, CheckCircle2 } from 'lucide-react';

const GAME_TYPES = [
  'Battle Royale',
  'First Person Shooter (FPS)',
  'Multiplayer Racing',
  'Arcade / Casual',
  '3D Action & Adventure',
  'RPG & Strategy',
  'Horror Survival',
  'Esports Tournament Game'
];

const PLATFORMS = ['Android Only', 'Android & iOS', 'PC / Steam', 'Cross-Platform (Mobile + PC)'];

const BUDGET_RANGES = [
  'Rs. 50,000 - 150,000 (Small prototype/mechanic)',
  'Rs. 150,000 - 300,000 (Core MVP with assets)',
  'Rs. 300,000 - 600,000 (Complete 3D Multiplayer)',
  'Rs. 600,000+ (Full-Scale Studio Production)'
];

export const ServiceRequestModal: React.FC = () => {
  const {
    serviceRequestModalOpen,
    setServiceRequestModalOpen,
    requestTargetService,
    showToast
  } = useApp();
  const { currentUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [gameType, setGameType] = useState(GAME_TYPES[0]);
  const [platform, setPlatform] = useState(PLATFORMS[1]);
  const [budget, setBudget] = useState(BUDGET_RANGES[1]);
  const [description, setDescription] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.fullName || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
    }
    if (requestTargetService) {
      setProjectTitle(`Custom Request: ${requestTargetService.title}`);
    } else {
      setProjectTitle('');
    }
    setSubmittedId(null);
  }, [currentUser, requestTargetService, serviceRequestModalOpen]);

  if (!serviceRequestModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !projectTitle.trim() || !description.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newReq = await storeService.createServiceRequest({
        userId: currentUser?.uid,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        projectTitle: projectTitle.trim(),
        gameType,
        platform,
        budget,
        description: description.trim(),
        referenceUrl: referenceUrl.trim() || undefined,
        serviceId: requestTargetService?.id,
        serviceTitle: requestTargetService?.title
      });

      setSubmittedId(newReq.id);
      showToast(`Request submitted successfully! Reference ID: ${newReq.id}`, 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 pt-6 sm:p-6 backdrop-blur-md">
      <div
        className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#0c101a] shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="sgm-service-modal-close"
          onClick={() => setServiceRequestModalOpen(false)}
          className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/60 p-2 text-slate-300 backdrop-blur-md hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto p-5 sm:p-7">
          {submittedId ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                Project Request Received!
              </h3>
              <p className="mt-2 text-xs text-slate-300 max-w-sm mx-auto">
                Thank you for consulting SG Maker Studio. Our lead game architect will review your technical requirements and contact you via WhatsApp / Phone.
              </p>
              <div className="mt-4 inline-block rounded-xl bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 font-mono text-xs font-bold text-cyan-300">
                Request ID: {submittedId}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setServiceRequestModalOpen(false)}
                  className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-black hover:bg-emerald-400"
                >
                  Back to App
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Modal Header */}
              <div className="mb-5">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-500/20 mb-1.5">
                  <Code className="h-3 w-3" />
                  SG Maker Studio Quote
                </div>
                <h3 className="font-heading text-xl font-bold text-white">
                  Request Game Development Services
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tell us about your game idea, mechanics, and timeline.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Your Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="sgm-req-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Hamza Malik"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Phone Number (WhatsApp) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="sgm-req-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="sgm-req-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@gmail.com"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Project Title */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Project / Game Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="sgm-req-title"
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Desi Cyberpunk 3D Battle Arena"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Game Type & Platform */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Genre / Category</label>
                    <select
                      id="sgm-req-type"
                      value={gameType}
                      onChange={(e) => setGameType(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                    >
                      {GAME_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-[#0e111a] text-white">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Target Platform</label>
                    <select
                      id="sgm-req-platform"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p} value={p} className="bg-[#0e111a] text-white">
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Estimated Budget (PKR)</label>
                  <select
                    id="sgm-req-budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#090b10] px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    {BUDGET_RANGES.map((b) => (
                      <option key={b} value={b} className="bg-[#0e111a] text-white">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Scope / Description */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Project Requirements & Mechanics <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="sgm-req-desc"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detail your core gameplay loops, multiplayer needs, custom skins, art style (low poly, stylized, hyper-realistic), and existing assets if any..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Reference Link */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Reference Game URL / Design Doc / Drive Link (Optional)
                  </label>
                  <input
                    id="sgm-req-ref"
                    type="url"
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    placeholder="https://drive.google.com/... or game store link"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    id="sgm-req-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-xs font-bold text-black transition-all hover:bg-cyan-300 active:scale-95 disabled:opacity-60 shadow-lg shadow-cyan-500/25"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Studio Project Request'}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
