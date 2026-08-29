# Previous Results

## 1. Scenario 기반 Harness Building 경험 구현

# 결과

## 완료 내용

- 공식 Sites 기반 웹앱을 site/에 초기화했다.
- writing-block.md의 STEP 1~5 canonical prompt와 단계별 작업 로그, Mermaid flowchart를 site/lib/scenario.ts 하나에 모았다.
- 자유 입력은 화면에 보존하되 실행은 현재 Stage의 고정 Scenario가 통제하는 Codex 스타일 Build CLI를 구현했다.
- 각 Stage 기본 실행 시간을 60초로 두고, 시간에 따라 Thinking·Streaming Log·Complete·Viewer URL이 순차 표시되도록 했다.
- 완료 후 Viewer로 자동 전환하고 Mermaid 라이브러리가 정적 flowchart snapshot을 렌더링하도록 구현했다.
- STEP 2와 STEP 3 Viewer에는 Global Harness와 현재 확대 Subgraph의 계층 관계를 표시했다.
- STEP 3에서 Test Orchestrator를 제외하고 Validation을 이후 계층에 배치했다.
- STEP 1~5 종료 후 HARNESS READY / 5 / 5 COMPLETE 상태를 구현했다.
- Viewer 확대·축소, R Replay, ESC/→ 다음 CLI, 상태 로컬 보존을 구현했다.

## 검증

- npm run build: 성공
- rg -n "OHAYO" site/app site/components site/lib: 결과 없음
- 로컬 서버 http://localhost:3000/: HTTP 200 확인

## 남은 위험

- 현재 환경에서 앱 내 브라우저 연결을 사용할 수 없어 실제 화면 시각 QA는 수행하지 못했다.
- Mermaid 그래프는 프로덕션 빌드를 통과했지만 모든 Stage의 브라우저 렌더 결과는 후속 종합 검증 Task에서 확인해야 한다.

## 다음 행동

- 다음 Task에서 Harness Ready 이후의 10개 Task Run Mode, CLI fallback, Presenter Control, 최종 URL 및 QR 결과를 구현한다.
