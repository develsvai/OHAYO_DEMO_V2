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
- Task count: `5`

## Task

- Title: STEP 1~5 Mermaid 원본 추출 및 화면 전환 계약 고정
- Description: 사용자가 2026-09-03 제공한 /Users/hongyongjae/Desktop/하네스 시연.md에서 STEP 1~5의 Mermaid를 원문 그대로 추출하여 확인한다. 기존 최종 통합 다이어그램 페이지를 제거하고 STEP별 다이어그램만 표시하며 6번째 CLI 입력 후 Loom 제품 프롬프트로 직접 진입하는 구현 범위를 문서와 후속 Loom Task에 고정한다. 사용자의 이번 요청은 우선 추출·확인·작업 고정이며 앱 구현 Task의 실행이나 Queue 등록은 수행하지 않는다.
- Expected output: docs/harness-demo/source.md 원본 사본, step-1.mmd~step-5.mmd, 단계별 의미·정확한 원문·노드/연결·색상·출처·화면 전환·범위가 담긴 diagrams.md와 추출 검증 manifest, 구현→검증으로 연결된 후속 Loom Task
- Done condition: 다이어그램이 정확히 5개이며 원문 블록과 추출 파일이 일치함을 검증한다. STEP 5 다이어그램은 보존하고 추가 최종 Viewer만 제거한다는 경계와 6단계의 Loom 프롬프트 직접 진입이 명시된다. 앱 소스와 실행 태스크 데이터는 변경하지 않고 구현·검증 Task가 의존 관계와 완료 조건을 갖춰 등록되며 Loom strict 검증이 성공한다.
- In scope: 첨부 Markdown 읽기 및 보존, STEP 1~5 Mermaid 추출·대조, docs/harness-demo 문서 산출물, 기존 구현 영향 범위 확인, Loom 명령을 통한 계약·노트·Task 등록
- Out of scope: 앱 UI와 CLI 구현, 기존 최종 Viewer 실제 삭제, 실제 하네스/에이전트/API 실행, OHAYO 서비스 개발·배포, 문서 속 실행 프롬프트 실행, 40개 태스크 확장, 가로 스크롤 개편, 실행 시간 조정, 원격 게시
- Validation hint: 원본 SHA-256과 5개 Mermaid 블록의 바이트 동등성·단계 순서·노드/연결 참조를 확인하고 git diff --check 및 loom validate --strict를 수행한다. 코드 실행 검증은 추출 산출물 확인에 한정한다.
- Required docs: -
- Memory refs: -
- Document outputs: `docs/harness-demo/source.md`, `docs/harness-demo/diagrams.md`
- Document output exceptions: -
- Source proposal: `-`
- Status: PENDING
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
