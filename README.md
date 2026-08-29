# OHAYO 발표 데모 사용법

## 다른 노트북에서 최초 실행

### 1. 사전 준비

다음 프로그램이 필요합니다.

- Git
- Node.js `22.13.0` 이상
- npm (Node.js 설치 시 함께 설치됨)

설치 여부와 버전을 확인합니다.

```bash
git --version
node --version
npm --version
```

`node --version`이 `v22.13.0`보다 낮거나 명령을 찾지 못하면 Node.js 22 이상을 먼저 설치합니다.

### 2. 저장소 복제 및 의존성 설치

아래 명령을 순서대로 실행합니다. `npm ci`는 다른 노트북에서 최초 한 번 반드시 실행해야 합니다.

```bash
git clone -b develop https://github.com/develsvai/OHAYO_DEMO_V2.git
cd OHAYO_DEMO_V2/site
npm ci
cd ..
./demo-start
```

마지막 `./demo-start`가 실행 모드 선택 화면, Codex 형태의 CLI, Web 서버와 브라우저 실행까지 모두 처리합니다. `npm run dev`를 별도로 실행할 필요는 없습니다.

### 3. 기존에 복제한 저장소를 최신 상태로 실행

```bash
cd OHAYO_DEMO_V2
git pull origin develop
cd site
npm ci
cd ..
./demo-start
```

의존성이 바뀌지 않았다면 다음 실행부터는 프로젝트 루트에서 `./demo-start`만 실행해도 됩니다.

### 실행 환경 주의사항

- 최초 `git clone`, `git pull`, `npm ci`에는 인터넷 연결이 필요합니다.
- 실행 전에 `3000`번 포트를 다른 프로그램이 사용하지 않는지 확인합니다.
- macOS에서는 그대로 실행할 수 있습니다.
- Linux에서는 브라우저 자동 실행을 위해 `xdg-open`이 필요합니다. 브라우저가 열리지 않으면 `http://localhost:3000/`을 직접 엽니다.
- Windows에서는 Bash 스크립트를 실행할 수 있는 WSL 또는 Git Bash 환경이 필요합니다.
- Codex, Loom, API Key, 데이터베이스, Python은 데모 실행에 필요하지 않습니다.

## 설치 후 시작

프로젝트 폴더에서 아래 명령 하나만 실행합니다.

```bash
./demo-start
```

Web 서버도 자동으로 실행되므로 따로 띄울 필요가 없습니다. 데모 Web 서버가 이미 실행 중이면 해당 서버를 그대로 사용하며, 다른 프로그램이 3000번 포트를 사용 중이면 먼저 종료해야 합니다.

실행 모드를 숫자로 선택합니다.

- `1` — **5분 테스트 모드**: 전체 흐름을 5분 안에 확인하는 리허설용
- `2` — **데모 모드**: 실제 발표 시간으로 진행

## 전체 흐름

```text
./demo-start
→ 실행 모드 선택
→ Codex 형태의 CLI 실행
→ Harness STEP 1~5 자동 구성
→ Web Harness Viewer 자동 실행
→ Loom 구성 계속
→ OHAYO 구현 Prompt 입력
→ Task 0 / 10부터 순차 선별·생성
→ 10개 Task 순차 실행
→ 검증·복구·재시도
→ OHAYO URL과 QR 표시
```

CLI와 OHAYO Prompt에는 원하는 문장을 입력하면 됩니다. 입력 후에는 정해진 발표 흐름이 자동으로 진행됩니다.

## RESET 버튼

모든 Web 화면의 **오른쪽 아래 구석**에 작은 `↻ RESET` 버튼이 있습니다.

RESET을 누르면 다음 항목이 전부 초기화됩니다.

- 입력한 OHAYO Prompt
- Task 선별·생성 진행 상태
- 현재 Task와 완료된 Task
- 모든 실행 Timer
- 일시정지 상태
- Graph / CLI 화면 모드

초기화 후에는 **OHAYO 구현 Prompt 입력 화면**으로 돌아갑니다. Prompt를 다시 입력하면 Task가 완성된 상태로 나오지 않고 반드시 `0 / 10`부터 다시 선별·생성됩니다.

선택한 실행 속도는 유지됩니다.

- 테스트 모드: Task 생성 약 2.9초마다 1개
- 데모 모드: Task 생성 20초마다 1개

## 발표 전 확인

1. Terminal에서 프로젝트 폴더로 이동
2. `./demo-start` 실행
3. 리허설은 `1`, 실제 발표는 `2` 선택
4. Web 화면 오른쪽 아래 `RESET` 위치 확인
5. 마지막 QR이 `https://ohayo.tail2dac17.ts.net/`를 가리키는지 확인

고급 Presenter 제어와 Scenario 수정 방법은 [site/README.md](./site/README.md)를 참고합니다.
