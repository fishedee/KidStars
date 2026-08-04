import { Gift } from 'lucide-react';
import { REWARDS } from '../data';
import { getBalance, useAppStore } from '../store';
import { SectionTitle } from '../ui';

export default function RewardsPage({ notify,confirm }: { notify:(message:string,celebrate?:boolean)=>void;confirm:(message:string,action:()=>void)=>void }) {
  const { state,updateProfile } = useAppStore();
  const balance = getBalance(state);
  const redeem = (id:string) => {
    const reward = REWARDS.find((entry) => entry.id === id); if (!reward) return;
    if (balance < reward.cost) { notify('星光币不足'); return; }
    confirm(`确定花费 ${reward.cost} 枚星光币兑换“${reward.name}”吗？`,() => updateProfile((profile) => {
      notify(`兑换成功：${reward.name} ${reward.description}`,true);
      return { ...profile,coinBase:Math.max(0,profile.coinBase-reward.cost),rewards:{ ...profile.rewards,[id]:(profile.rewards[id]??0)+1 } };
    }));
  };
  return <div><SectionTitle icon={<Gift/>}>奖励兑换</SectionTitle><div className="reward-balance"><span>当前余额</span><strong>💰 {balance}</strong></div><div className="reward-grid">{REWARDS.map((reward) => <article key={reward.id}><span>{reward.icon}</span><h2>{reward.name}</h2><p>{reward.description}</p><strong>💰 {reward.cost} 币</strong><button className="button primary" disabled={balance<reward.cost} onClick={() => redeem(reward.id)}>兑换</button><small>已兑换 {state.profile.rewards[reward.id]??0} 次</small></article>)}</div><section className="panel reward-history"><h2>兑换记录</h2>{REWARDS.map((reward) => <div key={reward.id}><span>{reward.icon} {reward.name}</span><strong>{state.profile.rewards[reward.id]??0} 次</strong></div>)}</section></div>;
}
