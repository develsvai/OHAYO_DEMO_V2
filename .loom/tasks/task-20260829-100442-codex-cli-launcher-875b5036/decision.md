# 결정

1. Shell 인용부호 오류의 재발 면적을 줄이기 위해 `demo_start`에는 작업 디렉터리 이동과 Node Launcher 실행만 남겼다.
2. 시작 화면은 일반적인 Codex 유사 UI가 아니라 사용자가 지정한 `스크린샷 2026-08-29 오후 7.01.55`와 `1.png`를 직접 기준으로 구현했다.
3. TTY 입력은 `readline.question` 대신 Raw Mode 입력 바를 사용해 placeholder, 배경색, Cursor 위치와 한국어 입력을 제어한다.
4. 상태줄 출력 뒤 Cursor는 두 줄 위로 이동해야 입력 바에 도달하므로 `ESC[2A`, 줄 시작 이동, `ESC[2C` 순서로 `A` 위치를 선택했다.
5. CLI와 Web의 관객 노출면에는 내부 Scenario·Prompt 처리 방식에 대한 설명을 표시하지 않는다.
6. `.openai/hosting.json`이 있는 기존 Sites 프로젝트이므로 Sites Building과 Hosting 절차에 따라 검증된 Build를 owner-only 배포했다.
