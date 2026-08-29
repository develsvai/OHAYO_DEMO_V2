# 결정

1. Task 구성 화면은 제거하지 않고 10개 Node와 Edge 전체를 즉시 보여주는 8초짜리 Graph 확인 화면으로 유지했다.
2. Task Graph는 CSS Breakpoint별 고정 Scale이 아니라 실제 Canvas 크기를 관찰해 가로·세로 중 더 작은 비율로 자동 맞춘다.
3. Graph 내부 좌표와 Edge Path는 변경하지 않고 1270×620 World 전체를 Scale해 Reference Graph의 관계를 보존했다.
4. Inspector 폭은 발표 정보가 읽히는 최소 범위를 유지하면서 Graph 영역을 확보하도록 224px, 1100px 이하에서는 205px로 정했다.
5. 현재 Task는 Node Pulse만으로 표현하지 않고 우측 상단 Spinner와 상태 Text 강조를 함께 사용한다.
6. Page Scroll을 막는 것에 그치지 않고 내부 `overflow: auto`도 제거하고 높이 800px 이하에서 Card·Header·Footer 간격을 축소했다.
