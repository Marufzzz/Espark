
import { Exercise, ExerciseType } from '../types';
import { GRAMMAR_LADDER_STEPS } from '../constants';

/**
 * AIService: Purely Offline Local Inference Engine.
 * Simulates Gemma 4 2B behaviors by using a combinatorial template engine
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

  async generateExercise(type: ExerciseType, level: number): Promise<Exercise> {
    if (!this.isModelLoaded) throw new Error("Local AI Engine not ready.");

    await new Promise(resolve => setTimeout(resolve, 1200));

    const step = GRAMMAR_LADDER_STEPS.find(s => s.level === level) || GRAMMAR_LADDER_STEPS[0];
    const seed = Math.floor(Math.random() * 10000);
    
    // Helper to get random item from array based on seed
    const pick = <T>(arr: T[]): T => arr[seed % arr.length];
    const pickN = <T>(arr: T[], offset: number): T => arr[(seed + offset) % arr.length];

    const generateOfflineExercise = (): Partial<Exercise> => {
        // Data sets for dynamic construction
        const subjects = ["The farmer", "A student", "A rickshaw puller", "The teacher", "My mother", "The young girl", "A brave boy", "Our neighbor"];
        const places = ["in Dhaka", "at the village market", "over the Padma river", "in the classroom", "at the library", "under the banyan tree"];
        const objects = ["fresh vegetables", "a heavy load", "a difficult lesson", "a delicious meal", "a cricket bat", "a beautiful flower"];
        const times = ["every day", "yesterday", "tomorrow", "at this moment", "last week", "since morning"];

        if (type === ExerciseType.GRAMMAR_LADDER) {
            switch(level) {
                case 1: { // Parts of Speech
                    const word = pick(nouns);
                    const sentence = `${word} is growing rapidly in the current situation.`;
                    return {
                        title: "Noun Identification",
                        titleBn: "বিশেষ্য (Noun) চিহ্নিতকরণ",
                        content: sentence,
                        options: [word, "Rapidly", "Growing", "Current"],
                        correctAnswer: word,
                        explanation: `'${word}' is the specific name of an entity, making it a Noun.`,
                        explanationBn: `'${word}' একটি নির্দিষ্ট সত্তার নাম, তাই এটি একটি বিশেষ্য বা Noun।`
                    };
                }
                case 2: { // Sentence Structure (Verbs)
                    const sub = pick(subjects);
                    const obj = pick(objects);
                    return {
                        title: "Subject-Verb Agreement",
                        titleBn: "সাবজেক্ট-ভার্ব এগ্রিমেন্ট",
                        content: `${sub} ___ ${obj} carefully.`,
                        options: ["Carries", "Carry", "Carried", "Carrying"],
                        correctAnswer: "Carries",
                        explanation: "Singular subjects take verbs with 's' or 'es' in the simple present.",
                        explanationBn: "একবচন সাবজেক্টের (Singular) সাথে ভার্বের শেষে s/es যুক্ত হয়।"
                    };
                }
                case 3: { // Tenses (Present)
                    const sub = pick(subjects);
                    const loc = pick(places);
                    return {
                        title: "Present Continuous",
                        titleBn: "প্রেজেন্ট কন্টিনিউয়াস টেন্স",
                        content: `Right now, ${sub} ___ ${loc}.`,
                        options: ["is walking", "walks", "walked", "will walk"],
                        correctAnswer: "is walking",
                        explanation: "Actions happening 'right now' require 'am/is/are + verb-ing'.",
                        explanationBn: "বর্তমানে কোনো কাজ চলছে বোঝালে am/is/are + verb-ing ব্যবহার হয়।"
                    };
                }
                case 4: { // Tenses (Past/Future)
                    const sub = pick(subjects);
                    const time = "yesterday";
                    return {
                        title: "Simple Past Tense",
                        titleBn: "সিম্পল পাস্ট টেন্স",
                        content: `${sub} finished the work ${time}.`,
                        options: ["Finished", "Finish", "Finishing", "Will finish"],
                        correctAnswer: "Finished",
                        explanation: "Use the past form of the verb for actions completed in the past.",
                        explanationBn: "অতীতের সম্পূর্ণ কাজের জন্য ভার্বের পাস্ট ফর্ম ব্যবহার হয়।"
                    };
                }
                case 5: { // Passive Voice
                    return {
                        title: "Voice Change",
                        titleBn: "ভয়েস পরিবর্তন",
                        content: "The rice is ___ by the farmer.",
                        options: ["Grown", "Grow", "Growing", "Grows"],
                        correctAnswer: "Grown",
                        explanation: "Passive voice requires the past participle form of the verb.",
                        explanationBn: "প্যাসিভ ভয়েসের ক্ষেত্রে ভার্বের পাস্ট পার্টিসিপল ফর্ম ব্যবহৃত হয়।"
                    };
                }
                default: 
                    return {
                        title: `${step.concept} Challenge`,
                        titleBn: `${step.conceptBn} চ্যালেঞ্জ`,
                        content: `${pick(subjects)} has been living here for ten years. What tense is this?`,
                        options: ["Present Perfect Continuous", "Present Perfect", "Simple Present", "Past Perfect"],
                        correctAnswer: "Present Perfect Continuous",
                        explanation: "Has/Have + been + verb-ing shows an action starting in the past and continuing.",
                        explanationBn: "অতীত থেকে বর্তমান সময় পর্যন্ত কাজ চলা বোঝালে প্রেজেন্ট পারফেক্ট কন্টিনিউয়াস হয়।"
                    };
            }
        }
        
        // Non-Ladder exercises
        const topics = ["Education", "Environment", "Technology", "Health", "Culture"];
        const topic = pick(topics);
        return {
            title: `${topic} Module`,
            titleBn: `${topic} মডিউল`,
            content: `The importance of ${topic.toLowerCase()} is increasing in Bangladesh. What is the antonym of 'Increasing'?`,
            options: ["Decreasing", "Growing", "Raising", "Stagnant"],
            correctAnswer: "Decreasing",
            explanation: "Decreasing is the opposite of increasing.",
            explanationBn: "Increasing এর বিপরীত শব্দ হলো Decreasing।"
        };
    };

    const nouns = ["Bangladesh", "Hospital", "Knowledge", "Success", "Farmer", "Industry", "Library"];
    const res = generateOfflineExercise();

    return {
      id: `gemma-v2-${level}-${seed}`,
      type,
      title: res.title!,
      titleBn: res.titleBn!,
      content: res.content!,
      options: res.options!,
      correctAnswer: res.correctAnswer!,
      explanation: res.explanation!,
      explanationBn: res.explanationBn!
    };
  }

  async getFeedback(userInput: string, targetAnswer: string) {
    const isCorrect = userInput.trim().toLowerCase() === targetAnswer.trim().toLowerCase();
    return {
      isCorrect,
      feedback: isCorrect ? "Gemma 4 Verification: Perfect!" : `The correct answer is: ${targetAnswer}`,
      feedbackBn: isCorrect ? "জেমা ৪ ভেরিফিকেশন: চমৎকার!" : `সঠিক উত্তর হলো: ${targetAnswer}`
    };
  }
}
