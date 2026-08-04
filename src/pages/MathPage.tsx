import { useEffect, useRef, useState } from 'react';
import { Brain, Calculator } from 'lucide-react';
import { useAppStore } from '../store';
import type { MathMode, ThinkMode } from '../types';
import { SectionTitle } from '../ui';

interface Problem { question: string; answer: number; explanation?: string }

export const generateMathProblem = (mode: MathMode): Problem => {
  if (mode === 'addsub') {
    if (Math.random() > .5) { const a = Math.floor(Math.random()*850)+50; const b = Math.floor(Math.random()*(1000-a))+1; return { question:`${a} + ${b} =`,answer:a+b }; }
    const a = Math.floor(Math.random()*850)+100; const b = Math.floor(Math.random()*(a-1))+1; return { question:`${a} - ${b} =`,answer:a-b };
  }
  if (mode === 'muldiv') {
    const a = Math.floor(Math.random()*9)+1; const b = Math.floor(Math.random()*9)+1;
    return Math.random() > .5 ? { question:`${a} x ${b} =`,answer:a*b } : { question:`${a*b} / ${a} =`,answer:b };
  }
  const a = Math.floor(Math.random()*8)+2; const b = Math.floor(Math.random()*8)+2; const c = Math.floor(Math.random()*25)+1;
  return Math.random() > .5 ? { question:`${a} x ${b} + ${c} =`,answer:a*b+c } : { question:`${a*b} / ${a} + ${c} =`,answer:b+c };
};

export const generateThinkProblem = (mode: ThinkMode): Problem => {
  if (mode === 'pattern') { const start = Math.floor(Math.random()*15)+1; const step = Math.floor(Math.random()*5)+2; return { question:`${[0,1,2,3].map((i) => start+i*step).join(', ')}, ?`,answer:start+4*step,explanation:`每次加 ${step}` }; }
  if (mode === 'logic') { const total = Math.floor(Math.random()*10)+10; const front = Math.floor(Math.random()*(total-3))+2; return { question:`共 ${total} 人排队，小明前面有 ${front} 人，小明排第几？`,answer:front+1,explanation:`${front} + 1（算上自己）` }; }
  if (mode === 'word') { const money = Math.floor(Math.random()*30)+50; const a = Math.floor(Math.random()*15)+10; const b = Math.floor(Math.random()*15)+8; return { question:`小红有 ${money} 元，买书花 ${a} 元，买文具花 ${b} 元，还剩多少元？`,answer:money-a-b,explanation:`${money} - ${a} - ${b}` }; }
  const a = Math.floor(Math.random()*50)+10; const answer = Math.floor(Math.random()*30)+5; return { question:`□ + ${a} = ${a+answer}`,answer,explanation:`${a+answer} - ${a}` };
};

function Quiz({ kind, mode, notify }: { kind: 'math' | 'think'; mode: MathMode | ThinkMode; notify: (message: string, celebrate?: boolean) => void }) {
  const { state, updateDaily } = useAppStore();
  const saved = state.daily[kind];
  const [running,setRunning] = useState(false);
  const [index,setIndex] = useState(0);
  const [score,setScore] = useState(0);
  const [problem,setProblem] = useState<Problem | null>(null);
  const [answer,setAnswer] = useState('');
  const [feedback,setFeedback] = useState('');
  const timeoutRef = useRef<number | null>(null);
  useEffect(() => () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); }, []);
  const nextProblem = () => { setProblem(kind === 'math' ? generateMathProblem(mode as MathMode) : generateThinkProblem(mode as ThinkMode)); setAnswer(''); setFeedback(''); };
  const start = () => { setRunning(true); setIndex(0); setScore(0); nextProblem(); };
  const finish = (finalScore: number) => {
    setRunning(false); setProblem(null);
    updateDaily((daily) => ({ ...daily, [kind]: { ...daily[kind], score:finalScore, completed: finalScore >= 6 } }));
    notify(finalScore >= 6 ? `闯关成功，答对 ${finalScore} 题` : `答对 ${finalScore} 题，继续练习`, finalScore >= 6);
  };
  const submit = () => {
    if (!problem || answer.trim() === '') return;
    const correct = Number(answer) === problem.answer;
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore); setFeedback(correct ? '答对了！' : `正确答案是 ${problem.answer}${problem.explanation ? `（${problem.explanation}）` : ''}`);
    if (correct) notify('答对了！', true);
    timeoutRef.current = window.setTimeout(() => { const nextIndex = index + 1; if (nextIndex >= 10) finish(nextScore); else { setIndex(nextIndex); nextProblem(); } }, correct ? 600 : 1100);
  };
  if (!running) return <div className="quiz-area"><div className="quiz-result">{saved.score > 0 && <><strong>{saved.score}/10</strong><span>{saved.completed ? '今日已通关' : '今日练习记录'}</span></>}<p>每轮 10 题，答对 6 题得 5 币，满分得 8 币</p></div><button className="button primary large" onClick={start}>{saved.score ? '再来一轮' : '开始挑战'}</button></div>;
  return <div className="quiz-area"><div className="quiz-meta">第 {index+1}/10 题 · 已答对 {score} 题</div><div className="quiz-question">{problem?.question}</div><div className="answer-row"><input autoFocus type="number" value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submit(); }} aria-label="答案" /><button className="button primary" onClick={submit} disabled={Boolean(feedback)}>确定</button></div><div className={`feedback ${feedback.startsWith('答对') ? 'correct' : 'wrong'}`}>{feedback}</div></div>;
}

export default function MathPage({ notify }: { notify: (message: string, celebrate?: boolean) => void }) {
  const { state, updateDaily } = useAppStore();
  const [section,setSection] = useState<'math'|'think'>('math');
  const mode = state.daily[section].mode;
  const mathModes: Array<[MathMode,string]> = [['addsub','1000以内加减'],['muldiv','一位数乘除'],['mixed','混合运算']];
  const thinkModes: Array<[ThinkMode,string]> = [['pattern','找规律填数'],['logic','逻辑推理'],['word','生活应用'],['puzzle','数字谜题']];
  const modes = section === 'math' ? mathModes : thinkModes;
  return <div><SectionTitle icon="⬡">数学大闯关</SectionTitle><div className="segmented"><button className={section === 'math' ? 'active' : ''} onClick={() => setSection('math')}><Calculator />计算闯关</button><button className={section === 'think' ? 'active' : ''} onClick={() => setSection('think')}><Brain />思维挑战</button></div><div className="tab-row">{modes.map(([id,label]) => <button key={id} className={mode === id ? 'active' : ''} onClick={() => updateDaily((daily) => ({ ...daily, [section]: { ...daily[section], mode:id } }))}>{label}</button>)}</div><Quiz key={`${section}-${mode}`} kind={section} mode={mode} notify={notify} /></div>;
}
