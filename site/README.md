# OHAYO Autonomous Product Engineering Harness

Auto Plan Loom 구성부터 OHAYO Task Graph 실행과 배포 결과까지 연결하는 발표 실행 도구입니다.

## 발표 시작

프로젝트 루트에서 실행합니다.

```bash
./demo_start
```

`./demo-start`로 실행해도 동일합니다. 시작할 때 실행 모드를 선택합니다.

- `1  5분 테스트 모드`: 전체 자동 진행 구간을 약 3분 37초로 압축해 입력과 화면 전환을 포함한 전체 흐름을 5분 이내에 검증합니다.
- `2  데모 모드`: STEP 1~5 각 60초, Task 10개 각 120초의 발표 기준 시간을 그대로 사용합니다.

모드를 고르면 Shell에 Codex CLI가 열립니다. Harness 구성 요청을 한 번 입력하면 STEP 1~5가 자동 실행되고, 완료 후 Web Harness Viewer가 열립니다.

## 발표 흐름

1. Shell에서 `./demo_start` 또는 `./demo-start` 실행 후 모드 선택
2. Codex CLI에 Harness 구성 프롬프트 입력
3. STEP 1~5가 각 60초씩 Shell에서 순차 진행
4. Web이 자동으로 열리고 최종 Mermaid Harness Viewer 표시
5. `Loom 구성 계속`을 눌러 OHAYO 제품 Prompt 입력
6. 10개 Task Node와 의존 관계 전체를 한 화면에서 확인
7. 완성된 Node Graph에서 실행 중 Spinner와 함께 10개 Task를 각 120초씩 순차 실행
8. 검증·복구·재시도 후 OHAYO URL과 QR 표시

## 발표 데이터 수정

Prompt, CLI 로그, Mermaid flowchart, Task, 시간, 결과 URL은 [`lib/scenario.ts`](./lib/scenario.ts)에 모여 있습니다.

- `buildStages[]`: Shell CLI의 5개 구성 단계
- `buildStages[].canonicalPrompt`: writing-block 기반 Prompt
- `buildStages[].duration`: 각 60초
- `buildStages[].logs`: Shell에 순차 출력할 로그
- `buildStages[].mermaid`: 최종 Viewer용 Mermaid Data
- `finalRun.taskGraphDuration`: 전체 Task Graph 확인 시간 8초
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
