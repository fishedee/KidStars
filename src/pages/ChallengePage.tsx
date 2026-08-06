import { useMemo, useState } from 'react';
import { BookOpen, Calculator, Languages, Lightbulb, Trophy, Zap } from 'lucide-react';
import { getChineseLessons, getEnglishCourses, gradeLabel, termLabel } from '../curriculum';
import { generateMathProblem } from './MathPage';
import { useAppStore } from '../store';
import type { GradeId } from '../types';
import { SectionTitle } from '../ui';

interface ChallengeQuestion {
  subject: 'math' | 'chinese' | 'english';
  prompt: string;
  answer: string;
  options: string[];
  hint: string;
}

const shuffled = <T,>(items: T[]) => [...items].sort(() => Math.random() - .5);

const makeQuestions = (grade: GradeId, term: 'upper' | 'lower'): ChallengeQuestion[] => {
  const lessons = getChineseLessons(grade, term);
  const words = lessons.flatMap((lesson) => lesson.words.map(([char,pinyin]) => ({ char,pinyin })));
  const courses = getEnglishCourses(grade, term);
  const englishWords = courses.flatMap((course) => course.items.word);
  const math = [generateMathProblem('addsub',grade), generateMathProblem('mixed',grade)];
  const mathQuestions = math.map((item) => ({ subject:'math' as const, prompt:item.question, answer:String(item.answer), options:shuffled([item.answer, item.answer + 1, item.answer - 1, item.answer + 10].map(String)), hint:item.explanation ?? '先读清题目中的数量关系' }));
  const chineseQuestions = words.slice(0,2).map((item) => {
    const wrong = words.filter((word) => word.char !== item.char).slice(0,3).map((word) => word.pinyin);
    return { subject:'chinese' as const, prompt:`“${item.char}”的拼音是？`, answer:item.pinyin, options:shuffled([item.pinyin,...wrong]), hint:`想一想“${item.char}”的读音` };
  });
  const englishQuestions = englishWords.slice(0,2).map((item) => {
    const wrong = englishWords.filter((word) => word.en !== item.en).slice(0,3).map((word) => word.cn);
    return { subject:'english' as const, prompt:`${item.emoji} ${item.en} 的中文意思是？`, answer:item.cn, options:shuffled([item.cn,...wrong]), hint:`听一听 ${item.en}` };
  });
  return [...mathQuestions,...chineseQuestions,...englishQuestions];
};

const subjectMeta = {
  math:{ label:'数学', Icon:Calculator, color:'#4360b8' },
  chinese:{ label:'语文', Icon:BookOpen, color:'#b02e26' },
  english:{ label:'英语', Icon:Languages, color:'#df0050' },
};

export default function ChallengePage({ notify }: { notify: (message:string, celebrate?:boolean) => void }) {
  const { state, gradeDaily, updateGradeDaily } = useAppStore();
  const [questions,setQuestions] = useState<ChallengeQuestion[]>([]);
  const [index,setIndex] = useState(0);
  const [score,setScore] = useState(0);
  const [combo,setCombo] = useState(0);
  const [feedback,setFeedback] = useState('');
  const [showHint,setShowHint] = useState(false);
  const grade = state.profile.selectedGrade;
  const term = state.profile.selectedTerm;
  const completed = questions.length > 0 && index >= questions.length;
  const current = questions[index];
  const summary = useMemo(() => `${gradeLabel(grade)} · ${termLabel(term)} · 语数英各 2 题`, [grade,term]);
  const start = () => { setQuestions(makeQuestions(grade,term)); setIndex(0); setScore(0); setCombo(0); setFeedback(''); setShowHint(false); };
  const answer = (value:string) => {
    if (!current || feedback) return;
    const correct = value === current.answer;
    const nextScore = score + (correct ? 1 : 0);
    const nextCombo = correct ? combo + 1 : 0;
    setScore(nextScore); setCombo(nextCombo); setFeedback(correct ? (nextCombo >= 3 ? `连击 ${nextCombo}！` : '答对了！') : `正确答案是 ${current.answer}`);
    if (correct) notify(nextCombo >= 3 ? `连续答对 ${nextCombo} 题！` : '挑战答对', nextCombo >= 3);
    window.setTimeout(() => {
      const next = index + 1;
      setFeedback(''); setShowHint(false);
      if (next >= questions.length) {
        setIndex(next);
        updateGradeDaily((daily) => ({ ...daily, challenge: { completed:true, score:Math.max(daily.challenge.score,nextScore), total:questions.length, bestCombo:Math.max(daily.challenge.bestCombo,nextCombo) } }));
        notify(nextScore >= 5 ? `今日挑战完成，答对 ${nextScore} 题` : `挑战完成，答对 ${nextScore} 题`, nextScore >= 5);
      } else setIndex(next);
    }, correct ? 550 : 1100);
  };
  return <div><SectionTitle icon={<Trophy/>}>{gradeLabel(grade)}每日挑战</SectionTitle><section className="challenge-hero"><div><span className="eyebrow">TODAY QUEST</span><h2>把三个学科串成一场冒险</h2><p>{summary} · 连续答对可以获得连击星光。</p></div><div className="challenge-hero-icon">🏆</div></section>{!questions.length || completed ? <section className="challenge-start panel">{completed && <div className="challenge-result"><strong>{score}/{questions.length}</strong><span>{score >= 5 ? '今日挑战完成！' : '再试一次会更棒'}</span></div>}{!completed && gradeDaily.challenge.completed && <div className="challenge-result"><strong>{gradeDaily.challenge.score}/{gradeDaily.challenge.total}</strong><span>今天已经完成过，可以刷新纪录</span></div>}<div className="challenge-rules"><span>🧩 语文 2 题</span><span>🔢 数学 2 题</span><span>🔤 英语 2 题</span></div><button className="button primary large" onClick={start}>{completed || gradeDaily.challenge.completed ? '再次挑战' : '开始挑战'}</button></section> : <section className="challenge-play panel"><header><span className="quiz-meta">第 {index+1}/{questions.length} 题</span><div className="challenge-meter"><span style={{width:`${index/questions.length*100}%`}}/></div><span className="combo-pill"><Zap/> {combo} 连击</span></header><div className="challenge-subject" style={{'--subject-color':subjectMeta[current.subject].color} as React.CSSProperties}><span>{(() => { const Icon = subjectMeta[current.subject].Icon; return <Icon/>; })()}</span><strong>{subjectMeta[current.subject].label}</strong></div><h2>{current.prompt}</h2><div className="challenge-options">{current.options.map((option) => <button key={option} onClick={() => answer(option)} disabled={Boolean(feedback)}>{option}</button>)}</div><div className={`feedback ${feedback.includes('答对') || feedback.includes('连击') ? 'correct' : 'wrong'}`}>{feedback}</div><button className="hint-button" onClick={() => setShowHint((value) => !value)}><Lightbulb/> {showHint ? current.hint : '查看提示'}</button></section>}</div>;
}
