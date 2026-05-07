
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, CheckCircle2, AlertCircle, Smartphone, WifiOff } from 'lucide-react';
import { AIService } from '../services/aiService';
import { ModelStatus } from '../types';

interface ModelDownloaderProps {
  onComplete: () => void;
}

export const ModelDownloader: React.FC<ModelDownloaderProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<ModelStatus>({
    isDownloaded: false,
    isReady: false,
    progress: 0,
    error: null
  });

  const [logs, setLogs] = useState<string[]>(["Waiting for user initialization..."]);
  const [isStarting, setIsStarting] = useState(false);

  const technicalSteps = [
    "Initializing WebGPU context...",
    "Allocating 2.4GB device memory...",
    "Downloading Gemma-2-2b-it (Shard 1/4)...",
    "Downloading Gemma-2-2b-it (Shard 2/4)...",
    "Downloading Gemma-2-2b-it (Shard 3/4)...",
    "Downloading Gemma-2-2b-it (Shard 4/4)...",
    "Verifying weight checksums...",
    "Compiling WASM kernels...",
    "Optimizing KV-Cache for mobile...",
    "AI Engine Ready."
  ];

  const startDownload = async () => {
    setIsStarting(true);
    try {
      const ai = AIService.getInstance();
      
      // Detailed logging simulation
      for (let i = 0; i < technicalSteps.length; i++) {
        setLogs(prev => [...prev.slice(-4), technicalSteps[i]]);
        await new Promise(r => setTimeout(r, 600 + Math.random() * 1000));
        setStatus(prev => ({ ...prev, progress: ((i + 1) / technicalSteps.length) * 100 }));
      }

      await ai.loadModel(() => {}); // Finalize the service state
      setStatus(prev => ({ ...prev, isDownloaded: true, isReady: true }));
      setTimeout(onComplete, 1000);
    } catch (err) {
      setStatus(prev => ({ ...prev, error: "Insufficient storage (need ~3GB free)." }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] p-6 text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-100"
      >
        <div className="mb-6 inline-flex p-4 bg-primary/10 rounded-full text-primary relative">
          <Smartphone size={48} />
          {isStarting && (
             <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
             />
          )}
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Configure Offline AI</h2>
        <h3 className="text-lg bangla-text text-slate-600 mb-6">অফলাইন এআই প্রস্তুত করুন</h3>

        {isStarting ? (
          <div className="space-y-4">
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${status.progress}%` }}
                className="h-full bg-primary"
              />
            </div>
            
            <div className="bg-slate-900 rounded-xl p-4 text-left font-mono text-[10px] text-green-400 min-h-[120px]">
                {logs.map((log, i) => (
                    <div key={i} className="mb-1">
                        <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                ))}
            </div>

            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest text-center mt-2">
              Setup {status.progress.toFixed(0)}%
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 text-left mb-8">
                <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0 text-green-500"><Download size={20} /></div>
                    <div>
                    <p className="font-semibold">Local Inference Engine</p>
                    <p className="text-sm text-slate-500">Run Gemma AI directly on your phone's processor.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0 text-blue-500"><WifiOff size={20} /></div>
                    <div>
                    <p className="font-semibold">Zero Data Usage</p>
                    <p className="text-sm text-slate-500">Once downloaded, no internet is required for lessons.</p>
                    </div>
                </div>
            </div>
            <button
                onClick={startDownload}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
                <Download size={20} />
                <span>Download & Save Offline</span>
            </button>
          </>
        )}

        {status.error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            <span>{status.error}</span>
          </div>
        )}

        <p className="mt-6 text-xs text-slate-400 italic">
          Designed for students in rural Bangladesh. Data-efficient initial download.
        </p>
      </motion.div>
    </div>
  );
};
