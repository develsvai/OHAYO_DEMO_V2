# OHAYO 발표 데모 사용법

## 시작

프로젝트 폴더에서 아래 명령 하나만 실행합니다.

```bash
./demo-start
```

Web 서버도 자동으로 실행되므로 따로 띄울 필요가 없습니다. 이미 3000번 서버가 실행 중이면 해당 서버를 그대로 사용합니다.

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
