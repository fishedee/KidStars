import type { ChineseGradeData } from './types';

export const GRADE_FOUR_CHINESE: ChineseGradeData = {
  upper: {
    unitTitles: ['自然之美', '连续观察', '现代诗歌', '神话故事', '把握内容', '家国情怀', '成长故事', '历史人物'],
    wordPool: [['潮','chao'],['据','ju'],['堤','di'],['阔','kuo'],['盼','pan'],['滚','gun'],['顿','dun'],['逐','zhu'],['渐','jian'],['犹','you'],['崩','beng'],['震','zhen'],['霎','sha'],['余','yu'],['淘','tao'],['牵','qian']],
    poems: [{ title:'暮江吟', author:'唐·白居易', content:'一道残阳铺水中，半江瑟瑟半江红。\n可怜九月初三夜，露似真珠月似弓。', note:'描写秋日晚江的色彩和月夜。' }],
  },
  lower: {
    unitTitles: ['乡村生活', '科普阅读', '现代诗歌', '动物朋友', '自然风光', '成长故事', '人物品质', '童话奇遇'],
    wordPool: [['杂','za'],['稀','xi'],['篱','li'],['蜻','qing'],['蜓','ting'],['蝶','die'],['宿','su'],['徐','xu'],['疏','shu'],['茅','mao'],['檐','yan'],['翁','weng'],['赖','lai'],['剥','bo'],['构','gou'],['饰','shi']],
    poems: [{ title:'宿新市徐公店', author:'宋·杨万里', content:'篱落疏疏一径深，树头新绿未成阴。\n儿童急走追黄蝶，飞入菜花无处寻。', note:'儿童追蝶让乡村春景充满生机。' }],
  },
};
