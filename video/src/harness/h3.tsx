import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {TypeOn} from '../components/text';
import {E, lerp, ramp} from '../lib/anim';
import {C, F, H, W} from '../lib/theme';
import {PERSONA_LINES} from './data';
import {SectionHeader, TechBg} from './h1';

const PW = 760;
const PH = 860;

type Block = {name: string; paren: string; line: string; ph: string; y: number};
const BLOCKS: Block[] = [
  {name: '유하이', paren: '(15초 호흡 후. 1어절)', line: '……그래도.', ph: '[DIALOGUE: 유하이 — 결정의 한 마디]', y: 196},
  {name: '차로아', paren: '(-해체. 짧게)', line: '……알겠어, 언니.', ph: '[DIALOGUE: 차로아 — 따르겠다는 대답]', y: 426},
  {name: '박은오', paren: '(마스크 살짝 내림)', line: '한 줄만 — 시아 언니가 직접 쓴 가사로.', ph: '[DIALOGUE: 박은오 — 단 하나의 부탁]', y: 606},
];
const ACTIONS: {t: string; y: number; bold?: boolean; dim?: boolean; at: number}[] = [
  {t: 'S#29. 올텀 본사 5층 연습실 / 아침 09:30 / 내경', y: 56, bold: true, at: 4},
  {t: '[등장] 유하이 → 6인, 한도윤', y: 98, dim: true, at: 18},
  {t: '유하이가 천천히 일어선다. 15초의 호흡.', y: 146, at: 28},
  {t: 'S#30. 올텀 본사 5층 연습실 / 아침 09:33 / 내경', y: 336, bold: true, at: 56},
  {t: '차로아가 일어선다. 유하이 옆에 가서 선다.', y: 380, at: 68},
  {t: '박은오가 가사 노트를 들고 일어선다.', y: 560, at: 84},
];
const PH_AT = [44, 78, 96];
const SELECTED = [0, 2, 3]; // PERSONA_LINES 에서 유하이·차로아·박은오

/** 대본 페이지. fills[k] 가 1 이면 k 번째 placeholder 가 대사로 채워진다. */
const ScriptPage: React.FC<{f: number; fills: number[]; glow: number}> = ({f, fills, glow}) => (
  <div
    style={{
      position: 'relative',
      width: PW,
      height: PH,
      background: '#f3efe6',
      borderRadius: 6,
      boxShadow: '0 50px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.1)',
      fontFamily: F.sans,
      color: '#1b1b1f',
      overflow: 'hidden',
    }}
  >
    <div style={{position: 'absolute', right: 40, top: 20, fontFamily: F.mono, fontSize: 14, color: '#999'}}>EP01 · script.md</div>
    {ACTIONS.map((a) => (
      <div key={a.t} style={{position: 'absolute', left: 56, top: a.y, fontSize: a.bold ? 23 : a.dim ? 19 : 22, fontWeight: a.bold ? 800 : 500, color: a.dim ? '#666' : '#1b1b1f'}}>
        <TypeOn text={a.t} start={a.at} cps={60} cursor={false} />
      </div>
    ))}
    {BLOCKS.map((b, k) => {
      const pop = ramp(f, PH_AT[k], PH_AT[k] + 10, 0, 1, E.outBack);
      const fill = fills[k];
      return (
        <div key={b.name} style={{position: 'absolute', left: 56, top: b.y, width: PW - 112, height: 112}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              border: `2px dashed ${C.magenta}`,
              borderRadius: 10,
              background: 'rgba(255,63,164,0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: F.mono,
              fontSize: 19,
              color: '#d1267f',
              opacity: pop * (1 - fill),
              transform: `scale(${(0.8 + 0.2 * pop) * (1 + fill * 0.05)})`,
            }}
          >
            {b.ph}
          </div>
          <div style={{position: 'absolute', inset: 0, padding: '2px 4px', opacity: fill, transform: `translateY(${(1 - fill) * 12}px)`}}>
            <div style={{fontWeight: 800, fontSize: 22}}>{b.name}</div>
            <div style={{fontSize: 18, color: '#666', marginTop: 4}}>{b.paren}</div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 600,
                marginTop: 6,
                display: 'inline-block',
                background: k === 0 ? `linear-gradient(transparent 55%, rgba(246,196,106,${0.75 * glow}) 55%)` : undefined,
              }}
            >
              {b.line}
            </div>
          </div>
        </div>
      );
    })}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center', fontFamily: F.mono, fontSize: 15, color: '#aaa'}}>— 29 —</div>
  </div>
);

/** 페르소나 15명의 원형 배치 */
const personaPos = (i: number) => {
  const ang = -Math.PI / 2 + (i / PERSONA_LINES.length) * Math.PI * 2;
  return {x: W / 2 + Math.cos(ang) * 790, y: 520 + Math.sin(ang) * 372};
};

export const Personas: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const P1 = 125; // 병렬 호출 시작
  const P2 = 262; // 대화 직조 시작
  const P3 = 340; // 정적 속 클로즈업
  const P4 = dur - 46; // 검수 게이트로 이동
  // 페이지 카메라: 위치·스케일을 구간별로 보간
  const toCenter = ramp(f, P1, P1 + 24, 0, 1, E.inOutQuint);
  const back = ramp(f, P2, P2 + 30, 0, 1, E.inOutQuint);
  const push = ramp(f, P3 - 30, P4, 0, 1, E.inOutCubic);
  const exit = ramp(f, P4, dur, 0, 1, E.inOutQuint);
  let cx = lerp(700, W / 2, toCenter);
  let cy = 580 - 40 * toCenter;
  let s = lerp(0.92, 0.5, toCenter);
  s = lerp(s, 1, back);
  cy = lerp(cy, H / 2, back);
  // 클로즈업: 「……그래도.」 줄 쪽으로
  s = lerp(s, 1.55, push);
  cx = lerp(cx, W / 2 + 330, push);
  cy = lerp(cy, H / 2 + 260, push);
  // 퇴장: 작게 줄어 왼쪽으로
  s = lerp(s, 0.26, exit);
  cx = lerp(cx, 210, exit);
  cy = lerp(cy, H / 2, exit);
  const rotY = lerp(lerp(14, 6, ramp(f, 0, P1)), 0, toCenter);
  const fills = BLOCKS.map((_, k) => ramp(f, P2 + 30 + k * 8, P2 + 44 + k * 8, 0, 1, E.outQuart));
  const glow = ramp(f, P3 - 10, P3 + 10, 0, 1);
  const burstOn = f >= P1 + 6 && f < P2 + 40;
  const dim = ramp(f, P2, P2 + 14, 1, 0);
  const zeroLines = f < P1;
  return (
    <AbsoluteFill>
      <TechBg hue={C.magenta} hue2={C.violet} />
      {/* 병렬 호출 선 */}
      {burstOn && (
        <svg width={W} height={H} style={{position: 'absolute'}}>
          {PERSONA_LINES.map((p, i) => {
            const pos = personaPos(i);
            const t = ramp(f, P1 + 6 + i * 1.5, P1 + 18 + i * 1.5, 0, 1, E.outExpo);
            const sel = SELECTED.includes(i);
            return (
              <line
                key={i}
                x1={W / 2}
                y1={H / 2}
                x2={W / 2 + (pos.x - W / 2) * t}
                y2={H / 2 + (pos.y - H / 2) * t}
                stroke={p.color}
                strokeOpacity={0.45 * (sel ? 1 : dim)}
                strokeWidth={1.5}
                strokeDasharray="6 8"
                strokeDashoffset={-f * 2}
              />
            );
          })}
        </svg>
      )}
      {/* 대본 페이지 */}
      <div
        style={{
          position: 'absolute',
          left: cx - PW / 2,
          top: cy - PH / 2,
          transform: `perspective(1800px) rotateY(${rotY}deg) scale(${s})`,
          transformOrigin: '50% 50%',
          opacity: ramp(f, 0, 10),
        }}
      >
        <ScriptPage f={f} fills={fills} glow={glow} />
      </div>
      {/* 페르소나 15명 */}
      {burstOn &&
        PERSONA_LINES.map((p, i) => {
          const pos = personaPos(i);
          const at = P1 + 10 + (i % 8) * 3 + Math.floor(i / 8) * 9;
          const t = ramp(f, at, at + 12, 0, 1, E.outBack);
          const selIdx = SELECTED.indexOf(i);
          // 직조: 선택된 대사는 페이지의 빈칸으로 날아간다
          const fly = selIdx >= 0 ? ramp(f, P2 + 4 + selIdx * 8, P2 + 34 + selIdx * 8, 0, 1, E.inOutCubic) : 0;
          const tx = W / 2;
          const ty = H / 2 + (BLOCKS[Math.max(0, selIdx)].y + 56 - PH / 2);
          const x = lerp(pos.x, tx, fly);
          const y = lerp(pos.y, ty, fly);
          const o = selIdx >= 0 ? t * (1 - ramp(f, P2 + 30 + selIdx * 8, P2 + 40 + selIdx * 8)) : t * dim;
          return (
            <div
              key={p.name}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: `translate(-50%, -50%) scale(${(0.6 + 0.4 * t) * (1 - fly * 0.25)})`,
                opacity: o,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px 6px 10px', borderRadius: 999, background: 'rgba(10,12,20,0.85)', border: `1px solid ${p.color}88`}}>
                <div style={{width: 10, height: 10, borderRadius: 5, background: p.color, boxShadow: `0 0 10px ${p.color}`}} />
                <span style={{fontFamily: F.sans, fontWeight: 800, fontSize: 20, color: '#fff'}}>{p.name}</span>
                <span style={{fontFamily: F.mono, fontSize: 13, color: p.color}}>persona</span>
              </div>
              <div
                style={{
                  maxWidth: 340,
                  textAlign: 'center',
                  fontFamily: F.sans,
                  fontWeight: 600,
                  fontSize: 22,
                  lineHeight: 1.35,
                  color: '#111',
                  background: '#fff',
                  padding: '10px 16px',
                  borderRadius: 16,
                  boxShadow: `0 8px 30px rgba(0,0,0,0.45), 0 0 0 2px ${p.color}`,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {p.line}
              </div>
            </div>
          );
        })}
      {/* 헤더 */}
      {f < P1 + 4 && (
        <>
          <SectionHeader index="04" agent="action-writer" role="지문 전담 — 대사는 비워 둔다" start={4} color={C.cyan} x={1190} y={190} />
          <div style={{position: 'absolute', left: 1190, top: 380, opacity: ramp(f, 30, 44) * (zeroLines ? 1 : 0)}}>
            <div style={{fontFamily: F.mono, fontSize: 20, color: C.magenta, letterSpacing: '0.3em'}}>DIALOGUE LINES</div>
            <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 210, lineHeight: 1, color: '#fff'}}>
              0<span style={{fontSize: 80, marginLeft: 16}}>줄</span>
            </div>
          </div>
        </>
      )}
      {f >= P1 + 4 && f < P2 && (
        <div style={{position: 'absolute', left: 60, top: 46, opacity: ramp(f, P1 + 4, P1 + 16)}}>
          <div style={{fontFamily: F.mono, fontSize: 22, color: C.magenta, letterSpacing: '0.12em'}}>PARALLEL × 15</div>
          <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 34, color: '#fff'}}>페르소나 에이전트 동시 호출</div>
        </div>
      )}
      {f >= P2 && f < P4 && (
        <div style={{position: 'absolute', left: 60, top: 46, opacity: ramp(f, P2, P2 + 12)}}>
          <div style={{fontFamily: F.mono, fontSize: 22, color: C.gold, letterSpacing: '0.08em'}}>dialogue-conductor → script-assembler</div>
          <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 34, color: '#fff'}}>각자의 목소리를 한 장면으로 엮는다</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
