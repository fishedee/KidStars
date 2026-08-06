import { describe, expect, it } from 'vitest';
import { GRADES, TERMS, getChineseLessons, getChinesePoems, getEnglishCourses, getMathUnits } from './curriculum';

describe('grade curriculum', () => {
  it('provides both terms for all six grades and three subjects', () => {
    GRADES.forEach((grade) => TERMS.forEach((term) => {
      expect(getChineseLessons(grade,term).length).toBeGreaterThanOrEqual(8);
      expect(getChinesePoems(grade,term).length).toBeGreaterThan(0);
      expect(getMathUnits(grade,term)).toHaveLength(8);
      expect(getEnglishCourses(grade,term).length).toBeGreaterThanOrEqual(4);
    }));
  });

  it('uses unique stable ids across grades and terms', () => {
    const ids = GRADES.flatMap((grade) => TERMS.flatMap((term) => [
      ...getChineseLessons(grade,term).map((item) => item.id),
      ...getChinesePoems(grade,term).map((item) => item.id),
      ...getMathUnits(grade,term).map((item) => item.id),
      ...getEnglishCourses(grade,term).flatMap((course) => Object.values(course.items).flat().map((item) => item.id)),
    ]));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
