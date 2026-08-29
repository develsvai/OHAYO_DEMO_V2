# OHAYO 발표용 Simulator

실제 Agent나 Harness를 실행하지 않고 고정 Scenario를 재현하는 발표용 Simulator입니다.

## 발표 시작

프로젝트 루트에서 실행합니다.

```bash
./demo_start
```

실제 Shell에 Codex 형태의 가짜 CLI가 열립니다. 아무 문장이나 한 번 입력하면 STEP 1~5가 각 60초씩 자동 실행되고, 완료 후 Web Harness Viewer가 자동으로 열립니다.

빠른 리허설:

```bash
DEMO_SPEED=60 ./demo_start
```

## 정확한 발표 흐름

1. Shell에서 `./demo_start` 실행
2. 가짜 Codex CLI에 최초 프롬프트 한 번 입력
3. 숨겨진 STEP 1~5가 각 60초씩 Shell에서 자동 진행
4. Web이 자동으로 열리고 최종 Mermaid Harness Viewer 표시
5. `Loom 구성 계속`을 눌러 OHAYO 제품 Prompt 입력
6. 20초마다 Task Node 1개 구성, 10개 총 200초
7. 완성된 Node Graph에서 10개 Task를 각 120초씩 순차 실행
8. 검증·복구·재시도 연출 후 OHAYO URL과 QR 표시

Shell CLI와 Web Flow 모두 입력 의미를 분석하지 않습니다. 실제 입력은 표시만 하며 상태와 Timing은 Scenario Data가 결정합니다.

## 발표 데이터 수정

canonical prompt, CLI 로그, Mermaid flowchart, Task, 시간, 결과 URL은 [`lib/scenario.ts`](./lib/scenario.ts)에 모여 있습니다.

- `buildStages[]`: Shell CLI의 5개 고정 단계
- `buildStages[].canonicalPrompt`: writing-block 기반 Prompt
- `buildStages[].duration`: 각 60초
- `buildStages[].logs`: Shell에 순차 출력할 로그
- `buildStages[].mermaid`: 최종 Viewer용 Mermaid Data
- `finalRun.taskPlanningInterval`: Task Node 구성 간격 20초
- `finalRun.taskDuration`: Task 실행 시간 120초
- `finalRun.tasks`: 정확히 10개인 OHAYO Task
- `finalRun.finalUrl`: 결과 URL과 QR의 공통 값

## Presenter Control

Web에서 `/presenter` 또는 `Ctrl + Shift + P`로 엽니다.

- 일시정지 / 재개
- 다음 Event / 현재 완료 / 건너뛰기
- 1× / 10× / 30× / 60×
- 실행 초기화 / 전체 초기화 / 결과 강제 표시

Product Run 중 `C`를 누르면 Node Graph와 CLI fallback이 전환됩니다.

## 검증

```bash
npm run lint
npm run validate:scenario
npm run build
```
