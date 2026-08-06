import { ENGLISH_COURSES, ENGLISH_LEVELS, POEMS, TEXTBOOK_VOCAB } from './data';
import type { CurriculumUnit, EnglishCourse, EnglishCourseItem, EnglishWord, GradeId, Poem, TermId, VocabLesson } from './types';

export const GRADES: GradeId[] = [1, 2, 3, 4, 5, 6];
export const TERMS: TermId[] = ['upper', 'lower'];
export const gradeLabel = (grade: GradeId) => `${['一', '二', '三', '四', '五', '六'][grade - 1]}年级`;
export const termLabel = (term: TermId) => term === 'upper' ? '上册' : '下册';

const chineseUnitTitles: Record<GradeId, Record<TermId, string[]>> = {
  1: {
    upper: ['入学准备', '汉语拼音', '识字天地', '自然四季', '想象乐园', '家人与伙伴', '观察发现', '快乐成长'],
    lower: ['春夏秋冬', '心愿与伙伴', '快乐生活', '家乡风景', '习惯养成', '童话世界', '奇妙自然', '综合学习'],
  },
  2: {
    upper: ['美丽秋天', '儿童生活', '家乡风物', '思维方法', '观察自然', '伟大人物', '想象故事', '相处之道'],
    lower: ['春天脚步', '关爱他人', '传统文化', '童心世界', '自然奥秘', '克服困难', '品格成长', '世界真奇妙'],
  },
  3: {
    upper: ['学校生活', '金色秋天', '童话世界', '预测故事', '留心观察', '祖国山河', '自然声音', '美好品质'],
    lower: ['可爱生灵', '寓言启示', '中华文化', '观察发现', '大胆想象', '多彩童年', '奇妙世界', '有趣故事'],
  },
  4: {
    upper: ['自然之美', '连续观察', '现代诗歌', '神话故事', '把握内容', '家国情怀', '成长故事', '历史人物'],
    lower: ['乡村生活', '科普阅读', '现代诗歌', '动物朋友', '自然风光', '成长故事', '人物品质', '童话奇遇'],
  },
  5: {
    upper: ['万物有灵', '策略阅读', '民间故事', '爱国情怀', '说明方法', '父母之爱', '自然之趣', '读书明智'],
    lower: ['古典名著', '童年往事', '综合实践', '家国责任', '思维表达', '人物描写', '异域风光', '幽默智慧'],
  },
  6: {
    upper: ['触摸自然', '革命岁月', '阅读策略', '成长小说', '说明事理', '走近鲁迅', '艺术之美', '珍惜家园'],
    lower: ['民俗文化', '外国名著', '真情流露', '理想信念', '科学精神', '难忘小学', '古诗词诵读', '综合复习'],
  },
};

const chineseWordPools: Record<GradeId, Record<TermId, Array<[string, string]>>> = {
  1: {
    upper: [['天','tian'],['地','di'],['人','ren'],['你','ni'],['我','wo'],['他','ta'],['日','ri'],['月','yue'],['水','shui'],['火','huo'],['山','shan'],['石','shi'],['田','tian'],['禾','he'],['口','kou'],['耳','er']],
    lower: [['春','chun'],['风','feng'],['花','hua'],['雪','xue'],['飞','fei'],['入','ru'],['姓','xing'],['国','guo'],['青','qing'],['清','qing'],['晴','qing'],['情','qing'],['请','qing'],['生','sheng'],['气','qi'],['字','zi']],
  },
  2: {
    upper: [['塘','tang'],['脑','nao'],['袋','dai'],['灰','hui'],['迎','ying'],['阿','a'],['姨','yi'],['宽','kuan'],['顶','ding'],['鼓','gu'],['洋','yang'],['晒','shai'],['极','ji'],['傍','bang'],['越','yue'],['滴','di']],
    lower: [['冲','chong'],['寻','xun'],['姑','gu'],['娘','niang'],['吐','tu'],['柳','liu'],['桃','tao'],['杏','xing'],['鲜','xian'],['邮','you'],['递','di'],['原','yuan'],['叔','shu'],['局','ju'],['堆','dui'],['礼','li']],
  },
  3: {
    upper: TEXTBOOK_VOCAB.slice(0, 4).flatMap((lesson) => lesson.words).slice(0, 16),
    lower: [['鸳','yuan'],['鸯','yang'],['惠','hui'],['崇','chong'],['豚','tun'],['减','jian'],['伶','ling'],['俐','li'],['翼','yi'],['漾','yang'],['闲','xian'],['散','san'],['纤','xian'],['杆','gan'],['痕','hen'],['倦','juan']],
  },
  4: {
    upper: [['潮','chao'],['据','ju'],['堤','di'],['阔','kuo'],['盼','pan'],['滚','gun'],['顿','dun'],['逐','zhu'],['渐','jian'],['犹','you'],['崩','beng'],['震','zhen'],['霎','sha'],['余','yu'],['淘','tao'],['牵','qian']],
    lower: [['杂','za'],['稀','xi'],['篱','li'],['蜻','qing'],['蜓','ting'],['蝶','die'],['宿','su'],['徐','xu'],['疏','shu'],['茅','mao'],['檐','yan'],['翁','weng'],['赖','lai'],['剥','bo'],['构','gou'],['饰','shi']],
  },
  5: {
    upper: [['宜','yi'],['鹤','he'],['嫌','xian'],['朱','zhu'],['嵌','qian'],['框','kuang'],['匣','xia'],['哨','shao'],['恩','en'],['韵','yun'],['亩','mu'],['播','bo'],['浇','jiao'],['吩','fen'],['榨','zha'],['慕','mu']],
    lower: [['昼','zhou'],['耘','yun'],['桑','sang'],['晓','xiao'],['蝴','hu'],['蚂','ma'],['蚱','zha'],['嗡','weng'],['樱','ying'],['拔','ba'],['瞎','xia'],['铲','chan'],['割','ge'],['承','cheng'],['拴','shuan'],['瓢','piao']],
  },
  6: {
    upper: [['毯','tan'],['陈','chen'],['裳','shang'],['虹','hong'],['蹄','ti'],['腐','fu'],['稍','shao'],['微','wei'],['缀','zhui'],['幽','you'],['雅','ya'],['案','an'],['拙','zhuo'],['薄','bo'],['妩','wu'],['媚','mei']],
    lower: [['醋','cu'],['饺','jiao'],['拌','ban'],['擦','ca'],['眨','zha'],['宵','xiao'],['燃','ran'],['贩','fan'],['彼','bi'],['贺','he'],['轿','jiao'],['骆','luo'],['驼','tuo'],['恰','qia'],['腊','la'],['粥','zhou']],
  },
};

const poemSeeds: Record<GradeId, Record<TermId, Array<Omit<Poem, 'id' | 'grade' | 'term'>>>> = {
  1: {
    upper: [{ title:'咏鹅', author:'唐·骆宾王', content:'鹅，鹅，鹅，曲项向天歌。\n白毛浮绿水，红掌拨清波。', note:'观察白鹅在水中的姿态和颜色。' }],
    lower: [{ title:'静夜思', author:'唐·李白', content:'床前明月光，疑是地上霜。\n举头望明月，低头思故乡。', note:'月夜触发了诗人对故乡的思念。' }],
  },
  2: {
    upper: [{ title:'登鹳雀楼', author:'唐·王之涣', content:'白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。', note:'登高才能望得更远。' }],
    lower: [{ title:'村居', author:'清·高鼎', content:'草长莺飞二月天，拂堤杨柳醉春烟。\n儿童散学归来早，忙趁东风放纸鸢。', note:'描绘春日儿童放风筝的快乐。' }],
  },
  3: {
    upper: POEMS.slice(0, 3).map(({ title, author, content, note }) => ({ title, author, content, note })),
    lower: [{ title:'绝句', author:'唐·杜甫', content:'迟日江山丽，春风花草香。\n泥融飞燕子，沙暖睡鸳鸯。', note:'春日景物明丽又温暖。' }],
  },
  4: {
    upper: [{ title:'暮江吟', author:'唐·白居易', content:'一道残阳铺水中，半江瑟瑟半江红。\n可怜九月初三夜，露似真珠月似弓。', note:'描写秋日晚江的色彩和月夜。' }],
    lower: [{ title:'宿新市徐公店', author:'宋·杨万里', content:'篱落疏疏一径深，树头新绿未成阴。\n儿童急走追黄蝶，飞入菜花无处寻。', note:'儿童追蝶让乡村春景充满生机。' }],
  },
  5: {
    upper: [{ title:'示儿', author:'宋·陆游', content:'死去元知万事空，但悲不见九州同。\n王师北定中原日，家祭无忘告乃翁。', note:'表达诗人深厚的爱国情感。' }],
    lower: [{ title:'四时田园杂兴', author:'宋·范成大', content:'昼出耘田夜绩麻，村庄儿女各当家。\n童孙未解供耕织，也傍桑阴学种瓜。', note:'展现乡村劳动生活。' }],
  },
  6: {
    upper: [{ title:'六月二十七日望湖楼醉书', author:'宋·苏轼', content:'黑云翻墨未遮山，白雨跳珠乱入船。\n卷地风来忽吹散，望湖楼下水如天。', note:'写出夏日骤雨来去迅疾。' }],
    lower: [{ title:'十五夜望月', author:'唐·王建', content:'中庭地白树栖鸦，冷露无声湿桂花。\n今夜月明人尽望，不知秋思落谁家。', note:'借中秋月色寄托思念。' }],
  },
};

const buildChineseLessons = (grade: GradeId, term: TermId): VocabLesson[] => {
  if (grade === 3 && term === 'upper') return TEXTBOOK_VOCAB;
  const words = chineseWordPools[grade][term];
  return chineseUnitTitles[grade][term].map((title, index) => ({
    id: `g${grade}-${term}-chinese-${index + 1}`,
    grade,
    term,
    unit: index + 1,
    title: `${index + 1}. ${title}`,
    words: words.slice(index * 2, index * 2 + 2),
  }));
};

export const getChineseLessons = (grade: GradeId, term: TermId) => buildChineseLessons(grade, term);
export const getChinesePoems = (grade: GradeId, term: TermId): Poem[] => poemSeeds[grade][term].map((poem, index) => ({
  ...poem,
  id: `g${grade}-${term}-poem-${index + 1}`,
  grade,
  term,
}));

const mathTopics: Record<GradeId, Record<TermId, string[]>> = {
  1: { upper:['位置与顺序','1–5 的认识','加法初步','减法初步','认识图形','6–10 的认识','11–20 的认识','20 以内进位加法'], lower:['认识图形（二）','20 以内退位减法','分类与整理','100 以内数','认识人民币','100 以内加减','找规律','总复习'] },
  2: { upper:['长度单位','100 以内加减','角的初步认识','表内乘法（一）','观察物体','表内乘法（二）','认识时间','数学广角'], lower:['数据收集','表内除法（一）','图形运动','表内除法（二）','混合运算','有余数除法','万以内数','克和千克'] },
  3: { upper:['时分秒','万以内加减（一）','测量','万以内加减（二）','倍的认识','多位数乘一位数','长方形和正方形','分数初步'], lower:['位置与方向','除数是一位数的除法','复式统计表','两位数乘两位数','面积','年月日','小数初步','搭配问题'] },
  4: { upper:['大数认识','公顷和平方千米','角的度量','三位数乘两位数','平行四边形和梯形','除数两位数的除法','条形统计图','优化问题'], lower:['四则运算','观察物体','运算定律','小数意义和性质','三角形','小数加减','图形运动','平均数与统计'] },
  5: { upper:['小数乘法','位置','小数除法','可能性','简易方程','多边形面积','植树问题','综合复习'], lower:['观察物体','因数与倍数','长方体和正方体','分数意义和性质','图形运动','分数加减','折线统计图','找次品'] },
  6: { upper:['分数乘法','位置与方向','分数除法','比','圆','百分数（一）','扇形统计图','数与形'], lower:['负数','百分数（二）','圆柱与圆锥','比例','数学广角','数与代数整理','图形与几何整理','统计与概率整理'] },
};

export const getMathUnits = (grade: GradeId, term: TermId): CurriculumUnit[] => mathTopics[grade][term].map((title, index) => ({
  id: `g${grade}-${term}-math-${index + 1}`,
  grade,
  term,
  unit: index + 1,
  title,
  topics: title.split('与'),
}));

const lowerEnglishWords: Record<GradeId, EnglishWord[]> = {
  1: [['mother','妈妈','👩'],['father','爸爸','👨'],['sister','姐姐','👧'],['brother','哥哥','👦'],['head','头','😀'],['hand','手','✋'],['rice','米饭','🍚'],['milk','牛奶','🥛'],['book','书','📖'],['pencil','铅笔','✏️'],['happy','开心','😊'],['friend','朋友','🤝']].map(([en,cn,emoji]) => ({en,cn,emoji})),
  2: [['spring','春天','🌱'],['summer','夏天','☀️'],['autumn','秋天','🍂'],['winter','冬天','❄️'],['shirt','衬衫','👕'],['dress','连衣裙','👗'],['train','火车','🚆'],['plane','飞机','✈️'],['breakfast','早餐','🥣'],['lunch','午餐','🍱'],['dance','跳舞','💃'],['swim','游泳','🏊']].map(([en,cn,emoji]) => ({en,cn,emoji})),
  3: [['library','图书馆','📚'],['classroom','教室','🏫'],['window','窗户','🪟'],['computer','电脑','💻'],['breakfast','早餐','🥣'],['dinner','晚餐','🍽️'],['weather','天气','🌦️'],['cloudy','多云','☁️'],['jacket','夹克','🧥'],['shorts','短裤','🩳'],['farm','农场','🚜'],['horse','马','🐴']].map(([en,cn,emoji]) => ({en,cn,emoji})),
  4: [['subject','学科','📘'],['music','音乐','🎵'],['science','科学','🔬'],['Monday','星期一','1️⃣'],['usually','通常','🕒'],['sometimes','有时','⏳'],['cinema','电影院','🎬'],['museum','博物馆','🏛️'],['healthy','健康的','💚'],['vegetable','蔬菜','🥬'],['holiday','假期','🏖️'],['travel','旅行','🧳']].map(([en,cn,emoji]) => ({en,cn,emoji})),
  5: [['clever','聪明的','💡'],['polite','有礼貌的','🙋'],['weekend','周末','📅'],['exercise','锻炼','🏃'],['village','村庄','🏘️'],['bridge','桥','🌉'],['bottle','瓶子','🧴'],['delicious','美味的','😋'],['forest','森林','🌲'],['mountain','高山','⛰️'],['email','电子邮件','📧'],['schedule','日程','🗓️']].map(([en,cn,emoji]) => ({en,cn,emoji})),
  6: [['scientist','科学家','🧑‍🔬'],['pilot','飞行员','🧑‍✈️'],['future','未来','🚀'],['project','项目','📋'],['culture','文化','🏮'],['history','历史','🏛️'],['protect','保护','🛡️'],['environment','环境','🌍'],['volunteer','志愿者','🤲'],['journey','旅程','🧳'],['memory','回忆','📸'],['dream','梦想','✨']].map(([en,cn,emoji]) => ({en,cn,emoji})),
};

const englishUnitTitles: Record<GradeId, Record<TermId, string[]>> = {
  1:{ upper:['Hello!','Colors','Numbers','Animal Friends'], lower:['My Family','My Body','Food Time','Happy School'] },
  2:{ upper:['My Day','At School','My Home','Fun Animals'], lower:['Four Seasons','My Clothes','Ways to Travel','Sports Time'] },
  3:{ upper:['Welcome Back','Colors & Numbers','My Body','Yummy Food'], lower:['Our School','Daily Meals','Weather Report','At the Farm'] },
  4:{ upper:['My Classroom','My Friends','My Family','Shopping Day'], lower:['School Subjects','Daily Habits','Around Town','Healthy Life'] },
  5:{ upper:['Teachers and Friends','My Week','Food and Drink','Nature Park'], lower:['Good Character','Weekend Plans','My Village','Wonderful Nature'] },
  6:{ upper:['How Do You Feel?','Ways to Go','Hobbies','Jobs'], lower:['Future Careers','World Culture','Green Planet','Dream Journey'] },
};

const makeEnglishItem = (id: string, word: EnglishWord): EnglishCourseItem => ({ ...word, id });

export const getEnglishCourses = (grade: GradeId, term: TermId): EnglishCourse[] => {
  if (grade === 3 && term === 'upper') return ENGLISH_COURSES;
  const words = term === 'upper' ? ENGLISH_LEVELS[grade - 1].words : lowerEnglishWords[grade];
  return englishUnitTitles[grade][term].map((title, index) => {
    const group = words.slice(index * 3, index * 3 + 3);
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

export const getCurriculumSummary = (grade: GradeId, term: TermId) => ({
  chinese: chineseUnitTitles[grade][term],
  math: mathTopics[grade][term],
  english: englishUnitTitles[grade][term],
});
