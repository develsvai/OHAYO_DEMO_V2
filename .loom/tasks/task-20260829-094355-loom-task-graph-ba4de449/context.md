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

- Title: OHAYO Task Graph 구성·실행 흐름 개편
- Goal: CLI 5단계 완료 뒤 최종 Mermaid Viewer를 거쳐 OHAYO Prompt 입력, 200초 Task Node 구성, 10개 Task 순차 실행, 새 URL과 QR까지 이어지는 한국어 중심 발표 흐름을 완성한다.
- Branch: develop
- Task count: `1`

## Task

- Title: Loom Task Graph 계획·실행 화면 구현
- Description: 최종 Mermaid Viewer Continue 이후 Loom 제품 Prompt를 받고, harness_viewer_demo.gif의 어두운 Node Graph 시각 문법으로 10개 Task를 20초마다 하나씩 구성한 뒤 동일 Graph에서 Task를 순차 실행하고 지정된 OHAYO URL과 QR을 표시한다. 주요 UI 문구는 한국어로 정리한다.
- Expected output: CLI Build, 최종 Mermaid Viewer, Loom Prompt, 200초 Task 구성 Graph, 10 Task 실행 Graph, OHAYO QR이 연결된 발표용 웹앱
- Done condition: Task 구성 단계가 정확히 10개×20초로 동작하고 구성 완료 후 실행 단계로 전환되며 최종 URL이 https://ohayo.tail2dac17.ts.net/ 로 표시되고 Presenter 복구와 빠른 리허설이 정상 작동한다.
- In scope: Scenario State Machine, Node Graph UI, Task 계획 Timeline, 실행 Timeline, 한국어 UI, Presenter Control, URL과 QR, 상태 복원, 검증과 배포
- Out of scope: 실제 Agent, 실제 Loom Task 생성, 실제 OHAYO 구현, 실시간 외부 API
- Validation hint: 가속 모드에서 Build 5단계, Viewer 1회, Task 구성 10개, 실행 10개, 결과 QR까지 완주하고 lint, scenario contract, production build를 통과한다.
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
