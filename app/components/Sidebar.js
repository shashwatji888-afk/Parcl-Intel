'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ onOpenUpgrade, onOpenProfile }) {
  const pathname = usePathname();
  const { user, profile } = useAuth();

  return (
    <aside style={{ width: '220px', backgroundColor: '#070709', borderRight: '1px solid rgba(255, 255, 255, 0.08)', height: 'calc(100vh - 76px)', display: 'flex', flexDirection: 'column', position: 'fixed', top: '76px', left: 0, zIndex: 40, overflowY: 'auto' }}>
      
      {/* Nav List */}
      <div style={{ flex: 1, padding: '14px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* SECTION 1: DEFAULT */}
        <div>
          <div style={{ padding: '0 18px 4px 18px', fontSize: '10px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.6px', fontWeight: '700', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>DEFAULT</span>
            <span style={{ fontSize: '9px' }}>⌵</span>
          </div>

          <div style={{ padding: '2px 18px 8px 18px', fontSize: '11px', color: '#94A3B8', lineHeight: '1.35' }}>
            No markets yet. Add one to watch its seller stress move.
            <div style={{ marginTop: '3px', color: '#3B82F6', cursor: 'pointer', fontWeight: '600', fontSize: '11px' }}>+ Add a market</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            
            {/* Motivated Sellers */}
            <Link
              href="/overview"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 18px',
                fontSize: '12px',
                fontWeight: pathname === '/overview' ? '700' : '400',
                color: pathname === '/overview' ? '#FFFFFF' : '#94A3B8',
                backgroundColor: pathname === '/overview' ? 'rgba(59, 130, 246, 0.14)' : 'transparent',
                borderLeft: pathname === '/overview' ? '3px solid #3B82F6' : '3px solid transparent',
                textDecoration: 'none',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: pathname === '/overview' ? '#3B82F6' : '#64748B' }}>
                bar_chart
              </span>
              <span>Motivated Sellers</span>
            </Link>

            {/* Market Rankings */}
            <Link
              href="/segments"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 18px',
                fontSize: '12px',
                fontWeight: (pathname === '/segments' || pathname === '/market-rankings') ? '700' : '400',
                color: (pathname === '/segments' || pathname === '/market-rankings') ? '#FFFFFF' : '#94A3B8',
                backgroundColor: (pathname === '/segments' || pathname === '/market-rankings') ? 'rgba(59, 130, 246, 0.14)' : 'transparent',
                borderLeft: (pathname === '/segments' || pathname === '/market-rankings') ? '3px solid #3B82F6' : '3px solid transparent',
                textDecoration: 'none',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: (pathname === '/segments' || pathname === '/market-rankings') ? '#3B82F6' : '#64748B' }}>
                leaderboard
              </span>
              <span>Market Rankings</span>
            </Link>

            {/* Watchlists */}
            <Link
              href="/investors"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 18px',
                fontSize: '12px',
                fontWeight: pathname === '/investors' ? '700' : '400',
                color: pathname === '/investors' ? '#FFFFFF' : '#94A3B8',
                backgroundColor: pathname === '/investors' ? 'rgba(59, 130, 246, 0.14)' : 'transparent',
                borderLeft: pathname === '/investors' ? '3px solid #3B82F6' : '3px solid transparent',
                textDecoration: 'none',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: pathname === '/investors' ? '#3B82F6' : '#64748B' }}>
                bookmark
              </span>
              <span>Watchlists</span>
            </Link>
          </div>
        </div>

        {/* SECTION 2: APPS (Includes the 3 Protected Required Features) */}
        <div>
          <div style={{ padding: '0 18px 4px 18px', fontSize: '10px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.6px', fontWeight: '700' }}>
            APPS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            
            {/* Data Vault App */}
            <Link
              href="/pipeline"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 18px',
                fontSize: '12px',
                fontWeight: pathname === '/pipeline' ? '700' : '400',
                color: pathname === '/pipeline' ? '#FFFFFF' : '#94A3B8',
                backgroundColor: pathname === '/pipeline' ? 'rgba(59, 130, 246, 0.14)' : 'transparent',
                borderLeft: pathname === '/pipeline' ? '3px solid #3B82F6' : '3px solid transparent',
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: pathname === '/pipeline' ? '#3B82F6' : '#64748B' }}>
                  storage
                </span>
                <span>Data Vault App</span>
              </div>
              <span style={{ fontSize: '10px', color: '#64748B' }}>↗</span>
            </Link>

            {/* REQUIRED FEATURE 1: Buyer Profiler */}
            <Link
              href="/profiler"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 18px',
                fontSize: '12px',
                fontWeight: pathname === '/profiler' ? '700' : '400',
                color: pathname === '/profiler' ? '#FFFFFF' : '#94A3B8',
                backgroundColor: pathname === '/profiler' ? 'rgba(59, 130, 246, 0.14)' : 'transparent',
                borderLeft: pathname === '/profiler' ? '3px solid #3B82F6' : '3px solid transparent',
                textDecoration: 'none',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: pathname === '/profiler' ? '#3B82F6' : '#64748B' }}>
                psychology
              </span>
              <span>Buyer Profiler</span>
            </Link>

            {/* REQUIRED FEATURE 2: Segment Insights */}
            <Link
              href="/insights"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 18px',
                fontSize: '12px',
                fontWeight: pathname === '/insights' ? '700' : '400',
                color: pathname === '/insights' ? '#FFFFFF' : '#94A3B8',
                backgroundColor: pathname === '/insights' ? 'rgba(59, 130, 246, 0.14)' : 'transparent',
                borderLeft: pathname === '/insights' ? '3px solid #3B82F6' : '3px solid transparent',
                textDecoration: 'none',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: pathname === '/insights' ? '#3B82F6' : '#64748B' }}>
                analytics
              </span>
              <span>Segment Insights</span>
            </Link>

            {/* REQUIRED FEATURE 3: Reports & Export */}
            <Link
              href="/reports"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 18px',
                fontSize: '12px',
                fontWeight: pathname === '/reports' ? '700' : '400',
                color: pathname === '/reports' ? '#FFFFFF' : '#94A3B8',
                backgroundColor: pathname === '/reports' ? 'rgba(59, 130, 246, 0.14)' : 'transparent',
                borderLeft: pathname === '/reports' ? '3px solid #3B82F6' : '3px solid transparent',
                textDecoration: 'none',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: pathname === '/reports' ? '#3B82F6' : '#64748B' }}>
                assessment
              </span>
              <span>Reports & Export</span>
            </Link>

            {/* Other Apps */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 18px', fontSize: '12px', color: '#64748B', cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#64748B' }}>
                grid_view
              </span>
              <span>Other Apps</span>
            </div>

          </div>
        </div>

      </div>

      {/* FREE PLAN CARD (EXACT REPLICA OF SCREENSHOT) */}
      <div style={{ margin: '0 10px 12px 10px', padding: '12px 14px', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.25)', backgroundColor: '#090D18' }}>
        <div style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#3B82F6', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '3px' }}>
          FREE PLAN
        </div>
        <p style={{ fontSize: '10.5px', color: '#94A3B8', lineHeight: '1.35', margin: '0 0 10px 0' }}>
          Pro unlocks every county and zip, full history, and unlimited tracked markets. $50/mo.
        </p>

        <div
          onClick={onOpenUpgrade}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 10px', borderRadius: '9999px', border: '1px solid #3B82F6', backgroundColor: '#070C18', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)' }}
        >
          <span>Activate Pro</span>
          <span style={{ width: '26px', height: '14px', borderRadius: '9999px', backgroundColor: '#090D16', border: '1px solid #3B82F6', display: 'flex', alignItems: 'center', padding: '1.5px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
          </span>
        </div>
      </div>

    </aside>
  );
}
