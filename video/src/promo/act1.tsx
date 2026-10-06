import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Embers} from '../components/particles';
import {Glitch, KenBurns, Scanlines, Tint} from '../components/fx';
import {Chars, GlitchText, SyncWords, TypeOn} from '../components/text';
import {VO} from '../components/audio';
import {E, ramp, rnd} from '../lib/anim';
import {C, F, H, W} from '../lib/theme';

const shadow = '0 2px 24px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.6)';

/* ───────────── P1. 콜드 오프닝 — 한강대교 04:17 CCTV ───────────── */
export const ColdOpen: React.FC<{voA01: number; voA02: number}> = ({voA01, voA02}) => {
  const f = useCurrentFrame();
  const on = f >= 12;
  const flick = !on ? 0 : f < 24 ? (rnd(`fl${f}`) > 0.45 ? 1 : 0.15) : 1;
  const camW = 1072;
  const camH = 804;
  const left = (W - camW) / 2;
  const top = (H - camH) / 2;
  const sec = 32 + Math.floor(Math.max(0, f - 12) / 30);
  const jumped = f >= 206;
  const tc = jumped ? '04:17:48' : `04:17:${String(sec).padStart(2, '0')}`;
  const band = ((f * 7) % (camH + 300)) - 150;
  // 헤드라이트: 좌하단에서 두 점이 커지며 화이트아웃
  const hl = ramp(f, 172, 226, 0, 1, E.inExpo);
  const cut = f >= 228;
  const dissolveAt = voA02 + Math.round(VO.A02.words[2][1] * 30) + 4;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {!cut && (
        <div style={{position: 'absolute', left, top, width: camW, height: camH, overflow: 'hidden', opacity: flick}}>
          <KenBurns
            src="img/p01_bridge.png"
            dur={228}
            from={{s: 1.08}}
            to={{s: 1.75}}
            origin="49% 50%"
            easing={E.linear}
            filter="grayscale(1) contrast(1.35) brightness(0.95)"
          />
          {/* 굴러가는 밝은 띠 + 스캔라인 + 노이즈 라인 */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: band,
              height: 120,
              background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.08), transparent)',
            }}
          />
          <Scanlines opacity={0.35} gap={3} />
          {Array.from({length: 4}).map((_, i) => {
            const y = rnd(`ln${f}-${i}`) * camH;
            const o = rnd(`lo${f}-${i}`) > 0.55 ? 0.25 : 0;
            return <div key={i} style={{position: 'absolute', left: 0, right: 0, top: y, height: 1 + (i % 2), background: `rgba(255,255,255,${o})`}} />;
          })}
          {/* 헤드라이트 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 18% 88%, rgba(255,255,255,${hl}) 0%, rgba(255,255,255,${hl * 0.6}) ${4 + hl * 40}%, transparent ${10 + hl * 70}%), radial-gradient(circle at 30% 90%, rgba(255,255,255,${hl}) 0%, transparent ${8 + hl * 60}%)`,
              mixBlendMode: 'screen',
            }}
          />
          {/* HUD */}
          <div style={{position: 'absolute', left: 28, top: 22, fontFamily: F.mono, fontSize: 22, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.06em'}}>
            CAM 07 · 한강대교 북단 진입로
          </div>
          <div style={{position: 'absolute', right: 28, top: 22, fontFamily: F.mono, fontSize: 22, color: '#fff', letterSpacing: '0.1em'}}>
            <span style={{color: C.red, opacity: Math.floor(f / 15) % 2 ? 1 : 0.2}}>●</span> REC
          </div>
          <div
            style={{
              position: 'absolute',
              right: 28,
              bottom: 22,
              fontFamily: F.mono,
              fontSize: jumped ? 34 : 26,
              color: jumped ? C.red : '#fff',
              letterSpacing: '0.08em',
              textShadow: jumped ? `0 0 18px ${C.red}` : undefined,
            }}
          >
            {tc}
          </div>
          <div style={{position: 'absolute', left: 28, bottom: 22, fontFamily: F.mono, fontSize: 20, color: 'rgba(255,255,255,0.6)'}}>
            SEOUL · 새벽
          </div>
        </div>
      )}
      {/* 내레이션 타이포 */}
      {!cut && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 190}}>
          <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: 50, color: C.paper, textShadow: shadow, letterSpacing: '0.04em', height: 70}}>
            {f < voA02 - 6 ? (
              <SyncWords words={VO.A01.words} start={voA01} outAt={voA02 - 22} />
            ) : (
              <Chars
                text="한 소녀가 사라졌다."
                start={voA02 - 2}
                stagger={2}
                dur={14}
                out={{start: dissolveAt, stagger: 3, dur: 26, to: {y: -36, blur: 18, opacity: 0}}}
              />
            )}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ───────────── P2. 서버실 — 목소리는 아직 남아 있었다 ───────────── */
const Wave: React.FC<{f: number; amp: number}> = ({f, amp}) => {
  const pts: string[] = [];
  const n = 180;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * 760;
    const env = Math.sin((i / n) * Math.PI);
    const y =
      Math.sin(i * 0.21 + f * 0.31) * 0.5 +
      Math.sin(i * 0.53 - f * 0.19) * 0.3 +
      Math.sin(i * 1.37 + f * 0.47) * 0.2 * (0.5 + rnd(`w${i}-${Math.floor(f / 2)}`) * 0.5);
    pts.push(`${x.toFixed(1)},${(120 + y * env * amp * 110).toFixed(1)}`);
  }
  return (
    <svg width={760} height={240} style={{overflow: 'visible'}}>
      <polyline points={pts.join(' ')} fill="none" stroke={C.gold} strokeWidth={3} style={{filter: `drop-shadow(0 0 10px ${C.gold}) drop-shadow(0 0 26px ${C.gold})`}} />
      <polyline points={pts.join(' ')} fill="none" stroke={C.goldHot} strokeWidth={1} opacity={0.9} transform="translate(0,6)" />
    </svg>
  );
};

export const ServerRoom: React.FC<{voA03: number; voA04: number}> = ({voA03, voA04}) => {
  const f = useCurrentFrame();
  const line = ramp(f, 0, 8, 0, 1, E.outExpo);
  const open = ramp(f, 6, 26, 50, 0, E.outExpo);
  const voiceAmp = 0.35 + 0.65 * Math.max(ramp(f, voA03, voA03 + 12, 0, 1), 0) * ramp(f, voA03 + 70, voA03 + 110, 1, 0.45);
  const hud = [
    ['학습 모델', 'SI-A'],
    ['데이터 크기', '4.7 TB'],
    ['마지막 업데이트', '03:42'],
    ['학습 범위', '보컬 · 표정 · 움직임'],
  ];
  const subAt = 154;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{clipPath: `inset(${open}% 0 ${open}% 0)`}}>
        <KenBurns src="img/p03_server.png" dur={220} from={{s: 1.12, x: 1}} to={{s: 1.3, x: -2}} filter="saturate(1.15) contrast(1.08) brightness(0.8)" />
        <Tint color={C.teal} opacity={0.12} blend="soft-light" />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.35) 100%)'}} />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: H / 2 - 1,
          left: W / 2 - (W / 2) * line,
          width: W * line,
          height: 2,
          background: C.teal,
          boxShadow: `0 0 20px ${C.teal}`,
          opacity: ramp(f, 20, 30, 1, 0),
        }}
      />
      {/* HUD */}
      <div style={{position: 'absolute', left: 130, top: 210, fontFamily: F.mono, color: C.teal, opacity: ramp(f, 14, 24)}}>
        <div style={{fontSize: 18, letterSpacing: '0.3em', opacity: 0.7, marginBottom: 22}}>ALLTERM · AI TRAINING · 7F</div>
        {hud.map(([k, v], i) => (
          <div key={k} style={{display: 'flex', fontSize: 26, lineHeight: '46px', textShadow: `0 0 12px rgba(53,240,222,0.5)`}}>
            <span style={{width: 250, opacity: 0.65}}>
              <TypeOn text={k} start={20 + i * 12} cps={40} cursor={false} />
            </span>
            <span style={{color: i === 3 ? C.goldHot : '#e8fffc'}}>
              <TypeOn text={v} start={26 + i * 12} cps={30} cursor={i === 3} holdCursor={40} />
            </span>
          </div>
        ))}
      </div>
      {/* 목소리 파형 */}
      <div style={{position: 'absolute', left: 1040, top: 330, opacity: ramp(f, 18, 34)}}>
        <div style={{fontFamily: F.mono, fontSize: 16, color: C.gold, letterSpacing: '0.3em', marginBottom: 8}}>VOICE PRINT · SI-A</div>
        <Wave f={f} amp={voiceAmp} />
      </div>
      {/* 내레이션 */}
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 205}}>
        <div style={{height: 76, display: 'flex', alignItems: 'center'}}>
          {f < voA04 - 4 ? (
            <SyncWords
              words={VO.A03.words}
              start={voA03}
              outAt={voA04 - 16}
              style={{fontFamily: F.serif, fontSize: 54, fontWeight: 400, color: C.paper, textShadow: shadow}}
              wordStyle={(i) => (i === 2 ? {color: C.goldHot, textShadow: `0 0 24px ${C.gold}, ${shadow}`} : undefined)}
            />
          ) : (
            <SyncWords
              words={VO.A04.words}
              start={voA04}
              outAt={subAt - 8}
              lead={1}
              from={{opacity: 0, blur: 0, y: 0}}
              dur={3}
              style={{fontFamily: F.mono, fontSize: 48, fontWeight: 500, color: C.teal, textShadow: `0 0 18px rgba(53,240,222,0.6)`}}
            />
          )}
        </div>
      </AbsoluteFill>
      {/* 작품 시그니처 자막 */}
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 160}}>
        <div style={{fontFamily: F.mono, fontSize: 30, color: '#fff', letterSpacing: '0.04em', opacity: f >= subAt ? 1 : 0}}>
          <TypeOn text="NEU 학습 세션 종료: 06:00" start={subAt} cps={22} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── P3. 결단 — 비어 있는 여덟 번째 자리 ───────────── */
export const Decision: React.FC<{voA05: number; voNeu: number; silenceAt: number; dur: number}> = ({voA05, voNeu, silenceAt, dur}) => {
  const f = useCurrentFrame();
  const dark = ramp(f, silenceAt, silenceAt + 10, 0, 1, E.outQuart);
  const flashes: [number, string][] = [
    [dur - 15, 'img/p09_eye.png'],
    [dur - 10, 'img/p06_neu.png'],
    [dur - 5, 'img/p12_dawn.png'],
  ];
  const sub = flashes.find(([at]) => f >= at && f < at + 2);
  const neuOn = f >= voNeu;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{filter: `brightness(${1 - dark * 0.88})`}}>
        <KenBurns src="img/p05_seven.png" dur={dur} from={{s: 1.06, y: -4}} to={{s: 1.42, y: -10}} origin="50% 82%" filter="saturate(1.2) contrast(1.05)" />
      </AbsoluteFill>
      {/* 비어 있는 황금빛 자리 */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 16% 12% at 50% 70%, rgba(255,210,130,${0.25 + dark * 0.45}) 0%, transparent 100%)`,
          mixBlendMode: 'screen',
        }}
      />
      <Embers frame={f} count={90} area={{x: 700, y: 420, w: 520, h: 420}} rise={1.1} opacity={0.9} seed="dec" />
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 205}}>
        <SyncWords
          words={VO.A05.words}
          start={voA05}
          outAt={silenceAt - 4}
          style={{fontFamily: F.serif, fontSize: 58, fontWeight: 400, color: C.paper, textShadow: shadow, letterSpacing: '0.02em'}}
          wordStyle={(i) => (i === 2 ? {color: C.goldHot, textShadow: `0 0 26px ${C.gold}, ${shadow}`} : undefined)}
        />
      </AbsoluteFill>
      {neuOn && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingTop: 150}}>
          <GlitchText amount={0.35} seed="neu1" style={{fontFamily: F.serif, fontSize: 46, fontWeight: 300, color: C.goldHot, letterSpacing: '0.3em', opacity: 0.55 + 0.45 * rnd(`nf${Math.floor(f / 2)}`)}}>
            <Chars text="……가자." start={voNeu} stagger={3} dur={12} />
          </GlitchText>
        </AbsoluteFill>
      )}
      {sub && (
        <AbsoluteFill>
          <Img src={staticFile(sub[1])} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.3) brightness(1.2)'}} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/** P5. 「도와줘」 — 음악이 끊긴 2초. 소리 없이 입 모양만. */
export const HelpMe: React.FC = () => {
  const f = useCurrentFrame();
  const g = ramp(f, 48, 60, 0, 1, E.inExpo);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Glitch amount={g} seed="help">
        <AbsoluteFill style={{opacity: ramp(f, 4, 34, 0, 1, E.inOutCubic)}}>
          <KenBurns src="img/p09_eye.png" dur={60} from={{s: 1.25, x: 2}} to={{s: 1.36, x: 2}} filter="brightness(0.55) contrast(1.2) saturate(0.8)" />
          <AbsoluteFill style={{background: 'radial-gradient(ellipse 40% 45% at 45% 45%, transparent 0%, rgba(0,0,0,0.85) 100%)'}} />
        </AbsoluteFill>
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 230}}>
          <GlitchText amount={0.25 + g} seed="help-t" style={{fontFamily: F.serif, fontWeight: 300, fontSize: 64, color: '#fff', letterSpacing: '0.5em'}}>
            <Chars text="도와줘" start={16} stagger={9} dur={10} from={{opacity: 0, blur: 8, y: 0}} />
          </GlitchText>
        </AbsoluteFill>
      </Glitch>
    </AbsoluteFill>
  );
};
