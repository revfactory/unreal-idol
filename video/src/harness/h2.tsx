import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Chars} from '../components/text';
import {E, ramp} from '../lib/anim';
import {C, F, W} from '../lib/theme';
import {BIBLE_DOCS, CAST, EPISODES, GROUP_COLOR, LOGLINE, RELATIONS} from './data';
import {SectionHeader, TechBg} from './h1';

/** 패널 진입·퇴장: 오른쪽에서 밀고 들어와 왼쪽으로 빠진다 */
const usePanel = (dur: number) => {
  const f = useCurrentFrame();
  const inT = ramp(f, 0, 12, 0, 1, E.outExpo);
  const outT = ramp(f, dur - 8, dur, 0, 1, E.inExpo);
  return {
    f,
    style: {
      transform: `translateX(${(1 - inT) * 420 - outT * 520}px)`,
      opacity: Math.min(inT * 1.4, 1 - outT),
      filter: inT < 0.98 || outT > 0.02 ? `blur(${(1 - inT) * 10 + outT * 10}px)` : undefined,
    } as React.CSSProperties,
  };
};

/* 01 — 작품 바이블 */
export const Bible: React.FC<{dur: number}> = ({dur}) => {
  const {f, style} = usePanel(dur);
  let wordIdx = 0;
  return (
    <AbsoluteFill>
      <TechBg hue={C.cyan} hue2={C.violet} />
      <AbsoluteFill style={style}>
        <SectionHeader index="01" agent="showrunner" role="작품 바이블 · 세계관" start={2} />
        <div style={{position: 'absolute', left: 110, top: 330, width: 1600}}>
          <div style={{fontFamily: F.mono, fontSize: 20, color: C.cyan, letterSpacing: '0.3em', marginBottom: 22, opacity: ramp(f, 6, 14)}}>LOGLINE</div>
          <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 60, lineHeight: 1.42, color: '#fff', letterSpacing: '-0.01em'}}>
            {LOGLINE.map((seg, si) =>
              seg.t.split(/(\s+)/).map((w, wi) => {
                if (!w.trim()) return <span key={`${si}-${wi}`}>{w}</span>;
                const at = 8 + wordIdx++ * 1.6;
                const t = ramp(f, at, at + 10, 0, 1, E.outExpo);
                const hl = seg.hl ? ramp(f, at + 6, at + 18, 0, 1, E.outQuart) : 0;
                return (
                  <span
                    key={`${si}-${wi}`}
                    style={{
                      display: 'inline-block',
                      opacity: t,
                      transform: `translateY(${(1 - t) * 24}px)`,
                      color: seg.hl ? seg.hl : '#fff',
                      backgroundImage: seg.hl ? `linear-gradient(${seg.hl}33, ${seg.hl}33)` : undefined,
                      backgroundSize: `${hl * 100}% 38%`,
                      backgroundPosition: '0 88%',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {w}
                  </span>
                );
              }),
            )}
          </div>
          <div style={{display: 'flex', gap: 18, marginTop: 56}}>
            {BIBLE_DOCS.map((d, i) => {
              const t = ramp(f, 44 + i * 4, 58 + i * 4, 0, 1, E.outBack);
              return (
                <div
                  key={d}
                  style={{
                    fontFamily: F.mono,
                    fontSize: 22,
                    color: '#dff',
                    padding: '12px 22px',
                    borderRadius: 12,
                    border: `1px solid ${C.cyan}55`,
                    background: 'rgba(34,211,238,0.08)',
                    opacity: t,
                    transform: `translateY(${(1 - t) * 30}px) scale(${0.8 + 0.2 * t})`,
                  }}
                >
                  ▤ {d}
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 02 — 12부작 구조 */
export const Structure: React.FC<{dur: number}> = ({dur}) => {
  const {f, style} = usePanel(dur);
  const bw = 92;
  const gap = 30;
  const total = EPISODES.length * bw + (EPISODES.length - 1) * gap;
  const left = (W - total) / 2;
  const base = 790;
  const maxH = 400;
  const tops = EPISODES.map((e, i) => {
    const t = ramp(f, 6 + i * 2.5, 22 + i * 2.5, 0, 1, E.outBack);
    return {x: left + i * (bw + gap) + bw / 2, y: base - e.h * maxH * t, t};
  });
  const path = tops.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y - 18}`).join(' ');
  const draw = ramp(f, 30, 66, 0, 1, E.inOutCubic);
  return (
    <AbsoluteFill>
      <TechBg hue={C.violet} hue2={C.magenta} />
      <AbsoluteFill style={style}>
        <SectionHeader index="02" agent="plot-architect" role="12부작 구조 · 클리프행어" start={2} color={C.violet} />
        <svg width={W} height={1080} style={{position: 'absolute'}}>
          <line x1={left - 30} x2={left + total + 30} y1={base} y2={base} stroke="rgba(255,255,255,0.25)" />
          {EPISODES.map((e, i) => (
            <rect
              key={e.ep}
              x={left + i * (bw + gap)}
              y={tops[i].y}
              width={bw}
              height={base - tops[i].y}
              rx={10}
              fill={e.color ?? 'rgba(168,107,255,0.35)'}
              fillOpacity={e.color ? 0.85 : 1}
              stroke={e.color ?? C.violet}
              strokeOpacity={0.7}
            />
          ))}
          <path d={path} fill="none" stroke="#fff" strokeWidth={3} strokeDasharray={3000} strokeDashoffset={3000 * (1 - draw)} style={{filter: 'drop-shadow(0 0 8px #fff)'}} />
          {tops.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y - 18} r={6} fill="#fff" opacity={draw > i / 12 ? 1 : 0} />
          ))}
        </svg>
        {EPISODES.map((e, i) => (
          <div key={e.ep} style={{position: 'absolute', left: left + i * (bw + gap) - 14, width: bw + 28, top: base + 14, textAlign: 'center', opacity: tops[i].t}}>
            <div style={{fontFamily: F.mono, fontSize: 20, color: '#fff', fontWeight: 700}}>{e.ep}</div>
            <div style={{fontFamily: F.sans, fontSize: 16, color: 'rgba(255,255,255,0.6)', marginTop: 4, whiteSpace: 'nowrap'}}>「{e.title}」</div>
          </div>
        ))}
        {EPISODES.map((e, i) => {
          if (!e.mark) return null;
          const at = 46 + ['EP06', 'EP09', 'EP11', 'EP12'].indexOf(e.ep) * 6;
          const t = ramp(f, at, at + 12, 0, 1, E.outBack);
          return (
            <div
              key={`m${i}`}
              style={{
                position: 'absolute',
                left: tops[i].x,
                top: tops[i].y - 92,
                transform: `translateX(-50%) scale(${t})`,
                opacity: t,
                fontFamily: F.sans,
                fontWeight: 800,
                fontSize: 22,
                color: '#0b0b10',
                background: e.color,
                padding: '6px 14px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
                boxShadow: `0 0 24px ${e.color}`,
              }}
            >
              {e.mark}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 03 — 인물 21명 */
export const Characters: React.FC<{dur: number}> = ({dur}) => {
  const {f, style} = usePanel(dur);
  const cw = 228;
  const ch = 120;
  const g = 16;
  const cols = 7;
  const left = (W - (cols * cw + (cols - 1) * g)) / 2;
  const top = 300;
  const center = (i: number) => ({x: left + (i % cols) * (cw + g) + cw / 2, y: top + Math.floor(i / cols) * (ch + g) + ch / 2});
  const lines = ramp(f, 48, 80, 0, 1, E.inOutCubic);
  return (
    <AbsoluteFill>
      <TechBg hue={C.magenta} hue2={C.gold} />
      <AbsoluteFill style={style}>
        <SectionHeader index="03" agent="character-designer" role="인물 21명 · 관계도 · 아크" start={2} color={C.magenta} />
        {CAST.map((c, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const at = 6 + (col + row) * 2.2;
          const t = ramp(f, at, at + 14, 0, 1, E.outExpo);
          const color = GROUP_COLOR[c.g];
          return (
            <div
              key={c.n}
              style={{
                position: 'absolute',
                left: left + col * (cw + g),
                top: top + row * (ch + g),
                width: cw,
                height: ch,
                borderRadius: 14,
                background: 'rgba(14,16,26,0.86)',
                border: `1px solid ${color}55`,
                borderLeft: `4px solid ${color}`,
                padding: '16px 18px',
                boxSizing: 'border-box',
                transform: `perspective(900px) rotateY(${(1 - t) * 80}deg)`,
                opacity: t,
                boxShadow: `0 10px 30px rgba(0,0,0,0.4)`,
              }}
            >
              <div style={{fontFamily: F.mono, fontSize: 15, color, opacity: 0.9}}>{c.n}</div>
              <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: c.name.length > 5 ? 24 : 30, color: '#fff', marginTop: 2, whiteSpace: 'nowrap'}}>{c.name}</div>
              <div style={{fontFamily: F.sans, fontWeight: 500, fontSize: 17, color: 'rgba(255,255,255,0.6)', marginTop: 2, whiteSpace: 'nowrap'}}>{c.role}</div>
            </div>
          );
        })}
        <svg width={W} height={1080} style={{position: 'absolute', pointerEvents: 'none', mixBlendMode: 'screen'}}>
          {RELATIONS.map(([a, b], k) => {
            const p = center(a);
            const q = center(b);
            const t = Math.min(1, Math.max(0, lines * RELATIONS.length - k * 0.5));
            return (
              <g key={k}>
                <line x1={p.x} y1={p.y} x2={p.x + (q.x - p.x) * t} y2={p.y + (q.y - p.y) * t} stroke={C.gold} strokeOpacity={0.7} strokeWidth={2.5} style={{filter: `drop-shadow(0 0 6px ${C.gold})`}} />
                {t > 0 ? <circle cx={p.x} cy={p.y} r={5} fill={C.goldHot} /> : null}
                {t >= 1 ? <circle cx={q.x} cy={q.y} r={5} fill={C.goldHot} /> : null}
              </g>
            );
          })}
        </svg>
        <div style={{position: 'absolute', left, top: top + 3 * (ch + g) + 18, fontFamily: F.mono, fontSize: 20, color: 'rgba(255,255,255,0.6)', opacity: ramp(f, 60, 72)}}>
          <Chars text="여성 인물 14명 · 군상극 DNA — 전원 입체화" start={60} stagger={0.6} dur={8} from={{opacity: 0}} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
