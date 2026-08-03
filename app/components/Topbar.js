'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const styles = {
  wrapper: { display: 'flex', alignItems: 'center', gap: '16px' },
  mobileBtn: { display: 'none' },
  title: {
    fontFamily: "'Sora', sans-serif",
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    letterSpacing: '-0.3px',
  },
  subtitle: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '2px',
    fontFamily: "'Space Mono', monospace",
    letterSpacing: '0.5px',
  },
  actions: { display: 'flex', alignItems: 'center', gap: '16px' },
  statusWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: "'Space Mono', monospace",
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: 'var(--text-muted)',
  },
  dot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 0 6px rgba(16,185,129,0.8)',
    animation: 'pulse-dot 2s infinite',
    flexShrink: '0',
  },
  notifDot: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: 'var(--primary)',
    border: '1.5px solid var(--bg)',
    boxShadow: '0 0 6px rgba(37,99,235,0.8)',
  },
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    boxShadow: '0 0 16px rgba(37,99,235,0.3)',
  },
  ctaIcon: { fontSize: '16px' },
};

export default function Topbar({ title, subtitle, actions, onOpenProfile, onOpenUpgrade }) {
  const { user, profile } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const userName = profile?.full_name || user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || profile?.avatar_url;
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="parcl-topbar" role="banner">
      <div style={styles.wrapper}>
        <button className="parcl-icon-btn" style={styles.mobileBtn} aria-label="Open menu">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div>
          <div style={styles.title}>{title}</div>
          {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
        </div>
      </div>

      <div style={styles.actions}>
        {/* Pipeline status */}
        <div style={styles.statusWrap}>
          <div style={styles.dot} />
          Pipeline Active
        </div>

        {/* Search */}
        <div className="relative">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="parcl-icon-btn"
            aria-label="Search"
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          {showSearch && (
            <div className="absolute right-0 top-12 w-72 bg-surface2 border border-white/10 rounded-xl p-3 shadow-2xl z-50 animate-fadeIn">
              <input
                type="text"
                placeholder="Search profiles, clusters..."
                autoFocus
                className="w-full bg-surface1 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="parcl-icon-btn"
            aria-label="Notifications"
            style={{ position: 'relative' }}
          >
            <span className="material-symbols-outlined">notifications</span>
            <span style={styles.notifDot} />
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-surface2 border border-white/10 rounded-xl p-4 shadow-2xl z-50 animate-fadeIn space-y-3">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-xs font-headline font-bold text-white">Notifications</span>
                <span className="text-[10px] font-label text-accent font-bold">2 New</span>
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2 rounded bg-surface1/60 border border-white/5">
                  <div className="font-bold text-white">K-Means Cluster Run</div>
                  <div className="text-[10px] text-slate-400">50,247 records processed with score 0.73</div>
                </div>
                <div className="p-2 rounded bg-surface1/60 border border-white/5">
                  <div className="font-bold text-white font-label">New High-Yield Segment</div>
                  <div className="text-[10px] text-slate-400">C4 Luxury Investor activity +14% in UAE</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Shortcut Avatar */}
        <button
          onClick={onOpenProfile}
          className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border border-primary/40 hover:scale-105 transition-all shadow-glow-primary cursor-pointer p-0 bg-transparent"
          title={`Profile & Settings (${userName})`}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
              {userInitial}
            </div>
          )}
        </button>

        {/* Primary CTA */}
        {actions ?? (
          <button style={styles.cta} id="topbar-cta" onClick={onOpenUpgrade}>
            <span className="material-symbols-outlined" style={styles.ctaIcon}>auto_awesome</span>
            Pro Access
          </button>
        )}
      </div>
    </header>
  );
}
