# 문제 해결

- 기존 `demo_start`는 현재 파일에서 `bash -n`을 통과했지만 사용자 실행에서 45행의 인용부호 EOF 오류가 발생했다. Shell 로직 전체를 Node Launcher로 이동해 wrapper 자체를 5행으로 줄였고 실제 실행을 완료했다.
- Sandbox 안에서는 로컬 Dev Server 접근이 지연되어 TTY 검증을 로컬 접근 권한으로 다시 실행했다. 실제 `./demo_start` 실행, 입력, 5단계와 Viewer URL 도달은 정상이다.
- 최초 Raw Mode 구현은 상태줄 출력 뒤 Cursor를 한 줄만 올려 입력이 `gpt-5.6-sol...` 줄에 표시됐다. `1.png`로 원인을 확인하고 두 줄 위로 이동하도록 수정한 뒤 `커서 테스트` 입력으로 재검증했다.
