'use client';
import { useState } from 'react';

export default function BatchUploadModal({ isOpen, onClose, onBatchComplete }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = () => {
    if (!file || isUploading) return;
    setIsUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            onBatchComplete && onBatchComplete();
            onClose();
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 text-white p-6 sm:p-8 space-y-6">
        
        <div className="flex justify-between items-start border-b border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-headline font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">upload_file</span>
              Batch CSV Buyer Profiler
            </h3>
            <p className="text-xs text-slate-400 mt-1">Upload a CSV dataset of buyer profiles to process multi-segment predictions.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Drag Drop Zone */}
        <div className="border-2 border-dashed border-primary/40 hover:border-primary bg-primary/5 rounded-xl p-8 text-center transition-colors cursor-pointer relative">
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="w-12 h-12 rounded-full bg-primary/20 text-primary border border-primary/40 mx-auto flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-2xl">cloud_upload</span>
          </div>
          <div className="text-sm font-headline font-bold text-white">
            {file ? file.name : 'Click or drop CSV dataset here'}
          </div>
          <div className="text-xs text-slate-400 font-label mt-1">
            {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Supports .csv, .xlsx (Max 5,000 rows)'}
          </div>
        </div>

        {/* Progress bar */}
        {isUploading && (
          <div className="space-y-2 animate-fadeIn">
            <div className="flex justify-between text-xs font-label text-slate-300">
              <span>Running ML Batch Classifier...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-surface3 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface2 hover:bg-surface3 text-slate-300 rounded-lg text-xs font-label uppercase"
          >
            Cancel
          </button>
          <button
            onClick={handleProcess}
            disabled={!file || isUploading}
            className="px-5 py-2 bg-primary hover:bg-blue-600 disabled:opacity-40 text-white font-headline font-bold rounded-lg text-xs uppercase tracking-wider shadow-glow-primary transition-all"
          >
            {isUploading ? 'Processing...' : 'Run Batch Analysis'}
          </button>
        </div>

      </div>
    </div>
  );
}
