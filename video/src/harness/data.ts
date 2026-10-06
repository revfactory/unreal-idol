import {C} from '../lib/theme';

/** 하네스 27 에이전트 — 궤도별 배치 */
export const ORBITS: {r: number; color: string; kind: 'core' | 'persona' | 'qa'; items: {id: string; label: string; dead?: boolean}[]}[] = [
  {
    r: 300,
    color: C.cyan,
    kind: 'core',
    items: [
      {id: 'showrunner', label: 'showrunner'},
      {id: 'plot-architect', label: 'plot-architect'},
      {id: 'character-designer', label: 'character-designer'},
      {id: 'scene-director', label: 'scene-director'},
      {id: 'action-writer', label: 'action-writer'},
      {id: 'dialogue-conductor', label: 'dialogue-conductor'},
      {id: 'script-assembler', label: 'script-assembler'},
      {id: 'continuity-editor', label: 'continuity-editor'},
    ],
  },
  {
    r: 540,
    color: C.magenta,
    kind: 'persona',
    items: ['유하이', '민서린', '차로아', '박은오', '정세현', '윤가나', '한도이', '한도윤', '윤지윤', '송재완', '차주영', '박정훈', '이순영', '이형식', '이주현'].map((n) => ({
      id: `persona-${n}`,
      label: n,
    })),
  },
  {
    r: 760,
    color: C.gold,
    kind: 'qa',
    items: [
      {id: 'dialogue-coach', label: 'dialogue-coach'},
      {id: 'script-formatter', label: 'script-formatter'},
      {id: 'script-naturalness-reviewer', label: 'naturalness-reviewer'},
      {id: 'dialogue-writer', label: 'dialogue-writer', dead: true},
    ],
  },
];

export const LOGLINE: {t: string; hl?: string}[] = [
  {t: '데뷔 직전 멤버 한 명을 잃은 '},
  {t: '7인조 K-팝 걸그룹', hl: C.magenta},
  {t: '이, '},
  {t: '죽은 멤버의 데이터', hl: C.teal},
  {t: '로 만든 AI 페르소나를 '},
  {t: '8번째 멤버', hl: C.gold},
  {t: '로 데뷔시켜 '},
  {t: '빌보드 1위', hl: C.violet},
  {t: '를 노린다.'},
];

export const BIBLE_DOCS = ['logline.md', 'synopsis.md', 'tone-theme.md', 'world.md', 'global-priorities.md'];

export const EPISODES: {ep: string; title: string; lines: number; h: number; mark?: string; color?: string}[] = [
  {ep: 'EP01', title: '유령의 데뷔', lines: 1721, h: 0.42},
  {ep: 'EP02', title: '1억 뷰', lines: 1309, h: 0.56},
  {ep: 'EP03', title: '약속', lines: 1616, h: 0.64},
  {ep: 'EP04', title: '체온', lines: 1393, h: 0.5},
  {ep: 'EP05', title: '외부자의 시선', lines: 1586, h: 0.58},
  {ep: 'EP06', title: '도와줘', lines: 1382, h: 0.28, mark: '미드포인트 · 최저점', color: C.magenta},
  {ep: 'EP07', title: '발신함의 침묵', lines: 1785, h: 0.46},
  {ep: 'EP08', title: '10년 전', lines: 1349, h: 0.6},
  {ep: 'EP09', title: 'Unsent', lines: 1349, h: 0.86, mark: '제2 정점', color: C.gold},
  {ep: 'EP10', title: '데이터의 유언', lines: 1294, h: 0.66},
  {ep: 'EP11', title: '언리얼', lines: 1796, h: 1, mark: '클라이맥스', color: C.gold},
  {ep: 'EP12', title: '리얼', lines: 1650, h: 0.78, mark: '피날레', color: C.teal},
];

type Group = 'lead' | 'echo' | 'main' | 'family' | 'sub';
export const GROUP_COLOR: Record<Group, string> = {lead: C.gold, echo: C.magenta, main: C.cyan, family: C.green, sub: C.violet};

export const CAST: {n: string; name: string; role: string; g: Group}[] = [
  {n: '01', name: '시아', role: 'ECHO 센터 · 고인', g: 'lead'},
  {n: '02', name: '유하이', role: 'ECHO 리더', g: 'echo'},
  {n: '03', name: '민서린', role: '메인 댄서', g: 'echo'},
  {n: '04', name: '차로아', role: '리드 댄서', g: 'echo'},
  {n: '05', name: '박은오', role: '메인 래퍼', g: 'echo'},
  {n: '06', name: '정세현', role: '서브 보컬 · 통역', g: 'echo'},
  {n: '07', name: '윤가나', role: '서브 보컬', g: 'echo'},
  {n: '08', name: '한도이', role: '막내', g: 'echo'},
  {n: '09', name: '「뉴」', role: 'AI 페르소나', g: 'lead'},
  {n: '10', name: '한도윤', role: '메인 프로듀서', g: 'main'},
  {n: '11', name: '장진우', role: '안타고니스트 #1', g: 'main'},
  {n: '12', name: '윤지윤', role: '부사장', g: 'main'},
  {n: '13', name: '송재완', role: '올텀 회장', g: 'main'},
  {n: '14', name: '이순영', role: '시아 어머니', g: 'family'},
  {n: '15', name: '이형식 · 이주현', role: '시아 아버지 · 동생', g: 'family'},
  {n: '16', name: '강하늘', role: '팬덤 대표', g: 'sub'},
  {n: '17', name: '일라이자 첸', role: '다큐 PD', g: 'sub'},
  {n: '18', name: '김리아', role: '모션 캡처 댄서', g: 'sub'},
  {n: '19', name: '차주영', role: 'AI 엔지니어', g: 'sub'},
  {n: '20', name: '박정훈', role: '매니저', g: 'sub'},
  {n: '21', name: '한유진', role: '시아의 옛 친구', g: 'sub'},
];

/** 인물 관계선 (CAST 인덱스 쌍) */
export const RELATIONS: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [8, 9], [9, 11], [11, 12], [9, 10], [0, 13], [13, 14], [9, 18], [8, 17], [8, 15], [7, 16], [1, 19], [0, 20],
];

/** 15 페르소나의 실제 대사 (12부작 대본에서 발췌) */
export const PERSONA_LINES: {name: string; line: string; color: string}[] = [
  {name: '유하이', line: '……그래도. 가자.', color: C.magenta},
  {name: '민서린', line: '……나, 못해.', color: C.magenta},
  {name: '차로아', line: '……알겠어, 언니.', color: C.magenta},
  {name: '박은오', line: '한 줄만 — 시아 언니가 쓴 가사로.', color: C.magenta},
  {name: '정세현', line: 'Where are you going?', color: C.magenta},
  {name: '윤가나', line: '시아 언니 결정이라면, 저도요.', color: C.magenta},
  {name: '한도이', line: '이 결정을, 내릴 권한이 누구한테 있어요?', color: C.magenta},
  {name: '한도윤', line: '내가, 책임질게.', color: C.cyan},
  {name: '윤지윤', line: '저는, 안심이에요.', color: C.cyan},
  {name: '송재완', line: '진행해.', color: C.cyan},
  {name: '차주영', line: '0.04%가 아니야. 1.2%야.', color: C.cyan},
  {name: '박정훈', line: '멤버 일곱, 도착했습니다.', color: C.violet},
  {name: '이순영', line: '……우리 주아, 잘하네.', color: C.green},
  {name: '이형식', line: '…우리, 이제 가만히 있을 수 없어요.', color: C.green},
  {name: '이주현', line: '누가 누나 동의받았냐고.', color: C.green},
];
