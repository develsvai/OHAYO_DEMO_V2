# 문제 해결

## Web 테스트 모드가 1×로 돌아가던 문제

Viewer의 `openLoom`이 주소를 `/?screen=run`으로 교체하며 Launcher가 넣은 `speed=7`을 삭제하고 있었다. Continue와 RESET에서 현재 Query 속도를 보존하고 `FinalRunExperience`에 `initialSpeed`를 전달하도록 수정했다.

## 기존 전체 초기화가 Viewer만 표시하던 문제

기존 `resetAll`은 Local Storage를 지우고 Harness Viewer로 이동했으며 Product Run 내부 state 재생성을 보장하지 않았다. 저장 키 두 개를 지운 뒤 Product 화면을 새 key로 재마운트해 모든 실행 state를 초기값으로 되돌리도록 수정했다.

## 자동 브라우저 연결 없음

로컬 상호작용 검사를 위한 브라우저 연결이 없어 클릭 자동화는 사용할 수 없었다. 대체로 로컬 URL 200, RESET 요소 렌더, 정적 상태 전이 Assertion, lint와 production build를 확인했고 최신 서버를 직접 재기동해 초기화 URL을 열었다.

## DONE Guardrail

아래 필수 작업 기록이 부족해 `DONE` 대신 `REVIEW_REQUIRED`로 전환했습니다.

- validation evidence

Next action: 완료 계약을 증명하는 기록이 부족하거나 미해결 요청이 있어 검토가 필요합니다. result/decision/troubleshooting/log/event/artifact와 검증 근거를 보강하거나 요청을 해결한 뒤 다시 완료 처리하세요.
