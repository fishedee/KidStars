import { useEffect, useRef, useState } from 'react';
import { Brain, Calculator, Clock3, Lightbulb, Zap } from 'lucide-react';
import { getMathUnits, gradeLabel, termLabel } from '../curriculum';
import { useAppStore } from '../store';
import type { GradeId, MathMode, ThinkMode } from '../types';
import { SectionTitle } from '../ui';

export interface Problem { question: string; answer: number; explanation?: string }

const rounded = (value: number) => Math.round(value * 100) / 100;

export const generateMathProblem = (mode: MathMode, grade: GradeId = 3): Problem => {
  if (grade === 1) {
    const a = Math.floor(Math.random() * 11) + 5;
    const b = Math.floor(Math.random() * Math.max(2, mode === 'addsub' ? 9 : 5)) + 1;
    return Math.random() > .5 ? { question:`${a} + ${b} =`,answer:a+b,explanation:'从较大的数继续往后数' } : { question:`${a} - ${Math.min(a,b)} =`,answer:a-Math.min(a,b),explanation:'用数一数或画图帮助计算' };
  }
  if (grade === 5 && mode !== 'muldiv') {
    const a = Math.floor(Math.random() * 90) / 10 + 1;
    const b = Math.floor(Math.random() * 50) / 10 + 1;
    return { question:`${a.toFixed(1)} + ${b.toFixed(1)} =`,answer:rounded(a+b),explanation:'小数点要对齐' };
  }
  if (grade === 6 && mode === 'mixed') {
    const percent = [10,20,25,50][Math.floor(Math.random()*4)];
    const base = (Math.floor(Math.random()*9)+1)*20;
    return { question:`${base} 的 ${percent}% 是多少？`,answer:base*percent/100,explanation:`${base} × ${percent} ÷ 100` };
  }
  if (mode === 'addsub') {
    const limits = { 1:20,2:100,3:1000,4:100000,5:1000,6:10000 } as Record<GradeId,number>;
    const limit = limits[grade];
    const a = Math.floor(Math.random() * (limit * .7)) + Math.max(10, Math.floor(limit * .1));
    const b = Math.floor(Math.random() * Math.max(2, limit - a)) + 1;
    return Math.random() > .5 ? { question:`${a} + ${b} =`,answer:a+b,explanation:'相同数位对齐后计算' } : { question:`${a} - ${Math.min(a-1,b)} =`,answer:a-Math.min(a-1,b),explanation:'从个位开始计算，注意退位' };
  }
  if (mode === 'muldiv') {
    const factor = grade <= 2 ? 5 : grade === 3 ? 9 : grade === 4 ? 25 : 50;
    const a = Math.floor(Math.random()*factor)+1;
    const b = Math.floor(Math.random()*(grade <= 3 ? 9 : 20))+1;
    return Math.random() > .5 ? { question:`${a} × ${b} =`,answer:a*b,explanation:'可以把乘法看作相同加数的和' } : { question:`${a*b} ÷ ${a} =`,answer:b,explanation:'用乘法口诀检查除法' };
  }
  const a = Math.floor(Math.random()*(grade*4+8))+2;
  const b = Math.floor(Math.random()*8)+2;
  const c = Math.floor(Math.random()*25)+1;
  return Math.random() > .5 ? { question:`${a} × ${b} + ${c} =`,answer:a*b+c,explanation:'先乘除，后加减' } : { question:`${a*b} ÷ ${a} + ${c} =`,answer:b+c,explanation:'先计算除法，再计算加法' };
};

export const generateThinkProblem = (mode: ThinkMode, grade: GradeId = 3): Problem => {
  if (mode === 'pattern') { const start = Math.floor(Math.random()*15)+grade; const step = Math.floor(Math.random()*(grade+2))+2; return { question:`${[0,1,2,3].map((i) => start+i*step).join(', ')}, ?`,answer:start+4*step,explanation:`每次加 ${step}` }; }
  if (mode === 'logic') { const total = Math.floor(Math.random()*10)+10+grade; const front = Math.floor(Math.random()*(total-3))+2; return { question:`共 ${total} 人排队，小明前面有 ${front} 人，小明排第几？`,answer:front+1,explanation:`${front} + 1（算上自己）` }; }
  if (mode === 'word') { const money = Math.floor(Math.random()*30)+30+grade*10; const a = Math.floor(Math.random()*15)+5; const b = Math.floor(Math.random()*15)+3; return { question:`小红有 ${money} 元，买书花 ${a} 元，买文具花 ${b} 元，还剩多少元？`,answer:money-a-b,explanation:`${money} - ${a} - ${b}` }; }
  const a = Math.floor(Math.random()*50)+10; const answer = Math.floor(Math.random()*30)+5; return { question:`□ + ${a} = ${a+answer}`,answer,explanation:`${a+answer} - ${a}` };
};

function Quiz({ kind, mode, timed, notify }: { kind: 'math' | 'think'; mode: MathMode | ThinkMode; timed: boolean; notify: (message: string, celebrate?: boolean) => void }) {
  const { gradeDaily, updateGradeDaily, state } = useAppStore();
  const saved = gradeDaily[kind];
  const grade = state.profile.selectedGrade;
  const [running,setRunning] = useState(false);
  const [index,setIndex] = useState(0);
  const [score,setScore] = useState(0);
  const [combo,setCombo] = useState(0);
  const [timeLeft,setTimeLeft] = useState(90);
  const [problem,setProblem] = useState<Problem | null>(null);
  const [answer,setAnswer] = useState('');
  const [feedback,setFeedback] = useState('');
  const timeoutRef = useRef<number | null>(null);
  const finishRef = useRef<() => void>(() => undefined);
  useEffect(() => () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); }, []);
  useEffect(() => {
    if (!running || !timed) return;
    const timer = window.setInterval(() => setTimeLeft((value) => {
      if (value <= 1) { window.clearInterval(timer); window.setTimeout(() => finishRef.current(), 0); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [running,timed]);
  const nextProblem = () => { setProblem(kind === 'math' ? generateMathProblem(mode as MathMode,grade) : generateThinkProblem(mode as ThinkMode,grade)); setAnswer(''); setFeedback(''); };
  const start = () => { setRunning(true); setIndex(0); setScore(0); setCombo(0); setTimeLeft(90); nextProblem(); };
  const finish = (finalScore: number) => {
    setRunning(false); setProblem(null);
    updateGradeDaily((daily) => ({ ...daily, [kind]: { ...daily[kind], score:Math.max(daily[kind].score,finalScore), completed: finalScore >= 6 } }));
    notify(finalScore >= 6 ? `闯关成功，答对 ${finalScore} 题` : `答对 ${finalScore} 题，继续练习`, finalScore >= 6);
  };
  finishRef.current = () => finish(score);
  const submit = () => {
    if (!problem || answer.trim() === '' || feedback) return;
    const correct = Math.abs(Number(answer) - problem.answer) < .001;
    const nextScore = score + (correct ? 1 : 0);
    const nextCombo = correct ? combo + 1 : 0;
    setScore(nextScore); setCombo(nextCombo); setFeedback(correct ? `${nextCombo >= 3 ? `连击 ${nextCombo}！` : '答对了！'}` : `正确答案是 ${problem.answer}（${problem.explanation ?? '再想一想'}）`);
    if (correct) notify(nextCombo >= 3 ? `连续答对 ${nextCombo} 题！` : '答对了！', nextCombo >= 3);
    timeoutRef.current = window.setTimeout(() => { const nextIndex = index + 1; if (nextIndex >= 10) finish(nextScore); else { setIndex(nextIndex); nextProblem(); } }, correct ? 650 : 1400);
  };
  if (!running) return <div className="quiz-area"><div className="quiz-result">{saved.score > 0 && <><strong>{saved.score}/10</strong><span>{saved.completed ? '今日已通关' : '今日练习记录'}</span></>}<p>{timed ? '90 秒限时挑战' : '每轮 10 题'}，答对 6 题得 5 币，满分得 8 币</p></div><button className="button primary large" onClick={start}>{saved.score ? '再来一轮' : '开始挑战'}</button></div>;
  return <div className="quiz-area"><div className="quiz-meta"><span>第 {index+1}/10 题 · 已答对 {score} 题</span>{timed&&<span className="timer-pill"><Clock3/> {timeLeft}s</span>}{combo>=2&&<span className="combo-pill"><Zap/> {combo} 连击</span>}</div><div className="quiz-question">{problem?.question}</div><div className="answer-row"><input autoFocus inputMode="decimal" value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submit(); }} aria-label="答案" /><button className="button primary" onClick={submit} disabled={Boolean(feedback)}>确定</button></div><button className="hint-button" onClick={() => problem?.explanation && setFeedback(`提示：${problem.explanation}`)} disabled={Boolean(feedback)}><Lightbulb/>提示</button><div className={`feedback ${feedback.includes('答对') || feedback.includes('连击') ? 'correct' : 'wrong'}`}>{feedback}</div></div>;
}

export default function MathPage({ notify }: { notify: (message: string, celebrate?: boolean) => void }) {
  const { state, gradeDaily, updateGradeDaily } = useAppStore();
  const [section,setSection] = useState<'math'|'think'>('math');
  const [timed,setTimed] = useState(false);
  const [unit,setUnit] = useState(0);
  const mode = gradeDaily[section].mode;
  const mathModes: Array<[MathMode,string]> = state.profile.selectedGrade <= 2 ? [['addsub','基础加减'],['muldiv','乘除启蒙'],['mixed','综合练习']] : [['addsub','数与运算'],['muldiv','乘除训练'],['mixed','综合应用']];
  const thinkModes: Array<[ThinkMode,string]> = [['pattern','找规律填数'],['logic','逻辑推理'],['word','生活应用'],['puzzle','数字谜题']];
  const modes = section === 'math' ? mathModes : thinkModes;
  const units = getMathUnits(state.profile.selectedGrade,state.profile.selectedTerm);
  return <div><SectionTitle icon="⬡">{gradeLabel(state.profile.selectedGrade)}数学大闯关</SectionTitle><section className="subject-directory"><header><div><Calculator/><span><strong>{termLabel(state.profile.selectedTerm)}知识地图</strong><small>选择单元后开始对应难度练习</small></span></div><b>{unit+1}/{units.length}</b></header><div>{units.map((item,index)=><button key={item.id} className={unit===index?'active':''} onClick={()=>setUnit(index)}><span>{item.unit}</span><strong>{item.title}</strong></button>)}</div></section><div className="segmented"><button className={section === 'math' ? 'active' : ''} onClick={() => setSection('math')}><Calculator />计算闯关</button><button className={section === 'think' ? 'active' : ''} onClick={() => setSection('think')}><Brain />思维挑战</button></div><div className="challenge-toolbar"><div className="tab-row">{modes.map(([id,label]) => <button key={id} className={mode === id ? 'active' : ''} onClick={() => updateGradeDaily((daily) => ({ ...daily, [section]: { ...daily[section], mode:id } }))}>{label}</button>)}</div><label className="toggle-control"><input type="checkbox" checked={timed} onChange={(event)=>setTimed(event.target.checked)}/><span>限时 90 秒</span></label></div><Quiz key={`${state.profile.selectedGrade}-${state.profile.selectedTerm}-${section}-${mode}-${timed}`} kind={section} mode={mode} timed={timed} notify={notify} /></div>;
}
