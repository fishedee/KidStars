import type { ChineseGradeData } from './types';

export const GRADE_FIVE_CHINESE: ChineseGradeData = {
  upper: {
    unitTitles: ['万物有灵', '策略阅读', '民间故事', '爱国情怀', '说明方法', '父母之爱', '自然之趣', '读书明智'],
    wordPool: [['宜','yi'],['鹤','he'],['嫌','xian'],['朱','zhu'],['嵌','qian'],['框','kuang'],['匣','xia'],['哨','shao'],['恩','en'],['韵','yun'],['亩','mu'],['播','bo'],['浇','jiao'],['吩','fen'],['榨','zha'],['慕','mu']],
    poems: [{ title:'示儿', author:'宋·陆游', content:'死去元知万事空，但悲不见九州同。\n王师北定中原日，家祭无忘告乃翁。', note:'表达诗人深厚的爱国情感。' }],
  },
  lower: {
    unitTitles: ['古典名著', '童年往事', '综合实践', '家国责任', '思维表达', '人物描写', '异域风光', '幽默智慧'],
    wordPool: [['昼','zhou'],['耘','yun'],['桑','sang'],['晓','xiao'],['蝴','hu'],['蚂','ma'],['蚱','zha'],['嗡','weng'],['樱','ying'],['拔','ba'],['瞎','xia'],['铲','chan'],['割','ge'],['承','cheng'],['拴','shuan'],['瓢','piao']],
    poems: [{ title:'四时田园杂兴', author:'宋·范成大', content:'昼出耘田夜绩麻，村庄儿女各当家。\n童孙未解供耕织，也傍桑阴学种瓜。', note:'展现乡村劳动生活。' }],
  },
};
