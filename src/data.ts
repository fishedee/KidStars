import type { DollCategory, EnglishContentKind, EnglishCourse, EnglishCourseItem, EnglishWord, Poem, ShopItem, VocabLesson } from './types';

export const TEXTBOOK_VOCAB: VocabLesson[] = [
  { unit: 1, title: '1. 大青树下的小学', words: [['晨','chen'],['绒','rong'],['球','qiu'],['汉','han'],['艳','yan'],['服','fu'],['装','zhuang'],['扮','ban'],['敬','jing'],['停','ting'],['孔','kong'],['雀','que'],['粗','cu']] },
  { unit: 1, title: '2. 花的学校', words: [['荒','huang'],['笛','di'],['舞','wu'],['狂','kuang'],['功','gong'],['罚','fa'],['假','jia'],['互','hu'],['所','suo'],['够','gou'],['猜','cai'],['扬','yang'],['臂','bi']] },
  { unit: 2, title: '4. 古诗三首', words: [['寒','han'],['径','jing'],['斜','xie'],['霜','shuang'],['赠','zeng'],['盖','gai'],['菊','ju'],['残','can'],['君','jun'],['橙','cheng'],['送','song'],['挑','tiao'],['落','luo']] },
  { unit: 2, title: '5. 铺满金色巴掌的水泥道', words: [['铺','pu'],['泥','ni'],['晶','jing'],['院','yuan'],['墙','qiang'],['印','yin'],['排','pai'],['列','lie'],['规','gui'],['则','ze'],['乱','luan'],['棕','zong'],['迟','chi']] },
  { unit: 2, title: '6. 秋天的雨', words: [['盒','he'],['颜','yan'],['料','liao'],['票','piao'],['争','zheng'],['仙','xian'],['闻','wen'],['勾','gou'],['紧','jin'],['洞','dong'],['油','you'],['曲','qu'],['丰','feng']] },
  { unit: 3, title: '8. 卖火柴的小女孩', words: [['柴','chai'],['救','jiu'],['裙','qun'],['怜','lian'],['减','jian'],['蜡','la'],['烛','zhu'],['伸','shen'],['板','ban'],['富','fu'],['颗','ke'],['奶','nai']] },
  { unit: 4, title: '10. 在牛肚子里旅行', words: [['旅','lu'],['咱','zan'],['偷','tou'],['救','jiu'],['命','ming'],['拼','pin'],['扫','sao'],['胃','wei'],['管','guan'],['呼','hu'],['咬','yao'],['留','liu'],['泪','lei']] },
  { unit: 4, title: '12. 总也倒不了的老屋', words: [['准','zhun'],['备','bei'],['等','deng'],['暴','bao'],['睡','shui'],['壁','bi'],['砍','kan'],['蜘','zhi'],['蛛','zhu'],['漂','piao'],['撞','zhuang'],['饱','bao'],['晒','shai']] },
  { unit: 5, title: '15. 搭船的鸟', words: [['搭','da'],['亲','qin'],['父','fu'],['啦','la'],['响','xiang'],['羽','yu'],['翠','cui'],['嘴','zui'],['悄','qiao'],['吞','tun'],['捕','bu']] },
  { unit: 5, title: '16. 金色的草地', words: [['蒲','pu'],['英','ying'],['盛','sheng'],['耍','shua'],['喊','han'],['欠','qian'],['钓','diao'],['而','er'],['察','cha'],['拢','long'],['掌','zhang'],['趣','qu'],['喜','xi']] },
  { unit: 6, title: '17. 古诗三首', words: [['断','duan'],['楚','chu'],['至','zhi'],['孤','gu'],['帆','fan'],['饮','yin'],['初','chu'],['镜','jing'],['未','wei'],['磨','mo'],['遥','yao'],['银','yin'],['盘','pan']] },
  { unit: 6, title: '18. 富饶的西沙群岛', words: [['优','you'],['淡','dan'],['浅','qian'],['错','cuo'],['岩','yan'],['挺','ting'],['刺','ci'],['数','shu'],['厚','hou'],['宝','bao'],['贵','gui'],['设','she']] },
  { unit: 6, title: '19. 海滨小城', words: [['滨','bin'],['灰','hui'],['飘','piao'],['渔','yu'],['遍','bian'],['躺','tang'],['载','zai'],['靠','kao'],['亚','ya'],['夏','xia'],['除','chu'],['踩','cai'],['洁','jie']] },
  { unit: 6, title: '20. 美丽的小兴安岭', words: [['脑','nao'],['袋','dai'],['严','yan'],['实','shi'],['挡','dang'],['视','shi'],['线','xian'],['坛','tan'],['显','xian'],['材','cai'],['软','ruan'],['刮','gua'],['库','ku']] },
  { unit: 7, title: '21. 大自然的声音', words: [['妙','miao'],['演','yan'],['奏','zou'],['琴','qin'],['感','gan'],['受','shou'],['激','ji'],['击','ji'],['器','qi'],['滴','di'],['敲','qiao'],['鸣','ming'],['诉','su']] },
  { unit: 7, title: '22. 读不完的大书', words: [['读','du'],['虾','xia'],['勇','yong'],['蚂','ma'],['蚁','yi'],['短','duan'],['栽','zai'],['梨','li'],['寸','cun'],['柔','rou'],['摇','yao'],['测','ce']] },
  { unit: 8, title: '23. 司马光', words: [['司','si'],['登','deng'],['跌','die'],['皆','jie'],['弃','qi'],['持','chi'],['击','ji']] },
];

export const POEMS: Poem[] = [
  { title: '所见', author: '清·袁枚', content: '牧童骑黄牛，歌声振林樾。\n意欲捕鸣蝉，忽然闭口立。', note: '诗人用短短四句刻画了牧童由歌唱到屏息捕蝉的天真神态。' },
  { title: '山行', author: '唐·杜牧', content: '远上寒山石径斜，白云生处有人家。\n停车坐爱枫林晚，霜叶红于二月花。', note: '深秋山行中，诗人以鲜明色彩写出枫林胜过春花的蓬勃之美。' },
  { title: '赠刘景文', author: '宋·苏轼', content: '荷尽已无擎雨盖，菊残犹有傲霜枝。\n一年好景君须记，最是橙黄橘绿时。', note: '诗人借橙黄橘绿的成熟时节勉励朋友珍惜人生好景。' },
  { title: '夜书所见', author: '宋·叶绍翁', content: '萧萧梧叶送寒声，江上秋风动客情。\n知有儿童挑促织，夜深篱落一灯明。', note: '秋夜的风声与儿童捉蟋蟀的灯火，共同勾起诗人的思乡之情。' },
  { title: '望天门山', author: '唐·李白', content: '天门中断楚江开，碧水东流至此回。\n两岸青山相对出，孤帆一片日边来。', note: '诗人乘舟而行，以流动视角展现天门山和长江的壮丽。' },
  { title: '饮湖上初晴后雨', author: '宋·苏轼', content: '水光潋滟晴方好，山色空蒙雨亦奇。\n欲把西湖比西子，淡妆浓抹总相宜。', note: '晴雨西湖各有风姿，诗人用西施作比，写出自然之美。' },
  { title: '望洞庭', author: '唐·刘禹锡', content: '湖光秋月两相和，潭面无风镜未磨。\n遥望洞庭山水翠，白银盘里一青螺。', note: '月下洞庭如银盘，君山如青螺，想象精巧而宁静。' },
  { title: '早发白帝城', author: '唐·李白', content: '朝辞白帝彩云间，千里江陵一日还。\n两岸猿声啼不住，轻舟已过万重山。', note: '轻舟飞驰穿山而过，传达诗人遇赦归来的畅快心情。' },
  { title: '采莲曲', author: '唐·王昌龄', content: '荷叶罗裙一色裁，芙蓉向脸两边开。\n乱入池中看不见，闻歌始觉有人来。', note: '采莲少女与荷叶荷花融为一体，画面清新灵动。' },
];

export const ENGLISH_LEVELS: Array<{ level: number; words: EnglishWord[] }> = [
  { level: 1, words: [['cat','猫','🐱'],['dog','狗','🐶'],['bird','鸟','🐦'],['fish','鱼','🐟'],['bear','熊','🐻'],['duck','鸭子','🦆'],['pig','猪','🐷'],['rabbit','兔子','🐰'],['monkey','猴子','🐵'],['tiger','老虎','🐯'],['panda','熊猫','🐼'],['lion','狮子','🦁']].map(([en,cn,emoji]) => ({ en, cn, emoji })) },
  { level: 2, words: [['red','红色','🔴'],['blue','蓝色','🔵'],['green','绿色','🟢'],['yellow','黄色','🟡'],['white','白色','⚪'],['black','黑色','⚫'],['one','一','1️⃣'],['two','二','2️⃣'],['three','三','3️⃣'],['four','四','4️⃣'],['five','五','5️⃣'],['six','六','6️⃣']].map(([en,cn,emoji]) => ({ en, cn, emoji })) },
  { level: 3, words: [['head','头','😀'],['eye','眼睛','👁'],['ear','耳朵','👂'],['nose','鼻子','👃'],['mouth','嘴巴','👄'],['hand','手','✋'],['foot','脚','🦶'],['arm','手臂','💪'],['leg','腿','🦵'],['face','脸','😊'],['hair','头发','💇'],['teeth','牙齿','🦷']].map(([en,cn,emoji]) => ({ en, cn, emoji })) },
  { level: 4, words: [['cake','蛋糕','🎂'],['bread','面包','🍞'],['milk','牛奶','🥛'],['water','水','💧'],['egg','鸡蛋','🥚'],['rice','米饭','🍚'],['apple','苹果','🍎'],['banana','香蕉','🍌'],['juice','果汁','🧃'],['candy','糖果','🍬'],['noodle','面条','🍜'],['chicken','鸡肉','🍗']].map(([en,cn,emoji]) => ({ en, cn, emoji })) },
  { level: 5, words: [['book','书','📖'],['pen','钢笔','🖊'],['pencil','铅笔','✏'],['ruler','尺子','📏'],['bag','书包','🎒'],['desk','课桌','🪑'],['eraser','橡皮','🧹'],['paper','纸','📄'],['glue','胶水','🧴'],['teacher','老师','👩‍🏫'],['school','学校','🏫'],['friend','朋友','🤝']].map(([en,cn,emoji]) => ({ en, cn, emoji })) },
  { level: 6, words: [['mother','妈妈','👩'],['father','爸爸','👨'],['sister','姐妹','👧'],['brother','兄弟','👦'],['baby','宝宝','👶'],['family','家庭','🏠'],['big','大的','🐘'],['small','小的','🐭'],['happy','开心的','😊'],['sad','伤心的','😢'],['hot','热的','🔥'],['cold','冷的','❄️']].map(([en,cn,emoji]) => ({ en, cn, emoji })) },
];

type CourseRow = [en: string, cn: string, emoji: string, spokenText?: string];

const courseItems = (level: number, kind: EnglishContentKind, rows: CourseRow[]): EnglishCourseItem[] =>
  rows.map(([en, cn, emoji, spokenText], index) => ({ id: `l${level}-${kind}-${index + 1}`, en, cn, emoji, spokenText }));

const wordItems = (level: number, words: EnglishWord[]): EnglishCourseItem[] =>
  words.map((word, index) => ({ ...word, id: `l${level}-word-${index + 1}` }));

export const ENGLISH_COURSES: EnglishCourse[] = [
  {
    level: 1, title: '动物伙伴', englishTitle: 'Animal Friends', emoji: '🐾',
    items: {
      word: wordItems(1, ENGLISH_LEVELS[0].words),
      phrase: courseItems(1, 'phrase', [
        ['a cute cat', '一只可爱的猫', '🐱'], ['a little dog', '一只小狗', '🐶'],
        ['two birds', '两只小鸟', '🐦'], ['a big bear', '一只大熊', '🐻'],
      ]),
      sentence: courseItems(1, 'sentence', [
        ['This is a cat.', '这是一只猫。', '🐱'], ['I see a dog.', '我看见一只狗。', '🐶'],
        ['The bird can fly.', '小鸟会飞。', '🐦'], ['The fish can swim.', '小鱼会游泳。', '🐟'],
      ]),
      pattern: courseItems(1, 'pattern', [
        ['This is a ___.', '这是一只……', '🧩', 'This is a rabbit.'],
        ['I see a ___.', '我看见一只……', '🧩', 'I see a panda.'],
      ]),
    },
  },
  {
    level: 2, title: '颜色与数字', englishTitle: 'Colors & Numbers', emoji: '🌈',
    items: {
      word: wordItems(2, ENGLISH_LEVELS[1].words),
      phrase: courseItems(2, 'phrase', [
        ['a red apple', '一个红苹果', '🍎'], ['blue sky', '蓝色的天空', '🌤️'],
        ['three ducks', '三只鸭子', '🦆'], ['five stars', '五颗星星', '⭐'],
      ]),
      sentence: courseItems(2, 'sentence', [
        ['It is red.', '它是红色的。', '🔴'], ['I like blue.', '我喜欢蓝色。', '🔵'],
        ['I have three apples.', '我有三个苹果。', '🍎'], ['There are five birds.', '这里有五只鸟。', '🐦'],
      ]),
      pattern: courseItems(2, 'pattern', [
        ['It is ___.', '它是……颜色的。', '🧩', 'It is yellow.'],
        ['I have ___ ___.', '我有……个……', '🧩', 'I have two books.'],
      ]),
    },
  },
  {
    level: 3, title: '我的身体', englishTitle: 'My Body', emoji: '🙌',
    items: {
      word: wordItems(3, ENGLISH_LEVELS[2].words),
      phrase: courseItems(3, 'phrase', [
        ['big eyes', '大眼睛', '👀'], ['a small nose', '一个小鼻子', '👃'],
        ['two hands', '两只手', '🙌'], ['long hair', '长头发', '💇'],
      ]),
      sentence: courseItems(3, 'sentence', [
        ['This is my head.', '这是我的头。', '😀'], ['I have two eyes.', '我有两只眼睛。', '👀'],
        ['Touch your nose.', '摸摸你的鼻子。', '👃'], ['Clap your hands.', '拍拍你的手。', '👏'],
      ]),
      pattern: courseItems(3, 'pattern', [
        ['This is my ___.', '这是我的……', '🧩', 'This is my arm.'],
        ['I have two ___.', '我有两个……', '🧩', 'I have two ears.'],
      ]),
    },
  },
  {
    level: 4, title: '美味食物', englishTitle: 'Yummy Food', emoji: '🍌',
    items: {
      word: wordItems(4, ENGLISH_LEVELS[3].words),
      phrase: courseItems(4, 'phrase', [
        ['yellow banana', '黄色的香蕉', '🍌'], ['red apple', '红色的苹果', '🍎'],
        ['a glass of milk', '一杯牛奶', '🥛'], ['some bread', '一些面包', '🍞'],
      ]),
      sentence: courseItems(4, 'sentence', [
        ['I like bananas.', '我喜欢香蕉。', '🍌'], ['The cake is sweet.', '蛋糕是甜的。', '🎂'],
        ['Can I have some water?', '我可以喝点水吗？', '💧'], ['Here is your bread.', '这是你的面包。', '🍞'],
      ]),
      pattern: courseItems(4, 'pattern', [
        ['I like ___.', '我喜欢……', '🧩', 'I like apples.'],
        ['Can I have some ___?', '我可以要一些……吗？', '🧩', 'Can I have some juice?'],
      ]),
    },
  },
  {
    level: 5, title: '快乐学校', englishTitle: 'Happy School', emoji: '🎒',
    items: {
      word: wordItems(5, ENGLISH_LEVELS[4].words),
      phrase: courseItems(5, 'phrase', [
        ['a blue pen', '一支蓝色钢笔', '🖊️'], ['my school bag', '我的书包', '🎒'],
        ['a good friend', '一个好朋友', '🤝'], ['our teacher', '我们的老师', '👩‍🏫'],
      ]),
      sentence: courseItems(5, 'sentence', [
        ['This is my book.', '这是我的书。', '📖'], ['Open your school bag.', '打开你的书包。', '🎒'],
        ['I have a pencil.', '我有一支铅笔。', '✏️'], ['My teacher is kind.', '我的老师很亲切。', '👩‍🏫'],
      ]),
      pattern: courseItems(5, 'pattern', [
        ['This is my ___.', '这是我的……', '🧩', 'This is my ruler.'],
        ['I have a ___.', '我有一个……', '🧩', 'I have a book.'],
      ]),
    },
  },
  {
    level: 6, title: '家人与心情', englishTitle: 'Family & Feelings', emoji: '🏡',
    items: {
      word: wordItems(6, ENGLISH_LEVELS[5].words),
      phrase: courseItems(6, 'phrase', [
        ['my happy family', '我幸福的家', '👨‍👩‍👧‍👦'], ['a little baby', '一个小宝宝', '👶'],
        ['big brother', '哥哥', '👦'], ['a happy face', '一张开心的脸', '😊'],
      ]),
      sentence: courseItems(6, 'sentence', [
        ['This is my mother.', '这是我的妈妈。', '👩'], ['My family is happy.', '我的家人很开心。', '🏡'],
        ['The baby is small.', '宝宝很小。', '👶'], ['I feel sad today.', '我今天感到难过。', '😢'],
      ]),
      pattern: courseItems(6, 'pattern', [
        ['This is my ___.', '这是我的……', '🧩', 'This is my sister.'],
        ['I feel ___.', '我感觉……', '🧩', 'I feel happy.'],
      ]),
    },
  },
];

export const SHOP_CATEGORIES: Array<{ id: DollCategory; name: string }> = [
  { id: 'hair', name: '发型' }, { id: 'top', name: '上衣' }, { id: 'bottom', name: '裙子' },
  { id: 'shoes', name: '鞋子' }, { id: 'acc', name: '配饰' }, { id: 'makeup', name: '妆容' },
];

const makeShopItems = (category: DollCategory, rows: Array<[string,string,string,number,string]>): ShopItem[] =>
  rows.map(([id, name, description, cost, icon]) => ({ id, category, name, description, cost, icon }));

export const SHOP_ITEMS: ShopItem[] = [
  ...makeShopItems('hair', [['hair1','齐肩短发','清爽可爱',3,'👧'],['hair2','双马尾','俏皮活泼',5,'👧🏻'],['hair3','长直发','温柔淑女',8,'👩'],['hair4','丸子头','甜美可爱',10,'👧🏼'],['hair5','麻花辫','文艺清新',12,'👩🏻'],['hair6','公主卷发','梦幻浪漫',15,'👸']]),
  ...makeShopItems('top', [['top1','粉色T恤','舒适日常',3,'👚'],['top2','蓝色衬衫','清新活力',5,'👔'],['top3','条纹卫衣','温暖可爱',8,'🧥'],['top4','蕾丝上衣','精致优雅',10,'👘'],['top5','星空卫衣','梦幻闪亮',12,'✨'],['top6','彩虹T恤','缤纷多彩',15,'🌈']]),
  ...makeShopItems('bottom', [['bottom1','粉色短裙','甜美可爱',3,'👗'],['bottom2','蓝色百褶裙','学院风',5,'🥻'],['bottom3','蓬蓬公主裙','梦幻华丽',10,'👰'],['bottom4','碎花长裙','清新田园',10,'🌺'],['bottom5','星空半身裙','闪耀夜空',12,'🌟'],['bottom6','彩虹蓬蓬裙','梦幻公主',18,'🎪']]),
  ...makeShopItems('shoes', [['shoes1','小红皮鞋','经典百搭',3,'👠'],['shoes2','白色运动鞋','活力四射',5,'👟'],['shoes3','蝴蝶结鞋','甜美公主',8,'🎀'],['shoes4','水晶鞋','梦幻闪耀',15,'👢'],['shoes5','彩虹帆布鞋','缤纷多彩',12,'👟']]),
  ...makeShopItems('acc', [['acc1','粉色发箍','简单可爱',3,'🎀'],['acc2','小皇冠','公主必备',10,'👑'],['acc3','猫咪发夹','俏皮可爱',5,'🐱'],['acc4','蝴蝶结丝带','优雅甜美',8,'🎗'],['acc5','小花环','小精灵风',12,'🌼'],['acc6','天使光环','圣洁可爱',18,'😇'],['acc7','星星发饰','闪耀星空',14,'⭐']]),
  ...makeShopItems('makeup', [['makeup1','粉嫩腮红','甜美可爱',3,'😊'],['makeup2','樱桃小嘴','水润可爱',5,'🍒'],['makeup3','星星眼妆','明亮大眼',8,'🤩'],['makeup4','猫咪眼线','俏皮迷人',8,'😺'],['makeup5','花瓣嘴唇','如花绽放',10,'🌸']]),
];

export interface DecorSlot { id: string; name: string; icon: string; row: number; col: number; rowSpan?: number; colSpan?: number }
export interface DecorItem { id: string; name: string; cost: number; icon: string }
const decor = (rows: Array<[string,string,number,string]>): DecorItem[] => rows.map(([id,name,cost,icon]) => ({ id,name,cost,icon }));

export const COTTAGE_SLOTS: DecorSlot[] = [
  { id:'window',name:'窗户',icon:'🪟',row:1,col:1 }, { id:'bed',name:'小床',icon:'🛏️',row:1,col:2,rowSpan:2,colSpan:2 },
  { id:'desk',name:'书桌',icon:'📚',row:2,col:1 }, { id:'shelf',name:'书架',icon:'📖',row:3,col:1 },
  { id:'toy',name:'玩具角',icon:'🧸',row:3,col:2 }, { id:'rug',name:'地毯',icon:'🟫',row:3,col:3 },
];
export const COTTAGE_ITEMS: Record<string, DecorItem[]> = {
  window:decor([['cw1','粉色窗帘',3,'🪟'],['cw2','星星窗帘',8,'🌟'],['cw3','彩虹窗帘',12,'🌈']]),
  bed:decor([['cb1','小木床',5,'🛏️'],['cb2','公主床',12,'👸'],['cb3','云朵床',18,'☁️']]),
  desk:decor([['cd1','小书桌',3,'📚'],['cd2','粉色书桌',8,'🩷'],['cd3','城堡书桌',15,'🏰']]),
  shelf:decor([['cs1','小书架',3,'📖'],['cs2','彩虹书架',10,'🌈'],['cs3','公主书架',14,'👸']]),
  toy:decor([['ct1','布娃娃',5,'🧸'],['ct2','积木城堡',10,'🏰'],['ct3','音乐盒',15,'🎵']]),
  rug:decor([['cr1','圆形地毯',2,'🟫'],['cr2','花朵地毯',5,'🌸'],['cr3','星星地毯',8,'⭐']]),
};

export const GARDEN_SLOTS: DecorSlot[] = [
  { id:'tree',name:'大树',icon:'🌳',row:1,col:1,rowSpan:2 }, { id:'flower',name:'花丛',icon:'🌸',row:1,col:2 },
  { id:'pond',name:'池塘',icon:'🪷',row:2,col:2,rowSpan:2,colSpan:2 }, { id:'bench',name:'长椅',icon:'🪑',row:3,col:1 },
  { id:'path',name:'小路',icon:'🛤️',row:1,col:3 },
];
export const GARDEN_ITEMS: Record<string, DecorItem[]> = {
  tree:decor([['gt1','小树苗',3,'🌱'],['gt2','樱花树',10,'🌸'],['gt3','果树',12,'🍎']]),
  flower:decor([['gf1','小雏菊',2,'🌼'],['gf2','玫瑰花丛',8,'🌹'],['gf3','向日葵',10,'🌻']]),
  pond:decor([['gp1','小水坑',3,'💧'],['gp2','荷花池',12,'🪷'],['gp3','彩虹喷泉',20,'⛲']]),
  bench:decor([['gb1','小木凳',2,'🪑'],['gb2','秋千椅',10,'🎠'],['gb3','公主长椅',15,'👸']]),
  path:decor([['gph1','石子小路',2,'🪨'],['gph2','彩虹小道',8,'🌈'],['gph3','花瓣路',10,'🌸']]),
};

export const REWARDS = [
  { id:'tv',icon:'📺',name:'看电视',description:'30 分钟',cost:10 },
  { id:'movie',icon:'🎬',name:'看电影',description:'1 部电影',cost:20 },
  { id:'game',icon:'🎮',name:'打游戏机',description:'30 分钟',cost:15 },
];

export const LEVELS = [
  { min:1,title:'小公主',charm:0 }, { min:3,title:'可爱少女',charm:50 },
  { min:5,title:'甜心女孩',charm:120 }, { min:8,title:'魅力精灵',charm:220 },
  { min:12,title:'闪耀之星',charm:400 },
];
