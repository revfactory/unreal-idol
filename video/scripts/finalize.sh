#!/usr/bin/env bash
# 렌더 결과의 오디오를 리미터 → -14 LUFS / TP -1.5 dB 2패스 정규화하고 영상은 그대로 복사한다.
# 사용법: scripts/finalize.sh <raw.mp4> <final.mp4>
set -euo pipefail
in="$1"
out="$2"
LIM="alimiter=limit=0.80:attack=4:release=60:level=false"
stats=$(ffmpeg -hide_banner -nostats -i "$in" -af "$LIM,loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$stats" | python3 -c "import json,sys; print(json.load(sys.stdin)['$1'])"; }
ffmpeg -hide_banner -v error -y -i "$in" \
  -af "$LIM,loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,aresample=48000" \
  -c:v copy -c:a aac -b:a 256k -movflags +faststart "$out"
echo "input  I=$(get input_i) LUFS  TP=$(get input_tp) dBTP"
ffmpeg -hide_banner -nostats -i "$out" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)" | tail -2
