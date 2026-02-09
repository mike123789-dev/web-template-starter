# Linking Rules

문서 그래프를 명확히 유지하기 위한 상호 링크 규칙이다.

## Required Links

### spec.md

- `[[plan]]`
- `[[tasks]]`
- `[[test-matrix]]`

### plan.md

- `[[spec]]`
- `[[tasks]]`
- `[[test-matrix]]`

### tasks.md

- `[[spec]]`
- `[[plan]]`
- `[[test-matrix]]`

### test-matrix.md

- `[[spec]]`
- `[[plan]]`
- `[[tasks]]`

### tasks/T-xxx.md

- `[[../tasks]]`
- `[[../spec]]`
- `[[../test-matrix]]`

## Rule

- 각 feature 문서는 최소 3개 이상의 내부 링크를 가져야 한다.
- 링크 경로는 가능한 한 wiki link(`[[...]]`)를 사용한다.
