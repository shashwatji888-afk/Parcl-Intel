'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import DashboardLayout from '../components/DashboardLayout';
import { fetchLiveBuyerMetrics, subscribeToLiveBuyerUpdates } from '../../lib/dataService';
import usMapData from '../../lib/usMapData.json';

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
    regions: {}
  });

  const [selectedMetric, setSelectedMetric] = useState('MSI');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('markets');
  
  // Interactive Hover State for Popover Dialog
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 40, y: 120 });

  // Map Zoom & Pan State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef(null);

  // 1. Fetch live metrics & subscribe to real-time database changes
  useEffect(() => {
    async function loadData() {
      const data = await fetchLiveBuyerMetrics();
      setMetrics(data);
    }
    loadData();

    // Supabase Real-time Listener for auto-updating when new land/buyer is inserted
    const unsubscribe = subscribeToLiveBuyerUpdates((freshData) => {
      setMetrics(freshData);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // 2. Dedicated non-passive wheel listener for smooth zoom without page scroll
  useEffect(() => {
    const mapElement = mapContainerRef.current;
    if (!mapElement) return;

    const onWheelHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const zoomDelta = e.deltaY < 0 ? 0.16 : -0.16;
      setZoomLevel((prev) => Math.min(Math.max(prev + zoomDelta, 0.75), 3.5));
    };

    mapElement.addEventListener('wheel', onWheelHandler, { passive: false });
    return () => {
      mapElement.removeEventListener('wheel', onWheelHandler);
    };
  }, []);

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'path' || e.target.tagName === 'circle' || e.target.tagName === 'text') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // State metadata dictionary merging static market metrics with dynamic Supabase database data
  const stateMeta = {
    'Utah': { state: 'UT', name: 'Provo / Salt Lake', msi: 5.43, sqftPrice: '$307', sqftTrend: '-0.3% 1Y', underwater: '2.3%', skew: '-30.2%', activeListings: '3,801', priceCuts: '42.9%', unrealizedLoss: '7.8%', investorListings: '11.4%', deltaUt: '-0.2', deltaUs: '-0.1', rank: '#509 by MSI', buyerMix: '67% SF · 44% NC · 0% Inst', hottest: 'SF $250k-$500k · 11.6% · MSI 6.74' },
    'Washington': { state: 'WA', name: 'Seattle Metro', msi: 4.95, sqftPrice: '$542', sqftTrend: '-7.6% 1Y', underwater: '3.8%', skew: '-22.5%', activeListings: '8,420', priceCuts: '37.8%', unrealizedLoss: '5.4%', investorListings: '18.2%', deltaUt: '-0.4', deltaUs: '-0.3', rank: '#312 by MSI', buyerMix: '58% SF · 38% NC · 4% Inst', hottest: 'SFR $750k-$1.2M · 18.2% · MSI 5.12' },
    'Colorado': { state: 'CO', name: 'Denver / Boulder', msi: 6.97, sqftPrice: '$388', sqftTrend: '-6.3% 1Y', underwater: '6.1%', skew: '-18.4%', activeListings: '12,940', priceCuts: '52.0%', unrealizedLoss: '8.9%', investorListings: '14.6%', deltaUt: '+0.8', deltaUs: '+1.2', rank: '#84 by MSI', buyerMix: '72% SF · 24% NC · 4% Inst', hottest: 'Condo $400k-$600k · 14.6% · MSI 7.20' },
    'Texas': { state: 'TX', name: 'San Antonio / Austin', msi: 7.23, sqftPrice: '$215', sqftTrend: '-5.7% 1Y', underwater: '8.4%', skew: '-12.1%', activeListings: '20,223', priceCuts: '54.5%', unrealizedLoss: '11.2%', investorListings: '22.0%', deltaUt: '+1.1', deltaUs: '+1.5', rank: '#42 by MSI', buyerMix: '80% SF · 15% NC · 5% Inst', hottest: 'SFR $200k-$350k · 22.0% · MSI 7.85' },
    'California': { state: 'CA', name: 'San Jose / Bay Area / LA', msi: 4.88, sqftPrice: '$1,020', sqftTrend: '-1.8% 1Y', underwater: '1.9%', skew: '-26.4%', activeListings: '14,200', priceCuts: '38.2%', unrealizedLoss: '4.6%', investorListings: '26.4%', deltaUt: '-0.5', deltaUs: '-0.6', rank: '#340 by MSI', buyerMix: '64% SF · 32% Condo · 4% Inst', hottest: 'SFR $1.2M-$2.0M · 26.4% · MSI 4.70' },
    'Florida': { state: 'FL', name: 'Miami / Orlando / Tampa', msi: 5.99, sqftPrice: '$395', sqftTrend: '-1.5% 1Y', underwater: '5.2%', skew: '-19.0%', activeListings: '32,100', priceCuts: '45.4%', unrealizedLoss: '8.1%', investorListings: '31.2%', deltaUt: '+0.4', deltaUs: '+0.7', rank: '#142 by MSI', buyerMix: '50% Condo · 45% SF · 5% Inst', hottest: 'Condo $350k-$600k · 31.2% · MSI 6.40' },
    'Arizona': { state: 'AZ', name: 'Phoenix Metro', msi: 6.56, sqftPrice: '$290', sqftTrend: '-1.7% 1Y', underwater: '5.8%', skew: '-16.2%', activeListings: '16,800', priceCuts: '49.8%', unrealizedLoss: '9.0%', investorListings: '19.5%', deltaUt: '+0.7', deltaUs: '+1.0', rank: '#110 by MSI', buyerMix: '78% SF · 20% NC · 2% Inst', hottest: 'SFR $300k-$480k · 19.5% · MSI 6.90' },
    'New York': { state: 'NY', name: 'New York Metro', msi: 4.35, sqftPrice: '$890', sqftTrend: '+3.2% 1Y', underwater: '1.8%', skew: '-28.0%', activeListings: '24,100', priceCuts: '34.2%', unrealizedLoss: '3.9%', investorListings: '25.4%', deltaUt: '-0.3', deltaUs: '-0.5', rank: '#360 by MSI', buyerMix: '85% Condo · 10% Co-op · 5% Townhouse', hottest: 'Condo $1.2M-$2.5M · 25.4% · MSI 4.90' },
    'Illinois': { state: 'IL', name: 'Chicago Metro', msi: 4.12, sqftPrice: '$285', sqftTrend: '+5.5% 1Y', underwater: '2.1%', skew: '-15.4%', activeListings: '18,400', priceCuts: '31.0%', unrealizedLoss: '4.2%', investorListings: '16.5%', deltaUt: '-0.6', deltaUs: '-0.8', rank: '#410 by MSI', buyerMix: '52% Multi · 48% SF · 0% Inst', hottest: 'Multi $450k-$700k · 16.5% · MSI 4.80' },
    'Tennessee': { state: 'TN', name: 'Kingsport / Nashville', msi: 7.39, sqftPrice: '$182', sqftTrend: '+1.8% 1Y', underwater: '1.8%', skew: '-8.5%', activeListings: '1,746', priceCuts: '50.8%', unrealizedLoss: '5.9%', investorListings: '15.2%', deltaUt: '+1.4', deltaUs: '+1.9', rank: '#19 by MSI', buyerMix: '88% SF · 12% NC · 0% Inst', hottest: 'SFR $150k-$280k · 15.2% · MSI 8.10' },
    'Louisiana': { state: 'LA', name: 'Lafayette / New Orleans', msi: 2.41, sqftPrice: '$165', sqftTrend: '+5.1% 1Y', underwater: '1.2%', skew: '+14.2%', activeListings: '1,699', priceCuts: '18.8%', unrealizedLoss: '4.9%', investorListings: '8.4%', deltaUt: '-1.8', deltaUs: '-2.1', rank: '#892 by MSI', buyerMix: '76% SF · 24% NC · 0% Inst', hottest: 'SFR $220k-$380k · 8.4% · MSI 2.90' },
    'Oregon': { state: 'OR', name: 'Portland / Salem', msi: 5.15, sqftPrice: '$360', sqftTrend: '-3.1% 1Y', underwater: '2.8%', skew: '-21.0%', activeListings: '5,200', priceCuts: '40.2%', unrealizedLoss: '6.1%', investorListings: '14.0%', deltaUt: '-0.3', deltaUs: '-0.2', rank: '#290 by MSI', buyerMix: '70% SF · 25% NC · 5% Inst', hottest: 'SFR $450k-$700k · 14.0% · MSI 5.30' }
  };

  // Color generator based on live Motivated Seller Index (MSI)
  const getStateColor = (stateName) => {
    const meta = stateMeta[stateName];
    const msi = meta ? meta.msi : 4.8;

    if (msi >= 7.0) return '#EF4444'; // Fire Selling (Red)
    if (msi >= 6.0) return '#EC4899'; // High Motivation (Magenta/Pink)
    if (msi >= 5.0) return '#8B5CF6'; // Stubborn/Moderate (Violet)
    if (msi >= 4.0) return '#6366F1'; // Indigo
    return '#2563EB';                 // Neutral/Low Stress (Blue)
  };

  const getRegionDetails = (stateName) => {
    const dbRegion = metrics.regions?.[stateName] || {
      count: 100,
      c1: 42, c2: 36, c3: 4, c4: 18,
      loans: 38, cash: 62,
      totalSat: 420
    };

    const meta = stateMeta[stateName] || {
      state: stateName.substring(0, 2).toUpperCase(),
      name: `${stateName} Market`,
      msi: 5.49,
      sqftPrice: '$310',
      sqftTrend: '-2.2% 1Y',
      underwater: '3.5%',
      skew: '-20.0%',
      activeListings: (dbRegion.count * 45).toLocaleString(),
      priceCuts: '41.3%',
      unrealizedLoss: '6.8%',
      investorListings: '16.5%',
      deltaUt: '-0.1',
      deltaUs: '+0.0',
      rank: '#250 by MSI',
      buyerMix: '70% SF · 25% NC · 5% Inst',
      hottest: 'SFR $300k-$500k · 15% · MSI 5.80'
    };

    const totalCount = dbRegion.count || 100;
    const c1Pct = Math.round(((dbRegion.c1 || 42) / totalCount) * 100);

    return {
      ...meta,
      dbBuyers: dbRegion.count,
      dominantCluster: `C1 Global Investors (${c1Pct}%)`
    };
  };

  const activeRegion = hoveredRegion ? getRegionDetails(hoveredRegion) : null;

  // Smart mouse-aware dynamic positioning: opens Left or Right based on available container space
  const handleRegionMouseMove = (stateName, e) => {
    setHoveredRegion(stateName);
    if (!mapContainerRef.current) return;
    
    const parentRect = mapContainerRef.current.getBoundingClientRect();
    const cursorX = e.clientX - parentRect.left;
    const cursorY = e.clientY - parentRect.top;

    const cardWidth = 340;
    const cardHeight = 270;

    // Check if there is enough space on the right side of the cursor
    const spaceOnRight = parentRect.width - cursorX;
    let posX;
    if (spaceOnRight >= cardWidth + 24) {
      // Plenty of room on right -> open to the RIGHT of mouse
      posX = cursorX + 18;
    } else {
      // Near right edge -> flip to the LEFT of mouse
      posX = cursorX - cardWidth - 18;
    }

    // Clamp horizontally within container bounds
    posX = Math.max(16, Math.min(posX, parentRect.width - cardWidth - 16));

    // Center vertically around the cursor and clamp within container bounds
    let posY = cursorY - cardHeight / 2;
    posY = Math.max(16, Math.min(posY, parentRect.height - cardHeight - 16));

    setTooltipPos({ x: posX, y: posY });
  };

  const handleRegionMouseLeave = () => {
    setHoveredRegion(null);
  };



  return (
    <DashboardLayout title="Parcl HQ" subtitle="Live Real Estate Market Intelligence">
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* 1. HERO TITLE & SEARCH BAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '6px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '38px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-1px', margin: 0, lineHeight: '1.1' }}>
                Parcl HQ
              </h1>
              <p style={{ fontSize: '14px', color: '#94A3B8', margin: '6px 0 0 0' }}>
                Prices, rents, supply, and seller motivation across every US market - updated daily, down to the ZIP code.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', fontSize: '11.5px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>
                <span style={{ color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  Live Supabase Connected • refreshed in real-time
                </span>
                <span>·</span>
                <a href="#national-rankings" style={{ color: '#60A5FA', textDecoration: 'none', cursor: 'pointer' }}>View market rankings ↓</a>
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
                placeholder="Search any market, state, or metro..."
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
              <span style={{ color: '#64748B' }}>Financing Mix </span>
              <span style={{ fontWeight: '700', color: '#60A5FA' }}>{metrics.cashPct}% Cash / {100 - metrics.cashPct}% Loan</span>
            </div>

            <div style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#111827', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#94A3B8' }}>
              AUG 26
            </div>
          </div>

        </div>

        {/* 3. FILTER & METRICS TOGGLE TOOLBAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            <div style={{ display: 'inline-flex', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '2px' }}>
              {['MSI', 'Price Cuts %', 'Unrealized Loss %', 'Relist %'].map((m) => (
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

            <div style={{ padding: '6px 12px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', fontSize: '12px', color: '#CBD5E1' }}>
              Showing <span style={{ fontWeight: 'bold' }}>Current Level</span> ▼
            </div>

          </div>

        </div>

        {/* 4. PRODUCTION-GRADE US CHOROPLETH VECTOR MAP WITH SCROLL-TO-ZOOM */}
        <div
          ref={mapContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            position: 'relative',
            backgroundColor: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            minHeight: '560px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
        >

          {/* Top-Right Zoom Controls */}
          <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 20, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3.5))}
              style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: '#090D16', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
              style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: '#090D16', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              −
            </button>
            <button
              type="button"
              onClick={resetZoom}
              title="Reset Zoom"
              style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: '#090D16', border: '1px solid rgba(255,255,255,0.15)', color: '#94A3B8', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ⟲
            </button>
          </div>

          {/* Transformed Vector Map (Production High-Precision TopoJSON / D3-Geo Albers USA) */}
          <div style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`, transition: isDragging ? 'none' : 'transform 0.15s ease-out', transformOrigin: 'center center' }}>
            <svg width="960" height="500" viewBox="0 0 960 500" style={{ maxWidth: '100%' }}>
              
              {/* 1. All 50 US States Vector Polygons */}
              <g>
                {usMapData.states.map((st) => {
                  const fillColor = getStateColor(st.name);
                  const isHovered = hoveredRegion === st.name;
                  return (
                    <path
                      key={st.fips}
                      d={st.d}
                      fill={fillColor}
                      fillOpacity={isHovered ? 1 : 0.82}
                      stroke={isHovered ? '#60A5FA' : 'rgba(0, 0, 0, 0.4)'}
                      strokeWidth={isHovered ? 2.2 : 0.8}
                      onMouseMove={(e) => handleRegionMouseMove(st.name, e)}
                      onMouseEnter={(e) => handleRegionMouseMove(st.name, e)}
                      onMouseLeave={handleRegionMouseLeave}
                      style={{
                        cursor: 'pointer',
                        transition: 'fill-opacity 0.15s, stroke 0.15s, filter 0.15s',
                        filter: isHovered ? 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))' : 'none'
                      }}
                    />
                  );
                })}
              </g>

              {/* 2. County-Level Mosaic Grid Overlay */}
              {usMapData.countyBordersPath && (
                <path
                  d={usMapData.countyBordersPath}
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.35)"
                  strokeWidth="0.5"
                  pointerEvents="none"
                />
              )}

              {/* 3. State Inner Borders */}
              {usMapData.stateBordersPath && (
                <path
                  d={usMapData.stateBordersPath}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="0.9"
                  pointerEvents="none"
                />
              )}

              {/* 4. Outer Nation Glow Boundary */}
              {usMapData.nationPath && (
                <path
                  d={usMapData.nationPath}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  opacity="0.95"
                  pointerEvents="none"
                />
              )}

            </svg>
          </div>

          {/* DYNAMIC SMART MOUSE-AWARE FLOATING POPOVER (OPENS LEFT OR RIGHT OF CURSOR BASED ON DISPLAY SPACE) */}
          {hoveredRegion && activeRegion && (
            <div
              style={{
                position: 'absolute',
                top: `${tooltipPos.y}px`,
                left: `${tooltipPos.x}px`,
                zIndex: 50,
                width: '340px',
                backgroundColor: 'rgba(5, 7, 13, 0.96)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(59, 130, 246, 0.55)',
                borderRadius: '10px',
                padding: '16px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.85), 0 0 25px rgba(59, 130, 246, 0.3)',
                pointerEvents: 'none',
                transition: 'top 0.08s ease-out, left 0.08s ease-out'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                    {activeRegion.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '19px', fontWeight: '800', color: '#F59E0B' }}>{activeRegion.msi}</span>
                    <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>Motivated Seller Index</span>
                  </div>
                </div>
                <span style={{ fontSize: '11.5px', fontFamily: "'Space Mono', monospace", color: '#64748B', fontWeight: 'bold' }}>{activeRegion.state}</span>
              </div>

              <div style={{ display: 'flex', gap: '12px', fontSize: '10.5px', fontFamily: "'Space Mono', monospace", margin: '8px 0' }}>
                <span style={{ color: '#10B981' }}>▼ {activeRegion.deltaUt} {activeRegion.state}</span>
                <span style={{ color: '#10B981' }}>▼ {activeRegion.deltaUs} US</span>
                <span style={{ color: '#60A5FA' }}>{activeRegion.rank}</span>
              </div>

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
                  <span>Supabase Live Buyers</span>
                  <span style={{ fontWeight: '700', color: '#10B981' }}>{activeRegion.dbBuyers} buyers</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
                  <span>Dominant Buyer Cluster</span>
                  <span style={{ fontWeight: '700', color: '#60A5FA' }}>{activeRegion.dominantCluster}</span>
                </div>
              </div>

              <div style={{ marginTop: '8px', fontSize: '10.5px', color: '#94A3B8', lineHeight: '1.4' }}>
                <div><strong>Mix:</strong> {activeRegion.buyerMix}</div>
                <div><strong>Hottest:</strong> {activeRegion.hottest}</div>
              </div>
            </div>
          )}

          {/* PERSISTENT BOTTOM-LEFT LEGEND CARD (MATCHING PARCL LABS UI) */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 20, backgroundColor: 'rgba(5,7,14,0.92)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 16px', maxWidth: '380px' }}>
            <div style={{ fontSize: '11px', color: '#CBD5E1', marginBottom: '8px', lineHeight: '1.3' }}>
              Showing <strong>Motivated Seller Index</strong> for <strong>all home types</strong> across <strong>metro areas</strong> with <strong>20+ active listings</strong>, at its current level.
            </div>
            
            <div style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
              MOTIVATED SELLER INDEX ⓘ
            </div>

            <div style={{ height: '6px', borderRadius: '3px', background: 'linear-gradient(to right, #2563EB 0%, #8B5CF6 35%, #EC4899 70%, #EF4444 100%)', marginBottom: '6px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', fontFamily: "'Space Mono', monospace" }}>
              <span>Neutral 0-2.5</span>
              <span>Stubborn 2.5-5</span>
              <span>Motivated 5-7.5</span>
              <span>Fire Selling 7.5-10</span>
            </div>

            <div style={{ fontSize: '10px', color: '#64748B', marginTop: '6px', fontFamily: "'Space Mono', monospace" }}>
              ● Updated Aug 26 · Min 20 listings · Methodology
            </div>
          </div>

          {/* BOTTOM-RIGHT WATERMARK & CSV DOWNLOAD */}
          <div style={{ position: 'absolute', bottom: '16px', right: '16px', zIndex: 20, textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.5px', marginBottom: '4px' }}>
              PARCL <span style={{ color: '#3B82F6' }}>HQ</span>
            </div>
            <Link href="/reports" style={{ fontSize: '11px', color: '#64748B', textDecoration: 'none' }}>
              ↓ Download market-level CSV
            </Link>
          </div>

        </div>

        {/* 5. NATIONAL: MOST VS LEAST MOTIVATED METROS */}
        <section id="national-rankings" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '4px' }}>Customize the table below</div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.5px', margin: 0 }}>
                National: Most vs Least Motivated Metros
              </h2>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                Motivated Seller Index, 0 (holding firm) to 10 (fire sale) · 1,000+ listings
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#CBD5E1' }}>
              <div style={{ padding: '6px 12px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px' }}>
                Geography <span style={{ fontWeight: 'bold' }}>Metros</span> ▼
              </div>
              <div style={{ padding: '6px 12px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px' }}>
                Home Types <span style={{ fontWeight: 'bold' }}>Aggregate</span> ▼
              </div>
              <div style={{ padding: '6px 12px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px' }}>
                Show <span style={{ fontWeight: 'bold' }}>Top & bottom 5</span> ▼
              </div>
              <div style={{ padding: '6px 12px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px' }}>
                Min Listings <span style={{ fontWeight: 'bold' }}>1,000+</span> ▼
              </div>
            </div>
          </div>

          {/* 2-Column Ranking Table */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '20px' }}>
            
            {/* COLUMN 1: MOST MOTIVATED */}
            <div style={{ backgroundColor: '#05070E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontSize: '11px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '16px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                MOST MOTIVATED
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Item 1 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>1</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Kingsport, TN <span style={{ color: '#EF4444', fontSize: '11px' }}>▲ 1 7D</span></div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginTop: '2px' }}>
                        50.8% CUTTING · 5.9% MED CUT · 1.8% BELOW · 1,746 LISTINGS
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>7.39</div>
                    <div style={{ fontSize: '10px', color: '#EF4444' }}>Motivated</div>
                  </div>
                </div>

                {/* Item 2 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>2</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Sherman, TX <span style={{ color: '#10B981', fontSize: '11px' }}>▼ 1 7D</span></div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginTop: '2px' }}>
                        54.2% CUTTING · 6.0% MED CUT · 7.9% BELOW · 1,778 LISTINGS
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>7.38</div>
                    <div style={{ fontSize: '10px', color: '#EF4444' }}>Motivated</div>
                  </div>
                </div>

                {/* Item 3 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>3</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Austin, TX</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginTop: '2px' }}>
                        54.1% CUTTING · 5.6% MED CUT · 9.2% BELOW · 18,126 LISTINGS
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>7.29</div>
                    <div style={{ fontSize: '10px', color: '#EF4444' }}>Motivated</div>
                  </div>
                </div>

                {/* Item 4 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>4</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>San Antonio, TX <span style={{ color: '#10B981', fontSize: '11px' }}>▼ 1 7D</span></div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginTop: '2px' }}>
                        54.5% CUTTING · 5.1% MED CUT · 8.0% BELOW · 20,223 LISTINGS
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>7.23</div>
                    <div style={{ fontSize: '10px', color: '#EF4444' }}>Motivated</div>
                  </div>
                </div>

                {/* Item 5 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>5</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Colorado Springs, CO <span style={{ color: '#EF4444', fontSize: '11px' }}>▲ 4 7D</span></div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginTop: '2px' }}>
                        55.0% CUTTING · 4.3% MED CUT · 17.1% BELOW · 5,896 LISTINGS
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>7.23</div>
                    <div style={{ fontSize: '10px', color: '#EF4444' }}>Motivated</div>
                  </div>
                </div>

              </div>
            </div>

            {/* COLUMN 2: LEAST MOTIVATED */}
            <div style={{ backgroundColor: '#05070E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3B82F6', fontSize: '11px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '16px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                LEAST MOTIVATED
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Item 1 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>1</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Lafayette, LA <span style={{ color: '#10B981', fontSize: '11px' }}>▲ 3 7D</span></div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginTop: '2px' }}>
                        18.8% CUTTING · 4.9% MED CUT · 5.1% BELOW · 1,699 LISTINGS
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>2.41</div>
                    <div style={{ fontSize: '10px', color: '#3B82F6' }}>Neutral</div>
                  </div>
                </div>

                {/* Item 2 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>2</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Rochester, NY <span style={{ color: '#EF4444', fontSize: '11px' }}>▼ 1 7D</span></div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginTop: '2px' }}>
                        16.9% CUTTING · 7.0% MED CUT · 4.5% BELOW · 3,391 LISTINGS
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>2.42</div>
                    <div style={{ fontSize: '10px', color: '#3B82F6' }}>Neutral</div>
                  </div>
                </div>

                {/* Item 3 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>3</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Atlantic City, NJ <span style={{ color: '#EF4444', fontSize: '11px' }}>▼ 1 7D</span></div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginTop: '2px' }}>
                        19.4% CUTTING · 5.0% MED CUT · 2.0% BELOW · 1,239 LISTINGS
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>2.47</div>
                    <div style={{ fontSize: '10px', color: '#3B82F6' }}>Neutral</div>
                  </div>
                </div>

                {/* Item 4 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>4</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Lincoln, NE <span style={{ color: '#EF4444', fontSize: '11px' }}>▼ 1 7D</span></div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginTop: '2px' }}>
                        22.0% CUTTING · 3.1% MED CUT · 2.8% BELOW · 1,531 LISTINGS
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>2.53</div>
                    <div style={{ fontSize: '10px', color: '#8B5CF6' }}>Stubborn</div>
                  </div>
                </div>

                {/* Item 5 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>5</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Hartford, CT</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginTop: '2px' }}>
                        20.1% CUTTING · 5.7% MED CUT · 1.6% BELOW · 3,282 LISTINGS
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>3.00</div>
                    <div style={{ fontSize: '10px', color: '#8B5CF6' }}>Stubborn</div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.5', marginTop: '6px' }}>
            How those ranks work: markets are ordered by Motivated Seller Index within the exact filters above (market type, listing tier, listings floor, state). Most Motivated counts from the hottest market (#1 = highest MSI); Least Motivated counts from the coolest (#1 = lowest MSI). ▲▼ show each market's 7-day move toward or away from #1 of its own column.
          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}
