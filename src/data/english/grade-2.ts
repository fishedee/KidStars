import { ENGLISH_LEVELS } from './levels';
import type { EnglishGradeData } from './types';

export const GRADE_TWO_ENGLISH: EnglishGradeData = {
  upper: { unitTitles:['My Day','At School','My Home','Fun Animals'], words: ENGLISH_LEVELS[1].words },
  lower: { unitTitles:['Four Seasons','My Clothes','Ways to Travel','Sports Time'], words: [['spring','春天','🌱'],['summer','夏天','☀️'],['autumn','秋天','🍂'],['winter','冬天','❄️'],['shirt','衬衫','👕'],['dress','连衣裙','👗'],['train','火车','🚆'],['plane','飞机','✈️'],['breakfast','早餐','🥣'],['lunch','午餐','🍱'],['dance','跳舞','💃'],['swim','游泳','🏊']].map(([en,cn,emoji]) => ({en,cn,emoji})) },
};
