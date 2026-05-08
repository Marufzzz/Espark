
export interface GrammarSubTopic {
  id: string;
  topicId: string;
  title: string;
  titleBn: string;
  questionCount: number;
  isFinal?: boolean;
}

export interface GrammarTopic {
  id: string;
  title: string;
  titleBn: string;
  subTopics: GrammarSubTopic[];
}

export interface UserProgress {
  completedSubTopics: string[]; // List of IDs
  totalPoints: number;
}

export interface SessionStats {
  correct: number;
  total: number;
  targetCount: number; 
}

export enum ExerciseType {
  READING = 'reading',
  WRITING = 'writing',
  SPEAKING = 'speaking',
  LISTENING = 'listening',
  GRAMMAR_LADDER = 'grammar_ladder',
  VOCABULARY = 'vocabulary'
}

export interface VocabularyWord {
  word: string;
  definition: string;
  definitionBn: string;
  example: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  topicId?: string;
  subTopicId?: string;
  title: string;
  titleBn: string;
  passage?: string; 
  content: string;
  options?: string[];
  correctAnswer?: string;
  explanation: string;
  explanationBn: string;
  isWritten?: boolean;
  vocabulary?: VocabularyWord[]; 
}

export interface ModelStatus {
  isDownloaded: boolean;
  isReady: boolean;
  progress: number;
  error: string | null;
}
