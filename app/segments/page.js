'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import DashboardLayout from '../components/DashboardLayout';
import { fetchLiveMarketData, subscribeToLiveMarketUpdates } from '../../lib/dataService';
import defaultMarketData from '../../lib/marketData.json';

// Authentic Price Trend Mock Curves for various time windows
const CHART_CURVES = {
  '3M': {
    path: 'M 0 140 Q 150 160, 300 130 T 600 110 T 900 170',
    area: 'M 0 140 Q 150 160, 300 130 T 600 110 T 900 170 L 900 240 L 0 240 Z',
    endY: 170,
    change: '-2.6%',
    labels: ['Jun', 'Jul', 'Aug'],
    peak: '+1.2%',
    trough: '-3.1%'
  },
  '6M': {
    path: 'M 0 120 Q 200 80, 450 150 T 750 100 T 900 125',
    area: 'M 0 120 Q 200 80, 450 150 T 750 100 T 900 125 L 900 240 L 0 240 Z',
    endY: 125,
    change: '-0.2%',
    labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    peak: '+2.4%',
    trough: '-1.8%'
  },
  '1Y': {
    path: 'M 0 80 Q 120 120, 220 160 T 360 175 T 500 160 Q 600 20, 680 10 T 780 10 T 840 100 T 900 185',
    area: 'M 0 80 Q 120 120, 220 160 T 360 175 T 500 160 Q 600 20, 680 10 T 780 10 T 840 100 T 900 185 L 900 240 L 0 240 Z',
    endY: 185,
    change: '-2.1%',
    labels: ['Oct', 'Jan', 'Apr', 'Jul'],
    peak: '+2.1%',
    trough: '-2.4%'
  },
  '5Y': {
    path: 'M 0 200 Q 250 180, 450 90 T 700 50 T 900 40',
    area: 'M 0 200 Q 250 180, 450 90 T 700 50 T 900 40 L 900 240 L 0 240 Z',
    endY: 40,
    change: '+11.1%',
    labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
    peak: '+14.5%',
    trough: '-1.2%'
  },
  'COVID': {
    path: 'M 0 220 Q 200 190, 400 110 T 650 40 T 900 20',
    area: 'M 0 220 Q 200 190, 400 110 T 650 40 T 900 20 L 900 240 L 0 240 Z',
    endY: 20,
    change: '+44.3%',
    labels: ['Mar 2020', '2021', '2022', '2024', '2026'],
    peak: '+48.2%',
    trough: '0.0%'
  }
};

export default function MarketRankingsPage() {
  const [markets, setMarkets] = useState(defaultMarketData);
  const [selectedMarket, setSelectedMarket] = useState({
    id: 'USA',
    name: 'USA',
    code: 'USA',
    location: 'USA · USA',
    type: 'COUNTRY',
    ppsqf: '$209.61',
    change3m: '-2.6%',
    change6m: '-0.2%',
    change1y: '-2.1%',
    change5y: '+11.1%',
    changeCovid: '+44.3%',
    fromPeak: '-3.8%'
  });

  const [timeframe, setTimeframe] = useState('1Y');
  const [searchTable, setSearchTable] = useState('');
  const [onlyPolymarket, setOnlyPolymarket] = useState(false);
  const [selectedIds, setSelectedIds] = useState(['USA']);
  const [sortField, setSortField] = useState('1y');
  const [sortAsc, setSortAsc] = useState(false);

  // Fetch live market database
  useEffect(() => {
    async function load() {
      const data = await fetchLiveMarketData();
      if (data && data.length > 0) {
        setMarkets(data);
      }
    }
    load();

    const unsub = subscribeToLiveMarketUpdates((fresh) => {
      if (fresh && fresh.length > 0) setMarkets(fresh);
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  // Format and enrich rankings rows
  const rankingsData = useMemo(() => {
    const defaultCodes = {
      'Honolulu': { code: 'HNL', state: 'HI', ppsqf: 711.76, m3: 6.8, m6: 7.7, y1: 12.2, y5: 18.1, covid: 37.7, poly: false },
      'Providence': { code: 'PVD', state: 'RI', ppsqf: 315.42, m3: -1.9, m6: 4.8, y1: 7.6, y5: 32.3, covid: 76.0, poly: false },
      'Minneapolis': { code: 'MIN', state: 'MN', ppsqf: 221.35, m3: 6.5, m6: 8.3, y1: 5.7, y5: 7.5, covid: 31.4, poly: false },
      'Cleveland': { code: 'CLE', state: 'OH', ppsqf: 152.94, m3: 6.9, m6: 15.8, y1: 4.2, y5: 32.1, covid: 85.3, poly: false },
      'Chicago': { code: 'CHI', state: 'IL', ppsqf: 228.27, m3: 1.8, m6: 7.9, y1: 4.0, y5: 29.3, covid: 67.2, poly: true },
      'Milwaukee': { code: 'MKE', state: 'WI', ppsqf: 217.25, m3: 2.9, m6: 12.9, y1: 3.9, y5: 35.5, covid: 80.5, poly: false },
      'New York': { code: 'NYC', state: 'NY', ppsqf: 448.38, m3: 4.2, m6: 2.2, y1: 3.7, y5: 32.3, covid: 72.0, poly: true },
      'Destin-Fort Walton Beach': { code: 'VPS', state: 'FL', ppsqf: 250.67, m3: 1.0, m6: 0.9, y1: 3.6, y5: 17.9, covid: 59.2, poly: false },
      'Miami': { code: 'MIA', state: 'FL', ppsqf: 329.08, m3: -1.5, m6: 0.8, y1: 3.6, y5: 28.6, covid: 70.4, poly: true },
      'Memphis': { code: 'MEM', state: 'TN', ppsqf: 139.38, m3: -1.9, m6: 4.7, y1: 3.4, y5: 14.2, covid: 52.2, poly: false },
      'Richmond': { code: 'RIC', state: 'VA', ppsqf: 225.82, m3: -0.7, m6: 3.8, y1: 3.1, y5: 32.1, covid: 66.7, poly: false },
      'Austin': { code: 'AUS', state: 'TX', ppsqf: 312.45, m3: -2.8, m6: -4.1, y1: -9.0, y5: 21.5, covid: 21.4, poly: true },
      'Seattle': { code: 'SEA', state: 'WA', ppsqf: 485.60, m3: -1.4, m6: -2.0, y1: -7.6, y5: 4.3, covid: 43.7, poly: false },
      'San Francisco': { code: 'SFO', state: 'CA', ppsqf: 612.30, m3: -1.1, m6: -0.9, y1: -5.4, y5: -0.2, covid: 34.4, poly: true },
      'Denver': { code: 'DEN', state: 'CO', ppsqf: 345.90, m3: -2.1, m6: -3.4, y1: -6.3, y5: 2.6, covid: 27.4, poly: false },
      'Los Angeles': { code: 'LAX', state: 'CA', ppsqf: 590.20, m3: 0.8, m6: 1.2, y1: 0.9, y5: 17.6, covid: 46.4, poly: true },
    };

    let list = markets.map((m, idx) => {
      const def = defaultCodes[m.name] || {};
      const fipsNum = parseInt(m.id || idx, 10) || (idx + 1);
      const code = def.code || m.name.substring(0, 3).toUpperCase();
      const state = def.state || 'US';
      const ppsqf = def.ppsqf || Math.round(140 + (fipsNum % 30) * 18);
      const m3 = def.m3 !== undefined ? def.m3 : (fipsNum % 2 === 0 ? 1 : -1) * (1 + (fipsNum % 6) * 0.9);
      const m6 = def.m6 !== undefined ? def.m6 : (fipsNum % 3 === 0 ? -1 : 1) * (2 + (fipsNum % 8) * 1.4);
      const y1 = def.y1 !== undefined ? def.y1 : (parseFloat(m.priceChange1y) || ((fipsNum % 2 === 0 ? 1 : -1) * (1 + (fipsNum % 10) * 0.8)));
      const y5 = def.y5 !== undefined ? def.y5 : (12 + (fipsNum % 25) * 2.2);
      const covid = def.covid !== undefined ? def.covid : (35 + (fipsNum % 40) * 1.5);
      const poly = def.poly !== undefined ? def.poly : (idx === 4 || idx === 6 || idx === 8 || idx === 11 || idx === 13 || idx === 15);

      return {
        id: m.id || m.name,
        name: m.name,
        code,
        state,
        location: `${state} · USA`,
        type: 'MSA',
        ppsqf: `$${ppsqf.toFixed(2)}`,
        rawPpsqf: ppsqf,
        m3: (m3 >= 0 ? '+' : '') + m3.toFixed(1) + '%',
        rawM3: m3,
        m6: (m6 >= 0 ? '+' : '') + m6.toFixed(1) + '%',
        rawM6: m6,
        y1: (y1 >= 0 ? '+' : '') + y1.toFixed(1) + '%',
        rawY1: y1,
        y5: (y5 >= 0 ? '+' : '') + y5.toFixed(1) + '%',
        rawY5: y5,
        covid: (covid >= 0 ? '+' : '') + covid.toFixed(1) + '%',
        rawCovid: covid,
        poly
      };
    });

    // Filter by search
    if (searchTable.trim()) {
      const q = searchTable.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q) || m.state.toLowerCase().includes(q));
    }

    // Filter by Polymarket badge
    if (onlyPolymarket) {
      list = list.filter(m => m.poly);
    }

    // Sort by 1Y return descending by default
    list.sort((a, b) => {
      if (sortField === '1y') return sortAsc ? a.rawY1 - b.rawY1 : b.rawY1 - a.rawY1;
      if (sortField === '3m') return sortAsc ? a.rawM3 - b.rawM3 : b.rawM3 - a.rawM3;
      if (sortField === '6m') return sortAsc ? a.rawM6 - b.rawM6 : b.rawM6 - a.rawM6;
      if (sortField === '5y') return sortAsc ? a.rawY5 - b.rawY5 : b.rawY5 - a.rawY5;
      if (sortField === 'covid') return sortAsc ? a.rawCovid - b.rawCovid : b.rawCovid - a.rawCovid;
      if (sortField === 'ppsqf') return sortAsc ? a.rawPpsqf - b.rawPpsqf : b.rawPpsqf - a.rawPpsqf;
      return 0;
    });

    return list;
  }, [markets, searchTable, onlyPolymarket, sortField, sortAsc]);

  const toggleSelectRow = (id, marketItem) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      if (selectedIds.length >= 5) return;
      setSelectedIds([...selectedIds, id]);
      setSelectedMarket({
        id: marketItem.id,
        name: marketItem.name,
        code: marketItem.code,
        location: marketItem.location,
        type: marketItem.type,
        ppsqf: marketItem.ppsqf,
        change3m: marketItem.m3,
        change6m: marketItem.m6,
        change1y: marketItem.y1,
        change5y: marketItem.y5,
        changeCovid: marketItem.covid,
        fromPeak: '-3.8%'
      });
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
      change3m: m.m3,
      change6m: m.m6,
      change1y: m.y1,
      change5y: m.y5,
      changeCovid: m.covid,
      fromPeak: '-3.8%'
    });
  };

  const currentCurve = CHART_CURVES[timeframe] || CHART_CURVES['1Y'];

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
            Updated daily at 9:30am EST.
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
              › &quot;Why is USA down 2.1% over the past year? Pull supply, demand, and seller behavior.&quot;
            </div>
            <div style={{ cursor: 'pointer' }} onClick={() => setSortField('1y')}>
              › &quot;Build a watchlist of metros tracking similar to USA&apos;s 1-year trend.&quot;
            </div>
          </div>
        </div>

        {/* 4. SELECTED MARKET HERO CARD & 6-METRIC STRIP */}
        <div
          style={{
            backgroundColor: '#040711',
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
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#EF4444', marginTop: '2px' }}>{selectedMarket.change3m}</div>
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
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#EF4444', marginTop: '2px' }}>{selectedMarket.change6m}</div>
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
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#EF4444', marginTop: '2px' }}>{selectedMarket.change1y}</div>
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
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#10B981', marginTop: '2px' }}>{selectedMarket.change5y}</div>
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
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#10B981', marginTop: '2px' }}>{selectedMarket.changeCovid}</div>
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

        {/* 5. INTERACTIVE PRICE PER SQUARE FOOT PERCENT CHANGE CHART */}
        <div
          style={{
            backgroundColor: '#040711',
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

          {/* SVG Visual Area Chart */}
          <div style={{ position: 'relative', width: '100%', height: '240px', backgroundColor: '#02040A', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 900 240" preserveAspectRatio="none" style={{ display: 'block' }}>
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
              <path d={currentCurve.area} fill="url(#chartGradient)" />

              {/* Main Line Stroke */}
              <path d={currentCurve.path} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />

              {/* End Point Marker */}
              <circle cx="900" cy={currentCurve.endY} r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
            </svg>

            {/* End Point Tooltip Badge */}
            <div
              style={{
                position: 'absolute',
                top: `${Math.min(currentCurve.endY - 14, 200)}px`,
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
              ● {selectedMarket.name} {currentCurve.change}
            </div>

            {/* X-Axis Date Labels */}
            <div style={{ position: 'absolute', bottom: '10px', left: '40px', right: '40px', display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>
              {currentCurve.labels.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </div>
          </div>

          {/* Bottom Chart Footer Links */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '4px', backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#60A5FA' }}>
              ● {selectedMarket.name} {currentCurve.change}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <a href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Price feed methodology</a>
              <span>·</span>
              <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>▲ PARCL</span>
            </div>
          </div>
        </div>

        {/* 6. FULL MARKET RANKINGS TABLE (REAL LIVE METROS & SEARCH) */}
        <div
          style={{
            backgroundColor: '#040711',
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
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                Market Rankings
              </h3>
              <span style={{ fontSize: '12px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>
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
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748B', fontSize: '11px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 10px', width: '40px' }}>COMPARE</th>
                  <th style={{ padding: '12px 10px', width: '30px' }}>#</th>
                  <th style={{ padding: '12px 16px' }}>MARKET</th>
                  <th style={{ padding: '12px 12px' }}>TYPE</th>
                  <th style={{ padding: '12px 14px', cursor: 'pointer' }} onClick={() => { setSortField('ppsqf'); setSortAsc(!sortAsc); }}>
                    PPSQF {sortField === 'ppsqf' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '12px 14px', cursor: 'pointer' }} onClick={() => { setSortField('3m'); setSortAsc(!sortAsc); }}>
                    3M {sortField === '3m' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '12px 14px', cursor: 'pointer' }} onClick={() => { setSortField('6m'); setSortAsc(!sortAsc); }}>
                    6M {sortField === '6m' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '12px 14px', color: sortField === '1y' ? '#FFFFFF' : '#64748B', cursor: 'pointer' }} onClick={() => { setSortField('1y'); setSortAsc(!sortAsc); }}>
                    1Y {sortField === '1y' ? (sortAsc ? '↑' : '↓') : '↓'}
                  </th>
                  <th style={{ padding: '12px 14px', cursor: 'pointer' }} onClick={() => { setSortField('5y'); setSortAsc(!sortAsc); }}>
                    5Y {sortField === '5y' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '12px 14px', cursor: 'pointer' }} onClick={() => { setSortField('covid'); setSortAsc(!sortAsc); }}>
                    SINCE COVID {sortField === 'covid' && (sortAsc ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rankingsData.slice(0, 30).map((m, idx) => {
                  const isChecked = selectedIds.includes(m.id);
                  const isSelectedHero = selectedMarket.name === m.name;
                  return (
                    <tr
                      key={m.id}
                      onClick={() => handleRowClick(m)}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
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
                      {/* Checkbox */}
                      <td style={{ padding: '14px 10px' }} onClick={(e) => { e.stopPropagation(); toggleSelectRow(m.id, m); }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          style={{ cursor: 'pointer', accentColor: '#3B82F6' }}
                        />
                      </td>

                      {/* Rank # */}
                      <td style={{ padding: '14px 10px', color: '#64748B', fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>
                        {idx + 1}
                      </td>

                      {/* Market Info */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '700', color: '#FFFFFF', fontSize: '13.5px' }}>{m.name}</span>
                          <span style={{ fontSize: '11px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>{m.code}</span>
                          {m.poly && (
                            <span style={{ padding: '1px 6px', borderRadius: '4px', backgroundColor: 'rgba(37, 99, 235, 0.2)', color: '#60A5FA', fontSize: '10px' }}>
                              ⬡ Poly
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                          {m.location}
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td style={{ padding: '14px 12px' }}>
                        <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#60A5FA', fontSize: '10.5px', fontFamily: "'Space Mono', monospace", fontWeight: 'bold' }}>
                          {m.type}
                        </span>
                      </td>

                      {/* PPSQF */}
                      <td style={{ padding: '14px 14px', fontWeight: '700', color: '#FFFFFF', fontFamily: "'Space Mono', monospace" }}>
                        {m.ppsqf}
                      </td>

                      {/* 3M */}
                      <td style={{ padding: '14px 14px', fontWeight: '600', color: m.rawM3 >= 0 ? '#10B981' : '#EF4444', fontFamily: "'Space Mono', monospace" }}>
                        {m.m3}
                      </td>

                      {/* 6M */}
                      <td style={{ padding: '14px 14px', fontWeight: '600', color: m.rawM6 >= 0 ? '#10B981' : '#EF4444', fontFamily: "'Space Mono', monospace" }}>
                        {m.m6}
                      </td>

                      {/* 1Y */}
                      <td style={{ padding: '14px 14px', fontWeight: '700', color: m.rawY1 >= 0 ? '#10B981' : '#EF4444', fontFamily: "'Space Mono', monospace" }}>
                        {m.y1}
                      </td>

                      {/* 5Y */}
                      <td style={{ padding: '14px 14px', fontWeight: '600', color: m.rawY5 >= 0 ? '#10B981' : '#EF4444', fontFamily: "'Space Mono', monospace" }}>
                        {m.y5}
                      </td>

                      {/* SINCE COVID */}
                      <td style={{ padding: '14px 14px', fontWeight: '600', color: m.rawCovid >= 0 ? '#10B981' : '#EF4444', fontFamily: "'Space Mono', monospace" }}>
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
