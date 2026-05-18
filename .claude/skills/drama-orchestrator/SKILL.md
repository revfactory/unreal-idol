---
name: drama-orchestrator
description: "12부작 한국 드라마 극본 집필 에이전트 팀을 조율하는 오케스트레이터. 드라마 기획·시놉시스·캐릭터·트리트먼트·씬리스트·대본·대사 코칭·포맷 정착·검수를 단계적으로 진행하며, 12개 글로벌 흥행 요소(하이콘셉트·장르 하이브리드·초반 후킹·매력적 안타고니스트·여성 서사·K-aesthetic·한국 정서 보편화·사회 비판 보편화·자막 친화·OST·회차 완결성·시즌제)를 Phase마다 점검한다. '드라마 극본', '드라마 쓰자', '12부작', '미니시리즈 대본', '시놉시스 만들어줘', '회차 트리트먼트', '대본 쓰자', '캐릭터 설계', '회차 씬리스트', '대본 검수', '대사 보강', '대사 밀도 점검', '포맷 정착', '대본 포맷', '넷플릭스 드라마', '글로벌 OTT 드라마', 'K-드라마 흥행 요소 점검' 등 K-드라마 집필 요청 시 반드시 이 스킬을 사용. 후속 작업: 회차 다시 쓰기, 인물 수정, 트리트먼트 보완, 대사 손보기, 대사 보강, 포맷 다시, 검수 결과 반영, 부분 재실행, 결과 개선, 다음 회차 진행, 글로벌 흥행 요소 보강 등 후속 요청에도 반드시 이 스킬을 사용. 단, 영화 시나리오·웹툰 콘티·소설은 이 스킬의 범위가 아니다."
---

# Drama Orchestrator — 12부작 드라마 극본 집필 오케스트레이터

12부작 한국 드라마 극본 집필 에이전트 팀을 조율하여, 기획부터 검수까지 전체 파이프라인을 수행한다.

## 실행 모드: 에이전트 팀

세션 내내 하나의 통합 팀을 유지한다. Phase마다 주도자가 바뀌지만 팀원 구성은 동일하다. 작품의 모든 결정이 팀 전체의 합의 위에서 이뤄지도록 한다.

## 에이전트 구성

| 팀원 | 에이전트 타입 | 역할 | 사용 스킬 | 주요 출력 |
|------|-------------|------|----------|---------|
| showrunner | general-purpose | 총괄·비전·톤·승인·**글로벌 우선순위** | kdrama-bible, **global-kdrama-elements** | `_workspace/bible/*` |
| plot-architect | general-purpose | 구성·12부작 아크·트리트먼트·**초반 후킹** | kdrama-structure, global-kdrama-elements | `_workspace/structure/*` |
| character-designer | general-purpose | 인물·관계·아크·**매력적 안타고니스트** | character-arc, global-kdrama-elements | `_workspace/characters/*` |
| scene-director | general-purpose | 씬 분해·씬 리스트·연출 시드·**K-aesthetic·OST 자리** | scene-format, global-kdrama-elements | `_workspace/episodes/ep{NN}/scene-list.md`, `scenes/S*.md` |
| **action-writer** | general-purpose | **지문(상황 설명) 전담 — 대사 0줄** | scene-format | `_workspace/episodes/ep{NN}/action-blocks.md` ([DIALOGUE: ...] placeholder 포함) |
| **persona-{인물명} ×15+** | general-purpose | **인물별 페르소나 — 자기 캐릭터 발화만** | parallel-persona-dialogue, dialogue-craft | 페르소나별 turn 응답 |
| **dialogue-conductor** | general-purpose | **페르소나 병렬 호출·라이브 대화 직조** | **parallel-persona-dialogue** | `_workspace/episodes/ep{NN}/dialogue-final.md` + dialogue-takes.md + conductor-log |
| **script-assembler** | general-purpose | **지문 + 대사 조립** | scene-format | `_workspace/episodes/ep{NN}/script.md` (조립본) + assembly-log |
| dialogue-coach | general-purpose | 대사 밀도·자연스러움·voice 노출 점검 | dialogue-density, dialogue-craft | `_workspace/review/dialogue-density-ep{NN}.md` |
| script-formatter | general-purpose | 한국 미니시리즈 방송 표준 포맷 정착·마크다운 잔재 제거 | scene-format | `_workspace/review/format-log-ep{NN}.md` |
| **script-naturalness-reviewer** | general-purpose | **codex-cli로 번역투·AI 패턴·문어체 지문·어색한 대사 검수·수정** | scene-format, dialogue-craft, codex-cli | `_workspace/review/naturalness-review-ep{NN}.md` |
| continuity-editor | general-purpose | 검수·연속성·복선 회수·**글로벌 12요소 점검** | continuity-check, global-kdrama-elements | `_workspace/review/*` |

**dialogue-writer 폐지** — 단일 작가가 모든 인물의 대사를 쓰는 방식이 *한 사람의 머리에서 나온 평면적 대화*를 만든다는 사용자 피드백을 받아 V3에서 폐지. 대사 책임이 **인물별 페르소나 14-15명**으로 분산되고, **dialogue-conductor**가 그들을 병렬 호출해 직조한다.

모든 Agent 호출에 `model: "opus"`를 명시한다. 모든 팀원은 `global-kdrama-elements` 스킬을 공유 참조하며, Phase별로 해당하는 요소를 점검한다.

## 워크플로우

### Phase 0: 컨텍스트 확인 (후속 작업 지원)

`_workspace/` 디렉토리 존재 여부를 확인하여 실행 모드를 결정한다.

1. `_workspace/` 미존재 → **초기 실행**. Phase 1로 진행
2. `_workspace/` 존재 + 사용자가 부분 수정 요청 (특정 회차/인물/씬 명시) → **부분 재실행**
   - 영향받는 Phase의 해당 산출물만 재생성
   - 인접 Phase의 정합성을 함께 점검
3. `_workspace/` 존재 + 사용자가 새 작품 시작 요청 → **새 실행**
   - 기존 `_workspace/`를 `_workspace_{YYYYMMDD_HHMMSS}/`로 이동
   - Phase 1부터 처음부터 진행
4. `_workspace/` 존재 + 사용자가 진행 재개 요청 → **이어서 진행**
   - 마지막으로 완성된 Phase를 확인
   - 다음 Phase로 진행

판단이 모호하면 사용자에게 1회만 확인 요청한다.

### Phase 1: 기획 — 작품 바이블 정립

**주도:** showrunner / **협력:** plot-architect, character-designer
**글로벌 요소 점검:** 하이콘셉트 로그라인, 장르 하이브리드, 한국 정서 보편화, 사회 비판 보편화, **글로벌 우선순위 결정**

1. 사용자 입력 분석 — 컨셉, 장르, 타겟(국내 / 글로벌 OTT / 작품성), 참고작, 메시지
2. `_workspace/`, `_workspace/bible/`, `_workspace/characters/`, `_workspace/structure/`, `_workspace/episodes/`, `_workspace/review/` 디렉토리 생성
3. 팀 구성:
   ```
   TeamCreate(
     team_name: "drama-team",
     members: [showrunner, plot-architect, character-designer, scene-director, dialogue-writer, continuity-editor]
   )
   ```
   각 멤버의 prompt에는 해당 에이전트의 `.md` 파일을 읽고 역할을 수행하라는 지시 포함
4. 작업 등록:
   ```
   TaskCreate(tasks: [
     { title: "로그라인·시놉시스 후크 (하이콘셉트 점검)", assignee: "showrunner" },
     { title: "전체 시놉시스", assignee: "showrunner" },
     { title: "톤·테마·장르 정의 (장르 하이브리드 설계)", assignee: "showrunner" },
     { title: "세계관·배경 명세", assignee: "showrunner" },
     { title: "글로벌 흥행 우선순위 12요소 결정", assignee: "showrunner" },
     { title: "1차 인물 군상 스케치", assignee: "character-designer" },
     { title: "1차 12부작 아크 윤곽", assignee: "plot-architect" }
   ])
   ```
5. showrunner가 바이블의 핵심 5개 파일(logline, synopsis, tone-theme, world, **global-priorities**)을 작성하며, plot-architect와 character-designer가 SendMessage로 톤 검증
6. showrunner는 `global-kdrama-elements` 스킬을 읽고 12요소 중 본 작품의 강 적용·중 적용·약 적용·미적용 우선순위 결정
7. 사용자에게 바이블 5개 파일 보고 → 승인 요청 (특히 글로벌 우선순위는 사용자와 합의)

### Phase 2: 인물 설계

**주도:** character-designer / **협력:** showrunner, plot-architect
**글로벌 요소 점검:** 매력적 안타고니스트 5요소, 여성 서사 트렌드 (의식 점검)

1. TaskCreate로 추가 작업 등록:
   - 주연 인물 시놉시스 (3-5명)
   - **안타고니스트 5요소 보강** (자기 논리·의외의 디테일·카리스마·결핍·거울 관계)
   - 조연 인물 시놉시스 (3-7명)
   - 관계도
   - 12부작 캐릭터 아크 추적표
   - voice-guide
   - **글로벌 트렌드 의식 점검** (여성 서사 적용/미적용 의식적 결정)
2. character-designer가 작업 주도. `character-arc` 스킬의 "매력적 안타고니스트" 섹션을 참조해 안타고니스트 입체화
3. plot-architect와 SendMessage로 아크-플롯 핑퐁
4. showrunner가 톤 검수 + 글로벌 우선순위(global-priorities.md) 기준으로 점검
5. 사용자에게 인물 시놉시스 + 관계도 보고

### Phase 3: 12부작 구조 설계

**주도:** plot-architect / **협력:** showrunner, character-designer
**글로벌 요소 점검:** 초반 후킹(1-3회 잠금), 회차 완결성, 시즌제 가능성

1. TaskCreate로 추가 작업:
   - 12부작 아크 (3막 구조, 주요 비트 위치)
   - **1-3회 강력 설계** (콜드 오프닝·1회 클리프행어·3회 잠금)
   - 회차별 트리트먼트 12개 (treatment-ep01 ~ treatment-ep12)
   - 플롯 스레드 추적표
   - 빌드업-페이오프 추적표
   - **시즌제 가능성 검토** (우선순위 강 적용 시)
2. plot-architect가 전체 아크 먼저, 그 다음 회차별 트리트먼트
3. **1-3회는 일반 회차의 1.2-1.5배 비트 밀도로 설계** — 글로벌 OTT 후킹의 결정점
4. 각 회차 트리트먼트는 5-10 비트로 분해. 회차당 1-2 페이지. 회차 단위 완결성 비트 의식적 배치
5. character-designer와 SendMessage로 인물 아크 정합성 검증
6. showrunner가 회차마다 톤 검수 + 글로벌 우선순위 점검
7. 사용자에게 12부작 트리트먼트 보고 → 승인 (특히 1-3회 강도 확인)

### Phase 4: 씬 분해 (회차별)

**주도:** scene-director / **협력:** plot-architect, dialogue-writer, continuity-editor
**글로벌 요소 점검:** K-aesthetic 의식적 활용, OST 자리 명시, (1회의 경우) 콜드 오프닝 설계

회차 단위로 점진적으로 진행한다. 모든 12회를 한 번에 분해하지 않고, 사용자가 지정한 회차(또는 1회부터 순차) 단위로 작업한다.

1. 대상 회차 확인 (사용자가 명시하지 않으면 1회부터)
2. TaskCreate로 작업 등록 — 해당 회차의 씬 리스트와 씬 지문
3. scene-director가 트리트먼트를 40-70개 씬으로 분해
4. 각 씬은 `scene-format` 스킬의 표준 헤더 포맷을 따른다
5. **K-aesthetic 의식 점검** — 회차에 한국적 시각 요소(공간·음식·계절·일상 디테일)가 정서 매개로 쓰이는가?
6. **시각적 시그니처** — 작품 전체의 시각 아이콘이 이 회차에 등장하는가?
7. **OST 자리 명시** — 메인 테마가 흘러나올 결정적 씬을 지문에 표기
8. **1회의 경우 콜드 오프닝 특별 설계** — 첫 5분에 작품 본질 압축
9. 씬 지문 작성, 대사 자리는 placeholder
10. continuity-editor가 시간선·동선 사전 점검
11. 사용자에게 회차의 씬 리스트 보고 → 승인 → Phase 5로

### Phase 5: 대본 집필 (회차별) — V3 페르소나 병렬 대화 아키텍처

**전체 주도:** action-writer + dialogue-conductor + script-assembler (3단 분업)
**협력:** 인물별 페르소나 14-15명, scene-director, character-designer
**글로벌 요소 점검:** 자막 친화 5원칙

V3에서 폐지된 dialogue-writer를 대체하는 **3단 분업 아키텍처**입니다. *지문은 한 명, 대사는 인물별 페르소나 병렬 호출, 조립은 한 명*. 단일 작가가 모든 인물 대사를 쓰는 *평면적 대화*를 해소합니다.

#### 5-A. 지문 작성 (action-writer 주도)

1. scene-director의 씬 리스트 + 씬 지문 초안 수신
2. action-writer가 **지문만** 작성 — 대사 0줄
3. 대사 자리는 `[DIALOGUE: 인물명 — 의도 한 줄]` placeholder
4. 산출물: `_workspace/episodes/ep{NN}/action-blocks.md`
5. 마크다운 강조·구분선 사용 금지

#### 5-B. 페르소나 병렬 대화 직조 (dialogue-conductor 주도)

1. dialogue-conductor가 action-blocks.md 수신, `parallel-persona-dialogue` 스킬 적용
2. 각 씬에서:
   - 등장 인물 식별
   - 호출 모드 결정 (A 일괄 / B 턴 기반)
   - 페르소나 에이전트 **병렬 호출** (한 메시지에 여러 Agent)
   - 각 페르소나가 자기 캐릭터로 *몰입*해 자기 대사만 작성
   - 산출물 수집 후 자연스러운 대화 순서로 직조
3. misvoice 감지 시 해당 페르소나만 재호출 (voice-guide 금기·호칭 어긋남·작가 대변·반응 부재·강제 발화 등)
4. 산출물:
   - `_workspace/episodes/ep{NN}/dialogue-final.md` — 직조된 최종 대화
   - `_workspace/episodes/ep{NN}/dialogue-takes.md` — 대안 take 보존
   - `_workspace/review/conductor-log-ep{NN}.md` — 결정 로그

#### 5-C. 조립 (script-assembler 주도)

1. script-assembler가 action-blocks.md + dialogue-final.md 수신
2. `[DIALOGUE: ...]` placeholder를 페르소나 발화로 치환
3. 한국 미니시리즈 표준 포맷으로 출력 (회차 메타 + 씬 헤더 + 지문 + 대사 블록 + 약속 기호)
4. 누락·중복·인물 불일치 감지 시 해당 에이전트(action-writer 또는 dialogue-conductor)에 SendMessage
5. 산출물:
   - `_workspace/episodes/ep{NN}/script.md` — 조립본
   - `_workspace/review/assembly-log-ep{NN}.md` — 조립 로그

### Phase 5.5: 대사 밀도 점검 + 포맷 정착 (회차별)

**주도:** dialogue-coach → script-formatter (순차)
**역할 축소(V3):** 페르소나 병렬 대화가 이미 대사를 만들었으므로 dialogue-coach는 *진단·균형 점검*에 집중. *보강*은 부수적.

#### 5.5-A. 대사 밀도 진단 (dialogue-coach)

1. script-assembler의 조립본을 받아 `dialogue-density` 스킬로 진단
2. 진단표 작성: `_workspace/review/dialogue-density-ep{NN}.md`
3. 회차 대사 0줄 씬 비율 임계선(25%) 점검
4. 인물별 voice 노출 균형 점검
5. **페르소나가 *작가의 대변*이 된 흔적** 감지 — 발견 시 dialogue-conductor에 SendMessage로 해당 씬 페르소나 재호출 요청
6. *과밀* 점검 — V3에서는 페르소나 병렬로 대사가 *과해질* 위험. 한 인물의 발화가 3턴+로 길어지면 압축 권장
7. 진단 완료 후 script-formatter에게 인계

#### 5.5-B. 포맷 정착 (script-formatter)

1. `scene-format` 스킬의 한국 미니시리즈 방송 표준 포맷 적용
2. 마크다운 잔재 제거 (`**`, `*` 강조, `---` 구분선)
3. 대사 블록 3단 구조 통일, 약속 기호 정합화
4. 변경 로그: `_workspace/review/format-log-ep{NN}.md`
5. 완료 후 Phase 5.5-C (자연스러움 검수)로 인계

#### 5.5-C. 한국어 자연스러움 검수 (script-naturalness-reviewer) — V4 신설

1. script-naturalness-reviewer가 포맷 정착본을 받아 **OpenAI Codex CLI(`codex exec`)로 외부 검수** 실행
2. 청크 단위(씬 5-10개)로 분할 호출. 각 청크에서:
   - 번역투 표현(영어/일본어 직역체) 식별
   - AI 글쓰기의 부자연스러운 패턴(*발화 시도*, *~의 결정*, *시선이 닿는다*) 식별
   - 한국 드라마 대본 일상 어투와 어긋난 문어체 지문 식별
   - 어색한 대사 (인물 voice 일탈) 식별
3. JSON 형식 수정안 수집 → voice-guide·signature-lines와 대조해 *수용/기각* 판단
4. 수용된 수정을 본문에 *최소 침습*으로 패치
5. `_workspace/review/naturalness-review-ep{NN}.md` — 식별 N건 / 수정 N건 / 보존 N건 / 분류표
6. 완료 후 Phase 6 (continuity-editor)로 인계

### Phase 6: 검수 (회차별, 점진적)

**주도:** continuity-editor / **협력:** 전 팀원
**글로벌 요소 점검:** 12요소 전반 (강 적용 항목 우선)

1. continuity-editor가 해당 회차 대본을 받아 검수
2. `continuity-check` 스킬의 체크리스트로 점검
3. **글로벌 흥행 요소 점검** — `global-kdrama-elements` 스킬의 12요소 중 본 작품의 강 적용 항목을 기준으로 회차 검수:
   - 콜드 오프닝(1회), 자막 친화, K-aesthetic, OST 자리, 회차 완결성 등
4. 발견된 이슈를 `_workspace/review/issues-ep{NN}.md`에 기록 (글로벌 흥행 갭은 별도 분류)
5. HIGH 심각도 이슈는 즉시 담당 에이전트에게 SendMessage로 수정 요청
6. 수정 완료 후 재검수
7. 검수 통과한 대본을 최종 산출물로 확정

### Phase 7: 종합 보고 및 다음 회차 진행 결정

1. 사용자에게 현재까지 진행 상황 보고:
   - 완성된 산출물 목록
   - 남은 회차
   - 발견된 이슈 요약
2. 다음 단계 옵션 제시:
   - 다음 회차 진행 (Phase 4로 돌아감)
   - 특정 산출물 수정 (Phase 0으로 돌아가 부분 재실행)
   - 작업 종료 (Phase 8로)

### Phase 8: 정리

1. 팀 정리 (TeamDelete)
2. `_workspace/` 보존 (사후 검증·재실행용)
3. 최종 산출물 경로 안내
4. 사용자에게 피드백 요청 — "에이전트 구성, 워크플로우, 산출물 품질 중 개선할 부분이 있나요?"

## 데이터 흐름

```
사용자 컨셉
  │
  ▼
[Phase 1: 바이블]            ← showrunner 주도
_workspace/bible/
  │
  ▼
[Phase 2: 인물]              ← character-designer 주도
_workspace/characters/
  │
  ▼
[Phase 3: 12부작 구조]       ← plot-architect 주도
_workspace/structure/
  │
  ▼ (회차별 루프)
[Phase 4: 씬 분해 ep{NN}]    ← scene-director 주도
_workspace/episodes/ep{NN}/scene-list.md, scenes/S*.md
  │
  ▼
[Phase 5-A: 지문 ep{NN}]          ← action-writer (대사 0줄)
_workspace/episodes/ep{NN}/action-blocks.md
  │
  ▼
[Phase 5-B: 대화 직조 ep{NN}]     ← dialogue-conductor + 페르소나 14-15명 병렬
_workspace/episodes/ep{NN}/dialogue-final.md + dialogue-takes.md
+ _workspace/review/conductor-log-ep{NN}.md
  │
  ▼
[Phase 5-C: 조립 ep{NN}]          ← script-assembler
_workspace/episodes/ep{NN}/script.md (조립본)
+ _workspace/review/assembly-log-ep{NN}.md
  │
  ▼
[Phase 5.5A: 대사 밀도 점검 ep{NN}] ← dialogue-coach
_workspace/review/dialogue-density-ep{NN}.md
  │
  ▼
[Phase 5.5B: 포맷 정착 ep{NN}]    ← script-formatter
_workspace/episodes/ep{NN}/script.md (방송 표준 포맷)
+ _workspace/review/format-log-ep{NN}.md
  │
  ▼
[Phase 5.5C: 자연스러움 검수 ep{NN}] ← script-naturalness-reviewer + codex-cli
_workspace/episodes/ep{NN}/script.md (번역투·어색함 수정)
+ _workspace/review/naturalness-review-ep{NN}.md
  │
  ▼
[Phase 6: 검수 ep{NN}]       ← continuity-editor 주도
_workspace/review/issues-ep{NN}.md
  │
  └→ 이슈 있으면 담당자에게 수정 요청 → 재검수
  │
  ▼
[Phase 7: 보고 + 다음 회차 결정]
  │
  ▼
[Phase 8: 정리]
```

## 디렉토리 구조

```
_workspace/
├── bible/
│   ├── logline.md
│   ├── synopsis.md
│   ├── tone-theme.md
│   ├── world.md
│   └── global-priorities.md    ← 12요소 적용 강도 표
├── characters/
│   ├── cast-list.md
│   ├── 01-{역할명}.md
│   ├── 02-{역할명}.md
│   ├── ...
│   ├── relationship-map.md
│   ├── arc-tracker.md
│   └── voice-guide.md
├── structure/
│   ├── 12ep-arc.md
│   ├── treatment-ep01.md
│   ├── treatment-ep02.md
│   ├── ...
│   ├── plot-threads.md
│   └── setup-payoff.md
├── episodes/
│   ├── ep01/
│   │   ├── scene-list.md
│   │   ├── scenes/
│   │   │   ├── S001.md
│   │   │   ├── S002.md
│   │   │   └── ...
│   │   ├── script.md
│   │   └── signature-lines.md
│   ├── ep02/
│   │   └── ...
│   └── ...
└── review/
    ├── continuity-log.md
    ├── issues-ep{NN}.md
    ├── payoff-tracker.md
    ├── dialogue-density-ep{NN}.md       ← dialogue-coach 진단표
    ├── format-log-ep{NN}.md             ← script-formatter 변경 로그
    └── showrunner-notes-{phase}.md
```

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| 팀원 1명 실패 | 1회 재시도. 재실패 시 showrunner가 SendMessage로 상태 확인. 그래도 안 되면 사용자에게 알리고 진행 여부 확인 |
| 팀원 간 의견 충돌 | showrunner가 작품 바이블을 근거로 중재. 그래도 미결이면 사용자에게 선택 요청 |
| 회차가 늘어져 70씬 초과 | scene-director와 plot-architect 협의로 비트 압축 또는 다음 회로 이월 |
| 12회 안에 회수 못한 빌드업 | continuity-editor 보고 → plot-architect가 회차 트리트먼트 수정 또는 일부 빌드업 폐기 |
| 사용자 피드백이 추상적 ("재미없어") | showrunner가 구체 질문 3개로 분해: 톤? 인물? 사건? |
| 인물이 너무 많아져 관리 불가 | character-designer가 통합 가능한 조연 합치기 제안 |
| dialogue-coach 보강안과 dialogue-writer의 의도된 침묵 충돌 | showrunner가 작품 바이블의 글로벌 우선순위(자막 친화 강도) 기준으로 판정. dialogue-coach의 REVISE 임계값(25%) 사전 합의 |
| script-formatter가 작가의 의도적 강조(굵게)를 일괄 제거하려 함 | 의도적 강조는 *작은따옴표*로 보존. dialogue-writer가 명시적으로 강조를 의도한 경우 SendMessage로 협의 |

## 테스트 시나리오

### 정상 흐름 (초기 실행)
1. 사용자: "도시 소방관과 노숙자 출신 형사가 한 사건에 얽히는 미스터리 멜로, 12부작으로 써줘"
2. Phase 0: `_workspace/` 미존재 확인 → 초기 실행
3. Phase 1: showrunner가 로그라인·시놉시스·톤·세계관 작성, 사용자 승인
4. Phase 2: character-designer가 주연 4명 + 조연 5명 시놉시스 작성, 관계도 완성
5. Phase 3: plot-architect가 12부작 아크와 12개 트리트먼트 작성
6. Phase 4-6: 1회차 씬 분해 → 대본 → 검수 → 사용자 보고
7. Phase 7: 다음 회차 진행 여부 사용자 선택
8. 예상 결과: `_workspace/episodes/ep01/script.md` 1회차 대본 완성

### 후속 실행 흐름 (특정 인물 말투 수정 요청)
1. 사용자: "주인공 도현의 말투가 너무 차가워. 더 인간적인 면을 넣어줘"
2. Phase 0: `_workspace/` 존재 + 부분 수정 요청 → 부분 재실행
3. character-designer가 voice-guide의 도현 부분 수정
4. dialogue-writer가 기 작성된 회차 대본의 도현 대사 손질
5. continuity-editor가 말투 일관성 재검수
6. 사용자에게 수정 결과 보고

### 에러 흐름
1. Phase 3에서 plot-architect가 회차별 트리트먼트 작성 중 6회 미드포인트가 character-designer의 인물 아크와 충돌
2. plot-architect가 character-designer에게 SendMessage로 협의 요청
3. 5분 이내 합의되지 않으면 showrunner가 중재 — 작품 바이블 기준으로 한쪽 손
4. 결정 후 양쪽 산출물 동기화 → 진행
