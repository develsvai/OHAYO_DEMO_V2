# 결정

1. CLI는 브라우저 Component가 아니라 `./demo_start`가 여는 실제 Shell UI로 구현했다. Agent, Prompt 분석, Harness 생성은 수행하지 않는다.
2. Shell CLI는 Node의 TypeScript strip 기능으로 `site/lib/scenario.ts`를 직접 import한다. STEP 이름, 로그, Timing, canonical prompt의 수정 지점을 중복시키지 않는다.
3. Web의 시작 화면은 최종 Mermaid Harness Viewer로 고정했다. 이전 Web Build CLI와 중간 Ready 화면은 제거하고 Viewer Continue가 제품 Prompt로 직접 이어지게 했다.
4. `./demo_start`가 여는 URL에 `reset=1`을 포함해 이전 발표의 localStorage 상태가 다음 발표에 섞이지 않게 했다.
5. 제품 Prompt 다음에 `planning` 상태를 추가했다. `taskPlanningInterval: 20_000`을 기준으로 Task Node 10개가 총 200초 동안 하나씩 나타난다.
6. Task 구성과 실행은 별도 목록 UI가 아니라 동일한 의존성 Graph를 공유한다. 구성 중에는 새 Node와 Edge가 나타나고, 실행 중에는 현재 Node와 경로가 밝아진다.
7. Task 실행 시간은 기존 회의 기준인 Task당 120초를 유지했다. 사용자의 20초 지시는 Task 구성 시간에만 적용했다.
8. `harness_viewer_demo.gif`는 직접 삽입하지 않고 시각 Reference로 사용했다. 실제 화면은 CSS Node와 SVG Edge로 재현해 상태 변화가 가능하도록 했다.
