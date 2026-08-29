# 결정

## Scenario 단일 정본

- Prompt, Log Timeline, Duration, Viewer 제목과 Mermaid 원문은 site/lib/scenario.ts에서만 관리한다.
- 사용자가 입력한 문자열은 표시와 기록에만 사용하고 Stage 선택이나 실행 결과에는 사용하지 않는다.

## Viewer 구현

- Viewer는 커스텀 그래프 흉내가 아니라 mermaid 패키지로 flowchart 원문을 렌더링한다.
- Node/Edge 실시간 생성, Agent 결과 parsing, Harness state 동기화는 구현하지 않는다.
- STEP 2와 STEP 3는 독립 시스템처럼 보이지 않도록 Global Harness에서 진입하는 Subgraph로 표시한다.

## 발표 안전성

- 기본 Duration은 Stage당 60초다.
- 개발 및 리허설 검증을 위한 query parameter ?speed=N만 두며 기본 발표 동작에는 영향을 주지 않는다.
- 상태는 localStorage에 저장하되 실행 중 Timer 자체는 외부 서비스나 네트워크에 의존하지 않는다.

## 콘텐츠 해석

- STEP 3는 최종 작업 지침에 따라 Frontend, Backend, Design, Infrastructure만 포함한다.
- STEP 1~5 UI와 Source 콘텐츠에는 제품명을 노출하지 않는다.
