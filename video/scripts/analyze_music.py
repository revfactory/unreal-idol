#!/usr/bin/env python3
"""음악 파일의 에너지 곡선·온셋·템포를 분석해 컷 위치 후보를 뽑는다.

사용법: python3 analyze_music.py <audio.mp3> [out.json]
"""
import json
import subprocess
import sys

import numpy as np

SR = 22050


def load(path):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32)


def main(path, out=None):
    y = load(path)
    hop = 512
    win = 2048
    n = 1 + (len(y) - win) // hop
    frames = np.lib.stride_tricks.as_strided(y, shape=(n, win), strides=(y.strides[0] * hop, y.strides[0]))
    spec = np.abs(np.fft.rfft(frames * np.hanning(win), axis=1))
    rms = np.sqrt((frames ** 2).mean(axis=1))
    # 저역(킥) 에너지와 스펙트럴 플럭스(온셋 강도)
    freqs = np.fft.rfftfreq(win, 1 / SR)
    low = spec[:, freqs < 150].sum(axis=1)
    logspec = np.log1p(spec)
    flux = np.maximum(0, np.diff(logspec, axis=0)).sum(axis=1)
    flux = np.concatenate([[0], flux])
    t = np.arange(n) * hop / SR

    # 템포: 온셋 강도의 자기상관
    o = flux - flux.mean()
    ac = np.correlate(o, o, mode="full")[len(o) - 1:]
    fps = SR / hop
    lags = np.arange(len(ac)) / fps
    mask = (lags > 60 / 180) & (lags < 60 / 70)
    best = lags[mask][np.argmax(ac[mask])]
    bpm = 60 / best

    # 강한 온셋(피크) 추출
    thr = np.percentile(flux, 97)
    peaks = []
    for i in range(1, n - 1):
        if flux[i] > thr and flux[i] >= flux[i - 1] and flux[i] >= flux[i + 1]:
            if not peaks or t[i] - peaks[-1][0] > 0.15:
                peaks.append((round(float(t[i]), 3), round(float(flux[i]), 1)))

    # 0.5초 단위 에너지(dB)
    seg = []
    step = 0.5
    for s in np.arange(0, t[-1], step):
        m = (t >= s) & (t < s + step)
        seg.append(round(float(20 * np.log10(rms[m].mean() + 1e-9)), 1))

    print(f"duration {len(y) / SR:.2f}s  tempo ~{bpm:.1f} BPM")
    print("energy dB per 0.5s:")
    for i in range(0, len(seg), 10):
        print(f"  {i * step:5.1f}s  " + " ".join(f"{v:6.1f}" for v in seg[i:i + 10]))
    print("strong onsets:", peaks[:80])
    if out:
        json.dump({"bpm": bpm, "energy": seg, "onsets": peaks}, open(out, "w"))


if __name__ == "__main__":
    main(*sys.argv[1:])
