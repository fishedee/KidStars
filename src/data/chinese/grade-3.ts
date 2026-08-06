import type { ChineseGradeData, ChineseLessonSeed, ChinesePoemSeed } from './types';

const GRADE_THREE_VOCAB: ChineseLessonSeed[] = [
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

export const GRADE_THREE_UPPER_POEMS: ChinesePoemSeed[] = [
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

export const GRADE_THREE_CHINESE: ChineseGradeData = {
  upper: {
    unitTitles: ['学校生活', '金色秋天', '童话世界', '预测故事', '留心观察', '祖国山河', '自然声音', '美好品质'],
    wordPool: GRADE_THREE_VOCAB.slice(0, 4).flatMap((lesson) => lesson.words).slice(0, 16),
    lessons: GRADE_THREE_VOCAB,
    poems: GRADE_THREE_UPPER_POEMS,
  },
  lower: {
    unitTitles: ['可爱生灵', '寓言启示', '中华文化', '观察发现', '大胆想象', '多彩童年', '奇妙世界', '有趣故事'],
    wordPool: [['鸳','yuan'],['鸯','yang'],['惠','hui'],['崇','chong'],['豚','tun'],['减','jian'],['伶','ling'],['俐','li'],['翼','yi'],['漾','yang'],['闲','xian'],['散','san'],['纤','xian'],['杆','gan'],['痕','hen'],['倦','juan']],
    poems: [{ title:'绝句', author:'唐·杜甫', content:'迟日江山丽，春风花草香。\n泥融飞燕子，沙暖睡鸳鸯。', note:'春日景物明丽又温暖。' }],
  },
};
