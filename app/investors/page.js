'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { fetchLiveBuyerMetrics } from '../../lib/dataService';

export default function InvestorsPage() {
  const [metrics, setMetrics] = useState({
    totalBuyers: 16,
    formattedTotalBuyers: '16',
    c1Count: 5,
    c1Pct: 31,
    c2Count: 4,
    c2Pct: 25,
    c3Count: 3,
    c3Pct: 19,
    c4Count: 4,
    c4Pct: 25,
    avgSatScore: '8.9',
    cashPct: 75,
    isLive: true,
  });

  useEffect(() => {
    fetchLiveBuyerMetrics().then((liveData) => {
      if (liveData) {
        setMetrics(liveData);
      }
    });
  }, []);

  return (
    <DashboardLayout
      title="Investor Behavior"
      subtitle="Investment patterns and financing behavior across buyer clusters"
    >
      <div className="p-2 sm:p-4 space-y-6 max-w-[1600px] w-full mx-auto">
        
        {/* Page Header */}
        <div className="flex justify-between items-center bg-surface1 border border-white/10 rounded-xl px-5 py-3">
          <div>
            <h2 className="font-headline text-2xl font-bold tracking-tight text-white mb-1">
              Investor Behavior Analysis
            </h2>
            <p className="font-body text-slate-400 text-xs">
              Live capital distribution & transaction patterns synced from Supabase
            </p>
          </div>
          <span className="px-3 py-1 bg-accent/20 border border-accent/40 text-accent font-label text-xs font-bold rounded-full">
            {metrics.formattedTotalBuyers} Total Buyers
          </span>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* KPI 1 */}
          <div className="glass-card rounded-xl p-5 relative overflow-hidden group parcl-animate-card border border-white/10 bg-surface2">
            <div className="flex justify-between items-start mb-4">
              <span className="font-headline text-xs text-slate-400 uppercase tracking-wider">Total Database Buyers</span>
              <span className="material-symbols-outlined text-primary text-base">payments</span>
            </div>
            <div className="font-headline text-3xl font-bold text-white mb-1">
              {metrics.formattedTotalBuyers}
            </div>
            <div className="text-xs text-accent font-label flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
              Live Synced
            </div>
          </div>

          {/* KPI 2 */}
          <div className="glass-card rounded-xl p-5 relative overflow-hidden group parcl-animate-card border border-white/10 bg-surface2">
            <div className="flex justify-between items-start mb-4">
              <span className="font-headline text-xs text-slate-400 uppercase tracking-wider">Cash vs Mortgage Ratio</span>
              <span className="material-symbols-outlined text-secondary text-base">account_balance</span>
            </div>
            <div className="font-headline text-3xl font-bold text-white mb-1">
              {metrics.cashPct}% Cash
            </div>
            <div className="text-xs text-slate-400 font-label">
              {100 - metrics.cashPct}% Financing Needed
            </div>
          </div>

          {/* KPI 3 */}
          <div className="glass-card rounded-xl p-5 relative overflow-hidden group parcl-animate-card border border-white/10 bg-surface2">
            <div className="flex justify-between items-start mb-4">
              <span className="font-headline text-xs text-slate-400 uppercase tracking-wider">Avg Satisfaction</span>
              <span className="material-symbols-outlined text-accent text-base">verified</span>
            </div>
            <div className="font-headline text-3xl font-bold text-white mb-1">
              {metrics.avgSatScore} / 10
            </div>
            <div className="text-xs text-accent font-label">
              Overall Score Mean
            </div>
          </div>

          {/* KPI 4 */}
          <div className="glass-card rounded-xl p-5 relative overflow-hidden group parcl-animate-card border border-white/10 bg-surface2">
            <div className="flex justify-between items-start mb-4">
              <span className="font-headline text-xs text-slate-400 uppercase tracking-wider">Corporate Share</span>
              <span className="material-symbols-outlined text-warning text-base">business</span>
            </div>
            <div className="font-headline text-3xl font-bold text-white mb-1">
              {metrics.c3Pct}% ({metrics.c3Count})
            </div>
            <div className="text-xs text-slate-400 font-label">
              Institutional Segment C3
            </div>
          </div>

        </div>

        {/* Detailed Cluster Profiles */}
        <div className="glass-card rounded-xl p-6 border border-white/10 bg-surface2 space-y-4">
          <h3 className="font-headline text-sm text-slate-300 uppercase tracking-wider">
            Live Segment Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface1 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-c1">
                <span>C1: Global Investors</span>
                <span>{metrics.c1Count} Buyers</span>
              </div>
              <div className="text-2xl font-bold text-white">{metrics.c1Pct}%</div>
              <p className="text-slate-400 text-xs">High liquidity, multi-unit urban core focus.</p>
            </div>

            <div className="p-4 rounded-xl bg-surface1 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-c2">
                <span>C2: First-Time Buyers</span>
                <span>{metrics.c2Count} Buyers</span>
              </div>
              <div className="text-2xl font-bold text-white">{metrics.c2Pct}%</div>
              <p className="text-slate-400 text-xs">Personal use, mortgage application required.</p>
            </div>

            <div className="p-4 rounded-xl bg-surface1 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-c3">
                <span>C3: Corporate Buyers</span>
                <span>{metrics.c3Count} Buyers</span>
              </div>
              <div className="text-2xl font-bold text-white">{metrics.c3Pct}%</div>
              <p className="text-slate-400 text-xs">Corporate entity acquisition, direct channel.</p>
            </div>

            <div className="p-4 rounded-xl bg-surface1 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-c4">
                <span>C4: Luxury Investors</span>
                <span>{metrics.c4Count} Buyers</span>
              </div>
              <div className="text-2xl font-bold text-white">{metrics.c4Pct}%</div>
              <p className="text-slate-400 text-xs">High satisfaction scores, luxury premium hubs.</p>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
