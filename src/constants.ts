
import { GrammarTopic } from './types';

export const APP_NAME = "GrammarGlow";
export const APP_NAME_BN = "গ্রামারগ্লো";

export const GRAMMAR_CURRICULUM: GrammarTopic[] = [
  {
    id: "building_blocks",
    title: "1. The Building Blocks",
    titleBn: "১. মৌলিক উপাদানসমূহ (Parts of Speech)",
    subTopics: [
      { id: "nouns", topicId: "building_blocks", title: "Nouns", titleBn: "নাউন (বিশেষ্য)", questionCount: 30 },
      { id: "pronouns", topicId: "building_blocks", title: "Pronouns", titleBn: "প্রোনাউন (সর্বনাম)", questionCount: 30 },
      { id: "verbs", topicId: "building_blocks", title: "Verbs", titleBn: "ভার্ব (ক্রিয়া)", questionCount: 30 },
      { id: "adjectives", topicId: "building_blocks", title: "Adjectives", titleBn: "অ্যাডজেক্টিভ (বিশেষণ)", questionCount: 30 },
      { id: "adverbs", topicId: "building_blocks", title: "Adverbs", titleBn: "অ্যাডভার্ব (ক্রিয়া বিশেষণ)", questionCount: 30 },
      { id: "pos_final", topicId: "building_blocks", title: "Building Blocks Mastery", titleBn: "মাস্টারি টেস্ট", questionCount: 50, isFinal: true },
    ]
  },
  {
    id: "architecture",
    title: "2. Sentence Architecture",
    titleBn: "২. বাক্য গঠন ও কৌশল",
    subTopics: [
      { id: "svo_structure", topicId: "architecture", title: "Sentence Structure (SVO)", titleBn: "বাক্য গঠন রীতি", questionCount: 30 },
      { id: "articles", topicId: "architecture", title: "Articles (A, An, The)", titleBn: "আর্টিকেল", questionCount: 30 },
      { id: "prepositions", topicId: "architecture", title: "Prepositions", titleBn: "প্রিপজিশন", questionCount: 30 },
      { id: "conjunctions", topicId: "architecture", title: "Conjunctions", titleBn: "কনজাংশন", questionCount: 30 },
      { id: "sentence_types", topicId: "architecture", title: "Sentence Types", titleBn: "বাক্যের প্রকারভেদ", questionCount: 30 },
      { id: "arch_final", topicId: "architecture", title: "Architecture Mastery", titleBn: "মাস্টারি টেস্ট", questionCount: 50, isFinal: true },
    ]
  },
  {
    id: "tenses",
    title: "3. The Concept of Time",
    titleBn: "৩. সময়ের ধারণা (Tenses)",
    subTopics: [
      { id: "simple_tenses", topicId: "tenses", title: "Simple Tenses", titleBn: "সিম্পল টেন্স", questionCount: 30 },
      { id: "continuous_tenses", topicId: "tenses", title: "Continuous Tenses", titleBn: "কন্টিনিউয়াস টেন্স", questionCount: 30 },
      { id: "perfect_tenses", topicId: "tenses", title: "Perfect Tenses", titleBn: "পারফেক্ট টেন্স", questionCount: 30 },
      { id: "tense_final", topicId: "tenses", title: "Tense Mastery", titleBn: "মাস্টারি টেস্ট", questionCount: 50, isFinal: true },
    ]
  },
  {
    id: "advanced",
    title: "4. Advanced Functions",
    titleBn: "৪. উন্নত ব্যাকরণ ও সূক্ষ্মতা",
    subTopics: [
      { id: "modal_verbs", topicId: "advanced", title: "Modal Verbs", titleBn: "মোডাল ভার্ব", questionCount: 30 },
      { id: "voice", topicId: "advanced", title: "Voice (Active/Passive)", titleBn: "ভয়েস পরিবর্তন", questionCount: 30 },
      { id: "conditionals", topicId: "advanced", title: "Conditionals", titleBn: "কন্ডিশনাল", questionCount: 30 },
      { id: "advanced_final", topicId: "advanced", title: "Advanced Mastery", titleBn: "মাস্টারি টেস্ট", questionCount: 50, isFinal: true },
    ]
  }
];

export const COLORS = {
  primary: "#14532d", 
  secondary: "#f97316",
  bg: "#f8fafc",
  card: "#ffffff",
  text: "#0f172a",
  border: "#e2e8f0"
};
