import { ENGLISH_LEVELS } from './levels';
import type { EnglishGradeData } from './types';

export const GRADE_FIVE_ENGLISH: EnglishGradeData = {
  upper: { unitTitles:['Teachers and Friends','My Week','Food and Drink','Nature Park'], words: ENGLISH_LEVELS[4].words },
  lower: { unitTitles:['Good Character','Weekend Plans','My Village','Wonderful Nature'], words: [['clever','聪明的','💡'],['polite','有礼貌的','🙋'],['weekend','周末','📅'],['exercise','锻炼','🏃'],['village','村庄','🏘️'],['bridge','桥','🌉'],['bottle','瓶子','🧴'],['delicious','美味的','😋'],['forest','森林','🌲'],['mountain','高山','⛰️'],['email','电子邮件','📧'],['schedule','日程','🗓️']].map(([en,cn,emoji]) => ({en,cn,emoji})) },
};
