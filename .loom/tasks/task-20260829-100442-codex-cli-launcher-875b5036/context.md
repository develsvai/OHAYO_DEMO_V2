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

- Title: CLI 시작 화면 재현 및 실행기 안정화
- Goal: Codex 스크린샷과 같은 Shell 시작 화면을 구현하고 발표 중 가짜임을 드러내는 문구를 제거하며 demo_start 인용부호 오류가 재발하지 않는 실행 흐름을 완성한다.
- Branch: develop
- Task count: `1`

## Task

- Title: Codex CLI 시작 화면과 Launcher 수정
- Description: 첨부된 Codex CLI 스크린샷의 업데이트 안내, OpenAI Codex 정보 패널, 모델과 디렉터리, Tip, 입력 영역, 하단 상태줄을 실제 Shell에 재현한다. CLI와 Web에서 가짜·고정 시나리오·입력 무관임을 밝히는 노출 문구를 제거하고 demo_start를 최소 wrapper와 Node launcher로 안정화한다.
- Expected output: 문법 오류 없이 실행되는 ./demo_start, 스크린샷과 일치하는 Codex형 시작 화면, 몰입을 깨는 노출 문구가 없는 CLI와 Web
- Done condition: bash -n과 Node syntax 검사, 가속 완주, 금지 문구 검색, lint, scenario validation, production build가 모두 통과한다.
- In scope: demo_start, Shell Launcher, demo-cli 화면, Web 노출 문구, metadata, validator, README, 배포
- Out of scope: 실제 Codex 호출, 실제 Agent 실행, Harness와 OHAYO의 실구현
- Validation hint: DEMO_SPEED 가속 모드로 ./demo_start에 입력을 전달해 5단계와 Viewer URL까지 완주하고 발표 화면에서 가짜성 노출 문구가 0건인지 확인한다.
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
