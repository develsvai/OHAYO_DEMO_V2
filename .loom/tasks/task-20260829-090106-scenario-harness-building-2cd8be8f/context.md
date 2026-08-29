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
- Task count: `3`

## Task

- Title: Scenario 기반 Harness Building 경험 구현
- Description: writing-block.md의 canonical prompt와 Mermaid를 Source of Truth로 옮기고, 자유 입력과 무관하게 STEP 1~5가 순서대로 실행되는 Codex 스타일 CLI, 약 1분 Timeline, 정적 Viewer 자동 전환, Harness Ready 상태를 구현한다.
- Expected output: 실행 가능한 웹앱 기반, 중앙 scenario 데이터, BUILD_CLI_1부터 HARNESS_READY까지의 고정 State Machine, 5개 Viewer와 키보드/복귀 동작
- Done condition: STEP 1~5에서 OHAYO가 노출되지 않고 각 자유 입력이 해당 단계 Timeline을 시작하며 완료 후 올바른 Viewer로 자동 전환되고 빌드가 성공한다.
- In scope: 프로젝트 초기화, 디자인 시스템, canonical prompts, 단계별 로그와 Mermaid snapshots, CLI 및 Viewer, 단계 상태 보존
- Out of scope: 실제 LLM 호출, 실제 Harness 생성, 실시간 노드 생성, OHAYO 최종 Run과 Presenter Control
- Validation hint: 프로덕션 빌드 후 각 단계 상태 전이와 Viewer 헤더·그래프·OHAYO 금지 규칙을 확인한다.
- Required docs: -
- Memory refs: -
- Document outputs: -
- Document output exceptions: -
- Source proposal: `-`
- Status: PENDING
- Assigned agent: -

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
