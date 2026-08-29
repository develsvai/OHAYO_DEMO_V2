# 결정

## 원격 이름은 origin

사용자가 지정한 GitHub URL을 표준 원격 이름 `origin`으로 등록했다. 기존 원격은 없었다.

## develop 브랜치만 게시

현재 작업 브랜치이자 Loom 필수 브랜치인 `develop`을 `origin/develop`에 게시했다. 범위 밖인 `main` 생성이나 병합은 수행하지 않았다.

## 다른 노트북은 npm ci를 최초 1회 실행

`site/package-lock.json`이 추적되므로 재현 가능한 설치를 위해 `npm install`보다 `npm ci`를 권장한다. `node_modules`는 Git에 포함되지 않으며 Launcher도 해당 폴더가 없으면 설치 안내와 함께 중단한다.

## 지원 환경

`site/package.json`의 engine을 기준으로 Node.js `>=22.13.0`을 요구한다. macOS가 가장 직접적으로 지원되며 Linux는 `xdg-open`이 있는 Desktop 환경이 필요하다. Windows는 Bash 실행 환경이 별도로 필요하다.
