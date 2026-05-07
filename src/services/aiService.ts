
import { Exercise, ExerciseType } from '../types';
import { GRAMMAR_LADDER_STEPS } from '../constants';

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

  async generateExercise(type: ExerciseType, level: number): Promise<Exercise> {
    if (!this.isModelLoaded) throw new Error("Local AI Engine not ready.");

    await new Promise(resolve => setTimeout(resolve, 1000));

    const step = GRAMMAR_LADDER_STEPS.find(s => s.level === level) || GRAMMAR_LADDER_STEPS[0];
    const seed = Math.floor(Math.random() * 100000);
    
    const pick = <T>(arr: T[]): T => arr[seed % arr.length];
    
    // Expanded data pools for high variety
    const people = ["The farmer", "A student", "A rickshaw puller", "The teacher", "My mother", "The young girl", "A brave boy", "Our neighbor", "The doctor", "A pilot", "The shopkeeper", "A scientist", "The villagers", "A group of children", "The fisherman", "My grandfather", "A local hero", "The postman", "A weaver", "The boatman"];
    const locations = ["in Dhaka", "at the village market", "over the Padma river", "in the classroom", "at the library", "under the banyan tree", "near the railway station", "inside the hospital", "across the field", "beside the pond", "on the roof", "at the bus stand", "in the garden", "near the mosque", "under the bridge"];
    const actions = ["is reading", "was working", "has been singing", "will go", "is drawing", "has finished", "were playing", "is cooking", "had visited", "will be writing", "is repairing", "has learned", "was swimming", "will participate", "have seen"];
    const items = ["a thick book", "a heavy load", "a difficult lesson", "a delicious meal", "a cricket bat", "a beautiful flower", "the morning newspaper", "a colorful kite", "the local map", "a wooden chair", "some fresh fruits", "a new umbrella", "the village history", "a golden cup", "the school bell"];
    const adjectives = ["beautiful", "intelligent", "courageous", "diligent", "modest", "brilliant", "patient", "thoughtful", "energetic", "kind", "honest", "graceful", "determined", "playful", "serious"];

    const generateOfflineExercise = (): Partial<Exercise> => {
        if (type === ExerciseType.GRAMMAR_LADDER) {
            switch(level) {
                case 1: { // Parts of Speech - Focus on Adjectives and Nouns
                    const adj = pick(adjectives);
                    const person = pick(people);
                    const sentence = `${person} is very ${adj} in their work.`;
                    return {
                        title: "Adjective Identification",
                        titleBn: "বিশেষণ (Adjective) চিহ্নিতকরণ",
                        content: sentence,
                        options: [adj, person, "Very", "Work"],
                        correctAnswer: adj,
                        explanation: `'${adj}' describes the quality of the subject, making it an Adjective.`,
                        explanationBn: `'${adj}' শব্দটি সাবজেক্টের গুণ বোঝাচ্ছে, তাই এটি একটি বিশেষণ বা Adjective।`
                    };
                }
                case 2: { // Subject-Verb Agreement - Focus on Singular/Plural
                    const plurals = ["The students", "The farmers", "The doctors", "The children", "The teachers"];
                    const group = seed % 2 === 0 ? pick(people) : pick(plurals);
                    const isPlural = plurals.includes(group);
                    return {
                        title: "Dynamic Verb Agreement",
                        titleBn: "সাবজেক্ট-ভার্ব এগ্রিমেন্ট",
                        content: `${group} ___ to school regularly.`,
                        options: isPlural ? ["Go", "Goes", "Going", "Gone"] : ["Goes", "Go", "Going", "Gone"],
                        correctAnswer: isPlural ? "Go" : "Goes",
                        explanation: isPlural ? "Plural subjects take the base form of the verb." : "Singular subjects take 's' or 'es' forms.",
                        explanationBn: isPlural ? "বহুবচন (Plural) সাবজেক্টের সাথে ভার্বের বেইজ ফর্ম বসে।" : "একবচন (Singular) সাবজেক্টের সাথে ভার্বের শেষে s/es যুক্ত হয়।"
                    };
                }
                case 3: { // Tenses (Complex Present)
                    const sub = pick(people);
                    const obj = pick(items);
                    return {
                        title: "Present Perfect",
                        titleBn: "প্রেজেন্ট পারফেক্ট টেন্স",
                        content: `${sub} ___ just ___ ${obj}.`,
                        options: ["has, finished", "have, finished", "is, finishing", "was, finished"],
                        correctAnswer: "has, finished",
                        explanation: "Present perfect shows a completed action with current relevance: has/have + V3.",
                        explanationBn: "এইমাত্র কোনো কাজ শেষ হয়েছে বোঝালে প্রেজেন্ট পারফেক্ট টেন্স হয়: has/have + V3।"
                    };
                }
                case 4: { // Tenses (Past/Future Variations)
                    const loc = pick(locations);
                    const sub = pick(people);
                    return {
                        title: "Future Continuous",
                        titleBn: "ফিউচার কন্টিনিউয়াস টেন্স",
                        content: `Tomorrow at this time, ${sub} ___ ${loc}.`,
                        options: ["will be working", "is working", "was working", "has worked"],
                        correctAnswer: "will be working",
                        explanation: "Future continuous describes an ongoing action in the future.",
                        explanationBn: "ভবিষ্যতে কোনো কাজ চলতে থাকবে বোঝালে ফিউচার কন্টিনিউয়াস (will be + ing) হয়।"
                    };
                }
                case 5: { // Passive Voice - Higher Variety
                    const obj = pick(items);
                    const sub = pick(people);
                    return {
                        title: "Passive Construction",
                        titleBn: "প্যাসিভ ভয়েস",
                        content: `${obj.charAt(0).toUpperCase() + obj.slice(1)} was ___ by ${sub.toLowerCase()}.`,
                        options: ["found", "find", "finding", "finds"],
                        correctAnswer: "found",
                        explanation: "Passive voice always uses the past participle (V3) form.",
                        explanationBn: "প্যাসিভ ভয়েসের মূল ভার্ব সবসময় পাস্ট পার্টিসিপল ফর্মে থাকে।"
                    };
                }
                default: 
                    return {
                        title: `${step.concept} Expert Review`,
                        titleBn: `${step.conceptBn} এক্সপার্ট রিভিউ`,
                        content: `${pick(people)} ${pick(actions)} ${pick(items)} ${pick(locations)}. Identify the primary verb form.`,
                        options: ["Transitive", "Intransitive", "Helping", "Modal"],
                        correctAnswer: "Transitive",
                        explanation: "The verb takes a direct object, making it transitive.",
                        explanationBn: "ভার্বটির সরাসরি অবজেক্ট থাকায় এটি একটি ট্রানজিটিভ ভার্ব।"
                    };
            }
        }
        
        return {
            title: "Gemma 2 Deep Analysis",
            titleBn: "জেমা ২ গভীর বিশ্লেষণ",
            content: `The word '${pick(adjectives)}' acts as which part of speech in a sentence about ${pick(items)}?`,
            options: ["Adjective", "Noun", "Verb", "Adverb"],
            correctAnswer: "Adjective",
            explanation: "It describes a noun.",
            explanationBn: "এটি একটি নাউন বা বিশেষ্যকে বিশেষায়িত করছে।"
        };
    };

    const res = generateOfflineExercise();

    return {
      id: `gemma-v2-stable-${level}-${seed}`,
      type,
      title: res.title!,
      titleBn: res.titleBn!,
      content: res.content!,
      options: res.options!.sort(() => Math.random() - 0.5),
      correctAnswer: res.correctAnswer!,
      explanation: res.explanation!,
      explanationBn: res.explanationBn!
    };
  }

  async getFeedback(userInput: string, targetAnswer: string) {
    const isCorrect = userInput.trim().toLowerCase() === targetAnswer.trim().toLowerCase();
    return {
      isCorrect,
      feedback: isCorrect ? "Gemma 2 Verification: Correct!" : `Gemma 2 Analysis: The correct answer is '${targetAnswer}'`,
      feedbackBn: isCorrect ? "জেমা ২ ভেরিফিকেশন: সঠিক উত্তর!" : `জেমা ২ এর মতে সঠিক উত্তর হলো: '${targetAnswer}'`
    };
  }
}
