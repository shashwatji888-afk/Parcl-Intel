'use client';
import { useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

export default function InsightsPage() {
  useEffect(() => {
    
  }, []);

  return (
    <DashboardLayout
      title="Segment Insights"
      subtitle="Descriptive statistics and deep analytics per buyer cluster"
    >
      <div dangerouslySetInnerHTML={{ __html: `<style>

        body { background-color: #0A0F1E; color: #F8FAFC; }
        .glass-card { background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.06); backdrop-filter: blur(12px); transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .glass-card:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(37, 99, 235, 0.15); }
        .input-glass { background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); color: #F8FAFC; transition: all 0.2s; }
        .input-glass:focus { outline: none; border-color: #2563EB; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2); }
        .chart-bar-blue { background: linear-gradient(180deg, #2563EB 0%, rgba(37, 99, 235, 0.1) 100%); }
        .chart-bar-emerald { background: linear-gradient(180deg, #10B981 0%, rgba(16, 185, 129, 0.1) 100%); }
    
</style>
` }} />
      <div dangerouslySetInnerHTML={{ __html: `
<div class="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
<!-- TopNavBar -->

<div class="p-8 pb-24 max-w-7xl mx-auto space-y-8 relative z-10">
<!-- Header section -->
<div>
<h2 class="font-headline text-3xl font-bold text-white tracking-tight">Segment Insights Panel</h2>
<p class="font-body text-textSecondary mt-2">Descriptive statistics and deep analytics per buyer cluster.</p>
</div>
<!-- Filters -->
<div class="glass-card rounded-xl p-4 flex flex-wrap gap-4 items-center">
<span class="material-symbols-outlined text-textMuted ml-2">filter_list</span>
<select class="input-glass rounded-lg px-4 py-2 text-sm font-body focus:ring-0 min-w-[140px] appearance-none">
<option value="">All Countries</option>
<option value="us">United States</option>
<option value="uk">United Kingdom</option>
</select>
<select class="input-glass rounded-lg px-4 py-2 text-sm font-body focus:ring-0 min-w-[140px] appearance-none">
<option value="">All Regions</option>
<option value="na">North America</option>
<option value="eu">Europe</option>
</select>
<select class="input-glass rounded-lg px-4 py-2 text-sm font-body focus:ring-0 min-w-[160px] appearance-none">
<option value="">Acquisition Purpose</option>
<option value="inv">Investment</option>
<option value="res">Residential</option>
</select>
<select class="input-glass rounded-lg px-4 py-2 text-sm font-body focus:ring-0 min-w-[140px] appearance-none">
<option value="">Client Type</option>
<option value="ind">Individual</option>
<option value="corp">Corporate</option>
</select>
</div>
<!-- Tabs -->
<div class="flex space-x-2 border-b border-white/10 pb-px">
<button class="px-6 py-3 border-b-2 border-primary text-primary font-headline font-semibold text-sm flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#2563EB]"></span>
                    C1 Global
                </button>
<button class="px-6 py-3 border-b-2 border-transparent text-textMuted hover:text-textSecondary font-headline font-semibold text-sm flex items-center gap-2 transition-colors">
<span class="w-2 h-2 rounded-full bg-accent"></span>
                    C2 First-Time
                </button>
<button class="px-6 py-3 border-b-2 border-transparent text-textMuted hover:text-textSecondary font-headline font-semibold text-sm flex items-center gap-2 transition-colors">
<span class="w-2 h-2 rounded-full bg-warning"></span>
                    C3 Corporate
                </button>
<button class="px-6 py-3 border-b-2 border-transparent text-textMuted hover:text-textSecondary font-headline font-semibold text-sm flex items-center gap-2 transition-colors">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
                    C4 Luxury
                </button>
</div>
<!-- Tab Content -->
<div class="space-y-6">
<!-- Hero & Stats -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
<div class="glass-card rounded-xl p-6 lg:col-span-1 border-l-4 border-l-primary relative overflow-hidden parcl-animate-card">
<div class="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
<span class="inline-block px-3 py-1 rounded bg-primary/20 text-primary font-mono text-xs font-bold border border-primary/30 mb-4">CLUSTER 1</span>
<h3 class="font-headline text-2xl font-bold text-white mb-2">Global Investors</h3>
<p class="font-body text-sm text-textSecondary leading-relaxed">High net-worth international buyers focusing on urban luxury and high-yield rentals. Demonstrates preference for cash transactions in tier-1 cities.</p>
</div>
<div class="glass-card rounded-xl p-6 lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6 parcl-animate-card">
<div class="space-y-1">
<p class="font-label text-[10px] uppercase tracking-widest text-textMuted">Mean Age</p>
<p class="font-mono text-2xl text-white font-bold">48 <span class="text-sm text-textMuted font-body font-normal">yrs</span></p>
</div>
<div class="space-y-1">
<p class="font-label text-[10px] uppercase tracking-widest text-textMuted">Median Satisfaction</p>
<p class="font-mono text-2xl text-white font-bold text-accent">8.4<span class="text-sm text-textMuted font-body font-normal">/10</span></p>
</div>
<div class="space-y-1">
<p class="font-label text-[10px] uppercase tracking-widest text-textMuted">Loan Rate</p>
<p class="font-mono text-2xl text-white font-bold">28.4<span class="text-sm text-textMuted font-body font-normal">%</span></p>
</div>
<div class="space-y-1">
<p class="font-label text-[10px] uppercase tracking-widest text-textMuted">Cash Rate</p>
<p class="font-mono text-2xl text-white font-bold text-primary">71.6<span class="text-sm text-textMuted font-body font-normal">%</span></p>
</div>
<div class="space-y-1">
<p class="font-label text-[10px] uppercase tracking-widest text-textMuted">Investment %</p>
<p class="font-mono text-2xl text-white font-bold">75.2<span class="text-sm text-textMuted font-body font-normal">%</span></p>
</div>
<div class="space-y-1">
<p class="font-label text-[10px] uppercase tracking-widest text-textMuted">Corporate %</p>
<p class="font-mono text-2xl text-white font-bold">12.0<span class="text-sm text-textMuted font-body font-normal">%</span></p>
</div>
</div>
</div>
<!-- Charts Row 1 -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<div class="glass-card rounded-xl p-5 h-64 flex flex-col parcl-animate-card">
<div class="flex justify-between items-center mb-4">
<h4 class="font-body text-sm font-semibold text-textPrimary">Age Distribution</h4>
<span class="material-symbols-outlined text-textMuted text-sm">more_horiz</span>
</div>
<div class="flex-1 flex items-end space-x-2 pb-2">
<div class="flex-1 chart-bar-blue rounded-t h-[20%]"></div>
<div class="flex-1 chart-bar-blue rounded-t h-[40%]"></div>
<div class="flex-1 chart-bar-blue rounded-t h-[80%] border-t-2 border-primary"></div>
<div class="flex-1 chart-bar-blue rounded-t h-[60%]"></div>
<div class="flex-1 chart-bar-blue rounded-t h-[30%]"></div>
</div>
<div class="flex justify-between font-mono text-[10px] text-textMuted border-t border-white/5 pt-2">
<span>25</span>
<span>45</span>
<span>65+</span>
</div>
</div>
<div class="glass-card rounded-xl p-5 h-64 flex flex-col parcl-animate-card">
<div class="flex justify-between items-center mb-4">
<h4 class="font-body text-sm font-semibold text-textPrimary">Satisfaction Score</h4>
</div>
<div class="flex-1 flex items-end space-x-2 pb-2">
<div class="flex-1 chart-bar-emerald rounded-t h-[10%] opacity-30"></div>
<div class="flex-1 chart-bar-emerald rounded-t h-[20%] opacity-50"></div>
<div class="flex-1 chart-bar-emerald rounded-t h-[45%] opacity-70"></div>
<div class="flex-1 chart-bar-emerald rounded-t h-[90%] border-t-2 border-accent"></div>
<div class="flex-1 chart-bar-emerald rounded-t h-[60%] opacity-90"></div>
</div>
<div class="flex justify-between font-mono text-[10px] text-textMuted border-t border-white/5 pt-2">
<span>1</span>
<span>5</span>
<span>10</span>
</div>
</div>
<div class="glass-card rounded-xl p-5 h-64 flex flex-col items-center justify-center relative parcl-animate-card">
<h4 class="font-body text-sm font-semibold text-textPrimary absolute top-5 left-5">Loan vs Cash</h4>
<!-- Donut representation -->
<div class="w-32 h-32 rounded-full border-[16px] border-surface3 relative mt-6">
<div class="absolute inset-[-16px] rounded-full border-[16px] border-transparent border-t-primary border-r-primary transform rotate-45"></div>
<div class="absolute inset-0 flex items-center justify-center flex-col">
<span class="font-mono text-xl text-white font-bold">71%</span>
<span class="font-label text-[8px] uppercase tracking-wider text-textMuted">Cash</span>
</div>
</div>
<div class="flex gap-4 mt-4 font-mono text-[10px] text-textMuted">
<div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-primary"></span> Cash</div>
<div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-surface3"></span> Loan</div>
</div>
</div>
</div>
<!-- Descriptive Stats Table -->
<div class="glass-card rounded-xl overflow-hidden">
<div class="p-5 border-b border-white/5 flex justify-between items-center">
<h4 class="font-body text-sm font-semibold text-textPrimary">Descriptive Statistics</h4>
<button class="text-xs text-primary hover:text-blue-400 font-body flex items-center gap-1">
<span class="material-symbols-outlined text-sm">download</span> Export
                        </button>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left font-body text-sm">
<thead class="bg-surface2/50 font-label text-[10px] uppercase tracking-widest text-textMuted">
<tr>
<th class="p-4 font-medium">Feature</th>
<th class="p-4 font-medium text-right">Mean</th>
<th class="p-4 font-medium text-right">Median</th>
<th class="p-4 font-medium text-right">Std Dev</th>
<th class="p-4 font-medium text-right">Min</th>
<th class="p-4 font-medium text-right">Max</th>
</tr>
</thead>
<tbody class="divide-y divide-white/5 font-mono text-xs">
<tr class="hover:bg-white/5 transition-colors">
<td class="p-4 text-textPrimary font-body">Age</td>
<td class="p-4 text-right text-textSecondary">48.2</td>
<td class="p-4 text-right text-white font-bold">47.0</td>
<td class="p-4 text-right text-textMuted">12.4</td>
<td class="p-4 text-right text-textMuted">28.0</td>
<td class="p-4 text-right text-textMuted">82.0</td>
</tr>
<tr class="hover:bg-white/5 transition-colors">
<td class="p-4 text-textPrimary font-body">Satisfaction</td>
<td class="p-4 text-right text-textSecondary">8.2</td>
<td class="p-4 text-right text-white font-bold text-accent">8.4</td>
<td class="p-4 text-right text-textMuted">1.1</td>
<td class="p-4 text-right text-textMuted">4.0</td>
<td class="p-4 text-right text-textMuted">10.0</td>
</tr>
<tr class="hover:bg-white/5 transition-colors">
<td class="p-4 text-textPrimary font-body">Investment Amount (\$M)</td>
<td class="p-4 text-right text-textSecondary">2.45</td>
<td class="p-4 text-right text-white font-bold">1.80</td>
<td class="p-4 text-right text-textMuted">1.8</td>
<td class="p-4 text-right text-textMuted">0.5</td>
<td class="p-4 text-right text-textMuted">12.5</td>
</tr>
<tr class="hover:bg-white/5 transition-colors">
<td class="p-4 text-textPrimary font-body">Hold Period (Yrs)</td>
<td class="p-4 text-right text-textSecondary">5.6</td>
<td class="p-4 text-right text-white font-bold">5.0</td>
<td class="p-4 text-right text-textMuted">2.3</td>
<td class="p-4 text-right text-textMuted">1.0</td>
<td class="p-4 text-right text-textMuted">15.0</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
<!-- Footer Component Space -->

` }} />
    </DashboardLayout>
  );
}
