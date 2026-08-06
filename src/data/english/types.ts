import type { EnglishCourse, EnglishWord, TermId } from '../../types';

export interface EnglishTermData {
  unitTitles: string[];
  words: EnglishWord[];
  courses?: Array<Omit<EnglishCourse, 'grade' | 'term'>>;
}

export type EnglishGradeData = Record<TermId, EnglishTermData>;
