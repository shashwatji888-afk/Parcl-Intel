'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { fetchLiveBuyerMetrics } from '../../lib/dataService';

export default function OverviewPage() {
  const { user, profile } = useAuth();
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
    isLive: true,
  });

  const userName = profile?.full_name || user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Analyst';

  useEffect(() => {
    const dateElement = document.getElementById('current-datetime');
    if (dateElement) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }

    fetchLiveBuyerMetrics().then((liveData) => {
      if (liveData) {
        setMetrics(liveData);
      }
    });
  }, []);

  return (
    <DashboardLayout
      title="Overview"
      subtitle="Real-time buyer intelligence · Last pipeline run: 2 hours ago"
    >
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 parcl-page-header">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white tracking-tight mb-2">
            Welcome back, <span className="text-primary">{userName}</span>
          </h1>
          <p className="text-slate-400 font-label text-sm" id="current-datetime">
            Loading date...
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface2 border border-white/10 text-xs font-label text-slate-300">
          <span className="material-symbols-outlined text-[14px] text-slate-400">schedule</span>
          Last pipeline run: 2 hours ago
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* KPI 1 */}
        <div className="glass-panel p-5 rounded-xl transition-all duration-200 group parcl-animate-card border border-white/10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-label text-xs uppercase tracking-wider">Total Buyers Analyzed</h3>
            <div className="p-1.5 rounded bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-headline font-bold text-white tracking-tight">{metrics.formattedTotalBuyers}</span>
            <div className="flex items-center text-accent text-xs font-label">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              Live DB
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel p-5 rounded-xl transition-all duration-200 group parcl-animate-card border border-white/10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-label text-xs uppercase tracking-wider">Active Clusters</h3>
            <div className="p-1.5 rounded bg-secondary/10 text-secondary group-hover:bg-secondary/20 transition-colors">
              <span className="material-symbols-outlined text-[18px]">bubble_chart</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-headline font-bold text-white tracking-tight">4</span>
            <div className="text-slate-500 text-xs font-label">Optimal (K=4)</div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel p-5 rounded-xl transition-all duration-200 group parcl-animate-card border border-white/10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-label text-xs uppercase tracking-wider">Primary Market</h3>
            <div className="p-1.5 rounded bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
              <span className="material-symbols-outlined text-[18px]">location_city</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-headline font-bold text-white tracking-tight">Tier-1 Core</span>
            <div className="text-slate-500 text-xs font-label">64% volume</div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel p-5 rounded-xl transition-all duration-200 group parcl-animate-card border border-white/10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-label text-xs uppercase tracking-wider">Satisfaction Mean</h3>
            <div className="p-1.5 rounded bg-warning/10 text-warning group-hover:bg-warning/20 transition-colors">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-headline font-bold text-white tracking-tight">{metrics.avgSatScore}</span>
            <div className="flex items-center text-accent text-xs font-label">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              Mean Score
            </div>
          </div>
        </div>

      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Cluster Distribution Bars */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl flex flex-col justify-between parcl-animate-card border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-headline font-semibold text-white">Buyer Segment Distribution</h2>
              <p className="text-slate-400 text-xs font-label">Proportion of live buyer database by assigned ML cluster</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-surface3 rounded text-xs font-label text-slate-300">k-means++</span>
            </div>
          </div>

          {/* Visual Cluster Bars */}
          <div className="space-y-5 my-auto">
            
            {/* C1 */}
            <div>
              <div className="flex justify-between text-xs font-label mb-1">
                <span className="text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-c1" /> C1: Global Investors
                </span>
                <span className="text-slate-400">{metrics.c1Count} ({metrics.c1Pct}%)</span>
              </div>
              <div className="w-full bg-surface3 rounded-full h-3 overflow-hidden">
                <div className="bg-c1 h-full rounded-full transition-all duration-1000" style={{ width: `${metrics.c1Pct}%` }} />
              </div>
            </div>

            {/* C2 */}
            <div>
              <div className="flex justify-between text-xs font-label mb-1">
                <span className="text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-c2" /> C2: First-Time Buyers
                </span>
                <span className="text-slate-400">{metrics.c2Count} ({metrics.c2Pct}%)</span>
              </div>
              <div className="w-full bg-surface3 rounded-full h-3 overflow-hidden">
                <div className="bg-c2 h-full rounded-full transition-all duration-1000" style={{ width: `${metrics.c2Pct}%` }} />
              </div>
            </div>

            {/* C3 */}
            <div>
              <div className="flex justify-between text-xs font-label mb-1">
                <span className="text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-c3" /> C3: Corporate Buyers
                </span>
                <span className="text-slate-400">{metrics.c3Count} ({metrics.c3Pct}%)</span>
              </div>
              <div className="w-full bg-surface3 rounded-full h-3 overflow-hidden">
                <div className="bg-c3 h-full rounded-full transition-all duration-1000" style={{ width: `${metrics.c3Pct}%` }} />
              </div>
            </div>

            {/* C4 */}
            <div>
              <div className="flex justify-between text-xs font-label mb-1">
                <span className="text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-c4" /> C4: Luxury Investors
                </span>
                <span className="text-slate-400">{metrics.c4Count} ({metrics.c4Pct}%)</span>
              </div>
              <div className="w-full bg-surface3 rounded-full h-3 overflow-hidden">
                <div className="bg-c4 h-full rounded-full transition-all duration-1000" style={{ width: `${metrics.c4Pct}%` }} />
              </div>
            </div>

          </div>

          {/* Breakdown Footer */}
          <div className="pt-6 mt-6 border-t border-white/5 grid grid-cols-4 gap-2 text-center">
            <div>
              <span className="block text-slate-400 text-[10px] font-label uppercase">Total Records</span>
              <span className="text-c1 font-bold text-sm font-label">{metrics.formattedTotalBuyers}</span>
            </div>
            <div>
              <span className="block text-slate-400 text-[10px] font-label uppercase">Highest Yield</span>
              <span className="text-c4 font-bold text-sm font-label">C4 (Luxury)</span>
            </div>
            <div>
              <span className="block text-slate-400 text-[10px] font-label uppercase">Global Investor</span>
              <span className="text-c1 font-bold text-sm font-label">{metrics.c1Pct}%</span>
            </div>
            <div>
              <span className="block text-slate-400 text-[10px] font-label uppercase">Cash Ratio</span>
              <span className="text-c2 font-bold text-sm font-label">75%</span>
            </div>
          </div>
        </div>

        {/* Intelligence Insights Column */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between parcl-animate-card border border-white/10">
          <div>
            <h2 className="text-lg font-headline font-semibold text-white mb-1">Key Cluster Traits</h2>
            <p className="text-slate-400 text-xs font-label mb-6">AI-generated behavioral highlights from live DB</p>
            
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-surface1/60 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-c1" />
                  <span className="text-xs font-bold text-white font-headline">C1: {metrics.c1Count} Records ({metrics.c1Pct}%)</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  High cash transactions. Focus on high-yield urban commercial & luxury apartments.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface1/60 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-c2" />
                  <span className="text-xs font-bold text-white font-headline">C2: {metrics.c2Count} Records ({metrics.c2Pct}%)</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Mortgage financing dependent. Sensitive to interest rate fluctuations.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface1/60 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-c4" />
                  <span className="text-xs font-bold text-white font-headline">C4: {metrics.c4Count} Records ({metrics.c4Pct}%)</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Cross-border acquisitions. Primary markets include UAE, UK, and US Tier-1 hubs.
                </p>
              </div>
            </div>
          </div>

          <a href="/insights" className="mt-6 w-full py-2 bg-surface3 hover:bg-white/10 text-white font-label text-xs uppercase tracking-wider rounded text-center transition-colors block no-underline">
            View Full Analysis →
          </a>
        </div>

      </div>
    </DashboardLayout>
  );
}
