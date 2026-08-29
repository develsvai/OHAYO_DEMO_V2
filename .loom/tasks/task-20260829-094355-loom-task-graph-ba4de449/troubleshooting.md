# 문제 해결 기록

## Sandbox에서 `./demo_start` 첫 검증이 대기함

Sandbox 내부 `curl`이 이미 실행 중인 로컬 Dev Server에 접근하지 못해 Launcher가 Server 준비 Polling에서 대기했다. Session을 중단하고 동일 명령을 로컬 접근 권한으로 다시 실행해 실제 Shell 입력과 5단계 완주를 검증했다.

## 검증 명령의 작업 폴더 오류

프로젝트 루트에는 `package.json`이 없는데 루트에서 `npm run lint`를 실행해 `ENOENT`가 발생했다. `site/`를 작업 폴더로 지정해 lint, Scenario contract, build를 각각 다시 실행했고 모두 통과했다.

## Query URL의 Shell Glob 처리

`?screen=viewer` URL을 인용하지 않은 첫 `curl` 명령이 zsh glob으로 해석되어 실패했다. URL 전체를 작은따옴표로 감싼 뒤 Viewer와 Presenter의 HTTP 200을 확인했다.

## 시각 QA 범위

Reference GIF의 시작 Frame과 4초 간격 Contact Sheet를 직접 확인해 Node 색상, Edge 활성화, Minimap, 어두운 Canvas 구성을 구현에 반영했다. 자동 Browser Screenshot 환경은 사용하지 못했으므로 발표 기기에서 `DEMO_SPEED=60 ./demo_start`로 마지막 시각 리허설을 수행한다.
