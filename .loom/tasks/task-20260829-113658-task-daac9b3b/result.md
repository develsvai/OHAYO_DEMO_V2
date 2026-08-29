# 작업 결과

루트 `README.md`에 다른 노트북용 최초 실행 안내를 추가했다.

- Git, Node.js `22.13.0` 이상, npm 요구사항과 버전 확인 명령을 명시했다.
- `develop` 브랜치 clone부터 `site`의 `npm ci`, 루트 `./demo-start`까지 복사 실행 가능한 명령을 제공했다.
- 기존 저장소 갱신 절차와 이후 재실행 시 `./demo-start`만 필요하다는 점을 구분했다.
- macOS, Linux, Windows 실행 환경과 3000번 포트, 인터넷 필요 시점을 정리했다.
- 별도 Web 서버, Codex, Loom, API Key, 데이터베이스, Python이 필요하지 않음을 명시했다.

`git diff --check`와 `loom validate --strict`가 모두 성공했다.

남은 작업은 없으며 사용자는 새 노트북에서 README의 명령을 위에서부터 실행하면 된다.
