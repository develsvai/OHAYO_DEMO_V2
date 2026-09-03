# 확인 및 복구

브라우저에서 Mermaid img locator의 evaluate가 시간 초과하는 도구 문제가 있었지만 DOM snapshot에는 SVG와 전체 라벨이 존재했다. 읽기 전용 DOM evaluate로 렌더와 노드 수를 확인했고 앱 렌더 오류는 없었다.

비TTY 입력에서 매 단계 readline을 새로 만들면 파이프 입력이 유실될 수 있어 하나의 async iterator를 유지하도록 구현하고 6줄 파이프 및 조기 EOF를 검증했다. 여러 줄 붙여넣기는 bracketed paste 종료 전 제출하지 않고 UTF-8·마커 분할을 보존하도록 검증했다.

미해결 차단 사항 없음. 다음 행동은 등록된 회귀 검증 및 발표 안내 Task 실행이다.
