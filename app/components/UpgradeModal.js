'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function UpgradeModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' | 'yearly'
  const [selectedPlan, setSelectedPlan] = useState('pro'); // 'free' | 'pro' | 'enterprise'
  const [paymentState, setPaymentState] = useState('idle'); // 'idle' | 'processing' | 'success' | 'error'
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');

  useEffect(() => {
    // Reset state on open
    if (isOpen) {
      setPaymentState('idle');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = (e) => {
    if (e) e.preventDefault();
    if (paymentState === 'processing') return;

    setPaymentState('processing');

    // Simulate payment processing timeline
    setTimeout(() => {
      setPaymentState('success');
      if (typeof window !== 'undefined') {
        localStorage.setItem('parcl_user_tier', 'PRO');
        window.dispatchEvent(new Event('parcl_user_updated'));
      }
      if (user) {
        user.tier = 'PRO';
      }
      setTimeout(() => {
        onClose();
        setPaymentState('idle');
      }, 1500);
    }, 1200);
  };

  const proPrice = billingCycle === 'yearly' ? '$39' : '$49';
  const enterprisePrice = billingCycle === 'yearly' ? '$159' : '$199';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" style={{ zIndex: 9999 }}>
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 text-white transform transition-all duration-300 scale-100">
        
        {/* Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-primary/20 via-secondary/20 to-transparent border-b border-white/10 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <span className="material-symbols-outlined text-2xl">workspace_premium</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-headline font-bold">Upgrade to Parcl Pro</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accent font-label text-[10px] uppercase font-bold tracking-wider">
                  Unlock Full Intelligence
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Access advanced K-Means clustering, unlimited buyer profile predictions, and API access.
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-8">
          
          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-8 bg-surface3 rounded-full p-1 border border-white/10 transition-colors cursor-pointer"
            >
              <div className={`w-6 h-6 rounded-full bg-primary shadow-glow-primary transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
                Annual Billing
              </span>
              <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-label font-bold uppercase tracking-wider border border-accent/30">
                Save 20%
              </span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Free Tier */}
            <div
              onClick={() => setSelectedPlan('free')}
              className={`rounded-xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                selectedPlan === 'free'
                  ? 'bg-surface2 border-white/30 shadow-lg'
                  : 'bg-surface1/60 border-white/5 hover:border-white/20'
              }`}
            >
              <div>
                <div className="text-xs font-label text-slate-400 uppercase tracking-widest mb-2">Starter</div>
                <h3 className="text-xl font-headline font-bold mb-1">Free Tier</h3>
                <div className="text-2xl font-headline font-bold text-slate-300 mb-4">$0 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-sm">check</span>
                    Up to 50 Predictions / mo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-sm">check</span>
                    Standard Cluster Overview
                  </li>
                  <li className="flex items-center gap-2 text-slate-500">
                    <span className="material-symbols-outlined text-sm">close</span>
                    Batch CSV Processing
                  </li>
                  <li className="flex items-center gap-2 text-slate-500">
                    <span className="material-symbols-outlined text-sm">close</span>
                    API Access Token
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-slate-400 font-label">
                Current Plan
              </div>
            </div>

            {/* Pro Tier (Featured) */}
            <div
              onClick={() => setSelectedPlan('pro')}
              className={`relative rounded-xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                selectedPlan === 'pro'
                  ? 'bg-gradient-to-b from-primary/20 via-surface2 to-surface2 border-primary shadow-[0_0_30px_rgba(37,99,235,0.3)]'
                  : 'bg-surface2/80 border-primary/40 hover:border-primary'
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-white font-label text-[10px] uppercase font-bold tracking-wider rounded-full shadow-glow-primary">
                Most Popular
              </div>

              <div>
                <div className="text-xs font-label text-primary uppercase tracking-widest mb-2 font-bold">Professional</div>
                <h3 className="text-xl font-headline font-bold mb-1">Parcl Pro</h3>
                <div className="text-3xl font-headline font-bold text-white mb-4">
                  {proPrice} <span className="text-xs text-slate-400 font-normal">/ mo billed {billingCycle}</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-sm">check_circle</span>
                    <strong>Unlimited</strong> Buyer Predictions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-sm">check_circle</span>
                    Full K-Means 4-Cluster Deep Dive
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-sm">check_circle</span>
                    Batch CSV Upload (Up to 10k rows)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-sm">check_circle</span>
                    PDF & High-Res PNG Report Export
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-sm">check_circle</span>
                    Live API Access Key
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={paymentState === 'processing'}
                  className={`w-full py-2.5 rounded-lg font-headline font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    selectedPlan === 'pro'
                      ? 'bg-primary hover:bg-blue-600 text-white shadow-glow-primary'
                      : 'bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30'
                  }`}
                >
                  {paymentState === 'processing' ? 'Activating Pro...' : 'Select & Activate Pro'}
                </button>
              </div>
            </div>

            {/* Enterprise Tier */}
            <div
              onClick={() => setSelectedPlan('enterprise')}
              className={`rounded-xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                selectedPlan === 'enterprise'
                  ? 'bg-surface2 border-secondary shadow-[0_0_25px_rgba(139,92,246,0.3)]'
                  : 'bg-surface1/60 border-white/5 hover:border-white/20'
              }`}
            >
              <div>
                <div className="text-xs font-label text-secondary uppercase tracking-widest mb-2 font-bold">Enterprise</div>
                <h3 className="text-xl font-headline font-bold mb-1">Custom Engine</h3>
                <div className="text-2xl font-headline font-bold text-white mb-4">
                  {enterprisePrice} <span className="text-xs text-slate-400 font-normal">/ mo</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                    Custom Trained ML Models
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                    Real-time Data Pipeline Connectors
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                    Dedicated SLA & Support Engineer
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                    Unlimited Team Seats
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-2.5 rounded-lg font-headline font-bold text-xs uppercase tracking-wider bg-secondary/20 text-secondary border border-secondary/40 hover:bg-secondary/30 transition-all cursor-pointer"
                >
                  Select Enterprise
                </button>
              </div>
            </div>

          </div>

          {/* Checkout Form Simulation */}
          {selectedPlan !== 'free' && (
            <div className="bg-surface2/60 border border-white/10 rounded-xl p-6 animate-fadeIn">
              <h4 className="text-sm font-headline font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">credit_card</span>
                Payment Information ({selectedPlan === 'pro' ? 'Pro Plan' : 'Enterprise Plan'})
              </h4>

              {paymentState === 'success' ? (
                <div className="py-8 text-center space-y-3 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent text-accent mx-auto flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <h3 className="text-xl font-headline font-bold text-white">Upgrade Complete!</h3>
                  <p className="text-sm text-slate-300">Your Parcl Pro license is active. Enjoy unlimited ML predictions.</p>
                </div>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-label text-slate-400 uppercase mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="4242 •••• •••• 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-surface1 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-label text-slate-400 uppercase mb-1">Expires</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full bg-surface1 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-label text-slate-400 uppercase mb-1">CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full bg-surface1 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-accent text-sm">lock</span>
                      256-Bit SSL Encrypted Checkout
                    </div>
                    <button
                      type="submit"
                      disabled={paymentState === 'processing'}
                      className="px-6 py-2.5 bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-headline font-bold rounded-lg shadow-glow-primary transition-all flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                    >
                      {paymentState === 'processing' ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">bolt</span>
                          Confirm & Activate ({selectedPlan === 'pro' ? proPrice : enterprisePrice})
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-black/40 border-t border-white/5 text-center text-xs text-slate-500 font-label">
          Questions? Contact dedicated support at support@parclintel.io
        </div>

      </div>
    </div>
  );
}
