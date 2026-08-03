'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user, profile } = useAuth();

  const userName = profile?.full_name || user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0];
  const avatarUrl = user?.user_metadata?.avatar_url || profile?.avatar_url;
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  useEffect(() => {
    // Fix navigation: intercept clicks on nav links
    const navLinks = document.querySelectorAll('a[href="#"]');
    navLinks.forEach(link => {
      const text = link.textContent?.trim();
      
      const routeMap = {
        'Overview': '/overview',
        'Segments': '/segments',
        'Investors': '/investors',
        'Geography': '/geography',
        'Insights': '/insights',
        'Segment Insights': '/insights',
        'Profiler': '/profiler',
        'Pipeline': '/pipeline',
        'Reports': '/reports',
        'Launch Dashboard': '/overview',
        'View Research': '/reports'
      };
      
      let match = routeMap[text];
      if (!match) {
        const lastSpan = link.querySelector('span:last-child');
        if (lastSpan) {
            match = routeMap[lastSpan.textContent?.trim()];
        }
      }
      
      if (match) {
        link.href = match;
      }
    });
  }, []);

  return (
    <div className="font-body antialiased min-h-screen flex flex-col relative overflow-x-hidden bg-[#0A0F1E] text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 z-[-2] bg-[#0A0F1E]" />
      <div className="fixed inset-0 z-[-1] bg-grid pointer-events-none" />
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-[-1]" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[100px] pointer-events-none z-[-1]" />

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#1E293B]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-blue-500/10 transition-all duration-300">
        <div className="flex justify-between items-center px-6 py-4 max-w-full mx-auto">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              analytics
            </span>
            <span className="font-headline text-xl font-bold tracking-tighter text-white">PARCL INTEL</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link className="text-primary font-bold border-b-2 border-primary pb-1 font-body text-sm tracking-tight no-underline" href="/overview">Overview</Link>
            <Link className="text-slate-400 hover:text-white transition-colors font-body text-sm tracking-tight no-underline" href="/segments">Segments</Link>
            <Link className="text-slate-400 hover:text-white transition-colors font-body text-sm tracking-tight no-underline" href="/investors">Investors</Link>
            <Link className="text-slate-400 hover:text-white transition-colors font-body text-sm tracking-tight no-underline" href="/geography">Geography</Link>
            <Link className="text-slate-400 hover:text-white transition-colors font-body text-sm tracking-tight no-underline" href="/profiler">Profiler</Link>
            <Link className="text-slate-400 hover:text-white transition-colors font-body text-sm tracking-tight no-underline" href="/reports">Reports</Link>
          </div>

          {/* User Profile or Auth Login Button */}
          {user ? (
            <Link
              href="/overview"
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1E293B] border border-white/10 hover:border-primary/50 transition-all text-white no-underline shadow-glow-primary group"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={userName} className="w-7 h-7 rounded-full object-cover border border-primary/40" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-xs text-white">
                  {userInitial}
                </div>
              )}
              <span className="text-xs font-headline font-bold">{userName}</span>
              <span className="material-symbols-outlined text-xs text-slate-400 group-hover:text-white transition-colors">
                arrow_forward
              </span>
            </Link>
          ) : (
            <Link
              className="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors text-sm shadow-glow-primary active:scale-95 flex items-center gap-1.5 cursor-pointer no-underline"
              href="/login"
            >
              <span className="material-symbols-outlined text-base">lock_open</span>
              Sign In / Access Portal
            </Link>
          )}
        </div>
      </nav>

      {/* Embedded HTML Body Content */}
      <div dangerouslySetInnerHTML={{ __html: `<style>
        body {
            background-color: #0A0F1E;
            color: #F8FAFC;
        }
        
        .glass-card {
            background-color: rgba(30, 41, 59, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(12px);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .glass-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px -10px rgba(37, 99, 235, 0.2);
            border-color: rgba(255, 255, 255, 0.1);
        }

        .metric-value {
            font-family: 'Space Mono', monospace;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .gradient-text {
            background: linear-gradient(135deg, #2563EB, #8B5CF6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .bg-grid {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            position: absolute;
            inset: 0;
            z-index: -1;
            mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
        }
    </style>` }} />

      <div dangerouslySetInnerHTML={{ __html: `
<!-- Main Content -->
<main class="flex-grow pt-32 pb-24 px-6 max-w-7xl mx-auto w-full flex flex-col gap-24">
<!-- Hero Section -->
<section class="flex flex-col items-center text-center max-w-4xl mx-auto mt-12 relative z-10">
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 text-sm text-slate-300">
<span class="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
<span>System Status: Intelligence Engine Online</span>
</div>
<h1 class="font-headline text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
                Machine Learning <br/>
<span class="gradient-text">Buyer Intelligence</span> <br/>
                for Real Estate
            </h1>
<p class="font-body text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
                Discover hidden buyer segments, investment patterns, and market intelligence powered by AI clustering. Precision engineering for the modern real estate analyst.
            </p>
<div class="flex flex-col sm:flex-row gap-4">
<a href="/overview" class="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-glow-primary hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] flex items-center justify-center gap-2 no-underline">
<span class="material-symbols-outlined">rocket_launch</span>
<span>Launch Dashboard</span>
</a>
<a href="/reports" class="glass-card hover:bg-white/10 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border border-white/10 no-underline">
<span class="material-symbols-outlined">science</span>
<span>View Research</span>
</a>
</div>
</section>
<!-- Metric Highlight Cards -->
<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
<!-- Card 1 -->
<div class="glass-card p-6 rounded-xl flex flex-col justify-between h-48 border border-white/10 relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-6xl text-primary">pie_chart</span>
</div>
<div>
<span class="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-1">Clustering Output</span>
<h3 class="font-headline text-lg font-bold text-white mb-2">4 Core Segments</h3>
</div>
<div>
<p class="text-slate-400 text-sm">Automated K-Means clustering identifying distinct buyer personas.</p>
</div>
</div>
<!-- Card 2 -->
<div class="glass-card p-6 rounded-xl flex flex-col justify-between h-48 border border-white/10 relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-6xl text-secondary">trending_up</span>
</div>
<div>
<span class="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-1">Prediction Rate</span>
<h3 class="font-headline text-lg font-bold text-white mb-2">89.4% Precision</h3>
</div>
<div>
<p class="text-slate-400 text-sm">High-confidence classification of new buyer profiles in real-time.</p>
</div>
</div>
<!-- Card 3 -->
<div class="glass-card p-6 rounded-xl flex flex-col justify-between h-48 border border-white/10 relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-6xl text-accent">public</span>
</div>
<div>
<span class="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-1">Geographic Coverage</span>
<h3 class="font-headline text-lg font-bold text-white mb-2">Tier-1 & Global</h3>
</div>
<div>
<p class="text-slate-400 text-sm">Cross-border capital flow analysis and regional concentration metrics.</p>
</div>
</div>
<!-- Card 4 -->
<div class="glass-card p-6 rounded-xl flex flex-col justify-between h-48 border border-white/10 relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-6xl text-primary">insights</span>
</div>
<div>
<span class="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-1">Database Scope</span>
<h3 class="font-headline text-lg font-bold text-white mb-2">50k+ Profiles</h3>
</div>
<div>
<p class="text-slate-400 text-sm">Continuous feature extraction and behavioral trend monitoring.</p>
</div>
</div>
</section>
<!-- Features Preview Section -->
<section class="flex flex-col gap-12 mt-12">
<div class="text-center max-w-2xl mx-auto">
<h2 class="font-headline text-3xl md:text-4xl font-bold text-white mb-4">Analytical Capabilities</h2>
<p class="text-slate-400 text-base">Comprehensive machine learning tooling designed specifically for real estate investment firms and advisory teams.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
<!-- Feature 1 -->
<div class="glass-card p-8 rounded-2xl flex flex-col gap-4 border border-white/10">
<div class="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-2">
<span class="material-symbols-outlined text-2xl">psychology</span>
</div>
<h3 class="font-headline text-xl font-bold text-white">Buyer Profiler</h3>
<p class="text-slate-400 text-sm leading-relaxed">Input demographic and financial attributes to predict buyer segment membership instantly with confidence scoring.</p>
</div>
<!-- Feature 2 -->
<div class="glass-card p-8 rounded-2xl flex flex-col gap-4 border border-white/10">
<div class="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary mb-2">
<span class="material-symbols-outlined text-2xl">account_tree</span>
</div>
<h3 class="font-headline text-xl font-bold text-white">ML Pipeline Engine</h3>
<p class="text-slate-400 text-sm leading-relaxed">Automated feature engineering, normalization, and K-Means clustering model training pipeline.</p>
</div>
<!-- Feature 3 -->
<div class="glass-card p-8 rounded-2xl flex flex-col gap-4 border border-white/10">
<div class="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent mb-2">
<span class="material-symbols-outlined text-2xl">map</span>
</div>
<h3 class="font-headline text-xl font-bold text-white">Geographic Intelligence</h3>
<p class="text-slate-400 text-sm leading-relaxed">Regional capital mapping and cluster density analysis across key global real estate hubs.</p>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="border-t border-white/10 bg-surface-2/40 py-8 px-6 text-center text-xs font-mono text-slate-500">
<div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
<div>© 2026 Parcl Intel. Real Estate Machine Learning Intelligence Engine.</div>
<div class="flex gap-6">
<a class="hover:text-slate-300 transition-colors" href="/reports">Documentation</a>
<a class="hover:text-slate-300 transition-colors" href="#">Privacy Policy</a>
<a class="hover:text-slate-300 transition-colors" href="#">API Status</a>
</div>
</div>
</footer>
` }} />
    </div>
  );
}