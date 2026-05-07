/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dashboard } from './components/Dashboard';
import { ModelDownloader } from './components/ModelDownloader';
import { ExerciseView } from './components/ExerciseView';
import { ExerciseType, UserProgress } from './types';
import { Smartphone, ShieldCheck, WifiOff } from 'lucide-react';

type AppState = 'setup' | 'dashboard' | 'exercise';

export default function App() {
  const [state, setState] = useState<AppState>('setup');
  const [progress, setProgress] = useState<UserProgress>({
    level: 1,
    completedExercises: [],
    totalCorrect: 0,
    totalAttempted: 0,
    lastActive: new Date().toISOString()
  });
  const [selectedType, setSelectedType] = useState<ExerciseType | null>(null);

  // Persistence logic for offline use
  useEffect(() => {
    const modelReady = localStorage.getItem('grammarglow_model_ready') === 'true';
    const savedProgress = localStorage.getItem('grammarglow_progress');
    
    if (modelReady) {
      setState('dashboard');
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);
          setProgress(parsed);
        } catch (e) {
          console.error("Failed to parse progress", e);
        }
      }
    }
  }, []);

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('grammarglow_progress', JSON.stringify(newProgress));
  };

  const handleSelectType = (type: ExerciseType) => {
    setSelectedType(type);
    setState('exercise');
  };

  const handleExerciseComplete = (isLevelUp: boolean) => {
    const isLadder = selectedType === ExerciseType.GRAMMAR_LADDER;
    const newProgress = {
      ...progress,
      level: (isLadder && isLevelUp) ? progress.level + 1 : progress.level,
      totalCorrect: progress.totalCorrect + 1, // Optional stats increment
      lastActive: new Date().toISOString()
    };
    saveProgress(newProgress);
    setState('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {state === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <ModelDownloader onComplete={() => setState('dashboard')} />
          </motion.div>
        )}

        {state === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <Dashboard 
              onSelectType={handleSelectType} 
              currentLevel={progress.level} 
            />
            
            {/* Offline Capability Banner */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 flex justify-center pointer-events-none">
                <motion.div 
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4 pointer-events-auto"
                >
                    <div className="flex items-center gap-2 text-green-400 font-bold text-xs">
                        <WifiOff size={14} />
                        <span>LOCAL ENGINE</span>
                    </div>
                    <div className="w-px h-3 bg-white/20" />
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                        <ShieldCheck size={14} />
                        <span>GEMMA 2 (OFFLINE)</span>
                    </div>
                </motion.div>
            </div>
          </motion.div>
        )}

        {state === 'exercise' && selectedType && (
          <motion.div
            key="exercise"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <ExerciseView 
              type={selectedType}
              level={progress.level}
              onBack={() => setState('dashboard')}
              onComplete={handleExerciseComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
