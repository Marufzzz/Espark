
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, PenTool, Mic, Headphones, GraduationCap, ChevronRight, Languages } from 'lucide-react';
import { ExerciseType } from '../types';
import { APP_NAME, APP_NAME_BN, GRAMMAR_LADDER_STEPS } from '../constants';

interface DashboardProps {
  onSelectType: (type: ExerciseType) => void;
  currentLevel: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectType, currentLevel }) => {
  const currentStep = GRAMMAR_LADDER_STEPS.find(s => s.level === currentLevel) || GRAMMAR_LADDER_STEPS[0];

  const tools = [
    { id: ExerciseType.READING, label: "Reading", labelBn: "পড়া", icon: BookOpen, color: "bg-blue-500" },
    { id: ExerciseType.WRITING, label: "Writing", labelBn: "লেখা", icon: PenTool, color: "bg-orange-500" },
    { id: ExerciseType.VOCABULARY, label: "Vocabulary", labelBn: "শব্দভাণ্ডার", icon: Languages, color: "bg-indigo-500" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8 pb-24">
      <header className="py-8">
        <h1 className="text-4xl font-black tracking-tight text-primary">{APP_NAME}</h1>
        <h2 className="text-xl bangla-text font-medium text-slate-500">{APP_NAME_BN}</h2>
      </header>

      {/* Grammar Ladder Featured Card */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectType(ExerciseType.GRAMMAR_LADDER)}
        className="w-full relative overflow-hidden bg-primary text-white p-6 rounded-3xl shadow-lg text-left"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 opacity-80 uppercase tracking-widest text-xs font-bold">
            <GraduationCap size={16} />
            <span>Grammar Ladder • লেভেল {currentLevel}</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{currentStep.concept}</h3>
          <p className="bangla-text text-lg opacity-90">{currentStep.conceptBn}</p>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="h-2 flex-1 bg-white/20 rounded-full mr-4">
              <div 
                className="h-full bg-white rounded-full" 
                style={{ width: `${(currentLevel / GRAMMAR_LADDER_STEPS.length) * 100}%` }} 
              />
            </div>
            <div className="p-2 bg-white/10 rounded-full">
              <ChevronRight size={24} />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      </motion.button>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-2 gap-4">
        {tools.map((tool, idx) => (
          <motion.button
            key={tool.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectType(tool.id)}
            className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <div className={`p-4 rounded-2xl ${tool.color} text-white mb-4 shadow-sm`}>
              <tool.icon size={32} />
            </div>
            <h4 className="font-bold text-slate-800">{tool.label}</h4>
            <p className="bangla-text text-sm text-slate-500">{tool.labelBn}</p>
          </motion.button>
        ))}
      </div>

      <div className="p-4 bg-slate-100 rounded-2xl">
          <p className="text-xs text-slate-500 uppercase font-black mb-1">Status</p>
          <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Offline AI Active</span>
          </div>
      </div>
    </div>
  );
};
