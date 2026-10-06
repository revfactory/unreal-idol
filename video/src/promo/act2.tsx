import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {ParticleField, useImageTargets} from '../components/particles';
import {Glitch, KenBurns, LightLeak} from '../components/fx';
import {Counter, GlitchText, Slam, SyncWords} from '../components/text';
import {VO} from '../components/audio';
import {E, pulse, ramp, rnd} from '../lib/anim';
import {C, F} from '../lib/theme';

/** 드롭 구간 비트 길이 (129 BPM) */
export const BEAT = (60 / 129.2) * 30;
const beatsFrom = (offset: number, len: number) => {
  const out: number[] = [];
  for (let b = -offset % BEAT; b < len; b += BEAT) if (b >= 0) out.push(b);
  return out;
};
const shadow = '0 4px 40px rgba(0,0,0,0.6)';

/* a. 데뷔 — 빛 입자가 모여 「뉴」가 된다 */
export const Debut: React.FC<{voA06: number; dur: number}> = ({voA06, dur}) => {
  const f = useCurrentFrame();
  const targets = useImageTargets('img/p06_neu.png', 11000, 0.2, 'neu');
  const s = 1.12 + 0.1 * ramp(f, 0, dur, 0, 1, E.linear);
  const beat = pulse(f, beatsFrom(0, dur), 5);
  const imgO = ramp(f, 34, 70, 0, 1, E.inOutCubic);
  const neuAt = voA06 + Math.round(VO.A06.words[3][1] * 30) - 2;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${s * (1 + beat * 0.025)})`}}>
        <AbsoluteFill style={{opacity: imgO}}>
          <Img src={staticFile('img/p06_neu.png')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.25) contrast(1.1)'}} />
        </AbsoluteFill>
        <ParticleField targets={targets} progress={ramp(f, 0, 40, 0, 1, E.linear)} frame={f} origin="scatter" spread={2.4} swirl={380} size={3.2} trail={0.03} opacity={1 - 0.6 * ramp(f, 56, 96)} seed="neu" />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, transparent 40%, rgba(0,0,0,0.55) 75%)'}} />
      <LightLeak color={C.violet} opacity={0.35} seed="d1" speed={2} />
      <div style={{position: 'absolute', left: 1120, top: 300}}>
        <SyncWords
          words={VO.A06.words.slice(0, 3)}
          start={voA06}
          style={{fontFamily: F.display, fontWeight: 800, fontSize: 62, color: '#fff', letterSpacing: '0.02em', textShadow: shadow}}
          from={{x: 0, y: 30, blur: 14, opacity: 0}}
        />
        <Slam start={neuAt} from={2.4} dur={8} shake={16} style={{marginTop: -10}}>
          <GlitchText amount={ramp(f, neuAt, neuAt + 30, 1, 0.12)} seed="neu-t">
            <div
              style={{
                fontFamily: F.serif,
                fontWeight: 900,
                fontSize: 330,
                lineHeight: 1.05,
                background: `linear-gradient(180deg, ${C.goldHot} 0%, ${C.gold} 55%, #b57a2a 100%)`,
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                filter: `drop-shadow(0 0 40px rgba(246,196,106,0.55))`,
              }}
            >
              뉴
            </div>
          </GlitchText>
          <div style={{fontFamily: F.mono, fontSize: 40, letterSpacing: '0.9em', color: C.teal, marginTop: -10, textShadow: `0 0 18px ${C.teal}`}}>NEU</div>
        </Slam>
      </div>
    </AbsoluteFill>
  );
};

/* b. 1억 뷰 */
export const Views: React.FC<{dur: number; offset: number}> = ({dur, offset}) => {
  const f = useCurrentFrame();
  const beat = pulse(f, beatsFrom(offset, dur), 5);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${1 + beat * 0.035})`}}>
        <KenBurns src="img/p07_concert.png" dur={dur} from={{s: 1.25, y: 2}} to={{s: 1.1, y: 0}} filter="saturate(1.3) brightness(0.65)" easing={E.outQuart} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.55), transparent 70%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 30, letterSpacing: '0.6em', color: C.teal, marginBottom: 6, opacity: ramp(f, 0, 6)}}>조회수</div>
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 900,
            fontSize: 190,
            color: '#fff',
            letterSpacing: '-0.02em',
            transform: `scale(${1 + beat * 0.04})`,
            textShadow: `0 0 50px rgba(168,107,255,0.7), ${shadow}`,
          }}
        >
          <Counter to={100000000} start={0} end={40} easing={E.outQuart} />
        </div>
        <Slam start={38} from={1.6} dur={7} shake={8}>
          <div
            style={{
              marginTop: 14,
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 56,
              color: '#111',
              background: C.gold,
              padding: '6px 34px 10px',
              borderRadius: 999,
              boxShadow: `0 0 50px ${C.gold}`,
            }}
          >
            1억 뷰 돌파
          </div>
        </Slam>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* c. 전 세계가 열광했다 — 도시 이름 마키 */
const CITIES = ['SEOUL', 'LOS ANGELES', '東京', 'LONDON', 'SÃO PAULO', 'PARIS', 'JAKARTA', 'MANILA', 'BANGKOK', 'MEXICO CITY', 'BERLIN', '台北', 'NEW YORK', 'SYDNEY'];

export const World: React.FC<{voA07: number; dur: number; offset: number}> = ({voA07, dur, offset}) => {
  const f = useCurrentFrame();
  const beat = pulse(f, beatsFrom(offset, dur), 5);
  const rows = [150, 340, 560, 760];
  const w = VO.A07.words;
  const at = (i: number) => voA07 + Math.round(w[i][1] * 30) - 2;
  return (
    <AbsoluteFill style={{background: '#05040a'}}>
      <KenBurns src="img/p07_concert.png" dur={dur} from={{s: 1.3}} to={{s: 1.45}} filter="blur(8px) brightness(0.35) saturate(1.4)" />
      {rows.map((y, r) => {
        const dir = r % 2 ? 1 : -1;
        const x = dir * (f * (14 + r * 3)) - 1400 * (r % 2);
        const list = [...CITIES.slice(r * 3), ...CITIES.slice(0, r * 3), ...CITIES];
        return (
          <div
            key={r}
            style={{
              position: 'absolute',
              top: y,
              left: x,
              whiteSpace: 'nowrap',
              fontFamily: F.display,
              fontWeight: 900,
              fontSize: 150,
              lineHeight: 1,
              letterSpacing: '0.02em',
            }}
          >
            {list.map((c, i) => (
              <span
                key={i}
                style={{
                  marginRight: 60,
                  color: (i + r) % 3 === 0 ? `rgba(168,107,255,${0.35 + beat * 0.4})` : 'transparent',
                  WebkitTextStroke: (i + r) % 3 === 0 ? undefined : '2px rgba(255,255,255,0.28)',
                }}
              >
                {c}
              </span>
            ))}
          </div>
        );
      })}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 36}}>
        <Slam start={at(0)} from={1.8} dur={7} shake={8}>
          <span style={{fontFamily: F.display, fontWeight: 900, fontSize: 150, color: '#fff', textShadow: shadow}}>전 세계가</span>
        </Slam>
        <Slam start={at(2)} from={2.2} dur={7} shake={14}>
          <span
            style={{
              fontFamily: F.display,
              fontWeight: 900,
              fontSize: 150,
              color: C.gold,
              textShadow: `0 0 40px rgba(246,196,106,0.7), ${shadow}`,
            }}
          >
            열광했다
          </span>
        </Slam>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* d. 빌보드 HOT 100 — 순위 상승 */
export const Chart: React.FC<{dur: number; offset: number}> = ({dur, offset}) => {
  const f = useCurrentFrame();
  const beat = pulse(f, beatsFrom(offset, dur), 5);
  const flash = [8, 31].some((a) => f >= a && f < a + 2) ? 0.3 : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <KenBurns src="img/p11_keyart.png" dur={dur} from={{s: 1.2}} to={{s: 1.3}} filter="blur(12px) brightness(0.42) saturate(1.4)" />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 60, transform: `scale(${1 + beat * 0.02})`}}>
          <div style={{textAlign: 'right'}}>
            <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 44, color: C.teal, letterSpacing: '0.12em'}}>빌보드 HOT 100</div>
            <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 52, color: '#fff', marginTop: 10}}>ECHO — 〈Unreal〉</div>
            <div style={{fontFamily: F.mono, fontSize: 30, color: C.green, marginTop: 14}}>
              ▲ <Counter from={0} to={92} start={2} end={40} easing={E.outQuart} />
            </div>
          </div>
          <div
            style={{
              fontFamily: F.display,
              fontWeight: 900,
              fontSize: 330,
              lineHeight: 1,
              color: '#fff',
              textShadow: `0 0 60px rgba(53,240,222,0.55), ${shadow}`,
            }}
          >
            #<Counter from={100} to={8} start={2} end={40} easing={E.outQuart} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#fff', opacity: flash, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

/* e. 비트 몽타주 → 화이트아웃 */
const MONTAGE = ['img/p11_keyart.png', 'img/p06_neu.png', 'img/p05_seven.png', 'img/p12_dawn.png'];

export const Montage: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const idx = Math.min(MONTAGE.length - 1, Math.floor(f / BEAT));
  const local = f - idx * BEAT;
  const zoom = 1.28 - 0.14 * ramp(local, 0, BEAT, 0, 1, E.outQuart);
  const g = local < 3 ? 1 - local / 3 : 0;
  const white = ramp(f, dur - 10, dur, 0, 1, E.inExpo);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Glitch amount={g * 0.8} seed={`m${idx}`}>
        <AbsoluteFill style={{transform: `scale(${zoom})`}}>
          <Img src={staticFile(MONTAGE[idx])} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.25) contrast(1.1) brightness(0.8)'}} />
        </AbsoluteFill>
      </Glitch>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 300, color: '#fff', letterSpacing: '-0.02em', textShadow: shadow, transform: `scale(${1 + (local < 4 ? 0.06 : 0)})`}}>
          7 <span style={{color: C.gold, textShadow: `0 0 50px ${C.gold}`}}>+ 1</span>
        </div>
        <div style={{fontFamily: F.mono, fontSize: 30, letterSpacing: '0.8em', color: '#fff', opacity: 0.85, marginTop: -10}}>ECHO · NEU</div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#fff', opacity: white}} />
      {rnd(`st${f}`) > 0.86 && f < dur - 10 ? <AbsoluteFill style={{background: '#fff', opacity: 0.25}} /> : null}
    </AbsoluteFill>
  );
};
