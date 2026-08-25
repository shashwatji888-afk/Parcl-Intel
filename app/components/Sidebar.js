'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

// Streamlined essential navigation links for maximum efficiency
const NAV_ITEMS = [
  { href: '/overview',  label: 'Motivated Sellers', icon: 'bar_chart' },
  { href: '/segments',  label: 'Market Rankings',  icon: 'leaderboard' },
  { href: '/investors', label: 'Watchlists',       icon: 'bookmark' },
  { href: '/reports',   label: 'Reports & Data',   icon: 'assessment' },
];

export default function Sidebar({ onOpenUpgrade, onOpenProfile }) {
  const pathname = usePathname();
  const { user, profile } = useAuth();

  const userName = profile?.full_name || user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Shashwat';
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || profile?.avatar_url;

  return (
    <aside style={{ width: '240px', backgroundColor: '#070B14', borderRight: '1px solid rgba(255, 255, 255, 0.08)', height: '100vh', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 40, overflowY: 'auto' }}>
      
      {/* Brand Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', backgroundColor: '#04070F' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FFFFFF" />
            <path d="M2 17L12 22L22 17" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.5px' }}>PARCL</span>
        </Link>
      </div>

      {/* Nav List */}
      <div style={{ flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* DEFAULT SECTION */}
        <div>
          <div style={{ padding: '0 20px 8px 20px', fontSize: '10.5px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', color: '#64748B', letterSpacing: '1px', fontWeight: 'bold' }}>
            DEFAULT
          </div>

          <div style={{ padding: '4px 20px 10px 20px', fontSize: '11.5px', color: '#94A3B8', lineHeight: '1.4' }}>
            No markets yet. Add one to watch its seller stress move.
            <div style={{ marginTop: '4px', color: '#60A5FA', cursor: 'pointer', fontWeight: '600' }}>+ Add a market</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 20px',
                    fontSize: '13px',
                    fontWeight: isActive ? '700' : '400',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    borderLeft: isActive ? '3px solid #3B82F6' : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '19px', color: isActive ? '#3B82F6' : '#64748B' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* APPS SECTION */}
        <div>
          <div style={{ padding: '0 20px 8px 20px', fontSize: '10.5px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', color: '#64748B', letterSpacing: '1px', fontWeight: 'bold' }}>
            APPS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Link
              href="/pipeline"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px', fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748B' }}>storage</span>
                <span>Data Vault App</span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748B' }}>›</span>
            </Link>
          </div>
        </div>

      </div>

      {/* FREE PLAN CARD */}
      <div style={{ margin: '0 12px 12px 12px', padding: '14px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.25)', backgroundColor: '#04070F' }}>
        <div style={{ fontSize: '10.5px', fontFamily: "'Space Mono', monospace", color: '#60A5FA', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>
          FREE PLAN
        </div>
        <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.4', margin: '0 0 12px 0' }}>
          Pro unlocks every county and zip, full history, and unlimited tracked markets. $50/mo.
        </p>

        <button
          type="button"
          onClick={onOpenUpgrade}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', borderRadius: '9999px', border: '1px solid #3B82F6', backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 0 15px rgba(37, 99, 235, 0.4)' }}
        >
          <span>Activate Pro</span>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
        </button>
      </div>

      {/* FOOTER ACTIONS */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', backgroundColor: '#04070F', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '12px', cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>notifications</span>
          <span>Alerts</span>
        </div>

        <div
          onClick={onOpenProfile}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#CBD5E1', fontSize: '12px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>account_circle</span>
            <span>Account</span>
          </div>
          <span style={{ fontSize: '10px', color: '#64748B' }}>^</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10.5px', color: '#64748B', marginTop: '4px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span>in</span>
            <span>𝕏</span>
          </div>
          <span>© 2026 Parcl Labs</span>
        </div>

      </div>

    </aside>
  );
}
