import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ChannelFilters, Flash, Grain, Shake, Vignette} from '../components/fx';
import {Cue, Sfx, VO, Voice, duckCurve} from '../components/audio';
import {SyncWords} from '../components/text';
import {ramp} from '../lib/anim';
import {C, F, FPS, W} from '../lib/theme';
import {Network, Prompt} from './h1';
import {Bible, Characters, Structure} from './h2';
import {Personas} from './h3';
import {Finale, Gates, Sprint} from './h4';

/** 장면 경계 — 음악의 점화(8.4s)·드롭(16.5s)·히트(40.55s, 48.55s, 56.6s)에 맞췄다 */
export const HX = {
  prompt: 0,
  network: 252,
  bible: 495,
  structure: 600,
  characters: 705,
  personas: 810,
  gates: 1217,
  sprint: 1410,
  go: 1457,
  finale: 1698,
  end: 1800,
};

export const HARNESS_VO: Cue[] = [
  {id: 'B01', at: 27},
  {id: 'B02', at: 270},
  {id: 'B03', at: 500},
  {id: 'B04', at: 606},
  {id: 'B05', at: 711},
  {id: 'B06', at: 819},
  {id: 'B07', at: 948},
  {id: 'B08', at: 1225},
  {id: 'B09', at: 1290},
  {id: 'B10', at: 1392},
  {id: 'B11', at: 1578},
  {id: 'B12', at: 1632},
  {id: 'B13', at: 1706},
];
const at = (id: string) => HARNESS_VO.find((c) => c.id === id)!.at;

// 화면 타이포로 이미 보여 주는 줄(B02·B12·B13)은 자막에서 뺀다
const SUBS = HARNESS_VO.filter((c) => !['B02', 'B12', 'B13'].includes(c.id));

const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const cue = SUBS.find((c) => f >= c.at - 4 && f < c.at + Math.round(VO[c.id].dur * FPS) + 16);
  if (!cue) return null;
  const end = cue.at + Math.round(VO[cue.id].dur * FPS);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 54, pointerEvents: 'none'}}>
      <SyncWords
        key={cue.id}
        words={VO[cue.id].words}
        start={cue.at}
        outAt={end + 2}
        style={{fontFamily: F.serif, fontWeight: 400, fontSize: 40, color: 'rgba(243,239,230,0.96)', textShadow: '0 2px 14px #000, 0 0 30px rgba(0,0,0,0.8)'}}
      />
    </AbsoluteFill>
  );
};

const SECTIONS: [number, string][] = [
  [HX.prompt, 'PROMPT'],
  [HX.network, 'ORCHESTRATOR'],
  [HX.bible, 'PHASE 1–3 · 기획'],
  [HX.personas, 'PHASE 4–5 · 집필'],
  [HX.gates, 'PHASE 5.5–6 · 검수'],
  [HX.sprint, 'PARALLEL · EP02–EP12'],
  [HX.finale, 'COMPLETE'],
];

const Hud: React.FC = () => {
  const f = useCurrentFrame();
  const sec = [...SECTIONS].reverse().find(([s]) => f >= s)![1];
  const o = ramp(f, 10, 24) * ramp(f, HX.finale - 6, HX.finale, 1, 0);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: o}}>
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 3, width: (f / HX.end) * W, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.gold})`}} />
      <div style={{position: 'absolute', right: 60, bottom: 22, fontFamily: F.mono, fontSize: 15, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.18em'}}>
        UNREAL IDOL — HARNESS · {sec}
      </div>
    </AbsoluteFill>
  );
};

const SFX: {src: string; at: number; vol?: number; frames?: number; trim?: number}[] = [
  {src: 'typing', at: 22, vol: 0.4, frames: 92},
  {src: 'enter', at: 142, vol: 0.85},
  {src: 'blip', at: 150, vol: 0.3},
  {src: 'blip', at: 162, vol: 0.3},
  {src: 'blip', at: 174, vol: 0.3},
  {src: 'whoosh2', at: 214, vol: 0.5},
  {src: 'powerup', at: 226, vol: 0.55},
  {src: 'hit', at: HX.network, vol: 0.55},
  {src: 'data', at: HX.network + 8, vol: 0.22, frames: 110},
  {src: 'whoosh', at: HX.bible - 26, vol: 0.45},
  {src: 'hit', at: HX.bible, vol: 0.4},
  {src: 'paper', at: HX.bible + 40, vol: 0.3},
  {src: 'whoosh', at: HX.structure - 4, vol: 0.35},
  {src: 'whoosh', at: HX.characters - 4, vol: 0.35},
  {src: 'whoosh', at: HX.personas - 4, vol: 0.35},
  {src: 'typing', at: HX.personas + 4, vol: 0.28, frames: 96},
  {src: 'pop', at: HX.personas + 135, vol: 0.35},
  {src: 'pop', at: HX.personas + 141, vol: 0.3},
  {src: 'pop', at: HX.personas + 147, vol: 0.35},
  {src: 'pop', at: HX.personas + 153, vol: 0.3},
  {src: 'pop', at: HX.personas + 160, vol: 0.35},
  {src: 'whoosh', at: HX.personas + 266, vol: 0.45},
  {src: 'blip', at: HX.personas + 296, vol: 0.3},
  {src: 'blip', at: HX.personas + 304, vol: 0.3},
  {src: 'blip', at: HX.personas + 312, vol: 0.3},
  {src: 'swell', at: HX.personas + 318, vol: 0.4},
  {src: 'whoosh2', at: HX.gates - 40, vol: 0.4},
  {src: 'hit', at: HX.gates, vol: 0.5},
  {src: 'scan', at: HX.gates + 10, vol: 0.45},
  {src: 'scan', at: HX.gates + 18, vol: 0.4},
  {src: 'scan', at: HX.gates + 26, vol: 0.4},
  {src: 'blip', at: HX.gates + 48, vol: 0.3},
  {src: 'blip', at: HX.gates + 60, vol: 0.3},
  {src: 'blip', at: HX.gates + 72, vol: 0.3},
  {src: 'scan', at: HX.gates + 112, vol: 0.4},
  {src: 'stamp', at: HX.gates + 118, vol: 0.75},
  {src: 'whoosh', at: HX.gates + 152, vol: 0.4},
  {src: 'hit', at: HX.go, vol: 0.45},
  {src: 'ticks', at: HX.go, vol: 0.3, frames: 120},
  {src: 'stamp', at: at('B11'), vol: 0.45},
  {src: 'whoosh', at: at('B12') - 24, vol: 0.4},
  {src: 'boom', at: HX.finale, vol: 0.7},
  {src: 'swell', at: HX.finale + 4, vol: 0.45},
];

export const Harness: React.FC = () => {
  const duck = duckCurve(HARNESS_VO, 0.4);
  return (
    <AbsoluteFill style={{background: '#05060b'}}>
      <ChannelFilters />
      <Shake hits={[HX.network, HX.bible, HX.gates, HX.go, HX.finale]} amp={9}>
      <Sequence from={HX.prompt} durationInFrames={HX.network - HX.prompt}>
        <Prompt dur={HX.network - HX.prompt} />
      </Sequence>
      <Sequence from={HX.network} durationInFrames={HX.bible - HX.network}>
        <Network voB02={at('B02') - HX.network} dur={HX.bible - HX.network} />
      </Sequence>
      <Sequence from={HX.bible} durationInFrames={HX.structure - HX.bible}>
        <Bible dur={HX.structure - HX.bible} />
      </Sequence>
      <Sequence from={HX.structure} durationInFrames={HX.characters - HX.structure}>
        <Structure dur={HX.characters - HX.structure} />
      </Sequence>
      <Sequence from={HX.characters} durationInFrames={HX.personas - HX.characters}>
        <Characters dur={HX.personas - HX.characters} />
      </Sequence>
      <Sequence from={HX.personas} durationInFrames={HX.gates - HX.personas}>
        <Personas dur={HX.gates - HX.personas} />
      </Sequence>
      <Sequence from={HX.gates} durationInFrames={HX.sprint - HX.gates}>
        <Gates dur={HX.sprint - HX.gates} />
      </Sequence>
      <Sequence from={HX.sprint} durationInFrames={HX.finale - HX.sprint}>
        <Sprint go={HX.go - HX.sprint} voB11={at('B11') - HX.sprint} voB12={at('B12') - HX.sprint} />
      </Sequence>
      <Sequence from={HX.finale} durationInFrames={HX.end - HX.finale}>
        <Finale voB13={at('B13') - HX.finale} dur={HX.end - HX.finale} />
      </Sequence>
      </Shake>

      <Flash at={HX.network} dur={10} color={C.violet} peak={0.8} />
      <Flash at={HX.bible} dur={8} peak={0.5} />
      <Flash at={HX.gates} dur={8} peak={0.45} color={C.green} />
      <Flash at={HX.go} dur={8} peak={0.35} color={C.cyan} />
      <Flash at={HX.finale} dur={12} peak={0.85} color="#fff3d6" />
      <Subtitles />
      <Hud />
      <Vignette strength={0.55} />
      <Grain opacity={0.06} />

      <Audio src={staticFile('audio/music/harness.mp3')} volume={(f) => 0.85 * duck(f)} />
      {HARNESS_VO.map((c) => (
        <Voice key={c.id} dir="vo-harness" cue={c} />
      ))}
      {SFX.map((s, i) => (
        <Sfx key={i} {...s} />
      ))}
    </AbsoluteFill>
  );
};
