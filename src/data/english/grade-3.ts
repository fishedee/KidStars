import type { EnglishContentKind, EnglishCourse, EnglishCourseItem, EnglishWord } from '../../types';
import { ENGLISH_LEVELS } from './levels';
import type { EnglishGradeData } from './types';

type CourseRow = [en: string, cn: string, emoji: string, spokenText?: string];

const courseItems = (level: number, kind: EnglishContentKind, rows: CourseRow[]): EnglishCourseItem[] =>
  rows.map(([en, cn, emoji, spokenText], index) => ({ id: `l${level}-${kind}-${index + 1}`, en, cn, emoji, spokenText }));

const wordItems = (level: number, words: EnglishWord[]): EnglishCourseItem[] =>
  words.map((word, index) => ({ ...word, id: `l${level}-word-${index + 1}` }));

const COMPLETE_UPPER_COURSES: Array<Omit<EnglishCourse, 'grade' | 'term'>> = [
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

export const GRADE_THREE_ENGLISH: EnglishGradeData = {
  upper: {
    unitTitles: ['Welcome Back','Colors & Numbers','My Body','Yummy Food'],
    words: ENGLISH_LEVELS[2].words,
    courses: COMPLETE_UPPER_COURSES,
  },
  lower: {
    unitTitles: ['Our School','Daily Meals','Weather Report','At the Farm'],
    words: [['library','图书馆','📚'],['classroom','教室','🏫'],['window','窗户','🪟'],['computer','电脑','💻'],['breakfast','早餐','🥣'],['dinner','晚餐','🍽️'],['weather','天气','🌦️'],['cloudy','多云','☁️'],['jacket','夹克','🧥'],['shorts','短裤','🩳'],['farm','农场','🚜'],['horse','马','🐴']].map(([en,cn,emoji]) => ({en,cn,emoji})),
  },
};
