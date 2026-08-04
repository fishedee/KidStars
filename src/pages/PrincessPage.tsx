import { useMemo, useState } from 'react';
import { Backpack, Home, Sparkles, Trees } from 'lucide-react';
import { COTTAGE_ITEMS, COTTAGE_SLOTS, GARDEN_ITEMS, GARDEN_SLOTS, LEVELS, SHOP_CATEGORIES, SHOP_ITEMS, type DecorItem, type DecorSlot } from '../data';
import { getBalance, getDollLevel, useAppStore } from '../store';
import type { DollCategory } from '../types';
import { Modal, ProgressBar, SectionTitle } from '../ui';

type Confirm = (message: string, action: () => void) => void;

function DollAvatar({ equipped }: { equipped: Record<DollCategory,string|null> }) {
  const hair = ({ hair1:'#6d4c41',hair2:'#4e342e',hair3:'#2c1810',hair4:'#8d6e63',hair5:'#7b4f25',hair6:'#d79b58' } as Record<string,string>)[equipped.hair ?? ''] ?? '#6d4c41';
  const top = ({ top1:'#f48fb1',top2:'#64b5f6',top3:'#ef9a9a',top4:'#fff0f5',top5:'#5c6bc0',top6:'#ffd54f' } as Record<string,string>)[equipped.top ?? ''] ?? '#f8bbd0';
  const skirt = ({ bottom1:'#f06292',bottom2:'#5c6bc0',bottom3:'#f8bbd0',bottom4:'#fff176',bottom5:'#3949ab',bottom6:'#ce93d8' } as Record<string,string>)[equipped.bottom ?? ''] ?? '#f48fb1';
  const shoes = ({ shoes1:'#d32f2f',shoes2:'#fafafa',shoes3:'#f48fb1',shoes4:'#b2ebf2',shoes5:'#ffca28' } as Record<string,string>)[equipped.shoes ?? ''] ?? '#8d6e63';
  return <svg className="doll-avatar" viewBox="0 0 180 260" role="img" aria-label="小棉的当前装扮">
    <ellipse cx="90" cy="244" rx="54" ry="10" fill="#000" opacity=".12" />
    {equipped.acc === 'acc6' && <ellipse cx="90" cy="22" rx="28" ry="7" fill="none" stroke="#ffd700" strokeWidth="5" />}
    <path d="M56 68 Q48 20 90 18 Q132 20 124 74 L118 110 L62 110 Z" fill={hair} />
    {equipped.acc === 'acc2' && <path d="M62 31 L70 9 L88 27 L104 7 L120 31 Z" fill="#ffd700" stroke="#b8860b" strokeWidth="3" />}
    <circle cx="90" cy="63" r="34" fill="#ffd7bd" />
    <path d="M58 54 Q62 23 90 25 Q120 25 124 55 Q108 40 90 43 Q73 42 58 54" fill={hair} />
    <circle cx="78" cy="62" r="4" fill="#3e2723" /><circle cx="102" cy="62" r="4" fill="#3e2723" />
    <circle cx="79" cy="61" r="1.3" fill="#fff" /><circle cx="103" cy="61" r="1.3" fill="#fff" />
    <ellipse cx="70" cy="73" rx="7" ry="3" fill="#ef9a9a" opacity=".55" /><ellipse cx="110" cy="73" rx="7" ry="3" fill="#ef9a9a" opacity=".55" />
    <path d="M84 77 Q90 84 96 77" fill="none" stroke="#c2185b" strokeWidth="2" strokeLinecap="round" />
    <path d="M65 98 Q90 88 115 98 L122 155 L58 155 Z" fill={top} stroke="#ad1457" strokeWidth="2" />
    <path d="M59 146 Q90 132 121 146 L143 211 L37 211 Z" fill={skirt} stroke="#7b1fa2" strokeWidth="2" />
    <path d="M64 102 L42 154" stroke="#ffd7bd" strokeWidth="12" strokeLinecap="round" /><path d="M116 102 L138 154" stroke="#ffd7bd" strokeWidth="12" strokeLinecap="round" />
    <path d="M72 208 L68 237" stroke="#ffd7bd" strokeWidth="13" /><path d="M108 208 L112 237" stroke="#ffd7bd" strokeWidth="13" />
    <ellipse cx="65" cy="240" rx="15" ry="7" fill={shoes} /><ellipse cx="115" cy="240" rx="15" ry="7" fill={shoes} />
    {equipped.acc && equipped.acc !== 'acc2' && equipped.acc !== 'acc6' && <text x="116" y="43" fontSize="28">{equipped.acc === 'acc3' ? '🐱' : equipped.acc === 'acc5' ? '🌼' : equipped.acc === 'acc7' ? '⭐' : '🎀'}</text>}
  </svg>;
}

export default function PrincessPage({ notify,confirm }: { notify:(message:string,celebrate?:boolean)=>void;confirm:Confirm }) {
  const { state,updateProfile } = useAppStore();
  const [tab,setTab] = useState<'shop'|'cottage'|'garden'>('shop');
  const [category,setCategory] = useState<DollCategory>('hair');
  const [decorSlot,setDecorSlot] = useState<{ area:'cottage'|'garden';slot:DecorSlot } | null>(null);
  const profile = state.profile;
  const balance = getBalance(state);
  const level = [...LEVELS].reverse().find((entry) => profile.doll.level >= entry.min) ?? LEVELS[0];
  const stats = useMemo(() => ({
    study:Math.min(100,Object.keys(state.daily.chinese.vocabDone).length*3+state.daily.math.score*3+state.daily.think.score*3),
    art:Math.min(100,(state.daily.english.gameDone?35:0)+(state.daily.reading.done?35:0)+state.daily.reading.minutes),
    strength:Math.min(100,state.daily.exercise.filter((item) => item.done).length*20+(state.daily.health.foot.done?20:0)+(state.daily.health.massage.done?20:0)),
    grace:Math.min(100,Math.floor(profile.doll.charm/5)),
  }),[profile.doll.charm,state.daily]);
  const buy = (cost:number,name:string,after:(profile:typeof state.profile)=>typeof state.profile) => {
    if (balance < cost) { notify('星光币不足，多完成任务再来看看'); return; }
    confirm(`确定花费 ${cost} 枚星光币购买“${name}”吗？`,() => updateProfile((current) => {
      const charm = current.doll.charm+cost;
      const next = { ...current,coinBase:Math.max(0,current.coinBase-cost),doll:{ ...current.doll,charm,level:getDollLevel(charm) } };
      notify(`已获得 ${name}`,true); return after(next);
    }));
  };
  const buyClothes = (id:string) => {
    const item = SHOP_ITEMS.find((entry) => entry.id === id); if (!item) return;
    buy(item.cost,item.name,(current) => ({ ...current,doll:{ ...current.doll,ownedItems:{ ...current.doll.ownedItems,[item.id]:true },equipped:{ ...current.doll.equipped,[item.category]:item.id } } }));
  };
  const chooseDecor = (item:DecorItem) => {
    if (!decorSlot) return;
    const { area,slot } = decorSlot;
    buy(item.cost,item.name,(current) => ({ ...current,doll:{ ...current.doll,[area]:{ ...current.doll[area],[slot.id]:item.id } } }));
    setDecorSlot(null);
  };
  return <div><SectionTitle icon="★">公主小屋</SectionTitle>
    <section className="doll-stage"><div className="doll-side-actions"><button className="icon-btn" title="称号" onClick={() => notify(`当前称号：${level.title}`)}><Sparkles /></button><button className="icon-btn" title="背包" onClick={() => notify(`背包里有 ${Object.keys(profile.doll.ownedItems).length} 件物品`)}><Backpack /></button></div><DollAvatar equipped={profile.doll.equipped} /><div className="doll-name"><strong>小棉</strong><span>Lv.{profile.doll.level} · {level.title}</span></div></section>
    <div className="stat-grid"><Stat label="学习力" value={stats.study} color="#4a90d9"/><Stat label="艺术力" value={stats.art} color="#9b59b6"/><Stat label="活力" value={stats.strength} color="#43a047"/><Stat label="魅力" value={stats.grace} color="#e91e63"/></div>
    <div className="segmented"><button className={tab === 'shop'?'active':''} onClick={() => setTab('shop')}><Sparkles/>装扮商店</button><button className={tab === 'cottage'?'active':''} onClick={() => setTab('cottage')}><Home/>温馨小屋</button><button className={tab === 'garden'?'active':''} onClick={() => setTab('garden')}><Trees/>秘密花园</button></div>
    {tab === 'shop' ? <><div className="tab-row">{SHOP_CATEGORIES.map((entry) => <button key={entry.id} className={category === entry.id?'active':''} onClick={() => setCategory(entry.id)}>{entry.name}</button>)}</div><div className="shop-grid">{SHOP_ITEMS.filter((item) => item.category === category).map((item) => { const owned = profile.doll.ownedItems[item.id]; const equipped = profile.doll.equipped[item.category] === item.id; return <article className={`${equipped?'equipped':''} ${!owned&&balance<item.cost?'locked':''}`} key={item.id}><span>{item.icon}</span><strong>{item.name}</strong><small>{item.description}</small>{equipped ? <button className="button secondary compact" onClick={() => updateProfile((current) => ({ ...current,doll:{ ...current.doll,equipped:{ ...current.doll.equipped,[item.category]:null } } }))}>卸下</button> : owned ? <button className="button primary compact" onClick={() => updateProfile((current) => ({ ...current,doll:{ ...current.doll,equipped:{ ...current.doll.equipped,[item.category]:item.id } } }))}>穿戴</button> : <button className="button primary compact" disabled={balance<item.cost} onClick={() => buyClothes(item.id)}>💰 {item.cost} 购买</button>}</article>; })}</div></> : <DecorArea area={tab} slots={tab === 'cottage'?COTTAGE_SLOTS:GARDEN_SLOTS} items={tab === 'cottage'?COTTAGE_ITEMS:GARDEN_ITEMS} placed={profile.doll[tab]} onSelect={(slot) => setDecorSlot({area:tab,slot})} />}
    {decorSlot && <Modal title={`装饰${decorSlot.slot.name}`} onClose={() => setDecorSlot(null)}><div className="shop-grid modal-shop">{(decorSlot.area === 'cottage'?COTTAGE_ITEMS:GARDEN_ITEMS)[decorSlot.slot.id].map((item) => <button className="decor-option" key={item.id} disabled={balance<item.cost} onClick={() => chooseDecor(item)}><span>{item.icon}</span><strong>{item.name}</strong><small>💰 {item.cost}</small></button>)}</div>{profile.doll[decorSlot.area][decorSlot.slot.id] && <button className="button danger" onClick={() => { updateProfile((current) => { const area = { ...current.doll[decorSlot.area] }; delete area[decorSlot.slot.id]; return { ...current,doll:{ ...current.doll,[decorSlot.area]:area } }; });setDecorSlot(null); }}>移除当前装饰</button>}</Modal>}
  </div>;
}

function Stat({label,value,color}:{label:string;value:number;color:string}) { return <div><header><strong>{label}</strong><span>{value}</span></header><ProgressBar value={value} color={color}/></div>; }
function DecorArea({area,slots,items,placed,onSelect}:{area:'cottage'|'garden';slots:DecorSlot[];items:Record<string,DecorItem[]>;placed:Record<string,string>;onSelect:(slot:DecorSlot)=>void}) { return <div className={`decor-area ${area}`}>{slots.map((slot) => { const selected = items[slot.id].find((item) => item.id === placed[slot.id]); return <button key={slot.id} style={{ gridColumn:`${slot.col}${slot.colSpan?` / span ${slot.colSpan}`:''}`,gridRow:`${slot.row}${slot.rowSpan?` / span ${slot.rowSpan}`:''}` }} onClick={() => onSelect(slot)}><span>{selected?.icon ?? slot.icon}</span><small>{selected?.name ?? slot.name}</small></button>; })}</div>; }
