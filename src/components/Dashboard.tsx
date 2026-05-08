
import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, PenTool, GraduationCap, ChevronRight, Languages, Lock, CheckCircle2 } from 'lucide-react';
import { ExerciseType, UserProgress } from '../types';
import { APP_NAME, APP_NAME_BN, GRAMMAR_CURRICULUM } from '../constants';

interface DashboardProps {
  onStartExercise: (type: ExerciseType, topicId?: string, subTopicId?: string, questionCount?: number) => void;
  progress: UserProgress;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartExercise, progress }) => {
  const tools = [
    { id: ExerciseType.READING, label: "Reading", labelBn: "পড়া", icon: BookOpen, color: "bg-blue-500" },
    { id: ExerciseType.WRITING, label: "Writing", labelBn: "লেখা", icon: PenTool, color: "bg-orange-500" },
    { id: ExerciseType.VOCABULARY, label: "Vocabulary", labelBn: "শব্দভাণ্ডার", icon: Languages, color: "bg-indigo-500" },
  ];

  const totalPoints = progress.totalPoints || 0;
  const rank = totalPoints > 1000 ? "Master" : totalPoints > 500 ? "Explorer" : "Scholar";

  const readingProgress = progress.readingSetIndex || 0;
  const writingProgress = progress.writingSetIndex || 0;

  const isSubTopicUnlocked = (subTopicId: string, topicId: string) => {
    const topic = GRAMMAR_CURRICULUM.find(t => t.id === topicId);
    if (!topic) return false;
    const index = topic.subTopics.findIndex(s => s.id === subTopicId);
    
    const completedSubTopics = progress.completedSubTopics || [];
    if (topicId === GRAMMAR_CURRICULUM[0].id && index === 0) return true;
    if (completedSubTopics.includes(subTopicId)) return true;
    if (index > 0 && completedSubTopics.includes(topic.subTopics[index-1].id)) return true;
    
    if (index === 0) {
        const tIndex = GRAMMAR_CURRICULUM.findIndex(t => t.id === topicId);
        if (tIndex > 0) {
            const prevTopic = GRAMMAR_CURRICULUM[tIndex - 1];
            const lastSub = prevTopic.subTopics[prevTopic.subTopics.length - 1];
            return completedSubTopics.includes(lastSub.id);
        }
    }
    return false;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-12 pb-20">
      <header className="py-12 flex flex-col items-center">
        <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-4 px-4 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-black uppercase tracking-widest"
        >
            {rank} Rank
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-black text-slate-900 tracking-tighter"
        >
          {APP_NAME}<span className="text-primary">.</span>
        </motion.h1>
        <p className="bangla-text text-xl text-slate-500 mt-2 font-medium">{APP_NAME_BN}</p>
        
        <div className="mt-8 flex items-center gap-8">
            <div className="text-center">
                <span className="block text-3xl font-black text-slate-900">{totalPoints}</span>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Glow Points</span>
            </div>
            <div className="w-px h-10 bg-slate-100" />
            <div className="text-center">
                <span className="block text-3xl font-black text-slate-900">{(progress.completedSubTopics || []).length}</span>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Lessons Done</span>
            </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-6">
          <motion.button
            whileHover={{ y: -5 }}
            onClick={() => onStartExercise(ExerciseType.READING)}
            className="p-8 bg-blue-600 text-white rounded-[40px] shadow-xl shadow-blue-200 text-left relative overflow-hidden group"
          >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <BookOpen size={32} />
                    <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase">Set {readingProgress + 1}/50</span>
                </div>
                <h4 className="text-2xl font-black uppercase leading-tight mb-1">Reading Lab</h4>
                <p className="bangla-text opacity-80 font-medium">পড়ার দক্ষতা বাড়ান</p>
                
                <div className="mt-8 h-1.5 w-full bg-white/20 rounded-full">
                    <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${(readingProgress / 50) * 100}%` }} />
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </motion.button>

          <motion.button
            whileHover={{ y: -5 }}
            onClick={() => onStartExercise(ExerciseType.WRITING)}
            className="p-8 bg-orange-500 text-white rounded-[40px] shadow-xl shadow-orange-200 text-left relative overflow-hidden group"
          >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <PenTool size={32} />
                    <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase">Set {writingProgress + 1}/50</span>
                </div>
                <h4 className="text-2xl font-black uppercase leading-tight mb-1">Writing Studio</h4>
                <p className="bangla-text opacity-80 font-medium">লেখার দক্ষতা বৃদ্ধি করুন</p>

                <div className="mt-8 h-1.5 w-full bg-white/20 rounded-full">
                    <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${(writingProgress / 50) * 100}%` }} />
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </motion.button>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-3 px-2">
            <GraduationCap className="text-primary" size={28} />
            <div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">Grammar Path</h3>
                <p className="bangla-text text-slate-400 font-bold">লার্নিং পাথওয়ে</p>
            </div>
        </div>

        <div className="space-y-10">
            {GRAMMAR_CURRICULUM.map((topic, tIdx) => (
                <div key={topic.id} className="relative">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                            {tIdx + 1}
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-800 uppercase">{topic.title}</h4>
                            <p className="bangla-text text-sm text-slate-400 font-bold">{topic.titleBn}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                        {topic.subTopics.map((sub) => {
                            const unlocked = isSubTopicUnlocked(sub.id, topic.id);
                            const completed = (progress.completedSubTopics || []).includes(sub.id);
                            
                            return (
                                <motion.button
                                    key={sub.id}
                                    whileHover={unlocked ? { x: 5 } : {}}
                                    onClick={() => unlocked && onStartExercise(ExerciseType.GRAMMAR_LADDER, topic.id, sub.id, sub.questionCount)}
                                    className={`relative p-5 rounded-3xl border-2 text-left transition-all ${
                                        completed 
                                            ? "bg-green-50 border-green-200" 
                                            : unlocked 
                                                ? "bg-white border-slate-100 shadow-sm hover:border-primary" 
                                                : "bg-slate-50 border-slate-50 opacity-60 cursor-not-allowed"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className={`block font-bold ${completed ? 'text-green-700' : 'text-slate-700'}`}>{sub.title}</span>
                                            <span className="block bangla-text text-xs text-slate-400 font-bold">{sub.titleBn}</span>
                                        </div>
                                        {completed ? (
                                            <CheckCircle2 className="text-green-500" size={20} />
                                        ) : unlocked ? (
                                            <div className="flex items-center gap-1 text-[10px] font-black text-slate-300 uppercase">
                                                <span>{sub.questionCount} Qs</span>
                                                <ChevronRight size={14} />
                                            </div>
                                        ) : (
                                            <Lock className="text-slate-300" size={18} />
                                        )}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};
