import { getChineseLessons, getChinesePoems, getChineseUnitTitles } from './data/chinese';
import { getEnglishCourses, getEnglishUnitTitles } from './data/english';
import { getMathTopics, getMathUnits } from './data/math';
import type { GradeId, TermId } from './types';

export const GRADES: GradeId[] = [1, 2, 3, 4, 5, 6];
export const TERMS: TermId[] = ['upper', 'lower'];
export const gradeLabel = (grade: GradeId) => `${['一', '二', '三', '四', '五', '六'][grade - 1]}年级`;
export const termLabel = (term: TermId) => term === 'upper' ? '上册' : '下册';

export { getChineseLessons, getChinesePoems, getEnglishCourses, getMathUnits };

export const getCurriculumSummary = (grade: GradeId, term: TermId) => ({
  chinese: getChineseUnitTitles(grade, term),
  math: getMathTopics(grade, term),
  english: getEnglishUnitTitles(grade, term),
});
