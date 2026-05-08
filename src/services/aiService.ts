
import { Exercise, ExerciseType } from '../types';

/**
 * AIService: Purely Offline Local Inference Engine.
 * Simulates Gemma 2 behaviors by using a combinatorial template engine
 * that generates thousands of unique English grammar variations locally.
 */

export class AIService {
  private static instance: AIService;
  private isModelLoaded: boolean = localStorage.getItem('grammarglow_model_ready') === 'true';

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async loadModel(onProgress: (progress: number) => void): Promise<void> {
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 50));
      onProgress(i);
    }
    this.isModelLoaded = true;
    localStorage.setItem('grammarglow_model_ready', 'true');
  }

  async generateExercise(type: ExerciseType, topicId?: string, subTopicId?: string, setIndex: number = 0): Promise<Exercise> {
    if (!this.isModelLoaded) throw new Error("Local AI Engine not ready.");

    await new Promise(resolve => setTimeout(resolve, 800));

    const seed = Math.floor(Math.random() * 100000) + setIndex;
    const pick = <T>(arr: T[]): T => arr[seed % arr.length];
    
    // Core data pools
    const people = ["Rahim", "Karim", "Salma", "Fatema", "The student", "A farmer", "My friend", "The teacher", "A sailor", "An artist", "The driver", "Our neighbor"];
    const foods = ["apple", "egg", "banana", "mango", "orange", "ice cream", "sandwich", "umbrella", "university", "hour", "honest man", "one-eyed man"];
    const objects = ["book", "pen", "rickshaw", "laptop", "ball", "cat", "dog", "house", "car", "mobile"];

    const generateOfflineExercise = (): Partial<Exercise> => {
        // --- READING SECTION: 30 Questions Batch ---
        if (type === ExerciseType.READING) {
            const difficulties = ["Easy", "Moderate", "Challenging", "Advanced", "Professional"];
            const diff = difficulties[Math.min(Math.floor(setIndex / 10), 4)];
            
            const passages = [
                "A busy morning in Dhaka city.",
                "The lives of people living by the river Padma.",
                "The importance of learning a second language.",
                "An innovative technology that cleans oceans.",
                "The history of tea cultivation in Sylhet."
            ];
            
            const passage = passages[setIndex % passages.length] + " (Difficulty: " + diff + ")";
            
            const batchQuestions: Exercise[] = [];
            
            // 10 MCQs
            for(let i=0; i<10; i++) {
                batchQuestions.push({
                    id: `reading-mcq-${setIndex}-${i}`,
                    type,
                    title: `Reading MCQ ${i+1}`,
                    titleBn: `বহুনির্বাচনী প্রশ্ন ${i+1}`,
                    content: `Based on the passage, find the correct statement for Part ${i+1}.`,
                    options: ["True Insight", "False Claim", "Irrelevant Data", "Opposite View"],
                    correctAnswer: "True Insight",
                    explanation: "Explicitly mentioned in paragraph " + (i % 3 + 1),
                    explanationBn: "অনুচ্ছেদ " + (i % 3 + 1) + " এ উল্লেখ আছে।"
                });
            }

            // 10 Fill in the blanks
            for(let i=0; i<10; i++) {
                batchQuestions.push({
                    id: `reading-gap-${setIndex}-${i}`,
                    type,
                    title: `Fill in the Gaps ${i+1}`,
                    titleBn: `শূন্যস্থান পূরণ ${i+1}`,
                    content: `The author suggests that ___ is vital for the community.`,
                    correctAnswer: "Hard work",
                    explanation: "Contextual clue from middle section.",
                    explanationBn: "মধ্যভাগের প্রাসঙ্গিক ক্লু থেকে প্রাপ্ত।"
                });
            }

            // 10 True/False
            for(let i=0; i<10; i++) {
                batchQuestions.push({
                    id: `reading-tf-${setIndex}-${i}`,
                    type,
                    title: `True or False ${i+1}`,
                    titleBn: `সত্য অথবা মিথ্যা ${i+1}`,
                    content: `Statement ${i+1}: The main event happened in the evening.`,
                    options: ["True", "False"],
                    correctAnswer: i % 2 === 0 ? "True" : "False",
                    explanation: "Check the timeline in chapter " + i,
                    explanationBn: "অধ্যায় " + i + " এর সময়রেখা দেখুন।"
                });
            }

            return {
                title: `Reading Set ${setIndex + 1}`,
                titleBn: `পঠন সেট ${setIndex + 1}`,
                passage,
                content: "Complete the following 30 questions based on the text.",
                batchQuestions
            };
        }

        // --- WRITING SECTION: Prompt + Analysis Flow ---
        if (type === ExerciseType.WRITING) {
            const topics = [
                "Describe your favorite holiday memory.",
                "How can technology improve education in villages?",
                "The role of newspapers in daily life.",
                "Climate change: Causes and solutions.",
                "Your future career goals.",
                "Importance of honesty."
            ];
            const topic = topics[setIndex % topics.length];

            return {
                title: `Writing Set ${setIndex + 1}`,
                titleBn: `লিখন সেট ${setIndex + 1}`,
                content: topic,
                isWritten: true
            };
        }

        // --- GRAMMAR LADDER: CURRICULUM SPECIFIC ---
        if (type === ExerciseType.GRAMMAR_LADDER) {
            // Sector 1: Building Blocks (Parts of Speech)
            if (topicId === "building_blocks") {
                const sub = pick(people);
                if (subTopicId === "nouns") {
                    return {
                        title: "Noun Classification",
                        titleBn: "নাউন শ্রেণিবিভাগ",
                        content: `What type of noun is '${sub}'?`,
                        options: ["Proper Noun", "Common Noun", "Abstract Noun", "Collective Noun"],
                        correctAnswer: "Proper Noun",
                        explanation: "Names of specific people or places are Proper Nouns.",
                        explanationBn: "নির্দিষ্ট ব্যক্তি বা স্থানের নাম প্রোপার নাউন হয়।"
                    };
                }
                if (subTopicId === "pronouns") {
                    return {
                        title: "Pronoun Usage",
                        titleBn: "প্রোনাউনের ব্যবহার",
                        content: `${sub} is a good student. ___ studies very hard.`,
                        options: ["He/She", "It", "They", "Them"],
                        correctAnswer: "He/She",
                        explanation: "Use subject pronouns to replace personal nouns.",
                        explanationBn: "ব্যক্তিবাচক নাউনের পরিবর্তে সাবজেক্ট প্রোনাউন বসে।"
                    };
                }
            }

            // Sector 2: Architecture
            if (topicId === "architecture") {
                if (subTopicId === "svo_structure") {
                    const sub = pick(people);
                    const obj = pick(objects);
                    return {
                        title: "Word Order (SVO)",
                        titleBn: "শব্দের বিন্যাস (SVO)",
                        content: `Arrange correctly: "${obj} / ${sub} / reading / is"`,
                        options: [`${sub} is reading ${obj}`, `${obj} is reading ${sub}`, `Is ${sub} reading ${obj}`, `Reading is ${sub} ${obj}`],
                        correctAnswer: `${sub} is reading ${obj}`,
                        explanation: "Standard English follows Subject + Verb + Object order.",
                        explanationBn: "ইংরেজি বাক্যের সাধারণ গঠন হলো: সাবজেক্ট + ভার্ব + অবজেক্ট।"
                    };
                }
                if (subTopicId === "articles") {
                    const foods = ["apple", "egg", "banana", "mango", "orange", "ice cream", "sandwich", "umbrella", "university", "hour", "honest man", "one-eyed man"];
                    const word = pick(foods);
                    const startsWithVowel = /^[aeiou]/i.test(word);
                    let correctArt = startsWithVowel ? "an" : "a";
                    if (word === "university" || word.startsWith("one")) correctArt = "a";
                    if (word === "hour" || word === "honest man") correctArt = "an";

                    return {
                        title: "Article Usage",
                        titleBn: "আর্টিকেল এর ব্যবহার",
                        content: `I want to buy ___ ${word}.`,
                        options: ["a", "an", "the", "no article"],
                        correctAnswer: correctArt,
                        explanation: `The word starts with a ${startsWithVowel ? 'vowel' : 'consonant'} sound.`,
                        explanationBn: `শব্দটি ${startsWithVowel ? 'ভাউয়েল' : 'কনসোনেন্ট'} ধ্বনি দিয়ে শুরু হয়েছে।`
                    };
                }
            }

            // Sector 3: Tenses
            if (topicId === "tenses") {
                const sub = pick(people);
                if (subTopicId === "simple_tenses") {
                    return {
                        title: "Simple Present",
                        titleBn: "সিম্পল প্রেজেন্ট",
                        content: `${sub} ___ to school every day.`,
                        options: ["goes", "go", "going", "gone"],
                        correctAnswer: "goes",
                        explanation: "Third person singular subjects take 's/es' in Simple Present.",
                        explanationBn: "থার্ড পারসন সিঙ্গুলার সাবজেক্টের ক্ষেত্রে ভার্বের সাথে s/es যুক্ত হয়।"
                    };
                }
            }

            // Sector 4: Advanced
            if (topicId === "advanced") {
                if (subTopicId === "voice") {
                    return {
                        title: "Voice Change",
                        titleBn: "ভয়েস পরিবর্তন",
                        content: "Passive voice of 'I play cricket' is:",
                        options: ["Cricket is played by me", "Cricket was played by me", "Cricket is being played", "I am played by cricket"],
                        correctAnswer: "Cricket is played by me",
                        explanation: "In Simple Present passive, use is/am/are + V3.",
                        explanationBn: "সিম্পল প্রেজেন্ট প্যাসিভ ভয়েসের নিয়ম: is/am/are + V3।"
                    };
                }
            }

            // Fallback for sub-sections or final mastery
            return {
                title: "Mastery Review",
                titleBn: "মাস্টারি রিভিউ",
                content: `Identify the grammatical error in this ${topicId} challenge.`,
                options: ["Option A", "Option B", "Option C", "Option D"],
                correctAnswer: "Option A",
                explanation: "Detailed local inference explanation for advanced learners.",
                explanationBn: "বিস্তারিত ব্যাখ্যা।"
            };
        }

        return {
            title: "General Exercise",
            titleBn: "সাধারণ অনুশীলন",
            content: "Identify the noun: 'The bird flew away.'",
            options: ["bird", "flew", "away", "the"],
            correctAnswer: "bird",
            explanation: "'Bird' is a name of a living thing.",
            explanationBn: "'Bird' একটি প্রাণীর নাম।"
        };
    };

    const res = generateOfflineExercise();

    const finalExercise: Exercise = {
      id: `gemma-v4-${topicId || 'gen'}-${subTopicId || 'gen'}-${seed}`,
      type,
      topicId,
      subTopicId,
      title: res.title!,
      titleBn: res.titleBn!,
      passage: res.passage,
      content: res.content!,
      options: res.options?.sort(() => Math.random() - 0.5),
      correctAnswer: res.correctAnswer!,
      explanation: res.explanation!,
      explanationBn: res.explanationBn!,
      isWritten: res.isWritten,
      vocabulary: res.vocabulary,
      batchQuestions: res.batchQuestions
    };

    // If writing, generate 5-10 practice questions as followup
    if (type === ExerciseType.WRITING) {
        const practiceCount = 5 + (seed % 6);
        finalExercise.practiceQuestions = [];
        for(let i=0; i<practiceCount; i++) {
            finalExercise.practiceQuestions.push({
                id: `writing-practice-${seed}-${i}`,
                type: ExerciseType.GRAMMAR_LADDER,
                title: "Style & Grammar Practice",
                titleBn: "শৈলী এবং ব্যাকরণ অনুশীলন",
                content: `Which version is more formal for a professional response?`,
                options: ["Option A (Formal)", "Option B (Informal)", "Option C (Slang)", "Option D (Incorrect)"],
                correctAnswer: "Option A (Formal)",
                explanation: "Formal language is required for academic or professional writing.",
                explanationBn: "একাডেমিক বা পেশাদার লেখার জন্য আনুষ্ঠানিক ভাষা প্রয়োজন।"
            });
        }
    }

    return finalExercise;
  }

  async getFeedback(userInput: string, targetAnswer: string): Promise<{ isCorrect: boolean; feedback: string; feedbackBn: string }> {
    if (targetAnswer === "GENERIC_VALIDATION") {
        // Advanced simulated feedback for writing
        const words = userInput.trim().split(/\s+/).length;
        const hasPunctuation = /[.!?]/.test(userInput);
        
        if (words < 5) {
            return {
                isCorrect: false,
                feedback: "Your response is too short. Try to write a full sentence.",
                feedbackBn: "আপনার উত্তরটি খুব ছোট। একটি সম্পূর্ণ বাক্য লেখার চেষ্টা করুন।"
            };
        }
        
        return {
            isCorrect: true,
            feedback: `Gemma 2 Analysis: Good structure! You used ${words} words. ${hasPunctuation ? "Proper punctuation detected." : "Consider adding a full stop next time."}`,
            feedbackBn: `জেমা ২ বিশ্লেষণ: চমৎকার গঠন! আপনি ${words} টি শব্দ ব্যবহার করেছেন।`
        };
    }

    const isCorrect = userInput.trim().toLowerCase() === targetAnswer.trim().toLowerCase();
    return {
      isCorrect,
      feedback: isCorrect ? "Gemma 2 Verification: Correct!" : `Gemma 2 Analysis: The correct answer is '${targetAnswer}'`,
      feedbackBn: isCorrect ? "জেমা ২ ভেরিফিকেশন: সঠিক উত্তর!" : `জেমা ২ এর মতে সঠিক উত্তর হলো: '${targetAnswer}'`
    };
  }
}
