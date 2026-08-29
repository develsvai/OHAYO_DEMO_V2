# 결과

`./demo_start`와 `./demo-start` 실행 시 다음 두 모드를 선택하도록 구현했다.

- `1  5분 테스트 모드`: CLI와 Web 전체를 `7×`로 실행한다. 자동 진행 구간은 `1,518초 ÷ 7 = 약 217초(3분 37초)`이며 수동 입력과 화면 전환에 약 83초의 여유를 둔다.
- `2  데모 모드`: 기존 발표 타이밍인 `1×`를 유지한다.

선택 속도는 Shell CLI의 STEP 1~5와 Web의 Task Graph, 10개 Task 실행, 완료 화면에 동일하게 전달된다. 실제 TTY에서 1번을 선택해 STEP 1~5가 약 43초에 완료되고 Viewer URL에 `speed=7`이 포함되는 것을 확인했다.

`npm run lint`, `npm run validate:scenario`, `npm run build`가 모두 통과했고 Sites 비공개 배포 버전 7이 성공했다.

- 배포 URL: https://flogi-ohayo-demo-v2.developsvai5096.chatgpt.site
- 남은 위험: 없음. 발표 전에는 `2`를 선택하고, 전체 리허설에는 `1`을 선택한다.
- 다음 작업: `./demo-start`를 실행해 1번 모드로 Web의 수동 전환까지 포함한 전체 리허설을 진행한다.
