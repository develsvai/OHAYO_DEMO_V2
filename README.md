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
- Linux에서는 브라우저 자동 실행을 위해 `xdg-open`이 필요합니다. 브라우저가 열리지 않으면 CLI에 출력된 해당 단계 URL을 직접 엽니다.
- Windows에서는 Bash 스크립트를 실행할 수 있는 WSL 또는 Git Bash 환경이 필요합니다.
- Codex, Loom, API Key, 데이터베이스, Python은 데모 실행에 필요하지 않습니다.

## 설치 후 시작

프로젝트 폴더에서 아래 명령 하나만 실행합니다.

```bash
./demo-start
```

Web 서버도 자동으로 실행되므로 따로 띄울 필요가 없습니다. 데모 Web 서버가 이미 실행 중이면 해당 서버를 그대로 사용하며, 다른 프로그램이 3000번 포트를 사용 중이면 먼저 종료해야 합니다.

실행 모드를 숫자로 선택합니다.

- `1` — **5분 테스트 모드**: 자동 진행 구간을 약 4분 4초로 압축하는 리허설용. 입력·그림 설명 시간은 별도입니다.
- `2` — **데모 모드**: 실제 발표 시간으로 진행

## 전체 흐름

```text
./demo-start
→ 실행 모드 선택
→ Codex 형태의 CLI 실행
→ STEP 1 입력 → 골격 구성 → STEP 1 다이어그램 설명
→ 터미널 복귀 → STEP 2 입력 → 오토 플랜 다이어그램 설명
→ 터미널 복귀 → STEP 3 입력 → 제작 루프 다이어그램 설명
→ 터미널 복귀 → STEP 4 입력 → 배포 루프 다이어그램 설명
→ 터미널 복귀 → STEP 5 입력 → 정책·훅·스크립트 다이어그램 설명
→ 터미널 복귀 → STEP 6에 /harness 입력
→ 바로 Loom의 OHAYO 제품 Prompt 입력
→ Task 0 / 10부터 순차 선별·생성
→ 10개 Task 순차 실행
→ 검증·복구·재시도
→ OHAYO URL과 QR 표시
```

STEP 1~5는 **각각 입력이 필요**합니다. 입력 한 번에 해당 단계만 진행하고, 완료되면 그 단계의 전체 다이어그램을 브라우저로 엽니다. 데모 모드는 단계당 60초, 테스트 모드는 약 8.6초입니다. 다음 단계는 터미널에서 새 프롬프트를 입력할 때 시작합니다.

발표용 원문 프롬프트는 [하네스 시연 원문](./docs/harness-demo/source.md), 단계별 그림은 [다이어그램 확인 문서](./docs/harness-demo/diagrams.md)에 있습니다. CLI는 원하는 문장도 받으며, 여러 줄을 붙여넣은 뒤 Enter로 제출할 수 있습니다. 빈 입력은 다음 단계로 넘어가지 않습니다.

다이어그램의 `+` / `−` 버튼과 키보드로 확대·축소하고, 확대된 영역은 스크롤합니다. 가운데 퍼센트 버튼 또는 `R`로 화면에 맞춥니다.

STEP 5의 그림 설명을 마친 뒤 STEP 6에 `/harness`를 입력하면 **즉시 빈 Loom 제품 프롬프트**가 열립니다. 별도의 최종 다이어그램이나 Continue 화면은 없습니다. 그곳에 제품 목표를 입력하면 기존 10개 Task 흐름이 시작됩니다.

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
4. STEP마다 그림 설명 후 터미널로 복귀해 다음 입력
5. STEP 6 입력 후 빈 Loom 제품 프롬프트가 열리는지 확인
6. Web 화면 오른쪽 아래 `RESET` 위치 확인
7. 마지막 QR이 `https://ohayo.tail2dac17.ts.net/`를 가리키는지 확인

고급 Presenter 제어와 Scenario 수정 방법은 [site/README.md](./site/README.md), 수행한 검증은 [검증 기록](./docs/harness-demo/validation.md)을 참고합니다.
