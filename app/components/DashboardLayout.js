'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '../../context/AuthContext';

const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });
const Topbar = dynamic(() => import('./Topbar'), { ssr: false });
const Footer = dynamic(() => import('./Footer'), { ssr: false });
const UpgradeModal = dynamic(() => import('./UpgradeModal'), { ssr: false });
const UserProfileModal = dynamic(() => import('./UserProfileModal'), { ssr: false });

export default function DashboardLayout({ title, subtitle, children, actions }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Protect Admin Dashboard Routes
  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  // Loading state overlay
  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#030712', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', padding: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid rgba(59, 130, 246, 0.2)', borderTopColor: '#3B82F6', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, marginBottom: '4px' }}>Loading Parcl Terminal...</h3>
        <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>Connecting to Live Database</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#030712', color: '#F8FAFC', overflowX: 'hidden' }}>
      
      {/* 1. FIXED LEFT SIDEBAR */}
      <Sidebar
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* 2. MAIN CONTENT AREA (OFFSET BY 240px FOR SIDEBAR) */}
      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }}>
        
        {/* FIXED TOPBAR (OFFSET BY 240px) */}
        <Topbar
          title={title}
          subtitle={subtitle}
          actions={actions}
          onOpenUpgrade={() => setIsUpgradeOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* INNER SCROLLABLE PAGE CONTENT (PADDING FOR 86px TOPBAR) */}
        <main style={{ flex: 1, paddingTop: '92px', paddingBottom: '40px', paddingLeft: '32px', paddingRight: '32px', backgroundColor: '#030712' }}>
          {children}
        </main>

        {/* IN-FLOW NON-OVERLAPPING TERMINAL FOOTER */}
        <Footer />
      </div>

      {/* GLOBAL MODALS */}
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />
      
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenUpgrade={() => {
          setIsProfileOpen(false);
          setIsUpgradeOpen(true);
        }}
      />
    </div>
  );
}
