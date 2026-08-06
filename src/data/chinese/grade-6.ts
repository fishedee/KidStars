import type { ChineseGradeData } from './types';

export const GRADE_SIX_CHINESE: ChineseGradeData = {
  upper: {
    unitTitles: ['触摸自然', '革命岁月', '阅读策略', '成长小说', '说明事理', '走近鲁迅', '艺术之美', '珍惜家园'],
    wordPool: [['毯','tan'],['陈','chen'],['裳','shang'],['虹','hong'],['蹄','ti'],['腐','fu'],['稍','shao'],['微','wei'],['缀','zhui'],['幽','you'],['雅','ya'],['案','an'],['拙','zhuo'],['薄','bo'],['妩','wu'],['媚','mei']],
    poems: [{ title:'六月二十七日望湖楼醉书', author:'宋·苏轼', content:'黑云翻墨未遮山，白雨跳珠乱入船。\n卷地风来忽吹散，望湖楼下水如天。', note:'写出夏日骤雨来去迅疾。' }],
  },
  lower: {
    unitTitles: ['民俗文化', '外国名著', '真情流露', '理想信念', '科学精神', '难忘小学', '古诗词诵读', '综合复习'],
    wordPool: [['醋','cu'],['饺','jiao'],['拌','ban'],['擦','ca'],['眨','zha'],['宵','xiao'],['燃','ran'],['贩','fan'],['彼','bi'],['贺','he'],['轿','jiao'],['骆','luo'],['驼','tuo'],['恰','qia'],['腊','la'],['粥','zhou']],
    poems: [{ title:'十五夜望月', author:'唐·王建', content:'中庭地白树栖鸦，冷露无声湿桂花。\n今夜月明人尽望，不知秋思落谁家。', note:'借中秋月色寄托思念。' }],
  },
};
