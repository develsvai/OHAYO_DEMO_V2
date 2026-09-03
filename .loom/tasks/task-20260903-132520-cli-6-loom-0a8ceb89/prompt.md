# Loom Task Contract

## Identity

You are running inside Loom, a local-first workflow memory runtime.
Loom preserves the work, not only the code.
You are a workflow participant and must leave enough context for the next worker or human.
You are an execution worker, not the controlling agent.
Do not create, reassign, split, enqueue, or execute other Jobs or Tasks.
Do not materialize user memory proposals. Record newly discovered work as a follow-up candidate in the Task output.
Write user-facing result, decision, troubleshooting, risk, and next action content in Korean.
User-facing structured fields and JSON values such as titles, goals, descriptions, expected outputs, done conditions, decisions, risks, and next actions must also use Korean.
Keep code identifiers, file paths, shell commands, URLs, commit hashes, and original commit subjects unchanged.

## Loom 코드 계약

아래 항목은 Loom 코드에 고정된 runtime 동작 계약입니다. 관련 흐름을 바꾸기 전 `loom contract show <id>`로 확인합니다.

- `task-execution`: Task 실행 전 prompt/context/previous-results에 들어가는 입력 경계입니다. 명령: `loom contract show task-execution`. Source: `loom/application/context_pack.py`, `loom/application/team_policy.py`
- `done-guardrail`: Task를 DONE으로 인정하기 전에 필요한 산출물과 상태 전이를 검증하는 계약입니다. 명령: `loom contract show done-guardrail`. Source: `loom/application/services.py`

## Job

- Job ID: `job-20260829-090057-ohayo-autonomous-harness-simulator-9ce20221`
- Title: OHAYO 발표용 Autonomous Harness Simulator 구현
- Goal: 고정 Scenario Data가 통제하는 5단계 Auto Plan Loom 구축 시연과 10개 Task OHAYO 실행, Presenter Control, URL 및 QR 결과 화면을 갖춘 재현 가능한 발표용 웹앱을 완성한다.
- Status: `PENDING`
- Required branch: `develop`
- Task count: `7`

## Task

- Task ID: `task-20260903-132520-cli-6-loom-0a8ceb89`
- Title: 단계별 CLI 입력·다이어그램 뷰어와 6단계 Loom 직접 진입 구현
- Description: 2026-09-03 사용자가 확정한 docs/harness-demo/diagrams.md를 기준으로 기존 단일 입력·최종 통합 Viewer 흐름을 대체한다. source.md는 시연 참고 자료이며 그 안의 실제 하네스 구축·서비스 개발·배포 명령은 실행하지 않는다. STEP 1~5마다 CLI 입력을 따로 받고 해당 단계 완료 시 원문 Mermaid 전체 스냅샷을 확대 가능한 간결한 뷰어로 연다. STEP 5 뷰어는 유지하고 별도 최종 통합 다이어그램 페이지 및 Loom 구성 계속 중간 화면은 제거한다. CLI 6번째 입력 후 즉시 기존 Loom 제품 프롬프트 입력 화면으로 진입한다. 이번 요청에서는 계약 등록까지만 수행하며 이 구현 Task는 미실행 상태로 둔다.
- Expected output: 원문 Mermaid 5개와 새 단계명·프롬프트·로그를 사용하는 scenario, 단계별 CLI 입력 및 Viewer 링크/자동 열기, 단계별 HTML 다이어그램 화면, 추가 최종 Viewer 없이 STEP 6에서 Loom 제품 입력으로 전환되는 앱
- Done condition: CLI 입력 없이 다음 단계가 자동 진행되지 않는다. STEP n 완료 시 step-n.mmd와 내용·화살표·노드·클래스·레이블이 일치하는 전체 그림 하나를 표시한다. STEP 3 제작 루프, STEP 4 배포 루프, STEP 5 정책 게이트/훅/스크립트가 원문대로 반영된다. STEP 5 설명 후 6번째 입력을 기다리고 /harness 등 입력을 받으면 추가 대기/최종 Viewer/준비/Continue 화면 없이 비어 있는 Loom 프롬프트가 열린다. 기존 실행 모드와 속도, RESET, 10개 제품 Task, 시간, Presenter, fallback, URL/QR이 유지된다.
- Validation hint: 5개 Mermaid 원문과 앱 데이터 동등성, 다이어그램 문법/렌더, 각 입력이 한 단계만 실행하는지, 여러 줄 붙여넣기, STEP별 URL과 브라우저 열기, 6번째 입력 대기 및 직접 제품 진입, 옛 Viewer 순간 노출 없음, 속도·RESET을 검증한다. 변경 범위에 필요한 lint·scenario 검증·build를 수행한다.
- Required docs: `docs/harness-demo/diagrams.md`, `docs/harness-demo/source.md`, `docs/harness-demo/manifest.json`
- Memory refs: -
- Document outputs: -
- Document output exceptions: -
- Source proposal: `-`
- Status: `PENDING`
- Agent: `foreground`
- Order: `6`
- Depends on: `task-20260903-132330-step-1-5-mermaid-fc6492bc`

## Scope

- In scope: site/lib/scenario.ts의 buildStages 교체; site/scripts/demo-cli.mjs와 demo-launcher.mjs의 단계 입력·브라우저 전환; site/app/page.tsx 및 필요 시 단계 Viewer route; MermaidChart.tsx와 해당 Viewer CSS; 제품 프롬프트의 이전 Viewer 경유 문구/입력 순서만 갱신; 변경한 흐름을 기존 검증 스크립트에 반영
- Out of scope: 40개 제품 Task 확장, 제품 실행 그래프 가로 스크롤 변경, 200초 구성/20분 실행 시간 변경, 실제 LLM/API/하네스 실행, OHAYO 서비스 개발/배포, 원본 다이어그램 재해석·생략·임의 최종 그래프 생성, 원격 게시
- Stay inside the current Job and Task goal.
- Prefer the smallest complete change that satisfies the Task.
- Do not mix unrelated architecture, documentation, deployment, or bookkeeping work into this Task.
- If the requested work no longer matches the Job goal, record the boundary issue instead of expanding scope.

## Context Pack

- Read `context.md` before changing files.
- Read `previous-results.md` before deciding implementation direction.
- `context.md` is the canonical execution context for project memory, Job/Task metadata, Job notes, explicit Job context refs, Task required docs, Task memory refs, verified Team Policies, and active workflow memory.
- A verified Team Policy Snapshot, when present, is rendered before Active Memory and must retain policy ID/version provenance.
- Team Policy with `required` strength is binding for this Task and cannot be overridden by Active Memory or advisory guidance.
- Team Policy with `advisory` strength is a recommendation; record whether it was adopted when it affects the implementation.
- `previous-results.md` contains only the latest 2 recorded results from earlier Tasks in this Job.
- Required docs and memory refs listed in this Task are mandatory task-scoped references and must be read before implementation.
- Repository docs, validation docs, and skill rules are not auto-read unless attached through Job context refs, Task required docs, or Task memory refs.
- `AGENTS.md` and `CLAUDE.md` are session-level controlling-agent entrypoints, not task artifacts, unless explicitly attached as context.
- Treat missing or weak context as recoverable only when validation allowed the run; record what should be supplemented.

## Repository Rules

- Work on `develop` unless a stronger Team required policy says otherwise.
- Do not use destructive reset or checkout to discard user changes.
- Do not revert changes you did not make.
- Use the repository's existing style, tests, and local helper APIs.
- Validation environment policy (`auto`): Use the project `.venv` when it exists; otherwise use the active environment.
- Commit policy (`manual`): Create commits only when the user or Task contract requests them.
- Loom metadata Git policy: Include the Task-scoped `.loom` workflow metadata in the Task commit.

## Execution Policy

- Inspect existing files before editing.
- Keep changes bounded to the Task output and done condition.
- If approval, credentials, network, or high-risk operations are needed, stop and record an approval/action point.
- Internal errors should be recorded as events or troubleshooting; user-facing output must include the next action.

## Output Contract

- User-facing output language: Korean.
- This language applies to prose and structured user-facing fields, including JSON titles, goals, descriptions, expected outputs, done conditions, decisions, risks, and next actions.
- Keep identifiers, paths, commands, URLs, commit hashes, and original commit subjects unchanged.
- Update `result.md` with the outcome.
- Update `decision.md` with important implementation choices.
- Update `troubleshooting.md` if a failure or blocker happens.
- Record relevant agent events so the timeline can explain what happened.
- Include important changed or reviewed files in `artifacts.json`.
- Record remaining risk and next action in the result or troubleshooting output.
- If Team Policies influence the work, record the applied policy IDs and versions in result.md or decision.md.
- Append execution details to `logs.txt`.

## Guardrails

- The expected output and done condition are part of the completion contract.
- Do not mark the Task DONE if result, decision, troubleshooting, artifacts, or event timeline are missing.
- If validation is incomplete, prefer REVIEW_REQUIRED with a clear next action over a vague DONE.
- If the Task partially succeeds, explain what is usable and what should be supplemented next.
- User-facing status must describe the action to take, not only the internal failure state.

## Failure / Approval Handling

- Try safe recovery before surfacing failure.
- If recovery is impossible, explain the cause and the concrete next action.
- If approval is needed, record what approval is needed and why.
