'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { fetchLiveBuyerMetrics, subscribeToLiveBuyerUpdates } from '../../lib/dataService';

export default function InvestorsPage() {
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

  useEffect(() => {
    fetchLiveBuyerMetrics().then((liveData) => {
      if (liveData) {
        setMetrics(liveData);
      }
    });

    const unsub = subscribeToLiveBuyerUpdates((fresh) => {
      if (fresh) setMetrics(fresh);
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const total = metrics.totalBuyers || 2000;
  const cashPct = metrics.cashPct !== undefined ? metrics.cashPct : 62;
  const loanPct = 100 - cashPct;
  const cashCount = Math.round((total * cashPct) / 100);
  const loanCount = total - cashCount;

  return (
    <DashboardLayout title="Investor Behavior" subtitle="Financing Distribution & Capital Flow Intelligence">
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', margin: 0, letterSpacing: '-0.4px' }}>
              Investor Financing & Capital Flows
            </h2>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
              Cash liquidity vs mortgage dependence across individual and institutional buyers in live database.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px', backgroundColor: '#090A0E', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '4px', fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#3B82F6' }}>
            <span>● {cashPct}% CASH / {loanPct}% MORTGAGE CAPITAL</span>
          </div>
        </div>

        {/* 4-KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          
          <div style={{ padding: '16px 20px', backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px' }}>
            <div style={{ fontSize: '10.5px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase' }}>CASH PURCHASES</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#10B981', marginTop: '4px', letterSpacing: '-0.5px' }}>{cashPct}%</div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>{cashCount.toLocaleString()} All-Cash Transactions</div>
          </div>

          <div style={{ padding: '16px 20px', backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px' }}>
            <div style={{ fontSize: '10.5px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase' }}>MORTGAGE / LOAN</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#3B82F6', marginTop: '4px', letterSpacing: '-0.5px' }}>{loanPct}%</div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>{loanCount.toLocaleString()} Financing-Dependent Buyers</div>
          </div>

          <div style={{ padding: '16px 20px', backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px' }}>
            <div style={{ fontSize: '10.5px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase' }}>AVG SATISFACTION</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#F59E0B', marginTop: '4px', letterSpacing: '-0.5px' }}>{metrics.avgSatScore} / 5.0</div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>Post-Transaction Net Rating</div>
          </div>

          <div style={{ padding: '16px 20px', backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px' }}>
            <div style={{ fontSize: '10.5px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase' }}>INSTITUTIONAL SHARE</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#8B5CF6', marginTop: '4px', letterSpacing: '-0.5px' }}>{metrics.c3Count || 53} Co.</div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>Corporate & Enterprise Funds ({metrics.c3Pct}%)</div>
          </div>

        </div>

        {/* Financing Breakdown Table by Cluster */}
        <div style={{ backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 14px 0' }}>
            Capital Channels & Financing Behavior by Cluster
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '14px', backgroundColor: '#000000', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: '12.5px' }}>C1 Global Investors ({metrics.c1Count || 542} buyers)</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '4px 0' }}>92% Cash / 8% Loan</div>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>International cross-border wire transfers, minimal interest rate sensitivity.</p>
            </div>

            <div style={{ padding: '14px', backgroundColor: '#000000', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ color: '#10B981', fontWeight: 'bold', fontSize: '12.5px' }}>C2 First-Time Buyers ({metrics.c2Count || 764} buyers)</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '4px 0' }}>89% Loan / 11% Cash</div>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>Conventional 30-year fixed & FHA loans, highly sensitive to mortgage rates.</p>
            </div>

            <div style={{ padding: '14px', backgroundColor: '#000000', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: '12.5px' }}>C3 Corporate Entities ({metrics.c3Count || 53} buyers)</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '4px 0' }}>98% Cash / Line of Credit</div>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>Institutional liquidity facilities, bulk single-family portfolio acquisitions.</p>
            </div>

            <div style={{ padding: '14px', backgroundColor: '#000000', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ color: '#8B5CF6', fontWeight: 'bold', fontSize: '12.5px' }}>C4 Luxury Investors ({metrics.c4Count || 641} buyers)</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '4px 0' }}>84% Cash / 16% Private Bank</div>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>High net-worth asset backed financing, prime residential estates.</p>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
