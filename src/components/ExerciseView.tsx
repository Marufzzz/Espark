
import { Exercise, ExerciseType, SessionStats } from '../types';
import { AIService } from '../services/aiService';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Send, Check, X, RefreshCw, Volume2, Award, ArrowRight, PenTool, Languages, Info } from 'lucide-react';

interface ExerciseViewProps {
  type: ExerciseType;
  topicId?: string;
  subTopicId?: string;
  targetQuestionCount?: number;
  onBack: () => void;
  onComplete: (passed: boolean) => void;
}

export const ExerciseView: React.FC<ExerciseViewProps> = ({ type, topicId, subTopicId, targetQuestionCount, onBack, onComplete }) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0); // For batch reading
  const [isPracticeMode, setIsPracticeMode] = useState(false); // For writing practice followup
  const [practiceIndex, setPracticeIndex] = useState(0);
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; feedback: string; feedbackBn: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [showVocab, setShowVocab] = useState(false);
  
  const [session, setSession] = useState({
    correct: 0,
    total: 0,
    targetCount: targetQuestionCount || 5
  });
  const [showResults, setShowResults] = useState(false);

  const loadExercise = async () => {
    setIsLoading(true);
    setExercise(null);
    setFeedback(null);
    setSelectedOption(null);
    setTextInput("");
    setShowVocab(false);
    setCurrentBatchIndex(0);
    setIsPracticeMode(false);
    setPracticeIndex(0);
    
    try {
      const ai = AIService.getInstance();
      // Get setIndex from progress if available (handled by App.tsx, but we can pass it via targetQuestionCount or additional prop if needed)
      // Actually, we'll just let AIService handle it or we can pass a prop.
      // For now, let's assume we can calculate it or it's passed.
      const nextExercise = await ai.generateExercise(type, topicId, subTopicId);
      
      if (type === ExerciseType.READING && nextExercise.batchQuestions) {
        setSession({ correct: 0, total: 0, targetCount: nextExercise.batchQuestions.length });
      } else if (type === ExerciseType.WRITING) {
          setSession({ correct: 0, total: 0, targetCount: 1 }); // Main essay is 1
      }
      
      setExercise(nextExercise);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExercise();
  }, [type, topicId, subTopicId]);

  const currentQuestion = isPracticeMode 
    ? exercise?.practiceQuestions?.[practiceIndex] 
    : (exercise?.batchQuestions ? exercise.batchQuestions[currentBatchIndex] : exercise);

  const handleSubmit = async (value: string) => {
    if (feedback || !value.trim()) return;
    const ai = AIService.getInstance();
    
    // Generic validation for the main essay
    const target = (type === ExerciseType.WRITING && !isPracticeMode) ? "GENERIC_VALIDATION" : currentQuestion?.correctAnswer || "";
    const result = await ai.getFeedback(value, target);
    
    setFeedback(result);
    setSession(prev => ({
      ...prev,
      correct: result.isCorrect ? prev.correct + 1 : prev.correct,
      total: !isPracticeMode ? prev.total + 1 : prev.total // Only count main total
    }));
  };

  const handleNext = () => {
    setFeedback(null);
    setSelectedOption(null);
    setTextInput("");

    if (type === ExerciseType.READING && exercise?.batchQuestions) {
        if (currentBatchIndex < exercise.batchQuestions.length - 1) {
            setCurrentBatchIndex(prev => prev + 1);
        } else {
            setShowResults(true);
        }
    } else if (type === ExerciseType.WRITING) {
        if (!isPracticeMode && exercise?.practiceQuestions && exercise.practiceQuestions.length > 0) {
            setIsPracticeMode(true);
            setPracticeIndex(0);
        } else if (isPracticeMode && exercise?.practiceQuestions && practiceIndex < exercise.practiceQuestions.length - 1) {
            setPracticeIndex(prev => prev + 1);
        } else {
            setShowResults(true);
        }
    } else {
        if (session.total >= session.targetCount) {
            setShowResults(true);
        } else {
            loadExercise();
        }
    }
  };

  const scorePercentage = (session.correct / session.targetCount) * 100;
  const passedThreshold = scorePercentage >= 70; // 70% Pass mark

  if (showResults) {
    return (
      <div className="max-w-md mx-auto p-6 text-center space-y-6">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100"
        >
          <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 ${passedThreshold ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
            <Award size={48} />
          </div>
          
          <h2 className="text-3xl font-black mb-1">{passedThreshold ? "Set Complete!" : "Try Again!"}</h2>
          <p className="bangla-text text-xl text-slate-500 mb-6">{passedThreshold ? "পরবর্তী লেভেলের জন্য তৈরি!" : "পুনরায় চেষ্টা করুন।"}</p>
          
          <div className="flex justify-around mb-8">
            <div>
              <p className="text-3xl font-black text-primary">{session.correct}/{session.targetCount}</p>
              <p className="text-xs uppercase text-slate-400 font-bold">Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-black text-primary">{Math.round(scorePercentage)}%</p>
              <p className="text-xs uppercase text-slate-400 font-bold">Score</p>
            </div>
          </div>

          <button
            onClick={() => onComplete(passedThreshold)}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
              passedThreshold ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-200 text-slate-700"
            }`}
          >
            <span>Finish Set</span>
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="mb-6 p-4 rounded-full bg-primary/10 text-primary"
        >
            <RefreshCw size={48} />
        </motion.div>
        <p className="text-xl font-bold text-slate-800">Gemma 2 Thinking...</p>
        <p className="bangla-text text-slate-500">জেমা ২ সেট তৈরি করছে...</p>
      </div>
    );
  }

  const progressTotal = type === ExerciseType.READING ? currentBatchIndex + 1 : session.total;

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24">
      <nav className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="font-black text-primary uppercase text-sm">{type.replace('_', ' ')}</h2>
          <p className="text-xs text-slate-400">Question {progressTotal} of {session.targetCount}</p>
        </div>
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs text-slate-600">
          {session.correct}/{session.targetCount}
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={exercise?.id + (isPracticeMode ? '-prac-' : '-main-') + (currentBatchIndex)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100"
        >
          {isPracticeMode && (
              <div className="mb-4 px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-black uppercase tracking-widest inline-block">
                  Practice Phase
              </div>
          )}

          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-1">{isPracticeMode ? currentQuestion?.title : exercise?.title}</h3>
            <p className="bangla-text text-slate-500">{isPracticeMode ? currentQuestion?.titleBn : exercise?.titleBn}</p>
          </div>

          {/* Reading Passage PERSISTS in Reading batch */}
          {exercise?.passage && !isPracticeMode && (
            <div className="mb-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 relative max-h-64 overflow-y-auto">
                <p className="text-lg leading-relaxed text-slate-700 italic font-medium">
                    {exercise.passage}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest sticky bottom-0 bg-blue-50/80 p-2">
                    <span>Reading Passage</span>
                    <div className="h-px flex-1 bg-blue-100" />
                </div>
            </div>
          )}

          <div className="p-6 bg-slate-50 rounded-3xl mb-8 relative group">
            <p className="text-xl font-medium leading-relaxed">{currentQuestion?.content}</p>
            <button 
                onClick={() => playAudio(currentQuestion?.content || "")}
                className="absolute top-2 right-2 p-2 bg-white shadow-sm rounded-full text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
            >
                <Volume2 size={18} />
            </button>
          </div>

          {(type === ExerciseType.WRITING && !isPracticeMode) ? (
              <div className="space-y-4">
                  <textarea 
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Write your response here..."
                    className="w-full h-48 p-6 rounded-3xl border-2 border-slate-100 focus:border-primary outline-none transition-all resize-none text-lg"
                    disabled={!!feedback}
                  />
                  {!feedback && (
                      <button 
                        onClick={() => handleSubmit(textInput)}
                        className="w-full py-5 bg-primary text-white rounded-[30px] font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-sans"
                      >
                         <PenTool size={20} />
                         <span>Analyze My Writing</span>
                      </button>
                  )}
              </div>
          ) : (
            <div className={`grid gap-3 ${currentQuestion?.options ? 'grid-cols-1' : ''}`}>
                {currentQuestion?.options ? (
                    currentQuestion.options.map((option) => (
                        <button
                          key={option}
                          disabled={!!feedback}
                          onClick={() => {
                            setSelectedOption(option);
                            handleSubmit(option);
                          }}
                          className={`p-5 rounded-3xl text-left border-2 transition-all text-lg ${
                            selectedOption === option
                              ? feedback?.isCorrect 
                                ? "border-green-500 bg-green-50 text-green-700" 
                                : "border-red-500 bg-red-50 text-red-700"
                              : feedback 
                                ? "border-slate-50 opacity-40"
                                : "border-slate-100 hover:border-slate-300 bg-slate-50/20"
                          }`}
                        >
                          {option}
                        </button>
                      ))
                ) : (
                    <div className="space-y-4">
                        <input 
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Type your answer..."
                            className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-lg"
                            disabled={!!feedback}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(textInput)}
                        />
                        {!feedback && (
                            <button 
                                onClick={() => handleSubmit(textInput)}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold"
                            >
                                Submit Answer
                            </button>
                        )}
                    </div>
                )}
            </div>
          )}

          {feedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`mt-10 p-8 rounded-[35px] ${
                feedback.isCorrect ? "bg-green-50/80 border border-green-100" : "bg-red-50/80 border border-red-100"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${feedback.isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {feedback.isCorrect ? <Check size={24} /> : <X size={24} />}
                </div>
                <span className={`font-black uppercase text-sm tracking-widest ${feedback.isCorrect ? "text-green-700" : "text-red-700"}`}>
                  {feedback.isCorrect ? "Analysis Result" : "Correction Needed"}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                   <p className="text-xl font-bold text-slate-800 leading-snug">{feedback.feedback}</p>
                   <p className="bangla-text text-lg text-slate-600 mt-1">{feedback.feedbackBn}</p>
                </div>
                
                <div className="p-5 bg-white/60 rounded-2xl border border-white">
                    <p className="text-xs uppercase font-black text-slate-400 mb-2 tracking-tighter">Gemma 2 Insights</p>
                    <p className="text-sm leading-relaxed text-slate-700">{currentQuestion?.explanation}</p>
                    <p className="bangla-text text-sm mt-2 text-slate-500">{currentQuestion?.explanationBn}</p>
                </div>
              </div>

              <button
                onClick={handleNext}
                className={`mt-8 w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    feedback.isCorrect ? "bg-green-600 text-white shadow-xl shadow-green-200" : "bg-slate-900 text-white shadow-xl shadow-slate-200"
                }`}
              >
                <span>{isPracticeMode ? "Next Question" : (type === ExerciseType.WRITING ? "Start Practice Phase" : "Next Question")}</span>
                <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
