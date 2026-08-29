# 결정

## Final Run 정본

- finalRun canonical prompt, 10개 Task, Event Timeline, Task Duration, 완료 Check와 finalUrl은 site/lib/scenario.ts에서 관리한다.
- 사용자 입력 의미를 분석하거나 실제 Agent·Network·API 결과에 따라 상태를 바꾸지 않는다.

## 실행 모델

- Task는 한 번에 하나씩 실행하고 120초가 끝나면 다음 Task로 자동 전환한다.
- Task 5와 9만 의도적인 Repair/Retry Loop를 보여준다.
- query speed와 Presenter 배속은 Timer에만 영향을 주며 표시되는 목표 시간은 Task당 02:00, 전체 20:00을 유지한다.

## 발표 복구

- Audience와 Presenter는 BroadcastChannel로 통신하고, 이를 지원하지 않는 환경에서는 localStorage storage event를 사용한다.
- 두 채널이 동시에 같은 명령을 전달하지 않도록 BroadcastChannel이 존재할 때 storage event는 무시한다.
- Ctrl+Shift+P로 Presenter 창을 열고 C로 Web/CLI 화면을 전환한다.

## 결과

- QR은 qrcode.react가 finalUrl을 직접 인코딩한다.
- 실제 발표 URL 변경은 Scenario Data의 finalUrl 한 곳만 수정한다.
