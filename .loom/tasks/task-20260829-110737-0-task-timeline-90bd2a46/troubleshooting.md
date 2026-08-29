# 문제 해결

## RESET 후 10개 Task가 이미 완성되어 보임

RESET 로직이 아니라 `plannedCount`가 항상 `finalRun.tasks.length`로 고정된 것이 원인이었다. `plannedCount`를 `planningElapsed / nodeRevealDuration`의 내림값으로 계산해 0부터 10까지 증가하도록 수정했다.

## 이전 “20초 문구 제거” 지시 해석 정정

이전 구현은 문구 제거를 순차 생성 제거로 잘못 해석했다. 순차 생성 동작은 복원하고 관객에게 내부 간격을 설명하는 문구만 노출하지 않도록 분리했다.
