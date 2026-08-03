'use client';

export default function CohortModal({ isOpen, onClose, clusterData }) {
  if (!isOpen || !clusterData) return null;

  const { id, name, description, color, stats } = clusterData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 text-white transform transition-all duration-300">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-surface2 to-surface1 border-b border-white/10 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center font-headline font-bold text-2xl border" style={{
              backgroundColor: `${color}15`,
              borderColor: color,
              color: color,
              boxShadow: `0 0 20px ${color}40`,
            }}>
              {id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-headline font-bold">{name} Cohort Deep-Dive</h2>
                <span className="px-2.5 py-0.5 rounded-full font-label text-[10px] uppercase font-bold tracking-wider border" style={{
                  backgroundColor: `${color}20`,
                  borderColor: `${color}50`,
                  color: color,
                }}>
                  Active Segment
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">{description}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Cohort Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface1/60 border border-white/10 rounded-xl p-4">
              <div className="text-xs font-label text-slate-400 uppercase mb-1">Total Population</div>
              <div className="text-2xl font-headline font-bold text-white">{stats?.count || '1,402'}</div>
              <div className="text-[10px] text-slate-500 font-label mt-1">28.4% of total dataset</div>
            </div>

            <div className="bg-surface1/60 border border-white/10 rounded-xl p-4">
              <div className="text-xs font-label text-slate-400 uppercase mb-1">Avg Budget</div>
              <div className="text-2xl font-headline font-bold text-accent">{stats?.avgBudget || '$2.4M'}</div>
              <div className="text-[10px] text-slate-500 font-label mt-1">High Liquidity Cap</div>
            </div>

            <div className="bg-surface1/60 border border-white/10 rounded-xl p-4">
              <div className="text-xs font-label text-slate-400 uppercase mb-1">Cash Rate</div>
              <div className="text-2xl font-headline font-bold text-primary">{stats?.cashRate || '71.6%'}</div>
              <div className="text-[10px] text-slate-500 font-label mt-1">Non-mortgage acquisitions</div>
            </div>

            <div className="bg-surface1/60 border border-white/10 rounded-xl p-4">
              <div className="text-xs font-label text-slate-400 uppercase mb-1">Top Region</div>
              <div className="text-2xl font-headline font-bold text-secondary">{stats?.topRegion || 'UAE / US'}</div>
              <div className="text-[10px] text-slate-500 font-label mt-1">Urban Core Tier-1</div>
            </div>
          </div>

          {/* Demographic Breakdown */}
          <div className="bg-surface1/60 border border-white/10 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-headline font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">pie_chart</span>
              Demographic & Behavior Matrix
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-label text-slate-300 mb-1">
                  <span>Investment Intent vs Personal Use</span>
                  <span>78% / 22%</span>
                </div>
                <div className="w-full h-2 bg-surface3 rounded-full overflow-hidden flex">
                  <div className="h-full bg-primary" style={{ width: '78%' }} />
                  <div className="h-full bg-slate-600" style={{ width: '22%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-label text-slate-300 mb-1">
                  <span>Referral Channel Concentration (Direct / Agent)</span>
                  <span>64% Direct</span>
                </div>
                <div className="w-full h-2 bg-surface3 rounded-full overflow-hidden flex">
                  <div className="h-full bg-accent" style={{ width: '64%' }} />
                  <div className="h-full bg-surface3" style={{ width: '36%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xs font-label text-slate-400">Cluster Model: K-Means Engine v2.4</span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-primary hover:bg-blue-600 text-white font-headline font-bold rounded-lg text-xs uppercase tracking-wider shadow-glow-primary transition-all"
            >
              Close Breakdown
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
