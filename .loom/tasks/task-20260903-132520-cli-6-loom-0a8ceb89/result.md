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
