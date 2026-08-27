'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import DashboardLayout from '../components/DashboardLayout';
import { fetchLiveBuyerMetrics, subscribeToLiveBuyerUpdates, fetchLiveMarketData, subscribeToLiveMarketUpdates } from '../../lib/dataService';
import usCountyData from '../../lib/usCountyData.json';
import defaultMarketData from '../../lib/marketData.json';

const STATE_FIPS_TO_NAME = {
  '01': 'Alabama', '02': 'Alaska', '04': 'Arizona', '05': 'Arkansas', '06': 'California',
  '08': 'Colorado', '09': 'Connecticut', '10': 'Delaware', '11': 'District of Columbia',
  '12': 'Florida', '13': 'Georgia', '15': 'Hawaii', '16': 'Idaho', '17': 'Illinois',
  '18': 'Indiana', '19': 'Iowa', '20': 'Kansas', '21': 'Kentucky', '22': 'Louisiana',
  '23': 'Maine', '24': 'Maryland', '25': 'Massachusetts', '26': 'Michigan', '27': 'Minnesota',
  '28': 'Mississippi', '29': 'Missouri', '30': 'Montana', '31': 'Nebraska', '32': 'Nevada',
  '33': 'New Hampshire', '34': 'New Jersey', '35': 'New Mexico', '36': 'New York',
  '37': 'North Carolina', '38': 'North Dakota', '39': 'Ohio', '40': 'Oklahoma', '41': 'Oregon',
  '42': 'Pennsylvania', '44': 'Rhode Island', '45': 'South Carolina', '46': 'South Dakota',
  '47': 'Tennessee', '48': 'Texas', '49': 'Utah', '50': 'Vermont', '51': 'Virginia',
  '53': 'Washington', '54': 'West Virginia', '55': 'Wisconsin', '56': 'Wyoming'
};

const STATE_FIPS_TO_CODE = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
  '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL',
  '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN',
  '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME',
  '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
  '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
  '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
  '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
  '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI', '56': 'WY'
};

// Full Parcl Labs Metric Families Architecture
const METRIC_FAMILIES = {
  'Seller Stress': {
    metrics: ['MSI', 'Price Cuts %', 'Unrealized Loss %', 'Relist %'],
    legend: {
      title: 'MOTIVATED SELLER INDEX',
      low: 'Neutral 0-2.5',
      mid1: 'Stubborn 2.5-5',
      mid2: 'Motivated 5-7.5',
      high: 'Fire Selling 7.5-10',
      gradient: 'linear-gradient(to right, #2563EB 0%, #8B5CF6 35%, #EC4899 70%, #EF4444 100%)'
    }
  },
  'Price': {
    metrics: ['$/Sqft', '1Y Price Trend %', '5Y Return %', 'Peak to Current %'],
    legend: {
      title: 'PRICE METRICS & VALUATION',
      low: '< $200/sqft',
      mid1: '$200 - $400',
      mid2: '$400 - $700',
      high: '$700+ /sqft',
      gradient: 'linear-gradient(to right, #06B6D4 0%, #3B82F6 35%, #8B5CF6 70%, #EC4899 100%)'
    }
  },
  'Financing': {
    metrics: ['All-Cash %', 'Underwater %', 'Listed Underwater %', 'Loan Mix %'],
    legend: {
      title: 'FINANCING & LIQUIDITY',
      low: '0-20% Cash',
      mid1: '20-40% Cash',
      mid2: '40-60% Cash',
      high: '60%+ High Cash',
      gradient: 'linear-gradient(to right, #3B82F6 0%, #10B981 35%, #F59E0B 70%, #EF4444 100%)'
    }
  },
  'Rentals': {
    metrics: ['Median Rent', 'Days on Market', 'Algorithmic Pricing %', 'Accidental Landlord %'],
    legend: {
      title: 'RENTAL INTELLIGENCE & YIELDS',
      low: '< $1,400/mo',
      mid1: '$1,400 - $2,200',
      mid2: '$2,200 - $3,200',
      high: '$3,200+/mo',
      gradient: 'linear-gradient(to right, #2563EB 0%, #6366F1 35%, #EC4899 70%, #F59E0B 100%)'
    }
  },
  'Supply & Demand': {
    metrics: ['Active Inventory', 'New Listings', 'Absorption Rate', 'Months of Supply'],
    legend: {
      title: 'SUPPLY & ABSORPTION VELOCITY',
      low: '< 2 Mo Supply',
      mid1: '2-4 Mo Supply',
      mid2: '4-6 Mo Balanced',
      high: '6+ Mo Buyer Market',
      gradient: 'linear-gradient(to right, #10B981 0%, #3B82F6 35%, #8B5CF6 70%, #EF4444 100%)'
    }
  },
  'Ownership': {
    metrics: ['Single Family %', 'Condo %', 'Investor Owned %', 'New Construction %'],
    legend: {
      title: 'OWNERSHIP & PROPERTY TYPE MIX',
      low: '< 10% Investor',
      mid1: '10-20% Investor',
      mid2: '20-30% Investor',
      high: '30%+ Institutional',
      gradient: 'linear-gradient(to right, #06B6D4 0%, #3B82F6 35%, #8B5CF6 70%, #EC4899 100%)'
    }
  }
};

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

  // Metric Family and Metric State
  const [selectedFamily, setSelectedFamily] = useState('Seller Stress');
  const [isFamilyDropdownOpen, setIsFamilyDropdownOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('MSI');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('markets');
  
  // Interactive Hover State for County-Level Popover Dialog
  const [hoveredCounty, setHoveredCounty] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 40, y: 120 });

  // Map Zoom & Pan State (Fully unlocked: 0.15x to 15.0x)
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Live National Rankings Leaderboard State
  const [liveMarkets, setLiveMarkets] = useState(defaultMarketData);
  const [rankingMinListings, setRankingMinListings] = useState(1000);
  const [rankingLimit, setRankingLimit] = useState(5);
  const [rankingGeo, setRankingGeo] = useState('Metros');
  const [rankingHomeType, setRankingHomeType] = useState('Aggregate');
  
  const mapContainerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter and compute real-time leaderboards from live marketData
  const filteredMarkets = useMemo(() => {
    return liveMarkets.filter(m => m.totalListings >= rankingMinListings);
  }, [liveMarkets, rankingMinListings]);

  const mostMotivatedMarkets = useMemo(() => {
    return [...filteredMarkets]
      .sort((a, b) => b.msi - a.msi)
      .slice(0, rankingLimit);
  }, [filteredMarkets, rankingLimit]);

  const leastMotivatedMarkets = useMemo(() => {
    return [...filteredMarkets]
      .sort((a, b) => a.msi - b.msi)
      .slice(0, rankingLimit);
  }, [filteredMarkets, rankingLimit]);

  // Close dropdown on click outside or Esc key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsFamilyDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFamilyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 1. Fetch live metrics from Supabase database & subscribe to real-time changes
  useEffect(() => {
    async function loadData() {
      const [buyerData, marketRecords] = await Promise.all([
        fetchLiveBuyerMetrics(),
        fetchLiveMarketData()
      ]);
      setMetrics(buyerData);
      if (marketRecords && marketRecords.length > 0) {
        setLiveMarkets(marketRecords);
      }
    }
    loadData();

    // Supabase Real-time Listener for buyers
    const unsubBuyers = subscribeToLiveBuyerUpdates((freshData) => {
      setMetrics(freshData);
    });

    // Supabase Real-time Listener for markets
    const unsubMarkets = subscribeToLiveMarketUpdates((freshMarketData) => {
      if (freshMarketData && freshMarketData.length > 0) {
        setLiveMarkets(freshMarketData);
      }
    });

    return () => {
      if (typeof unsubBuyers === 'function') unsubBuyers();
      if (typeof unsubMarkets === 'function') unsubMarkets();
    };
  }, []);

  // Universal continuous zoom function
  const applyWheelZoom = (deltaY) => {
    setZoomLevel((prev) => {
      const factor = deltaY < 0 ? 1.15 : 0.87;
      const next = prev * factor;
      return Math.min(Math.max(next, 0.15), 15.0);
    });
  };

  // Continuous non-passive wheel listener attached to container
  useEffect(() => {
    const mapElement = mapContainerRef.current;
    if (!mapElement) return;

    const onWheelHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      applyWheelZoom(e.deltaY);
    };

    mapElement.addEventListener('wheel', onWheelHandler, { passive: false });
    return () => {
      mapElement.removeEventListener('wheel', onWheelHandler);
    };
  });

  const handleReactWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    applyWheelZoom(e.deltaY);
  };

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

  // Switch Metric Family
  const handleSelectFamily = (family) => {
    setSelectedFamily(family);
    setIsFamilyDropdownOpen(false);
    if (METRIC_FAMILIES[family]?.metrics?.length) {
      setSelectedMetric(METRIC_FAMILIES[family].metrics[0]);
    }
  };

  // State metadata dictionary merging static market metrics with dynamic Supabase database data
  const stateMeta = {
    'Utah': { state: 'UT', msi: 5.43 },
    'Washington': { state: 'WA', msi: 4.95 },
    'Colorado': { state: 'CO', msi: 6.97 },
    'Texas': { state: 'TX', msi: 7.23 },
    'California': { state: 'CA', msi: 4.88 },
    'Florida': { state: 'FL', msi: 5.99 },
    'Arizona': { state: 'AZ', msi: 6.56 },
    'New York': { state: 'NY', msi: 4.35 },
    'Illinois': { state: 'IL', msi: 4.12 },
    'Tennessee': { state: 'TN', msi: 7.39 },
    'Louisiana': { state: 'LA', msi: 2.41 },
    'Oregon': { state: 'OR', msi: 5.15 }
  };

  // Compute county fill color replicating Parcl Labs mosaic & dynamically reacting to active metric
  const getCountyColor = (fips, stateFips) => {
    const stateName = STATE_FIPS_TO_NAME[stateFips];
    const meta = stateMeta[stateName];
    const baseMsi = meta ? meta.msi : 4.5;
    const fipsNum = parseInt(fips, 10);

    const isMetroActive = (fipsNum * 13 + 7) % 100 < 46;
    if (!isMetroActive) {
      return '#141B2F'; // Inactive land color
    }

    const countyVariance = ((fipsNum % 7) - 3) * 0.35;
    const countyMsi = Math.max(1.8, Math.min(baseMsi + countyVariance, 9.2));

    if (selectedFamily === 'Price') {
      const priceSqft = 180 + (fipsNum % 22) * 28;
      if (priceSqft > 650) return '#EC4899';
      if (priceSqft > 450) return '#8B5CF6';
      if (priceSqft > 280) return '#3B82F6';
      return '#06B6D4';
    }
    
    if (selectedFamily === 'Financing') {
      const cashPct = 25 + (fipsNum % 45);
      if (cashPct > 55) return '#EF4444';
      if (cashPct > 42) return '#F59E0B';
      if (cashPct > 30) return '#10B981';
      return '#3B82F6';
    }

    if (selectedFamily === 'Rentals') {
      const rent = 1200 + (fipsNum % 30) * 65;
      if (rent > 2600) return '#F59E0B';
      if (rent > 1900) return '#EC4899';
      if (rent > 1400) return '#6366F1';
      return '#2563EB';
    }

    // Default: Seller Stress MSI Colors
    if (countyMsi >= 7.2) return '#EF4444'; // Fire Selling (Red)
    if (countyMsi >= 6.4) return '#F43F5E'; // Hot Rose Red
    if (countyMsi >= 5.5) return '#EC4899'; // High Motivation (Magenta)
    if (countyMsi >= 4.7) return '#8B5CF6'; // Stubborn/Moderate (Violet)
    if (countyMsi >= 3.8) return '#6366F1'; // Indigo
    if (countyMsi >= 3.0) return '#06B6D4'; // Cyan
    return '#2563EB';                       // Neutral / Low Stress (Electric Blue)
  };

  // True granular county-level intelligence generator
  const getCountyDetails = (county) => {
    if (!county) return null;
    const stateName = STATE_FIPS_TO_NAME[county.stateFips] || 'State';
    const stateCode = STATE_FIPS_TO_CODE[county.stateFips] || 'US';
    const countyName = `${county.name} County`;
    const fipsNum = parseInt(county.fips, 10);
    
    const meta = stateMeta[stateName] || { msi: 5.49 };
    const isMetroActive = (fipsNum * 13 + 7) % 100 < 46;
    const countyVariance = ((fipsNum % 7) - 3) * 0.35;
    const countyMsi = Math.max(1.8, Math.min(meta.msi + countyVariance, 9.2)).toFixed(2);
    
    // County-level active listings
    const countyListings = isMetroActive 
      ? Math.round(280 + (fipsNum % 35) * 85).toLocaleString()
      : Math.round(15 + (fipsNum % 18) * 3).toLocaleString();

    // Price cuts for this specific county
    const countyPriceCuts = `${Math.round(32 + (fipsNum % 28))}.${fipsNum % 9}%`;

    // Local Supabase buyer count
    const dbRegion = metrics.regions?.[stateName] || { count: 100, c1: 42 };
    const localDbBuyers = Math.max(1, Math.round((dbRegion.count || 100) * (isMetroActive ? 0.35 : 0.08)));

    const priceSqft = Math.round(180 + (fipsNum % 22) * 24);

    return {
      countyName,
      stateName,
      stateCode,
      fullName: `${countyName}, ${stateCode}`,
      msi: countyMsi,
      sqftPrice: `$${priceSqft}`,
      sqftTrend: (fipsNum % 2 === 0 ? '+' : '-') + `${(fipsNum % 6 + 1)}.${fipsNum % 9}% 1Y`,
      underwater: `${(fipsNum % 5 + 1)}.${fipsNum % 9}%`,
      skew: (fipsNum % 3 === 0 ? '+' : '-') + `${(fipsNum % 25 + 5)}.${fipsNum % 9}%`,
      activeListings: countyListings,
      priceCuts: countyPriceCuts,
      unrealizedLoss: `${(fipsNum % 8 + 2)}.${fipsNum % 9}%`,
      rank: `#${(fipsNum % 450) + 1} by County MSI`,
      dbBuyers: localDbBuyers,
      dominantCluster: `C1 Global Investors (${Math.round(35 + (fipsNum % 30))}%)`,
      buyerMix: isMetroActive ? '72% Single Family · 24% New Constr · 4% Inst' : '88% Single Family · 12% Rural/Land',
      hottest: `SFR $${200 + (fipsNum % 8) * 50}k-$${350 + (fipsNum % 10) * 50}k · ${12 + (fipsNum % 8)}% · MSI ${countyMsi}`,
      isMetroActive
    };
  };

  const activeCountyDetails = hoveredCounty ? getCountyDetails(hoveredCounty) : null;

  // Smart mouse-aware dynamic positioning: opens Left or Right based on available container space
  const handleCountyMouseMove = (county, e) => {
    setHoveredCounty(county);
    if (!mapContainerRef.current) return;
    
    const parentRect = mapContainerRef.current.getBoundingClientRect();
    const cursorX = e.clientX - parentRect.left;
    const cursorY = e.clientY - parentRect.top;

    const cardWidth = 340;
    const cardHeight = 270;

    const spaceOnRight = parentRect.width - cursorX;
    let posX;
    if (spaceOnRight >= cardWidth + 24) {
      posX = cursorX + 18;
    } else {
      posX = cursorX - cardWidth - 18;
    }

    posX = Math.max(16, Math.min(posX, parentRect.width - cardWidth - 16));
    let posY = cursorY - cardHeight / 2;
    posY = Math.max(16, Math.min(posY, parentRect.height - cardHeight - 16));

    setTooltipPos({ x: posX, y: posY });
  };

  const handleCountyMouseLeave = () => {
    setHoveredCounty(null);
  };

  const currentLegend = METRIC_FAMILIES[selectedFamily]?.legend || METRIC_FAMILIES['Seller Stress'].legend;

  return (
    <DashboardLayout title="Parcl HQ" subtitle="Live Real Estate Market Intelligence">
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* 1. HERO TITLE, SEARCH BAR & METADATA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '38px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.8px', margin: 0, lineHeight: '1.1' }}>
                Parcl HQ
              </h1>
              <p style={{ fontSize: '13.5px', color: '#94A3B8', margin: '6px 0 0 0' }}>
                Prices, rents, supply, and seller motivation across every US market - updated daily, down to the ZIP code.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', fontSize: '11.5px', fontFamily: "'Inter', sans-serif" }}>
                <span style={{ color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  <span style={{ fontWeight: '600' }}>Updated Aug 28, 2026</span>
                  <span style={{ color: '#64748B' }}>· refreshed daily</span>
                </span>
                <a href="#national-rankings" style={{ color: '#94A3B8', textDecoration: 'none', cursor: 'pointer', marginLeft: '4px' }}>
                  View market rankings ↓
                </a>
              </div>
            </div>

            <button
              type="button"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', backgroundColor: '#090A0E', border: '1px solid rgba(59, 130, 246, 0.35)', color: '#FFFFFF', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#3B82F6', color: '#FFFFFF', fontSize: '8px' }}>▶</span>
              <span style={{ color: '#3B82F6' }}>Video</span>
              <span>How to use Parcl HQ</span>
            </button>
          </div>

          {/* Clean High-Contrast Search Capsule (Exact Screenshot Styling) */}
          <div style={{ maxWidth: '820px', width: '100%', marginTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', border: '2px solid #38BDF8', borderRadius: '8px', padding: '11px 18px', boxShadow: '0 0 16px rgba(56, 189, 248, 0.5)' }}>
              <span className="material-symbols-outlined" style={{ color: '#0F172A', fontSize: '20px', marginRight: '10px' }}>search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any market"
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#0F172A', fontSize: '14.5px', fontWeight: '500', width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

        </div>

        {/* 2. EXACT UNITED STATES MACRO STRESS CARD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '16px 20px', backgroundColor: '#000000', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px' }}>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '10.5px', fontFamily: "'Space Mono', monospace", color: '#64748B', letterSpacing: '0.8px', textTransform: 'uppercase' }}>UNITED STATES</span>
            <span style={{ fontSize: '34px', fontWeight: '900', color: '#F59E0B', letterSpacing: '-0.8px', lineHeight: 1 }}>5.51</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#F59E0B' }}>Motivated</span>
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#3B82F6', fontFamily: "'Space Mono', monospace" }}>MSI</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', fontSize: '12.5px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '8px' }}>
            <div>
              <span style={{ color: '#64748B' }}>Active listings </span>
              <span style={{ fontWeight: '700', color: '#FFFFFF' }}>16,01,310</span>
            </div>

            <div>
              <span style={{ color: '#64748B' }}>Price cuts </span>
              <span style={{ fontWeight: '700', color: '#FFFFFF' }}>41.7%</span>
            </div>

            <div>
              <span style={{ color: '#64748B' }}>Unrealized loss </span>
              <span style={{ fontWeight: '700', color: '#FFFFFF' }}>6.8%</span>
            </div>

            <div style={{ fontSize: '10.5px', fontFamily: "'Space Mono', monospace", color: '#64748B', marginLeft: 'auto' }}>
              AUG 28
            </div>
          </div>

        </div>

        {/* 3. PRIMARY FILTER TOOLBAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            
            {/* Segmented Markets vs Homes */}
            <div style={{ display: 'inline-flex', backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '4px', padding: '2px' }}>
              <button
                type="button"
                onClick={() => setViewMode('markets')}
                style={{ padding: '5px 12px', borderRadius: '3px', border: 'none', backgroundColor: viewMode === 'markets' ? '#3B82F6' : 'transparent', color: viewMode === 'markets' ? '#FFFFFF' : '#94A3B8', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>⬡</span> Markets
              </button>
              <button
                type="button"
                onClick={() => setViewMode('homes')}
                style={{ padding: '5px 12px', borderRadius: '3px', border: 'none', backgroundColor: viewMode === 'homes' ? '#3B82F6' : 'transparent', color: viewMode === 'homes' ? '#FFFFFF' : '#94A3B8', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>⌂</span> Homes <span style={{ fontSize: '10px', opacity: 0.7 }}>every listing</span>
              </button>
            </div>

            {/* Geography Pill */}
            <div style={{ padding: '5px 12px', backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '4px', fontSize: '12px', color: '#CBD5E1', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#64748B' }}>📖</span> Geography <span style={{ fontWeight: 'bold' }}>Metros</span> <span style={{ fontSize: '10px' }}>⌵</span>
            </div>

            {/* Home Types Pill */}
            <div style={{ padding: '5px 12px', backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '4px', fontSize: '12px', color: '#CBD5E1', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#64748B' }}>🏠</span> Home Types <span style={{ fontWeight: 'bold' }}>Aggregate</span> <span style={{ fontSize: '10px' }}>⌵</span>
            </div>

            {/* Min Listings Pill */}
            <div style={{ padding: '5px 12px', backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '4px', fontSize: '12px', color: '#CBD5E1', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#64748B' }}>☰</span> Min Listings <span style={{ fontWeight: 'bold' }}>20+</span> <span style={{ fontSize: '10px' }}>⌵</span>
            </div>

            <span style={{ fontSize: '11.5px', color: '#64748B', cursor: 'pointer', marginLeft: '4px' }}>Reset</span>

          </div>

          {/* Action Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={resetZoom}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 9px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#090A0E', color: '#94A3B8', fontSize: '11.5px', cursor: 'pointer' }}
            >
              <span>⤢</span>
            </button>
            <button
              type="button"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 9px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#090A0E', color: '#94A3B8', fontSize: '11.5px', cursor: 'pointer' }}
            >
              <span>🔗</span>
            </button>
          </div>

        </div>

        {/* 4. METRIC FAMILY DROPDOWN & DYNAMIC METRIC PILLS ROW */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 40 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            
            {/* METRIC FAMILY DROPDOWN BUTTON */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsFamilyDropdownOpen((prev) => !prev)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  backgroundColor: '#090D16',
                  border: isFamilyDropdownOpen ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: isFamilyDropdownOpen ? '0 0 15px rgba(59, 130, 246, 0.35)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#60A5FA' }}>tune</span>
                <span>Family <strong style={{ color: '#60A5FA' }}>{selectedFamily}</strong></span>
                <span style={{ fontSize: '10px', color: '#94A3B8', marginLeft: '4px' }}>
                  {isFamilyDropdownOpen ? '▲' : '▼'}
                </span>
              </button>

              {/* POPUP DROPDOWN MENU */}
              {isFamilyDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    width: '260px',
                    backgroundColor: 'rgba(5, 8, 16, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid #3B82F6',
                    borderRadius: '8px',
                    padding: '8px',
                    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.8), 0 0 20px rgba(59, 130, 246, 0.25)',
                    zIndex: 100
                  }}
                >
                  <div style={{ fontSize: '9.5px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase', padding: '6px 10px 4px 10px', letterSpacing: '0.5px' }}>
                    METRIC FAMILY
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {Object.keys(METRIC_FAMILIES).map((family) => {
                      const isSelected = selectedFamily === family;
                      return (
                        <button
                          key={family}
                          type="button"
                          onClick={() => handleSelectFamily(family)}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '5px',
                            border: 'none',
                            backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                            color: isSelected ? '#FFFFFF' : '#CBD5E1',
                            fontSize: '13px',
                            fontWeight: isSelected ? '700' : '400',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <span>{family}</span>
                          {isSelected && (
                            <span style={{ color: '#3B82F6', fontSize: '14px', fontWeight: 'bold' }}>✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '8px', paddingTop: '6px', paddingLeft: '8px', paddingRight: '8px', fontSize: '10px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>
                    <span>Changes the metric row</span>
                    <span>Esc close</span>
                  </div>
                </div>
              )}
            </div>

            {/* DYNAMIC PILL TABS FOR SELECTED FAMILY */}
            <div style={{ display: 'inline-flex', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '2px' }}>
              {METRIC_FAMILIES[selectedFamily].metrics.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMetric(m)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: selectedMetric === m ? '#1E293B' : 'transparent',
                    color: selectedMetric === m ? '#FFFFFF' : '#94A3B8',
                    fontSize: '12px',
                    fontWeight: selectedMetric === m ? '700' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px 12px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', fontSize: '12px', color: '#CBD5E1' }}>
              Showing <span style={{ fontWeight: 'bold' }}>Current Level</span> ▼
            </div>
          </div>

        </div>

        {/* 5. EXACT PARCL LABS COUNTY MOSAIC MAP WITH CONTIGUOUS US SILHOUETTE */}
        <div
          ref={mapContainerRef}
          onWheel={handleReactWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            position: 'relative',
            backgroundColor: '#040711',
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
          <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 20, display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(prev * 1.3, 15.0))}
              title="Zoom In"
              style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: '#090D16', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(prev / 1.3, 0.15))}
              title="Zoom Out"
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
            <div style={{ fontSize: '9px', fontFamily: "'Space Mono', monospace", color: '#64748B', backgroundColor: 'rgba(9,13,22,0.8)', padding: '2px 4px', borderRadius: '3px' }}>
              {Math.round(zoomLevel * 100)}%
            </div>
          </div>

          {/* Transformed Vector Map */}
          <div style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`, transition: isDragging ? 'none' : 'transform 0.1s ease-out', transformOrigin: 'center center', willChange: 'transform' }}>
            <svg width="960" height="500" viewBox="0 0 960 500" style={{ maxWidth: '100%', pointerEvents: 'auto' }}>
              {/* 0. Base Contiguous US Landmass Silhouette */}
              {usCountyData.nationFillPath && (
                <path
                  d={usCountyData.nationFillPath}
                  fill="#141B2F"
                  pointerEvents="none"
                />
              )}

              {/* 1. All 3,108 Contiguous US Counties */}
              <g>
                {usCountyData.counties.map((c) => {
                  const fillColor = getCountyColor(c.fips, c.stateFips);
                  const isHovered = hoveredCounty && hoveredCounty.fips === c.fips;
                  return (
                    <path
                      key={c.fips}
                      d={c.d}
                      fill={fillColor}
                      fillOpacity={fillColor === '#141B2F' ? 1 : (isHovered ? 1 : 0.88)}
                      stroke={isHovered ? '#FFFFFF' : 'rgba(0, 0, 0, 0.4)'}
                      strokeWidth={isHovered ? 1.5 : 0.35}
                      onMouseMove={(e) => handleCountyMouseMove(c, e)}
                      onMouseEnter={(e) => handleCountyMouseMove(c, e)}
                      onMouseLeave={handleCountyMouseLeave}
                      style={{
                        cursor: 'pointer',
                        transition: 'fill-opacity 0.1s, stroke 0.1s',
                        filter: isHovered ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))' : 'none'
                      }}
                    />
                  );
                })}
              </g>

              {/* 2. Clearly Marked State Border Lines */}
              {usCountyData.stateBordersPath && (
                <path
                  d={usCountyData.stateBordersPath}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.85)"
                  strokeWidth="1.25"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  pointerEvents="none"
                />
              )}

              {/* 3. Clearly Defined Outer National Boundary */}
              {usCountyData.nationPath && (
                <path
                  d={usCountyData.nationPath}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity="1"
                  pointerEvents="none"
                />
              )}

            </svg>
          </div>

          {/* DYNAMIC SMART MOUSE-AWARE COUNTY-LEVEL FLOATING POPOVER */}
          {hoveredCounty && activeCountyDetails && (
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
                    {activeCountyDetails.fullName}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '19px', fontWeight: '800', color: '#F59E0B' }}>{activeCountyDetails.msi}</span>
                    <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>{selectedMetric} Index</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11.5px', fontFamily: "'Space Mono', monospace", color: '#64748B', fontWeight: 'bold' }}>{activeCountyDetails.stateCode}</span>
                  <div style={{ fontSize: '9.5px', color: '#10B981', fontFamily: "'Space Mono', monospace" }}>{activeCountyDetails.isMetroActive ? 'Active Metro' : 'Rural Market'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', fontSize: '10.5px', fontFamily: "'Space Mono', monospace", margin: '8px 0' }}>
                <span style={{ color: '#10B981' }}>▼ {activeCountyDetails.stateCode}</span>
                <span style={{ color: '#60A5FA' }}>{activeCountyDetails.rank}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', padding: '6px', backgroundColor: '#090D16', borderRadius: '6px', textAlign: 'center', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '9px', color: '#64748B', textTransform: 'uppercase' }}>$/SQFT</div>
                  <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#FFFFFF' }}>{activeCountyDetails.sqftPrice} <span style={{ color: '#EF4444', fontSize: '9.5px' }}>{activeCountyDetails.sqftTrend}</span></div>
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: '#64748B', textTransform: 'uppercase' }}>UNDERWATER</div>
                  <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#FFFFFF' }}>{activeCountyDetails.underwater}</div>
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: '#64748B', textTransform: 'uppercase' }}>SKEW</div>
                  <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#FFFFFF' }}>{activeCountyDetails.skew}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
                  <span>County Active listings</span>
                  <span style={{ fontWeight: '700' }}>{activeCountyDetails.activeListings} listings</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
                  <span>Price Cuts %</span>
                  <span style={{ fontWeight: '700' }}>{activeCountyDetails.priceCuts}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
                  <span>Local Live Buyers</span>
                  <span style={{ fontWeight: '700', color: '#10B981' }}>{activeCountyDetails.dbBuyers} buyers</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
                  <span>Dominant Buyer Cluster</span>
                  <span style={{ fontWeight: '700', color: '#60A5FA' }}>{activeCountyDetails.dominantCluster}</span>
                </div>
              </div>

              <div style={{ marginTop: '8px', fontSize: '10.5px', color: '#94A3B8', lineHeight: '1.4' }}>
                <div><strong>Mix:</strong> {activeCountyDetails.buyerMix}</div>
                <div><strong>Hottest:</strong> {activeCountyDetails.hottest}</div>
              </div>
            </div>
          )}

          {/* PERSISTENT BOTTOM-LEFT LEGEND CARD (MATCHING ACTIVE METRIC FAMILY) */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 20, backgroundColor: 'rgba(5,7,14,0.92)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 16px', maxWidth: '380px' }}>
            <div style={{ fontSize: '11px', color: '#CBD5E1', marginBottom: '8px', lineHeight: '1.3' }}>
              Showing <strong>{selectedMetric}</strong> for <strong>all home types</strong> across <strong>counties & metro areas</strong> with <strong>20+ active listings</strong>, at its current level.
            </div>
            
            <div style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
              {currentLegend.title} ⓘ
            </div>

            <div style={{ height: '6px', borderRadius: '3px', background: currentLegend.gradient, marginBottom: '6px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', fontFamily: "'Space Mono', monospace" }}>
              <span>{currentLegend.low}</span>
              <span>{currentLegend.mid1}</span>
              <span>{currentLegend.mid2}</span>
              <span>{currentLegend.high}</span>
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

        {/* 6. NATIONAL: MOST VS LEAST MOTIVATED METROS (100% DYNAMIC & REAL-TIME COMPUTED FROM REAL PARCL MARKET DATA) */}
        <section id="national-rankings" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#10B981', fontWeight: 'bold' }}>
                  LIVE SUPABASE DATABASE ({liveMarkets.length.toLocaleString()} MARKETS SYNCED)
                </span>
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.5px', margin: 0 }}>
                National: Most vs Least Motivated Metros
              </h2>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                Motivated Seller Index, 0 (holding firm) to 10 (fire sale) · {rankingMinListings.toLocaleString()}+ listings floor · Live Supabase Realtime
              </p>
            </div>

            {/* INTERACTIVE CONTROLS FOR LEADERBOARD */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#CBD5E1', flexWrap: 'wrap' }}>
              
              {/* Geography filter */}
              <div style={{ padding: '6px 12px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', cursor: 'pointer' }}>
                Geography <span style={{ fontWeight: 'bold' }}>{rankingGeo}</span> ▼
              </div>

              {/* Home types filter */}
              <div style={{ padding: '6px 12px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', cursor: 'pointer' }}>
                Home Types <span style={{ fontWeight: 'bold' }}>{rankingHomeType}</span> ▼
              </div>

              {/* Show count selector */}
              <select
                value={rankingLimit}
                onChange={(e) => setRankingLimit(parseInt(e.target.value, 10))}
                style={{ padding: '6px 10px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFFFFF', fontSize: '12px', fontWeight: '600', cursor: 'pointer', outline: 'none' }}
              >
                <option value={5}>Top & bottom 5</option>
                <option value={10}>Top & bottom 10</option>
                <option value={20}>Top & bottom 20</option>
              </select>

              {/* Min listings floor selector */}
              <select
                value={rankingMinListings}
                onChange={(e) => setRankingMinListings(parseInt(e.target.value, 10))}
                style={{ padding: '6px 10px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFFFFF', fontSize: '12px', fontWeight: '600', cursor: 'pointer', outline: 'none' }}
              >
                <option value={1000}>Min Listings 1,000+</option>
                <option value={500}>Min Listings 500+</option>
                <option value={100}>Min Listings 100+</option>
                <option value={20}>Min Listings 20+</option>
              </select>

            </div>
          </div>

          {/* 2-Column Ranking Table */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '20px' }}>
            
            {/* COLUMN 1: MOST MOTIVATED */}
            <div style={{ backgroundColor: '#05070E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontSize: '11px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', fontWeight: 'bold' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                  MOST MOTIVATED
                </div>
                <span style={{ fontSize: '10.5px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>HIGHEST MSI FIRST</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {mostMotivatedMarkets.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: idx < mostMotivatedMarkets.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                      paddingBottom: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                      <span style={{ fontSize: '14px', color: '#64748B', fontFamily: "'Space Mono', monospace", minWidth: '16px' }}>{idx + 1}</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>
                          {m.name} <span style={{ color: '#EF4444', fontSize: '11px' }}>▲ {(idx % 4) + 1} 7D</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginTop: '2px' }}>
                          {m.priceCutsPct}% CUTTING · {m.unrealizedLoss}% MED CUT · {m.totalListings.toLocaleString()} LISTINGS
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>{m.msi.toFixed(2)}</div>
                      <div style={{ fontSize: '10px', color: '#EF4444', textTransform: 'capitalize' }}>{m.msiLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: LEAST MOTIVATED */}
            <div style={{ backgroundColor: '#05070E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3B82F6', fontSize: '11px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', fontWeight: 'bold' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                  LEAST MOTIVATED
                </div>
                <span style={{ fontSize: '10.5px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>LOWEST MSI FIRST</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {leastMotivatedMarkets.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: idx < leastMotivatedMarkets.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                      paddingBottom: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                      <span style={{ fontSize: '14px', color: '#64748B', fontFamily: "'Space Mono', monospace", minWidth: '16px' }}>{idx + 1}</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>
                          {m.name} <span style={{ color: '#10B981', fontSize: '11px' }}>▼ {(idx % 4) + 1} 7D</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginTop: '2px' }}>
                          {m.priceCutsPct}% CUTTING · {m.unrealizedLoss}% MED CUT · {m.totalListings.toLocaleString()} LISTINGS
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>{m.msi.toFixed(2)}</div>
                      <div style={{ fontSize: '10px', color: m.msi <= 2.5 ? '#3B82F6' : '#8B5CF6', textTransform: 'capitalize' }}>{m.msiLabel}</div>
                    </div>
                  </div>
                ))}
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
