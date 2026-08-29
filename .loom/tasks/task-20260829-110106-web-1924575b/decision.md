# 결정

## RESET 시작점은 Product Prompt

Harness Viewer는 CLI STEP 1~5의 결과를 보여주는 진입 연출이다. Web 실행 중 RESET은 Viewer로 돌아가지 않고 OHAYO 제품 Prompt로 돌아가 Task 구성과 실행을 처음부터 다시 시작하게 했다.

## 컴포넌트 재마운트로 완전 초기화

부모의 `runKey`를 증가시켜 `FinalRunExperience`를 새로 마운트한다. 개별 state를 일부만 초기화하는 방식보다 Planning, Task, Completion Timer와 화면 모드를 빠짐없이 초기화할 수 있다.

## 선택한 모드 속도 보존

Viewer Continue와 RESET 모두 현재 URL의 `speed`를 검증해 `/?screen=run&speed=<value>`로 유지한다. Product Run은 `initialSpeed`로 시작하므로 테스트 모드 7×가 Web 전체에 적용된다. Presenter가 임시로 바꾼 속도는 RESET 시 Launcher가 선택한 모드 속도로 돌아간다.

## RESET은 눈에 덜 띄게 전역 배치

오른쪽 아래 22px 높이의 저대비 버튼으로 두고 Hover·Keyboard Focus에서만 명확하게 보이도록 했다. Viewer, Prompt, Planning, Running, Completion, Result와 CLI Fallback에서 같은 버튼을 사용할 수 있다.
