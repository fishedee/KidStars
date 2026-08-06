import { ENGLISH_LEVELS } from './levels';
import type { EnglishGradeData } from './types';

export const GRADE_SIX_ENGLISH: EnglishGradeData = {
  upper: { unitTitles:['How Do You Feel?','Ways to Go','Hobbies','Jobs'], words: ENGLISH_LEVELS[5].words },
  lower: { unitTitles:['Future Careers','World Culture','Green Planet','Dream Journey'], words: [['scientist','科学家','🧑‍🔬'],['pilot','飞行员','🧑‍✈️'],['future','未来','🚀'],['project','项目','📋'],['culture','文化','🏮'],['history','历史','🏛️'],['protect','保护','🛡️'],['environment','环境','🌍'],['volunteer','志愿者','🤲'],['journey','旅程','🧳'],['memory','回忆','📸'],['dream','梦想','✨']].map(([en,cn,emoji]) => ({en,cn,emoji})) },
};
