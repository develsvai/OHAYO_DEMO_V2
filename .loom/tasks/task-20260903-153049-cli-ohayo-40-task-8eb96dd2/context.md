# Context

## Loom 코드 계약

아래 항목은 Loom 코드에 고정된 runtime 동작 계약입니다. 관련 흐름을 바꾸기 전 `loom contract show <id>`로 확인합니다.

- `task-execution`: Task 실행 전 prompt/context/previous-results에 들어가는 입력 경계입니다. 명령: `loom contract show task-execution`. Source: `loom/application/context_pack.py`, `loom/application/team_policy.py`
- `done-guardrail`: Task를 DONE으로 인정하기 전에 필요한 산출물과 상태 전이를 검증하는 계약입니다. 명령: `loom contract show done-guardrail`. Source: `loom/application/services.py`

## Project Memory

# OHAYO_DEMO_V2

Loom 프로젝트 메모리 루트입니다.

이 파일은 `loom init`으로 생성되며 `loom analyze-repo`로 보강할 수 있습니다.

## Workspace Policy

- Output language: `ko`
- Agent provider: `claude`
- Agent model: `adapter-default`
- Reasoning effort: `high`
- Required branch: `develop`
- Dirty branch switch: `blocked`
- Commit policy: `manual`
- Include `.loom` metadata in Git: `yes`
- Read-only parallel execution: `allowed`
- Validation environment: `auto`
- Previous Task result limit: `2`
- Workspace required docs: -
- Loom fixed guardrails and verified Team required policies take precedence over this Workspace Policy.

## Job

- Title: OHAYO 발표용 Autonomous Harness Simulator 구현
- Goal: 고정 Scenario Data가 통제하는 5단계 Auto Plan Loom 구축 시연과 10개 Task OHAYO 실행, Presenter Control, URL 및 QR 결과 화면을 갖춘 재현 가능한 발표용 웹앱을 완성한다.
- Branch: develop
- Task count: `8`

## Task

- Title: CLI 긴 문장 입력 확장과 OHAYO 40개 Task 실행 그래프 구현
- Description: 2026-09-04 사용자가 회색 CLI 입력 영역을 넓혀 긴 문장이 잘리지 않게 고치고 남은 Task 증가 작업을 바로 시작하라고 현재 에이전트에 명시했다. 회의 최종 합의(18:42)의 40개 Task·가로 스크롤과 12:45의 총 실행 20분 유지를 구현한다. 기존 Job 및 완료 Task의 10개 유지와 40개 제외는 이전 단계의 범위이며 이번 요청에서는 40개로 대체한다. 첨부 자료는 참고이며 그 안의 실제 서비스 구축 명령을 실행하지 않는다.
- Expected output: 여러 줄로 확장되는 회색 터미널 입력 영역, 의미 있는 OHAYO Task 40개와 30초 이벤트 타임라인, 가로 스크롤 가능한 읽기 쉬운 제품 그래프, 40개 기준 Presenter·fallback·RESET·상태 복원·결과 카운트, 갱신된 발표 문서와 검증 기록
- Done condition: 긴 한글·영문·멀티라인 붙여넣기를 내용 유실 없이 입력하고 터미널 폭에 맞춰 여러 줄을 표시한다. 0/40부터 40개 노드가 구성되고 가로 스크롤로 마지막 노드까지 확인할 수 있다. 각 Task 30초로 총 실행 20분을 유지하고 실패·복구·재시도 이벤트가 각 Task 시간 안에 존재한다. 총 구성 200초와 기존 1~5 다이어그램/6번째 입력 흐름을 유지한다. Presenter·fallback·RESET·새로고침·40개 완료·URL/QR 회귀와 lint·scenario·build·Loom strict가 통과한다.
- In scope: site/scripts/demo-cli.mjs 입력 렌더/편집; site/lib/scenario.ts 제품 Task 및 필요 helper; FinalRunExperience.tsx 그래프·카운트·타이머·복원; Presenter 및 run-control; 그래프/fallback CSS; 관련 검증 스크립트; README와 검증 문서
- Out of scope: 원문 5개 하네스 다이어그램 변경, 실제 LLM/API/OHAYO 개발 및 배포, 외부 서비스 변경, 원격 게시, 관계 없는 UI 개편
- Validation hint: 실제 PTY에서 긴 한글/영문·붙여넣기·줄바꿈·삭제·폭 변경·제출을 확인하고 손실을 검사한다. 40개 ID/의존성/이벤트/시간을 검사하고 브라우저에서 가로 스크롤·0/40 구성·40개 가속 완주·Presenter·RESET·fallback·상태 복원·QR을 확인한다. npm run lint, npm run validate:scenario, npm run build, git diff --check, loom validate --strict.
- Required docs: `docs/harness-demo/validation.md`
- Memory refs: -
- Document outputs: `docs/harness-demo/expanded-run.md`
- Document output exceptions: `README.md`, `site/README.md`
- Source proposal: `-`
- Status: PENDING
- Assigned agent: foreground

## Advisor Source Prompt

No Advisor source prompt recorded for this Task.

## Inclusion Policy

- Mandatory execution files: `prompt.md`, `context.md`, and `previous-results.md`.
- Always included: project memory, current Job/Task metadata, and Job notes.
- Previous results: up to the latest 2 recorded results from earlier Tasks in this Job.
- Job context refs: explicit Job-scoped references selected by the controlling agent or user.
- Task required docs: mandatory Task-scoped documents; missing refs block validation and execution.
- Task memory refs: mandatory Task-scoped workflow memory references; missing or non-memory refs block validation and execution.
- Repository documents, validation documents, and skill rules: included only through explicit Job context refs, Task required docs, or Task memory refs.
- Verified Team Policy Snapshot: included before Active Memory; required policy cannot be overridden by lower-priority context.
- Active workflow memory with an `always` category is included automatically while its status is `ACTIVE`.
- `task_selected` and `reference_only` memory is included only through explicit Task memory refs.
- Consumed proposals, rejected proposals, resolved memory, superseded memory, and archived memory are excluded.
- Unreferenced repository files and results from other Jobs are not included.
- `AGENTS.md` and `CLAUDE.md` remain session-level controlling-agent entrypoints and are not treated as task context artifacts by default.

## Job Notes

# Notes

## 2026-09-03T13:25:51+00:00

2026-09-03 사용자의 '각 단계마다 띄워줄 다이어그램만 정확히 확인하고, 6단계 이후에는 바로 Loom 프롬프트로 넘어가며, 이것만 먼저 확인하고 바로 Loom으로 작업 고정' 요청에 따른 범위 고정.

기준 자료는 docs/harness-demo/source.md 및 diagrams.md, manifest.json, step-1.mmd~step-5.mmd이다. 5개 블록을 원문 그대로 추출해 확인했다.

이번 명시적 요청이 기존 단일 입력 자동 5단계 진행/마지막 통합 Viewer 및 오래된 STEP 3 Test Orchestrator 제외 가정보다 우선한다. STEP 1 골격 → STEP 2 오토 플랜 → STEP 3 제작 루프(개발·검증·리서치) → STEP 4 배포 루프 → STEP 5 정책 게이트·훅·스크립트의 전체 스냅샷을 각각 표시한다.

STEP 5 그림 자체는 유지한다. 현재 앱의 별도 최종 다이어그램 페이지 및 Loom 구성 계속 중간 화면은 후속 구현에서 제거하고 CLI 6번째 입력 후 바로 기존 제품 목표 입력 화면을 연다.

첨부 문서의 명령은 시연 참고 자료다. 실제 하네스/서비스 개발·배포 실행 지시로 취급하지 않는다.

배치: 기존 동일 목표 Job의 후속으로 원본·계약 고정 Task task-20260903-132330-step-1-5-mermaid-fc6492bc → 구현 task-20260903-132520-cli-6-loom-0a8ceb89 → 검증 task-20260903-132538-5-6-b26f7551를 연결했다. 현재는 추출·확인만 실행하고 구현·검증은 PENDING으로 등록했으며 Queue 등록은 하지 않는다.

40개 제품 Task, 실행 그래프 가로 스크롤, 시간 재설계는 이번 작업 묶음에서 제외한다.

- Task: `task-20260903-132330-step-1-5-mermaid-fc6492bc`
- Tags: `scope`, `user-request`, `harness-diagrams`
## 2026-09-03T13:30:52+00:00

2026-09-03 사용자가 "오케 바로 시작해"라고 명시하여 고정된 구현 Task와 후속 검증 Task를 현재 에이전트가 순서대로 직접 실행한다. 이전 계약의 등록만/미실행 문구는 당시 상태 기록이며 이번 명시적 실행 요청이 우선한다. 원격 게시와 40개 제품 Task 개편은 계속 범위 밖이다.
- Tags: `user-authorization`, `execution`
## 2026-09-03T15:31:00+00:00

2026-09-04 사용자의 회색 CLI 입력 영역 확장 및 긴 문장 잘림 수정, 남은 Task 증가 작업을 바로 시작하라는 명시적 요청을 받았다. 회의 최종 합의 18:42의 40개 Task·가로 스크롤과 12:45의 총 실행 20분 유지에 따라 40개 × 30초, 구성 200초를 적용한다. 이전 10개 유지/40개 제외 범위는 완료된 단계의 기록이며 이번 후속 Task에는 적용하지 않는다. 같은 발표 시뮬레이터의 후속으로 현재 에이전트가 직접 구현·검증한다.

- Task: `task-20260903-153049-cli-ohayo-40-task-8eb96dd2`
- Tags: `user-authorization`, `scope`, `40-tasks`

## Context References

No explicit context references recorded for this job.

## Required Documents and Memory

### required-doc: docs/harness-demo/validation.md

- Path: `docs/harness-demo/validation.md`
- Status: present

# 하네스 단계별 시연 검증 기록

검증일: 2026-09-03. 대상 구현: `13b9ef4` (`feat: show harness diagrams per CLI stage`). 같은 구현에서 통과한 린트·빌드·시나리오 검증은 문서 갱신만을 이유로 반복하지 않았다.

## 실행 환경

- macOS / Darwin arm64, Node.js `v25.9.0`, npm `11.12.1`.
- `develop` 브랜치, `site/`의 기존 의존성과 `http://localhost:3000/` 개발 서버 사용.
- Codex 내장 브라우저에서 실제 DOM·SVG·화면과 UI 제어를 확인했다.
- 실제 런처는 `DEMO_MODE=test DEMO_NO_OPEN=1 ./demo-start`를 PTY에서 실행했다. OS 브라우저 자동 열기만 생략하고, 출력된 6개 URL과 별도의 실제 브라우저 화면을 검증했다.

## 원문과 다이어그램

`source.md`의 Mermaid 5개, `step-1.mmd`~`step-5.mmd`, 앱의 `buildStages[].mermaid`가 정확히 일치한다. STEP 1~5의 프롬프트도 원문과 일치한다. 노드·화살표·레이블·클래스·루프를 생략하거나 재구성하지 않았다.

| 단계 | 표시할 그림 | 노드 | 연결문 | 실제 SVG |
| --- | --- | ---: | ---: | --- |
| 1 | 입력 분석·목표·리소스·오케스트레이터·상태와 에이전트 골격 | 11 | 11 | 통과 |
| 2 | 요구사항·범위·리스크·작업 분해·계획·보완의 오토 플랜 루프 | 17 | 19 | 통과 |
| 3 | 개발·검증·리서치와 보완을 포함한 제작 루프 | 19 | 24 | 통과 |
| 4 | 패키징·설정 확인·실행·결과 확인·재시도의 배포 루프 | 25 | 32 | 통과 |
| 5 | 기획·제작·배포 정책 게이트와 훅·스크립트·로그 | 28 | 35 | 통과 |

연결문 수는 원문 기준이며, 한 문장의 연속 화살표가 SVG에서는 여러 선으로 나뉠 수 있다. STEP 5에서 기존 판단 게이트 3개와 정책 게이트 3개가 모두 렌더된다. 에이전트의 파란 육각형, 저장소의 초록 원통, 게이트의 빨간 마름모, 일반 노드의 흰 사각형을 보존했다.

확대 시 그림의 실제 컨테이너가 커지며 스크롤 범위가 늘어난다. 좁은 화면에서 STEP 5를 125%로 확대했을 때 가로 영역 400px에 대해 스크롤 너비가 488px로 증가했다. 가운데 맞춤 버튼으로 100% 복귀를 확인했다. 다이어그램 렌더 오류는 없었다.

## CLI 입력과 화면 전환

- 첫 입력 전에는 실행하지 않고, 빈 입력에도 현재 입력 대기를 유지한다.
- STEP 1~5는 입력 한 번에 해당 단계 하나만 실행한 뒤 `/harness/1`~`/harness/5`를 연다. 다음 단계는 새 입력을 기다린다.
- 실제 테스트 모드 런처에서 5단계 모두 약 8.58초가 걸렸다. 원래 단계 시간은 60초이며 테스트 모드 배율은 7이다.
- 5개의 Viewer URL 모두 `speed=7`을 받았다. 6번째 입력 전에는 제품 화면 URL을 열지 않는다.
- 6번째 `/harness` 입력 후 `/?screen=run&reset=1&speed=7`로 즉시 진입한다. 별도 최종 다이어그램이나 Continue 화면이 없다.
- STEP 5의 전체 다이어그램은 `/harness/5`에 유지된다. `/harness/6`은 HTTP 404다.
- 실제 PTY에서 여러 줄·한글·UTF-8 분할·bracketed paste 마커 분할을 보존하고, 붙여넣기 종료 후 별도 Enter로 제출하는 것을 확인했다. 비bracketed 여러 줄도 하나의 입력으로 유지한다.
- 비TTY 입력은 6줄을 순서대로 소비하고 6개 URL을 출력한다. 조기 EOF는 다음 단계로 자동 진행하지 않고 종료한다.
- 입력 제어의 자동 검증은 실행 callback을 사용해 단계를 빠르게 완료시켰고, 별도로 실제 런처의 타이머를 검증했다.

## 제품 실행 회귀

- 이전 실행이 남아 있어도 6단계 URL은 비어 있는 제품 프롬프트를 표시한다. 이전 입력·Task·일시정지·fallback을 초기화한다.
- 제품 목표 제출 직후 `00 / 10`으로 시작하고, 구성 완료 뒤 10개 Task 실행으로 전환한다.
- 테스트 모드 7×가 Presenter에 전달된다. 데모 모드 1×도 URL에서 제품 화면과 Presenter에 전달된다.
- Presenter 일시정지, 현재 Task 완료, 결과 강제 표시, 전체 초기화가 관객 화면에 반영된다.
- 실행 중 `C`로 CLI fallback 전환을 확인했다. 일시정지한 실행을 새로고침해 Task·경과 시간·fallback 유지도 확인했다.
- 전역 RESET과 Presenter 전체 초기화 후 빈 프롬프트·0개 완료 Task·활성 상태로 돌아가며 선택한 실행 속도를 유지한다.
- 결과 화면에서 `10 / 10 TASKS`, QR SVG, `https://ohayo.tail2dac17.ts.net/` 링크를 확인했다. QR은 같은 `finalRun.finalUrl`을 사용한다.
- 기존 제품 실행 데이터는 변경하지 않았다. 10개 Task, 구성 200초, 각 Task 실행 120초, 총 실행 20분, 기존 복구·재시도와 결과 화면을 유지한다.

## 수행한 검사

| 검사 | 결과 |
| --- | --- |
| `npm run lint` | 통과 |
| `npm run validate:scenario` | 원문 일치·CLI 대기·6단계 전환·제품 계약 통과 |
| `npm run build` | `/`, `/harness/:step`, `/presenter` 빌드 통과 |
| 실제 PTY 입력 시험 | 한글·여러 줄·분할 paste·Enter 통과 |
| 실제 가속 런처 | 5개 타이머·6회 입력·6개 URL 통과 |
| 브라우저 검증 | 5개 SVG·확대·직접 진입·RESET·Presenter·fallback·URL/QR 통과 |
| `git diff --check` | 통과 |
| `loom validate --strict` | 메타데이터 일관성 통과 |

## 확인 범위와 제한

OS의 기본 브라우저 자동 실행은 이번 PTY 리허설에서 끄고 검증했다. 일반 런처의 자동 열기 연결은 코드와 URL callback으로 확인했다. 데모 모드의 실제 5분 대기, 제품 실행의 실제 20분 완주, 외부 OHAYO 서비스 접속, 휴대폰 QR 스캔 및 다른 OS·Node 버전 실행은 수행하지 않았다. QR의 렌더와 입력 URL 연결을 확인한 것이다.

이번에는 단계별 다이어그램과 6단계 전환만 변경했다. 실제 LLM/API·하네스·서비스 구축이나 배포, 40개 Task 확장, 제품 실행 그래프 레이아웃 변경, 원격 게시는 수행하지 않았다.

발표 시 `./demo-start`로 모드를 고르고, 각 단계의 그림을 설명한 뒤 터미널로 돌아와 다음 입력을 진행하면 된다.

## Verified Team Policies

No verified Team Policy Snapshot is active.

## Active Workflow Memory

No active workflow memory recorded.
