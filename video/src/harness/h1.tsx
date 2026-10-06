import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {KenBurns} from '../components/fx';
import {Chars, SyncWords, TypeOn} from '../components/text';
import {VO} from '../components/audio';
import {E, ramp, rnd} from '../lib/anim';
import {C, F, H, W} from '../lib/theme';
import {ORBITS} from './data';

/** 점 격자 + 느리게 흐르는 색 번짐 배경 */
export const TechBg: React.FC<{hue?: string; hue2?: string; grid?: number}> = ({hue = C.violet, hue2 = C.cyan, grid = 0.14}) => {
  const f = useCurrentFrame();
  const x1 = 30 + Math.sin(f * 0.012) * 18;
  const y1 = 35 + Math.cos(f * 0.009) * 14;
  const x2 = 72 + Math.cos(f * 0.01) * 16;
  const y2 = 68 + Math.sin(f * 0.013) * 12;
  return (
    <AbsoluteFill style={{background: '#05060b'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${x1}% ${y1}%, ${hue}33 0%, transparent 42%), radial-gradient(circle at ${x2}% ${y2}%, ${hue2}26 0%, transparent 40%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: grid,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1.4px)',
          backgroundSize: '40px 40px',
          backgroundPosition: `${(f * 0.4) % 40}px ${(f * 0.2) % 40}px`,
        }}
      />
    </AbsoluteFill>
  );
};

/** 섹션 헤더: 큰 번호 + 에이전트 이름 + 한국어 역할 */
export const SectionHeader: React.FC<{index: string; agent: string; role: string; start: number; color?: string; x?: number; y?: number}> = ({
  index,
  agent,
  role,
  start,
  color = C.cyan,
  x = 110,
  y = 96,
}) => {
  const f = useCurrentFrame();
  const t = ramp(f, start, start + 16, 0, 1, E.outExpo);
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'flex-end', gap: 26, opacity: t, transform: `translateY(${(1 - t) * 20}px)`}}>
      <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 110, lineHeight: 0.8, color: 'transparent', WebkitTextStroke: `2px ${color}`}}>{index}</div>
      <div>
        <div style={{fontFamily: F.mono, fontSize: 24, color, letterSpacing: '0.06em', marginBottom: 6}}>
          <Chars text={agent} start={start + 2} stagger={1} dur={8} from={{opacity: 0, x: -6}} />
        </div>
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: '#fff'}}>{role}</div>
      </div>
    </div>
  );
};

/* ───────────── H1. 단 한 줄의 프롬프트 ───────────── */
export const Prompt: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const box = {left: 360, top: 330, w: 1200, h: 420};
  const scaleIn = ramp(f, 4, 24, 0, 1, E.outExpo);
  const enterAt = 142;
  const flash = f >= enterAt && f < enterAt + 6 ? 1 - (f - enterAt) / 6 : 0;
  // ◆ 기호로 빨려 들어가는 줌 (다음 장면의 오케스트레이터 코어와 매치컷)
  const zoomT = ramp(f, 196, dur, 0, 1, E.inExpo);
  const gx = box.left + 36 + 12;
  const gy = box.top + 48 + 36 + 50 + 22;
  const zs = 1 + zoomT * 34;
  const tx = (W / 2 - gx) * zoomT;
  const ty = (H / 2 - gy) * zoomT;
  const prompt = '/harness 12부작 드라마 극본을 작성하려고 합니다.';
  const lines = [
    {t: 'drama-orchestrator 스킬을 불러옵니다', c: C.violet, at: enterAt + 8},
    {t: 'Phase 0 · 작업 공간 확인  ✓', c: 'rgba(255,255,255,0.55)', at: enterAt + 20},
    {t: 'Phase 1 · 팀 구성 — 에이전트 27 · 스킬 10', c: C.cyan, at: enterAt + 32},
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: 0.28}}>
        <KenBurns src="img/h01_room.png" dur={dur} from={{s: 1.1}} to={{s: 1.2}} filter="blur(10px) brightness(0.5) saturate(0.9)" />
      </AbsoluteFill>
      <TechBg grid={0.08} />
      <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${zs})`, transformOrigin: `${gx}px ${gy}px`, filter: zoomT > 0.02 ? `blur(${zoomT * 6}px)` : undefined}}>
        <div
          style={{
            position: 'absolute',
            left: box.left,
            top: box.top,
            width: box.w,
            height: box.h,
            borderRadius: 18,
            background: 'rgba(12,14,22,0.82)',
            border: '1px solid rgba(255,255,255,0.13)',
            boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 ${60 * flash}px rgba(168,107,255,${0.6 * flash})`,
            transform: `scale(${0.9 + 0.1 * scaleIn})`,
            opacity: scaleIn,
            overflow: 'hidden',
          }}
        >
          <div style={{height: 48, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
            {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
              <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
            ))}
            <div style={{flex: 1, textAlign: 'center', fontFamily: F.mono, fontSize: 18, color: 'rgba(255,255,255,0.45)', marginRight: 60}}>claude — unreal-idol</div>
          </div>
          <div style={{padding: 36, fontFamily: F.mono, fontSize: 30, lineHeight: '50px', color: '#f1f1f6'}}>
            <div>
              <span style={{color: C.green}}>❯ </span>
              <TypeOn text={prompt} start={22} cps={11} holdCursor={enterAt - 22 - 92} cursorColor={C.paper} />
            </div>
            {lines.map((l, i) => (
              <div key={i} style={{color: l.c, opacity: f >= l.at ? 1 : 0, fontSize: 26, paddingLeft: i === 0 ? 0 : 38}}>
                {i === 0 ? (
                  <span style={{display: 'inline-block', width: 38, color: C.violet, textShadow: `0 0 16px ${C.violet}`}}>◆</span>
                ) : null}
                <TypeOn text={l.t} start={l.at} cps={70} cursor={false} />
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── H2. 오케스트레이터 점화 — 27명의 AI 작가 ───────────── */
type NodePos = {x: number; y: number; z: number; label: string; color: string; kind: string; dead?: boolean; i: number};

export const nodePositions = (f: number, launch0 = 6): NodePos[] => {
  const out: NodePos[] = [];
  let i = 0;
  ORBITS.forEach((o, oi) => {
    o.items.forEach((it, k) => {
      const base = (k / o.items.length) * Math.PI * 2 + oi * 0.35;
      const ang = base + f * (0.0045 - oi * 0.0012);
      const launch = launch0 + i * 2.4;
      const t = ramp(f, launch, launch + 20, 0, 1, E.outExpo);
      const r = o.r * t;
      const z = Math.sin(ang);
      out.push({x: W / 2 + Math.cos(ang) * r, y: H / 2 + z * r * 0.42, z, label: it.label, color: o.color, kind: o.kind, dead: it.dead, i});
      i++;
    });
  });
  return out;
};

export const Network: React.FC<{voB02: number; dur: number}> = ({voB02, dur}) => {
  const f = useCurrentFrame();
  const nodes = nodePositions(f);
  const launched = nodes.filter((n) => f >= 6 + n.i * 2.4).length;
  const shift = ramp(f, 12, 52, 0, 1, E.inOutQuint);
  const dive = ramp(f, dur - 34, dur, 0, 1, E.inExpo);
  const target = nodes[0];
  const camScale = (1 - 0.24 * shift) * (1 + dive * 9);
  const camX = -410 * shift;
  const ring = (k: number) => ramp(f, k, k + 34, 0, 1, E.outQuart);
  return (
    <AbsoluteFill>
      <TechBg hue={C.violet} hue2={C.cyan} />
      <AbsoluteFill style={{opacity: 0.32, mixBlendMode: 'screen'}}>
        <KenBurns src="img/h03_network.png" dur={dur} from={{s: 1.25}} to={{s: 1.45}} filter="saturate(1.2) brightness(0.8)" easing={E.linear} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `translate(${camX}px, 0px) scale(${camScale})`,
          transformOrigin: dive > 0 ? `${target.x}px ${target.y}px` : '50% 50%',
          filter: dive > 0.05 ? `blur(${dive * 8}px)` : undefined,
        }}
      >
        <svg width={W} height={H} style={{position: 'absolute'}}>
          <defs>
            <radialGradient id="core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="35%" stopColor={C.violet} stopOpacity="0.8" />
              <stop offset="100%" stopColor={C.violet} stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* 궤도 타원 */}
          {ORBITS.map((o, k) => (
            <ellipse key={k} cx={W / 2} cy={H / 2} rx={o.r} ry={o.r * 0.42} fill="none" stroke={o.color} strokeOpacity={0.16 * ramp(f, 10 + k * 12, 40 + k * 12)} strokeDasharray="4 10" />
          ))}
          {/* 엣지 */}
          {nodes.map((n) => (
            <line key={`e${n.i}`} x1={W / 2} y1={H / 2} x2={n.x} y2={n.y} stroke={n.color} strokeOpacity={(0.12 + 0.18 * (n.z + 1) / 2) * (n.dead ? 0.3 : 1)} strokeWidth={1.2} />
          ))}
          {/* 엣지 위를 흐르는 데이터 패킷 */}
          {nodes.map((n) => {
            const per = 40 + (n.i % 5) * 7;
            const t = ((f + n.i * 13) % per) / per;
            if (f < 30 || n.dead) return null;
            return <circle key={`p${n.i}`} cx={W / 2 + (n.x - W / 2) * t} cy={H / 2 + (n.y - H / 2) * t} r={2.6} fill="#fff" opacity={Math.sin(t * Math.PI)} />;
          })}
          {/* 점화 충격파 */}
          {[0, 8].map((k) => (
            <circle key={`s${k}`} cx={W / 2} cy={H / 2} r={60 + ring(k) * 700} fill="none" stroke={C.violet} strokeWidth={3 * (1 - ring(k))} opacity={1 - ring(k)} />
          ))}
          <circle cx={W / 2} cy={H / 2} r={130 + Math.sin(f * 0.1) * 6} fill="url(#core)" opacity={0.55} />
          <circle cx={W / 2} cy={H / 2} r={64} fill="none" stroke={C.violet} strokeWidth={2} strokeDasharray="6 8" transform={`rotate(${f * 1.2} ${W / 2} ${H / 2})`} />
          <circle cx={W / 2} cy={H / 2} r={92} fill="none" stroke={C.cyan} strokeOpacity={0.6} strokeWidth={1} strokeDasharray="2 14" transform={`rotate(${-f * 0.8} ${W / 2} ${H / 2})`} />
        </svg>
        <div style={{position: 'absolute', left: W / 2 - 40, top: H / 2 - 52, width: 80, textAlign: 'center', fontSize: 72, color: '#fff', textShadow: `0 0 30px ${C.violet}, 0 0 60px ${C.violet}`}}>◆</div>
        <div style={{position: 'absolute', left: W / 2 - 200, top: H / 2 + 44, width: 400, textAlign: 'center', fontFamily: F.mono, fontSize: 20, color: C.violet, letterSpacing: '0.08em'}}>drama-orchestrator</div>
        {[...nodes]
          .sort((a, b) => a.z - b.z)
          .map((n) => {
            const depth = 0.7 + 0.3 * ((n.z + 1) / 2);
            const on = f >= 6 + n.i * 2.4;
            return (
              <div
                key={n.i}
                style={{
                  position: 'absolute',
                  left: n.x,
                  top: n.y,
                  transform: `translate(-50%, -50%) scale(${depth})`,
                  opacity: on ? (n.dead ? 0.35 : 0.55 + 0.45 * depth) : 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <div style={{width: 16, height: 16, borderRadius: 8, background: n.color, boxShadow: `0 0 14px ${n.color}, 0 0 30px ${n.color}`}} />
                <div
                  style={{
                    fontFamily: n.kind === 'persona' ? F.sans : F.mono,
                    fontWeight: n.kind === 'persona' ? 700 : 400,
                    fontSize: n.kind === 'persona' ? 22 : 17,
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    textDecoration: n.dead ? 'line-through' : undefined,
                    textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                  }}
                >
                  {n.label}
                </div>
              </div>
            );
          })}
      </AbsoluteFill>
      {/* HUD 카운터 */}
      <div style={{position: 'absolute', left: 110, top: 110, fontFamily: F.mono, color: '#fff', opacity: ramp(f, 8, 20) * (1 - dive)}}>
        {[
          ['AGENTS', launched, C.cyan],
          ['SKILLS', Math.min(10, Math.floor(ramp(f, 10, 70, 0, 10.99, E.linear))), C.magenta],
          ['ORCHESTRATOR', f >= 0 ? 1 : 0, C.violet],
        ].map(([k, v, c]) => (
          <div key={k as string} style={{display: 'flex', gap: 18, fontSize: 22, lineHeight: '38px'}}>
            <span style={{width: 190, opacity: 0.55}}>{k}</span>
            <span style={{color: c as string, fontWeight: 700}}>{String(v).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
      {/* 키네틱 타이포: 27명의 AI 작가 */}
      <div style={{position: 'absolute', left: 1290, top: 300, opacity: shift * (1 - dive), transform: `translateX(${(1 - shift) * 80}px)`}}>
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 900,
            fontSize: 300,
            lineHeight: 0.9,
            background: `linear-gradient(135deg, #fff 0%, ${C.cyan} 45%, ${C.violet} 100%)`,
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {String(launched).padStart(2, '0')}
        </div>
        <div style={{marginTop: 18}}>
          <SyncWords words={VO.B02.words.slice(1)} start={voB02} style={{fontFamily: F.sans, fontWeight: 800, fontSize: 50, color: '#fff', maxWidth: 560}} gap="0.26em" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
