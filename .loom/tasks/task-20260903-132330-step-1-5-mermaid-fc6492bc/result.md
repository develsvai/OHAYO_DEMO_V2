# 결과

사용자가 제공한 하네스 시연 문서에서 STEP 1~5 Mermaid 원문을 추출하고, 요청한 화면 전환 범위를 기존 Harness Simulator Job의 후속 작업으로 고정했다.

## 산출물

- docs/harness-demo/source.md: 사용자 첨부 전체의 바이트 동일 사본.
- docs/harness-demo/step-1.mmd ~ step-5.mmd: 단계별 Mermaid 원문 5개.
- docs/harness-demo/diagrams.md: 단계별 전체 그림과 설명, 표현 규칙, 구현 범위, 후속 검증 기준.
- docs/harness-demo/manifest.json: 원본·추출본 SHA-256, 원문 행 번호, 노드 및 연결 목록.
- 구현 Task: task-20260903-132520-cli-6-loom-0a8ceb89 (PENDING).
- 검증 Task: task-20260903-132538-5-6-b26f7551 (PENDING, 구현 Task에 의존).

## 확정한 범위

1. 골격 → 오토 플랜 → 제작 루프 → 배포 루프 → 정책 게이트·훅·스크립트 확장의 전체 스냅샷을 STEP별로 표시한다.
2. CLI는 각 단계의 별도 입력과 Viewer 확인 뒤 다음 입력 대기를 제공한다.
3. STEP 5의 다이어그램은 해당 단계에서 보존한다. 그 뒤에 추가되는 기존 최종 통합 Viewer 및 Loom 구성 계속 중간 화면을 제거한다.
4. 6번째 CLI 입력 후 즉시 기존 Loom 제품 프롬프트 입력 화면으로 이동한다.
5. 40개 제품 Task, 실행 그래프 가로 스크롤, 시간 변경은 이번 묶음에서 제외한다.

## 검증

- 원본 사본과 첨부의 바이트 및 SHA-256 동등성 확인: 성공.
- 정확히 5개 Mermaid 블록, 순서 1~5, 각 추출본과 검토 문서 안 블록의 바이트 동등성: 성공.
- 모든 연결의 시작·끝 노드가 존재함을 확인: 성공. 단계별 노드는 11/17/19/25/28개, 연결문은 11/19/24/32/35개다.
- git diff --check 및 스테이징 후 git diff --cached --check -- . ':!docs/harness-demo/source.md': 성공. 원본 보존 사본의 535행 끝 공백은 첨부에서 그대로 가져온 것으로 검사에서 분리했다. 앱 소스의 스테이징/미스테이징 변경 없음도 확인했다.
- 후속 Task 2개 boundary validation 및 loom validate --strict: 성공 (10 Jobs, 16 Tasks).

## 남은 검증과 다음 행동

이번에는 추출·확인·작업 고정까지만 수행했다. 실제 최종 Viewer 삭제 및 앱 동작 변경은 구현 Task에서 수행한다. Mermaid 브라우저 렌더링·확대·CLI 리허설·빌드는 아직 수행하지 않았으며 후속 구현 및 검증 Task에 명시했다. 구현·검증 Task는 실행하거나 Queue에 등록하지 않았다.
