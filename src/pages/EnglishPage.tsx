import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Volume2 } from 'lucide-react';
import { DAILY_PHRASES, ENGLISH_LEVELS } from '../data';
import { useAppStore } from '../store';
import type { EnglishWord } from '../types';
import { CheckRow, SectionTitle, SpeakButton, speak } from '../ui';

type GameMode = 'match' | 'spell' | 'memory';
interface MemoryCard { id:string; match:string; text:string; face:'en'|'cn' }

const shuffled = <T,>(items: T[]) => [...items].sort(() => Math.random() - .5);

export default function EnglishPage({ notify }: { notify: (message: string, celebrate?: boolean) => void }) {
  const { state, updateDaily, updateProfile } = useAppStore();
  const english = state.daily.english;
  const [tab,setTab] = useState<'learn'|'game'>('learn');
  const [cardIndex,setCardIndex] = useState(0);
  const [flipped,setFlipped] = useState(false);
  const [mode,setMode] = useState<GameMode>('match');
  const [gameWords,setGameWords] = useState<EnglishWord[]>([]);
  const [round,setRound] = useState(0);
  const [score,setScore] = useState(0);
  const [feedback,setFeedback] = useState('');
  const [spell,setSpell] = useState('');
  const [memoryCards,setMemoryCards] = useState<MemoryCard[]>([]);
  const [memoryOpen,setMemoryOpen] = useState<string[]>([]);
  const [memoryMatched,setMemoryMatched] = useState<string[]>([]);
  const levelWords = ENGLISH_LEVELS.find((entry) => entry.level === english.gameLevel)?.words ?? ENGLISH_LEVELS[0].words;
  const todayWords = useMemo(() => {
    const indices = english.todayWords.length ? english.todayWords : [0,1,2,3,4,5];
    return indices.map((index) => levelWords[index]).filter(Boolean);
  }, [english.todayWords,levelWords]);
  const phrases = useMemo(() => { const seed = Number(state.daily.date.replace(/-/g,'')); return [DAILY_PHRASES[seed % DAILY_PHRASES.length], DAILY_PHRASES[(seed+7) % DAILY_PHRASES.length]]; }, [state.daily.date]);

  const refreshWords = () => {
    const indices = shuffled(levelWords.map((_,index) => index)).slice(0,6);
    updateDaily((daily) => ({ ...daily,english:{ ...daily.english,todayWords:indices } }));
    setCardIndex(0); setFlipped(false); notify('已刷新今日单词');
  };
  const finishGame = (finalScore: number, total: number) => {
    const passed = finalScore >= Math.ceil(total*.6);
    if (passed) {
      updateDaily((daily) => ({ ...daily,english:{ ...daily.english,learnDone:true,gameDone:true,gameScore:finalScore } }));
      updateProfile((profile) => {
        const done = profile.wordGame.done.includes(english.gameLevel) ? profile.wordGame.done : [...profile.wordGame.done,english.gameLevel];
        const unlocked = finalScore === total ? Math.min(6,Math.max(profile.wordGame.unlocked,english.gameLevel+1)) : profile.wordGame.unlocked;
        return { ...profile,wordGame:{ done,unlocked } };
      });
    }
    setRound(total); notify(passed ? `英语闯关成功，答对 ${finalScore} 题` : `答对 ${finalScore} 题，再试一次`,passed);
  };
  const startGame = () => {
    const words = shuffled(todayWords).slice(0,5);
    setGameWords(words); setRound(0); setScore(0); setFeedback(''); setSpell(''); setMemoryMatched([]); setMemoryOpen([]);
    if (mode === 'memory') setMemoryCards(shuffled(words.flatMap((word) => [{ id:`${word.en}-en`,match:word.en,text:word.en,face:'en' as const },{ id:`${word.en}-cn`,match:word.en,text:word.cn,face:'cn' as const }])));
  };
  const answer = (correct: boolean) => {
    if (feedback) return;
    const nextScore = score + (correct ? 1 : 0); setScore(nextScore); setFeedback(correct ? '太棒了！' : `正确答案是 ${gameWords[round].en}`);
    window.setTimeout(() => { const next = round+1; setFeedback('');setSpell(''); if (next >= gameWords.length) finishGame(nextScore,gameWords.length); else setRound(next); },correct ? 500 : 900);
  };
  const flipMemory = (card: MemoryCard) => {
    if (memoryOpen.length >= 2 || memoryOpen.includes(card.id) || memoryMatched.includes(card.id)) return;
    const open = [...memoryOpen,card.id]; setMemoryOpen(open);
    if (open.length === 2) {
      const first = memoryCards.find((item) => item.id === open[0]);
      if (first && first.match === card.match && first.face !== card.face) {
        const matched = [...memoryMatched,...open]; setMemoryMatched(matched); setMemoryOpen([]); setScore((value) => value+1); notify('配对成功',true);
        if (matched.length === memoryCards.length) window.setTimeout(() => finishGame(gameWords.length,gameWords.length),500);
      } else window.setTimeout(() => setMemoryOpen([]),700);
    }
  };
  const current = todayWords[cardIndex] ?? todayWords[0];
  const gameCurrent = gameWords[round];
  const gameFinished = gameWords.length > 0 && round >= gameWords.length;

  return <div>
    <SectionTitle icon="⛏">英语大冒险</SectionTitle>
    <div className="segmented"><button className={tab === 'learn' ? 'active' : ''} onClick={() => setTab('learn')}>单词学习</button><button className={tab === 'game' ? 'active' : ''} onClick={() => setTab('game')}>闯关游戏</button></div>
    <div className="level-row">{ENGLISH_LEVELS.map(({level}) => { const unlocked = state.profile.wordGame.unlocked >= level; const done = state.profile.wordGame.done.includes(level); return <button key={level} disabled={!unlocked} className={`${english.gameLevel === level ? 'active' : ''} ${done ? 'done' : ''}`} onClick={() => updateDaily((daily) => ({ ...daily,english:{ ...daily.english,gameLevel:level,todayWords:[] } }))}>{done ? '✓' : level}</button>; })}</div>
    {tab === 'learn' ? <>
      <section className="panel"><header className="simple-heading"><div><h2>每日口语</h2><p>听一听，再跟读</p></div></header><div className="phrase-grid">{phrases.map((phrase) => <div className="phrase-card" key={phrase.en}><span>{phrase.emoji}</span><div><strong>{phrase.en}</strong><small>{phrase.cn}</small></div><SpeakButton text={phrase.en} lang="en-US" /></div>)}</div></section>
      <section className="panel learn-panel"><header className="simple-heading"><div><h2>今日单词 <small>({todayWords.length} 个)</small></h2></div><button className="icon-btn" title="换一批" onClick={refreshWords}><RefreshCw /></button></header>
        {current && <div className={`flashcard ${flipped ? 'flipped' : ''}`} role="button" tabIndex={0} onClick={() => setFlipped((value) => !value)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setFlipped((value) => !value); }}><span>{current.emoji}</span><strong>{flipped ? current.cn : current.en}</strong><small>{flipped ? current.en : '点击查看中文'}</small><button className="icon-btn" onClick={(event) => { event.stopPropagation(); speak(current.en,'en-US'); }} title="朗读"><Volume2 /></button></div>}
        <div className="flash-nav"><button className="icon-btn" title="上一个" onClick={() => { setCardIndex((cardIndex-1+todayWords.length)%todayWords.length);setFlipped(false); }}><ChevronLeft /></button><span>{cardIndex+1} / {todayWords.length}</span><button className="icon-btn" title="下一个" onClick={() => { setCardIndex((cardIndex+1)%todayWords.length);setFlipped(false); }}><ChevronRight /></button></div>
        <button className="button primary" onClick={() => { updateDaily((daily) => ({ ...daily,english:{ ...daily.english,learnDone:true } }));setTab('game'); }}>学完了，去闯关</button>
      </section>
      <section className="panel"><CheckRow checked={english.reading} label="完成今日 ABC 阅读" detail="绘本、分级读物或课外英语阅读" onChange={() => updateDaily((daily) => ({ ...daily,english:{ ...daily.english,reading:!daily.english.reading } }))} /><input className="wide-input" placeholder="今天读了什么？" value={english.book} onChange={(event) => updateDaily((daily) => ({ ...daily,english:{ ...daily.english,book:event.target.value } }))} /></section>
    </> : <section className="panel game-panel">
      <div className="tab-row"><button className={mode === 'match' ? 'active' : ''} onClick={() => setMode('match')}>看图选词</button><button className={mode === 'spell' ? 'active' : ''} onClick={() => setMode('spell')}>拼写挑战</button><button className={mode === 'memory' ? 'active' : ''} onClick={() => setMode('memory')}>翻牌配对</button></div>
      {!gameWords.length || gameFinished ? <div className="game-start">{gameFinished && <div className="game-score"><strong>{score}/{gameWords.length}</strong><span>{score >= Math.ceil(gameWords.length*.6) ? '闯关成功' : '继续加油'}</span></div>}<button className="button primary large" onClick={startGame}>{gameWords.length ? '再来一轮' : '开始闯关'}</button></div> : mode === 'memory' ? <><div className="quiz-meta">找到 {gameWords.length} 对中英文</div><div className="memory-grid">{memoryCards.map((card) => { const open = memoryOpen.includes(card.id) || memoryMatched.includes(card.id); return <button key={card.id} className={memoryMatched.includes(card.id) ? 'matched' : ''} onClick={() => flipMemory(card)}>{open ? card.text : '?'}</button>; })}</div></> : gameCurrent && <div className="game-question"><div className="quiz-meta">第 {round+1}/{gameWords.length} 词</div><span className="game-emoji">{gameCurrent.emoji}</span><strong>{gameCurrent.cn}</strong>{mode === 'match' ? <div className="option-grid">{shuffled([gameCurrent,...levelWords.filter((word) => word.en !== gameCurrent.en).slice(0,3)]).map((word) => <button key={word.en} disabled={Boolean(feedback)} onClick={() => answer(word.en === gameCurrent.en)}>{word.en}</button>)}</div> : <div className="answer-row"><input value={spell} onChange={(event) => setSpell(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') answer(spell.trim().toLowerCase() === gameCurrent.en); }} /><button className="button primary" onClick={() => answer(spell.trim().toLowerCase() === gameCurrent.en)}>确定</button></div>}<div className={`feedback ${feedback.startsWith('太棒') ? 'correct' : 'wrong'}`}>{feedback}</div></div>}
    </section>}
  </div>;
}
