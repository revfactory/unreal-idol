import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ChannelFilters, Grain, Letterbox, Vignette, Flash, Shake} from '../components/fx';
import {Cue, Sfx, Voice, duckCurve} from '../components/audio';
import {ramp} from '../lib/anim';
import {ColdOpen, Decision, HelpMe, ServerRoom} from './act1';
import {Chart, Debut, Montage, Views, World} from './act2';
import {Climax, Learned, Split, Title, Unsent} from './act3';

/** 장면 경계 (프레임, 30fps). 음악 큐의 히트·정적 위치에 맞췄다. */
export const P = {
  cold: 0,
  server: 245,
  decision: 450,
  silence: 541,
  drop: 600,
  views: 711,
  world: 767,
  chart: 851,
  montage: 907,
  help: 960,
  learned: 1020,
  unsent: 1170,
  split: 1290,
  climax: 1410,
  climaxMontage: 1515,
  title: 1635,
  end: 1800,
};

export const PROMO_VO: Cue[] = [
  {id: 'A01', at: 48},
  {id: 'A02', at: 132},
  {id: 'A03', at: 270},
  {id: 'A04', at: 327},
  {id: 'A05', at: 452, duck: 0.75},
  {id: 'NEU1', at: 566},
  {id: 'A06', at: 630, duck: 0.75},
  {id: 'A07', at: 786, duck: 0.75},
  {id: 'A08', at: 1062, duck: 0.6},
  {id: 'A09', at: 1188},
  {id: 'A10', at: 1428, duck: 0.65},
  {id: 'A11', at: 1530, duck: 0.72},
  {id: 'A12', at: 1662},
];
const vo = (id: string) => PROMO_VO.find((c) => c.id === id)!.at;

const SFX: {src: string; at: number; vol?: number; frames?: number; trim?: number}[] = [
  {src: 'rain', at: 0, vol: 0.32, frames: 228},
  {src: 'cctv', at: 12, vol: 0.22, frames: 216},
  {src: 'carpass', at: 174, vol: 0.85},
  {src: 'heartbeat', at: 232, vol: 0.55},
  {src: 'whoosh2', at: 226, vol: 0.45},
  {src: 'data', at: 258, vol: 0.22, frames: 120},
  {src: 'swell', at: 548, vol: 0.5},
  {src: 'boom', at: P.drop, vol: 0.95},
  {src: 'hit', at: P.drop, vol: 0.6},
  {src: 'crowd', at: P.views, vol: 0.32, frames: 72},
  {src: 'hit', at: P.world, vol: 0.55},
  {src: 'whoosh', at: P.chart - 4, vol: 0.45},
  {src: 'shutter', at: P.chart + 4, vol: 0.45},
  {src: 'whoosh', at: P.montage - 3, vol: 0.4},
  {src: 'heartbeat', at: P.help + 6, vol: 0.85},
  {src: 'heartbeat', at: P.help + 38, vol: 0.7},
  {src: 'glitch', at: P.help + 48, vol: 0.55},
  {src: 'glitch', at: P.learned + 30, vol: 0.45},
  {src: 'data', at: P.learned + 40, vol: 0.18, frames: 100},
  {src: 'blip', at: 1068, vol: 0.3},
  {src: 'blip', at: 1079, vol: 0.3},
  {src: 'blip', at: 1090, vol: 0.3},
  {src: 'blip', at: 1101, vol: 0.3},
  {src: 'glitch', at: 1154, vol: 0.5},
  {src: 'whoosh', at: P.unsent - 3, vol: 0.4},
  {src: 'braam', at: P.split, vol: 0.75},
  {src: 'hit', at: P.split + 4, vol: 0.45},
  {src: 'hit', at: P.split + 34, vol: 0.45},
  {src: 'whoosh2', at: P.climax - 16, vol: 0.4},
  {src: 'hit', at: P.climax, vol: 0.4},
  {src: 'riser', at: P.title - 52, vol: 0.45, frames: 52},
  {src: 'boom', at: P.title, vol: 1},
  {src: 'swell', at: P.title + 6, vol: 0.55},
];

export const Promo: React.FC = () => {
  const frame = useCurrentFrame();
  const open = frame >= P.drop && frame < P.help ? ramp(frame, P.drop, P.drop + 8) : 0;
  const duck = duckCurve(PROMO_VO, 0.45);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <ChannelFilters />
      <Shake hits={[P.drop, P.world, P.split, P.climax, P.title]} amp={12}>
      <Sequence from={P.cold} durationInFrames={P.server - P.cold}>
        <ColdOpen voA01={vo('A01')} voA02={vo('A02')} />
      </Sequence>
      <Sequence from={P.server} durationInFrames={P.decision - P.server}>
        <ServerRoom voA03={vo('A03') - P.server} voA04={vo('A04') - P.server} />
      </Sequence>
      <Sequence from={P.decision} durationInFrames={P.drop - P.decision}>
        <Decision voA05={vo('A05') - P.decision} voNeu={vo('NEU1') - P.decision} silenceAt={P.silence - P.decision} dur={P.drop - P.decision} />
      </Sequence>
      <Sequence from={P.drop} durationInFrames={P.views - P.drop}>
        <Debut voA06={vo('A06') - P.drop} dur={P.views - P.drop} />
      </Sequence>
      <Sequence from={P.views} durationInFrames={P.world - P.views}>
        <Views dur={P.world - P.views} offset={P.views - P.drop} />
      </Sequence>
      <Sequence from={P.world} durationInFrames={P.chart - P.world}>
        <World voA07={vo('A07') - P.world} dur={P.chart - P.world} offset={P.world - P.drop} />
      </Sequence>
      <Sequence from={P.chart} durationInFrames={P.montage - P.chart}>
        <Chart dur={P.montage - P.chart} offset={P.chart - P.drop} />
      </Sequence>
      <Sequence from={P.montage} durationInFrames={P.help - P.montage}>
        <Montage dur={P.help - P.montage} />
      </Sequence>
      <Sequence from={P.help} durationInFrames={P.learned - P.help}>
        <HelpMe />
      </Sequence>
      <Sequence from={P.learned} durationInFrames={P.unsent - P.learned}>
        <Learned voA08={vo('A08') - P.learned} hit={30} />
      </Sequence>
      <Sequence from={P.unsent} durationInFrames={P.split - P.unsent}>
        <Unsent voA09={vo('A09') - P.unsent} dur={P.split - P.unsent} />
      </Sequence>
      <Sequence from={P.split} durationInFrames={P.climax - P.split}>
        <Split dur={P.climax - P.split} />
      </Sequence>
      <Sequence from={P.climax} durationInFrames={P.title - P.climax}>
        <Climax voA10={vo('A10') - P.climax} voA11={vo('A11') - P.climax} montageAt={P.climaxMontage - P.climax} dur={P.title - P.climax} />
      </Sequence>
      <Sequence from={P.title} durationInFrames={P.end - P.title}>
        <Title dur={P.end - P.title} />
      </Sequence>
      </Shake>

      <Flash at={P.drop} dur={12} />
      <Flash at={P.world} dur={6} peak={0.6} />
      <Flash at={P.climax} dur={10} peak={0.7} />
      <Flash at={P.title} dur={14} peak={0.8} color="#ffe9c2" />
      <Vignette strength={0.7} />
      <Letterbox open={open} />
      <Grain opacity={0.09} />

      {/* 사운드: 음악(더킹) · 내레이션 · 효과음 */}
      <Audio src={staticFile('audio/music/promo_track.wav')} volume={(f) => 0.9 * duck(f)} />
      {PROMO_VO.map((c) => (
        <Voice key={c.id} dir="vo-promo" cue={c} />
      ))}
      {SFX.map((s, i) => (
        <Sfx key={i} {...s} />
      ))}
    </AbsoluteFill>
  );
};
