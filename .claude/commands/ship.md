---
description: 릴리즈 준비 — 테스트·빌드·CHANGELOG·버전 bump·npm publish 체크리스트
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
argument-hint: "[patch|minor|major]"
---

순서대로 실행하고, 실패하면 그 단계에서 멈추고 보고한다:

1. `pnpm lint && pnpm typecheck && pnpm test` — 전부 통과 확인
2. `pnpm build` — dist/ 산출물 확인 (ESM + CJS + d.ts)
3. Changesets: 미기록 변경이 있으면 `pnpm changeset`으로 기록 유도, `pnpm changeset version`으로 CHANGELOG·버전 bump 제안 ($ARGUMENTS 참고)
4. 릴리즈 체크리스트를 출력하고 사용자 확인을 기다린다:
   - [ ] CI 그린 (GitHub Actions)
   - [ ] README 3종(en/ja/ko) 예제가 실제 출력과 일치
   - [ ] package.json exports/files 필드 점검 (`npm pack --dry-run`)
   - [ ] git 태그·푸시
5. 사용자가 명시적으로 승인한 경우에만 `pnpm publish` 실행. 임의 실행 금지.

커밋 규칙:
- 한 커밋 = 한 가지 변경. 기능 하나·버그 하나·리팩토링 하나. 여러 작업을 모아 한 번에 커밋하지 않는다.
- 기능이 커도 "타입 추가 → 파서 로직 → 테스트 → 문서"처럼 독립적으로 되돌릴 수 있는 단위로 쪼갠다. 커밋 하나를 revert해도 나머지가 깨지지 않아야 한다.
- 작업 하나가 끝나면 즉시 커밋한다. 세션 끝에 몰아서 커밋하지 않는다.
- 완료 보고에는 커밋 해시 + 메시지 목록을 붙인다. 끝나면 `git status`를 확인해 남은 변경은 커밋하거나 제외 이유를 보고한다.
