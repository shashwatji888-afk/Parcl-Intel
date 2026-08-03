'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { href: '/overview',  label: 'Overview',  icon: 'dashboard'  },
  { href: '/segments',  label: 'Segments',  icon: 'pie_chart'  },
  { href: '/investors', label: 'Investors', icon: 'groups'     },
  { href: '/geography', label: 'Geography', icon: 'map'        },
  { href: '/insights',  label: 'Insights',  icon: 'analytics'  },
  { href: '/profiler',  label: 'Profiler',  icon: 'psychology' },
  { href: '/pipeline',  label: 'Pipeline',  icon: 'lan'        },
  { href: '/reports',   label: 'Reports',   icon: 'assessment' },
];

export default function Sidebar({ onOpenUpgrade, onOpenProfile }) {
  const pathname = usePathname();
  const { user, profile } = useAuth();

  const userName = profile?.full_name || user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Shashwat';
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || profile?.avatar_url;
  const userInitial = userName.charAt(0).toUpperCase();

  let userRole = profile?.role || user?.app_role || user?.role;
  if (!userRole || userRole === 'authenticated') {
    userRole = user?.email === 'shashwat@parclintel.io' ? 'Admin & Lead ML' : 'Real Estate Analyst';
  }

  return (
    <nav className="parcl-sidebar" role="navigation" aria-label="Main navigation">
      {/* Brand Header */}
      <div className="parcl-sidebar__brand">
        <Link href="/overview" style={{ textDecoration: 'none' }}>
          <div className="parcl-sidebar__logo flex items-center gap-2">
            <span>Parcl Intel</span>
          </div>
        </Link>
        <div className="parcl-sidebar__tagline">ML Intelligence</div>
      </div>

      {/* Nav Items */}
      <div className="parcl-sidebar__nav">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`parcl-nav-item${isActive ? ' active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="material-symbols-outlined parcl-nav-icon"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="parcl-nav-label">{item.label}</span>
            </Link>
          );
        })}

        {/* Upgrade Pro Card */}
        <div className="mt-4 px-1">
          <div
            onClick={onOpenUpgrade}
            className="p-3.5 rounded-xl border border-primary/30 bg-gradient-to-b from-primary/15 via-surface2/60 to-surface1 cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-label font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                Parcl Pro
              </span>
              <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[9px] font-label font-bold uppercase">
                Unlock
              </span>
            </div>

            <div className="text-xs font-headline font-bold text-white mb-2">
              Unlimited ML Models
            </div>

            <div className="w-full py-1.5 rounded-lg bg-primary group-hover:bg-blue-600 text-white font-headline font-bold text-[10px] uppercase tracking-wider text-center transition-colors shadow-glow-primary flex items-center justify-center gap-1">
              <span>Upgrade Now</span>
              <span className="material-symbols-outlined text-[12px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Footer Card */}
      <div className="parcl-sidebar__footer pt-3 border-t border-white/5 mt-auto px-2">
        <button
          type="button"
          onClick={onOpenProfile}
          className="w-full text-left bg-surface2/40 hover:bg-surface2/80 border border-white/5 hover:border-white/15 p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white border border-primary/40 flex-shrink-0 shadow-glow-primary">
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
            ) : (
              userInitial
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-headline font-semibold text-white truncate group-hover:text-primary transition-colors">
              {userName}
            </div>
            <div className="text-[10px] font-label text-slate-400 truncate">
              {userRole}
            </div>
          </div>

          <span className="material-symbols-outlined text-slate-500 group-hover:text-slate-300 text-sm flex-shrink-0">
            settings
          </span>
        </button>
      </div>
    </nav>
  );
}
