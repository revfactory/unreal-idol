# Drama Project

## 하네스: 12부작 한국 드라마 극본 집필

**목표:** 12부작 한국 드라마의 기획·캐릭터·구조·씬리스트·대본·검수를 한 팀의 협업으로 단계적으로 완성한다.

**트리거:** 드라마 극본/시놉시스/캐릭터/트리트먼트/대본/회차/검수 관련 작업 요청 시 `drama-orchestrator` 스킬을 사용하라. 단순 질문(예: "드라마 작법 일반론")은 직접 응답 가능.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-05-16 | 초기 구성 — 6 에이전트(showrunner/plot-architect/character-designer/scene-director/dialogue-writer/continuity-editor) + 7 스킬(drama-orchestrator + 6 전문 스킬) | 전체 | 12부작 드라마 극본 집필 파이프라인 구축 |
| 2026-05-16 | 글로벌 흥행 요소 통합 — 새 스킬 `global-kdrama-elements` 추가, 기존 5개 스킬(drama-orchestrator/kdrama-bible/kdrama-structure/character-arc/dialogue-craft) 보강, showrunner 에이전트에 글로벌 우선순위 책임 추가 | skills/global-kdrama-elements, skills/drama-orchestrator, skills/kdrama-bible, skills/kdrama-structure, skills/character-arc, skills/dialogue-craft, agents/showrunner.md | 전세계 흥행 K-드라마 12개 핵심 요소(하이콘셉트, 장르 하이브리드, 초반 후킹, 매력적 안타고니스트, 여성 서사, K-aesthetic, 한국 정서 보편화, 사회 비판 보편화, 자막 친화, OST, 회차 완결성, 시즌제) 의식적 적용·점검 체계 도입 |
| 2026-05-16 | 작품 〈언리얼 아이돌〉 초기 실행 — Phase 1~6 완료 (바이블 + 21명 인물 + 12부작 구조 + 1회 씬 분해 57개 + 1회 대본 2,047줄 + 검수). EP01 HIGH 2건 후속 조치(S#11-S#21 시간대 *이른 아침* / 시아 본명 *이주아* 통일) 완료 | _workspace/* | K컬처×AI 글로벌 성공 스토리 컨셉. 군상극 DNA로 모든 인물 입체화. 작품 정체성·검수 약속(콜드 오프닝 미노출·「뉴」 발화 0건·가방 3회·클리프행어 사운드 미점등·수미상관 자막) 모두 PASS |
| 2026-05-16 | 포맷·대사 전문 에이전트 2명 추가 — `script-formatter`(한국 미니시리즈 방송 표준 포맷 정착) + `dialogue-coach`(대사 밀도·자연스러움·인물 voice 노출 균형). 신규 스킬 `dialogue-density` 생성, 기존 `scene-format` 스킬에 방송 표준 포맷·마크다운 금지·약속 기호 전체 표·대사 블록 3단 구조 보강. drama-orchestrator에 Phase 5.5(대사 코칭 → 포맷 정착) 삽입 | agents/script-formatter.md, agents/dialogue-coach.md, skills/dialogue-density, skills/scene-format, skills/drama-orchestrator | EP01 1회 대본에서 (1) 마크다운 잔재(`**`, `*`, `---`)가 방송 포맷을 깨고 (2) 대사 0줄 씬 31.6%로 대화 부족 피드백. dialogue-writer 단독으로는 포맷·밀도 두 책임이 과부하 → 후속 전문 에이전트 2명으로 분리 |
| 2026-05-16 | **V3 페르소나 병렬 대화 아키텍처 전환** — dialogue-writer 폐지(`_deprecated-dialogue-writer.md`), 신규 3단 분업 도입: `action-writer`(지문 전담, 대사 0줄) + 인물별 페르소나 에이전트 15명(`persona-{이름}.md`) + `dialogue-conductor`(페르소나 병렬 호출·라이브 대화 직조) + `script-assembler`(지문·대사 조립). 신규 스킬 `parallel-persona-dialogue` 생성. drama-orchestrator Phase 5를 5-A/5-B/5-C 3단으로 재설계 | agents/action-writer.md, agents/dialogue-conductor.md, agents/script-assembler.md, agents/persona-*.md ×15, skills/parallel-persona-dialogue, skills/drama-orchestrator | EP01에서 "단일 작가가 모든 인물 대사를 쓰니 한 사람 머리에서 나온 평면적 대화"라는 사용자 핵심 피드백. 인물별 페르소나로 분리해 *각 인물이 스스로 말하게* 함. EP01 폐기 후 신 아키텍처로 재집필. 시아 어머니 포함 15명 페르소나 (ECHO 7 + 도윤·박정훈·차주영·윤지윤·회장·시아아버지·동생·시아어머니) |
| 2026-05-16 | **V4 codex-cli 자연스러움 검수 통합** — 신규 에이전트 `script-naturalness-reviewer` 추가. OpenAI Codex CLI(`codex exec`)를 도구로 사용해 한국어 *번역투·AI 패턴·문어체 지문·어색한 대사*를 검수·수정. drama-orchestrator Phase 5.5에 5.5-C 단계(자연스러움 검수)를 새로 삽입. *발화 시도*·*~의 결정*·*시선이 ~에 닿는다* 같은 표현 단호한 제거 | agents/script-naturalness-reviewer.md, skills/drama-orchestrator | EP01 V3 대본에 *발화 시도* 같은 AI 글쓰기·번역투가 잔존한다는 사용자 피드백. Claude 1차 산출물에 OpenAI의 *두 번째 시각*을 더해 한국어 자연스러움 품질 게이트 통과 |
