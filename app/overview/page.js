'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../components/DashboardLayout';
import { fetchLiveBuyerMetrics } from '../../lib/dataService';

export default function OverviewPage() {
  const [metrics, setMetrics] = useState({
    totalBuyers: 2000,
    formattedTotalBuyers: '2,000',
    c1Count: 542,
    c1Pct: 27,
    c2Count: 764,
    c2Pct: 38,
    c3Count: 53,
    c3Pct: 3,
    c4Count: 641,
    c4Pct: 32,
    avgSatScore: '4.2',
    cashPct: 62,
    isLive: true,
  });

  const [selectedMetric, setSelectedMetric] = useState('MSI');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('markets');
  const [selectedRegion, setSelectedRegion] = useState('Provo');

  useEffect(() => {
    async function loadData() {
      const data = await fetchLiveBuyerMetrics();
      setMetrics(data);
    }
    loadData();
  }, []);

  const regionsData = {
    'Provo': {
      state: 'UT',
      msi: '5.43',
      deltaUt: '-0.2',
      deltaUs: '-0.1',
      rank: '#509 by MSI',
      sqftPrice: '$307',
      sqftTrend: '-0.3% 1Y',
      underwater: '2.3%',
      skew: '-30.2%',
      activeListings: '3,801',
      priceCuts: '42.9%',
      unrealizedLoss: '7.8%',
      investorListings: '11.4%',
      dominantCluster: 'C1 Global Investors (31%)',
      buyerMix: '67% SF · 44% NC · 0% Inst',
      hottest: 'SF $250k-$500k · 11.6% · MSI 6.74'
    },
    'Seattle': {
      state: 'WA',
      msi: '4.95',
      deltaUt: '-0.4',
      deltaUs: '-0.3',
      rank: '#312 by MSI',
      sqftPrice: '$542',
      sqftTrend: '-7.6% 1Y',
      underwater: '3.8%',
      skew: '-22.5%',
      activeListings: '8,420',
      priceCuts: '37.8%',
      unrealizedLoss: '5.4%',
      investorListings: '18.2%',
      dominantCluster: 'C4 Luxury Investors (44%)',
      buyerMix: '58% SF · 38% NC · 4% Inst',
      hottest: 'SFR $750k-$1.2M · 18.2% · MSI 5.12'
    },
    'Denver': {
      state: 'CO',
      msi: '6.97',
      deltaUt: '+0.8',
      deltaUs: '+1.2',
      rank: '#84 by MSI',
      sqftPrice: '$388',
      sqftTrend: '-6.3% 1Y',
      underwater: '6.1%',
      skew: '-18.4%',
      activeListings: '12,940',
      priceCuts: '52.0%',
      unrealizedLoss: '8.9%',
      investorListings: '14.6%',
      dominantCluster: 'C2 First-Time Buyers (42%)',
      buyerMix: '72% SF · 24% NC · 4% Inst',
      hottest: 'Condo/Townhome $400k-$600k · 14.6% · MSI 7.20'
    },
    'San Antonio': {
      state: 'TX',
      msi: '7.23',
      deltaUt: '+1.1',
      deltaUs: '+1.5',
      rank: '#42 by MSI',
      sqftPrice: '$215',
      sqftTrend: '-5.7% 1Y',
      underwater: '8.4%',
      skew: '-12.1%',
      activeListings: '15,620',
      priceCuts: '54.5%',
      unrealizedLoss: '11.2%',
      investorListings: '22.0%',
      dominantCluster: 'C2 First-Time Buyers (48%)',
      buyerMix: '80% SF · 15% NC · 5% Inst',
      hottest: 'SFR $200k-$350k · 22.0% · MSI 7.85'
    }
  };

  const activeRegion = regionsData[selectedRegion] || regionsData['Provo'];

  return (
    <DashboardLayout title="Parcl HQ" subtitle="Live Real Estate Market Intelligence">
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* 1. HERO TITLE & SEARCH BAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '38px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-1px', margin: 0, lineHeight: '1.1' }}>
                Parcl HQ
              </h1>
              <p style={{ fontSize: '14px', color: '#94A3B8', margin: '6px 0 0 0' }}>
                Prices, rents, supply, buyer clusters, and seller motivation across every US market - updated daily, down to the ZIP code.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', fontSize: '11.5px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>
                <span style={{ color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  Updated Aug 26, 2026 • refreshed daily
                </span>
                <span>·</span>
                <span style={{ color: '#60A5FA', cursor: 'pointer' }}>View market rankings ↓</span>
              </div>
            </div>

            <button
              type="button"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '9999px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#CBD5E1', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              <span style={{ color: '#3B82F6', fontSize: '14px' }}>▶</span>
              <span>Video How to use Parcl HQ</span>
            </button>
          </div>

          {/* Central Glowing Search Box */}
          <div style={{ maxWidth: '680px', width: '100%', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#05070E', border: '1px solid #3B82F6', borderRadius: '8px', padding: '8px 16px', boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}>
              <span className="material-symbols-outlined" style={{ color: '#94A3B8', fontSize: '20px', marginRight: '10px' }}>search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any market, segment, or buyer profile..."
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: '14px', width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

        </div>

        {/* 2. STATS STRIP & QUICK DATA BAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', padding: '16px 20px', backgroundColor: '#05070E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px' }}>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#64748B', letterSpacing: '1px' }}>UNITED STATES</span>
            <span style={{ fontSize: '32px', fontWeight: '800', color: '#F59E0B', letterSpacing: '-1px', lineHeight: 1 }}>5.49</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#F59E0B' }}>Motivated MSI</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', fontSize: '12.5px' }}>
            <div>
              <span style={{ color: '#64748B' }}>Active listings </span>
              <span style={{ fontWeight: '700', color: '#FFFFFF' }}>16,22,464</span>
            </div>

            <div>
              <span style={{ color: '#64748B' }}>Price cuts </span>
              <span style={{ fontWeight: '700', color: '#FFFFFF' }}>41.3%</span>
            </div>

            <div>
              <span style={{ color: '#64748B' }}>Live Database Buyers </span>
              <span style={{ fontWeight: '700', color: '#10B981' }}>{metrics.formattedTotalBuyers}</span>
            </div>

            <div>
              <span style={{ color: '#64748B' }}>Cash vs Loan </span>
              <span style={{ fontWeight: '700', color: '#60A5FA' }}>{metrics.cashPct}% Cash</span>
            </div>

            <div style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#111827', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#94A3B8' }}>
              AUG 26
            </div>
          </div>

        </div>

        {/* 3. FILTER & METRICS TOGGLE TOOLBAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Left View & Dropdowns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            
            <div style={{ display: 'inline-flex', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '2px' }}>
              <button
                type="button"
                onClick={() => setViewMode('markets')}
                style={{ padding: '6px 14px', borderRadius: '4px', border: 'none', backgroundColor: viewMode === 'markets' ? '#2563EB' : 'transparent', color: viewMode === 'markets' ? '#FFFFFF' : '#94A3B8', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
              >
                Markets
              </button>
              <button
                type="button"
                onClick={() => setViewMode('homes')}
                style={{ padding: '6px 14px', borderRadius: '4px', border: 'none', backgroundColor: viewMode === 'homes' ? '#2563EB' : 'transparent', color: viewMode === 'homes' ? '#FFFFFF' : '#94A3B8', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
              >
                Homes <span style={{ fontSize: '10px', opacity: 0.7 }}>every listing</span>
              </button>
            </div>

            <div style={{ padding: '6px 12px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', fontSize: '12px', color: '#CBD5E1', cursor: 'pointer' }}>
              Geography <span style={{ fontWeight: 'bold' }}>Metros</span> ▼
            </div>

            <div style={{ padding: '6px 12px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', fontSize: '12px', color: '#CBD5E1', cursor: 'pointer' }}>
              Home Types <span style={{ fontWeight: 'bold' }}>Aggregate</span> ▼
            </div>

            <div style={{ padding: '6px 12px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', fontSize: '12px', color: '#CBD5E1', cursor: 'pointer' }}>
              Min Listings <span style={{ fontWeight: 'bold' }}>20+</span> ▼
            </div>

            <span style={{ fontSize: '12px', color: '#64748B', cursor: 'pointer' }}>Reset</span>

          </div>

          {/* Right Metric Switches */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            <div style={{ display: 'inline-flex', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '2px' }}>
              {['MSI', 'Price Cuts %', 'Unrealized Loss %', 'Buyer Clusters'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMetric(m)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: selectedMetric === m ? '#1E293B' : 'transparent',
                    color: selectedMetric === m ? '#FFFFFF' : '#94A3B8',
                    fontSize: '11.5px',
                    fontWeight: selectedMetric === m ? '700' : '400',
                    cursor: 'pointer'
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

            <Link
              href="/reports"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
              <span>Download listings</span>
            </Link>

          </div>

        </div>

        {/* 4. INTERACTIVE GEOGRAPHIC HEATMAP & PROVO UT MODAL CANVAS */}
        <div style={{ position: 'relative', backgroundColor: '#030509', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', minHeight: '520px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
          
          {/* Background Map Graphic Grid */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          {/* Real Estate Heatmap SVG Representation */}
          <svg width="850" height="420" viewBox="0 0 900 450" style={{ position: 'relative', zIndex: 1, maxWidth: '100%', filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.2))' }}>
            {/* Western Region */}
            <path d="M 80,120 L 220,100 L 260,180 L 190,320 L 60,260 Z" fill="#EF4444" fillOpacity="0.75" stroke="#FFFFFF" strokeWidth="1" onClick={() => setSelectedRegion('San Antonio')} style={{ cursor: 'pointer' }} />
            {/* Mountain West (Utah / Provo) */}
            <path d="M 220,100 L 380,80 L 400,220 L 260,180 Z" fill="#EC4899" fillOpacity="0.85" stroke="#3B82F6" strokeWidth="2" onClick={() => setSelectedRegion('Provo')} style={{ cursor: 'pointer' }} />
            {/* Central Region (Denver / Texas) */}
            <path d="M 380,80 L 580,90 L 590,280 L 400,220 Z" fill="#8B5CF6" fillOpacity="0.75" stroke="#FFFFFF" strokeWidth="1" onClick={() => setSelectedRegion('Denver')} style={{ cursor: 'pointer' }} />
            {/* Midwest Region */}
            <path d="M 580,90 L 740,110 L 710,290 L 590,280 Z" fill="#3B82F6" fillOpacity="0.7" stroke="#FFFFFF" strokeWidth="1" />
            {/* East Coast / Washington */}
            <path d="M 740,110 L 840,140 L 790,340 L 710,290 Z" fill="#EC4899" fillOpacity="0.8" stroke="#FFFFFF" strokeWidth="1" onClick={() => setSelectedRegion('Seattle')} style={{ cursor: 'pointer' }} />

            {/* Glowing Region Pin */}
            <circle cx="330" cy="150" r="7" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="330" cy="150" r="16" fill="rgba(59, 130, 246, 0.4)" />
          </svg>

          {/* INTERACTIVE POPOVER CARD (EXACTLY AS IN SCREENSHOT 2) */}
          <div style={{ position: 'absolute', bottom: '30px', left: '30px', zIndex: 10, width: '380px', backgroundColor: 'rgba(5, 7, 13, 0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(59, 130, 246, 0.5)', borderRadius: '10px', padding: '18px', boxShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 25px rgba(59, 130, 246, 0.25)' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                  {selectedRegion}
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#F59E0B' }}>{activeRegion.msi}</span>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Motivated Seller Index</span>
                </div>
              </div>
              <span style={{ fontSize: '12px', fontFamily: "'Space Mono', monospace", color: '#64748B', fontWeight: 'bold' }}>{activeRegion.state}</span>
            </div>

            {/* Deltas & Ranking */}
            <div style={{ display: 'flex', gap: '14px', fontSize: '11px', fontFamily: "'Space Mono', monospace", margin: '10px 0' }}>
              <span style={{ color: '#10B981' }}>▼ {activeRegion.deltaUt} {activeRegion.state}</span>
              <span style={{ color: '#10B981' }}>▼ {activeRegion.deltaUs} US</span>
              <span style={{ color: '#60A5FA' }}>{activeRegion.rank}</span>
            </div>

            {/* 3 Metric Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '8px', backgroundColor: '#090D16', borderRadius: '6px', textAlign: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '9.5px', color: '#64748B', textTransform: 'uppercase' }}>$/SQFT</div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF' }}>{activeRegion.sqftPrice} <span style={{ color: '#EF4444', fontSize: '10px' }}>{activeRegion.sqftTrend}</span></div>
              </div>
              <div>
                <div style={{ fontSize: '9.5px', color: '#64748B', textTransform: 'uppercase' }}>UNDERWATER</div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF' }}>{activeRegion.underwater}</div>
              </div>
              <div>
                <div style={{ fontSize: '9.5px', color: '#64748B', textTransform: 'uppercase' }}>SKEW</div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF' }}>{activeRegion.skew}</div>
              </div>
            </div>

            {/* Table Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
                <span>Active listings</span>
                <span style={{ fontWeight: '700' }}>{activeRegion.activeListings}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
                <span>Price Cuts %</span>
                <span style={{ fontWeight: '700' }}>{activeRegion.priceCuts}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
                <span>Unrealized Loss %</span>
                <span style={{ fontWeight: '700' }}>{activeRegion.unrealizedLoss}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
                <span>Dominant Buyer Cluster</span>
                <span style={{ fontWeight: '700', color: '#60A5FA' }}>{activeRegion.dominantCluster}</span>
              </div>
            </div>

            {/* Footer Summary */}
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#94A3B8', lineHeight: '1.4' }}>
              <div><strong>Mix:</strong> {activeRegion.buyerMix}</div>
              <div><strong>Hottest:</strong> {activeRegion.hottest}</div>
            </div>

            <Link
              href="/profiler"
              style={{ display: 'block', textAlign: 'center', marginTop: '12px', padding: '8px', borderRadius: '6px', backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '11.5px', fontWeight: '700', textDecoration: 'none', letterSpacing: '0.5px' }}
            >
              CLICK TO OPEN THE TERMINAL →
            </Link>

          </div>

        </div>

        {/* 5. 4 CLUSTER PILLARS FROM 2000 LIVE DATASET */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          
          <div style={{ padding: '20px', backgroundColor: '#05070E', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#3B82F6', fontWeight: 'bold' }}>CLUSTER C1</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#3B82F6' }}>{metrics.c1Pct}% ({metrics.c1Count})</span>
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>Global Investors</h4>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
              High-income international buyers acquiring properties via 100% cash transactions.
            </p>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#05070E', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#10B981', fontWeight: 'bold' }}>CLUSTER C2</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#10B981' }}>{metrics.c2Pct}% ({metrics.c2Count})</span>
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>First-Time Buyers</h4>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
              Younger domestic primary residence buyers heavily reliant on mortgage and loan financing.
            </p>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#05070E', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#F59E0B', fontWeight: 'bold' }}>CLUSTER C3</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#F59E0B' }}>{metrics.c3Pct}% ({metrics.c3Count})</span>
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>Corporate Buyers</h4>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
              Institutional real estate funds and companies acquiring multiple multi-family and commercial units.
            </p>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#05070E', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#8B5CF6', fontWeight: 'bold' }}>CLUSTER C4</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#8B5CF6' }}>{metrics.c4Pct}% ({metrics.c4Count})</span>
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>Luxury Investors</h4>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
              High customer satisfaction rating (≥ 4.0/5.0) purchasing top-tier penthouse & office assets.
            </p>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
