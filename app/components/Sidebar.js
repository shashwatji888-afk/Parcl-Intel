'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const MARKET_INTEL_NAV = [
  { href: '/overview',  label: 'Motivated Sellers', icon: 'bar_chart', badge: 'Live' },
  { href: '/segments',  label: 'Market Rankings',  icon: 'leaderboard' },
  { href: '/investors', label: 'Investor Behavior',icon: 'bookmark' },
];

const FLAGSHIP_ANALYTICS_NAV = [
  { href: '/profiler',  label: 'Buyer Profiler',   icon: 'psychology', badge: 'ML' },
  { href: '/insights',  label: 'Segment Insights', icon: 'analytics' },
  { href: '/reports',   label: 'Reports & Export', icon: 'assessment' },
];

const INFRASTRUCTURE_NAV = [
  { href: '/pipeline',  label: 'Data Vault & Pipeline', icon: 'storage', hasArrow: true },
];

export default function Sidebar({ onOpenUpgrade, onOpenProfile }) {
  const pathname = usePathname();
  const { user, profile } = useAuth();

  return (
    <aside style={{ width: '240px', backgroundColor: '#07080B', borderRight: '1px solid rgba(255, 255, 255, 0.08)', height: '100vh', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 40, overflowY: 'auto' }}>
      
      {/* Brand Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FFFFFF" />
            <path d="M2 17L12 22L22 17" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.6px' }}>PARCL</span>
        </Link>
        <span style={{ fontSize: '9.5px', fontFamily: "'Space Mono', monospace", color: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '2px 5px', borderRadius: '3px', fontWeight: 'bold' }}>
          v3.0
        </span>
      </div>

      {/* Navigation Groups */}
      <div style={{ flex: 1, padding: '14px 0', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        {/* SECTION 1: MARKET INTELLIGENCE */}
        <div>
          <div style={{ padding: '0 20px 6px 20px', fontSize: '10px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.8px', fontWeight: '700' }}>
            MARKET INTELLIGENCE
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {MARKET_INTEL_NAV.map((item) => {
              const isActive = pathname === item.href || (item.href === '/segments' && pathname === '/market-rankings');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 20px',
                    fontSize: '12.5px',
                    fontWeight: isActive ? '700' : '400',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                    borderLeft: isActive ? '3px solid #3B82F6' : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '17px', color: isActive ? '#3B82F6' : '#64748B' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{ fontSize: '9px', fontFamily: "'Space Mono', monospace", color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold' }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: FLAGSHIP ANALYTICS (Required Core Features) */}
        <div>
          <div style={{ padding: '0 20px 6px 20px', fontSize: '10px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.8px', fontWeight: '700' }}>
            FLAGSHIP ANALYTICS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {FLAGSHIP_ANALYTICS_NAV.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 20px',
                    fontSize: '12.5px',
                    fontWeight: isActive ? '700' : '400',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                    borderLeft: isActive ? '3px solid #3B82F6' : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '17px', color: isActive ? '#3B82F6' : '#64748B' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{ fontSize: '9px', fontFamily: "'Space Mono', monospace", color: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.15)', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold' }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: INFRASTRUCTURE */}
        <div>
          <div style={{ padding: '0 20px 6px 20px', fontSize: '10px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.8px', fontWeight: '700' }}>
            INFRASTRUCTURE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {INFRASTRUCTURE_NAV.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 20px',
                    fontSize: '12.5px',
                    fontWeight: isActive ? '700' : '400',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                    borderLeft: isActive ? '3px solid #3B82F6' : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '17px', color: isActive ? '#3B82F6' : '#64748B' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.hasArrow && <span style={{ fontSize: '11px', color: '#64748B' }}>›</span>}
                </Link>
              );
            })}
          </div>
        </div>

      </div>

      {/* FREE PLAN / ACTIVATE PRO TERMINAL CARD */}
      <div style={{ margin: '0 12px 14px 12px', padding: '12px 14px', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.25)', backgroundColor: '#090B12' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#3B82F6', textTransform: 'uppercase', fontWeight: 'bold' }}>
            FREE TIER
          </span>
          <span style={{ fontSize: '9.5px', color: '#64748B' }}>$50/mo</span>
        </div>
        <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.35', margin: '0 0 10px 0' }}>
          Unlock every county, ZIP code, and full historical buyer intelligence.
        </p>

        <div
          onClick={onOpenUpgrade}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', borderRadius: '9999px', border: '1px solid #3B82F6', backgroundColor: '#07090F', color: '#FFFFFF', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer' }}
        >
          <span>Activate Pro</span>
          <span style={{ width: '26px', height: '14px', borderRadius: '9999px', backgroundColor: '#0B0D14', border: '1px solid #3B82F6', display: 'flex', alignItems: 'center', padding: '1.5px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
          </span>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', backgroundColor: '#000000', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '11.5px', cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>notifications</span>
          <span>Alerts & Webhooks</span>
        </div>

        <div
          onClick={onOpenProfile}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#CBD5E1', fontSize: '11.5px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>account_circle</span>
            <span>Account Setting</span>
          </div>
          <span style={{ fontSize: '10px', color: '#64748B' }}>^</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#64748B', marginTop: '2px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span>in</span>
            <span>𝕏</span>
          </div>
          <span>© 2026 Parcl Intel</span>
        </div>

      </div>

    </aside>
  );
}
