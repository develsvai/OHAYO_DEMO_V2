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

- Title: Web 발표 화면 비율 및 Task Graph 최적화
- Goal: Task Node의 20초 순차 구성을 제거하고 모든 Web 화면을 100% 배율 한 화면에 맞추며 Task Graph의 사이드 폭을 줄여 전체 Graph가 스크롤 없이 보이도록 완성한다.
- Branch: develop
- Task count: `1`

## Task

- Title: Task Graph 한 화면 구성과 실행 Spinner
- Description: 20초마다 Task Node를 하나씩 노출하는 200초 구성을 제거하고 Task 구성 화면에서 10개 Node와 의존 관계를 즉시 모두 표시한다. 모든 Web 화면은 100% 배율에서 Page 또는 내부 Scroll 없이 핵심 요소가 보여야 한다. Task Graph Inspector 폭을 줄이고 전체 Graph를 가용 영역에 자동 축소·중앙 배치하며 실행 중인 Task Node에는 명확한 회전 Spinner와 실행 상태를 표시한다.
- Expected output: 스크롤 없는 Viewer·Prompt·Task Graph·CLI Fallback·Completion·Result·Presenter 화면, 전체가 보이는 Task Graph, 실행 Node Spinner
- Done condition: 20초 안내와 순차 Node 로직이 제거되고 1440x900 및 1920x1080 100% 배율에서 화면별 scrollWidth/scrollHeight가 viewport를 넘지 않으며 전체 Graph와 Active Spinner가 보이고 lint, scenario validation, build가 통과한다.
- In scope: FinalRun State와 Planning 전환, Task Graph Canvas, Responsive CSS, Viewer와 Run 계열 화면, Presenter, Scenario contract, README, 브라우저 시각 검증과 배포
- Out of scope: Shell STEP 1~5 Timeline, Task당 2분 실행 Timeline, 실제 Agent와 실제 OHAYO 개발
- Validation hint: Prompt→전체 Task Graph→Running→Completion→Result 상태를 브라우저에서 1440x900과 1920x1080로 캡처·측정하고 모든 화면 overflow와 Active Spinner를 확인한다.
- Required docs: -
- Memory refs: -
- Document outputs: -
- Document output exceptions: -
- Source proposal: `-`
- Status: PENDING
- Assigned agent: codex

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

## Context References

No explicit context references recorded for this job.

## Required Documents and Memory

No task-level required docs or memory refs recorded.

## Verified Team Policies

No verified Team Policy Snapshot is active.

## Active Workflow Memory

No active workflow memory recorded.
