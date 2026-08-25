'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { fetchLiveBuyerMetrics } from '../../lib/dataService';

export default function SegmentsPage() {
  const [metrics, setMetrics] = useState({
    totalBuyers: 2000,
    formattedTotalBuyers: '2,000',
    c1Count: 542,
    c1Pct: 27,
    c2Count: 764,
    c2Pct: 38,
    c3Count: 53,
    c3Pct: 3,
    c4Count: 641,
    c4Pct: 32,
    avgSatScore: '4.2',
    cashPct: 62,
    isLive: true,
  });

  const [selectedCluster, setSelectedCluster] = useState('all');

  useEffect(() => {
    fetchLiveBuyerMetrics().then((liveData) => {
      if (liveData) {
        setMetrics(liveData);
      }
    });
  }, []);

  const clusters = [
    {
      id: 'C1',
      name: 'Global Investors',
      count: metrics.c1Count,
      pct: metrics.c1Pct,
      color: '#3B82F6',
      badge: 'High Cash Liquidity',
      purpose: 'Investment (88%)',
      financing: '92% Cash',
      avgTicket: '$880,000',
      satScore: '4.4 / 5.0',
      profile: 'International & HNW domestic individuals deploying capital into high-growth metros.'
    },
    {
      id: 'C2',
      name: 'First-Time Buyers',
      count: metrics.c2Count,
      pct: metrics.c2Pct,
      color: '#10B981',
      badge: 'Mortgage Dependent',
      purpose: 'Primary Home (94%)',
      financing: '89% Loan',
      avgTicket: '$430,000',
      satScore: '4.1 / 5.0',
      profile: 'Younger demographic acquiring starter homes with loan financing and rate sensitivity.'
    },
    {
      id: 'C3',
      name: 'Corporate Buyers',
      count: metrics.c3Count,
      pct: metrics.c3Pct,
      color: '#F59E0B',
      badge: 'Institutional Capital',
      purpose: 'Commercial & SFR (100%)',
      financing: '75% Portfolio Credit',
      avgTicket: '$2,450,000',
      satScore: '4.8 / 5.0',
      profile: 'Enterprise real estate operating companies purchasing multiple units and portfolios.'
    },
    {
      id: 'C4',
      name: 'Luxury Investors',
      count: metrics.c4Count,
      pct: metrics.c4Pct,
      color: '#8B5CF6',
      badge: 'Premium Grade',
      purpose: 'Luxury Living & Yield (85%)',
      financing: '78% Cash',
      avgTicket: '$1,350,000',
      satScore: '4.9 / 5.0',
      profile: 'High-satisfaction investors seeking prime locations, high-end finishes, and prestige assets.'
    }
  ];

  const filteredClusters = selectedCluster === 'all'
    ? clusters
    : clusters.filter(c => c.id === selectedCluster);

  return (
    <DashboardLayout title="Buyer Segmentation" subtitle="K-Means Cluster Architecture & Demographic Partitioning">
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* 1. Header Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
              Market Rankings & Buyer Clusters
            </h2>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
              Machine Learning Segmentation ($K=4$, Silhouette Score $S=0.73$) derived from {metrics.formattedTotalBuyers} buyer transaction records.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', backgroundColor: '#05070E', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '9999px', fontSize: '11.5px', fontFamily: "'Space Mono', monospace", color: '#10B981' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
            <span>SUPABASE LIVE DATABASE: {metrics.formattedTotalBuyers} RECORDS</span>
          </div>
        </div>

        {/* 2. Cluster Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {clusters.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCluster(selectedCluster === c.id ? 'all' : c.id)}
              style={{
                padding: '20px',
                backgroundColor: '#05070E',
                border: '1px solid',
                borderColor: selectedCluster === c.id ? c.color : 'rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: selectedCluster === c.id ? `0 0 25px ${c.color}33` : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: c.color, fontWeight: 'bold' }}>{c.id}</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: c.color }}>{c.pct}%</span>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#FFFFFF', margin: '6px 0' }}>{c.name}</h3>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '12px' }}>{c.count.toLocaleString()} Buyers Identified</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px' }}>
                <span>Avg Ticket: <strong style={{ color: '#FFFFFF' }}>{c.avgTicket}</strong></span>
                <span>Financing: <strong style={{ color: '#FFFFFF' }}>{c.financing}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Deep Segment Dossier View */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          {filteredClusters.map((c) => (
            <div
              key={`detail-${c.id}`}
              style={{
                backgroundColor: '#05070E',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c.color }} />
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>{c.name} ({c.id})</h4>
                </div>
                <span style={{ padding: '3px 10px', borderRadius: '9999px', backgroundColor: `${c.color}22`, border: `1px solid ${c.color}55`, color: c.color, fontSize: '11px', fontWeight: '600' }}>
                  {c.badge}
                </span>
              </div>

              <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.5', margin: 0 }}>
                {c.profile}
              </p>

              {/* Metric Breakdown Table */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div style={{ padding: '10px', backgroundColor: '#090D16', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>ACQUISITION PURPOSE</div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#FFFFFF', marginTop: '2px' }}>{c.purpose}</div>
                </div>

                <div style={{ padding: '10px', backgroundColor: '#090D16', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>CAPITAL STRUCTURE</div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#FFFFFF', marginTop: '2px' }}>{c.financing}</div>
                </div>

                <div style={{ padding: '10px', backgroundColor: '#090D16', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>AVERAGE UNIT VALUATION</div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#10B981', marginTop: '2px' }}>{c.avgTicket}</div>
                </div>

                <div style={{ padding: '10px', backgroundColor: '#090D16', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>SATISFACTION SCORE</div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#F59E0B', marginTop: '2px' }}>{c.satScore}</div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
