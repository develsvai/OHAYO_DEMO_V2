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

- Title: Task 선별 생성 단계 복원
- Goal: RESET 이후 OHAYO Prompt 제출 시 완성된 10개 Task를 즉시 표시하지 않고 0/10부터 Task를 순차 선별·생성한 뒤 실행으로 전환한다. 데모는 Task당 20초, 테스트는 동일 흐름 7배속으로 유지한다.
- Branch: develop
- Task count: `1`

## Task

- Title: 0부터 시작하는 Task 선별 생성 Timeline
- Description: Task Graph 구성 화면에서 plannedCount를 elapsed time으로 계산해 0/10부터 10/10까지 순차 생성한다. 데모 모드 기본 구성 시간은 200초이며 테스트 모드 speed 7에서는 약 28.6초다. RESET 후 Prompt 제출 시 반드시 이 과정을 다시 거친다.
- Expected output: 순차 Task Node 생성, 진행 상태 문구, Presenter 동기화, 5분 테스트 예산 갱신, 검증과 재배포
- Done condition: Prompt 제출 직후 plannedCount가 0이고 20초마다 1개씩 증가해 200초에 10개가 되며 speed 7에서는 약 28.6초에 동일 과정이 끝난다. RESET 후에도 동일하고 lint, validate, build, Loom strict validation과 배포가 성공한다.
- In scope: scenario timing, FinalRunExperience planning count/status, presenter planning status, validator, README, local/deployed site
- Out of scope: Task 내용, 실행 Task 120초 타이밍, graph layout
- Validation hint: plannedCount formula assertion, timing budget, lint, validate:scenario, build, local 3000 response
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
