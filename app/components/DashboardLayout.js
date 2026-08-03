'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '../../context/AuthContext';

const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });
const Topbar = dynamic(() => import('./Topbar'), { ssr: false });
const Footer = dynamic(() => import('./Footer'), { ssr: false });
const AnimationEnhancer = dynamic(() => import('./AnimationEnhancer'), { ssr: false });
const UpgradeModal = dynamic(() => import('./UpgradeModal'), { ssr: false });
const UserProfileModal = dynamic(() => import('./UserProfileModal'), { ssr: false });

/**
 * DashboardLayout — wraps all inner dashboard pages
 * Provides: Admin Authentication Protection (Auth Guard), sidebar, topbar, footer, animations, and global modals
 */
export default function DashboardLayout({ title, subtitle, children, topbarActions }) {
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
      <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center text-white font-body p-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-3xl animate-spin shadow-glow-primary mb-4">
          <span className="material-symbols-outlined">lock_clock</span>
        </div>
        <h3 className="text-xl font-headline font-bold mb-1">Verifying Admin Authentication...</h3>
        <p className="text-xs text-slate-400 font-label">Checking Supabase Auth Credentials & Session</p>
      </div>
    );
  }

  return (
    <div className="parcl-layout">
      {/* Animation system — runs on every page */}
      <AnimationEnhancer />

      {/* Ambient background orbs */}
      <div className="parcl-orb parcl-orb--blue" style={{
        width: 480, height: 480,
        top: -120, left: 180,
        animationDelay: '0s',
      }} />
      <div className="parcl-orb parcl-orb--violet" style={{
        width: 360, height: 360,
        top: 400, right: 80,
        animationDelay: '3s',
      }} />
      <div className="parcl-orb parcl-orb--green" style={{
        width: 280, height: 280,
        bottom: 80, left: 400,
        animationDelay: '6s',
      }} />

      {/* Sidebar with modal triggers */}
      <Sidebar
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <div className="parcl-main">
        {/* Topbar with modal triggers */}
        <Topbar
          title={title}
          subtitle={subtitle}
          actions={topbarActions}
          onOpenUpgrade={() => setIsUpgradeOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        <main className="parcl-content" style={{ paddingBottom: 56 }}>
          {children}
        </main>

        <Footer />
      </div>

      {/* Global Modals */}
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
