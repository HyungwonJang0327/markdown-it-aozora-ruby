---
description: reviewer 에이전트로 현재 브랜치 diff를 리뷰하고, 승인된 항목만 수정한다
allowed-tools: Task, Read, Edit, Bash, Glob, Grep
---

1. reviewer 에이전트를 호출해 현재 브랜치의 diff(`git diff main...HEAD`, 없으면 워킹트리 diff)를 리뷰시킨다.
2. 지적 목록을 severity 순으로 사용자에게 보여준다.
3. 사용자가 승인한 항목만 수정한다. 항목별 승인/기각 판단을 물어본다.
4. 승인/기각 결과를 오늘 worklog에 남긴다 (`date +%Y-%m-%d`로 날짜 확인).
