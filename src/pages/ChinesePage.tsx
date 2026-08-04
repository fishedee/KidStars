import { useMemo, useState } from 'react';
import { BookOpen, Plus, Volume2 } from 'lucide-react';
import { POEMS, TEXTBOOK_VOCAB } from '../data';
import { useAppStore } from '../store';
import { HanziCanvas, Modal, SectionTitle, SpeakButton, speak } from '../ui';

interface SelectedChar { char: string; pinyin: string; customId?: string }

export default function ChinesePage({ notify }: { notify: (message: string, celebrate?: boolean) => void }) {
  const { state, updateDaily } = useAppStore();
  const chinese = state.daily.chinese;
  const [poemOffset,setPoemOffset] = useState(0);
  const [reviewLesson,setReviewLesson] = useState(chinese.currentLesson);
  const [previewLesson,setPreviewLesson] = useState(Math.min(chinese.currentLesson + 1, TEXTBOOK_VOCAB.length - 1));
  const [selected,setSelected] = useState<SelectedChar | null>(null);
  const [customChar,setCustomChar] = useState('');
  const [customPinyin,setCustomPinyin] = useState('');
  const poemIndex = (Math.floor(Date.now() / 86400000) + poemOffset + POEMS.length) % POEMS.length;
  const poem = POEMS[poemIndex];
  const review = TEXTBOOK_VOCAB[reviewLesson];
  const preview = TEXTBOOK_VOCAB[previewLesson];
  const poemDone = Boolean(chinese.poemsDone[poem.title]);

  const toggleWord = (char: string, customId?: string) => {
    updateDaily((daily) => customId ? {
      ...daily, chinese: { ...daily.chinese, customVocab: daily.chinese.customVocab.map((item) => item.id === customId ? { ...item, done:!item.done } : item) },
    } : {
      ...daily, chinese: { ...daily.chinese, vocabDone: { ...daily.chinese.vocabDone, [char]:!daily.chinese.vocabDone[char] } },
    });
    notify('生字进度已更新', true);
  };
  const addCustom = () => {
    const char = customChar.trim();
    if (!char) return;
    updateDaily((daily) => ({ ...daily, chinese: { ...daily.chinese, customVocab:[...daily.chinese.customVocab,{ id:crypto.randomUUID(),char,pinyin:customPinyin.trim(),done:false }] } }));
    setCustomChar(''); setCustomPinyin(''); notify('已添加自定义生字');
  };
  const previewWords = useMemo(() => [...preview.words, ...chinese.customVocab.map((item) => [item.char,item.pinyin] as [string,string])], [preview, chinese.customVocab]);

  return <div>
    <SectionTitle icon="▣">语文小课堂</SectionTitle>
    <section className="poem-feature">
      <div className="poem-card">
        <span className="eyebrow">今日古诗</span><h2>《{poem.title}》</h2><small>{poem.author}</small>
        <p>{poem.content}</p><div className="poem-note">{poem.note}</div>
        <div className="action-row"><button className="button secondary" onClick={() => speak(poem.content)}> <Volume2 />朗读</button><button className={`button ${poemDone ? 'success' : 'primary'}`} onClick={() => { updateDaily((daily) => ({ ...daily,chinese:{ ...daily.chinese,poemsDone:{ ...daily.chinese.poemsDone,[poem.title]:!daily.chinese.poemsDone[poem.title] } } })); notify(poemDone ? '已取消背诵标记' : '背诵完成', !poemDone); }}>{poemDone ? '已背诵' : '标记背诵'}</button><button className="button secondary" onClick={() => setPoemOffset((value) => value + 1)}>换一首</button></div>
      </div>
    </section>
    <section className="panel"><header className="panel-heading"><div><span className="panel-icon red"><BookOpen /></span><div><h2>今日任务</h2><p>复习旧知，预习新课</p></div></div><span className="reward-badge">每项 +2 币</span></header>
      <div className="task-list">
        <button className={chinese.taskReview ? 'done' : ''} onClick={() => updateDaily((daily) => ({ ...daily,chinese:{ ...daily.chinese,taskReview:!daily.chinese.taskReview } }))}><span>{chinese.taskReview ? '✓' : ''}</span><div><strong>完成今日复习</strong><small>认读本课生字</small></div></button>
        <button className={chinese.taskPreview ? 'done' : ''} onClick={() => updateDaily((daily) => ({ ...daily,chinese:{ ...daily.chinese,taskPreview:!daily.chinese.taskPreview } }))}><span>{chinese.taskPreview ? '✓' : ''}</span><div><strong>完成明日预习</strong><small>先读一遍下一课</small></div></button>
      </div>
    </section>
    <VocabSection title="今日复习" subtitle="点击生字查看笔顺与发音" selectedLesson={reviewLesson} onLesson={setReviewLesson} words={review.words} done={chinese.vocabDone} onSelect={(char,pinyin) => setSelected({char,pinyin})} />
    <VocabSection title="明日预习" subtitle="提前认识下一课生字" selectedLesson={previewLesson} onLesson={setPreviewLesson} words={previewWords} done={chinese.vocabDone} onSelect={(char,pinyin) => { const custom = chinese.customVocab.find((item) => item.char === char); setSelected({char,pinyin,customId:custom?.id}); }} />
    <section className="panel"><header className="simple-heading"><h2>添加自定义生字</h2></header><div className="add-form"><input maxLength={4} value={customChar} onChange={(event) => setCustomChar(event.target.value)} placeholder="生字" /><input value={customPinyin} onChange={(event) => setCustomPinyin(event.target.value)} placeholder="拼音" onKeyDown={(event) => { if (event.key === 'Enter') addCustom(); }} /><button className="button primary" onClick={addCustom}><Plus />添加</button></div></section>
    <section className="panel"><header className="simple-heading"><h2>古诗背诵清单</h2></header><div className="poem-list">{POEMS.map((item) => { const toggle = () => updateDaily((daily) => ({ ...daily,chinese:{ ...daily.chinese,poemsDone:{ ...daily.chinese.poemsDone,[item.title]:!daily.chinese.poemsDone[item.title] } } })); return <div role="button" tabIndex={0} key={item.title} className={`poem-entry ${chinese.poemsDone[item.title] ? 'done' : ''}`} onClick={toggle} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') toggle(); }}><span>{chinese.poemsDone[item.title] ? '✓' : '○'}</span><strong>《{item.title}》</strong><small>{item.author}</small><SpeakButton text={item.content} /></div>; })}</div></section>
    {selected && <Modal title={`${selected.char} · ${selected.pinyin || '未注音'}`} onClose={() => setSelected(null)}><div className="character-detail"><HanziCanvas character={selected.char[0]} /><div className="character-copy"><div className="character-big">{selected.char}</div><div className="pinyin">{selected.pinyin || '未注音'}</div><button className="button secondary" onClick={() => speak(selected.char)}><Volume2 />听发音</button><button className={`button ${(selected.customId ? chinese.customVocab.find((item) => item.id === selected.customId)?.done : chinese.vocabDone[selected.char]) ? 'success' : 'primary'}`} onClick={() => toggleWord(selected.char,selected.customId)}>更新掌握状态</button></div></div></Modal>}
  </div>;
}

function VocabSection({ title,subtitle,selectedLesson,onLesson,words,done,onSelect }: { title:string;subtitle:string;selectedLesson:number;onLesson:(value:number)=>void;words:Array<[string,string]>;done:Record<string,boolean>;onSelect:(char:string,pinyin:string)=>void }) {
  return <section className="panel vocab-section"><header className="panel-heading"><div><span className="panel-icon gold"><BookOpen /></span><div><h2>{title}</h2><p>{subtitle}</p></div></div></header><div className="lesson-tabs">{TEXTBOOK_VOCAB.map((lesson,index) => <button key={lesson.title} className={selectedLesson === index ? 'active' : ''} onClick={() => onLesson(index)}>{index+1}</button>)}</div><div className="vocab-grid">{words.map(([char,pinyin],index) => <button key={`${char}-${index}`} className={done[char] ? 'done' : ''} onClick={() => onSelect(char,pinyin)}><strong>{char}</strong><span>{pinyin}</span>{done[char] && <i>✓</i>}</button>)}</div></section>;
}
