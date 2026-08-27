'use client';
import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { fetchLiveBuyerMetrics, subscribeToLiveBuyerUpdates } from '../../lib/dataService';

const CLUSTER_CONFIGS = {
  C1: {
    name: 'Global Investors',
    badge: 'High Cash Liquidity',
    color: '#3B82F6',
    borderClass: 'border-l-primary',
    bgBadge: 'bg-primary/20 text-primary border-primary/30',
    desc: 'High net-worth international buyers focusing on urban luxury and high-yield rentals. Demonstrates strong preference for cash transactions in tier-1 gateway cities.',
    avgAge: 48,
    purpose: 'Investment (88%)',
    strategy: 'Cross-border wire compliance, prime metro portfolio expansion, multi-unit allocation.'
  },
  C2: {
    name: 'First-Time Buyers',
    badge: 'Mortgage Dependent',
    color: '#10B981',
    borderClass: 'border-l-emerald-500',
    bgBadge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    desc: 'Younger demographic acquiring starter homes with loan financing. Highly sensitive to mortgage rate shifts and localized affordability indices.',
    avgAge: 32,
    purpose: 'Primary Home (94%)',
    strategy: 'Rate-lock incentives, down-payment assistance advisory, fast closing escrow support.'
  },
  C3: {
    name: 'Corporate Entities',
    badge: 'Institutional Capital',
    color: '#F59E0B',
    borderClass: 'border-l-amber-500',
    bgBadge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    desc: 'Institutional REITs, syndicates, and enterprise funds executing algorithmic bulk residential acquisitions for rental yields and build-to-rent communities.',
    avgAge: 'N/A (Enterprise)',
    purpose: 'Commercial Portfolio (98%)',
    strategy: 'Bulk API integration, automated MLS feed ingestion, underwriting automation.'
  },
  C4: {
    name: 'Luxury Investors',
    badge: 'Ultra High Net Worth',
    color: '#8B5CF6',
    borderClass: 'border-l-purple-500',
    bgBadge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    desc: 'Ultra-high net-worth domestic and international private clients targeting trophy assets, coastal enclaves, and premium vacation destinations.',
    avgAge: 54,
    purpose: 'Secondary Home & Wealth Preservation (76%)',
    strategy: 'Bespoke off-market listings, private concierge transaction structuring, white-glove closing.'
  }
};

export default function InsightsPage() {
  const [metrics, setMetrics] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState('C1');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterPurpose, setFilterPurpose] = useState('all');
  const [filterClientType, setFilterClientType] = useState('all');

  useEffect(() => {
    fetchLiveBuyerMetrics().then((data) => {
      if (data) setMetrics(data);
    });

    const unsub = subscribeToLiveBuyerUpdates((fresh) => {
      if (fresh) setMetrics(fresh);
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  // Filter buyers dynamically
  const filteredBuyers = useMemo(() => {
    if (!metrics?.rawBuyers) return [];
    let list = metrics.rawBuyers;
    if (filterCountry !== 'all') {
      list = list.filter(b => (b.country || '').toLowerCase().includes(filterCountry.toLowerCase()));
    }
    if (filterPurpose !== 'all') {
      list = list.filter(b => (b.acquisition_purpose || '').toLowerCase().includes(filterPurpose.toLowerCase()));
    }
    if (filterClientType !== 'all') {
      list = list.filter(b => (b.client_type || '').toLowerCase().includes(filterClientType.toLowerCase()));
    }
    return list;
  }, [metrics, filterCountry, filterPurpose, filterClientType]);

  // Compute cluster-specific analytics from filtered dataset
  const clusterStats = useMemo(() => {
    const clusterBuyers = filteredBuyers.filter(b => (b.predicted_cluster_id || 'C1') === selectedCluster);
    const count = clusterBuyers.length;
    const totalFiltered = filteredBuyers.length || 1;
    const pct = Math.round((count / totalFiltered) * 100);

    let loanCount = 0;
    let totalSat = 0;
    const regionFreq = {};

    clusterBuyers.forEach(b => {
      if (b.loan_applied) loanCount++;
      totalSat += parseFloat(b.satisfaction_score || 8.0);
      const reg = b.region || 'California';
      regionFreq[reg] = (regionFreq[reg] || 0) + 1;
    });

    const loanRate = count > 0 ? Math.round((loanCount / count) * 100) : 10;
    const cashRate = 100 - loanRate;
    const avgSat = count > 0 ? (totalSat / count).toFixed(1) : '8.4';

    const topRegions = Object.entries(regionFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    return {
      count,
      pct,
      loanRate,
      cashRate,
      avgSat,
      topRegions
    };
  }, [filteredBuyers, selectedCluster]);

  const activeConf = CLUSTER_CONFIGS[selectedCluster] || CLUSTER_CONFIGS.C1;

  return (
    <DashboardLayout
      title="Segment Insights"
      subtitle="Descriptive statistics and deep analytics per buyer cluster"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Page Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '11px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>analytics</span>
            <span>CLUSTER DEEP DIVE</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.6px', margin: 0 }}>
            Segment Insights Panel
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
            Descriptive statistics and machine learning behavioral metrics per buyer cohort.
          </p>
        </div>

        {/* Filters Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', flexWrap: 'wrap' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#64748B' }}>filter_list</span>

          {/* Country Filter */}
          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            style={{ padding: '5px 10px', backgroundColor: '#000000', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', color: '#FFFFFF', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">All Countries</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="UAE">UAE</option>
            <option value="Singapore">Singapore</option>
          </select>

          {/* Purpose Filter */}
          <select
            value={filterPurpose}
            onChange={(e) => setFilterPurpose(e.target.value)}
            style={{ padding: '5px 10px', backgroundColor: '#000000', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', color: '#FFFFFF', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">All Acquisition Purposes</option>
            <option value="Investment">Investment</option>
            <option value="Personal Use">Personal Use</option>
          </select>

          {/* Client Type Filter */}
          <select
            value={filterClientType}
            onChange={(e) => setFilterClientType(e.target.value)}
            style={{ padding: '5px 10px', backgroundColor: '#000000', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', color: '#FFFFFF', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">All Client Types</option>
            <option value="Individual">Individual</option>
            <option value="Corporate">Corporate</option>
          </select>

          <div style={{ marginLeft: 'auto', fontSize: '11.5px', color: '#94A3B8', fontFamily: "'Space Mono', monospace" }}>
            ● Active Cohort: <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>{filteredBuyers.length.toLocaleString()} Live Profiles</span>
          </div>
        </div>

        {/* Cluster Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '2px', overflowX: 'auto' }}>
          {Object.entries(CLUSTER_CONFIGS).map(([cId, conf]) => {
            const isActive = selectedCluster === cId;
            return (
              <button
                key={cId}
                type="button"
                onClick={() => setSelectedCluster(cId)}
                style={{
                  padding: '8px 16px',
                  borderBottom: isActive ? `2px solid ${conf.color}` : '2px solid transparent',
                  backgroundColor: 'transparent',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  fontSize: '12.5px',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: conf.color }} />
                <span>{cId} {conf.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Cluster Detail Card & KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          
          {/* Main Cluster Overview Card */}
          <div style={{ backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderLeft: `3px solid ${activeConf.color}`, borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'inline-flex', padding: '2px 6px', borderRadius: '3px', backgroundColor: `${activeConf.color}18`, border: `1px solid ${activeConf.color}33`, color: activeConf.color, fontSize: '10.5px', fontFamily: "'Space Mono', monospace", fontWeight: 'bold', width: 'max-content' }}>
              {selectedCluster} · {activeConf.badge}
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
              {activeConf.name}
            </h2>

            <p style={{ fontSize: '12.5px', color: '#94A3B8', lineHeight: '1.5', margin: 0 }}>
              {activeConf.desc}
            </p>

            <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '10.5px', color: '#64748B', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase' }}>Strategy Recommendation</div>
              <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '2px' }}>{activeConf.strategy}</div>
            </div>
          </div>

          {/* 4-KPI Analytics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            
            <div style={{ padding: '14px', backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase' }}>COHORT VOLUME</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', marginTop: '2px' }}>
                {clusterStats.count.toLocaleString()} <span style={{ fontSize: '12px', color: '#3B82F6' }}>({clusterStats.pct}%)</span>
              </div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>Total live records in cluster</div>
            </div>

            <div style={{ padding: '14px', backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase' }}>CASH VS LOAN</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#10B981', marginTop: '2px' }}>
                {clusterStats.cashRate}% <span style={{ fontSize: '11px', color: '#64748B' }}>Cash</span>
              </div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>{clusterStats.loanRate}% Mortgage Financing</div>
            </div>

            <div style={{ padding: '14px', backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase' }}>AVG SATISFACTION</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#F59E0B', marginTop: '2px' }}>
                {clusterStats.avgSat} <span style={{ fontSize: '11px', color: '#64748B' }}>/ 10</span>
              </div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>Post-purchase rating</div>
            </div>

            <div style={{ padding: '14px', backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase' }}>PRIMARY INTENT</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#3B82F6', marginTop: '4px' }}>
                {activeConf.purpose}
              </div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>Dominant acquisition purpose</div>
            </div>

          </div>
        </div>

        {/* Top Geographic Metros for this Cluster */}
        <div style={{ backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 12px 0' }}>
            Top Active Regions for {activeConf.name}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            {clusterStats.topRegions.map(([regName, cnt], idx) => (
              <div key={regName} style={{ padding: '10px 14px', backgroundColor: '#000000', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>#{idx + 1} REGION</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF', marginTop: '2px' }}>{regName}</div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: activeConf.color, fontFamily: "'Space Mono', monospace" }}>
                  {cnt} buyers
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
