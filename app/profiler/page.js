'use client';
import { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import CohortModal from '../components/CohortModal';
import BatchUploadModal from '../components/BatchUploadModal';

const COUNTRY_DATA = {
  'United States': { flag: '🇺🇸', regions: ['New York', 'California', 'Florida', 'Texas', 'Illinois'] },
  'United Kingdom': { flag: '🇬🇧', regions: ['London', 'Manchester', 'Birmingham', 'Edinburgh'] },
  'UAE': { flag: '🇦🇪', regions: ['Dubai', 'Abu Dhabi', 'Sharjah'] },
  'Singapore': { flag: '🇸🇬', regions: ['Central Region', 'Sentosa', 'East Coast', 'Jurong'] },
  'Germany': { flag: '🇩🇪', regions: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg'] },
  'Canada': { flag: '🇨🇦', regions: ['Toronto', 'Vancouver', 'Montreal'] },
  'Japan': { flag: '🇯🇵', regions: ['Tokyo', 'Osaka', 'Kyoto'] },
  'Australia': { flag: '🇦🇺', regions: ['Sydney', 'Melbourne', 'Brisbane'] },
};

const INITIAL_HISTORY = [
  {
    id: 1,
    time: 'Today, 14:32',
    summary: 'Corporate • UAE • Investment',
    clusterId: 'C1',
    clusterName: 'Global Investor',
    color: '#2563EB',
  },
  {
    id: 2,
    time: 'Today, 11:15',
    summary: 'Individual • UK • Personal Use',
    clusterId: 'C2',
    clusterName: 'First-Time Buyer',
    color: '#10B981',
  },
  {
    id: 3,
    time: 'Yesterday, 16:45',
    summary: 'Individual • USA • Investment',
    clusterId: 'C4',
    clusterName: 'Luxury Investor',
    color: '#8B5CF6',
  },
];

export default function ProfilerPage() {
  // Form State
  const [clientType, setClientType] = useState('Individual'); // Individual | Corporate
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('1988-05-14');
  const [country, setCountry] = useState('United States');
  const [region, setRegion] = useState('New York');
  const [purpose, setPurpose] = useState('Investment'); // Investment | Personal Use
  const [loanApplied, setLoanApplied] = useState(false);
  const [channel, setChannel] = useState('Direct');
  const [satScore, setSatScore] = useState(8.5);

  // Prediction State
  const [predictionState, setPredictionState] = useState('idle'); // 'idle' | 'scanning' | 'result'
  const [predictionResult, setPredictionResult] = useState(null);
  const [history, setHistory] = useState(INITIAL_HISTORY);

  // Modals
  const [isCohortOpen, setIsCohortOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);

  // Available regions based on country
  const availableRegions = useMemo(() => {
    return COUNTRY_DATA[country]?.regions || ['Default Region'];
  }, [country]);

  // Handle Country change
  const handleCountryChange = (newCountry) => {
    setCountry(newCountry);
    const newRegions = COUNTRY_DATA[newCountry]?.regions;
    if (newRegions && newRegions.length > 0) {
      setRegion(newRegions[0]);
    }
  };

  // ML Prediction Engine Logic
  const runPrediction = () => {
    if (predictionState === 'scanning') return;

    setPredictionState('scanning');

    // Simulate classification calculation
    setTimeout(() => {
      let clusterId = 'C1';
      let clusterName = 'Global Investor';
      let clusterDescription = 'High-net-worth international portfolio focus';
      let color = '#2563EB';
      let confidence = Math.floor(82 + Math.random() * 14); // 82-96%
      let characteristics = [];
      let strategyTitle = '';
      let strategyDesc = '';
      let similarCount = 1402;

      // Classification algorithm based on feature vectors
      if (clientType === 'Corporate' || channel === 'Corporate') {
        clusterId = 'C3';
        clusterName = 'Corporate Buyer';
        clusterDescription = 'Institutional & enterprise property portfolio manager';
        color = '#F59E0B';
        characteristics = [
          'High Transaction Volume',
          'Commercial & Bulk Residential Focus',
          'Tax-Structured Acquisition',
        ];
        strategyTitle = 'Institutional Enterprise Outreach';
        strategyDesc = 'Offer bulk transaction discounts, dedicated account management, and automated tax reporting.';
        similarCount = 854;
      } else if (satScore >= 8.8 && purpose === 'Investment' && !loanApplied) {
        clusterId = 'C4';
        clusterName = 'Luxury Investor';
        clusterDescription = 'Ultra-high liquidity buyer seeking premium trophy assets';
        color = '#8B5CF6';
        characteristics = [
          'High Liquidity Cap',
          'Tier-1 Prime Trophy Focus',
          'Non-Mortgage Cash Purchase',
        ];
        strategyTitle = 'Luxury VIP Concierge';
        strategyDesc = 'Provide exclusive off-market listing previews and private wealth advisory services.';
        similarCount = 520;
      } else if (purpose === 'Personal Use' || loanApplied) {
        clusterId = 'C2';
        clusterName = 'First-Time Buyer';
        clusterDescription = 'Mortgage-assisted buyer purchasing primary residence';
        color = '#10B981';
        characteristics = [
          'Loan Financing Dependent',
          'Suburban & Growing District Focus',
          'High Sensitivity to Interest Rates',
        ];
        strategyTitle = 'Financing & Loan Guidance';
        strategyDesc = 'Provide pre-approved mortgage comparison tools and rate lock assistance.';
        similarCount = 2260;
      } else {
        // Default C1
        clusterId = 'C1';
        clusterName = 'Global Investor';
        clusterDescription = 'High-net-worth international buyer focusing on urban luxury & high yield';
        color = '#2563EB';
        characteristics = [
          'High Liquidity Preference',
          'Urban Tier-1 Core Focus',
          'Yield-Driven Purpose Match',
        ];
        strategyTitle = 'Luxury Portfolio Outreach';
        strategyDesc = 'Highlight yield stability and premium management services. Bypass standard mortgage offers.';
        similarCount = 1402;
      }

      const resultObj = {
        clusterId,
        clusterName,
        clusterDescription,
        color,
        confidence,
        characteristics,
        strategyTitle,
        strategyDesc,
        similarCount,
      };

      setPredictionResult(resultObj);
      setPredictionState('result');

      // Add to recent predictions history
      const newHistoryItem = {
        id: Date.now(),
        time: 'Just now',
        summary: `${clientType} • ${COUNTRY_DATA[country]?.flag || ''} ${country} • ${purpose}`,
        clusterId,
        clusterName,
        color,
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);

    }, 1400);
  };

  // Reset form
  const handleResetForm = () => {
    setClientType('Individual');
    setGender('Male');
    setDob('1988-05-14');
    setCountry('United States');
    setRegion('New York');
    setPurpose('Investment');
    setLoanApplied(false);
    setChannel('Direct');
    setSatScore(8.5);
    setPredictionState('idle');
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <DashboardLayout
      title="Buyer Profiler"
      subtitle="Predict buyer segment from profile attributes using K-Means ML Classifier"
    >
      <div className="parcl-profiler-grid pb-8">
        
        {/* LEFT: Prediction Form */}
        <section className="w-full">
          <div className="glass-panel rounded-xl p-6 relative overflow-hidden group parcl-animate-card border border-white/10 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-headline font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person_add</span>
                New Buyer Profile
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBatchOpen(true)}
                  className="px-2.5 py-1 bg-surface2 hover:bg-surface3 text-primary border border-primary/30 rounded text-xs font-label uppercase flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">upload_file</span>
                  Batch CSV
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Reset form default"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                </button>
              </div>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              
              {/* Client Type Toggle */}
              <div>
                <label className="block text-xs font-label text-slate-400 uppercase mb-2 tracking-wider">
                  Client Type
                </label>
                <div className="flex p-1 bg-surface1 rounded-lg border border-white/5">
                  <button
                    type="button"
                    onClick={() => setClientType('Individual')}
                    className={`flex-1 py-2 text-xs font-headline font-bold rounded-md transition-all ${
                      clientType === 'Individual'
                        ? 'bg-primary text-white shadow-glow-primary'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientType('Corporate')}
                    className={`flex-1 py-2 text-xs font-headline font-bold rounded-md transition-all ${
                      clientType === 'Corporate'
                        ? 'bg-primary text-white shadow-glow-primary'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Corporate
                  </button>
                </div>
              </div>

              {/* Gender & DOB */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label text-slate-400 uppercase mb-2 tracking-wider">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-surface1 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-label text-slate-400 uppercase mb-2 tracking-wider">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-surface1 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-primary cursor-pointer"
                  />
                </div>
              </div>

              {/* Country & Region */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label text-slate-400 uppercase mb-2 tracking-wider">
                    Country
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">
                      {COUNTRY_DATA[country]?.flag || '🌍'}
                    </span>
                    <select
                      value={country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full bg-surface1 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-primary cursor-pointer appearance-none"
                    >
                      {Object.keys(COUNTRY_DATA).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-label text-slate-400 uppercase mb-2 tracking-wider">
                    Region
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-surface1 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-primary cursor-pointer appearance-none"
                  >
                    {availableRegions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Acquisition Purpose */}
              <div>
                <label className="block text-xs font-label text-slate-400 uppercase mb-2 tracking-wider">
                  Acquisition Purpose
                </label>
                <div className="flex p-1 bg-surface1 rounded-lg border border-white/5">
                  <button
                    type="button"
                    onClick={() => setPurpose('Investment')}
                    className={`flex-1 py-2 text-xs font-headline font-bold rounded-md transition-all ${
                      purpose === 'Investment'
                        ? 'bg-secondary text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Investment
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurpose('Personal Use')}
                    className={`flex-1 py-2 text-xs font-headline font-bold rounded-md transition-all ${
                      purpose === 'Personal Use'
                        ? 'bg-accent text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Personal Use
                  </button>
                </div>
              </div>

              {/* Loan Applied & Referral Channel */}
              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-label text-slate-400 uppercase mb-2 tracking-wider">
                    Loan Applied
                  </label>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setLoanApplied(!loanApplied)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        loanApplied ? 'bg-primary shadow-glow-primary' : 'bg-surface3'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          loanApplied ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <span className="text-xs font-medium text-slate-300">
                      {loanApplied ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-label text-slate-400 uppercase mb-2 tracking-wider">
                    Referral Channel
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full bg-surface1 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-primary cursor-pointer appearance-none"
                  >
                    <option value="Direct">Direct</option>
                    <option value="Agent">Agent</option>
                    <option value="Online Portal">Online Portal</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
              </div>

              {/* Satisfaction Score Range Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-xs font-label text-slate-400 uppercase tracking-wider">
                    Satisfaction Score
                  </label>
                  <span
                    className={`text-xs font-label font-bold ${
                      satScore >= 8.5
                        ? 'text-accent'
                        : satScore >= 6.0
                        ? 'text-warning'
                        : 'text-primary'
                    }`}
                  >
                    {satScore} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={satScore}
                  onChange={(e) => setSatScore(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-surface3 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 mt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={runPrediction}
                  disabled={predictionState === 'scanning'}
                  className="w-full py-3.5 bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-headline font-bold rounded-lg shadow-glow-primary transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-xs"
                >
                  {predictionState === 'scanning' ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">data_usage</span>
                      Running ML Classification...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">model_training</span>
                      Run Prediction
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </section>

        {/* RIGHT: Dynamic Results Area */}
        <section className="w-full flex flex-col gap-6">
          
          {/* Result Panel */}
          <div
            className={`glass-panel rounded-xl p-8 flex-grow flex flex-col justify-center min-h-[420px] relative overflow-hidden transition-all duration-300 border ${
              predictionState === 'scanning'
                ? 'border-primary shadow-[0_0_30px_rgba(37,99,235,0.25)]'
                : 'border-white/10'
            }`}
          >
            {/* Animated Scan Line */}
            {predictionState === 'scanning' && (
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#2563EB] animate-pulse z-20" />
            )}

            {/* State 1: IDLE / EMPTY */}
            {predictionState === 'idle' && (
              <div className="text-center flex flex-col items-center justify-center p-8 animate-fadeIn">
                <div className="w-20 h-20 rounded-full bg-surface2 border border-white/10 flex items-center justify-center mb-4 text-slate-400 shadow-inner">
                  <span className="material-symbols-outlined text-4xl">travel_explore</span>
                </div>
                <h4 className="text-xl font-headline text-white mb-2">Awaiting Classification Parameters</h4>
                <p className="text-sm text-slate-400 max-w-sm">
                  Fill in the buyer profile form on the left and click <strong>Run Prediction</strong> to generate a real-time cluster assignment.
                </p>
              </div>
            )}

            {/* State 2: SCANNING / PROCESSING */}
            {predictionState === 'scanning' && (
              <div className="text-center flex flex-col items-center justify-center p-8 animate-fadeIn space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-3xl animate-spin shadow-glow-primary">
                  <span className="material-symbols-outlined">data_usage</span>
                </div>
                <div>
                  <h4 className="text-lg font-headline text-white font-bold">Analyzing Feature Vectors...</h4>
                  <p className="text-xs text-slate-400 font-label mt-1">Executing K-Means Distance Matrix v2.4</p>
                </div>
              </div>
            )}

            {/* State 3: RESULT DISPLAY */}
            {predictionState === 'result' && predictionResult && (
              <div className="w-full flex flex-col animate-fadeIn space-y-6">
                
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
                  <div>
                    <h4 className="text-xs font-label text-slate-400 uppercase tracking-widest mb-1">
                      Predicted Cluster Segment
                    </h4>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-xl border flex items-center justify-center font-headline font-bold text-2xl shadow-lg"
                        style={{
                          backgroundColor: `${predictionResult.color}15`,
                          borderColor: predictionResult.color,
                          color: predictionResult.color,
                          boxShadow: `0 0 20px ${predictionResult.color}40`,
                        }}
                      >
                        {predictionResult.clusterId}
                      </div>
                      <div>
                        <h2 className="text-2xl font-headline font-bold text-white">
                          {predictionResult.clusterName}
                        </h2>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {predictionResult.clusterDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <h4 className="text-xs font-label text-slate-400 uppercase tracking-widest mb-1">
                      Model Confidence
                    </h4>
                    <div className="flex items-baseline gap-1 justify-start sm:justify-end">
                      <span className="text-3xl font-headline font-bold text-accent">
                        {predictionResult.confidence}
                      </span>
                      <span className="text-slate-400">%</span>
                    </div>
                    <div className="w-28 h-2 bg-surface3 rounded-full mt-1.5 overflow-hidden ml-0 sm:ml-auto border border-white/5">
                      <div
                        className="h-full bg-accent transition-all duration-1000"
                        style={{ width: `${predictionResult.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Grid for Characteristics & Strategy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Characteristics */}
                  <div className="bg-surface1/60 rounded-xl p-4 border border-white/5">
                    <h5 className="text-xs font-label text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-primary">key</span>
                      Key Matching Characteristics
                    </h5>
                    <ul className="space-y-2 text-xs text-slate-200">
                      {predictionResult.characteristics.map((char, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: predictionResult.color }}
                          />
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Strategy */}
                  <div className="bg-surface1/60 rounded-xl p-4 border border-white/5">
                    <h5 className="text-xs font-label text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-secondary">lightbulb</span>
                      Recommended Strategy
                    </h5>
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-xs">
                      <strong className="text-white font-headline">{predictionResult.strategyTitle}</strong>
                      <p className="text-slate-300 mt-1 leading-relaxed opacity-90">
                        {predictionResult.strategyDesc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Stats & View Cohort Modal Trigger */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-base text-slate-400">group</span>
                    <span>
                      <strong className="text-white font-label">{predictionResult.similarCount.toLocaleString()}</strong> Similar Buyers in DB
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCohortOpen(true)}
                    className="text-primary hover:text-white font-headline font-bold flex items-center gap-1 transition-colors text-xs uppercase tracking-wider"
                  >
                    View Cohort Breakdown <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Previous Predictions Table */}
          <div className="glass-panel rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-surface1/50">
              <h3 className="text-sm font-headline font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-base">history</span>
                Recent Predictions History
              </h3>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="text-xs font-label text-slate-400 hover:text-white transition-colors"
                >
                  Clear History
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              {history.length === 0 ? (
                <div className="p-6 text-center text-xs font-label text-slate-500">
                  No prediction history. Run a buyer profile classification above.
                </div>
              ) : (
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="font-label text-slate-400 uppercase bg-surface2/30">
                    <tr>
                      <th className="px-6 py-3 font-normal">Timestamp</th>
                      <th className="px-6 py-3 font-normal">Input Summary</th>
                      <th className="px-6 py-3 font-normal">Predicted Cluster</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-surface2/50 transition-colors">
                        <td className="px-6 py-3 font-label text-slate-400">{item.time}</td>
                        <td className="px-6 py-3 font-medium">{item.summary}</td>
                        <td className="px-6 py-3">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-xs font-bold"
                            style={{
                              backgroundColor: `${item.color}15`,
                              borderColor: `${item.color}40`,
                              color: item.color,
                            }}
                          >
                            {item.clusterId} - {item.clusterName}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </section>

      </div>

      {/* Cohort Deep-Dive Modal */}
      {predictionResult && (
        <CohortModal
          isOpen={isCohortOpen}
          onClose={() => setIsCohortOpen(false)}
          clusterData={{
            id: predictionResult.clusterId,
            name: predictionResult.clusterName,
            description: predictionResult.clusterDescription,
            color: predictionResult.color,
            stats: {
              count: predictionResult.similarCount.toLocaleString(),
              avgBudget: predictionResult.clusterId === 'C4' ? '$4.8M' : predictionResult.clusterId === 'C1' ? '$2.4M' : '$850K',
              cashRate: predictionResult.clusterId === 'C4' || predictionResult.clusterId === 'C1' ? '71.6%' : '18.4%',
              topRegion: `${country} / ${region}`,
            },
          }}
        />
      )}

      {/* Batch Upload Modal */}
      <BatchUploadModal
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        onBatchComplete={() => {
          // Add batch prediction mock to history
          const batchItem = {
            id: Date.now(),
            time: 'Just now',
            summary: 'Batch CSV Upload (120 Records)',
            clusterId: 'C1-C4',
            clusterName: 'Multi-Cluster Batch',
            color: '#8B5CF6',
          };
          setHistory((prev) => [batchItem, ...prev]);
        }}
      />

    </DashboardLayout>
  );
}
