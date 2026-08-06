import type { EnglishCourse, EnglishCourseItem, EnglishWord, GradeId, TermId } from '../../types';
import { GRADE_ONE_ENGLISH } from './grade-1';
import { GRADE_TWO_ENGLISH } from './grade-2';
import { GRADE_THREE_ENGLISH } from './grade-3';
import { GRADE_FOUR_ENGLISH } from './grade-4';
import { GRADE_FIVE_ENGLISH } from './grade-5';
import { GRADE_SIX_ENGLISH } from './grade-6';
import type { EnglishGradeData } from './types';

export { ENGLISH_LEVELS } from './levels';

export const ENGLISH_CURRICULUM: Record<GradeId, EnglishGradeData> = {
  1: GRADE_ONE_ENGLISH,
  2: GRADE_TWO_ENGLISH,
  3: GRADE_THREE_ENGLISH,
  4: GRADE_FOUR_ENGLISH,
  5: GRADE_FIVE_ENGLISH,
  6: GRADE_SIX_ENGLISH,
};

const makeEnglishItem = (id: string, word: EnglishWord): EnglishCourseItem => ({ ...word, id });

export const ENGLISH_COURSES: EnglishCourse[] = (GRADE_THREE_ENGLISH.upper.courses ?? []).map((course) => ({
  ...course,
  grade: 3,
  term: 'upper',
}));

export const getEnglishCourses = (grade: GradeId, term: TermId): EnglishCourse[] => {
  if (grade === 3 && term === 'upper') return ENGLISH_COURSES;
  const data = ENGLISH_CURRICULUM[grade][term];
  return data.unitTitles.map((title, index) => {
    const group = data.words.slice(index * 3, index * 3 + 3);
    const prefix = `g${grade}-${term}-english-${index + 1}`;
    const first = group[0];
    const second = group[1] ?? first;
    return {
      grade,
      term,
      level: index + 1,
      title,
      englishTitle: title,
      emoji: first.emoji,
      items: {
        word: group.map((word, itemIndex) => makeEnglishItem(`${prefix}-word-${itemIndex + 1}`, word)),
        phrase: [makeEnglishItem(`${prefix}-phrase-1`, { en:`my ${first.en}`, cn:`我的${first.cn}`, emoji:first.emoji })],
        sentence: [makeEnglishItem(`${prefix}-sentence-1`, { en:`I see ${second.en}.`, cn:`我看见${second.cn}。`, emoji:second.emoji })],
        pattern: [{ id:`${prefix}-pattern-1`, en:'I like ___.', cn:'我喜欢……', emoji:'🧩', spokenText:`I like ${first.en}.` }],
      },
    };
  });
};

export const getEnglishUnitTitles = (grade: GradeId, term: TermId) => ENGLISH_CURRICULUM[grade][term].unitTitles;
