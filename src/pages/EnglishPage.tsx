import { useMemo, useState } from 'react';
import { Eye, EyeOff, RefreshCw, Volume2 } from 'lucide-react';
import { getEnglishCourses, gradeLabel, termLabel } from '../curriculum';
import { useAppStore } from '../store';
import type { EnglishContentKind, EnglishCourseItem, EnglishWord } from '../types';
import { CheckRow, SectionTitle, speak } from '../ui';

type GameMode = 'match' | 'spell' | 'memory';
type SpeechSpeed = 'normal' | 'slow';
interface MemoryCard { id: string; match: string; text: string; face: 'en' | 'cn' }

const contentLabels: Record<EnglishContentKind, string> = {
  word: '单词',
  phrase: '词组',
  sentence: '句子',
  pattern: '句型',
};

const shuffled = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

export default function EnglishPage({ notify }: { notify: (message: string, celebrate?: boolean) => void }) {
  const { state, gradeDaily, updateGradeDaily, updateProfile, wordGame } = useAppStore();
  const english = gradeDaily.english;
  const grade = state.profile.selectedGrade;
  const courses = useMemo(() => getEnglishCourses(grade, state.profile.selectedTerm), [grade, state.profile.selectedTerm]);
  const [tab, setTab] = useState<'learn' | 'game'>('learn');
  const [contentKind, setContentKind] = useState<EnglishContentKind>('word');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<SpeechSpeed>('normal');
  const [showChinese, setShowChinese] = useState(true);
  const [mode, setMode] = useState<GameMode>('match');
  const [gameWords, setGameWords] = useState<EnglishWord[]>([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [spell, setSpell] = useState('');
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [memoryOpen, setMemoryOpen] = useState<string[]>([]);
  const [memoryMatched, setMemoryMatched] = useState<string[]>([]);

  const course = courses.find((entry) => entry.level === english.gameLevel) ?? courses[0];
  const courseItems = useMemo(() => Object.values(course.items).flat(), [course]);
  const visibleItems = course.items[contentKind];
  const activeItem = visibleItems.find((item) => item.id === activeItemId) ?? visibleItems[0];
  const readItems = wordGame.readItems;
  const readSet = useMemo(() => new Set(readItems), [readItems]);
  const readCount = courseItems.filter((item) => readSet.has(item.id)).length;
  const progress = Math.round(readCount / courseItems.length * 100);
  const speechRate = speechSpeed === 'slow' ? 0.55 : 0.8;
  const levelWords: EnglishWord[] = course.items.word.map(({ en, cn, emoji }) => ({ en, cn, emoji }));
  const todayWords = useMemo(() => {
    const indices = english.todayWords.length ? english.todayWords : [0, 1, 2, 3, 4, 5];
    return indices.map((index) => levelWords[index]).filter(Boolean);
  }, [english.todayWords, levelWords]);

  const chooseCourse = (level: number) => {
    updateGradeDaily((daily) => ({ ...daily, english: { ...daily.english, gameLevel: level, todayWords: [] } }));
    setContentKind('word');
    setActiveItemId(null);
    setGameWords([]);
  };

  const readCourseItem = (item: EnglishCourseItem) => {
    setActiveItemId(item.id);
    const canSpeak = speak(item.spokenText ?? item.en, 'en-US', speechRate);
    if (!canSpeak) notify('当前浏览器不支持语音播放');
    const nextReadItems = readSet.has(item.id) ? readItems : [...readItems, item.id];
    if (!readSet.has(item.id)) {
      updateProfile((profile) => {
        const nextGame = { ...wordGame, readItems: nextReadItems };
        return { ...profile, wordGameByGrade: { ...profile.wordGameByGrade, [grade]: nextGame }, wordGame: grade === 3 ? nextGame : profile.wordGame };
      });
    }
    const completed = courseItems.every((courseItem) => nextReadItems.includes(courseItem.id));
    if (completed && !english.learnDone) {
      updateGradeDaily((daily) => ({ ...daily, english: { ...daily.english, learnDone: true } }));
      notify('本集点读完成，去闯关吧！', true);
    }
  };

  const refreshWords = () => {
    const indices = shuffled(levelWords.map((_, index) => index)).slice(0, 6);
    updateGradeDaily((daily) => ({ ...daily, english: { ...daily.english, todayWords: indices } }));
    setGameWords([]);
    notify('已刷新本轮单词');
  };

  const finishGame = (finalScore: number, total: number) => {
    const passed = finalScore >= Math.ceil(total * 0.6);
    if (passed) {
      updateGradeDaily((daily) => ({ ...daily, english: { ...daily.english, learnDone: true, gameDone: true, gameScore: finalScore } }));
      updateProfile((profile) => {
        const current = profile.wordGameByGrade[grade] ?? { unlocked: 1, done: [], readItems: [] };
        const done = current.done.includes(english.gameLevel) ? current.done : [...current.done, english.gameLevel];
        const unlocked = finalScore === total ? Math.min(courses.length, Math.max(current.unlocked, english.gameLevel + 1)) : current.unlocked;
        const nextGame = { ...current, done, unlocked };
        return { ...profile, wordGameByGrade: { ...profile.wordGameByGrade, [grade]: nextGame }, wordGame: grade === 3 ? nextGame : profile.wordGame };
      });
    }
    setRound(total);
    notify(passed ? `英语闯关成功，答对 ${finalScore} 题` : `答对 ${finalScore} 题，再试一次`, passed);
  };

  const startGame = () => {
    const words = shuffled(todayWords).slice(0, 5);
    setGameWords(words);
    setRound(0);
    setScore(0);
    setFeedback('');
    setSpell('');
    setMemoryMatched([]);
    setMemoryOpen([]);
    if (mode === 'memory') {
      setMemoryCards(shuffled(words.flatMap((word) => [
        { id: `${word.en}-en`, match: word.en, text: word.en, face: 'en' as const },
        { id: `${word.en}-cn`, match: word.en, text: word.cn, face: 'cn' as const },
      ])));
    }
  };

  const answer = (correct: boolean) => {
    if (feedback) return;
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    setFeedback(correct ? '太棒了！' : `正确答案是 ${gameWords[round].en}`);
    window.setTimeout(() => {
      const next = round + 1;
      setFeedback('');
      setSpell('');
      if (next >= gameWords.length) finishGame(nextScore, gameWords.length);
      else setRound(next);
    }, correct ? 500 : 900);
  };

  const flipMemory = (card: MemoryCard) => {
    if (memoryOpen.length >= 2 || memoryOpen.includes(card.id) || memoryMatched.includes(card.id)) return;
    const open = [...memoryOpen, card.id];
    setMemoryOpen(open);
    if (open.length === 2) {
      const first = memoryCards.find((item) => item.id === open[0]);
      if (first && first.match === card.match && first.face !== card.face) {
        const matched = [...memoryMatched, ...open];
        setMemoryMatched(matched);
        setMemoryOpen([]);
        setScore((value) => value + 1);
        notify('配对成功', true);
        if (matched.length === memoryCards.length) window.setTimeout(() => finishGame(gameWords.length, gameWords.length), 500);
      } else {
        window.setTimeout(() => setMemoryOpen([]), 700);
      }
    }
  };

  const gameCurrent = gameWords[round];
  const gameFinished = gameWords.length > 0 && round >= gameWords.length;

  return (
    <div className="english-page">
      <SectionTitle icon="🎧">{gradeLabel(grade)}英语大冒险</SectionTitle>
      <div className="segmented english-mode-switch" aria-label="英语学习模式">
        <button className={tab === 'learn' ? 'active' : ''} onClick={() => setTab('learn')}>课程点读</button>
        <button className={tab === 'game' ? 'active' : ''} onClick={() => setTab('game')}>闯关游戏</button>
      </div>

      <div className="level-row english-course-switcher" aria-label={`${termLabel(state.profile.selectedTerm)}英语课程`}>
        {courses.map((entry) => {
          const unlocked = wordGame.unlocked >= entry.level;
          const done = wordGame.done.includes(entry.level);
          return (
            <button
              key={entry.level}
              disabled={!unlocked}
              className={`${english.gameLevel === entry.level ? 'active' : ''} ${done ? 'done' : ''}`}
              onClick={() => chooseCourse(entry.level)}
              title={unlocked ? `第 ${entry.level} 集：${entry.title}` : `完成上一关满分解锁第 ${entry.level} 集`}
              aria-label={`第 ${entry.level} 集 ${entry.title}${done ? '，已通关' : ''}${unlocked ? '' : '，未解锁'}`}
            >
              <span>{entry.emoji}</span><strong>{entry.level}</strong>
            </button>
          );
        })}
      </div>

      {tab === 'learn' ? (
        <section className="english-study-shell" aria-label={`第 ${course.level} 集 ${course.title}`}>
          <header className="english-lesson-hero">
            <div className="english-lesson-copy">
              <span>第 {course.level} 集 · {course.title}</span>
              <h2>{course.englishTitle}</h2>
              <p>一起听 · 一起说</p>
            </div>
            <div className="english-progress-card">
              <div><span>本集进度</span><strong>{progress}%</strong><span>已点读 {readCount} / {courseItems.length} 项</span></div>
              <div className="english-progress-track" role="progressbar" aria-label="本集点读进度" aria-valuemin={0} aria-valuemax={courseItems.length} aria-valuenow={readCount}>
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>
          </header>

          <div className="english-content-tabs" role="tablist" aria-label="课程内容分类">
            {(Object.keys(contentLabels) as EnglishContentKind[]).map((kind) => (
              <button
                key={kind}
                role="tab"
                aria-selected={contentKind === kind}
                className={contentKind === kind ? 'active' : ''}
                onClick={() => { setContentKind(kind); setActiveItemId(null); }}
              >
                {contentLabels[kind]}
              </button>
            ))}
          </div>

          <div className="english-toolbar">
            <div className="english-now-playing" aria-live="polite"><span>{activeItem.emoji}</span><strong>{activeItem.en}</strong></div>
            <div className="english-speed-controls" aria-label="朗读速度">
              <button className={speechSpeed === 'normal' ? 'active' : ''} aria-pressed={speechSpeed === 'normal'} onClick={() => setSpeechSpeed('normal')}>正常</button>
              <button className={speechSpeed === 'slow' ? 'active' : ''} aria-pressed={speechSpeed === 'slow'} onClick={() => setSpeechSpeed('slow')}>慢速</button>
            </div>
            <button className="english-chinese-toggle" aria-pressed={!showChinese} onClick={() => setShowChinese((value) => !value)}>
              {showChinese ? <EyeOff /> : <Eye />}{showChinese ? '隐藏中文' : '显示中文'}
            </button>
          </div>

          <div className="english-study-grid">
            <div className="english-item-list" aria-label={`${contentLabels[contentKind]}列表`}>
              {visibleItems.map((item) => (
                <button
                  key={item.id}
                  className={`${activeItem.id === item.id ? 'active' : ''} ${readSet.has(item.id) ? 'read' : ''}`}
                  onClick={() => readCourseItem(item)}
                  aria-label={`点读 ${item.en}${showChinese ? `，${item.cn}` : ''}${readSet.has(item.id) ? '，已点读' : ''}`}
                >
                  <span>{item.emoji}</span>
                  <span><strong>{item.en}</strong>{showChinese && <small>{item.cn}</small>}</span>
                  <i aria-hidden="true">{readSet.has(item.id) ? '✓' : <Volume2 />}</i>
                </button>
              ))}
            </div>
            <button className={`english-feature-card ${readSet.has(activeItem.id) ? 'read' : ''}`} onClick={() => readCourseItem(activeItem)} aria-label={`再次点读 ${activeItem.en}`}>
              <span className="english-feature-status">{readSet.has(activeItem.id) ? '已点读 ✓' : '点击卡片点读'}</span>
              <span className="english-feature-emoji" aria-hidden="true">{activeItem.emoji}</span>
              <strong>{activeItem.en}</strong>
              {showChinese && <small>{activeItem.cn}</small>}
              <span className="english-feature-speaker" aria-hidden="true"><Volume2 /></span>
            </button>
          </div>

          <footer className="english-study-footer">
            <span>{readCount === courseItems.length ? '本集已完成，真棒！' : `再点读 ${courseItems.length - readCount} 项完成本集`}</span>
            <button className="button primary" onClick={() => setTab('game')}>去闯关</button>
          </footer>
        </section>
      ) : (
        <section className="panel game-panel english-game-panel">
          <header className="english-game-heading">
            <div><span>第 {course.level} 集</span><h2>{course.englishTitle}</h2></div>
            <button className="button secondary compact" onClick={refreshWords}><RefreshCw />换一批</button>
          </header>
          <div className="tab-row">
            <button className={mode === 'match' ? 'active' : ''} onClick={() => { setMode('match'); setGameWords([]); }}>看图选词</button>
            <button className={mode === 'spell' ? 'active' : ''} onClick={() => { setMode('spell'); setGameWords([]); }}>拼写挑战</button>
            <button className={mode === 'memory' ? 'active' : ''} onClick={() => { setMode('memory'); setGameWords([]); }}>翻牌配对</button>
          </div>
          {!gameWords.length || gameFinished ? (
            <div className="game-start">
              {gameFinished && <div className="game-score"><strong>{score}/{gameWords.length}</strong><span>{score >= Math.ceil(gameWords.length * 0.6) ? '闯关成功' : '继续加油'}</span></div>}
              <div className="english-game-preview">{todayWords.map((word) => <span key={word.en} title={word.en}>{word.emoji}</span>)}</div>
              <button className="button primary large" onClick={startGame}>{gameWords.length ? '再来一轮' : '开始闯关'}</button>
            </div>
          ) : mode === 'memory' ? (
            <><div className="quiz-meta">找到 {gameWords.length} 对中英文</div><div className="memory-grid">{memoryCards.map((card) => {
              const open = memoryOpen.includes(card.id) || memoryMatched.includes(card.id);
              return <button key={card.id} className={memoryMatched.includes(card.id) ? 'matched' : ''} onClick={() => flipMemory(card)}>{open ? card.text : '?'}</button>;
            })}</div></>
          ) : gameCurrent && (
            <div className="game-question">
              <div className="quiz-meta">第 {round + 1}/{gameWords.length} 词</div>
              <span className="game-emoji">{gameCurrent.emoji}</span>
              <strong>{gameCurrent.cn}</strong>
              {mode === 'match' ? (
                <div className="option-grid">{shuffled([gameCurrent, ...levelWords.filter((word) => word.en !== gameCurrent.en).slice(0, 3)]).map((word) => <button key={word.en} disabled={Boolean(feedback)} onClick={() => answer(word.en === gameCurrent.en)}>{word.en}</button>)}</div>
              ) : (
                <div className="answer-row"><input aria-label="拼写答案" value={spell} onChange={(event) => setSpell(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') answer(spell.trim().toLowerCase() === gameCurrent.en); }} /><button className="button primary" onClick={() => answer(spell.trim().toLowerCase() === gameCurrent.en)}>确定</button></div>
              )}
              <div className={`feedback ${feedback.startsWith('太棒') ? 'correct' : 'wrong'}`}>{feedback}</div>
            </div>
          )}
        </section>
      )}

      <section className="panel english-reading-panel">
        <CheckRow checked={english.reading} label="完成今日 ABC 阅读" detail="绘本、分级读物或课外英语阅读" onChange={() => updateGradeDaily((daily) => ({ ...daily, english: { ...daily.english, reading: !daily.english.reading } }))} />
        <input className="wide-input" aria-label="今日英语读物" placeholder="今天读了什么？" value={english.book} onChange={(event) => updateGradeDaily((daily) => ({ ...daily, english: { ...daily.english, book: event.target.value } }))} />
      </section>
    </div>
  );
}
