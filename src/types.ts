export type PageId =
  | 'home'
  | 'math'
  | 'chinese'
  | 'english'
  | 'reading'
  | 'exercise'
  | 'health'
  | 'pet'
  | 'rewards';

export type MathMode = 'addsub' | 'muldiv' | 'mixed';
export type ThinkMode = 'pattern' | 'logic' | 'word' | 'puzzle';
export type DollCategory = 'hair' | 'top' | 'bottom' | 'shoes' | 'acc' | 'makeup';

export interface QuizProgress<M extends string> {
  score: number;
  total: number;
  completed: boolean;
  mode: M;
}

export interface CustomVocab {
  id: string;
  char: string;
  pinyin: string;
  done: boolean;
}

export interface DailyProgress {
  date: string;
  math: QuizProgress<MathMode>;
  think: QuizProgress<ThinkMode>;
  chinese: {
    currentLesson: number;
    vocabDone: Record<string, boolean>;
    poemsDone: Record<string, boolean>;
    customVocab: CustomVocab[];
    taskReview: boolean;
    taskPreview: boolean;
  };
  english: {
    learnDone: boolean;
    gameDone: boolean;
    gameScore: number;
    gameLevel: number;
    todayWords: number[];
    reading: boolean;
    book: string;
  };
  reading: {
    minutes: number;
    bookId: string | null;
    pages: number;
    done: boolean;
  };
  exercise: Array<{ id: string; name: string; done: boolean; minutes: number }>;
  health: {
    foot: { done: boolean; minutes: number };
    massage: { done: boolean; minutes: number };
  };
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
}

export interface Profile {
  version: 2;
  coinBase: number;
  doll: {
    level: number;
    charm: number;
    ownedItems: Record<string, boolean>;
    equipped: Record<DollCategory, string | null>;
    cottage: Record<string, string>;
    garden: Record<string, string>;
  };
  rewards: Record<string, number>;
  weekCheckins: Record<string, boolean>;
  weekStart: string;
  lastActiveDate: string | null;
  wordGame: { unlocked: number; done: number[] };
  books: Book[];
}

export interface AppState {
  daily: DailyProgress;
  profile: Profile;
}

export interface VocabLesson {
  unit: number;
  title: string;
  words: Array<[string, string]>;
}

export interface Poem {
  title: string;
  author: string;
  content: string;
  note: string;
}

export interface EnglishWord {
  en: string;
  cn: string;
  emoji: string;
}

export interface ShopItem {
  id: string;
  category: DollCategory;
  name: string;
  description: string;
  cost: number;
  icon: string;
}
