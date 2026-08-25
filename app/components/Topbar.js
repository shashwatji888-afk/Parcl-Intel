'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ title, subtitle, onToggleMobileNav, onOpenProfile, onOpenUpgrade }) {
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
      router.push(`/profiler?q=${encodeURIComponent(searchQuery)}`);
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
  ];

  return (
    <header style={{ position: 'fixed', top: 0, right: 0, left: '240px', zIndex: 30, backgroundColor: '#070B14', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', minHeight: '82px', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. TOP MOVING MARKET TICKER */}
      <div style={{ backgroundColor: '#030712', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', overflow: 'hidden', whiteSpace: 'nowrap', padding: '5px 0', fontSize: '10.5px', fontFamily: "'Space Mono', monospace" }}>
        <div className="parcl-ticker-track">
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', paddingRight: '28px' }}>
            {tickerItems.map((item, idx) => (
              <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#CBD5E1' }}>
                {item.dot && (
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 5px #10B981' }} />
                )}
                <span style={{ fontWeight: 'bold', color: item.dot ? '#10B981' : '#FFFFFF' }}>{item.city}</span>
                <span style={{ color: item.trendColor }}>{item.trend}</span>
                <span style={{ color: '#64748B' }}>{item.msi}</span>
                <span style={{ color: '#94A3B8' }}>{item.cuts}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', paddingRight: '28px' }}>
            {tickerItems.map((item, idx) => (
              <div key={`dup-${idx}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#CBD5E1' }}>
                {item.dot && (
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 5px #10B981' }} />
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

      {/* 2. SUB HEADER NAVIGATION & SEARCH */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 24px' }}>
        
        {/* Left Tab Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link
            href="/overview"
            style={{
              fontSize: '13px',
              fontWeight: pathname === '/overview' ? '700' : '500',
              color: pathname === '/overview' ? '#FFFFFF' : '#94A3B8',
              textDecoration: 'none',
              borderBottom: pathname === '/overview' ? '2px solid #3B82F6' : '2px solid transparent',
              paddingBottom: '4px'
            }}
          >
            Parcl HQ
          </Link>

          <Link
            href="/insights"
            style={{
              fontSize: '13px',
              fontWeight: pathname === '/insights' ? '700' : '500',
              color: pathname === '/insights' ? '#FFFFFF' : '#94A3B8',
              textDecoration: 'none',
              borderBottom: pathname === '/insights' ? '2px solid #3B82F6' : '2px solid transparent',
              paddingBottom: '4px'
            }}
          >
            Research
          </Link>

          <Link
            href="/segments"
            style={{
              fontSize: '13px',
              fontWeight: pathname === '/segments' ? '700' : '500',
              color: pathname === '/segments' ? '#FFFFFF' : '#94A3B8',
              textDecoration: 'none',
              borderBottom: pathname === '/segments' ? '2px solid #3B82F6' : '2px solid transparent',
              paddingBottom: '4px'
            }}
          >
            Trackers
          </Link>
        </div>

        {/* Right Search & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0B0F19', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', padding: '5px 12px', width: '280px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#64748B', marginRight: '6px' }}>search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any metro, county, or zip"
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#FFFFFF', fontSize: '12px', width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </form>

          <button
            type="button"
            onClick={onOpenProfile}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', borderRadius: '9999px', backgroundColor: '#0B0F19', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFFFFF', cursor: 'pointer' }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 'bold', fontSize: '10px' }}>
                {userInitial}
              </div>
            )}
            <span style={{ fontSize: '12px', fontWeight: '600' }}>{userName}</span>
          </button>
        </div>

      </div>

    </header>
  );
}
