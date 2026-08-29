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

- Title: GitHub 원격 게시와 다른 노트북 실행 점검
- Goal: GitHub 저장소를 origin으로 등록해 develop 브랜치의 최신 커밋을 게시하고, 새 노트북에서 데모 실행에 필요한 Node와 의존성 설치 조건을 로컬 설정 기준으로 확인한다.
- Branch: develop
- Task count: `1`

## Task

- Title: origin 등록·push와 이식성 확인
- Description: https://github.com/develsvai/OHAYO_DEMO_V2.git 을 origin으로 추가하고 develop 최신 커밋을 push한다. package engines, lockfile과 Launcher 검사로 다른 노트북의 사전 설치와 최초 실행 절차를 확인한다.
- Expected output: 등록된 origin, GitHub develop push, 다른 노트북용 정확한 Node/npm install 안내
- Done condition: origin URL이 정확하고 develop이 origin/develop을 추적하며 push가 성공한다. Node >=22.13.0, site/npm install, 네트워크 필요 시점과 이후 ./demo-start 절차가 확인되고 Loom strict validation이 성공한다.
- In scope: Git remote 설정, develop push, Loom 기록, 로컬 실행 환경 감사
- Out of scope: main 브랜치 생성·병합, GitHub 설정 변경, 앱 코드 변경
- Validation hint: git remote -v, git status -sb, git ls-remote, package.json engines, package-lock, launcher dependency check, loom validate --strict
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
