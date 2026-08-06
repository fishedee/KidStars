import { useMemo, useState } from 'react';
import { BookOpen, Eye, EyeOff, Plus, Volume2 } from 'lucide-react';
import { getChineseLessons, getChinesePoems, gradeLabel, termLabel } from '../curriculum';
import { useAppStore } from '../store';
import { HanziCanvas, Modal, SectionTitle, SpeakButton, speak } from '../ui';

interface SelectedChar { char: string; pinyin: string; lessonId: string; customId?: string }

export default function ChinesePage({ notify }: { notify: (message: string, celebrate?: boolean) => void }) {
  const { state, gradeDaily: chineseState, updateGradeDaily } = useAppStore();
  const grade = state.profile.selectedGrade;
  const term = state.profile.selectedTerm;
  const lessons = getChineseLessons(grade, term);
  const poems = getChinesePoems(grade, term);
  const [poemOffset,setPoemOffset] = useState(0);
  const [reviewLesson,setReviewLesson] = useState(Math.min(chineseState.chinese.currentLesson, lessons.length - 1));
  const [previewLesson,setPreviewLesson] = useState(Math.min(chineseState.chinese.currentLesson + 1, lessons.length - 1));
  const [selected,setSelected] = useState<SelectedChar | null>(null);
  const [customChar,setCustomChar] = useState('');
  const [customPinyin,setCustomPinyin] = useState('');
  const [showPinyin,setShowPinyin] = useState(true);
  const poemIndex = (Math.floor(Date.now() / 86400000) + poemOffset + poems.length) % Math.max(1,poems.length);
  const poem = poems[poemIndex] ?? poems[0];
  const review = lessons[reviewLesson] ?? lessons[0];
  const preview = lessons[previewLesson] ?? lessons[0];
  const poemDone = Boolean(poem && (chineseState.chinese.poemsDone[poem.id] || chineseState.chinese.poemsDone[poem.title]));
  const doneWord = (lessonId: string, char: string) => Boolean(chineseState.chinese.vocabDone[`${lessonId}:${char}`] || chineseState.chinese.vocabDone[char]);

  const toggleWord = (char: string, lessonId: string, customId?: string) => {
    updateGradeDaily((daily) => customId ? {
      ...daily, chinese: { ...daily.chinese, customVocab: daily.chinese.customVocab.map((item) => item.id === customId ? { ...item, done:!item.done } : item) },
    } : {
      ...daily, chinese: { ...daily.chinese, vocabDone: { ...daily.chinese.vocabDone, [`${lessonId}:${char}`]:!doneWord(lessonId,char) } },
    });
    notify('生字进度已更新', true);
  };
  const addCustom = () => {
    const char = customChar.trim();
    if (!char) return;
    updateGradeDaily((daily) => ({ ...daily, chinese: { ...daily.chinese, customVocab:[...daily.chinese.customVocab,{ id:crypto.randomUUID(),char,pinyin:customPinyin.trim(),done:false }] } }));
    setCustomChar(''); setCustomPinyin(''); notify('已添加自定义生字');
  };
  const previewWords = useMemo(() => [...(preview?.words ?? []), ...chineseState.chinese.customVocab.map((item) => [item.char,item.pinyin] as [string,string])], [preview, chineseState.chinese.customVocab]);

  return <div>
    <SectionTitle icon="▣">{gradeLabel(grade)}语文小课堂</SectionTitle>
    <section className="subject-directory chinese-directory"><header><div><BookOpen/><span><strong>{termLabel(term)}课文地图</strong><small>{lessons.length} 个单元 · 点击课文进入生字练习</small></span></div><div className="directory-controls"><button className="icon-btn" title={showPinyin ? '隐藏拼音' : '显示拼音'} onClick={() => setShowPinyin((value) => !value)}>{showPinyin ? <EyeOff/> : <Eye/>}</button></div></header><div>{lessons.map((item,index)=><button key={item.id} className={reviewLesson===index?'active':''} onClick={() => { setReviewLesson(index); updateGradeDaily((daily) => ({ ...daily, chinese: { ...daily.chinese, currentLesson:index } })); }}><span>{item.unit}</span><strong>{item.title.replace(/^\d+\.\s*/, '')}</strong><small>{item.words.length} 个生字</small></button>)}</div></section>
    {poem && <section className="poem-feature"><div className="poem-card"><span className="eyebrow">今日古诗 · {termLabel(term)}</span><h2>《{poem.title}》</h2><small>{poem.author}</small><p>{poem.content}</p><div className="poem-note">{poem.note}</div><div className="action-row"><button className="button secondary" onClick={() => speak(poem.content)}><Volume2 />朗读</button><button className={`button ${poemDone ? 'success' : 'primary'}`} onClick={() => { updateGradeDaily((daily) => ({ ...daily,chinese:{ ...daily.chinese,poemsDone:{ ...daily.chinese.poemsDone,[poem.id]:!poemDone } } })); notify(poemDone ? '已取消背诵标记' : '背诵完成', !poemDone); }}>{poemDone ? '已背诵' : '标记背诵'}</button><button className="button secondary" onClick={() => setPoemOffset((value) => value + 1)}>换一首</button></div></div></section>}
    <section className="panel"><header className="panel-heading"><div><span className="panel-icon red"><BookOpen /></span><div><h2>今日任务</h2><p>复习旧知，预习新课</p></div></div><span className="reward-badge">每项 +2 币</span></header><div className="task-list"><button className={chineseState.chinese.taskReview ? 'done' : ''} onClick={() => updateGradeDaily((daily) => ({ ...daily,chinese:{ ...daily.chinese,taskReview:!daily.chinese.taskReview } }))}><span>{chineseState.chinese.taskReview ? '✓' : ''}</span><div><strong>完成今日复习</strong><small>认读本课生字</small></div></button><button className={chineseState.chinese.taskPreview ? 'done' : ''} onClick={() => updateGradeDaily((daily) => ({ ...daily,chinese:{ ...daily.chinese,taskPreview:!daily.chinese.taskPreview } }))}><span>{chineseState.chinese.taskPreview ? '✓' : ''}</span><div><strong>完成明日预习</strong><small>先读一遍下一课</small></div></button></div></section>
    <VocabSection title="今日复习" subtitle="点击生字查看笔顺与发音" selectedLesson={reviewLesson} onLesson={setReviewLesson} lessons={lessons} words={review?.words ?? []} done={doneWord} onSelect={(char,pinyin) => setSelected({char,pinyin,lessonId:review?.id ?? ''})} showPinyin={showPinyin} />
    <VocabSection title="明日预习" subtitle="提前认识下一课生字" selectedLesson={previewLesson} onLesson={setPreviewLesson} lessons={lessons} words={previewWords} done={doneWord} onSelect={(char,pinyin) => { const custom = chineseState.chinese.customVocab.find((item) => item.char === char); setSelected({char,pinyin,lessonId:preview?.id ?? '',customId:custom?.id}); }} showPinyin={showPinyin} />
    <section className="panel"><header className="simple-heading"><h2>添加自定义生字</h2></header><div className="add-form"><input maxLength={4} value={customChar} onChange={(event) => setCustomChar(event.target.value)} placeholder="生字" /><input value={customPinyin} onChange={(event) => setCustomPinyin(event.target.value)} placeholder="拼音" onKeyDown={(event) => { if (event.key === 'Enter') addCustom(); }} /><button className="button primary" onClick={addCustom}><Plus />添加</button></div></section>
    <section className="panel"><header className="simple-heading"><h2>本册古诗背诵清单</h2></header><div className="poem-list">{poems.map((item) => { const done = Boolean(chineseState.chinese.poemsDone[item.id] || chineseState.chinese.poemsDone[item.title]); const toggle = () => updateGradeDaily((daily) => ({ ...daily,chinese:{ ...daily.chinese,poemsDone:{ ...daily.chinese.poemsDone,[item.id]:!done } } })); return <div role="button" tabIndex={0} key={item.id} className={`poem-entry ${done ? 'done' : ''}`} onClick={toggle} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') toggle(); }}><span>{done ? '✓' : '○'}</span><strong>《{item.title}》</strong><small>{item.author}</small><SpeakButton text={item.content} /></div>; })}</div></section>
    {selected && <Modal title={`${selected.char} · ${selected.pinyin || '未注音'}`} onClose={() => setSelected(null)}><div className="character-detail"><HanziCanvas character={selected.char[0]} /><div className="character-copy"><div className="character-big">{selected.char}</div><div className="pinyin">{selected.pinyin || '未注音'}</div><button className="button secondary" onClick={() => speak(selected.char)}><Volume2 />听发音</button><button className={`button ${(selected.customId ? chineseState.chinese.customVocab.find((item) => item.id === selected.customId)?.done : doneWord(selected.lessonId,selected.char)) ? 'success' : 'primary'}`} onClick={() => toggleWord(selected.char,selected.lessonId,selected.customId)}>更新掌握状态</button></div></div></Modal>}
  </div>;
}

function VocabSection({ title,subtitle,selectedLesson,onLesson,lessons,words,done,onSelect,showPinyin }: { title:string;subtitle:string;selectedLesson:number;onLesson:(value:number)=>void;lessons:ReturnType<typeof getChineseLessons>;words:Array<[string,string]>;done:(lessonId:string,char:string)=>boolean;onSelect:(char:string,pinyin:string)=>void;showPinyin:boolean }) {
  const lessonId = lessons[selectedLesson]?.id ?? '';
  return <section className="panel vocab-section"><header className="panel-heading"><div><span className="panel-icon gold"><BookOpen /></span><div><h2>{title}</h2><p>{subtitle}</p></div></div></header><div className="lesson-tabs">{lessons.map((lesson,index) => <button key={lesson.id} className={selectedLesson === index ? 'active' : ''} onClick={() => onLesson(index)}>{lesson.unit}</button>)}</div><div className="vocab-grid">{words.map(([char,pinyin],index) => <button key={`${char}-${index}`} className={done(lessonId,char) ? 'done' : ''} onClick={() => onSelect(char,pinyin)}><strong>{char}</strong>{showPinyin && <span>{pinyin}</span>}{done(lessonId,char) && <i>✓</i>}</button>)}</div></section>;
}
