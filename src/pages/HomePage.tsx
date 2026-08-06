import { BookOpen, Brain, Calculator, Dumbbell, HeartPulse, Languages, Sparkles, Trophy } from 'lucide-react';
import { LEVELS } from '../data';
import { getChineseLessons, getChinesePoems, getCurriculumSummary, gradeLabel, termLabel } from '../curriculum';
import { calculateDailyCoins, getBalance, useAppStore } from '../store';
import type { DailyProgress, GradeDailyProgress, PageId } from '../types';
import { ProgressBar, SectionTitle } from '../ui';

const categoryInfo = [
  { id:'math',page:'math',name:'数学大闯关',color:'#4a90d9',Icon:Calculator },
  { id:'chinese',page:'chinese',name:'语文小课堂',color:'#d44637',Icon:BookOpen },
  { id:'english',page:'english',name:'英语大冒险',color:'#43a047',Icon:Languages },
  { id:'reading',page:'reading',name:'阅读时光',color:'#7b1fa2',Icon:Brain },
  { id:'exercise',page:'exercise',name:'运动打卡',color:'#ef6c00',Icon:Dumbbell },
  { id:'health',page:'health',name:'养生小达人',color:'#00897b',Icon:HeartPulse },
] as const;

const wordDone = (progress: GradeDailyProgress, lessonId: string, char: string) =>
  Boolean(progress.chinese.vocabDone[`${lessonId}:${char}`] || progress.chinese.vocabDone[char]);

export const getCategoryProgress = (
  id: typeof categoryInfo[number]['id'],
  daily: DailyProgress,
  gradeDaily: GradeDailyProgress,
  lessonId = '',
  lessonWords: Array<[string, string]> = [],
) => {
  if (id === 'math') return (gradeDaily.math.completed ? 50 : Math.round(gradeDaily.math.score / 10 * 25)) + (gradeDaily.think.completed ? 50 : Math.round(gradeDaily.think.score / 10 * 25));
  if (id === 'chinese') {
    const words = lessonWords.filter(([char]) => wordDone(gradeDaily, lessonId, char)).length;
    return Math.round(words / Math.max(1, lessonWords.length) * 50) + (Object.values(gradeDaily.chinese.poemsDone).some(Boolean) ? 50 : 0);
  }
  if (id === 'english') return (gradeDaily.english.gameDone ? 50 : 0) + (gradeDaily.english.reading ? 50 : 0);
  if (id === 'reading') return daily.reading.done ? 100 : Math.min(50, Math.round(daily.reading.minutes / 20 * 50));
  if (id === 'exercise') return Math.round(daily.exercise.filter((item) => item.done).length / Math.max(1, daily.exercise.length) * 100);
  return (daily.health.foot.done ? 50 : 0) + (daily.health.massage.done ? 50 : 0);
};

const badges: Record<string, { icon:string; label:string }> = {
  'first-step': { icon:'🌟',label:'冒险启程' },
  'combo-star': { icon:'⚡',label:'连击达人' },
  'perfect-quest': { icon:'🏆',label:'满分之星' },
  'book-lover': { icon:'📚',label:'阅读爱好者' },
  'grade-explorer': { icon:'🧭',label:'年级探索家' },
};

export default function HomePage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const { state, gradeDaily } = useAppStore();
  const { daily, profile } = state;
  const grade = profile.selectedGrade;
  const term = profile.selectedTerm;
  const lessons = getChineseLessons(grade, term);
  const poems = getChinesePoems(grade, term);
  const lesson = lessons[Math.min(gradeDaily.chinese.currentLesson, lessons.length - 1)];
  const progress = Math.round(categoryInfo.reduce((sum, item) => sum + getCategoryProgress(item.id, daily, gradeDaily, lesson?.id, lesson?.words), 0) / categoryInfo.length);
  const level = [...LEVELS].reverse().find((entry) => profile.doll.level >= entry.min) ?? LEVELS[0];
  const mon = new Date(`${profile.weekStart}T12:00:00`);
  const weekdays = ['一','二','三','四','五','六','日'];
  const curriculum = getCurriculumSummary(grade, term);
  return (
    <div>
      <SectionTitle icon="⌂">今日总览 · {gradeLabel(grade)}</SectionTitle>
      <div className="grade-banner">
        <div><span>{gradeLabel(grade)} · {termLabel(term)}</span><h2>今天继续探索新知识</h2><p>语文 {curriculum.chinese.length} 个单元 · 数学 {curriculum.math.length} 个单元 · 英语 {curriculum.english.length} 个主题</p></div>
        <div className="streak-stat"><Sparkles/><strong>{profile.streak.current}</strong><span>连续学习天</span></div>
      </div>
      <div className="home-top-grid">
        <button className="pet-summary" onClick={() => onNavigate('pet')}>
          <div className="pixel-princess" aria-hidden="true"><span>👑</span><b>👧</b><i>👗</i></div>
          <strong>小棉</strong><small>Lv.{profile.doll.level} {level.title}</small>
          <ProgressBar value={Math.min(100, profile.doll.charm / 4)} color="#e91e63" />
          <span>进入公主小屋</span>
        </button>
        <div className="home-stack">
          <div className="coin-card"><div><strong>{getBalance(state)}</strong><span>星光币余额</span></div><span className="big-emoji">💰</span></div>
          <div className="weekly-card">
            <header><strong>本周冒险</strong><span>{Object.values(profile.weekCheckins).filter(Boolean).length}/5 天</span></header>
            <div className="week-dots">{weekdays.map((day, index) => { const date = new Date(mon); date.setDate(mon.getDate() + index); const key = date.toISOString().slice(0,10); return <div key={key} className={profile.weekCheckins[key] ? 'done' : ''}><span>{profile.weekCheckins[key] ? '✓' : day}</span><small>周{day}</small></div>; })}</div>
          </div>
        </div>
      </div>
      <div className="hero-progress">
        <div className="ring" style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties}><div><strong>{progress}%</strong><small>总进度</small></div></div>
        <div><h2>今天的冒险正在进行</h2><p>完成学习、阅读与健康任务，获得星光币装扮小屋。今日已获得 {calculateDailyCoins(daily)} 枚。</p></div>
      </div>
      <button className={`daily-challenge-card ${gradeDaily.challenge.completed ? 'done' : ''}`} onClick={() => onNavigate('challenge')}>
        <span className="challenge-icon"><Trophy/></span>
        <span><strong>{gradeDaily.challenge.completed ? '今日挑战已完成' : '开启今日混合挑战'}</strong><small>语文、数学、英语共 6 题 · 连击可解锁勋章</small></span>
        <b>{gradeDaily.challenge.completed ? `${gradeDaily.challenge.score}/${gradeDaily.challenge.total}` : '开始'}</b>
      </button>
      <div className="category-grid">{categoryInfo.map(({ id,page,name,color,Icon }) => { const value = getCategoryProgress(id,daily,gradeDaily,lesson?.id,lesson?.words); return <button className={`category-card ${value === 100 ? 'done' : ''}`} key={id} onClick={() => onNavigate(page)}><Icon aria-hidden="true" /><strong>{name}</strong><span>{value === 100 ? '已完成' : `完成度 ${value}%`}</span><ProgressBar value={value} color={color} /></button>; })}</div>
      <section className="curriculum-overview" aria-label="本学期课程目录">
        <header><h2>本学期课程地图</h2><span>{gradeLabel(grade)} {termLabel(term)}</span></header>
        <div>{[
          ['语文', curriculum.chinese, BookOpen],
          ['数学', curriculum.math, Calculator],
          ['英语', curriculum.english, Languages],
        ].map(([name, items, Icon]) => { const SubjectIcon = Icon as typeof BookOpen; return <article key={name as string}><SubjectIcon/><strong>{name as string}</strong><ol>{(items as string[]).map((item) => <li key={item}>{item}</li>)}</ol></article>; })}</div>
      </section>
      <section className="achievement-strip"><header><h2>我的勋章</h2><span>{profile.achievements.length}/5</span></header><div>{Object.entries(badges).map(([id,badge]) => <div key={id} className={profile.achievements.includes(id) ? 'earned' : ''}><span>{badge.icon}</span><strong>{badge.label}</strong></div>)}</div></section>
      <span className="sr-only">本册古诗 {poems.length} 首</span>
    </div>
  );
}
