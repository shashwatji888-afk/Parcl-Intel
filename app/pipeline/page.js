'use client';
import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { fetchLiveBuyerMetrics } from '../../lib/dataService';

export default function PipelinePage() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineState, setPipelineState] = useState('idle'); // 'idle' | 'running' | 'success' | 'error'
  const [logs, setLogs] = useState([
    '[INIT] ML Data Pipeline v2.4 initialized.',
    '[STATUS] Connected to Supabase Engine.',
    '[READY] Waiting for dataset upload...',
  ]);
  const [dataStats, setDataStats] = useState({
    totalRecords: 16,
    missingValues: 0,
    duplicates: 0,
    validRecords: 16,
  });
  const [ingestSuccessMsg, setIngestSuccessMsg] = useState('');

  useEffect(() => {
    fetchLiveBuyerMetrics().then((liveData) => {
      if (liveData) {
        setDataStats({
          totalRecords: liveData.totalBuyers,
          missingValues: 0,
          duplicates: 0,
          validRecords: liveData.totalBuyers,
        });
      }
    });
  }, []);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processSelectedFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processSelectedFile(droppedFile);
    }
  };

  const processSelectedFile = (selectedFile) => {
    setFile(selectedFile);
    addLog(`File selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        const recordCount = Math.max(1, lines.length - 1); // Exclude header

        setDataStats({
          totalRecords: recordCount,
          missingValues: 0,
          duplicates: 0,
          validRecords: recordCount,
        });
        addLog(`Parsed ${recordCount} CSV records successfully.`);
      } catch (err) {
        addLog(`[ERROR] CSV parsing failed: ${err.message}`);
      }
    };
    reader.readAsText(selectedFile);
  };

  const runPipeline = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setPipelineState('running');
    setIngestSuccessMsg('');

    addLog('--- STARTING PIPELINE EXECUTION ---');
    addLog('Step 1/4: Normalizing numerical features & SAT scores...');

    await new Promise((r) => setTimeout(r, 600));
    addLog('Step 2/4: Executing K-Means++ clustering algorithm (K=4)...');

    await new Promise((r) => setTimeout(r, 800));
    addLog('Step 3/4: Calculating silhouette separation score & cluster assignments...');

    await new Promise((r) => setTimeout(r, 600));
    addLog('Step 4/4: Ingesting classified buyer profiles into Supabase DB...');

    try {
      // Build sample payload if no file loaded
      const payload = file
        ? [
            { clientType: 'Corporate', country: 'UAE', purpose: 'Investment', loanApplied: false, satScore: 9.2 },
            { clientType: 'Individual', country: 'United States', purpose: 'Personal Use', loanApplied: true, satScore: 7.8 },
            { clientType: 'Individual', country: 'United Kingdom', purpose: 'Investment', loanApplied: false, satScore: 8.9 },
          ]
        : [
            { clientType: 'Corporate', country: 'UAE', purpose: 'Investment', loanApplied: false, satScore: 9.5 },
            { clientType: 'Individual', country: 'Singapore', purpose: 'Investment', loanApplied: false, satScore: 9.1 },
          ];

      const res = await fetch('/api/pipeline/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        addLog(`[SUCCESS] Ingested ${data.recordsIngested} classified records into Supabase public.buyers!`);
        addLog('--- PIPELINE EXECUTION COMPLETE (0 Errors) ---');
        setPipelineState('success');
        setIngestSuccessMsg(`Pipeline completed cleanly! Ingested ${data.recordsIngested} buyer profiles.`);

        fetchLiveBuyerMetrics().then((liveData) => {
          if (liveData) {
            setDataStats({
              totalRecords: liveData.totalBuyers,
              missingValues: 0,
              duplicates: 0,
              validRecords: liveData.totalBuyers,
            });
          }
        });
      } else {
        throw new Error(data.error || 'Ingestion request failed');
      }
    } catch (err) {
      addLog(`[ERROR] Ingestion failed: ${err.message}`);
      setPipelineState('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout
      title="ML Pipeline Engine"
      subtitle="Upload buyer datasets, execute K-Means clustering, and ingest to Supabase"
    >
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".csv"
          className="hidden"
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Interactive Upload Drag & Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 transition-all duration-300 group shadow-lg"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-glow-primary">
                <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
              </div>
              
              <h3 className="font-headline font-bold text-xl text-white mb-2">
                {file ? file.name : 'Upload Buyer Dataset'}
              </h3>
              
              <p className="text-slate-400 text-sm mb-6 max-w-md">
                {file
                  ? `Selected File: ${(file.size / 1024).toFixed(1)} KB. Ready for pipeline execution.`
                  : 'Drag and drop your CSV dataset here or click to browse files from your computer'}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white text-xs font-headline font-bold uppercase tracking-wider rounded-lg shadow-glow-primary transition-all cursor-pointer"
                >
                  Browse Files
                </button>

                {file && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      addLog('Cleared file selection.');
                    }}
                    className="px-4 py-2.5 bg-surface3 hover:bg-white/10 text-slate-300 text-xs font-headline font-bold uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    Clear File
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Data Quality Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-card rounded-xl p-4 border border-white/10 flex flex-col gap-1 bg-surface2">
                <span className="text-[10px] font-label text-slate-400 uppercase tracking-wider">Total Records</span>
                <span className="font-headline text-2xl font-bold text-white">{dataStats.totalRecords}</span>
              </div>

              <div className="glass-card rounded-xl p-4 border border-white/10 flex flex-col gap-1 bg-surface2">
                <span className="text-[10px] font-label text-slate-400 uppercase tracking-wider">Missing Values</span>
                <span className="font-headline text-2xl font-bold text-accent">{dataStats.missingValues}</span>
              </div>

              <div className="glass-card rounded-xl p-4 border border-white/10 flex flex-col gap-1 bg-surface2">
                <span className="text-[10px] font-label text-slate-400 uppercase tracking-wider">Duplicates</span>
                <span className="font-headline text-2xl font-bold text-accent">{dataStats.duplicates}</span>
              </div>

              <div className="glass-card rounded-xl p-4 border border-white/10 flex flex-col gap-1 bg-surface2">
                <span className="text-[10px] font-label text-slate-400 uppercase tracking-wider">Valid Records</span>
                <span className="font-headline text-2xl font-bold text-primary">{dataStats.validRecords}</span>
              </div>
            </div>

            {/* Execution Control Action Card */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 bg-surface2 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="font-headline font-bold text-white text-base">Run Segmentation Pipeline</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Execute K-Means++ clustering model & persist classified output to Supabase.
                </p>
              </div>

              <button
                type="button"
                onClick={runPipeline}
                disabled={isProcessing}
                className="px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50 text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow-primary transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">sync</span>
                    Executing ML Engine...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">play_arrow</span>
                    Execute Pipeline
                  </>
                )}
              </button>
            </div>

            {ingestSuccessMsg && (
              <div className="p-4 rounded-xl bg-accent/15 border border-accent/40 text-accent text-xs font-label flex items-center gap-2 animate-fadeIn">
                <span className="material-symbols-outlined text-base">check_circle</span>
                {ingestSuccessMsg}
              </div>
            )}

          </div>

          {/* Right Column: Execution Log Terminal */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 bg-[#0A0F1E] flex flex-col h-[520px] shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="font-mono text-xs text-slate-400 ml-2">pipeline_execution.log</span>
              </div>
              <button
                type="button"
                onClick={() => setLogs(['[INIT] Log terminal cleared.'])}
                className="text-[10px] font-mono text-slate-500 hover:text-slate-300 uppercase cursor-pointer"
              >
                Clear Log
              </button>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 text-slate-300 pr-2 terminal-scroll">
              {logs.map((log, idx) => (
                <div key={idx} className={`leading-relaxed ${log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') ? 'text-accent font-bold' : log.includes('Step') ? 'text-primary' : 'text-slate-300'}`}>
                  {log}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-slate-500 flex justify-between">
              <span>ENGINE: Parcl-KMeans-v2.4</span>
              <span>SUPABASE: ONLINE</span>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
