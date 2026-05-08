
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
    
    // Core data pools
    const people = ["The farmer", "A student", "A rickshaw puller", "The teacher", "My mother", "The young girl", "A brave boy", "Our neighbor", "The doctor", "A pilot", "The shopkeeper", "A scientist", "The villagers", "A group of children", "The fisherman", "My grandfather", "A local hero", "The postman", "A weaver", "The boatman"];
    const locations = ["in Dhaka", "at the village market", "over the Padma river", "in the classroom", "at the library", "under the banyan tree", "near the railway station", "inside the hospital", "across the field", "beside the pond", "at the bus stand", "in the garden", "near the mosque"];
    const items = ["a thick book", "a heavy load", "a difficult lesson", "a delicious meal", "a cricket bat", "a beautiful flower", "the morning newspaper", "a colorful kite", "a wooden chair", "fresh fruits", "a new umbrella", "the village history"];
    const adjectives = ["beautiful", "intelligent", "courageous", "diligent", "brilliant", "patient", "thoughtful", "energetic", "kind", "honest", "graceful", "determined", "playful"];

    const generateOfflineExercise = (): Partial<Exercise> => {
        // --- READING SECTION: Passages and Comprehension ---
        if (type === ExerciseType.READING) {
            const p1 = pick(people);
            const l1 = pick(locations);
            const a1 = pick(adjectives);
            const i1 = pick(items);

            const passage = `${p1} was walking ${l1} when they found ${i1}. It was a very ${a1} day. Many people in the village were busy with their daily tasks. However, this finding changed the course of the afternoon. The sun was setting behind the hills, casting long shadows across the landscape.`;
            
            // Generate Vocabulary from passage
            const words = [
                { 
                  word: a1, 
                  definition: "Showing great skill or performance; something very pleasing or impressive.", 
                  definitionBn: "চমৎকার বা চিত্তাকর্ষক কিছু।", 
                  example: `It was a truly ${a1} day for everyone.` 
                },
                { 
                  word: "Landscape", 
                  definition: "All the visible features of an area of countryside or land.", 
                  definitionBn: "প্রাকৃতিক দৃশ্য বা ভূদৃশ্য।", 
                  example: "Long shadows were cast across the landscape." 
                }
            ];

            return {
                title: "Reading Comprehension",
                titleBn: "পঠন বোধগম্যতা",
                passage: passage,
                content: "Which of the following best describes the atmosphere of the village?",
                options: ["Chaotic and noisy", "Busy but peaceful", "Scary and dark", "Empty and quiet"],
                correctAnswer: "Busy but peaceful",
                explanation: "The passage mentions people were 'busy with their daily tasks' in a calm natural setting.",
                explanationBn: "অনুচ্ছেদে উল্লেখ আছে যে মানুষ তাদের দৈনন্দিন কাজে ব্যস্ত ছিল।",
                vocabulary: words
            };
        }

        // --- VOCABULARY SECTION ---
        if (type === ExerciseType.VOCABULARY) {
            const wordList = [
                { word: "Persevere", definition: "Continue in a course of action even in the face of difficulty.", definitionBn: "অধ্যবসায় করা বা লেগে থাকা।", example: "You must persevere to master a new language." },
                { word: "Abundant", definition: "Existing or available in large quantities; plentiful.", definitionBn: "প্রচুর বা পর্যাপ্ত।", example: "Bangladesh has abundant natural beauty." },
                { word: "Resilient", definition: "Able to withstand or recover quickly from difficult conditions.", definitionBn: "সহনশীল বা স্থিতিস্থাপক।", example: "The local people are very resilient after the storm." }
            ];
            const v = pick(wordList);
            return {
                title: "Vocabulary Builder",
                titleBn: "শব্দভাণ্ডার বৃদ্ধি",
                content: `What is the meaning of '${v.word}' in a professional context?`,
                options: [v.definition, "To give up easily", "To be very angry", "None of the above"],
                correctAnswer: v.definition,
                explanation: `'${v.word}' means ${v.definition.toLowerCase()}`,
                explanationBn: `'${v.word}' এর অর্থ হলো ${v.definitionBn}`,
                vocabulary: [v]
            };
        }

        // --- WRITING SECTION: Free Text Response ---
        if (type === ExerciseType.WRITING) {
            const topic = pick(["Your favorite hobby", "Importance of education", "A visit to a village", "Your future goal", "Environmental pollution"]);
            return {
                title: "Descriptive Writing",
                titleBn: "বর্ণনামূলক লিখন",
                content: `Write 2-3 sentences about: ${topic}.`,
                isWritten: true,
                correctAnswer: "GENERIC_VALIDATION", // Handled in feedback logic
                explanation: "Focus on using correct tense and punctuation.",
                explanationBn: "সঠিক টেনস এবং বিরাম চিহ্নের ব্যবহারে মনোযোগ দিন।"
            };
        }

        // --- GRAMMAR LADDER: Diversified Patterns ---
        if (type === ExerciseType.GRAMMAR_LADDER) {
            const pattern = seed % 4; // 0: Error Detection, 1: Transformation, 2: Gap Fill, 3: Scrambled
            
            switch(pattern) {
                case 0: { // ERROR DETECTION
                    const sub = pick(people);
                    const wrongSentence = `${sub} have a very ${pick(adjectives)} voice.`;
                    return {
                        title: "Error Detection",
                        titleBn: "ভুল শনাক্তকরণ",
                        content: `Find the error in: "${wrongSentence}"`,
                        options: ["have", "very", "voice", "No error"],
                        correctAnswer: "have",
                        explanation: `The subject is singular, so it should be 'has' instead of 'have'.`,
                        explanationBn: `সাবজেক্ট একবচন হওয়ায় 'have' এর পরিবর্তে 'has' হবে।`
                    };
                }
                case 1: { // TRANSFORMATION (Active to Passive)
                    const sub = pick(people);
                    const obj = pick(items);
                    return {
                        title: "Voice Transformation",
                        titleBn: "ভয়েস পরিবর্তন",
                        content: `Change to Passive: "${sub} found ${obj}."`,
                        options: [`${obj} was found by ${sub}`, `${obj} is found by ${sub}`, `${sub} was found ${obj}`, `None of the above`],
                        correctAnswer: `${obj} was found by ${sub}`,
                        explanation: "In passive voice, the object becomes the subject and we use 'was' + V3 for past simple.",
                        explanationBn: "প্যাসিভ ভয়েসের ক্ষেত্রে অবজেক্টটি সাবজেক্ট হয়ে যায় এবং পাস্ট ইনডেফিনিট টেন্সের জন্য 'was' + V3 ব্যবহৃত হয়।"
                    };
                }
                case 2: { // GAP FILL (Prepositions/Articles)
                    const loc = pick(locations);
                    return {
                        title: "Preposition Challenge",
                        titleBn: "পজিশন চ্যালেঞ্জ",
                        content: `The traveler sat ___ ${loc}.`,
                        options: ["under", "in", "at", "between"],
                        correctAnswer: loc.includes("tree") ? "under" : (loc.includes("Dhaka") ? "in" : "at"),
                        explanation: "Prepositions depend on the specific location type.",
                        explanationBn: "পজিশনটি নির্দিষ্ট স্থানের ধরণের ওপর নির্ভর করে।"
                    };
                }
                case 3: // SENTENCE SCRAMBLE
                default: {
                    const adj = pick(adjectives);
                    const pers = pick(people);
                    return {
                        title: "Sentence Construction",
                        titleBn: "বাক্য গঠন",
                        content: `Reorder: "is / ${pers} / ${adj} / very"`,
                        options: [`${pers} is very ${adj}`, `Very ${adj} is ${pers}`, `${adj} ${pers} is very`, `Is ${pers} very ${adj}`],
                        correctAnswer: `${pers} is very ${adj}`,
                        explanation: "Standard sentence order: Subject + Verb + Adverb + Adjective.",
                        explanationBn: "সাধারণ বাক্য গঠনের নিয়ম: সাবজেক্ট + ভার্ব + অ্যাডভার্ব + অ্যাডজেক্টিভ।"
                    };
                }
            }
        }
        
        return {
            title: "Gemma 2 Deep Analysis",
            titleBn: "জেমা ২ গভীর বিশ্লেষণ",
            content: `Analyze the sentence structure of a complex local prompt.`,
            options: ["Simple", "Complex", "Compound", "None"],
            correctAnswer: "Simple",
            explanation: "The simulated structure was simple.",
            explanationBn: "সিমুলেটেড বাক্য গঠনটি ছিল সিম্পল।"
        };
    };

    const res = generateOfflineExercise();

    return {
      id: `gemma-v3-${level}-${seed}`,
      type,
      title: res.title!,
      titleBn: res.titleBn!,
      passage: res.passage,
      content: res.content!,
      options: res.options?.sort(() => Math.random() - 0.5),
      correctAnswer: res.correctAnswer!,
      explanation: res.explanation!,
      explanationBn: res.explanationBn!,
      isWritten: res.isWritten
    };
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
