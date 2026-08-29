# OHAYO 발표용 Simulator

실제 Agent나 Harness를 실행하지 않고, `scenario.ts`가 통제하는 발표 흐름을 재현하는 웹앱입니다.

## 정확한 발표 흐름

1. 사용자가 최초 프롬프트를 한 번 입력합니다.
2. 숨겨진 STEP 1~5 프롬프트가 각 60초씩 자동 실행됩니다.
3. STEP 5 종료 후 최종 Mermaid Harness Viewer가 한 번 열립니다.
4. 완성된 Auto Plan Loom에 제품 프롬프트를 한 번 입력합니다.
5. 10개 Product Task가 각 120초씩 순차 실행됩니다.
6. 검증·복구·재시도 연출 뒤 최종 URL과 QR Code가 표시됩니다.

입력한 문장은 화면에만 보존됩니다. 실행 순서와 결과는 언제나 고정 Scenario Data를 따릅니다.

## 프롬프트와 발표 데이터 수정

모든 canonical prompt, 로그, Mermaid flowchart, 시간, 10개 Task, 최종 URL은 [`lib/scenario.ts`](./lib/scenario.ts)에 모여 있습니다.

- `buildStages[].canonicalPrompt`: writing-block 기반 STEP 1~5 프롬프트
- `buildStages[].duration`: 단계별 시간
- `buildStages[].mermaid`: 단계별 그래프 데이터. 발표 화면에는 STEP 5의 최종 그래프만 렌더링됩니다.
- `finalRun.canonicalPrompt`: 두 번째 입력의 내부 고정 프롬프트
- `finalRun.tasks`: 정확히 10개인 실행 Task
- `finalRun.finalUrl`: 결과 화면 URL과 QR Code의 공통 값

STEP 3은 최종 회의 결정에 따라 Test Orchestrator를 포함하지 않습니다. STEP 1~5에는 OHAYO 문구를 추가하지 않습니다.

## 실행과 검증

```bash
npm run dev
npm run lint
npm run validate:scenario
npm run build
```

빠른 리허설은 `/?speed=60`으로 열면 됩니다. 실제 발표 시간은 쿼리 없이 실행합니다.

## Presenter Control

`/presenter` 또는 관객 화면에서 `Ctrl + Shift + P`로 엽니다.

- Pause / Resume
- Next Event / Complete Task / Skip Task
- 1× / 10× / 30× / 60×
- Reset Run / Reset All / Show Result

관객 화면의 `C`는 Product Run 중 Web UI와 CLI fallback을 전환합니다. 실행 상태는 브라우저 localStorage에 저장되어 새로고침 후 복원됩니다.
