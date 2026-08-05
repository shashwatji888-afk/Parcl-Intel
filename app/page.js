'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user, profile } = useAuth();

  const userName = profile?.full_name || user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0];
  const avatarUrl = user?.user_metadata?.avatar_url || profile?.avatar_url;
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0F1E', color: '#F8FAFC', display: 'flex', flexDirection: 'column', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      
      {/* Top Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#2563EB', fontVariationSettings: "'FILL' 1" }}>
              analytics
            </span>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '20px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>
              PARCL INTEL
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/overview" style={{ color: '#2563EB', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>Overview</Link>
            <Link href="/segments" style={{ color: '#94A3B8', fontSize: '14px', textDecoration: 'none' }}>Segments</Link>
            <Link href="/investors" style={{ color: '#94A3B8', fontSize: '14px', textDecoration: 'none' }}>Investors</Link>
            <Link href="/geography" style={{ color: '#94A3B8', fontSize: '14px', textDecoration: 'none' }}>Geography</Link>
            <Link href="/profiler" style={{ color: '#94A3B8', fontSize: '14px', textDecoration: 'none' }}>Profiler</Link>
            <Link href="/reports" style={{ color: '#94A3B8', fontSize: '14px', textDecoration: 'none' }}>Reports</Link>
          </div>

          {user ? (
            <Link
              href="/overview"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 16px', borderRadius: '9999px', backgroundColor: '#1E293B', border: '1px solid rgba(37, 99, 235, 0.4)', color: '#ffffff', textDecoration: 'none', boxShadow: '0 0 15px rgba(37, 99, 235, 0.3)' }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={userName} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', color: '#fff' }}>
                  {userInitial}
                </div>
              )}
              <span style={{ fontSize: '12px', fontWeight: '700', fontFamily: "'Sora', sans-serif" }}>{userName}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#94A3B8' }}>arrow_forward</span>
            </Link>
          ) : (
            <Link
              href="/login"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#2563EB', color: '#ffffff', padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock_open</span>
              Sign In / Access Portal
            </Link>
          )}

        </div>
      </nav>

      {/* Main Hero Section */}
      <main style={{ flexGrow: 1, paddingTop: '140px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '64px' }}>
        
        {/* Hero Title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '890px', margin: '0 auto' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.04)', marginBottom: '32px', fontSize: '13px', color: '#CBD5E1' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <span>System Status: Intelligence Engine Online</span>
          </div>

          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '56px', fontWeight: '800', letterSpacing: '-1.5px', lineHeight: '1.15', color: '#ffffff', marginBottom: '24px' }}>
            Machine Learning <br />
            <span style={{ background: 'linear-gradient(135deg, #2563EB, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Buyer Intelligence
            </span> <br />
            for Real Estate
          </h1>

          <p style={{ fontSize: '18px', color: '#94A3B8', marginBottom: '40px', maxWidth: '640px', lineHeight: '1.6' }}>
            Discover hidden buyer segments, investment patterns, and market intelligence powered by AI clustering. Precision engineering for the modern real estate analyst.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              href="/overview"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563EB', color: '#ffffff', fontWeight: '700', padding: '14px 32px', borderRadius: '12px', fontSize: '15px', textDecoration: 'none', boxShadow: '0 0 25px rgba(37, 99, 235, 0.5)' }}
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              Launch Dashboard
            </Link>

            <Link
              href="/reports"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(30, 41, 59, 0.8)', color: '#ffffff', fontWeight: '600', padding: '14px 32px', borderRadius: '12px', fontSize: '15px', textDecoration: 'none', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              <span className="material-symbols-outlined">science</span>
              View Research
            </Link>
          </div>

        </div>

        {/* Feature Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          
          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(37, 99, 235, 0.15)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#2563EB', fontSize: '24px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>pie_chart</span>
            </div>
            <div style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px', color: '#94A3B8' }}>Clustering Output</div>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '20px', fontWeight: '700', color: '#ffffff', margin: 0 }}>4 Core Segments</h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>Automated K-Means clustering identifying distinct buyer personas.</p>
          </div>

          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#8B5CF6', fontSize: '24px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>trending_up</span>
            </div>
            <div style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px', color: '#94A3B8' }}>Prediction Rate</div>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '20px', fontWeight: '700', color: '#ffffff', margin: 0 }}>89.4% Precision</h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>High-confidence classification of new buyer profiles in real-time.</p>
          </div>

          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#10B981', fontSize: '24px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>public</span>
            </div>
            <div style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px', color: '#94A3B8' }}>Geographic Coverage</div>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '20px', fontWeight: '700', color: '#ffffff', margin: 0 }}>Tier-1 & Global</h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>Cross-border capital flow analysis and regional concentration metrics.</p>
          </div>

          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#F59E0B', fontSize: '24px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>insights</span>
            </div>
            <div style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px', color: '#94A3B8' }}>Database Scope</div>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '20px', fontWeight: '700', color: '#ffffff', margin: 0 }}>50k+ Profiles</h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>Continuous feature extraction and behavioral trend monitoring.</p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '24px', textAlign: 'center', fontSize: '12px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>© 2026 Parcl Intel. Real Estate Machine Learning Intelligence Engine.</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/reports" style={{ color: '#94A3B8', textDecoration: 'none' }}>Documentation</Link>
            <Link href="#" style={{ color: '#94A3B8', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/api/predict" style={{ color: '#94A3B8', textDecoration: 'none' }}>API Status</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}