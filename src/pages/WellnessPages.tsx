import { useState } from 'react';
import { Dumbbell, HeartPulse, Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '../store';
import { CheckRow, SectionTitle } from '../ui';

export function ExercisePage({ notify }: { notify: (message: string, celebrate?: boolean) => void }) {
  const { state,updateDaily } = useAppStore();
  const [name,setName] = useState('');
  const add = () => {
    if (!name.trim()) return;
    updateDaily((daily) => ({ ...daily,exercise:[...daily.exercise,{ id:crypto.randomUUID(),name:name.trim(),done:false,minutes:0 }] }));
    setName('');
  };
  return <div><SectionTitle icon={<Dumbbell />}>运动打卡</SectionTitle><section className="panel"><header className="panel-heading"><div><span className="panel-icon orange"><Dumbbell /></span><div><h2>今日运动</h2><p>每完成一项获得 1 枚星光币</p></div></div></header>{state.daily.exercise.map((item) => <div className="editable-check" key={item.id}><CheckRow checked={item.done} label={item.name} minutes={item.minutes} onChange={() => { updateDaily((daily) => ({ ...daily,exercise:daily.exercise.map((entry) => entry.id === item.id ? { ...entry,done:!entry.done } : entry) })); if (!item.done) notify(`${item.name}打卡完成`,true); }} onMinutesChange={(minutes) => updateDaily((daily) => ({ ...daily,exercise:daily.exercise.map((entry) => entry.id === item.id ? { ...entry,minutes } : entry) }))} /><button className="icon-btn danger-icon" title="删除" onClick={() => updateDaily((daily) => ({ ...daily,exercise:daily.exercise.filter((entry) => entry.id !== item.id) }))}><Trash2 /></button></div>)}<div className="add-form"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="添加运动项目" onKeyDown={(event) => { if (event.key === 'Enter') add(); }} /><button className="button primary" onClick={add}><Plus />添加</button></div></section></div>;
}

export function HealthPage({ notify }: { notify: (message: string, celebrate?: boolean) => void }) {
  const { state,updateDaily } = useAppStore();
  const health = state.daily.health;
  const update = (key:'foot'|'massage',patch:Partial<typeof health.foot>) => updateDaily((daily) => ({ ...daily,health:{ ...daily.health,[key]:{ ...daily.health[key],...patch } } }));
  return <div><SectionTitle icon={<HeartPulse />}>养生小达人</SectionTitle><div className="health-intro"><HeartPulse /><div><h2>照顾好自己的身体</h2><p>每天完成两项放松任务，每项获得 2 枚星光币。</p></div></div><section className="panel"><CheckRow checked={health.foot.done} label="睡前泡脚" detail="温水泡脚，放松身体" minutes={health.foot.minutes} onChange={() => { update('foot',{done:!health.foot.done});if (!health.foot.done) notify('泡脚打卡完成',true); }} onMinutesChange={(minutes) => update('foot',{minutes})} /><CheckRow checked={health.massage.done} label="眼保健操或按摩" detail="让眼睛和肩颈休息一下" minutes={health.massage.minutes} onChange={() => { update('massage',{done:!health.massage.done});if (!health.massage.done) notify('放松任务完成',true); }} onMinutesChange={(minutes) => update('massage',{minutes})} /></section></div>;
}
