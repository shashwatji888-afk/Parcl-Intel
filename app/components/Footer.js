'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        width: '100%',
        backgroundColor: '#020409',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginTop: 'auto',
        fontSize: '12px',
        color: '#94A3B8',
        fontFamily: "'Inter', sans-serif"
      }}
      role="contentinfo"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontWeight: '600', color: '#E2E8F0' }}>
          © 2026 Parcl Intel · Machine Learning Real Estate Intelligence
        </div>
        <div style={{ fontSize: '11px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>
          All US Market Data · 2,000+ Database Buyers · Real-Time PostgREST Connected
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <Link
          href="/reports"
          style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '12px' }}
          onMouseEnter={(e) => (e.target.style.color = '#60A5FA')}
          onMouseLeave={(e) => (e.target.style.color = '#94A3B8')}
        >
          Documentation
        </Link>
        <Link
          href="/pipeline"
          style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '12px' }}
          onMouseEnter={(e) => (e.target.style.color = '#60A5FA')}
          onMouseLeave={(e) => (e.target.style.color = '#94A3B8')}
        >
          ML Pipeline
        </Link>
        <Link
          href="/reports"
          style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '12px' }}
          onMouseEnter={(e) => (e.target.style.color = '#60A5FA')}
          onMouseLeave={(e) => (e.target.style.color = '#94A3B8')}
        >
          Export CSV
        </Link>
        
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '11.5px',
            color: '#10B981',
            fontFamily: "'Space Mono', monospace"
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)'
            }}
          />
          API Operational
        </div>
      </div>
    </footer>
  );
}
