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
