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

- Title: Web 전체 실행 초기화와 테스트 속도 유지
- Goal: 모든 Web 화면에서 전체 실행 상태를 언제든 초기화해 OHAYO 제품 Prompt와 Task 구성 시작점으로 돌아가게 하고, Launcher에서 선택한 7배속 테스트 모드가 Viewer 이후 Web 전체에 유지되도록 한다.
- Branch: develop
- Task count: `1`

## Task

- Title: 전역 리셋과 Web 배속 전달 수정
- Description: Web 모든 화면에 낮은 시각 강조의 전역 RESET 버튼을 추가한다. RESET은 저장 상태와 모든 실행 state를 지우고 제품 Prompt에서 Task 구성부터 다시 시작한다. Viewer Continue가 speed query를 보존하도록 수정해 테스트 모드 7배속이 Web 전체에 적용되게 한다.
- Expected output: 전역 리셋 버튼, 완전한 product flow 초기화, speed 7 query 보존, Presenter reset 의미 정합화, 검증과 배포
- Done condition: 어느 Web 화면에서 RESET해도 Prompt·Task·타이머·완료·일시정지·viewMode가 초기화되고 prompt 화면으로 돌아가며, speed=7이 Viewer에서 product로 이동한 뒤에도 유지되고 lint, validate, build, Loom strict validation과 배포가 성공한다.
- In scope: page.tsx, FinalRunExperience.tsx, globals.css, presenter copy, validation, README, local/deployed site
- Out of scope: CLI timing, scenario task content, graph layout redesign
- Validation hint: source assertions, lint, validate:scenario, build, local HTTP/HMR, browser interaction if available
- Required docs: -
- Memory refs: -
- Document outputs: -
- Document output exceptions: -
- Source proposal: `-`
- Status: REVIEW_REQUIRED
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

## Context References

No explicit context references recorded for this job.

## Required Documents and Memory

No task-level required docs or memory refs recorded.

## Verified Team Policies

No verified Team Policy Snapshot is active.

## Active Workflow Memory

No active workflow memory recorded.
