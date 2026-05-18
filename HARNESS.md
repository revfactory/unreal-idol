# 〈언리얼 아이돌〉 드라마 하네스 구성 명세

12부작 한국 드라마 극본 집필 하네스의 현재 구성. 총 **26개 에이전트** + **10개 스킬** + **1개 폐기 보존**.

- 작성일: 2026-05-18
- 진화 단계: **V4** (페르소나 병렬 대화 + codex-cli 자연스러움 검수)
- 기준 작품: 〈언리얼 아이돌〉 12부작 미니시리즈

---

## 1. 아키텍처 개요

```
[기획 단계]
  showrunner → plot-architect → character-designer

[회차 작성 단계 — Phase 4-5]
  scene-director (씬 분해)
    ↓
  action-writer (지문 전담, 대사 0줄)
    ↓
  dialogue-conductor (페르소나 병렬 호출)
    ├── persona-yuhai
    ├── persona-minseorin
    ├── persona-charoa
    ├── ... (인물별 페르소나 15명 병렬)
    ↓
  script-assembler (지문 + 대사 조립)
    ↓
[검수 단계 — Phase 5.5 + 6]
  dialogue-coach (대사 밀도)
    ↓
  script-formatter (방송 표준 포맷)
    ↓
  script-naturalness-reviewer (codex-cli 외부 검수)
    ↓
  continuity-editor (최종 게이트)
```

V3 핵심 전환: 단일 dialogue-writer가 모든 인물 대사를 쓰는 *평면적 대화* 폐지 → 인물별 페르소나 15명 병렬.
V4 핵심 추가: OpenAI Codex CLI(`codex exec`)로 한국어 번역투·AI 패턴 외부 검수.

---

## 2. 에이전트 (26개)

### 2-A. 코어 작가팀 (6명) — 기획·구조·인물·검수

| 에이전트 | 역할 한 줄 | Phase |
|---------|---------|-------|
| **showrunner** | 12부작 한국 드라마 총괄 작가. 비전·톤·테마 정립, 팀 창작 일관성 보증, 모든 Phase 최종 승인권 | 전 Phase |
| **plot-architect** | 12부작 플롯·구조·서사 아크 설계. 회차별 트리트먼트, 미드포인트·반환점·클리프행어 배치 | Phase 3 |
| **character-designer** | 인물·관계·아크 설계. 인물 시놉시스, 관계도, 12부작 성장/변화 곡선 | Phase 2 |
| **scene-director** | 씬 구성·지문·연출 묘사. 회차 트리트먼트를 씬 리스트로 분해, 한국 드라마 대본 포맷의 지문/액션라인 | Phase 4 |
| **continuity-editor** | 검수·연속성·복선·인물 일관성·시간선·로직. 회차 간 모순, 빌드업 누락, 페이오프 미회수 추적 | Phase 6 (최종 게이트) |
| ~~dialogue-writer~~ | **폐기** (V3에서 페르소나 병렬로 대체) — `_deprecated-dialogue-writer.md`에 보존 | — |

### 2-B. V3 페르소나 병렬 대화 아키텍처 (3명) — 지문·직조·조립 분업

| 에이전트 | 역할 한 줄 | 산출물 |
|---------|---------|--------|
| **action-writer** | 지문(액션라인·상황 설명) 전담. 대사 0줄. 대사 자리는 `[DIALOGUE: 인물명 — 의도]` placeholder만 | `action-blocks.md` |
| **dialogue-conductor** | 각 인물의 페르소나 에이전트들을 *병렬*로 호출해 실제 사람 대화처럼 씬별 대사를 직조 | `dialogue-final.md` + `dialogue-takes.md` |
| **script-assembler** | 지문 블록과 대화를 한 회차 대본으로 조립. 창작 개입 없이 정밀 조립만 | `script.md` (조립본) |

### 2-C. 인물별 페르소나 에이전트 (15명)

각 인물의 머리·심장·말투로 *몰입*해 발화하는 에이전트. voice-guide의 어휘·말끝·시그니처·호칭·금기 표현 엄수.

#### ECHO 7인 (걸그룹 멤버)

| 에이전트 | 인물 | voice 핵심 |
|---------|------|----------|
| **persona-yuhai** | 유하이 (리더) | 짧고 단정적·청유형·15초 호흡. 시그니처: *"…그래도"* / *"가자"* |
| **persona-minseorin** | 민서린 (메인 댄서) | 폭발 + 시아 의존·분노 시 발레 1번 포지션. 시그니처: *"우리 언니가"* |
| **persona-charoa** | 차로아 (리드 댄서·비주얼) | 한자어 25% 우회·-해요체. 시그니처: *"…그래서, 어떤 형태로"* |
| **persona-paeggeuno** | 박은오 (메인 래퍼) | 부산 사투리(분노 시)·영어 일상화(가사)·검정 마스크 |
| **persona-jungsehyeon** | 정세현 (서브 보컬·통역) | LA 디아스포라·영어 욕설 입 모양·검정 클러치 |
| **persona-yungana** | 윤가나 (서브 보컬) | 미소로 마침·식이장애 어휘 회피. 시그니처: *"…괜찮아요"* |
| **persona-handoi** | 한도이 (막내) | 18세이지만 어른 어휘·시아만 *주아 언니*. 시그니처: *"…근데요"* |

#### 메인 조연 (5명)

| 에이전트 | 인물 | voice 핵심 |
|---------|------|----------|
| **persona-handoyun** | 한도윤 (프로듀서·「뉴」 설계자) | 시아에게만 *-요체*. *나중에*라는 미해결. 시그니처: *"결정의 무게"* |
| **persona-yunjiyoon** | 윤지윤 (부사장, 안타고니스트 #2) | *미안* 영구 금기·모성 + 칼·진주 귀걸이 만짐 |
| **persona-allterm-chairman** | 송재완 (회장, 안타고니스트 #3) | 4어절·한자어 45%·해라체. 시그니처: *"진행해"* / *"수치만 나오면"* |
| **persona-chajuyeong** | 차주영 (AI 엔지니어, 도윤 친구) | 친구 반말 + PD님 격식 그라데이션·0.04% 통계 어휘 |
| **persona-paekjeonghun** | 박정훈 (매니저) | 강원도 사투리·라면·*"형이 알아서 할게"* 시그니처 |

#### 가족 (3명)

| 에이전트 | 인물 | voice 핵심 |
|---------|------|----------|
| **persona-siah-mother** | 이순영 (시아 어머니) | *시아·데이터·AI* 영구 금기·*우리 주아*만·부천 사투리 흔적 |
| **persona-siah-father** | 이형식 (시아 아버지) | 부천 택시 기사·5초 침묵·*우리 주아* |
| **persona-siah-brother** | 이주현 (시아 동생) | 가족 앞 침묵 vs SNS 폭발 — 두 voice의 분열 |

### 2-D. V3-V4 검수·후처리 (3명)

| 에이전트 | 역할 한 줄 | 도구 |
|---------|---------|------|
| **dialogue-coach** | 대사 밀도·자연스러움·인물별 발화 분포 진단·보강. 침묵의 정당성 판정 (PASS/REVISE) | dialogue-density 스킬 |
| **script-formatter** | 한국 미니시리즈 방송 표준 포맷(KBS·MBC·SBS·tvN·JTBC) 적용. 마크다운 잔재 제거, 약속 기호 정합 | scene-format 스킬 |
| **script-naturalness-reviewer** | OpenAI Codex CLI(`codex exec`)로 한국어 번역투·AI 패턴·문어체 지문·어색한 대사 검수·수정 | codex-cli + parallel-persona-dialogue |

---

## 3. 스킬 (10개)

스킬은 "어떻게 하는가"를 담는다. 에이전트가 호출해 작업의 방법론을 따른다.

### 3-A. 오케스트레이터 (1개)

| 스킬 | 역할 |
|------|------|
| **drama-orchestrator** | 12부작 한국 드라마 극본 집필 에이전트 팀을 조율하는 오케스트레이터. Phase 0(컨텍스트) → Phase 1(바이블) → 2(인물) → 3(구조) → 4(씬) → 5(대본 V3 3단 분업) → 5.5(검수 3단) → 6(continuity) → 7(보고) → 8(정리)의 풀 파이프라인 |

### 3-B. 단계별 전문 스킬 (6개)

| 스킬 | 사용 에이전트 | 핵심 내용 |
|------|------------|---------|
| **kdrama-bible** | showrunner | 작품 바이블(로그라인·시놉시스·톤·테마·세계관) 작성 |
| **character-arc** | character-designer | 인물 시놉시스·관계도·캐릭터 아크·voice-guide |
| **kdrama-structure** | plot-architect | 12부작 3막 구조·미드포인트·회차별 비트·클리프행어·빌드업-페이오프 |
| **scene-format** | scene-director, action-writer, script-formatter | 한국 드라마 방송 표준 대본 포맷·약속 기호·마크다운 금지·대사 블록 3단 구조 |
| **dialogue-craft** | persona 전체, dialogue-conductor | 한국 드라마 대사 작법·인물별 말투·서브텍스트·시그니처 라인·세대/계급/시대 어휘 |
| **continuity-check** | continuity-editor | 회차별·전체 검수 체크리스트·연속성·복선 회수·인물 일관성·시간선·로직 |

### 3-C. V3 신규 스킬 (1개)

| 스킬 | 사용 에이전트 | 핵심 내용 |
|------|------------|---------|
| **parallel-persona-dialogue** | dialogue-conductor | 각 인물의 페르소나 에이전트를 *병렬* 호출해 실제 사람의 대화처럼 대사를 직조하는 방법론. 일괄 모드(A) / 턴 기반 모드(B). 단일 작가의 평면적 대화 해소 |

### 3-D. V3 신규 스킬 — 진단 (1개)

| 스킬 | 사용 에이전트 | 핵심 내용 |
|------|------------|---------|
| **dialogue-density** | dialogue-coach | 회차 대사 밀도 진단·인물별 발화 분포·voice 노출 균형·침묵의 정당성 5기준·보강 원칙 |

### 3-E. 횡단 스킬 (1개)

| 스킬 | 사용 에이전트 | 핵심 내용 |
|------|------------|---------|
| **global-kdrama-elements** | 전 에이전트 | K-드라마 글로벌 흥행 12요소(하이콘셉트·장르 하이브리드·초반 후킹·매력적 안타고니스트·여성 서사·K-aesthetic·한국 정서 보편화·사회 비판·자막 친화·OST 시그니처·회차 완결성·시즌제). 모든 Phase에서 점검 |

### 3-F. 외부 도구 활용 (1개 — 사용자 글로벌 스킬)

| 스킬 | 사용 에이전트 | 핵심 내용 |
|------|------------|---------|
| **codex-cli** | script-naturalness-reviewer | OpenAI Codex CLI(`codex exec`) 비대화형 호출. 한국어 자연스러움 검수에 두 번째 모델(GPT-5.1)의 시각 활용 |

---

## 4. 풀 파이프라인 단계별 호출 관계

| Phase | 단계 | 주도 에이전트 | 사용 스킬 | 산출물 |
|-------|------|------------|---------|--------|
| 1 | 바이블 | showrunner | kdrama-bible, global-kdrama-elements | `_workspace/bible/*` |
| 2 | 인물 | character-designer | character-arc, global-kdrama-elements | `_workspace/characters/*` |
| 3 | 12부작 구조 | plot-architect | kdrama-structure, global-kdrama-elements | `_workspace/structure/*` |
| 4 | 씬 분해 | scene-director | scene-format, global-kdrama-elements | `scene-list.md`, `scenes/S*.md` |
| 5-A | 지문 | **action-writer** | scene-format | `action-blocks.md` |
| 5-B | 대화 직조 | **dialogue-conductor** + **persona ×15** | **parallel-persona-dialogue**, dialogue-craft | `dialogue-final.md`, `conductor-log` |
| 5-C | 조립 | **script-assembler** | scene-format | `script.md` (조립본) |
| 5.5-A | 대사 밀도 | dialogue-coach | dialogue-density | `dialogue-density-ep{NN}.md` |
| 5.5-B | 포맷 정착 | script-formatter | scene-format | `format-log-ep{NN}.md` |
| 5.5-C | 자연스러움 검수 | **script-naturalness-reviewer** | **codex-cli** | `naturalness-review-ep{NN}.md` |
| 6 | 최종 검수 | continuity-editor | continuity-check, global-kdrama-elements | `issues-ep{NN}.md` |

---

## 5. 모델 설정

- 모든 에이전트: `model: opus` (Agent 도구 호출 시 명시)
- 외부 검수(script-naturalness-reviewer): codex-cli 경유 GPT-5.1 (ChatGPT OAuth)

---

## 6. 진화 이력

| 버전 | 날짜 | 주요 변화 |
|------|------|---------|
| V1 | 2026-05-16 | 초기 구성 — 코어 6명 + 7 스킬 |
| V1.1 | 2026-05-16 | global-kdrama-elements 스킬 추가, 5개 기존 스킬 보강, showrunner에 글로벌 우선순위 책임 |
| V2 | 2026-05-16 | 포맷·대사 전문 에이전트 2명 추가 — script-formatter, dialogue-coach. 신규 스킬 dialogue-density. scene-format 보강. Phase 5.5 삽입 |
| **V3** | 2026-05-16 | **dialogue-writer 폐지**, 페르소나 병렬 대화 아키텍처 도입. action-writer + dialogue-conductor + script-assembler + persona ×15. 신규 스킬 parallel-persona-dialogue. Phase 5 3단 재설계 |
| **V4** | 2026-05-16 | **script-naturalness-reviewer** 추가. OpenAI Codex CLI로 번역투·AI 패턴 외부 검수. Phase 5.5-C 신설 |

---

## 7. 산출물 위치

```
.claude/
├── agents/                                    ← 26개 에이전트 정의 + 1개 폐기
│   ├── _deprecated-dialogue-writer.md        (V3 폐기 보존)
│   ├── showrunner.md
│   ├── plot-architect.md
│   ├── character-designer.md
│   ├── scene-director.md
│   ├── continuity-editor.md
│   ├── action-writer.md                      (V3)
│   ├── dialogue-conductor.md                 (V3)
│   ├── script-assembler.md                   (V3)
│   ├── dialogue-coach.md                     (V2)
│   ├── script-formatter.md                   (V2)
│   ├── script-naturalness-reviewer.md        (V4)
│   └── persona-*.md ×15                      (V3)
└── skills/                                    ← 10개 스킬
    ├── drama-orchestrator/
    ├── kdrama-bible/
    ├── character-arc/
    ├── kdrama-structure/
    ├── scene-format/
    ├── dialogue-craft/
    ├── continuity-check/
    ├── parallel-persona-dialogue/             (V3)
    ├── dialogue-density/                      (V2)
    └── global-kdrama-elements/                (V1.1)
```

---

## 8. 핵심 원칙

1. **에이전트(누가)와 스킬(어떻게)의 분리** — 에이전트는 역할·인물, 스킬은 방법론
2. **단일 작가 평면화 해소** — 인물별 페르소나 병렬 호출로 *각 인물이 스스로 말하게*
3. **두 번째 모델의 시각** — Claude 1차 산출물에 OpenAI Codex(GPT-5.1)의 외부 검수
4. **작가적 의도 보호** — 작가의 시그니처·강조·침묵의 무게는 패치 대상이 아님
5. **글로벌 시청자 의식** — K-드라마 12 핵심 요소 + 자막 친화 + 번역투 제거
6. **진화 추적** — 모든 변경은 CLAUDE.md 변경 이력 + 본 HARNESS.md에 기록

---

## 9. 실측 성과 (〈언리얼 아이돌〉 12부작 적용)

| 회차 | 분량 |
|------|------|
| EP01 「유령의 데뷔」 | 1,721줄 |
| EP02 「1억 뷰」 | 1,309줄 |
| EP03 「약속」 | 1,616줄 |
| EP04 「체온」 | 1,393줄 |
| EP05 「외부자의 시선」 | 1,586줄 |
| EP06 「도와줘」 (미드포인트) | 1,382줄 |
| EP07 「발신함의 침묵」 | 1,785줄 |
| EP08 「10년 전」 | 1,349줄 |
| EP09 「Unsent」 (제2 정점) | 1,349줄 |
| EP10 「데이터의 유언」 | 1,294줄 |
| EP11 「언리얼」 (클라이맥스) | 1,796줄 |
| EP12 「리얼」 (피날레) | 1,650줄 |
| **총 12부작** | **18,230줄** (약 13시간 분량) |

11개 회차(EP02-EP12)는 단일 메시지에 **백그라운드 병렬 spawn**으로 동시 작성 (각 회차 약 25-30분, 총 약 30분 내 완료).
