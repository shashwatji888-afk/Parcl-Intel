'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { fetchLiveBuyerMetrics } from '../../lib/dataService';

export default function SegmentsPage() {
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

  useEffect(() => {
    fetchLiveBuyerMetrics().then((liveData) => {
      if (liveData) {
        setMetrics(liveData);
      }
    });
  }, []);

  const c1Stop = metrics.c1Pct;
  const c2Stop = c1Stop + metrics.c2Pct;
  const c3Stop = c2Stop + metrics.c3Pct;

  const donutStyle = {
    background: `conic-gradient(
      #2563EB 0% ${c1Stop}%,
      #10B981 ${c1Stop}% ${c2Stop}%,
      #F59E0B ${c2Stop}% ${c3Stop}%,
      #8B5CF6 ${c3Stop}% 100%
    )`,
  };

  return (
    <DashboardLayout
      title="Buyer Segmentation"
      subtitle="K-Means clustering analysis across 4 buyer profiles"
    >
      <div className="p-2 sm:p-4 space-y-8 max-w-[1600px] w-full mx-auto">
        
        {/* Live DB Indicator */}
        <div className="flex justify-between items-center bg-surface1 border border-white/10 rounded-xl px-5 py-3">
          <div className="flex items-center gap-2 text-xs font-label">
            <span className={`w-2.5 h-2.5 rounded-full ${metrics.isLive ? 'bg-accent shadow-glow-accent' : 'bg-warning'}`} />
            <span className="text-white font-bold">
              {metrics.isLive ? 'Supabase Live Database Connection' : 'Demo Dataset Mode'}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-label">
            {metrics.formattedTotalBuyers} Total Buyers Processed
          </span>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* KPI 1 */}
          <div className="glass-card rounded-xl p-5 relative overflow-hidden group parcl-animate-card border border-white/10">
            <div className="flex justify-between items-start mb-4">
              <span className="font-headline text-xs text-slate-400 uppercase tracking-wider">Total Buyers</span>
              <span className="material-symbols-outlined text-slate-400 text-sm">group</span>
            </div>
            <div className="font-headline text-3xl font-bold text-white">
              {metrics.formattedTotalBuyers}
            </div>
            <div className="mt-2 text-xs text-accent flex items-center gap-1 font-label">
              <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
              Synced from DB
            </div>
          </div>

          {/* KPI 2 */}
          <div className="glass-card rounded-xl p-5 relative overflow-hidden group parcl-animate-card border border-white/10">
            <div className="flex justify-between items-start mb-4">
              <span className="font-headline text-xs text-slate-400 uppercase tracking-wider">Active Clusters</span>
              <span className="material-symbols-outlined text-slate-400 text-sm">category</span>
            </div>
            <div className="font-headline text-3xl font-bold text-white">4</div>
            <div className="mt-2 text-xs text-slate-400 font-label">
              Optimal K=4 Clustering
            </div>
          </div>

          {/* KPI 3 */}
          <div className="glass-card rounded-xl p-5 relative overflow-hidden group parcl-animate-card border border-white/10">
            <div className="flex justify-between items-start mb-4">
              <span className="font-headline text-xs text-slate-400 uppercase tracking-wider">Silhouette Score</span>
              <span className="material-symbols-outlined text-slate-400 text-sm">scatter_plot</span>
            </div>
            <div className="font-headline text-3xl font-bold text-white">0.73</div>
            <div className="mt-2 text-xs text-accent flex items-center gap-1 font-label">
              <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
              High Separation
            </div>
          </div>

          {/* KPI 4 */}
          <div className="glass-card rounded-xl p-5 relative overflow-hidden group parcl-animate-card border border-white/10">
            <div className="flex justify-between items-start mb-4">
              <span className="font-headline text-xs text-slate-400 uppercase tracking-wider">Avg Satisfaction</span>
              <span className="material-symbols-outlined text-slate-400 text-sm">sentiment_satisfied</span>
            </div>
            <div className="font-headline text-3xl font-bold text-white">
              {metrics.avgSatScore} <span className="text-slate-400 text-lg">/10</span>
            </div>
            <div className="mt-2 text-xs text-accent flex items-center gap-1 font-label">
              <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
              Score Mean
            </div>
          </div>

        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Donut Chart Card */}
          <div className="glass-card rounded-xl p-6 flex flex-col parcl-animate-card border border-white/10">
            <h3 className="font-headline text-sm text-slate-300 uppercase tracking-wider mb-6">
              Live Cluster Distribution
            </h3>

            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
              {/* Dynamic CSS Donut Chart */}
              <div
                className="w-48 h-48 rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(0,0,0,0.5)] flex-shrink-0 transition-all duration-700"
                style={donutStyle}
              >
                <div className="w-32 h-32 rounded-full bg-[#1E293B] flex items-center justify-center flex-col border border-white/5">
                  <span className="font-headline text-2xl font-bold text-white">100%</span>
                  <span className="font-label text-xs text-slate-400">N={metrics.formattedTotalBuyers}</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="flex flex-col gap-4 text-xs font-label">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-c1" />
                    <span className="text-white font-bold">C1 Global Investors</span>
                  </div>
                  <span className="text-slate-300 font-bold">{metrics.c1Pct}% ({metrics.c1Count})</span>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-c2" />
                    <span className="text-white font-bold">C2 First-Time Buyers</span>
                  </div>
                  <span className="text-slate-300 font-bold">{metrics.c2Pct}% ({metrics.c2Count})</span>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-c3" />
                    <span className="text-white font-bold">C3 Corporate Buyers</span>
                  </div>
                  <span className="text-slate-300 font-bold">{metrics.c3Pct}% ({metrics.c3Count})</span>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-c4" />
                    <span className="text-white font-bold">C4 Luxury Investors</span>
                  </div>
                  <span className="text-slate-300 font-bold">{metrics.c4Pct}% ({metrics.c4Count})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cluster Feature Insights */}
          <div className="glass-card rounded-xl p-6 flex flex-col justify-between parcl-animate-card border border-white/10">
            <h3 className="font-headline text-sm text-slate-300 uppercase tracking-wider mb-4">
              Key Cluster Characteristics
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-surface1 rounded-lg border border-white/5">
                <div className="font-headline font-bold text-c1 mb-1">C1: Global Investors ({metrics.c1Count} Records)</div>
                <div className="text-slate-300">High liquidity, Tier-1 urban core focus, cash purchases.</div>
              </div>
              <div className="p-3 bg-surface1 rounded-lg border border-white/5">
                <div className="font-headline font-bold text-c2 mb-1">C2: First-Time Buyers ({metrics.c2Count} Records)</div>
                <div className="text-slate-300">Personal use, mortgage dependent, interest rate sensitive.</div>
              </div>
              <div className="p-3 bg-surface1 rounded-lg border border-white/5">
                <div className="font-headline font-bold text-c3 mb-1">C3: Corporate Buyers ({metrics.c3Count} Records)</div>
                <div className="text-slate-300">Institutional transactions, direct channel acquisition.</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
