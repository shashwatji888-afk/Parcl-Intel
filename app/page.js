'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const userName = profile?.full_name || user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0];
  const avatarUrl = user?.user_metadata?.avatar_url || profile?.avatar_url;
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/profiler?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/overview');
    }
  };

  const tickerItems = [
    { city: 'U.S.', trend: '▼ -2.2% YoY', trendColor: '#EF4444', msi: 'MSI 5.49', cuts: 'CUTS 41.3%', dot: true },
    { city: 'WASHINGTON', trend: '▼ -7.4%', trendColor: '#EF4444', msi: 'MSI 4.95', cuts: 'CUTS 37.8%' },
    { city: 'DENVER', trend: '▼ -6.3%', trendColor: '#EF4444', msi: 'MSI 6.97', cuts: 'CUTS 52.0%' },
    { city: 'BOULDER', trend: '▼ -5.7%', trendColor: '#EF4444', msi: 'MSI 5.71', cuts: 'CUTS 44.1%' },
    { city: 'SAN ANTONIO', trend: '▼ -5.7%', trendColor: '#EF4444', msi: 'MSI 7.23', cuts: 'CUTS 54.5%' },
    { city: 'BALTIMORE', trend: '▼ -5.1%', trendColor: '#EF4444', msi: 'MSI 5.68', cuts: 'CUTS 39.5%' },
    { city: 'LAS VEGAS', trend: '▼ -4.9%', trendColor: '#EF4444', msi: 'MSI 5.28', cuts: 'CUTS 42.1%' },
    { city: 'DUBAI (C1 FLOW)', trend: '▲ +12.4%', trendColor: '#10B981', msi: '72% CASH', cuts: 'CAP $4.2B' },
    { city: 'CHICAGO', trend: '▲ +5.5%', trendColor: '#10B981', msi: 'MSI 4.12', cuts: 'CUTS 31.0%' },
    { city: 'HONOLULU', trend: '▲ +5.9%', trendColor: '#10B981', msi: 'MSI 6.10', cuts: 'CUTS 33.4%' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#F8FAFC', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", overflowX: 'hidden' }}>
      
      {/* CSS KEYFRAME FOR SMOOTH INFINITE MARQUEE */}
      <style jsx global>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .parcl-ticker-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 35s linear infinite;
        }
        .parcl-ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 1. TOP LIVE INFINITE MOVING MARKET TICKER */}
      <div style={{ backgroundColor: '#05070D', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden', whiteSpace: 'nowrap', padding: '7px 0', fontSize: '11px', fontFamily: "'Space Mono', monospace" }}>
        <div className="parcl-ticker-track">
          
          {/* First Set of Items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px', paddingRight: '36px' }}>
            {tickerItems.map((item, index) => (
              <div key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#CBD5E1' }}>
                {item.dot && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                )}
                <span style={{ fontWeight: 'bold', color: item.dot ? '#10B981' : '#FFFFFF' }}>{item.city}</span>
                <span style={{ color: item.trendColor }}>{item.trend}</span>
                <span style={{ color: '#64748B' }}>{item.msi}</span>
                <span style={{ color: '#94A3B8' }}>{item.cuts}</span>
              </div>
            ))}
          </div>

          {/* Duplicate Set for Seamless Infinite Loop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px', paddingRight: '36px' }}>
            {tickerItems.map((item, index) => (
              <div key={`dup-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#CBD5E1' }}>
                {item.dot && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                )}
                <span style={{ fontWeight: 'bold', color: item.dot ? '#10B981' : '#FFFFFF' }}>{item.city}</span>
                <span style={{ color: item.trendColor }}>{item.trend}</span>
                <span style={{ color: '#64748B' }}>{item.msi}</span>
                <span style={{ color: '#94A3B8' }}>{item.cuts}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 2. NAVBAR */}
      <nav style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px 28px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FFFFFF" />
              <path d="M2 17L12 22L22 17" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.5px' }}>
              PARCL
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <Link href="/overview" style={{ color: '#94A3B8', fontSize: '13.5px', fontWeight: '500', textDecoration: 'none' }}>Overview</Link>
            <Link href="/segments" style={{ color: '#94A3B8', fontSize: '13.5px', fontWeight: '500', textDecoration: 'none' }}>Segments</Link>
            <Link href="/investors" style={{ color: '#94A3B8', fontSize: '13.5px', fontWeight: '500', textDecoration: 'none' }}>Investors</Link>
            <Link href="/profiler" style={{ color: '#94A3B8', fontSize: '13.5px', fontWeight: '500', textDecoration: 'none' }}>Profiler</Link>
            <Link href="/pipeline" style={{ color: '#94A3B8', fontSize: '13.5px', fontWeight: '500', textDecoration: 'none' }}>Pipeline</Link>
            <Link href="/reports" style={{ color: '#94A3B8', fontSize: '13.5px', fontWeight: '500', textDecoration: 'none' }}>Reports</Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {!user ? (
              <>
                <Link href="/login" style={{ color: '#CBD5E1', fontSize: '13.5px', fontWeight: '500', textDecoration: 'none' }}>
                  Sign In
                </Link>
                <Link
                  href="/overview"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', color: '#000000', fontWeight: '700', padding: '9px 18px', borderRadius: '9999px', fontSize: '13px', textDecoration: 'none' }}
                >
                  Open Parcl HQ →
                </Link>
              </>
            ) : (
              <Link
                href="/overview"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', backgroundColor: '#111827', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFFFFF', textDecoration: 'none' }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userName} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px' }}>
                    {userInitial}
                  </div>
                )}
                <span style={{ fontSize: '12.5px', fontWeight: '600' }}>{userName}</span>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>→</span>
              </Link>
            )}
          </div>

        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section style={{ position: 'relative', paddingTop: '90px', paddingBottom: '70px', paddingLeft: '24px', paddingRight: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '350px', background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
          <h1 style={{ fontSize: '64px', fontWeight: '800', letterSpacing: '-2px', lineHeight: '1.08', color: '#FFFFFF', margin: 0, marginBottom: '24px' }}>
            The Real Estate Market, <span style={{ color: '#60A5FA' }}>Live</span>
          </h1>

          <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '640px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
            Prices, buyer segments, capital flows, and investor motivation for every market, updated daily, down to the zip.
          </p>

          <form onSubmit={handleSearch} style={{ maxWidth: '620px', margin: '0 auto 60px auto', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#05070D', border: '1px solid #3B82F6', borderRadius: '9999px', padding: '6px 8px 6px 20px', boxShadow: '0 0 25px rgba(59, 130, 246, 0.35)' }}>
              <span className="material-symbols-outlined" style={{ color: '#94A3B8', fontSize: '20px', marginRight: '10px' }}>search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any market, cluster, or buyer profile..."
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: '14px', width: '100%', fontFamily: 'inherit' }}
              />
              <button
                type="submit"
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Search
              </button>
            </div>
          </form>

        </div>

        {/* 4. PRODUCT SUITE 4-PILLAR GRID */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1360px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', textAlign: 'left' }}>
          
          <Link href="/overview" style={{ textDecoration: 'none', backgroundColor: '#05070D', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 0 30px rgba(37, 99, 235, 0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>Parcl HQ</h3>
              <span style={{ fontSize: '12px', color: '#60A5FA' }}>→</span>
            </div>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>
              Access live price, mortgage, buyer cluster distributions, and investor market data for every region.
            </p>
          </Link>

          <Link href="/insights" style={{ textDecoration: 'none', backgroundColor: '#05070D', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>Buyer Profiler</h3>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>→</span>
            </div>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>
              Real-time machine learning classifier predicting buyer segment membership (C1–C4) with confidence scoring.
            </p>
          </Link>

          <Link href="/pipeline" style={{ textDecoration: 'none', backgroundColor: '#05070D', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>Data Pipeline</h3>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>→</span>
            </div>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>
              Ingest, clean, and standardize bulk real estate transaction datasets via CSV or direct REST API streams.
            </p>
          </Link>

          <Link href="/reports" style={{ textDecoration: 'none', backgroundColor: '#05070D', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>Research & Reports</h3>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>→</span>
            </div>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>
              Generate comprehensive intelligence dossiers, executive summaries, and instant PDF/CSV data exports.
            </p>
          </Link>

        </div>

      </section>

      {/* 5. TRUST / AS SEEN IN BANNER */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '24px', backgroundColor: '#05070D', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', color: '#64748B', letterSpacing: '0.5px', marginBottom: '16px' }}>
          Trusted by top investors and operators, as seen in
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '48px', flexWrap: 'wrap', opacity: 0.7, fontFamily: "'Inter', sans-serif", fontWeight: '700', fontSize: '16px', letterSpacing: '1px', color: '#CBD5E1' }}>
          <span>CNBC</span>
          <span>FORTUNE</span>
          <span style={{ backgroundColor: '#EF4444', color: '#FFF', padding: '2px 8px', fontSize: '12px' }}>Newsweek</span>
          <span style={{ fontFamily: 'serif', fontStyle: 'italic' }}>The New York Times</span>
          <span>Polymarket</span>
          <span style={{ letterSpacing: '2px', fontSize: '14px' }}>THE WALL STREET JOURNAL.</span>
        </div>
      </div>

      {/* 6. 3-COLUMN DEEP ANALYTICS HUB */}
      <section style={{ maxWidth: '1360px', width: '100%', margin: '0 auto', padding: '60px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748B', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', marginBottom: '8px' }}>Coverage</div>
            <div style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.5' }}>150M properties. 70K markets. 50K+ investor profiles.</div>
          </div>

          <div>
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-1px', lineHeight: 1 }}>16,22,464</div>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>active listings priced today</div>
          </div>

          <div>
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-1px', lineHeight: 1 }}>20,000+</div>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>daily price feeds across states, metros, counties, and zips</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748B', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', marginBottom: '8px' }}>Watchlists</div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#FFFFFF', margin: 0, lineHeight: '1.3' }}>
              Thousands of users track their markets with watchlists
            </h2>
          </div>

          <div style={{ fontSize: '11px', color: '#64748B', fontFamily: "'Space Mono', monospace", marginTop: '8px' }}>TRENDING THIS WEEK</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '8px', fontSize: '13.5px' }}>
              <span>Seattle</span>
              <span style={{ color: '#EF4444' }}>▼ -7.6% 1Y</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '8px', fontSize: '13.5px' }}>
              <span>Providence</span>
              <span style={{ color: '#10B981' }}>▲ +7.5% 1Y</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '8px', fontSize: '13.5px' }}>
              <span>Washington</span>
              <span style={{ color: '#EF4444' }}>▼ -7.4% 1Y</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '8px', fontSize: '13.5px' }}>
              <span>Denver</span>
              <span style={{ color: '#EF4444' }}>▼ -6.3% 1Y</span>
            </div>
          </div>

          <Link
            href="/segments"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#2563EB', color: '#FFFFFF', padding: '10px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', marginTop: '12px', width: 'fit-content' }}
          >
            Explore Segments
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase' }}>From the desk</div>
            <Link href="/reports" style={{ fontSize: '12px', color: '#60A5FA', textDecoration: 'none' }}>View all →</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Link href="/reports" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '12px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontFamily: "'Space Mono', monospace", minWidth: '75px' }}>25 Aug 2026</span>
              <span style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.4' }}>How Real Estate Agents Use Parcl: Guide to Winning Your Market</span>
            </Link>

            <Link href="/reports" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '12px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontFamily: "'Space Mono', monospace", minWidth: '75px' }}>20 Aug 2026</span>
              <span style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.4' }}>Washington, DC: The Housing Correction Enters a New Phase</span>
            </Link>

            <Link href="/reports" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '12px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontFamily: "'Space Mono', monospace", minWidth: '75px' }}>18 Aug 2026</span>
              <span style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.4' }}>Buffalo: Despite Doubling, We Think the Bull Run Continues</span>
            </Link>

            <Link href="/reports" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '12px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontFamily: "'Space Mono', monospace", minWidth: '75px' }}>12 Aug 2026</span>
              <span style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.4' }}>Rental Analytics Live in Parcl HQ: SFR Supply & Motivated Sellers</span>
            </Link>
          </div>
        </div>

      </section>

      {/* 7. GLOBAL FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#05070D', padding: '48px 24px 32px 24px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '40px' }}>
          
          <div>
            <div style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase', marginBottom: '14px' }}>01 PRODUCTS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <Link href="/overview" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Parcl HQ</Link>
              <Link href="/insights" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Housing Research</Link>
              <Link href="/profiler" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Buyer Profiler</Link>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase', marginBottom: '14px' }}>02 DATA</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <Link href="/pipeline" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Data Pipeline</Link>
              <Link href="/api/predict" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Developer API</Link>
              <Link href="/reports" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Clustering Methodology</Link>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase', marginBottom: '14px' }}>GET ACCESS</div>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 12px 0' }}>Open the terminal on today's market.</p>
            <Link
              href="/overview"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', color: '#000000', fontWeight: '700', padding: '8px 16px', borderRadius: '9999px', fontSize: '12.5px', textDecoration: 'none' }}
            >
              Open Parcl HQ →
            </Link>
          </div>

        </div>

        <div style={{ maxWidth: '1360px', margin: '0 auto', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#64748B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: 'bold', color: '#FFFFFF' }}>PARCL</span>
            <span>© 2026 Parcl Intel. All rights reserved.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontFamily: "'Space Mono', monospace", fontSize: '11px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
            <span>DATA LIVE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
