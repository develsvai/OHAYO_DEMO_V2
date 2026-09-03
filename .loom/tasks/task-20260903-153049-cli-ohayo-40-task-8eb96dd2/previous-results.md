# Previous Results

5 older recorded result(s) were omitted. Promote durable context to Job Notes or explicit Context References.

## 6. 단계별 CLI 입력·다이어그램 뷰어와 6단계 Loom 직접 진입 구현

# 구현 결과

사용자의 “오케 바로 시작해” 승인에 따라 단계별 CLI와 다이어그램 흐름을 구현했다. 입력 한 번당 한 단계만 실행하며 STEP 1~5 완료 시 각각 /harness/1~5를 연다. STEP 5 설명 후에도 6번째 입력을 기다리고 /harness 등 비어 있지 않은 입력을 받으면 즉시 비어 있는 Loom 제품 프롬프트를 연다. 별도의 최종 통합 Viewer와 Continue 화면은 제거했다.

원문 프롬프트 5개와 Mermaid 5개를 그대로 scenario에 반영했다. 단계별 화면은 원문 전체 그림을 표시하고 확대·축소·스크롤·화면 맞춤을 지원한다. ROOT 진입 시 reset 처리를 제품 화면 mount 전에 완료해 이전 Viewer 노출과 이전 실행 복원을 방지했다. RESET, 속도, Presenter, 10개 Task와 기존 제품 실행 시간은 유지했다.

## 변경 산출물

- site/lib/scenario.ts
- site/scripts/demo-cli.mjs
- site/scripts/demo-launcher.mjs
- site/scripts/validate-simulator.mjs
- site/package.json
- site/app/page.tsx
- site/app/harness/[step]/page.tsx
- site/components/HarnessStageViewer.tsx
- site/components/MermaidChart.tsx
- site/components/FinalRunExperience.tsx
- site/app/globals.css

## 검증

npm run lint, npm run validate:scenario, npm run build 및 git diff --check 통과. 원문·추출본·앱 Mermaid와 프롬프트 정확 일치 및 단계당 60초를 검증했다. CLI 제어 시험은 빈 입력·단계별 대기·6번째 입력·URL/속도 전달을 확인했다. 실제 PTY에서 분할된 bracketed paste, UTF-8 한글, 여러 줄, Enter 제출을 확인했고 비TTY 6줄 입력과 조기 EOF도 확인했다. 브라우저에서 5개 SVG 렌더(노드 11/17/19/25/28), STEP 5 게이트 6개, 확대 시 스크롤 범위 증가와 화면 맞춤을 확인했다. 브라우저 오류 로그는 없었다.

## 남은 확인과 다음 행동

구현 검증에서 발견한 미해결 오류는 없다. 등록된 후속 검증 Task에서 RESET·Presenter·fallback·QR을 실제 화면으로 확인하고 README와 발표 검증 기록을 갱신한다. 실시간 20분 완주 및 원격 게시는 이번 작업에서 수행하지 않는다.

## 7. 5개 다이어그램과 6단계 전환 회귀 검증 및 발표 안내 갱신

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
