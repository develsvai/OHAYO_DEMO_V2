# 결과

회색 CLI 입력 영역을 기본 3줄과 상하 여백을 갖는 가변 패널로 변경했다. 문장 앞부분을 잘라내던 표시를 제거하고 터미널 폭에 맞춰 줄바꿈한다. 높이를 넘는 입력도 전체 값을 보존하며 방향키로 확인·수정한다. Alt+Enter, Home/End, 조합 문자 삭제, resize, 분할 paste/UTF-8을 지원한다.

제품 실행은 회의 최종 합의에 따라 40개 고유 작업과 10개 기능 묶음으로 확장했다. 40개 × 30초로 총 실행 20분, 총 구성 200초를 유지한다. 노드 크기를 유지한 가로 스크롤, 현재 위치 이동, 의존성 연결, 40개 카운트·타이머·Presenter·fallback·복원 상한을 반영했다. 기존 5개 하네스 원문 및 6번째 입력 전환은 보존했다.

## 변경 산출물

- site/scripts/demo-cli.mjs, site/scripts/prompt-layout.mjs
- site/lib/scenario.ts, site/lib/task-graph.ts, site/lib/run-control.ts
- site/components/FinalRunExperience.tsx, site/app/presenter/page.tsx, site/app/globals.css
- site/scripts/validate-simulator.mjs
- README.md, site/README.md, docs/harness-demo/expanded-run.md

## 검증

- 실제 PTY: 1,000자·4개 논리 줄·한글/영문/결합 문자/이모지, paste/UTF-8 분할, CRLF, Home/End/방향키, 조합 삭제, Alt+Enter, 48→80열 resize, Enter 제출의 정확한 값 보존 통과.
- 자동 검사: 16/40/80/160칸 줄바꿈 손실 없음, 40개 고유 ID·제목·의존성·노드 비중첩, 이벤트 0~30초 범위, 총 1,200초, 실패/복구 Task 20·36, 원문 5개와 6번째 입력 회귀 통과.
- 브라우저: 0/40부터 40개 구성, 가로 5,188px 영역의 마지막 40번 노드 접근, 현재 위치 복귀, 24번 일시정지·fallback·새로고침 상태 복원, 이후 정상 타이머 60× 실행으로 40/40 결과 URL·QR까지 완료. 강제 결과나 Task 건너뛰기는 사용하지 않았다.
- RESET 뒤 빈 프롬프트·완료 0/40·7× 복원, 재제출 0/40·보이는 노드 0개 시작 통과. 브라우저 오류 로그 없음.
- npm run lint, npm run validate:scenario, npm run build, tsc --noEmit, git diff --check, loom docs index, loom validate --strict 통과.

## 남은 제한과 다음 행동

미해결 결함 없음. 실제 20분 대기는 가속 검증으로 대체했고 외부 서비스 접속·휴대폰 QR 스캔·다른 OS 터미널 실행·원격 게시를 수행하지 않았다. 기존 10개 실행과 혼동하지 않도록 저장 키를 v3로 분리했으므로 이전 실행은 새 버전에서 이어지지 않는다. 브라우저는 빈 제품 입력으로 정리했다. 실행 중인 CLI를 종료하고 ./demo-start를 다시 실행하면 새 입력 패널이 적용된다.
