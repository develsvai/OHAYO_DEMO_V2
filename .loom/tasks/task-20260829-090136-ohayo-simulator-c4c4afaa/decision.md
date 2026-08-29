# 결정

1. 회의본의 최종 합의인 `최초 입력 1회 → STEP 1~5 자동 실행 → 최종 Viewer 1회`를 State Machine의 기준으로 채택했다. `writing-block.md`에 남아 있는 단계별 Viewer 왕복 설명은 사용자와 회의의 후속 확정에 의해 대체된다.
2. STEP 1~5의 내용과 canonical prompt는 `writing-block.md`를 기준으로 유지하되, STEP 3의 Test Orchestrator는 최종 지침대로 제외했다.
3. 프롬프트, Timeline, Mermaid, 10개 Task, 결과 URL은 `site/lib/scenario.ts`를 단일 수정 지점으로 유지했다. 실제 사용자 입력은 표시만 하고 시나리오 분기에는 사용하지 않는다.
4. Viewer는 DOM으로 흉내 낸 그래프가 아니라 `mermaid` 패키지가 STEP 5의 통합 `flowchart TD`를 렌더링하도록 유지했다.
5. 발표 복구는 Product Run뿐 아니라 5분 Build Timeline에도 적용했다. Presenter 명령은 BroadcastChannel을 우선 사용하고, 지원하지 않는 환경에서 localStorage storage event를 fallback으로 사용한다.
6. 실제 5분/20분 모드는 기본 1×로 두고, `?speed=60`과 Presenter 속도 제어로 빠른 리허설을 지원한다.
7. 자동 계약 검사는 중간 Viewer 재도입, Stage/Task 개수·시간 변경, Retry 누락, Presenter 복구 누락, QR 연결 누락을 실패로 처리한다.
