import React from 'react';
import {useCurrentFrame} from 'remotion';
import {E, ramp, rnd} from '../lib/anim';
import {FPS} from '../lib/theme';

type FromState = {y?: number; x?: number; blur?: number; scale?: number; rot?: number; opacity?: number};

/** 글자 단위로 스태거되며 나타나는 텍스트. out 을 주면 같은 방식으로 사라진다. */
export const Chars: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  dur?: number;
  from?: FromState;
  out?: {start: number; stagger?: number; dur?: number; to?: FromState};
  style?: React.CSSProperties;
  charStyle?: (i: number, ch: string) => React.CSSProperties | undefined;
  easing?: (t: number) => number;
}> = ({text, start, stagger = 2, dur = 14, from = {y: 30, blur: 12, opacity: 0}, out, style, charStyle, easing = E.outExpo}) => {
  const frame = useCurrentFrame();
  const chars = Array.from(text);
  return (
    <span style={{display: 'inline-block', whiteSpace: 'pre', ...style}}>
      {chars.map((ch, i) => {
        const t = ramp(frame, start + i * stagger, start + i * stagger + dur, 0, 1, easing);
        let y = (from.y ?? 0) * (1 - t);
        let x = (from.x ?? 0) * (1 - t);
        let blur = (from.blur ?? 0) * (1 - t);
        let sc = 1 + ((from.scale ?? 1) - 1) * (1 - t);
        let rot = (from.rot ?? 0) * (1 - t);
        let op = (from.opacity ?? 0) + (1 - (from.opacity ?? 0)) * t;
        if (out) {
          const os = out.stagger ?? stagger;
          const od = out.dur ?? dur;
          const u = ramp(frame, out.start + i * os, out.start + i * os + od, 0, 1, E.inOutCubic);
          const to = out.to ?? {y: -20, blur: 14, opacity: 0};
          y += (to.y ?? 0) * u;
          x += (to.x ?? 0) * u;
          blur += (to.blur ?? 0) * u;
          sc *= 1 + ((to.scale ?? 1) - 1) * u;
          rot += (to.rot ?? 0) * u;
          op *= 1 - u * (1 - (to.opacity ?? 0));
        }
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translate(${x}px, ${y}px) scale(${sc}) rotate(${rot}deg)`,
              filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
              opacity: op,
              ...charStyle?.(i, ch),
            }}
          >
            {ch === ' ' ? ' ' : ch}
          </span>
        );
      })}
    </span>
  );
};

/**
 * 내레이션 단어 타이밍에 맞춰 단어가 하나씩 떠오르는 텍스트.
 * words: [단어, 클립 내 시작 초], start: 클립이 놓인 프레임.
 */
export const SyncWords: React.FC<{
  words: [string, number][];
  start: number;
  lead?: number;
  dur?: number;
  style?: React.CSSProperties;
  wordStyle?: (i: number, w: string) => React.CSSProperties | undefined;
  from?: FromState;
  outAt?: number;
  gap?: string;
}> = ({words, start, lead = 2, dur = 16, style, wordStyle, from = {y: 18, blur: 10, opacity: 0}, outAt, gap = '0.32em'}) => {
  const frame = useCurrentFrame();
  return (
    <span style={{display: 'inline-flex', flexWrap: 'wrap', columnGap: gap, ...style}}>
      {words.map(([w, t], i) => {
        const a = start + Math.round(t * FPS) - lead;
        const p = ramp(frame, a, a + dur, 0, 1, E.outExpo);
        const o = outAt !== undefined ? ramp(frame, outAt + i * 2, outAt + i * 2 + 14, 1, 0, E.inOutCubic) : 1;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: ((from.opacity ?? 0) + (1 - (from.opacity ?? 0)) * p) * o,
              transform: `translateY(${(from.y ?? 0) * (1 - p) - (1 - o) * 10}px) scale(${1 + ((from.scale ?? 1) - 1) * (1 - p)})`,
              filter: `blur(${(from.blur ?? 0) * (1 - p) + (1 - o) * 10}px)`,
              ...wordStyle?.(i, w),
            }}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
};

/** 타자기 효과. cursor 가 깜빡이며 따라간다. */
export const TypeOn: React.FC<{
  text: string;
  start: number;
  cps?: number;
  cursor?: boolean;
  cursorColor?: string;
  style?: React.CSSProperties;
  renderChunk?: (visible: string) => React.ReactNode;
  holdCursor?: number;
}> = ({text, start, cps = 30, cursor = true, cursorColor = 'currentColor', style, renderChunk, holdCursor = 9999}) => {
  const frame = useCurrentFrame();
  const chars = Array.from(text);
  const n = Math.max(0, Math.min(chars.length, Math.floor(((frame - start) / FPS) * cps)));
  const visible = chars.slice(0, n).join('');
  const done = n >= chars.length;
  const doneAt = start + (chars.length / cps) * FPS;
  const blink = done ? Math.floor((frame - doneAt) / 8) % 2 === 0 : true;
  const showCursor = cursor && frame >= start && blink && frame < doneAt + holdCursor;
  return (
    <span style={{whiteSpace: 'pre-wrap', ...style}}>
      {renderChunk ? renderChunk(visible) : visible}
      <span
        style={{
          display: 'inline-block',
          width: '0.55em',
          height: '1.05em',
          marginLeft: 2,
          verticalAlign: '-0.15em',
          background: cursorColor,
          opacity: showCursor ? 0.9 : 0,
        }}
      />
    </span>
  );
};

/** 크게 들이받듯 안착하는 텍스트. 안착 순간 약간의 흔들림. */
export const Slam: React.FC<{
  start: number;
  children: React.ReactNode;
  from?: number;
  dur?: number;
  style?: React.CSSProperties;
  shake?: number;
  blur?: number;
}> = ({start, children, from = 1.9, dur = 9, style, shake = 10, blur = 24}) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, start, start + dur, 0, 1, E.outQuart);
  const after = frame - (start + dur);
  const k = after >= 0 && after < 10 ? Math.exp(-after / 3) : 0;
  const sx = k * shake * (rnd(`sx${frame}`) - 0.5) * 2;
  const sy = k * shake * (rnd(`sy${frame}`) - 0.5) * 2;
  return (
    <div
      style={{
        opacity: frame < start ? 0 : Math.min(1, t * 1.6),
        transform: `translate(${sx}px, ${sy}px) scale(${from + (1 - from) * t})`,
        filter: `blur(${blur * (1 - t)}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** RGB 분리 텍스트 — 빨강/청록 잔상이 주기적으로 튄다. */
export const GlitchText: React.FC<{
  children: React.ReactNode;
  amount: number;
  seed?: string;
  style?: React.CSSProperties;
  colors?: [string, string];
}> = ({children, amount, seed = 'gt', style, colors = ['#ff2a55', '#2af5ff']}) => {
  const frame = useCurrentFrame();
  const j = (k: string) => (rnd(`${seed}-${k}-${Math.floor(frame / 2)}`) - 0.5) * 2;
  const burst = rnd(`${seed}-burst-${Math.floor(frame / 3)}`) > 0.7 ? 1 : 0.25;
  const d = amount * 14 * burst;
  return (
    <div style={{position: 'relative', ...style}}>
      <div style={{position: 'absolute', inset: 0, color: colors[0], transform: `translate(${d * (1 + j('a'))}px, ${d * 0.3 * j('b')}px)`, mixBlendMode: 'screen', opacity: amount > 0 ? 0.85 : 0}}>
        {children}
      </div>
      <div style={{position: 'absolute', inset: 0, color: colors[1], transform: `translate(${-d * (1 + j('c'))}px, ${d * 0.3 * j('d')}px)`, mixBlendMode: 'screen', opacity: amount > 0 ? 0.85 : 0}}>
        {children}
      </div>
      <div style={{position: 'relative'}}>{children}</div>
    </div>
  );
};

/** 숫자 카운터. 천 단위 쉼표 포함. */
export const Counter: React.FC<{
  from?: number;
  to: number;
  start: number;
  end: number;
  easing?: (t: number) => number;
  style?: React.CSSProperties;
  format?: (n: number) => string;
}> = ({from = 0, to, start, end, easing = E.outExpo, style, format}) => {
  const frame = useCurrentFrame();
  const v = Math.round(ramp(frame, start, end, from, to, easing));
  return <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>{format ? format(v) : v.toLocaleString('en-US')}</span>;
};
