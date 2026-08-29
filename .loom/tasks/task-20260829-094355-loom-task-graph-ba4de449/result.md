# 결과

발표 시작 경계를 실제 Shell과 Web으로 분리하고, OHAYO Task 구성·실행을 Node Graph로 개편했다.

- 프로젝트 루트의 `./demo_start`가 Web Server를 확인한 뒤 실제 Shell에 Codex 형태의 가짜 CLI를 연다.
- 발표자가 어떤 문장을 입력해도 `site/lib/scenario.ts`의 STEP 1~5가 각 60초씩 Shell에서 자동 실행된다.
- Shell 연출 완료 후 `?screen=viewer&reset=1` Web URL을 자동으로 열어 최종 Mermaid Harness Viewer를 표시한다.
- Web에서는 Harness Build CLI를 제거했다. Viewer의 `Loom 구성 계속` 이후 모든 흐름은 Web에서 진행된다.
- OHAYO Prompt 입력 후 10개 Task Node가 20초마다 하나씩, 총 200초 동안 구성된다.
- Task 구성과 실행 화면은 `harness_viewer_demo.gif`의 어두운 캔버스, 색상별 Node, 연결선, 활성 경로, Minimap 시각 문법을 반영했다.
- Task Graph 구성 완료 후 동일 Graph에서 10개 Task가 각 120초씩 순차 실행된다.
- Validation Fail, Repair, Retry 상태가 활성 Node와 연결선에 반영된다.
- 최종 URL과 QR은 `https://ohayo.tail2dac17.ts.net/` 하나를 공통 사용한다.
- 주요 UI 문구와 Presenter Control을 한국어 중심으로 정리했다.

검증 결과:

- `DEMO_SPEED=600 DEMO_NO_OPEN=1 ./demo_start`: 단일 입력, STEP 1~5 자동 완주, Viewer URL 출력 성공
- `bash -n demo_start`: 성공
- `node --check site/scripts/demo-cli.mjs`: 성공
- `npm run lint`: 성공
- `npm run validate:scenario`: 성공
- `npm run build`: 성공
- `git diff --check`: 성공
- Viewer, Run, Presenter Route: HTTP 200
- 비공개 Web 배포: `https://flogi-ohayo-demo-v2.developsvai5096.chatgpt.site`

다음 행동:

- 발표 전 `DEMO_SPEED=60 ./demo_start`로 빠른 전체 리허설을 한 번 실행한다.
- 실제 발표는 `./demo_start`로 실행한다.
