'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function UserProfileModal({ isOpen, onClose, onOpenUpgrade }) {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'api' | 'usage' | 'preferences'
  const [copiedKey, setCopiedKey] = useState(false);
  const [userTier, setUserTier] = useState('FREE');
  const [apiKey, setApiKey] = useState('prcl_live_9f82a30b1c2d3e4f5a6b7c8d9e0f');

  // Form states
  const [name, setName] = useState('Shashwat');
  const [email, setEmail] = useState('shashwat@parclintel.io');
  const [role, setRole] = useState('Admin & Lead ML Engineer');
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    if (user || profile) {
      const defaultName = profile?.full_name || user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Shashwat';
      setName(defaultName);
      setEmail(user?.email || profile?.email || 'shashwat@parclintel.io');
      
      // Filter out Supabase system role ('authenticated')
      let userRole = profile?.role || user?.app_role || user?.role;
      if (!userRole || userRole === 'authenticated') {
        userRole = user?.email === 'shashwat@parclintel.io' ? 'Admin & Lead ML Engineer' : 'Real Estate ML Analyst';
      }
      setRole(userRole);
    }
    if (typeof window !== 'undefined') {
      const tier = localStorage.getItem('parcl_user_tier') || profile?.tier || user?.tier || 'FREE';
      setUserTier(tier);
    }
  }, [isOpen, user, profile]);

  if (!isOpen) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleGenerateNewKey = () => {
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setApiKey(`prcl_live_${randomHex}`);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" style={{ zIndex: 9999 }}>
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 text-white transform transition-all duration-300">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-surface2 via-surface1 to-transparent border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xl font-headline font-bold text-white shadow-glow-primary border-2 border-white/20">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-headline font-bold">{name}</h2>
                <span className={`px-2 py-0.5 rounded-full font-label text-[10px] uppercase font-bold tracking-wider border ${
                  userTier === 'PRO'
                    ? 'bg-primary/20 text-primary border-primary/40 shadow-glow-primary'
                    : 'bg-surface3 text-slate-400 border-white/10'
                }`}>
                  {userTier} Tier
                </span>
              </div>
              <p className="text-xs text-slate-400 font-label">{email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-surface1/60 px-6 gap-2">
          {[
            { id: 'profile', label: 'Account Profile', icon: 'badge' },
            { id: 'api', label: 'API Keys', icon: 'key' },
            { id: 'usage', label: 'Usage & Quotas', icon: 'bar_chart' },
            { id: 'preferences', label: 'Preferences', icon: 'tune' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 font-label text-xs uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'border-primary text-primary font-bold bg-primary/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label text-slate-400 uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface1 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label text-slate-400 uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-surface1/50 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Read-Only Admin Managed Role */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-label text-slate-400 uppercase">Role & Title</label>
                    <span className="text-[10px] font-label text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">lock</span>
                      Admin Managed
                    </span>
                  </div>
                  <div className="w-full bg-surface1/60 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-slate-300 flex items-center justify-between cursor-not-allowed">
                    <span className="font-medium">{role}</span>
                    <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary text-[10px] font-label uppercase font-bold">
                      Assigned
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-label text-slate-400 uppercase mb-2">Account Tier</label>
                  <div className="flex items-center justify-between bg-surface1 border border-white/10 rounded-lg px-3.5 py-2">
                    <span className="text-sm font-label uppercase text-slate-200">{userTier} Member</span>
                    {userTier === 'FREE' && (
                      <button
                        type="button"
                        onClick={() => { onClose(); onOpenUpgrade(); }}
                        className="text-xs font-label uppercase font-bold text-primary hover:text-blue-400"
                      >
                        Upgrade →
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger border border-danger/30 rounded-lg text-xs font-label uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Log Out Session
                </button>

                <div className="flex items-center gap-3">
                  {savedFeedback && (
                    <span className="text-xs font-label text-accent flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Saved
                    </span>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary hover:bg-blue-600 text-white font-headline font-bold rounded-lg text-xs uppercase tracking-wider shadow-glow-primary transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: API KEYS */}
          {activeTab === 'api' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-surface1/60 border border-white/10 rounded-xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-sm font-headline font-bold">Live Model Inference Key</h4>
                    <p className="text-xs text-slate-400">Use this token to make automated prediction calls to Parcl ML API.</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-accent/20 text-accent font-label text-[10px] font-bold uppercase tracking-wider">
                    Active
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="text"
                    readOnly
                    value={apiKey}
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 font-mono text-xs text-slate-300 select-all"
                  />
                  <button
                    onClick={handleCopyKey}
                    className="px-4 py-2 bg-surface2 hover:bg-surface3 text-white border border-white/10 rounded-lg text-xs font-label uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">{copiedKey ? 'done' : 'content_copy'}</span>
                    {copiedKey ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handleGenerateNewKey}
                  className="px-4 py-2 bg-surface2 hover:bg-surface3 text-slate-200 border border-white/10 rounded-lg text-xs font-label uppercase tracking-wider flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Rotate API Token
                </button>
                
                <span className="text-xs text-slate-500 font-label">Rate limit: 120 req/min</span>
              </div>
            </div>
          )}

          {/* TAB 3: USAGE */}
          {activeTab === 'usage' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-surface1/60 border border-white/10 rounded-xl p-4">
                  <div className="text-xs font-label text-slate-400 uppercase mb-1">Predictions Used</div>
                  <div className="text-2xl font-headline font-bold text-white">1,420</div>
                  <div className="text-[10px] text-slate-500 font-label mt-1">of 5,000 quota</div>
                </div>
                <div className="bg-surface1/60 border border-white/10 rounded-xl p-4">
                  <div className="text-xs font-label text-slate-400 uppercase mb-1">Avg Latency</div>
                  <div className="text-2xl font-headline font-bold text-accent">142 ms</div>
                  <div className="text-[10px] text-slate-500 font-label mt-1">ML Pipeline v2.4</div>
                </div>
                <div className="bg-surface1/60 border border-white/10 rounded-xl p-4">
                  <div className="text-xs font-label text-slate-400 uppercase mb-1">Accuracy Score</div>
                  <div className="text-2xl font-headline font-bold text-primary">0.89</div>
                  <div className="text-[10px] text-slate-500 font-label mt-1">Silhouette metric</div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-label text-slate-400 mb-2">
                  <span>Monthly Prediction Quota</span>
                  <span>28.4% Used</span>
                </div>
                <div className="w-full h-2.5 bg-surface3 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full w-[28.4%]" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between p-4 bg-surface1/60 border border-white/10 rounded-xl">
                <div>
                  <div className="text-sm font-headline font-bold">Dark Theme Accent</div>
                  <div className="text-xs text-slate-400">Futuristic Electric Blue palette</div>
                </div>
                <span className="px-3 py-1 bg-primary/20 border border-primary/40 text-primary font-label text-xs rounded-lg uppercase">
                  Enabled
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface1/60 border border-white/10 rounded-xl">
                <div>
                  <div className="text-sm font-headline font-bold">Automatic Prediction History</div>
                  <div className="text-xs text-slate-400">Store recent classifications in browser cache</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-surface3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-label">
          <span>Parcl Intel Engine v2.4.0</span>
          <span>Logged in as {email}</span>
        </div>

      </div>
    </div>
  );
}
