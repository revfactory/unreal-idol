import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {KenBurns} from '../components/fx';
import {Counter, SyncWords} from '../components/text';
import {VO} from '../components/audio';
import {E, lerp, ramp, rnd} from '../lib/anim';
import {C, F, W} from '../lib/theme';
import {EPISODES} from './data';
import {TechBg} from './h1';

const Compact: React.FC<{kicker: string; title: string; color: string; start: number; end?: number}> = ({kicker, title, color, start, end = 9999}) => {
  const f = useCurrentFrame();
  const o = ramp(f, start, start + 12) * ramp(f, end - 8, end, 1, 0);
  return (
    <div style={{position: 'absolute', left: 60, top: 46, opacity: o, transform: `translateY(${(1 - ramp(f, start, start + 12)) * -14}px)`}}>
      <div style={{fontFamily: F.mono, fontSize: 22, color, letterSpacing: '0.12em'}}>{kicker}</div>
      <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 34, color: '#fff'}}>{title}</div>
    </div>
  );
};

/* ───────────── 검수 게이트 4단 ───────────── */
const GATES = [
  {name: '대사 밀도', agent: 'dialogue-coach', result: '침묵 씬 판정 · 보강'},
  {name: '방송 포맷', agent: 'script-formatter', result: '마크다운 잔재 0건'},
  {name: '자연스러움', agent: 'naturalness-reviewer', result: '번역투 0건', codex: true},
  {name: '연속성', agent: 'continuity-editor', result: '약속 60/60'},
];
const FIXES = [
  {from: '다리 너머로 시선을 던진다', to: '다리 너머를 본다', tag: '번역투 · AI 패턴'},
  {from: '두 사람의 시선이 만난다', to: '두 사람 눈이 마주친다', tag: '번역투 · AI 패턴'},
  {from: '모니터 빛이 그의 얼굴에 닿는다', to: '모니터 빛이 도윤 얼굴에 닿는다', tag: '번역투 · 대명사'},
];

export const Gates: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const gx = [560, 880, 1200, 1520];
  const arrive = [10, 18, 26, 112];
  // 문서 썸네일 이동 경로
  const keys: [number, number][] = [
    [0, 200],
    [10, gx[0]],
    [18, gx[1]],
    [26, gx[2]],
    [100, gx[2]],
    [112, gx[3]],
    [150, gx[3]],
    [176, 2150],
  ];
  let docX = keys[0][1];
  for (let k = 0; k < keys.length - 1; k++) {
    const [a, xa] = keys[k];
    const [b, xb] = keys[k + 1];
    if (f >= a) docX = lerp(xa, xb, ramp(f, a, b, 0, 1, E.inOutCubic));
  }
  const panel = ramp(f, 28, 40, 0, 1, E.outExpo) * ramp(f, 96, 106, 1, 0, E.inExpo);
  const stampT = ramp(f, 118, 126, 0, 1, E.outQuart);
  const stampO = stampT * ramp(f, 158, 172, 1, 0);
  const gatesIn = ramp(f, 0, 14, 0, 1, E.outExpo);
  return (
    <AbsoluteFill>
      <TechBg hue={C.green} hue2={C.cyan} />
      <Compact kicker="QUALITY GATES × 4" title="네 개의 검수 관문" color={C.green} start={2} />
      {GATES.map((g, i) => {
        const passed = f >= arrive[i] + (g.codex ? 74 : 0);
        const scan = ramp(f, arrive[i], arrive[i] + 10, 0, 1, E.linear);
        const scanning = f >= arrive[i] && f < arrive[i] + 10;
        const col = passed ? C.green : g.codex ? C.gold : 'rgba(255,255,255,0.5)';
        return (
          <div key={g.name} style={{position: 'absolute', left: gx[i] - 110, top: 250, width: 220, opacity: gatesIn, transform: `translateY(${(1 - gatesIn) * (40 + i * 20)}px)`}}>
            <div style={{textAlign: 'center', marginBottom: 14}}>
              <div style={{fontFamily: F.mono, fontSize: 16, color: col, letterSpacing: '0.06em'}}>{`0${i + 1} · ${g.agent}`}</div>
              <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 30, color: '#fff'}}>{g.name}</div>
              {g.codex ? <div style={{fontFamily: F.mono, fontSize: 14, color: C.gold, marginTop: 4}}>OpenAI Codex CLI</div> : <div style={{height: 21}} />}
            </div>
            <div
              style={{
                position: 'relative',
                height: 440,
                borderRadius: 20,
                border: `2px solid ${col}`,
                background: passed ? 'rgba(62,230,143,0.08)' : 'rgba(255,255,255,0.03)',
                boxShadow: passed || scanning ? `0 0 40px ${col}66, inset 0 0 40px ${col}33` : undefined,
                overflow: 'hidden',
              }}
            >
              {scanning && <div style={{position: 'absolute', left: 0, right: 0, top: `${scan * 100}%`, height: 4, background: col, boxShadow: `0 0 24px ${col}`}} />}
              {passed && (
                <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 90, color: C.green, transform: `scale(${ramp(f, arrive[i] + (g.codex ? 74 : 0), arrive[i] + (g.codex ? 84 : 10), 0.4, 1, E.outBack)})`}}>
                  ✓
                </div>
              )}
            </div>
            <div style={{textAlign: 'center', marginTop: 14, fontFamily: F.sans, fontWeight: 700, fontSize: 22, color: passed ? C.green : 'rgba(255,255,255,0.3)'}}>{g.result}</div>
          </div>
        );
      })}
      {/* 문서 썸네일 */}
      <div
        style={{
          position: 'absolute',
          left: docX - 70,
          top: 470,
          width: 140,
          height: 180,
          borderRadius: 6,
          background: '#f3efe6',
          boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(255,255,255,0.25)`,
          padding: 16,
          boxSizing: 'border-box',
        }}
      >
        {Array.from({length: 9}).map((_, k) => (
          <div key={k} style={{height: 6, width: `${60 + rnd(`dl${k}`) * 40}%`, background: k % 4 === 0 ? '#555' : '#bbb', borderRadius: 3, marginBottom: 10}} />
        ))}
      </div>
      {/* Codex 검수 패널 */}
      {panel > 0.01 && <AbsoluteFill style={{background: 'rgba(0,0,0,0.6)', opacity: panel}} />}
      {panel > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: W / 2 - 640,
            top: 250,
            width: 1280,
            padding: '34px 44px',
            borderRadius: 26,
            background: '#0c0e16',
            border: `1px solid ${C.gold}66`,
            boxShadow: `0 40px 120px rgba(0,0,0,0.7), 0 0 60px ${C.gold}22`,
            transform: `scale(${0.6 + 0.4 * panel})`,
            transformOrigin: `${gx[2] - (W / 2 - 640)}px 300px`,
            opacity: panel,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 26}}>
            <span style={{fontFamily: F.mono, fontSize: 22, color: C.gold}}>script-naturalness-reviewer</span>
            <span style={{fontFamily: F.mono, fontSize: 18, color: '#111', background: C.gold, padding: '4px 12px', borderRadius: 8}}>codex exec</span>
            <span style={{fontFamily: F.sans, fontSize: 20, color: 'rgba(255,255,255,0.6)'}}>Claude 초고 위에 OpenAI의 두 번째 시선</span>
          </div>
          {FIXES.map((x, k) => {
            const at = 40 + k * 12;
            const strike = ramp(f, at, at + 8, 0, 1, E.inOutCubic);
            const fix = ramp(f, at + 6, at + 16, 0, 1, E.outExpo);
            return (
              <div key={k} style={{display: 'flex', alignItems: 'center', gap: 24, fontFamily: F.sans, fontSize: 32, lineHeight: '64px', opacity: ramp(f, at - 6, at)}}>
                <span style={{position: 'relative', color: 'rgba(255,255,255,0.55)', width: 470}}>
                  {x.from}
                  <span style={{position: 'absolute', left: 0, top: '52%', height: 3, width: `${strike * 100}%`, background: C.red}} />
                </span>
                <span style={{color: C.gold, fontSize: 28}}>→</span>
                <span style={{color: '#fff', fontWeight: 700, width: 470, opacity: fix, transform: `translateX(${(1 - fix) * 20}px)`}}>{x.to}</span>
                <span style={{fontFamily: F.mono, fontSize: 16, color: C.gold, opacity: fix}}>{x.tag}</span>
              </div>
            );
          })}
          <div style={{marginTop: 22, fontFamily: F.mono, fontSize: 22, color: 'rgba(255,255,255,0.75)', opacity: ramp(f, 78, 88)}}>
            EP01 · 식별 56건 · 수용 41 · 재작성 7 · 기각 5 <span style={{color: C.gold}}>(작가 의도 보존)</span>
          </div>
        </div>
      )}
      {/* 최종 스탬프 */}
      {stampO > 0.01 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
          <div style={{transform: `rotate(-8deg) scale(${2.2 - 1.2 * stampT})`, opacity: stampO, textAlign: 'center', padding: '18px 46px', border: `8px solid ${C.green}`, borderRadius: 24, background: 'rgba(5,20,12,0.82)', boxShadow: `0 0 80px ${C.green}66`}}>
            <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 130, color: C.green, lineHeight: 1}}>60/60 PASS</div>
            <div style={{fontFamily: F.mono, fontSize: 24, color: '#d9ffe9', marginTop: 8}}>작가적 약속 12회 × 5 · 복선 회수 51/52</div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ───────────── 11개 회차 병렬 집필 ───────────── */
export const Sprint: React.FC<{go: number; voB11: number; voB12: number}> = ({go, voB11, voB12}) => {
  const f = useCurrentFrame();
  const lanes = EPISODES.slice(1);
  const top = 200;
  const rowH = 62;
  const trackL = 520;
  const trackW = 1040;
  const timerEnd = voB11;
  const minutes = ramp(f, go, timerEnd, 0, 30, E.inOutCubic);
  const mm = Math.floor(minutes);
  const ss = Math.floor((minutes - mm) * 60);
  const collapse = ramp(f, voB12 - 32, voB12 - 16, 0, 1, E.inExpo);
  const totals = ramp(f, voB12 - 14, voB12 + 2, 0, 1, E.outExpo);
  const allDone = f >= timerEnd;
  return (
    <AbsoluteFill>
      <TechBg hue={C.cyan} hue2={C.violet} />
      <Compact kicker="PARALLEL SPAWN × 11" title="EP02–EP12 동시 집필" color={C.cyan} start={2} end={voB12 - 10} />
      <div style={{position: 'absolute', right: 80, top: 40, textAlign: 'right', opacity: ramp(f, 4, 14) * (1 - collapse)}}>
        <div style={{fontFamily: F.mono, fontSize: 18, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.2em'}}>ELAPSED</div>
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 84,
            lineHeight: 1,
            color: allDone ? C.green : '#fff',
            textShadow: allDone ? `0 0 30px ${C.green}` : undefined,
            transform: `scale(${allDone ? 1 + 0.12 * ramp(f, timerEnd, timerEnd + 4, 1, 0) : 1})`,
            transformOrigin: 'right center',
          }}
        >
          {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
        </div>
        <div style={{fontFamily: F.sans, fontSize: 20, color: 'rgba(255,255,255,0.65)', marginTop: 6, opacity: ramp(f, timerEnd, timerEnd + 10)}}>
          직렬 추정 5~6시간 → <b style={{color: C.green}}>병렬 30분</b>
        </div>
      </div>
      <AbsoluteFill style={{opacity: 1 - collapse, transform: `scaleY(${1 - collapse * 0.7})`}}>
        {lanes.map((e, i) => {
          const y = top + i * rowH;
          const enter = ramp(f, i * 2.5, i * 2.5 + 14, 0, 1, E.outExpo);
          const s0 = go + rnd(`ls${i}`) * 6;
          const s1 = timerEnd - 28 + rnd(`le${i}`) * 26;
          let p = ramp(f, s0, s1, 0, 1, E.inOutCubic);
          // 에이전트 작업처럼 보이게 조금씩 멈칫거림
          if (p > 0.02 && p < 0.98) p += (rnd(`j${i}-${Math.floor(f / 5)}`) - 0.5) * 0.015;
          p = Math.min(1, Math.max(0, p));
          const done = f >= s1;
          return (
            <div key={e.ep} style={{position: 'absolute', left: 0, top: y, width: W, height: rowH, opacity: enter, transform: `translateX(${(1 - enter) * -120}px)`}}>
              <div style={{position: 'absolute', left: 110, top: 12, display: 'flex', alignItems: 'baseline', gap: 14}}>
                <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: done ? C.green : C.cyan}}>{e.ep}</span>
                <span style={{fontFamily: F.sans, fontWeight: 600, fontSize: 24, color: '#fff'}}>「{e.title}」</span>
              </div>
              <div style={{position: 'absolute', left: trackL, top: 24, width: trackW, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.08)'}}>
                <div
                  style={{
                    width: `${p * 100}%`,
                    height: '100%',
                    borderRadius: 7,
                    background: done ? C.green : `linear-gradient(90deg, ${C.cyan}, ${C.violet})`,
                    boxShadow: done ? `0 0 16px ${C.green}` : `0 0 16px ${C.cyan}88`,
                  }}
                />
                {!done && p > 0 && <div style={{position: 'absolute', left: `${p * 100}%`, top: -5, width: 24, height: 24, marginLeft: -12, borderRadius: 12, background: '#fff', boxShadow: `0 0 20px ${C.cyan}, 0 0 40px ${C.cyan}`}} />}
              </div>
              <div style={{position: 'absolute', left: trackL + trackW + 40, top: 12, fontFamily: F.mono, fontSize: 24, color: done ? C.green : '#fff', width: 220}}>
                {Math.round(e.lines * p).toLocaleString('en-US')}줄 {done ? '✓' : ''}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      {/* 합계 */}
      {totals > 0.01 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: totals, transform: `scale(${0.9 + 0.1 * totals})`}}>
          <div style={{fontFamily: F.mono, fontSize: 24, color: C.gold, letterSpacing: '0.4em', marginBottom: 6}}>TOTAL</div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 20}}>
            <span
              style={{
                fontFamily: F.display,
                fontWeight: 900,
                fontSize: 250,
                lineHeight: 1,
                background: `linear-gradient(135deg, #fff 0%, ${C.gold} 60%, #c98a2e 100%)`,
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              <Counter to={18230} start={voB12 - 12} end={voB12 + 40} easing={E.outExpo} />
            </span>
            <span style={{fontFamily: F.sans, fontWeight: 800, fontSize: 90, color: '#fff'}}>줄</span>
          </div>
          <div style={{display: 'flex', gap: 22, marginTop: 30}}>
            {[
              [657, '씬'],
              [12, '부작'],
              [21, '인물'],
              [27, '에이전트'],
            ].map(([n, l], k) => (
              <div key={l} style={{padding: '12px 28px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.05)', fontFamily: F.sans, fontSize: 30, color: '#fff', opacity: ramp(f, voB12 + k * 4, voB12 + 10 + k * 4)}}>
                <b style={{fontFamily: F.display, fontWeight: 900}}>
                  <Counter to={n as number} start={voB12 + k * 4} end={voB12 + 30 + k * 4} />
                </b>{' '}
                {l}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ───────────── 피날레 ───────────── */
export const Finale: React.FC<{voB13: number; dur: number}> = ({voB13, dur}) => {
  const f = useCurrentFrame();
  const w = VO.B13.words;
  const credits = ramp(f, 58, 74, 0, 1, E.outExpo);
  const fade = ramp(f, dur - 12, dur, 1, 0);
  return (
    <AbsoluteFill style={{background: '#000', opacity: fade}}>
      <KenBurns src="img/h02_scripts.png" dur={dur} from={{s: 1.22, y: 1}} to={{s: 1.06, y: 0}} filter="brightness(0.55) saturate(1.15)" easing={E.outQuart} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,0,0,0.35), rgba(0,0,0,0.85))'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 120 * credits}}>
        <div style={{textAlign: 'center', transform: `scale(${1 - 0.18 * credits})`}}>
          <SyncWords words={w.slice(0, 2)} start={voB13} style={{fontFamily: F.serif, fontWeight: 700, fontSize: 96, color: '#fff', justifyContent: 'center'}} from={{y: 30, blur: 16, opacity: 0}} />
          <div style={{height: 10}} />
          <SyncWords
            words={w.slice(2)}
            start={voB13}
            style={{fontFamily: F.serif, fontWeight: 900, fontSize: 120, justifyContent: 'center'}}
            wordStyle={() => ({background: `linear-gradient(100deg, ${C.goldHot}, ${C.gold} 50%, ${C.teal})`, WebkitBackgroundClip: 'text', color: 'transparent'})}
            from={{y: 30, blur: 16, opacity: 0, scale: 1.15}}
          />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 120, opacity: credits}}>
        <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 34, color: '#fff', letterSpacing: '0.04em'}}>〈언리얼 아이돌〉 12부작 대본 — 657씬 · 18,230줄</div>
        <div style={{fontFamily: F.mono, fontSize: 20, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.18em', marginTop: 14}}>HARNESS ENGINEERING · CLAUDE CODE × DRAMA-ORCHESTRATOR · 27 AGENTS · 10 SKILLS</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

