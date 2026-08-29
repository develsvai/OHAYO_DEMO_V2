# 문제 해결

## 선행 Build 흐름 불일치

- 증상: 첫 실행 시 STEP별 입력·Viewer 왕복 구조가 남아 있었다.
- 조치: 별도 선행 Task에서 단일 최초 입력과 5개 STEP 자동 실행, 최종 Viewer 1회 구조로 교정한 뒤 이 Task를 재개했다.

## Presenter 명령 중복 가능성

- 증상: BroadcastChannel과 storage event를 동시에 수신하면 Next Task 같은 명령이 두 번 실행될 수 있었다.
- 조치: BroadcastChannel 사용 가능 시 storage event 수신을 fallback으로만 남겼다.
- 결과: 한 Presenter 조작이 Audience 상태에 한 번만 적용된다.
