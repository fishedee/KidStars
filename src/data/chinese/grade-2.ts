import type { ChineseGradeData } from './types';

export const GRADE_TWO_CHINESE: ChineseGradeData = {
  upper: {
    unitTitles: ['美丽秋天', '儿童生活', '家乡风物', '思维方法', '观察自然', '伟大人物', '想象故事', '相处之道'],
    wordPool: [['塘','tang'],['脑','nao'],['袋','dai'],['灰','hui'],['迎','ying'],['阿','a'],['姨','yi'],['宽','kuan'],['顶','ding'],['鼓','gu'],['洋','yang'],['晒','shai'],['极','ji'],['傍','bang'],['越','yue'],['滴','di']],
    poems: [{ title:'登鹳雀楼', author:'唐·王之涣', content:'白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。', note:'登高才能望得更远。' }],
  },
  lower: {
    unitTitles: ['春天脚步', '关爱他人', '传统文化', '童心世界', '自然奥秘', '克服困难', '品格成长', '世界真奇妙'],
    wordPool: [['冲','chong'],['寻','xun'],['姑','gu'],['娘','niang'],['吐','tu'],['柳','liu'],['桃','tao'],['杏','xing'],['鲜','xian'],['邮','you'],['递','di'],['原','yuan'],['叔','shu'],['局','ju'],['堆','dui'],['礼','li']],
    poems: [{ title:'村居', author:'清·高鼎', content:'草长莺飞二月天，拂堤杨柳醉春烟。\n儿童散学归来早，忙趁东风放纸鸢。', note:'描绘春日儿童放风筝的快乐。' }],
  },
};
