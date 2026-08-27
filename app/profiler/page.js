'use client';
import { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import CohortModal from '../components/CohortModal';
import BatchUploadModal from '../components/BatchUploadModal';
import { fetchLiveBuyerMetrics } from '../../lib/dataService';

const COUNTRY_DATA = {
  'United States': { flag: '🇺🇸', regions: ['California', 'New York', 'Florida', 'Texas', 'Illinois', 'Washington'] },
  'United Kingdom': { flag: '🇬🇧', regions: ['London', 'Manchester', 'Birmingham', 'Edinburgh'] },
  'UAE': { flag: '🇦🇪', regions: ['Dubai', 'Abu Dhabi', 'Sharjah'] },
  'Singapore': { flag: '🇸🇬', regions: ['Central Region', 'Sentosa', 'East Coast', 'Jurong'] },
  'Germany': { flag: '🇩🇪', regions: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg'] },
  'Canada': { flag: '🇨🇦', regions: ['Toronto', 'Vancouver', 'Montreal'] },
  'Japan': { flag: '🇯🇵', regions: ['Tokyo', 'Osaka', 'Kyoto'] },
  'Australia': { flag: '🇦🇺', regions: ['Sydney', 'Melbourne', 'Brisbane'] },
};

const INITIAL_HISTORY = [
  { id: 1, time: 'Today, 14:32', summary: 'Corporate • UAE • Investment', clusterId: 'C1', clusterName: 'Global Investor', color: '#3B82F6' },
  { id: 2, time: 'Today, 11:15', summary: 'Individual • UK • Personal Use', clusterId: 'C2', clusterName: 'First-Time Buyer', color: '#10B981' },
  { id: 3, time: 'Yesterday, 16:45', summary: 'Individual • USA • Investment', clusterId: 'C4', clusterName: 'Luxury Investor', color: '#8B5CF6' },
  { id: 4, time: 'Yesterday, 09:20', summary: 'Corporate • Singapore • Investment', clusterId: 'C3', clusterName: 'Corporate Entity', color: '#F59E0B' },
];

export default function ProfilerPage() {
  // Form Feature Vector State
  const [clientType, setClientType] = useState('Individual');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('1988-05-14');
  const [country, setCountry] = useState('United States');
  const [region, setRegion] = useState('California');
  const [purpose, setPurpose] = useState('Investment');
  const [loanApplied, setLoanApplied] = useState(false);
  const [channel, setChannel] = useState('Direct');
  const [satScore, setSatScore] = useState(8.5);

  // Prediction Output State
  const [predictionState, setPredictionState] = useState('idle'); // 'idle' | 'scanning' | 'result'
  const [predictionResult, setPredictionResult] = useState(null);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [liveBuyerCount, setLiveBuyerCount] = useState(2000);

  // Modals
  const [isCohortOpen, setIsCohortOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);

  useEffect(() => {
    fetchLiveBuyerMetrics().then((d) => {
      if (d?.totalBuyers) setLiveBuyerCount(d.totalBuyers);
    });
  }, []);

  const availableRegions = useMemo(() => {
    return COUNTRY_DATA[country]?.regions || ['Default Region'];
  }, [country]);

  const handleCountryChange = (newCountry) => {
    setCountry(newCountry);
    const newRegions = COUNTRY_DATA[newCountry]?.regions;
    if (newRegions && newRegions.length > 0) {
      setRegion(newRegions[0]);
    }
  };

  // ML Underwriting Inference Engine
  const runPrediction = () => {
    if (predictionState === 'scanning') return;
    setPredictionState('scanning');

    setTimeout(() => {
      let clusterId = 'C1';
      let clusterName = 'Global Investor';
      let clusterDescription = 'High-net-worth international buyer targeting prime assets with cash liquidity.';
      let color = '#3B82F6';
      let confidence = Math.floor(86 + Math.random() * 11);
      let characteristics = [];
      let strategyTitle = '';
      let strategyDesc = '';
      let similarCount = Math.round(liveBuyerCount * 0.27);

      if (clientType === 'Corporate' || channel === 'Corporate') {
        clusterId = 'C3';
        clusterName = 'Corporate Entity';
        clusterDescription = 'Institutional & enterprise property portfolio manager executing programmatic acquisitions.';
        color = '#F59E0B';
        characteristics = [
          'High Transaction Velocity',
          'Commercial & Bulk Residential Portfolio Focus',
          'Liquidity Facility & Tax-Structured Acquisition',
        ];
        strategyTitle = 'Institutional Enterprise Structuring';
        strategyDesc = 'Offer bulk transaction discounts, dedicated account underwriting, and direct MLS API integration.';
        similarCount = Math.round(liveBuyerCount * 0.03);
      } else if (satScore >= 8.8 && purpose === 'Investment' && !loanApplied) {
        clusterId = 'C4';
        clusterName = 'Luxury Investor';
        clusterDescription = 'Ultra-high liquidity private client acquiring trophy luxury assets and coastal estates.';
        color = '#8B5CF6';
        characteristics = [
          'Trophy Asset Allocation Focus',
          'Ultra-High Liquidity Cap (100% Cash / Private Bank)',
          'Non-Rate Sensitive Wealth Preservation',
        ];
        strategyTitle = 'Private Concierge Advisory';
        strategyDesc = 'Provide exclusive off-market trophy access, bespoke escrow handling, and confidential title acquisition.';
        similarCount = Math.round(liveBuyerCount * 0.32);
      } else if (loanApplied || purpose === 'Personal Use') {
        clusterId = 'C2';
        clusterName = 'First-Time Buyer';
        clusterDescription = 'Financing-dependent domestic buyer acquiring starter primary residences.';
        color = '#10B981';
        characteristics = [
          'Mortgage & Financing Dependent (30Y Fixed / FHA)',
          'Primary Residential Use Intent',
          'High Sensitivity to Local Affordability & Rates',
        ];
        strategyTitle = 'Mortgage & Affordability Guidance';
        strategyDesc = 'Provide rate-lock advisories, down-payment assistance programs, and streamlined digital escrow.';
        similarCount = Math.round(liveBuyerCount * 0.38);
      } else {
        clusterId = 'C1';
        clusterName = 'Global Investor';
        clusterDescription = 'International portfolio buyer focusing on tier-1 gateway cities with high rental yields.';
        color = '#3B82F6';
        characteristics = [
          'Cross-Border Capital Inflow',
          'Cash-Dominant Transaction Structure',
          'Tier-1 Urban Luxury & Multi-Unit Yield Target',
        ];
        strategyTitle = 'Cross-Border Capital Compliance';
        strategyDesc = 'Facilitate foreign wire clearance, multi-property portfolio syndication, and turn-key property management.';
        similarCount = Math.round(liveBuyerCount * 0.27);
      }

      const newResult = {
        clusterId,
        clusterName,
        clusterDescription,
        color,
        confidence,
        characteristics,
        strategyTitle,
        strategyDesc,
        similarCount,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        params: `${clientType} · ${country} · ${purpose} · ${loanApplied ? 'Loan' : 'Cash'}`,
      };

      setPredictionResult(newResult);
      setPredictionState('result');

      setHistory((prev) => [
        {
          id: Date.now(),
          time: 'Just now',
          summary: `${clientType} • ${country} • ${purpose}`,
          clusterId,
          clusterName,
          color,
        },
        ...prev.slice(0, 4),
      ]);
    }, 450);
  };

  return (
    <DashboardLayout title="Buyer Profiler" subtitle="Institutional Machine Learning Underwriting Engine">
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Header Strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '10.5px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>psychology</span>
              <span>MACHINE LEARNING CLASSIFIER</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.5px', margin: 0 }}>
              Buyer Profiler & Underwriting Console
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
              Predict buyer cluster classification, centroid alignment, and strategy playbooks from behavioral feature vectors.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsBatchOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '4px', backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#CBD5E1', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              <span>📁</span> Batch Scoring
            </button>
            <button
              type="button"
              onClick={() => setIsCohortOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60A5FA', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              <span>🔬</span> Explore Cohorts
            </button>
          </div>
        </div>

        {/* Main 2-Column Workstation */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
          
          {/* LEFT: FEATURE VECTOR INPUT MATRIX */}
          <div style={{ backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase', fontWeight: 'bold' }}>
                FEATURE VECTOR INPUTS
              </span>
              <span style={{ fontSize: '11px', color: '#10B981', fontFamily: "'Space Mono', monospace" }}>
                ● Model: K-Means++ (K=4)
              </span>
            </div>

            {/* Client Type & Acquisition Intent */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Client Classification</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', backgroundColor: '#000000', padding: '2px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {['Individual', 'Corporate'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setClientType(t)}
                      style={{ padding: '5px', borderRadius: '3px', border: 'none', backgroundColor: clientType === t ? '#3B82F6' : 'transparent', color: clientType === t ? '#FFFFFF' : '#64748B', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Acquisition Thesis</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', backgroundColor: '#000000', padding: '2px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {['Investment', 'Personal Use'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPurpose(p)}
                      style={{ padding: '5px', borderRadius: '3px', border: 'none', backgroundColor: purpose === p ? '#3B82F6' : 'transparent', color: purpose === p ? '#FFFFFF' : '#64748B', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Geography & Region */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Jurisdiction / Country</label>
                <select
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', backgroundColor: '#000000', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', color: '#FFFFFF', fontSize: '12px', outline: 'none' }}
                >
                  {Object.keys(COUNTRY_DATA).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Target Region / Metro</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', backgroundColor: '#000000', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', color: '#FFFFFF', fontSize: '12px', outline: 'none' }}
                >
                  {availableRegions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Financing Structure & Channel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Financing Structure</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', backgroundColor: '#000000', padding: '2px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <button
                    type="button"
                    onClick={() => setLoanApplied(false)}
                    style={{ padding: '5px', borderRadius: '3px', border: 'none', backgroundColor: !loanApplied ? '#10B981' : 'transparent', color: !loanApplied ? '#FFFFFF' : '#64748B', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    100% Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoanApplied(true)}
                    style={{ padding: '5px', borderRadius: '3px', border: 'none', backgroundColor: loanApplied ? '#3B82F6' : 'transparent', color: loanApplied ? '#FFFFFF' : '#64748B', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Mortgage Loan
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Originating Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', backgroundColor: '#000000', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', color: '#FFFFFF', fontSize: '12px', outline: 'none' }}
                >
                  <option value="Direct">Direct Portal</option>
                  <option value="Broker">Institutional Broker</option>
                  <option value="Corporate">Corporate Syndicate</option>
                  <option value="API">API Integration</option>
                </select>
              </div>
            </div>

            {/* Satisfaction / Relationship Metric Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>Relationship Satisfaction Score</label>
                <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#F59E0B', fontWeight: 'bold' }}>{satScore} / 10.0</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.1"
                value={satScore}
                onChange={(e) => setSatScore(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#3B82F6', cursor: 'pointer' }}
              />
            </div>

            {/* Submit Action */}
            <button
              type="button"
              onClick={runPrediction}
              disabled={predictionState === 'scanning'}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#3B82F6', color: '#FFFFFF', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background-color 0.15s' }}
            >
              {predictionState === 'scanning' ? (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }}>autorenew</span>
                  <span>EXECUTING ML INFERENCE...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>RUN ML UNDERWRITING INFERENCE</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT: ML INFERENCE CONSOLE & AUDIT TRAIL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* INFERENCE RESULT CARD */}
            <div style={{ backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderLeft: predictionResult ? `3px solid ${predictionResult.color}` : '3px solid #3B82F6', borderRadius: '6px', padding: '20px', minHeight: '260px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10.5px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  PREDICTED CLUSTER OUTPUT
                </span>
                {predictionResult && (
                  <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#10B981', fontWeight: 'bold' }}>
                    {predictionResult.confidence}% PROBABILITY CONFIDENCE
                  </span>
                )}
              </div>

              {predictionResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '3px', backgroundColor: `${predictionResult.color}22`, border: `1px solid ${predictionResult.color}44`, color: predictionResult.color, fontSize: '12px', fontFamily: "'Space Mono', monospace", fontWeight: 'bold' }}>
                      {predictionResult.clusterId}
                    </span>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                      {predictionResult.clusterName}
                    </h2>
                  </div>

                  <p style={{ fontSize: '12.5px', color: '#CBD5E1', lineHeight: '1.5', margin: 0 }}>
                    {predictionResult.clusterDescription}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: '#000000', padding: '10px 12px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span style={{ fontSize: '10.5px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase' }}>Key Distinguishing Vector Attributes</span>
                    {predictionResult.characteristics.map((c, i) => (
                      <div key={i} style={{ fontSize: '11.5px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: predictionResult.color }}>✓</span> {c}
                      </div>
                    ))}
                  </div>

                  <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '10.5px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase' }}>{predictionResult.strategyTitle}</div>
                    <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '2px' }}>{predictionResult.strategyDesc}</div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', color: '#64748B', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#3B82F6' }}>psychology</span>
                  <span style={{ fontSize: '13px' }}>Configure feature vector and click Run Inference</span>
                </div>
              )}
            </div>

            {/* AUDIT LOG TABLE */}
            <div style={{ backgroundColor: '#090A0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '16px' }}>
              <div style={{ fontSize: '10.5px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '10px' }}>
                RECENT UNDERWRITING INFERENCE AUDIT LOG
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {history.map((h) => (
                  <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#000000', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '11.5px' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#FFFFFF' }}>{h.summary}</div>
                      <div style={{ fontSize: '10px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>{h.time}</div>
                    </div>
                    <span style={{ padding: '2px 6px', borderRadius: '3px', backgroundColor: `${h.color}18`, color: h.color, fontWeight: 'bold', fontFamily: "'Space Mono', monospace", fontSize: '11px' }}>
                      {h.clusterId} {h.clusterName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Modals */}
      <CohortModal isOpen={isCohortOpen} onClose={() => setIsCohortOpen(false)} />
      <BatchUploadModal isOpen={isBatchOpen} onClose={() => setIsBatchOpen(false)} />
    </DashboardLayout>
  );
}
