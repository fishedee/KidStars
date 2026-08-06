import { ENGLISH_LEVELS } from './levels';
import type { EnglishGradeData } from './types';

export const GRADE_ONE_ENGLISH: EnglishGradeData = {
  upper: { unitTitles:['Hello!','Colors','Numbers','Animal Friends'], words: ENGLISH_LEVELS[0].words },
  lower: { unitTitles:['My Family','My Body','Food Time','Happy School'], words: [['mother','妈妈','👩'],['father','爸爸','👨'],['sister','姐姐','👧'],['brother','哥哥','👦'],['head','头','😀'],['hand','手','✋'],['rice','米饭','🍚'],['milk','牛奶','🥛'],['book','书','📖'],['pencil','铅笔','✏️'],['happy','开心','😊'],['friend','朋友','🤝']].map(([en,cn,emoji]) => ({en,cn,emoji})) },
};
