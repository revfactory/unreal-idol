#!/usr/bin/env python3
"""ElevenLabs 오디오 생성 헬퍼 — 음악(구성 플랜) · 효과음 · 내레이션(타임스탬프 포함).

사용법:
  python3 eleven.py music <plan.json> <out.mp3>
  python3 eleven.py sfx <sfx.json> <out_dir>
  python3 eleven.py tts <lines.json> <out_dir>
"""
import base64
import json
import os
import sys
import subprocess
import time
from concurrent.futures import ThreadPoolExecutor

API = "https://api.elevenlabs.io"
KEY = os.environ["ELEVENLABS_API_KEY"]


def post(path, body, accept_json=False, timeout=600, retries=8):
    # 서버 혼잡(429)·일시 오류(5xx)는 점점 길게 기다리며 다시 시도한다.
    for attempt in range(retries):
        try:
            return _post_once(path, body, accept_json, timeout)
        except RuntimeError as e:
            msg = str(e)
            if attempt == retries - 1 or not any(c in msg for c in ("429", "500", "502", "503", "504")):
                raise
            wait = 10 * (attempt + 1)
            print(f"retry {attempt + 1} in {wait}s: {msg[:120]}", file=sys.stderr)
            time.sleep(wait)


def _post_once(path, body, accept_json, timeout):
    # curl 을 쓰면 시스템 인증서 저장소와 프록시 설정을 그대로 따른다.
    r = subprocess.run(
        ["curl", "-sS", "--fail-with-body", "--max-time", str(timeout), "-X", "POST", API + path,
         "-H", "xi-api-key: " + KEY, "-H", "Content-Type: application/json", "--data-binary", "@-"],
        input=json.dumps(body).encode(), capture_output=True,
    )
    if r.returncode != 0:
        raise RuntimeError(f"{path}: {r.stderr.decode()} {r.stdout[:500]!r}")
    return json.loads(r.stdout) if accept_json else r.stdout


def music(plan_path, out):
    plan = json.load(open(plan_path))
    audio = post(
        "/v1/music?output_format=mp3_44100_192",
        {"composition_plan": plan, "model_id": "music_v1"},
    )
    open(out, "wb").write(audio)
    print("music ->", out, len(audio), "bytes")


def sfx(spec_path, out_dir):
    specs = json.load(open(spec_path))
    os.makedirs(out_dir, exist_ok=True)

    def one(s):
        audio = post(
            "/v1/sound-generation?output_format=mp3_44100_192",
            {
                "text": s["text"],
                "duration_seconds": s["dur"],
                "prompt_influence": s.get("influence", 0.5),
            },
        )
        p = os.path.join(out_dir, s["id"] + ".mp3")
        open(p, "wb").write(audio)
        return p

    with ThreadPoolExecutor(4) as ex:
        for p in ex.map(one, specs):
            print("sfx ->", p)


def tts(spec_path, out_dir):
    spec = json.load(open(spec_path))
    os.makedirs(out_dir, exist_ok=True)

    def one(line):
        voice = line.get("voice", spec["voice"])
        body = {
            "text": line["text"],
            "model_id": line.get("model", spec["model"]),
            "voice_settings": {**spec.get("settings", {}), **line.get("settings", {})},
            "language_code": "ko",
        }
        if line.get("prev"):
            body["previous_text"] = line["prev"]
        if line.get("next"):
            body["next_text"] = line["next"]
        res = post(
            f"/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_192",
            body,
            accept_json=True,
        )
        p = os.path.join(out_dir, line["id"] + ".mp3")
        open(p, "wb").write(base64.b64decode(res["audio_base64"]))
        json.dump(
            res.get("alignment") or res.get("normalized_alignment"),
            open(os.path.join(out_dir, line["id"] + ".align.json"), "w"),
            ensure_ascii=False,
        )
        return p

    with ThreadPoolExecutor(4) as ex:
        for p in ex.map(one, spec["lines"]):
            print("tts ->", p)


if __name__ == "__main__":
    {"music": music, "sfx": sfx, "tts": tts}[sys.argv[1]](*sys.argv[2:])
