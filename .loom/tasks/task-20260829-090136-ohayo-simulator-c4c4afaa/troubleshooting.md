# 문제 해결 기록

## Mermaid의 Node 단독 파싱

`mermaid.parse()`로 Scenario의 라벨 포함 flowchart를 Node에서 직접 검증하려 했으나, 브라우저 DOM이 없는 환경에서 Mermaid의 DOMPurify adapter가 `addHook`/`sanitize`를 제공하지 않아 실패했다. 이는 브라우저에서 동적 import 후 렌더링하는 실제 앱 경로의 오류가 아니라 Node 전용 파싱 환경 문제다.

조치:

- 자동 계약 검사에서는 정확히 5개의 Mermaid 문자열이 존재하고 모두 `flowchart TD`로 시작하는지 검증한다.
- 실제 Viewer는 기존대로 브라우저에서 `mermaid.render()`를 사용한다.
- 프로덕션 빌드와 로컬 HTTP 응답을 재검증했다.

## 인앱 Browser 부재

Browser control skill을 확인했으나 실행 가능한 인앱 Browser가 없어 자동 스크린샷 기반 QA를 진행할 수 없었다.

조치:

- ESLint, Scenario contract, 프로덕션 빌드, `git diff --check`, 두 Route의 HTTP 200을 검증했다.
- 발표 기기에서 `http://localhost:3000/?speed=60`과 `/presenter`를 함께 열어 최종 시각 리허설을 수행한다.

## Loom artifacts JSON 문법 오류

작업 산출물 경로를 추가하면서 배열 항목 사이 쉼표가 한 번 누락되어 `python3 -m json.tool` 검증이 실패했다. 누락된 쉼표를 보완한 뒤 JSON과 Loom strict validation을 다시 실행했다.
