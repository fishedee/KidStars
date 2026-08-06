import type { GradeId, Poem, TermId, VocabLesson } from '../../types';
import { GRADE_ONE_CHINESE } from './grade-1';
import { GRADE_TWO_CHINESE } from './grade-2';
import { GRADE_THREE_CHINESE, GRADE_THREE_UPPER_POEMS } from './grade-3';
import { GRADE_FOUR_CHINESE } from './grade-4';
import { GRADE_FIVE_CHINESE } from './grade-5';
import { GRADE_SIX_CHINESE } from './grade-6';
import type { ChineseCurriculum, ChineseLessonSeed, ChinesePoemSeed } from './types';

export const CHINESE_CURRICULUM: ChineseCurriculum = {
  1: GRADE_ONE_CHINESE,
  2: GRADE_TWO_CHINESE,
  3: GRADE_THREE_CHINESE,
  4: GRADE_FOUR_CHINESE,
  5: GRADE_FIVE_CHINESE,
  6: GRADE_SIX_CHINESE,
};

const withLessonMetadata = (grade: GradeId, term: TermId, lessons: ChineseLessonSeed[]): VocabLesson[] =>
  lessons.map((lesson, index) => ({
    ...lesson,
    id: `g${grade}-${term}-chinese-${index + 1}`,
    grade,
    term,
  }));

const withPoemMetadata = (grade: GradeId, term: TermId, poems: ChinesePoemSeed[]): Poem[] =>
  poems.map((poem, index) => ({
    ...poem,
    id: `g${grade}-${term}-poem-${index + 1}`,
    grade,
    term,
  }));

export const TEXTBOOK_VOCAB = withLessonMetadata(3, 'upper', GRADE_THREE_CHINESE.upper.lessons ?? []);
export const POEMS = withPoemMetadata(3, 'upper', GRADE_THREE_UPPER_POEMS);

export const getChineseLessons = (grade: GradeId, term: TermId): VocabLesson[] => {
  if (grade === 3 && term === 'upper') return TEXTBOOK_VOCAB;
  const data = CHINESE_CURRICULUM[grade][term];
  return data.unitTitles.map((title, index) => ({
    id: `g${grade}-${term}-chinese-${index + 1}`,
    grade,
    term,
    unit: index + 1,
    title: `${index + 1}. ${title}`,
    words: data.wordPool.slice(index * 2, index * 2 + 2),
  }));
};

export const getChinesePoems = (grade: GradeId, term: TermId): Poem[] => {
  if (grade === 3 && term === 'upper') return POEMS.slice(0, 3);
  return withPoemMetadata(grade, term, CHINESE_CURRICULUM[grade][term].poems);
};

export const getChineseUnitTitles = (grade: GradeId, term: TermId) => CHINESE_CURRICULUM[grade][term].unitTitles;
