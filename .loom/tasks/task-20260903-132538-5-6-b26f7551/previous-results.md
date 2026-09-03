# Previous Results

4 older recorded result(s) were omitted. Promote durable context to Job Notes or explicit Context References.

## 5. STEP 1~5 Mermaid 원본 추출 및 화면 전환 계약 고정

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

## 6. 단계별 CLI 입력·다이어그램 뷰어와 6단계 Loom 직접 진입 구현

# 구현 결과

사용자의 “오케 바로 시작해” 승인에 따라 단계별 CLI와 다이어그램 흐름을 구현했다. 입력 한 번당 한 단계만 실행하며 STEP 1~5 완료 시 각각 /harness/1~5를 연다. STEP 5 설명 후에도 6번째 입력을 기다리고 /harness 등 비어 있지 않은 입력을 받으면 즉시 비어 있는 Loom 제품 프롬프트를 연다. 별도의 최종 통합 Viewer와 Continue 화면은 제거했다.

원문 프롬프트 5개와 Mermaid 5개를 그대로 scenario에 반영했다. 단계별 화면은 원문 전체 그림을 표시하고 확대·축소·스크롤·화면 맞춤을 지원한다. ROOT 진입 시 reset 처리를 제품 화면 mount 전에 완료해 이전 Viewer 노출과 이전 실행 복원을 방지했다. RESET, 속도, Presenter, 10개 Task와 기존 제품 실행 시간은 유지했다.

## 변경 산출물

- site/lib/scenario.ts
- site/scripts/demo-cli.mjs
- site/scripts/demo-launcher.mjs
- site/scripts/validate-simulator.mjs
- site/package.json
- site/app/page.tsx
- site/app/harness/[step]/page.tsx
- site/components/HarnessStageViewer.tsx
- site/components/MermaidChart.tsx
- site/components/FinalRunExperience.tsx
- site/app/globals.css

## 검증

npm run lint, npm run validate:scenario, npm run build 및 git diff --check 통과. 원문·추출본·앱 Mermaid와 프롬프트 정확 일치 및 단계당 60초를 검증했다. CLI 제어 시험은 빈 입력·단계별 대기·6번째 입력·URL/속도 전달을 확인했다. 실제 PTY에서 분할된 bracketed paste, UTF-8 한글, 여러 줄, Enter 제출을 확인했고 비TTY 6줄 입력과 조기 EOF도 확인했다. 브라우저에서 5개 SVG 렌더(노드 11/17/19/25/28), STEP 5 게이트 6개, 확대 시 스크롤 범위 증가와 화면 맞춤을 확인했다. 브라우저 오류 로그는 없었다.

## 남은 확인과 다음 행동

구현 검증에서 발견한 미해결 오류는 없다. 등록된 후속 검증 Task에서 RESET·Presenter·fallback·QR을 실제 화면으로 확인하고 README와 발표 검증 기록을 갱신한다. 실시간 20분 완주 및 원격 게시는 이번 작업에서 수행하지 않는다.
