# 결정

- 최초 설치는 재현 가능한 lockfile 기반 설치를 위해 `npm install` 대신 `npm ci`를 기준 명령으로 사용했다.
- 원격 기본 브랜치 추정에 의존하지 않도록 clone 명령에 `-b develop`을 명시했다.
- 최초 실행과 설치 후 재실행을 분리해, 매번 Web 서버를 수동 실행해야 한다는 오해를 없앴다.
- 런처의 실제 동작을 따라 macOS는 자동 브라우저 실행, Linux는 `xdg-open` 또는 수동 URL 접근, Windows는 WSL/Git Bash가 필요하다고 기록했다.
