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

- Title: 5분 테스트 모드와 데모 모드 선택기
- Goal: demo_start 실행 시 5분 테스트 모드와 발표용 데모 모드를 선택하게 하고, 테스트 모드의 전체 자동 진행 시간을 수동 전환 여유를 포함해 5분 이내로 압축한다.
- Branch: develop
- Task count: `1`

## Task

- Title: Launcher 실행 모드 선택과 전체 흐름 가속
- Description: demo_start와 demo-start 실행 시 1번 5분 테스트 모드, 2번 데모 모드를 선택하게 한다. 테스트 모드는 동일한 시나리오를 speed 7로 실행하고 데모 모드는 기존 speed 1 타이밍을 유지한다.
- Expected output: TTY 모드 선택 메뉴, 두 실행 진입점, 속도 전달, README와 정적 검증 및 배포 반영
- Done condition: 1/2 선택이 각각 speed 7/1로 CLI와 Web에 전달되고 테스트 모드 자동 구간이 약 3분 37초이며 lint, scenario validation, build, Loom strict validation 및 배포가 성공한다.
- In scope: demo launcher, demo-start alias, site README, validation script, local and deployed site
- Out of scope: 시나리오 내용, 그래프 디자인, 데모 모드 기존 시간 변경
- Validation hint: bash syntax, node syntax, menu PTY, npm lint, npm run validate:scenario, npm run build, speed timing assertion
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
