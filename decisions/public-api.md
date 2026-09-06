# 공개 API

- **결정**:
  - default export: `aozoraRuby` 플러그인 함수 (`md.use(aozoraRuby)`)
  - named export: `stripRuby(text: string): string` — 요미를 제거한 플레인 텍스트 반환 (목차·검색용)
  - v1.0.0에서 플러그인 **옵션 없음**
- **이유**: default export는 markdown-it 생태계 관례(markdown-it-ruby 등 전부 default)라 사용자 기대와 일치. 옵션 없는 API는 문서·테스트 표면을 최소화하고, 옵션은 나중에 하위호환으로 추가 가능하다(빼는 건 breaking). `stripRuby`는 Justdown의 목차 로직에서 실수요가 검증된 유틸.
- **기각된 대안**:
  - named export만 — ESM/CJS interop은 깔끔하나 생태계 관례 이탈.
  - `rp: boolean` 옵션(루비 미지원 fallback) — 주요 브라우저가 모두 ruby를 지원해 실수요 불확실. 필요해지면 v1.1에서 추가.
- **stripRuby 의미론 (2026-09-07 확정)**: 매처(`findAozoraRuby`)를 재사용해 **루비로 매치되는 부분만** base로 치환한다. 매치 안 되는 `《》`·`｜`(빈 요미, 짝 없는 괄호 등)는 원문 유지. Justdown 원본의 무차별 `《…》` 제거와 의도적으로 다름 — 렌더 결과의 플레인 텍스트와 일치시키기 위함 (53c2cc2).
- **null 입력**: 런타임 가드 없음 — 공개 시그니처가 `string`이고, "파서는 throw 금지" 규칙은 매치 실패 시 원문 통과를 의미. JS 사용자의 null 전달 요구가 생기면 v1.1에서 검토.
- **결정일**: 2026-09-06
