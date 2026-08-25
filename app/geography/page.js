'use client';
import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

export default function GeographyPage() {
  const [selectedMetro, setSelectedMetro] = useState('Utah (Provo / Salt Lake)');
  const [activeLayer, setActiveLayer] = useState('Clusters');

  const metroData = {
    'Utah (Provo / Salt Lake)': {
      state: 'UT',
      buyers: 342,
      msi: '5.43',
      c1: '32%',
      c2: '38%',
      c3: '4%',
      c4: '26%',
      avgPrice: '$485,200',
      priceCutPct: '42.9%',
      cashPct: '61%',
      topSubmarket: 'Provo East Bench',
      hottestZip: '84604'
    },
    'California (Bay Area & LA)': {
      state: 'CA',
      buyers: 618,
      msi: '6.12',
      c1: '38%',
      c2: '24%',
      c3: '6%',
      c4: '32%',
      avgPrice: '$1,120,000',
      priceCutPct: '39.4%',
      cashPct: '68%',
      topSubmarket: 'Santa Clara / Silicon Valley',
      hottestZip: '94025'
    },
    'Colorado (Denver / Boulder)': {
      state: 'CO',
      buyers: 284,
      msi: '6.97',
      c1: '21%',
      c2: '46%',
      c3: '3%',
      c4: '30%',
      avgPrice: '$620,000',
      priceCutPct: '52.0%',
      cashPct: '54%',
      topSubmarket: 'Denver Highlands',
      hottestZip: '80211'
    },
    'Washington (Seattle / Tacoma)': {
      state: 'WA',
      buyers: 215,
      msi: '4.95',
      c1: '29%',
      c2: '35%',
      c3: '4%',
      c4: '32%',
      avgPrice: '$780,000',
      priceCutPct: '37.8%',
      cashPct: '64%',
      topSubmarket: 'Bellevue Downtown',
      hottestZip: '98004'
    },
    'Texas (Austin / San Antonio)': {
      state: 'TX',
      buyers: 312,
      msi: '7.23',
      c1: '25%',
      c2: '49%',
      c3: '2%',
      c4: '24%',
      avgPrice: '$440,000',
      priceCutPct: '54.5%',
      cashPct: '51%',
      topSubmarket: 'San Antonio North Central',
      hottestZip: '78258'
    },
    'International (Europe & UAE)': {
      state: 'GLOBAL',
      buyers: 229,
      msi: '3.80',
      c1: '78%',
      c2: '4%',
      c3: '8%',
      c4: '10%',
      avgPrice: '$890,000',
      priceCutPct: '18.2%',
      cashPct: '92%',
      topSubmarket: 'London Mayfair & Dubai Marina',
      hottestZip: 'W1J / DXB'
    }
  };

  const active = metroData[selectedMetro] || metroData['Utah (Provo / Salt Lake)'];

  return (
    <DashboardLayout title="Geographic Map" subtitle="Real Estate Market Segmentation across 70,000+ Markets">
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* 1. Header Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
              Geographic Buyer Distribution
            </h2>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
              Cluster density, price elasticity, and transaction volume by metro, county, and state.
            </p>
          </div>

          {/* Layer Selector */}
          <div style={{ display: 'inline-flex', backgroundColor: '#05070E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '3px' }}>
            {['Clusters', 'MSI Stress', 'Price / SqFt', 'Cash Purchases'].map((layer) => (
              <button
                key={layer}
                type="button"
                onClick={() => setActiveLayer(layer)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeLayer === layer ? '#2563EB' : 'transparent',
                  color: activeLayer === layer ? '#FFFFFF' : '#94A3B8',
                  fontSize: '12px',
                  fontWeight: activeLayer === layer ? '700' : '400',
                  cursor: 'pointer'
                }}
              >
                {layer}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Interactive Map & Metro Inspection Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          
          {/* Map Graphic Canvas */}
          <div style={{ backgroundColor: '#030509', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '440px' }}>
            <div style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#64748B', textTransform: 'uppercase', marginBottom: '12px' }}>
              SELECT METRO REGION TO INSPECT
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {Object.keys(metroData).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMetro(m)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: selectedMetro === m ? '#3B82F6' : 'rgba(255, 255, 255, 0.08)',
                    backgroundColor: selectedMetro === m ? 'rgba(59, 130, 246, 0.15)' : '#05070E',
                    color: selectedMetro === m ? '#FFFFFF' : '#94A3B8',
                    fontSize: '11.5px',
                    fontWeight: selectedMetro === m ? '700' : '500',
                    cursor: 'pointer'
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Map Visual */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg width="100%" height="260" viewBox="0 0 600 280">
                <path d="M 50,60 L 150,50 L 180,100 L 130,200 L 40,160 Z" fill="#EF4444" fillOpacity="0.75" stroke="#FFFFFF" strokeWidth="1" />
                <path d="M 150,50 L 280,40 L 290,140 L 180,100 Z" fill="#3B82F6" fillOpacity="0.85" stroke="#60A5FA" strokeWidth="2" />
                <path d="M 280,40 L 420,50 L 430,190 L 290,140 Z" fill="#8B5CF6" fillOpacity="0.7" stroke="#FFFFFF" strokeWidth="1" />
                <path d="M 420,50 L 540,70 L 510,210 L 430,190 Z" fill="#EC4899" fillOpacity="0.8" stroke="#FFFFFF" strokeWidth="1" />
                <circle cx="230" cy="85" r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="230" cy="85" r="14" fill="rgba(16, 185, 129, 0.3)" />
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>
              <span>● ACTIVE LAYER: {activeLayer.toUpperCase()}</span>
              <span>150M PROPERTIES INDEXED</span>
            </div>
          </div>

          {/* Detailed Metro Inspection Card */}
          <div style={{ backgroundColor: '#05070E', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 0 30px rgba(37, 99, 235, 0.12)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#60A5FA', textTransform: 'uppercase' }}>{active.state} REGION DOSSIER</span>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', margin: '4px 0 0 0' }}>{selectedMetro}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#F59E0B' }}>{active.msi}</div>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>Motivated Seller Index</div>
              </div>
            </div>

            {/* Quick Metrics 4-Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div style={{ padding: '10px', backgroundColor: '#090D16', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>BUYERS IDENTIFIED</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', marginTop: '2px' }}>{active.buyers}</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#090D16', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>AVG SALE PRICE</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#10B981', marginTop: '2px' }}>{active.avgPrice}</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#090D16', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>PRICE CUTS %</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#EF4444', marginTop: '2px' }}>{active.priceCutPct}</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#090D16', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>CASH SHARE</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#60A5FA', marginTop: '2px' }}>{active.cashPct}</div>
              </div>
            </div>

            {/* Cluster Mix Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: '#64748B' }}>BUYER CLUSTER CONCENTRATION</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>C1 Global Investors</span>
                <span style={{ fontWeight: '700', color: '#3B82F6' }}>{active.c1}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>C2 First-Time Buyers</span>
                <span style={{ fontWeight: '700', color: '#10B981' }}>{active.c2}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>C3 Corporate Entities</span>
                <span style={{ fontWeight: '700', color: '#F59E0B' }}>{active.c3}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>C4 Luxury Investors</span>
                <span style={{ fontWeight: '700', color: '#8B5CF6' }}>{active.c4}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px', fontSize: '11.5px', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><strong>Top Micro-Market:</strong> {active.topSubmarket}</div>
              <div><strong>Hottest ZIP Code:</strong> {active.hottestZip}</div>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
