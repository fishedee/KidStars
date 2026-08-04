import { useEffect, useRef, useState, type ReactNode } from 'react';
import { X, Volume2 } from 'lucide-react';
import HanziWriter from 'hanzi-writer';

export function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <h1 className="section-title"><span aria-hidden="true">{icon}</span>{children}</h1>;
}

export function ProgressBar({ value, color = '#4a90d9' }: { value: number; color?: string }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return <div className="progress-track" aria-label={`完成度 ${safeValue}%`}><span style={{ width: `${safeValue}%`, background: color }} /></div>;
}

export function CheckRow({ checked, label, detail, onChange, minutes, onMinutesChange }: {
  checked: boolean;
  label: string;
  detail?: string;
  onChange: () => void;
  minutes?: number;
  onMinutesChange?: (value: number) => void;
}) {
  return (
    <div className="check-row">
      <button className={`check-toggle ${checked ? 'done' : ''}`} onClick={onChange} aria-pressed={checked} aria-label={`${checked ? '取消' : '完成'}${label}`}>
        {checked ? '✓' : ''}
      </button>
      <div className={`check-copy ${checked ? 'done' : ''}`}><strong>{label}</strong>{detail && <small>{detail}</small>}</div>
      {onMinutesChange && <label className="minutes-input"><input type="number" min="0" value={minutes ?? 0} onChange={(event) => onMinutesChange(Number(event.target.value) || 0)} /><span>分钟</span></label>}
    </div>
  );
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <header><h2>{title}</h2><button ref={closeRef} className="icon-btn" onClick={onClose} title="关闭"><X /></button></header>
        {children}
      </section>
    </div>
  );
}

export function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return <Modal title="请确认" onClose={onCancel}><p className="confirm-copy">{message}</p><div className="modal-actions"><button className="button secondary" onClick={onCancel}>取消</button><button className="button danger" onClick={onConfirm}>确认</button></div></Modal>;
}

export const speak = (text: string, lang: 'zh-CN' | 'en-US' = 'zh-CN') => {
  if (!('speechSynthesis' in window)) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.8;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
};

export function SpeakButton({ text, lang = 'zh-CN' }: { text: string; lang?: 'zh-CN' | 'en-US' }) {
  return <button className="icon-btn" onClick={(event) => { event.stopPropagation(); speak(text, lang); }} title="朗读"><Volume2 /></button>;
}

export function HanziCanvas({ character }: { character: string }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!targetRef.current) return;
    targetRef.current.innerHTML = '';
    setFailed(false);
    try {
      writerRef.current = HanziWriter.create(targetRef.current, character, {
        width: 150, height: 150, padding: 8, showOutline: true, showCharacter: true,
        strokeColor: '#5d4037', outlineColor: '#d7ccc8', drawingColor: '#b02e26',
      });
    } catch {
      setFailed(true);
    }
    return () => writerRef.current?.cancelQuiz();
  }, [character]);
  return (
    <div className="hanzi-wrap">
      <div ref={targetRef} className="hanzi-canvas">{failed && <span>{character}</span>}</div>
      <div className="hanzi-actions">
        <button className="button compact" onClick={() => writerRef.current?.animateCharacter()}>播放笔顺</button>
        <button className="button compact secondary" onClick={() => writerRef.current?.quiz()}>书写练习</button>
      </div>
      {failed && <small>字形数据暂时无法加载</small>}
    </div>
  );
}
