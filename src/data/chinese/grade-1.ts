import type { ChineseGradeData } from './types';

export const GRADE_ONE_CHINESE: ChineseGradeData = {
  upper: {
    unitTitles: ['入学准备', '汉语拼音', '识字天地', '自然四季', '想象乐园', '家人与伙伴', '观察发现', '快乐成长'],
    wordPool: [['天','tian'],['地','di'],['人','ren'],['你','ni'],['我','wo'],['他','ta'],['日','ri'],['月','yue'],['水','shui'],['火','huo'],['山','shan'],['石','shi'],['田','tian'],['禾','he'],['口','kou'],['耳','er']],
    poems: [{ title:'咏鹅', author:'唐·骆宾王', content:'鹅，鹅，鹅，曲项向天歌。\n白毛浮绿水，红掌拨清波。', note:'观察白鹅在水中的姿态和颜色。' }],
  },
  lower: {
    unitTitles: ['春夏秋冬', '心愿与伙伴', '快乐生活', '家乡风景', '习惯养成', '童话世界', '奇妙自然', '综合学习'],
    wordPool: [['春','chun'],['风','feng'],['花','hua'],['雪','xue'],['飞','fei'],['入','ru'],['姓','xing'],['国','guo'],['青','qing'],['清','qing'],['晴','qing'],['情','qing'],['请','qing'],['生','sheng'],['气','qi'],['字','zi']],
    poems: [{ title:'静夜思', author:'唐·李白', content:'床前明月光，疑是地上霜。\n举头望明月，低头思故乡。', note:'月夜触发了诗人对故乡的思念。' }],
  },
};
