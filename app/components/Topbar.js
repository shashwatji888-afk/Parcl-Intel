'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ title, subtitle, onOpenProfile }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const userName = profile?.full_name || user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Shashwat';
  const avatarUrl = user?.user_metadata?.avatar_url || profile?.avatar_url;
  const userInitial = userName.charAt(0).toUpperCase();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/overview?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const tickerItems = [
    { city: 'U.S.', trend: '▼ -2.2% YoY', trendColor: '#EF4444', msi: 'MSI 5.49', cuts: 'CUTS 41.3%', dot: true },
    { city: 'DAYTONA BEACH', trend: '▼ -2.0%', trendColor: '#EF4444', msi: 'MSI 6.11', cuts: 'CUTS 47.5%' },
    { city: 'CHARLESTON', trend: '▼ -1.8%', trendColor: '#EF4444', msi: 'MSI 6.21', cuts: 'CUTS 49.3%' },
    { city: 'RALEIGH', trend: '▼ -1.8%', trendColor: '#EF4444', msi: 'MSI 5.89', cuts: 'CUTS 46.9%' },
    { city: 'SAN JOSE', trend: '▼ -1.8%', trendColor: '#EF4444', msi: 'MSI 4.88', cuts: 'CUTS 38.2%' },
    { city: 'PHOENIX', trend: '▼ -1.7%', trendColor: '#EF4444', msi: 'MSI 6.56', cuts: 'CUTS 49.8%' },
    { city: 'HOUSTON', trend: '▼ -1.6%', trendColor: '#EF4444', msi: 'MSI 5.71', cuts: 'CUTS 44.3%' },
    { city: 'LAKELAND', trend: '▼ -1.5%', trendColor: '#EF4444', msi: 'MSI 5.99', cuts: 'CUTS 45.4%' },
  ];

  return (
    <header style={{ position: 'fixed', top: 0, right: 0, left: '240px', zIndex: 30, backgroundColor: '#050814', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', minHeight: '84px', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. TOP MOVING MARKET TICKER — CRISP & HIGH CONTRAST */}
      <div style={{ backgroundColor: '#02040A', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden', whiteSpace: 'nowrap', padding: '6px 0', fontSize: '11.5px', fontFamily: "'Space Mono', monospace" }}>
        <div className="parcl-ticker-track">
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', paddingRight: '32px' }}>
            {tickerItems.map((item, idx) => (
              <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                {item.dot && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                )}
                <span style={{ fontWeight: '800', color: item.dot ? '#10B981' : '#FFFFFF', letterSpacing: '0.5px' }}>{item.city}</span>
                <span style={{ fontWeight: '700', color: '#F87171' }}>{item.trend}</span>
                <span style={{ fontWeight: '600', color: '#FBBF24' }}>{item.msi}</span>
                <span style={{ fontWeight: '600', color: '#93C5FD' }}>{item.cuts}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', paddingRight: '32px' }}>
            {tickerItems.map((item, idx) => (
              <div key={`dup-${idx}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                {item.dot && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                )}
                <span style={{ fontWeight: '800', color: item.dot ? '#10B981' : '#FFFFFF', letterSpacing: '0.5px' }}>{item.city}</span>
                <span style={{ fontWeight: '700', color: '#F87171' }}>{item.trend}</span>
                <span style={{ fontWeight: '600', color: '#FBBF24' }}>{item.msi}</span>
                <span style={{ fontWeight: '600', color: '#93C5FD' }}>{item.cuts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SUB HEADER NAVIGATION & SEARCH */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 24px' }}>
        
        {/* Left Tab Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link
            href="/overview"
            style={{
              fontSize: '14px',
              fontWeight: pathname === '/overview' ? '800' : '600',
              color: pathname === '/overview' ? '#FFFFFF' : '#94A3B8',
              textDecoration: 'none',
              borderBottom: pathname === '/overview' ? '2.5px solid #3B82F6' : '2.5px solid transparent',
              paddingBottom: '4px',
              transition: 'color 0.15s'
            }}
          >
            Parcl HQ
          </Link>

          <Link
            href="/reports"
            style={{
              fontSize: '14px',
              fontWeight: pathname === '/reports' ? '800' : '600',
              color: pathname === '/reports' ? '#FFFFFF' : '#94A3B8',
              textDecoration: 'none',
              borderBottom: pathname === '/reports' ? '2.5px solid #3B82F6' : '2.5px solid transparent',
              paddingBottom: '4px',
              transition: 'color 0.15s'
            }}
          >
            Research
          </Link>

          <Link
            href="/segments"
            style={{
              fontSize: '14px',
              fontWeight: pathname === '/segments' ? '800' : '600',
              color: pathname === '/segments' ? '#FFFFFF' : '#94A3B8',
              textDecoration: 'none',
              borderBottom: pathname === '/segments' ? '2.5px solid #3B82F6' : '2.5px solid transparent',
              paddingBottom: '4px',
              transition: 'color 0.15s'
            }}
          >
            Trackers
          </Link>
        </div>

        {/* Right Search & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0A0E1A', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '6px', padding: '6px 14px', width: '290px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#60A5FA', marginRight: '8px' }}>search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any metro, county, or zip"
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: '13px', fontWeight: '500', width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </form>

          <button
            type="button"
            onClick={onOpenProfile}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px', borderRadius: '9999px', backgroundColor: '#0A0E1A', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#FFFFFF', cursor: 'pointer' }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 'bold', fontSize: '11px' }}>
                {userInitial}
              </div>
            )}
            <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#FFFFFF' }}>{userName}</span>
          </button>
        </div>

      </div>

    </header>
  );
}
