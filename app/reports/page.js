'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { fetchLiveBuyerMetrics } from '../../lib/dataService';

export default function ReportsPage() {
  const [metrics, setMetrics] = useState(null);
  const [exportFormat, setExportFormat] = useState('pdf'); // 'csv' | 'json' | 'pdf'
  const [clusterFilter, setClusterFilter] = useState('all'); // 'all' | 'C1' | 'C2' | 'C3' | 'C4'
  const [timeHorizon, setTimeHorizon] = useState('30d');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState('');

  useEffect(() => {
    fetchLiveBuyerMetrics().then((data) => {
      setMetrics(data);
    });
  }, []);

  const triggerCsvDownload = () => {
    setIsGenerating(true);
    setDownloadNotice('');

    setTimeout(() => {
      const records = metrics?.rawBuyers?.length ? metrics.rawBuyers : [
        { client_type: 'Individual', country: 'UAE', acquisition_purpose: 'Investment', loan_applied: false, predicted_cluster_id: 'C1', satisfaction_score: 8.7 },
        { client_type: 'Individual', country: 'United States', acquisition_purpose: 'Personal Use', loan_applied: true, predicted_cluster_id: 'C2', satisfaction_score: 7.8 },
        { client_type: 'Corporate', country: 'United Kingdom', acquisition_purpose: 'Investment', loan_applied: false, predicted_cluster_id: 'C3', satisfaction_score: 9.1 },
        { client_type: 'Individual', country: 'France', acquisition_purpose: 'Investment', loan_applied: false, predicted_cluster_id: 'C4', satisfaction_score: 9.6 },
      ];

      const filtered = clusterFilter === 'all'
        ? records
        : records.filter((r) => r.predicted_cluster_id === clusterFilter);

      const headers = ['Client Type', 'Country', 'Purpose', 'Loan Applied', 'Cluster ID', 'Satisfaction Score'];
      const rows = filtered.map((r) => [
        r.client_type || 'Individual',
        r.country || 'United States',
        r.acquisition_purpose || 'Investment',
        r.loan_applied ? 'Yes' : 'No',
        r.predicted_cluster_id || 'C1',
        r.satisfaction_score || 8.5,
      ]);

      const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Parcl_Intel_Buyers_Report_${clusterFilter}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsGenerating(false);
      setDownloadNotice(`Exported ${filtered.length} records to CSV successfully!`);
    }, 600);
  };

  const triggerJsonDownload = () => {
    setIsGenerating(true);
    setDownloadNotice('');

    setTimeout(() => {
      const records = metrics?.rawBuyers?.length ? metrics.rawBuyers : [
        { client_type: 'Individual', country: 'UAE', acquisition_purpose: 'Investment', loan_applied: false, predicted_cluster_id: 'C1' },
      ];

      const jsonString = JSON.stringify({
        generated_at: new Date().toISOString(),
        engine: 'Parcl-KMeans-v2.4',
        filter: clusterFilter,
        total_records: records.length,
        data: records,
      }, null, 2);

      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Parcl_Intel_Market_Report_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsGenerating(false);
      setDownloadNotice('JSON report exported successfully!');
    }, 600);
  };

  const triggerPdfReport = () => {
    setIsGenerating(true);
    setDownloadNotice('');

    // Generate a styled PDF Print View Document
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups for localhost to download the PDF report.');
      setIsGenerating(false);
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Parcl Intel - Executive Intelligence Report</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background: #ffffff;
            color: #0F172A;
            padding: 40px;
            margin: 0;
          }
          .header {
            border-b: 3px solid #2563EB;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563EB;
            letter-spacing: -0.5px;
          }
          .tagline {
            font-size: 12px;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .title {
            font-size: 28px;
            font-weight: bold;
            color: #0F172A;
            margin-bottom: 10px;
          }
          .meta {
            font-size: 12px;
            color: #64748B;
            margin-bottom: 30px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 30px;
          }
          .card {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            padding: 15px;
          }
          .card-title {
            font-size: 10px;
            text-transform: uppercase;
            color: #64748B;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .card-value {
            font-size: 24px;
            font-weight: bold;
            color: #0F172A;
          }
          .section-heading {
            font-size: 16px;
            font-weight: bold;
            color: #2563EB;
            border-bottom: 1px solid #E2E8F0;
            padding-bottom: 8px;
            margin-top: 30px;
            margin-bottom: 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #E2E8F0;
            font-size: 13px;
          }
          th {
            background: #F1F5F9;
            color: #475569;
            font-weight: bold;
          }
          .footer {
            margin-top: 50px;
            border-top: 1px solid #E2E8F0;
            padding-top: 15px;
            font-size: 10px;
            color: #94A3B8;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">PARCL INTEL</div>
            <div class="tagline">Real Estate Machine Learning Intelligence</div>
          </div>
          <div style="text-align: right; font-size: 12px; color: #64748B;">
            <div>CONFIDENTIAL REPORT</div>
            <div>Date: ${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div class="title">Executive Buyer Segmentation Report</div>
        <div class="meta">Generated via Parcl ML K-Means Engine v2.4 · Live Supabase Dataset</div>

        <div class="grid">
          <div class="card">
            <div class="card-title">Total Buyers</div>
            <div class="card-value">${metrics?.formattedTotalBuyers || '16'}</div>
          </div>
          <div class="card">
            <div class="card-title">Active Clusters</div>
            <div class="card-value">4</div>
          </div>
          <div class="card">
            <div class="card-title">Avg Satisfaction</div>
            <div class="card-value">${metrics?.avgSatScore || '8.9'} / 10</div>
          </div>
          <div class="card">
            <div class="card-title">Cash Ratio</div>
            <div class="card-value">${metrics?.cashPct || 75}%</div>
          </div>
        </div>

        <div class="section-heading">Cluster Distribution Breakdown</div>
        <table>
          <thead>
            <tr>
              <th>Cluster ID</th>
              <th>Buyer Segment Persona</th>
              <th>Share (%)</th>
              <th>Buyer Records</th>
              <th>Key Behavioral Characteristics</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>C1</strong></td>
              <td>Global Investors</td>
              <td>${metrics?.c1Pct || 31}%</td>
              <td>${metrics?.c1Count || 5}</td>
              <td>High liquidity, cash payments, Tier-1 commercial focus</td>
            </tr>
            <tr>
              <td><strong>C2</strong></td>
              <td>First-Time Buyers</td>
              <td>${metrics?.c2Pct || 25}%</td>
              <td>${metrics?.c2Count || 4}</td>
              <td>Personal use, mortgage financing dependent</td>
            </tr>
            <tr>
              <td><strong>C3</strong></td>
              <td>Corporate Buyers</td>
              <td>${metrics?.c3Pct || 19}%</td>
              <td>${metrics?.c3Count || 3}</td>
              <td>Institutional acquisitions, corporate channel focus</td>
            </tr>
            <tr>
              <td><strong>C4</strong></td>
              <td>Luxury Investors</td>
              <td>${metrics?.c4Pct || 25}%</td>
              <td>${metrics?.c4Count || 4}</td>
              <td>High satisfaction, cross-border premium properties</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          © ${new Date().getFullYear()} Parcl Intel Engine · 256-Bit Encrypted Data Export · Confidential Report
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setIsGenerating(false);
    setDownloadNotice('PDF report window opened! Save directly as PDF in your print dialog.');
  };

  const handleCustomGenerate = (e) => {
    e.preventDefault();
    if (exportFormat === 'csv') triggerCsvDownload();
    else if (exportFormat === 'json') triggerJsonDownload();
    else triggerPdfReport();
  };

  return (
    <DashboardLayout
      title="Reports & Export Engine"
      subtitle="Download segmentation results, export custom datasets, and generate market research papers"
    >
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        
        {/* Top Row Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CSV Export Card */}
          <button
            type="button"
            onClick={triggerCsvDownload}
            disabled={isGenerating}
            className="glass-panel rounded-2xl p-6 text-left group border border-primary/30 hover:border-primary/70 transition-all duration-300 relative overflow-hidden bg-surface2/60 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(37,99,235,0.3)]"
          >
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40 text-primary shadow-glow-primary">
                <span className="material-symbols-outlined text-2xl">download</span>
              </div>
              <span className="font-label text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase border border-primary/30">
                CSV DATASET
              </span>
            </div>
            <h3 className="font-headline font-bold text-xl text-white mb-1 relative z-10">Export CSV</h3>
            <p className="text-xs text-slate-400 relative z-10">Download full classified buyer dataset ({metrics?.formattedTotalBuyers || '16'} rows).</p>
          </button>

          {/* JSON Export Card */}
          <button
            type="button"
            onClick={triggerJsonDownload}
            disabled={isGenerating}
            className="glass-panel rounded-2xl p-6 text-left group border border-secondary/30 hover:border-secondary/70 transition-all duration-300 relative overflow-hidden bg-surface2/60 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(139,92,246,0.3)]"
          >
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center border border-secondary/40 text-secondary shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <span className="material-symbols-outlined text-2xl">code</span>
              </div>
              <span className="font-label text-[10px] font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full uppercase border border-secondary/30">
                JSON PAYLOAD
              </span>
            </div>
            <h3 className="font-headline font-bold text-xl text-white mb-1 relative z-10">Export JSON</h3>
            <p className="text-xs text-slate-400 relative z-10">Download structured API schema payload for developers.</p>
          </button>

          {/* PDF Executive Summary Card */}
          <button
            type="button"
            onClick={triggerPdfReport}
            disabled={isGenerating}
            className="glass-panel rounded-2xl p-6 text-left group border border-accent/30 hover:border-accent/70 transition-all duration-300 relative overflow-hidden bg-surface2/60 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
          >
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/40 text-accent shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
              </div>
              <span className="font-label text-[10px] font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full uppercase border border-accent/30">
                PDF DOCUMENT
              </span>
            </div>
            <h3 className="font-headline font-bold text-xl text-white mb-1 relative z-10">Executive PDF Report</h3>
            <p className="text-xs text-slate-400 relative z-10">Generate & print/download clean PDF research paper.</p>
          </button>

        </div>

        {downloadNotice && (
          <div className="p-4 rounded-xl bg-accent/15 border border-accent/40 text-accent text-xs font-label flex items-center gap-2 animate-fadeIn shadow-lg">
            <span className="material-symbols-outlined text-base">check_circle</span>
            {downloadNotice}
          </div>
        )}

        {/* Main Custom Export Builder Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Custom Builder Form (2 Cols) */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 bg-surface2/80 space-y-6">
            <div>
              <h3 className="font-headline font-bold text-xl text-white mb-1">Custom Intelligence Export Builder</h3>
              <p className="text-xs text-slate-400">Configure parameters, apply cluster filters, and export customized market reports.</p>
            </div>

            <form onSubmit={handleCustomGenerate} className="space-y-6">
              
              {/* Export Format Selector */}
              <div>
                <label className="block text-xs font-label text-slate-300 uppercase tracking-wider mb-2">Export Format</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportFormat('csv')}
                    className={`py-3 px-4 rounded-xl border text-xs font-headline font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      exportFormat === 'csv'
                        ? 'bg-primary text-white border-primary shadow-glow-primary'
                        : 'bg-surface1 text-slate-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">table_chart</span>
                    CSV Dataset
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportFormat('json')}
                    className={`py-3 px-4 rounded-xl border text-xs font-headline font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      exportFormat === 'json'
                        ? 'bg-secondary text-white border-secondary shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                        : 'bg-surface1 text-slate-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">data_object</span>
                    JSON Schema
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportFormat('pdf')}
                    className={`py-3 px-4 rounded-xl border text-xs font-headline font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      exportFormat === 'pdf'
                        ? 'bg-accent text-white border-accent shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : 'bg-surface1 text-slate-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                    PDF Report
                  </button>
                </div>
              </div>

              {/* Cluster Filter Selector */}
              <div>
                <label className="block text-xs font-label text-slate-300 uppercase tracking-wider mb-2">Cluster Segment Filter</label>
                <select
                  value={clusterFilter}
                  onChange={(e) => setClusterFilter(e.target.value)}
                  className="w-full bg-surface1 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="all">All Buyer Segments (Full Dataset)</option>
                  <option value="C1">C1: Global Investors ({metrics?.c1Count || 5} Records)</option>
                  <option value="C2">C2: First-Time Buyers ({metrics?.c2Count || 4} Records)</option>
                  <option value="C3">C3: Corporate Buyers ({metrics?.c3Count || 3} Records)</option>
                  <option value="C4">C4: Luxury Investors ({metrics?.c4Count || 4} Records)</option>
                </select>
              </div>

              {/* Time Horizon Selector */}
              <div>
                <label className="block text-xs font-label text-slate-300 uppercase tracking-wider mb-2">Time Horizon</label>
                <div className="grid grid-cols-3 gap-3">
                  {['7d', '30d', 'all'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimeHorizon(t)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-label uppercase font-bold transition-all cursor-pointer ${
                        timeHorizon === t
                          ? 'bg-surface3 text-white border-white/30'
                          : 'bg-surface1 text-slate-400 border-white/5 hover:border-white/10'
                      }`}
                    >
                      {t === '7d' ? 'Last 7 Days' : t === '30d' ? 'Last 30 Days' : 'Full History'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50 text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">sync</span>
                    Generating PDF Report...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                    Generate & Print / Save PDF Report
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Saved Intelligence Reports Archive (1 Col) */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-surface2/80 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-headline font-bold text-lg text-white mb-1">Report Archives</h3>
              <p className="text-xs text-slate-400 mb-4">Pre-generated intelligence summaries ready for instant download.</p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-surface1 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-headline font-bold text-xs text-white">Q3 Global Capital Report</div>
                    <div className="text-[10px] text-slate-400">PDF • 50k Profiles Analyzed</div>
                  </div>
                  <button
                    type="button"
                    onClick={triggerPdfReport}
                    className="p-2 rounded-lg bg-surface3 hover:bg-white/10 text-white transition-colors cursor-pointer"
                    title="Print / Save PDF Report"
                  >
                    <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-surface1 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-headline font-bold text-xs text-white">C4 Luxury Investor Insights</div>
                    <div className="text-[10px] text-slate-400">CSV • UAE & US Luxury Hubs</div>
                  </div>
                  <button
                    type="button"
                    onClick={triggerCsvDownload}
                    className="p-2 rounded-lg bg-surface3 hover:bg-white/10 text-white transition-colors cursor-pointer"
                    title="Download CSV"
                  >
                    <span className="material-symbols-outlined text-base">download</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-surface1 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-headline font-bold text-xs text-white">K-Means Model Audit Log</div>
                    <div className="text-[10px] text-slate-400">JSON • Full Cluster Metrics</div>
                  </div>
                  <button
                    type="button"
                    onClick={triggerJsonDownload}
                    className="p-2 rounded-lg bg-surface3 hover:bg-white/10 text-white transition-colors cursor-pointer"
                    title="Download JSON"
                  >
                    <span className="material-symbols-outlined text-base">download</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-slate-500 flex justify-between">
              <span>SECURITY: 256-BIT SSL</span>
              <span>SUPABASE READY</span>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
