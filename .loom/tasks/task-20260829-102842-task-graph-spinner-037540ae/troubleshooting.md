# 문제 해결

- Browser Runtime에 연결된 Browser가 없어 자동 Screenshot과 DOM 기반 Scroll 측정을 실행할 수 없었다. 다른 Browser 자동화 도구로 우회하지 않고, CSS Viewport 고정 규칙과 1440×900·1920×1080 Graph Bounds 계산을 Validator에 추가해 검증했다.
- 기존 CSS에는 Viewer Graph, Task Graph, CLI Fallback과 Presenter 내부에 `overflow: auto`가 남아 있었다. 현재 발표 경로와 Legacy Panel을 포함해 모두 `hidden` 또는 자동 Fit으로 교체했다.
