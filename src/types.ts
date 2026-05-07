
export interface UserProgress {
  level: number; 
  completedExercises: string[];
  totalCorrect: number;
  totalAttempted: number;
  lastActive: string;
}

export interface SessionStats {
  correct: number;
  total: number;
  targetCount: number; // e.g., 10 questions per session
}

export enum ExerciseType {
  READING = 'reading',
  WRITING = 'writing',
  SPEAKING = 'speaking',
  LISTENING = 'listening',
  GRAMMAR_LADDER = 'grammar_ladder'
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  title: string;
  titleBn: string;
  content: string;
  options?: string[];
  correctAnswer?: string;
  explanation: string;
  explanationBn: string;
}

export interface ModelStatus {
  isDownloaded: boolean;
  isReady: boolean;
  progress: number;
  error: string | null;
}
