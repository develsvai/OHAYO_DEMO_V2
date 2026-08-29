'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { finalRun, ProductTaskState } from '@/lib/scenario';
import {
  finalRunStorageKey,
  PresenterCommand,
  presenterChannelName,
  presenterCommandKey,
  StoredFinalRunState,
} from '@/lib/run-control';

type FinalScreen = StoredFinalRunState['screen'];
type ViewMode = StoredFinalRunState['viewMode'];

const completionDuration = 8_000;

function formatClock(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stateLabel(state: ProductTaskState | 'pending') {
  const labels: Record<ProductTaskState | 'pending', string> = {
    pending: 'PENDING',
    running: 'RUNNING',
    context: 'CONTEXT',
    implementing: 'IMPLEMENTING',
    validating: 'VALIDATING',
    failed: 'FAILED',
    repairing: 'REPAIRING',
    retrying: 'RETRY',
    done: 'DONE',
  };
  return labels[state];
}

export function FinalRunExperience({ onResetAll }: { onResetAll: () => void }) {
  const [screen, setScreen] = useState<FinalScreen>('prompt');
  const [prompt, setPrompt] = useState('');
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [taskElapsed, setTaskElapsed] = useState(0);
  const [completionElapsed, setCompletionElapsed] = useState(0);
  const [completedTaskIds, setCompletedTaskIds] = useState<number[]>([]);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('web');
  const [hydrated, setHydrated] = useState(false);
  const lastTickAt = useRef(0);

  const currentTask = finalRun.tasks[currentTaskIndex];
  const currentEvent = useMemo(() => {
    const events = currentTask?.events ?? [];
    return [...events].reverse().find((event) => event.at <= taskElapsed) ?? events[0];
  }, [currentTask, taskElapsed]);

  const totalElapsed = currentTaskIndex * finalRun.taskDuration + taskElapsed;
  const totalDuration = finalRun.tasks.length * finalRun.taskDuration;
  const totalProgress = screen === 'result' || screen === 'complete' ? 100 : Math.min(100, (totalElapsed / totalDuration) * 100);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      const querySpeed = Number(new URLSearchParams(window.location.search).get('speed'));
      if (Number.isFinite(querySpeed) && querySpeed >= 1 && querySpeed <= 60) setSpeed(querySpeed);
      const stored = window.localStorage.getItem(finalRunStorageKey);
      if (!stored) {
        setHydrated(true);
        return;
      }
      try {
        const state = JSON.parse(stored) as StoredFinalRunState;
        if (['prompt', 'running', 'complete', 'result'].includes(state.screen)) setScreen(state.screen);
        if (typeof state.submittedPrompt === 'string') setSubmittedPrompt(state.submittedPrompt);
        if (typeof state.currentTaskIndex === 'number') setCurrentTaskIndex(Math.min(9, Math.max(0, state.currentTaskIndex)));
        if (typeof state.taskElapsed === 'number') setTaskElapsed(Math.min(finalRun.taskDuration, Math.max(0, state.taskElapsed)));
        if (Array.isArray(state.completedTaskIds)) setCompletedTaskIds(state.completedTaskIds);
        if (typeof state.paused === 'boolean') setPaused(state.paused);
        if (typeof state.speed === 'number') setSpeed(state.speed);
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
    const stored: StoredFinalRunState = {
      screen,
      submittedPrompt,
      currentTaskIndex,
      taskElapsed,
      completedTaskIds,
      paused,
      speed,
      viewMode,
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(finalRunStorageKey, JSON.stringify(stored));
  }, [completedTaskIds, currentTaskIndex, hydrated, paused, screen, speed, submittedPrompt, taskElapsed, viewMode]);

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
    setCurrentTaskIndex(0);
    setTaskElapsed(0);
    setCompletionElapsed(0);
    setCompletedTaskIds([]);
    setPaused(false);
    setViewMode('web');
    window.localStorage.removeItem(finalRunStorageKey);
  }, []);

  const executeCommand = useCallback((command: PresenterCommand) => {
    if (command.type === 'pause') setPaused(true);
    if (command.type === 'resume') setPaused(false);
    if (command.type === 'next-event') {
      const next = currentTask?.events.find((event) => event.at > taskElapsed + 100);
      setTaskElapsed(next ? next.at : finalRun.taskDuration);
      if (!next) completeCurrentTask();
    }
    if (command.type === 'next-task' || command.type === 'complete-current') completeCurrentTask();
    if (command.type === 'reset-run') resetRun();
    if (command.type === 'reset-all') {
      resetRun();
      onResetAll();
    }
    if (command.type === 'show-result') {
      setCompletedTaskIds(finalRun.tasks.map((task) => task.id));
      setCurrentTaskIndex(finalRun.tasks.length - 1);
      setTaskElapsed(finalRun.taskDuration);
      setPaused(false);
      setScreen('result');
    }
    if (command.type === 'set-speed') setSpeed(Math.min(60, Math.max(1, command.value)));
  }, [completeCurrentTask, currentTask?.events, onResetAll, resetRun, taskElapsed]);

  useEffect(() => {
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(presenterChannelName) : null;
    if (channel) channel.onmessage = (event: MessageEvent<PresenterCommand>) => executeCommand(event.data);
    function onStorage(event: StorageEvent) {
      if (channel) return;
      if (event.key !== presenterCommandKey || !event.newValue) return;
      try {
        const payload = JSON.parse(event.newValue) as { command: PresenterCommand };
        executeCommand(payload.command);
      } catch {
        return;
      }
    }
    window.addEventListener('storage', onStorage);
    return () => {
      channel?.close();
      window.removeEventListener('storage', onStorage);
    };
  }, [executeCommand]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        window.open('/presenter', 'flogi-presenter', 'width=520,height=820');
      }
      if (event.key.toLowerCase() === 'c' && screen === 'running') {
        setViewMode((mode) => mode === 'web' ? 'cli' : 'web');
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [screen]);

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
        if (next >= completionDuration) {
          setScreen('result');
          return completionDuration;
        }
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
    setCurrentTaskIndex(0);
    setTaskElapsed(0);
    setCompletedTaskIds([]);
    setPaused(false);
    setScreen('running');
  }

  if (screen === 'prompt') {
    return (
      <main className="product-prompt-shell">
        <header className="run-topbar">
          <div className="brand-lockup"><span className="brand-mark">F</span><div><strong>Auto Plan Loom</strong><span>READY · v1.0</span></div></div>
          <div className="mode-transition"><span>BUILD MODE</span><i>→</i><strong>RUN MODE</strong></div>
          <div className="harness-ready-chip"><span /> HARNESS READY</div>
        </header>
        <section className="product-prompt-content">
          <div className="product-prompt-heading">
            <span>NEW PRODUCT RUN</span>
            <h1>What should<br />the loom build?</h1>
            <p>제품 명세와 Context의 위치를 알려주세요. 실제 입력 문장은 화면에 보존되며, 실행은 준비된 10개 Task Scenario를 따릅니다.</p>
          </div>
          <div className="product-prompt-terminal">
            <div className="terminal-bar"><div className="traffic"><i /><i /><i /></div><span>auto-plan-loom — product run</span><kbd>READY</kbd></div>
            <div className="product-ready-log">
              <p><span>✓</span> Planning Graph loaded</p>
              <p><span>✓</span> Engineering Runtime loaded</p>
              <p><span>✓</span> Validation & Recovery loaded</p>
              <p><span>✓</span> Production Harness loaded</p>
            </div>
            <form className="product-prompt-form" onSubmit={submit}>
              <label htmlFor="product-prompt">›</label>
              <textarea id="product-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} placeholder="제품 구현과 배포를 요청하세요…" rows={4} autoFocus />
              <div className="product-prompt-actions">
                <button type="button" onClick={() => setPrompt(finalRun.canonicalPrompt)}>LOAD CANONICAL PROMPT</button>
                <button type="submit" disabled={!prompt.trim()}>RUN HARNESS <span>↑</span></button>
              </div>
            </form>
          </div>
        </section>
        <footer className="run-footer"><span>CTRL + SHIFT + P · PRESENTER CONTROL</span><strong>INPUT 2 / 2</strong></footer>
      </main>
    );
  }

  if (screen === 'complete') {
    const visibleChecks = Math.min(finalRun.completionChecks.length, Math.floor(completionElapsed / (completionDuration / finalRun.completionChecks.length)) + 1);
    return (
      <main className="completion-shell">
        <div className="ready-grid" />
        <section className="completion-card">
          <div className="completion-ring"><span>10</span><small>/ 10</small></div>
          <p>ALL PRODUCT TASKS COMPLETE</p>
          <h1>Finalizing release</h1>
          <div className="completion-checks">
            {finalRun.completionChecks.map((check, index) => <div key={check} className={index < visibleChecks ? 'visible' : ''}><span>{index < visibleChecks ? '✓' : '·'}</span><p>{check}</p><strong>{index < visibleChecks ? 'COMPLETE' : 'WAITING'}</strong></div>)}
          </div>
        </section>
      </main>
    );
  }

  if (screen === 'result') {
    return (
      <main className="result-shell">
        <div className="result-grid" />
        <header className="result-topbar"><div className="brand-lockup"><span className="brand-mark">F</span><div><strong>Auto Plan Loom</strong><span>RUN COMPLETE</span></div></div><span>10 / 10 TASKS</span></header>
        <section className="result-content">
          <div className="result-copy">
            <div className="result-kicker"><span /> DEPLOYMENT HEALTHY</div>
            <p>YOUR PRODUCT IS READY</p>
            <h1>OHAYO<br />READY</h1>
            <a href={finalRun.finalUrl} target="_blank" rel="noreferrer">{finalRun.finalUrl}<span>↗</span></a>
            <div className="result-checks">{finalRun.completionChecks.map((check) => <span key={check}>✓ {check}</span>)}</div>
          </div>
          <div className="qr-card">
            <div className="qr-frame"><QRCodeSVG value={finalRun.finalUrl} size={240} bgColor="#f4f5ef" fgColor="#0a0b0d" level="H" /></div>
            <strong>SCAN TO OPEN OHAYO</strong>
            <p>Production deployment · Health check passed</p>
          </div>
        </section>
        <footer className="result-footer"><span>AUTONOMOUS PRODUCT ENGINEERING HARNESS</span><button onClick={resetRun}>NEW RUN</button></footer>
      </main>
    );
  }

  const activity = [
    ...completedTaskIds.map((id) => ({ key: `done-${id}`, state: 'done' as const, text: `Task ${String(id).padStart(2, '0')} complete` })),
    ...(currentTask?.events.filter((event) => event.at <= taskElapsed).map((event) => ({ key: `${currentTask.id}-${event.at}`, state: event.state, text: event.detail })) ?? []),
  ].slice(-8);

  if (viewMode === 'cli') {
    return (
      <main className="run-shell cli-fallback-shell">
        <RunHeader currentTaskIndex={currentTaskIndex} paused={paused} viewMode={viewMode} setViewMode={setViewMode} />
        <section className="fallback-terminal">
          <div className="terminal-bar"><div className="traffic"><i /><i /><i /></div><span>auto-plan-loom — run --fallback</span><kbd>C · WEB VIEW</kbd></div>
          <div className="fallback-body">
            <div className="fallback-prompt"><span>›</span><p>{submittedPrompt}</p></div>
            {finalRun.tasks.map((task, index) => {
              const isDone = completedTaskIds.includes(task.id);
              const isCurrent = index === currentTaskIndex && !isDone;
              const state = isCurrent ? currentEvent?.state ?? 'running' : isDone ? 'done' : 'pending';
              return <div className={`fallback-task ${state}`} key={task.id}><span>[{String(task.id).padStart(2, '0')}/10]</span><strong>{task.title}</strong><i>{isDone ? '✓ DONE' : isCurrent ? `▶ ${stateLabel(state)}` : '⏳ WAITING'}</i></div>;
            })}
            {currentTask && <div className="fallback-current"><span className={currentEvent?.state === 'failed' ? 'error' : ''}>• {currentEvent?.label}</span><p>{currentEvent?.detail}</p><small>{formatClock(taskElapsed)} / 02:00</small></div>}
          </div>
        </section>
        <div className="run-progress"><i style={{ width: `${totalProgress}%` }} /></div>
      </main>
    );
  }

  return (
    <main className="run-shell">
      <RunHeader currentTaskIndex={currentTaskIndex} paused={paused} viewMode={viewMode} setViewMode={setViewMode} />
      <section className="run-dashboard">
        <aside className="task-list-panel">
          <div className="panel-heading"><span>EXECUTION PLAN</span><strong>{String(currentTaskIndex + 1).padStart(2, '0')} / 10</strong></div>
          <div className="task-list">
            {finalRun.tasks.map((task, index) => {
              const isDone = completedTaskIds.includes(task.id);
              const isCurrent = index === currentTaskIndex && !isDone;
              const state = isCurrent ? currentEvent?.state ?? 'running' : isDone ? 'done' : 'pending';
              return (
                <div className={`task-row ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''}`} key={task.id}>
                  <span>{String(task.id).padStart(2, '0')}</span>
                  <div><strong>{task.title}</strong><small>{task.owner}</small></div>
                  <i className={`task-state ${state}`}>{isDone ? '✓' : isCurrent ? '▶' : '·'}</i>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="active-task-panel">
          <div className="active-task-topline"><span>CURRENT GOAL</span><strong>{currentTask?.owner.toUpperCase()} ORCHESTRATOR</strong></div>
          <div className="task-number-watermark">{String(currentTask?.id ?? 0).padStart(2, '0')}</div>
          <h1>{currentTask?.title}</h1>
          <p>{currentTask?.goal}</p>
          <div className={`current-state-card ${currentEvent?.state ?? 'running'}`}>
            <div><span className="state-pulse" /><strong>{paused ? 'PAUSED' : currentEvent?.label}</strong></div>
            <p>{paused ? 'Presenter paused autonomous execution' : currentEvent?.detail}</p>
          </div>
          <div className="event-track">
            {currentTask?.events.map((event) => {
              const reached = event.at <= taskElapsed;
              const active = event.at === currentEvent?.at;
              return <div className={`${reached ? 'reached' : ''} ${active ? 'active' : ''}`} key={event.at}><i /><span>{event.label}</span></div>;
            })}
          </div>
          <div className="task-time">
            <div><span>ELAPSED</span><strong>{formatClock(taskElapsed)}</strong></div>
            <div><span>TASK TARGET</span><strong>02:00</strong></div>
            <div><span>TOTAL ELAPSED</span><strong>{formatClock(totalElapsed)}</strong></div>
          </div>
        </section>

        <aside className="activity-panel">
          <div className="panel-heading"><span>ACTIVITY</span><strong>LIVE</strong></div>
          <div className="activity-feed">
            {activity.map((item) => <div className={`activity-item ${item.state}`} key={item.key}><span>{item.state === 'done' ? '✓' : item.state === 'failed' ? '!' : '•'}</span><p>{item.text}</p></div>)}
          </div>
          <div className="run-metrics">
            <div><span>GOAL SATISFACTION</span><strong>{Math.min(99, Math.round(totalProgress))}%</strong></div>
            <div><span>RETRY LOOPS</span><strong>{currentEvent?.state === 'failed' || currentEvent?.state === 'repairing' || currentEvent?.state === 'retrying' ? '01' : completedTaskIds.includes(5) ? '01' : '00'}</strong></div>
            <div><span>RUNTIME SPEED</span><strong>{speed}×</strong></div>
          </div>
        </aside>
      </section>
      <footer className="run-footer"><span>CTRL + SHIFT + P · PRESENTER</span><div>{paused ? 'EXECUTION PAUSED' : 'AUTONOMOUS EXECUTION ACTIVE'}</div><strong>{formatClock(totalElapsed)} / 20:00</strong></footer>
      <div className="run-progress"><i style={{ width: `${totalProgress}%` }} /></div>
    </main>
  );
}

function RunHeader({ currentTaskIndex, paused, viewMode, setViewMode }: { currentTaskIndex: number; paused: boolean; viewMode: ViewMode; setViewMode: (mode: ViewMode) => void }) {
  return (
    <header className="run-topbar">
      <div className="brand-lockup"><span className="brand-mark">F</span><div><strong>OHAYO Build</strong><span>AUTO PLAN LOOM · RUN MODE</span></div></div>
      <div className={`run-status ${paused ? 'paused' : ''}`}><span />{paused ? 'PAUSED' : 'RUNNING'}</div>
      <div className="run-header-actions">
        <div className="view-toggle"><button className={viewMode === 'web' ? 'active' : ''} onClick={() => setViewMode('web')}>WEB</button><button className={viewMode === 'cli' ? 'active' : ''} onClick={() => setViewMode('cli')}>CLI</button></div>
        <div className="run-count"><strong>{String(currentTaskIndex + 1).padStart(2, '0')}</strong><span>/ 10</span></div>
      </div>
    </header>
  );
}
