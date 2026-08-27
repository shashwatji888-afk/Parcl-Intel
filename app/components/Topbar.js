'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { fetchLiveMarketData, subscribeToLiveMarketUpdates } from '../../lib/dataService';

const DEFAULT_METROS = [
  { city: 'DETROIT', arrow: '▲', trend: '+2.8%', isPositive: true, msi: '5.41', cuts: '35.6%' },
  { city: 'NEW YORK', arrow: '▲', trend: '+3.1%', isPositive: true, msi: '3.05', cuts: '26.3%' },
  { city: 'MILWAUKEE', arrow: '▲', trend: '+3.5%', isPositive: true, msi: '4.06', cuts: '28.1%' },
  { city: 'LAKELAND', arrow: '▼', trend: '-1.4%', isPositive: false, msi: '6.00', cuts: '45.8%' },
  { city: 'SAN JOSE', arrow: '▼', trend: '-1.4%', isPositive: false, msi: '4.78', cuts: '30.2%' },
  { city: 'DALLAS-FORT WORTH', arrow: '▼', trend: '-1.4%', isPositive: false, msi: '7.07', cuts: '52.1%' },
  { city: 'CHARLESTON', arrow: '▼', trend: '-1.6%', isPositive: false, msi: '6.23', cuts: '49.4%' },
  { city: 'PHOENIX', arrow: '▼', trend: '-1.5%', isPositive: false, msi: '6.56', cuts: '49.2%' },
  { city: 'AUSTIN', arrow: '▲', trend: '+3.1%', isPositive: true, msi: '7.29', cuts: '54.1%' },
  { city: 'CLEVELAND', arrow: '▲', trend: '+4.3%', isPositive: true, msi: '5.49', cuts: '36.5%' },
];

export default function Topbar({ title, subtitle, onOpenProfile }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [nationalData, setNationalData] = useState({
    city: 'U.S.',
    arrow: '▼',
    trend: '-1.7%',
    isPositive: false,
    msi: '5.51',
    cuts: '41.7%',
  });
  const [metroItems, setMetroItems] = useState(DEFAULT_METROS);

  useEffect(() => {
    fetchLiveMarketData().then((data) => {
      if (data && data.length > 0) {
        // First item or national
        const first = data[0];
        if (first) {
          const rawTrend = first.rawChange1y !== undefined ? first.rawChange1y : -1.7;
          setNationalData({
            city: 'U.S.',
            arrow: rawTrend >= 0 ? '▲' : '▼',
            trend: `${rawTrend >= 0 ? '+' : ''}${rawTrend.toFixed(1)}%`,
            isPositive: rawTrend >= 0,
            msi: (first.msi || 5.51).toFixed(2),
            cuts: `${first.priceCutsPct || 41.7}%`,
          });
        }

        // Rest of the metros
        const mapped = data.slice(1, 15).map((m, idx) => {
          const rawTrend = m.rawChange1y !== undefined ? m.rawChange1y : (idx % 2 === 0 ? 3.1 : -1.4);
          const isPos = rawTrend >= 0;
          return {
            city: (m.name || 'METRO').toUpperCase(),
            arrow: isPos ? '▲' : '▼',
            trend: `${isPos ? '+' : ''}${rawTrend.toFixed(1)}%`,
            isPositive: isPos,
            msi: (m.msi || 5.0).toFixed(2),
            cuts: `${m.priceCutsPct || 41.7}%`,
          };
        });
        if (mapped.length > 0) {
          setMetroItems(mapped);
        }
      }
    });

    const unsub = subscribeToLiveMarketUpdates((fresh) => {
      if (fresh && fresh.length > 0) {
        const first = fresh[0];
        if (first) {
          const rawTrend = first.rawChange1y !== undefined ? first.rawChange1y : -1.7;
          setNationalData({
            city: 'U.S.',
            arrow: rawTrend >= 0 ? '▲' : '▼',
            trend: `${rawTrend >= 0 ? '+' : ''}${rawTrend.toFixed(1)}%`,
            isPositive: rawTrend >= 0,
            msi: (first.msi || 5.51).toFixed(2),
            cuts: `${first.priceCutsPct || 41.7}%`,
          });
        }

        const mapped = fresh.slice(1, 15).map((m, idx) => {
          const rawTrend = m.rawChange1y !== undefined ? m.rawChange1y : 3.1;
          const isPos = rawTrend >= 0;
          return {
            city: (m.name || 'METRO').toUpperCase(),
            arrow: isPos ? '▲' : '▼',
            trend: `${isPos ? '+' : ''}${rawTrend.toFixed(1)}%`,
            isPositive: isPos,
            msi: (m.msi || 5.0).toFixed(2),
            cuts: `${m.priceCutsPct || 41.7}%`,
          };
        });
        if (mapped.length > 0) {
          setMetroItems(mapped);
        }
      }
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/overview?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header style={{ position: 'fixed', top: 0, right: 0, left: '220px', zIndex: 30, backgroundColor: '#000000', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', minHeight: '76px', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. TOP TICKER STRIP: STATIONARY U.S. CELL ON LEFT + MARQUEE SCROLLING METROS ON RIGHT */}
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#000000', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', height: '28px', fontSize: '11px', fontFamily: "'Space Mono', monospace" }}>
        
        {/* STATIONARY U.S. CELL (NEVER MOVES) */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0 16px',
            backgroundColor: '#000000',
            borderRight: '1px solid rgba(255, 255, 255, 0.12)',
            flexShrink: 0,
            zIndex: 5,
            height: '100%',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
          <span style={{ fontWeight: '700', color: '#FFFFFF', letterSpacing: '0.4px' }}>
            {nationalData.city}
          </span>
          <span style={{ fontWeight: '700', color: nationalData.isPositive ? '#10B981' : '#EF4444', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <span>{nationalData.arrow}</span>
            <span>{nationalData.trend}</span>
            <span style={{ color: '#64748B', fontWeight: '400', fontSize: '10px', marginLeft: '2px' }}>YoY</span>
          </span>
          <span style={{ color: '#64748B', fontWeight: '500' }}>MSI</span>
          <span style={{ color: '#FFFFFF', fontWeight: '700' }}>{nationalData.msi}</span>
          <span style={{ color: '#64748B', fontWeight: '500' }}>CUTS</span>
          <span style={{ color: '#FFFFFF', fontWeight: '700' }}>{nationalData.cuts}</span>
        </div>

        {/* MARQUEE SCROLLING TRACK FOR ALL METROS ON THE RIGHT */}
        <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
          <div className="parcl-ticker-track" style={{ display: 'flex', alignItems: 'center' }}>
            
            {/* FIRST PASS */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {metroItems.map((item, idx) => (
                <div
                  key={`metro-${idx}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0 20px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <span style={{ fontWeight: '700', color: '#FFFFFF', letterSpacing: '0.4px' }}>
                    {item.city}
                  </span>
                  <span style={{ fontWeight: '700', color: item.isPositive ? '#10B981' : '#EF4444', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <span>{item.arrow}</span>
                    <span>{item.trend}</span>
                  </span>
                  <span style={{ color: '#64748B', fontWeight: '500' }}>MSI</span>
                  <span style={{ color: '#FFFFFF', fontWeight: '700' }}>{item.msi}</span>
                  <span style={{ color: '#64748B', fontWeight: '500' }}>CUTS</span>
                  <span style={{ color: '#FFFFFF', fontWeight: '700' }}>{item.cuts}</span>
                </div>
              ))}
            </div>

            {/* SEAMLESS LOOP SECOND PASS */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {metroItems.map((item, idx) => (
                <div
                  key={`metro-dup-${idx}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0 20px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <span style={{ fontWeight: '700', color: '#FFFFFF', letterSpacing: '0.4px' }}>
                    {item.city}
                  </span>
                  <span style={{ fontWeight: '700', color: item.isPositive ? '#10B981' : '#EF4444', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <span>{item.arrow}</span>
                    <span>{item.trend}</span>
                  </span>
                  <span style={{ color: '#64748B', fontWeight: '500' }}>MSI</span>
                  <span style={{ color: '#FFFFFF', fontWeight: '700' }}>{item.msi}</span>
                  <span style={{ color: '#64748B', fontWeight: '500' }}>CUTS</span>
                  <span style={{ color: '#FFFFFF', fontWeight: '700' }}>{item.cuts}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* 2. SUB HEADER NAVIGATION & SEARCH BAR (EXACT SCREENSHOT MATCH) */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 24px' }}>
        
        {/* Left: PARCL Logo with Divider + Workspace Nav Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '7px', textDecoration: 'none' }}>
              <span style={{ fontSize: '14px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '0.8px' }}>▲ PARCL</span>
            </Link>
            <span style={{ height: '16px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link
              href="/overview"
              style={{
                fontSize: '13px',
                fontWeight: pathname === '/overview' ? '700' : '500',
                color: pathname === '/overview' ? '#FFFFFF' : '#94A3B8',
                textDecoration: 'none',
                borderBottom: pathname === '/overview' ? '2px solid #3B82F6' : '2px solid transparent',
                paddingBottom: '4px',
                transition: 'color 0.15s'
              }}
            >
              Parcl HQ
            </Link>

            <Link
              href="/reports"
              style={{
                fontSize: '13px',
                fontWeight: pathname === '/reports' ? '700' : '500',
                color: pathname === '/reports' ? '#FFFFFF' : '#94A3B8',
                textDecoration: 'none',
                borderBottom: pathname === '/reports' ? '2px solid #3B82F6' : '2px solid transparent',
                paddingBottom: '4px',
                transition: 'color 0.15s'
              }}
            >
              Research
            </Link>

            <Link
              href="/segments"
              style={{
                fontSize: '13px',
                fontWeight: (pathname === '/segments' || pathname === '/market-rankings') ? '700' : '500',
                color: (pathname === '/segments' || pathname === '/market-rankings') ? '#FFFFFF' : '#94A3B8',
                textDecoration: 'none',
                borderBottom: (pathname === '/segments' || pathname === '/market-rankings') ? '2px solid #3B82F6' : '2px solid transparent',
                paddingBottom: '4px',
                transition: 'color 0.15s'
              }}
            >
              Trackers
            </Link>
          </div>
        </div>

        {/* Right Search Field (Exact match to screenshot) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0F1015', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '6px', padding: '5px 12px', width: '340px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#64748B', marginRight: '8px' }}>search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any metro, county, or zip"
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: '12.5px', width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </form>
        </div>

      </div>

    </header>
  );
}
