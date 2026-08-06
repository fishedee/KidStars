import { ENGLISH_LEVELS } from './levels';
import type { EnglishGradeData } from './types';

export const GRADE_FOUR_ENGLISH: EnglishGradeData = {
  upper: { unitTitles:['My Classroom','My Friends','My Family','Shopping Day'], words: ENGLISH_LEVELS[3].words },
  lower: { unitTitles:['School Subjects','Daily Habits','Around Town','Healthy Life'], words: [['subject','学科','📘'],['music','音乐','🎵'],['science','科学','🔬'],['Monday','星期一','1️⃣'],['usually','通常','🕒'],['sometimes','有时','⏳'],['cinema','电影院','🎬'],['museum','博物馆','🏛️'],['healthy','健康的','💚'],['vegetable','蔬菜','🥬'],['holiday','假期','🏖️'],['travel','旅行','🧳']].map(([en,cn,emoji]) => ({en,cn,emoji})) },
};
