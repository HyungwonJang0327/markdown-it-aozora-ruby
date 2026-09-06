# MVP TODO — v1.0.0 (LITE: 전체 범위)

## Phase 1 — 코어 구현 (TDD, ~1.5일) ✅ 2026-09-07 완료

- [x] 아오조라 매처 구현 (`notations.ts`) — 2026-09-07, cf3e143 (+테스트 보강 8106d04)
  - 완료 조건: 단위 테스트 통과 — 한자 연속 베이스(`漢字《かんじ》`), `｜`/`|` 명시 베이스, BMP 밖 한자(`𠮟る《しかる》`), 빈 요미(`漢字《》`)는 변환 안 함, `｜`만 있고 `《》` 없으면 원문 유지
  - 커밋: `feat(parser): 아오조라 루비 매처 구현`
- [x] core ruler + 플러그인 등록 (`rule.ts`, `index.ts`) — 2026-09-07, ccb9c99 (+테스트 보강 9828877)
  - 완료 조건: text 토큰이 `ruby_open`/text/`ruby_rt_open`/text/`ruby_rt_close`/`ruby_close` 시퀀스로 분해됨을 토큰 레벨 테스트로 검증
  - 커밋: `feat(parser): core ruler 토큰 분해 구현`
- [x] 렌더러 룰 (`render.ts`) — 2026-09-07, b411908 (+테스트 보강 44732ff)
  - 완료 조건: `md.render()`가 `<ruby>漢字<rt>かんじ</rt></ruby>` 출력. 요미에 `<script>` 포함 시 이스케이프됨(XSS 테스트)
  - 커밋: `feat(render): ruby 토큰 렌더러 구현`
- [x] 통합·회귀 테스트 — 2026-09-07, 80755f3 (+매처 명시화 1e5e575). 커버리지 100%
  - 완료 조건: 코드 스팬·펜스 안 `《》` 미변환, 링크 텍스트 안 동작, Justdown `markdown.test.ts`의 루비 케이스 전부 포팅·통과, `src/` 커버리지 95%+
  - 커밋: `test(parser): 통합·회귀 테스트 추가`
- [x] `stripRuby` 구현 (`strip.ts`) — 2026-09-07, 53c2cc2 (+테스트 중복 해소 4e164c6)
  - 완료 조건: `stripRuby('｜東京《とうきょう》') === '東京'` 포함 케이스 통과, named export 확인
  - 커밋: `feat(strip): stripRuby 유틸 구현`
- [x] reviewer 리뷰 (/review) 후 승인 항목 수정 — 2026-09-07, high 0건 달성 (788e4e3 perf 가드, 97e9b76·d19a806 테스트, 013039f 주석)
  - 완료 조건: high 항목 0건
  - 커밋: (지적 사항별 `fix(...)`)

## Phase 2 — 문서·배포 (~1일)

- [x] README.md 완성 (Background 채움, 예제 출력이 실제 렌더 결과와 일치) — 2026-09-07, 908d4f6
  - 완료 조건: README의 모든 코드 예제를 실행해 출력 일치 확인 ✅ (dist 빌드로 8개 예제 실측)
  - 커밋: `docs(docs): README 영어판 완성`
- [x] README.ja.md · README.ko.md 작성 — 2026-09-07, 734e1d6
  - 완료 조건: 영어판과 내용 동기, 예제 동일 ✅ (코드 블록·표기 예제 해시 대조로 3판 동일 확인)
  - 커밋: `docs(docs): 일본어·한국어 README 추가`
- [ ] GitHub 저장소 생성·푸시·main 보호 규칙·CI 그린 확인 (저장소 생성·푸시·About 설정은 2026-09-07 완료 — 보호 규칙·CI 남음)
  - 완료 조건: Actions에서 lint·typecheck·test·build 전부 통과
  - 커밋: (없음 — 저장소 설정 작업)
- [ ] `pnpm build` 산출물 검증 (`npm pack --dry-run`으로 dist만 포함 확인, ESM/CJS 양쪽 import 스모크)
  - 완료 조건: Node에서 `require`·`import` 둘 다 동작
  - 커밋: `build(build): 패키징 검증 보완` (수정 필요 시에만)
- [ ] changeset 작성 → v1.0.0 bump → npm publish (/ship, 사용자 승인 후)
  - 완료 조건: `npm view markdown-it-aozora-ruby version` = 1.0.0
  - 커밋: `release: v1.0.0` (Changesets 자동)
