'use client';

import { useEffect, useRef, useState } from 'react';
import { finalRun } from '@/lib/scenario';
import {
  finalRunStorageKey,
  PresenterCommand,
  presenterChannelName,
  presenterCommandKey,
  StoredFinalRunState,
} from '@/lib/run-control';

const emptyState: StoredFinalRunState = {
  screen: 'prompt', submittedPrompt: '', planningElapsed: 0, currentTaskIndex: 0,
  taskElapsed: 0, completedTaskIds: [], paused: false, speed: 1, viewMode: 'web', updatedAt: 0,
};

export default function PresenterPage() {
  const [state, setState] = useState<StoredFinalRunState>(emptyState);
  const [lastCommand, setLastCommand] = useState('없음');
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') channelRef.current = new BroadcastChannel(presenterChannelName);
    const readState = () => {
      const stored = window.localStorage.getItem(finalRunStorageKey);
      if (!stored) return;
      try { setState(JSON.parse(stored) as StoredFinalRunState); }
      catch { window.localStorage.removeItem(finalRunStorageKey); }
    };
    readState();
    const poll = window.setInterval(readState, 400);
    return () => { window.clearInterval(poll); channelRef.current?.close(); };
  }, []);

  function send(command: PresenterCommand, label: string) {
    const payload = { id: crypto.randomUUID(), at: Date.now(), command };
    window.localStorage.setItem(presenterCommandKey, JSON.stringify(payload));
    channelRef.current?.postMessage(command);
    setLastCommand(label);
  }

  const planning = state.screen === 'planning';
  const plannedCount = Math.min(finalRun.tasks.length, Math.floor(state.planningElapsed / (finalRun.taskGraphDuration / finalRun.tasks.length)));
  const task = planning ? finalRun.tasks[0] : finalRun.tasks[state.currentTaskIndex];
  const activeCount = planning ? plannedCount : state.completedTaskIds.length;
  const activeProgress = planning
    ? Math.min(100, state.planningElapsed / finalRun.taskGraphDuration * 100)
    : Math.min(100, state.taskElapsed / finalRun.taskDuration * 100);

  return (
    <main className="presenter-shell">
      <header className="presenter-header"><div><span>PRESENTER 전용</span><h1>발표 제어</h1></div><a href="/" target="_blank" rel="noreferrer">관객 화면 열기 ↗</a></header>

      <section className="presenter-status">
        <div><span>화면</span><strong>{state.screen.toUpperCase()}</strong></div>
        <div><span>상태</span><strong className={state.paused ? 'warning' : 'healthy'}>{state.paused ? '일시정지' : '활성'}</strong></div>
        <div><span>{planning ? '구성 Task' : '완료 Task'}</span><strong>{String(activeCount).padStart(2, '0')} / 10</strong></div>
        <div><span>속도</span><strong>{state.speed}×</strong></div>
      </section>

      <section className="presenter-current">
        <span>{planning ? 'Task Graph 상태' : '현재 실행 대상'}</span>
        <div><strong>{planning ? String(plannedCount).padStart(2, '0') : String(task?.id ?? 0).padStart(2, '0')}</strong><h2>{planning ? 'OHAYO Task Graph' : task?.title ?? '제품 프롬프트 대기'}</h2></div>
        <p>{planning ? plannedCount >= finalRun.tasks.length ? '10개 Task와 의존 관계 구성이 완료되었습니다.' : `${plannedCount}개 Task를 선별하고 Graph에 연결했습니다.` : task?.goal ?? '관객 화면에서 OHAYO 제품 목표를 입력하세요.'}</p>
        <div className="presenter-progress"><i style={{ width: `${activeProgress}%` }} /></div>
      </section>

      <section className="control-group primary-controls">
        <div className="control-heading"><span>실행 제어</span><small>안전 제어</small></div>
        <div className="control-grid two">
          <button onClick={() => send({ type: 'pause' }, '일시정지')}><span>Ⅱ</span><strong>일시정지</strong><small>현재 Timer 정지</small></button>
          <button onClick={() => send({ type: 'resume' }, '재개')}><span>▶</span><strong>재개</strong><small>실행 계속</small></button>
        </div>
        <div className="control-grid">
          <button onClick={() => send({ type: 'next-event' }, '다음 Event')}><span>→</span><strong>다음 Event</strong><small>상태 한 단계 이동</small></button>
          <button onClick={() => send({ type: 'complete-current' }, '현재 완료')}><span>✓</span><strong>현재 완료</strong><small>Node 또는 Task 완료</small></button>
          <button onClick={() => send({ type: 'next-task' }, '건너뛰기')}><span>»</span><strong>건너뛰기</strong><small>다음 Task로 이동</small></button>
        </div>
      </section>

      <section className="control-group"><div className="control-heading"><span>실행 속도</span><small>리허설</small></div><div className="speed-grid">{[1, 10, 30, 60].map((value) => <button className={state.speed === value ? 'active' : ''} key={value} onClick={() => send({ type: 'set-speed', value }, `속도 ${value}×`)}>{value}×</button>)}</div></section>

      <section className="control-group danger-zone"><div className="control-heading"><span>복구</span><small>발표 사고 대응</small></div><div className="control-grid">
        <button onClick={() => send({ type: 'reset-run' }, '실행 초기화')}><span>↻</span><strong>실행 초기화</strong><small>제품 Prompt로 이동</small></button>
        <button onClick={() => send({ type: 'reset-all' }, '전체 초기화')}><span>×</span><strong>전체 초기화</strong><small>제품 Prompt부터 재시작</small></button>
        <button className="force" onClick={() => send({ type: 'show-result' }, '결과 표시')}><span>⚡</span><strong>결과 표시</strong><small>최종 QR로 이동</small></button>
      </div></section>

      <footer className="presenter-footer"><span>마지막 명령</span><strong>{lastCommand}</strong><small>400ms마다 상태 갱신</small></footer>
    </main>
  );
}
