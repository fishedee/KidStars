import type { GradeId, Poem, TermId, VocabLesson } from '../../types';

export type ChineseWord = [character: string, pinyin: string];

export interface ChineseLessonSeed {
  unit: number;
  title: string;
  words: ChineseWord[];
}

export type ChinesePoemSeed = Omit<Poem, 'id' | 'grade' | 'term'>;

export interface ChineseTermData {
  unitTitles: string[];
  wordPool: ChineseWord[];
  poems: ChinesePoemSeed[];
  lessons?: ChineseLessonSeed[];
}

export type ChineseGradeData = Record<TermId, ChineseTermData>;
export type ChineseCurriculum = Record<GradeId, ChineseGradeData>;
