# 결정

## 확정 State Machine

- 회의록 후반 18:47~19:28의 최종 확인과 사용자의 명시적 정정을 우선 기준으로 삼는다.
- writing-block.md의 5개 Prompt와 단계 콘텐츠는 유지하되 발표자의 입력 행위로 노출하지 않고 hidden sequence로 실행한다.
- Viewer는 단계별 산출물이 아니라 5개 build instruction이 모두 적용된 최종 Harness 결과로 한 번만 표시한다.

## 진행 계산

- 하나의 totalElapsed가 전체 5분 Timeline을 통제한다.
- 현재 STEP, STEP 내부 Log, 완료 수와 전체 Progress는 totalElapsed에서 파생한다.
- 기본 배속은 1이며 리허설 검증용 ?speed=N만 허용한다.

## Viewer 콘텐츠

- 실제 Mermaid 렌더러를 유지한다.
- 마지막 Viewer에는 STEP 5의 통합 Production Harness graph를 사용한다.
