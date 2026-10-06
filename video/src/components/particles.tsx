import React, {useLayoutEffect, useMemo, useRef, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, staticFile} from 'remotion';
import {rnd} from '../lib/anim';
import {H, W} from '../lib/theme';

/** 목표점 배열: [x, y, r, g, b] × N (화면 좌표, 0-255 색). */
export type Targets = Float32Array;

const STRIDE = 5;

/**
 * 이미지 밝기에 비례해 목표점을 뽑는다. 밝은 픽셀일수록 많이 뽑혀 형상이 살아난다.
 * fit 은 1920×1080 화면을 cover 로 채운다고 가정한다.
 */
export const useImageTargets = (src: string, n: number, threshold = 0.18, seed = 'img'): Targets | null => {
  const [targets, setTargets] = useState<Targets | null>(null);
  const [handle] = useState(() => delayRender(`targets:${src}`));
  useLayoutEffect(() => {
    const img = new Image();
    img.src = staticFile(src);
    img.onload = () => {
      const sw = 384;
      const sh = 216;
      const cv = document.createElement('canvas');
      cv.width = sw;
      cv.height = sh;
      const ctx = cv.getContext('2d')!;
      // cover 맞춤
      const scale = Math.max(sw / img.width, sh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (sw - dw) / 2, (sh - dh) / 2, dw, dh);
      const data = ctx.getImageData(0, 0, sw, sh).data;
      const cand: number[] = [];
      const weights: number[] = [];
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const i = (y * sw + x) * 4;
          const l = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
          if (l > threshold) {
            cand.push(i);
            weights.push(Math.pow(l, 2.2));
          }
        }
      }
      const total = weights.reduce((a, b) => a + b, 0);
      const out = new Float32Array(n * STRIDE);
      // 가중 샘플링 (누적 분포 + 시드 난수)
      const cum = new Float64Array(weights.length);
      let acc = 0;
      for (let k = 0; k < weights.length; k++) {
        acc += weights[k] / total;
        cum[k] = acc;
      }
      for (let p = 0; p < n; p++) {
        const u = rnd(`${seed}-${p}`);
        let lo = 0;
        let hi = cum.length - 1;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (cum[mid] < u) lo = mid + 1;
          else hi = mid;
        }
        const i = cand[lo];
        const px = (i / 4) % sw;
        const py = Math.floor(i / 4 / sw);
        out[p * STRIDE] = ((px + rnd(`${seed}-jx-${p}`)) / sw) * W;
        out[p * STRIDE + 1] = ((py + rnd(`${seed}-jy-${p}`)) / sh) * H;
        out[p * STRIDE + 2] = data[i];
        out[p * STRIDE + 3] = data[i + 1];
        out[p * STRIDE + 4] = data[i + 2];
      }
      setTargets(out);
      continueRender(handle);
    };
    img.onerror = () => continueRender(handle);
  }, [src, n, threshold, seed, handle]);
  return targets;
};

/** 텍스트 형상의 목표점. font 는 CSS font 문자열. */
export const useTextTargets = (
  lines: string[],
  font: string,
  n: number,
  opts: {cx?: number; cy?: number; lineHeight?: number; color?: [number, number, number]; seed?: string} = {},
): Targets | null => {
  const {cx = W / 2, cy = H / 2, lineHeight = 1.15, color = [255, 220, 160], seed = 'txt'} = opts;
  const [targets, setTargets] = useState<Targets | null>(null);
  const [handle] = useState(() => delayRender(`text-targets:${lines.join('|')}`));
  useLayoutEffect(() => {
    document.fonts.load(font, lines.join('')).then(() => {
      const cv = document.createElement('canvas');
      cv.width = W;
      cv.height = H;
      const ctx = cv.getContext('2d')!;
      ctx.font = font;
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const size = parseFloat(font.match(/(\d+)px/)?.[1] ?? '100');
      lines.forEach((l, k) => {
        ctx.fillText(l, cx, cy + (k - (lines.length - 1) / 2) * size * lineHeight);
      });
      const data = ctx.getImageData(0, 0, W, H).data;
      const cand: number[] = [];
      for (let y = 0; y < H; y += 2) {
        for (let x = 0; x < W; x += 2) {
          if (data[(y * W + x) * 4 + 3] > 128) cand.push(y * W + x);
        }
      }
      const out = new Float32Array(n * STRIDE);
      for (let p = 0; p < n; p++) {
        const idx = cand[Math.floor(rnd(`${seed}-${p}`) * cand.length)] ?? 0;
        out[p * STRIDE] = (idx % W) + rnd(`${seed}-x-${p}`) * 2;
        out[p * STRIDE + 1] = Math.floor(idx / W) + rnd(`${seed}-y-${p}`) * 2;
        out[p * STRIDE + 2] = color[0];
        out[p * STRIDE + 3] = color[1];
        out[p * STRIDE + 4] = color[2];
      }
      setTargets(out);
      continueRender(handle);
    });
  }, [font, n, cx, cy, lineHeight, seed, handle]); // eslint-disable-line react-hooks/exhaustive-deps
  return targets;
};

/**
 * 파티클 수렴/확산 렌더러. progress 0 → 흩어진 상태, 1 → 목표 형상.
 * 개별 지연·소용돌이·반짝임을 넣어 빛 입자가 모여드는 느낌을 만든다.
 */
export const ParticleField: React.FC<{
  targets: Targets | null;
  progress: number;
  frame: number;
  seed?: string;
  origin?: 'scatter' | 'center' | 'below';
  spread?: number;
  size?: number;
  swirl?: number;
  tint?: [number, number, number][];
  alpha?: number;
  shimmer?: number;
  bloom?: boolean;
  opacity?: number;
  trail?: number;
}> = ({
  targets,
  progress,
  frame,
  seed = 'pf',
  origin = 'scatter',
  spread = 1.4,
  size = 3,
  swirl = 220,
  tint = [
    [255, 205, 120],
    [70, 240, 225],
  ],
  alpha = 0.9,
  shimmer = 1.5,
  bloom = true,
  opacity = 1,
  trail = 0.025,
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const glow = useRef<HTMLCanvasElement>(null);
  const count = targets ? targets.length / STRIDE : 0;
  // 입자별 난수는 한 번만 계산해 둔다 (매 프레임 해시 계산 방지)
  const R = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let p = 0; p < count; p++) {
      a[p * 3] = rnd(`${seed}-a-${p}`);
      a[p * 3 + 1] = rnd(`${seed}-b-${p}`);
      a[p * 3 + 2] = rnd(`${seed}-c-${p}`);
    }
    return a;
  }, [count, seed]);
  useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv || !targets) return;
    const ctx = cv.getContext('2d')!;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    const n = targets.length / STRIDE;
    const maxDelay = 0.35;
    const ease = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
    for (let p = 0; p < n; p++) {
      const tx = targets[p * STRIDE];
      const ty = targets[p * STRIDE + 1];
      const r1 = R[p * 3];
      const r2 = R[p * 3 + 1];
      const r3 = R[p * 3 + 2];
      let sx: number;
      let sy: number;
      if (origin === 'center') {
        const ang = r1 * Math.PI * 2;
        const rad = (0.15 + r2 * 0.85) * W * 0.6 * spread;
        sx = W / 2 + Math.cos(ang) * rad;
        sy = H / 2 + Math.sin(ang) * rad * 0.7;
      } else if (origin === 'below') {
        sx = W / 2 + (r1 - 0.5) * W * spread;
        sy = H + 50 + r2 * H * 0.6;
      } else {
        sx = W / 2 + (r1 - 0.5) * W * spread;
        sy = H / 2 + (r2 - 0.5) * H * spread;
      }
      const d = r3 * maxDelay;
      const dx = tx - sx;
      const dy = ty - sy;
      const len = Math.hypot(dx, dy) || 1;
      const at = (pr: number) => {
        const t = ease(Math.min(1, Math.max(0, (pr - d) / (1 - maxDelay))));
        const sw = Math.sin(t * Math.PI) * swirl * (r1 - 0.5) * 2;
        return [sx + dx * t + (-dy / len) * sw, sy + dy * t + (dx / len) * sw, t];
      };
      const [px, py, t] = at(progress);
      // 형상이 갖춰진 뒤의 미세한 반짝임
      const x = px + Math.sin(frame * 0.07 + p) * shimmer * t;
      const y = py + Math.cos(frame * 0.05 + p * 1.3) * shimmer * t;
      const tw = 0.6 + 0.4 * Math.sin(frame * 0.25 + r2 * 40);
      const base = tint[p % tint.length];
      const cr = base[0] * (1 - t) + targets[p * STRIDE + 2] * t;
      const cg = base[1] * (1 - t) + targets[p * STRIDE + 3] * t;
      const cb = base[2] * (1 - t) + targets[p * STRIDE + 4] * t;
      // 밝은 목표색일수록 또렷하게: 어두운 픽셀 출신 입자도 최소 밝기를 보장
      const lift = 1.25;
      const col = `${Math.min(255, (cr * lift) | 0)},${Math.min(255, (cg * lift) | 0)},${Math.min(255, (cb * lift) | 0)}`;
      const a = alpha * (0.55 + 0.45 * t) * tw;
      const sz = size * (1.5 - 0.5 * t) * (0.6 + r2 * 0.8);
      if (trail > 0 && t > 0.001 && t < 0.995) {
        // 이동 중에는 직전 위치에서 현재 위치로 빛 꼬리를 그린다
        const [qx, qy] = at(progress - trail);
        ctx.strokeStyle = `rgba(${col},${a * (0.22 + 0.5 * t)})`;
        ctx.lineWidth = sz * 0.45;
        ctx.beginPath();
        ctx.moveTo(qx, qy);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${col},${a})`;
        ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      }
    }
    if (bloom && glow.current) {
      const g = glow.current.getContext('2d')!;
      g.clearRect(0, 0, W / 4, H / 4);
      g.drawImage(cv, 0, 0, W / 4, H / 4);
    }
  }, [targets, R, progress, frame, origin, spread, size, swirl, tint, alpha, shimmer, bloom, trail]);
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      {bloom ? (
        <canvas
          ref={glow}
          width={W / 4}
          height={H / 4}
          style={{position: 'absolute', width: W, height: H, filter: 'blur(8px) brightness(1.2)', mixBlendMode: 'screen', opacity: 1}}
        />
      ) : null}
      <canvas ref={ref} width={W} height={H} style={{position: 'absolute', mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

/** 아래에서 위로 떠오르는 불씨/빛 입자 (단순 장식용). */
export const Embers: React.FC<{
  frame: number;
  count?: number;
  color?: string;
  area?: {x: number; y: number; w: number; h: number};
  rise?: number;
  seed?: string;
  opacity?: number;
}> = ({frame, count = 80, color = '255,210,130', area = {x: 0, y: 0, w: W, h: H}, rise = 1.2, seed = 'em', opacity = 1}) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    const life = 90 + rnd(`${seed}-l-${i}`) * 120;
    const t = ((frame + rnd(`${seed}-o-${i}`) * life) % life) / life;
    const x = area.x + rnd(`${seed}-x-${i}`) * area.w + Math.sin(frame * 0.03 + i) * 12;
    const y = area.y + area.h - t * area.h * rise;
    const s = 1.5 + rnd(`${seed}-s-${i}`) * 3.5;
    const a = Math.sin(t * Math.PI) * opacity;
    items.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: s,
          height: s,
          borderRadius: s,
          background: `rgba(${color},${a})`,
          boxShadow: `0 0 ${s * 4}px rgba(${color},${a})`,
        }}
      />,
    );
  }
  return <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>{items}</AbsoluteFill>;
};
