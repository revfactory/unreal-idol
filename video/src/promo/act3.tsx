import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Embers, ParticleField, useTextTargets} from '../components/particles';
import {Glitch, KenBurns, LightLeak, Tint} from '../components/fx';
import {Chars, GlitchText, Slam, SyncWords} from '../components/text';
import {VO} from '../components/audio';
import {E, ramp, rnd} from '../lib/anim';
import {C, F, H, W} from '../lib/theme';

const shadow = '0 2px 28px rgba(0,0,0,0.85)';
const GLYPHS = '01NEUSIA학습데이터보컬표정호흡움직임메시지0347∴◇▮';

/* a. 학습 범위 — 노래만이 아니었다 */
export const Learned: React.FC<{voA08: number; hit: number}> = ({voA08, hit}) => {
  const f = useCurrentFrame();
  const w = VO.A08.words;
  const wAt = (i: number) => voA08 + Math.round(w[i][1] * 30);
  const items = ['보컬', '안무', '표정', '호흡'];
  const redAt = wAt(5) - 2;
  const g = f >= hit && f < hit + 6 ? 1 - (f - hit) / 6 : f >= redAt && f < redAt + 5 ? 0.6 : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* 히트 전: 데이터 비 */}
      {f < hit + 4 && (
        <AbsoluteFill style={{opacity: ramp(f, 0, 10) * ramp(f, hit, hit + 4, 1, 0)}}>
          {Array.from({length: 46}).map((_, c) => {
            const speed = 6 + rnd(`rs${c}`) * 14;
            const y0 = rnd(`ry${c}`) * H;
            return (
              <div key={c} style={{position: 'absolute', left: c * 42 + 8, top: ((y0 + f * speed) % (H + 400)) - 400, fontFamily: F.mono, fontSize: 26, lineHeight: '30px', color: C.teal, opacity: 0.45 + rnd(`ro${c}`) * 0.55, width: 28, textShadow: `0 0 10px ${C.teal}`, textAlign: 'center'}}>
                {Array.from({length: 14}).map((__, k) => (
                  <div key={k} style={{opacity: k / 14}}>
                    {GLYPHS[Math.floor(rnd(`g${c}-${k}-${Math.floor((f + k) / 3)}`) * GLYPHS.length)]}
                  </div>
                ))}
              </div>
            );
          })}
        </AbsoluteFill>
      )}
      {f >= hit && (
        <Glitch amount={g} seed="learn">
          <KenBurns src="img/p03_server.png" dur={150 - hit} from={{s: 1.35, x: -3}} to={{s: 1.22, x: 0}} filter="grayscale(0.4) brightness(0.55) contrast(1.25)" easing={E.outQuart} />
          <Tint color="#ff1e3c" opacity={ramp(f, redAt, redAt + 20, 0.0, 0.45)} blend="color" />
          <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 55%)'}} />
        </Glitch>
      )}
      <div style={{position: 'absolute', left: 170, top: 250, fontFamily: F.mono}}>
        <div style={{fontSize: 18, letterSpacing: '0.35em', color: C.teal, opacity: ramp(f, hit + 4, hit + 14) * 0.75, marginBottom: 24}}>NEU · 학습 범위</div>
        {items.map((it, i) => {
          const at = voA08 + 6 + i * 11;
          return (
            <div key={it} style={{fontSize: 46, lineHeight: '72px', color: '#e8fffc', opacity: ramp(f, at, at + 6), transform: `translateX(${(1 - ramp(f, at, at + 10)) * -30}px)`}}>
              {it} <span style={{color: C.teal}}>✓</span>
            </div>
          );
        })}
        <div style={{fontSize: 46, lineHeight: '72px', opacity: ramp(f, redAt, redAt + 3)}}>
          <GlitchText amount={0.6} seed="msg" style={{color: C.red, textShadow: `0 0 24px ${C.red}`}}>
            메시지 ?
          </GlitchText>
        </div>
      </div>
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 200}}>
        <SyncWords
          words={w}
          start={voA08}
          style={{fontFamily: F.serif, fontSize: 48, fontWeight: 400, color: C.paper, textShadow: shadow}}
          wordStyle={(i) => (i >= 4 ? {color: '#ff8a95', textShadow: `0 0 20px rgba(255,59,71,0.6), ${shadow}`} : undefined)}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* b. 끝내 보내지 못한 메시지 */
export const Unsent: React.FC<{voA09: number; dur: number}> = ({voA09, dur}) => {
  const f = useCurrentFrame();
  const card = ramp(f, 10, 34, 0, 1, E.outExpo);
  const bars = [0.92, 0.78, 0.86, 0.55];
  const ring = (f % 30) / 30;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Glitch amount={f < 5 ? 1 - f / 5 : 0} seed="uns">
        <KenBurns src="img/p08_phone.png" dur={dur} from={{s: 1.18, x: 2}} to={{s: 1.32, x: -1}} filter="brightness(0.7) saturate(1.15)" />
      </Glitch>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.5) 100%)'}} />
      <div
        style={{
          position: 'absolute',
          left: 1150,
          top: 250,
          width: 600,
          padding: '30px 34px',
          borderRadius: 28,
          background: 'rgba(16,18,26,0.72)',
          border: '1px solid rgba(255,255,255,0.14)',
          backdropFilter: 'blur(18px)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          opacity: card,
          transform: `translateY(${(1 - card) * 60}px) rotate(${(1 - card) * 4 - 2}deg)`,
          fontFamily: F.sans,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26}}>
          <span style={{fontSize: 26, fontWeight: 700, color: '#fff'}}>새 메시지</span>
          <span style={{fontSize: 18, fontWeight: 600, color: C.red, border: `1px solid ${C.red}`, borderRadius: 999, padding: '4px 14px'}}>임시 저장됨</span>
        </div>
        {bars.map((wd, i) => (
          <div key={i} style={{height: 22, width: `${wd * 100 * ramp(f, 22 + i * 5, 34 + i * 5, 0, 1)}%`, background: 'rgba(255,255,255,0.18)', borderRadius: 6, marginBottom: 16}} />
        ))}
        <div style={{display: 'flex', alignItems: 'center', gap: 10, height: 30}}>
          <div style={{width: 3, height: 30, background: C.gold, opacity: Math.floor(f / 9) % 2 ? 0 : 1}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 26}}>
          <span style={{fontFamily: F.mono, fontSize: 18, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em'}}>상태 — 미발송</span>
          <div style={{position: 'relative'}}>
            <div style={{position: 'absolute', inset: -10 - ring * 16, borderRadius: 999, border: `2px solid rgba(246,196,106,${0.6 * (1 - ring)})`}} />
            <div style={{padding: '10px 30px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)', fontWeight: 700, fontSize: 22}}>전송</div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 150, top: 640}}>
        <SyncWords
          words={VO.A09.words}
          start={voA09}
          style={{fontFamily: F.serif, fontSize: 64, fontWeight: 700, color: C.paper, textShadow: shadow, maxWidth: 900}}
          wordStyle={(i) => (i === 1 || i === 2 ? {color: C.goldHot, textShadow: `0 0 28px ${C.gold}, ${shadow}`} : undefined)}
        />
      </div>
    </AbsoluteFill>
  );
};

/* c. 추모인가 / 착취인가 — 분할 화면 */
export const Split: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const flashImg: [number, string][] = [
    [72, 'img/p01_bridge.png'],
    [86, 'img/p12_dawn.png'],
    [100, 'img/p02_practice.png'],
  ];
  const fl = flashImg.find(([a]) => f >= a && f < a + 5);
  const jitter = (rnd(`sj${Math.floor(f / 2)}`) - 0.5) * (f < 8 ? 40 : 6);
  const end = ramp(f, dur - 12, dur, 0, 1, E.inExpo);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W / 2 + jitter, height: H, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: -300, top: 0, width: W, height: H}}>
          <KenBurns src="img/p10_salon.png" dur={dur} from={{s: 1.1}} to={{s: 1.22}} filter="sepia(0.35) saturate(1.2) brightness(0.75)" />
          <Tint color={C.gold} opacity={0.25} blend="soft-light" />
        </div>
      </div>
      <div style={{position: 'absolute', left: W / 2 + jitter, top: 0, width: W / 2 - jitter, height: H, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: -W / 2 + 200, top: 0, width: W, height: H}}>
          <KenBurns src="img/p04_producer.png" dur={dur} from={{s: 1.15}} to={{s: 1.05}} filter="saturate(1.1) brightness(0.7) hue-rotate(-8deg)" />
          <Tint color={C.teal} opacity={0.25} blend="soft-light" />
        </div>
      </div>
      <div style={{position: 'absolute', left: W / 2 + jitter - 1, top: 0, width: 2, height: H, background: '#fff', boxShadow: '0 0 24px #fff'}} />
      <div style={{position: 'absolute', left: 0, width: W / 2, top: 0, height: H, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Slam start={4} from={1.7} dur={8} shake={10}>
          <div style={{fontFamily: F.serif, fontWeight: 900, fontSize: 150, color: C.goldHot, textShadow: `0 0 40px rgba(246,196,106,0.6), ${shadow}`}}>추모인가</div>
        </Slam>
      </div>
      <div style={{position: 'absolute', left: W / 2, width: W / 2, top: 0, height: H, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Slam start={34} from={1.7} dur={8} shake={10}>
          <div style={{fontFamily: F.serif, fontWeight: 900, fontSize: 150, color: C.teal, textShadow: `0 0 40px rgba(53,240,222,0.6), ${shadow}`}}>착취인가</div>
        </Slam>
      </div>
      {fl && (
        <AbsoluteFill>
          <Img src={staticFile(fl[1])} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.5) contrast(1.3) brightness(0.9)'}} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: '#000', opacity: end}} />
    </AbsoluteFill>
  );
};

/* P7. 클라이맥스 — 친구인가, 환상인가, 우리 자신인가 */
const CLIMAX_CUTS = ['img/p12_dawn.png', 'img/p05_seven.png', 'img/p09_eye.png', 'img/p06_neu.png', 'img/p02_practice.png', 'img/p11_keyart.png', 'img/p07_concert.png', 'img/p11_keyart.png'];

export const Climax: React.FC<{voA10: number; voA11: number; montageAt: number; dur: number}> = ({voA10, voA11, montageAt, dur}) => {
  const f = useCurrentFrame();
  const w10 = VO.A10.words;
  const a1 = voA10 - 2;
  const a2 = voA10 + Math.round(w10[1][1] * 30) - 2;
  const inMontage = f >= montageAt;
  const cutLen = 11;
  const ci = Math.min(CLIMAX_CUTS.length - 1, Math.floor((f - montageAt) / cutLen));
  const cl = (f - montageAt) % cutLen;
  const strobe = [dur - 30, dur - 20, dur - 12, dur - 6].some((a) => f >= a && f < a + 2);
  const qOut = ramp(f, montageAt - 10, montageAt, 1, 0.0);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {!inMontage ? (
        <AbsoluteFill>
          <KenBurns src="img/p11_keyart.png" dur={montageAt} from={{s: 1.04, y: 2}} to={{s: 1.2, y: 4}} origin="50% 30%" filter="saturate(1.15) contrast(1.08) brightness(0.8)" />
          <AbsoluteFill style={{background: `linear-gradient(90deg, rgba(246,196,106,0.28) 0%, transparent 40%, transparent 60%, rgba(53,240,222,0.28) 100%)`, mixBlendMode: 'soft-light'}} />
          <Embers frame={f} count={70} seed="clx" opacity={0.8} />
        </AbsoluteFill>
      ) : (
        <Glitch amount={cl < 2 ? 0.7 : 0} seed={`cx${ci}`}>
          <AbsoluteFill style={{transform: `scale(${1.22 - 0.1 * (cl / cutLen)})`}}>
            <Img src={staticFile(CLIMAX_CUTS[ci])} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5) saturate(1.2) contrast(1.15)'}} />
          </AbsoluteFill>
        </Glitch>
      )}
      <LightLeak color={C.gold} opacity={0.25} seed="cl" />
      <AbsoluteFill style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 60, opacity: qOut}}>
        <Slam start={a1} from={1.5} dur={9} shake={6}>
          <div style={{fontFamily: F.serif, fontWeight: 900, fontSize: 132, color: C.goldHot, textShadow: `0 0 50px rgba(246,196,106,0.65), ${shadow}`}}>친구인가.</div>
        </Slam>
        <Slam start={a2} from={1.5} dur={9} shake={6}>
          <div style={{fontFamily: F.serif, fontWeight: 900, fontSize: 132, color: C.teal, textShadow: `0 0 50px rgba(53,240,222,0.65), ${shadow}`}}>환상인가.</div>
        </Slam>
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <SyncWords
          words={VO.A11.words}
          start={voA11}
          style={{fontFamily: F.serif, fontSize: 104, fontWeight: 700, color: '#fff', textShadow: `0 0 40px rgba(255,255,255,0.35), ${shadow}`}}
          from={{y: 0, blur: 20, opacity: 0, scale: 1.25}}
          dur={18}
          gap="0.28em"
        />
      </AbsoluteFill>
      {strobe && <AbsoluteFill style={{background: '#fff'}} />}
    </AbsoluteFill>
  );
};

/* P8. 타이틀 — 빛 입자가 모여 제목이 된다 */
export const Title: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const font = '900 200px "Noto Serif KR"';
  const targets = useTextTargets(['언리얼 아이돌'], font, 9000, {cy: H / 2 - 40, color: [255, 214, 150], seed: 'title'});
  const prog = ramp(f, 0, 44, 0, 1, E.linear);
  const crisp = ramp(f, 34, 58, 0, 1, E.inOutCubic);
  const lineW = ramp(f, 52, 82, 0, 1, E.outExpo);
  const fade = ramp(f, dur - 18, dur, 1, 0, E.inOutCubic);
  return (
    <AbsoluteFill style={{background: '#000', opacity: fade}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 50% 40% at 50% 46%, rgba(246,196,106,${0.12 * crisp}) 0%, transparent 70%)`}} />
      <ParticleField
        targets={targets}
        progress={prog}
        frame={f}
        origin="center"
        spread={2}
        swirl={300}
        size={2.8}
        trail={0.03}
        opacity={1 - 0.75 * ramp(f, 46, 80)}
        seed="ttl"
        tint={[
          [255, 205, 120],
          [60, 240, 225],
          [255, 255, 255],
        ]}
      />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 80}}>
        <GlitchText amount={ramp(f, 34, 64, 0.9, 0)} seed="title">
          <div
            style={{
              fontFamily: F.serif,
              fontWeight: 900,
              fontSize: 200,
              lineHeight: 1,
              letterSpacing: '0.02em',
              opacity: crisp,
              background: `linear-gradient(100deg, ${C.goldHot} 0%, #fff 48%, ${C.teal} 100%)`,
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(246,196,106,0.35))',
            }}
          >
            언리얼 아이돌
          </div>
        </GlitchText>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: W / 2 - 360 * lineW, width: 720 * lineW, top: H / 2 + 92, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingTop: 300}}>
        <div style={{fontFamily: F.display, fontWeight: 500, fontSize: 34, color: C.paper, letterSpacing: '0.9em', marginRight: '-0.9em'}}>
          <Chars text="UNREAL IDOL" start={56} stagger={2} dur={16} from={{opacity: 0, blur: 10, y: 0, x: 20}} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 180}}>
        <div style={{fontFamily: F.serif, fontWeight: 300, fontSize: 34, color: 'rgba(243,239,230,0.85)', letterSpacing: '0.12em', opacity: ramp(f, 92, 112)}}>
          진짜로 살아 있다는 건, 무엇인가.
        </div>
        <div style={{fontFamily: F.sans, fontWeight: 500, fontSize: 22, color: 'rgba(243,239,230,0.55)', letterSpacing: '0.5em', marginTop: 22, opacity: ramp(f, 104, 120)}}>
          12부작 미니시리즈
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', right: 70, bottom: 160, fontFamily: F.sans, fontSize: 16, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', opacity: ramp(f, 110, 125)}}>
        © 2026 revfactory
      </div>
    </AbsoluteFill>
  );
};
