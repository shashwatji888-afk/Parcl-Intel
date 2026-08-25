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
  
  // Interactive Hover State for Popover Dialog
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 40, y: 120 });

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
    },
    'Chicago': {
      state: 'IL',
      msi: '4.12',
      deltaUt: '-0.6',
      deltaUs: '-0.8',
      rank: '#410 by MSI',
      sqftPrice: '$285',
      sqftTrend: '+5.5% 1Y',
      underwater: '2.1%',
      skew: '-15.4%',
      activeListings: '18,400',
      priceCuts: '31.0%',
      unrealizedLoss: '4.2%',
      investorListings: '16.5%',
      dominantCluster: 'C1 Global Investors (35%)',
      buyerMix: '52% Multi · 48% SF · 0% Inst',
      hottest: '2-4 Unit Multi $450k-$700k · 16.5% · MSI 4.80'
    },
    'New York': {
      state: 'NY',
      msi: '4.35',
      deltaUt: '-0.3',
      deltaUs: '-0.5',
      rank: '#360 by MSI',
      sqftPrice: '$890',
      sqftTrend: '+3.2% 1Y',
      underwater: '1.8%',
      skew: '-28.0%',
      activeListings: '24,100',
      priceCuts: '34.2%',
      unrealizedLoss: '3.9%',
      investorListings: '25.4%',
      dominantCluster: 'C4 Luxury Investors (52%)',
      buyerMix: '85% Condo · 10% Co-op · 5% Townhouse',
      hottest: 'Condo $1.2M-$2.5M · 25.4% · MSI 4.90'
    }
  };

  const activeRegion = hoveredRegion ? regionsData[hoveredRegion] : null;

  const handleRegionHover = (regionKey, e) => {
    setHoveredRegion(regionKey);
    // Position tooltip near the cursor/container
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.closest('.map-canvas-container')?.getBoundingClientRect() || { left: 0, top: 0 };
    setTooltipPos({
      x: Math.max(20, Math.min(rect.left - parentRect.left - 120, 520)),
      y: Math.max(20, Math.min(rect.top - parentRect.top - 80, 200))
    });
  };

  return (
    <DashboardLayout title="Parcl HQ" subtitle="Live Real Estate Market Intelligence">
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* 1. HERO TITLE & SEARCH BAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '6px' }}>
          
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

        {/* 4. INTERACTIVE GEOGRAPHIC HEATMAP CANVAS (HOVER ONLY DIALOG) */}
        <div
          className="map-canvas-container"
          style={{ position: 'relative', backgroundColor: '#020408', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', minHeight: '520px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          
          {/* Subtle Dot Grid Background */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

          {/* Interactive Vector Map Shapes with Hover Handlers */}
          <svg width="860" height="420" viewBox="0 0 900 450" style={{ position: 'relative', zIndex: 1, maxWidth: '100%' }}>
            
            {/* West Coast / Washington / California */}
            <path
              d="M 60,110 L 210,90 L 250,170 L 180,320 L 50,260 Z"
              fill="#EC4899"
              fillOpacity="0.8"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              onMouseEnter={(e) => handleRegionHover('Seattle', e)}
              onMouseLeave={() => setHoveredRegion(null)}
              style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s, filter 0.2s' }}
            />

            {/* Mountain West (Utah / Provo) */}
            <path
              d="M 210,90 L 370,70 L 390,210 L 250,170 Z"
              fill="#8B5CF6"
              fillOpacity="0.85"
              stroke="#60A5FA"
              strokeWidth="1.8"
              onMouseEnter={(e) => handleRegionHover('Provo', e)}
              onMouseLeave={() => setHoveredRegion(null)}
              style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s, filter 0.2s' }}
            />

            {/* Central / Mountain (Denver / Colorado) */}
            <path
              d="M 370,70 L 560,80 L 570,270 L 390,210 Z"
              fill="#2563EB"
              fillOpacity="0.8"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              onMouseEnter={(e) => handleRegionHover('Denver', e)}
              onMouseLeave={() => setHoveredRegion(null)}
              style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s, filter 0.2s' }}
            />

            {/* Texas / South (San Antonio) */}
            <path
              d="M 390,210 L 570,270 L 540,380 L 360,330 Z"
              fill="#EC4899"
              fillOpacity="0.8"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              onMouseEnter={(e) => handleRegionHover('San Antonio', e)}
              onMouseLeave={() => setHoveredRegion(null)}
              style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s, filter 0.2s' }}
            />

            {/* Midwest (Chicago) */}
            <path
              d="M 560,80 L 720,100 L 690,270 L 570,270 Z"
              fill="#3B82F6"
              fillOpacity="0.75"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              onMouseEnter={(e) => handleRegionHover('Chicago', e)}
              onMouseLeave={() => setHoveredRegion(null)}
              style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s, filter 0.2s' }}
            />

            {/* East Coast / New York */}
            <path
              d="M 720,100 L 840,120 L 800,340 L 690,270 Z"
              fill="#EC4899"
              fillOpacity="0.85"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              onMouseEnter={(e) => handleRegionHover('New York', e)}
              onMouseLeave={() => setHoveredRegion(null)}
              style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s, filter 0.2s' }}
            />

            {/* Interactive Location Hover Hotspots / Glowing Pins */}
            <g onMouseEnter={(e) => handleRegionHover('Provo', e)} onMouseLeave={() => setHoveredRegion(null)} style={{ cursor: 'pointer' }}>
              <circle cx="310" cy="140" r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="310" cy="140" r="14" fill="rgba(59, 130, 246, 0.4)" />
              <text x="328" y="144" fill="#FFFFFF" fontSize="11" fontFamily="'Space Mono', monospace" fontWeight="bold">Provo</text>
            </g>

            <g onMouseEnter={(e) => handleRegionHover('Seattle', e)} onMouseLeave={() => setHoveredRegion(null)} style={{ cursor: 'pointer' }}>
              <circle cx="130" cy="140" r="5" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2" />
              <text x="148" y="144" fill="#FFFFFF" fontSize="11" fontFamily="'Space Mono', monospace">Seattle</text>
            </g>

            <g onMouseEnter={(e) => handleRegionHover('Denver', e)} onMouseLeave={() => setHoveredRegion(null)} style={{ cursor: 'pointer' }}>
              <circle cx="470" cy="160" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
              <text x="488" y="164" fill="#FFFFFF" fontSize="11" fontFamily="'Space Mono', monospace">Denver</text>
            </g>

            <g onMouseEnter={(e) => handleRegionHover('San Antonio', e)} onMouseLeave={() => setHoveredRegion(null)} style={{ cursor: 'pointer' }}>
              <circle cx="470" cy="310" r="5" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2" />
              <text x="488" y="314" fill="#FFFFFF" fontSize="11" fontFamily="'Space Mono', monospace">San Antonio</text>
            </g>

            <g onMouseEnter={(e) => handleRegionHover('Chicago', e)} onMouseLeave={() => setHoveredRegion(null)} style={{ cursor: 'pointer' }}>
              <circle cx="630" cy="160" r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
              <text x="648" y="164" fill="#FFFFFF" fontSize="11" fontFamily="'Space Mono', monospace">Chicago</text>
            </g>

            <g onMouseEnter={(e) => handleRegionHover('New York', e)} onMouseLeave={() => setHoveredRegion(null)} style={{ cursor: 'pointer' }}>
              <circle cx="760" cy="170" r="5" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2" />
              <text x="778" y="174" fill="#FFFFFF" fontSize="11" fontFamily="'Space Mono', monospace">New York</text>
            </g>

          </svg>

          {/* DYNAMIC HOVER POPOVER DIALOG (ONLY RENDERS WHEN HOVERED) */}
          {hoveredRegion && activeRegion && (
            <div
              style={{
                position: 'absolute',
                top: `${tooltipPos.y}px`,
                left: `${tooltipPos.x}px`,
                zIndex: 50,
                width: '360px',
                backgroundColor: 'rgba(5, 7, 13, 0.96)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(59, 130, 246, 0.55)',
                borderRadius: '10px',
                padding: '16px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.85), 0 0 25px rgba(59, 130, 246, 0.3)',
                pointerEvents: 'none',
                transition: 'top 0.1s ease, left 0.1s ease'
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                    {hoveredRegion}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '19px', fontWeight: '800', color: '#F59E0B' }}>{activeRegion.msi}</span>
                    <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>Motivated Seller Index</span>
                  </div>
                </div>
                <span style={{ fontSize: '11.5px', fontFamily: "'Space Mono', monospace", color: '#64748B', fontWeight: 'bold' }}>{activeRegion.state}</span>
              </div>

              {/* Deltas & Ranking */}
              <div style={{ display: 'flex', gap: '12px', fontSize: '10.5px', fontFamily: "'Space Mono', monospace", margin: '8px 0' }}>
                <span style={{ color: '#10B981' }}>▼ {activeRegion.deltaUt} {activeRegion.state}</span>
                <span style={{ color: '#10B981' }}>▼ {activeRegion.deltaUs} US</span>
                <span style={{ color: '#60A5FA' }}>{activeRegion.rank}</span>
              </div>

              {/* 3 Metric Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', padding: '6px', backgroundColor: '#090D16', borderRadius: '6px', textAlign: 'center', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '9px', color: '#64748B', textTransform: 'uppercase' }}>$/SQFT</div>
                  <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#FFFFFF' }}>{activeRegion.sqftPrice} <span style={{ color: '#EF4444', fontSize: '9.5px' }}>{activeRegion.sqftTrend}</span></div>
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: '#64748B', textTransform: 'uppercase' }}>UNDERWATER</div>
                  <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#FFFFFF' }}>{activeRegion.underwater}</div>
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: '#64748B', textTransform: 'uppercase' }}>SKEW</div>
                  <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#FFFFFF' }}>{activeRegion.skew}</div>
                </div>
              </div>

              {/* Table Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
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
              <div style={{ marginTop: '8px', fontSize: '10.5px', color: '#94A3B8', lineHeight: '1.4' }}>
                <div><strong>Mix:</strong> {activeRegion.buyerMix}</div>
                <div><strong>Hottest:</strong> {activeRegion.hottest}</div>
              </div>

              <div
                style={{ display: 'block', textAlign: 'center', marginTop: '10px', padding: '6px', borderRadius: '4px', backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '10.5px', fontWeight: '700', letterSpacing: '0.5px' }}
              >
                CLICK TO OPEN THE TERMINAL →
              </div>

            </div>
          )}

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
