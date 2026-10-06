# 〈언리얼 아이돌〉 모션그래픽 영상 2편

| 파일 | 길이 | 내용 |
|------|------|------|
| `out/unreal-idol-teaser.mp4` | 60초 · 1920×1080 · 30fps | 작품 홍보 티저. 04:17 CCTV 콜드 오프닝 → 서버에 남은 목소리 → 「뉴」 데뷔 드롭 → 「도와줘」 → 추모인가·착취인가 → 파티클 타이틀 |
| `out/unreal-idol-harness.mp4` | 60초 · 1920×1080 · 30fps | 메이킹 영상. 한 줄 프롬프트 → 27개 에이전트 오케스트레이션 → 기획·구조·인물 → 페르소나 15명 병렬 대화 → 검수 게이트 4단 → 11개 회차 병렬 집필 → 18,230줄 |

## 제작 파이프라인

1. **키아트 15장** — `codex-image` 스킬(Codex CLI `image_generation`)로 5장씩 3배치 병렬 생성 → `public/img/`
2. **내레이션 대본** — Claude 초안 → `codex exec` 한국어 자연스러움 검수 → 수용·부분 수용·기각 판정 반영 (`scripts/narration-draft.md`)
3. **내레이션** — ElevenLabs `eleven_v4` (티저: Marcus 바리톤 · 「뉴」: Anna Kim 속삭임 / 메이킹: Yohan Koo). 글자 단위 타임스탬프로 자막·타이포를 단어 단위 동기화하고, Scribe 음성 인식으로 발음을 재검증해 오독 4줄은 재녹음
4. **음악** — ElevenLabs Music 구성 플랜(섹션별 길이 지정). 티저는 큐 3개를 히트 위치에 맞춰 트레일러식으로 편집 (`public/audio/music/promo_track.wav`)
5. **효과음 24종** — ElevenLabs Sound Effects
6. **모션** — Remotion(React) 코드로 프레임 단위 구성. 음악 에너지·온셋 분석(`scripts/analyze_music.py`)으로 컷을 비트에 맞춤
7. **마스터링** — `scripts/finalize.sh` 로 −14 LUFS / TP −1 dB 2패스 정규화

## 다시 렌더하기

```bash
npm install
npx remotion render Promo out/unreal-idol-teaser_raw.mp4
npx remotion render Harness out/unreal-idol-harness_raw.mp4
scripts/finalize.sh out/unreal-idol-teaser_raw.mp4 out/unreal-idol-teaser.mp4
scripts/finalize.sh out/unreal-idol-harness_raw.mp4 out/unreal-idol-harness.mp4
```

미리보기: `npx remotion studio`

## 폴더 구조

```
video/
├── src/
│   ├── promo/      티저 장면 (act1 콜드오픈·서버·결단·도와줘 / act2 데뷔 드롭 / act3 반전·클라이맥스·타이틀)
│   ├── harness/    메이킹 장면 (h1 프롬프트·네트워크 / h2 기획 / h3 페르소나 / h4 검수·병렬·피날레)
│   ├── components/ 파티클 엔진·글리치·키네틱 타이포·오디오 배치
│   └── vo-timing.json  내레이션 단어 타이밍
├── public/         이미지·폰트·오디오
└── scripts/        ElevenLabs 생성·음악 분석·스틸 확인·마스터링
```
