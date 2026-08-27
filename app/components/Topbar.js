'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { fetchLiveMarketData, subscribeToLiveMarketUpdates } from '../../lib/dataService';

const DEFAULT_TICKER = [
  { city: 'MILWAUKEE', arrow: '▲', trend: '3.6%', isPositive: true, msi: '4.04', cuts: '28.1%' },
  { city: 'CLEVELAND', arrow: '▲', trend: '4.3%', isPositive: true, msi: '5.49', cuts: '36.5%' },
  { city: 'AUSTIN', arrow: '▲', trend: '5.1%', isPositive: true, msi: '7.29', cuts: '54.1%' },
  { city: 'SAN ANTONIO', arrow: '▼', trend: '1.8%', isPositive: false, msi: '7.23', cuts: '54.5%' },
  { city: 'KINGSPORT', arrow: '▲', trend: '2.4%', isPositive: true, msi: '7.39', cuts: '50.8%' },
  { city: 'LAFAYETTE', arrow: '▲', trend: '3.7%', isPositive: true, msi: '2.41', cuts: '18.8%' },
  { city: 'ROCHESTER', arrow: '▼', trend: '1.2%', isPositive: false, msi: '2.42', cuts: '16.9%' },
  { city: 'CHARLESTON', arrow: '▲', trend: '1.9%', isPositive: true, msi: '6.21', cuts: '49.3%' },
  { city: 'RALEIGH', arrow: '▼', trend: '1.4%', isPositive: false, msi: '5.89', cuts: '46.9%' },
  { city: 'PHOENIX', arrow: '▲', trend: '3.2%', isPositive: true, msi: '6.56', cuts: '49.8%' }
];

export default function Topbar({ title, subtitle, onOpenProfile }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [tickerItems, setTickerItems] = useState(DEFAULT_TICKER);

  useEffect(() => {
    fetchLiveMarketData().then((data) => {
      if (data && data.length > 0) {
        const mapped = data.slice(0, 15).map((m) => {
          const rawTrend = m.rawChange1y !== undefined ? m.rawChange1y : 3.5;
          const isPos = rawTrend >= 0;
          return {
            city: (m.name || 'METRO').toUpperCase(),
            arrow: isPos ? '▲' : '▼',
            trend: `${Math.abs(rawTrend).toFixed(1)}%`,
            isPositive: isPos,
            msi: (m.msi || 5.0).toFixed(2),
            cuts: `${m.priceCutsPct || 35.0}%`
          };
        });
        setTickerItems(mapped);
      }
    });

    const unsub = subscribeToLiveMarketUpdates((fresh) => {
      if (fresh && fresh.length > 0) {
        const mapped = fresh.slice(0, 15).map((m) => {
          const rawTrend = m.rawChange1y !== undefined ? m.rawChange1y : 3.5;
          const isPos = rawTrend >= 0;
          return {
            city: (m.name || 'METRO').toUpperCase(),
            arrow: isPos ? '▲' : '▼',
            trend: `${Math.abs(rawTrend).toFixed(1)}%`,
            isPositive: isPos,
            msi: (m.msi || 5.0).toFixed(2),
            cuts: `${m.priceCutsPct || 35.0}%`
          };
        });
        setTickerItems(mapped);
      }
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const userName = profile?.full_name || user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Shashwat';
  const avatarUrl = user?.user_metadata?.avatar_url || profile?.avatar_url;
  const userInitial = userName.charAt(0).toUpperCase();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/overview?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header style={{ position: 'fixed', top: 0, right: 0, left: '240px', zIndex: 30, backgroundColor: '#000000', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', minHeight: '80px', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. TOP MOVING MARKET TICKER — EXACT PARCL LABS PIXEL-PERFECT REPLICA */}
      <div style={{ backgroundColor: '#000000', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', overflow: 'hidden', whiteSpace: 'nowrap', padding: '7px 0', fontSize: '11.5px', fontFamily: "'Space Mono', monospace" }}>
        <div className="parcl-ticker-track">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {tickerItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0 24px',
                  borderRight: '1px solid rgba(255, 255, 255, 0.14)'
                }}
              >
                <span style={{ fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.6px' }}>
                  {item.city}
                </span>
                <span style={{ fontWeight: '700', color: item.isPositive ? '#00DC82' : '#EF4444', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <span>{item.arrow}</span>
                  <span>{item.trend}</span>
                </span>
                <span style={{ color: '#94A3B8', fontWeight: '500' }}>MSI</span>
                <span style={{ color: '#FFFFFF', fontWeight: '700' }}>{item.msi}</span>
                <span style={{ color: '#94A3B8', fontWeight: '500' }}>CUTS</span>
                <span style={{ color: '#FFFFFF', fontWeight: '700' }}>{item.cuts}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {tickerItems.map((item, idx) => (
              <div
                key={`dup-${idx}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0 24px',
                  borderRight: '1px solid rgba(255, 255, 255, 0.14)'
                }}
              >
                <span style={{ fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.6px' }}>
                  {item.city}
                </span>
                <span style={{ fontWeight: '700', color: item.isPositive ? '#00DC82' : '#EF4444', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <span>{item.arrow}</span>
                  <span>{item.trend}</span>
                </span>
                <span style={{ color: '#94A3B8', fontWeight: '500' }}>MSI</span>
                <span style={{ color: '#FFFFFF', fontWeight: '700' }}>{item.msi}</span>
                <span style={{ color: '#94A3B8', fontWeight: '500' }}>CUTS</span>
                <span style={{ color: '#FFFFFF', fontWeight: '700' }}>{item.cuts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SUB HEADER NAVIGATION & SEARCH */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 24px' }}>
        
        {/* Left Tab Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link
            href="/overview"
            style={{
              fontSize: '13.5px',
              fontWeight: pathname === '/overview' ? '700' : '500',
              color: pathname === '/overview' ? '#FFFFFF' : '#94A3B8',
              textDecoration: 'none',
              borderBottom: pathname === '/overview' ? '2px solid #FFFFFF' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'color 0.15s'
            }}
          >
            Parcl HQ
          </Link>

          <Link
            href="/reports"
            style={{
              fontSize: '13.5px',
              fontWeight: pathname === '/reports' ? '700' : '500',
              color: pathname === '/reports' ? '#FFFFFF' : '#94A3B8',
              textDecoration: 'none',
              borderBottom: pathname === '/reports' ? '2px solid #FFFFFF' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'color 0.15s'
            }}
          >
            Research
          </Link>

          <Link
            href="/segments"
            style={{
              fontSize: '13.5px',
              fontWeight: pathname === '/segments' ? '700' : '500',
              color: pathname === '/segments' ? '#FFFFFF' : '#94A3B8',
              textDecoration: 'none',
              borderBottom: pathname === '/segments' ? '2px solid #FFFFFF' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'color 0.15s'
            }}
          >
            Trackers
          </Link>
        </div>

        {/* Right Search & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#070A12', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '6px', padding: '5px 12px', width: '280px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#94A3B8', marginRight: '6px' }}>search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any metro, county, or zip"
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: '12.5px', fontWeight: '500', width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </form>

          <button
            type="button"
            onClick={onOpenProfile}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', borderRadius: '9999px', backgroundColor: '#070A12', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', cursor: 'pointer' }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#1E293B', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 'bold', fontSize: '10px' }}>
                {userInitial}
              </div>
            )}
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#FFFFFF' }}>{userName}</span>
          </button>
        </div>

      </div>

    </header>
  );
}
