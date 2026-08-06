import type { DollCategory, ShopItem } from './types';

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
  ...makeShopItems('makeup', [['makeup1','粉嫩腮红','甜美可爱',3,'😊'],['makeup2','樱桃小嘴','水润可爱',5,'🍒'],['makeup3','星星眼妆','明亮大眼',8,'🤩'],['makeup4','猫咪眼线','俏皮可爱',8,'😺'],['makeup5','花瓣嘴唇','如花绽放',10,'🌸']]),
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
