import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import timing from '../vo-timing.json';
import {FPS} from '../lib/theme';

type Timing = Record<string, {dur: number; words: [string, number][]}>;
export const VO = timing as unknown as Timing;

export type Cue = {id: string; at: number; gain?: number; duck?: number};

/** 효과음 한 발. at 은 프레임, trim 은 클립 앞부분을 건너뛸 초. */
export const Sfx: React.FC<{src: string; at: number; vol?: number; trim?: number; frames?: number}> = ({
  src,
  at,
  vol = 0.6,
  trim = 0,
  frames,
}) => (
  <Sequence from={at} durationInFrames={frames} layout="none">
    <Audio src={staticFile(`audio/sfx/${src}.mp3`)} volume={vol} startFrom={Math.round(trim * FPS)} />
  </Sequence>
);

/** 내레이션 클립 배치. */
export const Voice: React.FC<{dir: string; cue: Cue}> = ({dir, cue}) => (
  <Sequence from={cue.at} durationInFrames={Math.ceil(VO[cue.id].dur * FPS) + 2} layout="none">
    <Audio src={staticFile(`audio/${dir}/${cue.id}.mp3`)} volume={cue.gain ?? 1} />
  </Sequence>
);

/** 내레이션 구간에서 음악을 낮추는 더킹 곡선 (0~1 배율). */
export const duckCurve = (cues: Cue[], depth = 0.5, attack = 6, release = 14) => (f: number) => {
  let d = 0;
  for (const c of cues) {
    const s = c.at;
    const e = c.at + Math.round(VO[c.id].dur * FPS);
    let k = 0;
    if (f >= s - attack && f < s) k = (f - (s - attack)) / attack;
    else if (f >= s && f <= e) k = 1;
    else if (f > e && f < e + release) k = 1 - (f - e) / release;
    d = Math.max(d, k * (c.duck ?? depth));
  }
  return 1 - d;
};
