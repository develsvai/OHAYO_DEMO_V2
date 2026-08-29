'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { finalRun, ProductTask, ProductTaskState } from '@/lib/scenario';
import {
  finalRunStorageKey,
  PresenterCommand,
  presenterChannelName,
  presenterCommandKey,
  StoredFinalRunState,
} from '@/lib/run-control';

type FinalScreen = StoredFinalRunState['screen'];
type ViewMode = StoredFinalRunState['viewMode'];
type GraphPhase = 'planning' | 'running';

const completionDuration = 8_000;
const planningDuration = finalRun.tasks.length * finalRun.taskPlanningInterval;

const graphLayout = [
  { id: 0, x: 34, y: 258 },
  { id: 1, x: 190, y: 258 },
  { id: 2, x: 360, y: 116 },
  { id: 3, x: 360, y: 398 },
  { id: 4, x: 548, y: 48 },
  { id: 5, x: 548, y: 258 },
  { id: 6, x: 548, y: 468 },
  { id: 7, x: 748, y: 116 },
  { id: 8, x: 748, y: 398 },
  { id: 9, x: 948, y: 258 },
  { id: 10, x: 1098, y: 258 },
];

const graphEdges = [
  [0, 1], [1, 2], [1, 3], [2, 4], [2, 5], [3, 5], [3, 6],
  [4, 7], [5, 7], [5, 8], [6, 8], [7, 9], [8, 9], [9, 10],
];

const nodeIcons: Record<string, string> = {
  Planning: '⌁', Design: '◇', Backend: '▣', Frontend: '◫', Engineering: '⌘',
  Research: '◎', Infrastructure: '⬡', Validation: '✓', Deployment: '↗',
};

function formatClock(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stateLabel(state: ProductTaskState | 'pending') {
  const labels: Record<ProductTaskState | 'pending', string> = {
    pending: '대기', running: '실행 중', context: 'Context 로드', implementing: '구현 중',
    validating: '검증 중', failed: '실패', repairing: '복구 중', retrying: '재시도', done: '완료',
  };
  return labels[state];
}

function nodeClass(owner: string) {
  return `node-${owner.toLowerCase().replaceAll(' ', '-')}`;
}

function TaskGraphCanvas({
  phase,
  plannedCount,
  activeTaskIndex,
  completedTaskIds,
  currentState,
}: {
  phase: GraphPhase;
  plannedCount: number;
  activeTaskIndex: number;
  completedTaskIds: number[];
  currentState?: ProductTaskState;
}) {
  const visibleCount = phase === 'running' ? finalRun.tasks.length : plannedCount;
  const activeId = phase === 'running' ? activeTaskIndex + 1 : plannedCount;
  const visibleIds = new Set([0, ...finalRun.tasks.filter((task) => task.id <= visibleCount).map((task) => task.id)]);

  return (
    <div className="task-graph-viewport" aria-label={phase === 'planning' ? 'Task 구성 Graph' : 'Task 실행 Graph'}>
      <div className="task-graph-grid" />
      <div className="task-graph-world">
        <svg className="task-graph-edges" viewBox="0 0 1270 620" aria-hidden="true">
          {graphEdges.map(([sourceId, targetId]) => {
            const source = graphLayout.find((node) => node.id === sourceId)!;
            const target = graphLayout.find((node) => node.id === targetId)!;
            const visible = visibleIds.has(sourceId) && visibleIds.has(targetId);
            const active = targetId === activeId || completedTaskIds.includes(targetId);
            const sourceX = source.x + 140;
            const sourceY = source.y + 43;
            const targetX = target.x;
            const targetY = target.y + 43;
            const middleX = sourceX + (targetX - sourceX) * .52;
            return (
              <path
                key={`${sourceId}-${targetId}`}
                className={`${visible ? 'visible' : ''} ${active ? 'active' : ''}`}
                d={`M ${sourceX} ${sourceY} C ${middleX} ${sourceY}, ${middleX} ${targetY}, ${targetX} ${targetY}`}
              />
            );
          })}
        </svg>

        <div className="task-node node-trigger visible" style={{ left: graphLayout[0].x, top: graphLayout[0].y }}>
          <small>제품 입력</small><b>⌁</b><strong>OHAYO 명세</strong><span>제품 목표와 Context</span>
        </div>

        {finalRun.tasks.map((task, index) => {
          const position = graphLayout[index + 1];
          const visible = visibleIds.has(task.id);
          const active = visible && task.id === activeId;
          const done = completedTaskIds.includes(task.id);
          const state = active && phase === 'running' ? currentState : done ? 'done' : 'pending';
          return (
            <div
              key={task.id}
              className={`task-node ${nodeClass(task.owner)} ${visible ? 'visible' : ''} ${active ? 'active' : ''} ${done ? 'done' : ''} ${state ?? ''}`}
              style={{ left: position.x, top: position.y }}
            >
              <small>{task.owner}</small>
              <b>{nodeIcons[task.owner] ?? '◆'}</b>
              <strong><i>{String(task.id).padStart(2, '0')}</i>{task.title}</strong>
              <span>{active && phase === 'running' ? stateLabel(state ?? 'pending') : visible ? 'Task 구성 완료' : '구성 대기'}</span>
            </div>
          );
        })}

        <div className="graph-minimap" aria-hidden="true">
          {graphLayout.map((node) => <i key={node.id} className={visibleIds.has(node.id) ? 'visible' : ''} style={{ left: `${node.x / 12.7}%`, top: `${node.y / 6.2}%` }} />)}
        </div>
        <div className="graph-canvas-controls" aria-hidden="true"><span>＋</span><span>−</span><span>⌂</span></div>
      </div>
    </div>
  );
}

function TaskGraphScreen({
  phase,
  prompt,
  planningElapsed,
  plannedCount,
  currentTaskIndex,
  taskElapsed,
  completedTaskIds,
  currentTask,
  currentEvent,
  paused,
  speed,
  setViewMode,
}: {
  phase: GraphPhase;
  prompt: string;
  planningElapsed: number;
  plannedCount: number;
  currentTaskIndex: number;
  taskElapsed: number;
  completedTaskIds: number[];
  currentTask: ProductTask;
  currentEvent?: ProductTask['events'][number];
  paused: boolean;
  speed: number;
  setViewMode: (mode: ViewMode) => void;
}) {
  const planning = phase === 'planning';
  const displayTask = planning
    ? finalRun.tasks[Math.min(plannedCount, finalRun.tasks.length - 1)]
    : currentTask;
  const graphCount = planning ? plannedCount : completedTaskIds.length;
  const runElapsed = currentTaskIndex * finalRun.taskDuration + taskElapsed;
  const nextNodeIn = planning
    ? Math.max(0, finalRun.taskPlanningInterval - (planningElapsed % finalRun.taskPlanningInterval || (plannedCount === 10 ? finalRun.taskPlanningInterval : 0)))
    : 0;

  return (
    <main className="loom-graph-shell">
      <header className="run-topbar loom-graph-topbar">
        <div className="brand-lockup"><span className="brand-mark">F</span><div><strong>Auto Plan Loom</strong><span>{planning ? 'TASK GRAPH 구성 모드' : 'OHAYO 실행 모드'}</span></div></div>
        <div className="mode-transition"><span>LOOM</span><i>→</i><strong>{planning ? 'TASK 구성' : 'TASK 실행'}</strong></div>
        <div className={`run-status ${paused ? 'paused' : ''}`}><span />{paused ? '일시정지' : planning ? '구성 중' : '실행 중'}</div>
      </header>

      <section className="loom-graph-layout">
        <aside className="graph-inspector">
          <div className="graph-inspector-label">{planning ? '현재 구성 대상' : '현재 실행 대상'}</div>
          <div className="graph-task-number">{planning ? String(Math.min(plannedCount + 1, 10)).padStart(2, '0') : String(currentTask.id).padStart(2, '0')}</div>
          <span className="graph-owner">{displayTask.owner} ORCHESTRATOR</span>
          <h1>{displayTask.title}</h1>
          <p>{displayTask.goal}</p>

          <div className={`graph-state-card ${currentEvent?.state ?? ''}`}>
            <span>{paused ? '일시정지' : planning ? plannedCount === 10 ? '구성 완료' : 'Task 분해 중' : currentEvent?.label}</span>
            <p>{paused ? 'Presenter가 Timeline을 정지했습니다.' : planning ? '제품 목표를 실행 가능한 의존성 Graph로 변환하고 있습니다.' : currentEvent?.detail}</p>
          </div>

          <div className="graph-prompt-card"><span>입력된 제품 목표</span><p>{prompt}</p></div>

          <div className="graph-inspector-metrics">
            <div><span>{planning ? '구성된 Task' : '완료된 Task'}</span><strong>{String(graphCount).padStart(2, '0')} / 10</strong></div>
            <div><span>실행 속도</span><strong>{speed}×</strong></div>
            {planning
              ? <div><span>다음 Node</span><strong>{plannedCount === 10 ? 'READY' : formatClock(nextNodeIn)}</strong></div>
              : <div><span>현재 Task</span><strong>{formatClock(taskElapsed)} / 02:00</strong></div>}
          </div>
        </aside>

        <section className="graph-stage">
          <div className="graph-stage-heading">
            <div><span>{planning ? 'TASK DECOMPOSITION' : 'AUTONOMOUS EXECUTION'}</span><strong>{planning ? 'OHAYO Task Graph 구성' : 'OHAYO Task Graph 실행'}</strong></div>
            <div><span>{planning ? 'NODE' : 'TASK'}</span><strong>{String(planning ? plannedCount : currentTaskIndex + 1).padStart(2, '0')} / 10</strong></div>
          </div>
          <TaskGraphCanvas phase={phase} plannedCount={plannedCount} activeTaskIndex={currentTaskIndex} completedTaskIds={completedTaskIds} currentState={currentEvent?.state} />
        </section>
      </section>

      <footer className="run-footer loom-graph-footer">
        <span>CTRL + SHIFT + P · PRESENTER</span>
        <div>{planning ? '20초마다 Task Node 1개 구성' : 'Graph 경로를 따라 Task 순차 실행'}</div>
        {!planning && <button className="graph-cli-toggle" onClick={() => setViewMode('cli')}>CLI FALLBACK</button>}
        <strong>{planning ? `${formatClock(planningElapsed)} / 03:20` : `${formatClock(runElapsed)} / 20:00`}</strong>
      </footer>
      <div className="run-progress"><i style={{ width: `${planning ? Math.min(100, planningElapsed / planningDuration * 100) : Math.min(100, runElapsed / (finalRun.tasks.length * finalRun.taskDuration) * 100)}%` }} /></div>
    </main>
  );
}

export function FinalRunExperience({ onResetAll }: { onResetAll: () => void }) {
  const [screen, setScreen] = useState<FinalScreen>('prompt');
  const [prompt, setPrompt] = useState('');
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [planningElapsed, setPlanningElapsed] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [taskElapsed, setTaskElapsed] = useState(0);
  const [completionElapsed, setCompletionElapsed] = useState(0);
  const [completedTaskIds, setCompletedTaskIds] = useState<number[]>([]);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('web');
  const [hydrated, setHydrated] = useState(false);
  const lastTickAt = useRef(0);

  const plannedCount = Math.min(finalRun.tasks.length, Math.floor(planningElapsed / finalRun.taskPlanningInterval));
  const currentTask = finalRun.tasks[currentTaskIndex];
  const currentEvent = useMemo(() => {
    const events = currentTask?.events ?? [];
    return [...events].reverse().find((event) => event.at <= taskElapsed) ?? events[0];
  }, [currentTask, taskElapsed]);
  const totalElapsed = currentTaskIndex * finalRun.taskDuration + taskElapsed;
  const totalDuration = finalRun.tasks.length * finalRun.taskDuration;
  const totalProgress = screen === 'result' || screen === 'complete' ? 100 : Math.min(100, totalElapsed / totalDuration * 100);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      const querySpeed = Number(new URLSearchParams(window.location.search).get('speed'));
      if (Number.isFinite(querySpeed) && querySpeed >= 1 && querySpeed <= 60) setSpeed(querySpeed);
      const stored = window.localStorage.getItem(finalRunStorageKey);
      if (!stored) { setHydrated(true); return; }
      try {
        const state = JSON.parse(stored) as StoredFinalRunState;
        if (['prompt', 'planning', 'running', 'complete', 'result'].includes(state.screen)) setScreen(state.screen);
        if (typeof state.submittedPrompt === 'string') setSubmittedPrompt(state.submittedPrompt);
        if (typeof state.planningElapsed === 'number') setPlanningElapsed(Math.min(planningDuration, Math.max(0, state.planningElapsed)));
        if (typeof state.currentTaskIndex === 'number') setCurrentTaskIndex(Math.min(9, Math.max(0, state.currentTaskIndex)));
        if (typeof state.taskElapsed === 'number') setTaskElapsed(Math.min(finalRun.taskDuration, Math.max(0, state.taskElapsed)));
        if (Array.isArray(state.completedTaskIds)) setCompletedTaskIds(state.completedTaskIds);
        if (typeof state.paused === 'boolean') setPaused(state.paused);
        if (!(Number.isFinite(querySpeed) && querySpeed >= 1 && querySpeed <= 60) && typeof state.speed === 'number') setSpeed(state.speed);
        if (state.viewMode === 'cli' || state.viewMode === 'web') setViewMode(state.viewMode);
      } catch {
        window.localStorage.removeItem(finalRunStorageKey);
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const stored: StoredFinalRunState = { screen, submittedPrompt, planningElapsed, currentTaskIndex, taskElapsed, completedTaskIds, paused, speed, viewMode, updatedAt: Date.now() };
    window.localStorage.setItem(finalRunStorageKey, JSON.stringify(stored));
  }, [completedTaskIds, currentTaskIndex, hydrated, paused, planningElapsed, screen, speed, submittedPrompt, taskElapsed, viewMode]);

  const completeCurrentTask = useCallback(() => {
    const task = finalRun.tasks[currentTaskIndex];
    if (!task) return;
    setCompletedTaskIds((ids) => ids.includes(task.id) ? ids : [...ids, task.id]);
    if (currentTaskIndex >= finalRun.tasks.length - 1) {
      setTaskElapsed(finalRun.taskDuration);
      setPaused(false);
      setCompletionElapsed(0);
      setScreen('complete');
      return;
    }
    setCurrentTaskIndex((index) => index + 1);
    setTaskElapsed(0);
  }, [currentTaskIndex]);

  const resetRun = useCallback(() => {
    setScreen('prompt');
    setPrompt('');
    setSubmittedPrompt('');
    setPlanningElapsed(0);
    setCurrentTaskIndex(0);
    setTaskElapsed(0);
    setCompletionElapsed(0);
    setCompletedTaskIds([]);
    setPaused(false);
    setViewMode('web');
    window.localStorage.removeItem(finalRunStorageKey);
  }, []);

  const advancePlanning = useCallback(() => {
    setPlanningElapsed((value) => Math.min(planningDuration, value + finalRun.taskPlanningInterval));
  }, []);

  const executeCommand = useCallback((command: PresenterCommand) => {
    if (command.type === 'pause' && (screen === 'planning' || screen === 'running')) setPaused(true);
    if (command.type === 'resume') setPaused(false);
    if (command.type === 'next-event') {
      if (screen === 'planning') advancePlanning();
      if (screen === 'running') {
        const next = currentTask?.events.find((event) => event.at > taskElapsed + 100);
        setTaskElapsed(next ? next.at : finalRun.taskDuration);
        if (!next) completeCurrentTask();
      }
    }
    if (command.type === 'next-task' || command.type === 'complete-current') {
      if (screen === 'planning') advancePlanning();
      if (screen === 'running') completeCurrentTask();
    }
    if (command.type === 'reset-run') resetRun();
    if (command.type === 'reset-all') { resetRun(); onResetAll(); }
    if (command.type === 'show-result') {
      setPlanningElapsed(planningDuration);
      setCompletedTaskIds(finalRun.tasks.map((task) => task.id));
      setCurrentTaskIndex(finalRun.tasks.length - 1);
      setTaskElapsed(finalRun.taskDuration);
      setPaused(false);
      setScreen('result');
    }
    if (command.type === 'set-speed') setSpeed(Math.min(60, Math.max(1, command.value)));
  }, [advancePlanning, completeCurrentTask, currentTask?.events, onResetAll, resetRun, screen, taskElapsed]);

  useEffect(() => {
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(presenterChannelName) : null;
    if (channel) channel.onmessage = (event: MessageEvent<PresenterCommand>) => executeCommand(event.data);
    function onStorage(event: StorageEvent) {
      if (channel || event.key !== presenterCommandKey || !event.newValue) return;
      try { executeCommand((JSON.parse(event.newValue) as { command: PresenterCommand }).command); } catch { return; }
    }
    window.addEventListener('storage', onStorage);
    return () => { channel?.close(); window.removeEventListener('storage', onStorage); };
  }, [executeCommand]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        window.open('/presenter', 'flogi-presenter', 'width=520,height=820');
      }
      if (event.key.toLowerCase() === 'c' && screen === 'running') setViewMode((mode) => mode === 'web' ? 'cli' : 'web');
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [screen]);

  useEffect(() => {
    if (screen !== 'planning' || paused) return;
    lastTickAt.current = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTickAt.current) * speed;
      lastTickAt.current = now;
      setPlanningElapsed((value) => Math.min(planningDuration, value + delta));
    }, 120);
    return () => window.clearInterval(timer);
  }, [paused, screen, speed]);

  useEffect(() => {
    if (screen !== 'planning' || planningElapsed < planningDuration || paused) return;
    const transition = window.setTimeout(() => {
      setCurrentTaskIndex(0);
      setTaskElapsed(0);
      setScreen('running');
    }, Math.max(700, 1_800 / speed));
    return () => window.clearTimeout(transition);
  }, [paused, planningElapsed, screen, speed]);

  useEffect(() => {
    if (screen !== 'running' || paused) return;
    lastTickAt.current = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTickAt.current) * speed;
      lastTickAt.current = now;
      setTaskElapsed((value) => {
        const next = value + delta;
        if (next >= finalRun.taskDuration) {
          window.setTimeout(completeCurrentTask, 0);
          return finalRun.taskDuration;
        }
        return next;
      });
    }, 140);
    return () => window.clearInterval(timer);
  }, [completeCurrentTask, paused, screen, speed]);

  useEffect(() => {
    if (screen !== 'complete') return;
    lastTickAt.current = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTickAt.current) * speed;
      lastTickAt.current = now;
      setCompletionElapsed((value) => {
        const next = value + delta;
        if (next >= completionDuration) { setScreen('result'); return completionDuration; }
        return next;
      });
    }, 140);
    return () => window.clearInterval(timer);
  }, [screen, speed]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!prompt.trim()) return;
    setSubmittedPrompt(prompt.trim());
    setPrompt('');
    setPlanningElapsed(0);
    setCurrentTaskIndex(0);
    setTaskElapsed(0);
    setCompletedTaskIds([]);
    setPaused(false);
    setViewMode('web');
    setScreen('planning');
  }

  if (screen === 'prompt') {
    return (
      <main className="product-prompt-shell">
        <header className="run-topbar">
          <div className="brand-lockup"><span className="brand-mark">F</span><div><strong>Auto Plan Loom</strong><span>준비 완료 · v1.0</span></div></div>
          <div className="mode-transition"><span>HARNESS VIEWER</span><i>→</i><strong>LOOM 구성</strong></div>
          <div className="harness-ready-chip"><span /> HARNESS 준비됨</div>
        </header>
        <section className="product-prompt-content">
          <div className="product-prompt-heading">
            <span>새 제품 실행</span>
            <h1>Loom에 제품 목표를<br />전달하세요.</h1>
            <p>무엇을 입력해도 화면에는 그대로 보존됩니다. 실제 의미 분석 없이 준비된 10개 OHAYO Task Scenario가 동일하게 실행됩니다.</p>
          </div>
          <div className="product-prompt-terminal">
            <div className="terminal-bar"><div className="traffic"><i /><i /><i /></div><span>auto-plan-loom — product run</span><kbd>준비됨</kbd></div>
            <div className="product-ready-log">
              <p><span>✓</span> Planning Graph 로드 완료</p>
              <p><span>✓</span> Engineering Runtime 로드 완료</p>
              <p><span>✓</span> Validation & Recovery 로드 완료</p>
              <p><span>✓</span> Production Harness 로드 완료</p>
            </div>
            <form className="product-prompt-form" onSubmit={submit}>
              <label htmlFor="product-prompt">›</label>
              <textarea id="product-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} placeholder="OHAYO 구현과 배포를 요청하세요…" rows={4} autoFocus />
              <div className="product-prompt-actions">
                <button type="button" onClick={() => setPrompt(finalRun.canonicalPrompt)}>기본 프롬프트 불러오기</button>
                <button type="submit" disabled={!prompt.trim()}>TASK 구성 시작 <span>↑</span></button>
              </div>
            </form>
          </div>
        </section>
        <footer className="run-footer"><span>CTRL + SHIFT + P · PRESENTER</span><strong>입력 2 / 2</strong></footer>
      </main>
    );
  }

  if (screen === 'planning') {
    return <TaskGraphScreen phase="planning" prompt={submittedPrompt} planningElapsed={planningElapsed} plannedCount={plannedCount} currentTaskIndex={0} taskElapsed={0} completedTaskIds={[]} currentTask={currentTask} paused={paused} speed={speed} setViewMode={setViewMode} />;
  }

  if (screen === 'complete') {
    const visibleChecks = Math.min(finalRun.completionChecks.length, Math.floor(completionElapsed / (completionDuration / finalRun.completionChecks.length)) + 1);
    return (
      <main className="completion-shell"><div className="ready-grid" /><section className="completion-card">
        <div className="completion-ring"><span>10</span><small>/ 10</small></div><p>모든 제품 Task 완료</p><h1>Release 마무리 중</h1>
        <div className="completion-checks">{finalRun.completionChecks.map((check, index) => <div key={check} className={index < visibleChecks ? 'visible' : ''}><span>{index < visibleChecks ? '✓' : '·'}</span><p>{check}</p><strong>{index < visibleChecks ? '완료' : '대기'}</strong></div>)}</div>
      </section></main>
    );
  }

  if (screen === 'result') {
    return (
      <main className="result-shell"><div className="result-grid" />
        <header className="result-topbar"><div className="brand-lockup"><span className="brand-mark">F</span><div><strong>Auto Plan Loom</strong><span>실행 완료</span></div></div><span>10 / 10 TASKS</span></header>
        <section className="result-content"><div className="result-copy"><div className="result-kicker"><span /> 배포 상태 정상</div><p>제품 준비 완료</p><h1>OHAYO<br />READY</h1><a href={finalRun.finalUrl} target="_blank" rel="noreferrer">{finalRun.finalUrl}<span>↗</span></a><div className="result-checks">{finalRun.completionChecks.map((check) => <span key={check}>✓ {check}</span>)}</div></div>
          <div className="qr-card"><div className="qr-frame"><QRCodeSVG value={finalRun.finalUrl} size={240} bgColor="#f4f5ef" fgColor="#0a0b0d" level="H" /></div><strong>QR을 스캔해 OHAYO 열기</strong><p>Production 배포 · Health Check 통과</p></div>
        </section>
        <footer className="result-footer"><span>AUTONOMOUS PRODUCT ENGINEERING HARNESS</span><button onClick={resetRun}>새 실행</button></footer>
      </main>
    );
  }

  if (viewMode === 'cli') {
    return (
      <main className="run-shell cli-fallback-shell">
        <header className="run-topbar"><div className="brand-lockup"><span className="brand-mark">F</span><div><strong>OHAYO Build</strong><span>CLI FALLBACK</span></div></div><div className={`run-status ${paused ? 'paused' : ''}`}><span />{paused ? '일시정지' : '실행 중'}</div><button className="graph-cli-toggle" onClick={() => setViewMode('web')}>GRAPH 보기</button></header>
        <section className="fallback-terminal"><div className="terminal-bar"><div className="traffic"><i /><i /><i /></div><span>auto-plan-loom — run --fallback</span><kbd>C · GRAPH 보기</kbd></div><div className="fallback-body"><div className="fallback-prompt"><span>›</span><p>{submittedPrompt}</p></div>
          {finalRun.tasks.map((task, index) => { const done = completedTaskIds.includes(task.id); const active = index === currentTaskIndex && !done; const state = active ? currentEvent?.state ?? 'running' : done ? 'done' : 'pending'; return <div className={`fallback-task ${state}`} key={task.id}><span>[{String(task.id).padStart(2, '0')}/10]</span><strong>{task.title}</strong><i>{done ? '✓ 완료' : active ? `▶ ${stateLabel(state)}` : '⏳ 대기'}</i></div>; })}
          {currentTask && <div className="fallback-current"><span className={currentEvent?.state === 'failed' ? 'error' : ''}>• {currentEvent?.label}</span><p>{currentEvent?.detail}</p><small>{formatClock(taskElapsed)} / 02:00</small></div>}
        </div></section><div className="run-progress"><i style={{ width: `${totalProgress}%` }} /></div>
      </main>
    );
  }

  return <TaskGraphScreen phase="running" prompt={submittedPrompt} planningElapsed={planningElapsed} plannedCount={10} currentTaskIndex={currentTaskIndex} taskElapsed={taskElapsed} completedTaskIds={completedTaskIds} currentTask={currentTask} currentEvent={currentEvent} paused={paused} speed={speed} setViewMode={setViewMode} />;
}
