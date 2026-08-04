import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { BookOpen, Calculator, Coins, Dumbbell, Gift, HeartPulse, Home, Languages, Menu, RefreshCw, Sparkles, X } from 'lucide-react';
import './App.css';
import HomePage from './pages/HomePage';
import MathPage from './pages/MathPage';
import ChinesePage from './pages/ChinesePage';
import EnglishPage from './pages/EnglishPage';
import ReadingPage from './pages/ReadingPage';
import { ExercisePage,HealthPage } from './pages/WellnessPages';
import PrincessPage from './pages/PrincessPage';
import RewardsPage from './pages/RewardsPage';
import { AppStoreProvider,getBalance,useAppStore } from './store';
import type { PageId } from './types';
import { ConfirmDialog } from './ui';

const navigation: Array<{ id:PageId;label:string;Icon:ComponentType<{ size?:number }> }> = [
  { id:'home',label:'今日总览',Icon:Home }, { id:'math',label:'数学大闯关',Icon:Calculator },
  { id:'chinese',label:'语文小课堂',Icon:BookOpen }, { id:'english',label:'英语大冒险',Icon:Languages },
  { id:'reading',label:'阅读时光',Icon:BookOpen }, { id:'exercise',label:'运动打卡',Icon:Dumbbell },
  { id:'health',label:'养生小达人',Icon:HeartPulse }, { id:'pet',label:'公主小屋',Icon:Sparkles },
  { id:'rewards',label:'奖励兑换',Icon:Gift },
];

function AppContent() {
  const { state,resetDaily } = useAppStore();
  const [page,setPage] = useState<PageId>('home');
  const [drawer,setDrawer] = useState(false);
  const [toast,setToast] = useState('');
  const [celebrating,setCelebrating] = useState(false);
  const [confirmation,setConfirmation] = useState<{ message:string;action:()=>void } | null>(null);
  const toastTimer = useRef<number | null>(null);
  const celebrationTimer = useRef<number | null>(null);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current);if (celebrationTimer.current) clearTimeout(celebrationTimer.current); },[]);
  const notify = useCallback((message:string,celebrate=false) => {
    setToast(message); if (toastTimer.current) clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToast(''),2800);
    if (celebrate) { setCelebrating(true);if (celebrationTimer.current) clearTimeout(celebrationTimer.current); celebrationTimer.current = window.setTimeout(() => setCelebrating(false),1400); }
  },[]);
  const confirm = useCallback((message:string,action:()=>void) => setConfirmation({message,action}),[]);
  const navigate = (next:PageId) => { setPage(next);setDrawer(false);const main=document.querySelector('main');if(main)main.scrollTop=0; };
  const now = new Date();
  const greeting = now.getHours()<11?'早安':now.getHours()<14?'中午好':now.getHours()<18?'下午好':'晚上好';
  const weekday = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'][now.getDay()];
  const common = { notify };
  return <div className="app-shell">
    <header className="mobile-header"><button className="icon-btn" title="打开菜单" onClick={() => setDrawer(true)}><Menu/></button><strong>任务站</strong><span className="mobile-balance"><Coins/> {getBalance(state)}</span></header>
    <div className={`drawer-overlay ${drawer?'visible':''}`} onClick={() => setDrawer(false)} />
    <aside className={`sidebar ${drawer?'open':''}`}>
      <div className="brand"><span>♛</span><strong>我的世界<br/>任务站</strong><button className="icon-btn sidebar-close" title="关闭菜单" onClick={() => setDrawer(false)}><X/></button></div>
      <nav aria-label="主导航">{navigation.map(({id,label,Icon}) => <button key={id} className={page===id?'active':''} onClick={() => navigate(id)}><Icon size={19}/><span>{label}</span></button>)}</nav>
      <div className="sidebar-coins"><Coins/><strong>{getBalance(state)}</strong><small>星光币余额</small></div>
    </aside>
    <main>
      <div className="topbar"><div><strong>{greeting}，冒险家！</strong><span>{now.getMonth()+1}月{now.getDate()}日 · {weekday}</span></div><button className="button secondary compact" onClick={() => confirm('确定重置今日全部任务吗？星光币、装扮、书架和兑换记录会保留。',() => { resetDaily();notify('今日任务已重置'); })}><RefreshCw/>重置今日任务</button></div>
      {page==='home'&&<HomePage onNavigate={navigate}/>} {page==='math'&&<MathPage {...common}/>} {page==='chinese'&&<ChinesePage {...common}/>} {page==='english'&&<EnglishPage {...common}/>} {page==='reading'&&<ReadingPage {...common}/>} {page==='exercise'&&<ExercisePage {...common}/>} {page==='health'&&<HealthPage {...common}/>} {page==='pet'&&<PrincessPage notify={notify} confirm={confirm}/>} {page==='rewards'&&<RewardsPage notify={notify} confirm={confirm}/>} 
    </main>
    <div className={`toast ${toast?'show':''}`} role="status">{toast}</div>
    {celebrating&&<div className="celebration" aria-hidden="true">{Array.from({length:24},(_,index)=><i key={index} style={{'--x':`${(index*43)%100}%`,'--delay':`${(index%8)*.04}s`,'--color':['#ffaa00','#d44637','#4a90d9','#43a047','#e91e63'][index%5]} as React.CSSProperties}/>)}</div>}
    {confirmation&&<ConfirmDialog message={confirmation.message} onCancel={() => setConfirmation(null)} onConfirm={() => { const action=confirmation.action;setConfirmation(null);action(); }}/>} 
  </div>;
}

export default function App() { return <AppStoreProvider><AppContent/></AppStoreProvider>; }
