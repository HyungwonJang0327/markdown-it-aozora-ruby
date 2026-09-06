---
description: 대화를 분석해 worklog에 기록하고 decisions/·todo/를 갱신한다
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
argument-hint: "[주제]"
---

오늘 날짜를 `date +%Y-%m-%d`로 확인한다 (추측 금지).

1. **worklog**: 이 대화에서 이전 /log 이후 분량을 분석해 `worklog/{오늘}.md`에 기록한다.
   파일이 이미 있으면 이어 붙인다. 형식은 worklog/README.md 규칙(참여 에이전트 / 논의 내용 / 결론·결정 / 미결·다음).
   $ARGUMENTS 가 있으면 그 주제 중심으로 기록한다.
2. **decisions**: 대화에서 확정된 결정을 decisions/ 해당 파일에 병합한다.
   덮어쓰기 금지 — 기존 결정과 충돌하면 "⚠️ 결정 변경 확인 필요"를 표시하고 사용자에게 알린다.
3. **todo**: 완료된 항목에 날짜·커밋 해시를 기록하고 체크한다.
