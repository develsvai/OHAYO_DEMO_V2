'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { finalRun, ProductTask, ProductTaskState } from '@/lib/scenario';
import { createTaskGraph, graphHeight, taskNodeWidth } from '@/lib/task-graph';
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
const planningDuration = finalRun.taskGraphDuration;
const taskCount = finalRun.tasks.length;
const { graphWidth, graphGroups, graphLayout, graphEdges, groupPosition, edgePath } = createTaskGraph(finalRun.tasks);

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
  const viewportRef = useRef<HTMLDivElement>(null);
  const [graphScale, setGraphScale] = useState(1);
  const visibleCount = plannedCount;
  const activeId = phase === 'running' ? activeTaskIndex + 1 : -1;
  const visibleIds = new Set([0, ...finalRun.tasks.filter((task) => task.id <= visibleCount).map((task) => task.id)]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const fitGraph = () => {
      const heightScale = (viewport.clientHeight - 28) / graphHeight;
      setGraphScale(Math.max(.75, Math.min(1, heightScale)));
    };
    fitGraph();
    const observer = new ResizeObserver(fitGraph);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const revealTask = useCallback((id: number) => {
    const viewport = viewportRef.current;
    const position = graphLayout[id];
    if (!viewport || !position) return;
    viewport.scrollTo({ left: Math.max(0, (position.x + taskNodeWidth / 2) * graphScale - viewport.clientWidth / 2), behavior: 'smooth' });
  }, [graphScale]);

  useEffect(() => {
    if (activeId > 0) revealTask(activeId);
  }, [activeId, revealTask]);

  return (
    <div className="task-graph-canvas">
      <div ref={viewportRef} className="task-graph-viewport" tabIndex={0} aria-label={phase === 'planning' ? 'Task 구성 Graph' : 'Task 실행 Graph'}>
        <div className="task-graph-fit" style={{ width: graphWidth * graphScale, height: graphHeight * graphScale }}>
          <div className="task-graph-world" style={{ width: graphWidth, height: graphHeight, transform: `scale(${graphScale})` }}>
            {graphGroups.map((group, index) => <div className="task-group-band" key={group} style={{ left: groupPosition(index) }}><span>{String(index + 1).padStart(2, '0')} / {group}</span></div>)}
            <svg className="task-graph-edges" viewBox={`0 0 ${graphWidth} ${graphHeight}`} aria-hidden="true">
              {graphEdges.map(([sourceId, targetId]) => {
                const visible = visibleIds.has(sourceId) && visibleIds.has(targetId);
                return <path key={`${sourceId}-${targetId}`} className={`${visible ? 'visible' : ''} ${targetId === activeId ? 'active' : ''}`} d={edgePath(sourceId, targetId)} />;
              })}
            </svg>
            <div className="task-node node-trigger visible" style={{ left: graphLayout[0].x, top: graphLayout[0].y }}>
              <small>제품 입력</small><b>⌁</b><strong>OHAYO 명세</strong><span>제품 목표와 Context</span>
            </div>
            {finalRun.tasks.map((task) => {
              const position = graphLayout[task.id];
              const visible = visibleIds.has(task.id);
              const active = visible && task.id === activeId;
              const done = completedTaskIds.includes(task.id);
              const state = active ? currentState : done ? 'done' : 'pending';
              return <div key={task.id} data-task-id={task.id} title={`${task.title} · ${task.goal}`} aria-label={`Task ${task.id}: ${task.title}`} aria-current={active ? 'step' : undefined}
                className={`task-node ${nodeClass(task.owner)} ${visible ? 'visible' : ''} ${active ? 'active' : ''} ${done ? 'done' : ''} ${state ?? ''}`}
                style={{ left: position.x, top: position.y }}>
                <small>{task.owner}</small><b>{nodeIcons[task.owner] ?? '◆'}</b>
                <strong><i>{String(task.id).padStart(2, '0')}</i>{task.title}</strong>
                <span>{active ? stateLabel(state ?? 'pending') : done ? '완료' : visible ? 'Task 구성 완료' : '구성 대기'}</span>
                {active && <i className="task-node-spinner" aria-label="실행 중" />}
              </div>;
            })}
          </div>
        </div>
      </div>
      <div className="graph-navigation">
        <span>가로 스크롤로 전체 Task 보기</span>
        <div>
          <button type="button" aria-label="이전 영역" onClick={() => viewportRef.current?.scrollBy({ left: -700, behavior: 'smooth' })}>←</button>
          <button type="button" onClick={() => revealTask(activeId > 0 ? activeId : plannedCount)}>현재 Task 보기</button>
          <button type="button" aria-label="다음 영역" onClick={() => viewportRef.current?.scrollBy({ left: 700, behavior: 'smooth' })}>→</button>
        </div>
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
  const planningComplete = plannedCount >= finalRun.tasks.length;
  const displayOwner = planning ? 'AUTO PLAN LOOM' : `${currentTask.owner} ORCHESTRATOR`;
  const displayTitle = planning ? 'OHAYO Task Graph' : currentTask.title;
  const displayGoal = planning
    ? plannedCount === 0
      ? '제품 목표를 분석하고 실행 Task를 선별하고 있습니다.'
      : `${plannedCount}개 Task와 실행 의존 관계를 생성하고 있습니다.`
    : currentTask.goal;
  const graphCount = planning ? plannedCount : completedTaskIds.length;
  const runElapsed = currentTaskIndex * finalRun.taskDuration + taskElapsed;

  return (
    <main className="loom-graph-shell">
      <header className="run-topbar loom-graph-topbar">
        <div className="brand-lockup"><span className="brand-mark">F</span><div><strong>Auto Plan Loom</strong><span>{planning ? 'TASK GRAPH 구성 모드' : 'OHAYO 실행 모드'}</span></div></div>
        <div className="mode-transition"><span>LOOM</span><i>→</i><strong>{planning ? 'TASK 구성' : 'TASK 실행'}</strong></div>
        <div className={`run-status ${paused ? 'paused' : ''}`}><span />{paused ? '일시정지' : planning ? planningComplete ? '구성 완료' : '구성 중' : '실행 중'}</div>
      </header>

      <section className="loom-graph-layout">
        <aside className="graph-inspector">
          <div className="graph-inspector-label">{planning ? 'TASK GRAPH 상태' : '현재 실행 대상'}</div>
          <div className="graph-task-number">{planning ? String(taskCount) : String(currentTask.id).padStart(2, '0')}</div>
          <span className="graph-owner">{displayOwner}</span>
          <h1>{displayTitle}</h1>
          <p>{displayGoal}</p>

          <div className={`graph-state-card ${currentEvent?.state ?? ''}`}>
            <span>{paused ? '일시정지' : planning ? planningComplete ? 'Task Graph 준비 완료' : 'Task 선별·생성 중' : currentEvent?.label}</span>
            <p>{paused ? 'Presenter가 Timeline을 정지했습니다.' : planning ? planningComplete ? '전체 Task와 의존 관계가 실행 가능한 Graph로 준비되었습니다.' : `${String(plannedCount).padStart(2, '0')} / ${taskCount} Task를 Graph에 연결했습니다.` : currentEvent?.detail}</p>
          </div>

          <div className="graph-prompt-card"><span>입력된 제품 목표</span><p>{prompt}</p></div>

          <div className="graph-inspector-metrics">
            <div><span>{planning ? '구성된 Task' : '완료된 Task'}</span><strong>{String(graphCount).padStart(2, '0')} / {taskCount}</strong></div>
            <div><span>실행 속도</span><strong>{speed}×</strong></div>
            {planning
              ? <div><span>Graph 상태</span><strong>READY</strong></div>
              : <div><span>현재 Task</span><strong>{formatClock(taskElapsed)} / {formatClock(finalRun.taskDuration)}</strong></div>}
          </div>
        </aside>

        <section className="graph-stage">
          <div className="graph-stage-heading">
            <div><span>{planning ? 'TASK DECOMPOSITION' : 'AUTONOMOUS EXECUTION'}</span><strong>{planning ? 'OHAYO Task Graph 구성' : 'OHAYO Task Graph 실행'}</strong></div>
            <div><span>{planning ? 'NODE' : 'TASK'}</span><strong>{String(planning ? plannedCount : currentTaskIndex + 1).padStart(2, '0')} / {taskCount}</strong></div>
          </div>
          <TaskGraphCanvas phase={phase} plannedCount={plannedCount} activeTaskIndex={currentTaskIndex} completedTaskIds={completedTaskIds} currentState={currentEvent?.state} />
        </section>
      </section>

      <footer className="run-footer loom-graph-footer">
        <span>CTRL + SHIFT + P · PRESENTER</span>
        <div>{planning ? planningComplete ? `${taskCount}개 Task와 의존 관계 구성 완료` : `${String(plannedCount).padStart(2, '0')} / ${taskCount} Task 선별·생성 중` : 'Graph 경로를 따라 Task 순차 실행'}</div>
        {!planning && <button className="graph-cli-toggle" onClick={() => setViewMode('cli')}>CLI FALLBACK</button>}
        <strong>{planning ? 'TASK GRAPH READY' : `${formatClock(runElapsed)} / ${formatClock(taskCount * finalRun.taskDuration)}`}</strong>
      </footer>
      <div className="run-progress"><i style={{ width: `${planning ? Math.min(100, planningElapsed / planningDuration * 100) : Math.min(100, runElapsed / (finalRun.tasks.length * finalRun.taskDuration) * 100)}%` }} /></div>
    </main>
  );
}

export function FinalRunExperience({ initialSpeed, onResetAll }: { initialSpeed: number; onResetAll: () => void }) {
  const [screen, setScreen] = useState<FinalScreen>('prompt');
  const [prompt, setPrompt] = useState('');
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [planningElapsed, setPlanningElapsed] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [taskElapsed, setTaskElapsed] = useState(0);
  const [completionElapsed, setCompletionElapsed] = useState(0);
  const [completedTaskIds, setCompletedTaskIds] = useState<number[]>([]);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const [viewMode, setViewMode] = useState<ViewMode>('web');
  const [hydrated, setHydrated] = useState(false);
  const lastTickAt = useRef(0);
  const fallbackRef = useRef<HTMLDivElement>(null);

  const nodeRevealDuration = planningDuration / finalRun.tasks.length;
  const plannedCount = Math.min(finalRun.tasks.length, Math.floor(planningElapsed / nodeRevealDuration));
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
        if (typeof state.currentTaskIndex === 'number') setCurrentTaskIndex(Math.min(taskCount - 1, Math.max(0, Math.floor(state.currentTaskIndex))));
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
  }, [initialSpeed]);

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
    window.localStorage.removeItem(presenterCommandKey);
  }, []);

  const advancePlanning = useCallback(() => {
    setPlanningElapsed(planningDuration);
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
    if (command.type === 'reset-all') onResetAll();
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

  useEffect(() => {
    if (viewMode === 'cli') fallbackRef.current?.querySelector('[aria-current="step"]')?.scrollIntoView({ block: 'nearest' });
  }, [currentTaskIndex, viewMode]);

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
          <div className="mode-transition"><span>HARNESS 준비 완료</span><i>→</i><strong>제품 목표 입력</strong></div>
          <div className="harness-ready-chip"><span /> HARNESS 준비됨</div>
        </header>
        <section className="product-prompt-content">
          <div className="product-prompt-heading">
            <span>새 제품 실행</span>
            <h1>Loom에 제품 목표를<br />전달하세요.</h1>
            <p>제품 명세와 Context를 바탕으로 실행 가능한 Task Graph를 구성하고, 각 목표를 검증하며 배포까지 진행합니다.</p>
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
        <footer className="run-footer"><span>CTRL + SHIFT + P · PRESENTER</span><strong>제품 실행 준비</strong></footer>
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
        <div className="completion-ring"><span>{taskCount}</span><small>/ {taskCount}</small></div><p>모든 제품 Task 완료</p><h1>Release 마무리 중</h1>
        <div className="completion-checks">{finalRun.completionChecks.map((check, index) => <div key={check} className={index < visibleChecks ? 'visible' : ''}><span>{index < visibleChecks ? '✓' : '·'}</span><p>{check}</p><strong>{index < visibleChecks ? '완료' : '대기'}</strong></div>)}</div>
      </section></main>
    );
  }

  if (screen === 'result') {
    return (
      <main className="result-shell"><div className="result-grid" />
        <header className="result-topbar"><div className="brand-lockup"><span className="brand-mark">F</span><div><strong>Auto Plan Loom</strong><span>실행 완료</span></div></div><span>{taskCount} / {taskCount} TASKS</span></header>
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
          <div className="fallback-task-list" ref={fallbackRef}>{finalRun.tasks.map((task, index) => { const done = completedTaskIds.includes(task.id); const active = index === currentTaskIndex && !done; const state = active ? currentEvent?.state ?? 'running' : done ? 'done' : 'pending'; return <div className={`fallback-task ${state}`} key={task.id} aria-current={active ? 'step' : undefined}><span>[{String(task.id).padStart(2, '0')}/{taskCount}]</span><strong>{task.title}</strong><i>{done ? '✓ 완료' : active ? `▶ ${stateLabel(state)}` : '⏳ 대기'}</i></div>; })}</div>
          {currentTask && <div className="fallback-current"><span className={currentEvent?.state === 'failed' ? 'error' : ''}>• {currentEvent?.label}</span><p>{currentEvent?.detail}</p><small>{formatClock(taskElapsed)} / {formatClock(finalRun.taskDuration)}</small></div>}
        </div></section><div className="run-progress"><i style={{ width: `${totalProgress}%` }} /></div>
      </main>
    );
  }

  return <TaskGraphScreen phase="running" prompt={submittedPrompt} planningElapsed={planningElapsed} plannedCount={taskCount} currentTaskIndex={currentTaskIndex} taskElapsed={taskElapsed} completedTaskIds={completedTaskIds} currentTask={currentTask} currentEvent={currentEvent} paused={paused} speed={speed} setViewMode={setViewMode} />;
}
