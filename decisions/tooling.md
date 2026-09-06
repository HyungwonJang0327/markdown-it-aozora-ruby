# 툴링·패키징

- **결정**: TypeScript(strict) · tsup(ESM+CJS+d.ts) · vitest · ESLint+Prettier · pnpm · Changesets. `markdown-it`은 peerDependency(devDependency로도 설치), 런타임 의존성 0개. Node `>=18`. 라이선스 MIT.
- **이유**: 런타임 의존성 0은 플러그인 채택 장벽을 없애는 핵심 셀링 포인트. tsup은 dual 빌드 설정이 가장 적음. peerDependency는 markdown-it 플러그인 관례(호스트 앱의 markdown-it 인스턴스와 버전 충돌 방지). MIT는 npm 표준이고 원본 Justdown도 MIT.
- **기각된 대안**:
  - jest — Justdown과 통일성은 있으나 독립 패키지엔 설정 부담이 큰 vitest 대비 이점 없음.
  - Apache-2.0 — 소규모 파서에 특허 조항은 과함.
- **결정일**: 2026-09-06
- **갱신 이력**:
  - 2026-09-06: TypeScript를 7.0.2 → **6.0.3**으로 고정. typescript-eslint 8.69가 TS 7(네이티브 컴파일러)을 미지원. typescript-eslint가 TS 7을 지원하면 업그레이드 재검토.
  - 2026-09-06: `@changesets/cli`를 v3 → **v2**로 고정. v3는 Node 22의 `enableCompileCache` API를 요구해 로컬 Node 20.17과 비호환. 또한 v2의 의존성 `human-id@4.2.1`이 ESM 전용이 되어 CJS require를 깨뜨리므로 pnpm override로 `human-id@4.1.1` 고정 (업스트림 수정 시 제거 가능).
