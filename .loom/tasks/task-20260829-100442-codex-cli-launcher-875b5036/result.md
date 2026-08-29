# 결과

- `demo_start`를 45행 Shell 구현에서 5행짜리 최소 wrapper로 교체하고, 서버 준비·CLI 실행·브라우저 전환은 `site/scripts/demo-launcher.mjs`로 분리했다.
- 바탕화면의 Codex 스크린샷을 기준으로 Update 안내, OpenAI Codex 정보 패널, 모델·디렉터리, Tip, 전체 폭 입력 바와 상태줄을 실제 Shell TTY에 재현했다.
- 입력 커서를 상태줄이 아니라 `› Ask Codex to do anything`의 `A` 위치에 고정했으며 한국어 입력이 입력 바 안에 표시된 뒤 STEP 1~5가 완주되는 것을 확인했다.
- CLI, Harness Viewer, Loom 제품 입력 화면, Metadata와 README에서 내부 연출 방식을 드러내는 문구를 제거했다.
- 수정본을 기존 owner-only Sites에 배포했다: `https://flogi-ohayo-demo-v2.developsvai5096.chatgpt.site`

## 검증

- `bash -n demo_start`
- `node --check site/scripts/demo-launcher.mjs`
- `node --check site/scripts/demo-cli.mjs`
- `DEMO_SPEED=600 DEMO_NO_OPEN=1 ./demo_start` 실제 TTY 입력 및 5단계 완주
- Viewer, Run, Presenter HTTP 200
- `npm run lint`
- `npm run validate:scenario`
- `npm run build`
- 발표 노출 문구 검색 0건

## 남은 위험과 다음 행동

- ANSI 색상과 글꼴 굵기는 Terminal theme에 따라 약간 다를 수 있으나 커서 좌표와 입력 위치는 현재 발표 Terminal에서 검증했다.
- 발표 시작은 프로젝트 루트에서 `./demo_start`를 실행한다.
