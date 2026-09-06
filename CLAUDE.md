# CLAUDE.md — markdown-it-aozora-ruby

> 결정 맥락은 `decisions/`, 작업 상태는 `todo/`·`worklog/`에 있다. 이 파일에는 현재 상태를 적지 않는다.

## 1. 개요

아오조라 문고식 루비 표기(`漢字《かんじ》`, `｜ベース《よみ》`)를 `<ruby>` 태그로 렌더링하는 markdown-it 플러그인.
Justdown 앱에서 검증된 파서를 독립 npm 패키지로 분리한 것. 런타임 의존성 0.
왜 만드는지는 [INTENT.md](./INTENT.md) 참고.

## 2. 아키텍처

```
markdown source
   │  markdown-it block/inline 파싱
   ▼
token stream
   │  core ruler 'aozora_ruby' (rule.ts)
   │  — inline 토큰의 children 중 text 토큰만 notations.ts 매처로 분해
   ▼
ruby_open · text(베이스) · ruby_rt_open · text(요미) · ruby_rt_close · ruby_close
   │  renderer rules (render.ts)
   ▼
<ruby>漢字<rt>かんじ</rt></ruby>
```

```
src/
├── index.ts       # 플러그인 entry (default export) + stripRuby 재export
├── notations.ts   # 표기법 매처: 정규식 + 캡처 해석. 새 표기법은 여기에만 추가
├── rule.ts        # core ruler 룰: text 토큰 → ruby 토큰 시퀀스 분해
├── render.ts      # ruby_* 토큰 렌더러 룰 등록
└── strip.ts       # stripRuby(): 요미 제거 플레인 텍스트
test/
├── plugin.test.ts # 렌더링 스냅샷·엣지 케이스
└── strip.test.ts  # stripRuby 케이스
```

## 3. 기술 스택

| 항목 | 선택 | 버전 |
|---|---|---|
| 언어 | TypeScript (strict) | 6.0.3 (7.x는 typescript-eslint 비호환 — decisions/tooling.md) |
| 빌드 | tsup (ESM+CJS+d.ts) | 8.5.1 |
| 테스트 | vitest (+ @vitest/coverage-v8) | 5.0.0 |
| 린트 | ESLint + typescript-eslint + Prettier | 10.10.0 / 8.69.0 / 3.9.6 |
| peer | markdown-it (>=13) | dev: 15.0.1 |
| 버전 관리 | Changesets | 2.31.1 (v3 비호환 — decisions/tooling.md 갱신 이력) |
| 패키지 매니저 | pnpm | 10.26.2 |
| Node | >=18 (로컬 20.17.0) | — |

## 4. 코딩 컨벤션

- 파일명: kebab 불필요, 소문자 단수 (`rule.ts`, `strip.ts`)
- export: 플러그인은 default, 유틸은 named. 내부 모듈 간에는 named만
- 타입: `any` 금지. markdown-it 타입은 `markdown-it` 패키지에서 import (`StateCore`, `Token`)
- 정규식: 반드시 `u` 플래그. 전역(`g`) 정규식은 사용 전 `lastIndex = 0` 리셋
- 에러: 파서는 절대 throw 하지 않는다 — 매치 실패 시 원본 텍스트 그대로 통과

## 5. 중요 — 함정 목록

- 코드 스팬/펜스 안의 `《》`는 변환하면 안 된다 (core ruler가 text 토큰만 처리하므로 지켜지지만, 회귀 테스트로 보장할 것)
- `html_inline` 토큰 사용 금지 — 전용 `ruby_*` 토큰만 (decisions/architecture.md)
- 한자 매칭에 문자 범위 클래스 대신 `\p{Script=Han}` 사용 — BMP 밖 한자(𠮟 등) 누락 방지
- 요미(`《》` 안)와 베이스는 text 토큰으로 넣어 markdown-it의 이스케이프를 태운다 — 직접 HTML 문자열 조립 금지 (XSS)

## 6. 금지

- 결정(decisions/) 없이 라이브러리 추가
- `any`, 테스트 없는 기능 코드
- 회사 코드 복사 (Justdown은 개인 리포이므로 추출 가능)
- WIP·무의미 커밋 ("fix", "update" 단독 금지)

## 7. 작업 흐름

todo/ 확인 → 브랜치 생성 → 테스트 먼저(TDD) → 구현 → `pnpm test` → 논리 단위마다 즉시 커밋 → `/log` → PR

### 진행 단위 규칙

- 작업은 항상 작은 기능 단위 하나씩 진행한다. 여러 작업을 한 번에 이어서 처리하지 않는다.
- 하나가 끝나면 [테스트 → 커밋 → 로그 정리(/log) → 결과 보고]까지 한 뒤 "다음 진행할까?"를 묻고 멈춘다.
- 사용자 승인 없이 다음 작업으로 넘어가지 않는다.

## 8. 커밋 컨벤션

`type(scope): subject` — subject는 한국어 명령형, 50자 이내, 마침표 없음.

- type: `feat` `fix` `refactor` `chore` `docs` `test` `perf` `ci`
- scope:

| scope | 영역 |
|---|---|
| parser | notations.ts, rule.ts |
| render | render.ts |
| strip | strip.ts |
| docs | README*, decisions/, worklog/ 등 문서 |
| build | tsup, tsconfig, package.json |
| ci | GitHub Actions |
| release | Changesets, 버전, npm publish |

### 커밋 단위 규칙

- 한 커밋 = 한 가지 변경. 기능 하나·버그 하나·리팩토링 하나. 여러 작업을 모아 한 번에 커밋하지 않는다.
- 기능이 커도 "타입 추가 → 파서 로직 → 테스트 → 문서"처럼 독립적으로 되돌릴 수 있는 단위로 쪼갠다. 커밋 하나를 revert해도 나머지가 깨지지 않아야 한다.
- 작업 하나가 끝나면 즉시 커밋한다. 세션 끝에 몰아서 커밋하지 않는다.
- 완료 보고에는 커밋 해시 + 메시지 목록을 붙인다. 끝나면 `git status`를 확인해 남은 변경은 커밋하거나 제외 이유를 보고한다.

## 9. 자주 쓰는 명령어

```bash
pnpm test          # vitest 실행
pnpm test:coverage # 커버리지 (목표: src/ 95%+)
pnpm build         # tsup 빌드
pnpm lint          # ESLint
pnpm typecheck     # tsc --noEmit
pnpm changeset     # 변경 기록 (릴리즈용)
```
