# OHAYO Autonomous Product Engineering Harness

Auto Plan Loom 구성부터 OHAYO Task Graph 실행과 배포 결과까지 연결하는 발표 실행 도구입니다.

## 발표 시작

프로젝트 루트에서 실행합니다.

```bash
./demo_start
```

`./demo-start`로 실행해도 동일합니다. 시작할 때 실행 모드를 선택합니다.

- `1  5분 테스트 모드`: 자동 진행 구간을 약 4분 4초로 압축합니다. 입력 대기와 다이어그램 설명 시간은 별도입니다.
- `2  데모 모드`: STEP 1~5 각 60초, Task 10개 각 120초의 발표 기준 시간을 그대로 사용합니다.

모드를 고르면 Shell에 Codex 형태의 CLI가 열립니다. STEP마다 프롬프트를 받고 해당 단계만 실행한 뒤 그 단계의 다이어그램을 엽니다. 설명 후 터미널로 돌아와 다음 프롬프트를 입력합니다.

## 발표 흐름

1. Shell에서 `./demo_start` 또는 `./demo-start` 실행 후 모드 선택
2. STEP 1 프롬프트 입력 → 골격 구성 → `/harness/1`에서 다이어그램 설명
3. 터미널로 복귀해 STEP 2~5를 각각 입력 → 해당 단계 실행 → `/harness/2`~`/harness/5`에서 다이어그램 설명
4. STEP 5 설명 후 터미널의 STEP 6 입력에 `/harness` 제출 → 즉시 빈 Loom 제품 Prompt 표시
5. Loom에서 OHAYO 제품 목표 입력
6. 0 / 10부터 10개 Task Node가 순차 선별·생성되고 의존 관계가 연결되는 과정을 확인
7. 완성된 Node Graph에서 실행 중 Spinner와 함께 10개 Task를 각 120초씩 순차 실행
8. 검증·복구·재시도 후 OHAYO URL과 QR 표시

STEP 1~5는 골격 → 오토 플랜 → 제작 루프 → 배포 루프 → 정책 게이트·훅·스크립트 순서입니다. 각 화면은 해당 단계까지의 **전체 원문 그림**입니다. STEP 5 뒤의 별도 최종 다이어그램과 `Loom 구성 계속` 화면은 없습니다.

단계당 데모 모드 60초, 테스트 모드 약 8.6초이며 다음 입력 전에는 진행하지 않습니다. CLI는 여러 줄 붙여넣기와 한글을 받고 Enter로 제출합니다. 빈 입력은 대기 상태를 유지합니다. STEP 6은 `/harness` 외의 문장도 받습니다.

다이어그램은 `+` / `−`로 확대·축소하고 스크롤할 수 있습니다. 가운데 퍼센트 버튼이나 `R`을 누르면 화면에 맞춥니다. 브라우저 자동 열기가 실패하면 터미널에 표시된 URL을 사용합니다. `/harness/1?speed=7`처럼 단계 화면에 실행 속도가 전달되며, STEP 6은 `/?screen=run&reset=1&speed=7`로 새 실행을 시작합니다. 데모 모드의 속도는 `1`입니다.

원문 프롬프트와 추출된 다이어그램은 [source.md](../docs/harness-demo/source.md), [diagrams.md](../docs/harness-demo/diagrams.md), `step-1.mmd`~`step-5.mmd`에 보존되어 있습니다. 첨부된 시연 명령을 실제 하네스나 서비스 구축 명령으로 실행하지 않습니다.

## 발표 데이터 수정

Prompt, CLI 로그, Mermaid flowchart, Task, 시간, 결과 URL은 [`lib/scenario.ts`](./lib/scenario.ts)에 모여 있습니다.

- `buildStages[]`: Shell CLI의 5개 구성 단계
- `buildStages[].canonicalPrompt`: 시연 원문 STEP 1~5의 Prompt
- `buildStages[].duration`: 각 60초
- `buildStages[].logs`: Shell에 순차 출력할 로그
- `buildStages[].mermaid`: 각 단계 Viewer에 표시할 원문 Mermaid 전체 스냅샷
- `finalRun.taskGraphDuration`: Task 10개 선별·생성 시간 200초
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

Presenter 제어는 STEP 6 이후 제품 실행에 적용됩니다. STEP 1~5의 진행은 터미널 입력으로 제어합니다.

모든 Web 화면의 오른쪽 아래에는 작은 `RESET` 버튼이 있습니다. 누르면 Prompt, Task 구성, 실행 Timer, 완료 상태, 일시정지와 화면 모드를 모두 지우고 제품 Prompt부터 다시 시작합니다. 선택한 테스트/데모 속도는 유지됩니다.

## 검증

```bash
npm run lint
npm run validate:scenario
npm run build
```

`validate:scenario`는 원문·추출본·앱 다이어그램의 정확 일치, CLI 입력 대기와 6번째 입력 전환, 기존 10개 Task·시간·Presenter·fallback 계약을 검사합니다. 실제 터미널과 브라우저의 검증 결과 및 실행 환경은 [validation.md](../docs/harness-demo/validation.md)에 기록합니다.
