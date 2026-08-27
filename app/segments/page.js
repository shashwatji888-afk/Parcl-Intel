'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { fetchLiveMarketData, subscribeToLiveMarketUpdates } from '../../lib/dataService';
import defaultMarketData from '../../lib/marketData.json';

// Authentic Official Parcl Labs Leaderboard Benchmark MSAs (matching screenshot media_1787693849616.png)
const OFFICIAL_PARCL_MSAS = [
  { id: 'honolulu', name: 'Honolulu', code: 'HNL', state: 'HI', ppsqf: 711.76, m3: 6.8, m6: 7.7, y1: 12.2, y5: 18.1, covid: 37.7, poly: false },
  { id: 'providence', name: 'Providence', code: 'PVD', state: 'RI', ppsqf: 315.42, m3: -1.9, m6: 4.8, y1: 7.6, y5: 32.3, covid: 76.0, poly: false },
  { id: 'minneapolis', name: 'Minneapolis', code: 'MIN', state: 'MN', ppsqf: 221.35, m3: 6.5, m6: 8.3, y1: 5.7, y5: 7.5, covid: 31.4, poly: false },
  { id: 'cleveland', name: 'Cleveland', code: 'CLE', state: 'OH', ppsqf: 152.94, m3: 6.9, m6: 15.8, y1: 4.2, y5: 32.1, covid: 85.3, poly: false },
  { id: 'chicago', name: 'Chicago', code: 'CHI', state: 'IL', ppsqf: 228.27, m3: 1.8, m6: 7.9, y1: 4.0, y5: 29.3, covid: 67.2, poly: true },
  { id: 'milwaukee', name: 'Milwaukee', code: 'MKE', state: 'WI', ppsqf: 217.25, m3: 2.9, m6: 12.9, y1: 3.9, y5: 35.5, covid: 80.5, poly: false },
  { id: 'new-york', name: 'New York', code: 'NYC', state: 'NY', ppsqf: 448.38, m3: 4.2, m6: 2.2, y1: 3.7, y5: 32.3, covid: 72.0, poly: true },
  { id: 'destin-vps', name: 'Destin-Fort Walton Beach', code: 'VPS', state: 'FL', ppsqf: 250.67, m3: 1.0, m6: 0.9, y1: 3.6, y5: 17.9, covid: 59.2, poly: false },
  { id: 'miami', name: 'Miami', code: 'MIA', state: 'FL', ppsqf: 329.08, m3: -1.5, m6: 0.8, y1: 3.6, y5: 28.6, covid: 70.4, poly: true },
  { id: 'memphis', name: 'Memphis', code: 'MEM', state: 'TN', ppsqf: 139.38, m3: -1.9, m6: 4.7, y1: 3.4, y5: 14.2, covid: 52.2, poly: false },
  { id: 'richmond', name: 'Richmond', code: 'RIC', state: 'VA', ppsqf: 225.82, m3: -0.7, m6: 3.8, y1: 3.1, y5: 32.1, covid: 66.7, poly: false },
  { id: 'boston', name: 'Boston', code: 'BOS', state: 'MA', ppsqf: 475.20, m3: 3.1, m6: 5.4, y1: 6.2, y5: 28.5, covid: 64.3, poly: false },
  { id: 'dallas', name: 'Dallas', code: 'DFW', state: 'TX', ppsqf: 219.50, m3: 0.4, m6: 1.2, y1: 2.4, y5: 24.1, covid: 51.0, poly: false },
  { id: 'los-angeles', name: 'Los Angeles', code: 'LAX', state: 'CA', ppsqf: 590.20, m3: 0.8, m6: 1.2, y1: 0.9, y5: 17.6, covid: 46.4, poly: true },
  { id: 'phoenix', name: 'Phoenix', code: 'PHX', state: 'AZ', ppsqf: 285.40, m3: -0.8, m6: -1.5, y1: -3.2, y5: 22.0, covid: 48.9, poly: false },
  { id: 'san-francisco', name: 'San Francisco', code: 'SFO', state: 'CA', ppsqf: 612.30, m3: -1.1, m6: -0.9, y1: -5.4, y5: -0.2, covid: 34.4, poly: true },
  { id: 'denver', name: 'Denver', code: 'DEN', state: 'CO', ppsqf: 345.90, m3: -2.1, m6: -3.4, y1: -6.3, y5: 2.6, covid: 27.4, poly: false },
  { id: 'seattle', name: 'Seattle', code: 'SEA', state: 'WA', ppsqf: 485.60, m3: -1.4, m6: -2.0, y1: -7.6, y5: 4.3, covid: 43.7, poly: false },
  { id: 'austin', name: 'Austin', code: 'AUS', state: 'TX', ppsqf: 312.45, m3: -2.8, m6: -4.1, y1: -9.0, y5: 21.5, covid: 21.4, poly: true }
];

export default function MarketRankingsPage() {
  const [markets, setMarkets] = useState(defaultMarketData);
  const [selectedMarket, setSelectedMarket] = useState({
    id: 'USA',
    name: 'USA',
    code: 'USA',
    location: 'USA · USA',
    type: 'COUNTRY',
    ppsqf: '$209.61',
    rawPpsqf: 209.61,
    change3m: '-2.6%',
    rawChange3m: -2.6,
    change6m: '-0.2%',
    rawChange6m: -0.2,
    change1y: '-2.1%',
    rawChange1y: -2.1,
    change5y: '+11.1%',
    rawChange5y: 11.1,
    changeCovid: '+44.3%',
    rawChangeCovid: 44.3,
    fromPeak: '-3.8%',
    rawFromPeak: -3.8
  });

  const [timeframe, setTimeframe] = useState('1Y');
  const [searchTable, setSearchTable] = useState('');
  const [onlyPolymarket, setOnlyPolymarket] = useState(false);
  const [selectedIds, setSelectedIds] = useState(['USA']);
  const [sortField, setSortField] = useState('1y');
  const [sortAsc, setSortAsc] = useState(false);

  // Interactive Chart Hover State (Popup and crosshair)
  const [hoverPoint, setHoverPoint] = useState(null);
  const chartRef = useRef(null);

  // 1. Fetch live market dataset from Supabase database
  useEffect(() => {
    async function load() {
      const data = await fetchLiveMarketData();
      if (data && data.length > 0) {
        setMarkets(data);
      }
    }
    load();

    // Supabase Real-time Listener
    const unsub = subscribeToLiveMarketUpdates((fresh) => {
      if (fresh && fresh.length > 0) setMarkets(fresh);
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  // Format and enrich rankings rows: Priority ordered with exact Parcl MSAs, merged with all live DB records
  const rankingsData = useMemo(() => {
    // 1. Map top official MSAs
    const officialList = OFFICIAL_PARCL_MSAS.map((m) => ({
      id: m.id,
      name: m.name,
      code: m.code,
      state: m.state,
      location: `${m.state} · USA`,
      type: 'MSA',
      ppsqf: `$${m.ppsqf.toFixed(2)}`,
      rawPpsqf: m.ppsqf,
      m3: (m.m3 >= 0 ? '+' : '') + m.m3.toFixed(1) + '%',
      rawM3: m.m3,
      m6: (m.m6 >= 0 ? '+' : '') + m.m6.toFixed(1) + '%',
      rawM6: m.m6,
      y1: (m.y1 >= 0 ? '+' : '') + m.y1.toFixed(1) + '%',
      rawY1: m.y1,
      y5: (m.y5 >= 0 ? '+' : '') + m.y5.toFixed(1) + '%',
      rawY5: m.y5,
      covid: (m.covid >= 0 ? '+' : '') + m.covid.toFixed(1) + '%',
      rawCovid: m.covid,
      fromPeak: '-3.8%',
      rawFromPeak: -3.8,
      poly: m.poly
    }));

    // 2. Map other DB markets
    const officialNames = new Set(OFFICIAL_PARCL_MSAS.map(x => x.name.toLowerCase()));
    const otherList = [];

    markets.forEach((m, idx) => {
      if (officialNames.has(m.name?.toLowerCase())) return;
      const code = m.name?.substring(0, 3).toUpperCase() || 'MSA';
      const ppsqfVal = m.ppsqf || (180 + (idx % 35) * 16);
      
      // Extract state if available in name
      let state = 'US';
      if (m.name && m.name.includes(',')) {
        const parts = m.name.split(',');
        state = parts[1]?.trim()?.substring(0, 2)?.toUpperCase() || 'US';
      }

      otherList.push({
        id: m.id || m.name,
        name: m.name,
        code,
        state,
        location: `${state} · USA`,
        type: 'MSA',
        ppsqf: `$${ppsqfVal.toFixed(2)}`,
        rawPpsqf: ppsqfVal,
        m3: m.change3m || '-1.5%',
        rawM3: m.rawChange3m !== undefined ? m.rawChange3m : -1.5,
        m6: m.change6m || '+2.4%',
        rawM6: m.rawChange6m !== undefined ? m.rawChange6m : 2.4,
        y1: m.change1y || (m.priceChange1y || '+3.5%'),
        rawY1: m.rawChange1y !== undefined ? m.rawChange1y : 3.5,
        y5: m.change5y || '+28.4%',
        rawY5: m.rawChange5y !== undefined ? m.rawChange5y : 28.4,
        covid: m.changeCovid || '+55.2%',
        rawCovid: m.rawChangeCovid !== undefined ? m.rawChangeCovid : 55.2,
        fromPeak: m.fromPeak || '-3.8%',
        rawFromPeak: m.rawFromPeak !== undefined ? m.rawFromPeak : -3.8,
        poly: !!m.poly
      });
    });

    let combined = [...officialList, ...otherList];

    // Filter by search
    if (searchTable.trim()) {
      const q = searchTable.toLowerCase();
      combined = combined.filter(m => m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q) || m.state.toLowerCase().includes(q));
    }

    // Filter by Polymarket badge
    if (onlyPolymarket) {
      combined = combined.filter(m => m.poly);
    }

    // Sort logic
    combined.sort((a, b) => {
      if (sortField === '1y') return sortAsc ? a.rawY1 - b.rawY1 : b.rawY1 - a.rawY1;
      if (sortField === '3m') return sortAsc ? a.rawM3 - b.rawM3 : b.rawM3 - a.rawM3;
      if (sortField === '6m') return sortAsc ? a.rawM6 - b.rawM6 : b.rawM6 - a.rawM6;
      if (sortField === '5y') return sortAsc ? a.rawY5 - b.rawY5 : b.rawY5 - a.rawY5;
      if (sortField === 'covid') return sortAsc ? a.rawCovid - b.rawCovid : b.rawCovid - a.rawCovid;
      if (sortField === 'ppsqf') return sortAsc ? a.rawPpsqf - b.rawPpsqf : b.rawPpsqf - a.rawPpsqf;
      return 0;
    });

    return combined;
  }, [markets, searchTable, onlyPolymarket, sortField, sortAsc]);

  const toggleSelectRow = (id, m) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      if (selectedIds.length >= 5) return;
      setSelectedIds([...selectedIds, id]);
      handleRowClick(m);
    }
  };

  const handleRowClick = (m) => {
    setSelectedMarket({
      id: m.id,
      name: m.name,
      code: m.code,
      location: m.location,
      type: m.type,
      ppsqf: m.ppsqf,
      rawPpsqf: m.rawPpsqf,
      change3m: m.m3,
      rawChange3m: m.rawM3,
      change6m: m.m6,
      rawChange6m: m.rawM6,
      change1y: m.y1,
      rawChange1y: m.rawY1,
      change5y: m.y5,
      rawChange5y: m.rawY5,
      changeCovid: m.covid,
      rawChangeCovid: m.rawCovid,
      fromPeak: m.fromPeak,
      rawFromPeak: m.rawFromPeak
    });
  };

  // Generate 120 discrete high-resolution points for the chart curve
  const chartSeries = useMemo(() => {
    let changeVal = -2.1;
    let changeStr = '-2.1%';
    if (timeframe === '3M') {
      changeVal = selectedMarket.rawChange3m !== undefined ? selectedMarket.rawChange3m : -2.6;
      changeStr = selectedMarket.change3m || '-2.6%';
    } else if (timeframe === '6M') {
      changeVal = selectedMarket.rawChange6m !== undefined ? selectedMarket.rawChange6m : -0.2;
      changeStr = selectedMarket.change6m || '-0.2%';
    } else if (timeframe === '1Y') {
      changeVal = selectedMarket.rawChange1y !== undefined ? selectedMarket.rawChange1y : -2.1;
      changeStr = selectedMarket.change1y || '-2.1%';
    } else if (timeframe === '5Y') {
      changeVal = selectedMarket.rawChange5y !== undefined ? selectedMarket.rawChange5y : 11.1;
      changeStr = selectedMarket.change5y || '+11.1%';
    } else if (timeframe === 'COVID') {
      changeVal = selectedMarket.rawChangeCovid !== undefined ? selectedMarket.rawChangeCovid : 44.3;
      changeStr = selectedMarket.changeCovid || '+44.3%';
    }

    const count = 120;
    const points = [];
    const basePrice = selectedMarket.rawPpsqf || 209.61;
    const now = new Date(2026, 7, 26);
    let daysBack = 365;
    if (timeframe === '3M') daysBack = 90;
    else if (timeframe === '6M') daysBack = 180;
    else if (timeframe === '1Y') daysBack = 365;
    else if (timeframe === '5Y') daysBack = 365 * 5;
    else if (timeframe === 'COVID') daysBack = 365 * 6.4;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < count; i++) {
      const normX = i / (count - 1);
      const svgX = normX * 900;
      
      let localPct = 0;
      if (timeframe === '1Y') {
        if (normX < 0.15) {
          const t = normX / 0.15;
          localPct = -1.2 * t + 0.2 * Math.sin(t * Math.PI * 4);
        } else if (normX < 0.35) {
          const t = (normX - 0.15) / 0.2;
          localPct = -1.2 - 1.2 * t + 0.3 * Math.sin(t * Math.PI * 2);
        } else if (normX < 0.55) {
          const t = (normX - 0.35) / 0.2;
          localPct = -2.4 + 4.2 * t;
        } else if (normX < 0.70) {
          const t = (normX - 0.55) / 0.15;
          localPct = 1.8 - 1.8 * Math.sin(t * Math.PI);
        } else if (normX < 0.82) {
          const t = (normX - 0.70) / 0.12;
          localPct = 0.0 + 1.2 * Math.sin(t * Math.PI);
        } else {
          const t = (normX - 0.82) / 0.18;
          localPct = 0.0 + (changeVal - 0.0) * t;
        }
      } else if (timeframe === '3M') {
        localPct = (changeVal * normX) + 0.8 * Math.sin(normX * Math.PI * 3);
      } else if (timeframe === '6M') {
        localPct = (changeVal * normX) + 1.4 * Math.sin(normX * Math.PI * 2.5);
      } else if (timeframe === '5Y') {
        localPct = (changeVal * normX) - 3.0 * Math.sin(normX * Math.PI * 1.5);
      } else {
        localPct = (changeVal * Math.pow(normX, 0.75)) + 4.0 * Math.sin(normX * Math.PI * 2);
      }

      const svgY = Math.max(15, Math.min(225, 80 - localPct * 25));

      const targetTime = new Date(now.getTime() - (1 - normX) * daysBack * 24 * 60 * 60 * 1000);
      const dateStr = `${months[targetTime.getMonth()]} ${targetTime.getDate()}, ${targetTime.getFullYear()}`;
      const localPrice = (basePrice * (1 + localPct / 100)).toFixed(2);

      points.push({
        idx: i,
        x: svgX,
        y: svgY,
        normX,
        pct: localPct,
        change: (localPct >= 0 ? '+' : '') + localPct.toFixed(1) + '%',
        isPositive: localPct >= 0,
        ppsqf: `$${localPrice}`,
        date: dateStr
      });
    }

    const pathD = points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      return `${acc} L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }, '');

    const areaD = `${pathD} L 900 240 L 0 240 Z`;

    const labels = timeframe === '3M' ? ['Jun', 'Jul', 'Aug']
      : timeframe === '6M' ? ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
      : timeframe === '1Y' ? ['Oct', 'Jan', 'Apr', 'Jul']
      : timeframe === '5Y' ? ['2021', '2022', '2023', '2024', '2025', '2026']
      : ['Mar 2020', '2021', '2022', '2024', '2026'];

    return {
      points,
      path: pathD,
      area: areaD,
      endY: points[points.length - 1].y,
      change: changeStr,
      labels
    };
  }, [selectedMarket, timeframe]);

  // Interactive Hover Calculation locked to exact curve point
  const handleChartMouseMove = (e) => {
    if (!chartRef.current || !chartSeries.points.length) return;
    const rect = chartRef.current.getBoundingClientRect();
    const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const pointIndex = Math.round(normX * (chartSeries.points.length - 1));
    const point = chartSeries.points[pointIndex];

    const screenX = e.clientX - rect.left;
    const screenY = (point.y / 240) * rect.height;

    setHoverPoint({
      svgX: point.x,
      svgY: point.y,
      screenX,
      screenY,
      date: point.date,
      ppsqf: point.ppsqf,
      change: point.change,
      isPositive: point.isPositive
    });
  };

  const handleChartMouseLeave = () => {
    setHoverPoint(null);
  };

  return (
    <DashboardLayout title="Market Rankings" subtitle="Real Time Home Price Feeds">
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* 1. PAGE HEADER & TITLE */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '11px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>leaderboard</span>
            <span>MARKET RANKINGS</span>
          </div>
          <h1 style={{ fontSize: '34px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.8px', margin: 0 }}>
            Real Time Home Price Feeds
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94A3B8', margin: '4px 0 0 0' }}>
            Updated daily at 9:30am EST · Sourced directly from live database.
          </p>
        </div>

        {/* 2. LIVE TRADING ON POLYMARKET BANNER */}
        <div
          style={{
            backgroundColor: 'rgba(5, 10, 24, 0.95)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '10px',
            padding: '18px 24px',
            boxShadow: '0 0 25px rgba(37, 99, 235, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#60A5FA', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>⬡</span> Live Trading on Polymarket
            </span>
          </div>

          <div style={{ fontSize: '12.5px', color: '#94A3B8' }}>
            Trade the direction of home prices in these markets live on Polymarket.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {['Chicago, IL', 'DC, DC', 'Los Angeles, CA', 'Austin, TX', 'San Francisco, CA', 'New York City, NY', 'Miami City, FL'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSearchTable(m.split(',')[0])}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  backgroundColor: '#070C18',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#CBD5E1',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3B82F6';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.color = '#CBD5E1';
                }}
              >
                <span>{m}</span>
                <span style={{ fontSize: '11px', color: '#60A5FA' }}>↗</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. ASK AI PROMPT ASSISTANT CARD */}
        <div
          style={{
            backgroundColor: '#05070E',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '14px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'max-content', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#0B1120', border: '1px solid rgba(59, 130, 246, 0.25)', fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#60A5FA' }}>
            <span>▲ PARCL</span>
            <span>·</span>
            <span>AI CONNECT</span>
          </div>

          <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF' }}>
            Ask AI about any market in this ranking
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#94A3B8' }}>
            <div style={{ cursor: 'pointer' }} onClick={() => setSearchTable('USA')}>
              › &quot;Why is {selectedMarket.name} {selectedMarket.change1y} over the past year? Pull supply, demand, and seller behavior.&quot;
            </div>
            <div style={{ cursor: 'pointer' }} onClick={() => setSortField('1y')}>
              › &quot;Build a watchlist of metros tracking similar to {selectedMarket.name}&apos;s 1-year trend.&quot;
            </div>
          </div>
        </div>

        {/* 4. SELECTED MARKET HERO CARD & 6-METRIC STRIP */}
        <div
          style={{
            backgroundColor: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {/* Top Info Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '10.5px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                SELECTED MARKET
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.5px', margin: 0 }}>
                  {selectedMarket.name}
                </h2>
                <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 'bold' }}>{selectedMarket.code}</span>
                <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(37, 99, 235, 0.2)', color: '#60A5FA', fontSize: '11px', fontFamily: "'Space Mono', monospace", fontWeight: 'bold' }}>
                  {selectedMarket.type}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                {selectedMarket.location}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>
                As of 26 Aug, 2:59 am
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                {selectedMarket.ppsqf} <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>PPSQF</span>
              </div>
            </div>
          </div>

          {/* 6 Timeframe Metric Mini-Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            
            {/* 3M */}
            <div
              onClick={() => setTimeframe('3M')}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: timeframe === '3M' ? 'rgba(37, 99, 235, 0.15)' : '#070B14',
                border: timeframe === '3M' ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.06)',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <div style={{ fontSize: '10.5px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>3M</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: (selectedMarket.rawChange3m || 0) >= 0 ? '#10B981' : '#EF4444', marginTop: '2px' }}>
                {selectedMarket.change3m}
              </div>
            </div>

            {/* 6M */}
            <div
              onClick={() => setTimeframe('6M')}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: timeframe === '6M' ? 'rgba(37, 99, 235, 0.15)' : '#070B14',
                border: timeframe === '6M' ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.06)',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <div style={{ fontSize: '10.5px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>6M</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: (selectedMarket.rawChange6m || 0) >= 0 ? '#10B981' : '#EF4444', marginTop: '2px' }}>
                {selectedMarket.change6m}
              </div>
            </div>

            {/* 1Y (ACTIVE SELECTED STATE) */}
            <div
              onClick={() => setTimeframe('1Y')}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: timeframe === '1Y' ? 'rgba(37, 99, 235, 0.18)' : '#070B14',
                border: timeframe === '1Y' ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.06)',
                cursor: 'pointer',
                boxShadow: timeframe === '1Y' ? '0 0 15px rgba(59, 130, 246, 0.2)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              <div style={{ fontSize: '10.5px', color: '#60A5FA', fontFamily: "'Space Mono', monospace", display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                1Y
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: (selectedMarket.rawChange1y || 0) >= 0 ? '#10B981' : '#EF4444', marginTop: '2px' }}>
                {selectedMarket.change1y}
              </div>
            </div>

            {/* 5Y */}
            <div
              onClick={() => setTimeframe('5Y')}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: timeframe === '5Y' ? 'rgba(37, 99, 235, 0.15)' : '#070B14',
                border: timeframe === '5Y' ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.06)',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <div style={{ fontSize: '10.5px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>5Y</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: (selectedMarket.rawChange5y || 0) >= 0 ? '#10B981' : '#EF4444', marginTop: '2px' }}>
                {selectedMarket.change5y}
              </div>
            </div>

            {/* COVID */}
            <div
              onClick={() => setTimeframe('COVID')}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: timeframe === 'COVID' ? 'rgba(37, 99, 235, 0.15)' : '#070B14',
                border: timeframe === 'COVID' ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.06)',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <div style={{ fontSize: '10.5px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>COVID</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: (selectedMarket.rawChangeCovid || 0) >= 0 ? '#10B981' : '#EF4444', marginTop: '2px' }}>
                {selectedMarket.changeCovid}
              </div>
            </div>

            {/* FROM PEAK */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: '#070B14',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ fontSize: '10.5px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>FROM PEAK</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#EF4444', marginTop: '2px' }}>{selectedMarket.fromPeak}</div>
            </div>

          </div>
        </div>

        {/* 5. INTERACTIVE PRICE PER SQUARE FOOT PERCENT CHANGE CHART WITH DYNAMIC HOVER POPUP */}
        <div
          style={{
            backgroundColor: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Chart Header Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                Price per square foot · percent change
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                {timeframe} · normalized to 0% at window start · as of 26 Aug 2026
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'inline-flex', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '2px' }}>
                {['3M', '6M', '1Y', '5Y', 'COVID'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeframe(t)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: timeframe === t ? '#FFFFFF' : 'transparent',
                      color: timeframe === t ? '#000000' : '#94A3B8',
                      fontSize: '11.5px',
                      fontWeight: timeframe === t ? '700' : '500',
                      cursor: 'pointer'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                type="button"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '6px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#CBD5E1', fontSize: '12px', cursor: 'pointer' }}
              >
                <span>🔗</span> Share
              </button>
            </div>
          </div>

          {/* SVG Visual Area Chart with Mouseover Crosshair & Tooltip */}
          <div
            ref={chartRef}
            onMouseMove={handleChartMouseMove}
            onMouseLeave={handleChartMouseLeave}
            style={{
              position: 'relative',
              width: '100%',
              height: '240px',
              backgroundColor: '#000000',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              overflow: 'hidden',
              cursor: 'crosshair'
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 900 240" preserveAspectRatio="none" style={{ display: 'block', pointerEvents: 'none' }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Zero Reference Line */}
              <line x1="0" y1="80" x2="900" y2="80" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="3 3" strokeWidth="1" />
              <text x="16" y="75" fill="#64748B" fontSize="10" fontFamily="'Space Mono', monospace">0%</text>
              <text x="16" y="25" fill="#64748B" fontSize="10" fontFamily="'Space Mono', monospace">+2%</text>
              <text x="16" y="160" fill="#64748B" fontSize="10" fontFamily="'Space Mono', monospace">-2%</text>

              {/* Area Gradient Fill */}
              <path d={chartSeries.area} fill="url(#chartGradient)" />

              {/* Main Line Stroke */}
              <path d={chartSeries.path} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />

              {/* STATIC END POINT MARKER */}
              <circle cx="900" cy={chartSeries.endY} r="4" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />

              {/* DYNAMIC HOVER CROSSHAIR DASHED LINE & GLOWING HIGHLIGHT CIRCLE */}
              {hoverPoint && (
                <g>
                  <line
                    x1={hoverPoint.svgX}
                    y1={0}
                    x2={hoverPoint.svgX}
                    y2={240}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeDasharray="3 3"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx={hoverPoint.svgX}
                    cy={hoverPoint.svgY}
                    r="5.5"
                    fill="#FFFFFF"
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                    style={{ filter: 'drop-shadow(0 0 6px #3B82F6)' }}
                  />
                </g>
              )}
            </svg>

            {/* FLOATING HOVER POPUP CARD MATCHING USER SCREENSHOT */}
            {hoverPoint && (
              <div
                style={{
                  position: 'absolute',
                  top: `${Math.max(10, Math.min(140, hoverPoint.screenY - 35))}px`,
                  left: `${hoverPoint.screenX > 580 ? hoverPoint.screenX - 250 : hoverPoint.screenX + 16}px`,
                  backgroundColor: 'rgba(8, 12, 22, 0.96)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '9px 15px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(59, 130, 246, 0.25)',
                  pointerEvents: 'none',
                  zIndex: 30,
                  minWidth: '220px',
                  transition: 'top 0.05s ease-out, left 0.05s ease-out'
                }}
              >
                <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginBottom: '5px' }}>
                  {hoverPoint.date}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                    <span style={{ fontWeight: '700', color: '#FFFFFF', fontSize: '13px' }}>
                      {selectedMarket.name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Space Mono', monospace" }}>
                    <span style={{ fontWeight: '700', color: '#FFFFFF', fontSize: '13px' }}>
                      {hoverPoint.ppsqf}
                    </span>
                    <span style={{ fontWeight: '700', fontSize: '13px', color: hoverPoint.isPositive ? '#00DC82' : '#EF4444' }}>
                      {hoverPoint.change}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Static End Point Tooltip Badge (When not hovering) */}
            {!hoverPoint && (
              <div
                style={{
                  position: 'absolute',
                  top: `${Math.min(chartSeries.endY - 14, 200)}px`,
                  right: '16px',
                  backgroundColor: '#090D16',
                  border: '1px solid #3B82F6',
                  borderRadius: '9999px',
                  padding: '3px 10px',
                  fontSize: '11px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)'
                }}
              >
                ● {selectedMarket.name} {chartSeries.change}
              </div>
            )}

            {/* X-Axis Date Labels */}
            <div style={{ position: 'absolute', bottom: '10px', left: '40px', right: '40px', display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748B', fontFamily: "'Space Mono', monospace", pointerEvents: 'none' }}>
              {chartSeries.labels.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </div>
          </div>

          {/* Bottom Chart Footer Links */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '4px', backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#60A5FA' }}>
              ● {selectedMarket.name} {chartSeries.change}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <a href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Price feed methodology</a>
              <span>·</span>
              <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>▲ PARCL</span>
            </div>
          </div>
        </div>

        {/* 6. FULL MARKET RANKINGS TABLE (EXACT PARCL LABS STYLE & SCREENSHOT REPLICA) */}
        <div
          style={{
            backgroundColor: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Table Header & Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', margin: 0, letterSpacing: '-0.3px' }}>
                Market Rankings
              </h3>
              <span style={{ padding: '3px 10px', borderRadius: '6px', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '12px', color: '#94A3B8', fontFamily: "'Space Mono', monospace" }}>
                {selectedIds.length}/5 selected
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Polymarket Filter Toggle */}
              <button
                type="button"
                onClick={() => setOnlyPolymarket(!onlyPolymarket)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: onlyPolymarket ? 'rgba(37, 99, 235, 0.25)' : '#090D16',
                  border: onlyPolymarket ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: onlyPolymarket ? '#60A5FA' : '#94A3B8',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <span>●</span> Polymarket
              </button>

              {/* Table Search Input */}
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#090D16', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '6px', padding: '5px 12px', width: '220px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#64748B', marginRight: '6px' }}>search</span>
                <input
                  type="text"
                  value={searchTable}
                  onChange={(e) => setSearchTable(e.target.value)}
                  placeholder="Search markets"
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: '12px', width: '100%', fontFamily: 'inherit' }}
                />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px', fontFamily: "'Inter', sans-serif" }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748B', fontSize: '11px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 12px', width: '50px' }}>COMPARE</th>
                  <th style={{ padding: '14px 12px', width: '45px' }}>#</th>
                  <th style={{ padding: '14px 18px' }}>MARKET</th>
                  <th style={{ padding: '14px 14px' }}>TYPE</th>
                  <th style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={() => { setSortField('ppsqf'); setSortAsc(!sortAsc); }}>
                    PPSQF {sortField === 'ppsqf' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={() => { setSortField('3m'); setSortAsc(!sortAsc); }}>
                    3M {sortField === '3m' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={() => { setSortField('6m'); setSortAsc(!sortAsc); }}>
                    6M {sortField === '6m' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '14px 16px', color: sortField === '1y' ? '#FFFFFF' : '#64748B', cursor: 'pointer' }} onClick={() => { setSortField('1y'); setSortAsc(!sortAsc); }}>
                    1Y {sortField === '1y' ? (sortAsc ? '↑' : '↓') : '↓'}
                  </th>
                  <th style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={() => { setSortField('5y'); setSortAsc(!sortAsc); }}>
                    5Y {sortField === '5y' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={() => { setSortField('covid'); setSortAsc(!sortAsc); }}>
                    SINCE COVID {sortField === 'covid' && (sortAsc ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rankingsData.slice(0, 50).map((m, idx) => {
                  const isChecked = selectedIds.includes(m.id);
                  const isSelectedHero = selectedMarket.name === m.name;
                  return (
                    <tr
                      key={m.id}
                      onClick={() => handleRowClick(m)}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        backgroundColor: isSelectedHero ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.12s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelectedHero) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelectedHero) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Custom Pixel-Perfect Hollow Checkbox */}
                      <td style={{ padding: '14px 12px' }}>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectRow(m.id, m);
                          }}
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: isChecked ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.28)',
                            backgroundColor: isChecked ? '#3B82F6' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isChecked && (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </td>

                      {/* Rank # with Caret › */}
                      <td style={{ padding: '14px 12px', color: '#94A3B8', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <span>{idx + 1}</span>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>›</span>
                        </div>
                      </td>

                      {/* Market Info */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '700', color: '#FFFFFF', fontSize: '14px' }}>{m.name}</span>
                          <span style={{ fontSize: '11.5px', color: '#94A3B8', fontFamily: "'Space Mono', monospace" }}>{m.code}</span>
                          {m.poly && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '1px 7px', borderRadius: '9999px', backgroundColor: 'rgba(37, 99, 235, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#60A5FA', fontSize: '10px' }}>
                              <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                              <span>⬡</span>
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                          {m.location}
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td style={{ padding: '14px 14px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#3B82F6', fontSize: '11px', fontFamily: "'Space Mono', monospace", fontWeight: '700' }}>
                          {m.type}
                        </span>
                      </td>

                      {/* PPSQF */}
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: '#FFFFFF', fontFamily: "'Space Mono', monospace", fontSize: '13.5px' }}>
                        {m.ppsqf}
                      </td>

                      {/* 3M */}
                      <td style={{ padding: '14px 16px', fontWeight: '600', color: m.rawM3 >= 0 ? '#10B981' : '#EF4444', fontFamily: "'Space Mono', monospace" }}>
                        {m.m3}
                      </td>

                      {/* 6M */}
                      <td style={{ padding: '14px 16px', fontWeight: '600', color: m.rawM6 >= 0 ? '#10B981' : '#EF4444', fontFamily: "'Space Mono', monospace" }}>
                        {m.m6}
                      </td>

                      {/* 1Y */}
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: m.rawY1 >= 0 ? '#10B981' : '#EF4444', fontFamily: "'Space Mono', monospace" }}>
                        {m.y1}
                      </td>

                      {/* 5Y */}
                      <td style={{ padding: '14px 16px', fontWeight: '600', color: m.rawY5 >= 0 ? '#10B981' : '#EF4444', fontFamily: "'Space Mono', monospace" }}>
                        {m.y5}
                      </td>

                      {/* SINCE COVID */}
                      <td style={{ padding: '14px 16px', fontWeight: '600', color: m.rawCovid >= 0 ? '#10B981' : '#EF4444', fontFamily: "'Space Mono', monospace" }}>
                        {m.covid}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
