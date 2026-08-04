import { useEffect, useRef, useState } from 'react';
import { BookOpen, Pause, Play, Plus, Square } from 'lucide-react';
import { useAppStore } from '../store';
import { CheckRow, Modal, SectionTitle } from '../ui';

const formatTime = (seconds: number) => `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;

export default function ReadingPage({ notify }: { notify: (message: string, celebrate?: boolean) => void }) {
  const { state, updateDaily, updateProfile } = useAppStore();
  const reading = state.daily.reading;
  const [running,setRunning] = useState(false);
  const [seconds,setSeconds] = useState(reading.minutes*60);
  const [adding,setAdding] = useState(false);
  const [title,setTitle] = useState('');
  const [author,setAuthor] = useState('');
  const [cover,setCover] = useState('');
  const intervalRef = useRef<number | null>(null);
  const selectedBook = state.profile.books.find((book) => book.id === reading.bookId);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => setSeconds((value) => value+1),1000);
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, [running]);
  useEffect(() => {
    const minutes = Math.floor(seconds/60);
    if (minutes !== reading.minutes) updateDaily((daily) => ({ ...daily,reading:{ ...daily.reading,minutes } }));
  }, [seconds,reading.minutes,updateDaily]);
  const onCover = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { notify('请选择图片文件'); return; }
    if (file.size > 1_500_000) { notify('封面图片不能超过 1.5 MB'); return; }
    const reader = new FileReader(); reader.onload = () => setCover(String(reader.result ?? '')); reader.readAsDataURL(file);
  };
  const saveBook = () => {
    if (!title.trim()) return;
    const book = { id:crypto.randomUUID(),title:title.trim(),author:author.trim(),cover };
    updateProfile((profile) => ({ ...profile,books:[...profile.books,book] }));
    updateDaily((daily) => ({ ...daily,reading:{ ...daily.reading,bookId:book.id } }));
    setAdding(false); setTitle(''); setAuthor(''); setCover(''); notify('新书已加入书架');
  };
  const stop = () => { setRunning(false); updateDaily((daily) => ({ ...daily,reading:{ ...daily.reading,minutes:Math.floor(seconds/60) } })); notify('阅读计时已保存'); };
  return <div>
    <SectionTitle icon="▤">阅读时光</SectionTitle>
    <section className="panel"><header className="panel-heading"><div><span className="panel-icon blue"><BookOpen /></span><div><h2>我的书架</h2><p>选择今天要读的书</p></div></div></header><div className="bookshelf">{state.profile.books.map((book) => <button key={book.id} className={reading.bookId === book.id ? 'selected' : ''} onClick={() => updateDaily((daily) => ({ ...daily,reading:{ ...daily.reading,bookId:book.id } }))}>{book.cover ? <img src={book.cover} alt="" /> : <span>📖</span>}<strong>{book.title}</strong><small>{book.author || '未填写作者'}</small></button>)}<button className="add-book" onClick={() => setAdding(true)}><Plus /><strong>添加新书</strong></button></div></section>
    <section className="reading-timer">
      <div className="current-book">{selectedBook ? <>{selectedBook.cover ? <img src={selectedBook.cover} alt="" /> : <span>📖</span>}<div><small>正在阅读</small><strong>{selectedBook.title}</strong></div></> : <><span>📚</span><div><small>正在阅读</small><strong>从书架选一本书</strong></div></>}</div>
      <div className="timer-display">{formatTime(seconds)}</div>
      <div className="timer-controls"><button className="button primary" onClick={() => setRunning((value) => !value)} disabled={!selectedBook}>{running ? <Pause /> : <Play />}{running ? '暂停' : '开始阅读'}</button><button className="button secondary" onClick={stop}><Square />结束</button></div>
      <p>累计阅读 {reading.minutes} 分钟，满 20 分钟并标记完成可得 3 币。</p>
    </section>
    <section className="panel"><CheckRow checked={reading.done} label="标记今日阅读完成" detail={reading.minutes >= 20 ? '已达到 20 分钟目标' : `还差 ${Math.max(0,20-reading.minutes)} 分钟`} onChange={() => { updateDaily((daily) => ({ ...daily,reading:{ ...daily.reading,done:!daily.reading.done } })); if (!reading.done) notify('今日阅读完成',true); }} /><label className="field-row"><span>阅读页数</span><input type="number" min="0" value={reading.pages} onChange={(event) => updateDaily((daily) => ({ ...daily,reading:{ ...daily.reading,pages:Number(event.target.value)||0 } }))} /></label></section>
    {adding && <Modal title="添加新书" onClose={() => setAdding(false)}><div className="book-form"><label><span>书名</span><input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} /></label><label><span>作者</span><input value={author} onChange={(event) => setAuthor(event.target.value)} /></label><label className="cover-upload"><span>封面图片</span><input type="file" accept="image/*" onChange={(event) => onCover(event.target.files?.[0])} />{cover && <img src={cover} alt="封面预览" />}</label><div className="modal-actions"><button className="button secondary" onClick={() => setAdding(false)}>取消</button><button className="button primary" onClick={saveBook}>保存</button></div></div></Modal>}
  </div>;
}
