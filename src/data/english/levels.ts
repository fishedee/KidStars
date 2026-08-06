import type { EnglishWord } from '../../types';

export const ENGLISH_LEVELS: Array<{ level: number; words: EnglishWord[] }> = [
  { level: 1, words: [['cat','猫','🐱'],['dog','狗','🐶'],['bird','鸟','🐦'],['fish','鱼','🐟'],['bear','熊','🐻'],['duck','鸭子','🦆'],['pig','猪','🐷'],['rabbit','兔子','🐰'],['monkey','猴子','🐵'],['tiger','老虎','🐯'],['panda','熊猫','🐼'],['lion','狮子','🦁']].map(([en,cn,emoji]) => ({ en, cn, emoji })) },
  { level: 2, words: [['red','红色','🔴'],['blue','蓝色','🔵'],['green','绿色','🟢'],['yellow','黄色','🟡'],['white','白色','⚪'],['black','黑色','⚫'],['one','一','1️⃣'],['two','二','2️⃣'],['three','三','3️⃣'],['four','四','4️⃣'],['five','五','5️⃣'],['six','六','6️⃣']].map(([en,cn,emoji]) => ({ en, cn, emoji })) },
  { level: 3, words: [['head','头','😀'],['eye','眼睛','👁'],['ear','耳朵','👂'],['nose','鼻子','👃'],['mouth','嘴巴','👄'],['hand','手','✋'],['foot','脚','🦶'],['arm','手臂','💪'],['leg','腿','🦵'],['face','脸','😊'],['hair','头发','💇'],['teeth','牙齿','🦷']].map(([en,cn,emoji]) => ({ en, cn, emoji })) },
  { level: 4, words: [['cake','蛋糕','🎂'],['bread','面包','🍞'],['milk','牛奶','🥛'],['water','水','💧'],['egg','鸡蛋','🥚'],['rice','米饭','🍚'],['apple','苹果','🍎'],['banana','香蕉','🍌'],['juice','果汁','🧃'],['candy','糖果','🍬'],['noodle','面条','🍜'],['chicken','鸡肉','🍗']].map(([en,cn,emoji]) => ({ en, cn, emoji })) },
  { level: 5, words: [['book','书','📖'],['pen','钢笔','🖊'],['pencil','铅笔','✏'],['ruler','尺子','📏'],['bag','书包','🎒'],['desk','课桌','🪑'],['eraser','橡皮','🧹'],['paper','纸','📄'],['glue','胶水','🧴'],['teacher','老师','👩‍🏫'],['school','学校','🏫'],['friend','朋友','🤝']].map(([en,cn,emoji]) => ({ en, cn, emoji })) },
  { level: 6, words: [['mother','妈妈','👩'],['father','爸爸','👨'],['sister','姐妹','👧'],['brother','兄弟','👦'],['baby','宝宝','👶'],['family','家庭','🏠'],['big','大的','🐘'],['small','小的','🐭'],['happy','开心的','😊'],['sad','伤心的','😢'],['hot','热的','🔥'],['cold','冷的','❄️']].map(([en,cn,emoji]) => ({ en, cn, emoji })) },
];
