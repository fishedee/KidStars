export type PageId =
  | 'home'
  | 'challenge'
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
export type GradeId = 1 | 2 | 3 | 4 | 5 | 6;
export type TermId = 'upper' | 'lower';
export type DollCategory = 'hair' | 'top' | 'bottom' | 'shoes' | 'acc' | 'makeup';
export type EnglishContentKind = 'word' | 'phrase' | 'sentence' | 'pattern';

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

export interface GradeDailyProgress {
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
  challenge: {
    completed: boolean;
    score: number;
    total: number;
    bestCombo: number;
  };
}

export interface DailyProgress {
  date: string;
  gradeProgress: Partial<Record<GradeId, GradeDailyProgress>>;
  /** @deprecated Compatibility aliases for v2 integrations. */
  math: GradeDailyProgress['math'];
  think: GradeDailyProgress['think'];
  chinese: GradeDailyProgress['chinese'];
  english: GradeDailyProgress['english'];
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
  selectedGrade: GradeId;
  selectedTerm: TermId;
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
  wordGameByGrade: Partial<Record<GradeId, { unlocked: number; done: number[]; readItems: string[] }>>;
  /** @deprecated Compatibility alias for the migrated third-grade course. */
  wordGame: { unlocked: number; done: number[]; readItems: string[] };
  achievements: string[];
  streak: { current: number; best: number; lastDate: string | null };
  books: Book[];
}

export interface AppState {
  daily: DailyProgress;
  profile: Profile;
}

export interface VocabLesson {
  id: string;
  grade: GradeId;
  term: TermId;
  unit: number;
  title: string;
  words: Array<[string, string]>;
}

export interface Poem {
  id: string;
  grade: GradeId;
  term: TermId;
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

export interface EnglishCourseItem extends EnglishWord {
  id: string;
  spokenText?: string;
}

export interface EnglishCourse {
  grade: GradeId;
  term: TermId;
  level: number;
  title: string;
  englishTitle: string;
  emoji: string;
  items: Record<EnglishContentKind, EnglishCourseItem[]>;
}

export interface CurriculumUnit {
  id: string;
  grade: GradeId;
  term: TermId;
  unit: number;
  title: string;
  topics: string[];
}

export interface ShopItem {
  id: string;
  category: DollCategory;
  name: string;
  description: string;
  cost: number;
  icon: string;
}
