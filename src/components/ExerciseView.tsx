
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Send, Check, X, RefreshCw, Volume2, Award, ArrowRight } from 'lucide-react';
import { Exercise, ExerciseType, SessionStats } from '../types';
import { AIService } from '../services/aiService';

interface ExerciseViewProps {
  type: ExerciseType;
  level: number;
  onBack: () => void;
  onComplete: (isLevelUp: boolean) => void;
}

const QUESTIONS_PER_SESSION = 50;

export const ExerciseView: React.FC<ExerciseViewProps> = ({ type, level, onBack, onComplete }) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; feedback: string; feedbackBn: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [textInput, setTextInput] = useState("");
  
  // Session tracking
  const [session, setSession] = useState<SessionStats>({
    correct: 0,
    total: 0,
    targetCount: QUESTIONS_PER_SESSION
  });
  const [showResults, setShowResults] = useState(false);

  const loadExercise = async () => {
    setIsLoading(true);
    setExercise(null);
    setFeedback(null);
    setSelectedOption(null);
    setTextInput("");
    
    try {
      const ai = AIService.getInstance();
      const nextExercise = await ai.generateExercise(type, level);
      setExercise(nextExercise);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExercise();
  }, [type, level]);

  const handleSubmit = async (value: string) => {
    if (feedback) return;
    const ai = AIService.getInstance();
    const result = await ai.getFeedback(value, exercise?.correctAnswer || "");
    
    setFeedback(result);
    setSession(prev => ({
      ...prev,
      correct: result.isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
  };

  const handleNext = () => {
    if (session.total >= session.targetCount) {
      setShowResults(true);
    } else {
      loadExercise();
    }
  };

  const scorePercentage = (session.correct / session.targetCount) * 100;
  const passedThreshold = scorePercentage >= 80;

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
          
          <h2 className="text-3xl font-black mb-1">{passedThreshold ? "Well Done!" : "Keep Trying!"}</h2>
          <p className="bangla-text text-xl text-slate-500 mb-6">{passedThreshold ? "আপনি সফল হয়েছেন!" : "আরো চেষ্টা করুন!"}</p>
          
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

          <div className="p-4 bg-slate-50 rounded-2xl mb-8">
            <p className="text-sm text-slate-600">
              {passedThreshold 
                ? "You've unlocked the next level with 80%+ accuracy." 
                : "You need 80% accuracy to move to the next step. Practice makes perfect!"}
            </p>
          </div>

          <button
            onClick={() => onComplete(passedThreshold)}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
              passedThreshold ? "bg-primary text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            {passedThreshold ? (
              <>
                <span>Next Grammar Step</span>
                <ArrowRight size={20} />
              </>
            ) : (
              "Back to Dashboard"
            )}
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="animate-spin text-primary mb-4" size={48} />
        <p className="font-bold">AI is generating exercise...</p>
        <p className="bangla-text text-slate-500">এআই অনুশীলন তৈরি করছে...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      <nav className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="font-black text-primary uppercase text-sm">{type.replace('_', ' ')}</h2>
          <p className="text-xs text-slate-400">Step {session.total < session.targetCount ? session.total + 1 : session.targetCount} of {session.targetCount}</p>
        </div>
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs">
          {level}
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={exercise?.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
        >
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-1">{exercise?.title}</h3>
            <p className="bangla-text text-slate-500">{exercise?.titleBn}</p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl mb-8 relative group">
            <p className="text-lg leading-relaxed">{exercise?.content}</p>
            <button 
                onClick={() => playAudio(exercise?.content || "")}
                className="absolute top-2 right-2 p-2 bg-white shadow-sm rounded-full text-slate-400 hover:text-primary transition-colors"
                title="Listen"
            >
                <Volume2 size={18} />
            </button>
          </div>

          {exercise?.options ? (
            <div className="grid gap-3">
              {exercise.options.map((option) => (
                <button
                  key={option}
                  disabled={!!feedback}
                  onClick={() => {
                    setSelectedOption(option);
                    handleSubmit(option);
                  }}
                  className={`p-4 rounded-2xl text-left border-2 transition-all font-medium ${
                    selectedOption === option
                      ? feedback?.isCorrect 
                        ? "border-green-500 bg-green-50 text-green-700" 
                        : "border-red-500 bg-red-50 text-red-700"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
                <input 
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none transition-all"
                    disabled={!!feedback}
                />
                {!feedback && (
                    <button 
                        onClick={() => handleSubmit(textInput)}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                    >
                        <Send size={18} />
                        Submit Answer
                    </button>
                )}
            </div>
          )}

          {feedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`mt-8 p-6 rounded-2xl ${
                feedback.isCorrect ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {feedback.isCorrect ? <Check className="text-green-600" /> : <X className="text-red-600" />}
                <span className={`font-black uppercase text-sm ${feedback.isCorrect ? "text-green-700" : "text-red-700"}`}>
                  {feedback.isCorrect ? "Correct" : "Try Again"}
                </span>
              </div>
              <p className="font-bold text-slate-800 mb-1">{feedback.feedback}</p>
              <p className="bangla-text text-sm text-slate-600 mb-4">{feedback.feedbackBn}</p>
              
              <div className="p-4 bg-white/50 rounded-xl">
                 <p className="text-xs uppercase font-black text-slate-400 mb-1">AI Explanation</p>
                 <p className="text-sm italic">{exercise?.explanation}</p>
                 <p className="bangla-text text-xs italic mt-1 text-slate-500">{exercise?.explanationBn}</p>
              </div>

              <button
                onClick={handleNext}
                className={`mt-6 w-full py-3 rounded-xl font-bold transition-transform active:scale-95 ${
                    feedback.isCorrect ? "bg-green-600 text-white shadow-md shadow-green-200" : "bg-slate-200 text-slate-700"
                }`}
              >
                {session.total >= session.targetCount ? "View Results" : feedback.isCorrect ? "Next Question" : "Retry"}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
