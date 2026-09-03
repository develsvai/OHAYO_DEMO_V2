# 문제 해결 및 제한

- 첫 Task 생성은 성공했으나 오케스트레이션 보조 코드가 반환 JSON의 task.id 대신 id를 읽어 저장 과정에서 오류가 났다. 출력에 이미 생성된 Task ID를 사용해 복구했고 중복 Task는 만들지 않았다.
- source.md 535행의 /harness 뒤 공백 1개는 첨부 원문에 있던 것이다. 원본 SHA-256과 바이트를 보존하기 위해 수정하지 않았다. 새로 작성한 추출본과 계약 문서에는 해당 공백이 없다.
- 이번 확인은 Mermaid 원문 동등성·단계 구성·연결 참조 검증이다. 실제 화면 렌더링과 확대, CLI 입력 전환은 후속 구현·검증 Task에서 확인해야 한다.
- Task 실행기가 요구한 result/decision/troubleshooting/logs 산출물만 기록했으며 workflow 상태와 Job/Task/문서 인덱스는 Loom 명령으로 변경했다.
