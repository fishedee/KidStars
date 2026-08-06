import type { CurriculumUnit, GradeId, TermId } from '../../types';
import { GRADE_ONE_MATH } from './grade-1';
import { GRADE_TWO_MATH } from './grade-2';
import { GRADE_THREE_MATH } from './grade-3';
import { GRADE_FOUR_MATH } from './grade-4';
import { GRADE_FIVE_MATH } from './grade-5';
import { GRADE_SIX_MATH } from './grade-6';
import type { MathGradeData } from './types';

export const MATH_CURRICULUM: Record<GradeId, MathGradeData> = {
  1: GRADE_ONE_MATH,
  2: GRADE_TWO_MATH,
  3: GRADE_THREE_MATH,
  4: GRADE_FOUR_MATH,
  5: GRADE_FIVE_MATH,
  6: GRADE_SIX_MATH,
};

export const getMathUnits = (grade: GradeId, term: TermId): CurriculumUnit[] =>
  MATH_CURRICULUM[grade][term].map((title, index) => ({
    id: `g${grade}-${term}-math-${index + 1}`,
    grade,
    term,
    unit: index + 1,
    title,
    topics: title.split('与'),
  }));

export const getMathTopics = (grade: GradeId, term: TermId) => MATH_CURRICULUM[grade][term];
