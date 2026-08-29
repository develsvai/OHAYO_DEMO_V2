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
- Task count: `4`

## Task

- Title: Harness Build 단일 입력 자동 실행 흐름 교정
- Description: 최초 자유 입력 한 번으로 hidden canonical prompt STEP 1~5를 각 약 1분씩 자동 순차 실행하고, 중간 입력·Viewer 없이 STEP 5 완료 후 통합 Mermaid Harness Viewer를 한 번만 표시하도록 Build State Machine을 교정한다.
- Expected output: INITIAL_PROMPT → BUILD_STEP_1 → BUILD_STEP_2 → BUILD_STEP_3 → BUILD_STEP_4 → BUILD_STEP_5 → FINAL_HARNESS_VIEWER → AUTO_PLAN_LOOM_READY 상태 흐름
- Done condition: 사용자 입력은 최초 한 번만 필요하고 5개 단계가 자동 실행되며, 단계 사이 Viewer가 없고 마지막 통합 Mermaid Viewer 한 번 뒤 Auto Plan Loom Ready 상태가 된다.
- In scope: Build CLI State Machine 교정, 5개 hidden canonical prompt 순차 실행, 단계별 로그와 총 진행률, 마지막 통합 Mermaid Graph, 상태 저장과 재시작
- Out of scope: 제품 Prompt, 10개 Task 실행, Presenter Control, 결과 URL과 QR
- Validation hint: 가속 모드에서 단일 입력 후 5개 단계 자동 완주, 중간 Viewer 미노출, 마지막 Viewer 1회, 제품명 사전 미노출을 확인한다.
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
