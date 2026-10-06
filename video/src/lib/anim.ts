import {Easing, interpolate, random} from 'remotion';
import {FPS} from './theme';

export const s2f = (s: number) => Math.round(s * FPS);

export const E = {
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  outQuart: Easing.bezier(0.25, 1, 0.5, 1),
  inOutCubic: Easing.bezier(0.65, 0, 0.35, 1),
  inOutQuint: Easing.bezier(0.83, 0, 0.17, 1),
  inExpo: Easing.bezier(0.7, 0, 0.84, 0),
  outBack: Easing.bezier(0.34, 1.56, 0.64, 1),
  linear: (t: number) => t,
};

/** frame 이 [a, b] 구간을 지나는 동안 from → to 로 보간한다 (양끝 고정). */
export const ramp = (
  frame: number,
  a: number,
  b: number,
  from = 0,
  to = 1,
  easing: (t: number) => number = E.outExpo,
) =>
  interpolate(frame, [a, b], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** 들어왔다 나가는 불투명도: in 구간 페이드인, out 구간 페이드아웃. */
export const inOut = (frame: number, a: number, b: number, fadeIn = 8, fadeOut = 8) =>
  Math.min(ramp(frame, a, a + fadeIn, 0, 1, E.outQuart), ramp(frame, b - fadeOut, b, 1, 0, E.inOutCubic));

export const rnd = (seed: string | number) => random(seed);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 박자(비트) 펄스: 지정 시각마다 1 → 0 으로 감쇠하는 값. */
export const pulse = (frame: number, beats: number[], decay = 8) => {
  let v = 0;
  for (const b of beats) {
    const d = frame - b;
    if (d >= 0 && d < decay * 4) v = Math.max(v, Math.exp(-d / decay));
  }
  return v;
};
