# 검증 및 발표 안내 완료

README.md와 site/README.md를 CLI 6회 입력·단계별 다이어그램 5회 표시·STEP 6 즉시 Loom 프롬프트 흐름으로 갱신했다. 원문 프롬프트·다이어그램 링크, 그림 확대·스크롤·화면 맞춤, 입력과 설명 시간이 별도라는 안내를 포함했다. docs/harness-demo/validation.md에 실제 수행한 검사와 제한을 기록했다.

## 검증 결과

- 원문·추출본·앱 Mermaid와 프롬프트 정확 일치. SVG 5개 노드 11/17/19/25/28, 색상·도형·레이블·루프 유지, STEP 5의 판단/정책 gate 6개 렌더.
- 실제 테스트 모드 런처와 PTY에서 단계마다 입력하고 5개의 60초/7 타이머를 각각 약 8.58초에 완료했다. 각 단계 Viewer URL과 speed=7을 확인하고 6번째 입력에 바로 root 제품 프롬프트 reset URL을 출력했다.
- 실제 PTY의 한글·여러 줄·UTF-8/마커 분할과 Enter 제출, 비TTY 6줄 및 조기 EOF 시험 통과.
- 브라우저에서 이전 실행이 있어도 STEP 6 URL로 빈 제품 프롬프트 진입, 제품 00/10 시작과 10개 Task 실행, 1×/7× 전달, Presenter 일시정지·현재 완료·결과 표시·전체 초기화, 전역 RESET, C fallback, 새로고침 상태 복원 통과.
- 결과 10/10 TASKS와 QR SVG, https://ohayo.tail2dac17.ts.net/ 링크를 확인했다. QR과 링크는 기존 동일 데이터 사용.
- 구현 commit 13b9ef4에서 npm run lint, npm run validate:scenario, npm run build 통과. 후속 작업은 문서만 갱신하여 빌드를 반복하지 않았다. git diff --check, loom docs index, loom validate --strict 통과.

## 산출물

- README.md
- site/README.md
- docs/harness-demo/validation.md

## 제한 및 다음 행동

미해결 결함 없음. OS 브라우저 자동 실행은 리허설에서 끄고 URL callback과 실제 브라우저 화면을 별도로 검증했다. 실시간 20분 완주·다른 OS/Node 버전·휴대폰 QR 스캔·외부 OHAYO 접속·원격 게시를 수행하지 않았다. 기존 개발 서버는 유지했고 브라우저는 빈 제품 프롬프트로 정리했다. 발표자는 ./demo-start로 모드를 선택하고 STEP 1~5 그림 설명 후 터미널로 돌아와 다음 입력, STEP 6 /harness 후 제품 목표 입력을 진행한다.
