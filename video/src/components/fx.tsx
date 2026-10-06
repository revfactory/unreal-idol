import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {E, ramp, rnd} from '../lib/anim';
import {C, H, W} from '../lib/theme';

/** 필름 그레인: 매 프레임 시드를 바꾼 노이즈를 overlay 로 얹는다. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.08}) => {
  const frame = useCurrentFrame();
  const id = 'grain';
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity}}>
      <svg width={W} height={H}>
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 24} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.75}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 75% 70% at 50% 50%, transparent 45%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** 시네마 레터박스. open=0 이면 2.39:1, 1 이면 풀프레임. */
export const Letterbox: React.FC<{open: number}> = ({open}) => {
  const bar = 138 * (1 - open);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: bar, background: '#000'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: bar, background: '#000'}} />
    </AbsoluteFill>
  );
};

export const Flash: React.FC<{at: number; dur?: number; color?: string; peak?: number}> = ({
  at,
  dur = 10,
  color = '#fff',
  peak = 1,
}) => {
  const frame = useCurrentFrame();
  const o = frame < at ? 0 : ramp(frame, at, at + dur, peak, 0, E.outQuart);
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: color, opacity: o, mixBlendMode: 'screen', pointerEvents: 'none'}} />;
};

export const Scanlines: React.FC<{opacity?: number; gap?: number}> = ({opacity = 0.18, gap = 3}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      opacity,
      backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 1px, transparent 1px, transparent ${gap}px)`,
    }}
  />
);

type KB = {s: number; x?: number; y?: number};

/**
 * 켄 번스 이미지. 시퀀스 로컬 프레임 기준으로 from → to 로 스케일·이동한다.
 * x, y 는 퍼센트 단위 이동량.
 */
export const KenBurns: React.FC<{
  src: string;
  dur: number;
  from?: KB;
  to?: KB;
  filter?: string;
  easing?: (t: number) => number;
  style?: React.CSSProperties;
  origin?: string;
}> = ({src, dur, from = {s: 1.05}, to = {s: 1.18}, filter, easing = E.inOutCubic, style, origin = '50% 50%'}) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, 0, dur, 0, 1, easing);
  const s = from.s + (to.s - from.s) * t;
  const x = (from.x ?? 0) + ((to.x ?? 0) - (from.x ?? 0)) * t;
  const y = (from.y ?? 0) + ((to.y ?? 0) - (from.y ?? 0)) * t;
  return (
    <AbsoluteFill style={{overflow: 'hidden', ...style}}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `translate(${x}%, ${y}%) scale(${s})`,
          transformOrigin: origin,
          filter,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * RGB 분리 + 수평 슬라이스 글리치. amount 0 이면 원본 그대로.
 * children 을 세 번 그려 채널별로 어긋나게 겹친다.
 */
export const Glitch: React.FC<{amount: number; seed?: string; children: React.ReactNode; slices?: boolean}> = ({
  amount,
  seed = 'g',
  children,
  slices = true,
}) => {
  const frame = useCurrentFrame();
  if (amount <= 0.001) return <AbsoluteFill>{children}</AbsoluteFill>;
  const r = (k: string) => rnd(`${seed}-${frame}-${k}`) * 2 - 1;
  const dx = amount * 26;
  const sliceCount = slices ? 7 : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: 'url(#keep-r)', transform: `translate(${dx * (0.6 + r('rx'))}px, ${r('ry') * 4 * amount}px)`}}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{mixBlendMode: 'screen', filter: 'url(#keep-g)'}}>{children}</AbsoluteFill>
      <AbsoluteFill
        style={{mixBlendMode: 'screen', filter: 'url(#keep-b)', transform: `translate(${-dx * (0.6 + r('bx'))}px, 0px)`}}
      >
        {children}
      </AbsoluteFill>
      {Array.from({length: sliceCount}).map((_, i) => {
        if (rnd(`${seed}-${frame}-on-${i}`) > amount * 0.9) return null;
        const top = rnd(`${seed}-${frame}-t-${i}`) * 100;
        const h = 1 + rnd(`${seed}-${frame}-h-${i}`) * 9;
        const off = r(`o-${i}`) * 120 * amount;
        return (
          <AbsoluteFill
            key={i}
            style={{clipPath: `inset(${top}% 0 ${Math.max(0, 100 - top - h)}% 0)`, transform: `translateX(${off}px)`}}
          >
            {children}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

/** Glitch 가 쓰는 채널 분리 SVG 필터 정의. 컴포지션 최상단에 한 번 둔다. */
export const ChannelFilters: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <filter id="keep-r">
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
    </filter>
    <filter id="keep-g">
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
    </filter>
    <filter id="keep-b">
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
    </filter>
  </svg>
);

/** 화면 위를 떠도는 빛 번짐(light leak). */
export const LightLeak: React.FC<{color?: string; opacity?: number; seed?: string; speed?: number}> = ({
  color = C.gold,
  opacity = 0.35,
  seed = 'leak',
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  const t = frame * 0.01 * speed;
  const x = 50 + Math.sin(t + rnd(seed) * 6) * 35;
  const y = 50 + Math.cos(t * 0.7 + rnd(seed + 'y') * 6) * 30;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        opacity,
        background: `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, transparent 45%)`,
      }}
    />
  );
};

/** 컬러 그레이딩 오버레이(곱하기/스크린 혼합 색). */
export const Tint: React.FC<{color: string; opacity: number; blend?: React.CSSProperties['mixBlendMode']}> = ({
  color,
  opacity,
  blend = 'color',
}) => <AbsoluteFill style={{background: color, opacity, mixBlendMode: blend, pointerEvents: 'none'}} />;

/** 임팩트 순간의 카메라 흔들림. hits 프레임마다 지수 감쇠. */
export const Shake: React.FC<{hits: number[]; amp?: number; children: React.ReactNode}> = ({hits, amp = 14, children}) => {
  const frame = useCurrentFrame();
  let k = 0;
  for (const h of hits) {
    const d = frame - h;
    if (d >= 0 && d < 20) k = Math.max(k, Math.exp(-d / 4));
  }
  const x = (rnd(`shx${frame}`) - 0.5) * 2 * amp * k;
  const y = (rnd(`shy${frame}`) - 0.5) * 2 * amp * k;
  return <AbsoluteFill style={{transform: k > 0.01 ? `translate(${x}px, ${y}px) scale(${1 + 0.02 * k})` : undefined}}>{children}</AbsoluteFill>;
};
